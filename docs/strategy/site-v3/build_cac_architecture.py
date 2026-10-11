#!/usr/bin/env python3
"""Resolve the internal CAC intent contract and projected graph; never create public routes.

Called by build-cluster-plan.py after its calendar validation. --check also checks
that pages-maillage.json is the exact resolved artifact, not merely plausible data.
"""
import json
import re
import runpy
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SOURCE = HERE / 'cac/page-intent-plan.json'
OUTPUT = HERE / 'cac/pages-maillage.json'


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def key(value):
    return ' '.join(unicodedata.normalize('NFC', value).casefold().split())


def resolve(source=None, backlog=None, families=None):
    source = source if source is not None else load(SOURCE)
    backlog = backlog if backlog is not None else load(HERE / 'backlog-v3.json')
    plan = runpy.run_path(str(HERE / 'build-cluster-plan.py'))
    if families is None:
        families = plan['taxonomie']()[1]
    measurements = {r['requete']: r for r in load(ROOT / source['measureSource'])['requetes']}
    supplements = plan['SUPPLEMENTS_CAC_F4']
    f4_source = plan['SOURCE_MESURES_F4']
    f4 = {r['query']: r for r in load(HERE / f4_source)['measurements']}
    for entry in supplements.values():
        query = entry['requete']
        row = f4.get(query)
        if (not row or row.get('ok') is not True or row.get('suggestions') != []
                or not row.get('retrievedAt', '').startswith('2026-10-09')):
            raise ValueError('invalid F4 measurement: ' + query)
        measurements[query] = {'requete': query, 'ok': True, 'nombreSuggestions': 0,
                               'mesureLe': row['retrievedAt'],
                               'instrument': 'autocompleterGoogle', 'source': f4_source}
    terrain = {r['id']: r for r in load(ROOT / source['terrainSource'])}
    existing = load(ROOT / 'config/page-intent-contract.json')['pages']
    errors = plan['verifier_supplements_cac'](backlog)
    cac = [e for e in backlog if e.get('profession', 'ec') == 'cac']
    active = {fid for fid, f in families.items() if f['profession'] == 'cac' and f['active']}
    decisions = source['familyDecisions']
    if set(decisions) != active:
        errors.append('C1/C2 decisions do not match active CAC families')
    for fid, decision in decisions.items():
        task = fid.removeprefix('cac-')
        if not decision['terrain'] or not decision['queries'] or not decision['decision']:
            errors.append(f'{fid}: missing C1/C2 evidence or arbitration')
        if not any(terrain.get(v, {}).get('task') == task for v in decision['terrain']):
            errors.append(f'{fid}: no C1 gesture for this family')
        for v in decision['terrain']:
            if v not in terrain or not terrain[v]['source_text_checked']:
                errors.append(f'{fid}: invalid terrain reference {v}')
        for q in decision['queries']:
            if q not in measurements or not measurements[q]['ok']:
                errors.append(f'{fid}: no valid C2 response for {q}')
    counts = defaultdict(list)
    for e in cac:
        if e['famille'] not in active:
            errors.append(f"inactive CAC family in backlog: {e['famille']}")
        if e.get('architectureRole'):
            if e['architectureRole'] != 'pillar' or e['slug'] != 'automatiser-un-cabinet-cac-la-carte-des-taches':
                errors.append('arbitrary architectureRole cannot bypass four angles')
        elif e['slug'] not in supplements:
            counts[e['famille']].append(e)
        demand = e['demande']
        row = measurements.get(e['requete'])
        if row:
            if (demand.get('etat') != 'mesuree' or demand.get('requete') != row['nombreSuggestions']
                    or demand.get('mesureeLe') != row['mesureLe'][:10]
                    or demand.get('source') != row.get('source', 'cac/mesures/autocomplete-cac-2026-10-06.json')):
                errors.append(f"measurement drift: {e['slug']}")
        elif demand.get('etat') != 'non-mesuree' or demand.get('requete') is not None or demand.get('source') is not None:
            errors.append(f"invented measurement: {e['slug']}")
    for fid in active:
        angles = counts[fid]
        if (len(angles) != 4 or len({e.get('angle') for e in angles}) != 4
                or any(not e.get('angle') for e in angles)
                or len({e['preuve'] for e in angles}) != 4):
            errors.append(f'{fid}: four distinct gestures/proofs required')

    if errors:
        raise ValueError('\n'.join(errors))

    def evidence(query, reused=False, url=None):
        if reused:
            return {'state': 'proprietaire-existant', 'source': 'config/page-intent-contract.json',
                    'query': existing.get(url, {}).get('query'), 'volumeMensuel': None}
        row = measurements.get(query)
        if row:
            return {'state': 'mesuree', 'source': ('docs/strategy/site-v3/' + row['source']) if row.get('source') else source['measureSource'], 'query': query,
                    'measuredAt': row['mesureLe'], 'instrument': row['instrument'],
                    'suggestions': row['nombreSuggestions'], 'volumeMensuel': None}
        return {'state': 'non-mesuree', 'source': None, 'query': query, 'suggestions': None, 'volumeMensuel': None}

    pages = []
    for e in cac:
        pages.append({'id': e['slug'], 'url': '/blog/' + e['slug'], 'query': e['requete'],
                      'owner': '/blog/' + e['slug'], 'profession': 'cac', 'family': e['famille'],
                      'state': 'retenue-non-publiee', 'type': 'pilier' if e.get('architectureRole') else 'supplement' if e['slug'] in supplements else 'article',
                      'angle': e.get('angle'), 'measure': evidence(e['requete']),
                      'terrain': decisions[e['famille']]['terrain'], 'purpose': e['preuve']})
    for p in source['pages']:
        reused = p['state'] in ('existant-reutilise', 'construite-en-revue', 'publiee')
        if p['family'] not in active:
            errors.append('planned page in inactive family: ' + p['id'])
        if reused and existing.get(p['url'], {}).get('query') != p['query']:
            errors.append('reused owner drift: ' + p['id'])
        if not reused and p['url'] in existing:
            errors.append('planned route already exists: ' + p['url'])
        if p['type'] == 'guide':
            row = measurements.get(p['query'])
            if (not row or not row['ok'] or row['nombreSuggestions'] < 6
                    or row['famille'] == 'logiciels-audit'):
                errors.append('guide without six own-query task/software suggestions: ' + p['id'])
        pages.append({**p, 'owner': p['url'], 'profession': 'cac',
                      'measure': evidence(p['query'], reused, p['url']),
                      'terrain': decisions[p['family']]['terrain']})
    for p in source['deferredGuides']:
        if p['state'] != 'differee' or any(x['url'] == p['url'] for x in pages):
            errors.append('deferred integration activated')

    # One owner across current hubs, current articles, the entire backlog and this plan.
    owners = {}
    def own(query, url):
        q = key(query)
        if q in owners and owners[q] != url:
            errors.append(f'query collision: {query}: {owners[q]} / {url}')
        owners[q] = url
    # Freeze historical EC ownership conflicts instead of repairing public
    # surfaces in C3. No CAC owner may join a multi-owner historical intention.
    historical = defaultdict(set)
    for url, p in existing.items():
        historical[key(p['query'])].add(url)
    for e in backlog:
        if e.get('profession', 'ec') != 'cac':
            historical[key(e['requete'])].add('/blog/' + e['slug'])
    for p in load(HERE / 'mesures/registre-requetes.json')['articles']:
        historical[key(p['requete'])].add(p['url'].removeprefix('https://memlia.fr'))
    for p in pages:
        prior = historical.get(key(p['query']), set())
        if prior and prior != {p['owner']}:
            errors.append(f"query collision against historical owners: {p['query']}: {sorted(prior)}")
        own(p['query'], p['owner'])
    by_id = {p['id']: p for p in pages}
    if len(by_id) != len(pages) or len({p['url'] for p in pages}) != len(pages):
        errors.append('duplicate page id or route')
    links = {}
    def link(a, b, context):
        if a == b or a not in by_id or b not in by_id:
            errors.append(f'invalid edge: {a} -> {b}')
            return
        links[(a, b)] = {'from': by_id[a]['url'], 'to': by_id[b]['url'], 'context': context,
                         'state': 'projete-non-publie'}
    pillar = 'automatiser-un-cabinet-cac-la-carte-des-taches'
    link('accueil', pillar, 'Choisir une tâche avant de la confier')
    link(pillar, 'accueil', 'Confier une première tâche CAC')
    link('accueil', 'rubrique', 'Lire les méthodes de préparation CAC')
    link('rubrique', pillar, 'Situer chaque méthode dans la carte des tâches')
    link(pillar, 'rubrique', 'Parcourir les méthodes par geste')
    for hub in ('hub-outils', 'hub-glossaire'):
        link('accueil', hub, 'Supports de préparation et repères du cabinet')
        link(hub, 'accueil', 'Préparation des tâches de commissariat aux comptes')
    for p in source['pages']:
        hub = 'hub-outils' if p['type'] in ('outil', 'outil-existant') else 'hub-glossaire' if p['type'] == 'glossaire' else None
        if hub:
            link(hub, p['id'], p['query'])
            link(p['id'], hub, 'Autres supports gratuits' if hub == 'hub-outils' else 'Autres définitions')
    graph_members = {fid: members + [e for e in cac if e['slug'] in supplements and e['famille'] == fid]
                     for fid, members in counts.items()}
    for members in graph_members.values():
        for i, e in enumerate(members):
            sid = e['slug']
            link(pillar, sid, e['titre'])
            link(sid, pillar, 'Frontière de cette tâche dans la mission CAC')
            link('rubrique', sid, e['titre'])
            link(sid, 'rubrique', 'Autres méthodes de préparation CAC')
            for step in (1, 2):
                brother = members[(i + step) % len(members)]
                link(sid, brother['slug'], brother['requete'])
    for p in source['pages']:
        if not p.get('contextFrom'):
            continue
        link(pillar, p['id'], p.get('purpose', p['query']))
        link(p['id'], pillar, 'Situer ce support dans les tâches CAC')
        for sid in p['contextFrom']:
            if sid not in by_id or by_id[sid]['family'] != p['family']:
                errors.append('context from unrelated family: ' + sid)
            link(sid, p['id'], p.get('purpose', p['query']))
            link(p['id'], sid, 'Méthode : ' + by_id[sid]['query'] if sid in by_id else 'inconnue')
    for p in pages:
        p['incoming'] = [l for l in links.values() if l['to'] == p['url']]
        p['outgoing'] = [l for l in links.values() if l['from'] == p['url']]
        if not p['incoming'] or not p['outgoing']:
            errors.append('orphan page: ' + p['id'])
        if p['type'] in ('service', 'outil', 'outil-existant') and len(p['incoming']) < 3:
            errors.append('fewer than three contextual inputs: ' + p['id'])
    if errors:
        raise ValueError('\n'.join(errors))
    return {'version': 1, 'profession': 'cac', 'publication': source['publication'],
            'promotion': source['promotion'], 'sources': [str(SOURCE.relative_to(ROOT)), source['blogSource'],
                                                        'docs/strategy/site-v3/' + f4_source],
            'familyDecisions': decisions, 'pages': pages,
            'deferredGuides': [{**p, 'measure': evidence(p['query'])} for p in source['deferredGuides']],
            'links': list(links.values()),
            'meta': {'pages': len(pages), 'links': len(links), 'activeFamilies': len(active),
                     'articles': sum(p['type'] == 'article' for p in pages),
                     'supplements': sum(p['type'] == 'supplement' for p in pages), 'volumeMensuel': None}}


def markdown(data):
    """Human-readable page map from the same resolved contract as the graph."""
    taxonomy = runpy.run_path(str(HERE / 'build-cluster-plan.py'))['taxonomie']()[1]
    def safe(value):
        return str(value).replace('|', '\\|').replace('\n', ' ')
    lines = ['# Architecture CAC — pôles, familles, pages et maillage', '',
        '## Décision', '',
        'Ouvrir huit familles sur les gestes C1 et les réponses C2 : certification et préparation administrative. '
        'Les cinq pôles du support sont représentés ; interventions légales, SACC et durabilité restent en réserve. '
        'Une réponse vide à l’autocomplétion reste une mesure, pas une preuve d’absence de besoin. '
        'Les signaux indirects et les limites de chaque ouverture figurent ci-dessous.', '',
        'Sources : [terrain C1](TERRAIN-CAC.md), [demande C2](DEMANDE-CAC.md), '
        '[mesures par requête](mesures/autocomplete-cac-2026-10-06.json). '
        'Les deux suppléments F4 reprennent les réponses valides sans suggestion du 09/10/2026 '
        '([relevé intégral](mesures/f4-rubrique-preflight-2026-10-09.json)), sans inventer de volume. '
        'Aucun volume mensuel ni chevauchement du top10 Google n’a été mesuré.', '',
        '## Contrat et périmètre', '',
        '`page-intent-plan.json` fixe les propriétaires futurs ; `pages-maillage.json` résout les requêtes, preuves et liens. '
        '`config/page-intent-contract.json.pages` reste réservé aux pages réellement rendues : chaque publication y promeut son contrat. '
        'Cette architecture ne publie aucune nouvelle route ni aucun contenu réglementaire. '
        'Les formulations non mesurées seront sondées avant fabrication ; les faits seront sourcés puis relus par métier.', '',
        'Les entrées `/glossaire#…` sont des intentions de terme et des destinations de maillage, '
        'pas des pages indexables autonomes : canonical et requête primaire du hub `/glossaire` sont conservés. '
        'La vague F5 complète les termes uniquement après contrôle des propriétaires ci-dessous ; aucun quota de quarante pages n’est imposé.', '',
        '## Familles et preuves', '', '| Famille | Pôle | État | Décision et preuves |', '|---|---|---|---|']
    for fid, f in taxonomy.items():
        if f['profession'] != 'cac':
            continue
        decision = data['familyDecisions'].get(fid)
        proof = (decision['decision'] + ' C1 : ' + ', '.join(decision['terrain']) + ' ; C2 : ' + ', '.join(decision['queries'])) if decision else f['description']
        lines.append(f"| `{fid}` | {f['pole']} | {'ouverte' if f['active'] else 'réserve inactive'} | {safe(proof)} |")
    lines += ['', 'Le legacy `audit-legal` reste inactif pour les contenus historiques EC ; '
              'les familles actives CAC ne le réactivent pas. B2 traite séparément les anciennes mentions publiques.', '',
              '## Carte des pages par hub', '',
              'Quatre angles de geste et de preuve par famille ouverte, plus un pilier transversal et deux suppléments F4 explicitement mandatés. '
              'Les services vendent une préparation maintenue ; les outils exécutent un travail autonome ; '
              'les articles expliquent une méthode ou un cas précis. Les variantes de tiers de circularisation '
              'restent des sections, pas des pages clonées. Signification et planification partagent le même outil ; '
              'analyse FEC et pseudonymisation réutilisent les pages existantes.', '']
    types = ('accueil', 'service', 'outil', 'outil-existant', 'hub-existant', 'pilier', 'rubrique', 'article', 'supplement', 'glossaire')
    for kind in types:
        pages = [p for p in data['pages'] if p['type'] == kind]
        if not pages:
            continue
        lines += ['### ' + kind, '', '| URL / destination | Requête primaire / intention du terme | État | Mesure | Résultat distinct |', '|---|---|---|---|---|']
        for p in pages:
            m = p['measure']
            measure = f"{m['suggestions']} suggestions ; {m['measuredAt']}" if m['state'] == 'mesuree' else m['state']
            lines.append(f"| `{p['url']}` | {safe(p['query'])} | {p['state']} | {measure} | {safe(p.get('purpose', 'entrée de navigation'))} |")
        lines.append('')
    lines += ['## Guides tâche · logiciel : différés', '', '| URL candidate | Requête propre | Motif |', '|---|---|---|']
    for p in data['deferredGuides']:
        lines.append(f"| `{p['url']}` | {p['query']} | {safe(p['reason'])} |")
    lines += ['', 'F3 sonde ces requêtes avant d’ouvrir un guide ; une marque seule ne satisfait jamais les six suggestions. '
              'Le hub `/integrations` reste inchangé tant qu’aucun guide CAC ne franchit ce critère.', '',
              '## Matrice de maillage projetée', '',
              'Tous ces liens sont à poser pendant la fabrication, pas des liens actuellement en production. '
              'Les outils reçoivent aussi le lien du hub existant. Un article peut citer un terme du glossaire '
              'sans créer une page de définition supplémentaire. Les libellés contextuels de chaque arête '
              'sont dans `pages-maillage.json.links`.', '',
              '| URL / destination | Liens entrants | Liens sortants |', '|---|---|---|']
    for p in data['pages']:
        incoming = '<br>'.join('`' + l['from'] + '`' for l in p['incoming'])
        outgoing = '<br>'.join('`' + l['to'] + '`' for l in p['outgoing'])
        lines.append(f"| `{p['url']}` | {incoming} | {outgoing} |")
    lines += ['', '## Exécution et contrôles', '',
              'F1 : trois services. F2 : cinq outils nouveaux et deux réutilisations. '
              'F3 : quatre pistes différées. F4 : rubrique, pilier, trente-deux angles et deux suppléments bornés (appréciation de l’outil et constitution finale du dossier). '
              'F5 : trois intentions de terme prioritaires puis enrichissement sans concurrence avec les méthodes et outils. '
              'D9 décide les quotas : C3 ne les change pas. Le stock est planifié, non une promesse de date de publication.', '',
              'Régénérer : `python3 docs/strategy/site-v3/build-cluster-plan.py`. '
              'Vérifier : même commande avec `--check`, puis tests `test_cac_architecture.py` et `cac-profession.test.mjs`. '
              'Le contrôle refuse les propriétaires en double contre le contrat actuel, le backlog et le registre ; '
              'il conserve les conflits historiques EC hors périmètre et interdit qu’une page CAC les rejoigne.', '',
              'Mesurer à publication : disponibilité et canonical, liens réellement posés, puis J+7 et J+28 '
              '(indexation, impressions/clics, usage des exports et demandes qualifiées). '
              'Aucune cible chiffrée de trafic n’est inventée sans base Search Console.']
    return '\n'.join(lines) + '\n'


if __name__ == '__main__':
    try:
        data = resolve()
        text = json.dumps(data, ensure_ascii=False, indent=2) + '\n'
        report = HERE / 'cac/ARCHITECTURE-CAC.md'
        report_text = markdown(data)
        if '--check' in sys.argv:
            if not OUTPUT.exists() or OUTPUT.read_text(encoding='utf-8') != text:
                raise ValueError('pages-maillage.json stale: regenerate build-cluster-plan.py')
            if not report.exists() or report.read_text(encoding='utf-8') != report_text:
                raise ValueError('ARCHITECTURE-CAC.md stale: regenerate build-cluster-plan.py')
        elif '--validate' not in sys.argv:
            OUTPUT.write_text(text, encoding='utf-8')
            report.write_text(report_text, encoding='utf-8')
        print(f"CAC architecture: {data['meta']['pages']} pages, {data['meta']['articles']} angles, {data['meta']['links']} projected links: OK")
    except (ValueError, KeyError) as exc:
        raise SystemExit(str(exc)) from exc
