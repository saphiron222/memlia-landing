"""Vérifie le texte de vrais PDF Chromium avec PDFKit (macOS, Swift)."""
import json
from pathlib import Path
import re
import subprocess
import sys

source = Path(__file__).with_name('extract-print.swift')
normalize = lambda text: re.sub(r'\s+', ' ', text).strip()
results = []
for pdf_name in sys.argv[1:]:
    pdf = Path(pdf_name)
    expected = json.loads(pdf.with_name('expected-print.json').read_text())
    text = subprocess.check_output(['swift', str(source), str(pdf)], text=True)
    pdf.with_suffix('.txt').write_text(text)
    missing = {kind: [line for line in lines if normalize(line) not in normalize(text)]
               for kind, lines in expected.items()}
    assert len(expected['responses']) == 15
    assert len(expected['actions']) == 3
    assert expected['evidence']
    assert not any(missing.values()), missing
    results.append({'pdf': str(pdf), 'responses': len(expected['responses']),
                    'actions': len(expected['actions']),
                    'justifications': len(expected['evidence']), 'result': 'PASS'})
assert results, 'Au moins un vrai PDF est requis'
print(json.dumps(results, ensure_ascii=False, indent=2))
