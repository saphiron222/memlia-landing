import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

// Conservation des deux articles déjà publiés, pas une autorisation de publication.
// Autorite re-pointee le 16/09/2026 : la production a avance avec la release de l'article 3.
export const PUBLISHED_BLOG_COMMIT = 'de3d821c2935c35032f2417379392828f43bf84e';
export const PUBLISHED_BLOG_HASHES = Object.freeze({
  'controler-les-bulletins-de-paie-avant-la-dsn': '4c36eb08c035c10a78ae83de9776a64526ca72d5758b72ed7bf98f3f976d2a79',
  'suivre-la-production-sociale-dans-excel': '56a5f5a1e19cd327558d8c024b3570643bc2f233cfce02d117c0ca250430103b',
});
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const ADOPTION_PATH = 'preuves/published-adoption.json';
export function dossierFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlink interdit dans le dossier : ${path}`);
    return entry.isDirectory() ? dossierFiles(join(directory, entry.name), `${path}/`) : [path];
  }).sort();
}

export function validatePublishedAdoption(dossier, manifest, articleHash) {
  const errors = [];
  const slug = manifest?.slug;
  if (!PUBLISHED_BLOG_HASHES[slug] || articleHash !== PUBLISHED_BLOG_HASHES[slug]) errors.push('Autorité publiée : octets non autorisés par la production courante.');
  if (manifest?.editorialStatus !== 'publie-non-atteste' || manifest?.author !== 'kevin') errors.push('Autorité publiée : statut ou auteur divergent.');
  if (manifest?.publicationEvidence !== ADOPTION_PATH) errors.push('Autorité publiée : reçu d’adoption obligatoire.');
  try {
    const proof = JSON.parse(readFileSync(join(dossier, ADOPTION_PATH)));
    if (proof.version !== 1 || proof.kind !== 'published-dossier-adoption' || proof.commit !== PUBLISHED_BLOG_COMMIT
      || proof.articleSha256 !== articleHash || proof.candidateSlug !== slug || proof.adoptedBy !== 'marketing'
      || proof.publicationAuthorized !== false || proof.newSourceFetch !== false || proof.businessAttestation !== false
      || proof.evidenceVerifiedAt !== manifest.evidenceVerifiedAt || proof.publishedSourceReviewDate !== manifest.sourcesVerifiedAt) {
      errors.push('Autorité publiée : identité, provenance ou limites du reçu divergentes.');
    }
    const paths = dossierFiles(dossier).filter((path) => path !== ADOPTION_PATH);
    if (JSON.stringify(paths) !== JSON.stringify(proof.files?.map((row) => row.path))) errors.push('Autorité publiée : inventaire de dossier incomplet ou divergent.');
    const inheritedPaths = paths.filter((path) => path.startsWith('preuves/inherited/') && path.endsWith('.json') && path !== 'preuves/inherited/manifest.json');
    if (JSON.stringify(inheritedPaths) !== JSON.stringify(proof.adoptedEvidence?.map((row) => row.originalPath))) errors.push('Autorité publiée : inventaire des preuves héritées incomplet ou divergent.');
    for (const row of proof.files ?? []) {
      if (!paths.includes(row.path)) continue;
      const bytes = readFileSync(join(dossier, row.path));
      if (row.sha256 !== sha256(bytes) || row.bytes !== bytes.length) errors.push(`Autorité publiée : hash de dossier divergent (${row.path}).`);
    }
    // Chaque preuve reprise garde l’original exact. Aucun changement de date de collecte.
    for (const row of proof.adoptedEvidence ?? []) {
      if (!paths.includes(row.path) || !paths.includes(row.originalPath) || !row.originalPath.startsWith('preuves/inherited/')) {
        errors.push('Autorité publiée : provenance héritée invalide.');
        continue;
      }
      const originalBytes = readFileSync(join(dossier, row.originalPath));
      const original = JSON.parse(originalBytes);
      const adopted = JSON.parse(readFileSync(join(dossier, row.path)));
      if (sha256(originalBytes) !== row.originalSha256 || original.checkedAt !== adopted.checkedAt) {
        errors.push(`Autorité publiée : date/provenance historique modifiée (${row.path}).`);
      }
      // Seuls les liens vers le candidat changent, jamais le résultat historique.
      const normalize = (value) => {
        if (Array.isArray(value)) return value.map(normalize);
        if (!value || typeof value !== 'object') return value;
        return Object.fromEntries(Object.entries(value).filter(([key]) => !['articleSha256', 'manifestSha256'].includes(key)).map(([key, child]) => [key, normalize(child)]));
      };
      const expected = normalize(original);
      const actual = normalize(adopted);
      delete actual.adoption;
      if (row.path === 'claims.json') {
        // Les unités décrivent les octets publiés ; les claims et citations restent hérités.
        for (const claim of actual.claims ?? []) {
          const previous = original.claims?.find((item) => item.id === claim.id);
          const oldUnit = original.contentUnits?.find((item) => item.id === previous?.unitId);
          const newUnit = adopted.contentUnits?.find((item) => item.id === claim.unitId);
          if (!oldUnit || !newUnit || (oldUnit.text !== newUnit.text && oldUnit.text.replaceAll('13 septembre 2026', '15 septembre 2026') !== newUnit.text)) {
            errors.push(`Autorité publiée : unité héritée sans correspondance (${claim.id}).`);
          }
          if (previous) claim.unitId = previous.unitId;
        }
        delete expected.contentUnits;
        delete actual.contentUnits;
      }
      if (!isDeepStrictEqual(expected, actual)) errors.push(`Autorité publiée : résultat/provenance historique modifié (${row.path}).`);
    }
  } catch (error) {
    errors.push(`Autorité publiée : reçu absent ou illisible (${error.message}).`);
  }
  return errors;
}
