import json,pathlib,collections,urllib.parse,re
D=pathlib.Path('docs/strategy/site-v3/audit-2026-10');c=json.loads((D/'crawl.json').read_text());ps=c['pages'];idx={p['url']:p for p in ps};rows=[]
def flat(x):
 if isinstance(x,dict):return [x]+sum((flat(v) for v in x.values()),[])
 if isinstance(x,list):return sum((flat(v) for v in x),[])
 return []
for p in ps:
 errors=[];types=[];nodes=flat(p['schemas'])
 for n in nodes:
  t=n.get('@type');ts=[t] if isinstance(t,str) else t or [];types+=ts
  for ty,fields in [('BlogPosting',['headline','author','datePublished','image']),('WebApplication',['name','applicationCategory','operatingSystem']),('BreadcrumbList',['itemListElement']),('Service',['name','provider'])]:
   if ty in ts:
    for f in fields:
     if f not in n:errors.append(ty+' missing '+f)
  if 'error' in n:errors.append('JSON invalid')
 for n in nodes:
  if n.get('@type')=='BlogPosting':
   h1=' '.join(h[1] for h in p['headings'] if h[0]=='h1')
   if n.get('headline')!=h1:errors.append('headline/H1 mismatch')
   if p['meta'].get('og:title')!=h1:errors.append('og:title/H1 mismatch')
 links=[urllib.parse.urljoin(p['url'],l).split('#')[0] for l in p['links']]
 rows.append({'path':p['path'],'types':sorted(set(types)),'errors':errors,'internal_links':sorted(set(l for l in links if l in idx)),'in_sitemap':p['url'] in c['sitemap_urls']})
(D/'schema-links.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print('SCHEMA ERRORS',[r for r in rows if r['errors']]);print('DUP TITLES',[k for k,v in collections.Counter(p['title'] for p in ps if p['status']==200).items() if v>1]);print('DUP DESCS',[k for k,v in collections.Counter(p['meta'].get('description') for p in ps if p['status']==200).items() if v>1]);print('HOME BYTES',ps[0]['bytes'],'MAX',max(p['bytes'] for p in ps));print('GLOSSAIRE',len(re.findall('id="terme-',(D/'html/glossaire.html').read_text())));
for p in ps:
 if p['path']=='/contact':print('CONTACT',p['text'][-10000:])
