import { chromium } from '@playwright/test';
const base='https://3deabfee.memlia.pages.dev', out=process.argv[2];
const b=await chromium.launch({channel:'chromium'});
for (const [route,name] of [['/ressources','ressources'],['/glossaire','glossaire']])
  for (const w of [375,1440]) {
    const p=await b.newPage({viewport:{width:w,height:900}});
    const r=await p.goto(base+route,{waitUntil:'networkidle'});
    const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:window.innerWidth,h1:document.querySelectorAll('h1').length}));
    console.log(`${name} ${w}px status=${r.status()} overflow=${m.sw>m.iw} h1=${m.h1}`);
    await p.screenshot({path:`${out}/${name}-${w}.png`, fullPage:w===1440});
    await p.close();
  }
await b.close();
