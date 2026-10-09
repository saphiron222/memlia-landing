import { test, expect } from '@playwright/test';

// Kevin, 07/10/2026 : « on ne doit pas pouvoir agrandir une image, nulle part sur le site ».
// La preuve se lit à sa taille dans la page : ni lien ni bouton « Agrandir », ni dialogue,
// ni image cliquable vers un fichier image, au toucher comme à la souris.
const pages = ['/', '/automatisation/paie', '/integrations/dsn-silae'];
const FICHIER_IMAGE = /\.(?:webp|avif|png|jpe?g|gif|svg)(?:[?#]|$)/i;

for (const width of [320, 375, 1440]) {
  for (const path of pages) {
    test(`${path} : preuve lisible sans agrandissement à ${width}px`, async ({ page, hasTouch }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const preuves = page.locator('img[src^="/proofs/"]');
      await expect(preuves.first()).toBeVisible();
      await expect(page.getByRole('link', { name: /agrandir/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /agrandir|fermer la preuve/i })).toHaveCount(0);
      await expect(page.locator('dialog, [data-proof-detail], [data-proof-open], [aria-haspopup="dialog"]')).toHaveCount(0);

      const images = await preuves.evaluateAll((elements) => elements.map((img) => ({
        src: img.getAttribute('src'),
        interactif: !!img.closest('a, button, [role="button"], [tabindex]'),
        curseur: getComputedStyle(img).cursor,
      })));
      for (const image of images) {
        expect.soft(image.interactif, image.src ?? '').toBe(false);
        expect.soft(image.curseur, image.src ?? '').not.toMatch(/zoom|pointer/);
      }
      const liensImage = await page.locator('a[href]').evaluateAll((liens) => liens.map((a) => a.getAttribute('href') ?? ''));
      expect(liensImage.filter((href) => FICHIER_IMAGE.test(href))).toEqual([]);

      // Toucher ou cliquer la preuve n'ouvre rien et ne quitte pas la page.
      const premiere = preuves.first();
      await premiere.scrollIntoViewIfNeeded();
      const adresse = page.url();
      if (hasTouch) await premiere.tap();
      else await premiere.click();
      await expect(page.locator('dialog[open]')).toHaveCount(0);
      expect(page.url()).toBe(adresse);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
for (const slug of ['factures-fournisseurs', 'notes-de-frais', 'paie', 'rapprochement-bancaire', 'saisie-comptable']) {
  test(`${slug} : un seul cadre utile`, async ({ page }) => {
    await page.goto(`/automatisation/${slug}`);
    const images = await page.locator('img[src^="/proofs/"]').evaluateAll((els) => els.map((el) => el.getAttribute('src')));
    expect(images.length).toBe(1);
    expect(new Set(images).size).toBe(images.length);
  });
}

test('gabarits voisins sans agrandissement', async ({ page }) => {
  for (const path of ['/methode', '/integrations/dsn-sage', '/outils-comptables-gratuits/calculateur-marge-commerciale']) {
    await page.goto(path);
    await expect(page.getByRole('link', { name: /agrandir/i })).toHaveCount(0);
    await expect(page.locator('dialog')).toHaveCount(0);
    await expect(page.locator('img[src^="/proofs/"]').first()).toBeVisible();
  }
});
