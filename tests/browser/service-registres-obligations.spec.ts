import {test,expect} from '@playwright/test';
import {AGENTS,ficheDe} from '../../src/data/specialistes';
const path='/agents-ia/juridique-fiscal';const fiche=ficheDe(AGENTS.find(a=>a.slug==='juridique-fiscal')!);
test('registres : tâche de Grégoire, démonstration et limites',async({page})=>{
 expect((await page.goto(path))?.status()).toBe(200);
 await expect(page.locator('main h1')).toHaveText(fiche.h1);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://memlia.fr${path}`);
 await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',fiche.h1);
 await expect(page.locator('#tache-registres-obligations-10')).toContainText(/registre|obligation/i);
 await expect(page.locator('[data-agent-rejeu] tbody tr')).toHaveCount(4);
 expect(await page.locator('[data-agent-rejeu] [data-issue="Arrêt"]').count()).toBeGreaterThanOrEqual(1);
 await expect(page.locator('#regle')).toContainText(/validation/i);
 await expect(page.locator('#regle')).toContainText(/cabinet/i);
});
for(const width of [320,375,768,1024,1440,1920])test(`registres : largeur ${width} sans débordement`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width,height:900});expect((await page.goto(path))?.status()).toBe(200);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
