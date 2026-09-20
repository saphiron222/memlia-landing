import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditerComposition, auditerContratPages, auditerNavigationMobile, auditerServicesPublics, contratsIntention, contratsRoute } from '../../scripts/verify-page-contract.mjs';

function html({ route, h1, media, href, ogTitle = h1, headline = h1, description, attribution = true, footerOutils = true, noindex = false, schema = true }) {
  const url = `https://memlia.fr${route}`;
  return `<!doctype html><html lang="fr"><head>
    <title>${h1} | Memlia</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
    <meta property="og:title" content="${ogTitle}">
    <link rel="canonical" href="${url}">
    ${schema ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', url, name: h1, headline, description,
        ...(attribution ? { author: { '@id': 'https://memlia.fr/a-propos#kevin-kitanga' }, datePublished: '2026-09-20', dateModified: '2026-09-20' } : {}) },
    ] })}</script>` : ''}
  </head><body><nav aria-label="Navigation principale"><a href="/contact">Contact</a></nav>
  <main id="main"><section><h1>${h1}</h1><img src="${media}" alt="Preuve propre à ${route}"><a href="${href}">Continuer</a></section></main>
  <footer>${footerOutils ? '<a href="/outils-comptables-gratuits">Outils comptables gratuits</a>' : ''}</footer></body></html>`;
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-page-contract-'));
  for (const path of ['src/pages', 'src/layouts', 'src/components/sections', 'src/styles', 'dist', 'public/proofs', 'docs/qa/site-v2']) {
    mkdirSync(join(root, path), { recursive: true });
  }
  writeFileSync(join(root, 'src/styles/tokens.css'), ':root { --surface-feuille: #fffefb; --r-carte: 16px; }');
  writeFileSync(join(root, 'src/components/sections/TestSection.astro'), '<section><slot /></section>');
  writeFileSync(join(root, 'src/components/Nav.astro'), '<nav data-mobile-visible></nav><style>.nav-principal { min-height: 44px; } .nav-mobile-visible a { min-height: 44px; }</style>');
  writeFileSync(join(root, 'src/pages/alpha.astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
  writeFileSync(join(root, 'src/pages/source.astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
  writeFileSync(join(root, 'public/proofs/alpha.webp'), 'alpha');
  writeFileSync(join(root, 'public/proofs/source.webp'), 'source');
  writeFileSync(join(root, 'docs/qa/site-v2/proofs-manifest.json'), JSON.stringify({
    entries: [
      { source: 'docs/design/test.html#alpha', target: 'public/proofs/alpha.webp' },
      { source: 'docs/design/test.html#source', target: 'public/proofs/source.webp' },
    ],
  }));
  const pages = {
    alpha: html({ route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/alpha.webp', href: '/source', description: 'Description alpha propre et suffisamment distincte pour le contrat universel.' }),
    source: html({ route: '/source', h1: 'Automatisation source en cabinet', media: '/proofs/source.webp', href: '/alpha', description: 'Description source propre et suffisamment distincte pour le contrat universel.' }),
  };
  writeFileSync(join(root, 'dist/alpha.html'), pages.alpha);
  writeFileSync(join(root, 'dist/source.html'), pages.source);
  return { root, pages };
}

const intentContracts = (alphaMinMedia = 1) => new Map([
  ['/alpha', { query: 'automatisation alpha', descriptionLead: 'Description alpha', minMedia: alphaMinMedia }],
  ['/source', { query: 'automatisation source', descriptionLead: 'Description source' }],
]);

function audit(root, copyVerifier = () => ({ pass: true, errors: [] })) {
  return auditerContratPages({
    root,
    copyVerifier,
    exemptions: [],
    intentRoutes: new Set(['/alpha', '/source']),
    intentContracts: intentContracts(),
  });
}

function afficherTemoin(resultat, clause) {
  const sortie = resultat.erreurs.filter((erreur) => erreur.clause === clause).map((erreur) => erreur.message).join('\n');
  console.log(`TÉMOIN ROUGE CLAUSE ${clause}\n${sortie}`);
  return sortie;
}

test('la surface publique attendue refuse exactement la dépublication silencieuse de l’incident', () => {
  const { root, pages } = fixture();
  try {
    mkdirSync(join(root, 'config'), { recursive: true });
    writeFileSync(join(root, 'config/service-publication-ledger.json'), `${JSON.stringify({
      version: 1,
      services: [{ slug: 'alpha', route: '/alpha', status: 'publie', publishedOn: '2026-09-20', testFixture: true }],
    }, null, 2)}\n`);
    const footer = '<a href="/alpha">Automatisation alpha</a><a href="/outils-comptables-gratuits">Outils comptables gratuits</a>';
    writeFileSync(join(root, 'dist/alpha.html'), pages.alpha.replace('<a href="/outils-comptables-gratuits">Outils comptables gratuits</a>', footer));
    writeFileSync(join(root, 'dist/source.html'), pages.source.replace('<a href="/outils-comptables-gratuits">Outils comptables gratuits</a>', footer));
    writeFileSync(join(root, 'dist/sitemap-0.xml'), '<urlset><url><loc>https://memlia.fr/alpha</loc></url></urlset>');

    assert.deepEqual(auditerServicesPublics({ root }).errors, []);

    writeFileSync(join(root, 'dist/alpha.html'), pages.alpha.replace('index, follow', 'noindex, follow'));
    writeFileSync(join(root, 'dist/source.html'), pages.source);
    writeFileSync(join(root, 'dist/sitemap-0.xml'), '<urlset></urlset>');

    const rouge = auditerServicesPublics({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.errors.join('\n'), /\/alpha.*noindex/i);
    assert.match(rouge.errors.join('\n'), /\/alpha.*footer/i);
    assert.match(rouge.errors.join('\n'), /\/alpha.*sitemap/i);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('les cinq clauses rougissent avec la page et la clause, puis la fixture restaurée repasse au vert', () => {
  const { root, pages } = fixture();
  try {
    assert.equal(audit(root).pass, true);

    writeFileSync(join(root, 'src/pages/alpha.astro'), '<main><h1>Page brute</h1></main>');
    let rouge = audit(root);
    assert.match(afficherTemoin(rouge, 1), /\/alpha : clause 1 \(DA\)/);
    writeFileSync(join(root, 'src/pages/alpha.astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");

    writeFileSync(join(root, 'dist/alpha.html'), html({ route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/source.webp', href: '/source', description: 'Description alpha propre et suffisamment distincte pour le contrat universel.' }));
    rouge = audit(root);
    assert.match(afficherTemoin(rouge, 2), /\/alpha : clause 2 \(IMAGES\)/);
    writeFileSync(join(root, 'dist/alpha.html'), pages.alpha);

    writeFileSync(join(root, 'dist/alpha.html'), html({ route: '/alpha', h1: 'Automatisation alpha en cabinet', ogTitle: 'Titre divergent', media: '/proofs/alpha.webp', href: '/source', description: 'Description alpha propre et suffisamment distincte pour le contrat universel.' }));
    rouge = audit(root);
    assert.match(afficherTemoin(rouge, 3), /\/alpha : clause 3 \(SEO\).*og:title/);
    writeFileSync(join(root, 'dist/alpha.html'), pages.alpha);

    rouge = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/source']),
      intentContracts: intentContracts(),
    });
    assert.match(afficherTemoin(rouge, 3), /\/alpha : clause 3 \(SEO\).*aucune requête mesurée/);

    rouge = audit(root, () => ({ pass: false, errors: [{ route: '/alpha', message: 'lexique public interdit' }] }));
    assert.match(afficherTemoin(rouge, 4), /\/alpha : clause 4 \(COPIE\).*lexique public interdit/);

    writeFileSync(join(root, 'dist/source.html'), html({ route: '/source', h1: 'Automatisation source en cabinet', media: '/proofs/source.webp', href: '/source', description: 'Description source propre et suffisamment distincte pour le contrat universel.' }));
    rouge = audit(root);
    assert.match(afficherTemoin(rouge, 5), /\/alpha : clause 5 \(LIENS\).*aucune page servie ne pointe vers elle/);
    writeFileSync(join(root, 'dist/source.html'), pages.source);

    const vert = audit(root);
    assert.deepEqual(vert.erreurs, []);
    assert.equal(vert.pass, true);
    assert.equal(vert.pages, 2);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('une page manuelle noindex échoue sans contrat explicite puis respecte son contrat transactionnel', () => {
  const { root } = fixture();
  try {
    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Message traité', media: '', href: '/source',
      description: 'État transactionnel explicite après le traitement du formulaire.',
      noindex: true, schema: false,
    }));

    const sansContrat = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/source']),
      intentContracts: intentContracts(),
      routeContracts: new Map(),
    });
    const temoin = sansContrat.erreurs.filter((erreur) => erreur.route === '/alpha').map((erreur) => erreur.message).join('\n');
    console.log(`TÉMOIN ROUGE PAGE MANUELLE SANS CONTRAT\n${temoin}`);
    assert.match(temoin, /clause 2 \(IMAGES\).*aucun média/);
    assert.match(temoin, /clause 3 \(SEO\).*aucune requête mesurée/);

    const routeContracts = new Map([['/alpha', {
      indexing: 'noindex', role: 'transactional', mediaRequired: false,
      measuredIntentRequired: false, schemaTypes: [], incomingLinkRequired: false,
    }]]);
    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Message traité', media: '', href: '/source',
      description: 'État transactionnel explicite après le traitement du formulaire.',
      noindex: false, schema: false,
    }));
    const indexableInterdit = auditerContratPages({
      root, copyVerifier: () => ({ pass: true, errors: [] }), exemptions: [],
      intentRoutes: new Set(['/source']), intentContracts: intentContracts(), routeContracts,
    });
    assert.match(indexableInterdit.erreurs.map((erreur) => erreur.message).join('\n'), /contrat de route exige noindex/);

    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Message traité', media: '', href: '/source',
      description: 'État transactionnel explicite après le traitement du formulaire.',
      noindex: true, schema: false,
    }));
    const avecContrat = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/source']),
      intentContracts: intentContracts(),
      routeContracts,
    });
    assert.deepEqual(avecContrat.erreurs.filter((erreur) => erreur.route === '/alpha'), []);
    assert.equal(avecContrat.pass, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('les six routes manuelles portent un contrat noindex explicite et aucune autre route', () => {
  const contrats = contratsRoute(process.cwd());
  assert.deepEqual([...contrats.keys()].sort(), [
    '/404',
    '/contact/erreur',
    '/contact/merci',
    '/mentions-legales',
    '/outils-comptables-gratuits/temoin-calcul-local',
    '/politique-de-confidentialite',
  ]);
  assert.equal(contrats.get('/404').role, 'technical');
  assert.equal(contrats.get('/contact/erreur').role, 'transactional');
  assert.equal(contrats.get('/contact/merci').role, 'transactional');
  assert.equal(contrats.get('/mentions-legales').role, 'legal');
  assert.equal(contrats.get('/politique-de-confidentialite').role, 'legal');
  assert.equal(contrats.get('/outils-comptables-gratuits/temoin-calcul-local').role, 'technical');
  for (const contrat of contrats.values()) assert.equal(contrat.indexing, 'noindex');
});

test('une exemption doit être exacte, datée et motivée', () => {
  const { root } = fixture();
  try {
    rmSync(join(root, 'public/proofs/alpha.webp'));
    const invalide = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [{ route: '/alpha', clauses: [2], date: 'demain', reason: 'court' }],
    });
    assert.equal(invalide.pass, false);
    assert.match(invalide.erreurs.map((e) => e.message).join('\n'), /exemption invalide/);

    const valide = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      intentRoutes: new Set(['/alpha', '/source']),
      intentContracts: intentContracts(),
      exemptions: [{
        route: '/alpha', clauses: [2], date: '2026-09-20',
        reason: 'Page textuelle explicitement bornée : aucun média fonctionnel n’est nécessaire à sa compréhension.',
      }],
    });
    assert.equal(valide.pass, true);
    assert.equal(valide.exemptionsAppliquees.length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la clause DA refuse une navigation mobile cachée ou des cibles sous 44 px', () => {
  const { root } = fixture();
  try {
    const nav = join(root, 'src/components/Nav.astro');
    writeFileSync(nav, '<nav></nav><style>.nav-principal { min-height: 32px; } .nav-mobile-visible a { min-height: 0; }</style>');
    const rouge = auditerNavigationMobile({ root });
    const sortie = rouge.errors.join('\n');
    console.log(`TÉMOIN ROUGE CLAUSE 1 MOBILE\n${sortie}`);
    assert.equal(rouge.pass, false);
    assert.match(sortie, /navigation mobile immédiatement visible absente/);
    assert.match(sortie, /32px.*44px requis/);
    assert.match(sortie, /0px.*44px requis/);

    writeFileSync(nav, '<nav data-mobile-visible></nav><style>.nav-principal { min-height: 44px; } .nav-mobile-visible a { min-height: 44px; }</style>');
    assert.deepEqual(auditerNavigationMobile({ root }), { pass: true, errors: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la clause SEO exige l’ouverture de description, l’auteur et les deux dates', () => {
  const { root } = fixture();
  try {
    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/alpha.webp', href: '/source',
      description: 'Une ouverture qui masque la requête primaire.', attribution: false,
    }));
    const sortie = afficherTemoin(audit(root), 3);
    assert.match(sortie, /description doit ouvrir sur "Description alpha"/);
    assert.match(sortie, /author absent/);
    assert.match(sortie, /datePublished absente/);
    assert.match(sortie, /dateModified absente/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la clause liens exige le hub outils dans le footer généré', () => {
  const { root } = fixture();
  try {
    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/alpha.webp', href: '/source',
      description: 'Description alpha propre et suffisamment distincte pour le contrat universel.', footerOutils: false,
    }));
    assert.match(afficherTemoin(audit(root), 5), /footer généré.*outils-comptables-gratuits/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la clause images applique le minimum propre déclaré par page', () => {
  const { root } = fixture();
  try {
    const rouge = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      intentRoutes: new Set(['/alpha', '/source']),
      intentContracts: intentContracts(2),
      exemptions: [],
    });
    const sortie = afficherTemoin(rouge, 2);
    assert.match(sortie, /\/alpha : clause 2 \(IMAGES\).*1 média\(s\) propre\(s\).*2 requis/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la clause DA suit le gabarit Outil et refuse une section avec trop de CSS local', () => {
  const { root } = fixture();
  try {
    const sourcePath = join(root, 'src/pages/alpha.astro');
    writeFileSync(sourcePath, "import Outil from '@/layouts/Outil.astro';\n<Outil />\n");
    writeFileSync(join(root, 'src/layouts/Outil.astro'), `---\nimport TestSection from '@/components/sections/TestSection.astro';\n---\n<TestSection />\n<style>\n${Array.from({ length: 11 }, (_, index) => `.a-${index} { padding: ${index}px; }`).join('\n')}\n</style>`);
    const rouge = auditerComposition({ root, sourcePath });
    console.log(`TÉMOIN ROUGE CLAUSE 1 GABARIT\n${rouge.errors.join('\n')}`);
    assert.equal(rouge.pass, false);
    assert.deepEqual(rouge.sections, ['TestSection']);
    assert.match(rouge.errors.join('\n'), /1 section\(s\).*3 requises/);
    assert.match(rouge.errors.join('\n'), /11 ligne\(s\) CSS locale\(s\).*10 tolérées/);

    for (const section of ['Preuves', 'Garanties']) {
      writeFileSync(join(root, `src/components/sections/${section}.astro`), '<section><slot /></section>');
    }
    writeFileSync(join(root, 'src/layouts/Outil.astro'), `---\nimport TestSection from '@/components/sections/TestSection.astro';\nimport Preuves from '@/components/sections/Preuves.astro';\nimport Garanties from '@/components/sections/Garanties.astro';\n---\n<TestSection /><Preuves /><Garanties />\n<style>.outil { display: grid; }</style>`);
    const vert = auditerComposition({ root, sourcePath });
    assert.equal(vert.pass, true);
    assert.deepEqual(vert.sections, ['Garanties', 'Preuves', 'TestSection']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('les articles délèguent leur intention au contrat blog au lieu de la recopier', () => {
  const { root } = fixture();
  try {
    mkdirSync(join(root, 'src/pages/blog'), { recursive: true });
    mkdirSync(join(root, 'dist/blog'), { recursive: true });
    writeFileSync(join(root, 'src/pages/blog/[slug].astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
    writeFileSync(join(root, 'dist/blog/article.html'), html({
      route: '/blog/article', h1: 'Article mesuré', media: '/proofs/alpha.webp', href: '/alpha',
      description: 'Requête article : une réponse directe et mesurée.',
    }));
    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/alpha.webp', href: '/blog/article',
      description: 'Description alpha propre et suffisamment distincte pour le contrat universel.',
    }));

    const resultat = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/alpha', '/source', '/blog/article']),
      intentContracts: intentContracts(),
    });
    const erreursArticle = resultat.erreurs.filter((erreur) => erreur.route === '/blog/article' && erreur.clause === 3);
    assert.doesNotMatch(erreursArticle.map((erreur) => erreur.message).join('\n'), /contrat de requête et d’ouverture de description absent/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('un article explicitement inscrit au contrat universel y verrouille aussi son amorce', () => {
  const { root } = fixture();
  try {
    mkdirSync(join(root, 'src/pages/blog'), { recursive: true });
    mkdirSync(join(root, 'dist/blog'), { recursive: true });
    writeFileSync(join(root, 'src/pages/blog/[slug].astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
    writeFileSync(join(root, 'dist/blog/article.html'), html({
      route: '/blog/article', h1: 'Article mesuré', media: '/proofs/alpha.webp', href: '/alpha',
      description: 'Une méthode qui masque la requête primaire.',
    }));
    writeFileSync(join(root, 'dist/alpha.html'), html({
      route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/alpha.webp', href: '/blog/article',
      description: 'Description alpha propre et suffisamment distincte pour le contrat universel.',
    }));

    const resultat = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/alpha', '/source', '/blog/article']),
      intentContracts: new Map([...intentContracts(), ['/blog/article', {
        query: 'requête article',
        descriptionLead: 'Requête article',
      }]]),
    });
    assert.match(
      resultat.erreurs.filter((erreur) => erreur.route === '/blog/article' && erreur.clause === 3).map((erreur) => erreur.message).join('\n'),
      /description doit ouvrir sur "Requête article"/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('les rubriques blog lisent leur intention canonique et leur vrai gabarit', () => {
  const contrats = contratsIntention(process.cwd());
  assert.deepEqual(contrats.get('/blog/rubrique/paie-dsn-cabinet-comptable'), {
    query: 'paie et dsn cabinet comptable',
    descriptionLead: 'Paie et DSN en cabinet comptable',
  });

  const { root } = fixture();
  try {
    mkdirSync(join(root, 'src/pages/blog/rubrique'), { recursive: true });
    mkdirSync(join(root, 'dist/blog/rubrique'), { recursive: true });
    writeFileSync(join(root, 'src/pages/blog/[slug].astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
    writeFileSync(join(root, 'src/pages/blog/rubrique/[slug].astro'), '<main><h1>Rubrique brute</h1></main>');
    writeFileSync(join(root, 'dist/blog/rubrique/test.html'), html({
      route: '/blog/rubrique/test', h1: 'Rubrique test', media: '/proofs/alpha.webp', href: '/alpha',
      description: 'Rubrique test : une collection mesurée.',
    }));
    const resultat = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/alpha', '/source', '/blog/rubrique/test']),
      intentContracts: new Map([...intentContracts(), ['/blog/rubrique/test', { query: 'rubrique test', descriptionLead: 'Rubrique test' }]]),
    });
    assert.match(
      resultat.erreurs.filter((erreur) => erreur.route === '/blog/rubrique/test' && erreur.clause === 1).map((erreur) => erreur.message).join('\n'),
      /aucune section ou aucun layout de composition approuvé/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
