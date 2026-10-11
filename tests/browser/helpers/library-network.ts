import type { Page } from '@playwright/test';

export async function prepareLibraryNetwork(page: Page, route: string) {
  // Chromium peut découvrir l’icône après networkidle. Attendre sa réponse
  // native avant d’armer l’oracle, sans exclure aucune requête des actions.
  const favicon = page.waitForResponse(response =>
    response.request().resourceType() === 'other' &&
    ['/favicon.svg', '/favicon-32.png'].includes(new URL(response.url()).pathname));
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  const response = await favicon;
  if (!response.ok()) throw new Error(`Favicon HTTP ${response.status()}: ${response.url()}`);
  const error = await response.finished();
  if (error) throw error;
}
