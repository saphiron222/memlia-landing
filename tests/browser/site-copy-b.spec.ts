import { test, expect } from '@playwright/test';
import { famillesDeLaProfession } from '../../src/data/familles';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`copy publique et frontières, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [route, phrases] of [
      ['/garanties', ['Le robot ou l’agent arrête le traitement concerné et en explique la raison.', 'Votre équipe peut corriger l’entrée, rétablir l’accès ou décider de la suite.', 'Les flux du service sont documentés par mission', 'la signature reste au CAC']],
      ['/contact', ['Votre besoin, vos outils et le résultat attendu', 'Décrivez le geste sans donnée client', 'comprendre la page du site à l’origine de ma demande']],
      ['/automatisation-cabinet-comptable', ['une routine précise : un déclencheur, une règle écrite, un résultat dans vos outils', 'Votre équipe reprend les exceptions et valide les actions qui engagent le cabinet.']],
      ['/methode', ['Elle accepte ou refuse la mise en service.', 'Le cabinet garde ses corrections, son appréciation du dossier et la décision de poursuivre.']],
      ['/', ['Nous déployons nos robots et agents IA dans vos outils, avec vos règles et vos validations.', 'Nous déployons et adaptons les robots et agents déjà conçus.', 'Si votre besoin dépasse le catalogue, nous prolongeons leur prise en charge ou construisons sur mesure.', 'Aucun envoi externe sans validation humaine.']],
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
        await expect(page.locator('#usages')).toContainText(`${familles.length} familles de tâches dans ${poles.size} pôles`);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (route === '/methode') {
        await expect(page.locator('#page-evidence-title')).toHaveCount(0);
        // Décision de Kevin du 06/10/2026 : plus de section « Expérience de première main » sur les pages commerciales.
        await expect(page.locator('[data-first-hand-experience]')).toHaveCount(0);
      }
    }
  });

  test(`parcours des rubriques et produits exacts, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/integrations');
    const products = [
      ['sage-100-comptabilite', 'Sage 100 Comptabilité'],
      ['sage-100-paie-rh', 'Sage 100 Paie & RH'],
      ['cegid-loop', 'Cegid Loop'],
      ['silae', 'Silae'],
    ] as const;
    for (const [id, product] of products) {
      const carte = page.locator(`[data-connecteur="${id}"]`);
      await expect(carte.getByRole('heading', { name: product, exact: true })).toBeVisible();
      await expect(carte.locator('img')).toHaveCount(1);
      await expect(carte.locator('img')).toHaveAttribute('alt', '');
      await expect(carte.locator('.connecteur-ligne')).not.toBeEmpty();
    }
    await expect(page.locator('main a[href^="/integrations/"]')).toHaveCount(0);
    await expect(page.locator('main')).toContainText('Vos outils. Nos robots et agents IA.');
    await expect(page.locator('main')).toContainText('Votre logiciel n’est pas listé ? Nous l’intégrons sur demande.');
    for (const href of ['/automatisation-cabinet-comptable', '/agents-ia']) await expect(page.locator(`main a[href="${href}"]`).first()).toBeAttached();
    for (const [route, slugs] of [
      ['paie-dsn-cabinet-comptable', ['controler-les-bulletins-de-paie-avant-la-dsn', 'comprendre-les-comptes-rendus-metier-dsn', 'suivre-la-production-sociale-dans-excel']],
      ['gestion-pieces-comptables', ['automatiser-la-relance-des-pieces-clients', 'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier']],
      ['ia-cabinet-comptable', ['utiliser-chatgpt-cabinet-comptable', 'logiciel-ia-comptabilite', 'prompt-chatgpt-expert-comptable', 'ia-comptabilite-confidentialite-donnees', 'verifier-reponse-ia-comptabilite', 'automatiser-avec-ia-sans-changer-logiciel', 'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain', 'tests-verts-et-regle-des-trois-passes']],
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
