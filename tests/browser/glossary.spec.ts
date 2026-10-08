import { test, expect } from '@playwright/test';

const EXPECTED_TERMS = 53;

async function glossaryReport(page: import('@playwright/test').Page) {
  return page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    terms: document.querySelectorAll('.glossaire-entree').length,
    h1: document.querySelectorAll('h1').length,
    broken: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .filter((link) => !document.getElementById(link.hash.slice(1)))
      .map((link) => link.hash),
  }));
}

test('glossaire : 53 termes, alphabet réel, canonical, breadcrumb et schéma', async ({ page }) => {
  const response = await page.goto('/glossaire');
  expect(response?.status()).toBe(200);
  const report = await glossaryReport(page);
  expect(report).toEqual(expect.objectContaining({ terms: EXPECTED_TERMS, h1: 1, broken: [] }));
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://memlia.fr/glossaire');
  await expect(page.locator('.ariane [aria-current="page"]')).toHaveText('Glossaire');
  // 16 initiales depuis la vague 1 du 16/09/2026 (E, G, H, I, J rejoignent les onze lettres initiales).
  await expect(page.locator('[data-lettre]')).toHaveCount(16);
  await expect(page.locator('.alphabet a')).toHaveCount(16);
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  const types = JSON.parse(schema!)['@graph'].map((node: { '@type': string }) => node['@type']);
  expect(types).toEqual(['CollectionPage', 'DefinedTermSet', 'BreadcrumbList', 'Organization', 'WebSite']);
  expect(schema).not.toContain('FAQPage');
});

test('recherche progressive : filtre, état vide puis restauration', async ({ page }) => {
  await page.goto('/glossaire');
  const search = page.getByLabel('Rechercher un terme');
  const reset = page.getByRole('button', { name: 'Effacer la recherche' });
  await expect(search).toBeVisible();
  await expect(reset).toBeDisabled();
  await search.fill('pseudonymisation');
  await expect(reset).toBeEnabled();
  await expect(page.locator('.glossaire-entree:visible')).toHaveCount(1);
  await expect(page.locator('[data-result-count]')).toHaveText('1 terme');
  await search.fill('terme absent du glossaire');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await reset.click();
  await expect(page.locator('.glossaire-entree:visible')).toHaveCount(EXPECTED_TERMS);
  await expect(reset).toBeDisabled();
  await expect(search).toBeFocused();
});

for (const width of [375, 1440]) {
  for (const activation of ['click', 'keyboard'] as const) {
    for (const id of ['lettre-g', 'generation-augmentee-par-recuperation']) {
      test(`réactivation de ${id} par ${activation} à ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 812 });
        await page.goto(`/glossaire#${id}`);
        const search = page.getByLabel('Rechercher un terme');
        const target = page.locator(`#${id}`);
        // Attendre le rendu et la navigation initiale avant de refiltrer : sinon
        // son défilement peut encore courir pendant la réactivation testée.
        await page.evaluate(() => document.fonts.ready);
        await expect(target).toBeInViewport();
        // Les termes liés sont eux-mêmes filtrés : un lien hors liste représente
        // aussi une navigation dans le même document depuis un autre composant.
        const link = id === 'lettre-g'
          ? page.locator('.alphabet a[href="#lettre-g"]')
          : page.locator('[data-repeat-anchor]');
        if (id !== 'lettre-g') {
          await page.evaluate((anchor) => {
            const link = document.createElement('a');
            link.href = `#${anchor}`;
            link.dataset.repeatAnchor = '';
            link.textContent = 'Revenir au terme';
            document.querySelector('[data-search]')!.append(link);
          }, id);
        }
        await search.fill('SEPA');
        await expect(target).toBeHidden();
        if (activation === 'keyboard') {
          await link.focus();
          await page.keyboard.press('Enter');
        } else {
          await link.click();
        }
        await expect(target).toBeVisible();
        await expect(search).toHaveValue('');
        await expect(page.locator('[data-result-count]')).toHaveText(`${EXPECTED_TERMS} termes`);
        await expect(page.getByRole('button', { name: 'Effacer la recherche' })).toBeDisabled();
        await expect(target).toBeInViewport();
      });
    }
  }
  test(`ancre après recherche filtrée à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto('/glossaire');
    const search = page.getByLabel('Rechercher un terme');
    const target = page.locator('#generation-augmentee-par-recuperation');
    await search.fill('SEPA');
    await expect(target).toBeHidden();
    await page.evaluate(() => { window.location.href = '/glossaire#generation-augmentee-par-recuperation'; });
    await expect(target).toBeVisible();
    await expect(search).toHaveValue('');
    await expect(page.locator('[data-result-count]')).toHaveText(`${EXPECTED_TERMS} termes`);
    await expect(page.getByRole('button', { name: 'Effacer la recherche' })).toBeDisabled();
    await expect(target).toBeInViewport();

    // L’index alphabétique doit aussi pouvoir rouvrir une section filtrée.
    await search.fill('SEPA');
    await expect(page.locator('#lettre-g')).toBeHidden();
    await page.locator('.alphabet a[href="#lettre-g"]').click();
    await expect(page.locator('#lettre-g')).toBeVisible();
    await expect(search).toHaveValue('');
    await expect(page.locator('#lettre-g')).toBeInViewport();

    // Une cible inconnue ne doit pas effacer la saisie.
    await search.fill('SEPA');
    await page.evaluate(() => { window.location.hash = 'terme-inconnu'; });
    await expect(page).toHaveURL(/#terme-inconnu$/);
    await expect(search).toHaveValue('SEPA');
    await expect(target).toBeHidden();
    // Une cible déjà visible conserve également le filtre et son compteur.
    const filteredCount = await page.locator('[data-result-count]').textContent();
    await page.evaluate(() => { window.location.hash = 'prelevement-sepa-et-rejet'; });
    await expect(page).toHaveURL(/#prelevement-sepa-et-rejet$/);
    await expect(page.locator('#prelevement-sepa-et-rejet')).toBeVisible();
    await expect(search).toHaveValue('SEPA');
    await expect(page.locator('[data-result-count]')).toHaveText(filteredCount!);
  });
}

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`glossaire sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/glossaire');
    await page.evaluate(() => document.fonts.ready);
    expect((await glossaryReport(page)).width).toBeLessThanOrEqual(width);
    await expect(page.locator('.glossaire-entree').last()).toBeVisible();
  });
}

test('glossaire sans JavaScript : toutes les entrées et les ancres restent utilisables', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/glossaire');
  await expect(page.getByLabel('Rechercher un terme')).toBeHidden();
  await expect(page.locator('.glossaire-entree')).toHaveCount(EXPECTED_TERMS);
  await expect(page.locator('.glossaire-entree').last()).toBeVisible();
  await page.locator('.alphabet a').first().click();
  await expect(page).toHaveURL(/#lettre-a$/);
  await context.close();
});
