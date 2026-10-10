import {FIELDS,MAX_BYTES,demoInvoices,prepareReminders,exportText,exportCsv} from './relance-facture.mjs';
import {startImport} from './relance-facture-worker.mjs';
export function initializeRelance(WorkerClass) {
 const root=document.querySelector('[data-relance]');if(!root)return;
 const $=selector=>root.querySelector(selector),$$=selector=>[...root.querySelectorAll(selector)];
 let inputs=[],report=null,dirty=false,edited=false,page=0,messageIndex=0,editingIndex=null,job=null;
 const error=$('#rel-error'),status=$('#rel-status'),entry=$('[data-rel-entry]');
 const announce=text=>{status.textContent=text;};
 const fail=e=>{error.textContent=e.message??String(e);error.hidden=false;};
 const clearError=()=>{error.hidden=true;error.textContent='';};
 const dateInput=$('#rel-preparationDate');
 const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 dateInput.value=today();
 const setEnabled=()=>{const enabled=Boolean(report&&!dirty&&!job);$$('[data-rel-export], [data-rel-copy]').forEach(b=>{b.disabled=!enabled;});$('[data-rel-cancel]').disabled=!job;$$('[data-rel-demo], [data-rel-save], [data-rel-new], [data-rel-prepare] button, [data-rel-import] button').forEach(b=>{b.disabled=Boolean(job);});};
 const invalidate=()=>{if(report){dirty=true;announce('Données modifiées : le résultat précédent est conservé, mais copie et exports attendent une nouvelle préparation.');}setEnabled();renderTable();};
 function renderTable(){
  const rows=!dirty&&report?report.invoices:inputs;
  $('#rel-summary').textContent=`${inputs.length} factures${report&&!dirty?` · ${report.messages.length} messages · ${report.invoices.filter(x=>x.status==='review').length} cas à examiner · ${report.invoices.filter(x=>x.status==='excluded').length} exclusions`:' · préparation à refaire'}.`;
  page=Math.max(0,Math.min(page,Math.max(0,Math.ceil(rows.length/20)-1)));
  const tbody=$('[data-rel-decisions]');tbody.replaceChildren();
  rows.slice(page*20,page*20+20).forEach((x,offset)=>{
   const index=page*20+offset,tr=document.createElement('tr');
   for(const text of [`${x.line??index+1} / ${x.clientKey}`,`${x.client} / ${x.reference}`,x.balance??'Non évalué',x.reason??'À préparer']){const td=document.createElement('td');td.textContent=text;tr.append(td);}
   const td=document.createElement('td'),button=document.createElement('button');button.type='button';button.className='btn btn-contour';button.textContent='Corriger';button.setAttribute('aria-label',`Corriger la facture ${x.reference||index+1}`);button.disabled=Boolean(job);
   button.addEventListener('click',()=>{editingIndex=index;for(const f of FIELDS.filter(f=>f!=='currency'))entry.elements.namedItem(f).value=inputs[index][f];$('[data-rel-save]').textContent='Enregistrer la correction';entry.closest('details').open=true;entry.elements.namedItem('clientKey').focus();});td.append(button);tr.append(td);tbody.append(tr);
  });
  $('[data-rel-page]').textContent=`Page ${rows.length?page+1:0} / ${Math.ceil(rows.length/20)}`;$('[data-rel-prev]').disabled=page===0;$('[data-rel-next]').disabled=(page+1)*20>=rows.length;
 }
 function renderMessage(){
  const messages=report?.messages??[];$('#rel-message').hidden=!messages.length;
  if(!messages.length)return;
  messageIndex=Math.max(0,Math.min(messageIndex,messages.length-1));const m=messages[messageIndex];
  $('[data-rel-message-key]').textContent=`Clé ${m.clientKey} — ${m.client} — total ${m.balance.replace('.',',')} EUR — proposition à valider`;
  $('#rel-message-subject').value=m.subject;$('#rel-message-body').value=m.body;
  $('[data-rel-msg-page]').textContent=`${messageIndex+1} / ${messages.length}`;$('[data-rel-msg-prev]').disabled=messageIndex===0;$('[data-rel-msg-next]').disabled=messageIndex===messages.length-1;
 }
 const replaceAllowed=()=>!inputs.length||window.confirm('Remplacer le lot et ses messages ? Exportez vos éditions avant ce remplacement.');
 const resetEntry=()=>{editingIndex=null;entry.reset();$('[data-rel-save]').textContent='Ajouter la facture';};
 const stop=()=>{job?.cancel();job=null;setEnabled();};
 entry.addEventListener('submit',event=>{event.preventDefault();clearError();if(job)return;const invoice={...Object.fromEntries(FIELDS.filter(f=>f!=='currency').map(f=>[f,entry.elements.namedItem(f).value])),currency:'EUR'};if(editingIndex===null){if(inputs.length>=500){fail(new Error('500 factures maximum.'));return;}inputs.push(invoice);}else inputs[editingIndex]={...invoice,line:inputs[editingIndex].line};resetEntry();invalidate();renderTable();announce('Facture enregistrée. Préparez les relances pour examiner le lot.');});
 $('[data-rel-new]').addEventListener('click',resetEntry);
 $('[data-rel-demo]').addEventListener('click',()=>{if(!replaceAllowed())return;stop();inputs=demoInvoices();report=null;dirty=false;edited=false;page=0;messageIndex=0;resetEntry();dateInput.value='2026-10-06';$('#rel-level').value='first';$('#rel-signature').value='';$('#rel-group').checked=true;clearError();renderTable();renderMessage();setEnabled();announce('4 factures fictives chargées. La clé client du jeu fictif est confirmée ; préparez les relances.');});
 $('[data-rel-reset]').addEventListener('click',()=>{stop();inputs=[];report=null;dirty=false;edited=false;page=0;messageIndex=0;resetEntry();$('[data-rel-import]').reset();dateInput.value=today();$('#rel-signature').value='';$('#rel-level').value='first';$('#rel-group').checked=false;clearError();renderTable();renderMessage();setEnabled();announce('Session effacée de la page ; vos téléchargements restent sur votre appareil.');});
 $('[data-rel-prepare]').addEventListener('input',invalidate);
 $('[data-rel-prepare]').addEventListener('submit',event=>{
  event.preventDefault();clearError();if(job)return;
  try {
   const next=prepareReminders(inputs,{preparationDate:dateInput.value,currency:'EUR',groupConfirmed:$('#rel-group').checked,level:$('#rel-level').value,signature:$('#rel-signature').value});
   if(edited&&!window.confirm('Régénérer remplace les messages que vous avez édités. Exportez-les avant de continuer.'))return;
   report=next;dirty=false;edited=false;messageIndex=0;renderTable();renderMessage();setEnabled();announce(`${report.messages.length} messages préparés, à relire ; aucun envoi. Tous les motifs sont dans le tableau et les exports.`);
   if(report.messages.length)$('#rel-message-title').focus();
  }catch(e){fail(e);}
 });
 for(const [selector,field] of [['#rel-message-subject','subject'],['#rel-message-body','body']])$(selector).addEventListener('input',()=>{if(!report?.messages[messageIndex])return;report.messages[messageIndex][field]=$(selector).value;edited=true;});
 $('[data-rel-import]').addEventListener('submit',async event=>{
  event.preventDefault();clearError();if(job)return;const file=$('#rel-file').files[0];
  if(!file||file.size>MAX_BYTES){fail(new Error('CSV absent ou supérieur à 5 Mo (5 000 000 octets) : refus avant lecture.'));return;}
  const current=startImport({file,encoding:$('#rel-encoding').value,delimiter:$('#rel-delimiter').value==='tab'?'\t':$('#rel-delimiter').value},WorkerClass);job=current;setEnabled();announce('Lecture locale dans un Worker ; annulation disponible.');
  try {const result=await current.promise;if(job!==current)return;job=null;if(result.cancelled){announce('Traitement annulé ; lot précédent conservé.');return;}if(!replaceAllowed()){announce('Remplacement refusé ; lot précédent conservé.');return;}inputs=result.invoices;report=null;dirty=false;edited=false;page=0;messageIndex=0;resetEntry();$('#rel-group').checked=false;renderTable();renderMessage();announce(`${inputs.length} facture(s) importée(s). Confirmez les clés client puis préparez les relances.`);}catch(e){if(job!==current)return;job=null;fail(e);announce('Import refusé ; saisies et résultat précédent conservés.');}finally{if(job===current)job=null;setEnabled();}
 });
 $('[data-rel-cancel]').addEventListener('click',()=>{stop();announce('Traitement annulé ; lot et messages précédents conservés.');});
 $('[data-rel-prev]').addEventListener('click',()=>{page--;renderTable();});$('[data-rel-next]').addEventListener('click',()=>{page++;renderTable();});
 $('[data-rel-msg-prev]').addEventListener('click',()=>{messageIndex--;renderMessage();});$('[data-rel-msg-next]').addEventListener('click',()=>{messageIndex++;renderMessage();});
 $('[data-rel-copy]').addEventListener('click',async()=>{if(!report||dirty||job)return;try{const m=report.messages[messageIndex];await navigator.clipboard.writeText(`Objet : ${m.subject}\n\n${m.body}`);announce('Message édité copié, sans envoi.');}catch{fail(new Error('Copie indisponible : sélectionnez le texte ou utilisez l’export.'));}});
 $$('[data-rel-export]').forEach(button=>button.addEventListener('click',()=>{if(!report||dirty||job)return;const csv=button.dataset.relExport==='csv';const url=URL.createObjectURL(new Blob([csv?exportCsv(report):exportText(report)],{type:csv?'text/csv;charset=utf-8':'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`relances-amiables.${csv?'csv':'txt'}`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Rapport complet téléchargé : messages édités et toutes les décisions.');}));
 renderTable();setEnabled();
}
