#!/usr/bin/env python3
"""Bing: relevé en lecture et soumission différentielle du sitemap public."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import fcntl
import json
import os
from pathlib import Path
import re
import ssl
import sys
from datetime import datetime, timezone
from urllib import request, parse, error
import xml.etree.ElementTree as ET

SITE = 'https://memlia.fr/'
API = 'https://ssl.bing.com/webmaster/api.svc/json/'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}


def credential():
    key = os.environ.get('BING_WEBMASTER_API_KEY')
    if not key:
        path = Path.home() / '.hermes/profiles/marketing/.env'
        for line in path.read_text().splitlines():
            if line.startswith('BING_WEBMASTER_API_KEY='):
                key = line.split('=', 1)[1].strip().strip('\"\'')
    if not key:
        raise RuntimeError('Clé Bing absente')
    return key


def fetch(url, body=None):
    # macOS Python sans magasin CA installé : magasin système, TLS toujours vérifié.
    ctx = ssl.create_default_context(cafile='/etc/ssl/cert.pem' if sys.platform == 'darwin' else None)
    req = request.Request(url, data=body, headers={'Content-Type': 'application/json', 'User-Agent': 'Memlia-Bing-Monitor/1.0'})
    opener = request.build_opener(request.HTTPSHandler(context=ctx), NoRedirect())
    with opener.open(req, timeout=15) as response:
        return response.read()


class NoRedirect(request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RuntimeError('Redirection refusée')


class Bing:
    def __init__(self, key):
        self.key = key

    def call(self, method, **params):
        write = method == 'SubmitUrlBatch'
        query = {'apikey': self.key}
        if not write:
            query.update(siteUrl=SITE, **params)
        body = json.dumps({'siteUrl': SITE, **params}).encode() if write else None
        try:
            data = json.loads(fetch(API + method + '?' + parse.urlencode(query), body))
        except error.HTTPError as exc:
            raise RuntimeError(f'{method}: HTTP {exc.code}') from None
        except Exception:
            raise RuntimeError(f'{method}: échec réseau/JSON') from None
        if 'd' not in data or 'ErrorCode' in data:
            raise RuntimeError(f'{method}: réponse API invalide')
        return data['d']


def sitemap(url=SITE + 'sitemap.xml', seen=None):
    seen = set() if seen is None else seen
    if url in seen or len(seen) >= 20:
        raise RuntimeError('Sitemap cyclique ou trop grand')
    if not url.startswith(SITE):
        raise RuntimeError('Sitemap hors memlia.fr')
    seen.add(url)
    root = ET.fromstring(fetch(url))
    result = {}
    if root.tag.endswith('sitemapindex'):
        for loc in root.findall('s:sitemap/s:loc', NS):
            if not loc.text:
                raise RuntimeError('Sitemap enfant sans URL')
            result.update(sitemap(loc.text, seen))
    elif root.tag.endswith('urlset'):
        for row in root.findall('s:url', NS):
            loc = row.find('s:loc', NS)
            mod = row.find('s:lastmod', NS)
            if loc is None or not loc.text or not loc.text.startswith(SITE):
                raise RuntimeError('URL sitemap hors propriété')
            result[loc.text] = mod.text if mod is not None else None
    else:
        raise RuntimeError('Format sitemap inconnu')
    if not result:
        raise RuntimeError('Sitemap vide')
    return result


def atomic(path, data):
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    tmp.replace(path)


def pending(current, state):
    return sorted(url for url, mod in current.items() if url not in state.get('accepted', {}) or state['accepted'][url] != mod)


def submit(client, current, state, persist, today):
    # quota local UTC conservateur + deux quotas vivants (quotidien ET mensuel).
    before = client.call('GetUrlSubmissionQuota')
    used = state.get('daily', {}).get(today, 0)
    allowance = max(0, min(100 - used, int(before['DailyQuota']), int(before['MonthlyQuota'])))
    todo = pending(current, state)
    urls = todo[:allowance]
    record = {'date': today, 'pending_before': len(todo), 'urls': urls, 'quota_before': before, 'status': 'nothing' if not urls else 'attempt'}
    if urls:
        # Réserve avant le POST : un timeout ambigu ne doit pas consommer encore 100 demain dans un retry du jour.
        state.setdefault('daily', {})[today] = used + len(urls)
        state.setdefault('history', []).append(record)
        persist(state)
        try:
            client.call('SubmitUrlBatch', urlList=urls)
        except Exception:
            record['status'] = 'ambiguous_or_failed'
            persist(state)
            raise
        state.setdefault('accepted', {}).update({url: current[url] for url in urls})
        record['status'] = 'accepted_not_indexed'
        persist(state)
        after = client.call('GetUrlSubmissionQuota')
        record['quota_after'] = after
        record['quota_decrement_verified'] = before['DailyQuota'] - after['DailyQuota'] >= len(urls)
        persist(state)
    else:
        state.setdefault('history', []).append(record)
        persist(state)
    return record


def bing_date(value):
    match = re.match(r'/Date\((-?\d+)', value or '')
    if not match or int(match[1]) <= 0:
        return None
    return datetime.fromtimestamp(int(match[1]) / 1000, timezone.utc).isoformat()


def inspect(client, url, lastmod):
    row = {'url': url, 'lastmod': lastmod, 'discovery': None, 'last_crawl': None, 'http_status': None, 'indexation': 'ND — API UrlInfo sans statut d’indexation'}
    try:
        raw = client.call('GetUrlInfo', url=url)
        row['raw'] = raw
        row['api_status'] = 'ok' if raw else 'empty'
        if raw:
            row.update(discovery=bing_date(raw.get('DiscoveryDate')), last_crawl=bing_date(raw.get('LastCrawledDate')), http_status=raw.get('HttpStatus') or None)
    except RuntimeError as exc:
        row['api_status'] = str(exc)
    return row


def report(client, current, directory, now):
    data = {'collected_at': now.isoformat(), 'site': SITE, 'sources': {}, 'urls': []}
    for method in ('GetCrawlStats', 'GetFeeds', 'GetLinkCounts', 'GetPageStats'):
        try:
            data['sources'][method] = {'status': 'ok', 'data': client.call(method)}
        except RuntimeError as exc:
            data['sources'][method] = {'status': 'error', 'error': str(exc)}
    with ThreadPoolExecutor(max_workers=3) as pool:
        data['urls'] = list(pool.map(lambda item: inspect(client, *item), sorted(current.items())))
    prefix = directory / ('bing-' + now.date().isoformat())
    atomic(prefix.with_suffix('.json'), data)
    lines = ['# Relevé Bing — ' + now.date().isoformat(), '', f'Collecté : {now.isoformat()} ; {len(current)} URL du sitemap public.', '', 'Indexation par URL : ND. GetUrlInfo documente la découverte et le crawl, pas l’appartenance à l’index. IsPage et une soumission acceptée ne prouvent pas l’indexation. Une réponse vide/400 ne prouve pas une absence de crawl.', '', '| URL | Découverte | Dernier crawl | HTTP Bing | Indexation | API |', '|---|---|---|---|---|---|']
    for row in data['urls']:
        lines.append('| ' + ' | '.join(str(row.get(k) or 'ND') for k in ('url', 'discovery', 'last_crawl', 'http_status', 'indexation', 'api_status')) + ' |')
    lines.extend(['', '## Sources globales', '', 'Les dates et séries Bing ne sont pas une fenêtre hebdomadaire garantie. Les impressions sont les lignes retournées, pas un total exhaustif de la propriété. Le JSON daté conserve chaque ligne.'])
    for method, source in data['sources'].items():
        lines.extend(['', '### ' + method, '', '```json', json.dumps(source, ensure_ascii=False, indent=2), '```'])
    prefix.with_suffix('.md').write_text('\n'.join(lines) + '\n')
    return prefix


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('mode', choices=['daily', 'weekly'])
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc)
    with (args.output / 'run.lock').open('w') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        current = sitemap()
        client = Bing(credential())
        if args.mode == 'weekly':
            prefix = report(client, current, args.output, now)
            data = json.loads(prefix.with_suffix('.json').read_text())
            available = sum(row['api_status'] == 'ok' for row in data['urls'])
            print(f'Relevé Bing : {len(current)} URL ; UrlInfo exploitable {available}/{len(current)}. Indexation par URL ND. Rapport : {prefix.with_suffix(".md")}')
        else:
            path = args.output / 'submission-state.json'
            state = json.loads(path.read_text()) if path.exists() else {}
            result = submit(client, current, state, lambda s: atomic(path, s), now.date().isoformat())
            print(f"Bing : {len(result['urls'])} URL, {result['status']}, {result['pending_before'] - len(result['urls'])} en attente. Trace : {path}")


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print('Bing arrêté : ' + (str(exc) if isinstance(exc, RuntimeError) else type(exc).__name__), file=sys.stderr)
        sys.exit(1)
