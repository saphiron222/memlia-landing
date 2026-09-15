#!/usr/bin/env python3
"""Régénère la preuve documentaire du glossaire validé, sans écrire dans le coffre."""
from __future__ import annotations

import argparse
from datetime import date
import hashlib
import json
from pathlib import Path
import re


DOCUMENT_NAMES = [
    '00-architecture-et-selection.md',
    '01-definitions-paie-social.md',
    '02-definitions-donnees-rgpd.md',
    '03-definitions-comptabilite-dossier.md',
    '04-definitions-automatisation.md',
    '05-maillage-et-cannibalisation.md',
    '06-gouvernance-fraicheur-maintenance.md',
    '07-registre-execution-skills.md',
    '08-registre-sources-factcheck.md',
]
REQUIRED_BULLETS = [
    'Définition directe', 'Contexte cabinet', 'Exemple fictif',
    'Confusion fréquente', 'Frontière', 'Termes associés',
    'Liens recommandés', 'Source et fraîcheur',
]
EXPECTED_ANCHORS = {
    'dsn', 'dsn-val', 'compte-rendu-metier-dsn', 'annule-et-remplace-dsn',
    'controle-avant-dsn', 'production-sociale', 'donnee-personnelle',
    'minimisation-des-donnees', 'anonymisation', 'pseudonymisation',
    'agregat-non-nominatif', 'lettrage-comptable', 'rapprochement-bancaire',
    'revision-comptable', 'piece-justificative', 'recouvrement-amiable',
    'regle-de-cabinet', 'cas-de-refus', 'controle-de-coherence',
    'schema-de-donnees', 'tracabilite', 'validation-humaine', 'fail-closed',
}


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith('---\n'):
        return {}
    try:
        block = text.split('---\n', 2)[1]
    except IndexError:
        return {}
    values: dict[str, str] = {}
    for line in block.splitlines():
        match = re.match(r'^([a-z_]+):\s*(.*?)\s*$', line)
        if match:
            values[match.group(1)] = match.group(2).strip('"\'')
    return values


def validate_frontmatter(text: str) -> list[str]:
    values = parse_frontmatter(text)
    errors = []
    if values.get('statut') != 'valide':
        errors.append("statut doit valoir 'valide'")
    if values.get('auteur') != 'hermes':
        errors.append("auteur doit valoir 'hermes'")
    if not values.get('valide_par'):
        errors.append('valide_par doit être renseigné')
    try:
        date.fromisoformat(values.get('valide_le', ''))
    except ValueError:
        errors.append('valide_le doit être une date calendaire ISO')
    return errors


def validate(root: Path) -> dict[str, object]:
    docs = [root / name for name in DOCUMENT_NAMES]
    definition_docs = docs[1:5]
    checks: list[dict[str, object]] = []
    errors: list[str] = []

    def check(name: str, ok: bool, detail: str) -> None:
        checks.append({'check': name, 'status': 'PASS' if ok else 'FAIL', 'detail': detail})
        if not ok:
            errors.append(f'{name}: {detail}')

    for path in docs:
        check(f'file:{path.name}', path.exists(), str(path))
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        frontmatter_errors = validate_frontmatter(text)
        check(f'frontmatter:{path.name}', not frontmatter_errors, '; '.join(frontmatter_errors) or 'valide + hermes + validation renseignée')
        source_match = re.search(r'(?ms)^sources:\n(?P<body>.*?)(?=^tags:)', text[:2000])
        check(f'sources:{path.name}', bool(source_match and re.search(r'^\s+-\s+', source_match.group('body'), re.M)), 'source list non-empty')
        check(f'line-limit:{path.name}', len(text.splitlines()) < 200, f'{len(text.splitlines())} lines')

    headings: list[tuple[str, str, str]] = []
    for path in definition_docs:
        if not path.exists():
            continue
        text = path.read_text(encoding='utf-8')
        matches = list(re.finditer(r'(?m)^## (?P<title>.+?) \{#(?P<anchor>[a-z0-9-]+)\}\s*$', text))
        for index, match in enumerate(matches):
            end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
            block = text[match.end():end]
            headings.append((match.group('title'), match.group('anchor'), path.name))
            missing = [label for label in REQUIRED_BULLETS if f'- **{label}' not in block]
            check(f'term-contract:{match.group("anchor")}', not missing, 'missing=' + ','.join(missing) if missing else '8/8 fields')
            check(f'fictitious:{match.group("anchor")}', 'fictif' in block.lower(), 'fictitious example explicit')

    actual_anchors = {anchor for _, anchor, _ in headings}
    check('term-count', len(headings) == 23, f'{len(headings)} terms')
    check('anchor-unique', len(actual_anchors) == len(headings), f'{len(actual_anchors)} unique')
    check('anchor-inventory', actual_anchors == EXPECTED_ANCHORS, f'missing={sorted(EXPECTED_ANCHORS-actual_anchors)}, extra={sorted(actual_anchors-EXPECTED_ANCHORS)}')

    if docs[0].exists():
        architecture = docs[0].read_text(encoding='utf-8')
        for anchor in sorted(EXPECTED_ANCHORS):
            check(f'selection:{anchor}', f'`#{anchor}`' in architecture, 'listed in architecture')
    if docs[5].exists():
        linking = docs[5].read_text(encoding='utf-8')
        check('article-links', all(slug in linking for slug in ['controler-les-bulletins-de-paie-avant-la-dsn', 'suivre-la-production-sociale-dans-excel']), '2 historical articles')
        check('anti-cannibalization', 'primaryQuery + intent' in linking and 'première occurrence' in linking.lower(), 'owner + first useful occurrence')
    if docs[6].exists():
        maintenance = docs[6].read_text(encoding='utf-8')
        check('maintenance-fields', all(term in maintenance for term in ['reviewedAt', 'nextReviewAt', 'businessReviewer', 'sourceIds']), 'required metadata present')
        check('reviewer-fail-closed', 'G2 FAIL' in maintenance and 'reviewer métier' in maintenance, 'missing reviewer blocks')

    counts = {'blog': 0, 'seo': 0, 'core': 0}
    if docs[7].exists():
        registry = docs[7].read_text(encoding='utf-8')
        sections = {
            'blog': registry.split('## Blog —', 1)[1].split('## SEO —', 1)[0],
            'seo': registry.split('## SEO —', 1)[1].split('## Noyau —', 1)[0],
            'core': registry.split('## Noyau —', 1)[1].split('## Verdict', 1)[0],
        }
        counts = {key: len(re.findall(r'(?m)^\| `[^`]+` \|', value)) for key, value in sections.items()}
        check('skills-count', counts == {'blog': 31, 'seo': 24, 'core': 19}, str(counts))
        check('controlled-failures', all(value in registry for value in ['G1 nouvelle URL : **FAIL contrôlé**', 'G2 vérité : **FAIL contrôlé**', 'Score final : **ND**']), 'no invented green score')

    snapshots = sorted((root / 'preuves').glob('sources-*-browser.json'))
    check('source-snapshots', len(snapshots) == 4, f'{len(snapshots)} source snapshots')
    for path in snapshots:
        try:
            payload = json.loads(path.read_text(encoding='utf-8'))
            ok = isinstance(payload, list) and len(payload) > 0
        except Exception:
            ok = False
        check(f'snapshot-json:{path.name}', ok, hashlib.sha256(path.read_bytes()).hexdigest())

    return {
        'task': 't_0658decc',
        'candidate': 'glossaire-conception-valide-v1',
        'status': 'PASS' if not errors else 'FAIL',
        'summary': {
            'documents': len(docs), 'terms': len(headings), 'anchors': len(actual_anchors),
            'skillRows': counts, 'sourceSnapshots': len(snapshots),
            'checks': len(checks), 'errors': len(errors),
        },
        'checks': checks,
        'errors': errors,
        'documentSha256': {path.name: hashlib.sha256(path.read_bytes()).hexdigest() for path in docs if path.exists()},
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    result = validate(args.root.resolve())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(result['summary'], ensure_ascii=False))
    print(result['status'])
    return 1 if result['errors'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
