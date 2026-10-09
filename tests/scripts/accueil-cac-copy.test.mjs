import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CONTENU_CAC, SEO_CAC, COUVERTURE_CAC, FRONTIERE_CAC, FICHE_OUTIL_CAC, MEDIAS_CAC } from '../../src/data/accueil/cac.ts';
const copy = readFileSync(new URL('../../docs/strategy/site-v3/cac/accueil-cac/COPY.md', import.meta.url), 'utf8');
const strings = value => typeof value === 'string' ? [value] : Object.values(value).flatMap(strings);

test('E1 livre les onze sections, les cinq orientations et les onze questions CAC', () => {
  assert.deepEqual(Object.keys(CONTENU_CAC).sort(), ['hero','orientation','quotidien','promesse','usages','methode','integration','preuves','garanties','faq','appelFinal'].sort());
  assert.equal(CONTENU_CAC.orientation.destinations.length, 5);
  assert.equal(CONTENU_CAC.usages.exemples.length, 5);
  assert.equal(CONTENU_CAC.faq.questions.length, 11);
  assert.equal(CONTENU_CAC.methode.etapes.length, 4);
});
test('la copy de revue reprend chaque chaîne des données, sans variante silencieuse', () => {
  for (const value of strings({ CONTENU_CAC, SEO_CAC, COUVERTURE_CAC, FRONTIERE_CAC, FICHE_OUTIL_CAC, MEDIAS_CAC }).filter(Boolean)) assert.ok(copy.includes(value), value);
});
test('titre, description et H1 portent l’intention mesurée, sans prétendre mesurer un volume', () => {
  const measure = JSON.parse(readFileSync(new URL('../../docs/strategy/site-v3/cac/mesures/autocomplete-cac-2026-10-06.json', import.meta.url), 'utf8'));
  const query = measure.requetes.find(row => row.requete === SEO_CAC.requete);
  assert.ok(query);
  assert.equal(query.ok, true);
  assert.equal(query.mesureLe, '2026-10-05T22:17:28.634Z');
  assert.equal(query.nombreSuggestions, 0);
  assert.deepEqual(query.suggestions, []);
  assert.equal(query.volumeMensuel, null);
  for (const value of [SEO_CAC.titre, SEO_CAC.description, CONTENU_CAC.hero.titre]) assert.match(value, /automatisation pour commissaire aux comptes/i);
  assert.ok(SEO_CAC.titre.length >= 45 && SEO_CAC.titre.length <= 60);
  assert.ok(SEO_CAC.description.length >= 140 && SEO_CAC.description.length <= 165);
  assert.match(copy, /zéro suggestion/);
  console.log(JSON.stringify({ titleCharacters: SEO_CAC.titre.length, descriptionCharacters: SEO_CAC.description.length }));
});
test('la couverture est visible et la frontière garde ses trois colonnes', () => {
  assert.equal(COUVERTURE_CAC.titre, 'Ce que votre suite d’audit fait déjà');
  assert.equal(FRONTIERE_CAC.colonnes.length, 3);
  assert.ok(FRONTIERE_CAC.lignes.every(row => row.length === 3));
  assert.match(COUVERTURE_CAC.texte, /FEC/);
  assert.match(COUVERTURE_CAC.texte, /archivage/);
  assert.match(FICHE_OUTIL_CAC.precision, /§ 14/);
  assert.match(FICHE_OUTIL_CAC.precision, /§ 46/);
  assert.match(FICHE_OUTIL_CAC.precision, /§ 48 d/);
});
test('les médias attendent E3 et E9, sans réutilisation du film ou des preuves EC', () => {
  assert.equal(CONTENU_CAC.hero.video, '');
  assert.equal(CONTENU_CAC.hero.sousTitres, '');
  const images = [CONTENU_CAC.quotidien.image, CONTENU_CAC.promesse.image, CONTENU_CAC.integration.image, CONTENU_CAC.preuves.image, CONTENU_CAC.garanties.image, ...CONTENU_CAC.methode.etapes.map(e => e.image)];
  assert.equal(new Set(images).size, 3);
  assert.ok(images.every(id => Object.values(MEDIAS_CAC).includes(id)));
  assert.ok(images.every(id => id.startsWith('cac/')));
  assert.match(copy, /masque lecteur/);
});
test('les ancres des garanties et orientations ont une cible locale prévue', () => {
  const questions = new Set(CONTENU_CAC.faq.questions.map(q => '#faq-' + q.id));
  assert.equal(questions.size, CONTENU_CAC.faq.questions.length);
  for (const garantie of CONTENU_CAC.garanties.liens) assert.ok(questions.has(garantie.href));
  const usages = new Set(CONTENU_CAC.usages.exemples.map(e => '#use-' + e.id));
  for (const destination of CONTENU_CAC.orientation.destinations) assert.ok(usages.has(destination.href));
});
test('le mécanisme et la responsabilité sont explicites, sans titre de CAC attribué à Memlia', () => {
  const publicText = strings(CONTENU_CAC).join(' ');
  assert.doesNotMatch(publicText, /audit automatisé|conforme aux NEP|validé (H2A|CNCC)|CAC virtuel|commissaire aux comptes IA|zéro erreur|complément Excel|module/i);
  assert.match(publicText, /L\.821-35/);
  assert.match(publicText, /L\.821-27/);
  assert.match(publicText, /L\.821-31/);
  assert.match(publicText, /Aucun envoi externe sans validation humaine/);
  assert.match(publicText, /Vos commentaires et conclusions restent intacts/);
  assert.match(publicText, /jeu d’essai fictif/);
  assert.match(publicText, /responsabilité de sa mission et de son opinion/);
});
