// Contrôles techniques bornés, pas validation comptable ou fiscale.
export const MAX_BYTES = 20_000_000;
export const VERSION = 'fec-structure-1';
export const FIELDS = ['JournalCode','JournalLib','EcritureNum','EcritureDate','CompteNum','CompteLib','CompAuxNum','CompAuxLib','PieceRef','PieceDate','EcritureLib','Debit','Credit','EcritureLet','DateLet','ValidDate','Montantdevise','Idevise'];
export const RULES = [
  { id:'entete', description:'Noms et ordre des 18 colonnes du profil commercial Débit/Crédit.' },
  { id:'largeur', description:'Chaque ligne contient exactement 18 champs.' },
  { id:'presence', description:'Champs requis non vides ; auxiliaire, lettrage et devise peuvent rester vides si non utilisés.' },
  { id:'date', description:'Dates AAAAMMJJ existantes ; DateLet vide admise.' },
  { id:'decimal', description:'Débit/Crédit numériques signés ; Montantdevise numérique si renseigné. Point ou virgule, sans milliers ni exposant.' },
  { id:'equilibre', description:'Équilibre par écriture : non évalué.' },
  { id:'fond', description:'Exhaustivité, chronologie, numérotation, nom du fichier, pièces, plan de comptes, encodage légal et traitement fiscal : non évalués.' },
];
export function decodeFec(bytes, encoding = 'utf-8') {
  if (bytes.byteLength > MAX_BYTES) throw new Error('Refus : limite de 20 Mo (20 000 000 octets) dépassée.');
  if (!['utf-8','windows-1252'].includes(encoding)) throw new Error('Choisissez un encodage pris en charge.');
  try { return new TextDecoder(encoding,{fatal:true}).decode(bytes); }
  catch { throw new Error('Lecture impossible avec cet encodage. Choisissez explicitement celui du fichier.'); }
}
const validDate = value => {
  if (!/^\d{8}$/.test(value)) return false;
  const y=Number(value.slice(0,4)),m=Number(value.slice(4,6)),d=Number(value.slice(6));
  const leap=y%4===0 && (y%100!==0 || y%400===0);
  const days=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
  return y>0 && m>=1 && m<=12 && d>=1 && d<=days[m-1];
};
// Vérification lexicale uniquement : aucun montant n'est converti en float.
const validDecimal = value => /^[+-]?\d+(?:[,.]\d+)?$/.test(value);
export function analyzeFec(text, {encoding='utf-8', profile='commercial-18'} = {}) {
  /** @type {Array<{line:number,column:string,columnIndex:number|null,rule:string,value:string,message:string}>} */
  const anomalies=[];
  const report={version:VERSION,profile,encoding,state:'complete',complete:true,reason:'',separator:'',lines:0,anomalies,rules:RULES.map(r=>({...r,status:'non évalué',checked:0})),notice:'Rapport de structure non certifiant. Le fichier original reste inchangé.'};
  const add=(line,index,rule,value,message)=>report.anomalies.push({line,column:index===null?'Ligne':FIELDS[index],columnIndex:index===null?null:index+1,rule,value,message});
  const checked = id => { const r=report.rules.find(r=>r.id===id); r.status='exécuté'; r.checked++; };
  const unsupported=reason=>{report.state='unsupported';report.complete=false;report.reason=reason;return report;};
  if (profile!=='commercial-18' || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text) || text.trimStart().startsWith('<')) return unsupported('Profil non reconnu ou fichier non textuel : non évalué, sans conclusion sur sa validité.');
  const lines=text.replace(/^\uFEFF/,'').split(/\r\n|\n|\r/);
  if (lines.at(-1)==='') lines.pop();
  const header=lines[0]??'';
  const separator=header.includes('\t')?'\t':'|';
  const columns=header.split(separator);
  if (columns.some(c=>['Montant','Sens','DateRglt','ModeRglt','NatOp','IdClient'].includes(c)) || columns.length>18 || columns.length<2) return unsupported('Profil non reconnu : seuls les fichiers texte commerciaux à 18 colonnes Débit/Crédit sont évalués. XML, BNC/BA, Montant/Sens et colonnes supplémentaires restent hors périmètre.');
  report.separator=separator==='\t'?'tabulation':'pipe';
  checked('entete');
  for(let i=0;i<FIELDS.length;i++) if(columns[i]!==FIELDS[i]) add(1,i,'entete',columns[i]??'',`Champ attendu à cette position : ${FIELDS[i]}.`);
  if(report.anomalies.length) { report.reason='En-tête différent : contrôles des valeurs non évalués pour éviter une interprétation de colonnes erronée.'; return report; }
  const required=[0,1,2,3,4,5,8,9,10,11,12,15];
  for(let i=1;i<lines.length;i++) {
    report.lines++; checked('largeur');
    const cells=lines[i].split(separator);
    if(cells.length!==18) {add(i+1,null,'largeur',String(cells.length),'18 champs attendus ; valeurs de cette ligne non évaluées.');continue;}
    checked('presence'); checked('date'); checked('decimal');
    for(const col of required) if(!cells[col].trim()) add(i+1,col,'presence',cells[col],'Champ requis vide dans le profil sélectionné.');
    for(const col of [3,9,14,15]) if(cells[col] && !validDate(cells[col])) add(i+1,col,'date',cells[col],'Date attendue : AAAAMMJJ, jour existant dans le calendrier.');
    for(const col of [11,12,16]) if(cells[col] && !validDecimal(cells[col])) add(i+1,col,'decimal',cells[col],'Nombre signé attendu, point ou virgule décimale, sans séparateur de milliers.');
  }
  if(!report.lines) {add(1,null,'largeur','0','Aucune ligne de données : contenu non évalué.');}
  return report;
}
export function reportCsv(report) {
  const neutral=value=>{const s=String(value??''); return '"'+(/^[\s]*[=+\-@\t\r\n]/.test(s)?"'"+s:s).replace(/"/g,'""')+'"';};
  const rows=[['Type','Ligne','Colonne','Règle','Valeur','Explication','Statut'],['rapport','','',report.version,'',report.notice,report.state],['profil','','',report.profile,report.encoding,report.reason??'',String(report.complete)],...report.rules.map(r=>['règle','','',r.id,String(r.checked),r.description,r.status]),...report.anomalies.map(a=>['anomalie',a.line,a.column,a.rule,a.value,a.message,'détectée'])];
  return '\uFEFF'+rows.map(r=>r.map(neutral).join(';')).join('\r\n');
}
export function exampleFec() {
  const row=['AC','Achats','0001','20260101','060600','Fournitures','','','P001','20260101','Écriture fictive','10,00','0,00','','','20260101','',''];
  return [FIELDS.join('|'),row.join('|'),row.join('|'),row.map((v,i)=>i===3?'20260230':v).join('|')].join('\n');
}
