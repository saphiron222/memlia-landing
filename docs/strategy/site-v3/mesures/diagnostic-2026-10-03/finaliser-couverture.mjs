import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const base = dirname(fileURLToPath(import.meta.url));
const matrix = JSON.parse(readFileSync(join(base, 'couverture-skills.json'), 'utf8'));
matrix.slugs = ['utiliser-chatgpt-cabinet-comptable', 'verifier-reponse-ia-comptabilite', 'ia-comptabilite-confidentialite-donnees', 'automatiser-avec-ia-sans-changer-logiciel'];
matrix.releve = 'Livraison finale : complète le checkpoint initial sans effacer ses limites.';
matrix.conventions.briefs = 'État de la phase brief pour les quatre slugs ; rédaction/rendu/publication restent futurs. execute signifie contrôle de cette phase effectivement réalisé, pas invocation nominale complète du skill.';
matrix.attendus_absents_au_releve = [];
matrix.sources_lecture.catalogue = 'catalogue-hermes.json';
matrix.sources_lecture.extraction_union = 'lecture-skills.log';
matrix.sources_lecture.extraction_templates = 'lecture-templates.log';
matrix.preuves_existantes.DIAGNOSTIC = { fichiers: ['DIAGNOSTIC.md'], portee: 'Synthèse et limites §1–5 ; hypothèses et falsifiabilité §4, pas audit SEO global complet.' };
matrix.preuves_existantes.BRIEFS = { fichiers: ['BRIEFS-QUATRE-ARTICLES.md'], portee: 'Chaque section 1–4 nomme le slug, la requête, rôle/famille, intention, différenciation, plan, sources, assets, liens, maintenance ; mêmes contrôles pour chaque slug, pas contenus rédigés.' };
matrix.preuves_existantes.SERP = { fichiers: ['serp-2026-10-03.json'], portee: 'Quatre recherches réelles / 20 résultats du moteur Hermes ; aucun rang Google contrôlé ni volume.' };
matrix.preuves_existantes.BUILD = { fichiers: ['build-verification.log'], portee: 'npm run check : 0 erreur, 10 hints ; npm run build exit 0 sur le corpus existant, pas construction des quatre nouveaux articles.' };
matrix.limites_globales = matrix.limites_globales.filter((text) => !text.includes('de build,')).concat('Check et build du corpus existant exécutés ; quatre nouveaux articles, assets et recette navigateur non produits.');
matrix.preuves_existantes.GSC.fichiers.push('gsc-reverification-page.json', 'gsc-reverification-page-query.json', 'gsc-reverification-date.json');
matrix.preuves_existantes.INSPECT.fichiers.push('inspection-crm-reverification.json');
matrix.preuves_existantes.CRUX = { fichiers: ['crux-reverification.json'], portee: 'Requête CrUX réellement exécutée, sans données disponibles sur CRM. Pas score zéro.' };
const prepared = new Set(['blog', 'blog-brand', 'blog-brief', 'blog-calendar', 'blog-cannibalization', 'blog-cluster', 'blog-flow', 'blog-outline', 'blog-persona', 'blog-strategy', 'blog-taxonomy', 'seo-cluster', 'seo-content-brief', 'seo-flow', 'seo-plan', 'seo-sxo']);
const prescribed = new Set(['blog-factcheck', 'blog-geo', 'blog-google', 'blog-image', 'blog-schema', 'blog-seo-check', 'blog-style', 'seo', 'seo-audit', 'seo-content', 'seo-geo', 'seo-google', 'seo-image-gen', 'seo-images', 'seo-page', 'seo-schema', 'seo-sitemap', 'seo-technical']);
for (const entry of matrix.skills) {
  if (prepared.has(entry.skill)) {
    if (entry.skill === 'blog-cannibalization') entry.motif = 'Éviter le recouvrement des sujets IA avec prompt et logiciel IA du 29/09, le pilier, les compétences et la méthode commerciale.';
    entry.briefs = 'execute';
    entry.preuves = [...new Set([...entry.preuves, 'BRIEFS', 'SERP', 'DIAGNOSTIC'])];
    entry.limites = 'Phase cadrage/brief exécutée dans les quatre sections nommant les slugs. Aucun article, rendu, validation de sources finales ni publication attesté ; pas invocation nominale de tout le workflow.';
    entry.controle_restant = 'Reprendre le brief propre au slug, mesurer la requête au registre puis mettre à jour couverture et preuves aux phases rédaction/rendu/publication.';
  } else if (prescribed.has(entry.skill)) {
    entry.briefs = 'partiel';
    entry.preuves = [...new Set([...entry.preuves, 'BRIEFS', 'DIAGNOSTIC'])];
    entry.limites = 'Prescription de brief exécutée : sources, clarté, entités, images et hygiène selon la section du slug. Contrôle du contenu final/rendu/publication non exécuté.';
    entry.controle_restant = 'Exécuter les contrôles applicables sur le texte et les assets finaux ; sources sensibles et résultats de rejeu réels, revue normale puis preuve servie.';
  }
  if (entry.skill === 'blog-discourse') {
    entry.diagnostic = 'N/A'; entry.briefs = 'N/A'; entry.applicable = false;
    entry.motif = 'Aucune tendance récente des praticiens ni opinion sociale demandée : sélection par GSC, sources institutionnelles et intention de recherche. Le forum historique du manuel ne sert pas de discours des trente derniers jours.';
    entry.preuves = ['SERP', 'DIAGNOSTIC'];
    entry.limites = 'Pas de collecte 30 jours ni DISCOURSE, aucune actualité sociale ou engagement prétendu.';
    entry.controle_restant = 'Réévaluer si un angle de débat récent est réellement nécessaire, sans réactiver un canal externe.';
  }
  if (entry.skill === 'seo-dataforseo') {
    entry.diagnostic = 'N/A'; entry.briefs = 'N/A'; entry.applicable = false;
    entry.motif = 'Fournisseur optionnel non requis pour le besoin : recherche publique Hermes et GSC suffisent au cadrage, volumes restent ND. Aucun achat autorisé ni request payante.';
    entry.preuves = ['SERP', 'GSC']; entry.limites = 'Aucun appel DataForSEO ni volume/rang certifié.';
    entry.controle_restant = 'Conserver ND pour les mesures absentes ; ne pas dépenser pour cocher un outil.';
  }
  if (entry.skill === 'blog-rewrite') {
    entry.diagnostic = 'N/A'; entry.applicable = false;
    entry.motif = 'Diagnostic et quatre nouveaux briefs, pas réécriture mandatée. Les actions possibles sur corpus sont recommandées, non exécutées.';
    entry.preuves = ['DIAGNOSTIC'];
  }
  if (entry.skill === 'seo-unlighthouse') {
    entry.diagnostic = 'N/A'; entry.applicable = false;
    entry.motif = 'Fournisseur lab optionnel ; cette carte de diagnostic éditorial ne demande pas un crawl Lighthouse. Absence de performance reste une limite de seo-technical, pas un PASS.';
    entry.preuves = ['DIAGNOSTIC', 'CRUX'];
  }
  if (['blog-google', 'seo-google', 'seo-technical'].includes(entry.skill)) entry.preuves = [...new Set([...entry.preuves, 'CRUX'])];
  if (['blog-seo-check', 'seo-audit', 'seo-page', 'seo-schema', 'seo-sitemap', 'seo-technical'].includes(entry.skill)) entry.preuves = [...new Set([...entry.preuves, 'BUILD'])];
  if (['blog-audit', 'blog-cannibalization', 'blog-cluster', 'blog-strategy', 'seo-audit', 'seo-cluster', 'seo-plan', 'seo-sxo', 'blog-flow', 'seo-flow', 'blog-brand', 'blog-calendar', 'blog-persona', 'blog-taxonomy', 'blog-factcheck'].includes(entry.skill) && entry.diagnostic !== 'N/A') {
    entry.diagnostic = 'partiel';
    entry.preuves = [...new Set([...entry.preuves, 'DIAGNOSTIC', 'SERP', 'BRIEFS'])];
  }
}
matrix.templates.choix_provisoires = [
  { slug: matrix.slugs[0], template: 'how-to-guide', etat: 'retenu', controle: 'Choisir un premier usage et son essai, pas recopier une consigne de relance.' },
  { slug: matrix.slugs[1], template: 'how-to-guide', etat: 'retenu', controle: 'Checklist sortie/source/périmètre, pas certificat de vérité.' },
  { slug: matrix.slugs[2], template: 'how-to-guide', etat: 'retenu', controle: 'Préparer données et autorisation, CNIL et revue métier ; pas anonymisation garantie.' },
  { slug: matrix.slugs[3], template: 'how-to-guide', etat: 'retenu', controle: 'Fiche du passage entre outils ; réconcilier brief 08 sans second slug concurrent.' }
];
matrix.slugs.forEach((slug, index) => { matrix[`brief_${index + 1}`] = { slug, preuve: `BRIEFS-QUATRE-ARTICLES.md#${index + 1}`, controles: 'Requête, lecteur, famille, format, différence, plan, sources, preuves à rejouer, assets, sortants/entrants, schema, maintenance et test échec.' }; });
for (const entry of matrix.skills) {
  for (const key of ['limites', 'controle_restant']) entry[key] = entry[key].replaceAll('image_generate', 'le fournisseur de couverture prescrit par le runbook');
}
writeFileSync(join(base, 'couverture-livraison.json'), JSON.stringify(matrix, null, 2) + '\n');
const cell = (value) => String(value ?? 'non déclarée').replaceAll('|', '\\|').replaceAll('\n', ' ');
const finalView = [
  '# Couverture finale de la livraison — 03/10/2026',
  '',
  'Décision : 63 entrées documentées sans omission ; le checkpoint COUVERTURE-SKILLS.md reste historique. Cette vue et couverture-livraison.json sont les états à transmettre.',
  '',
  'execute dans briefs = phase de préparation exécutée dans les sections 1–4 de BRIEFS-QUATRE-ARTICLES.md ; pas invocation nominale complète, pas article produit. partiel = prescription rédigée mais contrôle final absent. Les trois a-executer sont blog-write, blog-analyze et blog-audit : rédaction et validation des futurs textes hors cette livraison.',
  '',
  'Preuves communes : DIAGNOSTIC.md, quatre sections nommant les slugs dans BRIEFS-QUATRE-ARTICLES.md, quatre recherches de serp-2026-10-03.json, exports GSC recontrôlés, copies HTML et sources. Chaque ligne vaut pour les quatre slugs sauf N/A individuel indiqué dans les briefs. Les preuves de rédaction, assets, rendu, revue et production devront être propres au candidat.',
  '',
  'N/A outil = fournisseur optionnel non utilisé, pas donnée métier mesurée à zéro. CrUX interrogé sans données CRM ; Lighthouse, backlinks et citations IA non mesurés. Les diagnostics globaux restent partiels.',
  '',
  '| Skill / chemin lu | Version propre | Applicable / motif | Diagnostic | Phase brief | Preuves | Limites / suite |',
  '|---|---|---|---|---|---|---|',
  ...matrix.skills.map((s) => `| ${cell(s.skill)} / ${cell(s.chemin_lu)} | ${cell(s.version)} | ${s.applicable ? 'oui' : 'N/A'} : ${cell(s.motif)} | ${cell(s.diagnostic)} | ${cell(s.briefs)} | ${cell(s.preuves.join(', '))} | ${cell(s.limites)} Suite : ${cell(s.controle_restant)} |`),
  '',
  '## Contrôle reproductible',
  '',
  '`node docs/strategy/site-v3/mesures/diagnostic-2026-10-03/verifier-livraison.mjs docs/strategy/site-v3/mesures/diagnostic-2026-10-03/couverture-livraison.json`',
  '',
  'Le vérificateur compare union catalogue/pack/pipeline, motifs et états, existence des preuves, exports et métadonnées du snapshot ; ses quatre mutations refusent omission, doublon, exécution sans preuve et motif vide. Il ne certifie ni la vérité métier du texte ni la publication. Lecture du fond dans la revue normale, pas une seconde revue SEO.',
  ''
].join('\n');
writeFileSync(join(base, 'COUVERTURE-LIVRAISON.md'), finalView);
console.log(JSON.stringify({ skills: matrix.skills.length, etatsBriefs: matrix.skills.reduce((acc, s) => { acc[s.briefs] = (acc[s.briefs] || 0) + 1; return acc; }, {}) }));
