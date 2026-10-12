"""Lecture seule des cinq NEP dans le référentiel LEGI local."""
from pathlib import Path
import sqlite3
import json
import re

OUT = Path(__file__).resolve().parent
REF = Path.home()/'hermes/referentiel-juridique'
c = sqlite3.connect('file:'+str(REF/'articles.sqlite')+'?mode=ro', uri=True)
nums = ['A. 821-66', 'A. 821-72', 'A. 821-73', 'A. 821-74', 'A. 821-76']
print('Codes', c.execute('select distinct code from articles').fetchall())
rows = c.execute("select id,number,valid_from,valid_to,status,record from articles where code=? and number in (?,?,?,?,?)", ('code_de_commerce', *[n.replace(' ','').replace('.','') for n in nums])).fetchall()
results = []
for id_,num,start,end,status,record in rows:
    obj = json.loads(record)
    result = {'id': id_, 'number': num, 'start': start, 'end': end, 'status': status, 'record': obj}
    results.append(result)
    print(id_,num,start,end,status, 'keys:', list(obj))
    (OUT/(id_+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    if status == 'VIGUEUR':
        targets = {'A821-66': ['04', '08', '09', '10'], 'A821-72': ['14', '46', '48'], 'A821-73': ['10', '28', '33', '34'], 'A821-74': ['06'], 'A821-76': ['09', '10', '11', '12', '13', '14', '15']}[num]
        text = obj['text']
        excerpts = []
        for target in targets:
            match = re.search(r'(?m)^\s*0?'+str(int(target))+r'\.\s', text)
            if match:
                following = re.search(r'(?m)^\s*\d{1,2}\.\s', text[match.end():])
                endpos = match.end()+following.start() if following else len(text)
                excerpts.append(text[match.start():endpos].strip())
        (OUT/(num+'-legi-extraits.txt')).write_text('\n\n'.join(excerpts)+'\n')
        print('Extraits', num, len(excerpts), 'Provenance', obj['provenance'], 'warning', obj['warning'])
(OUT/'legi-versions.json').write_text(json.dumps([dict((k,v) for k,v in r.items() if k!='record') for r in results], ensure_ascii=False,indent=2)+'\n')
print('rows',len(rows))
