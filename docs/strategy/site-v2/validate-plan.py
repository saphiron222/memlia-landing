"""Validate the actual plan, not only existence of a report."""
import json,re,subprocess
from pathlib import Path
from collections import deque
from datetime import datetime,timezone
P=Path(__file__).resolve().parent
required_docs=['SEO-STRATEGY','CURRENT-AUDIT','COMPETITOR-ANALYSIS','SITE-STRUCTURE','PAGE-INVENTORY','GLOBAL-MESSAGING','INTERNAL-LINKING','DESIGN-SYSTEM-EXTENSION','TECHNICAL-SEO-SCHEMA','CONTENT-ROADMAP','IMPLEMENTATION-ROADMAP','DECISIONS']
for n in required_docs:
 f=P/(n+'.md');assert f.exists() and len(f.read_text())>500,n
assert (P.parents[2]/'.agents/product-marketing.md').exists()
rows=json.loads((P/'page-inventory.json').read_text()); urls=[r['url'] for r in rows];assert len(urls)==len(set(urls))
fields=['persona','jtbd','intent','primary_keyword','secondary_keywords','volume','difficulty','funnel','mission','proof','cta','schema','parent','incoming','outgoing','priority','quality','nav','indexability','title','description']
for r in rows:
 for k in fields:
  assert k in r and (r[k] or (k=='incoming' and r['url']=='/')),(r['url'],k)
 assert r['url']=='/' or (r['url'].startswith('/') and not r['url'].endswith('/'))
 assert r['volume']=='ND' and r['difficulty']=='ND'
 assert all(x in urls for x in r['outgoing'])
 assert r['incoming']==[s['url'] for s in rows if r['url'] in s['outgoing']]
 assert r['url']=='/' or r['parent'] in urls
 markdown=(P/'PAGE-INVENTORY.md').read_text()
 marker='## '+r['url']+'\n'
 assert marker in markdown
 section=markdown.split(marker,1)[1].split('\n## ',1)[0]
 for k in fields:
  assert '- **'+k+'** :' in section,(r['url'],'missing Markdown field',k)
keys=[r['primary_keyword'] for r in rows];assert len(keys)==len(set(keys))
def graph(rs):
 d={r['url']:r for r in rs};dist={'/':0};q=deque(['/'])
 while q:
  u=q.popleft()
  for v in d[u]['outgoing']:
   if v in d and v not in dist:dist[v]=dist[u]+1;q.append(v)
 assert set(dist)==set(d),set(d)-set(dist)
 assert max(dist.values())<=3
 return {'pages':len(d),'edges':sum(v in d for r in rs for v in r['outgoing']),'max_clicks':max(dist.values()),'orphans':0}
all_graph=graph(rows);now_graph=graph([r for r in rows if not r['priority'].startswith('P2')])
research=json.loads((P/'evidence/public-research.json').read_text())
competitors=['https://www.inqom.com/','https://dext.com/fr','https://www.pennylane.com/fr','https://myunisoft.fr/','https://www.silae.fr/']
for u in competitors:assert any(r['url']==u and r.get('status')==200 and len(r.get('text',''))>500 for r in research['results']),u
browser=json.loads((P/'evidence/browser-audit.json').read_text());assert len(browser['responsive'])==12
assert sorted(set(r['width'] for r in browser['responsive']))==[320,375,768,1024,1440,1920]
lh=json.loads((P/'evidence/lighthouse-summary.json').read_text());assert len(lh)==4
for name in ['home','blog']:
 for w in [375,1440]: assert (P/f'evidence/screenshots/{name}-{w}-scrolled.png').stat().st_size>1000
# Mutants test the graph/data oracle, no production files touched.
mutants=[]
try:graph([dict(r,outgoing=[]) if r['url']=='/' else r for r in rows])
except AssertionError:mutants.append('orphan_graph_rejected')
assert len(mutants)==1
tracked=subprocess.run(['git','diff','--name-only','HEAD'],capture_output=True,text=True,check=True).stdout.splitlines()
assert all(x.startswith(('.agents/','docs/strategy/site-v2/')) for x in tracked),tracked
subprocess.run(['git','diff','--check'],check=True)
out={'verdict':'PASS','date':datetime.now(timezone.utc).isoformat(),'documents':len(required_docs),'required_fields_per_page':len(fields),'all_graph':all_graph,'now_graph':now_graph,'new_pages':sum('créer' in r['priority'] for r in rows),'competitors_directly_read':len(competitors),'responsive_measurements':len(browser['responsive']),'lighthouse_runs':len(lh),'mutants':mutants,'scope':'documentation validation; not implementation acceptance'}
(P/'validation-plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2))
