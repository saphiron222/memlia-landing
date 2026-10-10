import { test, expect } from '@playwright/test';

// La preview Astro utilisée par la CI ne lance pas les fonctions Pages.
// Exécuter explicitement cette recette sur Wrangler, puis sur le déploiement.
test.skip(process.env.QA_PAGES_DELIVERY !== '1', 'Recette de livraison : nécessite le runtime Pages réel, pas la preview Astro');

const routes = [
  '/contact', '/outils-comptables-gratuits',
  ...['calculateur-marge-commerciale', 'calculateur-amortissement-comptable', 'generateur-charte-ia-cabinet', 'calculateur-date-echeance-facture', 'verificateur-fec-local', 'verificateur-prompt-ia', 'modele-rapprochement-bancaire-excel-gratuit', 'generateur-prompt-expert-comptable', 'diagnostic-maturite-ia-cabinet'].map(slug => `/outils-comptables-gratuits/${slug}`),
];

for (const route of routes) {
  test(`livraison locale sans Insights : ${route}`, async ({ page }) => {
    const insights: string[] = [];
    const errors: string[] = [];
    page.on('request', request => { if (request.url().includes('cloudflareinsights.com')) insights.push(request.url()); });
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['cache-control']).toContain('no-transform');
    const csp = response?.headers()['content-security-policy'];
    expect(csp).toContain(route === '/contact' ? "connect-src 'self' https://challenges.cloudflare.com" : "connect-src 'none'");
    if (route === '/contact') expect(csp?.split(';').find(directive => directive.trim().startsWith('script-src'))).not.toContain('unsafe-inline');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('script[src*="cloudflareinsights.com"]')).toHaveCount(0);
    expect(insights).toEqual([]);
    expect(errors.filter(message => /cloudflareinsights|beacon\.min\.js/.test(message))).toEqual([]);

    // Une saisie n'autorise aucun envoi : contact conserve son POST explicite,
    // les outils peuvent seulement charger paresseusement leurs actifs locaux.
    const requests: { url: string; method: string; body: string | null }[] = [];
    page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }));
    const fields = page.locator('main input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]), main textarea');
    for (const field of await fields.all()) {
      if (!(await field.isVisible()) || !(await field.isEditable())) continue;
      const type = await field.getAttribute('type');
      if (type === 'range') continue;
      await field.fill(type === 'date' ? '2026-10-06' : type === 'number' ? '42' : type === 'email' ? 'fictif@example.test' : 'SONDE_FICTIVE_SEC02');
    }
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    expect(requests.filter(request => request.method !== 'GET' || request.body)).toEqual([]);
    expect(requests.filter(request => !request.url.startsWith(new URL(page.url()).origin) && !request.url.startsWith('https://challenges.cloudflare.com/'))).toEqual([]);
  });
}
