import concurrent.futures, hashlib, ipaddress, json, socket, urllib.request, urllib.error
from pathlib import Path
from html.parser import HTMLParser
BASE=Path(__file__).resolve().parent
ROOT=BASE.parents[4]
class P(HTMLParser):
 def __init__(self):
  super().__init__(); self.links=[];self.imgs=[];self.meta={};self.canonical=None;self.headers=[];self.text=[];self.jsonld=[];self.tag=None;self.buf='';self.capture=False
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='a':self.links.append(d.get('href',''))
  if t=='img':self.imgs.append(d)
  if t=='meta':self.meta[d.get('name') or d.get('property','')]=d.get('content')
  if t=='link' and d.get('rel')=='canonical':self.canonical=d.get('href')
  if t in ('title','h1','h2','h3'):self.tag=t;self.buf=''
  if t=='script' and d.get('type')=='application/ld+json':self.capture=True;self.buf=''
 def handle_data(self,d):
  if self.tag or self.capture:self.buf+=d
  if not self.capture:self.text.append(d)
 def handle_endtag(self,t):
  if t==self.tag:self.headers.append([t,self.buf.strip()]);self.tag=None;self.buf=''
  if t=='script' and self.capture:
   try:self.jsonld.append(json.loads(self.buf))
   except Exception:self.jsonld.append({'parse_error':True})
   self.capture=False;self.buf=''
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
opener=urllib.request.build_opener(NoRedirect)
for addr in socket.getaddrinfo('memlia.fr',443):
 if not ipaddress.ip_address(addr[4][0]).is_global:raise RuntimeError('Nonpublic address')
slugs=[f.stem for f in (ROOT/'src/content/blog').glob('*.md')]
paths=['/blog/'+s for s in slugs]+['/blog','/robots.txt','/sitemap-index.xml','/sitemap-0.xml','/rss.xml']
def fetch(path):
 url='https://memlia.fr'+path
 try:
  response=opener.open(urllib.request.Request(url,headers={'User-Agent':'MemliaSEOReadOnly/1.0'}),timeout=25)
  raw=response.read(2000001)
  if len(raw)>2000000:raise RuntimeError('HTML cap exceeded')
  text=raw.decode('utf-8'); filename=path.strip('/').replace('/','__') or 'home'
  (BASE/'live').mkdir(exist_ok=True);(BASE/'live'/filename).write_text(text)
  p=P();p.feed(text)
  return {'url':url,'status':response.status,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'canonical':p.canonical,'meta':p.meta,'headings':p.headers,'images':p.imgs,'links':p.links,'schema':p.jsonld,'proofFigures':text.count('data-blog-proof'),'source_file':'live/'+filename}
 except urllib.error.HTTPError as e:return {'url':url,'status':e.code,'error':str(e),'headers':dict(e.headers)}
 except Exception as e:return {'url':url,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:results=list(ex.map(fetch,paths))
(BASE/'live-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps([{'url':r['url'],'status':r.get('status'),'canonical':r.get('canonical'),'robots':r.get('meta',{}).get('robots'),'h2':sum(h[0]=='h2' for h in r.get('headings',[])),'images':len(r.get('images',[])),'figures':r.get('proofFigures'),'error':r.get('error')} for r in results],ensure_ascii=False,indent=2))
