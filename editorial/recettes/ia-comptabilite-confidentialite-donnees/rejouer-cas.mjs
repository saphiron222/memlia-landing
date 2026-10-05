import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const cas = [
  {id:'C-01',qualification:true,environnement:true,identifiantInutile:false,reconstructible:false,attendu:'PREPARATION_PRETE'},
  {id:'C-02',qualification:true,environnement:true,identifiantInutile:true,reconstructible:false,attendu:'RETIRER_IDENTIFIANT'},
  {id:'C-03',qualification:true,environnement:false,identifiantInutile:false,reconstructible:false,attendu:'ENVIRONNEMENT_INCONNU'},
  {id:'C-04',qualification:true,environnement:true,identifiantInutile:false,reconstructible:true,attendu:'ARBITRAGE_HUMAIN'},
];
function router(c) {
  if (!c.qualification) return 'QUALIFICATION_ABSENTE';
  if (!c.environnement) return 'ENVIRONNEMENT_INCONNU';
  if (c.identifiantInutile) return 'RETIRER_IDENTIFIANT';
  if (c.reconstructible) return 'ARBITRAGE_HUMAIN';
  return 'PREPARATION_PRETE';
}
const resultats = cas.map(c => {
  const sortie = router(c);
  assert.equal(sortie,c.attendu);
  return {entree:c,sortie,transmission:false};
});
assert.equal(router({...cas[0],qualification:false}),'QUALIFICATION_ABSENTE');
const journal = {fictif:true,modeleInterroge:false,analyseSemantique:false,qualification:'humaine préalable déclarée',executeAt:new Date().toISOString(),resultats};
writeFileSync(new URL('./journal-rejeu.json',import.meta.url),JSON.stringify(journal,null,2)+'\n');
console.log(JSON.stringify(journal,null,2));
