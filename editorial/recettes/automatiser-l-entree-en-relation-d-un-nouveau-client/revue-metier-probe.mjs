import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, 'rejouer.mjs'), 'utf8');
// Charger uniquement la fonction pure sans exécuter les écritures des preuves auteur.
const definition = source.slice(source.indexOf('export function proposer'), source.indexOf('const base =')).replace('export ', '');
const proposer = Function(`${definition}; return proposer;`)();
const cases = JSON.parse(readFileSync(join(dir, 'preuves/rejeu.json'), 'utf8')).cas;
for (const c of cases) assert.equal(proposer(c.entree).statut, c.attendu);
const base = structuredClone(cases.find(c => c.entree.dossier === 'D-107').entree);
const variants = [
  { nom: 'Décision d’un autre dossier', decisionCabinet: { auteur: 'ROLE-RESPONSABLE', reference: 'DEC-FICTIVE', dossier: 'D-999', version: 'V2' } },
  { nom: 'Décision sur une ancienne version', decisionCabinet: { auteur: 'ROLE-RESPONSABLE', reference: 'DEC-FICTIVE', dossier: 'D-107', version: 'V1' } },
  { nom: 'Décision défavorable enregistrée', decisionCabinet: { auteur: 'ROLE-RESPONSABLE', reference: 'DEC-FICTIVE', dossier: 'D-107', version: 'V2', resultat: 'REFUS' } },
];
const observations = variants.map(v => {
  const entree = { ...base, decisionCabinet: v.decisionCabinet };
  const obtenu = proposer(entree);
  assert.equal(obtenu.statut, 'PRÉPARER LA PASSATION', 'Le défaut observé a changé : requalifier la preuve.');
  assert.equal(obtenu.envois, 0);
  assert.equal(obtenu.decisionVigilance, null);
  return { nom: v.nom, entree, obtenu, attenduMetier: 'Aucune préparation de passation sur la seule présence d’une décision non favorable ou hors dossier/version.' };
});
const report = { reviewer: 'metier:t_67cb2d6a', executedAt: new Date().toISOString(), baselineCases: cases.length, defectId: 'F1', observations, limites: 'Reproduction sur le script fictif fourni, pas sur une intégration ni sur des données client. Aucun fichier auteur réécrit.' };
writeFileSync(join(dir, 'preuves/revue-metier-probe.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
for (const name of ['cmf-identification', 'cmf-relation']) {
  const copy = JSON.parse(readFileSync(join(dir, `preuves/${name}.dila.json`), 'utf8'));
  console.log(JSON.stringify({ source: name, id: copy.id, debut: copy.valid_from, finExclusive: copy.valid_to_exclusive, texteIntegral: copy.text }));
}
