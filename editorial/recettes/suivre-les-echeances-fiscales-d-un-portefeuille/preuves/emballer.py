"""Emballage durable du paquet, sans dépendances ni fichiers clients."""
import json
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[4]
folder = Path(__file__).resolve().parents[1]
output = root / '.qa' / 'livraison-fiscale'
output.mkdir(parents=True, exist_ok=True)
archive = output / 'paquet-echeances-fiscales-2026-10-12.zip'
files = sorted(p for p in folder.rglob('*') if p.is_file() and '__pycache__' not in p.parts)
with ZipFile(archive, 'w', ZIP_DEFLATED) as z:
    for path in files:
        z.write(path, path.relative_to(root))
with ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(files)
manifest = dict(path=str(archive), files=len(files), bytes=archive.stat().st_size,
                sha256=sha256(archive.read_bytes()).hexdigest(),
                scope='Paquet de fabrication relu ; aucune publication',
                review=str(folder / 'revues.json'))
(output / 'emballage.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
assert archive.stat().st_size < 25000000
print(json.dumps(manifest, ensure_ascii=False, indent=2))
