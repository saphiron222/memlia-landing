import {test,expect} from '@playwright/test';
// Catalogue validé le 15/10 : les logiciels et limites sont dans les fiches agents/robots.
const fiches=['/agents-ia/comptabilite','/agents-ia/paie-social','/agents-ia/juridique-fiscal','/automatisation/cfe','/automatisation/informations-legales-rne'];
for(const width of [320,375,768,1024,1440,1920])test(`fiches du catalogue : outils, frontières et espacement à ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of fiches){
  expect((await page.goto(route))?.status(),route).toBe(200);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('[data-source-section],[data-first-hand-experience]')).toHaveCount(0);
  await expect(page.locator('.routine-outils')).toContainText('Votre logiciel n’est pas listé ? Nous l’intégrons sur demande.');
  await expect(page.locator('#regle')).toContainText(/validation|validez/i);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
 }
 await page.goto('/automatisation-cabinet-comptable');
 const gap=await page.evaluate(()=>{const grille=document.querySelector('.catalogue-grille')!,suite=document.querySelector('.catalogue-fin')!;return suite.getBoundingClientRect().top-grille.getBoundingClientRect().bottom;});
 expect(gap,'le catalogue respire avant son appel final').toBeGreaterThanOrEqual(64);
});
