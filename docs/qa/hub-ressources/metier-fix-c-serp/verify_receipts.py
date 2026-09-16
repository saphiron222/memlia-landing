"""Independent local check. Does not access DataForSEO or change receipts."""
import hashlib
import json
from decimal import Decimal
from pathlib import Path

root = Path(__file__).resolve().parent
expected = {
    'hub-desktop': ('ressources cabinet comptable automatisation', 'desktop'),
    'hub-mobile': ('ressources cabinet comptable automatisation', 'mobile'),
    'glossaire-desktop': ('glossaire cabinet comptable', 'desktop'),
    'glossaire-mobile': ('glossaire cabinet comptable', 'mobile'),
}
ledger = json.loads((root / 'collection-ledger.json').read_text())
rows = {r['name']: r for r in ledger['rows']}
assert set(rows) == set(expected)
recalculated = []
total = Decimal(0)
for name, (query, device) in expected.items():
    req = json.loads((root / f'{name}-request.json').read_text())
    assert req == [{'keyword': query, 'location_code': 2250, 'language_code': 'fr', 'device': device, 'depth': 10}]
    raw = (root / f'{name}-response.json').read_bytes()
    data = json.loads(raw)
    assert len(data['tasks']) == 1 and data['tasks_count'] == 1
    task = data['tasks'][0]
    assert task['id'] == rows[name]['taskId']
    assert all(task['data'][key] == value for key, value in req[0].items())
    urls = {item['url'] for result in task.get('result') or [] for item in result['items'] if item['type'] == 'organic'}
    ok = data['status_code'] == 20000 and task['status_code'] == 20000 and len(urls) >= 5
    assert ok == rows[name]['collectionPass']
    assert len(urls) == rows[name]['uniqueOrganicUrls']
    assert hashlib.sha256(raw).hexdigest() == rows[name]['responseSha256']
    assert Decimal(str(data['cost'])) == Decimal(str(task['cost']))
    total += Decimal(str(data['cost']))
    recalculated.append({'name': name, 'taskStatus': task['status_code'], 'organicUrls': len(urls), 'pass': ok})
assert len(recalculated) == ledger['executedTasks'] == ledger['authorizedTasks'] == 4
assert sum(row['pass'] for row in recalculated) == ledger['pass'] == 2
assert str(total) == ledger['totalCostUSD']
assert ledger['collectionStatus'] == 'FAIL'
print(json.dumps({'verification': 'PASS (receipts authentic and ledger reconciled; collection remains FAIL)', 'tasks': recalculated, 'actualCostUSD': str(total), 'boundedTwoRetryEstimateUSD': str(Decimal('0.002') * 2), 'additionalCalls': 0}, ensure_ascii=False, indent=2))
