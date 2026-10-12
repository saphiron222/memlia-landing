import concurrent.futures, datetime, hashlib, json, re, subprocess
from html.parser import HTMLParser
from pathlib import Path
BASE = Path('docs/qa/hub-ressources/glossaire-cac-lot-4-sources')
SPECS = {
'h2a-nep-230':'https://h2a-france.org/normes/documentation-de-laudit-des-comptes/',
'h2a-nep-300':'https://h2a-france.org/normes/planification-de-laudit/',
'h2a-nep-560':'https://h2a-france.org/normes/evenements-posterieurs-a-la-cloture-de-lexercice/',
'h2a-nep-570':'https://h2a-france.org/normes/continuite-dexploitation/',
'h2a-nep-580':'https://h2a-france.org/normes/declarations-de-la-direction/',
'h2a-nep-700':'https://h2a-france.org/normes/rapports-du-commissaires-aux-comptes-sur-les-comptes-annuels-et-consolides/',
'h2a-nep-911':'https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-trois-exercices-prevue-a-larticle-l-823-12-1-du-code-de-commerce/',
'h2a-nep-912':'https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-six-exercices-dans-des-petites-entreprises/',
'cncc-nep-911':'https://doc.cncc.fr/docs/nep-911-mission-du-commissaire-a-6a672aecbcc27',
'cncc-nep-912':'https://doc.cncc.fr/docs/nep-912-mission-du-commissaire-a-6a672baf28f47',
}
class Visible(HTMLParser):
    def __init__(self): super().__init__(); self.skip=0; self.out=[]
    def handle_starttag(self,tag,attrs):
        if tag in ['script','style']: self.skip+=1
        if tag in ['p','div','br','li','h1','h2','h3','tr']: self.out.append('\n')
    def handle_endtag(self,tag):
        if tag in ['script','style']: self.skip-=1
        if tag in ['p','div','li','h1','h2','h3','tr']: self.out.append('\n')
    def handle_data(self,data):
        if not self.skip: self.out.append(data)
def capture(pair):
    sid,url=pair
    result=subprocess.run(['curl','--silent','--show-error','--fail','--location','--max-time','60','--user-agent','Mozilla/5.0 MemliaSourceVerifier/1.0','--write-out','\n%{json}',url],check=True,capture_output=True)
    raw,meta=result.stdout.rsplit(b'\n',1); meta=json.loads(meta); assert meta['http_code']==200
    rawpath=BASE/f'{sid}.html'; rawpath.write_bytes(raw)
    parser=Visible(); parser.feed(raw.decode()); text='\n'.join(line.strip() for line in ''.join(parser.out).splitlines() if line.strip())+'\n'
    path=BASE/f'{sid}.txt'; path.write_text(text)
    sha=lambda b:hashlib.sha256(b).hexdigest()
    return sid,{'accessMode':'http','httpStatus':200,'requestedUrl':url,'finalUrl':meta['url_effective'],'retrievedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'rawPath':str(rawpath),'rawSha256':sha(raw),'snapshotPath':str(path),'contentSha256':sha(path.read_bytes()),'official':True,'level':'tier-1'}
if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: captures=dict(pool.map(capture,SPECS.items()))
    (BASE/'captures.json').write_text(json.dumps(captures,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v['httpStatus'] for k,v in captures.items()}))
