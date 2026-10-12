from pathlib import Path
import hashlib, json, shutil, subprocess

HERE = Path(__file__).resolve().parent
attachments = Path('/Users/kevinkitanga/.hermes/kanban/attachments/t_80e0d321')
# Couverture native fournie : conserver la provenance sans modifier ses champs.
shutil.copyfile(attachments / 'rapprochement-bancaire-openai.png', HERE / 'image-source.png')
shutil.copyfile(attachments / 'rapprochement-bancaire-openai-provenance-complete.json', HERE / 'image-source.json')
url = 'https://www.anc.gouv.fr/files/anc/files/1_Normes_fran%C3%A7aises/Plans%20comptables/2026/Plan-de-comptes-2026.pdf'
target = HERE / 'anc-plan-comptes-2026.pdf'
result = subprocess.run(['curl', '--fail', '--location', '--max-time', '45', '--user-agent', 'MemliaBlogSourceVerifier/1.0 (+https://memlia.fr)', '--url', url, '--output', str(target), '--write-out', '%{http_code} %{url_effective}'], check=True, capture_output=True, text=True)
code, final = result.stdout.split(' ', 1)
status = int(code)
data = target.read_bytes()
assert status == 200 and data.startswith(b'%PDF')
(HERE / 'anc-plan-comptes-2026.pdf').write_bytes(data)
from datetime import datetime, timezone
proof = {'requestedUrl': url, 'finalUrl': final, 'httpStatus': status, 'retrievedAt': datetime.now(timezone.utc).isoformat(), 'sha256': hashlib.sha256(data).hexdigest(), 'path': 'anc-plan-comptes-2026.pdf', 'scope': 'Complément au lien ANC : numéro 512 Banques et 5121 Comptes en euros, non justification de la clé d’appariement.'}
(HERE / 'anc-pdf-provenance.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(proof, ensure_ascii=False))
