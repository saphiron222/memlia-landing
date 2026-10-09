/**
 * Essai limité à la route ROI : retirer le beacon ajouté par Pages avant la sortie
 * de la réponse. no-transform empêche ensuite la seconde injection par la zone.
 * Aucun changement des calculs, aucune saisie lue, aucun réglage global Cloudflare.
 */
export async function onRequestGet(context) {
  // Le validateur de l’asset désigne le corps AVANT filtrage : ne jamais rendre
  // 304/206 pour ce corps, sinon un navigateur réutiliserait son ancien beacon.
  const assetHeaders = new Headers(context.request.headers);
  for (const header of ['If-None-Match', 'If-Modified-Since', 'Range', 'If-Range']) assetHeaders.delete(header);
  let response = await context.next(new Request(context.request, {method: 'GET', headers: assetHeaders}));
  // Pages ignore _headers pour les Functions ; ne pas étendre HSTS aux previews.
  if (new URL(context.request.url).hostname === 'memlia.fr') {
    const headers = new Headers(response.headers);
    headers.set('Strict-Transport-Security', 'max-age=31536000');
    response = new Response(response.body, {status: response.status, statusText: response.statusText, headers});
  }
  if (response.status !== 200 || !response.headers.get('Content-Type')?.startsWith('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate, no-transform');
  headers.set('Content-Security-Policy', "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  headers.delete('ETag');
  headers.delete('Last-Modified');
  headers.delete('Content-Length');
  return new HTMLRewriter().on('script[src]', {
    element(element) {
      const src = element.getAttribute('src');
      if (src === 'https://static.cloudflareinsights.com/beacon.min.js' || src?.startsWith('https://static.cloudflareinsights.com/beacon.min.js/')) element.remove();
    },
  }).transform(new Response(response.body, {status: response.status, headers}));
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, {status: response.status, headers: response.headers});
}
