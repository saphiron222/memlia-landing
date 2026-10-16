import { test, expect } from '@playwright/test';
import { INTEGRATIONS, INTEGRATIONS_INDEXABLES } from '../../src/data/integrations';
import { CONNECTEURS, DOMAINES } from '../../src/data/connecteurs';
import migration from '../../config/migration-catalogues.json' with { type: 'json' };
import { widths } from './helpers/inventories';

const guides = migration.routes.filter(row => row.type === 'guide');
const retired = new Set(migration.routes.map(row => row.from));

test('douze guides archivés, douze migrations et aucune route active de guide : le témoin ne peut pas être vide', () => {
  expect(INTEGRATIONS).toHaveLength(12);
  expect(INTEGRATIONS_INDEXABLES).toEqual([]);
  expect(guides).toHaveLength(12);
  expect(guides.map(row => row.from).sort()).toEqual(INTEGRATIONS.map(guide => `/integrations/${guide.slug}`).sort());
});

test('la recherche porte sur les logiciels et domaines, sans ancien filtre de guides', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/integrations');
  await expect(page.locator('[data-guide-filters], [data-guide-product]')).toHaveCount(0);
  const input = page.getByLabel('Le nom de votre logiciel', { exact: true });
  await input.fill('Silae');
  // La recherche inclut le nom, l’éditeur et la tâche décrite sur la carte.
  const matches = CONNECTEURS.filter(c => `${c.nom} ${c.editeur} ${c.faitAvec}`.toLocaleLowerCase('fr').includes('silae'));
  expect(matches.length).toBeGreaterThan(0);
  await expect(page.locator('[data-connecteur]:visible')).toHaveCount(matches.length);
  expect(await page.locator('[data-connecteur]:visible').evaluateAll(cards => cards.map(card => card.id).sort())).toEqual(matches.map(c => c.id).sort());
  await input.press('Enter');
  await expect(page).toHaveURL(/\/integrations$/);
  await input.fill('aucun-resultat-possible');
  await expect(page.locator('[data-connecteur-count]')).toContainText('Aucun logiciel');
  await page.getByRole('search', {name:'Trouver un logiciel'}).getByRole('button', { name:'Tout afficher', exact:true }).click();
  await expect(input).toBeFocused();
  await expect(page.locator('[data-connecteur]:visible')).toHaveCount(CONNECTEURS.length);
  await page.getByLabel('Votre besoin', { exact:true }).selectOption('production-comptable');
  await expect(page.locator('[data-connecteur]:visible')).toHaveCount(CONNECTEURS.filter(c => c.domaine === 'production-comptable').length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

for (const width of widths) {
  test(`le catalogue de compatibilités reste lisible et navigable à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height:900 });
    const response = await page.goto('/integrations');
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('[data-connecteur]')).toHaveCount(CONNECTEURS.length);
    await expect(page.locator('[data-domaine]')).toHaveCount(DOMAINES.length);
    await expect(page.locator('[data-integration-cards]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('les trois catalogues gardent leurs repères accessibles et ne lient plus les anciennes pages', async ({ page }) => {
  for (const path of ['/integrations', '/agents-ia', '/automatisation-cabinet-comptable']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Navigation principale"]')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('img:not([alt]), a[href=""]')).toHaveCount(0);
    const structure = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map(el => el.id);
      const levels = [...document.querySelectorAll('main h1, main h2, main h3')].map(heading => Number(heading.tagName[1]));
      return { duplicateIds:ids.filter((id,i) => ids.indexOf(id) !== i), skipped:levels.some((level,i) => i > 0 && level > levels[i-1]+1), links:[...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map(a => new URL(a.href).pathname) };
    });
    expect(structure.duplicateIds, path).toEqual([]);
    expect(structure.skipped, path).toBe(false);
    expect(structure.links.filter(href => retired.has(href)), `${path}: aucune destination retirée`).toEqual([]);
  }
});

test('sans JavaScript, tous les logiciels, les raccourcis de domaine et la démonstration restent servis', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled:false, viewport:{width:375,height:812} });
  try {
    const page = await context.newPage();
    await page.goto('/integrations');
    await expect(page.locator('[data-connecteur-filters]')).toBeHidden();
    await expect(page.locator('[data-connecteur]')).toHaveCount(CONNECTEURS.length);
    await expect(page.locator('[data-guide-product], [data-guide-filters]')).toHaveCount(0);
    const domaine = DOMAINES.find(d => CONNECTEURS.some(c => c.domaine === d.id))!;
    await page.locator(`#domaines a[href="#${domaine.id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${domaine.id}$`));
    await expect(page.locator(`[data-domaine="${domaine.id}"]`)).toBeVisible();
    await expect(page.locator('[data-agent-rejeu] tbody tr')).toHaveCount(4);
  } finally { await context.close(); }
});

test('livraison Pages : chaque ancien guide redirige directement vers sa carte, avec et sans barre finale', async ({ request, page }) => {
  test.skip(process.env.QA_PAGES_DELIVERY !== '1', 'Les redirections de Cloudflare Pages se vérifient sur la livraison réelle, pas sur astro preview.');
  expect(guides).toHaveLength(12);
  for (const row of guides) {
    for (const old of [row.from, `${row.from}/`, `${row.from}.html`]) {
      const response = await request.get(old, {maxRedirects:0});
      expect(response.status(), old).toBe(301);
      const location = new URL(response.headers().location, response.url());
      expect(location.pathname + location.hash, old).toBe(row.to);
    }
    await page.goto(row.to);
    const id = new URL(row.to, 'https://memlia.fr').hash.slice(1);
    await expect(page.locator(`[data-connecteur="${id}"]`)).toBeVisible();
  }
});
