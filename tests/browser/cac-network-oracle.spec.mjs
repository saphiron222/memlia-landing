import {test,expect} from '@playwright/test';
import {observeCacRequests} from './helpers/cac-network-oracle.mjs';

// Sans CSP dans la fixture : prouver que l'oracle détecte réellement les envois,
// indépendamment de la protection connect-src de la page CAC.
test.beforeEach(async({page})=>{
 await page.route('**/*',route=>route.fulfill({
  contentType:route.request().url().endsWith('/favicon.svg')?'image/svg+xml':'text/html',
  body:route.request().url().endsWith('/favicon.svg')?'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>':'<!doctype html><title>Oracle CAC</title>',
 }));
 await page.goto('/oracle-cac');
});

test('late passive favicon does not count as a data send',async({page})=>{
 const requests=observeCacRequests(page);
 // Forcer le chargement tardif de l'image de l'icône après pose du listener,
 // sans dépendre du calendrier de chargement automatique de Chromium.
 await page.evaluate(()=>new Promise((resolve,reject)=>{
  const icon=new Image();icon.onload=resolve;icon.onerror=reject;icon.src='/favicon.svg';
 }));
 expect(requests).toEqual([]);
});

test('real sends remain visible, including fetch to the favicon URL',async({page})=>{
 const requests=observeCacRequests(page);
 await page.evaluate(async()=>{
  await fetch('/favicon.svg');
  await fetch('/favicon.svg',{method:'POST',body:'private-note'});
  await fetch('/collect?note=private-note');
  await fetch('https://example.org/favicon.svg');
 });
 expect(requests).toEqual([
  new URL('/favicon.svg',page.url()).href,
  new URL('/favicon.svg',page.url()).href,
  new URL('/collect?note=private-note',page.url()).href,
  'https://example.org/favicon.svg',
 ]);
});

test('favicon carrying query data is not exempt',async({page})=>{
 const requests=observeCacRequests(page);
 await page.evaluate(()=>new Promise(resolve=>{
  const image=new Image();image.onload=image.onerror=resolve;image.src='/favicon.svg?note=private-note';
 }));
 expect(requests).toEqual([new URL('/favicon.svg?note=private-note',page.url()).href]);
});
