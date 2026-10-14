import type { Page } from '@playwright/test';

/*
 * L'image figée d'un outil est chargée à la demande (`loading="lazy"`, épure du 14/10/2026) : le
 * parcours qui la fait défiler déclenche sa requête, sans rapport avec les valeurs saisies. Un
 * garde « zéro requête après armement » charge donc toutes les images de la page AVANT d'armer ;
 * toute requête partie ensuite reste comptée, image comprise.
 */
export async function chargerImagesDifferees(page: Page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = 'eager';
    await Promise.all(images.map((image) => (image.complete ? undefined : new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true });
      image.addEventListener('error', () => resolve(), { once: true });
    }))));
  });
  await page.waitForLoadState('networkidle');
}
