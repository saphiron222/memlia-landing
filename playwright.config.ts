import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  use: { baseURL: process.env.QA_URL ?? 'http://127.0.0.1:4321', channel: 'chromium', screenshot: 'only-on-failure' },
  reporter: [['list'], ['json', { outputFile: '.qa/playwright.json' }]],
  outputDir: '.qa/test-results',
});
