import { test, expect } from '@playwright/test';
import { GLOSSARY_ENTRIES } from '../../src/data/glossary';
import { CONNECTEURS } from '../../src/data/connecteurs';
import { assertGlossaryInventory, widths } from './helpers/inventories';

const fictitiousTerm = { ...GLOSSARY_ENTRIES[0], anchor: 'z-test-inventory', term: 'Zèbre fictif' };
const fictitiousConnector = { ...CONNECTEURS[0], id: 'connecteur-fictif-inventory', nom: 'Xylophone fictif' };
async function assertConnectorInventory(page: import('@playwright/test').Page, entries: readonly {id:string;nom:string}[]) {
  expect(entries.length).toBeGreaterThan(0);
  const actual = await page.locator('[data-connecteur]').evaluateAll(cards => cards.map(card => ({
    id: card.id, nom: card.querySelector('h3')?.textContent?.replace(/\s+/g, ' ').trim(),
  })).sort((a,b) => a.id.localeCompare(b.id)));
  expect(new Set(actual.map(card => card.id)).size).toBe(actual.length);
  expect(actual).toEqual(entries.map(({id,nom}) => ({id,nom})).sort((a,b) => a.id.localeCompare(b.id)));
}

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
  test(`connecteur ajouté : inventaire et recherche à ${width}px sans modifier le parcours`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto('/integrations'))?.status()).toBe(200);
    // Le catalogue commun remplace les pages de guides. Le témoin étend le vrai dessin
    // de carte et passe par la recherche de production, comme un ajout aux données.
    await page.evaluate(({id,nom}) => {
      const base = document.querySelector<HTMLElement>('[data-connecteur]')!;
      const card = base.cloneNode(true) as HTMLElement;
      card.id = id; card.dataset.connecteur = id;
      card.querySelector('h3')!.textContent = nom;
      card.querySelector('.connecteur-marque')!.textContent = 'Logiciel fictif';
      base.parentElement!.append(card);
    }, fictitiousConnector);
    await assertConnectorInventory(page, [...CONNECTEURS,fictitiousConnector]);
    await page.getByLabel('Le nom de votre logiciel', {exact:true}).fill(fictitiousConnector.nom);
    await expect(page.locator('[data-connecteur]:visible')).toHaveCount(1);
    const card=page.locator(`#${fictitiousConnector.id}`);
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('h3')).toHaveText(fictitiousConnector.nom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

for (const mutation of ['absence','substitution']) {
  test(`inventaire des connecteurs refuse une ${mutation}`, async ({ page }) => {
    await page.goto('/integrations');
    await page.locator('[data-connecteur]').first().evaluate((card,mutation) => {
      if(mutation==='absence')card.remove();
      else {card.id='substitution-inventory';(card as HTMLElement).dataset.connecteur=card.id;}
    },mutation);
    await expect(assertConnectorInventory(page,CONNECTEURS)).rejects.toThrow();
  });
}
