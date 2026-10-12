import { readFileSync } from 'node:fs';
import { jourCadrageParis } from './blog-w39-framing.mjs';

// Source fermée du mandat : pas de flag de contournement fourni par le candidat.
const mandate = JSON.parse(readFileSync(new URL('./blog-w41-catchup.json', import.meta.url), 'utf8'));
const slugs = new Set(mandate.articles.map(({ slug }) => slug));
export const estSujetW41 = (slug) => slugs.has(slug);

/** Une archive acquise garde son jour réel ; ce prédicat n'atteste pas sa publication. */
export function estArchiveRattrapageW41(slug, date, today, serie = null) {
  return estSujetW41(slug) && serie !== 'cicatrices'
    && /^\d{4}-\d{2}-\d{2}$/.test(date ?? '') && date >= mandate.from && date <= today;
}

/** Seule la réservation du jour peut sortir de la cadence. */
export function estRattrapageW41(slug, date, serie = null, now = new Date()) {
  return estArchiveRattrapageW41(slug, date, jourCadrageParis(now), serie)
    && date === jourCadrageParis(now);
}

export function verifierJourW41(slug, date, serie, now = new Date()) {
  if (estSujetW41(slug) && date >= mandate.from
    && !estRattrapageW41(slug, date, serie, now)) {
    throw new Error('Rattrapage W41 : série ordinaire et jour réel de Paris requis.');
  }
}
