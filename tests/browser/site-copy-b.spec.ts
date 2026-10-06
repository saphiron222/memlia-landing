import { test, expect } from '@playwright/test';
import { famillesDeLaProfession } from '../../src/data/familles';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`copy publique et frontières, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, phrases] of [
      ['/garanties', ['Une donnée absente, une pièce illisible ou un cas hors règle arrête la préparation', 'Votre équipe décide de la suite.', 'Les flux du service sont documentés par mission']],
      ['/contact', ['un cas courant et une exception', 'comprendre la page du site à l’origine de ma demande']],
      ['/automatisation-cabinet-comptable', ['Pour le commissariat aux comptes, nous préparons aussi', 'Le commissaire aux comptes garde la sélection des travaux, leur appréciation et l’opinion.', 'l’environnement autorisé du cabinet']],
      ['/methode', ['l’environnement autorisé du cabinet']],
      ['/', ['Collecter, comparer, préparer', 'l’environnement autorisé du cabinet']],
    ] as const) {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      for (const phrase of phrases) await expect(page.locator('main')).toContainText(phrase);
      if (route === '/automatisation-cabinet-comptable') {
        await expect(page.locator('main')).not.toContainText('n’est pas ouvert à la prise en charge');
      }
      if (route === '/') {
        const familles = famillesDeLaProfession('ec');
        const poles = new Set(familles.map(({ pole }) => pole));
        await expect(page.locator('#usages')).toContainText(`${familles.length} familles de tâches, ${poles.size} pôles pour l’expertise comptable`);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (route === '/methode') {
        await expect(page.locator('#page-evidence-title')).toHaveCount(0);
        await expect(page.locator('[data-first-hand-experience]')).toHaveCount(1);
      }
    }
  });

  test(`parcours des rubriques et produits exacts, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/integrations');
    const products = [
      ['Sage 100 Comptabilité', ['rapprochement-bancaire-sage', 'lettrage-sage', 'saisie-comptable-sage', 'cloture-sage']],
      ['Sage 100 Paie & RH', ['dsn-sage', 'bulletin-de-paie-sage']],
      ['Cegid Loop', ['lettrage-cegid']],
      ['mySilae', ['dsn-silae', 'bulletin-de-paie-silae']],
    ] as const;
    for (const [product, slugs] of products) {
      const section = page.locator('section').filter({ has: page.getByRole('heading', { name: product, exact: true }) });
      const hrefs = await section.locator('a[href^="/integrations/"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
      expect(hrefs).toEqual(slugs.map((slug) => `/integrations/${slug}`));
    }
    for (const [route, slugs] of [
      ['paie-dsn-cabinet-comptable', ['controler-les-bulletins-de-paie-avant-la-dsn', 'comprendre-les-comptes-rendus-metier-dsn', 'suivre-la-production-sociale-dans-excel']],
      ['gestion-pieces-comptables', ['automatiser-la-relance-des-pieces-clients', 'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier']],
    ] as const) {
      await page.goto(`/blog/rubrique/${route}`);
      const links = await page.locator('[data-rubrique-article] h3 a').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
      const cards = links.filter((link) => slugs.some((slug) => link === `/blog/${slug}`));
      expect(cards).toEqual(slugs.map((slug) => `/blog/${slug}`));
      await expect(page.locator('main')).not.toContainText('requête propre');
    }
  });
}

test('glossaire statique : définitions, sources et décisions visibles sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/glossaire');
  for (const [id, phrase] of [
    ['relance-de-pieces', 'L’envoi attend une validation humaine'],
    ['pre-comptabilite', 'sans imputation définitive ni écriture validée'],
    ['sous-traitant-rgpd', 'finalités, les moyens et les instructions'],
    ['modele-local', 'ne garantit pas l’absence de connexions'],
    ['reliquat-d-exceptions', 'données et un périmètre comparables'],
    ['extraction-de-donnees', 'sans passage obligatoire par un OCR'],
    ['ia-generative', 'pas nécessairement inédit'],
  ]) await expect(page.locator(`#${id}`)).toContainText(phrase);
  await expect(page.locator('#sous-traitant-rgpd a[href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre1"]')).toHaveCount(1);
  await context.close();
});
