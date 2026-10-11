import {importBytes} from './checklist-pieces.mjs';
self.onmessage=async({data})=>{try{const result=importBytes(await data.file.arrayBuffer(),data.format,data.encoding,data.delimiter);self.postMessage({id:data.id,ok:true,result});}catch(e){self.postMessage({id:data.id,ok:false,error:e.message});}};
