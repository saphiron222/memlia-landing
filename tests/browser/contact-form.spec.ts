import { test, expect } from '@playwright/test';

/**
 * Sans JavaScript le courriel reste proposé ; avec JavaScript, l’envoi en place exige un jeton
 * de vérification et dit ce qui s'est passé sans quitter la
 * page. La fonction elle-même est éprouvée par tests/scripts/contact-function.test.mjs ; ici,
 * la route est interceptée pour jouer ses réponses.
 */
test('contact : sans JavaScript, le formulaire reste bloqué et le courriel reste disponible', async ({ browser }) => {
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
  await expect(form.locator('button[type="submit"]')).toBeDisabled();
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  await contexte.close();
});

test('contact : avec JavaScript, l’envoi reste en place et affiche le résultat', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ sitekey: 'cle-test' }) });
      return;
    }
    corps.push(route.request().postData() ?? '');
    const code = corps.length === 1 ? { status: 400, body: { ok: false, code: 'message' } } : { status: 200, body: { ok: true } };
    await route.fulfill({ status: code.status, contentType: 'application/json', body: JSON.stringify(code.body) });
  });
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.turnstile={render:()=>{},reset:()=>document.querySelector("[name=cf-turnstile-response]")?.remove()}' }));
  // L'envoi en place part en multipart (FormData) : on garde le corps brut et on y lit les champs.
  const corps: string[] = [];
  const champ = (brut: string, nom: string) => brut.match(new RegExp(`name="${nom}"\\r\\n\\r\\n([^\\r]*)\\r\\n`))?.[1];
  await page.goto('/contact');
  await expect(page.locator('form[data-contact] button[type="submit"]')).toBeEnabled();
  await page.fill('#nom', 'Élodie Fictive');
  await page.fill('#cabinet', 'Cabinet Témoin');
  await page.fill('#courriel', 'elodie@exemple.test');
  await page.fill('#message', 'Chaque mois je recopie les montants de paie dans un classeur de suivi.');
  await page.check('#consentement');
  await page.click('form[data-contact] button[type="submit"]');
  await expect(page.locator('[data-etat]')).toContainText('Terminez la vérification');
  expect(corps).toHaveLength(0);
  await page.evaluate(() => {
    const jeton = document.createElement('input');
    jeton.type = 'hidden'; jeton.name = 'cf-turnstile-response'; jeton.value = 'jeton-test';
    document.querySelector('form[data-contact]')?.appendChild(jeton);
  });
  await page.click('form[data-contact] button[type="submit"]');
  const etat = page.locator('[data-etat]');
  await expect(etat).toBeVisible();
  await expect(etat).toHaveAttribute('data-ok', 'non');
  await expect(etat).toContainText('vingt caractères');
  // Le champ reste rempli après un refus : rien n'est perdu, on corrige et on renvoie.
  await expect(page.locator('#message')).toHaveValue(/recopie/);
  await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(0);
  await page.click('form[data-contact] button[type="submit"]');
  expect(corps).toHaveLength(1);
  await page.evaluate(() => {
    const jeton = document.createElement('input');
    jeton.type = 'hidden'; jeton.name = 'cf-turnstile-response'; jeton.value = 'nouveau-jeton';
    document.querySelector('form[data-contact]')?.appendChild(jeton);
  });
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

test('contact : expiration et champs préservés sur mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"sitekey":"cle-test"}' }));
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: 'window.turnstile={render:(_node,options)=>{window.challenge=options; const input=document.createElement("input"); input.name="cf-turnstile-response"; input.value="jeton"; input.type="hidden"; document.querySelector("[data-contact]").append(input)},reset:()=>document.querySelector("[name=cf-turnstile-response]")?.remove()}',
  }));
  await page.goto('/contact');
  await page.fill('#nom', 'Camille Fictive');
  await page.evaluate(() => (window as typeof window & { challenge: { 'expired-callback': () => void } }).challenge['expired-callback']());
  await expect(page.locator('[data-etat]')).toContainText('expiré');
  await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(0);
  await expect(page.locator('#nom')).toHaveValue('Camille Fictive');
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

for (const [viewport, expectedSize, expectedWidth] of [[320, 'compact', 150], [375, 'compact', 150], [768, 'normal', 300]] as const) {
  test(`contact : widget Turnstile atteignable sans débordement à ${viewport} px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 700 });
    await page.route('**/api/contact', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"sitekey":"cle-test"}' }));
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.fulfill({
      status: 200, contentType: 'application/javascript',
      body: `window.turnstile={render:(node,options)=>{window.beforeWidgetScrollWidth=document.documentElement.scrollWidth;node.dataset.size=options.size||'normal';const control=document.createElement('button');control.type='button';control.textContent='Vérification fictive';control.style.width=(options.size==='compact'?'150px':'300px');control.style.height='65px';node.append(control)},reset:()=>{}}`,
    }));
    await page.goto('/contact');
    const widget = page.locator('[data-turnstile]');
    const control = widget.getByRole('button', { name: 'Vérification fictive' });
    await expect(widget).toHaveAttribute('data-size', expectedSize);
    await expect(control).toHaveCSS('width', `${expectedWidth}px`);
    expect(await page.evaluate(() => (window as typeof window & { beforeWidgetScrollWidth: number }).beforeWidgetScrollWidth <= window.innerWidth)).toBe(true);
    await control.scrollIntoViewIfNeeded();
    await expect(control).toBeInViewport({ ratio: 1 });
    await control.focus();
    await expect(control).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('contact : échec de chargement du widget, aucun envoi et alternative courriel', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"sitekey":"cle-test"}' }));
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.abort());
  await page.goto('/contact');
  await page.fill('#nom', 'Camille Fictive');
  await expect(page.locator('form[data-contact] button[type="submit"]')).toBeDisabled();
  await expect(page.locator('[data-etat]')).toContainText('ne se charge pas');
  await expect(page.locator('#nom')).toHaveValue('Camille Fictive');
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
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
