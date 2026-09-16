#!/usr/bin/env python3
"""Renvoie le sitemap de memlia.fr à Search Console et affiche l'état de chaque sitemap.

À lancer avec l'interpréteur du skill seo, qui porte l'OAuth Google déjà accordé :
    ~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py

Autorisation : Kevin, 16/09/2026 (« Je le renvoie par l'API »), pour les sitemaps seulement.
L'inspection d'URL unitaire n'est pas faite ici : Kevin la demande lui-même dans la propriété.
"""
import sys

sys.path.insert(0, '/Users/kevinkitanga/.claude/skills/seo/scripts')
from google_auth import get_oauth_credentials  # noqa: E402
from googleapiclient.discovery import build  # noqa: E402

SITEMAPS = ('https://memlia.fr/sitemap.xml', 'https://memlia.fr/sitemap-0.xml')


def main() -> int:
    service = build('searchconsole', 'v1', credentials=get_oauth_credentials(['https://www.googleapis.com/auth/webmasters']))
    sites = [s['siteUrl'] for s in service.sites().list().execute().get('siteEntry', []) if 'memlia' in s['siteUrl']]
    if not sites:
        print('aucune propriété memlia accessible avec ce compte')
        return 1
    site = next((s for s in sites if s.startswith('sc-domain:')), sites[0])
    for feed in SITEMAPS:
        service.sitemaps().submit(siteUrl=site, feedpath=feed).execute()
        print('renvoyé sur', site, ':', feed)
    for sm in service.sitemaps().list(siteUrl=site).execute().get('sitemap', []):
        contenus = [(c.get('type'), c.get('submitted'), c.get('indexed')) for c in sm.get('contents', [])]
        print(sm.get('path'), '| en attente :', sm.get('isPending'), '| soumis :', sm.get('lastSubmitted', '')[:19], '| lu :', sm.get('lastDownloaded', '')[:19], '| contenus :', contenus)
    return 0


if __name__ == '__main__':
    sys.exit(main())
