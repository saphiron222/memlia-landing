import type { Page } from '@playwright/test';
/** Suit les contrôles visibles avant de vérifier un lien placé dans un filtre ou un accordéon. */
export async function rendreLienOutilVisible(page: Page, href: string) {
  if (new URL(page.url()).pathname === '/outils-comptables-gratuits') await page.getByRole('radio',{name:'Tous (21)'}).check();
  const lien=page.locator(`a[href="${href}"]`);
  for (const details of await page.locator('details').filter({has:lien}).all()) {
    if(await details.isVisible() && await details.getAttribute('open')===null)await details.locator(':scope > summary').click();
  }
}
