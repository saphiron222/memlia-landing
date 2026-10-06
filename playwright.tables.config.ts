import { defineConfig } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({
  ...config,
  testMatch: 'table-keyboard.spec.ts',
  use: { ...config.use, channel: undefined },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  reporter: [['list'], ['json', { outputFile: '.qa/table-keyboard.json' }]],
});
