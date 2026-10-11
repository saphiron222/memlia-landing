// Oracle partagé par la recette CAC et sa régression navigateur.
export function observeCacRequests(page) {
 const requests=[];
 const favicon=new URL('/favicon.svg',page.url()).href;
 page.on('request',request=>{
  if(request.url().startsWith('blob:'))return;
  // Seule l'icône statique locale est passive. Un fetch, un POST, une query
  // ou une destination externe reste une requête suspecte, même nommée favicon.
  if(request.url()===favicon&&request.method()==='GET'&&request.postData()===null&&['image','other'].includes(request.resourceType()))return;
  requests.push(request.url());
 });
 return requests;
}
