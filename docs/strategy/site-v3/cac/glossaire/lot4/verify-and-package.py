import json,zipfile,hashlib
from pathlib import Path
from pypdf import PdfReader
root=Path(__file__).parent
sha=lambda b:hashlib.sha256(b).hexdigest()
parent=Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_bcece207')
with zipfile.ZipFile(parent/'glossaire-cac-lot-4.zip') as z:
    assert z.testzip() is None
    members=z.namelist()
    for name in members:
        assert z.read(name)==(root/'candidate'/name).read_bytes(),name
with zipfile.ZipFile(root/'main.zip') as z:
    baseline=[n for n in z.namelist() if not n.endswith('/')]
    for name in baseline:
        assert z.read(name)==(root/'fresh-main'/name).read_bytes(),'Fichier de base modifié: '+name
folder='candidate/docs/qa/hub-ressources/glossaire-cac-lot-4-sources/'
pdf=root/folder/'cncc-alpe.pdf'
reader=PdfReader(pdf)
text='\n'.join('PAGE '+str(i+1)+'\n'+page.extract_text() for i,page in enumerate(reader.pages))
assert text==(root/folder/'cncc-alpe.txt').read_text()
assert 'ALPE (Audit Légal des Petites Entreprises)' in text
p=json.loads((root/'candidate/docs/strategy/site-v3/glossaire-cac-lot-4.json').read_text())
review=json.loads((root/'review/lot-review.json').read_text())
assert review['reviewedPackageSha256']==sha((root/'candidate/docs/strategy/site-v3/glossaire-cac-lot-4.json').read_bytes())
assert review['verdict']=='PASS'
assert {u['id'] for u in p['evidence']['units']}=={u['unitId'] for u in review['unitReviews']}
assert all(u['verdict']=='PASS' and len(u['reasoning'])>40 for u in review['unitReviews'])
recheck=json.loads((root/'review/source-recheck.json').read_text())
assert {r['sourceId'] for r in recheck}==set(p['evidence']['sources'])
projection=json.loads((root/'review/claims-evidence-projection.json').read_text())
assert len(projection['claimsEvidence']['renderedUnitInventory'])==len(p['entries'])*5
for c in projection['claimsEvidence']['claims']:
    unit=next(u for u in projection['claimsEvidence']['renderedUnitInventory'] if u['id']==c['unitId'])
    assert c['text'] in unit['text']
    assert len(c['text'])>10
for sid,s in p['evidence']['sources'].items():
    assert sha((root/'candidate'/s['snapshotPath']).read_bytes())==s['contentSha256']
    if s.get('dilaCopyPath'):
        copy=json.loads((root/'candidate'/s['dilaCopyPath']).read_text())
        assert copy['provenance']['retrieved_at']=='2026-10-05T22:44:11.834561+00:00'
        assert s['httpStatus'] is None
        assert copy['text']==(root/'candidate'/s['snapshotPath']).read_text().removesuffix('\n') or copy['text']+'\n'==(root/'candidate'/s['snapshotPath']).read_text()
proof={'pass':True,'originalArchiveMembersUnchanged':len(members),'baselineFilesCompared':len(baseline),'baselineFilesModified':0,'pdfPagesExtracted':len(reader.pages),'pdfExtractionMatchesCandidate':True,'originalUnitReviews':len(review['unitReviews']),'reviewedPackageSha256':review['reviewedPackageSha256'],'candidateModified':False,'sourceRechecks':len(recheck),'originalDilaCollectionPreserved':True,'scope':'Intégrité de pièces et cohérence de couverture, pas nouvelle revue sémantique ni publication.'}
(root/'review/verification.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
archive=root/'glossaire-cac-lot-4-revue.zip'
files=[p for p in (root/'candidate').rglob('*') if p.is_file()]
files += [p for p in (root/'review').rglob('*') if p.is_file() and 'captures' not in p.relative_to(root/'review').parts]
files += [root/n for n in ('build-review.mjs','check-review.mjs','collect-review.py','verify-and-package.py')]
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(files): z.write(p,p.relative_to(root))
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(files)
    for p in files: assert z.read(str(p.relative_to(root)))==p.read_bytes()
proof.update(archive=str(archive),archiveMembers=len(files),archiveSha256=sha(archive.read_bytes()),archiveBytes=archive.stat().st_size)
(root/'archive-integrity.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(proof,ensure_ascii=False,indent=2))
