import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

// Exécuté explicitement dans Repository gates, jamais dans le build Cloudflare.
test('les panneaux ne chevauchent pas le pied de chaque cadre', async () => {
  const browser = await chromium.launch({ channel: 'chromium' });
  try {
    const page = await browser.newPage({ viewport: { width: 1720, height: 1000 } });
    await page.goto(pathToFileURL(resolve('docs/design/accueil-cac-proofs', 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    for (const frame of await page.locator('.frame').all()) {
      const foot = await frame.locator('.foot').boundingBox();
      for (const panel of await frame.locator('.workspace > *, .panel').all()) {
        const box = await panel.boundingBox();
        assert.ok(box.y + box.height <= foot.y, await frame.getAttribute('id'));
      }
    }
  } finally { await browser.close(); }
});
