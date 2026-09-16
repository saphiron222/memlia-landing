import { test, expect } from '@playwright/test';

const VIDEO_SRC = '/media/r9/explainer-hero-45s.mp4';

test('R8 démarre muette en boucle puis repart à zéro avec le son', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const player = page.locator('[data-video-player]');
  const video = player.locator('video');
  const soundButton = player.getByRole('button', { name: 'Activer le son' });

  await expect(video).toHaveAttribute('src', VIDEO_SRC);
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).not.toHaveAttribute('controls', '');
  await expect(soundButton).toBeVisible();
  const overlay = player.locator('[data-video-overlay]');
  await expect(overlay.locator(':scope > [data-video-sound]')).toHaveCount(1);
  await expect(overlay.locator(':scope > *')).toHaveCount(1);
  await expect(player.locator('.hero-video-invitation')).toHaveCount(0);
  await expect(player).not.toContainText('La vidéo redémarrera depuis le début.');
  expect(await overlay.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderStyle: style.borderStyle,
      boxShadow: style.boxShadow,
      padding: style.padding,
      backdropFilter: style.backdropFilter,
    };
  })).toEqual({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderStyle: 'none',
    boxShadow: 'none',
    padding: '0px',
    backdropFilter: 'none',
  });
  const soundButtonStyle = await soundButton.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      boxShadow: style.boxShadow,
      backdropFilter: style.backdropFilter,
    };
  });
  expect(soundButtonStyle.boxShadow).not.toBe('none');
  expect(soundButtonStyle.backdropFilter).toContain('blur(');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0.1);
  expect(await video.evaluate((element: HTMLVideoElement) => ({
    muted: element.muted,
    loop: element.loop,
    paused: element.paused,
  }))).toEqual({ muted: true, loop: true, paused: false });
  await expect(video).toHaveAttribute('aria-label', 'Mettre la vidéo en pause');

  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = 8; });
  await soundButton.click();

  await expect(soundButton).toBeHidden();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeLessThan(2);
  expect(await video.evaluate((element: HTMLVideoElement) => ({
    muted: element.muted,
    loop: element.loop,
    paused: element.paused,
  }))).toEqual({ muted: false, loop: false, paused: false });
  await expect(video).not.toHaveAttribute('controls', '');
});

test('surface, Entrée et Espace basculent uniquement pause et reprise', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const video = page.locator('[data-video-player] video');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);

  await video.click({ position: { x: 12, y: 12 } });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(video).toHaveAttribute('aria-label', 'Reprendre la vidéo');

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let index = 0; index < 100 && !(await video.evaluate(element => element === document.activeElement)); index++) {
    await page.keyboard.press('Tab');
  }
  await expect(video).toBeFocused();
  await expect(video).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await expect(video).toHaveAttribute('aria-label', 'Mettre la vidéo en pause');
  await page.keyboard.press('Space');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(video).toHaveAttribute('aria-label', 'Reprendre la vidéo');
  await expect(video).not.toHaveAttribute('controls', '');
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`reduced-motion garde le poster et une action explicite à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');

    const player = page.locator('[data-video-player]');
    const video = player.locator('video');
    await expect(video).toHaveAttribute('poster', '/media/r8/hero-poster-1200.webp');
    await expect(video).not.toHaveAttribute('autoplay', '');
    const soundButton = player.getByRole('button', { name: 'Activer le son' });
    await expect(soundButton).toBeVisible();
    const soundButtonBox = await soundButton.boundingBox();
    expect(soundButtonBox?.height).toBeGreaterThanOrEqual(44);
    expect(soundButtonBox?.width).toBeGreaterThanOrEqual(44);
    expect(await video.evaluate((element: HTMLVideoElement) => ({
      paused: element.paused,
      time: element.currentTime,
      width: element.videoWidth,
      height: element.videoHeight,
    }))).toEqual({ paused: true, time: 0, width: 1920, height: 1080 });
    const track = video.locator('track');
    expect(await track.getAttribute('default')).toBeNull();
    expect(await video.evaluate((element: HTMLVideoElement) => element.textTracks[0].mode)).toBe('disabled');
    await video.evaluate((element: HTMLVideoElement) => { element.textTracks[0].mode = 'hidden'; });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.textTracks[0]?.cues?.length)).toBe(20);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
  });
}

test('un refus autoplay affiche un état accessible et actionnable', async ({ page }) => {
  await page.addInitScript(() => {
    const nativePlay = HTMLMediaElement.prototype.play;
    let firstCall = true;
    HTMLMediaElement.prototype.play = function () {
      if (firstCall) {
        firstCall = false;
        return Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
      }
      return nativePlay.call(this);
    };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');

  const player = page.locator('[data-video-player]');
  await expect(player.getByRole('status')).toContainText('La lecture automatique n’a pas démarré.');
  await expect(player.getByRole('button', { name: 'Activer le son' })).toBeVisible();
  await expect(player.locator('video')).toHaveAttribute('aria-label', 'Reprendre la vidéo');
});

test('une erreur média affiche un fallback téléchargeable sans faux état de lecture', async ({ page }) => {
  await page.route(`**${VIDEO_SRC}`, route => route.abort());
  await page.goto('/');

  const player = page.locator('[data-video-player]');
  await expect.poll(() => player.locator('video').evaluate((element: HTMLVideoElement) => element.error?.code)).toBeGreaterThan(0);
  await expect(player.getByRole('status')).toContainText('La vidéo ne peut pas être lue.');
  await expect(player.getByRole('link', { name: 'Télécharger la vidéo' })).toHaveAttribute('href', VIDEO_SRC);
  await expect(player.locator('video')).toHaveAttribute('aria-label', 'Vidéo indisponible');
  await expect(player.locator('video')).not.toHaveAttribute('controls', '');
});

test('fallback et sous-titres restent disponibles sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  await expect(page.locator('video')).not.toHaveAttribute('controls', '');
  await expect(page.locator('video track')).toHaveAttribute('src', '/media/r9/explainer.vtt');
  await expect(page.locator('.hero-video-noscript')).toContainText('Votre navigateur ne peut pas lancer le lecteur interactif.');
  await expect(page.getByRole('link', { name: 'Télécharger la vidéo' })).toHaveAttribute('href', VIDEO_SRC);
  await expect(page.locator('[data-proof]')).toHaveCount(9);
  await context.close();
});
