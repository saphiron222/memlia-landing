import {parseDelimited, decodeFile, serializeCsv, needsNeutralization} from './pseudonymisation.mjs';
export const VERSION=1, MAX_ITEMS=100, MAX_BYTES=1_000_000;
export const STATES={received:'Reçu',missing:'Manquant',na:'Non applicable',unknown:'À clarifier'};
export const FAMILIES={achats:'Achats',ventes:'Ventes',banque:'Banque',immobilisations:'Immobilisations',social:'Social',libre:'Libre'};
const TEMPLATES={achats:'Factures d’achat',ventes:'Factures de vente',banque:'Relevé bancaire de période',immobilisations:'Justificatif d’acquisition',social:'Récapitulatif de paie'};
const fail=msg=>{throw new Error(msg);};
const keys=(o,list)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).sort().join('|')!==[...list].sort().join('|'))fail('Structure inattendue : reprise refusée, saisie conservée.');};
const text=(v,max,required=false)=>{if(typeof v!=='string'||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v)||required&&!v.trim())fail('Texte absent, illisible ou trop long (libellé : 300 ; note : 2 000 caractères).');};
export function createSession(){return {version:VERSION,mode:'monthly',period:'',deadline:'',items:[]};}
export function validate(s){
 keys(s,['version','mode','period','deadline','items']);
 if(s.version!==VERSION)fail('Version inconnue : utilisez une sauvegarde checklist version 1.');
 if(!['monthly','closing'].includes(s.mode))fail('Choisissez mensuel ou clôture.');
 text(s.period,200);text(s.deadline,10);
 if(s.deadline){if(!/^\d{4}-\d{2}-\d{2}$/.test(s.deadline)||s.deadline.startsWith('0000')||new Date(s.deadline+'T00:00:00Z').toISOString().slice(0,10)!==s.deadline)fail('Échéance organisationnelle : date existante attendue.');}
 if(!Array.isArray(s.items)||s.items.length>MAX_ITEMS)fail('Limite de 100 éléments ; aucune ligne partielle importée.');
 const ids=new Set();
 for(const i of s.items){keys(i,['id','family','label','state','note']);text(i.id,30,true);text(i.label,300,true);text(i.note,2000);
  if(!/^[a-zA-Z0-9_-]+$/.test(i.id)||ids.has(i.id))fail('Identifiant invalide ou dupliqué.');ids.add(i.id);
  if(!Object.hasOwn(FAMILIES,i.family)||!Object.hasOwn(STATES,i.state))fail('Famille ou état inconnu : reprise refusée.');
 }
 return s;
}
export function addItem(s,item){validate(s);const ids=new Set(s.items.map(i=>i.id));let n=1;while(ids.has('p'+n))n++;const next={...s,items:[...s.items,{id:'p'+n,...item}]};validate(next);return next;}
export function removeItem(s,id){return validate({...s,items:s.items.filter(i=>i.id!==id)});}
export function addFamilies(s,families){let next=s;for(const family of families){if(!Object.hasOwn(TEMPLATES,family))fail('Famille de trame inconnue.');if(!next.items.some(i=>i.family===family))next=addItem(next,{family,label:TEMPLATES[family],state:'unknown',note:''});}return next;}
export function demoSession(){let s={...createSession(),period:'Septembre 2026'};for(const [family,label,state] of [['achats','Factures d’achat','received'],['banque','Relevé bancaire de septembre','missing'],['immobilisations','Justificatif d’acquisition','na'],['social','Récapitulatif de paie','unknown']])s=addItem(s,{family,label,state,note:''});return s;}
export function result(s){validate(s);const missing=s.items.filter(i=>i.state==='missing'),unknown=s.items.filter(i=>i.state==='unknown');return {missing,unknown,complete:s.items.length>0&&!missing.length&&!unknown.length,message:missing.length?`Bonjour,\n\nPour préparer ${s.mode==='closing'?'la clôture':'le dossier mensuel'}${s.period?' — '+s.period:''}, pouvez-vous nous transmettre les pièces suivantes${s.deadline?' avant le '+s.deadline:''} ?\n\n${missing.map(i=>'- '+i.label).join('\n')}\n\nMerci.\nBien cordialement,`:''};}
function sized(raw){if(typeof raw!=='string'||new TextEncoder().encode(raw).byteLength>MAX_BYTES)fail('Fichier supérieur à 1 Mo : import refusé.');return raw;}
export function exportJson(s){return JSON.stringify(validate(s),null,2);}
export function importJson(raw){let s;try{s=JSON.parse(sized(raw));}catch(e){if(e.message.includes('1 Mo'))throw e;fail('JSON illisible : session conservée.');}return validate(s);}
const HEADERS=['version','type','mode','period','deadline','id','family','label','state','note','neutralized'];
export function exportCsv(s){validate(s);const records=[[String(VERSION),'metadata',s.mode,s.period,s.deadline,'','','','',''],...s.items.map(i=>[String(VERSION),'item','','','',i.id,i.family,i.label,i.state,i.note])];
 return serializeCsv([HEADERS,...records.map(row=>[...row,JSON.stringify(row.flatMap((v,i)=>needsNeutralization(v)?[HEADERS[i]]:[]))])]);
}
export function importCsv(raw,delimiter=';'){
 const p=parseDelimited(sized(raw),delimiter);if(p.headers.join('|')!==HEADERS.join('|'))fail('CSV de reprise checklist attendu : colonnes ou version inattendues.');
 if(p.rows.length>101)fail('Limite de 100 éléments.');
 const rows=p.rows.map(row=>{let marked;try{marked=JSON.parse(row[10]);}catch{fail('Marqueurs de neutralisation invalides.');}
  if(!Array.isArray(marked)||new Set(marked).size!==marked.length||marked.some(k=>!['period','label','note'].includes(k)))fail('Marqueurs de neutralisation inattendus.');
  for(const k of marked){const i=HEADERS.indexOf(k);if(!row[i].startsWith("'")||!needsNeutralization(row[i].slice(1)))fail('Neutralisation incohérente.');row[i]=row[i].slice(1);}return row;
 });
 const meta=rows.shift();if(!meta||meta[0]!==String(VERSION)||meta[1]!=='metadata'||meta.slice(5,10).some(Boolean))fail('Métadonnées CSV inattendues.');
 const s={version:VERSION,mode:meta[2],period:meta[3],deadline:meta[4],items:[]};
 for(const row of rows){if(row[0]!==String(VERSION)||row[1]!=='item'||row.slice(2,5).some(Boolean))fail('Ligne CSV inattendue.');s.items.push({id:row[5],family:row[6],label:row[7],state:row[8],note:row[9]});}return validate(s);
}
export function importBytes(buffer,format,encoding='utf-8',delimiter=';'){if(buffer.byteLength>MAX_BYTES)fail('Fichier supérieur à 1 Mo.');const raw=decodeFile(new Uint8Array(buffer),encoding);return format==='json'?importJson(raw):importCsv(raw,delimiter);}
const escape=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function printHtml(s){const r=result(s);return `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Checklist des pièces comptables</title><style>body{font:16px/1.5 sans-serif;padding:24px;color:#231f20}table{width:100%;border-collapse:collapse}td,th{padding:8px;text-align:left;border-bottom:1px solid #aaa;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere}@media print{tr{break-inside:avoid}}</style><h1>Checklist des pièces comptables</h1><p>${escape(s.mode==='closing'?'Clôture':'Mensuel')} · ${escape(s.period||'Période non renseignée')} · ${escape(s.deadline||'Échéance non renseignée')}</p><p>${r.complete?'Terminé sur cette trame':r.missing.length+' pièce(s) manquante(s), '+r.unknown.length+' à clarifier'}</p><table><thead><tr><th>Pièce</th><th>Famille</th><th>État déclaré</th><th>Note</th></tr></thead><tbody>${s.items.map(i=>`<tr><td>${escape(i.label)}</td><td>${FAMILIES[i.family]}</td><td>${STATES[i.state]}</td><td>${escape(i.note)}</td></tr>`).join('')}</tbody></table><h2>Demande des seules pièces manquantes</h2><pre>${escape(r.message||'Aucune demande de pièce manquante.')}</pre><h2>À clarifier, sans demande automatique</h2><ul>${r.unknown.map(i=>'<li>'+escape(i.label)+'</li>').join('')}</ul><p>Trame opérationnelle choisie et modifiable, pas liste d’obligations légales. Aucune pièce jointe, aucun envoi. Les états sont déclarés par l’utilisateur ; le cabinet valide la demande et son échéance organisationnelle. Version ${VERSION}.</p></html>`;}
