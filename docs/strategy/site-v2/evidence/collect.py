"""Read-only public research and local environment evidence."""
import json, re, subprocess, urllib.request, urllib.parse, concurrent.futures
from pathlib import Path
from datetime import datetime, timezone
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent
class Text(HTMLParser):
 def __init__(self): super().__init__(); self.skip=0; self.text=[]; self.links=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ['script','style']: self.skip+=1
  if t=='a' and a.get('href'): self.links.append(a['href'])
 def handle_endtag(self,t):
  if t in ['script','style']: self.skip=max(0,self.skip-1)
 def handle_data(self,d):
  if not self.skip and d.strip(): self.text.append(d.strip())
def fetch(u):
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'})
  with urllib.request.urlopen(req,timeout=35) as r:
   h=r.read(2500000).decode('utf-8','replace'); p=Text();p.feed(h)
   return dict(url=u,final_url=r.url,status=r.status,headers=dict(r.headers),text=' '.join(p.text)[:38000],links=p.links)
 except Exception as e:return dict(url=u,error=str(e))
queries=['automatisation cabinet expertise comptable','automatisation Excel cabinet comptable','suivi production sociale cabinet','contrôle bulletins avant DSN']
urls=['https://www.inqom.com/','https://dext.com/fr','https://www.pennylane.com/fr','https://myunisoft.fr/','https://www.silae.fr/','https://memlia.fr/mentions-legales','https://memlia.fr/ressources','https://developers.google.com/search/docs/appearance/ai-features','https://developers.google.com/search/docs/fundamentals/creating-helpful-content']
urls+=['https://www.google.com/search?'+urllib.parse.urlencode({'q':q,'hl':'fr','gl':'fr','num':10}) for q in queries]
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=5).map(fetch,urls))
ROOT.joinpath('public-research.json').write_text(json.dumps({'fetched_at':datetime.now(timezone.utc).isoformat(),'results':results},ensure_ascii=False,indent=2))
for r in results:print(r['url'],r.get('status',r.get('error')),r.get('text','')[:2800])
spill=Path('/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_YinDJpU7R4aqercB4oPo4Ny3.txt')
d=json.loads(spill.read_text());print('RESOURCES',json.dumps({'task':{k:d['task'][k] for k in ['id','title','status','workspace_path','result']},'children':d['children'],'comments':d['comments'][-3:]},ensure_ascii=False)[:11000])
repo=Path('/Users/kevinkitanga/dev/interne/memlia-landing')
print('LOCAL_DEPENDENCIES',[(str(p),p.exists()) for p in [repo/'node_modules/@playwright/test',repo/'node_modules/lighthouse']])
print('GIT_WORKTREES',subprocess.run(['git','worktree','list','--porcelain'],capture_output=True,text=True).stdout)
