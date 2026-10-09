import test from 'node:test';
import assert from 'node:assert/strict';
import { ajouterAuRegistre, registreVide } from '../../scripts/lib/seo-registres.mjs';
test('type outil distinct du blog et collision primaire entre types refusée',()=>{
  const fec={slug:'verificateur-fec-local',type:'outil',url:'https://memlia.fr/outils-comptables-gratuits/verificateur-fec-local',requete:'vérificateur fec gratuit'};
  const r=ajouterAuRegistre(registreVide(),fec);
  assert.equal(r.articles[0].type,'outil');
  assert.throws(()=>ajouterAuRegistre(r,{...fec,type:'blog',slug:'fec',url:'https://memlia.fr/blog/fec'}),/appartient déjà/);
});
