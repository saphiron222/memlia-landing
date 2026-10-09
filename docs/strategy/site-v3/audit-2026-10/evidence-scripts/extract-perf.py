import json,pathlib,re
D=pathlib.Path('docs/strategy/site-v3/audit-2026-10');reports=[]
for p in (D/'unlighthouse/reports').rglob('lighthouse.html'):
 s=p.read_text();m=re.search(r'window\.__LIGHTHOUSE_JSON__\s*=\s*',s)
 if not m:print('NO JSON',p);continue
 r,_=json.JSONDecoder().raw_decode(s[m.end():]);row={'path':r['requestedUrl'].replace('https://memlia.fr','') or '/','url':r['requestedUrl'],'scores':{k:round(v['score']*100) if v.get('score') is not None else None for k,v in r['categories'].items()},'lcp_ms':r['audits']['largest-contentful-paint']['numericValue'],'cls':r['audits']['cumulative-layout-shift']['numericValue'],'tbt_ms':r['audits']['total-blocking-time']['numericValue'],'settings':r['configSettings'],'audits':{k:v for k,v in r['audits'].items() if v.get('score') is not None and v.get('score')<1},'report':str(p.relative_to(D))};reports.append(row)
(D/'performance.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2));print('TOTAL',len(reports))
for r in sorted(reports,key=lambda r:r['scores']['performance']):print(r['path'],r['scores'],round(r['lcp_ms']),r['cls'],r['tbt_ms'])
