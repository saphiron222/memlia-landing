import {test,expect} from '@playwright/test';
for(const width of [320,375,768,1280,1440])test(`scène de travail : composition entière et texte voisin à ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');const row=page.locator('.editorial-bloc-scene'),figure=row.locator('figure'),copy=row.locator('.tete');await figure.scrollIntoViewIfNeeded();await expect(figure.locator('img')).toHaveCSS('object-fit','contain');const image=(await figure.locator('img').boundingBox())!,text=(await copy.boundingBox())!,r=(await row.boundingBox())!;
 expect(image.width/image.height).toBeCloseTo(1.5,2);expect(image.x).toBeGreaterThanOrEqual(0);expect(image.x+image.width).toBeLessThanOrEqual(width);if(width>=1024){expect(image.x).toBeGreaterThan(text.x+text.width);expect(image.width/r.width).toBeLessThanOrEqual(.52)}else expect(image.y).toBeGreaterThanOrEqual(text.y+text.height);
 await expect(page.locator('main .functional-proof')).toHaveCount(0);
});
