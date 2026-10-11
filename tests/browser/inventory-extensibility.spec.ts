import { test, expect } from '@playwright/test';
import { GLOSSARY_ENTRIES } from '../../src/data/glossary';
import { INTEGRATIONS_INDEXABLES } from '../../src/data/integrations';
import { assertGlossaryInventory, checkIntegrationPage, widths } from './helpers/inventories';

const fictitiousTerm = { ...GLOSSARY_ENTRIES[0], anchor: 'z-test-inventory', term: 'Zèbre fictif' };
const fictitiousGuide = { ...INTEGRATIONS_INDEXABLES[0], slug: 'guide-fictif-inventory' };

test('inventaire glossaire : ajout de terme et initiale, absence et substitution', async ({ page }) => {
  await page.goto('/glossaire');
  await page.evaluate(({ anchor, term }) => {
    const section = document.createElement('section');
    section.dataset.lettre = 'Z';
    section.id = 'lettre-z';
    const entry = document.querySelector('.glossaire-entree')!.cloneNode(true) as HTMLElement;
    entry.id = anchor;
    const link = entry.querySelector('dt a') as HTMLAnchorElement;
    link.textContent = term;
    link.href = `#${anchor}`;
    section.append(entry);
    document.querySelector('[data-glossary-list]')!.append(section);
    const letter = document.createElement('a');
    letter.href = '#lettre-z'; letter.textContent = 'Z';
    document.querySelector('.alphabet')!.append(letter);
  }, fictitiousTerm);
  const entries = [...GLOSSARY_ENTRIES, fictitiousTerm];
  await assertGlossaryInventory(page, entries);
  await page.locator(`#${fictitiousTerm.anchor}`).evaluate((node) => node.remove());
  await expect(assertGlossaryInventory(page, entries)).rejects.toThrow();
  await page.locator('.glossaire-entree').first().evaluate((node) => {
    const substitute = node.cloneNode(true) as HTMLElement;
    substitute.id = 'substitution-inventory';
    node.parentElement!.append(substitute);
  });
  await expect(assertGlossaryInventory(page, entries)).rejects.toThrow();
});

for (const width of widths) {
  test(`guide ajouté visité et contrôlé à ${width}px sans modifier le parcours`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const visited: string[] = [];
    await page.route(`**/integrations/${fictitiousGuide.slug}`, async (route) => {
      visited.push(new URL(route.request().url()).pathname);
      const response = await page.request.get(`/integrations/${INTEGRATIONS_INDEXABLES[0].slug}`);
      await route.fulfill({ status: 200, contentType: 'text/html', body: (await response.text()).replaceAll(INTEGRATIONS_INDEXABLES[0].slug, fictitiousGuide.slug) });
    });
    for (const guide of [...INTEGRATIONS_INDEXABLES, fictitiousGuide]) await checkIntegrationPage(page, guide, width);
    expect(visited).toContain(`/integrations/${fictitiousGuide.slug}`);
  });
}

for (const status of [404, 200]) {
  test(`guide absent ou invalide refusé (HTTP ${status})`, async ({ page }) => {
    await page.route(`**/integrations/${fictitiousGuide.slug}`, (route) => route.fulfill({ status, contentType: 'text/html', body: '<main><h1>Route invalide</h1></main>' }));
    await expect(checkIntegrationPage(page, fictitiousGuide, 1280)).rejects.toThrow();
  });
}
