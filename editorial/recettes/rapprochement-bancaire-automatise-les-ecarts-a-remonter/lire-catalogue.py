import json
from pathlib import Path
catalog = json.loads(Path('/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_fa04c2d4c29e45df8aff0447908a2029.txt').read_text())
rows = [x for x in catalog['skills'] if x['name'] in ('blog','seo') or x['name'].startswith(('blog-','seo-'))]
for x in rows:
    print(x['name'], ':', x['description'][:180].replace('\n',' '))
print('TOTAL', len(rows))
