import test from 'node:test';
import assert from 'node:assert/strict';
import { ajouterAuRegistre, registreVide } from '../../scripts/lib/seo-registres.mjs';
test('type outil distinct du blog et collision primaire entre types refusée',()=>{
  const fec={slug:'verificateur-fec-local',type:'outil',url:'https://memlia.fr/outils-comptables-gratuits/verificateur-fec-local',requete:'vérificateur fec gratuit'};
  const r=ajouterAuRegistre(registreVide(),fec);
  assert.equal(r.articles[0].type,'outil');
  assert.throws(()=>ajouterAuRegistre(r,{...fec,type:'blog',slug:'fec',url:'https://memlia.fr/blog/fec'}),/appartient déjà/);
});

test('le test FEC porte le vocabulaire des requêtes sans promettre plus que les contrôles exécutés', async () => {
  const { getOutil } = await import('../../src/data/outils.ts');
  const { FIELDS, RULES } = await import('../../src/lib/fec-local.mjs');
  const { readFileSync } = await import('node:fs');
  const outil = getOutil('verificateur-fec-local');
  assert.match(outil.title, /^Test FEC gratuit/);
  assert.ok(outil.title.length <= 60, `title de ${outil.title.length} caractères`);
  assert.ok(outil.description.length <= 160, `description de ${outil.description.length} caractères`);
  assert.ok(outil.description.startsWith('Contrôlez localement la structure'), 'ouverture imposée par config/page-intent-contract.json');
  assert.doesNotMatch(`${outil.title} ${outil.h1} ${outil.description}`, /conforme|certifi(?!ant)|valid(?:e|é)/i);
  const bloc = readFileSync('src/components/outils/VerificateurFec.astro', 'utf8').match(/<section class="test-fec"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(bloc, 'le bloc visible « Tester un FEC » doit exister hors du <details>');
  for (const champ of [FIELDS[3], FIELDS[9], FIELDS[15], FIELDS[14], FIELDS[16]]) assert.ok(bloc.includes(champ), `${champ} absent du bloc`);
  for (const mot of ['équilibre', 'exhaustivité', 'chronologie', 'numérotation', 'nom du fichier', 'plan de comptes', 'traitement fiscal']) assert.ok(bloc.includes(mot), `limite « ${mot} » absente du bloc`);
  assert.ok(RULES.find((r) => r.id === 'fond').description.includes('non évalués'));
  assert.match(bloc, /ne certifie pas le FEC/);
  assert.match(bloc, /Test Compta Demat/);
});
