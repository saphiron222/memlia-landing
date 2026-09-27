// Suspension ciblée : ne pas servir l'article tant que les affirmations F39785
// n'ont pas été revalidées par source primaire, revue indépendante et nouveau sceau.
// La fonction Pages prend le pas sur le fichier HTML statique de cette seule route.
export function onRequest({ request }) {
  const headers = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'retry-after': '86400',
    'x-robots-tag': 'noindex, nofollow',
  };
  const body = request.method === 'HEAD' ? null : '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Article temporairement indisponible | Memlia</title><main><h1>Article temporairement indisponible</h1><p>Nous vérifions ses sources avant de le remettre en ligne.</p><p><a href="/blog">Retour au blog</a></p></main></html>';
  return new Response(body, { status: 503, headers });
}
