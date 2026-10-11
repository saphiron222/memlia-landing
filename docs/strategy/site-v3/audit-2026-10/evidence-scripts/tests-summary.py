import pathlib,json
D=pathlib.Path('docs/strategy/site-v3/audit-2026-10');r=json.loads((D/'tools-tests.json').read_text());print('STATS',r['stats']);rows=[]
def walk(s):
 for sp in s.get('specs',[]):
  for t in sp['tests']:
   rows.append({'file':sp['file'],'title':sp['title'],'status':t['status'],'expected':t['expectedStatus'],'errors':[e.get('message','') for v in t.get('results',[]) for e in v.get('errors',[])]})
 for x in s.get('suites',[]):walk(x)
walk(r);(D/'tools-tests-summary.json').write_text(json.dumps({'stats':r['stats'],'tests':rows},ensure_ascii=False,indent=2));
for p in rows:
 if p['status']!='expected':print('FAILED',p)
print('TESTS',len(rows));
