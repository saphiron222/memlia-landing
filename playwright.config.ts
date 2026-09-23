import { defineConfig } from '@playwright/test';
import { createHash } from 'node:crypto';

const remoteUrl = process.env.QA_URL;
const localPort = 20_000 + (Number.parseInt(createHash('sha256').update(process.cwd()).digest('hex').slice(0, 8), 16) % 20_000);
const baseURL = remoteUrl ?? `http://127.0.0.1:${localPort}`;

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  use: { baseURL, channel: 'chromium', screenshot: 'only-on-failure' },
  webServer: remoteUrl ? undefined : {
    command: `npm run build:site && npm run preview -- --host 127.0.0.1 --port ${localPort}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 600_000,
  },
  reporter: [['list'], ['json', { outputFile: '.qa/playwright.json' }]],
  outputDir: '.qa/test-results',
});
