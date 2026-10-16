import {test,expect} from '@playwright/test';
// La recette A du 15/10 remplace les vidéos et cadres commerciaux : préserver le chargement,
// les dimensions, la lisibilité et l’absence de mouvement subi, plutôt que tester le lecteur retiré.
for(const width of [320,375,768,1024,1440,1920])test(`scène EC : intégrale, responsive et immobile à ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('main video,[data-video-player],main [data-proof]')).toHaveCount(0);
 const image=page.locator('[data-scene="accueil"] img');await image.scrollIntoViewIfNeeded();await expect.poll(()=>image.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
 await expect(image).toHaveAttribute('alt',/.+/);await expect(image).toHaveAttribute('width','1200');await expect(image).toHaveAttribute('height','800');await expect(image).toHaveCSS('object-fit','contain');await expect(image).toHaveCSS('animation-name','none');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('scène EC : image, légende et action restent lisibles sans JavaScript',async({browser})=>{const c=await browser.newContext({javaScriptEnabled:false});const p=await c.newPage();await p.goto('/');const fig=p.locator('[data-scene="accueil"]');await fig.scrollIntoViewIfNeeded();await expect(fig.locator('figcaption')).toBeVisible();await expect(fig.locator('img')).toBeVisible();await expect(p.locator('.hero-editorial-actions a').first()).toHaveAttribute('href','/contact');await c.close()});
