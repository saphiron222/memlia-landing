import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

// QA_URL doit viser Pages (local, preview ou public), jamais astro preview qui ne sert pas _headers.
const base = process.env.QA_URL ?? 'http://127.0.0.1:8796';
const out = process.env.QA_OUT ?? '.qa/contact-chrome';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const records = [];
try {
  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    const forbiddenRequests = [];
    // Aucun envoi ni ouverture du service de rendez-vous, même si un futur parcours régresse.
    await context.route('**/*', async (route) => {
      const request = route.request();
      if ((request.method() !== 'GET' && new URL(request.url()).origin === new URL(base).origin) || /(?:calendly\.com|cal\.com)/.test(new URL(request.url()).hostname)) {
        forbiddenRequests.push({ url: request.url(), method: request.method() });
        await route.abort();
      } else await route.continue();
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__cspViolations = [];
      document.addEventListener('securitypolicyviolation', (event) => window.__cspViolations.push({ directive: event.effectiveDirective, blockedURI: event.blockedURI, sample: event.sample }));
    });
    const response = await page.goto(`${base}/contact`);
    const csp = response.headers()['content-security-policy'];
    const failures = [];
    const check = async (name, action) => {
      try { await action(); } catch (error) { failures.push({ name, error: error.message }); }
    };
    await check('CSP réelle inchangée', async () => {
      assert.equal(response.status(), 200);
      assert.match(csp, /script-src 'self' https:\/\/challenges\.cloudflare\.com;/);
      assert.doesNotMatch(csp.match(/script-src[^;]+/)[0], /unsafe-inline|unsafe-eval/);
    });
    await check('apparitions', async () => {
      await page.waitForFunction(() => document.documentElement.classList.contains('js'), null, { timeout: 2000 });
      const targets = page.locator('.rv');
      assert.ok(await targets.count() > 0);
      for (const target of await targets.all()) {
        await target.scrollIntoViewIfNeeded();
        await target.evaluate((element) => new Promise((resolve, reject) => {
          const start = Date.now();
          const poll = () => element.classList.contains('in') ? resolve(true) : Date.now() - start > 2000 ? reject(new Error('apparition non révélée')) : requestAnimationFrame(poll);
          poll();
        }));
      }
    });
    if (width === 375) {
      await check('navigation mobile visible clavier', async () => {
        const links = page.locator('[data-mobile-visible] a[href]');
        assert.equal(await links.first().isVisible(), true);
        await links.first().focus();
        await page.keyboard.press('Tab');
        assert.equal(await links.nth(1).evaluate((e) => e === document.activeElement), true);
      });
      await check('menu mobile clavier, focus et fond', async () => {
        const burger = page.locator('[data-burger]');
        const menu = page.locator('[data-menu-mobile]');
        // Le chrome actuel affiche les liens mobiles, pas le burger (display:none).
        // Exposer ce contrôle uniquement dans la sonde pour éprouver le code dormant
        // sans modifier le CSS livré ni prétendre que le menu est le parcours public.
        assert.equal(await burger.isVisible(), false);
        await burger.evaluate((e) => e.style.display = 'inline-flex');
        await burger.focus();
        await page.keyboard.press('Enter');
        assert.equal(await burger.getAttribute('aria-expanded'), 'true');
        assert.equal(await menu.isVisible(), true);
        assert.equal(await page.locator('main').evaluate((e) => e.inert), true);
        await page.keyboard.press('Tab');
        assert.equal(await menu.locator('a[href]').first().evaluate((e) => e === document.activeElement), true);
        await page.keyboard.press('Shift+Tab');
        assert.equal(await burger.evaluate((e) => e === document.activeElement), true);
        await page.keyboard.press('Escape');
        assert.equal(await menu.isVisible(), false);
        assert.equal(await burger.evaluate((e) => e === document.activeElement), true);
        assert.equal(await page.locator('main').evaluate((e) => e.inert), false);
        await burger.click();
        await burger.click();
        assert.equal(await menu.isVisible(), false);
        await burger.evaluate((e) => e.style.removeProperty('display'));
      });
      await check('footer accordéon clavier', async () => {
        const button = page.locator('.pied-bascule').first();
        assert.ok(await button.count() > 0);
        await button.focus();
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
        await page.keyboard.press('Enter');
        assert.equal(await button.getAttribute('aria-expanded'), 'true');
        const id = await button.getAttribute('aria-controls');
        assert.equal(await page.locator(`#${id}`).isVisible(), true);
        await page.keyboard.press('Space');
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator(`#${id}`).isVisible(), false);
      });
    } else {
      await check('navigation desktop clavier', async () => {
        const links = page.locator('.nav-centre a[href]');
        assert.ok(await links.count() > 1);
        await links.first().focus();
        await page.keyboard.press('Tab');
        assert.equal(await links.nth(1).evaluate((e) => e === document.activeElement), true);
        assert.equal(await page.locator('.pied-bascule').count(), 0);
        assert.equal(await page.locator('.pied-liste').first().isVisible(), true);
      });
    }
    const violations = await page.evaluate(() => window.__cspViolations);
    // SEC-02 (beacon externe) est consigné séparément ; ne pas le confondre avec SEC-01.
    const chromeViolations = violations.filter((v) => v.blockedURI === 'inline' && v.directive.startsWith('script-src'));
    await check('SEC-01 sans violation inline', async () => assert.deepEqual(chromeViolations, []));
    await check('aucune mutation ou prise de rendez-vous', async () => assert.deepEqual(forbiddenRequests, []));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/contact-${width}.png`, fullPage: true });
    records.push({ width, csp, failures, chromeViolations, otherViolations: violations.filter((v) => !chromeViolations.includes(v)), errors, forbiddenRequests });
    await context.close();
  }
} finally {
  await browser.close();
  writeFileSync(`${out}/audit.json`, JSON.stringify({ base, checkedAt: new Date().toISOString(), records }, null, 2) + '\n');
}
console.log(JSON.stringify(records, null, 2));
assert.ok(records.every((r) => r.failures.length === 0), 'contrats du chrome sous CSP : voir audit.json');
