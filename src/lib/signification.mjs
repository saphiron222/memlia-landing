/** Local-only arithmetic. Source strings are preserved; amounts use BigInt fractions,
 * rounded half-up to cents only for presentation, never before the planning calculation. */
import {parseDelimited,serializeCsv,decodeFile} from './pseudonymisation.mjs';
export const VERSION='signification-1';
export const MAX_BYTES=20_000_000;
export const MAX_ROWS=100_000;
export const INPUT_FIELDS=['id','name','baseName','base','rate','period','reference','justification','planningMode','planning'];
export const LABELS=['Identifiant','Scénario','Base nommée','Montant de base EUR','Taux de signification %','Période','Source de la base','Justification','Mode de planification','Valeur de planification'];
export const METHOD='Signification = base × taux / 100. Planification au taux = seuil exact × taux choisi / 100, ou montant direct. Décimaux exacts ; restitution au centime, demi-centime arrondi vers le haut. Aucune fourchette de taux métier.';
export const LIMITS='Calcul sur vos paramètres, pas appréciation du caractère significatif ni avis d’audit. Choix de la base, des taux, de la justification et des suites réservés au CAC. Aucune sauvegarde automatique ; conservez le JSON avant fermeture.';
export const CHECKS=['Base strictement positive','Taux saisi > 0 et ≤ 100 (borne arithmétique)','Planification positive et ≤ seuil exact','Choix et justification explicites','Décimaux et arrondi final','Version, structure, unicité et état de reprise','Neutralisation CSV et échappement HTML'];
const fail=message=>{throw new Error(message);};
const now=()=>new Date().toISOString();
const bytes=s=>new TextEncoder().encode(s).length;
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function keys(x,allowed){if(!object(x)||Object.keys(x).length!==allowed.length||allowed.some(k=>!Object.hasOwn(x,k)))fail('Structure ou champ inconnu / manquant.');}
function text(x,field){if(typeof x!=='string'||x.length>65_536||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(x))fail(`Champ ${field} : texte requis, 65 536 caractères maximum.`);return x;}
function stamp(x){if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(x)||!Number.isFinite(Date.parse(x))||new Date(x).toISOString()!==x)fail('Horodatage invalide.');}
function fraction(value,field){
 if(typeof value!=='string'||value.length>256||!/^\+?\d+(?:[.,]\d+)?$/.test(value))fail(`${field} : décimal positif sans séparateur de milliers ni exposant, 256 caractères maximum.`);
 const [whole,dec='']=value.replace(',','.').replace(/^\+/,'').split('.');return {n:BigInt(whole+dec),d:10n**BigInt(dec.length)};
}
const multiply=(a,b)=>({n:a.n*b.n,d:a.d*b.d*100n});
const greater=(a,b)=>a.n*b.d>b.n*a.d;
function positive(v,f,rate=false){const x=fraction(v,f);if(x.n<=0n||rate&&x.n>100n*x.d)fail(`${f} : ${rate?'taux > 0 et ≤ 100 requis (validation arithmétique, pas recommandation métier)':'base ou montant strictement positif requis'}.`);return x;}
function cents(x){const c=(x.n*100n*2n+x.d)/(2n*x.d);return `${c/100n}.${String(c%100n).padStart(2,'0')}`;}
export function emptyScenario(){return Object.fromEntries(INPUT_FIELDS.map(k=>[k,k==='planningMode'?'none':'']));}
function validateInputs(x){keys(x,INPUT_FIELDS);for(const k of INPUT_FIELDS)text(x[k],k);if(!x.id.trim())fail('Identifiant non vide requis.');if(!['none','rate','amount'].includes(x.planningMode))fail('Mode de planification inconnu.');}
export function calculate(s){
 const errors=[];let sig=null,plan=null;
 let b=null,r=null;
 try {b=positive(s.base,'Base');}catch(e){errors.push(e.message);}
 try {r=positive(s.rate,'Signification',true);}catch(e){errors.push(e.message);}
 if(b&&r)sig=multiply(b,r);
 if(!['none','rate','amount'].includes(s.planningMode))errors.push('Choisissez un mode de planification.');
 else if(s.planningMode!=='none')try{const p=positive(s.planning,'Planification',s.planningMode==='rate');if(sig){plan=s.planningMode==='rate'?multiply(sig,p):p;if(greater(plan,sig))fail('Planification supérieure au seuil exact de signification : incohérence à résoudre.');}}catch(e){errors.push(e.message);}
 return {signification:sig?cents(sig):null,planning:plan?cents(plan):null,errors};
}
const inputs=s=>Object.fromEntries(INPUT_FIELDS.map(k=>[k,s[k]]));
const snapshot=s=>JSON.stringify(inputs(s));
function validateMeta(m){keys(m,['missionRef','preparer','reviewer']);for(const k of Object.keys(m))text(m[k],k);}
export function createSession(){return {schema:'memlia.signification',schemaVersion:1,version:VERSION,createdAt:now(),updatedAt:now(),complete:true,metadata:{missionRef:'',preparer:'',reviewer:''},retainedId:'',scenarios:[]};}
export function updateMetadata(s,m){validateMeta(m);return {...s,metadata:{...m},updatedAt:now()};}
function ready(s){if(s.complete!==true)fail('Résultat incomplet : export ou traitement complet refusé.');}
export function addScenario(s,input){return appendImport(s,[input]);}
export function appendImport(s,rows){
 ready(s);if(!Array.isArray(rows)||s.scenarios.length+rows.length>MAX_ROWS)fail('100 000 scénarios maximum.');
 const seen=new Set(s.scenarios.map(x=>x.id));const added=[];
 for(const r of rows){validateInputs(r);if(seen.has(r.id))fail('Doublon identifiant : aucune saisie écrasée.');seen.add(r.id);added.push({...r,validatedInputs:'',validatedAt:'',changedSinceValidation:false});}
 return {...s,updatedAt:now(),scenarios:[...s.scenarios,...added]};
}
export function updateScenario(s,id,patch){
 ready(s);const i=s.scenarios.findIndex(x=>x.id===id);if(i<0)fail('Identifiant introuvable.');
 if(!object(patch)||Object.keys(patch).some(k=>!INPUT_FIELDS.includes(k)||k==='id'))fail('Champ de correction inconnu.');
 const old=s.scenarios[i],updated={...old,...patch};validateInputs(inputs(updated));
 const changed=snapshot(old)!==snapshot(updated);if(changed&&old.validatedInputs){updated.changedSinceValidation=old.validatedInputs!==snapshot(updated);}
 const scenarios=[...s.scenarios];scenarios[i]=updated;
 return {...s,scenarios,retainedId:changed&&s.retainedId===id?'':s.retainedId,updatedAt:now()};
}
function retainable(s){const c=calculate(s);if(c.errors.length)fail(c.errors.join(' '));for(const k of ['name','baseName','period','reference','justification'])if(!s[k].trim())fail(`Choix pour dossier : ${k==='justification'?'justification':k} à compléter.`);}
export function retainScenario(s,id){
 ready(s);const i=s.scenarios.findIndex(x=>x.id===id);if(i<0)fail('Identifiant introuvable.');retainable(s.scenarios[i]);
 const scenarios=[...s.scenarios],r={...scenarios[i]};r.validatedInputs=snapshot(r);r.validatedAt=now();r.changedSinceValidation=false;scenarios[i]=r;
 return {...s,scenarios,retainedId:id,updatedAt:now()};
}
export function dossierState(s){const r=s.scenarios.find(x=>x.id===s.retainedId);return r&&r.validatedInputs===snapshot(r)&&!r.changedSinceValidation&&calculate(r).errors.length===0?'CHOIX UTILISATEUR':'BROUILLON';}
export function comparability(scenarios){if(scenarios.length<2)return 'Un seul scénario : comparaison à compléter';const first=scenarios[0];return scenarios.every(s=>s.baseName===first.baseName&&s.base===first.base&&s.period===first.period&&s.reference===first.reference)?'Même base, période et référence':'Bases, périodes ou références différentes : comparaison à apprécier par le CAC';}
function validateSession(s){
 keys(s,['schema','schemaVersion','version','createdAt','updatedAt','complete','metadata','retainedId','scenarios']);
 if(s.schema!=='memlia.signification'||s.schemaVersion!==1||s.version!==VERSION)fail('Format ou version de reprise inconnu.');ready(s);stamp(s.createdAt);stamp(s.updatedAt);validateMeta(s.metadata);text(s.retainedId,'retainedId');
 if(!Array.isArray(s.scenarios)||s.scenarios.length>MAX_ROWS)fail('100 000 scénarios maximum.');const seen=new Set();
 for(const r of s.scenarios){keys(r,[...INPUT_FIELDS,'validatedInputs','validatedAt','changedSinceValidation']);validateInputs(inputs(r));if(seen.has(r.id))fail('Doublon identifiant.');seen.add(r.id);if(typeof r.changedSinceValidation!=='boolean')fail('État de validation invalide.');
  if(typeof r.validatedInputs!=='string'||r.validatedInputs.length>700_000)fail('Saisie de validation invalide.');text(r.validatedAt,'validatedAt');
  if(r.validatedInputs){stamp(r.validatedAt);const former=JSON.parse(r.validatedInputs);validateInputs(former);if(former.id!==r.id)fail('Identifiant de validation incohérent.');retainable(former);if(r.changedSinceValidation!== (r.validatedInputs!==snapshot(r)))fail('Validation incohérente après modification.');}
  else if(r.validatedAt||r.changedSinceValidation)fail('Validation sans saisie validée.');
 }
 if(s.retainedId){const r=s.scenarios.find(x=>x.id===s.retainedId);if(!r||!r.validatedInputs||r.changedSinceValidation||r.validatedInputs!==snapshot(r))fail('Validation du scénario retenu incohérente.');retainable(r);}
 return s;
}
export function exportJson(s){ready(s);return JSON.stringify(s,null,2);}
export function importSession(raw){if(typeof raw!=='string'||bytes(raw)>MAX_BYTES)fail('JSON supérieur à 20 Mo : reprise refusée.');return validateSession(JSON.parse(raw));}
/** Parts retain raw source strings; a one-session token prevents accidental mixing.
 * A token is an association identifier, not a signature or proof of professional validation. */
export function exportParts(s,max=MAX_BYTES){
 ready(s);const raw=exportJson(s);if(bytes(raw)<=max)return [{filename:'seuil-signification-reprise.json',content:raw}];
 if(max<1000||max>MAX_BYTES)fail('Taille de partie invalide.');
 const group=globalThis.crypto.randomUUID(),chunks=[];let chunk='',size=0;const budget=Math.floor((max-400)/6);
 for(const char of raw){const n=bytes(char);if(size+n>budget){chunks.push(chunk);chunk='';size=0;}chunk+=char;size+=n;}if(chunk)chunks.push(chunk);
 return chunks.map((content,i)=>({filename:`seuil-signification-partie-${i+1}-sur-${chunks.length}.json`,content:JSON.stringify({schema:'memlia.signification.part',version:1,group,index:i,total:chunks.length,content})}));
}
export function importParts(raws){
 if(!Array.isArray(raws)||!raws.length)fail('Sélectionnez la sauvegarde complète.');
 if(raws.some(r=>typeof r!=='string'||bytes(r)>MAX_BYTES))fail('JSON supérieur à 20 Mo : reprise refusée.');
 const objects=raws.map(r=>JSON.parse(r));if(objects.length===1&&objects[0].schema==='memlia.signification')return validateSession(objects[0]);
 const first=objects[0];const seen=new Set();for(const p of objects){keys(p,['schema','version','group','index','total','content']);if(p.schema!=='memlia.signification.part'||p.version!==1||typeof p.group!=='string'||!p.group||p.group!==first.group||p.total!==objects.length||!Number.isInteger(p.index)||p.index<0||p.index>=p.total||seen.has(p.index)||typeof p.content!=='string')fail('Parties manquantes, mélangées ou incohérentes.');seen.add(p.index);}
 return validateSession(JSON.parse(objects.sort((a,b)=>a.index-b.index).map(p=>p.content).join('')));
}
export function parseImport(raw,delimiter){if(typeof raw!=='string'||bytes(raw)>MAX_BYTES)fail('CSV supérieur à 20 Mo.');if(![';',',','\t'].includes(delimiter))fail('Séparateur explicite requis.');return parseDelimited(raw,delimiter);}
export function readCsvBytes(buffer,delimiter){if(buffer.byteLength>MAX_BYTES)fail('CSV supérieur à 20 Mo.');return parseImport(decodeFile(new Uint8Array(buffer),'utf-8'),delimiter);}
export function mapImport(data,mapping){
 keys(mapping,INPUT_FIELDS);const indices=Object.values(mapping);if(new Set(indices).size!==indices.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=data.headers.length))fail('Associez dix colonnes distinctes à tous les champs.');
 return data.rows.map(row=>{const r=Object.fromEntries(INPUT_FIELDS.map(k=>[k,row[mapping[k]]]));validateInputs(r);return r;});
}
function exportRows(s){ready(s);const at=now(),state=dossierState(s);return s.scenarios.map(r=>{const c=calculate(r);return [...INPUT_FIELDS.map(k=>r[k]),c.signification??'',c.planning??'',s.retainedId===r.id?'RETENU':'NON RETENU',state,r.changedSinceValidation?'Entrées modifiées depuis validation':'',c.errors.join(' '),VERSION,at,s.metadata.missionRef,s.metadata.preparer,s.metadata.reviewer,METHOD,LIMITS,CHECKS.join(' ; ')];});}
export function exportCsv(s){return serializeCsv([[...LABELS,'Signification EUR','Planification EUR','Choix','État dossier','Révision requise','Erreurs', 'Version','Généré le','Mission','Préparateur','Réviseur','Méthode','Limites','Contrôles'],...exportRows(s)]);}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function exportReport(s,final=false){
 ready(s);if(final){for(const r of s.scenarios){const c=calculate(r);if(c.errors.length)fail(c.errors.join(' '));}if(dossierState(s)!=='CHOIX UTILISATEUR')fail('Dossier brouillon : justification et choix explicites requis.');}
 const state=dossierState(s);return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Seuils d’audit — ${esc(state)}</title><style>body{font:16px system-ui;max-width:80ch;margin:3rem auto;padding:1rem}section{break-inside:avoid;border-top:1px solid;padding:1rem 0}dt{font-weight:bold}dd{margin:0 0 1rem;white-space:pre-wrap;overflow-wrap:anywhere}@media print{body{margin:0}}</style></head><body><h1>Seuils d’audit — ${esc(state)}</h1><p>Version ${VERSION} · génération ${now()}</p><p>${esc(comparability(s.scenarios))}</p><dl>${Object.entries(s.metadata).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v||'Non renseigné')}</dd>`).join('')}</dl><p>Les mentions d’intervenants n’attestent aucune revue. Le choix est une déclaration utilisateur reprise du dossier, pas une certification.</p>${s.scenarios.map(r=>{const c=calculate(r);return `<section><h2>${esc(r.id)} · ${esc(r.name)} — ${s.retainedId===r.id?'RETENU':'NON RETENU'}</h2><dl>${INPUT_FIELDS.map((k,i)=>`<dt>${LABELS[i]}</dt><dd>${esc(r[k]||'Non renseigné')}</dd>`).join('')}<dt>Signification EUR</dt><dd>${esc(c.signification??'Non calculée')}</dd><dt>Planification EUR</dt><dd>${esc(c.planning??'Non calculée')}</dd><dt>Contrôles arithmétiques</dt><dd>${esc(c.errors.join(' ')||'Passés')}</dd><dt>Validation déclarée</dt><dd>${esc(r.validatedAt||'Absente')}${r.changedSinceValidation?' — Entrées modifiées depuis validation':''}</dd></dl></section>`;}).join('')}<section><h2>Fiche outil : méthode, limites et essais</h2><p>${esc(METHOD)}</p><p>${esc(LIMITS)}</p><ul>${CHECKS.map(c=>`<li>${esc(c)}</li>`).join('')}</ul><p>Essais fictifs : 1 000 000 × 1 % = 10 000 EUR ; planification à 70 % = 7 000 EUR. 1 234,56 × 1,25 % = 15,43 EUR. Base nulle, taux vide et planification supérieure au seuil : refus. Ces taux sont des données d’essai, jamais des recommandations.</p><p>Le téléchargement ne vaut pas appréciation de cet outil par le CAC. CSV pour consultation, JSON versionné pour reprise locale ; les fichiers téléchargés restent sous votre responsabilité.</p></section></body></html>`;
}
export function demoSession(){let s=createSession();const base={id:'001',name:'Scénario A',baseName:'Chiffre d’affaires',base:'1000000',rate:'1',period:'2026',reference:'Balance fictive A',justification:'Paramètres fictifs choisis pour vérifier le calcul, sans recommandation de taux.',planningMode:'rate',planning:'70'};s=addScenario(s,base);return addScenario(s,{...base,id:'002',name:'Scénario B',rate:'1.25',planning:'60'});}
