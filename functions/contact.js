import { onRequestGet as filterGet } from './outils-comptables-gratuits/calculateur-roi-automatisation.js';

// Contact autorise Turnstile et son API same-origin, jamais unsafe-inline.
const contactCsp = "default-src 'self'; base-uri 'self'; connect-src 'self' https://challenges.cloudflare.com; font-src 'self'; form-action 'self'; frame-ancestors 'none'; frame-src https://challenges.cloudflare.com; img-src 'self' data: https://challenges.cloudflare.com; object-src 'none'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'";

export async function onRequestGet(context) {
  const response = await filterGet(context);
  if (response.status !== 200 || !response.headers.get('Content-Type')?.startsWith('text/html')) return response;
  response.headers.set('Content-Security-Policy', contactCsp);
  return response;
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
