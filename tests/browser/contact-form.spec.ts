import { test, expect } from '@playwright/test';

/**
 * Le formulaire de contact tient deux régimes : sans JavaScript, un envoi HTML classique vers
 * la fonction ; avec JavaScript, un envoi en place qui dit ce qui s'est passé sans quitter la
 * page. La fonction elle-même est éprouvée par tests/scripts/contact-function.test.mjs ; ici,
 * la route est interceptée pour jouer ses réponses.
 */
test('contact : le formulaire est complet et poste vers la fonction sans JavaScript', async ({ browser }) => {
  const contexte = await browser.newContext({ javaScriptEnabled: false });
  const page = await contexte.newPage();
  await page.goto('/contact');
  const form = page.locator('form[data-contact]');
  await expect(form).toHaveAttribute('method', 'post');
  await expect(form).toHaveAttribute('action', '/api/contact');
  for (const nom of ['nom', 'courriel', 'message']) await expect(form.locator(`[name="${nom}"]`)).toHaveAttribute('required', '');
  await expect(form.locator('[name="consentement"]')).toHaveAttribute('required', '');
  await expect(form.locator('input[type="file"]')).toHaveCount(0);
  // Le piège n'est ni visible ni atteignable au clavier.
  const piege = form.locator('[name="site_web"]');
  await expect(piege).toHaveAttribute('tabindex', '-1');
  await expect(piege).not.toBeInViewport();
  await expect(page.locator('h1')).toHaveCount(1);
  await contexte.close();
});

test('contact : avec JavaScript, l’envoi reste en place et affiche le résultat', async ({ page }) => {
  // L'envoi en place part en multipart (FormData) : on garde le corps brut et on y lit les champs.
  const corps: string[] = [];
  const champ = (brut: string, nom: string) => brut.match(new RegExp(`name="${nom}"\\r\\n\\r\\n([^\\r]*)\\r\\n`))?.[1];
  await page.route('**/api/contact', async (route) => {
    corps.push(route.request().postData() ?? '');
    const code = corps.length === 1 ? { status: 400, body: { ok: false, code: 'message' } } : { status: 200, body: { ok: true } };
    await route.fulfill({ status: code.status, contentType: 'application/json', body: JSON.stringify(code.body) });
  });
  await page.goto('/contact');
  await page.fill('#nom', 'Élodie Fictive');
  await page.fill('#cabinet', 'Cabinet Témoin');
  await page.fill('#courriel', 'elodie@exemple.test');
  await page.fill('#message', 'Chaque mois je recopie les montants de paie dans un classeur de suivi.');
  await page.check('#consentement');
  await page.click('form[data-contact] button[type="submit"]');
  const etat = page.locator('[data-etat]');
  await expect(etat).toBeVisible();
  await expect(etat).toHaveAttribute('data-ok', 'non');
  await expect(etat).toContainText('vingt caractères');
  // Le champ reste rempli après un refus : rien n'est perdu, on corrige et on renvoie.
  await expect(page.locator('#message')).toHaveValue(/recopie/);
  await page.click('form[data-contact] button[type="submit"]');
  await expect(etat).toHaveAttribute('data-ok', 'oui');
  await expect(etat).toContainText('Message envoyé');
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('#nom')).toHaveValue('');
  expect(corps).toHaveLength(2);
  expect(champ(corps[1], 'nom')).toBe('Élodie Fictive');
  expect(champ(corps[1], 'courriel')).toBe('elodie@exemple.test');
  expect(champ(corps[1], 'consentement')).toBe('on');
  expect(champ(corps[1], 'site_web')).toBe('');
  expect(corps[1]).not.toContain('filename=');
});

test('contact : la page d’erreur nomme le champ refusé quand la fonction le lui dit, et reste juste sans lui', async ({ page }) => {
  await page.goto('/contact/erreur?champ=message');
  await expect(page.locator('[data-motif]')).toBeVisible();
  await expect(page.locator('[data-motif]')).toContainText('vingt caractères');
  await expect(page.locator('[data-generique]')).toBeHidden();
  await page.goto('/contact/erreur?champ=inconnu');
  await expect(page.locator('[data-motif]')).toBeHidden();
  await expect(page.locator('[data-generique]')).toBeVisible();
  await page.goto('/contact/erreur');
  await expect(page.locator('[data-generique]')).toBeVisible();
});

test('contact : les deux pages de réponse existent, hors index, avec un retour au formulaire', async ({ page }) => {
  for (const chemin of ['/contact/merci', '/contact/erreur']) {
    const reponse = await page.goto(chemin);
    expect(reponse?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main a[href^="/contact"]')).toHaveCount(1);
  }
});
