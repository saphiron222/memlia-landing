/** Une décision explicite, des routes exactes : aucun joker ne peut absorber les robots conservés. */
export function verifierDecisionMigration(data) {
  const errors = [];
  if (data?.version !== 1 || data.authorizedBy !== 'Kevin Kitanga' || data.redirectStatus !== 301 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '') || String(data.reason ?? '').length < 60 || !Array.isArray(data.routes)) {
    throw new Error('Décision de migration des catalogues invalide.');
  }
  const from = new Set();
  for (const row of data.routes) {
    if (!/^\/(?:automatisation|integrations)\/[a-z0-9-]+$/.test(row.from ?? '') || from.has(row.from)) errors.push(`Ancienne route invalide ou dupliquée : ${row.from}`);
    from.add(row.from);
    if (!/^\/(?:agents-ia\/[a-z0-9-]+|integrations|commissaires-aux-comptes)(?:#[a-z0-9-]+)?$/.test(row.to ?? '') || row.from === row.to) errors.push(`Destination invalide : ${row.to}`);
    if (!['service', 'guide'].includes(row.type) || String(row.reason ?? '').length < 30) errors.push(`Justification absente : ${row.from}`);
  }
  for (const row of data.routes) if (from.has(row.to?.split('#')[0])) errors.push(`Chaîne ou boucle : ${row.from}`);
  if (errors.length) throw new Error(errors.join('\n'));
  return data;
}

/** Le chargement du JSON appartient à chaque environnement ; la logique reste unique. */
export function creerMigrationCatalogues(decision) {
  const MIGRATION_CATALOGUES = verifierDecisionMigration(decision);
  const ROUTES_RETIREES = new Set(decision.routes.map(row => row.from));
  const estRouteRetiree = route => ROUTES_RETIREES.has(route.replace(/\/+$/, ''));
  function destinationActuelle(href) {
    if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return href;
    const url = new URL(href, 'https://memlia.fr');
    const row = decision.routes.find(row => row.from === url.pathname.replace(/\/+$/, ''));
    return row ? row.to : href;
  }

  function blocRedirections(data = MIGRATION_CATALOGUES) {
    verifierDecisionMigration(data);
    return '# Migration catalogues — décision Kevin du 15 octobre 2026\n' +
      data.routes.flatMap(row => [
        ...[row.from, `${row.from}/`, `${row.from}.html`].map(from => `${from} ${row.to} 301`),
        `/markdown${row.from}.md /markdown${row.to.split('#')[0]}.md 301`,
      ]).join('\n') + '\n';
  }

  /** Les routes couvertes par une Pages Function ne passent pas par les règles statiques _redirects. */
  function reponseMigration(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '').replace(/\.html$/, '');
    const row = decision.routes.find(row => row.from === path);
    if (!row) return null;
    return new Response(null, { status: 301, headers: { Location: new URL(row.to, url.origin).href, 'Cache-Control': 'public, max-age=3600' } });
  }

  return { MIGRATION_CATALOGUES, ROUTES_RETIREES, estRouteRetiree, destinationActuelle, blocRedirections, reponseMigration };
}
