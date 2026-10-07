#!/usr/bin/env python3
"""Renvoie le sitemap de memlia.fr à Search Console et affiche l'état de chaque sitemap.

À lancer avec l'interpréteur du skill seo, qui porte l'OAuth Google déjà accordé :
    ~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py

Autorisation : Kevin, 16/09/2026 (« Je le renvoie par l'API »), pour les sitemaps seulement.
L'inspection d'URL unitaire n'est pas faite ici : Kevin la demande lui-même dans la propriété.
"""
import sys
from pathlib import Path
import xml.etree.ElementTree as ET

sys.path.insert(0, '/Users/kevinkitanga/.claude/skills/seo/scripts')
from google_auth import get_oauth_credentials  # noqa: E402
from googleapiclient.discovery import build  # noqa: E402

def main() -> int:
    # Exécuter après build et vérification du déploiement : ne pas soumettre un type vide.
    index = ET.parse(Path(__file__).resolve().parents[1] / 'dist/sitemap-index.xml')
    feeds = ('https://memlia.fr/sitemap.xml',) + tuple(
        node.text for node in index.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}sitemap/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
    )
    service = build('searchconsole', 'v1', credentials=get_oauth_credentials(['https://www.googleapis.com/auth/webmasters']))
    sites = [s['siteUrl'] for s in service.sites().list().execute().get('siteEntry', []) if 'memlia' in s['siteUrl']]
    if not sites:
        print('aucune propriété memlia accessible avec ce compte')
        return 1
    site = next((s for s in sites if s.startswith('sc-domain:')), sites[0])
    for feed in feeds:
        service.sitemaps().submit(siteUrl=site, feedpath=feed).execute()
        # Relire la cible précise : la soumission seule ne prouve pas son enregistrement.
        submitted = service.sitemaps().get(siteUrl=site, feedpath=feed).execute()
        if submitted.get('path') != feed or not submitted.get('lastSubmitted'):
            raise RuntimeError(f'Soumission non confirmée : {feed}')
        print('renvoyé et relu sur', site, ':', feed, '|', submitted['lastSubmitted'])
    for sm in service.sitemaps().list(siteUrl=site).execute().get('sitemap', []):
        contenus = [(c.get('type'), c.get('submitted'), c.get('indexed')) for c in sm.get('contents', [])]
        print(sm.get('path'), '| en attente :', sm.get('isPending'), '| soumis :', sm.get('lastSubmitted', '')[:19], '| lu :', sm.get('lastDownloaded', '')[:19], '| contenus :', contenus)
    return 0


if __name__ == '__main__':
    sys.exit(main())
