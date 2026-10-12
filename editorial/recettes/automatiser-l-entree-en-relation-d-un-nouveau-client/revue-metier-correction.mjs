import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(readFileSync(join(dir, p), 'utf8'));
const source = readFileSync(join(dir, 'rejouer.mjs'), 'utf8');
const definition = source.slice(source.indexOf('export function proposer'), source.indexOf('const base =')).replace('export ', '');
const proposer = Function(`${definition}; return proposer;`)();
const decision = { dossier: 'D-107', version: 'V2', auteur: 'ROLE-RESPONSABLE', reference: 'DEC-FICTIVE', resultat: 'favorable' };
const base = { dossier: 'D-107', version: 'V2', checklist: 'ENTREE-SOCIETE-1', reexamen: false, pieces: [{ dossier: 'D-107', nom: 'identification', etat: 'qualifiee' }, { dossier: 'D-107', nom: 'beneficiaire', etat: 'qualifiee' }], decisionCabinet: decision, signature: 'V2', autorisation: { dossier: 'D-107', version: 'V2', auteur: 'ROLE-RESPONSABLE' }, commentaireHumain: 'Texte humain conservé' };
const variants = [
  ['autre dossier', { ...decision, dossier: 'D-999' }, 'REFUS : DÉCISION AUTRE DOSSIER'],
  ['ancienne version', { ...decision, version: 'V1' }, 'REFUS : DÉCISION ANCIENNE VERSION'],
  ['défavorable', { ...decision, resultat: 'defavorable' }, 'REFUS : DÉCISION NON FAVORABLE'],
  ['résultat inconnu', { ...decision, resultat: 'INCONNU' }, 'REFUS : DÉCISION NON FAVORABLE'],
  ['contre-cas initial REFUS', { ...decision, resultat: 'REFUS' }, 'REFUS : DÉCISION NON FAVORABLE'],
  ['objet vide', {}, 'REFUS : DÉCISION INCOMPLÈTE'],
  ['simple booléen', true, 'REFUS : DÉCISION INCOMPLÈTE'],
  ['absente', null, 'DÉCISION CABINET ATTENDUE'],
  ['favorable complète', decision, 'PRÉPARER LA PASSATION'],
];
for (const field of ['dossier', 'version', 'auteur', 'reference', 'resultat']) {
  const incomplete = { ...decision };
  delete incomplete[field];
  variants.push([`champ absent : ${field}`, incomplete, 'REFUS : DÉCISION INCOMPLÈTE']);
  variants.push([`champ blanc : ${field}`, { ...decision, [field]: '  ' }, 'REFUS : DÉCISION INCOMPLÈTE']);
}
const observations = variants.map(([nom, decisionCabinet, attendu]) => {
  const entree = structuredClone({ ...base, decisionCabinet });
  const before = structuredClone(entree);
  const obtenu = proposer(entree);
  assert.equal(obtenu.statut, attendu, nom);
  assert.deepEqual(entree, before, nom);
  assert.equal(obtenu.envois, 0);
  assert.equal(obtenu.decisionVigilance, null);
  assert.deepEqual(proposer(entree), obtenu);
  return { nom, entree, attendu, obtenu };
});
const replay = read('preuves/rejeu.json');
const body = readFileSync(join(dir, 'corps.md'), 'utf8');
for (const c of replay.cas) {
  assert.deepEqual(proposer(c.entree), c.obtenu);
  assert.ok(body.includes(`| ${c.entree.dossier},`) && body.includes(`| ${c.obtenu.statut} |`));
}
assert.equal(replay.cas.length, 15);
assert.ok(body.includes('un résultat explicitement favorable') && body.includes('jamais calculé à partir des pièces'));
const recipe = read('recette.json');
assert.ok(recipe.proofRequired.includes('Quinze cas') && recipe.proofRequired.includes('dossier/version'));
const archive = join(process.cwd(), '.qa/onboarding-client-fabrication.tgz');
const paths = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).split('\n').filter(Boolean);
const original = name => {
  const candidates = paths.filter(p => p.endsWith('/' + name));
  assert.equal(candidates.length, 1, name);
  return execFileSync('tar', ['-xOf', archive, candidates[0]], { maxBuffer: 10000000 });
};
const oldRecipe = JSON.parse(original('recette.json'));
assert.deepEqual(recipe.sources, oldRecipe.sources);
assert.deepEqual(recipe.claims, oldRecipe.claims);
assert.deepEqual(recipe.inlineProofs, oldRecipe.inlineProofs);
const originalBody = original('corps.md').toString();
const oldLegal = originalBody.split('\n').filter(l => /legifrance\.gouv\.fr|cnil\.fr/.test(l));
assert.deepEqual(body.split('\n').filter(l => /legifrance\.gouv\.fr|cnil\.fr/.test(l)), oldLegal);
for (const name of ['figures.html', 'preuves/onboarding-pieces.webp', 'preuves/onboarding-jalons.webp']) assert.ok(original(name).equals(readFileSync(join(dir, name))), name);
const oldCases = JSON.parse(original('preuves/rejeu.json')).cas;
for (const c of oldCases) {
  const current = replay.cas.find(r => r.entree.dossier === c.entree.dossier);
  assert.deepEqual(current.obtenu, c.obtenu);
  const { decisionCabinet: oldDecision, ...oldEntry } = c.entree;
  const { decisionCabinet: newDecision, ...newEntry } = current.entree;
  assert.deepEqual(newEntry, oldEntry);
}
const attachment = '/Users/kevinkitanga/.hermes/kanban/attachments/t_67cb2d6a/';
assert.ok(readFileSync(join(dir, 'image-source.png')).equals(readFileSync(attachment + 'automatiser-l-entree-en-relation-d-un-nouveau-client-openai.png')));
assert.ok(readFileSync(join(dir, recipe.image.source.provenancePath)).equals(readFileSync(attachment + 'automatiser-l-entree-en-relation-d-un-nouveau-client-openai-provenance.json')));
for (const name of ['hero-768.webp','hero-1200.webp','hero-1600.webp','hero-768.avif','hero-1200.avif','hero-1600.avif','hero-og.webp']) assert.ok(readFileSync(join(dir, 'preuves', name)).length > 0);
const result = { reviewer: 'metier:t_67cb2d6a', executedAt: new Date().toISOString(), scope: 'F1, N1 et fini du paquet uniquement', verdict: 'PASS', articleCases: replay.cas.length, targetedControls: observations.length, observations, regression: { originalNominalCases: oldCases.length, sourcesClaimsUnchanged: true, legalParagraphsUnchanged: true, figuresUnchanged: true, nominalResultsUnchanged: true, nominalInputsUnchangedExceptDecisionSchema: true }, N1: { originalAttachmentExact: true, provenanceAttachmentExact: true, derivativesPresent: true }, limits: ['Jeu fictif : aucun calcul de vigilance ou intégration client', 'Pas de PR, CI, scellement natif ou publication vérifiés ici', 'Palette non conforme aux deux cibles vert : note cosmétique non bloquante conservée'] };
writeFileSync(join(dir, 'preuves/revue-metier-correction.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ verdict: result.verdict, articleCases: result.articleCases, targetedControls: result.targetedControls, regression: result.regression, N1: result.N1 }, null, 2));
