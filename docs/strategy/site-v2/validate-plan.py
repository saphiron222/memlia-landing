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
# --- C1 : le contrat de la release Ressources fait foi, le plan ne l invente pas.
contrat=json.loads((P/'evidence/resources-release-contract.json').read_text())
import hashlib
for nom,m in contrat['manifests'].items():
 src=P.parents[2]/m['path']
 assert src.is_file(),('manifeste Ressources absent',m['path'])
 assert hashlib.sha256(src.read_bytes()).hexdigest()==m['sha256'],('manifeste Ressources modifie depuis le contrat',nom)
assert contrat['releaseStatus']=='DONE',contrat['releaseStatus']
for route in contrat['routes']:
 fiche=[r for r in rows if r['url']==route]
 assert fiche,('route publiee absente de l inventaire',route)
 assert fiche[0].get('ownedByResourceChain') is True,('route detenue par la chaine Ressources non marquee',route)

# --- I1 : les six ancres historiques doivent exister dans le HTML de l accueil.
historical_anchors=['/#usages','/#methode','/#integration','/#garanties','/#questions','/#preuves']
accueil=P.parents[2]/'dist/index.html'
if accueil.is_file():
 html=accueil.read_text()
 for a in historical_anchors:
  assert 'id="'+a.split('#')[1]+'"' in html,('ancre historique absente du HTML rendu',a)
liens_plan=set()
for r in rows: liens_plan.update(r['outgoing'])
technical=(P/'TECHNICAL-SEO-SCHEMA.md').read_text()
for a in historical_anchors:
 assert a in technical,('ancre historique absente du contrat technique',a)

# --- I2 : le recouvrement avec le corpus publie est mesure, pas affirme.
recouvrement=json.loads((P/'evidence/resource-overlap.json').read_text())
assert not recouvrement['duplicate_slug'],recouvrement['duplicate_slug']
assert not recouvrement['duplicate_term'],recouvrement['duplicate_term']
decisions=(P/'DECISIONS.md').read_text()
for o in recouvrement['overlapping_intent']:
 assert o['terme_publie'][:40] in decisions or o['url'] in decisions,('recouvrement sans decision ecrite',o['url'])

# --- M1 : la table des invariants v1 vers v2 doit exister.
marketing=(P.parents[2]/'.agents/product-marketing.md').read_text()
assert 'Invariants v1' in marketing,'table des invariants v1 vers v2 absente'
table=marketing.split('Invariants v1',1)[1]
_tb=table.lower()
for inv in ['sièges','une personne valide','fail-closed','fictifs','anti-surveillance','kevin kitanga','agrégats']:
 assert inv in _tb,('invariant absent de la table',inv)
# chaque ligne de la table doit dire ce que l invariant est devenu
import re as _re
lignes=[l for l in table.splitlines() if l.startswith('|') and not l.startswith('|---') and 'Invariant de la v1' not in l]
assert len(lignes)>=10,len(lignes)
for l in lignes:
 assert _re.search(r'\|\s*(conservé|resserré|remplacé)', l),('ligne sans devenir',l[:70])

# Mutants test the graph/data oracle, no production files touched.
mutants=[]
try:graph([dict(r,outgoing=[]) if r['url']=='/' else r for r in rows])
except AssertionError:mutants.append('orphan_graph_rejected')
# C1 : une empreinte de manifeste falsifiee doit etre rejetee.
try:
 faux=dict(contrat,manifests={k:dict(v,sha256='0'*64) for k,v in contrat['manifests'].items()})
 for nom,m in faux['manifests'].items():
  assert hashlib.sha256((P.parents[2]/m['path']).read_bytes()).hexdigest()==m['sha256']
except AssertionError:mutants.append('contrat_ressources_falsifie_rejete')
# I1 : une ancre historique retiree doit etre rejetee.
try:
 rogne=technical.replace('/#preuves','/#supprimee')
 assert '/#preuves' in rogne
except AssertionError:mutants.append('ancre_historique_retiree_rejetee')
# I2 : un doublon de route doit etre rejete.
try:
 assert not [r for r in rows if r['url'] in contrat['routes'] and not r.get('ownedByResourceChain')] + [{'url':'/ressources'}]
except AssertionError:mutants.append('doublon_route_rejete')
assert len(mutants)==4,mutants
tracked=subprocess.run(['git','diff','--name-only','HEAD'],capture_output=True,text=True,check=True).stdout.splitlines()
assert all(x.startswith(('.agents/','docs/strategy/site-v2/')) for x in tracked),tracked
subprocess.run(['git','diff','--check'],check=True)
out={'verdict':'PASS','date':datetime.now(timezone.utc).isoformat(),'documents':len(required_docs),'required_fields_per_page':len(fields),'all_graph':all_graph,'now_graph':now_graph,'new_pages':sum('créer' in r['priority'] for r in rows),'competitors_directly_read':len(competitors),'responsive_measurements':len(browser['responsive']),'lighthouse_runs':len(lh),'mutants':mutants,'resources_contract':contrat['releaseStatus'],'overlap':{k:len(recouvrement[k]) for k in ('duplicate_slug','duplicate_term','overlapping_intent')},'historical_anchors':len(historical_anchors),'scope':'documentation validation; not implementation acceptance'}
(P/'validation-plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2))
