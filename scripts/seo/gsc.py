#!/usr/bin/env python3
"""Instrument Search Console des crons SEO de memlia.fr : lecture seule.

À lancer avec l'interpréteur du skill seo, qui porte les identifiants Google déjà accordés :
    ~/.claude/skills/seo/.venv/bin/python scripts/seo/gsc.py sitemaps
    ~/.claude/skills/seo/.venv/bin/python scripts/seo/gsc.py inspect --urls https://memlia.fr/ https://memlia.fr/blog
    ~/.claude/skills/seo/.venv/bin/python scripts/seo/gsc.py inspect --urls-file /chemin/urls.txt
    ~/.claude/skills/seo/.venv/bin/python scripts/seo/gsc.py analytics --debut 2026-08-22 --fin 2026-09-18 --dimensions page,query

La propriété est fixée à sc-domain:memlia.fr : la propriété par défaut du skill est celle d'un autre site
et ne doit jamais être lue par accident. Aucune méthode d'écriture de l'API n'est appelée ici ; le renvoi
du sitemap reste dans scripts/gsc-resubmit-sitemap.py, seule écriture autorisée par Kevin (16/09/2026),
et le bouton « Demander l'indexation » reste manuel. La sortie est un objet JSON sur la sortie standard.
"""
import argparse
import json
import os
import re
import sys

SKILL_SCRIPTS = os.path.expanduser('~/.claude/skills/seo/scripts')
sys.path.insert(0, SKILL_SCRIPTS)

from google_auth import get_oauth_credentials  # noqa: E402
from googleapiclient.discovery import build  # noqa: E402
from gsc_inspect import batch_inspect  # noqa: E402
from gsc_query import query_search_analytics  # noqa: E402

PROPRIETE = 'sc-domain:memlia.fr'
SCOPE_LECTURE = ['https://www.googleapis.com/auth/webmasters.readonly']
DATE_ISO = re.compile(r'^\d{4}-\d{2}-\d{2}$')
DIMENSIONS_VALIDES = {'page', 'query', 'date', 'device', 'country', 'searchAppearance'}


def service_search_console():
    credentials = get_oauth_credentials(SCOPE_LECTURE)
    if credentials is None:
        raise SystemExit(json.dumps({'erreur': 'aucun identifiant Google : lancer /seo google setup'}))
    return build('searchconsole', 'v1', credentials=credentials)


def sitemaps():
    service = service_search_console()
    reponse = service.sitemaps().list(siteUrl=PROPRIETE).execute()
    lignes = []
    for sm in reponse.get('sitemap', []):
        contenus = sm.get('contents', [])
        lignes.append({
            'path': sm.get('path'),
            'last_submitted': sm.get('lastSubmitted'),
            'last_downloaded': sm.get('lastDownloaded'),
            'is_pending': bool(sm.get('isPending', False)),
            'is_index': bool(sm.get('isSitemapsIndex', False)),
            'errors': int(sm.get('errors', 0) or 0),
            'warnings': int(sm.get('warnings', 0) or 0),
            'submitted': sum(int(c.get('submitted', 0) or 0) for c in contenus),
            'indexed_declared': sum(int(c.get('indexed', 0) or 0) for c in contenus),
        })
    return {'propriete': PROPRIETE, 'sitemaps': lignes}


def aplatir_inspection(resultat):
    index_status = resultat.get('index_status') or {}
    canonical = resultat.get('canonical') or {}
    rich = resultat.get('rich_results') or {}
    return {
        'url': resultat.get('url'),
        'verdict': resultat.get('verdict'),
        'coverage_state': index_status.get('coverage_state'),
        'indexing_state': index_status.get('indexing_state'),
        'robots_txt_state': index_status.get('robots_txt_state'),
        'page_fetch_state': index_status.get('page_fetch_state'),
        'last_crawl_time': index_status.get('last_crawl_time'),
        'crawled_as': index_status.get('crawled_as'),
        'referring_urls': index_status.get('referring_urls') or [],
        'canonical': {
            'match': canonical.get('match'),
            'google_canonical': canonical.get('google_canonical'),
            'user_canonical': canonical.get('user_canonical'),
        },
        'rich_results': [item.get('type') for item in rich.get('detected_items', []) if isinstance(item, dict)],
        'error': resultat.get('error'),
    }


def inspect(urls, delai):
    urls = [u.strip() for u in urls if u and u.strip() and not u.strip().startswith('#')]
    if not urls:
        raise SystemExit(json.dumps({'erreur': 'aucune URL à inspecter'}))
    for u in urls:
        if not (u.startswith('https://memlia.fr/') or u.startswith('http://memlia.fr/') or u.startswith('https://www.memlia.fr/')):
            raise SystemExit(json.dumps({'erreur': f'URL hors propriété : {u}'}))
    lot = batch_inspect(urls, PROPRIETE, delay=delai)
    resultats = [aplatir_inspection(r) for r in lot.get('results', [])]
    return {'propriete': PROPRIETE, 'total': len(urls), 'inspections': resultats, 'summary': lot.get('summary')}


def analytics(debut, fin, dimensions, limite):
    for nom, valeur in (('debut', debut), ('fin', fin)):
        if not DATE_ISO.match(valeur or ''):
            raise SystemExit(json.dumps({'erreur': f'{nom} doit être une date ISO AAAA-MM-JJ'}))
    dims = [d.strip() for d in dimensions.split(',') if d.strip()]
    inconnues = sorted(set(dims) - DIMENSIONS_VALIDES)
    if inconnues:
        raise SystemExit(json.dumps({'erreur': f'dimensions inconnues : {", ".join(inconnues)}'}))
    resultat = query_search_analytics(PROPRIETE, start_date=debut, end_date=fin, dimensions=dims, row_limit=limite)
    resultat['fenetre'] = {'debut': debut, 'fin': fin, 'dimensions': dims}
    return resultat


def main():
    parser = argparse.ArgumentParser(description='Search Console de memlia.fr, en lecture seule')
    sous = parser.add_subparsers(dest='commande', required=True)
    sous.add_parser('sitemaps', help='état des sitemaps soumis')
    p_inspect = sous.add_parser('inspect', help='inspection d’URL (lecture)')
    p_inspect.add_argument('--urls', nargs='*', default=[])
    p_inspect.add_argument('--urls-file')
    p_inspect.add_argument('--delai', type=float, default=0.6, help='secondes entre deux inspections')
    p_analytics = sous.add_parser('analytics', help='performance de recherche')
    p_analytics.add_argument('--debut', required=True)
    p_analytics.add_argument('--fin', required=True)
    p_analytics.add_argument('--dimensions', default='page')
    p_analytics.add_argument('--limite', type=int, default=5000)
    args = parser.parse_args()

    if args.commande == 'sitemaps':
        sortie = sitemaps()
    elif args.commande == 'inspect':
        urls = list(args.urls)
        if args.urls_file:
            with open(args.urls_file, encoding='utf-8') as fh:
                urls.extend(fh.read().splitlines())
        sortie = inspect(urls, args.delai)
    else:
        sortie = analytics(args.debut, args.fin, args.dimensions, args.limite)
    json.dump(sortie, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write('\n')
    return 0


if __name__ == '__main__':
    sys.exit(main())
