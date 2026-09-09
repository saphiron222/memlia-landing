import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`preuves et lecteur R8 utilisables à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const video = page.locator('video');
    await expect(video).toHaveAttribute('src', '/media/r8/animatique-hero-45s.mp4');
    await expect(video).toHaveAttribute('poster', '/media/r8/hero-poster-1200.webp');
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
    await expect(page.locator('.hero-transcript, .hero-media-help')).toHaveCount(0);
    await expect(page.getByText(/Lire la transcription|Lire le détail —|Illustration de fonctionnement sur données fictives, pas une capture produit\./)).toHaveCount(0);
    await expect(page.locator('[data-proof]')).toHaveCount(9);
    const url = page.url();
    const pages = page.context().pages().length;
    for (const proof of await page.locator('[data-proof]').all()) {
      await proof.scrollIntoViewIfNeeded();
      await expect.poll(() => proof.locator('img').evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth === 1600)).toBe(true);
      await expect(proof.locator(':scope > *')).toHaveCount(1);
      await expect(proof.locator('a, button, details, summary, figcaption, [tabindex], [role]')).toHaveCount(0);
      expect(await proof.innerText()).toBe('');
      const image = proof.locator('img');
      expect(await image.evaluate(i => {
        const ancestors: Element[] = [];
        for (let node: Element | null = i; node; node = node.parentElement) ancestors.push(node);
        return ancestors.filter(n => n.matches('a, button, [tabindex], [role], [onclick], [onkeydown]') || (n as HTMLElement).onclick || (n as HTMLElement).onkeydown).length;
      })).toBe(0);
      await expect(image).not.toHaveCSS('cursor', /pointer|zoom/);
      await image.focus();
      await expect(image).not.toBeFocused();
      await image.click();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Space');
      expect(page.url()).toBe(url);
      expect(page.context().pages()).toHaveLength(pages);
      await expect(page.locator('dialog, [role="dialog"], [aria-modal="true"]')).toHaveCount(0);
    }
    // Parcours Tab réel : le lecteur reste atteignable, aucune preuve ne prend le focus.
    await page.goto('/');
    let firstFocus: string | undefined;
    let cycleCompleted = false;
    let reachedVideo = false;
    for (let index = 0; index < 100; index++) {
      await page.keyboard.press('Tab');
      const state = await page.evaluate(() => ({ key: document.activeElement?.outerHTML ?? '', proof: !!document.activeElement?.closest('[data-proof]'), video: document.activeElement?.tagName === 'VIDEO' }));
      expect(state.proof).toBe(false);
      reachedVideo ||= state.video;
      if (firstFocus === undefined) firstFocus = state.key;
      else if (state.key === firstFocus) { cycleCompleted = true; break; }
    }
    expect(reachedVideo).toBe(true);
    expect(cycleCompleted).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
  });
}

test('vidéo en échec : contrôles et VTT conservés sans microtexte de remplacement', async ({ page }) => {
  await page.route('**/animatique-hero-45s.mp4', route => route.abort());
  await page.goto('/');
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.error?.code)).toBeGreaterThan(0);
  await expect(page.locator('video')).toHaveAttribute('controls', '');
  await expect(page.locator('video track')).toHaveAttribute('src', '/media/r8/animatique.vtt');
  await expect(page.locator('.hero-transcript, .hero-media-help')).toHaveCount(0);
});

test('preuves statiques et lecteur natif présents sans JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(process.env.QA_URL ?? 'http://127.0.0.1:4321');
  await expect(page.locator('video')).toHaveAttribute('controls', '');
  await expect(page.locator('[data-proof]')).toHaveCount(9);
  for (const proof of await page.locator('[data-proof]').all()) {
    await proof.scrollIntoViewIfNeeded();
    await expect(proof.locator('img')).toBeVisible();
    await expect(proof.locator(':scope > *')).toHaveCount(1);
    await expect(proof.locator('a, button, details, figcaption, [tabindex], [role]')).toHaveCount(0);
  }
  await context.close();
});
