import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test as nodeTest } from 'node:test';
import {
  BLOG_SKILLS,
  SEO_SKILLS,
  auditArticleInventory,
  createCandidate,
  semaineIso,
  validateDossier,
  validateCandidate,
  validateHeadings,
  validateSkillsManifest,
} from '../../scripts/lib/blog-pipeline.mjs';
import { candidateManifest, createCompleteDossier } from './blog-fixture.mjs';

// Même marge que blog-pipeline-hardening : le builder Cloudflare est bien plus lent que le poste local.
const test = (name, run) => nodeTest(name, { timeout: 120_000 }, run);
const isoDate = '2026-09-13';
const renderedBlogHtml = (slug) => `<li data-article="${slug}"><a href="/blog/${slug}">Article rendu</a></li>`;

function validCandidate() {
  return candidateManifest();
}

function validSkills() {
  const row = (skill) => ({
    skill,
    applicable: true,
    status: 'RUN',
    result: 'PASS',
    evidence: `preuves/skills/${skill}.md`,
    checkedAt: isoDate,
    justification: null,
  });
  return { version: 1, blog: BLOG_SKILLS.map(row), seo: SEO_SKILLS.map(row), contradictions: [] };
}

function dynamicBlogPage({ href = '${BLOG.chemin}/${article.id}', filter = 'isBlogEntryVisible', witness = '' } = {}) {
  return `---
import { getCollection } from 'astro:content';
import { BLOG } from '@/data/blog.mjs';
import { isBlogEntryVisible } from '@/data/blog-visibility.mjs';
const articles = await getCollection('blog', ${filter});
---
${witness}
<ul>{articles.map((article) => <li><a href={\`${href}\`}>{article.data.titre}</a></li>)}</ul>
`;
}

test('le contrat candidat accepte uniquement une fiche preview complète', () => {
  assert.deepEqual(validateCandidate(validCandidate()), []);

  const incomplete = validCandidate();
  incomplete.research.serp.status = 'ND';
  incomplete.kevin.briefApproved = false;
  const errors = validateCandidate(incomplete);
  assert.ok(errors.some((error) => error.includes('SERP')));
  assert.ok(errors.some((error) => error.includes('brief')));
});

test('le registre exige exactement 31 skills Blog et 24 SEO uniques', () => {
  assert.deepEqual(validateSkillsManifest(validSkills()), []);

  const missing = validSkills();
  missing.blog.pop();
  assert.ok(validateSkillsManifest(missing).some((error) => error.includes('31')));

  const duplicate = validSkills();
  duplicate.seo[1].skill = duplicate.seo[0].skill;
  assert.ok(validateSkillsManifest(duplicate).some((error) => error.includes('unique')));
});

test('le registre bloque RUN/FAIL, N/A applicable et contradiction non arbitrée', () => {
  const manifest = validSkills();
  manifest.blog[0].result = 'FAIL';
  manifest.blog[1] = {
    ...manifest.blog[1],
    applicable: true,
    status: 'N/A',
    result: null,
    evidence: null,
    justification: 'Pas requis.',
  };
  manifest.contradictions.push({ between: ['blog-seo-check', 'seo-page'], issue: 'Deux verdicts opposés.', arbitration: null });

  const errors = validateSkillsManifest(manifest);
  assert.ok(errors.some((error) => error.includes('FAIL')));
  assert.ok(errors.some((error) => error.includes('applicable')));
  assert.ok(errors.some((error) => error.includes('contradiction')));
});

test('le registre refuse une justification N/A qui renvoie seulement au manifeste amont', () => {
  const manifest = validSkills();
  manifest.blog[0] = {
    ...manifest.blog[0],
    applicable: false,
    status: 'N/A',
    result: null,
    evidence: null,
    checkedAt: null,
    justification: 'Le manifeste amont scellé conclut ce sous-skill non applicable à cette réécriture unitaire et documente sa raison propre.',
  };

  const errors = validateSkillsManifest(manifest);
  assert.ok(errors.some((error) => error.includes('justification factuelle propre à l’article')));
});

test('la hiérarchie Markdown interdit H1 dans le corps et les sauts de niveau', () => {
  assert.deepEqual(validateHeadings('## Première section\n\n### Détail\n\n## Suite'), []);
  const errors = validateHeadings('# H1 interdit\n\n## Section\n\n#### Saut');
  assert.ok(errors.some((error) => error.includes('H1')));
  assert.ok(errors.some((error) => error.includes('saut')));
});

test('un article historique n’est exempté que tant que son hash reste identique', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-inventory-'));
  try {
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    mkdirSync(join(root, 'editorial'), { recursive: true });
    const article = '---\ntitre: Test\nbrouillon: false\n---\n\n## Section\n';
    writeFileSync(join(root, 'src/content/blog/historique.md'), article);
    const sha256 = createHash('sha256').update(article).digest('hex');
    writeFileSync(join(root, 'editorial/legacy-baseline.json'), JSON.stringify({ version: 1, articles: { historique: sha256 } }));

    assert.deepEqual(auditArticleInventory({ root }).errors, []);
    writeFileSync(join(root, 'src/content/blog/historique.md'), `${article}\nTexte modifié.`);
    const audit = auditArticleInventory({ root });
    assert.ok(audit.errors.some((error) => error.includes('dossier éditorial')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('un dossier éditorial complet rend le baseline legacy inutile', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-no-legacy-'));
  try {
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    mkdirSync(join(root, 'editorial/articles/candidat'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog/candidat.md'), '---\ntitre: Test\nbrouillon: true\n---\n\n## Section\n');
    writeFileSync(join(root, 'editorial/articles/candidat/manifest.json'), '{}\n');
    writeFileSync(join(root, 'editorial/articles/candidat/skills.json'), '{}\n');

    const audit = auditArticleInventory({ root });
    assert.deepEqual(audit.errors, []);
    assert.deepEqual(audit.articles.map(({ slug, status }) => ({ slug, status })), [{ slug: 'candidat', status: 'pipeline' }]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la file refuse deux candidats le même jour sans écraser le premier', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-queue-'));
  try {
    mkdirSync(join(root, 'editorial/templates'), { recursive: true });
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    writeFileSync(join(root, 'editorial/templates/article.md'), '---\ntitre: "__TITLE__"\nbrouillon: true\nprimaryQuery: "__PRIMARY_QUERY__"\n---\n\n## Réponse directe\n');
    writeFileSync(join(root, 'editorial/templates/manifest.json'), JSON.stringify(validCandidate()));
    writeFileSync(join(root, 'editorial/templates/skills.json'), JSON.stringify(validSkills()));
    for (const filename of ['brief.md', 'claims.json', 'review.json', 'image.json']) {
      writeFileSync(join(root, 'editorial/templates', filename), filename.endsWith('.json') ? '{}\n' : '# Brief\n');
    }
    writeFileSync(join(root, 'editorial/templates/business-review-evidence.json'), '{"candidateSlug":"__SLUG__"}\n');
    writeFileSync(join(root, 'editorial/queue.json'), JSON.stringify({ version: 1, candidates: [] }));
    mkdirSync(join(root, 'docs/strategy/site-v3/mesures'), { recursive: true });
    writeFileSync(join(root, 'docs/strategy/site-v3/mesures/questions-2026-09-07.json'), JSON.stringify({
      jour: '2026-09-07',
      autocompletion: { 'candidat éditorial': [] },
    }));
    const intent = { primaryQuery: 'candidat éditorial', secondaryQueries: [] };

    assert.throws(
      () => createCandidate({ root, slug: 'candidat-narratif', title: "La plateforme que personne n'a achetée, et ce que le refus m'a appris", date: isoDate, ...intent }),
      /H1 narratif sans intention mesurée/,
    );

    const created = createCandidate({ root, slug: 'premier-candidat', title: 'Premier candidat éditorial', date: isoDate, ...intent });
    assert.equal(created.slug, 'premier-candidat');
    assert.equal(JSON.parse(readFileSync(join(created.dossier, 'preuves/business-review.json'), 'utf8')).candidateSlug, 'premier-candidat');
    assert.equal(JSON.parse(readFileSync(join(created.dossier, 'manifest.json'), 'utf8')).primaryQuery, 'candidat éditorial');
    assert.match(readFileSync(created.article, 'utf8'), /primaryQuery: "candidat éditorial"/);
    // Cadence du 16/09/2026 : deux candidats le même jour passent, le troisième est refusé.
    createCandidate({ root, slug: 'second-candidat', title: 'Second candidat éditorial', date: isoDate, ...intent });
    assert.throws(
      () => createCandidate({ root, slug: 'troisieme-candidat', title: 'Troisième candidat éditorial', date: isoDate, ...intent }),
      /2 candidats sont déjà planifiés le/
    );
    // Et quatre par semaine ISO : deux autres jours de la même semaine remplissent le plafond hebdomadaire.
    const jour = new Date(`${isoDate}T00:00:00Z`);
    const decale = (n) => { const d = new Date(jour); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const memeSemaine = [1, 2, 3, 4, 5, 6, -1, -2, -3, -4, -5, -6].map(decale).filter((date) => semaineIso(date) === semaineIso(isoDate));
    assert.ok(memeSemaine.length >= 2, 'la semaine ISO doit offrir deux autres jours');
    createCandidate({ root, slug: 'quatrieme-candidat', title: 'Quatrième candidat éditorial', date: memeSemaine[0], ...intent });
    createCandidate({ root, slug: 'cinquieme-candidat', title: 'Cinquième candidat éditorial', date: memeSemaine[0], ...intent });
    assert.throws(
      () => createCandidate({ root, slug: 'sixieme-candidat', title: 'Sixième candidat éditorial', date: memeSemaine[1], ...intent }),
      /4 candidats sont déjà planifiés la semaine/
    );
    const queue = JSON.parse(readFileSync(join(root, 'editorial/queue.json'), 'utf8'));
    assert.equal(queue.candidates.length, 4);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate dossier refuse une preuve absente et un lien obligatoire absent du Markdown', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-dossier-'));
  try {
    const slug = 'article-de-test';
    const dossier = join(root, 'editorial/articles', slug);
    mkdirSync(dossier, { recursive: true });
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog', `${slug}.md`), '---\ntitre: Test\nbrouillon: true\n---\n\n## Une section\n\nAucun lien.');
    writeFileSync(join(dossier, 'manifest.json'), JSON.stringify(validCandidate()));
    writeFileSync(join(dossier, 'skills.json'), JSON.stringify(validSkills()));

    const result = await validateDossier({ root, slug });
    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes('preuve')));
    assert.ok(result.errors.some((error) => error.includes('lien obligatoire')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate dossier accepte un candidat dont preuves, revue, images et maillage sont vérifiables', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-complete-'));
  try {
    const fixture = await createCompleteDossier(root);
    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: renderedBlogHtml(fixture.slug) });
    assert.deepEqual(result.errors, []);
    assert.equal(result.pass, true);
    unlinkSync(join(root, 'public/images/img-article-de-test-og.webp'));
    const missingPublicOg = await validateDossier({ root, slug: fixture.slug });
    assert.ok(missingPublicOg.errors.some((error) => error.includes('OG public')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate dossier refuse aussi un H1 narratif écrit après la création', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-intent-gate-'));
  try {
    const fixture = await createCompleteDossier(root, {
      manifestMutator: (manifest) => {
        manifest.title = "La plateforme que personne n'a achetée, et ce que le refus m'a appris";
      },
    });
    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: renderedBlogHtml(fixture.slug) });
    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => /Intention SEO.*H1 narratif sans intention mesurée/.test(error)), result.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la preview protégée accepte GSC ND et revue métier PENDING sans ouvrir la production', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-protected-preview-'));
  try {
    const fixture = await createCompleteDossier(root, {
      manifestMutator: (manifest) => {
        manifest.research.gsc.status = 'ND';
        manifest.businessReview.status = 'PENDING';
        manifest.businessReview.reviewerId = null;
        manifest.businessReview.evidence = 'preuves/business-review-deferral.json';
      },
    });
    const gscPath = join(fixture.dossier, fixture.manifest.research.gsc.evidence);
    const gsc = JSON.parse(readFileSync(gscPath, 'utf8'));
    writeFileSync(gscPath, `${JSON.stringify({ ...gsc, availability: 'permission-denied', metricsCredited: false, previewAuthorizedBy: 'kevin' }, null, 2)}\n`);
    const deferralPath = join(fixture.dossier, fixture.manifest.businessReview.evidence);
    const deferral = JSON.parse(readFileSync(join(fixture.dossier, 'preuves/business-review.json'), 'utf8'));
    writeFileSync(deferralPath, `${JSON.stringify({
      ...deferral,
      kind: 'business-review-deferral',
      approvedBy: 'kevin',
      decision: 'defer-until-publication',
      publicationBlocked: true,
    }, null, 2)}\n`);

    const preview = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: renderedBlogHtml(fixture.slug), gateMode: 'protected-preview' });
    assert.deepEqual(preview.errors, []);
    const production = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: renderedBlogHtml(fixture.slug), gateMode: 'production' });
    assert.equal(production.pass, false);
    assert.ok(production.errors.some((error) => error.includes('GSC')));
    assert.ok(production.errors.some((error) => /businessReview|revue métier/i.test(error)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('une matière sensible exige des claims sur les unités sensibles, pas sur chaque titre neutre', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-sensitive-units-'));
  try {
    const fixture = await createCompleteDossier(root);
    const claimsPath = join(fixture.dossier, 'claims.json');
    const claims = JSON.parse(readFileSync(claimsPath, 'utf8'));
    const neutralUnit = claims.contentUnits.find((unit) => unit.text === 'Réponse directe');
    const removed = new Set(neutralUnit.claimIds);
    neutralUnit.claimIds = [];
    claims.claims = claims.claims.filter((claim) => !removed.has(claim.id));
    writeFileSync(claimsPath, `${JSON.stringify(claims, null, 2)}\n`);
    const businessPath = join(fixture.dossier, fixture.manifest.businessReview.evidence);
    const business = JSON.parse(readFileSync(businessPath, 'utf8'));
    business.claimReviews = business.claimReviews.filter((review) => !removed.has(review.claimId));
    writeFileSync(businessPath, `${JSON.stringify(business, null, 2)}\n`);

    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: renderedBlogHtml(fixture.slug) });
    assert.deepEqual(result.errors, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate accepte le lien entrant réellement généré par la collection de /blog sans URL littérale', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-dynamic-incoming-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), readFileSync(new URL('../../src/pages/blog.astro', import.meta.url)));

    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: renderedBlogHtml(fixture.slug) });

    assert.deepEqual(result.errors, []);
    assert.equal(result.pass, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse un lien dynamique absent du HTML réellement rendu de /blog', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-rendered-incoming-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), readFileSync(new URL('../../src/pages/blog.astro', import.meta.url)));

    const result = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: `<li data-article="${fixture.slug}"><span>Carte sans lien</span></li><a data-placeholder href="/blog/${fixture.slug}">Témoin séparé</a>`,
    });

    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse un lien entrant présent seulement dans un commentaire HTML de la carte', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-commented-incoming-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), readFileSync(new URL('../../src/pages/blog.astro', import.meta.url)));

    const result = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: `<li data-article="${fixture.slug}"><!-- <a href="/blog/${fixture.slug}">Jamais rendu</a> --><span>Carte</span></li>`,
    });

    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse un attribut href porté par un élément qui n’est pas un lien', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-non-anchor-incoming-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), readFileSync(new URL('../../src/pages/blog.astro', import.meta.url)));

    const result = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: `<li data-article="${fixture.slug}"><span href="/blog/${fixture.slug}">Pas un lien</span></li>`,
    });

    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse une ancre placeholder dans la carte même si son href est exact', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-placeholder-incoming-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), readFileSync(new URL('../../src/pages/blog.astro', import.meta.url)));

    const placeholder = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: `<li data-article="${fixture.slug}"><a data-placeholder="__SLUG__" href="/blog/${fixture.slug}">Témoin artificiel</a></li>`,
    });
    const realLink = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: renderedBlogHtml(fixture.slug),
    });

    assert.equal(placeholder.pass, false);
    assert.ok(placeholder.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
    assert.deepEqual(realLink.errors, []);
    assert.equal(realLink.pass, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse /blog quand la collection ne rend pas le lien du candidat', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-dynamic-missing-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), dynamicBlogPage({ href: '/ressources/${article.id}' }));

    const result = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: `<li data-article="${fixture.slug}"><a href="/ressources/${fixture.slug}">Mauvaise route</a></li>`,
    });

    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse une boucle de lien placée dans une branche morte de /blog', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-dynamic-dead-branch-'));
  try {
    const fixture = await createCompleteDossier(root);
    const actualBlogPage = readFileSync(new URL('../../src/pages/blog.astro', import.meta.url), 'utf8');
    const deadBranch = actualBlogPage.replace(
      '{suite.map(',
      '{false && suite.map('
    );
    assert.notEqual(deadBranch, actualBlogPage, 'la fixture doit placer la boucle réelle dans une branche morte');
    writeFileSync(join(root, 'src/pages/blog.astro'), deadBranch);

    const result = await validateDossier({ root, slug: fixture.slug, renderedBlogHtml: '<ul></ul>' });

    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le gate refuse une URL témoin et un filtre qui masque le brouillon de preview', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-dynamic-draft-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), dynamicBlogPage({
      filter: '({ data }) => !data.brouillon',
      witness: '<a data-placeholder="__SLUG__" href="/blog/article-de-test">Témoin artificiel</a>',
    }));

    const result = await validateDossier({
      root,
      slug: fixture.slug,
      renderedBlogHtml: `<a data-placeholder="__SLUG__" href="/blog/${fixture.slug}">Témoin artificiel</a>`,
    });

    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => error.includes(`Le lien entrant depuis /blog vers /blog/${fixture.slug} est absent.`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le maillage dynamique ne relâche ni le lien sortant ni la baseline historique', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-dynamic-contracts-'));
  try {
    const fixture = await createCompleteDossier(root);
    writeFileSync(join(root, 'src/pages/blog.astro'), dynamicBlogPage());
    writeFileSync(fixture.articlePath, fixture.markdown.replace('Voir [la méthode](/#methode) et ', 'Voir '));
    writeFileSync(
      join(root, 'src/content/blog/controler-les-bulletins-de-paie-avant-la-dsn.md'),
      '---\ntitre: "Historique modifié"\nbrouillon: false\n---\n\n## Modification\n'
    );

    const gate = await validateDossier({ root, slug: fixture.slug });
    const inventory = auditArticleInventory({ root });

    assert.ok(gate.errors.some((error) => error.includes('Le lien obligatoire /#methode est absent du Markdown.')));
    assert.ok(inventory.errors.some((error) => error.includes('dossier éditorial')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
