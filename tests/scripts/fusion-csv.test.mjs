import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSource, mergeSources, exportCsv, EXAMPLE, MAX_BYTES, validateFiles } from '../../src/lib/fusion-csv.mjs';
const source=(text,name='a.csv',options={})=>parseSource(new TextEncoder().encode(text),{name,encoding:'utf-8',delimiter:';',...options});
const confirmed={confirmed:true,provenance:true};
test('deux exports inversés : cinq lignes et provenance',()=>{
 const result=mergeSources(EXAMPLE.map(f=>source(f.text,f.name)),undefined,confirmed);
 assert.equal(result.rows.length,5);assert.deepEqual(result.rows[2],['003','30','fevrier.csv','2']);
 assert.deepEqual(result.report.files.map(f=>f.inputRows),[2,3]);assert.equal(result.report.outputRows,5);
});
test('mapping explicite, aucune valeur décalée et ordre choisi',()=>{
 const a=source('ID;Valeur\n00123;10');const b=source('Valeur;Identifiant\n20;004','b.csv');
 const r=mergeSources([b,a],[['Valeur','ID'],['ID','Valeur']],confirmed);
 assert.deepEqual(r.rows[0],['20','004','b.csv','2']);assert.deepEqual(r.rows[1],['10','00123','a.csv','2']);
});
test('confirmation obligatoire et union explicite',()=>{
 const a=source('A;B\n1;2'),b=source('B;C\n3;4','b.csv');
 assert.throws(()=>mergeSources([a,b]),/confirmez/i);
 assert.throws(()=>mergeSources([a,b],undefined,confirmed),/union/i);
 const r=mergeSources([a,b],undefined,{...confirmed,union:true});assert.deepEqual(r.rows[0],['1','2','','a.csv','2']);assert.equal(r.report.missingCells,2);
});
test('homonymes gardés mais bloquent le résultat avant mapping unique',()=>{
 const a=source('A;A\n1;2'),b=source('A;B\n3;4','b.csv');
 assert.throws(()=>mergeSources([a,b],undefined,confirmed),/mapping/i);
 assert.equal(mergeSources([a,b],[['A','B'],['A','B']],confirmed).rows.length,2);
 assert.throws(()=>mergeSources([a,b],[['A',' A '],['A','B']],confirmed),/mapping/i);
});
test('zéros, Windows-1252 et retours cités avec lignes physiques',()=>{
 const a=parseSource(Uint8Array.from(Buffer.from('ID;Nom\r\n00123;"Andr\xe9\r\nsuite"\r\n004;Z','latin1')),{name:'cp.csv',encoding:'windows-1252',delimiter:';'});
 assert.equal(a.rows[0][1],'André\r\nsuite');assert.deepEqual(a.lines,[2,4]);
 const r=mergeSources([a,source('ID;Nom\n005;Y','b.csv')],undefined,confirmed);assert.equal(r.rows[1].at(-1),'4');assert.equal(r.rows[0][0],'00123');
});
test('doublons exacts avant provenance : conserver puis retirer et rapport complet',()=>{
 const a=source('A;B\n1;2'),b=source('B;A\n2;1','b.csv');
 const r=mergeSources([a,b],undefined,confirmed);assert.equal(r.rows.length,2);assert.equal(r.report.duplicates.length,1);assert.equal(r.report.removedRows,0);
 const dedup=mergeSources([a,b],undefined,{...confirmed,deduplicate:true});assert.equal(dedup.rows.length,1);assert.equal(dedup.report.removedRows,1);assert.equal(dedup.report.files[1].outputRows,0);
});
test('CSV neutralise formules et en-têtes sans modifier données',()=>{
 const a=source('A;B\n00123;"=HYPERLINK(""x"")"'),b=source('A;B\n2;-10','b.csv');
 const r=mergeSources([a,b],undefined,confirmed);const csv=exportCsv(r);assert.match(csv,/'=HYPERLINK/);assert.match(csv,/'-10/);assert.equal(r.rows[0][1],'=HYPERLINK("x")');assert.equal(r.report.neutralizations.length,2);
});
test('limites total, nombre et refus structures',()=>{
 assert.throws(()=>validateFiles([{size:MAX_BYTES},{size:1}]),/20 Mo/);assert.throws(()=>validateFiles([{size:1}]),/2 à 20/);
 assert.throws(()=>source('A;B\n1'),/colonnes/);assert.throws(()=>source('A;B\n"x;2'),/guillemet/);assert.throws(()=>source('A;B\n\u0000;2'),/binaire/);
});
test('un CSV une colonne accepté, provenance sans collision',()=>{
 const a=source('source_fichier\nx'),b=source('source_fichier\ny','b.csv');const r=mergeSources([a,b],undefined,confirmed);assert.equal(new Set(r.headers).size,r.headers.length);assert.equal(r.rows.length,2);
});
