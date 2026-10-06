#!/usr/bin/env python3
"""Renvoie le sitemap de memlia.fr à Search Console et affiche l'état de chaque sitemap.

À lancer avec l'interpréteur du skill seo, qui porte les identifiants Google déjà accordés :
    ~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py

Autorisation : Kevin, 16/09/2026 (« Je le renvoie par l'API »), pour les sitemaps seulement.
L'inspection d'URL unitaire ne soumet pas de demande de réexploration : celle-ci reste
dans l'interface Search Console. La soumission d'un sitemap ne garantit pas l'indexation.
"""
import json
import os
import sys

from seo.gsc_sitemaps import PROPRIETE, sitemap_status

SITEMAPS = ('https://memlia.fr/sitemap.xml', 'https://memlia.fr/sitemap-0.xml')


def resubmit_sitemaps(service):
    """Deux soumissions ciblées ; chaque succès réel est imprimé avant la lecture d'état."""
    for feed in SITEMAPS:
        service.sitemaps().submit(siteUrl=PROPRIETE, feedpath=feed).execute()
        print(json.dumps({'propriete': PROPRIETE, 'submitted_sitemap': feed, 'submission': 'accepted'}, ensure_ascii=False), flush=True)
    response = service.sitemaps().list(siteUrl=PROPRIETE).execute()
    return {'propriete': PROPRIETE, 'sitemaps': [sitemap_status(sm) for sm in response.get('sitemap', [])]}


def main() -> int:
    sys.path.insert(0, os.path.expanduser('~/.claude/skills/seo/scripts'))
    from google_auth import get_oauth_credentials
    from googleapiclient.discovery import build

    credentials = get_oauth_credentials(['https://www.googleapis.com/auth/webmasters'])
    if credentials is None:
        print('aucun identifiant Google disponible', file=sys.stderr)
        return 1
    service = build('searchconsole', 'v1', credentials=credentials)
    print(json.dumps(resubmit_sitemaps(service), ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
