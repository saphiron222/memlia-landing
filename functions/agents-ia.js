import { onRequestGet as filterGet } from './outils-comptables-gratuits/calculateur-roi-automatisation.js';

// Les agents IA ne font aucune requête : réseau fermé (connect-src 'none'), scripts de l'origine seulement, jamais
// unsafe-inline pour un script. Le filtre retire la balise Insights et pose la CSP des outils (scripts inline permis) ;
// elle est remplacée ici, pas élargie. Même texte que public/_headers : Pages ne rejoue pas `_headers` sur la réponse
// d'une Function, et agents-ia-csp.test.mjs compare les deux mot pour mot.
const agentsIaCsp = "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'";

export async function onRequestGet(context) {
  const response = await filterGet(context);
  // Une fiche pas encore construite rend son 404, une redirection sa redirection : rien à filtrer, rien à ajouter.
  if (response.status !== 200 || !response.headers.get('Content-Type')?.startsWith('text/html')) return response;
  response.headers.set('Content-Security-Policy', agentsIaCsp);
  return response;
}

export async function onRequestHead(context) {
  const response = await onRequestGet(context);
  return new Response(null, { status: response.status, headers: response.headers });
}
