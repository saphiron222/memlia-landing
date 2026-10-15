import { test, expect } from '@playwright/test';
import { AGENTS,FICHES,HUB,GROUPES,cheminAgent,ficheDe,comptesParGroupe } from '../../src/data/specialistes';
const sections=['hero','signature','annuaire','sur-mesure','autre-tache','contact'];
for(const width of [375,768,1440])test(`hub agents : composition robots, cartes et filtres sans JS à ${width}px`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:900}});const page=await context.newPage();await page.goto('/agents-ia');
 await expect(page.locator('h1')).toHaveText(HUB.h1);
 expect(await page.locator('[data-hub-section]').evaluateAll(es=>es.map(e=>e.getAttribute('data-hub-section')))).toEqual(sections);
 await expect(page.locator('.hub-trio img')).toHaveCount(3);await expect(page.locator('.hub-agents>li')).toHaveCount(AGENTS.length);
 for(const [i,a] of AGENTS.entries())await expect(page.locator('.hub-agents>li').nth(i).locator('a')).toHaveAttribute('href',cheminAgent(a));
 for(const group of GROUPES){await page.locator(`input[value="${group.id}"]`).check({force:true});const visibles=page.locator('.hub-agents>li:visible');await expect(visibles).toHaveCount(comptesParGroupe()[group.id]);expect(await visibles.evaluateAll(es=>es.map(e=>e.getAttribute('data-categorie')))).toEqual(Array(comptesParGroupe()[group.id]).fill(group.id));}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});
test('filtres au clavier, compte lisible, cartes entièrement cliquables et mouvement réduit',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/agents-ia');const first=page.locator('input[value="tous"]');await first.focus();await page.keyboard.press('ArrowRight');await expect(page.locator(`input[value="${GROUPES[0].id}"]`)).toBeChecked();const span=page.locator('input:checked+span');await expect(span).toContainText(String(comptesParGroupe()[GROUPES[0].id]));expect(await span.evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 await expect(page.locator('.hub-agents .catalogue-carte:visible').first()).toHaveAttribute('href',cheminAgent(AGENTS[0]));expect(await page.locator('.catalogue-carte').first().evaluate(e=>Math.max(...getComputedStyle(e).transitionDuration.split(',').map(parseFloat)))).toBeLessThanOrEqual(0.001);
});
for(const agent of FICHES)for(const width of [375,1440])test(`${agent.slug} : fiche complète, démonstration et FAQ à ${width}px`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:900}});const page=await context.newPage();const f=ficheDe(agent);await page.goto(cheminAgent(agent));
 await expect(page.locator('h1')).toHaveText(f.h1);await expect(page).toHaveTitle(f.titreOnglet);await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',f.description);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://memlia.fr'+cheminAgent(agent));await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',f.h1);
 expect(await page.locator('[data-agent-section]').evaluateAll(es=>es.map(e=>e.getAttribute('data-agent-section')))).toEqual(['hero','livrables','fonctionnement','taches','comparaison','regle','voisins','faq','contact','retour']);
 await expect(page.locator('.catalogue-ariane li')).toHaveCount(3);await expect(page.locator('[data-agent-rejeu] tbody tr')).toHaveCount(4);await expect(page.locator('[data-agent-rejeu]')).toContainText('Dossier fictif');
 for(const [i,cas] of agent.demonstration.cas.entries()){const row=page.locator('[data-agent-rejeu] tbody tr').nth(i);await expect(row).toContainText(cas.cas);await expect(row).toContainText(cas.sortie);await expect(row).toHaveAttribute('data-issue',cas.issue);}
 await expect(page.locator('[data-agent-rejeu] tr[data-issue="Arrêt"]').first()).toContainText('Motif :');await expect(page.locator('.routine-livrables>div')).toHaveCount(3);await expect(page.locator('.catalogue-etapes>li')).toHaveCount(3);await expect(page.locator('.routine-taches>div')).toHaveCount(f.taches.length);await expect(page.locator('.routine-faq details')).toHaveCount(f.faq.questions.length);
 const faq=page.locator('.routine-faq details').first();await faq.locator('summary').click();await expect(faq).toHaveAttribute('open','');await expect(page.locator('.routine-departs a')).toHaveCount(3);await expect(page.locator('.routine-retour a')).toHaveAttribute('href','/agents-ia');
 for(const source of f.eeat.sources)await expect(page.locator('.routine-faq a').filter({hasText:source.mot}).first()).toHaveAttribute('href',source.url);
 expect(await page.locator('img[loading="eager"]').evaluateAll(es=>es.every(e=>(e as HTMLImageElement).complete&&(e as HTMLImageElement).naturalWidth>0))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);const graph=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent()??'{}');const types=graph['@graph'].map((x:any)=>x['@type']);expect(types).toContain('Service');expect(types).not.toContain('FAQPage');
 await context.close();
});
test('les trois points de départ présélectionnent une tâche visible et consommée une fois',async({page})=>{
 await page.goto('/agents-ia/comptabilite');const a=page.locator('.routine-departs a').first();const id=await a.getAttribute('data-tache-agent');await a.click();await expect(page.locator('#tache_robot')).toHaveValue(id!);await expect(page.locator('#tache_robot')).toBeVisible();expect(new URL(page.url()).search).toBe('');await page.reload();await expect(page.locator('#tache_robot')).toHaveValue('');
});
test('le contact reste joignable avec stockage bloqué',async({page})=>{await page.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw Error('blocked');}});});await page.goto('/agents-ia/finance');await page.locator('.routine-departs a').first().click();await expect(page.locator('#tache_robot')).toHaveValue('');});
