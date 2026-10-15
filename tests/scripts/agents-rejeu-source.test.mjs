import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import { normaliser } from '../helpers/agents-interdits.mjs';

/*
 * I10 (remplacé à la porte 2, 15/10/2026) : chaque agent IA a sa démonstration, rejouée sur un dossier fictif.
 * Le test ne compare plus rien à une page source publiée ; il vérifie la FORME des douze démonstrations des données
 * (`Specialiste.demonstration`, spec §2.1) puis, sur un `dist` construit, leur rendu :
 *   - les fiches publiées (/agents-ia/<slug>, `publie: true` et destination fiche : Comptabilité à la tâche 6, les neuf à la
 *     tâche 9) : « Rejoué sur un dossier fictif » et les quatre cas ;
 *   - Octavie : la même chose sur /integrations, sous son bandeau ;
 *   - Salomé et Aude n'ont pas de page où se rendre : leurs démonstrations vivent dans les données seulement.
 * Le fond (les mots des cas) est relu par la revue `metier`, pas par ce test.
 *
 * `src/data/specialistes.ts` n'existe pas encore (tâche 2) : les contrôles de données échouent avec « Cannot find
 * module ». Le rendu n'est exigé qu'une fois le gabarit de fiche (tâche 6) et le bandeau d'Octavie (tâche 8)
 * écrits ; avant, le contrôle se dit sauté, à voix haute. Sans `dist` : sauté en local, en échec en CI.
 */

const RACINE = fileURLToPath(new URL('../../', import.meta.url));
const DIST = join(RACINE, 'dist');
const EN_TETE = 'Rejoué sur un dossier fictif';
const ISSUES_ATTENDUES = ['Préparé', 'À valider', 'Arrêt'];
const NOMBRE_DE_CAS = 4;
const SLUGS = [
  'comptabilite', 'paie-social', 'juridique-fiscal', 'finance', 'missions-audit', 'commercial',
  'communication', 'relation-client', 'gestion-cabinet', 'rh-cabinet', 'informatique-outils', 'protection-donnees',
];
/** Les trois agents sans fiche : Salomé et Aude (pages existantes), Octavie (/integrations). */
const SANS_FICHE = ['paie-social', 'missions-audit', 'informatique-outils'];
const EXIGE_DIST = Boolean(process.env.CI || process.env.CF_PAGES || process.env.AGENTS_DIST_REQUIS === '1');

const specialistes = () => import('../../src/data/specialistes.ts');
const texteNonVide = (valeur) => typeof valeur === 'string' && valeur.trim() !== '';
const espaces = (texte) => String(texte).replace(/\s+/gu, ' ');

/** Les erreurs de forme d'une démonstration ; `issues` = les issues permises (ISSUES des données). */
function erreursDemonstration(demonstration, issues = ISSUES_ATTENDUES) {
  if (!demonstration || typeof demonstration !== 'object') return ['démonstration absente'];
  const erreurs = [];
  for (const champ of ['dossier', 'regle']) if (!texteNonVide(demonstration[champ])) erreurs.push(`${champ} vide`);
  const cas = Array.isArray(demonstration.cas) ? demonstration.cas : [];
  if (cas.length !== NOMBRE_DE_CAS) erreurs.push(`${cas.length} cas au lieu de ${NOMBRE_DE_CAS}`);
  cas.forEach((unCas, i) => {
    for (const champ of ['cas', 'sortie']) if (!texteNonVide(unCas?.[champ])) erreurs.push(`cas ${i + 1} : ${champ} vide`);
    if (!issues.includes(unCas?.issue)) erreurs.push(`cas ${i + 1} : issue « ${unCas?.issue} » hors de ${issues.join(' / ')}`);
  });
  const arrets = cas.filter((unCas) => unCas?.issue === 'Arrêt');
  if (arrets.length === 0) erreurs.push('aucun Arrêt');
  else if (!arrets.some((unCas) => espaces(unCas.sortie ?? '').includes('Motif :'))) erreurs.push('aucun Arrêt dont la sortie porte « Motif : »');
  return erreurs;
}

const BLOCS = new Set(['p', 'div', 'li', 'ul', 'ol', 'tr', 'td', 'th', 'table', 'thead', 'tbody', 'caption', 'section', 'article', 'header', 'footer', 'main', 'nav', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'figure', 'figcaption', 'dl', 'dt', 'dd', 'details', 'summary', 'blockquote']);
const IGNORES = new Set(['script', 'style', 'template']);

/** Le texte visible d'un nœud, normalisé ; scripts, styles et commentaires n'en font pas partie. */
function texteDe(noeud) {
  const morceaux = [];
  const marcher = (n) => {
    if (n.nodeName === '#text') { morceaux.push(n.value); return; }
    if (IGNORES.has(n.nodeName)) return;
    const bloc = BLOCS.has(n.nodeName);
    if (bloc) morceaux.push(' ');
    for (const enfant of n.childNodes ?? []) marcher(enfant);
    if (bloc) morceaux.push(' ');
  };
  marcher(noeud);
  return normaliser(morceaux.join(''));
}

/** Les lignes de table (<tr>) d'une page, en texte visible. */
function lignesDeTable(html) {
  const lignes = [];
  const marcher = (n) => {
    if (n.nodeName === 'tr') lignes.push(texteDe(n));
    for (const enfant of n.childNodes ?? []) marcher(enfant);
  };
  marcher(parse(html));
  return lignes;
}

/** Ce qu'une page doit rendre d'une démonstration : l'en-tête, et chaque cas avec sa sortie et son issue sur une même ligne. */
function erreursDeRendu(html, demonstration) {
  const erreurs = [];
  if (!texteDe(parse(html)).includes(normaliser(EN_TETE))) erreurs.push(`« ${EN_TETE} » absent`);
  const lignes = lignesDeTable(html);
  demonstration.cas.forEach((unCas, i) => {
    const attendu = [unCas.cas, unCas.sortie, unCas.issue].map(normaliser);
    if (!lignes.some((ligne) => attendu.every((morceau) => ligne.includes(morceau)))) erreurs.push(`cas ${i + 1} absent d'une ligne de table : « ${unCas.cas} »`);
  });
  return erreurs;
}

const cas = (texte, sortie, issue) => ({ cas: texte, sortie, issue });
const exemple = () => ({
  dossier: 'Dossier fictif : l’Atelier Loriot, SARL inventée.',
  regle: 'Une pièce lisible d’un fournisseur connu reçoit l’imputation déjà validée. Une pièce illisible s’arrête.',
  cas: [
    cas('Facture d’électricité d’un fournisseur déjà imputé', 'Écriture proposée 6061 / 44566 / 401', 'Préparé'),
    cas('Première facture d’un fournisseur de quincaillerie', 'Deux imputations présentées', 'À valider'),
    cas('Facture de même numéro qu’une pièce d’août', 'Aucune écriture proposée. Motif : doublon probable', 'Arrêt'),
    cas('Photo de ticket floue', 'Aucune écriture proposée. Motif : montant illisible', 'Arrêt'),
  ],
});
const page = (demonstration, { entete = EN_TETE, sauf } = {}) => `<!doctype html><html lang="fr"><body><main>
  <section><h2>${entete}</h2><p>${demonstration.dossier}</p>
  <table><thead><tr><th>Cas joué</th><th>Sortie obtenue</th><th>Décision</th></tr></thead><tbody>
  ${demonstration.cas.filter((_, i) => i !== sauf).map((unCas) => `<tr><td>${unCas.cas.replace(/’/gu, '&#39;')}</td><td>${unCas.sortie.replace(/ : /u, '&nbsp;: ')}</td><td><${unCas.issue === 'Arrêt' ? 'del' : 'span'}>${unCas.issue}</${unCas.issue === 'Arrêt' ? 'del' : 'span'}></td></tr>`).join('\n')}
  </tbody></table></section></main></body></html>`;

test('témoin : une démonstration bien formée ne rend aucune erreur, avec une espace insécable avant les deux-points', () => {
  assert.deepEqual(erreursDemonstration(exemple()), []);
  const insecable = exemple();
  insecable.cas[2].sortie = 'Aucune écriture proposée. Motif : doublon probable';
  assert.deepEqual(erreursDemonstration(insecable), []);
});

test('témoins : trois ou cinq cas, une issue hors des trois, aucun Arrêt, un Arrêt sans motif, un champ vide rougissent', () => {
  const modifie = (changer) => { const d = exemple(); changer(d); return erreursDemonstration(d); };
  assert.deepEqual(erreursDemonstration(undefined), ['démonstration absente']);
  assert.deepEqual(erreursDemonstration({ ...exemple(), cas: undefined }), ['0 cas au lieu de 4', 'aucun Arrêt']);
  assert.ok(modifie((d) => d.cas.pop()).includes('3 cas au lieu de 4'));
  assert.ok(modifie((d) => d.cas.push(cas('Cinquième', 'Sortie', 'Préparé'))).includes('5 cas au lieu de 4'));
  assert.ok(modifie((d) => { d.cas[0].issue = 'Compatible'; }).some((e) => /issue « Compatible »/u.test(e)));
  assert.ok(modifie((d) => { d.cas[1].issue = 'arrêt'; }).some((e) => /issue « arrêt »/u.test(e)));
  assert.ok(modifie((d) => { d.cas[2].issue = 'À valider'; d.cas[3].issue = 'Préparé'; }).includes('aucun Arrêt'));
  assert.ok(modifie((d) => { d.cas[2].sortie = 'Aucune écriture proposée'; d.cas[3].sortie = 'Rien. Motif: montant illisible'; }).includes('aucun Arrêt dont la sortie porte « Motif : »'));
  assert.ok(modifie((d) => { d.dossier = '  '; }).includes('dossier vide'));
  assert.ok(modifie((d) => { d.regle = ''; }).includes('regle vide'));
  assert.ok(modifie((d) => { d.cas[0].sortie = ''; }).includes('cas 1 : sortie vide'));
  assert.ok(modifie((d) => { d.cas[0].cas = undefined; }).includes('cas 1 : cas vide'));
});

test('témoins du rendu : l’en-tête, une ligne manquante, une lettre changée, une issue changée ou un texte caché rougissent', () => {
  const demonstration = exemple();
  assert.deepEqual(erreursDeRendu(page(demonstration), demonstration), []);
  assert.deepEqual(erreursDeRendu(page(demonstration, { entete: 'Un exemple' }), demonstration), [`« ${EN_TETE} » absent`]);
  assert.equal(erreursDeRendu(page(demonstration, { sauf: 1 }), demonstration).length, 1);
  const lettre = exemple();
  lettre.cas[0].sortie = 'Écriture proposée 6061 / 44566 / 402';
  assert.equal(erreursDeRendu(page(demonstration), lettre).length, 1);
  const issue = exemple();
  issue.cas[1].issue = 'Arrêt';
  assert.equal(erreursDeRendu(page(demonstration), issue).length, 1, 'l’issue se lit sur la ligne du cas, pas ailleurs dans la page');
  // Le texte d'un script ou d'un commentaire n'est pas du texte rendu.
  const cache = page(demonstration).replace(/<table>[\s\S]*<\/table>/u, `<!-- ${JSON.stringify(demonstration)} --><script>const d = ${JSON.stringify(demonstration)};</script>`);
  assert.equal(erreursDeRendu(cache, demonstration).length, NOMBRE_DE_CAS);
});

test('I10 : les douze démonstrations des données ont quatre cas, une issue permise chacun, un Arrêt motivé, un dossier et une règle', async (t) => {
  const { AGENTS, ISSUES } = await specialistes();
  assert.deepEqual([...ISSUES], ISSUES_ATTENDUES);
  assert.deepEqual(AGENTS.map(({ slug }) => slug), SLUGS);
  const erreurs = AGENTS.flatMap((agent) => erreursDemonstration(agent.demonstration, ISSUES).map((erreur) => `${agent.slug} : ${erreur}`));
  assert.deepEqual(erreurs, []);
  const issues = AGENTS.flatMap((agent) => agent.demonstration.cas.map((unCas) => unCas.issue));
  t.diagnostic(`${AGENTS.length} démonstrations, ${issues.length} cas : ${ISSUES_ATTENDUES.map((issue) => `${issue} ${issues.filter((autre) => autre === issue).length}`).join(', ')}`);
});

/** R18 (15/10/2026) : une carte de fiche porte sa fiche dès que l'agent est publié ; avant, le contenu peut manquer. */
const ficheEnRegle = (agent) => agent.destination?.type === 'fiche' && (agent.publie !== true || Boolean(agent.fiche));

test('témoin : une carte de fiche publiée sans fiche rougit ; non publiée, elle peut attendre son contenu', () => {
  const carte = (publie, fiche) => ({ slug: 'x', destination: { type: 'fiche' }, publie, ...(fiche ? { fiche } : {}) });
  assert.equal(ficheEnRegle(carte(true)), false, 'publiée sans fiche');
  assert.equal(ficheEnRegle(carte(true, { h1: 'Titre' })), true, 'publiée avec sa fiche');
  assert.equal(ficheEnRegle(carte(false)), true, 'non publiée, sans fiche');
  assert.equal(ficheEnRegle({ slug: 'y', destination: { type: 'page', chemin: '/integrations' }, publie: true }), false, 'une carte vers une page n’est pas une fiche');
});

test('I10 : neuf cartes mènent à une fiche, obligatoire dès que l’agent est publié ; Salomé, Aude et Octavie mènent à une page existante', async () => {
  const { AGENTS, FICHES } = await specialistes();
  assert.deepEqual(FICHES.map(({ slug }) => slug).sort(), SLUGS.filter((slug) => !SANS_FICHE.includes(slug)).sort());
  assert.deepEqual(FICHES.filter((agent) => !ficheEnRegle(agent)).map(({ slug }) => slug), [], 'agent publié sans fiche, ou carte de FICHES sans destination fiche');
  assert.ok(AGENTS.every((agent) => typeof agent.publie === 'boolean'), '`publie` est un booléen sur chacun des douze agents');
  assert.ok(AGENTS.filter(({ slug }) => SANS_FICHE.includes(slug)).every((agent) => !agent.fiche && agent.destination?.type === 'page'));
});

/** Le contrôle de rendu s'exige quand la page qui doit le porter existe dans les sources ; il se dit sauté sinon. */
function exigerRendu(t, { raison, source }) {
  if (!source()) { t.skip(`${raison} : rendu non exigé tant que la page n’est pas écrite`); return false; }
  if (!existsSync(join(DIST, 'index.html'))) {
    if (EXIGE_DIST) assert.fail('dist absent : ce contrôle lit le build, qui précède toujours les tests en CI (npm run build)');
    t.skip('dist absent : build non construit, rendu non lu (en CI, ce contrôle échoue au lieu de sauter)');
    return false;
  }
  return true;
}
const gabaritDeFiche = () => {
  const dossier = join(RACINE, 'src/pages/agents-ia');
  return existsSync(dossier) && readdirSync(dossier).some((nom) => nom !== 'index.astro' && nom.endsWith('.astro'));
};
const bandeauOctavie = () => existsSync(join(RACINE, 'src/components/sections/QuiPrendCeMetier.astro'));

/** Les fiches que le site publie : un agent `publie` dont la carte mène à une fiche (la tâche 6 ne publie que Comptabilité, la tâche 9 les neuf). */
const fichesPubliees = (agents) => agents.filter((agent) => agent.publie === true && agent.destination?.type === 'fiche');

test('I10 : chaque fiche publiée rend « Rejoué sur un dossier fictif » et les quatre cas de sa démonstration', async (t) => {
  const { FICHES } = await specialistes();
  if (!exigerRendu(t, { raison: 'gabarit de fiche absent (tâche 6)', source: gabaritDeFiche })) return;
  const publiees = fichesPubliees(FICHES);
  // Un gabarit écrit sans fiche publiée ne prouve rien : au moins une fiche (Comptabilité, tâche 6) doit être rendue.
  assert.ok(publiees.length > 0, 'le gabarit de fiche existe mais aucun agent n’est `publie: true` avec une fiche');
  t.diagnostic(`${publiees.length} fiche(s) publiée(s) sur ${FICHES.length} : ${publiees.map(({ slug }) => slug).join(', ')}`);
  const erreurs = publiees.flatMap((agent) => {
    const chemin = join(DIST, 'agents-ia', `${agent.slug}.html`);
    if (!existsSync(chemin)) return [`${agent.slug} : ${chemin.slice(RACINE.length)} absent du build`];
    return erreursDeRendu(readFileSync(chemin, 'utf8'), agent.demonstration).map((erreur) => `${agent.slug} : ${erreur}`);
  });
  assert.deepEqual(erreurs, []);
});

test('I10 : /integrations rend, sous le bandeau d’Octavie, sa démonstration', async (t) => {
  const { AGENTS } = await specialistes();
  if (!exigerRendu(t, { raison: 'bandeau d’Octavie absent (tâche 8)', source: bandeauOctavie })) return;
  const octavie = AGENTS.find(({ slug }) => slug === 'informatique-outils');
  assert.ok(octavie, 'Octavie est dans les données');
  assert.deepEqual(erreursDeRendu(readFileSync(join(DIST, 'integrations.html'), 'utf8'), octavie.demonstration), []);
});
