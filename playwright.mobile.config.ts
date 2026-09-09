import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'mobile-menu.spec.ts',
  use: { ...base.use, channel: undefined },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({
    name: browserName,
    use: { browserName: browserName as 'chromium' | 'firefox' | 'webkit' },
  })),
  reporter: [['list'], ['json', { outputFile: '.qa/mobile-menu.json' }]],
  outputDir: '.qa/mobile-menu-results',
});
