/** Comparaison locale déclarative, sans jugement de risque ni de signification.
 * Montants et calculs : BigInt centimes, jamais de conversion monétaire en float.
 * CSV avec en-tête obligatoire ; mapping explicite à indices zéro.
 */
import {parseDelimited, serializeCsv} from '../pseudonymisation.mjs';
export const VERSION = 'comparateur-balances-1';
export const MAX_BYTES = 10_000_000;
export const MAX_ROWS = 20_000;
export const EXAMPLE_PREVIOUS = 'Compte;Libellé;Solde\n00123;Compte fictif;100,00\n401;Fournisseur fictif;-100,00';
export const EXAMPLE_CURRENT = 'Compte;Libellé;Solde\n00123;Compte fictif;130,00\n707;Ventes fictives;50,00\n401;Fournisseur fictif;-80,00';
const fail = message => { throw new Error(message); };
const abs = value => value < 0n ? -value : value;
const text = (value, field) => {
 if(typeof value !== 'string' || value.length > 65_536 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ufffd]/.test(value)) fail(`${field} : texte lisible requis (65 536 caractères maximum).`);
 return value;
};
function decimalHundredths(value, field) {
 if(typeof value !== 'string' || value.length > 256 || !/^[+-]?\d+(?:[.,]\d{1,2})?$/.test(value.trim())) fail(`${field} : montant/pourcentage ambigu ou invalide ; décimal exact à deux places maximum, sans milliers ni exposant (centimes sans arrondi).`);
 const raw=value.trim(); const negative=raw.startsWith('-'); const [whole,fraction='']=raw.replace(/^[+-]/,'').split(/[.,]/);
 return BigInt(whole+fraction.padEnd(2,'0'))*(negative?-1n:1n);
}
/** Only locates record starts; strict syntax and cells are delegated to the shared parser.
 * Count physical source lines as well, to bound even multiline or empty input.
 */
function locateRecords(input) {
 const source=input.replace(/^\uFEFF/,''); const starts=[1]; let line=1,quoted=false;
 for(let i=0;i<source.length;i++) {
  const c=source[i];
  if(c==='"') { if(quoted && source[i+1]==='"') i++; else quoted=!quoted; }
  else if(c==='\r' || c==='\n') {
   if(c==='\r' && source[i+1]==='\n') i++;
   line++; if(!quoted && i+1<source.length) starts.push(line);
   if(line>MAX_ROWS+2) fail('Refus : limite de 20 000 lignes physiques dépassée.');
  }
 }
 const physicalLines=line-(/[\r\n]$/.test(source)?1:0);
 const headerLines=starts[1]===undefined?physicalLines:starts[1]-1;
 const sourceLineCount=physicalLines-headerLines;
 if(sourceLineCount>MAX_ROWS) fail('Refus : limite de 20 000 lignes physiques dépassée.');
 return {starts:starts.slice(1),sourceLineCount};
}
export function parseBalance(input,{delimiter=';',mode='balance',mapping,aggregate=false,name=''}={}) {
 if(typeof input!=='string') fail('CSV : texte requis.');
 const sourceBytes=new TextEncoder().encode(input).byteLength;
 if(sourceBytes>MAX_BYTES) fail('Refus : limite de 10 Mo (10 000 000 octets) dépassée.');
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ufffd]/.test(input)) fail('CSV binaire ou caractères illisibles : import refusé.');
 text(name,'Nom du fichier');
 if(!['balance','debit-credit'].includes(mode)) fail('Mode : balance ou debit-credit requis.');
 if(typeof aggregate!=='boolean') fail('Agrégation : confirmation booléenne requise.');
 const {starts,sourceLineCount}=locateRecords(input);
 if(starts.length>MAX_ROWS) fail('Refus : limite de 20 000 lignes dépassée.');
 const {headers,rows}=parseDelimited(input,delimiter);
 const fields=['account','label',...(mode==='balance'?['balance']:['debit','credit'])];
 if(!mapping || fields.some(key=>!Number.isInteger(mapping[key]) || mapping[key]<0 || mapping[key]>=headers.length) || new Set(fields.map(key=>mapping[key])).size!==fields.length) fail('Mapping : colonnes distinctes existantes, indices entiers à partir de zéro requis.');
 const accounts=new Map(),warnings=[];
 for(const [i,row] of rows.entries()) {
  const line=starts[i],account=text(row[mapping.account],'Compte'),label=text(row[mapping.label],'Libellé');
  if(!account.trim()) fail(`Ligne ${line} : numéro de compte vide.`);
  const cents=mode==='balance'?decimalHundredths(row[mapping.balance],`Ligne ${line}, montant solde`):decimalHundredths(row[mapping.debit],`Ligne ${line}, montant débit`)-decimalHundredths(row[mapping.credit],`Ligne ${line}, montant crédit`);
  const prior=accounts.get(account);
  if(prior) {
   if(aggregate!==true) fail(`Ligne ${line} : doublon du compte ${account} (ligne ${prior.lines[0]}) ; confirmez explicitement l’agrégation.`);
   prior.cents=(BigInt(prior.cents)+cents).toString(); prior.lines.push(line);
   if(!prior.labels.includes(label)) prior.labels.push(label);
  } else accounts.set(account,{account,label,cents:cents.toString(),lines:[line],labels:[label]});
 }
 // One bounded warning per account, rather than repeated, growing lists of all lines.
 for(const row of accounts.values()) if(row.labels.length>1) warnings.push(`Compte ${row.account} : ${row.labels.length} libellés divergents agrégés sur ${row.lines.length} lignes ; consultez la provenance.`);
 if(aggregate && rows.length>accounts.size) warnings.push('Agrégation explicitement confirmée : les lignes sources et leurs libellés sont conservés.');
 return {accounts:[...accounts.values()].sort((a,b)=>a.account<b.account?-1:a.account>b.account?1:0),warnings,name,rowCount:rows.length,sourceBytes,sourceLineCount,conventions:{mode,delimiter,mapping:{...mapping},aggregate,header:true,amount:mode==='balance'?'Solde signé':'Solde = débit − crédit'}};
}
function period(value,field) {
 if(!value || typeof value!=='object') fail(`Dates de la période ${field} obligatoires.`);
 for(const key of ['start','end']) {
  const raw=value[key];
  if(typeof raw!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) fail(`Date ${field} ${key} : AAAA-MM-JJ obligatoire.`);
  const year=Number(raw.slice(0,4)),month=Number(raw.slice(5,7)),day=Number(raw.slice(8));
  const days=[31,year%4===0&&(year%100!==0||year%400===0)?29:28,31,30,31,30,31,31,30,31,30,31];
  if(year<1 || month<1 || month>12 || day<1 || day>days[month-1]) fail(`Date ${field} ${key} inexistante.`);
 }
 if(value.end<value.start) fail(`Dates ${field} : fin antérieure au début.`);
 return {start:value.start,end:value.end,durationDays:(Date.parse(value.end+'T00:00:00Z')-Date.parse(value.start+'T00:00:00Z'))/86_400_000+1};
}
function validateBalance(balance) {
 if(!balance || !Array.isArray(balance.accounts) || !Array.isArray(balance.warnings) || !Number.isSafeInteger(balance.rowCount) || balance.rowCount<1 || balance.rowCount>MAX_ROWS) fail('Balance invalide ou limite de 20 000 lignes dépassée.');
 // Enumerable metadata survives structuredClone / Worker postMessage; never trust a truncated account count.
 if(!Number.isSafeInteger(balance.sourceBytes) || balance.sourceBytes<0 || balance.sourceBytes>MAX_BYTES) fail('Balance : taille source requise, limite de 10 Mo.');
 if(!Number.isSafeInteger(balance.sourceLineCount) || balance.sourceLineCount<balance.rowCount || balance.sourceLineCount>MAX_ROWS) fail('Balance : provenance physique requise, limite de 20 000 lignes.');
 text(balance.name,'Nom du fichier');
 const map=new Map(); let count=0;
 if(balance.accounts.length>balance.rowCount) fail('Balance : nombre de comptes incohérent.');
 for(const row of balance.accounts) {
  text(row.account,'Compte'); text(row.label,'Libellé');
  if(!row.account.trim() || map.has(row.account) || typeof row.cents!=='string' || !/^-?\d{1,260}$/.test(row.cents) || !Array.isArray(row.lines) || !row.lines.length || !row.lines.every(n=>Number.isSafeInteger(n)&&n>=2) || !Array.isArray(row.labels) || !row.labels.length || !row.labels.includes(row.label)) fail('Balance : compte, centimes ou provenance invalides.');
  row.labels.forEach(v=>text(v,'Libellé source')); count+=row.lines.length; map.set(row.account,row);
 }
 if(count!==balance.rowCount) fail('Balance : provenance et nombre de lignes incohérents.');
 balance.warnings.forEach(v=>text(v,'Avertissement'));
 return map;
}
function percent(delta,reference) {
 if(reference===0n) return null;
 // Round half away from zero at two percentage decimal places.
 const denominator=abs(reference),numerator=abs(delta)*10_000n;
 const rounded=(numerator+denominator/2n)/denominator;
 return (delta<0n && rounded!==0n?'-':'')+(rounded/100n).toString()+'.'+(rounded%100n).toString().padStart(2,'0');
}
export function compareBalances(previous,current,{periodPrevious,periodCurrent,sameCurrency,comparable,absoluteThreshold='',relativeThreshold=''}={}) {
 if(sameCurrency!==true) fail('Même devise : confirmation explicite obligatoire, aucune conversion implicite.');
 if(comparable!==true) fail('Comparabilité : confirmation explicite obligatoire.');
 const pp=period(periodPrevious,'N−1'),pc=period(periodCurrent,'N');
 if(absoluteThreshold==='' && relativeThreshold==='') fail('Au moins un seuil absolu ou relatif est obligatoire.');
 const absolute=absoluteThreshold===''?null:decimalHundredths(absoluteThreshold,'Seuil absolu');
 const relative=relativeThreshold===''?null:decimalHundredths(relativeThreshold,'Seuil pourcentage relatif');
 if(absolute!==null && absolute<0n || relative!==null && relative<0n) fail('Les seuils doivent être non négatifs.');
 const prev=validateBalance(previous),curr=validateBalance(current);
 if(previous.rowCount+current.rowCount>MAX_ROWS || previous.sourceLineCount+current.sourceLineCount>MAX_ROWS) fail('Refus : limite totale de 20 000 lignes pour les deux balances dépassée.');
 if(previous.sourceBytes+current.sourceBytes>MAX_BYTES) fail('Refus : limite totale de 10 Mo (10 000 000 octets) pour les deux balances dépassée.');
 const warnings=[...previous.warnings,...current.warnings];
 if(pp.durationDays!==pc.durationDays) warnings.push(`Durées différentes : N−1 ${pp.durationDays} jours, N ${pc.durationDays} jours ; comparabilité déclarée uniquement, cette alerte demeure dans le rapport.`);
 const keys=[...new Set([...prev.keys(),...curr.keys()])].sort(); let totalPrevious=0n,totalCurrent=0n;
 const rows=keys.map(account=>{
  const a=prev.get(account),b=curr.get(account),old=BigInt(a?.cents??'0'),next=BigInt(b?.cents??'0'),delta=next-old;
  totalPrevious+=old; totalCurrent+=next;
  if(a&&b && new Set([...a.labels,...b.labels]).size>1) warnings.push(`Compte ${account} : libellés divergents entre les deux périodes ; consultez la provenance.`);
  const selected=(absolute!==null && abs(delta)>=absolute) || (relative!==null && old!==0n && abs(delta)*10_000n>=relative*abs(old));
  return {account,label:b?.label??a.label,previous:old.toString(),current:next.toString(),delta:delta.toString(),percent:percent(delta,old),status:!a?'nouveau':!b?'disparu':'présent',selected,previousLines:[...(a?.lines??[])],currentLines:[...(b?.lines??[])],previousLabels:[...(a?.labels??[])],currentLabels:[...(b?.labels??[])]};
 });
 return {rows,totals:{previous:totalPrevious.toString(),current:totalCurrent.toString(),delta:(totalCurrent-totalPrevious).toString()},warnings,conventions:{version:VERSION,periodPrevious:pp,periodCurrent:pc,sameCurrency:true,comparable:true,absoluteThreshold,relativeThreshold,thresholdRule:'OU inclusif : |delta| ≥ seuil absolu ou |pourcentage exact| ≥ seuil relatif',amountUnit:'centimes',delta:'N − N−1',percent:'100 × delta / |N−1| ; référence zéro = non calculable ; affichage arrondi à deux décimales, demi à l’écart de zéro',previous:previous.conventions,current:current.conventions,limits:'Comparaison déclarative, sans conclusion de signification, de risque, comptable ou fiscale.'},previousName:previous.name,currentName:current.name};
}
/** CSV only, not HTML: retain literal markup; UI must render values via textContent.
 * Shared serializer quotes every cell and apostrophizes dangerous spreadsheet prefixes.
 */
export function exportComparisonCsv(result) {
 const records=[['Type','Compte / convention','Libellé / valeur','N−1 (centimes)','N (centimes)','Delta (centimes)','Variation (%)','Statut','À examiner','Lignes N−1','Lignes N','Libellés N−1','Libellés N']];
 const metadata=(type,key,value)=>records.push([type,key,String(value),...Array(10).fill('')]);
 metadata('rapport','version',VERSION);
 metadata('rapport','sécurité','Texte dangereux neutralisé par une apostrophe (formules tableur). HTML conservé comme texte, jamais interprété. Original inchangé.');
 metadata('source','N−1',result.previousName); metadata('source','N',result.currentName);
 for(const [key,value] of Object.entries(result.conventions)) metadata('convention',key,typeof value==='object'?JSON.stringify(value):value);
 for(const warning of result.warnings) metadata('avertissement','persistant',warning);
 records.push(['totaux','','',result.totals.previous,result.totals.current,result.totals.delta,'','','','','','','']);
 for(const row of result.rows) records.push(['compte',row.account,row.label,row.previous,row.current,row.delta,row.percent??'non calculable',row.status,row.selected?'oui':'non',row.previousLines.join(', '),row.currentLines.join(', '),JSON.stringify(row.previousLabels),JSON.stringify(row.currentLabels)]);
 return serializeCsv(records);
}
