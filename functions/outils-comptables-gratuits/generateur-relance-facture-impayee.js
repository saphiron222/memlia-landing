import { onRequestGet as filteredGet } from './calculateur-roi-automatisation.js';

/** Le Worker embarqué évite tout GET tardif pendant l’import ; connect-src reste fermé. */
export async function onRequestGet(context) {
  const response = await filteredGet(context);
  if (response.status !== 200 || !response.headers.get('Content-Type')?.startsWith('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', `${headers.get('Content-Security-Policy')}; worker-src 'self' blob:`);
  return new Response(response.body, {status: response.status, headers});
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, {status: response.status, headers: response.headers});
}
