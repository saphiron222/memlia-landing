/** Origine des assets sociaux d’un brouillon déployé sur Cloudflare Pages. */
export function requireBlogPreviewOrigin(value) {
  const raw = (value ?? '').trim();
  if (!raw) throw new Error('BLOG_PREVIEW_ORIGIN est requis pour construire une preview déployable.');

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('BLOG_PREVIEW_ORIGIN doit être une origine URL valide.');
  }
  if (url.protocol !== 'https:') throw new Error('BLOG_PREVIEW_ORIGIN doit utiliser HTTPS.');
  if (!url.hostname.endsWith('.memlia.pages.dev')) {
    throw new Error('BLOG_PREVIEW_ORIGIN doit cibler un hôte *.memlia.pages.dev.');
  }
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('BLOG_PREVIEW_ORIGIN doit être une origine sans chemin, identifiants, query ni fragment.');
  }
  return url.origin;
}

export function previewAssetOrigin({ candidatePreview, configuredOrigin, productionOrigin }) {
  if (!candidatePreview || !(configuredOrigin ?? '').trim()) return productionOrigin;
  return requireBlogPreviewOrigin(configuredOrigin);
}
