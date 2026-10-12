import json, hashlib, subprocess
from pathlib import Path
from datetime import datetime, timezone
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
root = Path(__file__).parent
pack = json.loads((root/'candidate/docs/strategy/site-v3/glossaire-cac-lot-4.json').read_text())
out = root/'review/captures-recheck'
out.mkdir(parents=True, exist_ok=True)
class Visible(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.parts=[]
    def handle_starttag(self, tag, attrs):
        if tag in ('script','style'): self.skip+=1
        if tag in ('p','div','br','li','h1','h2','h3','tr'): self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
        if tag in ('p','div','li','h1','h2','h3','tr'): self.parts.append('\n')
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)
def collect(item):
    sid,s=item
    if s['accessMode']=='http':
        pdf=sid=='cncc-alpe'
        target=out/(sid+('.pdf' if pdf else '.html'))
        r=subprocess.run(['curl','--fail','--location','--silent','--show-error','--max-time','60','--output',str(target),'--write-out','%{http_code}\n%{url_effective}',s['requestedUrl']],capture_output=True,text=True,timeout=70)
        if r.returncode: raise ValueError(sid+': '+r.stderr)
        status,final=r.stdout.split('\n',1); status=int(status)
        assert status==200
        raw=target.read_bytes()
        row=dict(sourceId=sid,httpStatus=status,requestedUrl=s['requestedUrl'],finalUrl=final,retrievedAt=datetime.now(timezone.utc).isoformat(),rawSha256=hashlib.sha256(raw).hexdigest())
        if pdf:
            assert raw.startswith(b'%PDF')
            assert raw==(root/'candidate'/s['rawPath']).read_bytes(), 'PDF divergent'
            row['rawMatchesCandidate']=True
            row['scope']='Expansion historique ALPE seulement, septembre 2022 ; pas conditions actuelles.'
        else:
            p=Visible(); p.feed(raw.decode('utf-8'))
            text='\n'.join(line.strip() for line in ''.join(p.parts).splitlines() if line.strip())+'\n'
            (out/(sid+'.txt')).write_text(text)
            old=(root/'candidate'/s['snapshotPath']).read_text()
            if sid.startswith('h2a-'):
                start=text.index('NEP '); stop=text.index('Remonter en haut de page',start)
                a=old.index('NEP '); b=old.index('Remonter en haut de page',a)
                same=text[start:stop]==old[a:b]
            else: same=text==old
            assert same, 'Corps officiel divergent: '+sid
            row.update(contentSha256=hashlib.sha256(text.encode()).hexdigest(),officialBodyMatchesCandidate=True)
        return row
    original=json.loads((root/'candidate'/s['dilaCopyPath']).read_text())
    dest=out/(sid+'.json')
    r=subprocess.run(['node',str(root/'fresh-main/scripts/export-dila-source.mjs'),original['id'],str(dest)],capture_output=True,text=True,timeout=60)
    (out/(sid+'.export.log')).write_text(r.stdout+r.stderr)
    assert r.returncode==0, sid+': '+r.stderr
    equal=dest.read_bytes()==(root/'candidate'/s['dilaCopyPath']).read_bytes()
    assert equal, 'Copie A4 divergente: '+sid
    return dict(sourceId=sid,accessMode='dila-copy',httpStatus=None,retrievedAt=s['retrievedAt'],reviewExportedAt=datetime.now(timezone.utc).isoformat(),version=s['version'],identicalToLocalA4Export=equal,dilaCopySha256=hashlib.sha256(dest.read_bytes()).hexdigest(),warning=s['warning'])
with ThreadPoolExecutor(max_workers=4) as pool:
    rows=list(pool.map(collect,pack['evidence']['sources'].items()))
(root/'review/source-recheck.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'pass':True,'sourceCount':len(rows),'httpReopened':sum(x.get('httpStatus')==200 for x in rows),'dilaLocalExportsCompared':sum(x.get('identicalToLocalA4Export',False) for x in rows)},indent=2))
