import { test, expect } from '@playwright/test';

const mobileSource = '/media/r9/explainer-hero-45s-mobile.mp4';
const desktopSource = '/media/r9/explainer-hero-45s.mp4';

for (const width of [375, 767, 768, 1440]) {
  test(`la rendition respecte le viewport et ne transfère rien au repos à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 823 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('.mp4')) requests.push(request.url());
    });
    await page.goto('/');
    const video = page.locator('[data-video]');
    await expect(video).toHaveAttribute('preload', 'none');
    await page.waitForTimeout(1500);
    expect(requests).toEqual([]);
    await page.getByRole('button', { name: 'Activer le son' }).click();
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0.1);
    await expect(video).toHaveAttribute('src', width < 768 ? mobileSource : desktopSource);
    expect(requests.every(url => url.endsWith(width < 768 ? mobileSource : desktopSource))).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
    expect(await video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(false);
    await video.focus();
    await page.keyboard.press('Space');
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await page.keyboard.press('Enter');
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
    await video.evaluate((element: HTMLVideoElement) => { element.textTracks[0].mode = 'hidden'; });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.textTracks[0].cues?.length)).toBe(20);
  });
}

test('mobile hors écran conserve le poster sans transfert avant défilement', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 400 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const requests: string[] = [];
  page.on('request', request => { if (request.url().includes('.mp4')) requests.push(request.url()); });
  await page.goto('/');
  expect(await page.locator('[data-video]').evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThan(400);
  await page.waitForTimeout(1500);
  expect(requests).toEqual([]);
  const video = page.locator('[data-video]');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await expect(video).toHaveAttribute('src', mobileSource);
  expect(requests.every(url => url.endsWith(mobileSource))).toBe(true);
});

test('la rendition mobile reste sous deux mégaoctets et plus légère que le master', async ({ request }) => {
  const mobile = await request.get(mobileSource);
  expect(mobile.status()).toBe(200);
  const desktop = await request.get(desktopSource);
  const mobileBytes = (await mobile.body()).byteLength;
  expect(mobileBytes).toBeLessThan(2_000_000);
  expect(mobileBytes).toBeLessThan((await desktop.body()).byteLength * 0.7);
});
