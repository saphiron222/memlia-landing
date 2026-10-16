import {test,expect} from '@playwright/test';
// La légende textuelle remplace les sous-titres d’une vidéo qui ne figure plus sur la page.
for(const width of [375,1440])test(`CAC : légende de scène visible dans le flux à ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/commissaires-aux-comptes');const fig=page.locator('[data-scene="cac"]');const img=fig.locator('img'),caption=fig.locator('figcaption');await caption.scrollIntoViewIfNeeded();await expect(caption).toBeVisible();const a=(await img.boundingBox())!,b=(await caption.boundingBox())!;expect(b.y).toBeGreaterThanOrEqual(a.y+a.height);await expect(page.locator('[data-video-captions]')).toHaveCount(0);
});
