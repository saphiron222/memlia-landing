import {test,expect} from '@playwright/test';
import {AGENTS,ficheDe} from '../../src/data/specialistes';
const route='/agents-ia/paie-social';
const fiche=ficheDe(AGENTS.find(a=>a.slug==='paie-social')!);
for(const width of [320,375,768,1024,1440,1920])test(`entrées et sorties : tâche de Salomé, outils et frontière à ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});expect((await page.goto(route))?.status()).toBe(200);
 await expect(page.locator('main h1')).toHaveText(fiche.h1);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://memlia.fr${route}`);
 await expect(page.locator('#tache-entrees-sorties-salaries-5')).toContainText(/entrée|sortie/i);
 await expect(page.locator('[data-agent-outils]')).toContainText('Silae');
 await expect(page.locator('[data-agent-rejeu] tbody tr')).toHaveCount(4);
 await expect(page.locator('#regle')).toContainText(/validation/i);
 await expect(page.locator('#regle')).toContainText(/arrêt/i);
 await expect(page.locator('footer a[href="/automatisation-cabinet-comptable"]')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
