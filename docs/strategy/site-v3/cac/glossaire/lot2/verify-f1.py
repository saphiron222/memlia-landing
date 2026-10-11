import json, pathlib, hashlib, zipfile, sys
w=pathlib.Path(__file__).parent
p='docs/strategy/site-v3/glossaire-cac-lot-2.json'
c=json.loads(pathlib.Path(sys.argv[1]).read_text() if len(sys.argv)>1 else (w/'corrected'/p).read_text()); o=json.loads((w/'corrected/original'/p).read_text()); prior=json.loads((w/'prior/PREUVE.json').read_text()); plan=json.loads((w/'corrected/docs/qa/hub-ressources/glossaire-cac-lot-2-sources/f1-plan.json').read_text())
h=lambda x: hashlib.sha256(x).hexdigest()
assert h((w/'corrected/original'/p).read_bytes())==prior['candidateSha256']
assert c['entries']==o['entries'] and c['sources']==o['sources'] and c['evidence']['sources']==o['evidence']['sources']
old={u['id']:u for u in o['evidence']['units']}; current={u['id']:u for u in c['evidence']['units']}; removed=set(old)-set(current)
assert set(prior['requiredCorrection'])==set(plan['signaledIds'])
assert removed=={uid for g in plan['groups'] for uid in g['originalIds']}
new=[u for u in c['evidence']['units'] if u['id'] not in old]
assert len(new)==36
assert all(u==old[u['id']] for u in c['evidence']['units'] if u['id'] in old)
for g in plan['groups']:
 units=[u for u in new if u['entryId']==g['entryId'] and u['field']==g['field']]
 expected=c['entries'][next(i for i,e in enumerate(c['entries']) if e['id']==g['entryId'])][g['field']]
 texts=list(dict.fromkeys(u['text'] for u in units))
 assert ''.join(''.join(texts).split())==''.join(expected.split())
 assert all(u['unitText']==expected for u in units)
 assert set(texts)=={q['text'] for q in g['claims']}
 for q in g['claims']:
  us=[u for u in units if u['text']==q['text']]
  assert {u['sourceId'] for u in us}==(set(q['sources']) or {None})
  for u in us:
   if u['sourceId']:
    locs={v['locator'].split(':paragraphe-')[1].split(':')[0] for v in u['citations']}
    assert locs==set(q['sources'][u['sourceId']])
for sid,s in c['evidence']['sources'].items():
 assert h((w/'corrected'/s['snapshotPath']).read_bytes())==prior['sourceSnapshotSha256'][sid]
for u in c['evidence']['units']:
 if u['sourceId']:
  s=c['evidence']['sources'][u['sourceId']]
  assert all(v['text'] in (w/'corrected'/s['snapshotPath']).read_text() for v in u['citations'])
assert len(c['entries'])==10
with zipfile.ZipFile(w/'original-preparation.zip') as z:
 compared=0
 for sid,s in c['evidence']['sources'].items():
  for k in ['snapshotPath','rawPath','dilaCopyPath']:
   if s.get(k):
    assert z.read(s[k])==(w/'corrected'/s[k]).read_bytes(); compared+=1
report={'pass':True,'initialCandidateMatchesReview':True,'entriesUnchanged':True,'sourceMetadataUnchanged':True,'sourceCopyFilesUnchanged':compared,'signaledPairs':len(plan['signaledIds']),'fields':len(plan['groups']),'replacedRows':len(removed),'targetedRows':len(new),'carriedRows':len(current)-len(new),'allFieldsFullyCovered':True,'citationsLocated':True,'archiveNote':'f1.test.mjs annoncé mais absent ; tests de localisation/couverture exécutés indépendamment par verify-f1.py.'}
if len(sys.argv)==1:
 (w/'verification-f1.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
