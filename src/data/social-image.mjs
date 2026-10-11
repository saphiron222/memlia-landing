/** Variante réservée aux cartes de partage ; les médias du contenu restent inchangés. */
export function socialImageUrl(source) {
  const url = new URL(source);
  url.pathname = `/social${url.pathname}.jpg`;
  url.search = '';
  url.hash = '';
  return url.href;
}
