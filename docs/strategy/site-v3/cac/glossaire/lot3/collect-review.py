import json, hashlib, subprocess
from pathlib import Path
from datetime import datetime, timezone
from urllib.request import urlopen, Request
from html.parser import HTMLParser
root = Path(__file__).parent
pack = json.loads((root/'candidate/docs/strategy/site-v3/glossaire-cac-lot-3.json').read_text())
out = root/'review/captures'
out.mkdir(parents=True, exist_ok=True)
class Visible(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.parts=[]
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style'): self.skip+=1
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
    def handle_data(self, data):
        if not self.skip and data.strip(): self.parts.append(data.strip())
rows=[]
for sid,s in pack['evidence']['sources'].items():
    if s['accessMode']=='http':
        target=out/(sid+'.html')
        r=subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','45','--output',str(target),'--write-out','%{http_code}\n%{url_effective}',s['requestedUrl']],capture_output=True,text=True,timeout=60)
        if r.returncode: raise ValueError(r.stderr)
        status,final=r.stdout.split('\n',1); status=int(status)
        raw=target.read_bytes()
        p=Visible(); p.feed(raw.decode('utf-8'))
        text='\n'.join(p.parts)+'\n'
        (out/(sid+'.txt')).write_text(text)
        old=(root/'candidate'/s['snapshotPath']).read_text()
        start=text.index('NEP '); stop=text.index('Remonter en haut de page',start)
        a=old.index('NEP '); b=old.index('Remonter en haut de page',a)
        same=text[start:stop]==old[a:b]
        if not same: raise ValueError('Corps normatif divergent: '+sid)
        rows.append(dict(sourceId=sid,httpStatus=status,requestedUrl=s['requestedUrl'],finalUrl=final,retrievedAt=datetime.now(timezone.utc).isoformat(),rawSha256=hashlib.sha256(raw).hexdigest(),contentSha256=hashlib.sha256(text.encode()).hexdigest(),normativeBodyMatchesCandidate=same))
    else:
        original=json.loads((root/'candidate'/s['dilaCopyPath']).read_text())
        dest=out/(sid+'.json')
        cmd=['node',str(root/'fresh-main/scripts/export-dila-source.mjs'),original['id'],str(dest)]
        r=subprocess.run(cmd,capture_output=True,text=True,timeout=60)
        (out/(sid+'.export.log')).write_text(r.stdout+r.stderr)
        if r.returncode: raise ValueError(r.stderr)
        equal=dest.read_bytes()==(root/'candidate'/s['dilaCopyPath']).read_bytes()
        if not equal: raise ValueError('Copie A4 divergente: '+sid)
        rows.append(dict(sourceId=sid,accessMode='dila-copy',httpStatus=None,retrievedAt=s['retrievedAt'],reviewExportedAt=datetime.now(timezone.utc).isoformat(),version=s['version'],identicalToLocalA4Export=equal,dilaCopySha256=hashlib.sha256(dest.read_bytes()).hexdigest(),warning=s['warning']))
(root/'review/source-recheck.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'pass':True,'sourceCount':len(rows),'httpReopened':sum(x.get('httpStatus')==200 for x in rows),'dilaLocalExportsCompared':sum(x.get('identicalToLocalA4Export',False) for x in rows)},indent=2))
