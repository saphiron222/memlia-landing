import hashlib
import json
import subprocess
import zipfile
from pathlib import Path

ROOT = Path(__file__).parent
REPO = Path('/Users/kevinkitanga/dev/interne/memlia-landing')
BASE = 'docs/qa/hub-ressources/glossaire-cac-lot-1-sources'
old_check = json.loads((ROOT/BASE/'global-files-check.json').read_text())
paths = [item['path'] for item in old_check['files']]
git_check = subprocess.run(['git', 'diff', '--exit-code', 'HEAD', '--', *paths], cwd=REPO, capture_output=True, text=True)
assert git_check.returncode == 0, git_check.stdout
state = subprocess.check_output(['git', 'status', '--short'], cwd=REPO, text=True)
branch = subprocess.check_output(['git', 'branch', '--show-current'], cwd=REPO, text=True).strip()
main = subprocess.check_output(['git', 'rev-parse', 'origin/main'], cwd=REPO, text=True).strip()
with zipfile.ZipFile('/Users/kevinkitanga/.hermes/kanban/attachments/t_33e01ca3/glossaire-cac-lot-1.zip') as z:
    names = z.namelist()
extra = ['README-CORRECTIONS.md', 'tests-corrections.py', 'replay-controls.py', 'make-delivery.py', 'scripts/lib/dila-source-copy.mjs', 'src/data/glossary.ts', 'tests/scripts/dila-source-copy.test.mjs', 'tests/scripts/dila-copy-fixture.mjs']
names += extra + [str(f.relative_to(ROOT)) for f in sorted((ROOT/'corrections').iterdir()) if f.is_file()]
archive = ROOT.parent/'glossaire-cac-lot-1-corrige.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    for name in names:
        z.write(ROOT/name, name)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(set(names))
    for name in names:
        assert z.read(name) == (ROOT/name).read_bytes(), name
    assert json.loads(z.read('docs/strategy/site-v3/glossaire-cac-lot-1.json'))['entries'] == json.loads(Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_33e01ca3/glossaire-cac-lot-1.json').read_text())['entries']
report = {'pass': True, 'archive': archive.name, 'archiveMembers': len(names), 'archiveIntegrity': 'PASS', 'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'baselineMainForControls': main, 'sourceRepositoryBranch': branch, 'sourceRepositoryStatus': state, 'globalFilesNotModified': paths, 'gitDiffGlobalFilesExitCode': git_check.returncode, 'scope': 'D1–D3 only; no publication; independent business review pending'}
(ROOT.parent/'LIVRAISON.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
