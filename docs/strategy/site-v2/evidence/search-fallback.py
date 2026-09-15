import urllib.request,urllib.parse,xml.etree.ElementTree as ET,json
from datetime import datetime,timezone
from pathlib import Path
queries=['automatisation cabinet expertise comptable','automatisation Excel cabinet comptable','suivi production sociale cabinet','contrôle bulletins avant DSN']
out=[]
for q in queries:
 u='https://www.bing.com/search?'+urllib.parse.urlencode({'q':q,'format':'rss','setlang':'fr-fr','cc':'fr'})
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as r: raw=r.read().decode(); status=r.status
  root=ET.fromstring(raw);items=[{k:item.findtext(k) for k in ['title','link','description']} for item in root.findall('.//item')]
  out.append({'query':q,'url':u,'status':status,'items':items})
 except Exception as e:out.append({'query':q,'url':u,'error':str(e)})
Path(__file__).with_name('search-fallback.json').write_text(json.dumps({'date':datetime.now(timezone.utc).isoformat(),'engine':'Bing RSS: non Google, pas de features/PAA/positions certifiées','results':out},ensure_ascii=False,indent=2))
print(json.dumps(out,ensure_ascii=False,indent=2))
