import test from 'node:test';
import assert from 'node:assert/strict';
import { tarifs, prixRobotsAnnuel, prixAgentsMensuel, estimerBudget } from '../../src/lib/tarifs-memlia.mjs';
test('tarif robots continu aux deux seuils et devis au-delà de 500',()=>{
  for(const [n,prix] of [[1,60000],[100,60000],[101,60400],[250,120000],[251,120240],[500,180000],[501,null]]) assert.equal(prixRobotsAnnuel(n),prix);
  for(const n of [0,-1,2.5,Infinity,NaN,'100'])assert.throws(()=>prixRobotsAnnuel(n));
  assert.equal(tarifs.robots.standardRobotIds.length,9);
});
test('socle une fois, crédits mutualisés, dépassement exact et sans lot obligatoire',()=>{
  assert.equal(prixAgentsMensuel(['comptabilite']).total,54800);
  assert.equal(prixAgentsMensuel(['comptabilite','relation-client']).total,74700);
  const r=prixAgentsMensuel(['comptabilite','relation-client'],8001);
  assert.equal(r.creditsInclus,8000);assert.equal(r.depassement,5);assert.equal(r.total,74705);
  for(const ids of [[],['inconnu'],['comptabilite','comptabilite']])assert.throws(()=>prixAgentsMensuel(ids));
});
test('chaque repère correspond au plancher du quota, jamais à un dossier complet',()=>{
 assert.equal(tarifs.agents.length,12);assert.equal(new Set(tarifs.agents.map(a=>a.id)).size,12);
 for(const a of tarifs.agents)for(const p of a.profiles){assert.equal(p.approxCases,Math.floor(a.includedCredits/p.creditsPerCase));assert.ok(p.description);}
 assert.deepEqual(tarifs.agents[0].profiles.map(p=>p.approxCases),[20,8,3]);
});
test('mise en service inconnue reste inconnue et un temps de contrôle excessif donne une valeur négative',()=>{
 const r=estimerBudget({dossiers:100,coutHoraire:40,tempsManuel:10,tempsControle:20});
 assert.ok(r.heures<0);assert.ok(r.soldeAnnuel<0);assert.equal(r.coutPremiereAnnee,null);
 const devis=estimerBudget({dossiers:501,coutHoraire:40,tempsManuel:120,tempsControle:30,miseEnService:0});
 assert.equal(devis.annuel,null);assert.equal(devis.soldePremiereAnnee,null);
});
test('agent : usage mensuel annualisé, détail des crédits et installation distincts',()=>{
 const r=estimerBudget({offre:'comptabilite',profil:'courant',dossiers:10,coutHoraire:40,tempsManuel:120,tempsControle:30,miseEnService:199000});
 assert.equal(r.detail.creditsNecessaires,5780);assert.equal(r.detail.depassement,3900);assert.equal(r.annuel,704400);assert.equal(r.coutPremiereAnnee,903400);assert.equal(r.heures,180);
});
