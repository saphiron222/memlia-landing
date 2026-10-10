/** Memory-only, non-contentious preparation. Original strings are never rewritten.
 * EUR only, exact cents. The preparation date is explicit; due today is not late.
 * parseDelimited/decodeFile/serializeCsv are the existing audited CSV primitives.
 */
import {parseDelimited,decodeFile,serializeCsv} from './pseudonymisation.mjs';
export const VERSION='relance-facture-1';
export const MAX_BYTES=5_000_000;
export const MAX_ROWS=500;
export const FIELDS=['clientKey','client','reference','amount','payments','credits','dueDate','dispute','currency'];
export function parseAmount(value) {
 if(typeof value!=='string'||!/^\d{1,15}(?:[.,]\d{1,2})?$/.test(value)) throw new Error('Montant absent ou ambigu : décimal positif, 15 chiffres et deux décimales maximum, sans milliers.');
 const [whole,fraction='']=value.split(/[.,]/); return BigInt(whole)*100n+BigInt(fraction.padEnd(2,'0'));
}
const fixed=n=>{const sign=n<0n?'-':'';const digits=(n<0n?-n:n).toString().padStart(3,'0');return sign+digits.slice(0,-2)+'.'+digits.slice(-2);};
export function validDate(value) {
 if(typeof value!=='string') return false;
 const normalized=/^\d{8}$/.test(value)?`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6)}`:value;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return false;
 const [y,m,d]=normalized.split('-').map(Number);const days=[31,y%4===0&&(y%100!==0||y%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
 return y>=1&&m>=1&&m<=12&&d>=1&&d<=days[m-1]?normalized:false;
}
export function demoInvoices() {
 const base={clientKey:'001',client:'Atelier fictif',reference:'F-001',amount:'120,00',payments:'20,00',credits:'10,00',dueDate:'2026-09-01',dispute:'non',currency:'EUR'};
 return [base,{...base,reference:'F-002',payments:'120,00',credits:'0'},{...base,clientKey:'002',client:'Studio fictif',reference:'F-003',dispute:'oui'},{...base,reference:'F-004',dueDate:'2099-12-31'}];
}
export function prepareReminders(inputs,options) {
 if(!Array.isArray(inputs)||!inputs.length||inputs.length>MAX_ROWS) throw new Error('Saisissez une à 500 factures maximum.');
 const {preparationDate,currency,groupConfirmed,level,signature}=options;
 const date=validDate(preparationDate);if(!date) throw new Error('Date de préparation invalide.');
 if(currency!=='EUR') throw new Error('Devise EUR uniquement : aucune conversion.');
 if(groupConfirmed!==true) throw new Error('Confirmez la clé client avant de regrouper les factures.');
 if(!['first','reminder'].includes(level)) throw new Error('Choisissez première relance ou rappel.');
 if(typeof signature!=='string'||signature.length>2000) throw new Error('Signature : 2 000 caractères maximum.');
 const names=new Map(),references=new Map();
 for(const raw of inputs) {
  if(!raw||typeof raw!=='object') throw new Error('Ligne de facture invalide.');
  const key=raw.clientKey;const set=names.get(key)??new Set();set.add(raw.client);names.set(key,set);
  const ref=JSON.stringify([key,raw.reference]);references.set(ref,(references.get(ref)??0)+1);
 }
 const invoices=inputs.map((raw,index)=>{
  let balance=null,status='review',reason='';
  try {
   for(const field of FIELDS) if(typeof raw[field]!=='string'||raw[field].length>2000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(raw[field])) throw new Error(`Champ ${field} : texte invalide ou supérieur à 2 000 caractères.`);
   if(!raw.clientKey.trim()||!raw.client.trim()) throw new Error('Clé client ou nom absent.');
   if(names.get(raw.clientKey).size!==1) throw new Error('Même clé client avec plusieurs noms : identité à examiner.');
   if(!raw.reference.trim()) throw new Error('Référence manquante.');
   if(references.get(JSON.stringify([raw.clientKey,raw.reference]))!==1) throw new Error('Référence dupliquée pour cette clé client.');
   if(raw.currency!==currency) throw new Error('Devise différente ou absente : aucune conversion.');
   const amount=parseAmount(raw.amount),payments=parseAmount(raw.payments),credits=parseAmount(raw.credits);
   balance=fixed(amount-payments-credits);
   if(amount-payments-credits<0n) throw new Error('Solde négatif après paiements et avoirs.');
   const due=validDate(raw.dueDate);if(!due) throw new Error('Échéance absente ou date inexistante.');
   if(!['oui','non'].includes(raw.dispute)) throw new Error('Litige inconnu : renseignez oui ou non.');
   if(raw.dispute==='oui') throw new Error('Litige déclaré : à examiner, sans relance.');
   if(balance==='0.00'){status='excluded';reason='Facture soldée : exclue.';}
   else if(due>=date){status='excluded';reason='Non échue à la date de préparation : exclue.';}
   else {status='ready';reason='Solde échu sans litige déclaré : relance à valider.';}
  } catch(error){reason=error.message;}
  return {...raw,line:raw.line??index+1,balance,status,reason};
 });
 const groups=new Map();
 for(const invoice of invoices.filter(x=>x.status==='ready')){const list=groups.get(invoice.clientKey)??[];list.push(invoice);groups.set(invoice.clientKey,list);}
 const messages=[...groups].map(([clientKey,rows])=>{
  const balance=fixed(rows.reduce((sum,x)=>sum+parseAmount(x.balance),0n));
  const refs=rows.map(x=>x.reference);
  const subject=`${level==='first'?'Suivi':'Rappel'} de vos factures — ${refs.join(', ')}`;
  const detail=rows.map(x=>`• ${x.reference} — échéance ${x.dueDate} — solde ${x.balance.replace('.',',')} EUR`).join('\n');
  const body=`Bonjour,\n\n${level==='first'?'Nous revenons vers vous au sujet des factures suivantes':'Nous vous rappelons les factures suivantes'}, dont le solde reste à régler à la date du ${date} :\n\n${detail}\n\nTotal restant : ${balance.replace('.',',')} EUR.\n\nSi un règlement a déjà été effectué, pourriez-vous nous en communiquer la référence afin de mettre notre suivi à jour ? Nous restons disponibles pour toute question ou précision.\n\nMerci pour votre retour.${signature?'\n\n'+signature:''}`;
  return {clientKey,client:rows[0].client,subject,body,balance,references:refs};
 });
 return {version:VERSION,options:{...options},invoices,messages};
}
/** Strict parser, chosen encoding/separator, complete import before any preparation.
 * Physical source lines are counted only after the shared parser validates quotes.
 */
export function parseInvoiceCsv(text,delimiter) {
 if(typeof text!=='string'||new TextEncoder().encode(text).byteLength>MAX_BYTES) throw new Error('CSV supérieur à 5 Mo (5 000 000 octets) : refus.');
 const parsed=parseDelimited(text,delimiter);
 if(parsed.rows.length>MAX_ROWS) throw new Error('CSV : 500 factures maximum.');
 if(parsed.headers.length!==FIELDS.length||FIELDS.some(f=>!parsed.headers.includes(f))) throw new Error('En-têtes requis, sans autre colonne : '+FIELDS.join(';'));
 const starts=[1];let line=1,quoted=false;
 for(let i=0;i<text.length;i++) {
  if(text[i]==='"'){if(quoted&&text[i+1]==='"')i++;else quoted=!quoted;}
  else if(text[i]==='\r'||text[i]==='\n'){if(text[i]==='\r'&&text[i+1]==='\n')i++;line++;if(!quoted)starts.push(line);}
 }
 return parsed.rows.map((row,i)=>({...Object.fromEntries(FIELDS.map(f=>[f,row[parsed.headers.indexOf(f)]])),line:starts[i+1]}));
}
export function decodeInvoiceFile(bytes,encoding,delimiter){if(bytes.byteLength>MAX_BYTES)throw new Error('CSV supérieur à 5 Mo : refus.');return parseInvoiceCsv(decodeFile(bytes,encoding),delimiter);}
export function exportText(report) {
 return [`Préparation amiable — ${report.version} — ${report.options.preparationDate}`, 'Propositions à relire. Aucun envoi. Pas de pénalité, conversion ni conclusion juridique.',...report.messages.map(m=>`\nClient ${m.clientKey} — ${m.client}\nObjet : ${m.subject}\n\n${m.body}`),'\nToutes les factures et décisions',...report.invoices.map(x=>`Ligne ${x.line} — ${x.clientKey} — ${x.reference} — solde ${x.balance??'non évalué'} EUR — ${x.reason}`)].join('\n');
}
export function exportCsv(report) {
 const headers=['version','type','ligne','cle_client','client','reference','montant_initial','paiements','avoirs','echeance','litige','devise','solde','etat','motif','objet_edite','corps_edite','date_preparation'];
 return serializeCsv([headers,...report.invoices.map(x=>[report.version,'facture',x.line,x.clientKey,x.client,x.reference,x.amount,x.payments,x.credits,x.dueDate,x.dispute,x.currency,x.balance??'',x.status,x.reason,'','',report.options.preparationDate]),...report.messages.map(m=>[report.version,'message','',m.clientKey,m.client,m.references.join(', '),'','','','','','EUR',m.balance,'a_valider','Aucun envoi',m.subject,m.body,report.options.preparationDate])]);
}
