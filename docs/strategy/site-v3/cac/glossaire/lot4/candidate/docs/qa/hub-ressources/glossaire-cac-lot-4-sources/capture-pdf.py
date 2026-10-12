import datetime, hashlib, json, subprocess
from pathlib import Path
BASE=Path('docs/qa/hub-ressources/glossaire-cac-lot-4-sources')
url='https://cdn.cncc.fr/download/cncc-livret-auditsociete-2.pdf'
result=subprocess.run(['curl','--silent','--show-error','--fail','--location','--max-time','60','--write-out','\n%{json}',url],capture_output=True,check=True)
raw,meta=result.stdout.rsplit(b'\n',1); meta=json.loads(meta); assert meta['http_code']==200 and raw.startswith(b'%PDF')
rawpath=BASE/'cncc-alpe.pdf'; rawpath.write_bytes(raw)
retrieved=datetime.datetime.now(datetime.timezone.utc).isoformat()
subprocess.run(['uv','run','--with','pypdf','--no-project','python','-c',"from pypdf import PdfReader; from pathlib import Path; p=Path('"+str(rawpath)+"'); p.with_suffix('.txt').write_text('\\n'.join('PAGE '+str(i+1)+'\\n'+page.extract_text() for i,page in enumerate(PdfReader(p).pages)))"],check=True)
textpath=rawpath.with_suffix('.txt'); sha=lambda b:hashlib.sha256(b).hexdigest()
e={'accessMode':'http','httpStatus':200,'requestedUrl':url,'finalUrl':meta['url_effective'],'retrievedAt':retrieved,'rawPath':str(rawpath),'rawSha256':sha(raw),'snapshotPath':str(textpath),'contentSha256':sha(textpath.read_bytes()),'official':True,'level':'tier-2','versionAttestation':'CNCC, Propos et Débats, Audit et société, septembre 2022, n°2.','applicabilityNote':'Uniquement expansion historique de l’acronyme ALPE ; ne pas réutiliser les seuils ni conditions de 2022.'}
(BASE/'capture-pdf.json').write_text(json.dumps({'cncc-alpe':e},ensure_ascii=False,indent=2)+'\n')
print('CNCC PDF HTTP 200, copie et extraction conservées')
