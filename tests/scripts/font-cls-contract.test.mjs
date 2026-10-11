import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { expect } from '@playwright/test';

// Execute the actual Playwright callbacks with injected measurements, not source-shape assertions.
// This is a unit harness; only the browser jobs can establish real page geometry on Ubuntu.
const cases = [];
const source = readFileSync(new URL('../browser/font-cls.spec.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
vm.runInNewContext(compiled, {
  exports: {}, process: { env: {} },
  require(name) {
    assert.equal(name, '@playwright/test');
    return {
      test: (name, run) => cases.push({ name, run }),
      expect: (actual, message) => actual?.locator
        ? { toBeVisible: async () => {}, not: { toHaveCount: async () => {} } }
        : expect(actual, message),
    };
  },
});
const delayed = cases.filter(({ name }) => name.includes('delayed fonts'));
assert.ok(delayed.length > 0, 'actual delayed-font callbacks registered');

async function runCase(callback, osFonts, cls, delta) {
  let boxes = 0;
  const page = {
    setViewportSize: async ({ width }) => { page.width = width; },
    addInitScript: async () => {}, route: async () => {}, goto: async () => {},
    waitForTimeout: async () => {}, screenshot: async () => {},
    evaluate(fn, arg) {
      return vm.runInNewContext(`(${fn.toString()})(arg)`, {
        arg,
        FontFace: class {
          load() { return osFonts ? Promise.resolve(this) : Promise.reject(new Error('local font absent')); }
        },
        document: {
          fonts: { load: async () => [{}], ready: Promise.resolve() },
          documentElement: { scrollWidth: page.width },
        },
        window: { __shifts: [{ value: cls, time: 100 }] },
      });
    },
    locator: (selector) => ({
      locator: true,
      boundingBox: async () => ({ y: boxes++ === 0 ? 100 : 100 + delta }),
      evaluate: async () => selector === 'body'
        ? '"Hanken Grotesk", "Hanken Fallback", "Hanken Fallback Roboto", system-ui'
        : 'Fraunces, "Fraunces Fallback", "Fraunces Fallback Noto", "Fraunces Fallback Liberation", Georgia',
      fill: async () => {},
    }),
  };
  return callback.run({ page }, { annotations: [], outputPath: x => x, attach: async () => {} });
}

test('each delayed-font callback rejects bad geometry even without OS fonts', async () => {
  for (const callback of delayed) {
    for (const osFonts of [false, true]) {
      for (const [cls, delta] of [[0.8, 0], [0, 100]]) {
        await assert.rejects(() => runCase(callback, osFonts, cls, delta),
          /toBeLessThanOrEqual/, `${callback.name}: OS=${osFonts}, CLS=${cls}, delta=${delta}`);
      }
    }
  }
});

test('each delayed-font callback accepts geometry at both limits with or without OS fonts', async () => {
  for (const callback of delayed) {
    for (const osFonts of [false, true]) await runCase(callback, osFonts, 0.1, 2);
  }
});
