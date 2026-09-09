/** Recette ciblée : copie exacte, garde-fous, captures et géométrie des deux sections. */
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4363';
const out = process.env.QA_OUTPUT ?? '.qa/redesign/local';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const reports = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto(base);
  const baseline = readFileSync('.qa/redesign/baseline.html', 'utf8');
  const copy = await page.evaluate(before => {
    const old = new DOMParser().parseFromString(before, 'text/html');
    const text = el => el.textContent.replace(/\s+/g, ' ').trim();
    const removed = [old.querySelector('.uses-scenario'), old.querySelector('.uses-note')].map(text);
    const oldUses = [...old.querySelectorAll('[data-usage]')].map(el => [text(el.querySelector('dt')), text(el.querySelector('dd'))]);
    const newUses = [...document.querySelectorAll('[data-usage]')].map(el => [text(el.querySelector('h3')), text(el.querySelector('.use-copy p'))]);
    const method = root => [...root.querySelectorAll('#methode .step-copy')].map(text);
    const oldMethod = method(old), newMethod = method(document);
    return { removed, oldUses, newUses, oldMethod, newMethod };
  }, baseline);
  assert.deepEqual(copy.oldUses, copy.newUses);
  assert.deepEqual(copy.oldMethod, copy.newMethod);
  // Le navigateur initialisé ajoute des classes aux éléments révélés ; comparer sans exécuter les scripts.
  const outsideStatic = await page.evaluate(before => {
    const normalize = html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const sections = doc.querySelectorAll('#usages, #methode');
      const styles = doc.querySelectorAll('style, link[rel="stylesheet"]');
      const exclusions = { sections: sections.length, styles: styles.length, scopeAttributes: 0 };
      [...sections, ...styles].forEach(el => el.remove());
      for (const el of doc.querySelectorAll('*')) for (const a of [...el.attributes]) if (a.name.startsWith('data-astro-cid-')) {
        el.removeAttribute(a.name);
        exclusions.scopeAttributes++;
      }
      return { html: doc.documentElement.outerHTML, exclusions };
    };
    const old = normalize(before.old), current = normalize(before.current);
    return { identical: old.html === current.html, old: old.exclusions, current: current.exclusions };
  }, { old: baseline, current: readFileSync('dist/index.html', 'utf8') });
  assert.equal(outsideStatic.identical, true, 'Modification hors des deux sections');
  assert.equal(outsideStatic.old.sections, 2);
  assert.deepEqual(outsideStatic.old, outsideStatic.current);
  writeFileSync(`${out}/copy.json`, JSON.stringify({ ...copy, outsideStatic }, null, 2));
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    for (const img of await page.locator('#methode img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(image => image.decode());
    }
    // Une capture d'élément long déplace le header fixed au milieu de l'image.
    // Capturer toute la page depuis son origine puis extraire les coordonnées mesurées.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const screen = await page.screenshot({ fullPage: true, animations: 'disabled' });
    const crop = async (selector, filename) => {
      const box = await page.locator(selector).boundingBox();
      assert.ok(box);
      await sharp(screen).extract({ left: Math.floor(box.x), top: Math.floor(box.y), width: Math.ceil(box.width), height: Math.ceil(box.height) + 16 }).png().toFile(`${out}/${filename}`);
    };
    for (const section of ['usages', 'methode']) await crop(`#${section}`, `${section}-${width}.png`);
    if ([375, 1440].includes(width)) for (let i = 0; i < 4; i++) await crop(`[data-etape="${i}"]`, `etape-${i + 1}-${width}.png`);
    const report = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      steps: [...document.querySelectorAll('#methode img')].map(img => ({ src: img.getAttribute('src'), alt: img.alt, natural: [img.naturalWidth, img.naturalHeight], box: img.getBoundingClientRect().toJSON() })) }));
    assert.ok(report.scrollWidth <= width);
    reports.push(report);
  }
} finally { await browser.close(); }
writeFileSync(`${out}/geometry.json`, JSON.stringify({ base, reports }, null, 2));
console.log(JSON.stringify({ base, widths: reports.length, screenshots: 20, copyUnchanged: true, outsideStatic: true, out }));
