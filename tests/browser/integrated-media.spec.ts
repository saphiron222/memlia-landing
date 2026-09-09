import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`preuves et lecteur R7 utilisables à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const video = page.locator('video');
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).not.toHaveAttribute('autoplay', '');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(1);
    expect(await video.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, time: v.currentTime, duration: v.duration, width: v.videoWidth, height: v.videoHeight }))).toEqual({ paused: true, time: 0, duration: 45, width: 1920, height: 1080 });
    await video.focus();
    await expect(video).toBeFocused();
    await expect(page.locator('.hero-ecran')).toHaveCSS('outline-style', 'solid');
    // Un geste clavier réel sur les contrôles natifs, sans autoplay ni appel play() masquant une panne.
    await page.keyboard.press('Space');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.1);
    await page.keyboard.press('Space');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.textTracks[0]?.cues?.length)).toBe(20);
    expect(await video.evaluate((v: HTMLVideoElement) => v.textTracks[0].mode)).toBe('showing');
    const transcript = page.locator('.hero-transcript');
    await transcript.locator('summary').press('Enter');
    await expect(transcript).toHaveAttribute('open', '');
    await expect(transcript).toContainText('Vos saisies restent préservées.');
    await transcript.locator('summary').press('Enter');
    await expect(page.locator('[data-proof]')).toHaveCount(9);
    for (const proof of await page.locator('[data-proof]').all()) {
      await proof.scrollIntoViewIfNeeded();
      await expect.poll(() => proof.locator('img').evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth === 1600)).toBe(true);
      await proof.locator('summary').press('Enter');
      await expect(proof.locator('details p')).toBeVisible();
      await expect(proof.locator('.proof-zoom')).toHaveAttribute('href', /\/proofs\/\d{2}-[a-z]+\.webp/);
      await proof.locator('summary').press('Enter');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
  });
}

test('vidéo en échec : transcription et téléchargement restent accessibles', async ({ page }) => {
  await page.route('**/animatique-hero-45s.mp4', route => route.abort());
  await page.goto('/');
  await page.locator('.hero-transcript summary').press('Enter');
  await expect(page.locator('.hero-transcript')).toContainText('Copier. Vérifier. Relancer.');
  await expect(page.getByRole('link', { name: 'Télécharger la vidéo (MP4)' })).toBeVisible();
});

test('preuves et transcription utilisables sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  await page.locator('.hero-transcript summary').press('Enter');
  await expect(page.locator('.hero-transcript')).toContainText('Vous décidez.');
  for (const proof of await page.locator('[data-proof]').all()) {
    await proof.locator('summary').press('Enter');
    await expect(proof.locator('details p')).toBeVisible();
  }
  await context.close();
});
