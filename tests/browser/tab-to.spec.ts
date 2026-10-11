import { test, expect } from '@playwright/test';
import { tabTo } from './helpers/tab-to';

for (const reachable of [true, false]) {
  test(`navigation complète avec plus de 100 liens : cible ${reachable ? 'accessible' : 'hors tabulation'}`, async ({ page }) => {
    await page.setContent(`
      <video ${reachable ? 'tabindex="0"' : ''} style="width:200px;height:100px"></video>
      <footer>${Array.from({ length: 120 }, (_, index) => `<a href="#lien-${index}">Lien ${index}</a>`).join(' ')}</footer>
    `);
    const video = page.locator('video');
    await video.click();
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    if (reachable) {
      await tabTo(page, video);
      await expect(video).toBeFocused();
    } else {
      await expect(tabTo(page, video)).rejects.toThrow('Cycle de tabulation');
      await expect(video).not.toBeFocused();
    }
  });
}
