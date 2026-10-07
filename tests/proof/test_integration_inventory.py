"""Contrats de l'inventaire indépendant ; aucune fixture ne rejoint le corpus public."""
import hashlib
import json
import shutil
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
import xml.etree.ElementTree as ET
from unittest.mock import patch

import test_build as build


class IntegrationInventoryProof(unittest.TestCase):
    def test_page_et_sitemap_supplementaires_restent_refuses(self):
        with TemporaryDirectory() as directory:
            dist = Path(directory) / 'dist'
            shutil.copytree(build.DIST, dist)
            with patch.object(build, 'DIST', dist):
                pages = build.BuildProof('test_pages_one_h1_french')
                sitemap = build.BuildProof('test_sitemap_complete_no_legal')
                pages.test_pages_one_h1_french()
                sitemap.test_sitemap_complete_no_legal()
                orphan = dist / 'integrations/orpheline.html'
                orphan.write_text('<html lang="fr"><h1>Orpheline</h1></html>')
                with self.assertRaises(AssertionError):
                    pages.test_pages_one_h1_french()
                orphan.unlink()
                ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
                index = ET.parse(dist / 'sitemap.xml')
                location = index.find(f'.//{ns}loc')
                assert location is not None and location.text
                child = location.text.rsplit('/', 1)[-1]
                target = dist / child
                tree = ET.parse(target)
                url = ET.SubElement(tree.getroot(), ns + 'url')
                ET.SubElement(url, ns + 'loc').text = build.SITE + '/integrations/orpheline'
                ET.SubElement(url, ns + 'lastmod').text = '2026-10-06T00:00:00Z'
                tree.write(target)
                with self.assertRaises(AssertionError):
                    sitemap.test_sitemap_complete_no_legal()

    def fixture(self, root):
        def write(path, data):
            target = root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
            return hashlib.sha256(target.read_bytes()).hexdigest()

        source = root / 'src/data/integrations.ts'
        source.parent.mkdir(parents=True)
        source.write_text("export const INTEGRATIONS_HISTORIQUES: readonly IntegrationDefinition[] = [\n{slug: 'historique'},\n];\n")
        slug = 'nouveau-guide'
        definition = {'slug': slug, 'h1': 'Contrôler avant fermeture'}
        recipe_path = f'guides/recettes/{slug}/recette.json'
        evidence_path = f'guides/recettes/{slug}/autocomplete.json'
        evidence_hash = write(evidence_path, {'fixture': 'octets de provenance, pas une mesure Google'})
        candidate = write(recipe_path, {'version': 1, 'type': 'guide', 'mode': 'nouveau', 'author': 'dev', 'integration': definition, 'demand': {'evidencePath': 'autocomplete.json', 'sha256': evidence_hash}})
        review_hash = write(f'guides/recettes/{slug}/revue.json', {'kind': 'qa', 'status': 'PASS', 'reviewer': 'qa', 'candidateSha256': candidate, 'observations': ['Fixture de contrat.']})
        files = {recipe_path: candidate, evidence_path: evidence_hash}
        for path in [f'public/proofs/integrations/{slug}.webp', f'guides/etats/{slug}/preuve.html']:
            files[path] = write(path, {'fixture': path})
        proof = {'alt': 'Simulation'}
        manifest = {'version': 1, 'slug': slug, 'mode': 'nouveau', 'status': 'scelle', 'candidateSha256': candidate, 'files': files, 'rendererSha256': hashlib.sha256(b'renderer-fixture').hexdigest(), 'proof': proof}
        seal = {key: value for key, value in manifest.items() if key not in ('mode', 'status')}
        seal['reviewSha256'] = review_hash
        manifest['sealSha256'] = write(f'guides/etats/{slug}/scellement.json', seal)
        write(f'guides/etats/{slug}/manifest.json', manifest)
        write('src/data/guides.generated.json', [definition])
        write('src/data/guide-proofs.generated.json', {f'integrations/{slug}': proof})
        return slug, write

    def test_guide_scelle_entre_dans_les_pages_sans_liste_fermee(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            slug, _ = self.fixture(root)
            dist = root / 'dist'
            (dist / 'integrations').mkdir(parents=True)
            for name in ['historique', slug]:
                (dist / 'integrations' / f'{name}.html').write_text('<html lang="fr"><h1>Contrôle</h1></html>')
            with patch.multiple(build, ROOT=root, DIST=dist, PAGES_FIXES=[], PREVIEW_ARTICLES=set()):
                self.assertEqual(build.public_integrations(), {'historique', slug})
                build.BuildProof('test_pages_one_h1_french').test_pages_one_h1_french()
                (dist / 'integrations/orpheline.html').write_text('<html lang="fr"><h1>Orpheline</h1></html>')
                with self.assertRaises(AssertionError):
                    build.BuildProof('test_pages_one_h1_french').test_pages_one_h1_french()

    def test_collection_et_provenance_orphelines_restent_refusees(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            slug, write = self.fixture(root)
            with patch.object(build, 'ROOT', root):
                self.assertIn(slug, build.public_integrations())
                for path in [f'guides/recettes/{slug}/autocomplete.json', f'guides/recettes/{slug}/revue.json', f'guides/etats/{slug}/scellement.json', f'public/proofs/integrations/{slug}.webp']:
                    target = root / path
                    original = target.read_bytes()
                    target.write_bytes(original + b' ')
                    with self.subTest(path=path), self.assertRaises(AssertionError):
                        build.public_integrations()
                    target.write_bytes(original)
                write('src/data/guides.generated.json', [{'slug': slug, 'h1': 'Muté'}])
                with self.assertRaises(AssertionError):
                    build.public_integrations()
                write('src/data/guides.generated.json', [{'slug': 'orphelin'}])
                with self.assertRaises(AssertionError):
                    build.public_integrations()
