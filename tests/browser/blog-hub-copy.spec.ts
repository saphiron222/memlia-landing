import { test, expect } from '@playwright/test';

const gestes = [
  ['contrôler les bulletins et lire les retours DSN', '/blog/rubrique/paie-dsn-cabinet-comptable'],
  ['relancer les pièces et vérifier la saisie', '/blog/rubrique/gestion-pieces-comptables'],
  ['cadrer un usage de l’IA et vérifier sa réponse', '/blog/rubrique/ia-cabinet-comptable'],
] as const;

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`hub blog : orientation lisible à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.blog-intro')).toContainText('La décision reste au cabinet.');
    for (const [name, href] of gestes) {
      const link = page.locator('.blog-transition').getByRole('link', { name, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
      expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain('underline');
    }
    await expect(page.locator('#auteur-kevin')).toContainText('Dans la série Cicatrices, Kevin Kitanga raconte à la première personne');
    const sortie = page.locator('.blog-sortie');
    await expect(sortie).toContainText('Vous avez lu la méthode ; vous pouvez aussi nous confier la tâche.');
    await expect(sortie.getByRole('link', { name: 'Confier une première tâche' })).toHaveAttribute('href', '/contact');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

for (const [name, href] of gestes) {
  test(`hub vers rubrique puis article : ${name}`, async ({ page }) => {
    await page.goto('/blog');
    await page.locator('.blog-transition').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    const articleLink = page.locator('main h3 a[href^="/blog/"]').first();
    const target = await articleLink.getAttribute('href');
    expect(target).toBeTruthy();
    await articleLink.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toContainText('Kevin Kitanga');
  });
}
