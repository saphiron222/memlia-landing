"""Archive exact authorized retry receipts from local session DB, never call API."""
import hashlib
import json
import sqlite3
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path

root = Path(__file__).resolve().parent
session = '20260908_173502_d4c1517a'
con = sqlite3.connect('file:/Users/kevinkitanga/.hermes/profiles/marketing/state.db?mode=ro', uri=True)
ids = [(22654, 'hub-desktop-retry-post'), (22655, 'glossaire-mobile-retry-post'), (22700, 'hub-desktop-retry-get'), (22701, 'glossaire-mobile-retry-get')]
rows = []
for message_id, name in ids:
    receipt, call_id, timestamp = con.execute('SELECT content,tool_call_id,timestamp FROM messages WHERE session_id=? AND id=? AND tool_name=?', (session, message_id, 'mcp__dataforseo__api_request')).fetchone()
    wrapper = json.JSONDecoder().raw_decode(receipt[receipt.index('{'):])[0]
    raw = wrapper['result']
    data = json.loads(raw)
    task = data['tasks'][0]
    assert len(data['tasks']) == data['tasks_count'] == 1
    urls = {item['url'] for result in task.get('result') or [] for item in result['items'] if item['type'] == 'organic'}
    assert task['path'][4] == ('live' if name.endswith('post') else 'task_get')
    if name.endswith('post'):
        expected = {'keyword': 'ressources cabinet comptable automatisation' if name.startswith('hub') else 'glossaire cabinet comptable', 'location_code': 2250, 'language_code': 'fr', 'device': 'desktop' if name.startswith('hub') else 'mobile', 'depth': 10}
        assert all(task['data'][k] == v for k, v in expected.items())
    for suffix, content in [('tool-receipt.txt', receipt), ('response.json', raw)]:
        (root / f'{name}-{suffix}').write_text(content)
    rows.append({'name': name, 'sessionId': session, 'messageId': message_id, 'receiptAt': datetime.fromtimestamp(timestamp, timezone.utc).isoformat(), 'taskId': task['id'], 'status': task['status_code'], 'message': task['status_message'], 'costFieldUSD': str(data['cost']), 'uniqueOrganicUrls': len(urls), 'receiptSha256': hashlib.sha256(receipt.encode()).hexdigest()})
assert [r['status'] for r in rows] == [40101, 20000, 40101, 20000]
assert [r['uniqueOrganicUrls'] for r in rows] == [0, 10, 0, 10]
post_cost = sum(Decimal(r['costFieldUSD']) for r in rows if r['name'].endswith('post'))
initial_cost = Decimal(json.loads((root / 'collection-ledger.json').read_text())['totalCostUSD'])
result = {'verification': 'PASS — local receipt identity and exact POST parameters; collection FAIL/ND', 'newNetworkCalls': 0, 'retryPostCount': 2, 'retryPostCostUSD': str(post_cost), 'allSixPostCostUSD': str(initial_cost + post_cost), 'getCostCaveat': 'GET cost fields are archived separately, not assumed to be incremental charges; no account invoice checked.', 'rows': rows}
(root / 'retry-receipts-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
