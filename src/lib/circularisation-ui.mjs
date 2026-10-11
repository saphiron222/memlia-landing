import {createSession,addTier,updateTier,addResponse,generateLetter,compareResponse,reconcileResponse,reminderEligible,exportSessionFiles,exportCsv,printReport,demoSession,MAX_BYTES,updateParameters} from './circularisation.mjs';
import {startCsvWorkerJob} from './circularisation-worker.mjs';
const STATES={draft:'Brouillon',prepared:'Préparée',sent:'Envoi renseigné',received:'Réponse reçue',reconciled:'Réponse rapprochée','non-response':'Non-réponse',disagreement:'Désaccord',refusal:'Refus',escalated:'Transmis au CAC pour suite'};
const MAPPING={id:'Identifiant tiers',category:'Catégorie',recipient:'Destinataire',contact:'Contact',missionRef:'Référence mission',referenceDate:'Date de référence',currency:'Devise',requestedAmount:'Solde demandé',confirmationType:'Type (open/closed)',note:'Note'};
export function initializeCircularisation(WorkerClass){
 const root=document.querySelector('[data-circularisation]');if(!root)return;
 const $=s=>root.querySelector(s);let session=createSession(),active=null,editing=null,page=0,job=null,sourceFile=null,parsed=null,offset=0,preview=null;const selectedRows=new Set();
 const error=$('[data-circ-error]'),status=$('[data-circ-status]');
 const announce=text=>{status.textContent=text;};const fail=e=>{error.textContent=e.message??String(e);error.hidden=false;};
 const run=fn=>{error.hidden=true;try{return fn();}catch(e){fail(e);}};
 const bind=(selector,event,fn)=>$(selector).addEventListener(event,e=>{if(event==='submit')e.preventDefault();run(()=>fn(e));});
 const tier=()=>session.tiers.find(t=>t.id===active);
 const download=(text,name,type)=>{const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 function render(){
  $('[data-circ-export-parts]').replaceChildren();
  $('[data-circ-summary]').textContent=`${session.tiers.length} tiers · ${session.tiers.filter(t=>t.selected).length} sélectionnés`;
  page=Math.min(page,Math.max(0,Math.ceil(session.tiers.length/20)-1));const body=$('[data-circ-table] tbody');body.replaceChildren();
  for(const t of session.tiers.slice(page*20,page*20+20)){
   const c=compareResponse(t),row=node('tr');row.append(node('td',`${t.id} — ${t.recipient}`),node('td',STATES[t.status]),node('td',c.evaluated?`${!c.difference.startsWith('-')&&c.difference!=='0'?'+':''}${c.difference} ${t.currency}`:`Non évalué : ${c.reason}`));const cell=node('td'),button=node('button',`Ouvrir ${t.id}`);button.type='button';button.className='btn btn-contour';button.addEventListener('click',()=>run(()=>open(t.id)));cell.append(button);row.append(cell);body.append(row);
  }
  $('[data-circ-page]').textContent=`Page ${page+1} sur ${Math.max(1,Math.ceil(session.tiers.length/20))} · total ${session.tiers.length}`;$('[data-circ-prev]').disabled=page===0;$('[data-circ-next]').disabled=(page+1)*20>=session.tiers.length;
  for(const [name,value]of Object.entries(session.metadata))$('[data-circ-meta]').elements.namedItem(name).value=value;
  $('#circ-delay').value=String(session.parameters.reminderDelayDays);$('#circ-asof').value=session.parameters.reminderAsOf;
  renderDetail();
 }
 function reminder(){const t=tier();if(!t)return;const r=reminderEligible(t,{delayDays:Number($('#circ-delay').value),asOf:$('#circ-asof').value});$('[data-circ-reminder]').textContent=`${r.eligible?'Relance proposée (jamais envoyée)':'Relance suspendue ou non éligible'} : ${r.reason}${r.dueDate?' · échéance indicative '+r.dueDate:''}`;}
 function renderDetail(){
  const t=tier();$('[data-circ-detail]').hidden=!t;if(!t){clearDetail();return;}
  $('#circ-detail-title').textContent=`${t.id} — ${t.recipient}`;$('[data-circ-detail-summary]').textContent=`${STATES[t.status]} · ${t.responses.length} réponses · ${t.letters.length} versions de lettre`;
  $('#circ-sent').value=t.sentDate;$('#circ-sent').disabled=Boolean(t.sentDate);$('[data-circ-send] button').disabled=Boolean(t.sentDate);
  const c=compareResponse(t);$('[data-circ-reconcile]').disabled=!c.evaluated||t.responses.at(-1)?.reconciled;
  const select=$('#circ-letter-version'),old=select.value;select.replaceChildren();for(const l of t.letters){const option=node('option',`Version ${l.version} · ${l.generatedAt}`);option.value=String(l.version);select.append(option);}select.value=t.letters.some(l=>String(l.version)===old)?old:String(t.letters.length);showLetter();
  const history=$('[data-circ-history]');history.replaceChildren();for(const n of t.notes)history.append(node('p',`Note ${n.id} · ${n.at} : ${n.text}`));for(const r of t.responses)history.append(node('p',`Retour ${r.id} · ${r.date} · ${r.reference} · ${r.kind} · ${r.amount||'montant absent'} ${r.currency} · ${r.reconciled?'rapproché':'non rapproché'} : ${r.comment}`));const events=node('details');events.append(node('summary',`Journal complet (${t.history.length} événements)`),node('pre',JSON.stringify(t.history,null,2)));history.append(events);reminder();
 }
 function showLetter(){const l=tier()?.letters.find(l=>String(l.version)===$('#circ-letter-version').value);$('[data-circ-letter-text]').textContent=l?.text??'Aucune lettre préparée.';$('[data-circ-letter-copy]').disabled=!l;$('[data-circ-letter-download]').disabled=!l;}
 function currentLetter(){return tier()?.letters.find(l=>String(l.version)===$('#circ-letter-version').value);}
 function clearDetail(){
  for(const selector of ['[data-circ-letter]','[data-circ-send]','[data-circ-response]','[data-circ-note]'])$(selector).reset();
  $('#circ-detail-title').textContent='Détail du tiers';
  for(const selector of ['[data-circ-detail-summary]','[data-circ-reminder]','[data-circ-history]','[data-circ-letter-text]','#circ-letter-version'])$(selector).replaceChildren();
  $('#circ-sent').disabled=false;$('[data-circ-send] button').disabled=false;
  $('[data-circ-reconcile]').disabled=true;showLetter();
 }
 function newTier(){editing=null;$('[data-circ-tier]').reset();$('#circ-id').readOnly=false;$('[data-circ-save]').textContent='Ajouter le tiers';}
 function open(id){clearDetail();active=id;editing=id;const t=tier(),form=$('[data-circ-tier]');for(const [name,value]of Object.entries(t)){const field=form.elements.namedItem(name);if(!field)continue;if(name==='selected')field.checked=value;else field.value=value;}$('#circ-id').readOnly=true;$('[data-circ-save]').textContent='Enregistrer la correction';$('#circ-return').value='';$('#circ-letter-valid').checked=false;$('#circ-amount-valid').checked=false;$('#circ-response-currency').value=t.currency;$('#circ-letter-version').value='';renderDetail();$('#circ-detail-title').focus();}
 bind('[data-circ-tier]','submit',()=>{const form=$('[data-circ-tier]'),input=Object.fromEntries(new FormData(form));input.selected=form.elements.namedItem('selected').checked;if(editing){delete input.id;session=updateTier(session,editing,input);$('[data-circ-response]').elements.namedItem('comparable').checked=false;}else{session=addTier(session,input);active=input.id;}render();announce('Tiers enregistré ; vos versions et notes sont conservées.');});
 bind('[data-circ-new]','click',newTier);
 bind('[data-circ-meta]','submit',()=>{session={...session,metadata:Object.fromEntries(new FormData($('[data-circ-meta]'))),updatedAt:new Date().toISOString()};render();announce('Mentions enregistrées sans attribution de validation.');});
 bind('[data-circ-demo]','click',()=>{if(session.tiers.length&&!confirm('Remplacer la session par l’exemple fictif ? Sauvegardez le JSON au préalable.'))return;job?.cancel();session=demoSession();active=null;newTier();clearImport();render();announce('Exemple fictif chargé, aucun envoi réalisé.');});
 bind('[data-circ-reset]','click',()=>{if(!confirm('Effacer définitivement cette session en mémoire ? Sauvegardez le JSON au préalable.'))return;job?.cancel();session=createSession();active=null;newTier();clearImport();render();announce('Session effacée. Les fichiers téléchargés restent sur votre appareil.');});
 bind('[data-circ-prev]','click',()=>{page--;render();});bind('[data-circ-next]','click',()=>{page++;render();});
 const saveParameters=()=>{session=updateParameters(session,{reminderDelayDays:Number($('#circ-delay').value),reminderAsOf:$('#circ-asof').value});reminder();};
 bind('#circ-delay','change',saveParameters);bind('#circ-asof','change',saveParameters);
 bind('[data-circ-letter]','submit',()=>{const r=generateLetter(session,active,{returnContact:$('#circ-return').value,validated:$('#circ-letter-valid').checked,amountValidated:$('#circ-amount-valid').checked});session=r.session;$('#circ-letter-version').value='';render();$('#circ-letter-valid').checked=false;$('#circ-amount-valid').checked=false;announce('Lettre préparée, jamais envoyée.');});
 bind('#circ-letter-version','change',showLetter);
 bind('[data-circ-letter-copy]','click',async()=>{const l=currentLetter();if(!l)return;try{await navigator.clipboard.writeText(l.text);announce('Lettre copiée. Aucun envoi effectué.');}catch(e){fail(e);}});
 bind('[data-circ-letter-download]','click',()=>{const l=currentLetter();if(l)download(l.text,'lettre-circularisation.txt','text/plain;charset=utf-8');});
 bind('[data-circ-send]','submit',()=>{session=updateTier(session,active,{sentDate:$('#circ-sent').value});render();announce('Envoi renseigné par vous ; rien n’a été expédié par cet outil.');});
 bind('[data-circ-response]','submit',()=>{const form=$('[data-circ-response]'),input=Object.fromEntries(new FormData(form));input.comparable=form.elements.namedItem('comparable').checked;session=addResponse(session,active,input);form.elements.namedItem('comparable').checked=false;render();announce('Retour ajouté à l’historique, sans rapprochement présumé.');});
 bind('[data-circ-reconcile]','click',()=>{session=reconcileResponse(session,active);render();announce('Rapprochement validé par vous, sans conclusion d’audit.');});
 root.querySelectorAll('[data-circ-state]').forEach(button=>button.addEventListener('click',()=>run(()=>{session=updateTier(session,active,{status:button.dataset.circState});render();})));
 bind('[data-circ-note]','submit',()=>{session=updateTier(session,active,{note:$('#circ-note').value});$('#circ-note').value='';render();announce('Note ajoutée, précédentes conservées.');});
 root.querySelectorAll('[data-circ-export]').forEach(button=>button.addEventListener('click',()=>run(()=>{const format=button.dataset.circExport;if(format==='json'){
  const files=exportSessionFiles(session),container=$('[data-circ-export-parts]');container.replaceChildren();
  if(files.length===1){download(files[0].text,files[0].name,'application/json');announce('Export complet téléchargé.');}
  else {files.forEach((file,index)=>{const b=node('button',`Télécharger la partie ${index+1} sur ${files.length}`);b.type='button';b.className='btn btn-contour';b.addEventListener('click',()=>{download(file.text,file.name,'application/json');b.textContent=`Partie ${index+1} sur ${files.length} téléchargée (télécharger à nouveau)`;});container.append(b);});announce(`Sauvegarde en ${files.length} parties : téléchargez chaque partie, puis sélectionnez-les ensemble à la reprise. Aucun historique supprimé.`);}
  return;
 }const text=format==='csv'?exportCsv(session):printReport(session);download(text,`suivi-circularisation.${format}`,format==='csv'?'text/csv;charset=utf-8':'text/html;charset=utf-8');announce(format==='html'?'Rapport HTML téléchargé : ouvrez-le pour imprimer.':'Export complet téléchargé.');})));
 bind('[data-circ-reimport]','submit',async()=>{try{const files=[...$('#circ-json').files];if(!files.length)throw new Error('Choisissez un JSON ou toutes ses parties.');if(files.some(file=>file.size>MAX_BYTES))throw new Error('JSON supérieur à 20 Mo par fichier, refus avant lecture.');const candidate=await execute({operation:'resume',files});if(!candidate)return;if(session.tiers.length&&!confirm('Remplacer la session actuelle par ce JSON ? Sauvegardez votre session avant de confirmer.'))return;session=candidate;active=null;newTier();clearImport();render();announce('Session reprise avec notes, lettres et historique.');}catch(e){fail(e);}});
 function clearImport(){sourceFile=null;parsed=null;preview=null;offset=0;selectedRows.clear();$('#circ-csv').value='';$('#circ-json').value='';$('[data-circ-mapping]').replaceChildren();$('[data-circ-preview-rows]').replaceChildren();$('[data-circ-import-summary]').textContent='';$('[data-circ-preview]').disabled=true;$('[data-circ-import-confirm]').disabled=true;$('#circ-import-valid').checked=false;}
 const disabledBefore=new Map();
 function busy(value){
  if(value){disabledBefore.clear();root.querySelectorAll('button,input,select,textarea').forEach(el=>{disabledBefore.set(el,el.disabled);el.disabled=true;});announce('Traitement local en cours ; annulez pour modifier la session.');}
  else{for(const[el,disabled]of disabledBefore)el.disabled=disabled;disabledBefore.clear();}
  $('[data-circ-cancel]').disabled=!value;
 }
 async function execute(request){job=startCsvWorkerJob(request,{WorkerClass});busy(true);try{const result=await job.promise;if(!result.complete){announce('Traitement annulé : aucun import partiel.');return null;}return result.data;}finally{job=null;busy(false);}}
 const mapping=()=>Object.fromEntries([...$('[data-circ-mapping]').querySelectorAll('select')].filter(s=>s.value).map(s=>[s.name,s.value]));
 bind('[data-circ-cancel]','click',()=>job?.cancel());
 bind('[data-circ-import]','submit',async()=>{try{sourceFile=$('#circ-csv').files[0];if(!sourceFile)throw new Error('Choisissez un CSV.');if(sourceFile.size>MAX_BYTES)throw new Error('CSV supérieur à 20 Mo, refus avant lecture.');parsed=null;preview=null;selectedRows.clear();$('[data-circ-preview-rows]').replaceChildren();$('[data-circ-import-confirm]').disabled=true;const result=await execute({operation:'parse',file:sourceFile,delimiter:$('#circ-delimiter').value==='tab'?'\t':$('#circ-delimiter').value});if(!result)return;parsed=result;const container=$('[data-circ-mapping]');container.replaceChildren();for(const[field,label]of Object.entries(MAPPING)){const l=node('label',label),s=node('select');s.name=field;s.setAttribute('aria-label',label+' — colonne CSV');const blank=node('option','Non associée');blank.value='';s.append(blank);for(const h of parsed.headers){const o=node('option',h);o.value=h;s.append(o);}s.addEventListener('change',()=>{preview=null;selectedRows.clear();$('[data-circ-preview-rows]').replaceChildren();$('[data-circ-import-confirm]').disabled=true;$('#circ-import-valid').checked=false;});l.append(s);container.append(l);}$('[data-circ-preview]').disabled=false;announce(`${parsed.rows.length} lignes lues. Associez les colonnes puis examinez l’aperçu.`);}catch(e){fail(e);}});
 // The preview is bounded to 20 visible rows; mapping/validation of the full file runs in the Worker.
 async function showPreview(){if(!sourceFile||!parsed)return;const result=await execute({operation:'preview',file:sourceFile,delimiter:$('#circ-delimiter').value==='tab'?'\t':$('#circ-delimiter').value,mapping:mapping(),offset,limit:20});if(!result)return;preview=result.preview;const list=$('[data-circ-preview-rows]');list.replaceChildren();for(const r of preview.rows){const l=node('label'),check=node('input');check.type='checkbox';check.disabled=!r.valid;check.checked=selectedRows.has(r.rowIndex);check.addEventListener('change',()=>{if(check.checked)selectedRows.add(r.rowIndex);else selectedRows.delete(r.rowIndex);$('#circ-import-valid').checked=false;});l.append(check,node('span',`Ligne ${r.rowIndex+2} : ${r.valid?`${r.tier.id} — ${r.tier.recipient} · ${r.tier.confirmationType} · ${r.tier.currency}`:r.errors.join(' ')}`));list.append(l);}$('[data-circ-import-summary]').textContent=`${preview.total} lignes au total · ${preview.invalid} invalides · aperçu ${offset+1} à ${Math.min(offset+20,preview.total)}. Cochez les lignes à retenir.`;$('[data-circ-import-prev]').disabled=offset===0;$('[data-circ-import-next]').disabled=offset+20>=preview.total;$('[data-circ-import-confirm]').disabled=false;}
 bind('[data-circ-preview]','click',async()=>{try{offset=0;await showPreview();}catch(e){fail(e);}});bind('[data-circ-import-prev]','click',async()=>{try{offset=Math.max(0,offset-20);await showPreview();}catch(e){fail(e);}});bind('[data-circ-import-next]','click',async()=>{try{offset+=20;await showPreview();}catch(e){fail(e);}});
 bind('[data-circ-import-confirm]','click',async()=>{try{if(!preview||!$('#circ-import-valid').checked)throw new Error('Validez explicitement les lignes cochées.');const result=await execute({operation:'import',file:sourceFile,delimiter:$('#circ-delimiter').value==='tab'?'\t':$('#circ-delimiter').value,mapping:mapping(),session,selectedRows:[...selectedRows],selectionValidated:true});if(!result)return;session=result;clearImport();render();announce('Sélection ajoutée à la campagne. Aucun envoi réalisé.');}catch(e){fail(e);}});
 $('#circ-asof').value=new Date().toISOString().slice(0,10);
 window.addEventListener('beforeunload',event=>{if(session.tiers.length){event.preventDefault();event.returnValue='';}});
 render();
}
