import {decodeInvoiceFile,MAX_BYTES} from './relance-facture.mjs';
export async function executeRequest({file,encoding,delimiter}) {
 if(!file||file.size>MAX_BYTES)throw new Error('Fichier absent ou supérieur à 5 Mo : refus avant lecture.');
 return decodeInvoiceFile(new Uint8Array(await file.arrayBuffer()),encoding,delimiter);
}
export function startImport(request,WorkerClass) {
 let worker,settled=false,resolvePromise,rejectPromise;
 const promise=new Promise((resolve,reject)=>{resolvePromise=resolve;rejectPromise=reject;});
 const cancel=()=>{if(settled)return;settled=true;worker?.terminate();resolvePromise({cancelled:true});};
 try {
  worker=new WorkerClass();
  worker.onmessage=({data})=>{if(settled)return;settled=true;worker.terminate();data.error?rejectPromise(new Error(data.error)):resolvePromise({cancelled:false,invoices:data.invoices});};
  worker.onerror=event=>{if(settled)return;settled=true;worker.terminate();rejectPromise(new Error(event.message||'Worker indisponible.'));};
  worker.postMessage(request);
 }catch(error){settled=true;worker?.terminate();rejectPromise(error);}
 return {promise,cancel};
}
if(typeof self!=='undefined'&&typeof document==='undefined'&&typeof self.postMessage==='function')self.onmessage=async({data})=>{try{self.postMessage({invoices:await executeRequest(data)});}catch(error){self.postMessage({error:error.message});}};
