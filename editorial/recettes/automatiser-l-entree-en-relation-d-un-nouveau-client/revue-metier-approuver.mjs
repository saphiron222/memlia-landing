import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewSha256, recipeSubstanceSha256, renderedBodySha256, reviewBindingErrors } from '../../../scripts/lib/blog-review-binding.mjs';
const dir = dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(readFileSync(join(dir, p), 'utf8'));
const proof = read('preuves/revue-metier-correction.json');
assert.equal(proof.verdict, 'PASS');
assert.equal(proof.articleCases, 15);
assert.equal(proof.targetedControls, 19);
for (const file of ['revues.json', 'REVUE-METIER.md']) {
  const backup = file === 'revues.json' ? 'revues-initiales.json' : 'REVUE-METIER-initiale.md';
  if (!existsSync(join(dir, backup))) writeFileSync(join(dir, backup), readFileSync(join(dir, file)));
}
const review = read('revues-initiales.json');
assert.equal(review.verdict, 'FAIL');
const body = readFileSync(join(dir, 'corps.md'), 'utf8').trim();
const recipeBytes = readFileSync(join(dir, 'recette.json'));
const html = readFileSync(join(dir, 'rendu-fabrication.html'), 'utf8');
review.subject = { slug: review.subject.slug, bodySha256: reviewSha256(body), recipeSha256: reviewSha256(recipeBytes), recipeSubstanceSha256: recipeSubstanceSha256(recipeBytes), renderedSha256: renderedBodySha256(html) };
assert.deepEqual(reviewBindingErrors(review, review.subject.slug, body, recipeBytes, html, process.cwd()), []);
review.verdict = 'PASS';
review.decision = 'approuver';
review.blocking = false;
review.scope = 'Re-revue ciblée F1 et fini du paquet de fabrication ; constats réglementaires et figures inchangés reportés, non-Astro et non publié. Ne vaut pas CI ou reçu de production.';
review.editorial.criteria['information-gain-proof'] = { result: 'PASS', observations: ['F1 levé par exécution indépendante :15 cas du corps et19 contrôles de décision dont hors dossier, ancienne version, non favorable, champ absent/blanc et cas favorable. Dix sorties nominales inchangées confrontées au paquet initial ; saisies protégées, déterminisme et aucun envoi/calcul de vigilance. preuves/revue-metier-correction.json.'] };
review.editorial.p0 = [];
const observations = {
  'brief-six-components': 'Six composantes présentes pour la pièce jointe N1 ; prompt historique préservé, cible hex locale explicitement distincte du prompt. Deux écarts de verts restent une note cosmétique, pas une conformité de palette revendiquée.',
  'generation-constraints': 'N1 levé : copie binaire exacte du fichier opérateur et de sa provenance, démontrée indépendamment. Aucune recoloration ; dérivés seuls redimensionnés/recadrés. Modèle et coût non communiqués.',
  'fictive-provenance': 'Dérivé1200 réellement regardé pendant cette re-revue : pictogrammes et lignes génériques, aucun nom, numéro, texte lisible ou marque identifiable ; source exacte confrontée à la pièce jointe.',
  'recognizable-subject': 'Quatre plateaux dont le dernier ocre vide, dossier vert ouvert, main au crayon sur une checklist : composition confirmée dans le dérivé regardé. Illustration, jamais preuve de diligence de vigilance.',
  'technical-derivatives': 'Sept dérivés WebP/AVIF/OG contrôlés présents et non vides ; dérivé1200 regardé. Les deux figures sont byte-identiques au paquet initial. Contrôles publics/production réservés à platform.',
  'alt-information': 'Alt actuel concordant avec le dérivé réellement regardé : main au crayon, dossier fictif, quatre plateaux dont un vide. Aucun pouvoir de décision attribué à cette illustration.',
};
for (const [id, observation] of Object.entries(observations)) review.image.criteria[id] = { result: 'PASS', observations: [observation] };
review.image.reserves = ['Palette : les mesures ne comptent pas les deux verts cibles ; écart cosmétique conservé, pas de PASS palette ni modification de garde.'];
review.figures[1].observation = 'Constat visuel acquis reporté, fichiers inchangés : D-101 à valider, D-106 anomalieV1/V2, D-107 préparation seulement ; résultats nominaux recontrôlés après correction F1.';
review.qualite.p0 = [];
review.qualite.verdict = 'PASS de cohérence du paquet après levée F1 ; score global non disponible, CI et publication non vérifiées.';
review.findings = [{ ...review.findings[0], status: 'leve', evidence: 'preuves/revue-metier-correction.json', observedCases: proof.targetedControls, references: ['rejouer.mjs:15-23', 'corps.md:90', 'corps.md:110-128'], observation: 'Chaque contre-cas refuse/attend ; seule la décision favorable complète sur le dossier/version courants prépare la passation avec les autres validations.' }];
review.notes = [{ id: 'N1', blocking: false, status: 'applique', observation: 'Pièce jointe opérateur et provenance exactes ; alt/brief/dérivés concordants. Palette mesurée avec deux écarts cosmétiques explicitement conservés.' }];
review.history = [{ verdict: 'FAIL', checkedAt: '2026-10-12', report: 'REVUE-METIER-initiale.md', review: 'revues-initiales.json', evidence: 'preuves/revue-metier-probe.json' }];
review.correction = { scope: 'F1, N1 et fini seulement', evidence: 'preuves/revue-metier-correction.json', report: 'REVUE-METIER.md', articleCases: proof.articleCases, targetedControls: proof.targetedControls, acquiredObservationsPreserved: true };
writeFileSync(join(dir, 'revues.json'), JSON.stringify(review, null, 2) + '\n');
console.log(JSON.stringify({ verdict: review.verdict, blocking: review.blocking, editorialCriteria: Object.keys(review.editorial.criteria).length, claims: Object.keys(review.business.claims).length, imageCriteria: Object.keys(review.image.criteria).length, independentControls: proof.targetedControls, historyPreserved: true, bindingErrors: [] }, null, 2));
