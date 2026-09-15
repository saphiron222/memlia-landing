"""Remove irrelevant session identifiers from public audit evidence."""
import json,re
from pathlib import Path
P=Path(__file__).parent
f=P/'browser-audit.json';d=json.loads(f.read_text())
for r in d.get('search',[]):
 if '/sorry/' in r.get('url',''):
  r['url']='https://www.google.com/sorry/ [session parameters removed]'
  r['text']=re.sub(r'Adresse IP\s*:.*?(?:\n|$)','Adresse IP : [removed]\n',r.get('text',''))
  r['links']=[{'text':x.get('text',''),'href':'https://www.google.com/sorry/'} if '/sorry/' in x.get('href','') else x for x in r.get('links',[])]
f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
f=P/'public-research.json';d=json.loads(f.read_text())
for r in d['results']:
 r['headers']={k:v for k,v in r.get('headers',{}).items() if k.lower() not in ['set-cookie','cookie']}
f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print('Session identifiers and cookies removed; page text and measurements retained.')
