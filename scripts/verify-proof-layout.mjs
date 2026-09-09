import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const out = '.qa/m4-r5/independent';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const base = process.env.QA_URL ?? 'http://127.0.0.1:4337';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const report = { base, reference: 'https://0ed8c587.memlia.pages.dev', comparisons: [], media: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const read = async url => {
    await page.goto(url);
    return page.evaluate(() => {
      const body = document.body.cloneNode(true);
      const removed = body.querySelectorAll('script, style');
      const excluded = removed.length;
      removed.forEach(e => e.remove());
      const clean = s => s.replace(/\s+/g, ' ').trim();
      return { excluded, text: clean(body.textContent),
        links: [...document.querySelectorAll('a')].map(a => [clean(a.textContent), a.getAttribute('href')]),
        headings: [...document.querySelectorAll('h1,h2,h3')].map(h => [h.tagName,clean(h.textContent)]),
        sections: [...document.querySelectorAll('main > section')].map(s => [s.id,s.className]),
        images: [...document.querySelectorAll('img')].map(i => [i.getAttribute('src'),i.alt]),
        video: [...document.querySelector('video').attributes].map(a => [a.name,a.value]).filter(a => !a[0].startsWith('data-astro')),
        tracks: [...document.querySelectorAll('video source,video track')].map(e => [...e.attributes].map(a => [a.name,a.value])),
        hero: document.querySelector('video').closest('section').getBoundingClientRect().toJSON() };
    });
  };
  const previous = await read(report.reference);
  const current = await read(base);
  writeFileSync(`${out}/semantic.json`, JSON.stringify({ previous, current }, null, 2));
  for (const key of Object.keys(previous).filter(k => k !== 'excluded')) {
    assert.deepEqual(current[key], previous[key], key);
    report.comparisons.push(key);
  }
  report.excludedScriptStyle = { previous: previous.excluded, current: current.excluded };
  const mediaPaths = [...current.images.map(i => i[0]), ...current.tracks.flatMap(t => t.filter(a => a[0] === 'src').map(a => a[1])), current.video.find(a => a[0] === 'poster')[1]];
  for (const path of [...new Set(mediaPaths)]) {
    const response = await page.request.get(base + path);
    assert.equal(response.status(), 200);
    const body = await response.body();
    const expected = readFileSync('dist' + path);
    assert.equal(hash(body), hash(expected), path);
    report.media.push({ path, bytes: body.length, sha256: hash(body) });
  }
  writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ base, comparisons: report.comparisons, media: report.media.length, excluded: report.excludedScriptStyle }));
} finally { await browser.close(); }
