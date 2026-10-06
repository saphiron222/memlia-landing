/** Versioned local reference, not a professional decision. Integer cents throughout. */
export const VERSION = 'bareme-heures-cac-1';
export const GRID_VERSION = 'D821-188-2024-02-01';
export const UPDATED = '2026-10-06';
export const SOURCE = 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000005634379/LEGISCTA000048874384/2026-10-06';
export const GRID = [[305000,20,35],[760000,30,50],[1525000,40,60],[3050000,50,80],[7622000,70,120],[15245000,100,200],[45735000,180,360],[122000000,300,700]];
export const EXCLUSIONS = [
 {id:'market',label:'2° Valeurs mobilières admises sur un marché réglementé'},
 {id:'insurance',label:'3° Entreprise régie par le code des assurances ou de la mutualité'},
 {id:'credit',label:'4° Établissement de crédit, société de financement, compagnie financière holding ou entreprise mère de société de financement'},
 {id:'investment',label:'5° Société d’investissement (ordonnance du 2 novembre 1945)'},
 {id:'regional',label:'6° Société de développement régional (R. 513-2 CMF)'},
 {id:'association',label:'7° Association ou fondation tenue ou ayant décidé d’avoir un CAC'},
 {id:'construction',label:'8° Société d’économie mixte de construction (L. 321-1 urbanisme)'},
 {id:'housing',label:'9° Organisme HLM soumis à la comptabilité des entreprises de commerce'},
 {id:'social',label:'10° Organisme mentionné à L. 114-8 du code de la sécurité sociale'},
 {id:'pension',label:'11° Institution ou organisme régi par le livre IX du code de la sécurité sociale'},
 {id:'judicial',label:'12° Administrateur ou mandataire judiciaire'},
 {id:'union',label:'13° Syndicat, union ou association de salariés ou d’employeurs (L. 2135-1 travail)'},
 {id:'committee',label:'14° Comité d’entreprise ou comité central d’entreprise visé par le texte'},
];
export const METHOD = 'Base = bilan + produits d’exploitation HT + produits financiers HT, en euros au centime. Lecture de D.821-188 après questionnaire R.821-194. Aux sept bornes communes, les deux lignes sont présentées sans affectation inventée. Alerte : augmentation du programme saisi, au plus un tiers (D.821-189), jamais une majoration automatique de la grille.';
export const LIMITS = 'Pas de tarif, ni de conclusion de conformité ou de suffisance des diligences. Comptes consolidés, audit petite entreprise, durabilité et autres missions non évalués par cet outil. Dérogation ou accord à documenter par le CAC selon D.821-190. Aucune validation humaine attribuée par l’export.';
const fail = message => { throw new Error(message); };
const text = (v,required=false) => {
 if(typeof v!=='string' || v.length>10000 || /\u0000/.test(v) || required&&!v.trim()) fail('Texte absent ou trop long (10 000 caractères).');
 return v;
};
const cents = v => {
 if(typeof v!=='string' || !/^\d{1,15}(?:[.,]\d{1,2})?$/.test(v)) fail('Montant en euros : décimal non négatif, deux décimales maximum, sans milliers ni exposant.');
 const [a,b='']=v.split(/[.,]/);return BigInt(a)*100n+BigInt(b.padEnd(2,'0'));
};
const decimal = n => `${n/100n}.${(n%100n).toString().padStart(2,'0')}`;
export function example() {
 return {balance:'100000',operating:'150000',financial:'10000',unit:'EUR',period:'Exercice fictif N',mission:'annual',exclusions:Object.fromEntries(EXCLUSIONS.map(x=>[x.id,'no'])),derogation:'none',alert:false,alertRate:'0',programme:'',budget:'42',missionRef:'001',preparer:'',reviewer:'',notes:'Jeu fictif ; budget à justifier par le CAC.'};
}
export function calculate(input) {
 if(!input || typeof input!=='object' || Array.isArray(input)) fail('Dossier attendu.');
 const expected=Object.keys(example());
 if(Object.keys(input).some(k=>!expected.includes(k)) || expected.some(k=>!Object.hasOwn(input,k))) fail('Champs inconnus ou manquants.');
 for(const k of expected.filter(k=>k!=='alert'&&k!=='exclusions')) text(input[k],k==='period');
 if(input.unit!=='EUR') fail('Unité EUR requise : convertir et confirmer vos montants avant saisie.');
 if(!['unknown','annual','consolidated','durability','other','small-audit'].includes(input.mission)) fail('Mission inconnue.');
 if(!['none','unknown','requested','agreed','granted'].includes(input.derogation)) fail('État de dérogation inconnu.');
 if(typeof input.alert!=='boolean') fail('Choix explicite d’alerte requis.');
 if(!input.exclusions || typeof input.exclusions!=='object' || Object.keys(input.exclusions).length!==EXCLUSIONS.length) fail('Questionnaire incomplet.');
 for(const {id} of EXCLUSIONS) if(!['yes','no','unknown'].includes(input.exclusions[id])) fail('Réponse d’exclusion absente.');
 const base=cents(input.balance)+cents(input.operating)+cents(input.financial);
 if(input.budget!=='') cents(input.budget);
 if(input.programme!=='') cents(input.programme);
 let alertHours=null;
 if(input.alert) {
  const programme=cents(input.programme);
  if(input.alertRate==='1/3') alertHours=`${programme*4n}/300`;
  else { const rate=cents(input.alertRate);if(rate*3n>10000n) fail('Alerte : augmentation supérieure à un tiers.');
   // No upward rounding beyond the legal cap. Exact fraction retained when needed.
   const numerator=programme*(10000n+rate);
   alertHours=numerator%10000n===0n?decimal(numerator/10000n):`${numerator}/1000000`;
  }
  if(input.alertRate==='1/3' && programme%75n===0n) alertHours=decimal(programme*4n/3n);
  else if(input.alertRate==='1/3' && programme%100n===0n) alertHours=`${programme/100n*4n}/3`;
 }
 let status='evaluated',reason='',range=null,index=null,candidates=[];
 if(input.mission!=='annual') {status='suspended';reason='Type de mission non évalué : seules les missions de certification des comptes annuels déclarées sont couvertes.';}
 else if(base>12200000000n) {status='excluded';reason='Base supérieure à 122 000 000 € : R.821-194, 1°.';}
 else if(EXCLUSIONS.some(x=>input.exclusions[x.id]==='yes')) {status='excluded';reason='Exclusion déclarée : '+EXCLUSIONS.filter(x=>input.exclusions[x.id]==='yes').map(x=>x.label).join(' ; ');}
 else if(EXCLUSIONS.some(x=>input.exclusions[x.id]==='unknown')) {status='suspended';reason='Champ d’application inconnu : compléter les réponses avant de retenir une fourchette.';}
 else if(input.derogation!=='none') {status='suspended';reason='Dérogation, accord ou situation inconnue : la référence ne constitue pas le budget applicable à ce dossier.';}
 else {
  index=GRID.findIndex(([b])=>base<=BigInt(b)*100n);
  if(index<7 && base===BigInt(GRID[index][0])*100n) {status='boundary';reason='Borne commune : le texte juxtapose deux lignes sans préciser l’affectation. Aucune fourchette applicable choisie automatiquement.';candidates=[GRID[index],GRID[index+1]];index=null;}
  else range=GRID[index].slice(1);
 }
 return {base:decimal(base),status,reason,range,index,candidates,budget:input.budget,alertHours:status==='evaluated'?alertHours:null};
}
export function save(input) {calculate(input);return JSON.stringify({version:VERSION,gridVersion:GRID_VERSION,input},null,2);}
export function restore(raw) {
 if(typeof raw!=='string' || new TextEncoder().encode(raw).length>20000000) fail('Reprise : maximum 20 Mo.');
 const data=JSON.parse(raw);
 if(!data || data.version!==VERSION || data.gridVersion!==GRID_VERSION || Object.keys(data).sort().join(',')!=='gridVersion,input,version') fail('Version ou structure de reprise inconnue.');
 calculate(data.input);return data.input;
}
const entries = input => {
 const r=calculate(input);
 return [['Version outil',VERSION],['Version grille',GRID_VERSION],['Généré le',new Date().toISOString()],['Méthode',METHOD],['Limites',LIMITS],['Source',SOURCE],...Object.entries(input).filter(([k])=>k!=='exclusions').map(([k,v])=>[k,String(v)]),...EXCLUSIONS.map(x=>[x.label,input.exclusions[x.id]]),['Base EUR',r.base],['État',r.status],['Raison',r.reason],['Heures de référence',r.range?.join(' à ')??'Non évaluées'],['Programme après alerte',r.alertHours??'Non évalué'],['Budget saisi distinct',r.budget||'Non renseigné'],['Contrôles','Décimaux, unité, questionnaire, bornes, version, alerte et exports sécurisés']];
};
export function csv(input) {
 const cell = v => {const raw=/^[\s]*[=+@-]/.test(v)?"'"+v:v;return '"'+raw.replaceAll('"','""')+'"';};
 return '\ufeff'+entries(input).map(row=>row.map(cell).join(';')).join('\r\n');
}
export function report(input) {
 const escape=v=>v.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 return '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Dossier barème heures CAC</title><body><h1>Dossier et fiche outil — barème heures CAC</h1><dl>'+entries(input).map(([k,v])=>`<dt>${escape(k)}</dt><dd>${escape(v)}</dd>`).join('')+'</dl><h2>Jeux de tests de la fiche outil</h2><p>Base fictive 260 000 € : 20 à 35 h ; 122 000 000,01 € : exclusion ; borne commune 305 000 € : affectation suspendue ; réponse inconnue : suspension ; taux 33,34 % : refus. Le cabinet apprécie l’outil et valide le dossier séparément.</p></body></html>';
}
