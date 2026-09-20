import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  auditerServices,
  materialiserService,
  publierService,
  scellerService,
  verifierRecetteService,
} from '../../scripts/service-forge.mjs';
import { verifierPlafonds } from '../../scripts/lib/blog-pipeline.mjs';

const SLUG = 'tache-de-test';
const JOUR = '2026-09-20';
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const CORPS = `## La tâche dans les mots du cabinet

Chaque semaine, le cabinet rapproche un relevé fictif et nomme les écarts à examiner.

## La règle écrite

**La frontière.** La règle sépare la préparation, la validation et le jugement.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| le rapprochement proposé | l'écart typé | le jugement sur l'écart |

**La proposition.** Nous préparons une proposition ; le collaborateur saisit ou valide.

**L’arrêt.** Une ligne illisible fait refuser l'écriture et nomme le cas.

**Le jeu d’essai.** La règle est rejouée sur trois cas fictifs.

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| cas courant | rapprochement proposé | validation |
| cas limite | écart de 2,00 nommé | examen |
| ligne illisible | écriture refusée | humain |

Preuve locale : \`preuves/rejeu.json\`, rejouée le 2026-09-20.

## Ce que nous prenons en charge

Nous observons la tâche, écrivons sa règle, construisons l'automatisation dans les outils existants, la faisons recetter et la maintenons.

## Ce que le cabinet garde

Le cabinet garde la saisie, la validation et le jugement.

## Dans vos outils

Les formats et les accès sont vérifiés avant l'engagement.

## La preuve

Le rejeu fictif et [la méthode](/methode) rendent la frontière vérifiable.

## Le prix

Vous payez une tâche prise en charge, pas des sièges.

## Questions de décision

### Quel périmètre sera recetté ?

Le périmètre et ses refus sont écrits avant la construction.
`;

function recette() {
  return {
    version: 1,
    type: 'service',
    slug: SLUG,
    path: `/automatisation/${SLUG}`,
    title: 'Automatisation tâche de test : la règle reste au cabinet',
    tabTitle: 'Automatisation tâche de test | Memlia',
    ogTitle: 'Automatisation tâche de test : la règle reste au cabinet',
    description: 'Automatisation d’une tâche de test avec une règle écrite, un rejeu fictif et une validation qui reste au cabinet.',
    hero: 'Nous écrivons avec le cabinet la règle de cette tâche répétitive, puis nous la rejouons sur un jeu fictif. L’automatisation prépare une proposition et signale les cas hors règle ; le collaborateur garde la saisie, la validation et le jugement avant toute écriture dans ses outils.',
    primaryQuery: 'automatisation tâche de test',
    secondaryQueries: ['tâche de test automatique'],
    intent: 'evaluer-service',
    family: 'choisir-cadrer',
    verifiedAt: JOUR,
    author: 'kevin',
    cta: { label: 'Confier une première tâche', destination: '/contact' },
    schema: {
      headline: 'Automatisation tâche de test : la règle reste au cabinet',
      types: ['WebPage', 'Service', 'BreadcrumbList', 'Organization', 'WebSite'],
    },
    proof: { replayedAt: JOUR, evidencePath: 'preuves/rejeu.json' },
    incomingLinks: ['a', 'b', 'c'].map((id) => ({
      url: `/blog/source-${id}`,
      sourcePath: `src/content/blog/source-${id}.md`,
      anchor: `confier la tâche de test ${id}`,
    })),
  };
}

function racineDeTest() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-service-forge-'));
  mkdirSync(join(root, 'commercial/recettes', SLUG, 'preuves'), { recursive: true });
  mkdirSync(join(root, 'src/content/blog'), { recursive: true });
  mkdirSync(join(root, 'docs/strategy/site-v3/mesures'), { recursive: true });
  writeFileSync(join(root, 'commercial/recettes', SLUG, 'recette.json'), `${JSON.stringify(recette(), null, 2)}\n`);
  writeFileSync(join(root, 'commercial/recettes', SLUG, 'corps.md'), CORPS);
  writeFileSync(join(root, 'commercial/recettes', SLUG, 'preuves/rejeu.json'), `${JSON.stringify({
    version: 1,
    status: 'PASS',
    replayedAt: JOUR,
    fictitious: true,
    cases: [{ kind: 'courant' }, { kind: 'limite' }, { kind: 'refus' }],
  }, null, 2)}\n`);
  writeFileSync(join(root, 'commercial/recettes', SLUG, 'revues.json'), `${JSON.stringify({
    reviewer: 'marketing', reviewedAt: JOUR, status: 'PASS', observations: ['Le contenu rendu suit la recette service et la charte publique.'],
  }, null, 2)}\n`);
  for (const id of ['a', 'b', 'c']) {
    writeFileSync(join(root, 'src/content/blog', `source-${id}.md`), `---\ntitre: "Source ${id}"\nbrouillon: false\n---\n\nUn paragraphe contextuel permet de [confier la tâche de test ${id}](/automatisation/${SLUG}).\n`);
  }
  writeFileSync(join(root, 'src/content/blog/publie.md'), '---\ntitre: "Article publié"\nbrouillon: false\nprimaryQuery: "requête déjà prise"\n---\n\nOctets intacts.\n');
  writeFileSync(join(root, 'docs/strategy/site-v3/mesures/registre-requetes.json'), `${JSON.stringify({
    version: 1,
    marque: ['memlia'],
    articles: [{ slug: 'publie', type: 'blog', url: 'https://memlia.fr/blog/publie', requete: 'requête déjà prise', secondaires: [] }],
  }, null, 2)}\n`);
  writeFileSync(join(root, `docs/strategy/site-v3/mesures/questions-${JOUR}.json`), `${JSON.stringify({
    jour: JOUR,
    autocompletion: {
      'automatisation tâche de test': [],
      'tâche de test automatique': [],
      'requête déjà prise': [],
    },
  }, null, 2)}\n`);
  return root;
}

test('une fixture service passe préparer, sceller et auditer sans toucher au blog ni à sa cadence', () => {
  const root = racineDeTest();
  try {
    const blogPath = join(root, 'src/content/blog/publie.md');
    const blogAvant = sha256(readFileSync(blogPath));
    const prepare = materialiserService({ root, slug: SLUG, status: 'a-valider', today: JOUR });
    assert.deepEqual(prepare.errors, []);
    assert.equal(sha256(readFileSync(blogPath)), blogAvant, 'un article publié ne doit jamais être rematérialisé');

    const seal = scellerService({ root, slug: SLUG, today: JOUR });
    assert.equal(seal.pass, true, seal.errors.join('\n'));
    const audit = auditerServices({ root });
    assert.equal(audit.pass, true, audit.errors.join('\n'));
    assert.equal(audit.services, 1);

    const queue = [
      { date: '2026-09-15', status: 'publie' },
      { date: '2026-09-16', status: 'publie' },
      { date: '2026-09-17', status: 'publie' },
      { date: '2026-09-18', status: 'a-valider' },
    ];
    assert.throws(() => verifierPlafonds(queue, '2026-09-19'), /4 candidats/);
    const registry = JSON.parse(readFileSync(join(root, 'docs/strategy/site-v3/mesures/registre-requetes.json'), 'utf8'));
    assert.equal(registry.articles.length, 2);
    assert.equal(registry.articles.find((entry) => entry.slug === SLUG).type, 'service');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('préparer rend le candidat avant la revue, mais sceller exige la revue indépendante', () => {
  const root = racineDeTest();
  try {
    rmSync(join(root, 'commercial/recettes', SLUG, 'revues.json'));
    const prepare = materialiserService({ root, slug: SLUG, status: 'a-valider', today: JOUR });
    assert.deepEqual(prepare.errors, []);
    assert.equal(existsSync(join(root, 'src/content/services', `${SLUG}.md`)), true);
    const seal = scellerService({ root, slug: SLUG, today: JOUR });
    assert.equal(seal.pass, false);
    assert.ok(seal.errors.some((error) => /revue indépendante PASS/i.test(error)), seal.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('chaque porte service refuse son témoin négatif observable', () => {
  const root = racineDeTest();
  try {
    const valide = recette();
    const cas = [
      ['type', { ...valide, type: 'blog' }, /type.*service/i],
      ['route', { ...valide, path: '/services/test' }, /automatisation\/.*un seul niveau/i],
      ['quatre surfaces', { ...valide, ogTitle: 'Un autre titre' }, /H1.*og:title.*headline/i],
      ['réponse commerciale', { ...valide, hero: 'Trop court.' }, /réponse commerciale.*40 à 80 mots/i],
      ['sections', valide, /La règle écrite/],
      ['CTA', { ...valide, cta: { label: 'Réserver', destination: '/agenda' } }, /Confier une première tâche.*contact/i],
      ['schéma', { ...valide, schema: { ...valide.schema, types: [...valide.schema.types, 'SoftwareApplication'] } }, /schéma.*SoftwareApplication/i],
      ['schéma dupliqué', { ...valide, schema: { ...valide.schema, types: [...valide.schema.types.slice(0, 4), 'WebPage'] } }, /exactement.*WebPage.*Service/i],
      ['preuve', { ...valide, proof: { ...valide.proof, evidencePath: 'preuves/absente.json' } }, /preuve de rejeu.*absente/i],
      ['vocabulaire', valide, /vocabulaire public interdit.*logiciel/i],
      ['trois entrants', { ...valide, incomingLinks: valide.incomingLinks.slice(0, 2) }, /trois liens entrants/i],
      ['URL entrante inventée', { ...valide, incomingLinks: valide.incomingLinks.map((link, index) => index === 0 ? { ...link, url: '/blog/autre-url' } : link) }, /ne correspond pas à la route publique/i],
    ];
    for (const [nom, candidate, attendu] of cas) {
      let body = CORPS;
      if (nom === 'sections') body = body.replace('## La règle écrite', '## Une autre règle');
      if (nom === 'vocabulaire') body += '\n\nNotre logiciel décide.\n';
      const errors = verifierRecetteService({ root, recipe: candidate, body, review: { reviewer: 'marketing', reviewedAt: JOUR, status: 'PASS' }, today: JOUR });
      assert.ok(errors.some((error) => attendu.test(error)), `${nom}:\n${errors.join('\n')}`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la requête primaire est unique entre blog et service avant toute écriture', () => {
  const root = racineDeTest();
  try {
    const r = recette();
    r.primaryQuery = 'requête déjà prise';
    r.title = 'Requête déjà prise : la règle reste au cabinet';
    r.ogTitle = r.title;
    r.schema.headline = r.title;
    writeFileSync(join(root, 'commercial/recettes', SLUG, 'recette.json'), `${JSON.stringify(r, null, 2)}\n`);
    const result = materialiserService({ root, slug: SLUG, status: 'a-valider', today: JOUR });
    assert.ok(result.errors.some((error) => /requête primaire.*déjà.*\/blog\/publie/i.test(error)), result.errors.join('\n'));
    assert.equal(existsSync(join(root, 'src/content/services', `${SLUG}.md`)), false, 'une recette refusée ne doit rien matérialiser');
    assert.equal(existsSync(join(root, 'commercial/services', SLUG, 'manifest.json')), false, 'une recette refusée ne doit pas écrire de manifeste');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('un lien déclaré mais absent et une altération après scellement font rougir l’audit', () => {
  const root = racineDeTest();
  try {
    writeFileSync(join(root, 'src/content/blog/source-c.md'), '---\ntitre: "Source c"\nbrouillon: false\n---\n\nAucun lien ici.\n');
    let result = materialiserService({ root, slug: SLUG, status: 'a-valider', today: JOUR });
    assert.ok(result.errors.some((error) => /source-c.*lien contextuel/i.test(error)), result.errors.join('\n'));

    writeFileSync(join(root, 'src/content/blog/source-c.md'), `---\ntitre: "Source c"\nbrouillon: false\n---\n\n[confier la tâche de test c](/automatisation/${SLUG})\n`);
    assert.equal(scellerService({ root, slug: SLUG, today: JOUR }).pass, true);
    const pagePath = join(root, 'src/content/services', `${SLUG}.md`);
    writeFileSync(pagePath, `${readFileSync(pagePath, 'utf8')}\naltération`);
    result = auditerServices({ root });
    assert.equal(result.pass, false);
    assert.ok(result.errors.some((error) => /empreinte.*page/i.test(error)), result.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('publier écrit une preuve scellée et l’audit refuse sa modification', () => {
  const root = racineDeTest();
  try {
    assert.equal(scellerService({ root, slug: SLUG, today: JOUR }).pass, true);
    const publication = publierService({ root, slug: SLUG, today: JOUR });
    assert.equal(publication.pass, true, publication.errors.join('\n'));
    const receiptPath = join(root, 'commercial/services', SLUG, 'preuves/publication.json');
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
    assert.equal(receipt.status, 'publie');
    assert.equal(receipt.type, 'service');
    assert.equal(auditerServices({ root, today: JOUR }).pass, true);
    writeFileSync(receiptPath, `${readFileSync(receiptPath, 'utf8')} `);
    const audit = auditerServices({ root, today: JOUR });
    assert.equal(audit.pass, false);
    assert.ok(audit.errors.some((error) => /empreinte.*publication/i.test(error)), audit.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('l’audit échoue fermé quand le relevé d’intention a plus de huit jours', () => {
  const root = racineDeTest();
  try {
    assert.equal(scellerService({ root, slug: SLUG, today: JOUR }).pass, true);
    const audit = auditerServices({ root, today: '2026-09-29' });
    assert.equal(audit.pass, false);
    assert.ok(audit.errors.some((error) => /aucun relevé.*frais/i.test(error)), audit.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('l’audit refuse la suppression d’un fichier qui appartenait au sceau', () => {
  const root = racineDeTest();
  try {
    assert.equal(scellerService({ root, slug: SLUG, today: JOUR }).pass, true);
    assert.equal(publierService({ root, slug: SLUG, today: JOUR }).pass, true);
    rmSync(join(root, 'commercial/services', SLUG, 'preuves/publication.json'));
    const audit = auditerServices({ root, today: JOUR });
    assert.equal(audit.pass, false);
    assert.ok(audit.errors.some((error) => /fichier scellé absent.*publication/i.test(error)), audit.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});