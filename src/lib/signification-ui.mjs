import * as m from './signification.mjs';
export function initializeSignification(WorkerClass){
 const root=document.querySelector('[data-signification]');if(!root)return;
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const form=$('[data-sig-form]'),meta=$('[data-sig-meta]');let session=m.createSession(),editing='',dirty=false,page=0,parsed=null,rows=null,importPage=0,worker=null,cancelJob=null,urls=[];
 // Load the self-hosted worker with page assets, before any scenario is processed.
 let resident=new WorkerClass();
 const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const status=text=>$('[data-sig-status]').textContent=text;
 const error=text=>{const el=$('[data-sig-error]');el.textContent=text;el.hidden=!text;};
 const guard=fn=>{try{error('');fn();}catch(e){error(e.message);}};
 function clearDownloads(){for(const u of urls)URL.revokeObjectURL(u);urls=[];$('[data-sig-downloads]').replaceChildren();}
 function fieldErrors(messages=[]){$$('[data-sig-field-error]').forEach(n=>{n.textContent='';form.elements[n.dataset.sigFieldError]?.removeAttribute('aria-invalid');});for(const msg of messages){const key=/^Base/.test(msg)?'base':/^Signification/.test(msg)?'rate':/^Planification/.test(msg)?'planning':null;if(key){$(`[data-sig-field-error="${key}"]`).textContent=msg;form.elements[key].setAttribute('aria-invalid','true');}}}
 const values=()=>Object.fromEntries(m.INPUT_FIELDS.map(k=>[k,form.elements[k].value]));
 function markDirty(){dirty=true;clearDownloads();$('[data-sig-dirty]').hidden=false;fieldErrors(m.calculate(values()).errors);render();}
 function loadEditor(r){for(const k of m.INPUT_FIELDS)form.elements[k].value=r[k];editing=r.id||'';form.elements.id.readOnly=!!editing;dirty=false;$('[data-sig-dirty]').hidden=true;fieldErrors();render();}
 function newEditor(){loadEditor(m.emptyScenario());editing='';form.elements.id.readOnly=false;}
 function isBusy(){return !!worker;}
 function render(){
  const total=session.scenarios.length;page=Math.min(page,Math.max(0,Math.ceil(total/20)-1));
  $('[data-sig-summary]').textContent=`${total} scénario(s) · ${m.dossierState(session)}${session.retainedId?' · Retenu : '+session.retainedId:''}`;
  $('[data-sig-comparability]').textContent=m.comparability(session.scenarios);
  const body=$('[data-sig-table]');body.replaceChildren();
  for(const r of session.scenarios.slice(page*20,page*20+20)){
   const c=m.calculate(r),tr=node('tr');const detail=node('td');detail.append(node('b',`${r.id} · ${r.name}`),node('p',`${r.baseName} : ${r.base} EUR × ${r.rate||'taux absent'} % · ${r.period}`));tr.append(detail,node('td',c.signification??'Non calculée'),node('td',r.planningMode==='none'?'Non renseignée':c.planning??'Non calculée'));
   const state=node('td',`${session.retainedId===r.id?'RETENU':'NON RETENU'}${r.changedSinceValidation?' · Entrées modifiées depuis validation':''}`);if(c.errors.length)state.append(node('p',c.errors.join(' ')));tr.append(state);
   const actions=node('td'),wrap=node('div');wrap.className='actions';
   for(const [label,fn] of [[`Ouvrir ${r.id}`,()=>{if(dirty&&!confirm('Remplacer les modifications non enregistrées du formulaire ?'))return;loadEditor(r);$('#sig-editor').focus();}], [`Retenir ${r.id}`,()=>{session=m.retainScenario(session,r.id);clearDownloads();render();status('Choix utilisateur enregistré. Il ne vaut pas avis d’audit.');}]]){const b=node('button',label);b.type='button';b.className='btn btn-contour';b.disabled=isBusy()||dirty;b.onclick=()=>guard(fn);wrap.append(b);}actions.append(wrap);tr.append(actions);body.append(tr);
  }
  $('[data-sig-page]').textContent=total?`Page ${page+1} / ${Math.ceil(total/20)}`:'Aucune page';
  $('[data-sig-prev]').disabled=isBusy()||page===0;$('[data-sig-next]').disabled=isBusy()||(page+1)*20>=total;
  $$('[data-sig-export], [data-sig-final]').forEach(b=>b.disabled=isBusy()||dirty||!total);
  $('[data-sig-save]').disabled=isBusy();$('[data-sig-cancel]').disabled=!isBusy();
  $('[data-sig-import-confirm]').disabled=isBusy()||dirty||!rows||!$('[data-sig-import-valid]').checked;
  $('[data-sig-preview]').disabled=isBusy()||!parsed;
  $$('form input,form select,form textarea,[data-mapping],[data-sig-import-valid]').forEach(el=>el.disabled=isBusy());
  $$('[data-sig-demo],[data-sig-new], [data-sig-csv] button,[data-sig-restore] button').forEach(b=>b.disabled=isBusy());
 }
 function renderPreview(){
  const el=$('[data-sig-preview-rows]');el.replaceChildren();const total=rows?.length??0;importPage=Math.min(importPage,Math.max(0,Math.ceil(total/20)-1));
  $('[data-sig-import-summary]').textContent=rows?`${total} lignes à ajouter · aperçu de ${Math.min(20,Math.max(0,total-importPage*20))} lignes, import intégral après confirmation`:'Aucun aperçu validé';
  if(rows){const table=node('table'),head=node('tr');['Identifiant','Scénario','Base EUR / taux %','Signification EUR','Contrôles'].forEach(t=>head.append(node('th',t)));const thead=node('thead');thead.append(head);table.append(thead);const tbody=node('tbody');
   for(const r of rows.slice(importPage*20,importPage*20+20)){const tr=node('tr'),c=m.calculate(r);[r.id,r.name,`${r.base} / ${r.rate}`,c.signification??'Non calculée',c.errors.join(' ')||'Passés'].forEach(t=>tr.append(node('td',t)));tbody.append(tr);}table.append(tbody);el.append(table);
  }
  $('[data-sig-import-page]').textContent=total?`Page ${importPage+1} / ${Math.ceil(total/20)}`:'Aucune page';$('[data-sig-import-prev]').disabled=importPage===0||isBusy();$('[data-sig-import-next]').disabled=(importPage+1)*20>=total||isBusy();render();
 }
 function invalidatePreview(){rows=null;importPage=0;$('[data-sig-import-valid]').checked=false;renderPreview();}
 function clearImport(){parsed=null;invalidatePreview();$('[data-sig-mapping]').replaceChildren();$('[data-sig-csv]').reset();$('[data-sig-restore]').reset();}
 function run(data,done){
  if(worker){error('Un traitement est déjà en cours.');return;}clearDownloads();error('');status('Traitement local en cours…');worker=resident;render();
  const finish=()=>{worker.onmessage=null;worker.onerror=null;worker=null;cancelJob=null;render();};
  cancelJob=()=>{worker.terminate();resident=new WorkerClass();finish();status('Traitement annulé, aucune sortie partielle. La session précédente est conservée.');};
  worker.onmessage=({data:reply})=>{finish();if(!reply.ok){error(reply.error);status('Traitement refusé, session conservée.');return;}guard(()=>done(reply.result));};
  worker.onerror=()=>{finish();error('Traitement local interrompu : aucune nouvelle donnée appliquée.');};worker.postMessage(data);
 }
 function syncMeta(){session=m.updateMetadata(session,Object.fromEntries(['missionRef','preparer','reviewer'].map(k=>[k,meta.elements[k].value])));clearDownloads();}
 form.addEventListener('input',markDirty);form.addEventListener('change',markDirty);
 form.onsubmit=e=>{e.preventDefault();guard(()=>{const r=values();session=editing?m.updateScenario(session,editing,Object.fromEntries(Object.entries(r).filter(([k])=>k!=='id'))):m.addScenario(session,r);editing=r.id;form.elements.id.readOnly=true;dirty=false;$('[data-sig-dirty]').hidden=true;clearDownloads();fieldErrors(m.calculate(r).errors);render();status(m.calculate(r).errors.length?'Scénario conservé en brouillon : paramètres à corriger.':'Calcul enregistré. Choix et justification restent à valider.');});};
 meta.addEventListener('input',()=>guard(syncMeta));meta.onsubmit=e=>e.preventDefault();
 $('[data-sig-new]').onclick=()=>{if(dirty&&!confirm('Abandonner les modifications non enregistrées du formulaire ?'))return;newEditor();status('Nouveau scénario : aucun taux prérempli.');};
 $('[data-sig-demo]').onclick=()=>{if((session.scenarios.length||dirty)&&!confirm('Remplacer la session par le jeu fictif ? Sauvegardez votre JSON avant remplacement.'))return;session=m.demoSession();page=0;clearDownloads();clearImport();meta.reset();loadEditor(session.scenarios[0]);status('Deux scénarios fictifs, aucun retenu. Les taux sont des données d’essai.');};
 $('[data-sig-reset]').onclick=()=>{if((session.scenarios.length||dirty||parsed)&&!confirm('Effacer les saisies, scénarios et sorties de cette session ? Les fichiers téléchargés restent sur votre appareil.'))return;cancelJob?.();session=m.createSession();page=0;clearDownloads();clearImport();meta.reset();newEditor();error('');status('Session effacée.');};
 $('[data-sig-cancel]').onclick=()=>cancelJob?.();
 $('[data-sig-prev]').onclick=()=>{page--;render();};$('[data-sig-next]').onclick=()=>{page++;render();};
 $('[data-sig-import-prev]').onclick=()=>{importPage--;renderPreview();};$('[data-sig-import-next]').onclick=()=>{importPage++;renderPreview();};
 $('[data-sig-csv]').onsubmit=e=>{e.preventDefault();const file=$('#sig-csv').files[0];if(!file)return;if(file.size>m.MAX_BYTES){error('CSV supérieur à 20 Mo.');return;}guard(()=>{parsed=null;invalidatePreview();$('[data-sig-mapping]').replaceChildren();run({action:'csv',file,delimiter:$('#sig-delimiter').value==='tab'?'\t':$('#sig-delimiter').value},result=>{parsed=result;for(let i=0;i<m.INPUT_FIELDS.length;i++){const key=m.INPUT_FIELDS[i],label=node('label',m.LABELS[i]),select=node('select');select.dataset.mapping=key;select.append(new Option('Associer une colonne',''));parsed.headers.forEach((h,j)=>select.append(new Option(h,String(j))));select.onchange=invalidatePreview;label.append(select);$('[data-sig-mapping]').append(label);}render();status(`${parsed.rows.length} lignes lues. Associez les dix champs puis examinez l’aperçu.`);});});};
 $('#sig-csv').onchange=()=>{parsed=null;$('[data-sig-mapping]').replaceChildren();invalidatePreview();};$('#sig-delimiter').onchange=()=>{parsed=null;$('[data-sig-mapping]').replaceChildren();invalidatePreview();};
 $('[data-sig-preview]').onclick=()=>guard(()=>{const mapping=Object.fromEntries($$('[data-mapping]').map(el=>[el.dataset.mapping,el.value===''?-1:Number(el.value)]));invalidatePreview();run({action:'map',parsed,mapping},result=>{rows=result;renderPreview();status('Aperçu prêt ; confirmer l’ajout reste une action explicite.');});});
 $('[data-sig-import-valid]').onchange=render;
 $('[data-sig-import-confirm]').onclick=()=>{if(!rows||dirty||!$('[data-sig-import-valid]').checked)return;run({action:'append',session,rows},result=>{session=result;clearImport();render();status('Tous les scénarios importés ont été ajoutés, sans choix automatique.');});};
 $('[data-sig-restore]').onsubmit=e=>{e.preventDefault();const files=[...$('#sig-json').files];if(!files.length)return;run({action:'restore',files},result=>{if((session.scenarios.length||dirty)&&!confirm('Remplacer la session présente par la sauvegarde vérifiée ?')){status('Reprise non appliquée, session présente conservée.');return;}session=result;page=0;clearImport();for(const k of ['missionRef','preparer','reviewer'])meta.elements[k].value=session.metadata[k];newEditor();render();status('Sauvegarde reprise : saisies et états conservés. Le choix reste une déclaration utilisateur.');});};
 function download(format,final=false){if(dirty){error('Enregistrez les modifications avant export.');return;}run({action:'export',session,format,final},parts=>{const area=$('[data-sig-downloads]');for(const part of parts){const url=URL.createObjectURL(new Blob([part.content],{type:format==='json'?'application/json;charset=utf-8':format==='csv'?'text/csv;charset=utf-8':'text/html;charset=utf-8'}));urls.push(url);const a=node('a',`Télécharger ${part.filename}`);a.href=url;a.download=part.filename;a.className='btn btn-contour';area.append(a);}if(parts.length===1)area.querySelector('a').click();status(`${parts.length} fichier(s) préparé(s) : ${parts.length>1?'téléchargez toutes les parties pour reprendre.':m.dossierState(session)+'.'}`);});}
 $$('[data-sig-export]').forEach(b=>b.onclick=()=>download(b.dataset.sigExport));$('[data-sig-final]').onclick=()=>download('html',true);
 window.addEventListener('beforeunload',e=>{if(session.scenarios.length||dirty){e.preventDefault();e.returnValue='';}});
 newEditor();renderPreview();
}
