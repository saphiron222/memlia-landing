import {test,expect} from '@playwright/test';
for(const width of [375,1440])test(`accueil : aucune vidéo ni original lourd transféré à ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});const requests:string[]=[];page.on('request',r=>requests.push(r.url()));await page.goto('/');const img=page.locator('[data-scene="accueil"] img');await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
 expect(requests.filter(u=>/\.(mp4|vtt)(?:$|\?)/.test(u))).toEqual([]);expect(requests.filter(u=>u.includes('/illustrations/figurines/')&&u.endsWith('.png'))).toEqual([]);
 const src=await img.evaluate((e:HTMLImageElement)=>e.currentSrc);expect(src).toMatch(/accueil-(640|1200)\.(avif|webp)$/);
});
