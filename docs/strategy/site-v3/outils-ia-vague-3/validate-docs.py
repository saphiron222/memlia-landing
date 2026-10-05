"""Contrôle documentaire reproductible, sans test de page future."""
import json,pathlib,hashlib,unicodedata,collections,decimal
from urllib.parse import urlsplit
r=pathlib.Path(__file__).resolve().parent
repo=r.parents[3]
m=json.loads((r/'matrice-skills.json').read_text())
skills=m['skills']; cells=m['cells']; assert len(skills)==64 and len(cells)==640
assert len({s['name'] for s in skills})==64
assert len({(c['skill'],str(c['tool_id'])) for c in cells})==640
for s in skills:
 assert s['read_complete'] and hashlib.sha256(s['content'].encode()).hexdigest()==s['sha256']
 # Corpus embarqué vérifié même si la machine ne possède pas ces skills.
for c in cells:
 assert c['reason'] and c['action_to_brief'] and c['proof_ids']
 assert c['skill'] in {s['name'] for s in skills}
assert len({str(c['tool_id']) for c in cells})==10
counts=dict(collections.Counter(c['status'] for c in cells))
t=json.loads((r/'contrat-routes.json').read_text())['tools']; assert len(t)==10
norm=lambda s:''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
assert len({x['route'] for x in t})==10 and len({norm(x['q']) for x in t})==10
old=json.loads((repo/'docs/strategy/site-v3/mesures/registre-requetes.json').read_text())
# Une requête peut déjà appartenir à cet outil ; seule une autre route concurrence le brief.
for x in t:
 for article in old['articles']:
  if norm(x['q'])==norm(article['requete']):
   assert urlsplit(article['url']).path==x['route'], f"Requête concurrente : {x['q']} — {article['url']}"
for x in t:
 p=r/x['file']; assert p.exists() and x['route'] in p.read_text() and x['q'] in p.read_text()
 assert x['card'] and len(x['tests'])>=5 and len(x['inbound'])>=3
 assert x['route']==next(z['route'] for z in m['tools'] if str(z['id']).zfill(2)==x['id'])
a=json.loads((r/'demande-autocomplete.json').read_text()); assert len(a['results'])==11
assert all(z.get('status')==200 and isinstance(z.get('suggestions'),list) for z in a['results'])
D=decimal.Decimal
T=D(100)*D('.8')*(D(12)*D('.5')-D(1))/D(60)
value=T*D(40); C=D(1000)+D(12)*D(50); net=D(12)*D(200)-C; roi=net/C*100; pay=D(1000)/(D(200)-D(50))
assert T==D(20)/3 and value.quantize(D('.01'))==D('266.67')
assert C==1600 and net==800 and roi==50 and pay.quantize(D('.01'))==D('6.67')
print(json.dumps({'documentary_check':'PASS','briefs':len(t),'routes':len({x['route'] for x in t}),'skills':len(skills),'cells':len(cells),'counts':counts,'tests_defined':sum(len(x['tests']) for x in t),'autocomplete_success':len(a['results']),'roi_oracle':{'hours':str(T),'capacity':str(value),'cost':str(C),'net_cash':str(net),'roi_percent':str(roi),'payback_months':str(pay)},'future_tools_tested':False},ensure_ascii=False,indent=2))
