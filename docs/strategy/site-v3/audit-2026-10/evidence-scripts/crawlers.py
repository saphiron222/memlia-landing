import urllib.request,json,pathlib,concurrent.futures
bots=['Googlebot','OAI-SearchBot','Claude-SearchBot','PerplexityBot','GPTBot','ClaudeBot','Google-Extended','Applebot','Applebot-Extended','CCBot'];rows=[]
def get(bot):
 req=urllib.request.Request('https://memlia.fr/',headers={'User-Agent':bot,'Cache-Control':'no-cache'})
 try:
  r=urllib.request.urlopen(req,timeout=20);return {'bot':bot,'status':r.status,'bytes':len(r.read()),'note':'Requête avec cet en-tête, sans vérification IP du robot réel.'}
 except Exception as e:return {'bot':bot,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:rows=list(ex.map(get,bots))
pathlib.Path('docs/strategy/site-v3/audit-2026-10/crawlers.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2));print(rows)
