import json
import pathlib
from html.parser import HTMLParser

Q = pathlib.Path(__file__).resolve().parent
SITE = Q.parents[4]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.h1s = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'h1':
            self.h1s += 1

m = json.loads((Q / 'autocomplete.json').read_text())
assert len(m['results']) == 8 and all(x['ok'] for x in m['results'])
assert sum(not x['suggestions'] for x in m['results']) == 7
assert [s for x in m['results'] for s in x['suggestions']] == ['collecte des pièces comptables']
assert m['monthlyVolume'] is None
v = json.loads((Q / 'verification.json').read_text())
assert v['status'] == 'PASS' and v['decision'] == 'non-ouverture'
assert [x['httpStatus'] for x in v['production']] == [200, 200, 404]
assert not v['serpAvailable'] and not v['recipeCreated'] and not v['siteChanges']
for result, name in zip(v['production'], ['blog', 'service-general', 'candidate']):
    page = Page()
    page.feed((Q / 'sources' / f'{name}.html').read_text())
    assert page.canonical == result['canonical'] and page.h1s == 1
sources = json.loads((Q / 'sources-ouvertes.json').read_text())
assert [s['name'] for s in sources['sources']] == ['Dext', 'MyCompanyFiles']
for name, needle in [('dext', 'Vos clients peuvent vous transmettre leurs documents'), ('mycompanyfiles', 'Je dois toujours relancer')]:
    assert needle in (Q / 'sources' / f'{name}.html').read_text()
report = (Q / 'QUALIFICATION-COLLECTE-PIECES.md').read_text()
for text in ['Ne pas ouvrir `/automatisation/collecte-pieces`', '/blog/automatiser-la-relance-des-pieces-clients', '/automatisation-cabinet-comptable', 'Critère de réouverture', 'Google a servi une page anti-robot']:
    assert text in report
registry = json.loads((SITE / 'docs/strategy/site-v3/mesures/registre-requetes.json').read_text())
article = next(x for x in registry['articles'] if x['slug'] == 'automatiser-la-relance-des-pieces-clients')
assert article['requete'] == 'relance pièces manquantes cabinet comptable'
assert not any(x['url'] == 'https://memlia.fr/automatisation/collecte-pieces' for x in registry['articles'])
recipe = json.loads((SITE / 'editorial/recettes/automatiser-la-relance-des-pieces-clients/recette.json').read_text())
assert recipe['famille'] == 'collecte-pieces' and recipe['cta']['destination'] == '/contact'
assert not (SITE / 'commercial/recettes/collecte-pieces').exists()
print('PASS — huit sondes, sources archivées, décision et parcours existants conservés ; GET historiques 200/200/404, sans nouvelle mesure.')
