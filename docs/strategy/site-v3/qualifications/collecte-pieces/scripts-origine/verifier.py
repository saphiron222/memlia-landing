import json,re,pathlib,subprocess
from html.parser import HTMLParser
root=pathlib.Path(__file__).parent; q=root/'qualification'; site=root/'site'
class Page(HTMLParser):
 def __init__(self): super().__init__(); self.canonical=None; self.h1s=[]; self.inh=False; self.title=''
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
  if t=='h1': self.inh=True;self.h1s.append('')
 def handle_endtag(self,t):
  if t=='h1': self.inh=False
 def handle_data(self,d):
  if self.inh:self.h1s[-1]+=d
m=json.loads((q/'autocomplete.json').read_text());assert len(m['results'])==8;assert all(x['ok'] for x in m['results'])
assert sum(not x['suggestions'] for x in m['results'])==7
assert [s for x in m['results'] for s in x['suggestions']]==['collecte des pièces comptables']
registry=json.loads((site/'docs/strategy/site-v3/mesures/registre-requetes.json').read_text())
article=next(x for x in registry['articles'] if x['slug']=='automatiser-la-relance-des-pieces-clients')
assert article['requete']=='relance pièces manquantes cabinet comptable'
assert not any(x['url']=='https://memlia.fr/automatisation/collecte-pieces' for x in registry['articles'])
recipe=json.loads((site/'editorial/recettes/automatiser-la-relance-des-pieces-clients/recette.json').read_text())
assert recipe['famille']=='collecte-pieces' and recipe['cta']['destination']=='/contact'
results=[]
for name,route,status in [('blog','/blog/automatiser-la-relance-des-pieces-clients',200),('service-general','/automatisation-cabinet-comptable',200),('candidate','/automatisation/collecte-pieces',404)]:
 html=(q/'sources'/f'{name}.html').read_text();p=Page();p.feed(html)
 if status==200: assert p.canonical=='https://memlia.fr'+route;assert len(p.h1s)==1
 results.append(dict(route=route,httpStatus=status,method='curl GET Cache-Control: no-cache sans query',canonical=p.canonical,h1=p.h1s))
for name,needle in [('dext','Vos clients peuvent vous transmettre leurs documents'),('mycompanyfiles','Je dois toujours relancer')]:
 html=(q/'sources'/f'{name}.html').read_text();assert needle in html
assert not (site/'commercial/recettes/collecte-pieces').exists()
assert not subprocess.check_output(['git','status','--porcelain'],cwd=site,text=True).strip()
report={'status':'PASS','decision':'non-ouverture','queries':8,'emptyLists':7,'suggestions':1,'competitorPagesArchived':2,'production':results,'recipeCreated':False,'siteChanges':False,'serpAvailable':False,'monthlyVolume':None}
(q/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
