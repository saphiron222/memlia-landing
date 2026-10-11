import { parseDelimited, decodeFile, serializeCsv, needsNeutralization, MAX_BYTES, MAX_ROWS, MAX_COLUMNS } from './pseudonymisation.mjs';
export { MAX_BYTES };
export const EXAMPLE = [
 { name:'janvier.csv',text:'ID;Montant\n001;10\n002;20' },
 { name:'fevrier.csv',text:'Montant;ID\n30;003\n40;004\n50;005' },
];
const fail=message=>{throw new Error(message);};
export function validateFiles(files) {
 if(files.length<2||files.length>20) fail('Choisissez 2 à 20 fichiers CSV texte.');
 if(files.reduce((sum,f)=>sum+f.size,0)>MAX_BYTES) fail('Total supérieur à 20 Mo : import refusé.');
}
export function parseSource(bytes,{name,encoding,delimiter}) {
 const parsed=parseDelimited(decodeFile(bytes,encoding),delimiter,{allowDuplicateHeaders:true,sourceLines:true,minimumColumns:1});
 return {...parsed,name,encoding,delimiter,bytes:bytes.byteLength};
}
export function mergeSources(sources,mappings=sources.map(s=>s.headers),options={}) {
 if(!options.confirmed) fail('Confirmez le mapping avant de consolider.');
 validateFiles(sources.map(s=>({size:s.bytes})));
 if(mappings.length!==sources.length) fail('Mapping incomplet.');
 const maps=mappings.map((mapping,i)=>{
  if(mapping.length!==sources[i].headers.length||mapping.some(h=>typeof h!=='string'||!h.trim()||h.length>256)||new Set(mapping.map(h=>h.trim())).size!==mapping.length) fail('Mapping ambigu : choisissez un nom cible unique par colonne et par fichier.');
  return mapping.map(h=>h.trim());
 });
 const headers=[...new Set(maps.flat())];
 if(headers.length>MAX_COLUMNS) fail('Union supérieure à 128 colonnes.');
 const missing=maps.map(m=>headers.filter(h=>!m.includes(h)));
 if(missing.some(m=>m.length)&&!options.union) fail('Confirmez l’union : les colonnes absentes seront remplies de cellules vides.');
 if(sources.reduce((n,s)=>n+s.rows.length,0)>MAX_ROWS) fail('Total supérieur à 100 000 lignes de données.');
 const output=[],origins=[],seen=new Map(),duplicates=[];
 const files=sources.map((s,i)=>({index:i+1,name:s.name,encoding:s.encoding,delimiter:s.delimiter,bytes:s.bytes,inputRows:s.rows.length,outputRows:0,missingColumns:missing[i],mapping:s.headers.map((h,j)=>({index:j+1,source:h,target:maps[i][j]}))}));
 let missingCells=0;
 sources.forEach((s,i)=>{
  const indexes=headers.map(h=>maps[i].indexOf(h));
  s.rows.forEach((row,j)=>{
   const values=indexes.map(index=>index<0?'':row[index]);
   const origin={fileIndex:i+1,file:s.name,line:s.lines[j]};
   const key=JSON.stringify(values);
   if(seen.has(key)) {duplicates.push({origin,first:seen.get(key),removed:Boolean(options.deduplicate)});if(options.deduplicate)return;}
   else seen.set(key,origin);
   missingCells+=missing[i].length;files[i].outputRows++;output.push(values);origins.push(origin);
  });
 });
 const exportHeaders=[...headers];
 if(options.provenance){
  for(const base of ['source_fichier','source_ligne']){let name=base;let n=2;while(exportHeaders.includes(name))name=`${base}_${n++}`;exportHeaders.push(name);}
  output.forEach((row,i)=>row.push(origins[i].file,String(origins[i].line)));
 }
 const neutralizations=[];
 exportHeaders.forEach((v,i)=>{if(needsNeutralization(v))neutralizations.push({header:true,column:i+1});});
 output.forEach((row,j)=>row.forEach((v,i)=>{if(needsNeutralization(v))neutralizations.push({outputRow:j+1,column:i+1,origin:origins[j]});}));
 const report={version:1,method:'vertical-concatenation',options:{confirmed:true,union:Boolean(options.union),deduplicate:Boolean(options.deduplicate),provenance:Boolean(options.provenance)},files,headers:exportHeaders,inputRows:sources.reduce((n,s)=>n+s.rows.length,0),outputRows:output.length,removedRows:duplicates.filter(d=>d.removed).length,duplicates,missingCells,origins,neutralizations,exportConvention:'UTF-8 BOM ; point-virgule ; apostrophe devant formule potentielle, original intact',limits:{maxBytes:MAX_BYTES,maxRows:MAX_ROWS,maxColumns:MAX_COLUMNS,maxCellCharacters:65536},notEvaluated:['Jointures','Exactitude comptable','Devise et comparabilité des périodes','Doublons métier non identiques']};
 return {headers:exportHeaders,rows:output,report};
}
export function exportCsv(result){return serializeCsv([result.headers,...result.rows]);}
