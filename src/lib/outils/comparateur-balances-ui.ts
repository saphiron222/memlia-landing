import { EXAMPLE_PREVIOUS, EXAMPLE_CURRENT, exportComparisonCsv, MAX_BYTES } from './comparateur-balances.mjs';

export function initComparateurBalances() {
  const root = document.querySelector<HTMLElement>('[data-balances]');
  if (!root) return;
  const get = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const input = (id: string) => get<HTMLInputElement>(`#${id}`);
  const val = (id: string) => get<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`#${id}`).value;
  const form = get<HTMLFormElement>('form');
  const error = get('[data-error]');
  const status = get('[data-status]');
  const output = get('[data-result]');
  let worker: Worker | null = null;
  let revision = 0;
  let result: any = null;
  let page = 0;
  let busy = false;
  const names = { previous: 'Saisie N−1', current: 'Saisie N' };
  const invalidate = () => { result = null; output.hidden = true; error.hidden = true; };
  const fail = (message: string) => {
    invalidate(); error.textContent = message; error.hidden = false; error.focus();
    root.querySelectorAll('input,select,textarea').forEach(el => el.setAttribute('aria-invalid', 'true'));
    status.textContent = 'Comparaison arrêtée. Les saisies sont conservées.';
  };
  const stop = (message = 'Traitement annulé. Les saisies sont conservées.') => {
    revision++; worker?.terminate(); worker = null; busy = false;
    get('[data-cancel]').hidden = true; root.removeAttribute('aria-busy');
    get<HTMLButtonElement>('button[type=submit]').disabled = false;
    status.textContent = message;
  };
  const launch = () => {
    stop('Traitement local en cours…'); busy = true; root.setAttribute('aria-busy','true');
    get('[data-cancel]').hidden = false;
    get<HTMLButtonElement>('button[type=submit]').disabled = true;
    worker = new Worker(new URL('./comparateur-balances.worker.ts', import.meta.url), { name: 'memlia-balances' });
    return revision;
  };
  let id = 0;
  const call = (payload: object, token: number): Promise<any> => new Promise((resolve,reject) => {
    const current = worker!; const requestId = ++id;
    const cleanup = () => { current.removeEventListener('message', receive); current.removeEventListener('error', onError); };
    const receive = (event: MessageEvent) => {
      if (event.data.id !== requestId) return;
      cleanup(); if (token !== revision) { reject(new Error('Annulé')); return; }
      if (event.data.ok) resolve(event.data.result); else reject(new Error(event.data.error));
    };
    const onError = () => { cleanup(); reject(new Error('Le traitement local n’a pas abouti. Réessayez ou vérifiez le fichier.')); };
    current.addEventListener('message',receive);current.addEventListener('error',onError);
    current.postMessage({ ...payload, id: requestId });
  });
  const money = (cents: string) => { const n=BigInt(cents); const a=n<0n?-n:n; return `${n<0n?'−':''}${a/100n},${String(a%100n).padStart(2,'0')}`; };
  const renderPage = () => {
    const filtered = get<HTMLInputElement>('[data-filter]').checked ? result.rows.filter((r:any)=>r.selected) : result.rows;
    const pages = Math.max(1,Math.ceil(filtered.length/50)); page = Math.min(page,pages-1);
    const tbody=get<HTMLTableSectionElement>('[data-table] tbody');tbody.replaceChildren();
    for(const r of filtered.slice(page*50,page*50+50)){
      const tr=document.createElement('tr');
      for(const text of [r.account,r.label,money(r.previous),money(r.current),money(r.delta),r.percent===null?'non calculable':`${r.percent} %`,r.status,r.selected?'oui':'non',r.previousLines.join(', ')||'absent',r.currentLines.join(', ')||'absent']){
        const cell=document.createElement('td');cell.textContent=text;tr.append(cell);
      }
      tbody.append(tr);
    }
    get('[data-page]').textContent=`Page ${page+1} / ${pages} · ${filtered.length} comptes affichables`;
    get<HTMLButtonElement>('[data-prev]').disabled=page===0;
    get<HTMLButtonElement>('[data-next]').disabled=page===pages-1;
  };
  const render = () => {
    get('[data-summary]').textContent=`${result.rows.length} comptes · ${result.rows.filter((r:any)=>r.selected).length} à examiner selon vos seuils · devise ${result.conventions.currency}.`;
    get('[data-totals]').textContent=`Totaux complets : N−1 ${money(result.totals.previous)} ; N ${money(result.totals.current)} ; delta ${money(result.totals.delta)}.`;
    get('[data-conventions]').textContent=`${result.previousName} / ${result.currentName}. Périodes : ${val('previous-start')} → ${val('previous-end')} et ${val('current-start')} → ${val('current-end')}. Delta = N − N−1 ; variation = 100 × delta / |N−1| (zéro non calculable). Seuil absolu : ${val('absolute-threshold')||'non activé'} ; seuil relatif : ${val('relative-threshold')||'non activé'} %. Comparabilité et même devise confirmées par vous ; aucune conclusion de risque.`;
    const warnings=get('[data-warnings]');warnings.replaceChildren();
    for(const warning of result.warnings){const li=document.createElement('li');li.textContent=warning;warnings.append(li);}
    page=0;renderPage(); output.hidden=false; output.focus();
  };
  const updateModes = () => {
    for(const key of ['previous','current']){
      const mode=val(`mode-${key}`);
      for(const field of ['balance','debit','credit'])get(`#map-${key}-${field}`).closest<HTMLElement>('[data-map-field]')!.hidden=mode==='balance'?field!=='balance':field==='balance';
    }
  };
  form.addEventListener('input',event=>{
    for(const key of ['previous','current'] as const) if(event.target===get(`#csv-${key}`)){
      names[key]=`Saisie ${key==='previous'?'N−1':'N'} éditée`;
      get(`[data-filename=${key}]`).textContent='Contenu édité : la provenance désigne les lignes du CSV saisi, pas le fichier original.';
    }
    if(busy)stop();invalidate();status.textContent='Saisies modifiées : comparez à nouveau avant copie ou export.';
    root.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  });
  form.addEventListener('change',()=>{if(busy)stop();invalidate();updateModes();});
  for(const key of ['previous','current'] as const){
    get(`[data-read=${key}]`).addEventListener('click',async()=>{
      const file=input(`file-${key}`).files?.[0];if(!file){fail('Choisissez un fichier CSV avant lecture.');return;}
      const other=input(`file-${key==='previous'?'current':'previous'}`).files?.[0];
      if(file.size+(other?.size??new TextEncoder().encode(val(`csv-${key==='previous'?'current':'previous'}`)).byteLength)>MAX_BYTES){fail('Refus : les deux fichiers dépassent la limite totale de 10 Mo.');return;}
      if(val(`csv-${key}`) && !window.confirm(`Remplacer le contenu saisi ${key==='previous'?'N−1':'N'} par ce fichier ?`))return;
      const token=launch(); invalidate();
      try{
        const text=new TextDecoder(val(`encoding-${key}`),{fatal:true}).decode(await file.arrayBuffer());
        if(token!==revision)return;
        if(text.includes('\uFFFD'))throw new Error('Encodage illisible : choisissez un autre encodage.');
        get<HTMLTextAreaElement>(`#csv-${key}`).value=text;names[key]=file.name;
        get(`[data-filename=${key}]`).textContent=`Fichier lu : ${file.name}. Colonnes à confirmer avant calcul.`;
        stop(`Fichier ${file.name} lu localement. Vérifiez le mapping.`);
      }catch(e){if(token===revision){stop();fail(e instanceof Error?e.message:'Lecture refusée.');}}
    });
  }
  get('[data-example]').addEventListener('click',()=>{
    if((val('csv-previous')||val('csv-current')||val('currency')||val('absolute-threshold')) && !window.confirm('Remplacer vos saisies par le jeu fictif, ses périodes et son seuil d’essai ?'))return;
    stop();form.reset();invalidate();
    get<HTMLTextAreaElement>('#csv-previous').value=EXAMPLE_PREVIOUS;
    get<HTMLTextAreaElement>('#csv-current').value=EXAMPLE_CURRENT;
    for(const [key,start,end] of [['previous','2025-01-01','2025-12-31'],['current','2026-01-01','2026-12-31']]){input(`${key}-start`).value=start;input(`${key}-end`).value=end;}
    input('currency').value='EUR';input('absolute-threshold').value='20';names.previous='Exemple fictif N−1';names.current='Exemple fictif N';
    for(const key of ['previous','current'] as const)get(`[data-filename=${key}]`).textContent=names[key];
    updateModes();status.textContent='Exemple chargé : seuil 20 EUR et dates fictifs, jamais recommandés. Confirmez les deux déclarations avant calcul.';
  });
  get('[data-cancel]').addEventListener('click',()=>{stop();invalidate();});
  get('[data-reset]').addEventListener('click',()=>{stop();form.reset();invalidate();names.previous='Saisie N−1';names.current='Saisie N';for(const key of ['previous','current'])get(`[data-filename=${key}]`).textContent='Aucun fichier lu.';updateModes();status.textContent='Saisies et résultats effacés de cet onglet.';});
  form.addEventListener('submit',async event=>{
    event.preventDefault(); invalidate();
    if(!input('same-currency').checked || !input('comparable').checked){fail('Même devise et comparabilité : les deux confirmations sont obligatoires.');return;}
    if(!val('currency').trim()){fail('Renseignez la devise déclarée.');return;}
    const token=launch();
    try{
      const balances:any[]=[];
      for(const key of ['previous','current'] as const){
        const mapping=Object.fromEntries(['account','label','balance','debit','credit'].map(field=>[field,Number(val(`map-${key}-${field}`))]));
        const parsed=await call({type:'parse',text:val(`csv-${key}`),options:{delimiter:val(`delimiter-${key}`),mode:val(`mode-${key}`),mapping,aggregate:input(`aggregate-${key}`).checked,name:names[key]}},token);
        balances.push(parsed);
      }
      const calculated=await call({type:'compare',previous:balances[0],current:balances[1],options:{periodPrevious:{start:val('previous-start'),end:val('previous-end')},periodCurrent:{start:val('current-start'),end:val('current-end')},sameCurrency:true,comparable:true,absoluteThreshold:val('absolute-threshold'),relativeThreshold:val('relative-threshold')}},token);
      if(token!==revision)return;
      calculated.conventions.currency=val('currency').trim();result=calculated;
      stop('Comparaison terminée localement. Relisez les exceptions et les conventions.');render();
    }catch(e){if(token===revision){stop();fail(e instanceof Error?e.message:'Comparaison refusée.');}}
  });
  get('[data-filter]').addEventListener('change',()=>{page=0;renderPage();});
  get('[data-prev]').addEventListener('click',()=>{page--;renderPage();});
  get('[data-next]').addEventListener('click',()=>{page++;renderPage();});
  get('[data-export]').addEventListener('click',()=>{
    if(!result)return;const url=URL.createObjectURL(new Blob([exportComparisonCsv(result)],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='comparaison-balances.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Rapport complet téléchargé, avec conventions et provenance.';
  });
  get('[data-copy]').addEventListener('click',async()=>{
    if(!result)return;
    try{await navigator.clipboard.writeText(exportComparisonCsv(result));status.textContent='Rapport complet copié ; textes à risque neutralisés par apostrophe.';}
    catch{status.textContent='Copie non autorisée par ce navigateur. Exportez le rapport CSV complet.';}
  });
  updateModes();
}
