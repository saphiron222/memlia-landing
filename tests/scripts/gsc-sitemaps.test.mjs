import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

test('GSC : le compteur obsolète ne mesure jamais l’indexation ; les écritures ciblent uniquement memlia.fr', () => {
  const result = spawnSync('python3', ['-B', '-c', String.raw`
import contextlib
import importlib.util
import io
import json
import sys
from unittest.mock import Mock

sys.path.insert(0, 'scripts')
from seo.gsc_sitemaps import PROPRIETE, sitemap_status

assert PROPRIETE == 'sc-domain:memlia.fr'
for obsolete in (None, '0', '37'):
    payload = {'path': 'https://memlia.fr/sitemap.xml', 'contents': [{'submitted': '46', 'indexed': obsolete}]}
    row = sitemap_status(payload)
    assert row['submitted'] == 46
    assert row['indexed'] is None
    assert row['indexation_source'] == 'url_inspection_required'
    assert 'indexed_declared' not in row
assert sitemap_status({})['submitted'] is None
assert sitemap_status({'contents': [{'indexed': '0'}]})['submitted'] is None
assert sitemap_status({'contents': [{'submitted': '0'}]})['submitted'] == 0
assert sitemap_status({'contents': [{'submitted': '20'}, {'submitted': '26'}]})['submitted'] == 46

spec = importlib.util.spec_from_file_location('resubmit', 'scripts/gsc-resubmit-sitemap.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
service = Mock()
service.sitemaps.return_value.list.return_value.execute.return_value = {'sitemap': [payload]}
output = io.StringIO()
with contextlib.redirect_stdout(output):
    status = module.resubmit_sitemaps(service)
calls = service.sitemaps.return_value.submit.call_args_list
assert [c.kwargs for c in calls] == [
    {'siteUrl': PROPRIETE, 'feedpath': 'https://memlia.fr/sitemap.xml'},
    {'siteUrl': PROPRIETE, 'feedpath': 'https://memlia.fr/sitemap-0.xml'},
]
assert service.sitemaps.return_value.submit.return_value.execute.call_count == 2
service.sites.assert_not_called()
service.sitemaps.return_value.list.assert_called_once_with(siteUrl=PROPRIETE)
assert status['sitemaps'][0]['indexed'] is None
assert [json.loads(line)['submission'] for line in output.getvalue().splitlines()] == ['accepted', 'accepted']

service = Mock()
service.sitemaps.return_value.submit.return_value.execute.side_effect = [None, RuntimeError('403')]
output = io.StringIO()
try:
    with contextlib.redirect_stdout(output):
        module.resubmit_sitemaps(service)
    raise AssertionError('un refus ne doit pas produire de faux succès')
except RuntimeError:
    pass
assert len(output.getvalue().splitlines()) == 1
assert json.loads(output.getvalue())['submitted_sitemap'] == module.SITEMAPS[0]
service.sitemaps.return_value.list.assert_not_called()
`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('l’ancien hub Ressources redirige en permanence vers les articles et leur lien au glossaire', () => {
  const rules = readFileSync('public/_redirects', 'utf8').trim().split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith('#')).map((line) => line.trim().split(/\s+/));
  for (const source of ['/ressources', '/ressources/']) {
    assert.deepEqual(rules.filter(([path]) => path === source), [[source, '/blog', '308']]);
  }
  assert.match(readFileSync('src/pages/blog.astro', 'utf8'), /href="\/glossaire"/);
});
