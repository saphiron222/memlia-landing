import { test, expect } from '@playwright/test';

for (const choice of ['refus', 'accord', 'retrait avant envoi']) {
  test(`contact : provenance facultative, ${choice}`, async ({ page }) => {
    const payloads: FormData[] = [];
    await page.route('**/api/contact', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: { sitekey: 'cle-test' } });
        return;
      }
      const request = route.request();
      const body = await new Response(new Uint8Array(request.postDataBuffer()!), { headers: { 'content-type': request.headers()['content-type'] } }).formData();
      payloads.push(body);
      await route.fulfill({ json: { ok: true } });
    });
    await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.fulfill({
      contentType: 'application/javascript',
      body: 'window.turnstile={render:()=>{const i=document.createElement("input");i.type="hidden";i.name="cf-turnstile-response";i.value="jeton-test";document.querySelector("[data-contact]").append(i)},reset:()=>{}}',
    }));
    await page.goto('/contact', { referer: new URL('/garanties', test.info().project.use.baseURL).href });
    const consent = page.locator('#consentement_origine');
    await expect(consent).not.toBeChecked();
    await expect(consent).not.toHaveAttribute('required');
    await expect(page.locator('#origine')).toHaveValue('');
    await expect(page.locator('label[for="consentement"]')).not.toContainText('comprendre la page');
    await page.fill('#nom', 'Camille Fictive');
    const typeCabinet = page.getByLabel('Type de cabinet');
    await expect(typeCabinet).not.toHaveAttribute('required');
    await expect(typeCabinet).toHaveValue('');
    await expect(typeCabinet.locator('option')).toHaveText(['Choisir un type de cabinet', 'Expertise comptable', 'Commissariat aux comptes', 'Mixte']);
    if (choice === 'accord') await typeCabinet.selectOption('cac');
    await page.fill('#courriel', 'camille@exemple.test');
    await page.fill('#message', 'Chaque mois nous comparons deux exports dans un classeur.');
    await page.check('#consentement');
    if (choice !== 'refus') {
      await consent.check();
      await expect(page.locator('#origine')).toHaveValue('/garanties');
    }
    if (choice === 'retrait avant envoi') {
      await consent.uncheck();
      await expect(page.locator('#origine')).toHaveValue('');
    }
    await page.locator('form button[type="submit"]').click();
    await expect(page.locator('[data-etat]')).toContainText('Message envoyé');
    expect(payloads).toHaveLength(1);
    expect(payloads[0].get('origine')).toBe(choice === 'accord' ? '/garanties' : '');
    expect(payloads[0].get('type_cabinet')).toBe(choice === 'accord' ? 'cac' : '');
    expect(payloads[0].get('consentement_origine')).toBe(choice === 'accord' ? 'on' : null);
    await expect(consent).not.toBeChecked();
    await expect(typeCabinet).toHaveValue('');
    await expect(page.locator('#origine')).toHaveValue('');
  });
}
