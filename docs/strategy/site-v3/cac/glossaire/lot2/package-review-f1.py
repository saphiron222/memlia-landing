import pathlib,subprocess,json,zipfile,hashlib
w=pathlib.Path(__file__).parent
commands=[(['python3','verify-f1.py'],w),(['python3','test-review-f1.py'],w),(['node','check-review-f1.mjs'],w),(['node','docs/qa/hub-ressources/glossaire-cac-lot-2-sources/validate.mjs'],w/'baseline'),(['node','--test','docs/qa/hub-ressources/glossaire-cac-lot-2-sources/f1-mutations.test.mjs'],w/'baseline'),(['node','docs/qa/hub-ressources/glossaire-cac-lot-2-sources/mutations.mjs'],w/'baseline'),(['node','--test','tests/scripts/dila-source-copy.test.mjs'],w/'baseline')]
results=[]
for cmd,cwd in commands:
 r=subprocess.run(cmd,cwd=cwd,capture_output=True,text=True)
 results.append({'command':cmd,'cwd':'baseline' if cwd.name=='baseline' else '.','exitCode':r.returncode,'stdout':r.stdout,'stderr':r.stderr})
 assert r.returncode==0,(cmd,r.stderr)
(w/'review/tests-executed.json').write_text(json.dumps({'pass':True,'executions':results},ensure_ascii=False,indent=2)+'\n')
# Recompare the candidate archive after all execution, not just before.
archive='/Users/kevinkitanga/.hermes/kanban/attachments/t_b92f3e26/glossaire-cac-lot-2-F1.zip'
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 for name in z.namelist(): assert z.read(name)==(w/'corrected'/name).read_bytes(),name
files=[p for d in ['corrected','prior'] for p in (w/d).rglob('*') if p.is_file()]
files += [w/'review'/name for name in ['REVUE.md','lot-review.json','business-review.json','claims-evidence-projection.json','claims-check.json','independent-f1-negative-check.json','tests-executed.json']]
files += [w/name for name in ['verification-f1.json','README-review-F1.md','verify-f1.py','test-review-f1.py','build-review-f1.mjs','check-review-f1.mjs','original-preparation.zip','package-review-f1.py']]
final=w/'glossaire-cac-lot-2-revue-pass.zip'
with zipfile.ZipFile(final,'w',zipfile.ZIP_DEFLATED) as z:
 for p in files: z.write(p,p.relative_to(w))
with zipfile.ZipFile(final) as z:
 assert z.testzip() is None
 for name in z.namelist(): assert z.read(name)==(w/name).read_bytes(),name
metadata={'pass':True,'executedCommands':len(results),'candidateUnchanged':True,'candidateArchiveMembersCompared':len(zipfile.ZipFile(archive).namelist()),'reviewArchiveMembersCompared':len(files),'archive':str(final),'archiveSha256':hashlib.sha256(final.read_bytes()).hexdigest(),'reviewedPackageSha256':hashlib.sha256((w/'corrected/docs/strategy/site-v3/glossaire-cac-lot-2.json').read_bytes()).hexdigest()}
(w/'review/delivery-check.json').write_text(json.dumps(metadata,indent=2)+'\n');print(json.dumps(metadata,indent=2))
