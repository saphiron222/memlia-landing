import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`CAC captions hit-test before interaction at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/commissaires-aux-comptes');
    const button = page.locator('[data-video-captions]');
    await expect(button).not.toHaveAttribute('hidden');
    // Scroll only the document: locator.click/focus/scrollIntoView can scroll the
    // overflow-hidden screen and make an initially clipped button look usable.
    await page.evaluate(() => {
      const screen = document.querySelector('[data-video-player]')!;
      window.scrollBy(0, screen.getBoundingClientRect().top - 100);
    });
    const geometry = await button.evaluate((node: HTMLButtonElement) => {
      const screen = node.closest('[data-video-player]')!;
      const video = screen.querySelector('video')!;
      const box = node.getBoundingClientRect();
      const image = video.getBoundingClientRect();
      const points = [[box.left + box.width / 2, box.top + box.height / 2],
        [box.left + 2, box.top + box.height / 2], [box.right - 2, box.top + box.height / 2]];
      return { scrollTop: screen.scrollTop, scrollLeft: screen.scrollLeft,
        hit: points.every(([x, y]) => node.contains(document.elementFromPoint(x, y))),
        belowImage: box.top >= image.bottom, x: box.left + box.width / 2,
        y: box.top + box.height / 2, image: { x: image.x, y: image.y, width: image.width, height: image.height } };
    });
    expect(geometry.scrollTop).toBe(0);
    expect(geometry.scrollLeft).toBe(0);
    expect(geometry.belowImage).toBe(true);
    expect(geometry.hit).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`captions-${width}-before.png`) });
    // Physical click, with no locator auto-scroll, must actually enable captions.
    await page.mouse.click(geometry.x, geometry.y);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(await page.locator('video').evaluate((v: HTMLVideoElement) => v.textTracks[0].mode)).toBe('showing');
    expect(await page.locator('[data-video-player]').evaluate(node => node.scrollTop)).toBe(0);
    await page.mouse.click(geometry.x, geometry.y);
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(await page.locator('video').evaluate((v: HTMLVideoElement) => v.textTracks[0].mode)).toBe('disabled');
  });
}
