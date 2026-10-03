/**
 * Les écrans fictifs qui montrent un résultat de rejeu affichent exactement la sortie de l'oracle.
 *
 * Depuis le 03/10/2026, les cadres des articles « IA métier » et « surcharge » vivent dans
 * docs/design/blog-article-proofs. Leur ancien renderer scellait les fixtures du rejeu ; ce
 * témoin garde ce lien : changer une sortie attendue sans changer l'écran, ou l'inverse, échoue.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const fixtures = JSON.parse(readFileSync('docs/design/blog-recrutement-proofs/replay-fixtures.json', 'utf8'));
const contract = JSON.parse(readFileSync('docs/design/blog-article-proofs/content-contract.json', 'utf8'));

const cas = new Map(fixtures.articles.flatMap((article) => article.cases.map((c) => [c.id, c])));
const ecran = new Map(contract.map((entry) => [entry.id, entry.centralText]));

// Cas du rejeu → cadre qui l'affiche et champs de la sortie attendue visibles à l'écran.
const LIENS = [
  { cas: 'IA-02', cadre: 'competences-journal-rejeu', champs: ['status', 'message', 'decision'] },
  { cas: 'FLUX-01', cadre: 'surcharge-grille-priorisation', champs: ['message', 'decision'] },
];

for (const lien of LIENS) {
  test(`${lien.cadre} affiche la sortie attendue de ${lien.cas}`, () => {
    const attendu = cas.get(lien.cas)?.expected;
    assert.ok(attendu, `cas ${lien.cas} absent des fixtures du rejeu`);
    const texte = ecran.get(lien.cadre);
    assert.ok(texte, `cadre ${lien.cadre} absent du contrat`);
    for (const champ of lien.champs) {
      assert.ok(attendu[champ], `${lien.cas}.${champ} vide`);
      assert.ok(texte.includes(attendu[champ]), `${lien.cadre} n'affiche pas ${lien.cas}.${champ} : « ${attendu[champ]} »`);
    }
  });
}
