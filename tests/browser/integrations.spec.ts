import { test, expect } from '@playwright/test';

const slugs = [
  'rapprochement-bancaire-sage',
  'lettrage-sage',
  'dsn-sage',
  'bulletin-de-paie-sage',
  'saisie-comptable-sage',
  'cloture-sage',
  'lettrage-cegid',
  'dsn-silae',
  'bulletin-de-paie-silae',
] as const;

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`les neuf pages intégrations restent lisibles à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of slugs) {
      await page.goto(`/integrations/${slug}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('[data-proof]')).toHaveAttribute('data-proof', `integrations/${slug}`);
      // Le document de l'éditeur se cite dans le paragraphe de portée, plus dans une section Source (Kevin, 06/10/2026).
      await expect(page.locator('section[aria-labelledby="repere-editeur"] a[rel="noopener noreferrer"]')).toHaveAttribute('href', /^https:\/\//);
      await expect(page.locator('h2', { hasText: 'La règle écrite' })).toBeVisible();
      await expect(page.locator('#jeu-fictif')).toHaveText('Cas illustratifs sur données fictives');
      const overflow = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        elements: [
          `html ${document.documentElement.clientWidth}/${document.documentElement.scrollWidth} · body ${document.body.clientWidth}/${document.body.scrollWidth}`,
          ...[...document.querySelectorAll<HTMLElement>('body *')]
          .filter((element) => {
            const box = element.getBoundingClientRect();
            return box.right > document.documentElement.clientWidth + 1 || box.left < -1;
          })
          .slice(0, 8)
          .map((element) => `${element.tagName.toLowerCase()}.${element.className} (${Math.round(element.getBoundingClientRect().left)}→${Math.round(element.getBoundingClientRect().right)})`),
        ],
      }));
      expect(overflow.width, overflow.elements.join('\n')).toBeLessThanOrEqual(width);
    }
  });
}

test('le hub, les moyeux et le footer relient la vague forte', async ({ page }) => {
  await page.goto('/integrations');
  for (const slug of slugs) await expect(page.locator(`main a[href="/integrations/${slug}"]`)).toHaveCount(1);
  await expect(page.locator('footer a[href="/integrations"]')).toBeVisible();

  await page.goto('/automatisation/paie');
  for (const slug of ['dsn-sage', 'bulletin-de-paie-sage', 'dsn-silae', 'bulletin-de-paie-silae']) {
    await expect(page.locator(`main a[href="/integrations/${slug}"]`)).toHaveCount(1);
  }
});

test('les dix pages gardent leurs repères accessibles essentiels', async ({ page }) => {
  for (const path of ['/integrations', ...slugs.map((slug) => `/integrations/${slug}`)]) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Navigation principale"]')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    await expect(page.locator('a[href=""]')).toHaveCount(0);
    const structure = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>('[id]')].map((element) => element.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      const levels = [...document.querySelectorAll('main h1, main h2, main h3')].map((heading) => Number(heading.tagName[1]));
      const skipped = levels.some((level, index) => index > 0 && level > levels[index - 1] + 1);
      return { duplicateIds, skipped };
    });
    expect(structure.duplicateIds, `${path}: identifiants dupliqués`).toEqual([]);
    expect(structure.skipped, `${path}: niveau de titre sauté`).toBe(false);
  }
});

test('sans JavaScript, le contenu, la preuve et le retour au moyeu restent servis', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto('/integrations/lettrage-cegid');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-proof="integrations/lettrage-cegid"]')).toBeVisible();
  await expect(page.locator('main a[href="/automatisation/saisie-comptable"]')).toBeVisible();
  await context.close();
});
