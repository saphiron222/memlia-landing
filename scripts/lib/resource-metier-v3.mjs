import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Référence exhaustive des 15 assertions additionnelles identifiées en R2.
export const ADDITIONAL_UNITS = [
  ['dsn', 'commonConfusion', null],
  ['dsn-val', 'commonConfusion', null],
  ['compte-rendu-metier-dsn', 'commonConfusion', null],
  ['annule-et-remplace-dsn', 'commonConfusion', 'annule-et-remplace-dsn'],
  ['donnee-personnelle', 'context', 'donnee-personnelle'],
  ['donnee-personnelle', 'exampleFictitious', 'pseudonymisation'],
  ['donnee-personnelle', 'commonConfusion', 'pseudonymisation'],
  ['minimisation-des-donnees', 'context', null],
  ['minimisation-des-donnees', 'commonConfusion', 'minimisation-des-donnees'],
  ['anonymisation', 'context', null],
  ['anonymisation', 'commonConfusion', 'pseudonymisation'],
  ['pseudonymisation', 'context', 'pseudonymisation'],
  ['pseudonymisation', 'commonConfusion', 'pseudonymisation'],
  ['agregat-non-nominatif', 'commonConfusion', null],
  ['recouvrement-amiable', 'commonConfusion', 'recouvrement-amiable'],
];

export function expandV3Evidence({ root, glossary, entries, sources, official, checkedAt }) {
  for (const [slug, field, reference] of ADDITIONAL_UNITS) {
    const block = glossary.split(`...common, id: '${slug}'`)[1]?.split('...common, id:')[0];
    const text = block?.match(new RegExp(`${field}: '([^']+)'`))?.[1];
    if (!text) throw new Error(`Champ supplémentaire absent : ${slug}:${field}`);
    const spec = reference ? structuredClone(official[reference]) : null;
    if (reference === 'pseudonymisation') spec.citations.push('Les données concernées conservent donc un caractère personnel. L’opération de pseudonymisation est également réversible, contrairement à l’anonymisation.');
    if (reference === 'donnee-personnelle') spec.citations.push('Une personne physique peut être identifiée : directement (exemple : nom et prénom); indirectement (exemple : par un numéro de téléphone ou de plaque d’immatriculation).');
    if (reference === 'annule-et-remplace-dsn') spec.citations.push("Si la déclaration « annule et remplace » concerne un signalement d'événement, il n’y a pas de date limite à son envoi (envoi de la déclaration « annule et remplace » dès que nécessaire).");
    const base = entries.find((entry) => entry.id === `T-DEF-${slug.toUpperCase()}`);
    const id = `${slug}-${field}`;
    if (slug === 'recouvrement-amiable' && field === 'commonConfusion') {
      const [doctrine, officialText] = text.split(/(?<=\.) (?=Une relance)/);
      if (!doctrine?.startsWith('Convention Memlia :') || !officialText) throw new Error(`Sous-claims recouvrement non atomiques : ${id}`);
      entries.push({
        ...base,
        id: `T-EXTRA-${id}-doctrine`,
        unitId: `unit-t-${id}`,
        claimId: `claim-t-${id}-doctrine`,
        text: doctrine,
        unitText: text,
        contentLocator: `${slug}:${field}:doctrine-memlia`,
        sourceId: 'source-glossary-memlia',
        type: 'methode-memlia',
        applicability: 'Convention interne Memlia appliquée à la préparation des relances du cabinet.',
        regime: 'Doctrine Memlia, sans portée réglementaire autonome.',
        exceptions: 'Le cabinet décide selon le statut réel du dossier ; cette doctrine ne qualifie pas juridiquement la créance.',
        citations: [{ id: `citation-t-${id}-doctrine-1`, text: doctrine, locator: `${slug}:${field}:doctrine-memlia` }],
      });
      entries.push({
        ...base,
        id: `T-EXTRA-${id}-sequence`,
        unitId: `unit-t-${id}`,
        claimId: `claim-t-${id}-sequence`,
        text: officialText,
        unitText: text,
        contentLocator: `${slug}:${field}:sequence-relance`,
        sourceId: spec.sourceId,
        type: spec.type,
        applicability: spec.applicability,
        regime: spec.regime,
        exceptions: spec.exceptions,
        citations: spec.citations.map((citation, i) => ({ id: `citation-t-${id}-sequence-${i + 1}`, text: citation, locator: `${slug}:${field}:sequence-relance` })),
      });
      continue;
    }
    if (!spec && !text.startsWith('Convention Memlia :')) throw new Error(`Convention non bornée : ${id}`);
    entries.push({ ...base, id: `T-EXTRA-${id}`, unitId: `unit-t-${id}`, claimId: `claim-t-${id}`, text,
      contentLocator: `${slug}:${field}`, sourceId: spec?.sourceId ?? 'source-glossary-memlia',
      type: spec?.type ?? 'methode-memlia',
      applicability: spec?.applicability ?? 'Convention interne Memlia appliquée au suivi du cabinet décrit.',
      regime: spec?.regime ?? 'Doctrine Memlia, sans portée réglementaire autonome.',
      exceptions: spec?.exceptions ?? 'Ne constitue pas une règle juridique ni une garantie de conformité.',
      citations: (spec?.citations ?? [text]).map((text, i) => ({ id: `citation-t-${id}-${i + 1}`, text, locator: `${slug}:${field}` })),
    });
  }
  const summariesPath = 'src/data/resource-summaries.json';
  sources['source-summaries-memlia'] = { ...sources['source-glossary-memlia'],
    id: 'source-summaries-memlia', title: 'Doctrine des résumés du Hub', snapshotPath: summariesPath,
    url: `file://${summariesPath}`, requestedUrl: `file://${summariesPath}`, finalUrl: `file://${summariesPath}`, upstreamUrl: `file://${summariesPath}`, checkedAt,
  };
  const summaries = JSON.parse(readFileSync(join(root, summariesPath), 'utf8'));
  const dsn = entries.find((entry) => entry.id === 'H-DSN-DEADLINE-SUMMARY');
  const social = entries.find((entry) => entry.id === 'H-SOCIAL-MONITORING-SUMMARY');
  entries.splice(entries.indexOf(dsn), 1);
  entries.splice(entries.indexOf(social), 1);
  const specifications = [
    [dsn, summaries['controler-les-bulletins-de-paie-avant-la-dsn'], [
      null,
      { ...official['annule-et-remplace-dsn'], citations: [dsn.citations[0].text] },
      { ...official['annule-et-remplace-dsn'], citations: [dsn.citations[1].text], applicability: 'Signalements d’événement en DSN.', regime: 'Annule-et-remplace de signalement, et non DSN mensuelle.', exceptions: 'Ne pas appliquer cette absence de limite à la DSN mensuelle.' },
      official['dsn-val'],
      { ...official['compte-rendu-metier-dsn'], citations: [official['compte-rendu-metier-dsn'].citations[0]] },
    ]],
    [social, summaries['suivre-la-production-sociale-dans-excel'], [null, ...[0, 2, 1].map((i) => ({ ...social, citations: [social.citations[i].text] }))]],
  ];
  for (const [base, parts, specs] of specifications) {
    if (parts.length !== specs.length) throw new Error(`Résumé incomplet : ${base.id}`);
    parts.forEach((text, i) => {
      const spec = specs[i];
      const claimId = `${base.claimId}-${i + 1}`;
      entries.push({ ...base, text, unitText: parts.join(' '), claimId,
        contentPath: summariesPath, contentLocator: `${base.id}:${i + 1}`,
        sourceId: spec?.sourceId ?? 'source-summaries-memlia', type: spec?.type ?? 'methode-memlia',
        applicability: spec?.applicability ?? 'Méthode ou doctrine propre au service Memlia décrit.',
        regime: spec?.regime ?? 'Doctrine Memlia, sans portée réglementaire autonome.',
        exceptions: spec?.exceptions ?? 'Les règles DSN et CNIL sont séparées dans les autres sous-claims.',
        citations: (spec?.citations ?? [text]).map((text, j) => ({ id: `citation-${claimId}-${j + 1}`, text, locator: spec?.sourceId ?? 'Doctrine Memlia' })),
      });
    });
  }
}
