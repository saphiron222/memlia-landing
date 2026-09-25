/** Visibilité d’un futur brouillon : uniquement les slugs sélectionnés, sauf banc navigateur local explicite. */
export function parseBlogPreviewSlugs(value) {
  const raw = (value ?? '').trim();
  if (!raw) return [];
  const parts = raw.split(',').map((slug) => slug.trim());
  if (parts.some((slug) => !slug)) throw new Error('BLOG_PREVIEW_SLUGS contient un slug vide.');
  if (parts.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
    throw new Error('BLOG_PREVIEW_SLUGS contient un slug invalide.');
  }
  return [...new Set(parts)];
}

export const BLOG_PREVIEW_SLUG = (process.env.BLOG_PREVIEW_SLUG ?? '').trim();
export const BLOG_PREVIEW_SLUGS = parseBlogPreviewSlugs(process.env.BLOG_PREVIEW_SLUGS ?? BLOG_PREVIEW_SLUG);
export const BLOG_PREVIEW_ALL = process.env.BLOG_PREVIEW_ALL === '1';

export const isBlogEntryVisibleForSlugs = (entry, previewSlugs, previewAll = false) =>
  entry.data.brouillon === false || previewAll || previewSlugs.includes(entry.id);

export const isBlogEntryVisibleForSlug = (entry, previewSlug, previewAll = false) =>
  isBlogEntryVisibleForSlugs(entry, previewSlug ? [previewSlug] : [], previewAll);

export const isBlogEntryVisible = (entry) => isBlogEntryVisibleForSlugs(entry, BLOG_PREVIEW_SLUGS, BLOG_PREVIEW_ALL);

// La route reste dans le build : la suspension HTTP 503 est gérée en production en amont.
// Ne jamais la proposer comme destination publique tant que cette suspension est active.
export const SUSPENDED_BLOG_SLUGS = Object.freeze(['automatiser-la-saisie-comptable-ce-qui-reste-a-verifier']);
export const isSuspendedBlogPath = (path) => SUSPENDED_BLOG_SLUGS.some((slug) => path === `/blog/${slug}`);
export const isBlogEntryDiscoverable = (entry) =>
  isBlogEntryVisible(entry) && !SUSPENDED_BLOG_SLUGS.includes(entry.id);

export const isPreviewEntry = (entry) =>
  entry.data.brouillon === true && (BLOG_PREVIEW_ALL || BLOG_PREVIEW_SLUGS.includes(entry.id));
