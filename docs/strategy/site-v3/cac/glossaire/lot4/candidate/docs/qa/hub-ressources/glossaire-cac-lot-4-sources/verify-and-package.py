"""Exécuter et conserver les reçus du candidat, sans modifier ses sources."""
import json, subprocess, zipfile
from pathlib import Path
BASE=Path('docs/qa/hub-ressources/glossaire-cac-lot-4-sources')
commands={
 'validation':['node',str(BASE/'validate.mjs')],
 'mutations':['node',str(BASE/'mutations.mjs')],
 'tests-dila':['node','--test','tests/scripts/dila-source-copy.test.mjs'],
 'typecheck':['/Users/kevinkitanga/dev/interne/memlia-landing/node_modules/.bin/tsc','--ignoreConfig','--noEmit','--skipLibCheck','--strict','--target','ES2022','--moduleResolution','bundler','--module','ESNext',str(BASE/'shape-check.ts')],
}
for name,cmd in commands.items():
    r=subprocess.run(cmd,capture_output=True,text=True)
    (BASE/f'{name}.log').write_text(r.stdout+r.stderr)
    (BASE/f'{name}-result.json').write_text(json.dumps({'command':cmd,'exitCode':r.returncode,'stdout':r.stdout,'stderr':r.stderr},ensure_ascii=False,indent=2)+'\n')
    assert r.returncode==0,(name,r.stdout,r.stderr)
    print(name,'PASS')
# Vérifier l’archive octet pour octet ; aucun fichier global n’y est inclus.
package=Path('docs/strategy/site-v3/glossaire-cac-lot-4.json')
files=[package]+sorted(p for p in BASE.rglob('*') if p.is_file() and '__pycache__' not in p.parts)
archive=Path('glossaire-cac-lot-4.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in files:z.write(p,str(p))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert set(z.namelist())==set(str(p) for p in files)
    for p in files:assert z.read(str(p))==p.read_bytes()
print(json.dumps({'archive':str(archive.resolve()),'members':len(files),'bytes':archive.stat().st_size,'package':str(package.resolve()),'verified':True},indent=2))
