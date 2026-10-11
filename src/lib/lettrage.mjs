/** Assistant local v1. API pure : importLettrage → analyseLettrage → reportRows/exportLettrage.
 * Montants BigInt en centimes ; résultats sérialisables, identifiants et source conservés.
 * Aucune écriture métier, aucun stockage ni accès réseau. */
import { decodeFile, parseDelimited, serializeCsv } from './pseudonymisation.mjs';
export const MAX_BYTES = 10 * 1024 * 1024;
export const MAX_ROWS = 20_000;
export const VERSION = 'lettrage-local-v1';
export const EXAMPLE_CSV = `id;compte;tiers;reference;date;debit;credit;devise;lettre
F-001;411;CLIENT-FICTIF;FAC-001;2026-01-02;100,00;0;EUR;
R-001;411;CLIENT-FICTIF;FAC-001;2026-01-08;0;100,00;EUR;
F-002;411;CLIENT-FICTIF;FAC-002;2026-01-03;80,00;0;EUR;
R-002;411;CLIENT-FICTIF;FAC-002;2026-01-09;0;80,00;EUR;
R-003;411;CLIENT-FICTIF;FAC-002;2026-01-10;0;80,00;EUR;
F-003;411;AUTRE-TIERS;FAC-003;2026-01-04;45,00;0;EUR;
`;
/** Décimal positif explicite, maximum 18 chiffres entiers, deux décimales, aucun arrondi. */
export function parseCents(raw) {
  const s=String(raw).trim();
  if(!/^\d{1,18}(?:[.,]\d{1,2})?$/.test(s)) throw new Error('Montant invalide : positif, sans séparateur de milliers, deux décimales maximum (18 chiffres entiers).');
  const [a,b='']=s.split(/[.,]/); return BigInt(a)*100n+BigInt(b.padEnd(2,'0'));
}
export function formatCents(cents) { const n=BigInt(cents), a=n<0n?-n:n;return `${n<0n?'-':''}${a/100n},${String(a%100n).padStart(2,'0')}`; }
function validDate(s) { if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const [y,m,d]=s.split('-').map(Number);const date=new Date(0);date.setUTCFullYear(y,m-1,d);return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d; }
/** Parser strict partagé ; relevé parallèle des débuts physiques des enregistrements cités. */
function sourceLines(text) {
  const starts=[1];let quoted=false,line=1;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){i++;continue;}quoted=!quoted;}else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;line++;if(!quoted)starts.push(line);}}
  return starts.slice(1);
}
/** Entrée texte UTF-8 ou Uint8Array ; choix explicite d'encodage et de séparateur. */
export function importLettrage(input,{encoding='utf-8',delimiter=';'}={}) {
  if(typeof input==='string' ? new TextEncoder().encode(input).byteLength>MAX_BYTES : input.byteLength>MAX_BYTES)throw new Error('Fichier supérieur à 10 Mo : import refusé.');
  const text=typeof input==='string'?decodeFile(new TextEncoder().encode(input),'utf-8'):decodeFile(input,encoding);
  const data=parseDelimited(text,delimiter);if(data.rows.length>MAX_ROWS)throw new Error('Plus de 20 000 lignes : import refusé.');
  const headers=data.headers.map(h=>h.trim().toLowerCase());
  if(new Set(headers).size!==headers.length)throw new Error('En-têtes dupliqués après normalisation.');
  const required=['id','compte','tiers','reference','date','debit','credit','devise'];
  const missing=required.filter(h=>!headers.includes(h));if(missing.length)throw new Error(`Colonnes obligatoires absentes : ${missing.join(', ')}.`);
  const starts=sourceLines(text);const ids=new Map();const idIndex=headers.indexOf('id');
  for(const r of data.rows)ids.set(r[idIndex],(ids.get(r[idIndex])??0)+1);
  const lines=data.rows.map((r,i)=>{
    const values=Object.fromEntries(headers.map((h,j)=>[h,r[j]]));const reasons=[];let debit=null,credit=null;
    for(const name of ['id','compte','tiers','devise'])if(!values[name].trim())reasons.push(`${name} obligatoire et non vide`);
    if(ids.get(values.id)>1)reasons.push('Identifiant dupliqué : toutes ses occurrences sont refusées');
    if(!/^[A-Z]{3}$/.test(values.devise))reasons.push('Devise explicite requise : code de trois lettres majuscules');
    if(!validDate(values.date))reasons.push('Date invalide : AAAA-MM-JJ requis');
    for(const name of ['debit','credit'])try{const c=parseCents(values[name]);if(name==='debit')debit=c;else credit=c;}catch(e){reasons.push(`${name} : ${e.message}`);}
    if(debit!==null&&credit!==null){if(debit>0n&&credit>0n)reasons.push('Débit et crédit simultanés');if(debit===0n&&credit===0n)reasons.push('Mouvement nul');}
    const state=reasons.length?'rejeté':values.lettre?.trim()?'exclu':'restant';
    return {...values,sourceLine:starts[i],sourceRecord:i+2,original:r, state,reasons:state==='exclu'?['Déjà lettré (colonne lettre)']:reasons,debitCents:debit?.toString()??null,creditCents:credit?.toString()??null};
  });return {headers:data.headers,lines};
}
/** Paires seulement : référence identique non vide prioritaire ; sans référence, bucket montant unique.
 * Tout bucket comprenant plusieurs débiteurs ou créditeurs est ambigu, sans appariement arbitraire. */
export function analyseLettrage(data) {
  const lines=data.lines.map(l=>({...l,reasons:[...l.reasons]}));const buckets=new Map();const pairs=[],ambiguous=[];
  for(const l of lines){if(l.state!=='restant')continue;const amount=BigInt(l.debitCents)-BigInt(l.creditCents);const key=JSON.stringify([l.compte,l.tiers,l.devise,l.reference, (amount<0n?-amount:amount).toString()]);if(!buckets.has(key))buckets.set(key,{debits:[],credits:[]});buckets.get(key)[amount>0n?'debits':'credits'].push(l);}
  const ordered=[...buckets.values()].sort((a,b)=>Number(!!b.debits[0]?.reference||!!b.credits[0]?.reference)-Number(!!a.debits[0]?.reference||!!a.credits[0]?.reference));
  for(const b of ordered){if(!b.debits.length||!b.credits.length)continue;const members=[...b.debits,...b.credits];const first=members[0];
    if(b.debits.length===1&&b.credits.length===1){const rule=first.reference.trim()?'Référence identique non vide':'Paire unique sans référence';const key=`P${pairs.length+1}`;pairs.push({key,ids:members.map(l=>l.id),sourceLines:members.map(l=>l.sourceLine),rule,amount:formatCents(first.debitCents),compte:first.compte,tiers:first.tiers,devise:first.devise,reference:first.reference});for(const l of members){l.state='proposé';l.pairKey=key;l.reasons=[rule];}}
    else {const key=`A${ambiguous.length+1}`;const reason=`${b.debits.length} débit(s) et ${b.credits.length} crédit(s) concurrents : aucun choix automatique`;ambiguous.push({key,ids:members.map(l=>l.id),sourceLines:members.map(l=>l.sourceLine),reason,compte:first.compte,tiers:first.tiers,devise:first.devise,reference:first.reference});for(const l of members){l.state='ambigu';l.groupKey=key;l.reasons=[reason];}}
  }
  for(const l of lines)if(l.state==='restant')l.reasons=['Aucune paire exacte unique dans le même compte, tiers, devise et référence ; aucune combinaison recherchée'];
  const result={version:VERSION,headers:data.headers,lines,pairs,ambiguous,remaining:lines.filter(l=>l.state==='restant'),rejected:lines.filter(l=>l.state==='rejeté'),excluded:lines.filter(l=>l.state==='exclu')};return {...result,sums:computeSums(result)};
}
export function currentState(line,decisions={}) {return line.pairKey&&['accepté','refusé'].includes(decisions[line.pairKey])?decisions[line.pairKey]:line.state;}
/** Contrôles par devise, total et chaque état. Les montants illisibles sont exclus des sommes et dénombrés. */
export function computeSums(result,decisions={}) {
  const sums=new Map();for(const l of result.lines){for(const state of ['TOTAL',currentState(l,decisions)]){const key=JSON.stringify([l.devise,state]);if(!sums.has(key))sums.set(key,{devise:l.devise||'NON DÉCLARÉE',state,count:0,unreadable:0,debit:0n,credit:0n});const s=sums.get(key);s.count++;if(l.debitCents===null||l.creditCents===null)s.unreadable++;else{s.debit+=BigInt(l.debitCents);s.credit+=BigInt(l.creditCents);}}}return [...sums.values()].map(s=>({...s,balance:formatCents(s.debit-s.credit),debit:formatCents(s.debit),credit:formatCents(s.credit)}));
}
/** Rapport complet versionné, non importable comme écritures. Décisions projetées sans mutation. */
export function reportRows(result,decisions={}) {
  const rows=[['Rapport',VERSION,'Préparation uniquement — aucune écriture ni lettrage définitif'],['Convention','CSV UTF-8 BOM ; apostrophe de neutralisation devant = + - @ ou contrôle initial ; original intact'],['ÉTAT','PAIRE/GROUPE','LIGNE SOURCE','ENREGISTREMENT','MOTIF',...result.headers]];
  for(const l of result.lines)rows.push([currentState(l,decisions),l.pairKey??l.groupKey??'',l.sourceLine,l.sourceRecord,l.reasons.join(' ; '),...l.original]);
  rows.push([],['SOMME','DEVISE','ÉTAT','LIGNES','MONTANTS ILLISIBLES','DÉBIT','CRÉDIT','SOLDE']);for(const s of computeSums(result,decisions))rows.push(['SOMME',s.devise,s.state,s.count,s.unreadable,s.debit,s.credit,s.balance]);return rows;
}
export function exportLettrage(result,decisions={}) {return serializeCsv(reportRows(result,decisions));}
