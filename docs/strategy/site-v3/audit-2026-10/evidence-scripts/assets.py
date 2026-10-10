import json,pathlib,urllib.request,urllib.parse,concurrent.futures,collections,re
D=pathlib.Path('docs/strategy/site-v3/audit-2026-10');ps=json.loads((D/'crawl.json').read_text())['pages'];assets=set();fragments=[];known={p['url']:p for p in ps}
for p in ps:
 for i in p['images']:
  for k in ['src','srcset']:
   for x in i.get(k,'').split(','):
    if x:assets.add(urllib.parse.urljoin(p['url'],x.strip().split()[0]))
 for l in p['links']:
  u=urllib.parse.urljoin(p['url'],l);q=urllib.parse.urlparse(u)
  if q.netloc!='memlia.fr':continue
  if q.fragment:fragments.append((p['path'],u))
  if pathlib.Path(q.path).suffix:assets.add(u.split('#')[0])
def get(u):
 try:
  r=urllib.request.urlopen(urllib.request.Request(u,headers={'Cache-Control':'no-cache','User-Agent':'MemliaAudit/1.0'}),timeout=30);raw=r.read();return {'url':u,'status':r.status,'bytes':len(raw),'type':r.headers.get('Content-Type')}
 except Exception as e:return {'url':u,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:res=list(ex.map(get,sorted(assets)))
missing=[]
for source,u in fragments:
 target,frag=u.split('#',1);p=known.get(target)
 if not p:continue
 html=(D/p['html_file']).read_text()
 if not re.search(r'(?:id|name)=[\"\']'+re.escape(urllib.parse.unquote(frag))+r'[\"\']',html):missing.append({'source':source,'target':u})
r={'assets':res,'broken_fragments':missing};(D/'assets.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print('ASSETS',len(res),'FAILED',[x for x in res if x.get('status')!=200]);print('BIG',sorted([x for x in res if x.get('type','').startswith('image/') and x.get('bytes',0)>153600],key=lambda x:-x['bytes']));print('FRAGMENTS',missing)
