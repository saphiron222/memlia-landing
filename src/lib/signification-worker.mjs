import * as m from './signification.mjs';
self.onmessage=async({data})=>{
 try{
  let result;
  if(data.action==='csv')result=m.readCsvBytes(await data.file.arrayBuffer(),data.delimiter);
  else if(data.action==='map')result=m.mapImport(data.parsed,data.mapping);
  else if(data.action==='append')result=m.appendImport(data.session,data.rows);
  else if(data.action==='restore'){
   if(data.files.some(f=>f.size>m.MAX_BYTES))throw new Error('JSON supérieur à 20 Mo.');
   result=m.importParts(await Promise.all(data.files.map(f=>f.text())));
  }
  else if(data.action==='export'){
   if(data.format==='json')result=m.exportParts(data.session);
   else result=[{filename:`seuil-signification.${data.format}`,content:data.format==='csv'?m.exportCsv(data.session):m.exportReport(data.session,data.final)}];
  }else throw new Error('Action inconnue.');
  self.postMessage({ok:true,result});
 }catch(e){self.postMessage({ok:false,error:e.message});}
};
