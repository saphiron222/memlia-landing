// Classify timing separately from safety: both phases keep the same boundary.
export function networkViolation(request,{origin,iconUrl}) {
 if(request.method!=='GET'||request.hasBody)return 'method/body';
 const url=new URL(request.url);
 if(url.origin!==origin)return 'origin';
 if(url.search||url.hash||url.username||url.password)return 'url-data';
 if(request.phase==='load')return null;
 if(request.type==='script'&&url.pathname.startsWith('/_astro/'))return null;
 // Chromium loads the document's icon independently of fonts.ready. A fetch
 // to the identical URL is NOT a browser icon request and must still fail.
 if(request.type==='other'&&request.url===iconUrl)return null;
 return 'operation';
}

export function observeNetwork(context) {
 let phase='load';
 const requests=[];
 context.on('request',request=>requests.push({
  phase,url:request.url(),type:request.resourceType(),method:request.method(),
  hasBody:request.postDataBuffer()!==null,
 }));
 return {requests,startOperations(){phase='operations';}};
}
