import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ajouterAuRegistre, registreVide } from '../../scripts/lib/seo-registres.mjs';
test('une vraie page outil se classe outil, sans collision avec blog', () => {
  const entry = { slug:'preparer-pseudonymiser-fichier-csv-fec', type:'outil', url:'https://memlia.fr/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec', requete:'pseudonymiser fichier comptable avant ia', publieLe:null };
  const registre = ajouterAuRegistre(registreVide(), entry);
  assert.equal(registre.articles[0].type, 'outil');
  assert.throws(() => ajouterAuRegistre(registre, { ...entry, type:'blog', url:'https://memlia.fr/blog/test' }), /déjà/);
});
