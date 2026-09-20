import { test, expect, type Page } from '@playwright/test';
import { OUTILS_DISPONIBLES, outilPath } from '../../src/data/outils';

const HUB = '/outils-comptables-gratuits';
const TEMOIN = `${HUB}/temoin-calcul-local`;
const H1_HUB = 'Outils comptables gratuits : calculer, vérifier, convertir';
const H1_TEMOIN = 'Témoin de calcul local';

function graphFrom(page: Page) {
  return page.locator('script[type="application/ld+json"]').textContent().then((text) => JSON.parse(text ?? '{}')['@graph']);
}

test('hub : route canonique, état vide honnête et schéma de collection', async ({ page }) => {
  const response = await page.goto(HUB);
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveText(H1_HUB);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${HUB}`);
  await expect(page.locator('[data-outil-card]')).toHaveCount(0);
  await expect(page.locator('[data-empty-category]')).toHaveCount(3);
  await expect(page.locator(`a[href="${TEMOIN}"]`)).toHaveCount(0);
  await expect(page.locator('main')).toContainText('Aucun outil n’est publié dans cette catégorie pour le moment.');

  const graph = await graphFrom(page);
  expect(graph.map((node: { '@type': string }) => node['@type'])).toEqual([
    'CollectionPage', 'ItemList', 'BreadcrumbList',
  ]);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'ItemList').itemListElement).toEqual([]);
});

test('contrat de liens : le registre borne les outils publiés et leurs sorties', async ({ page }) => {
  await page.goto(HUB);
  await expect(page.locator('[data-outil-card]')).toHaveCount(OUTILS_DISPONIBLES.length);

  for (const outil of OUTILS_DISPONIBLES) {
    const path = outilPath(outil);
    await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);
    await page.goto(path);
    const expectedLinks = [HUB, ...(outil.articleExact ? [outil.articleExact] : []), outil.pageService, outil.cta];
    expect(await page.locator('[data-tool-links] a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(expectedLinks);
    await expect(page.locator('[data-tool-links] a[href="/contact"]')).toHaveCount(1);
    await expect(page.locator('[data-tool-links] a[href^="/contact?"]')).toHaveCount(0);
  }
});

test('témoin : noindex, CSP, quatre surfaces et liens sortants concordants', async ({ page }) => {
  const response = await page.goto(TEMOIN);
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /connect-src 'none'/);
  await expect(page.locator('main h1')).toHaveText(H1_TEMOIN);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', H1_TEMOIN);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', H1_TEMOIN);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${TEMOIN}`);
  await expect(page.getByText('Démonstration technique', { exact: true })).toBeVisible();
  await expect(page.locator('[data-local-notice]')).toContainText('aucune valeur n’est envoyée ni conservée');
  await expect(page.locator('.ariane [aria-current="page"]')).toHaveText(H1_TEMOIN);

  const graph = await graphFrom(page);
  expect(graph.map((node: { '@type': string }) => node['@type'])).toEqual([
    'WebPage', 'WebApplication', 'BreadcrumbList',
  ]);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'WebApplication').name).toBe(H1_TEMOIN);

  const links = page.locator('[data-tool-links] a');
  await expect(links).toHaveCount(3);
  expect(await links.evaluateAll((items) => items.map((item) => item.getAttribute('href')))).toEqual([
    HUB, '/methode', '/contact',
  ]);
  await expect(page.locator('[data-tool-links] a[href="/contact"]')).toHaveCount(1);
});

test('témoin : le garde détecte toute requête après armement, puis exige zéro', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests: string[] = [];
  let armed = false;
  page.on('request', (request) => {
    if (armed) requests.push(`${request.method()} ${request.url()}`);
  });
  if (process.env.NETWORK_GUARD_RED === '1') {
    // La CSP publique ferme déjà `connect-src`. Le mode rouge retire uniquement sa balise de la
    // réponse locale afin de prouver que le garde réseau, indépendamment de la CSP, voit l'appel.
    await page.route(`**${TEMOIN}`, async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '');
      const headers = { ...response.headers() };
      delete headers['content-security-policy'];
      delete headers['content-security-policy-report-only'];
      await route.fulfill({ response, headers, body });
    });
  }

  await page.goto(TEMOIN);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  armed = true;

  await page.getByLabel('Premier nombre').fill('10,5');
  await page.getByLabel('Deuxième nombre').fill('2,25');
  await page.getByRole('button', { name: 'Calculer' }).click();
  await expect(page.locator('[data-result]')).toHaveText('12,75');
  await page.getByRole('button', { name: 'Copier le résultat' }).click();
  await expect(page.locator('[data-copy-status]')).toHaveText('Résultat copié.');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger le résultat' }).click();
  expect((await download).suggestedFilename()).toBe('temoin-calcul-local.txt');
  expect(await page.evaluate(async () => ({
    localStorage: localStorage.length,
    sessionStorage: sessionStorage.length,
    indexedDB: (await indexedDB.databases()).length,
  }))).toEqual({ localStorage: 0, sessionStorage: 0, indexedDB: 0 });

  if (process.env.NETWORK_GUARD_RED === '1') {
    await page.evaluate(() => fetch('/robots.txt').catch(() => undefined));
  }
  expect(requests).toEqual([]);
});

test('outil vers contact : origine attribuée sans requête avant l’envoi volontaire', async ({ page }) => {
  const apiRequests: string[] = [];
  await page.route('**/api/contact', async (route) => {
    apiRequests.push(route.request().postData() ?? '');
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.goto(TEMOIN);
  await page.locator('[data-tool-links] a[href="/contact"]').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('#origine')).toHaveValue(TEMOIN);
  expect(apiRequests).toEqual([]);

  await page.fill('#nom', 'Camille Fictive');
  await page.fill('#courriel', 'camille@exemple.test');
  await page.fill('#message', 'Chaque mois, une tâche fictive doit être contrôlée avant validation.');
  await page.check('#consentement');
  await page.click('form[data-contact] button[type="submit"]');
  await expect(page.locator('[data-etat]')).toContainText('Message envoyé');
  expect(apiRequests).toHaveLength(1);
  expect(apiRequests[0]).toContain(`\r\n\r\n${TEMOIN}\r\n`);
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`hub et témoin sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [HUB, TEMOIN]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('main h1')).toBeVisible();
    }
  });
}
