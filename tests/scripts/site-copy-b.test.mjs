import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BLOG_RUBRIQUES, construireRubriques } from '../../src/data/blog-rubriques.mjs';
import { loadMetierEvidence } from '../../scripts/lib/resource-metier-evidence.mjs';

const source = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('une assertion additionnelle suit la date de sa propre source', () => {
  const evidence = loadMetierEvidence(new URL('../..', import.meta.url).pathname, '2026-09-16T20:24:14+01:00');
  const claim = evidence.entries.find(({ id }) => id === 'T-EXTRA-sous-traitant-rgpd-context');
  assert.equal(claim.validAsOf, '2026-10-04');
  assert.equal(claim.checkedAt, evidence.sources[claim.sourceId].checkedAt);
});

test('les rubriques suivent le geste déclaré, même avec des dates inversées', () => {
  const entries = BLOG_RUBRIQUES.flatMap((rubrique) => rubrique.articleIds.map((id, i) => ({ id, data: { datePublication: new Date(2026, 8, i + 1) } })));
  for (const rubrique of construireRubriques(entries.reverse())) {
    assert.deepEqual(rubrique.articles.map(({ id }) => id), rubrique.articleIds);
  }
});

test('garanties : ni comparaison ni délai, politique bornée au site', () => {
  const text = source('src/pages/garanties.astro');
  assert.ok(text.includes('Un avis absent, une session expirée ou une pièce illisible reste visible dans le compte rendu. Le robot ou l’agent arrête le traitement concerné et en explique la raison.'));
  assert.ok(text.includes('Votre équipe peut corriger l’entrée, rétablir l’accès ou décider de la suite.'));
  assert.ok(text.includes('Aucun envoi externe sans validation humaine'));
  assert.ok(text.includes('Elle ne constitue pas une attestation de conformité en paie, en droit social ou en protection des données'));
  assert.ok(text.includes('Les flux du service sont documentés par mission'));
  assert.doesNotMatch(text, /plus souvent que d’autres|quelques minutes|des mois plus tard/);
});

test('garanties : une phrase qui renvoie à la précédente reste collée à son antécédent', () => {
  // Revue du 13/10/2026 : en lignes, « Nous pouvons ainsi » suivait la pseudonymisation et laissait
  // croire à des essais sur données réelles. Ces renvois restent dans le paragraphe de leur antécédent.
  const text = source('src/pages/garanties.astro');
  assert.match(text, /jamais leur contenu\. Nous pouvons ainsi <a href="\/agents-ia\/comptabilite#taches-titre">/);
  assert.match(text, /après une saisie automatisée<\/a>\. Cette frontière vaut aussi pour le <a href="\/outils-comptables-gratuits\/verificateur-fec-local">/);
  assert.match(text, /Chaque mission a son périmètre et ses accès\.[\s\S]{0,700}?<dd class="ligne-texte">Ce périmètre est la condition pour/);
});

test('contact : finalités séparées, provenance facultative et base identifiée', () => {
  const text = source('src/pages/contact.astro');
  assert.ok(text.includes('comprendre la page du site à l’origine de ma demande'));
  assert.ok(text.includes('Votre besoin, vos outils et le résultat attendu'));
  assert.ok(text.includes('Décrivez le geste sans donnée client ; ce formulaire ne reçoit pas de fichier'));
  assert.match(text, /id="consentement_origine" name="consentement_origine" type="checkbox" \/>/);
  assert.ok(text.includes('sur la base de son intérêt légitime'));
  assert.ok(text.includes('Je peux envoyer mon message sans cet accord'));
  const politique = source('src/pages/politique-de-confidentialite.astro');
  assert.ok(politique.includes('constitue une donnée personnelle'));
  assert.ok(politique.includes('article 6, paragraphe 1, a du RGPD'));
  assert.ok(politique.includes('article 6, paragraphe 1, f du RGPD'));
  assert.doesNotMatch(politique, /elle ne dit rien de vous/);
  assert.doesNotMatch(text, /Elles ne servent à rien d’autre|celle qui agace le plus/);
});

test('les compatibilités forment un catalogue commun aux robots et agents, sans anciens guides ni statuts commerciaux', () => {
  const text = source('src/pages/integrations/index.astro');
  assert.match(text, /DOMAINES\.map\(domaine=><ConnecteursDomaine domaine=\{domaine\}/);
  assert.ok(text.includes('Vos outils. Nos robots et agents IA.'));
  assert.ok(text.includes('Votre logiciel n’est pas listé ? Nous l’intégrons sur demande.'));
  for (const href of ['/agents-ia', '/automatisation-cabinet-comptable', '/methode']) assert.ok(text.includes(`href="${href}"`));
  assert.doesNotMatch(text, /guidesPar|integration\.product === product|integration\.vendor ===/);
  const cartes = source('src/components/sections/ConnecteursDomaine.astro');
  assert.match(cartes, /logo/);
  assert.doesNotMatch(cartes, />Éprouvé<|>Par export<|>Sur demande</);
  assert.doesNotMatch(text, /contenu maigre|Demande mesurée|signal d’indexation|integration.vendor ===/);
});

test('glossaire : les frontières corrigées restent explicites', () => {
  const text = source('src/data/glossary.ts');
  for (const phrase of ['L’envoi attend une validation humaine', 'sans imputation définitive ni écriture validée', 'finalités, les moyens et les instructions', 'ne garantit pas l’absence de connexions', 'données et un périmètre comparables', 'sans passage obligatoire par un OCR', 'pas nécessairement inédit']) assert.ok(text.includes(phrase), phrase);
  assert.doesNotMatch(text, /Un cabinet, responsable du traitement de ses dossiers clients|Le résultat produit est nouveau à chaque exécution|un reliquat stable indique une règle qui tient/);
});

// Décision de Kevin du 06/10/2026 : plus de section Sources ; chaque source se cite par un lien sur un mot du texte.
test('chaque source de page se cite sur un mot du texte, sans composant de section', () => {
  const eeat = source('src/data/page-eeat.ts');
  assert.match(eeat, /\/\*\* Les mots du texte de la page qui portent le lien\. \*\/\s*mot: string;/);
  assert.match(source('src/pages/automatisation/[slug].astro'), /lierSources\(corps, eeatService\(entree\.id\)\.sources\)/);
  assert.doesNotMatch(eeat, /experience|ExperiencePremiereMain/);
});
