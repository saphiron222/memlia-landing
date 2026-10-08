import { parseSource, mergeSources, exportCsv, EXAMPLE, validateFiles } from '../lib/fusion-csv.mjs';
let sources=[],result=null;
self.onmessage=async ({data:m})=>{
 try{
  if(m.kind==='import'){
   const files=m.example?EXAMPLE.map(f=>({...f,size:new TextEncoder().encode(f.text).length,encoding:'utf-8',delimiter:';'})):m.files;
   validateFiles(files);
   const candidate=[];
   for(const f of files){const bytes=m.example?new TextEncoder().encode(f.text):new Uint8Array(await f.file.arrayBuffer());candidate.push(parseSource(bytes,f));}
   sources=candidate;result=null;
   self.postMessage({id:m.id,kind:'import',files:sources.map(s=>({name:s.name,headers:s.headers,count:s.rows.length,preview:s.rows.slice(0,5)}))});
  }else if(m.kind==='merge'){
   result=null;result=mergeSources(m.order.map(i=>sources[i]),m.mappings,m.options);
   self.postMessage({id:m.id,kind:'result',headers:result.headers,rows:result.rows.slice(0,25),report:result.report});
  }else if(m.kind==='page'){
   if(!result)throw new Error('Préparez un résultat avant l’aperçu.');
   self.postMessage({id:m.id,kind:'page',rows:result.rows.slice(m.page*25,m.page*25+25)});
  }else if(m.kind==='export'){
   if(!result)throw new Error('Préparez un résultat avant l’export.');
   self.postMessage({id:m.id,kind:'export',action:m.action,revision:m.revision,format:m.format,content:m.format==='report'?JSON.stringify(result.report,null,2):exportCsv(result)});
  }
 }catch(e){self.postMessage({id:m.id,kind:'error',error:e.message});}
};
