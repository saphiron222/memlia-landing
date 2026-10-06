/** Local, memory-only preparation. All session updates return a new object.
 * Amounts are decimal strings (no thousands/exponents); positive difference = confirmed - requested.
 * See named exports for the UI contract. No response authenticity or professional validation is inferred.
 */
import {parseDelimited, serializeCsv, decodeFile} from './pseudonymisation.mjs';
export const VERSION = 'circularisation-1';
export const SCHEMA_VERSION = 1;
export const MAX_BYTES = 20_000_000;
export const MAX_ROWS = 100_000;
export const CATEGORIES = ['client','fournisseur','banque','avocat','assureur'];
export const STATUSES = ['draft','prepared','sent','received','reconciled','non-response','disagreement','refusal','escalated'];
export const METHOD = 'Sélection validée par l’utilisateur ; lettres originales ouvertes ou fermées ; écart exact = montant confirmé − solde demandé, uniquement à devise et base comparables ; relance indicative après délai choisi.';
export const LIMITS = 'Préparation et suivi déclaratif uniquement. Ni envoi, ni réception, ni authentification, ni conversion de devise. Caractère probant, refus, désaccords et procédures alternatives à apprécier par le CAC. Session en mémoire : sauvegardez avant fermeture, aucun enregistrement automatique.';
export const CHECKS = ['Champs et dates calendaires','Unicité des identifiants','Chronologie envoi / réponse','Validation explicite des lettres','Devise et base comparables','Décimaux exacts','Version et structure de reprise','Neutralisation CSV et échappement HTML'];
const now = () => new Date().toISOString();
const clone = x => structuredClone(x);
const fail = message => { throw new Error(message); };
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x, field, required=false) => {
 if(typeof x !== 'string' || x.length>65_536 || /\u0000/.test(x) || required && !x.trim()) fail(`Champ ${field} : texte ${required?'non vide ':''}requis (65 536 caractères maximum).`);
 return x;
};
function keys(x, allowed, required=allowed) {
 if(!object(x) || Object.keys(x).some(k=>!allowed.includes(k)) || required.some(k=>!Object.hasOwn(x,k))) fail('Structure ou champ inconnu / manquant.');
}
function date(value, field='date', optional=false) {
 if(optional && value==='') return value;
 text(value,field,true);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`Date ${field} : AAAA-MM-JJ attendu.`);
 const y=Number(value.slice(0,4)), m=Number(value.slice(5,7)), d=Number(value.slice(8));
 const days=[31,y%4===0&&(y%100!==0||y%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
 if(y<1 || m<1 || m>12 || d<1 || d>days[m-1]) fail(`Date ${field} inexistante.`);
 return value;
}
function stamp(value) { if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString()!==value) fail('Horodatage invalide.'); }
function currency(value) { if(typeof value!=='string' || !/^[A-Z]{3}$/.test(value)) fail('Devise : trois lettres majuscules requises.'); return value; }
function decimal(value, optional=false) {
 if(optional && value==='') return value;
 if(typeof value!=='string' || value.length>256 || !/^[+-]?\d+(?:[.,]\d+)?$/.test(value)) fail('Montant : chaîne décimale signée exacte, sans milliers ni exposant (256 caractères maximum).');
 return value;
}
function scaled(value, scale) {
 const raw=decimal(value).replace(',','.'); const negative=raw.startsWith('-'); const [whole,fraction='']=raw.replace(/^[+-]/,'').split('.');
 return BigInt(whole+fraction.padEnd(scale,'0'))*(negative?-1n:1n);
}
export function compareAmounts(requested, confirmed) {
 decimal(requested); decimal(confirmed);
 const scale=Math.max((requested.split(/[.,]/)[1]??'').length,(confirmed.split(/[.,]/)[1]??'').length);
 const difference=scaled(confirmed,scale)-scaled(requested,scale); const negative=difference<0n; let digits=(negative?-difference:difference).toString().padStart(scale+1,'0');
 if(scale) digits=digits.slice(0,-scale)+'.'+digits.slice(-scale);
 if(scale) digits=digits.replace(/0+$/,'').replace(/\.$/,'');
 return (negative?'-':'')+digits;
}
const inputFields=['id','category','recipient','contact','missionRef','referenceDate','currency','requestedAmount','confirmationType','selected'];
const tierFields=[...inputFields,'sentDate','status','notes','history','responses','letters'];
const bool=(v,f)=>{if(typeof v!=='boolean') fail(`Champ ${f} : booléen requis.`);};
/** Returns {valid, errors, tier}; tier retains source decimal and identifiers verbatim. */
export function validateTier(input) {
 const errors=[]; let tier=null;
 try {
  keys(input,[...inputFields,'note'],['id','category','recipient','contact','referenceDate','currency','confirmationType']);
  tier={id:input.id,category:input.category,recipient:input.recipient,contact:input.contact,missionRef:input.missionRef??'',referenceDate:input.referenceDate,currency:input.currency,requestedAmount:input.requestedAmount??'',confirmationType:input.confirmationType,selected:input.selected??false};
  validateBase(tier); if(Object.hasOwn(input,'note')) text(input.note,'note');
 } catch(error) {errors.push(error.message);}
 return {valid:!errors.length,errors,tier:errors.length?null:tier};
}
function validateBase(t) {
 for(const f of ['id','recipient','contact']) text(t[f],f,true); text(t.missionRef,'missionRef');
 if(!CATEGORIES.includes(t.category)) fail('Catégorie tiers inconnue.');
 date(t.referenceDate,'referenceDate'); currency(t.currency); decimal(t.requestedAmount,true);
 if(!['open','closed'].includes(t.confirmationType)) fail('Confirmation ouverte (open) ou fermée (closed) requise.'); bool(t.selected,'selected');
}
/** Metadata is voluntary; blank preparer/reviewer never claims validation. */
export function createSession(metadata={}) {
 keys(metadata,['missionRef','preparer','reviewer'],[]);
 const meta={missionRef:metadata.missionRef??'',preparer:metadata.preparer??'',reviewer:metadata.reviewer??''}; for(const [k,v] of Object.entries(meta)) text(v,k);
 return {schema:'memlia.circularisation',schemaVersion:SCHEMA_VERSION,version:VERSION,createdAt:now(),updatedAt:now(),complete:true,metadata:meta,parameters:{reminderDelayDays:15,reminderAsOf:now().slice(0,10)},tiers:[]};
}
export function updateParameters(session,patch) {
 keys(patch,['reminderDelayDays','reminderAsOf'],[]);
 const parameters={...session.parameters,...patch}; validateParameters(parameters);
 return {...session,parameters,updatedAt:now()};
}
function validateParameters(p) {
 keys(p,['reminderDelayDays','reminderAsOf']);
 if(!Number.isInteger(p.reminderDelayDays)||p.reminderDelayDays<1||p.reminderDelayDays>365) fail('Délai de relance : entier entre 1 et 365 jours.');
 date(p.reminderAsOf,'date d’examen');
}
function indexOf(session,id) { const i=session.tiers.findIndex(t=>t.id===id); if(i<0) fail('Identifiant tiers introuvable.'); return i; }
function event(t,type,details) { t.history.push({sequence:t.history.length+1,at:now(),type,details:clone(details)}); }
function edited(session,id,fn) { const next={...session,tiers:[...session.tiers],updatedAt:now()}; const i=indexOf(session,id); next.tiers[i]=clone(session.tiers[i]); fn(next.tiers[i]); return next; }
function ready(session) { if(session.complete!==true) fail('Résultat incomplet : export ou traitement complet refusé.'); }
export function addTier(session,input) {
 ready(session); const result=validateTier(input); if(!result.valid) fail(result.errors.join(' '));
 if(session.tiers.some(t=>t.id===input.id)) fail('Doublon identifiant : aucune correction silencieuse.');
 if(session.tiers.length>=MAX_ROWS) fail('Limite de 100 000 tiers.');
 const tier={...result.tier,sentDate:'',status:'draft',notes:[],history:[],responses:[],letters:[]};
 if(input.note) tier.notes.push({id:1,at:now(),text:input.note}); event(tier,'created',result.tier);
 return {...session,updatedAt:now(),tiers:[...session.tiers,tier]};
}
/** Patch source fields, note (appends), sentDate or status. Historic collections cannot be overwritten. */
export function updateTier(session,id,patch) {
 ready(session); keys(patch,[...inputFields.filter(f=>f!=='id'),'note','sentDate','status'],[]);
 return edited(session,id,t=>{
  const before=Object.fromEntries([...inputFields,'sentDate','status'].map(k=>[k,t[k]]));
  for(const f of inputFields) if(Object.hasOwn(patch,f)) t[f]=patch[f]; validateBase(t);
  const invalidated=[];
  if(['requestedAmount','currency','referenceDate'].some(f=>Object.hasOwn(patch,f) && patch[f]!==before[f])) {
   for(const r of t.responses) {if(r.reconciled) invalidated.push({id:r.id,reconciledAt:r.reconciledAt}); r.comparable=false; r.reconciled=false; r.reconciledAt='';}
   if(t.status==='reconciled') t.status='received';
  }
  if(Object.hasOwn(patch,'sentDate')) {
   date(patch.sentDate,'envoi',true); if(t.sentDate && patch.sentDate!==t.sentDate) fail('Date d’envoi déjà renseignée : correction destructive refusée.');
   if(!patch.sentDate) fail('Date d’envoi vide refusée.');
   if(t.responses.some(r=>r.date<patch.sentDate)) fail('Date de réponse avant envoi.');
   t.sentDate=patch.sentDate; if(['draft','prepared','non-response'].includes(t.status)) t.status='sent';
  }
  if(Object.hasOwn(patch,'status')) {
   if(!['non-response','escalated'].includes(patch.status)) fail('État à déclarer : non-response ou escalated ; autres états par envoi, lettre, réponse ou rapprochement.');
   if(patch.status==='non-response' && (!t.sentDate || t.responses.length)) fail('Non-réponse exige envoi renseigné et absence de réponse.'); t.status=patch.status;
  }
  if(Object.hasOwn(patch,'note')) {text(patch.note,'note'); if(patch.note) t.notes.push({id:t.notes.length+1,at:now(),text:patch.note});}
  event(t,'updated',{before,patch,...(invalidated.length?{invalidated}: {})});
 });
}
export function addResponse(session,id,input) {
 ready(session); keys(input,['date','reference','amount','currency','comparable','kind','comment'],['date']);
 return edited(session,id,t=>{
  const response={id:t.responses.length+1,date:input.date,reference:input.reference??'',amount:input.amount??'',currency:input.currency??t.currency,comparable:input.comparable??false,kind:input.kind??'confirmation',comment:input.comment??'',reconciled:false,reconciledAt:''};
  validateResponse(response,t); t.responses.push(response);
  t.status=response.kind==='confirmation'?'received':response.kind; event(t,'response-added',response);
 });
}
function validateResponse(r,t) {
 keys(r,['id','date','reference','amount','currency','comparable','kind','comment','reconciled','reconciledAt']);
 if(!Number.isSafeInteger(r.id) || r.id<1) fail('Identifiant de réponse invalide.'); date(r.date,'réponse');
 if(!t.sentDate) fail('Envoi à renseigner avant la réponse.'); if(r.date<t.sentDate) fail('Date de réponse avant envoi.');
 text(r.reference,'reference'); text(r.comment,'comment'); decimal(r.amount,true); currency(r.currency); bool(r.comparable,'comparable'); bool(r.reconciled,'reconciled');
 if(!['confirmation','refusal','disagreement'].includes(r.kind)) fail('Type de réponse inconnu.');
 if(r.reconciled) {stamp(r.reconciledAt); if(r.kind!=='confirmation') fail('Seule une confirmation peut être rapprochée.');} else if(r.reconciledAt!=='') fail('Rapprochement non validé.');
}
/** Pure comparison of the latest response (or responseId). Never fabricates zero for absence. */
export function compareResponse(tier,responseId) {
 const r=responseId===undefined?tier.responses.at(-1):tier.responses.find(r=>r.id===responseId);
 const not=reason=>({evaluated:false,difference:null,reason,responseId:r?.id??null});
 if(!r) return not('Aucune réponse reçue.');
 if(r.kind!=='confirmation') return not('Refus ou désaccord : suites à décider par le CAC.');
 if(r.currency!==tier.currency) return not('Devise différente : aucune conversion.');
 if(!r.comparable) return not('Base non confirmée comparable.');
 if(!r.amount || !tier.requestedAmount) return not('Montant confirmé ou solde demandé absent.');
 return {evaluated:true,difference:compareAmounts(tier.requestedAmount,r.amount),reason:'Écart = confirmé − demandé, même devise et base déclarée comparable.',responseId:r.id};
}
export function reconcileResponse(session,id,responseId) {
 ready(session); return edited(session,id,t=>{
  const comparison=compareResponse(t,responseId); if(!comparison.evaluated) fail(comparison.reason);
  const r=t.responses.find(r=>r.id===comparison.responseId); if(r.reconciled) fail('Réponse déjà rapprochée.'); r.reconciled=true; r.reconciledAt=now();
  if(r===t.responses.at(-1)) t.status='reconciled'; event(t,'response-reconciled',{responseId:r.id,comparison});
 });
}
/** Caller must validate selection and letter; a closed letter also requires amountValidated. */
export function generateLetter(session,id,{returnContact='',validated=false,amountValidated=false}={}) {
 ready(session); let letter;
 const next=edited(session,id,t=>{
  validateBase(t); text(returnContact,'coordonnées de retour',true);
  if(!t.selected || validated!==true) fail('Sélection et lettre à valider explicitement.');
  if(t.confirmationType==='closed' && (!t.requestedAmount || amountValidated!==true)) fail('Solde de confirmation fermée à saisir et valider.');
  const body=[`À l’attention de ${t.recipient}`,t.contact,`Objet : demande de confirmation — mission ${t.missionRef || session.metadata.missionRef || 'non renseignée'}`,`Date de référence : ${t.referenceDate}`,t.confirmationType==='open'?`Veuillez indiquer le montant de votre solde à cette date et sa devise (devise de référence : ${t.currency}), ainsi que toute précision sur la base retenue.`:`Veuillez confirmer le solde de ${t.requestedAmount} ${t.currency} à cette date, ou indiquer votre désaccord et le montant selon vos informations.`,`Merci de transmettre votre réponse directement aux coordonnées suivantes : ${returnContact}.`,'Cette demande originale est préparée pour validation par le CAC. L’envoi et la maîtrise de la réception restent à sa charge.'].join('\n\n');
  text(body,'lettre',true);
  letter={version:t.letters.length+1,generatedAt:now(),confirmationType:t.confirmationType,returnContact,validated:true,amountValidated:t.confirmationType==='closed',text:body};
  t.letters.push(letter); if(t.status==='draft' || t.status==='prepared') t.status='prepared'; event(t,'letter-prepared',{version:letter.version});
 }); return {session:next,letter:clone(letter)};
}
/** delayDays: integer 1..365. Proposal only, latest response of any kind suspends. */
export function reminderEligible(tier,{asOf=new Date().toISOString().slice(0,10),delayDays=15}={}) {
 date(asOf,'date de relance'); if(!Number.isInteger(delayDays) || delayDays<1 || delayDays>365) fail('Délai de relance : entier entre 1 et 365 jours.');
 const not=reason=>({eligible:false,reason,dueDate:null});
 if(!tier.sentDate) return not('Envoi non renseigné.');
 if(tier.responses.length || ['refusal','disagreement','received','reconciled','escalated'].includes(tier.status)) return not('Réponse ou suite au CAC : relance suspendue.');
 date(tier.sentDate,'envoi'); const dueDate=new Date(Date.parse(tier.sentDate+'T00:00:00Z')+delayDays*86400000).toISOString().slice(0,10);
 return {eligible:asOf>=dueDate,reason:asOf>=dueDate?'Relance proposée uniquement ; aucun envoi réalisé.':'Délai choisi non atteint.',dueDate};
}
function checkArray(a,label) {if(!Array.isArray(a) || a.length>MAX_ROWS) fail(`Liste ${label} invalide ou supérieure à 100 000 éléments.`);}
function validateSession(s) {
 keys(s,['schema','schemaVersion','version','createdAt','updatedAt','complete','metadata','parameters','tiers']);
 validateParameters(s.parameters);
 if(s.schema!=='memlia.circularisation' || s.schemaVersion!==SCHEMA_VERSION || s.version!==VERSION) fail('Version ou format JSON non pris en charge.'); ready(s); stamp(s.createdAt); stamp(s.updatedAt);
 keys(s.metadata,['missionRef','preparer','reviewer']); for(const [k,v] of Object.entries(s.metadata)) text(v,k);
 checkArray(s.tiers,'tiers'); const ids=new Set();
 for(const t of s.tiers) {
  keys(t,tierFields); validateBase(t); if(ids.has(t.id)) fail('Doublon identifiant dans la reprise.'); ids.add(t.id);
  date(t.sentDate,'envoi',true); if(!STATUSES.includes(t.status)) fail('État inconnu.');
  for(const field of ['notes','history','responses','letters']) checkArray(t[field],field);
  for(const [i,n] of t.notes.entries()) {keys(n,['id','at','text']); if(n.id!==i+1) fail('Identifiant note invalide.'); stamp(n.at); text(n.text,'note');}
  for(const [i,r] of t.responses.entries()) {validateResponse(r,t); if(r.id!==i+1) fail('Identifiant réponse invalide.');}
  for(const [i,l] of t.letters.entries()) {
   keys(l,['version','generatedAt','confirmationType','returnContact','validated','amountValidated','text']);
   if(l.version!==i+1 || !['open','closed'].includes(l.confirmationType) || l.validated!==true || l.amountValidated!==(l.confirmationType==='closed')) fail('Version ou validation de lettre invalide.');
   stamp(l.generatedAt); text(l.returnContact,'retour',true); text(l.text,'lettre',true);
  }
  for(const [i,h] of t.history.entries()) {
   keys(h,['sequence','at','type','details']); if(h.sequence!==i+1) fail('Séquence historique invalide.'); stamp(h.at);
   if(!['created','updated','response-added','response-reconciled','letter-prepared'].includes(h.type) || !object(h.details)) fail('Événement historique invalide.');
   if(h.type==='created') {keys(h.details,inputFields); validateBase(h.details);}
   if(h.type==='updated') {
    keys(h.details,['before','patch','invalidated'],['before','patch']);
    keys(h.details.before,[...inputFields,'sentDate','status']); validateBase(h.details.before); date(h.details.before.sentDate,'envoi',true); if(!STATUSES.includes(h.details.before.status)) fail('État historique invalide.');
    keys(h.details.patch,[...inputFields.filter(f=>f!=='id'),'note','sentDate','status'],[]);
    const patched={...h.details.before,...h.details.patch}; validateBase(patched);
    if(Object.hasOwn(h.details.patch,'note')) text(h.details.patch.note,'note historique');
    if(Object.hasOwn(h.details.patch,'sentDate')) date(h.details.patch.sentDate,'envoi historique');
    if(Object.hasOwn(h.details.patch,'status') && !['non-response','escalated'].includes(h.details.patch.status)) fail('État historique déclaré invalide.');
    if(h.details.invalidated) {checkArray(h.details.invalidated,'rapprochements invalidés'); for(const r of h.details.invalidated) {keys(r,['id','reconciledAt']); stamp(r.reconciledAt); if(!t.responses.some(x=>x.id===r.id)) fail('Réponse invalidée introuvable.');}}
   }
   if(h.type==='response-added') validateResponse(h.details,t);
   if(h.type==='letter-prepared') {keys(h.details,['version']); if(!Number.isInteger(h.details.version) || h.details.version<1 || h.details.version>t.letters.length) fail('Référence lettre invalide.');}
   if(h.type==='response-reconciled') {keys(h.details,['responseId','comparison']); keys(h.details.comparison,['evaluated','difference','reason','responseId']); if(!t.responses.some(r=>r.id===h.details.responseId) || h.details.comparison.evaluated!==true) fail('Référence rapprochement invalide.'); decimal(h.details.comparison.difference); text(h.details.comparison.reason,'motif');}
  }
  if(!t.history.length || t.history[0].type!=='created') fail('Historique initial manquant.');
  const latest=t.responses.at(-1);
  if(['sent','received','reconciled','non-response','refusal','disagreement'].includes(t.status) && !t.sentDate) fail('État sans envoi renseigné.');
  if(t.status==='draft' && (t.letters.length || t.sentDate || latest)) fail('État brouillon incohérent.');
  if(t.status==='prepared' && (!t.letters.length || t.sentDate || latest)) fail('État préparé incohérent.');
  if(['sent','non-response'].includes(t.status) && latest) fail('État sans réponse incohérent.');
  if(t.status==='received' && (!latest || latest.kind!=='confirmation' || latest.reconciled)) fail('État reçu incohérent.');
  if(t.status==='reconciled' && (!latest?.reconciled || !compareResponse(t).evaluated)) fail('État rapproché incohérent.');
  if(['refusal','disagreement'].includes(t.status) && latest?.kind!==t.status) fail('État refus/désaccord incohérent.');
 }
 return s;
}
export function exportSession(session) {validateSession(session); return JSON.stringify({...session,dossier:dossierMetadata(session)},null,2);}
/** Lossless versioned parts: every downloaded JSON stays below the file limit,
 * independently of the number/size of notes and historic letter versions. */
export function exportSessionFiles(session) {
 const json=exportSession(session);
 if(new TextEncoder().encode(json).byteLength<=MAX_BYTES) return [{name:'suivi-circularisation.json',text:json}];
 const bundleId=crypto.randomUUID(), chunks=[];
 for(let offset=0;offset<json.length;) {
  let length=Math.min(8_000_000,json.length-offset), data;
  do {data=json.slice(offset,offset+length); if(new TextEncoder().encode(JSON.stringify({data})).byteLength<=MAX_BYTES-1024) break; length=Math.floor(length/2);} while(length);
  chunks.push(data); offset+=length;
 }
 return chunks.map((data,index)=>({name:`suivi-circularisation-${bundleId}-partie-${index+1}-sur-${chunks.length}.json`,text:JSON.stringify({schema:'memlia.circularisation.parts',schemaVersion:1,bundleId,index,total:chunks.length,data})}));
}
export function importSessionFiles(files,options={}) {
 if(!Array.isArray(files)||!files.length) fail('Choisissez toutes les parties JSON.');
 files.forEach(textSize);
 if(files.length===1 && JSON.parse(files[0])?.schema!=='memlia.circularisation.parts') return importSession(files[0],options);
 const parts=files.map(json=>{rejectDuplicateKeys(json); const part=JSON.parse(json); keys(part,['schema','schemaVersion','bundleId','index','total','data']);
  if(part.schema!=='memlia.circularisation.parts'||part.schemaVersion!==1||typeof part.bundleId!=='string'||!part.bundleId||!Number.isSafeInteger(part.index)||!Number.isSafeInteger(part.total)||part.total<1||part.index<0||part.index>=part.total||typeof part.data!=='string') fail('Partie JSON invalide.'); return part;});
 const first=parts[0];
 if(parts.length!==first.total) fail('Sauvegarde incomplète : choisissez toutes les parties JSON.');
 if(parts.some(p=>p.bundleId!==first.bundleId||p.total!==first.total)||new Set(parts.map(p=>p.index)).size!==parts.length) fail('Parties mélangées ou dupliquées.');
 return parseSession(parts.sort((a,b)=>a.index-b.index).map(p=>p.data).join(''),options);
}
/** Reject duplicate object keys before JSON.parse can silently discard an earlier value. */
function rejectDuplicateKeys(json) {
 const stack=[]; const tokens=/"(?:[^"\\]|\\.)*"|[{}\[\]:,]/g; let match;
 while((match=tokens.exec(json))) {
  const token=match[0], top=stack.at(-1);
  if(token==='{') stack.push({object:true,expectKey:true,keys:new Set()});
  else if(token==='[') stack.push({object:false});
  else if(token==='}' || token===']') stack.pop();
  else if(token===',' && top?.object) top.expectKey=true;
  else if(token===':' && top?.object) top.expectKey=false;
  else if(token.startsWith('"') && top?.object && top.expectKey) {const key=JSON.parse(token); if(top.keys.has(key)) fail('Clé JSON dupliquée : aucun écrasement silencieux.'); top.keys.add(key); top.expectKey=false;}
  if(stack.length>64) fail('JSON trop profondément imbriqué.');
 }
}
/** No implicit merge. Passing current always requires replaceConfirmed:true. */
export function importSession(json,{current=null,replaceConfirmed=false}={}) {
 textSize(json); return parseSession(json,{current,replaceConfirmed});
}
function parseSession(json,{current=null,replaceConfirmed=false}={}) {
 if(current!==null && replaceConfirmed!==true) fail('Confirmez le remplacement de la session avant reprise.'); rejectDuplicateKeys(json);
 let parsed; try {parsed=JSON.parse(json,(key,value)=>{if(['__proto__','constructor','prototype'].includes(key)) fail('Clé JSON interdite.'); return value;});} catch(error) {fail('JSON invalide : '+error.message);}
 if(Object.hasOwn(parsed,'dossier')) {
  keys(parsed.dossier,['method','version','generatedAt','controls','limits','parameters','missionRef','preparer','reviewer']);
  stamp(parsed.dossier.generatedAt);
  const expected=dossierMetadata(parsed);
  for(const field of Object.keys(expected)) if(field!=='generatedAt' && JSON.stringify(parsed.dossier[field])!==JSON.stringify(expected[field])) fail('Métadonnées du dossier incohérentes.');
  delete parsed.dossier;
 }
 return clone(validateSession(parsed));
}
export function resetSession(session,{confirmed=false}={}) {if(confirmed!==true) fail('Confirmez l’effacement explicite.'); return createSession(session.metadata);}
function dossierMetadata(s) {return {method:METHOD,version:VERSION,generatedAt:now(),controls:CHECKS,limits:LIMITS,parameters:{...s.parameters,maxBytes:MAX_BYTES,maxRows:MAX_ROWS,sign:'confirmé − demandé',currencyConversion:false},...s.metadata};}
/** Complete audit trail, including all notes, letters, response versions and history as text JSON cells. */
export function exportCsv(session) {
 validateSession(session); const meta=dossierMetadata(session);
 const headers=['recordType','id','category','recipient','contact','missionRef','referenceDate','currency','requestedAmount','confirmationType','selected','sentDate','status','difference','comparisonReason','notes','letters','responses','history','metadata'];
 const rows=[headers,['metadata',...Array(18).fill(''),JSON.stringify(meta)]];
 for(const t of session.tiers) {const comparison=compareResponse(t); rows.push(['tier',...inputFields.map(f=>t[f]),t.sentDate,t.status,comparison.difference??'',comparison.reason,JSON.stringify(t.notes),JSON.stringify(t.letters),JSON.stringify(t.responses),JSON.stringify(t.history),'']);
  // Separate source cells make formula neutralisation explicit, even for historic free text.
  for(const n of t.notes) rows.push(['note',t.id,...Array(13).fill(''),n.text,'','','',JSON.stringify({id:n.id,at:n.at})]);
  for(const r of t.responses) rows.push(['response',t.id,...Array(15).fill(''),r.comment,'',JSON.stringify(r)]);
  for(const l of t.letters) rows.push(['letter',t.id,...Array(14).fill(''),l.text,'','',JSON.stringify({version:l.version,generatedAt:l.generatedAt})]);
 }
 return serializeCsv(rows);
}
const escape = value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function printReport(session) {
 validateSession(session); const meta=dossierMetadata(session);
 const sections=session.tiers.map(t=>{const c=compareResponse(t); return `<section><h2>${escape(t.id)} — ${escape(t.recipient)}</h2><p>État : ${escape(t.status)} ; écart : ${escape(c.difference??'Non évalué')} ${escape(c.evaluated?t.currency:'')} — ${escape(c.reason)}</p>${t.letters.map(l=>`<article><h3>Lettre préparée — version ${l.version}</h3><pre>${escape(l.text)}</pre></article>`).join('')}<h3>Entrées et journal conservés</h3><pre>${escape(JSON.stringify(t,null,2))}</pre></section>`;}).join('');
 return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Suivi de circularisation</title><style>body{font:16px sans-serif;max-width:75rem;margin:auto;padding:2rem}pre{white-space:pre-wrap;overflow-wrap:anywhere}section{break-inside:avoid}@media print{body{padding:0}}</style></head><body data-generated-at="${escape(meta.generatedAt)}"><h1>Suivi de circularisation — rapport de préparation</h1><p>Mission : ${escape(meta.missionRef||'Non renseignée')}</p><p>Généré le ${escape(meta.generatedAt)} — version ${escape(VERSION)}</p><p>Préparateur (saisie volontaire) : ${escape(meta.preparer||'Non renseigné')} ; Réviseur (saisie volontaire) : ${escape(meta.reviewer||'Non renseigné')}. Ces mentions n’attestent aucune validation.</p><h2>Méthode</h2><p>${escape(METHOD)}</p><h2>Paramètres et contrôles exécutés</h2><pre>${escape(JSON.stringify({parameters:meta.parameters,controls:CHECKS},null,2))}</pre><h2>Limites</h2><p>${escape(LIMITS)}</p>${sections}<h2>Fiche outil et jeux de tests</h2><p>Confirmation 120 pour 100 : +20 ; absence de réponse : non évaluée ; lettre ouverte sans solde ; lettre fermée avec validation ; refus et désaccord suspendent la relance ; devise différente sans conversion ; doublons et chronologie refusés ; reprise versionnée ; cellules CSV neutralisées et HTML échappé. Contrôles techniques, non appréciation professionnelle.</p></body></html>`;
}
function textSize(value) {if(typeof value!=='string') fail('Texte de fichier attendu.'); if(new TextEncoder().encode(value).byteLength>MAX_BYTES) fail('Fichier supérieur à 20 Mo (20 000 000 octets).');}
/** Explicit separators only. Parser reused from pseudonymisation (strict quotes, 128 columns, 100000 records). */
export function parseCsv(text,{delimiter}={}) {textSize(text); if(![',',';','\t'].includes(delimiter)) fail('Choisissez explicitement virgule, point-virgule ou tabulation.'); return {...parseDelimited(text,delimiter),complete:true};}
export function decodeCsv(bytes,{encoding='utf-8',delimiter}={}) {if(bytes.byteLength>MAX_BYTES) fail('Fichier supérieur à 20 Mo.'); return parseCsv(decodeFile(bytes,encoding),{delimiter});}
function mappedRows(parsed,{mapping={},defaults={}}={}) {
 if(parsed.complete!==true) fail('Import arrêté/incomplet : aucun traitement complet.');
 checkArray(parsed.rows,'lignes CSV'); keys(mapping,[...inputFields,'note'],[]); keys(defaults,[...inputFields,'note'],[]);
 for(const [field,header] of Object.entries(mapping)) if(typeof header!=='string' || !parsed.headers.includes(header)) fail(`Mapping invalide pour ${field}.`);
 if(Object.keys(mapping).length===0) fail('Mapping requis.');
 return parsed.rows.map(row=>{const input={...defaults}; for(const [field,header] of Object.entries(mapping)) input[field]=row[parsed.headers.indexOf(header)];
 if(typeof input.selected==='string') {if(!['true','false'].includes(input.selected)) return {valid:false,errors:['selected : true ou false attendu.'],tier:null}; input.selected=input.selected==='true';}
 const result=validateTier(input); return {...result,input};});
}
/** Preview validates all records but returns a bounded display slice, not a truncated export. */
export function previewCsv(parsed,{mapping={},defaults={},offset=0,limit=20}={}) {
 if(!Number.isInteger(offset) || offset<0 || !Number.isInteger(limit) || limit<1 || limit>1000) fail('Pagination aperçu invalide.');
 const rows=mappedRows(parsed,{mapping,defaults}); const ids=new Set(); let invalid=0;
 for(const row of rows) {if(row.valid) {if(ids.has(row.tier.id)) {row.valid=false; row.errors=['Doublon identifiant.'];} ids.add(row.tier.id);} if(!row.valid) invalid++;}
 return {complete:true,total:rows.length,invalid,offset,rows:rows.slice(offset,offset+limit).map((r,i)=>({...r,rowIndex:offset+i}))};
}
/** selectedRows uses zero-based CSV data record indexes; validation is explicit and atomic. */
export function importCsv(session,parsed,{mapping={},defaults={},selectedRows,selectionValidated=false}={}) {
 ready(session); if(selectionValidated!==true || !Array.isArray(selectedRows) || !selectedRows.length) fail('Sélection à valider explicitement avant import.');
 const rows=mappedRows(parsed,{mapping,defaults}); const seen=new Set(session.tiers.map(t=>t.id)); const indices=new Set(); const tiers=[];
 for(const index of selectedRows) {
  if(!Number.isInteger(index) || index<0 || index>=rows.length || indices.has(index)) fail('Sélection de lignes invalide ou dupliquée.'); indices.add(index);
  const row=rows[index]; if(!row.valid) fail(`Ligne ${index+2} : ${row.errors.join(' ')}`); if(seen.has(row.tier.id)) fail('Doublon identifiant : aucun écrasement.'); seen.add(row.tier.id);
  tiers.push(row.input);
 }
 if(session.tiers.length+tiers.length>MAX_ROWS) fail('Limite de 100 000 tiers.');
 // Avoid O(n²) immutable inserts on large imports; each fresh tier is built independently.
 const added=tiers.map(input=>addTier(createSession(session.metadata),{...input,selected:true}).tiers[0]);
 return {...session,updatedAt:now(),tiers:[...session.tiers,...added]};
}
export function demoSession() {
 let s=createSession({missionRef:'DÉMO FICTIVE'});
 for(const [id,recipient] of [['001','Client fictif A'],['002','Fournisseur fictif B'],['003','Banque fictive C']]) {
  s=addTier(s,{id,category:id==='002'?'fournisseur':id==='003'?'banque':'client',recipient,contact:'Adresse fictive',missionRef:'DÉMO FICTIVE',referenceDate:'2026-01-01',currency:'EUR',requestedAmount:'100',confirmationType:'closed',selected:true,note:'Exemple fictif — aucune donnée réelle.'});
  s=generateLetter(s,id,{returnContact:'Cabinet fictif — adresse de retour à remplacer',validated:true,amountValidated:true}).session;
  s=updateTier(s,id,{sentDate:'2026-01-10'});
 }
 s=addResponse(s,'001',{date:'2026-01-11',reference:'RET-FICTIF-1',amount:'120',currency:'EUR',comparable:true,comment:'Retour fictif non encore rapproché.'});
 s=addResponse(s,'003',{date:'2026-01-12',kind:'refusal',comment:'Refus fictif : suites au CAC.'}); return s;
}
