import { importLettrage, analyseLettrage, exportLettrage, MAX_BYTES } from '../lib/lettrage.mjs';
let result=null;
self.onmessage=async ({data:m})=>{
  try {
    if(m.kind==='load'){
      if(m.file.size>MAX_BYTES)throw new Error('Fichier supérieur à 10 Mo : import refusé.');
      const bytes=new Uint8Array(await m.file.arrayBuffer());
      const imported=importLettrage(bytes,{encoding:m.encoding,delimiter:m.delimiter});
      self.postMessage({id:m.id,kind:'progress',count:imported.lines.length});
      result=analyseLettrage(imported);
      self.postMessage({id:m.id,kind:'result',result});
    }else if(m.kind==='export'){
      if(!result)throw new Error('Importez d’abord un fichier.');
      self.postMessage({id:m.id,kind:'export',action:m.action,content:exportLettrage(result,m.decisions)});
    }
  }catch(e){self.postMessage({id:m.id,kind:'error',error:e instanceof Error?e.message:'Traitement local refusé.'});}
};
