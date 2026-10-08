import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { population, cloture, regle, selection, confirmations, immobilisations } from '../../docs/design/accueil-cac-proofs/fixture.mjs';
import { html } from '../../docs/design/accueil-cac-proofs/build-source.mjs';
import { MEDIAS_CAC, CONTENU_CAC } from '../../src/data/accueil/cac.ts';
const registry = readFileSync('src/data/proofs.ts', 'utf8');
const source = 'docs/design/accueil-cac-proofs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
test('la fixture rejoue les résultats affichés et la source ne dérive pas', () => {
  assert.equal(readFileSync(`${source}/index.html`, 'utf8'), html);
  const first = selection(population), last = selection(cloture);
  assert.deepEqual(first.retenus.map(row => row.id), ['R01', 'R02', 'R03']);
  assert.deepEqual(last.retenus.map(row => row.id), ['R01', 'R07', 'R02', 'R03']);
  assert.equal(first.montant, 90000);
  assert.equal(first.total, 100000);
  assert.equal(last.montant, 130000);
  assert.equal(last.total, 140000);
  assert.deepEqual(selection(population), first);
  const byCount = selection(population, { ...regle, mode: 'nombre', solde: Infinity, mouvement: Infinity });
  assert.equal(byCount.retenus.length, 3);
  const byCoverage = selection(population, { ...regle, solde: Infinity, mouvement: Infinity });
  assert.ok(byCoverage.couverture >= regle.couverture);
  assert.equal(confirmations[0].reponse - confirmations[0].balance, -2000);
  assert.deepEqual(immobilisations.map(row => row.client - row.balance), [0, 0, 500]);
});
test('les panneaux ne chevauchent pas le pied de chaque cadre', async () => {
  const browser = await chromium.launch({ channel: 'chromium' });
  try {
    const page = await browser.newPage({ viewport: { width: 1720, height: 1000 } });
    await page.goto(pathToFileURL(resolve(source, 'index.html')).href);
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
test('les trois références CAC ont un registre et des actifs propres', async () => {
  for (const id of Object.values(MEDIAS_CAC)) {
    assert.ok(registry.includes(`'${id}'`), id);
    const path = `public/proofs/${id}.webp`;
    assert.ok(existsSync(path), path);
    const bytes = readFileSync(path);
    const meta = await sharp(bytes).metadata();
    assert.deepEqual([meta.width, meta.height], [1600, 900]);
    assert.ok(bytes.length < 150000);
  }
});
test('le manifeste scelle scènes et image sociale et le poster reprend la sélection', async () => {
  const manifest = JSON.parse(readFileSync('docs/qa/accueil-cac/proofs-manifest.json'));
  assert.equal(manifest.entries.length, 4);
  for (const entry of [...manifest.sources, ...manifest.entries]) {
    assert.equal(hash(readFileSync(entry.path ?? entry.target)), entry.sha256);
  }
  assert.equal(CONTENU_CAC.hero.poster, `/proofs/${MEDIAS_CAC.selection}.webp`);
  assert.equal(CONTENU_CAC.hero.video, '');
  const og = await sharp('public/proofs/cac/og/accueil-selection-tiers.webp').metadata();
  assert.deepEqual([og.width, og.height], [1200, 630]);
});
test('les scènes montrent le geste et les frontières sans cartouche promotionnel', () => {
  const contract = JSON.parse(readFileSync(`${source}/content-contract.json`));
  assert.equal(contract.length, 3);
  const text = contract.map(row => row.centralText).join(' ');
  assert.doesNotMatch(text, /Memlia|Illustration fonctionnelle fictive|partenariat|compatibilité|FEC|revue analytique|automatisation IA/i);
  for (const expected of ['Mandat fictif Atelier des Rives', 'Couverture', 'Nombre', 'Graine', 'Intermédiaire', 'Clôture', 'Ajout', 'Validation en attente', 'Commentaire saisi', 'Appréciation du CAC', 'Non-réponse', 'Période incompatible', 'Clé multiple', 'Origine']) assert.ok(text.includes(expected), expected);
});
