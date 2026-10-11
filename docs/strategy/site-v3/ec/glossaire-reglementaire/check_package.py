"""Contrôles de préparation, pas une revue juridique ni une porte de publication."""
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import unittest
import tempfile
import shutil

ROOT = Path(__file__).resolve().parent
ANCHORS = {'supervision-humaine', 'maitrise-de-l-ia', 'lettre-de-mission', 'facture-electronique-et-plateforme-agreee'}
FIELDS = {'id','term','anchor','nature','definition','context','exampleFictitious','commonConfusion','automationBoundary','relatedTerms','internalLinks','owner','author','editorialReviewer','businessReviewer','reviewedAt','sourceCheckedAt','nextReviewAt','sourceIds','routeDecision','status'}
TEXT_FIELDS = ['definition','context','exampleFictitious','commonConfusion','automationBoundary']

def validate(root=ROOT):
    entries = json.loads((root/'entries.json').read_text())
    sources = {s['id']:s for s in json.loads((root/'sources.json').read_text())}
    evidence = json.loads((root/'claims.json').read_text())
    admission = json.loads((root/'admission.json').read_text())
    assert len(entries) == 4 and {e['anchor'] for e in entries} == ANCHORS
    assert len({e['id'] for e in entries}) == 4
    today = dt.datetime.now().astimezone().date()
    for source in sources.values():
        path = root/source['snapshotPath']
        assert path.is_file(), source['id']
        assert hashlib.sha256(path.read_bytes()).hexdigest() == source['contentSha256'], source['id']
        age = (today-dt.datetime.fromisoformat(source['checkedAt']).date()).days
        assert 0 <= age <= 7, source['id']
    for e in entries:
        assert set(e) == FIELDS, e['id']
        assert e['id'] == e['anchor'] and e['nature'] == 'Réglementaire'
        assert 40 <= len(e['definition'].split()) <= 60, (e['id'], len(e['definition'].split()))
        assert all(e[f].strip() and "'" not in e[f] for f in TEXT_FIELDS)
        assert re.search(r'ficti(?:f|ve)', e['exampleFictitious'])
        assert e['author'] == 'Memlia' and e['editorialReviewer'] == 'Équipe éditoriale Memlia'
        assert e['businessReviewer'] is None and e['reviewedAt'] is None
        assert e['routeDecision'] == 'anchor' and e['status'] == 'preview-only'
        assert e['sourceIds'] and all(s in sources for s in e['sourceIds'])
        assert e['sourceCheckedAt'] == max(str(dt.datetime.fromisoformat(sources[s]['checkedAt']).date()) for s in e['sourceIds'])
        for f in TEXT_FIELDS:
            assert any(c['entryId']==e['id'] and c['field']==f for c in evidence), (e['id'],f)
            covered = {c['claim'] for c in evidence if c['entryId']==e['id'] and c['field']==f}
            assert e[f] in covered or all(sentence in covered for sentence in re.split(r'(?<=[.!?]) ',e[f])), (e['id'],f,'couverture incomplète')
        decision = next(a for a in admission['entries'] if a['entryId']==e['id'])
        assert decision['decision'] in ('admissible','deferred-no-published-article')
        if decision['decision'].startswith('deferred'):
            assert not e['internalLinks']
        for link in e['internalLinks']:
            article = next((a for a in decision['servedLinks'] if a['href']==link['href']),None)
            assert article and article['accessSuccessful'] and article['termUsageVerified'] and 'introuvable' not in article['title'].lower()
            article_text = (root/article['snapshotPath']).read_text()
            assert all(u['excerpt'] in article_text and u['needle'] in article_text.lower() for u in article['usages'])
            assert 0 <= (today-dt.datetime.fromisoformat(article['checkedAt']).date()).days <= 7
    for c in evidence:
        entry = next(e for e in entries if e['id']==c['entryId'])
        assert c['claim'] in entry[c['field']] and c['fieldText'] == entry[c['field']]
        assert c['claimType'] in ('legal-reglementaire','fiscal','information','editorial-memlia')
        if c['sourceId'] is not None:
            assert c['sourceId'] in entry['sourceIds']
            source = sources[c['sourceId']]
            assert c['excerpt'] and c['excerpt'] in (root/source['snapshotPath']).read_text(), c['id']
        else:
            assert c['claimType'] in ('information','editorial-memlia') and c['reason']
    return {'status':'PASS','entries':len(entries),'sources':len(sources),'evidencePairs':len(evidence),'publicationAllowed':False}

class PackageTest(unittest.TestCase):
    def test_real_package(self):
        self.assertEqual(validate()['status'], 'PASS')

    def reject_mutation(self, filename, mutate):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            target = Path(tmp)
            for name in ('entries.json','sources.json','claims.json','admission.json'):
                shutil.copyfile(ROOT/name, target/name)
            shutil.copytree(ROOT/'sources', target/'sources')
            shutil.copytree(ROOT/'articles', target/'articles')
            data = json.loads((target/filename).read_text())
            mutate(data)
            (target/filename).write_text(json.dumps(data))
            with self.assertRaises(AssertionError):
                validate(target)

    def test_reject_stale_source(self):
        self.reject_mutation('sources.json', lambda data: data[0].update(checkedAt='2020-01-01'))

    def test_reject_inexact_excerpt(self):
        self.reject_mutation('claims.json', lambda data: data[0].update(excerpt='EXTRAIT INVENTÉ'))

    def test_reject_unserved_link(self):
        self.reject_mutation('entries.json', lambda data: data[2]['internalLinks'][0].update(href='/blog/inexistant'))

    def test_reject_false_review(self):
        self.reject_mutation('entries.json', lambda data: data[0].update(businessReviewer='Auteur'))

    def test_reject_changed_source(self):
        self.reject_mutation('sources.json', lambda data: data[0].update(contentSha256='0'*64))

if __name__ == '__main__':
    unittest.main()
