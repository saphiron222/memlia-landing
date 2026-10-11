/** Dedicated Worker: cancel by termination, not by a message queued behind parsing.
 * startCsvWorkerJob({operation:'parse'|'preview'|'import', text OR file, delimiter,
 *   mapping, defaults, selectedRows, selectionValidated, session}, {signal, WorkerClass})
 * returns {promise, cancel}. Cancel resolves {complete:false,cancelled:true,data:null}.
 * No partial parsed rows or session can be exported as a completed result.
 */
import {MAX_BYTES,parseCsv,decodeCsv,previewCsv,importCsv,importSessionFiles} from './circularisation.mjs';
export async function executeWorkerRequest(request) {
 if(!request || !['parse','preview','import','resume'].includes(request.operation)) throw new Error('Opération Worker inconnue.');
 if(request.operation==='resume') {
  const files=request.files??(request.file?[request.file]:[]);
  if(!files.length || files.some(file=>file.size>MAX_BYTES)) throw new Error('JSON absent ou supérieur à 20 Mo par fichier.');
  return importSessionFiles(await Promise.all(files.map(file=>file.text())));
 }
 let parsed;
 if(request.file) {
  if(request.file.size>MAX_BYTES) throw new Error('Fichier supérieur à 20 Mo.');
  const bytes=new Uint8Array(await request.file.arrayBuffer());
  parsed=decodeCsv(bytes,{encoding:request.encoding??'utf-8',delimiter:request.delimiter});
 } else parsed=parseCsv(request.text,{delimiter:request.delimiter});
 if(request.operation==='parse') return parsed;
 if(request.operation==='preview') return {parsed,preview:previewCsv(parsed,request)};
 return importCsv(request.session,parsed,request);
}
export function startCsvWorkerJob(request,{signal,WorkerClass}={}) {
 if(typeof WorkerClass!=='function') throw new Error('Traitement en arrière-plan indisponible : import volumineux refusé.');
 let worker=null,settled=false,resolvePromise,rejectPromise;
 const promise=new Promise((resolve,reject)=>{resolvePromise=resolve;rejectPromise=reject;});
 const cleanup=()=>{signal?.removeEventListener('abort',cancel); worker?.terminate();};
 const cancel=()=>{if(settled)return; settled=true; cleanup(); resolvePromise({complete:false,cancelled:true,data:null});};
 if(signal?.aborted) {cancel(); return {promise,cancel};}
 try {
  // The browser receives the bundled ?worker constructor; the Node adapter loads this entry.
  worker=new WorkerClass(new URL(import.meta.url));
  worker.onmessage=({data})=>{if(settled)return; settled=true; cleanup(); if(data.complete!==true) rejectPromise(new Error(data.error||'Traitement incomplet.')); else resolvePromise({complete:true,cancelled:false,data:data.data});};
  worker.onerror=event=>{if(settled)return;settled=true;cleanup();rejectPromise(new Error(event.message||'Erreur du Worker.'));};
  signal?.addEventListener('abort',cancel,{once:true}); worker.postMessage(request);
 } catch(error) {settled=true; cleanup(); rejectPromise(error);}
 return {promise,cancel};
}
if(typeof self!=='undefined' && typeof document==='undefined' && typeof self.postMessage==='function') {
 self.onmessage=async ({data})=>{try {self.postMessage({complete:true,data:await executeWorkerRequest(data)});} catch(error) {self.postMessage({complete:false,error:error.message});}};
}
