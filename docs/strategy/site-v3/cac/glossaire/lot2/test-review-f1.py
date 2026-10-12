import json,pathlib,subprocess,copy,sys
w=pathlib.Path(__file__).parent
p=json.loads((w/'corrected/docs/strategy/site-v3/glossaire-cac-lot-2.json').read_text())
results=[]
for case in ['omit-claim','wrong-source','missing-definition-citation']:
 q=copy.deepcopy(p)
 if case=='omit-claim': q['evidence']['units']=[u for u in q['evidence']['units'] if u.get('claimId')!='assertions-audit-context-f1-2']
 elif case=='wrong-source': q['evidence']['units'][0]['sourceId']='h2a-nep-200'
 else: q['evidence']['units'][2]['citations'][0]['locator']='h2a-nep-315:paragraphe-17:ligne-104'
 f=w/('negative-'+case+'.json');f.write_text(json.dumps(q,ensure_ascii=False))
 r=subprocess.run([sys.executable,str(w/'verify-f1.py'),str(f)],capture_output=True,text=True)
 assert r.returncode!=0 and 'AssertionError' in r.stderr
 results.append({'case':case,'rejected':True,'exitCode':r.returncode})
report={'pass':True,'cases':results}
(w/'review/independent-f1-negative-check.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
