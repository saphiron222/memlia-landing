import { test, expect } from '@playwright/test';
import { CTA } from '../../src/data/site.mjs';
import { DESTINATIONS } from '../navigation-attendue.mjs';

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

test('ancre FAQ : le fragment ouvre le détail, le clavier le referme', async ({ page }) => {
  // La navigation mobile est servie dans le flux depuis le site v2 : elle est couverte
  // par navigation-mobile.spec.ts, plus par un panneau à ouvrir ici.
  await page.setViewportSize({ width: 375, height: 812 });
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
  await expect(page.locator('#usages')).not.toContainText('Exemples non contractuels');
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

test('contenu et navigation sans JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.faq-r').first()).toBeVisible();
  await expect(page.locator('[data-mobile-visible] a[href="/#methode"]')).toBeVisible();
  await context.close();
});

test('reduced-motion garde les étapes lisibles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-h1')).toHaveCSS('animation-name', 'none');
  for (const step of await page.locator('[data-etape]').all()) await expect(step).toHaveCSS('opacity', '1');
});

test('navigation desktop : quatre destinations atteignables au clavier et CTA unique', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const links = page.locator('.nav-centre a');
  await expect(links).toHaveText(DESTINATIONS);
  for (const fragment of ['usages', 'methode', 'preuves', 'questions']) {
    await page.goto('/');
    await page.locator('[aria-controls="sous-menu-lecture"]').focus();
    await page.keyboard.press('Enter');
    const link = page.locator(`.nav-centre a[href="/#${fragment}"]`);
    await link.focus();
    await link.press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${fragment}$`));
    await expect(page.locator(`#${fragment}`)).toBeVisible();
  }
  await page.goto('/');
  await expect(page.locator('.nav-principal')).toHaveText(CTA.nav.libelle);
  await expect(page.locator('.nav-principal')).toHaveAttribute('href', '/contact');
});

test('accueil : les six ancres historiques restent des cibles servies', async ({ page }) => {
  // La navigation v2 pointe des pages, plus des ancres. Les liens entrants acquis
  // pointent encore ces fragments : leurs cibles doivent survivre à la refonte.
  await page.goto('/');
  for (const id of ['usages', 'methode', 'integration', 'garanties', 'questions', 'preuves']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
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
    await expect(step.locator('.functional-proof img')).toBeVisible();
  }
});

test('fragment malformé toléré, navigation intacte et sans erreur', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#%');
  await expect(page.locator('[data-mobile-visible] a')).toHaveCount(DESTINATIONS.length);
  await expect(page.locator('[data-burger]')).toBeHidden();
  await expect(page.locator('#menu-mobile')).toBeHidden();
  expect(errors).toEqual([]);
});
