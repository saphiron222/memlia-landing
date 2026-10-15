import {test,expect} from '@playwright/test';
for(const width of [320,375,768,1024,1440,1920])test(`CAC : scène A et responsabilité métier à ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/commissaires-aux-comptes');await expect(page.locator('main video,[data-video-player]')).toHaveCount(0);
 const fig=page.locator('[data-scene="cac"]');await fig.scrollIntoViewIfNeeded();await expect.poll(()=>fig.locator('img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);await expect(fig.locator('figcaption')).toContainText('les conclusions restent au CAC');await expect(page.locator('[data-frontiere-cac] table tbody tr')).toHaveCount(3);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
