import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const W39_SLUG = 'tests-verts-et-regle-des-trois-passes';
export const W39_FRAMING_PATH = 'docs/strategy/site-v3/w39-cadrage-operateur.json';
const EXPECTED = Object.freeze({
  version: 1, kind: 'w39-operator-framing', owner: 'default',
  operatorTask: 't_73628f94', preparationTask: 't_f94d562f', slug: W39_SLUG,
  editorialWeek: '2026-W39',
  signedBodySha256: '76ffb89670b44fa9acecc86b709546f3044b10e8bf3e9288a1b0e9e0fa5e5e3b',
  timezone: 'Europe/Paris', validFrom: '2026-10-01', validThrough: '2026-10-04', maxPublications: 1,
  authorityReferences: [
    'docs/MEMLIA-BLOG-RATTRAPAGE-W39-2026-09-27.md §1/Clarification (Kevin 27/09/2026)',
    'AGENTS.md §Corriger les erreurs systémiques (Kevin 28/09/2026)',
    'AGENTS.md:204-221 §Publication autonome du blog (Kevin 29/09/2026)',
  ],
});

export function jourCadrageParis(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Ce reçu privé n'est ni une QA, ni une signature Kevin, ni une permission de publication. */
export function lireCadrageW39(root, date, now = new Date()) {
  try {
    if (!root) throw new Error('racine explicite requise');
    const receipt = JSON.parse(readFileSync(join(root, W39_FRAMING_PATH), 'utf8'));
    if (!receipt || Array.isArray(receipt) || typeof receipt !== 'object'
      || JSON.stringify(Object.keys(receipt).sort()) !== JSON.stringify(Object.keys(EXPECTED).sort())) {
      throw new Error('schéma divergent');
    }
    for (const [key, value] of Object.entries(EXPECTED)) {
      if (JSON.stringify(receipt[key]) !== JSON.stringify(value)) throw new Error(`${key} divergent`);
    }
    const today = jourCadrageParis(now);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')
      || date < receipt.validFrom || date > receipt.validThrough
      || today < receipt.validFrom || today > receipt.validThrough) throw new Error('fenêtre dépassée ou date non cadrée');
    const raw = readFileSync(join(root, 'editorial/recettes', W39_SLUG, 'corps.md'));
    if (createHash('sha256').update(raw).digest('hex') !== receipt.signedBodySha256) {
      throw new Error('corps brut signé divergent');
    }
    return receipt;
  } catch (error) {
    throw new Error(`Le rattrapage W39 s'arrête au 29/09/2026 sans cadrage opérateur courant ; nouveau cadrage requis pour ${date} (${error.message}).`);
  }
}

/** Toute occurrence du slug appartient au même lot, même si sa date réelle tombe en W40. */
export function estReliquatW39(slug) {
  return slug === W39_SLUG;
}

/** Exclure l'entrée courante du comptage ne doit pas masquer son identité divergente. */
export function verifierIdentiteW39(recette, current, date) {
  if (recette?.slug !== W39_SLUG || recette?.serie !== 'cicatrices' || recette?.date !== date) {
    throw new Error('W39 exige la recette du slug exact, série cicatrices et date cohérente.');
  }
  if (current && (current.slug !== recette.slug || current.serie !== recette.serie || current.date !== recette.date)) {
    throw new Error('W39 exige une entrée de file cohérente avec la recette (slug, série, date).');
  }
}
