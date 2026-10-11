import { expect, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { proofSrcset, proofSizes } from '../../scripts/lib/responsive-proofs.mjs';

// naturalWidth est corrigé par la densité du candidat responsive, pas la largeur du master.
export async function expectProofSelection(image: Locator, source?: string) {
  await image.evaluate((img: HTMLImageElement) => img.decode());
  const actual = await image.evaluate((img: HTMLImageElement) => ({
    src: img.getAttribute('src')!, srcset: img.getAttribute('srcset'), sizes: img.getAttribute('sizes'),
    lazy: img.loading === 'lazy', selected: new URL(img.currentSrc).pathname,
    dimensions: [img.getAttribute('width'), img.getAttribute('height')],
    natural: [img.naturalWidth, img.naturalHeight],
  }));
  if (source) expect(actual.src).toBe(source);
  expect(actual.dimensions).toEqual(['1600', '900']);
  const canonical = proofSrcset(actual.src, readFileSync(join('public', actual.src)));
  if (actual.srcset) {
    expect(actual.srcset).toBe(canonical);
    expect(actual.sizes).toBe(proofSizes(actual.lazy));
    expect(canonical.split(', ').map((candidate: string) => candidate.split(' ')[0])).toContain(actual.selected);
  } else {
    // Les fixtures techniques injectées après build utilisent toujours le master seul.
    expect(actual.selected).toBe(actual.src);
    expect(actual.natural).toEqual([1600, 900]);
  }
  expect(actual.natural[0]).toBeGreaterThan(0);
  expect(Math.abs(actual.natural[1] - actual.natural[0] * 9 / 16)).toBeLessThanOrEqual(1);
}
