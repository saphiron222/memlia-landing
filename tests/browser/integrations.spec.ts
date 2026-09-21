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

for (const width of [320, 1440]) {
  test(`les neuf pages intégrations restent lisibles à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of slugs) {
      await page.goto(`/integrations/${slug}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('[data-media]')).toHaveAttribute('data-media', slug);
      await expect(page.locator('.source-lien')).toHaveAttribute('href', /^https:\/\//);
      await expect(page.locator('h2', { hasText: 'La règle écrite' })).toBeVisible();
      await expect(page.locator('#jeu-fictif')).toHaveText('Rejoué sur le jeu fictif');
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

test('sans JavaScript, le contenu, la preuve et le retour au moyeu restent servis', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: process.env.QA_URL ?? 'http://127.0.0.1:4321',
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto('/integrations/lettrage-cegid');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-media="lettrage-cegid"]')).toBeVisible();
  await expect(page.locator('main a[href="/automatisation/saisie-comptable"]')).toBeVisible();
  await context.close();
});
