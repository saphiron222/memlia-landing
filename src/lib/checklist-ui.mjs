import * as m from './checklist-pieces.mjs';
export function initializeChecklist(WorkerClass){
 const root=document.querySelector('[data-checklist]');if(!root)return;
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 const meta=$('[data-cl-meta]'),add=$('[data-cl-add]'),worker=new WorkerClass();
 let session=m.createSession(),pending=null,busy=false,job=0,urls=[];
 const node=(tag,text)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el;};
 const status=text=>$('[data-cl-status]').textContent=text;
 const error=text=>{$('[data-cl-error]').textContent=text;$('[data-cl-error]').hidden=!text;};
 const clearDownloads=()=>{urls.forEach(u=>URL.revokeObjectURL(u));urls=[];$('[data-cl-downloads]').replaceChildren();};
 const hasContent=()=>session.items.length||meta.elements.period.value||meta.elements.deadline.value||add.elements.label.value||add.elements.note.value;
 function capture(){session={...session,mode:meta.elements.mode.value,period:meta.elements.period.value,deadline:meta.elements.deadline.value,items:$$('[data-cl-item]').map(row=>({id:row.dataset.clItem,...Object.fromEntries(['family','label','state','note'].map(k=>[k,row.querySelector(`[data-field="${k}"]`).value]))}))};}
 function lock(){ $$('input,select,textarea,button').forEach(el=>el.disabled=busy);$('[data-cl-cancel]').disabled=!busy;$('[data-cl-apply]').disabled=busy||!pending; }
 function renderResult(){clearDownloads();let r;try{r=m.result(session);error('');}catch(e){error(e.message);}
  $$('[data-cl-export], [data-cl-copy]').forEach(b=>b.disabled=busy||!r);$('[data-cl-copy]').disabled=busy||!r?.message;
  $('[data-cl-message]').value=r?.message??'';
  $('[data-cl-summary]').textContent=!r?'Saisie à corriger : sorties suspendues.':!session.items.length?'Liste vide : choisissez une trame ou ajoutez une pièce.':r.complete?'Terminé sur cette trame : aucune pièce à demander.':`${session.items.length} pièce(s) · ${r.missing.length} manquante(s) · ${r.unknown.length} à clarifier`;
  $('[data-cl-unknown]').replaceChildren(...(r?.unknown??[]).map(i=>node('li',i.label)));
  $('[data-cl-no-message]').hidden=!!r?.message;
 }
 function renderItems(){const list=$('[data-cl-items]');list.replaceChildren();
  for(const item of session.items){const row=node('fieldset');row.dataset.clItem=item.id;row.append(node('legend',`Pièce ${item.id}`));
   for(const [key,label,options] of [['label','Libellé',null],['family','Famille',m.FAMILIES],['state','État déclaré',m.STATES],['note','Note interne (non envoyée)',null]]){
    const wrap=node('label',label),input=node(options?'select':key==='note'?'textarea':'input');input.id=`cl-${item.id}-${key}`;input.dataset.field=key;input.setAttribute('aria-describedby','cl-error');
    if(options)for(const [value,text] of Object.entries(options))input.append(new Option(text,value));else input.maxLength=key==='note'?2000:300;
    input.value=item[key];input.oninput=()=>{capture();renderResult();};wrap.append(input);row.append(wrap);
   }
   const b=node('button',`Supprimer ${item.id}`);b.type='button';b.className='btn btn-contour';b.onclick=()=>{capture();session={...session,items:session.items.filter(i=>i.id!==item.id)};renderItems();renderResult();$('[data-cl-summary]').focus();status('Pièce supprimée ; demande et exports mis à jour.');};row.append(b);list.append(row);
  }
 }
 function load(s){session=s;for(const k of ['mode','period','deadline'])meta.elements[k].value=s[k];add.reset();renderItems();lock();renderResult();}
 function guard(fn){try{capture();m.validate(session);error('');fn();}catch(e){error(e.message);}}
 meta.oninput=()=>{capture();renderResult();};meta.onsubmit=e=>e.preventDefault();
 add.onsubmit=e=>{e.preventDefault();guard(()=>{session=m.addItem(session,Object.fromEntries(['family','label','state','note'].map(k=>[k,add.elements[k].value])));renderItems();renderResult();add.reset();status('Pièce ajoutée.');});};
 $('[data-cl-families]').onsubmit=e=>{e.preventDefault();guard(()=>{const selected=$$('[name="families"]:checked').map(el=>el.value);if(!selected.length)throw new Error('Choisissez au moins une famille de trame.');session=m.addFamilies(session,selected);renderItems();renderResult();status('Trame ajoutée : nouvelles pièces à clarifier, saisies existantes conservées.');});};
 $('[data-cl-demo]').onclick=()=>{if(hasContent()&&!confirm('Remplacer vos saisies par l’exemple fictif ? Exportez votre JSON avant remplacement.'))return;cancel();pending=null;load(m.demoSession());status('Quatre pièces fictives et quatre états.');};
 function cancel(){job++;busy=false;lock();$('[data-cl-preview]').textContent='';pending=null;$('[data-cl-apply]').disabled=true;}
 $('[data-cl-reset]').onclick=()=>{if(hasContent()&&!confirm('Effacer cette session ? Les fichiers téléchargés restent sur votre appareil.'))return;cancel();$('[data-cl-import]').reset();$('[data-cl-families]').reset();load(m.createSession());status('Session effacée.');};
 $('[data-cl-cancel]').onclick=()=>{cancel();renderResult();status('Lecture annulée ; session conservée, aucune donnée importée.');};
 $('[data-cl-import]').onsubmit=e=>{e.preventDefault();const file=$('#cl-file').files[0];if(!file)return;error('');pending=null;$('[data-cl-preview]').textContent='';
  if(file.size>m.MAX_BYTES){error('Fichier supérieur à 1 Mo ; session conservée.');return;}
  const id=++job;busy=true;lock();status('Lecture locale en cours…');worker.postMessage({id,file,format:$('#cl-format').value,encoding:$('#cl-encoding').value,delimiter:$('#cl-delimiter').value==='tab'?'\t':$('#cl-delimiter').value});
 };
 worker.onmessage=({data})=>{if(data.id!==job||!busy)return;busy=false;lock();renderResult();if(!data.ok){error(data.error);status('Import refusé ; session conservée.');return;}pending=data.result;$('[data-cl-preview]').textContent=`Reprise vérifiée : ${pending.items.length} pièce(s), période « ${pending.period||'non renseignée'} ». Appliquer remplace la liste après votre confirmation.`;lock();renderResult();status('Aperçu vérifié, non appliqué.');};
 worker.onerror=()=>{cancel();renderResult();error('Lecture locale interrompue. Session conservée.');};
 $('[data-cl-import]').onchange=()=>{pending=null;$('[data-cl-preview]').textContent='';lock();renderResult();};
 $('[data-cl-apply]').onclick=()=>{if(!pending)return;if(hasContent()&&!confirm('Remplacer les saisies présentes par cette reprise vérifiée ?')){status('Reprise non appliquée ; saisies conservées.');return;}const next=pending;pending=null;$('[data-cl-preview]').textContent='';load(next);status('Reprise appliquée : période et états restaurés.');};
 function download(format){guard(()=>{clearDownloads();const content=format==='json'?m.exportJson(session):format==='csv'?m.exportCsv(session):m.printHtml(session),mime=format==='json'?'application/json':format==='csv'?'text/csv':'text/html',url=URL.createObjectURL(new Blob([content],{type:mime+';charset=utf-8'}));urls.push(url);const a=node('a',`Télécharger la checklist ${format.toUpperCase()}`);a.href=url;a.download=`checklist-pieces.${format}`;a.className='btn btn-contour';$('[data-cl-downloads]').append(a);a.click();status(format==='html'?'Rapport complet téléchargé : ouvrez-le puis imprimez-le avec votre navigateur.':'Export complet préparé, aucune donnée envoyée.');});}
 $$('[data-cl-export]').forEach(b=>b.onclick=()=>download(b.dataset.clExport));
 $('[data-cl-copy]').onclick=async()=>{try{capture();const r=m.result(session);if(!r.message)return;await navigator.clipboard.writeText(r.message);status('Demande copiée : uniquement les pièces manquantes, aucun envoi.');}catch{error('Copie indisponible : sélectionnez le texte de la demande et copiez-le au clavier.');}};
 window.addEventListener('beforeunload',e=>{if(hasContent()){e.preventDefault();e.returnValue='';}});
 load(session);
}
