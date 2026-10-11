import copy
import contextlib
import io
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('bing', Path(__file__).with_name('bing_monitor.py'))
assert spec is not None and spec.loader is not None
bing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bing)

class Fake:
    def __init__(self, daily=100, monthly=2600, fail=False):
        self.daily, self.monthly, self.fail = daily, monthly, fail
        self.sent = []
    def call(self, method, **kwargs):
        if method == 'GetUrlSubmissionQuota':
            return {'DailyQuota': self.daily, 'MonthlyQuota': self.monthly}
        if method == 'SubmitUrlBatch':
            if self.fail: raise RuntimeError('timeout')
            self.sent.extend(kwargs['urlList'])
            self.daily -= len(kwargs['urlList'])
            self.monthly -= len(kwargs['urlList'])
            return None
        return None

class Tests(unittest.TestCase):
    def test_new_changed_and_absent_lastmod(self):
        self.assertEqual(bing.pending({'a':None,'b':'2','c':'1'}, {'accepted':{'a':None,'b':'1'}}), ['b','c'])
    def test_idempotence(self):
        fake, state = Fake(), {}
        bing.submit(fake, {'a':None}, state, lambda _:None, 'day')
        result = bing.submit(fake, {'a':None}, state, lambda _:None, 'day')
        self.assertEqual(fake.sent,['a'])
        self.assertEqual(result['urls'],[])
    def test_live_monthly_quota(self):
        state = {}
        result = bing.submit(Fake(monthly=2), dict.fromkeys('abcd'), state, lambda _:None, 'day')
        self.assertEqual(len(result['urls']),2)
        self.assertTrue(result['quota_decrement_verified'])
    def test_cap100(self):
        result = bing.submit(Fake(daily=10000,monthly=10000),dict.fromkeys(map(str,range(150))),{},lambda _:None,'day')
        self.assertEqual(len(result['urls']),100)
    def test_ambiguous_reserves_quota_not_accepted(self):
        state, snapshots = {}, []
        with self.assertRaises(RuntimeError):
            bing.submit(Fake(fail=True),dict.fromkeys(map(str,range(100))),state,lambda s:snapshots.append(copy.deepcopy(s)),'day')
        self.assertEqual(state['daily']['day'],100)
        self.assertFalse(state.get('accepted'))
        self.assertEqual(state['history'][-1]['status'],'ambiguous_or_failed')
    def test_zero_quota_does_not_mark_accepted(self):
        state = {}
        bing.submit(Fake(daily=0),{'a':None},state,lambda _:None,'day')
        self.assertEqual(bing.pending({'a':None},state),['a'])
    def test_empty_urlinfo_not_unindexed(self):
        row = bing.inspect(Fake(),'a',None)
        self.assertEqual(row['api_status'],'empty')
        self.assertIn('ND',row['indexation'])
    def test_bing_dates(self):
        self.assertIsNone(bing.bing_date('/Date(-62135596800000)/'))
        self.assertEqual(bing.bing_date('/Date(1791244800000)/'),'2026-10-06T00:00:00+00:00')
    def test_error_redacts_request(self):
        with patch.object(bing,'fetch',side_effect=ValueError('secret')):
            with self.assertRaises(RuntimeError) as ctx: bing.Bing('secret').call('GetFeeds')
        self.assertNotIn('secret',str(ctx.exception))
    def test_sitemap_outside_host(self):
        with self.assertRaises(RuntimeError): bing.sitemap('https://other.fr/sitemap.xml')
    def test_malformed_success_rejected(self):
        with patch.object(bing,'fetch',return_value=b'{"ErrorCode":2}'):
            with self.assertRaises(RuntimeError): bing.Bing('secret').call('GetFeeds')

    def test_submit_null_success(self):
        with patch.object(bing, 'fetch', return_value=b'{"d":null}'):
            self.assertIsNone(bing.Bing('secret').call('SubmitUrlBatch', urlList=['a']))

    def test_submit_invalid_responses_keep_pending(self):
        for raw in (b'{"d":{"ErrorCode":2}}', b'{"d":false}', b'{"d":[]}', b'{"d":"ok"}', b'{}', b'null'):
            with self.subTest(raw=raw):
                state = {}
                def transport(url, body=None):
                    return raw if body else b'{"d":{"DailyQuota":100,"MonthlyQuota":2600}}'
                with patch.object(bing, 'fetch', side_effect=transport), self.assertRaises(RuntimeError):
                    bing.submit(bing.Bing('secret'), {'a':None}, state, lambda _:None, 'day')
                self.assertEqual(bing.pending({'a':None}, state), ['a'])
                self.assertEqual(state['daily']['day'], 1)
                self.assertEqual(state['history'][-1]['status'], 'ambiguous_or_failed')

    def test_weekly_outage_and_partial_degradation(self):
        class Outage:
            def __init__(self, healthy): self.healthy = healthy
            def call(self, method, **kwargs):
                if method == self.healthy: return [] if method == 'GetFeeds' else None
                raise RuntimeError(method + ': échec réseau/JSON')
        for healthy in (None, 'GetFeeds', 'GetUrlInfo'):
            with self.subTest(healthy=healthy), tempfile.TemporaryDirectory() as td:
                stderr = io.StringIO()
                with patch.object(bing, 'sitemap', return_value={'a':None}), patch.object(bing, 'credential', return_value='secret'), patch.object(bing, 'Bing', return_value=Outage(healthy)), patch('sys.argv', ['bing', 'weekly', '--output', td]), contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(stderr):
                    if healthy is None:
                        with self.assertRaisesRegex(RuntimeError, 'NON_MESURE'): bing.main()
                    else:
                        bing.main()
                self.assertIn('Bing source perdue', stderr.getvalue())
                self.assertNotIn('secret', stderr.getvalue())
                self.assertEqual(len(list(Path(td).glob('bing-*.json'))), 1)

if __name__ == '__main__': unittest.main()
