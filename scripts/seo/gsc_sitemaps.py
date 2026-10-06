"""Projection des sitemaps GSC, sans confondre découverte et indexation.

Google a déprécié contents[].indexed : sa valeur ne mesure plus les URL indexées.
Leur nombre doit venir des verdicts de l'API d'inspection d'URL, pas de ce champ.
https://developers.google.com/webmaster-tools/v1/sitemaps
"""

PROPRIETE = 'sc-domain:memlia.fr'


def sitemap_status(sitemap):
    contents = sitemap.get('contents') or []
    submitted = None
    if contents and all(c.get('submitted') is not None for c in contents):
        submitted = sum(int(c['submitted']) for c in contents)
    return {
        'path': sitemap.get('path'),
        'last_submitted': sitemap.get('lastSubmitted'),
        'last_downloaded': sitemap.get('lastDownloaded'),
        'is_pending': bool(sitemap.get('isPending', False)),
        'is_index': bool(sitemap.get('isSitemapsIndex', False)),
        'errors': int(sitemap.get('errors', 0) or 0),
        'warnings': int(sitemap.get('warnings', 0) or 0),
        'submitted': submitted,
        'indexed': None,
        'indexation_source': 'url_inspection_required',
    }
