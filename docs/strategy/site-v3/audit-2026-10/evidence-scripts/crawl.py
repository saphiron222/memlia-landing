import urllib.request, urllib.error, urllib.parse, json, pathlib, time, concurrent.futures, xml.etree.ElementTree as ET
from html.parser import HTMLParser
OUT=pathlib.Path('docs/strategy/site-v3/audit-2026-10'); OUT.mkdir(parents=True,exist_ok=True)
def fetch(u):
 try:
  r=urllib.request.urlopen(urllib.request.Request(u,headers={'Cache-Control':'no-cache','User-Agent':'MemliaAudit/1.0'}),timeout=30)
  return r.status,r.geturl(),dict(r.headers),r.read().decode('utf8','replace')
 except urllib.error.HTTPError as e:return e.code,u,dict(e.headers),e.read().decode('utf8','replace')
class P(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.links=[];self.img=[];self.head=[];self.text=[];self.schemas=[];self.canonical=[];self.tag='';self.skip=0;self.ld=False;self.buf='';self.title=''
 def handle_starttag(self,t,a):
  a=dict(a);self.tag=t
  if t=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t=='a':self.links.append(a.get('href',''))
  if t=='img':self.img.append(a)
  if t in ('script','style'):self.skip+=1
  if t=='script' and a.get('type')=='application/ld+json':self.ld=True;self.buf=''
 def handle_endtag(self,t):
  if t=='script' and self.ld:
   try:self.schemas.append(json.loads(self.buf))
   except:self.schemas.append({'error':'invalid JSON'})
   self.ld=False
  if t in ('script','style'):self.skip=max(0,self.skip-1)
  self.tag=''
 def handle_data(self,d):
  if self.ld:self.buf+=d
  if self.skip:return
  if self.tag=='title':self.title+=d
  if self.tag in ('h1','h2','h3'):self.head.append([self.tag,d.strip()])
  if d.strip():self.text.append(d.strip())
def parse(u):
 st,final,headers,html=fetch(u);p=P();p.feed(html)
 path=urllib.parse.urlparse(u).path
 (OUT/'html').mkdir(exist_ok=True)
 file=(path.strip('/').replace('/','__') or 'home')+'.html';(OUT/'html'/file).write_text(html)
 return dict(url=u,path=path,status=st,final=final,headers=headers,title=p.title,meta=p.meta,canonical=p.canonical,headings=p.head,images=p.img,links=p.links,schemas=p.schemas,text=' '.join(p.text),bytes=len(html.encode()),html_file='html/'+file)
st,_,_,robot=fetch('https://memlia.fr/robots.txt');(OUT/'robots.txt').write_text(robot)
st,_,_,s=fetch('https://memlia.fr/sitemap.xml');(OUT/'sitemap.xml').write_text(s)
root=ET.fromstring(s);locs=[x.text for x in root.iter() if x.tag.endswith('loc')];urls=[]
for loc in locs:
 if loc.endswith('.xml'):
  _,_,_,v=fetch(loc);(OUT/loc.rsplit('/',1)[1]).write_text(v);urls += [x.text for x in ET.fromstring(v).iter() if x.tag.endswith('loc')]
 else:urls.append(loc)
seeds=set(urls);queue=list(seeds|{'https://memlia.fr/mentions-legales','https://memlia.fr/confidentialite','https://memlia.fr/404'});seen=set();pages=[]
while queue:
 batch=[u for u in queue if u not in seen];queue=[];seen.update(batch)
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
  for p in ex.map(parse,batch):
   pages.append(p)
   for l in p['links']:
    u=urllib.parse.urljoin(p['url'],l).split('#')[0];q=urllib.parse.urlparse(u)
    if q.netloc=='memlia.fr' and not q.query and not pathlib.Path(q.path).suffix and u not in seen:queue.append(u)
 print('crawled',len(pages),flush=True);time.sleep(1)
 if len(pages)>500:break
(OUT/'crawl.json').write_text(json.dumps({'sitemap_urls':sorted(seeds),'pages':sorted(pages,key=lambda p:p['path'])},ensure_ascii=False,indent=2))
_,_,_,ll=fetch('https://memlia.fr/llms.txt');(OUT/'llms.txt').write_text(ll)
print('FINISHED',len(pages))
