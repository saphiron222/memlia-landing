import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unitesRendues, IMAGE_REVIEW_CRITERIA } from '../../../scripts/blog-forge.mjs';
import { REVIEW_CRITERIA } from '../../../scripts/lib/blog-pipeline.mjs';
const dir = dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(readFileSync(join(dir, p), 'utf8'));
const recipe = read('recette.json');
const units = unitesRendues(readFileSync(join(dir, 'corps.md'), 'utf8'));
const subject = read('paquet-revue.json');
delete subject.notice;
const reviewer = 'metier:t_67cb2d6a';
const inventory = read('preuves/revue-metier-inventaire.json');
const probe = read('preuves/revue-metier-probe.json');
const criteria = {
  'intent-satisfaction': { result: 'PASS', observations: ['Trois checklists distinguent pièces, jalons et signature pour le lecteur administratif ; aucune décision de vigilance confiée à l’automatisation.'] },
  'serp-format-rankability': { result: 'PASS', observations: ['Guide exécutable et FAQ cohérents avec l’intention onboarding ; brief qualitatif et autocomplétion reçue, sans volume ni classement Google attestés.'] },
  'eeat-sources': { result: 'PASS', observations: ['Trois citations exactes contrôlées ; CMF confronté à la section officielle affichée au12/10/2026 et CNIL ouverte ; version et champ EC examinés.'] },
  'information-gain-proof': { result: 'FAIL', observations: ['F1 : les dix résultats nominaux concordent, mais la seule présence de decisionCabinet permet PRÉPARER LA PASSATION avec une décision hors dossier/version ; le sens favorable n’est pas défini. Trois contre-cas exécutés sont conservés dans preuves/revue-metier-probe.json.'] },
  'technical-onpage-seo': { result: 'PASS', observations: ['PASS limité à la fabrication : H1 unique et cinq tableaux complets dans des régions défilantes ; canonical, JSON-LD, OG, sitemap et CI restent à vérifier après matérialisation, pas acquis ici.'] },
  'ai-citability': { result: 'PASS', observations: ['Réponse directe, définitions de jalon/complétude, citations dans les paragraphes et quatre FAQ permettent une extraction bornée ; visibilité IA non mesurée.'] },
  'contextual-conversion': { result: 'PASS', observations: ['Clôture en nous/vous et Confier cette tâche vers /contact ; prise en charge dans les outils, essais par les équipes et décision conservée au cabinet.'] },
};
const reasoning = {
  'cmf-identification': 'L561-5,I distingue identification et vérification ; le IV ne concerne que la vérification sous conditions. Extrait exact dans la copie DILA et dans la section officielle affichée au12/10/2026 (preuve conservée). L561-2,12° confirme le champ EC dans le référentiel local ; aucune dérogation décidée automatiquement.',
  'cmf-relation': 'L561-5-1 prévoit objet/nature et actualisation pendant toute la relation ; la citation et la phrase d’actualisation concordent avec la copie DILA et la section officielle du12/10/2026. Le suivi de contexte est présenté comme méthode, pas comme diligence de vigilance suffisante.',
  'cnil-minimisation': 'La page officielle CNIL ouverte pendant cette revue porte exactement l’article5,1,c du RGPD. Le conseil de suivre les références/états plutôt que multiplier les copies est cohérent ; aucune durée universelle ou suppression des justificatifs requis n’en est déduite.',
};
const businessClaims = {};
const seen = new Map();
for (const c of recipe.claims) {
  const matched = units.filter(u => u.text.includes(c.unite));
  assert.equal(matched.length, 1);
  const id = matched[0].id;
  const n = (seen.get(id) || 0) + 1;
  seen.set(id, n);
  businessClaims[`claim-${id}-${n}`] = { verdict: 'soutient', reasoning: reasoning[c.sourceId] };
}
const imageCriteria = {
  'brief-six-components': { result: 'PASS', observations: ['Six composantes présentes dans le brief du candidat alternatif ; palette instrumentée conservée, pas déduite à l’œil. La pièce jointe opérateur a un brief distinct à reprendre selon N1.'] },
  'generation-constraints': { result: 'PASS', observations: ['Original du candidat concordant avec sa provenance OpenAI native ; recoloration locale déclarée. Modèle/coût non communiqués, aucun nom ou crédit supposé. Ce résultat ne vaut pas validation du choix contre la nouvelle instruction opérateur.'] },
  'fictive-provenance': { result: 'PASS', observations: ['Candidat et pièce jointe opérateur effectivement regardés : documents fictifs et pictogrammes génériques, aucune donnée réelle, marque ni texte lisible.'] },
  'recognizable-subject': { result: 'PASS', observations: ['Candidat : chemise ouverte, trois plateaux et tampon distinct, feuilles vierges. Pièce jointe demandée : quatre bacs, main au crayon, case en attente. Couvertures évocatrices, pas preuve de validation réglementaire.'] },
  'technical-derivatives': { result: 'PASS', observations: ['Dérivés WebP/AVIF/OG du candidat présents sur disque ; figures séparées1600×900 regardées et tailles21066/23478octets contrôlées. Dérivés et métadonnées de la pièce jointe opérateur restent à produire selon N1 ; aucune preuve de production revendiquée.'] },
  'alt-information': { result: 'PASS', observations: ['Alt actuel décrit correctement les trois plateaux et le tampon du candidat. À réécrire lors de l’adoption de la pièce jointe opérateur ; ne pas réutiliser cet alt pour une autre composition.'] },
};
for (const criterion of REVIEW_CRITERIA) assert.ok(criteria[criterion.id]);
for (const id of IMAGE_REVIEW_CRITERIA) assert.ok(imageCriteria[id]);
for (const name of ['hero-768.webp','hero-1200.webp','hero-1600.webp','hero-768.avif','hero-1200.avif','hero-1600.avif','hero-og.webp']) assert.ok(existsSync(join(dir, 'preuves', name)));
const figureCriteria = ['Écran d’outil crédible', 'Données fictives concrètes sans marque', 'Image autonome et article complet sans image', 'Ni étapes commentées ni slogan ni avertissement', 'Parenté visuelle avec le cadre relance-checklist regardé'];
const result = {
  subject, checkedAt: '2026-10-12', reviewer, verdict: 'FAIL', decision: 'corriger', blocking: true,
  scope: 'Paquet de fabrication local, non-Astro et non publié ; non scellable en l’état. Le FAIL ne transforme pas les contrôles publics futurs en défauts du fond.',
  editorial: { reviewer, criteria, p0: ['F1 — décision humaine pertinente et favorable non démontrée dans le rejeu'] },
  business: { reviewer, role: 'administratif-secretariat', claims: businessClaims },
  image: { reviewer, criteria: imageCriteria, reserves: ['N1 — instruction opérateur en cours de revue : utiliser la pièce jointe réelle et sa provenance, sans nouvelle génération.', 'Mouchetures du candidat alternatif : cosmétique non bloquante.'] },
  figures: ['onboarding-pieces','onboarding-jalons'].map(id => ({ id, reviewer, criteria: figureCriteria.map(critere => ({ critere, result: 'PASS' })), observation: id === 'onboarding-pieces' ? 'D-104 : bénéficiaire reçu mais à examiner ; séparation des états exacte.' : 'D-101 à valider, D-106 anomalieV1/V2, D-107 préparation seulement ; cohérence avec les cas nominaux, pas levée de F1.' })),
  sources: { reviewedBy: reviewer, observations: reasoning, preuves: ['preuves/revue-metier-cmf-section.md','preuves/revue-metier-inventaire.json','preuves/sources/cnil-minimisation.html'] },
  qualite: { reviewer, score: null, p0: ['F1'], verdict: 'FAIL de cohérence de preuve ; pas de score global inventé.', reservations: ['Revue qualitative du paquet exécutée ; barème qualité final, métadonnées publiques, CI et preuve servie non acquis.'] },
  skills: inventory.matrix,
  findings: [{ id: 'F1', evidence: 'preuves/revue-metier-probe.json', observedCases: probe.observations.length, references: ['rejouer.mjs:15','rejouer.mjs:20','corps.md:88','corps.md:90'], correction: 'Définir et éprouver une décision humaine favorable rattachée au dossier et à la version/périmètre ; refus/attente pour décision hors dossier, périmée, défavorable ou incomplète. Rejouer le cas favorable et conserver les cas nominaux, saisies et absence d’envoi.', liftCriterion: 'Aucun contre-cas ne prépare la passation ; cas favorable rattaché permet le parcours avec les autres validations. Prétraitement autorisé seulement avec contrat et preuve exécutée.' }],
  notes: [{ id: 'N1', blocking: false, observation: 'Couverture jointe opérateur et candidat alternatif distincts, chacun regardé. Reprendre la pièce jointe demandée avec son alt/brief/provenance/dérivés concordants ; pas de nouvelle revue juridique pour ce portage cosmétique.' }],
  remaining: ['Matérialisation/scellement natifs','Rendu Astro final et surfaces SEO publiques','Jour réel de réservation/publication','CI et reçu de production'],
  report: 'REVUE-METIER.md', rereview: 'F1 et critère de fini seulement ; constats acquis conservés pour le fond et les figures inchangés.'
};
writeFileSync(join(dir, 'revues.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ verdict: result.verdict, editorialCriteria: Object.keys(criteria).length, claims: Object.keys(businessClaims).length, imageCriteria: Object.keys(imageCriteria).length, figureCriteria: result.figures.map(f => ({ id: f.id, criteria: f.criteria.length })), score: result.qualite.score, blockingFindings: result.findings.map(f=>f.id) }, null, 2));
