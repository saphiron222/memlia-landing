import { test, expect } from '@playwright/test';
import { prepareLibraryNetwork } from './helpers/library-network';

const ROUTE = '/outils-comptables-gratuits/bibliotheque-prompts-comptables';

test('oracle réseau : attendre le favicon natif tardif avant les actions', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: async () => {} },
  }));
  // Retarder la découverte, pas la réponse : networkidle ne prouve pas que
  // Chromium a déjà demandé l’icône. Aucun clic de l’outil ne la déclenche.
  await page.route(`**${ROUTE}`, async route => {
    const response = await route.fetch();
    const html = (await response.text()).replace(/<link\b[^>]*rel="icon"[^>]*>/g,
      '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E" />');
    await route.fulfill({ response, body: html });
  });
  let prepared = false;
  const preparation = prepareLibraryNetwork(page, ROUTE).then(() => { prepared = true; });
  await page.waitForURL(`**${ROUTE}`);
  await page.waitForLoadState('networkidle');
  // Barrière de protocole : laisser la préparation reprendre après networkidle.
  await page.evaluate(() => document.readyState);
  const premature = prepared;
  const favicon = page.waitForResponse(r => new URL(r.url()).pathname === '/favicon.svg');
  await page.evaluate(() => {
    document.querySelectorAll('link[rel="icon"]').forEach(icon => icon.remove());
    const icon = document.createElement('link'); icon.rel = 'icon'; icon.href = '/favicon.svg';
    document.head.append(icon);
  });
  const response = await favicon;
  expect(response.request().resourceType()).toBe('other');
  expect(await response.finished()).toBeNull();
  await preparation;
  expect(premature, 'la préparation doit attendre le favicon, pas seulement networkidle').toBe(false);
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.locator('[data-model="accuse-reception"] [data-copy]').click();
  const download = page.waitForEvent('download');
  await page.locator('[data-model="accuse-reception"] [data-export]').click();
  expect((await download).suggestedFilename()).toBe('prompt-accuse-reception.txt');
  expect(requests).toEqual([]);
});

for (const action of ['copy', 'export']) test(`oracle réseau : détecter une transmission ${action}, même vers favicon.svg`, async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: async () => {} },
  }));
  await prepareLibraryNetwork(page, ROUTE);
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.evaluate(action => {
    document.querySelector(`[data-model="accuse-reception"] [data-${action}]`)!
      .addEventListener('click', () => {
        const image = new Image(); image.src = `/favicon.svg?oracle=${action}`;
        document.body.append(image);
      }, { once: true });
  }, action);
  const transmission = page.waitForRequest(r => r.resourceType() === 'image' && new URL(r.url()).pathname === '/favicon.svg');
  if (action === 'export') {
    const download = page.waitForEvent('download');
    await page.locator('[data-model="accuse-reception"] [data-export]').click();
    await download;
  } else await page.locator('[data-model="accuse-reception"] [data-copy]').click();
  const request = await transmission;
  expect(requests).toContain(request.url());
  expect(() => expect(requests).toEqual([])).toThrow();
});
