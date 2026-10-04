import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
export function choisirUsage(cas) {
  if (cas.geste === 'decision-fiscale') return {statut:'HORS_PERIMETRE', sortie:'Aucune préparation', envoi:false};
  if (!cas.contexte?.trim()) return {statut:'CONTEXTE_ABSENT', sortie:'Contexte à préciser', envoi:false};
  if (cas.geste !== 'reformuler') return {statut:'GESTE_NON_PREVU', sortie:'Fiche à préciser', envoi:false};
  return {statut:cas.demandeEnvoi ? 'ENVOI_NON_AUTORISE' : 'ESSAI_SELECTIONNE', sortie:'Reformulation en brouillon à relire', envoi:false};
}
const cas = [
  {id:'E-01', geste:'reformuler', contexte:'D-012 : réunion jeudi ; liste de questions à préparer.', demandeEnvoi:false, attendu:'ESSAI_SELECTIONNE'},
  {id:'E-02', geste:'decision-fiscale', contexte:'Dossier entièrement fictif', demandeEnvoi:false, attendu:'HORS_PERIMETRE'},
  {id:'E-03', geste:'reformuler', contexte:'', demandeEnvoi:false, attendu:'CONTEXTE_ABSENT'},
  {id:'E-04', geste:'reformuler', contexte:'D-012 : réunion jeudi ; liste de questions à préparer.', demandeEnvoi:true, attendu:'ENVOI_NON_AUTORISE'},
];
const resultats=cas.map(c=>{const obtenu=choisirUsage(c); assert.equal(obtenu.statut,c.attendu);assert.equal(obtenu.envoi,false);return {entree:c,obtenu};});
const journal={executeAt:new Date().toISOString(), nature:'Règle déterministe locale de sélection, aucun modèle interrogé, aucune reformulation générée', resultats};
writeFileSync(new URL('./journal-rejeu.json',import.meta.url),JSON.stringify(journal,null,2)+'\n');
console.log(JSON.stringify(journal,null,2));
