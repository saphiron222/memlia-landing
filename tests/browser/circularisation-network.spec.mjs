import {test,expect} from '@playwright/test';
import {networkViolation,observeNetwork} from '../helpers/circularisation-network.mjs';

test('icône native différée : même URL, fetch applicatif refusé',async({page,context},testInfo)=>{
 const network=observeNetwork(context);
 // Minimal document on the real preview origin, without an initial icon:
 // insert it only after the measurement boundary to remove timing luck.
 await page.route('**/network-icon-fixture',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Network fixture</title><p>Fictif</p>'}));
 await page.goto('/network-icon-fixture');await page.evaluate(()=>document.fonts.ready);
 const origin=new URL(page.url()).origin;const iconUrl=new URL('/favicon.svg',origin).href;
 network.startOperations();
 const iconRequest=context.waitForEvent('request',r=>r.url()===iconUrl&&r.resourceType()==='other');
 await page.evaluate(()=>{const link=document.createElement('link');link.rel='icon';link.href='/favicon.svg';document.head.append(link);});
 await iconRequest;
 const native=network.requests.find(r=>r.url===iconUrl&&r.type==='other');
 expect(native.phase).toBe('operations');expect(networkViolation(native,{origin,iconUrl})).toBeNull();
 const fetchRequest=context.waitForEvent('request',r=>r.url()===iconUrl&&r.resourceType()==='fetch');
 await page.evaluate(()=>fetch('/favicon.svg'));await fetchRequest;
 const application=network.requests.find(r=>r.url===iconUrl&&r.type==='fetch');
 expect(networkViolation(application,{origin,iconUrl})).toBe('operation');
 await testInfo.attach('native-icon-vs-fetch',{body:JSON.stringify(network.requests,null,2),contentType:'application/json'});
});
