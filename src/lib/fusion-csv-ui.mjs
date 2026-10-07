import { validateFiles } from './fusion-csv.mjs';
export function initFusionCsv(){
 const root=document.querySelector('[data-fusion]');if(!root)return;
 const q=s=>root.querySelector(s),input=q('#fusion-files'),status=q('[data-status]'),error=q('[data-error]');
 let active=null,pending=null,seq=0,loaded=false,example=false,configs=[],order=[],report=null,page=0,copy=false;
 const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
 const fail=message=>{error.textContent=message;error.hidden=false;error.focus();};
 const clear=()=>{error.hidden=true;error.textContent='';};
 const exports=()=>root.querySelectorAll('[data-export],[data-copy]').forEach(b=>b.disabled=!report||!q('[data-reviewed]').checked||Boolean(pending));
 const invalidate=()=>{report=null;q('[data-result]').hidden=true;q('[data-reviewed]').checked=false;q('[data-table]').replaceChildren();exports();};
 const stop=()=>{pending?.terminate();pending=null;q('[data-cancel]').hidden=true;exports();};
 const control=(parent,text,id,type,values)=>{
  const wrap=el('div'),label=el('label',text);label.htmlFor=id;
  const field=el(type);field.id=id;field.setAttribute('aria-describedby','fusion-error');
  if(type==='select')for(const [value,text]of values){const option=el('option',text);option.value=value;field.append(option);}
  else{field.type='text';field.maxLength=256;}
  wrap.append(label,field);parent.append(wrap);return field;
 };
 input.addEventListener('change',()=>{
  if(loaded||pending){fail('Réinitialisez explicitement avant de remplacer le lot importé.');return;}
  clear();q('[data-config]').replaceChildren();configs=[...input.files].map((file,i)=>{
   const fs=el('fieldset');fs.append(el('legend',`${i+1}. ${file.name}`));const controls=el('div');controls.className='controls';fs.append(controls);
   const encoding=control(controls,'Encodage',`fusion-encoding-${i}`,'select',[['utf-8','UTF-8 / BOM'],['windows-1252','Windows-1252']]);
   const delimiter=control(controls,'Séparateur',`fusion-delimiter-${i}`,'select',[[';','Point-virgule'],[',','Virgule'],['tab','Tabulation'],['|','Barre verticale']]);
   q('[data-config]').append(fs);return{file,encoding,delimiter};
  });
 });
 const renderMapping=files=>{
  loaded=true;input.disabled=true;q('[data-config]').querySelectorAll('select').forEach(e=>e.disabled=true);order=files.map((_,i)=>i);q('[data-columns]').replaceChildren();
  files.forEach((f,i)=>{
   const fs=el('fieldset');fs.dataset.file=String(i);fs.append(el('legend',`${f.name} — ${f.count} lignes`));
   const up=el('button','Monter ce fichier');up.type='button';up.className='btn btn-contour';up.addEventListener('click',()=>{const index=order.indexOf(i);if(index>0){[order[index-1],order[index]]=[order[index],order[index-1]];fs.previousElementSibling.before(fs);q('[data-confirmed]').checked=false;invalidate();up.focus();}});fs.append(up);
   f.headers.forEach((h,j)=>{const field=control(fs,`${j+1}. ${h} → nom cible`,`fusion-map-${i}-${j}`,'input');field.value=h;field.dataset.map='';});q('[data-columns]').append(fs);
  });q('[data-mapping]').hidden=false;
 };
 const table=rows=>{
  const t=q('[data-table]');t.replaceChildren();t.append(el('caption',`Lignes ${page*25+1} à ${Math.min((page+1)*25,report.outputRows)} sur ${report.outputRows}`));
  const head=el('thead'),tr=el('tr');for(const h of report.headers){const th=el('th',h);th.scope='col';tr.append(th);}head.append(tr);t.append(head);const body=el('tbody');for(const row of rows){const tr=el('tr');row.forEach(v=>tr.append(el('td',v)));body.append(tr);}t.append(body);
  q('[data-pagination]').textContent=`Page ${page+1} / ${Math.max(1,Math.ceil(report.outputRows/25))}`;q('[data-prev]').disabled=page===0;q('[data-next]').disabled=(page+1)*25>=report.outputRows;
 };
 const payload=()=>({kind:'import',example,files:configs.map(c=>({file:c.file,name:c.file.name,size:c.file.size,encoding:c.encoding.value,delimiter:c.delimiter.value==='tab'?'\t':c.delimiter.value}))});
 const receive=async m=>{
  if(m.kind==='page'){table(m.rows);return;}
  if(m.kind==='export'){
   if(!report||!q('[data-reviewed]').checked)return;
   if(copy){copy=false;try{await navigator.clipboard.writeText(m.content);status.textContent='CSV complet copié avec neutralisation des formules.';}catch{fail('Copie indisponible ; exportez le CSV complet.');}return;}
   const url=URL.createObjectURL(new Blob([m.content],{type:m.format==='report'?'application/json':'text/csv;charset=utf-8'})),a=el('a');a.href=url;a.download=m.format==='report'?'rapport-fusion-csv.json':'fusion.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Export complet créé localement.';
  }else if(m.kind==='error')fail(m.error);
 };
 const run=merge=>{
  clear();if(pending){fail('Un traitement est en cours ; annulez-le avant de recommencer.');return;}
  if(!example)try{validateFiles(configs.map(c=>c.file));}catch(e){fail(e.message);return;}
  const mappings=order.map(i=>[...q(`[data-file="${i}"]`).querySelectorAll('[data-map]')].map(e=>e.value));
  const options={confirmed:q('[data-confirmed]').checked,union:q('[data-union]').checked,provenance:q('[data-provenance]').checked,deduplicate:q('[data-dedup]').checked};
  if(merge)invalidate();
  pending=new Worker(new URL('../workers/fusion-csv.worker.mjs',import.meta.url),{name:'memlia-fusion-csv'});const candidate=pending,id=++seq;
  q('[data-cancel]').hidden=false;exports();status.textContent='Traitement local en cours ; annulation disponible.';
  candidate.onerror=()=>{if(candidate!==pending)return;stop();fail('Le Worker local a échoué. Réessayez ; fichiers et choix conservés.');};
  candidate.onmessage=({data:m})=>{
   if(candidate!==pending||m.id!==id)return;
   if(m.kind==='error'){stop();fail(m.error);status.textContent='Traitement refusé ; fichiers et choix conservés.';return;}
   if(merge&&m.kind==='import'){candidate.postMessage({id,kind:'merge',order,mappings,options});return;}
   active?.terminate();active=candidate;pending=null;q('[data-cancel]').hidden=true;
   active.onmessage=({data:m})=>{if(active===candidate&&m.id===seq)receive(m);};active.onerror=()=>{invalidate();fail('Traitement local interrompu ; consolidez à nouveau.');};
   if(m.kind==='import'){renderMapping(m.files);status.textContent='Fichiers importés ; vérifiez la correspondance et l’ordre.';}
   else{
    report=m.report;page=0;table(m.rows);q('[data-summary]').textContent=`${report.inputRows} lignes importées → ${report.outputRows} lignes consolidées ; ${report.removedRows} doublons retirés, ${report.duplicates.length} doublons exacts détectés ; ${report.missingCells} cellules absentes remplies à vide ; ${report.neutralizations.length} cellules ou en-têtes neutralisés à l’export.`;
    q('[data-counts]').replaceChildren(...report.files.map(f=>el('li',`${f.index}. ${f.name} : ${f.inputRows} lignes reçues, ${f.outputRows} conservées ; colonnes absentes : ${f.missingColumns.join(', ')||'aucune'}.`)));
    q('[data-result]').hidden=false;status.textContent='Consolidation préparée ; relisez avant d’exporter.';
   }exports();
  };candidate.postMessage({...payload(),id});
 };
 q('form').addEventListener('submit',e=>{e.preventDefault();if(loaded){fail('Lot déjà importé : consolidez ou réinitialisez explicitement.');return;}example=false;run(false);});
 q('[data-example]').addEventListener('click',()=>{if(loaded||configs.length||pending){fail('Réinitialisez explicitement avant de charger l’exemple.');return;}example=true;run(false);});
 q('[data-merge]').addEventListener('click',()=>run(true));
 q('[data-mapping]').addEventListener('input',e=>{if(e.target.matches('[data-map]'))q('[data-confirmed]').checked=false;if(pending)stop();invalidate();});
 q('[data-cancel]').addEventListener('click',()=>{stop();status.textContent='Traitement annulé ; aucun nouveau résultat appliqué. Fichiers et choix conservés.';});
 q('[data-reviewed]').addEventListener('change',exports);
 for(const [selector,delta]of [['[data-prev]',-1],['[data-next]',1]])q(selector).addEventListener('click',()=>{page+=delta;active.postMessage({id:seq,kind:'page',page});});
 root.querySelectorAll('[data-export],[data-copy]').forEach(button=>button.addEventListener('click',()=>{if(!report||pending||!q('[data-reviewed]').checked)return;copy=button.hasAttribute('data-copy');active.postMessage({id:seq,kind:'export',format:copy?'csv':button.dataset.export});}));
 q('[data-reset]').addEventListener('click',()=>{stop();active?.terminate();active=null;seq++;loaded=false;example=false;configs=[];order=[];input.disabled=false;q('form').reset();root.querySelectorAll('input[type=checkbox]').forEach(e=>e.checked=false);q('[data-config]').replaceChildren();q('[data-columns]').replaceChildren();q('[data-counts]').replaceChildren();q('[data-summary]').textContent='';q('[data-mapping]').hidden=true;invalidate();clear();status.textContent='Fichiers et résultats effacés de cet onglet.';});
}
