import json
from pathlib import Path
p=Path(__file__).parent
for name in ['public-research.json','browser-audit.json','existing-cards.json','lighthouse-summary.json']:
 d=json.loads((p/name).read_text()); print('\nFILE',name)
 if name=='public-research.json':
  for r in d['results']:print(r['url'],r.get('status',r.get('error')),r.get('text','')[:2200])
 elif name=='lighthouse-summary.json':
  for r in d:print({k:r[k] for k in ['route','formFactor','scores','metrics']})
 else:print(json.dumps(d,ensure_ascii=False)[:22000])
