import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expandV3Evidence } from './resource-metier-v3.mjs';

const REPORT = 'docs/qa/hub-ressources/metier-fix-a.md';

const SOURCE_SPECS = {
  'source-net-dsn-overview': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'DSN-INFO : La déclaration Sociale Nominative (DSN)',
    url: 'https://www.net-entreprises.fr/tableau-de-bord-dsn/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-overview.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-net-dsn-val': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'Outils d’auto-contrôle Dsn-Val et brique de contrôle',
    url: 'https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-val.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-net-crm': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'Les Comptes Rendus Métiers DSN',
    url: 'https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-crm.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-net-annule': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'Annule et remplace DSN mensuelle et signalements',
    url: 'https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-annule.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-donnee': {
    publisher: 'CNIL', title: 'Donnée personnelle',
    url: 'https://www.cnil.fr/fr/definition/donnee-personnelle',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-donnee.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-rgpd': {
    publisher: 'CNIL', title: 'CHAPITRE II - Principes',
    url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-rgpd.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-anonymisation': {
    publisher: 'CNIL', title: 'L’anonymisation de données personnelles',
    url: 'https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-anonymisation.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-service-public-recouvrement': {
    publisher: 'Service-Public Entreprendre', title: 'Recouvrement amiable : relance et mise en demeure de payer',
    url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F38586',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/service-public-recouvrement.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-controle-activite': {
    publisher: 'CNIL', title: 'Travail, ressources humaines : le contrôle de l’activité des personnes employées',
    url: 'https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-controle-activite.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-glossary-memlia': {
    publisher: 'Memlia', title: 'Vocabulaire et contrats Memlia',
    url: 'file://src/data/glossary.ts', snapshotPath: 'src/data/glossary.ts',
    level: 'original-method', provenance: 'primary', official: false,
  },
  'source-hub-memlia': {
    publisher: 'Memlia', title: 'Positionnement éditorial du Hub Ressources',
    url: 'file://src/pages/ressources.astro', snapshotPath: 'src/pages/ressources.astro',
    level: 'original-method', provenance: 'primary', official: false,
  },
};

const OFFICIAL = {
  dsn: {
    sourceId: 'source-net-dsn-overview', type: 'dsn',
    citations: ['La DSN – Déclaration Sociale Nominative – est obligatoire pour toutes les entreprises du secteur privé ainsi qu’à la Fonction publique. Elle remplace à ce jour près de 80 procédures et a vocation à supprimer encore des formalités qui s’appuient sur les données de paie.'],
    applicability: 'Entreprises du secteur privé et fonction publique concernées par la DSN en France.',
    regime: 'Déclaration sociale nominative française et formalités qu’elle remplace.',
    exceptions: 'Les déclarations et signalements couverts par la DSN conservent leurs règles propres.',
  },
  'dsn-val': {
    sourceId: 'source-net-dsn-val', type: 'dsn',
    citations: ['L’outil de contrôle Dsn-Val permet de tester votre fichier DSN avant de le déposer. Les contrôles effectués portent sur le cahier technique et le journal de maintenance de la norme (JMN) associé.'],
    applicability: 'Fichiers DSN contrôlés avant dépôt, selon le cahier technique et le JMN applicables.',
    regime: 'Contrôle de norme DSN selon le cahier technique et le JMN applicables au fichier.',
    exceptions: 'Un contrôle de norme ne prouve pas l’exactitude métier des variables de paie.',
  },
  'compte-rendu-metier-dsn': {
    sourceId: 'source-net-crm', type: 'dsn',
    citations: [
      'Un Compte Rendu Métier (CRM) est un rapport permettant à l’organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu’une erreur ou suspicion d’erreur est détectée. Il est donc important de prendre en compte ces retours.',
      'Suite à cette analyse, chaque organisme destinataire de vos DSN vous met à disposition un « Compte Rendu Métier (ou CRM) » sur votre tableau de bord, pour vous préciser vos anomalies ou vous confirmer la qualité de vos déclarations.',
    ],
    applicability: 'Déclarations reçues et analysées par les organismes destinataires.',
    regime: 'Comptes rendus métier émis par les organismes destinataires d’une DSN.',
    exceptions: 'Les CRM diffèrent selon l’organisme ; leur silence ne garantit pas la justesse générale.',
  },
  'annule-et-remplace-dsn': {
    sourceId: 'source-net-annule', type: 'dsn',
    citations: ["Concernant la DSN mensuelle, celle-ci peut faire l'objet d' « annule et remplace » tant que l'échéance d'envoi retenue pour votre entreprise n'est pas dépassée (5 ou 15 du mois suivant)."],
    applicability: 'DSN mensuelle dans la fenêtre propre à l’échéance de l’entreprise.',
    regime: 'DSN mensuelle annule-et-remplace, distincte des signalements d’événement.',
    exceptions: 'Les signalements d’événement suivent une autre fenêtre, explicitée près du claim dans le glossaire.',
  },
  'donnee-personnelle': {
    sourceId: 'source-cnil-donnee', type: 'legal-reglementaire',
    citations: ['Une donnée personnelle est toute information se rapportant à une personne physique identifiée ou identifiable.'],
    applicability: 'Informations se rapportant à une personne physique identifiée ou identifiable.',
    regime: 'Définition des données à caractère personnel au sens du RGPD.',
    exceptions: 'L’identification peut être directe ou indirecte ; retirer le nom ne suffit pas nécessairement.',
  },
  'minimisation-des-donnees': {
    sourceId: 'source-cnil-rgpd', type: 'legal-reglementaire',
    citations: ['adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées (minimisation des données);'],
    applicability: 'Traitements de données à caractère personnel, au regard de finalités déterminées.',
    regime: 'Principe de minimisation des données prévu par le RGPD.',
    exceptions: 'Le nécessaire s’apprécie selon la finalité ; une collecte « au cas où » n’est pas justifiée.',
  },
  anonymisation: {
    sourceId: 'source-cnil-anonymisation', type: 'legal-reglementaire',
    citations: ['L’anonymisation est un traitement qui consiste à utiliser un ensemble de techniques de manière à rendre impossible, en pratique, toute identification de la personne par quelque moyen que ce soit et de manière irréversible.'],
    applicability: 'Jeu de données dont l’irréversibilité pratique doit être démontrée.',
    regime: 'Qualification d’anonymisation selon les critères exposés par la CNIL.',
    exceptions: 'Pseudonymisation et agrégation trop fine ne suffisent pas à établir l’anonymat.',
  },
  pseudonymisation: {
    sourceId: 'source-cnil-anonymisation', type: 'legal-reglementaire',
    citations: ["La pseudonymisation est un traitement de données personnelles réalisé de manière à ce qu'on ne puisse plus attribuer les données relatives à une personne physique sans information supplémentaire."],
    applicability: 'Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.',
    regime: 'Pseudonymisation de données personnelles au sens du RGPD.',
    exceptions: 'Les données restent personnelles et l’opération est réversible.',
  },
  'recouvrement-amiable': {
    sourceId: 'source-service-public-recouvrement', type: 'legal-reglementaire',
    citations: ["Elle peut d'abord essayer de recouvrer ses impayés de façon amiable sans engager une action judiciaire. Cela se traduit généralement par une relance puis, en cas d'échec, par une mise en demeure."],
    applicability: 'Entreprise créancière confrontée à un retard de paiement client.',
    regime: 'Recouvrement amiable d’une créance professionnelle avant action judiciaire.',
    exceptions: 'La relance et la mise en demeure sont distinctes ; aucun envoi automatique sans validation.',
  },
};

function extractDefinitions(source) {
  const entries = [...source.matchAll(/\.\.\.common, id: '([^']+)'[\s\S]*?definition: '([^']+)'/g)]
    .map((match) => ({ slug: match[1], text: match[2] }));
  if (entries.length !== 23) throw new Error(`Inventaire T incomplet : 23 définitions attendues, ${entries.length} trouvées.`);
  return entries;
}

function extractSummary(source, path) {
  const summary = source.match(/^resume: "(.+)"$/m)?.[1];
  if (!summary) throw new Error(`Résumé introuvable dans ${path}.`);
  return summary;
}

export function loadMetierEvidence(root, checkedAt) {
  const glossaryPath = 'src/data/glossary.ts';
  const resourcesPath = 'src/pages/ressources.astro';
  const dsnArticlePath = 'src/content/blog/controler-les-bulletins-de-paie-avant-la-dsn.md';
  const socialArticlePath = 'src/content/blog/suivre-la-production-sociale-dans-excel.md';
  const glossary = readFileSync(join(root, glossaryPath), 'utf8');
  const resources = readFileSync(join(root, resourcesPath), 'utf8');
  const dsnArticle = readFileSync(join(root, dsnArticlePath), 'utf8');
  const socialArticle = readFileSync(join(root, socialArticlePath), 'utf8');
  const hubDescription = 'Des ressources pour comprendre, vérifier et cadrer les tâches d’un cabinet, sans céder la décision humaine.';
  if (!resources.includes(hubDescription)) throw new Error('Claim H-DESCRIPTION absent de la page Ressources.');

  const sources = Object.fromEntries(Object.entries(SOURCE_SPECS).map(([id, source]) => [id, {
    id, ...source, checkedAt,
    requestedUrl: source.url,
    finalUrl: source.url,
    upstreamUrl: source.url,
    verificationEvidenceRef: `${REPORT}#verification-des-sources`,
    classificationEvidenceRef: `${REPORT}#classification-des-sources`,
  }]));

  const entries = extractDefinitions(glossary).map(({ slug, text }) => {
    const official = OFFICIAL[slug];
    const sourceId = official?.sourceId ?? 'source-glossary-memlia';
    const citations = official?.citations ?? [text];
    return {
      id: `T-DEF-${slug.toUpperCase()}`,
      surface: 'T', unitId: `unit-t-${slug}`, claimId: `claim-t-${slug}`,
      text, type: official?.type ?? 'methode-memlia', sourceId,
      citations: citations.map((citation, index) => ({
        id: `citation-t-${slug}-${index + 1}`, text: citation, locator: sources[sourceId].title,
      })),
      contentPath: glossaryPath, contentLocator: `${slug}:definition`,
      applicability: official?.applicability ?? 'Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.',
      regime: official?.regime ?? 'Convention de vocabulaire ou contrat technique propre au service Memlia décrit.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: official?.exceptions ?? 'La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.',
    };
  });

  entries.push(
    {
      id: 'H-DESCRIPTION', surface: 'H', unitId: 'unit-h-description', claimId: 'claim-h-description',
      text: hubDescription, type: 'positionnement', sourceId: 'source-hub-memlia',
      citations: [{ id: 'citation-h-description-1', text: hubDescription, locator: 'description' }],
      contentPath: resourcesPath, contentLocator: 'description',
      applicability: 'Promesse éditoriale du Hub ; elle décrit la posture des ressources.',
      regime: 'Positionnement éditorial Memlia, sans portée réglementaire autonome.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: 'Les résumés réglementaires rendus par le Hub possèdent leurs propres claims et preuves.',
    },
    {
      id: 'H-DSN-DEADLINE-SUMMARY', surface: 'H', unitId: 'unit-h-dsn-deadline-summary', claimId: 'claim-h-dsn-deadline-summary',
      text: extractSummary(dsnArticle, dsnArticlePath), type: 'dsn', sourceId: 'source-net-annule',
      citations: [
        { id: 'citation-h-dsn-deadline-1', text: 'L\'échéance de dépôt des DSN "annule et remplace" est située la veille du jour de l\'échéance à minuit.', locator: 'Annule et remplace DSN mensuelle et signalements' },
        { id: 'citation-h-dsn-deadline-2', text: "Si la déclaration « annule et remplace » concerne un signalement d'événement, il n’y a pas de date limite à son envoi (envoi de la déclaration « annule et remplace » dès que nécessaire).", locator: 'Annule et remplace DSN mensuelle et signalements' },
      ],
      contentPath: dsnArticlePath, contentLocator: 'frontmatter.resume',
      applicability: 'DSN mensuelle annule-et-remplace ; échéance propre à l’entreprise, le 5 ou le 15.',
      regime: 'DSN mensuelle annule-et-remplace, distincte des signalements d’événement.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: 'Le résumé visible précise que les signalements d’événement suivent une autre fenêtre.',
    },
    {
      id: 'H-SOCIAL-MONITORING-SUMMARY', surface: 'H', unitId: 'unit-h-social-monitoring-summary', claimId: 'claim-h-social-monitoring-summary',
      text: extractSummary(socialArticle, socialArticlePath), type: 'legal-reglementaire', sourceId: 'source-cnil-controle-activite',
      citations: [
        { id: 'citation-h-social-1', text: 'Pour être licite (c’est-à-dire autorisé par la loi), un dispositif de contrôle de l’activité du personnel doit cumulativement : satisfaire aux tests de justification et de proportionnalité ; être soumis aux instances représentatives du personnel selon les règles en vigueur ; être porté à la connaissance des salariés/agents.', locator: 'Conditions cumulatives, formulation du 16/09/2026' },
        { id: 'citation-h-social-2', text: "Dans le cadre du dialogue social, l'employeur doit consulter : le conseil social et économique (CSE) dans les entreprises privées de 50 salariés et plus, les établissements publics à caractère industriel et commercial et les établissements publics à caractère administratif lorsqu'ils emploient du personnel dans les conditions du droit privé ; le comité social d’administration, territorial ou d’établissement (CSA, CST et CSE) ou leurs formations spécialisées dans les organismes publics.", locator: 'Condition n°2' },
        { id: 'citation-h-social-3', text: "Le dispositif doit être porté à la connaissance des personnes concernées, préalablement à sa mise en place, pour satisfaire aux obligations de loyauté et d’information qui incombent à l'employeur.", locator: 'Condition n°3' },
      ],
      contentPath: socialArticlePath, contentLocator: 'frontmatter.resume',
      applicability: 'Dispositif qui permet le contrôle de l’activité du personnel ; consultation CSE formulée ici pour les entreprises privées de 50 salariés et plus.',
      regime: 'Contrôle de l’activité du personnel et consultation du CSE dans le secteur privé.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: 'La qualification dépend du dispositif ; les exceptions légales et les autres instances du secteur public ne sont pas généralisées au Hub.',
    },
  );

  expandV3Evidence({ root, glossary, entries, sources, official: OFFICIAL, checkedAt });
  if (new Set(entries.map((entry) => entry.unitId)).size !== 41) throw new Error('41 unités métier sont obligatoires.');
  for (const entry of entries) {
    if (!readFileSync(join(root, entry.contentPath), 'utf8').includes(entry.text)) throw new Error(`Claim non rendu dans sa source : ${entry.id}`);
    const snapshot = readFileSync(join(root, sources[entry.sourceId].snapshotPath), 'utf8');
    for (const citation of entry.citations) if (!snapshot.includes(citation.text)) throw new Error(`Citation absente de la copie : ${citation.id}`);
  }
  return { contractRevision: 3, checkedAt, sources, entries };
}
