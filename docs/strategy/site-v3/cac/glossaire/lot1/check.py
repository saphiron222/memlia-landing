from pathlib import Path
import json, zipfile, subprocess, hashlib, datetime
R=Path(__file__).resolve().parent
C=R/'candidate'; O=R/'controls'; O.mkdir(exist_ok=True)
p=C/'docs/strategy/site-v3/glossaire-cac-lot-1.json'
pack=json.loads(p.read_text()); old=json.loads(Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_33e01ca3/glossaire-cac-lot-1.json').read_text())
assert p.read_bytes()==Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_79f71254/glossaire-cac-lot-1.json').read_bytes()
assert pack['entries']==old['entries']
assert pack['evidence']['sources']==old['evidence']['sources']
changed=['audit-legal-context-dila-l821-53','h2a-commonConfusion-h2a-presentation','cncc-context-cncc-representation']
u={x['id']:x for x in pack['evidence']['units']}
assert len(u)==60
assert sum(u[x['id']]==x for x in old['evidence']['units'])==53
for x in old['evidence']['units']:
    if x['id'] not in changed: assert u[x['id']]==x
with zipfile.ZipFile('/Users/kevinkitanga/.hermes/kanban/attachments/t_33e01ca3/glossaire-cac-lot-1.zip') as z:
    copies=[n for n in z.namelist() if n.endswith(('.txt','.html')) or n.endswith('captures.json') or '/dila-' in n]
    for n in copies: assert z.read(n)==(C/n).read_bytes()
results={}
for name,command in [('corrections',['python3','tests-corrections.py']),('format',['node','docs/qa/hub-ressources/glossaire-cac-lot-1-sources/validate.mjs']),('mutations',['node','docs/qa/hub-ressources/glossaire-cac-lot-1-sources/mutations.mjs']),('dila',['node','--test',str(R/'main/tests/scripts/dila-source-copy.test.mjs')]),('shape',['/Users/kevinkitanga/dev/interne/memlia-landing/node_modules/.bin/tsc','--ignoreConfig','--noEmit','--skipLibCheck','--strict','--target','ES2022','--moduleResolution','bundler','--module','ESNext','docs/qa/hub-ressources/glossaire-cac-lot-1-sources/shape-check.ts'])]:
    r=subprocess.run(command,cwd=C,capture_output=True,text=True)
    (O/(name+'.log')).write_text(r.stdout+r.stderr)
    print(name,r.returncode,r.stdout+r.stderr)
    results[name]={'command':command,'exitCode':r.returncode}
    assert r.returncode==0
import copy
for defect,id in zip(['D1','D2','D3'],changed):
    mutant=copy.deepcopy(pack)
    original=next(x for x in old['evidence']['units'] if x['id']==id)
    mutant['evidence']['units']=[original if x['id']==id else x for x in mutant['evidence']['units']]
    f=O/(defect+'.json'); f.write_text(json.dumps(mutant,ensure_ascii=False))
    r=subprocess.run(['python3','tests-corrections.py',str(f)],cwd=C,capture_output=True,text=True)
    (O/(defect+'.log')).write_text(r.stdout+r.stderr)
    results['reintroduced-'+defect]={'exitCode':r.returncode,'expectedExitCode':1}
    assert r.returncode==1
    f.unlink()
verification={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'candidateSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'entries':len(pack['entries']),'units':len(u),'publicEntriesUnchanged':True,'sourcesUnchanged':True,'unchangedUnits':53,'modifiedUnits':3,'newUnits':4,'identicalSourceCopyFiles':len(copies),'results':results}
(O/'VERIFICATION.json').write_text(json.dumps(verification,ensure_ascii=False,indent=2)+'\n')
with zipfile.ZipFile('/Users/kevinkitanga/.hermes/kanban/attachments/t_f87ddaa1/glossaire-cac-lot-3-revue.zip') as z:
    print('REFERENCE SCRIPTS', '\n'.join(n for n in z.namelist() if n.endswith(('.py','.mjs'))))
    for n in z.namelist():
        if n.endswith(('.py','.mjs')) and not n.startswith('candidate/'): z.extract(n,R/'reference')
print(json.dumps(verification,indent=2))
