import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrerLiensEntrantsService } from '../../scripts/lib/service-incoming-migrations.mjs';
import { verifierLiensEntrantsService } from '../../scripts/service-forge.mjs';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const LEDGER = 'config/service-publication-ledger.json';
const RECIPE = 'commercial/recettes/facture-electronique/recette.json';
const SEAL = 'commercial/services/facture-electronique/preuves/scellement.json';
const ROUTE = 'src/pages/agents-ia/[metier].astro';
const RENDERER = 'src/layouts/Agent.astro';
const DATA = 'src/data/specialistes/comptabilite.ts';
const REGISTRY = 'src/data/specialistes.ts';
const SERVICE = 'src/content/services/facture-electronique.md';
const read = (root, path) => readFileSync(join(root, path), 'utf8');
const json = (root, path) => JSON.parse(read(root, path));
const writeJson = (root, path, data) => writeFileSync(join(root, path), JSON.stringify(data, null, 2) + '\n');
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-service-links-'));
  for (const path of [LEDGER, RECIPE, SEAL, ROUTE, RENDERER, DATA, REGISTRY, SERVICE,
    'src/pages/automatisation-cabinet-comptable.astro', 'src/pages/garanties.astro', 'src/pages/methode.astro']) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(REPO, path), join(root, path));
  }
  // Scénario historique isolé : les données publiques actuelles ont retiré ces services.
  // Réactiver seulement ce témoin dans le dossier éphémère garde tous les mutants du garde
  // de migration exécutables, sans changer une recette, un sceau ou une route du vrai dépôt.
  replace(root, DATA, 'servicesLies: []',
    "servicesLies: ['saisie-comptable', 'factures-fournisseurs', 'rapprochement-bancaire', 'notes-de-frais', 'facture-electronique']");
  replace(root, SERVICE, 'status: a-valider', 'status: publie');
  const recipe = json(root, RECIPE);
  for (const link of recipe.incomingLinks.filter(item => item.url !== '/methode')) {
    writeFileSync(join(root, link.sourcePath),
      `<main><a href="${recipe.path}">${link.anchor}</a></main>\n`);
  }
  return root;
}

function replace(root, path, before, after) {
  const source = read(root, path);
  assert.ok(source.includes(before), `témoin non appliqué : ${path} / ${before}`);
  writeFileSync(join(root, path), source.replace(before, after));
}

function ledger(root, edit) { const value = json(root, LEDGER); edit(value.incomingLinkMigrations); writeJson(root, LEDGER, value); }
function errors(root, recipe = json(root, RECIPE)) { const result = []; verifierLiensEntrantsService(root, recipe, result); return result; }

test('le lien historique scellé migre vers une tâche réelle de la fiche publiée, trois sources effectives', () => {
  const root = fixture();
  try {
    const recipeBefore = read(root, RECIPE), sealBefore = read(root, SEAL);
    const result = [];
    const { links, migrated } = migrerLiensEntrantsService(root, json(root, RECIPE), result);
    assert.deepEqual(result, []);
    assert.equal(migrated.size, 1);
    assert.deepEqual(links.map((link) => link.url), ['/automatisation-cabinet-comptable', '/agents-ia/comptabilite', '/garanties']);
    assert.equal(new Set(links.map((link) => link.sourcePath)).size, 3);
    assert.deepEqual(errors(root), []);
    assert.equal(read(root, RECIPE), recipeBefore, 'aucune réécriture du contrat historique');
    assert.equal(read(root, SEAL), sealBefore, 'aucune réécriture du sceau');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

const mutants = [
  ['déclaration absente', (r) => ledger(r, (m) => m.splice(0)), /aucun lien contextuel/u],
  ['ancien triplet différent', (r) => ledger(r, (m) => { m[0].from.anchor = 'Autre ancre'; }), /ancien lien exact absent/u],
  ['migration doublée', (r) => ledger(r, (m) => m.push(structuredClone(m[0]))), /ancien lien exact absent|en double/u],
  ['date absente', (r) => ledger(r, (m) => { delete m[0].date; }), /datée et motivée/u],
  ['date future', (r) => ledger(r, (m) => { m[0].date = '2099-01-01'; }), /datée et motivée/u],
  ['motif absent', (r) => ledger(r, (m) => { m[0].reason = ''; }), /datée et motivée/u],
  ['empreinte différente', (r) => ledger(r, (m) => { m[0].recipeSha256 = '0'.repeat(64); }), /empreinte/u],
  ['sceau modifié', (r) => { const s = json(r, SEAL); s.files.recipe.sha256 = '0'.repeat(64); writeJson(r, SEAL, s); }, /empreinte/u],
  ['octets de recette modifiés', (r) => writeFileSync(join(r, RECIPE), read(r, RECIPE) + '\n'), /empreinte/u],
  ['type de pont global', (r) => ledger(r, (m) => { m[0].to.kind = 'global-link'; }), /type ou identifiant/u],
  ['chemin hors source dynamique', (r) => ledger(r, (m) => { m[0].to.sourcePath = RENDERER; }), /route de fiche incohérente/u],
  ['URL de fiche incohérente', (r) => ledger(r, (m) => { m[0].to.url = '/agents-ia/finance'; }), /route de fiche incohérente/u],
  ['autre famille', (r) => ledger(r, (m) => { m[0].to.family = 'tva'; }), /famille ou contexte/u],
  ['autre contexte', (r) => ledger(r, (m) => { m[0].to.context = 'Un geste absent'; }), /tâche contextuelle absente/u],
  ['agent non publié', (r) => replace(r, DATA, 'publie: true', 'publie: false'), /non publié/u],
  ['famille retirée de l’agent', (r) => replace(r, DATA, "'saisie-ocr', 'facture-electronique'", "'saisie-ocr'"), /famille non porté/u],
  ['service retiré de l’agent', (r) => replace(r, DATA, "'notes-de-frais', 'facture-electronique'", "'notes-de-frais'"), /service ou famille/u],
  ['tâche retirée de la fiche', (r) => replace(r, DATA, "geste: 'Reprendre les factures électroniques reçues'", "geste: 'Autre geste'"), /tâche contextuelle absente/u],
  ['service non publié', (r) => replace(r, SERVICE, 'status: publie', 'status: brouillon'), /service publié incohérente/u],
  ['famille du service changée', (r) => replace(r, SERVICE, 'family: facture-electronique', 'family: tva'), /service publié incohérente/u],
  ['agent non importé', (r) => replace(r, REGISTRY, "import { COMPTABILITE } from './specialistes/comptabilite.ts';", ''), /non importée/u],
  ['autre export renommé en agent', (r) => replace(r, REGISTRY, 'import { COMPTABILITE }', 'import { FAUX as COMPTABILITE }'), /non importée/u],
  ['agent absent du catalogue', (r) => replace(r, REGISTRY, '  COMPTABILITE, PAIE_SOCIAL,', '  PAIE_SOCIAL,'), /absent du catalogue/u],
  ['sélection des fiches remplacée', (r) => replace(r, REGISTRY, "agent.destination.type === 'fiche'", "agent.destination.type === 'page'"), /sélection des fiches/u],
  ['route ne construit plus les publiés', (r) => replace(r, ROUTE, 'FICHES.filter((agent) => agent.publie === true)', 'FICHES.filter((agent) => agent.publie === false)'), /non construite/u],
  ['résolution sur services non publiés', (r) => replace(r, ROUTE, "(entree) => entree.data.status === 'publie'", "(entree) => entree.data.status === 'brouillon'"), /sélection des services/u],
  ['résolution par mauvaise famille', (r) => replace(r, ROUTE, 'entree.data.family === id', 'entree.data.family !== id'), /résolution de lien/u],
  ['URL générée différente', (r) => replace(r, ROUTE, 'href: `/automatisation/${service.id}`', 'href: `/autre/${service.id}`'), /résolution de lien/u],
  ['liens non passés au gabarit', (r) => replace(r, ROUTE, 'liens={liens}', 'liens={{}}'), /gabarit non appelé/u],
  ['agent différent des propriétés de route', (r) => replace(r, ROUTE, 'const { agent } = Astro.props', 'const { agent } = autreSource'), /agent de route/u],
  ['source noindex', (r) => replace(r, RENDERER, '<Base titre=', '<Base noindex={true} titre='), /non indexable/u],
  ['fiche du gabarit remplacée', (r) => replace(r, RENDERER, 'fiche=ficheDe(agent)', 'fiche=autreFiche(agent)'), /non reliée/u],
  ['gabarit nourri par une autre source', (r) => replace(r, RENDERER, 'const {agent,liens,regle}=Astro.props', 'const {agent,liens,regle}=autreSource'), /non reliée/u],
  ['section globale plutôt que tâche', (r) => replace(r, RENDERER, 'data-agent-section="taches"', 'data-agent-section="global"'), /section contextuelle/u],
  ['section masquée', (r) => replace(r, RENDERER, 'data-agent-section="taches"', 'hidden data-agent-section="taches"'), /section contextuelle/u],
  ['boucle sur aucune tâche', (r) => replace(r, RENDERER, 'fiche.taches.map(', '[].map('), /boucle des tâches/u],
  ['texte de contexte absent', (r) => replace(r, RENDERER, '<dt>{t.geste}</dt>', '<dt>Tout le catalogue</dt>'), /contexte du geste/u],
  ['href du rendu différent', (r) => replace(r, RENDERER, 'href={liens[t.famille].href}', 'href="/contact"'), /destination du lien/u],
  ['ancre du rendu différente', (r) => replace(r, RENDERER, 'Détailler cette tâche', 'Autre ancre'), /ancre ou destination/u],
  ['lien seulement en commentaire', (r) => replace(r, RENDERER, '<a class="catalogue-action" href={liens[t.famille].href}>Détailler cette tâche<Picto nom="fleche" taille={14}/></a>', '<!-- <a href={liens[t.famille].href}>Détailler cette tâche</a> -->'), /ancre ou destination/u],
];

for (const [label, alter, expected] of mutants) {
  test(`migration entrante MUTANT : ${label}`, () => {
    const root = fixture();
    try { alter(root); assert.ok(errors(root).some((message) => expected.test(message)), errors(root).join('\n')); }
    finally { rmSync(root, { recursive: true, force: true }); }
  });
}

test('une recette passée en mémoire avec un autre chemin ne réutilise pas la migration scellée', () => {
  const root = fixture();
  try {
    assert.ok(errors(root, { ...json(root, RECIPE), path: '/automatisation/absent' }).some((e) => /identité du service/u.test(e)));
    assert.ok(errors(root, { ...json(root, RECIPE), family: 'tva' }).some((e) => /recette contrôlée différente/u.test(e)));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('le seuil de trois URL et trois sources distinctes se contrôle après remplacement effectif', () => {
  const root = fixture();
  try {
    const recipe = json(root, RECIPE), value = json(root, LEDGER), seal = json(root, SEAL);
    recipe.incomingLinks[2] = { url: '/agents-ia/comptabilite', sourcePath: ROUTE, anchor: 'Autre lien vers la même fiche' };
    writeJson(root, RECIPE, recipe);
    const hash = sha256(read(root, RECIPE));
    value.incomingLinkMigrations[0].recipeSha256 = hash;
    seal.files.recipe.sha256 = hash;
    writeJson(root, LEDGER, value); writeJson(root, SEAL, seal);
    assert.ok(errors(root).some((e) => /Trois liens entrants contextuels/u.test(e)), errors(root).join('\n'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
