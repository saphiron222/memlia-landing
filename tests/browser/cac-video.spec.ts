import { test, expect } from '@playwright/test';
const path = '/commissaires-aux-comptes';
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`CAC R4 : lecture réelle, clavier et VTT sur action à ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const video = page.locator('[data-video-player] video');
    const captions = page.getByRole('button', {name:'Sous-titres', exact:true});
    expect(await video.evaluate((v:HTMLVideoElement) => v.textTracks[0].mode)).toBe('disabled');
    await expect(video.locator('track')).not.toHaveAttribute('default');
    await expect(video).toHaveAttribute('aria-describedby', 'hero-video-description');
    await expect(page.locator('#hero-video-description')).toContainText('jeu fictif');
    const imageBox = (await video.boundingBox())!;
    const captionsBox = (await captions.boundingBox())!;
    expect(captionsBox.y).toBeGreaterThanOrEqual(imageBox.y + imageBox.height);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((node:HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0,0));
    await page.screenshot({path:testInfo.outputPath(`cac-${width}-full.png`), fullPage:true});
    await page.getByRole('button', {name:'Activer le son'}).click();
    await expect.poll(() => video.evaluate((v:HTMLVideoElement) => v.currentTime)).toBeGreaterThan(.1);
    expect(await video.evaluate((v:HTMLVideoElement) => ({muted:v.muted, loop:v.loop, duration:v.duration, width:v.videoWidth, height:v.videoHeight}))).toEqual({muted:false,loop:false,duration:45,width:1920,height:1080});
    await video.focus();
    await page.keyboard.press('Space');
    await expect.poll(() => video.evaluate((v:HTMLVideoElement) => v.paused)).toBe(true);
    await page.keyboard.press('Enter');
    await expect.poll(() => video.evaluate((v:HTMLVideoElement) => v.paused)).toBe(false);
    await captions.click();
    await expect(captions).toHaveAttribute('aria-pressed','true');
    await expect.poll(() => video.evaluate((v:HTMLVideoElement) => v.textTracks[0].cues?.length)).toBe(12);
    expect(await video.evaluate((v:HTMLVideoElement) => v.textTracks[0].mode)).toBe('showing');
    await captions.click();
    await expect(captions).toHaveAttribute('aria-pressed','false');
    expect(await video.evaluate((v:HTMLVideoElement) => v.textTracks[0].mode)).toBe('disabled');
    await video.evaluate((v:HTMLVideoElement) => {v.currentTime=27;v.pause();});
    await expect.poll(() => video.evaluate((v:HTMLVideoElement) => v.seeking)).toBe(false);
    await page.locator('[data-video-player]').screenshot({path:testInfo.outputPath(`cac-${width}-frame.png`)});
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}
test('CAC automatic playback remains muted and caption-free', async ({page}) => {
  await page.goto(path);
  const video=page.locator('video');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(.1);
  expect(await video.evaluate((v:HTMLVideoElement)=>({muted:v.muted,loop:v.loop,captions:v.textTracks[0].mode}))).toEqual({muted:true,loop:true,captions:'disabled'});
});
test('CAC without JavaScript exposes downloadable film and captions, not an inert button', async ({browser,baseURL}) => {
  const context=await browser.newContext({baseURL,javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto(path);
  await expect(page.locator('[data-video-captions]')).toBeHidden();
  await expect(page.getByRole('link',{name:'Télécharger les sous-titres'})).toHaveAttribute('href','/media/cac-r4/explainer.vtt');
  await expect(page.getByRole('link',{name:'Télécharger la vidéo'})).toHaveAttribute('href','/media/cac-r4/explainer-hero-45s.mp4');
  await context.close();
});
