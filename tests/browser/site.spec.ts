import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1366, 1440, 1920]) {
  test(`accueil sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const section of await page.locator('main section').all()) {
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('menu mobile au clavier et ancre FAQ', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const burger = page.locator('[data-burger]');
  await burger.focus();
  await page.keyboard.press('Enter');
  await expect(burger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#menu-mobile')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(burger).toBeFocused();
  await expect(page.locator('#menu-mobile')).toBeHidden();
  await page.goto('/#faq-recette');
  await expect(page.locator('#faq-recette')).toHaveAttribute('open', '');
  await page.locator('#faq-recette summary').press('Enter');
  await expect(page.locator('#faq-recette')).not.toHaveAttribute('open', '');
});

test('cinq usages illustratifs, aucun catalogue public', async ({ page }) => {
  await page.goto('/');
  for (const id of ['collect', 'check', 'compare', 'follow', 'decide']) {
    await expect(page.locator(`[data-usage="${id}"]`)).toHaveCount(1);
  }
  await expect(page.locator('[id^="module-"]')).toHaveCount(0);
  await expect(page.locator('#usages')).toContainText('Exemples non contractuels');
});

test('FAQ DOM et JSON-LD identiques, ancres locales complètes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const report = await page.evaluate(() => {
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!);
    const schema = graph['@graph'].find((node: { '@type': string }) => node['@type'] === 'FAQPage').mainEntity;
    const visible = [...document.querySelectorAll('.faq-item')].map(item => ({
      question: item.querySelector('.faq-question')!.textContent!.trim(),
      answer: item.querySelector('.faq-r')!.textContent!.trim(),
    }));
    const broken = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash);
    return { visible, schema, broken };
  });
  expect(report.visible).toHaveLength(11);
  expect(report.schema.map((q: { name: string; acceptedAnswer: { text: string } }) => ({ question: q.name, answer: q.acceptedAnswer.text }))).toEqual(report.visible);
  expect(report.broken).toEqual([]);
  expect(errors).toEqual([]);
});

test('contenu et navigation sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.faq-r').first()).toBeVisible();
  await expect(page.locator('.nav-sans-js a[href="#methode"]')).toBeVisible();
  await context.close();
});

test('reduced-motion garde les étapes lisibles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-h1')).toHaveCSS('animation-name', 'none');
  for (const step of await page.locator('[data-etape]').all()) await expect(step).toHaveCSS('opacity', '1');
});

test('menu desktop : ancres narratives directes et CTA unique', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const links = page.locator('.nav-centre a');
  await expect(links).toHaveText(['Usages', 'Méthode', 'Intégration', 'Garanties', 'Questions']);
  for (const id of ['usages', 'methode', 'integration', 'garanties', 'questions']) {
    const link = page.locator(`.nav-centre a[href="#${id}"]`);
    await link.focus();
    await link.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
  await expect(page.locator('.nav-principal')).toHaveText('Identifier une tâche à automatiser');
});

test('méthode mobile : chaque étape garde son image et son texte dans le flux', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.parcours-visuel')).toBeHidden();
  for (const step of await page.locator('[data-etape]').all()) {
    await step.locator('h3').scrollIntoViewIfNeeded();
    const visible = await step.locator('h3').evaluate(el => {
      const r = el.getBoundingClientRect();
      return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === el;
    });
    expect(visible).toBe(true);
    await expect(step.locator('.step-image')).toBeVisible();
  }
});

test('icônes burger exclusives et fragment malformé toléré', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#%');
  await expect(page.locator('.burger-ouvrir')).toBeVisible();
  await expect(page.locator('.burger-fermer')).toBeHidden();
  await page.locator('[data-burger]').click();
  await expect(page.locator('.burger-ouvrir')).toBeHidden();
  await expect(page.locator('.burger-fermer')).toBeVisible();
  expect(errors).toEqual([]);
});
