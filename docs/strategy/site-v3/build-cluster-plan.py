#!/usr/bin/env python3
"""Source unique du plan éditorial v3 : nourri du backlog par famille (backlog-v3.json), de la
taxonomie (src/data/familles.ts) et de l'état publié (src/content/blog), il génère
cluster-plan.json, cluster-plan.md, cluster-map.html et CONTENT-CALENDAR.md, et vérifie les
invariants (unicité, appartenance aux énumérations du schéma, maillage, cadence).

Usage, depuis la racine du dépôt :
    python3 docs/strategy/site-v3/build-cluster-plan.py            # régénère
    python3 docs/strategy/site-v3/build-cluster-plan.py --check    # régénère et échoue si un invariant casse
"""
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path

ICI = Path(__file__).resolve().parent
RACINE = ICI.parents[2]
GABARIT = Path.home() / '.claude/skills/seo-cluster/templates/cluster-map.html'
SCHEMA = RACINE / 'src/content.config.ts'
TAXONOMIE = RACINE / 'src/data/familles.ts'
BLOG = RACINE / 'src/content/blog'
BACKLOG = ICI / 'backlog-v3.json'
# Les trois articles publiés avant la v3 (chaîne antérieure, sans champ famille) : rattachés ici, jamais réécrits.
FAMILLE_HISTORIQUE = {
    'controler-les-bulletins-de-paie-avant-la-dsn': 'bulletins-controle',
    'comprendre-les-comptes-rendus-metier-dsn': 'dsn-crm',
    'suivre-la-production-sociale-dans-excel': 'suivi-production-sociale',
}

PAR_JOUR_MAX = 2
PAR_SEMAINE_MAX = 4
JOURS_DE_PUBLICATION = (0, 1, 2, 3)  # lundi à jeudi ; la semaine 38 (deux articles le 16/09) se complète le jeudi 17/09
PREMIER_JOUR = date(2026, 9, 17)
GABARIT_PAR_FORMAT = {'pillar-page': 'ultimate-guide', 'how-to-guide': 'how-to', 'faq-knowledge': 'explainer', 'listicle-checklist': 'listicle', 'tutorial': 'how-to', 'resource-template': 'landing-page'}
MOTS_PAR_FORMAT = {'pillar-page': 3200, 'how-to-guide': 1500, 'faq-knowledge': 1300, 'listicle-checklist': 1400, 'tutorial': 1500, 'resource-template': 1200}


def enum_du_schema(nom):
    texte = SCHEMA.read_text(encoding='utf-8')
    m = re.search(nom + r"\s*:\s*z(?:\s*\.\s*array\(\s*z)?\s*\.\s*enum\(\[([^\]]+)\]", texte)
    if not m:
        raise SystemExit(f'énumération {nom} introuvable dans {SCHEMA}')
    return {v.strip().strip("'\"") for v in m.group(1).split(',') if v.strip()}


def taxonomie():
    texte = TAXONOMIE.read_text(encoding='utf-8')
    poles = {m.group(1): {'libelle': m.group(2), 'couleur': m.group(3)} for m in re.finditer(r"'([a-z-]+)': \{ libelle: '([^']+)', couleur: '(#[0-9a-f]{6})' \}", texte)}
    familles = {}
    for m in re.finditer(r"f\('([a-z0-9-]+)', '([^']+)', '([a-z-]+)', '([^']*)'(?:, (false|true))?\)", texte):
        familles[m.group(1)] = {'id': m.group(1), 'libelle': m.group(2), 'pole': m.group(3), 'description': m.group(4), 'active': m.group(5) != 'false', 'rang': len(familles)}
    if not poles or not familles:
        raise SystemExit('taxonomie illisible')
    return poles, familles


def etat_publie():
    publies = {}
    for fichier in sorted(BLOG.glob('*.md')):
        fm = fichier.read_text(encoding='utf-8').split('---', 2)[1]

        def champ(nom):
            m = re.search(rf'^{nom}:\s*"?([^"\n]+?)"?\s*$', fm, re.M)
            return m.group(1) if m else None
        if champ('brouillon') == 'false':
            publies[fichier.stem] = {'date': champ('datePublication'), 'famille': champ('famille'), 'format': champ('format'), 'requete': champ('primaryQuery'), 'titre': champ('titre')}
    return publies


def semaine_iso(jour):
    return jour.isocalendar()[:2]


def planifier(entrees, publies):
    """Attribue une date à chaque angle non publié : 4 par semaine ISO, au plus 2 par jour, lundi à jeudi."""
    par_jour, par_semaine = Counter(), Counter()
    for p in publies.values():
        if p['date']:
            d = date.fromisoformat(p['date'])
            par_jour[d] += 1
            par_semaine[semaine_iso(d)] += 1
    jour = PREMIER_JOUR
    for e in entrees:
        if e['slug'] in publies:
            e['date'] = publies[e['slug']]['date']
            e['statut'] = 'published'
            continue
        while not (jour.weekday() in JOURS_DE_PUBLICATION and par_jour[jour] < PAR_JOUR_MAX and par_semaine[semaine_iso(jour)] < PAR_SEMAINE_MAX):
            jour += timedelta(days=1)
        e['date'] = jour.isoformat()
        e['statut'] = 'planned'
        par_jour[jour] += 1
        par_semaine[semaine_iso(jour)] += 1
        # En régime : un article par jour ouvré ; le même jour ne reçoit un second article que pour finir une semaine entamée.
        jours_restants = sum(1 for d in range(1, 4) if (jour + timedelta(days=d)).weekday() in JOURS_DE_PUBLICATION and semaine_iso(jour + timedelta(days=d)) == semaine_iso(jour))
        if par_semaine[semaine_iso(jour)] < PAR_SEMAINE_MAX and (jours_restants >= PAR_SEMAINE_MAX - par_semaine[semaine_iso(jour)] or par_jour[jour] >= PAR_JOUR_MAX):
            jour += timedelta(days=1)
        elif par_semaine[semaine_iso(jour)] >= PAR_SEMAINE_MAX:
            jour += timedelta(days=1)


def construire():
    poles, familles = taxonomie()
    publies = etat_publie()
    backlog = json.loads(BACKLOG.read_text(encoding='utf-8'))
    for i, e in enumerate(backlog):
        e['rang_famille'] = sum(1 for x in backlog[:i] if x['famille'] == e['famille'])
    pilier = next(e for e in backlog if e['format'] == 'pillar-page')
    satellites = [e for e in backlog if e is not pilier]
    for slug, famille in FAMILLE_HISTORIQUE.items():
        p = publies.get(slug)
        if p and slug not in {e['slug'] for e in backlog}:
            satellites.append({'slug': slug, 'titre': p['titre'], 'requete': p['requete'], 'secondaires': [], 'famille': famille, 'role': 'paie-responsables-sociaux', 'intent': 'executer', 'funnel': 'MOFU', 'format': p['format'] or 'how-to-guide', 'preuve': 'article historique conservé (dossier scellé sur ses octets)', 'sourcesOfficielles': ['net-entreprises.fr', 'urssaf.fr'], 'priorite': 1, 'rang_famille': 4, 'historique': True})
    # Ordre de production : publiés d'abord, puis priorité, puis angle (méthode avant checklist, exceptions, définition), puis rang de la famille.
    satellites.sort(key=lambda e: (0 if e['slug'] in publies else 1, e['priorite'], e['rang_famille'], familles[e['famille']]['rang']))
    planifier([pilier] + satellites, publies)
    for e in [pilier] + satellites:
        e['pole'] = familles[e['famille']]['pole']
        e['url'] = f"/blog/{e['slug']}"
        e['gabarit'] = GABARIT_PAR_FORMAT[e['format']]
        e['mots'] = MOTS_PAR_FORMAT[e['format']]
    liens = []
    for e in satellites:
        liens.append({'de': e['slug'], 'vers': pilier['slug'], 'type': 'pilier', 'ancre': 'automatiser une tâche du cabinet'})
        liens.append({'de': pilier['slug'], 'vers': e['slug'], 'type': 'pilier', 'ancre': e['titre']})
    par_famille = defaultdict(list)
    for e in satellites:
        par_famille[e['famille']].append(e)
    for membres in par_famille.values():
        ordre = sorted(membres, key=lambda e: e['rang_famille'])
        k = len(ordre)
        for i, e in enumerate(ordre):
            for d in (1, 2):
                if k >= 3 or (k == 2 and d == 1):
                    cible = ordre[(i + d) % k]
                    if cible['slug'] != e['slug']:
                        liens.append({'de': e['slug'], 'vers': cible['slug'], 'type': 'famille', 'ancre': cible['requete']})
    return poles, familles, publies, pilier, satellites, liens, par_famille


def verifier(poles, familles, publies, pilier, satellites, liens, par_famille):
    erreurs = []
    tous = [pilier] + satellites
    slugs = [e['slug'] for e in tous]
    if len(slugs) != len(set(slugs)):
        erreurs.append('slugs en double')
    reqs = [e['requete'].strip().lower() for e in tous]
    if len(reqs) != len(set(reqs)):
        erreurs.append('requêtes primaires en double (cannibalisation)')
    roles_ok, formats_ok, intents_ok, funnels_ok = enum_du_schema('rolePrincipal'), enum_du_schema('format'), enum_du_schema('intent'), enum_du_schema('funnel')
    for e in tous:
        f = familles.get(e['famille'])
        if not f:
            erreurs.append(f"famille hors taxonomie : {e['famille']} ({e['slug']})")
        elif not f['active']:
            erreurs.append(f"famille fermée utilisée : {e['famille']} ({e['slug']})")
        for champ, valides in (('role', roles_ok), ('format', formats_ok), ('intent', intents_ok), ('funnel', funnels_ok)):
            if e[champ] not in valides:
                erreurs.append(f"{champ} hors schéma : {e[champ]} ({e['slug']})")
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', e['slug']) or not (10 <= len(e['titre']) <= 90):
            erreurs.append(f"slug ou titre non conforme : {e['slug']}")
    actives = {fid for fid, f in familles.items() if f['active']}
    manquantes = actives - set(par_famille)
    if manquantes:
        erreurs.append(f'familles actives sans angle : {sorted(manquantes)}')
    for fid, membres in par_famille.items():
        angles = [e for e in membres if not e.get('historique')]
        attendu = 3 if fid == pilier['famille'] else 4  # le pilier est le quatrième angle de sa famille
        if len(angles) != attendu:
            erreurs.append(f'{fid} : {len(angles)} angles au lieu de {attendu}')
    for slug in publies:
        if slug not in slugs:
            erreurs.append(f'article publié absent du backlog et de la table historique : {slug}')
    # Depuis le 19/09/2026, une priorité 1 se mérite par une mesure : autocomplétion ou page de résultats datée (scripts/seo/questions.mjs).
    for e in satellites:
        if e.get('historique') or e['slug'] in publies:
            continue
        if e['priorite'] == 1 and not (e.get('demande') or {}).get('mesureeLe'):
            erreurs.append(f"angle de priorité 1 sans demande mesurée : {e['slug']}")
    par_jour, par_semaine = Counter(), Counter()
    for e in tous:
        d = date.fromisoformat(e['date'])
        par_jour[d] += 1
        par_semaine[semaine_iso(d)] += 1
    if any(n > PAR_JOUR_MAX for n in par_jour.values()):
        erreurs.append('plus de deux articles le même jour')
    if any(n > PAR_SEMAINE_MAX for n in par_semaine.values()):
        erreurs.append('plus de quatre articles la même semaine')
    entrants = {s: 0 for s in slugs}
    for l in liens:
        if l['vers'] not in entrants or l['de'] not in entrants:
            erreurs.append(f'lien vers un slug inconnu : {l}')
            continue
        entrants[l['vers']] += 1
    for e in satellites:
        if entrants[e['slug']] < 3:
            erreurs.append(f"moins de trois liens entrants : {e['slug']} ({entrants[e['slug']]})")
    return erreurs, entrants, par_semaine


def ecrire_json(poles, familles, pilier, satellites, liens, entrants):
    clusters = []
    for pid, pole in poles.items():
        posts = [e for e in satellites if e['pole'] == pid]
        if not posts:
            continue
        clusters.append({'id': pid, 'name': pole['libelle'], 'color': pole['couleur'], 'families': sorted({e['famille'] for e in posts}, key=lambda f: familles[f]['rang']), 'posts': [
            {'title': e['titre'], 'keyword': e['requete'], 'volume': None, 'template': e['gabarit'], 'format': e['format'], 'wordCount': e['mots'], 'url': e['url'], 'slug': e['slug'], 'family': e['famille'], 'role': e['role'], 'intent': e['intent'], 'funnel': e['funnel'], 'priority': e['priorite'], 'date': e['date'], 'secondaryKeywords': e['secondaires'], 'proof': e['preuve'], 'officialSources': e['sourcesOfficielles'], 'status': e['statut'], 'incomingLinks': entrants[e['slug']]}
            for e in sorted(posts, key=lambda e: (familles[e['famille']]['rang'], e['rang_famille']))]})
    data = {
        'version': 2, 'date': date.today().isoformat(), 'seed': 'automatisation cabinet comptable',
        'methode': 'backlog de quatre angles par famille (méthode, contrôle ou checklist, exceptions et refus, définition), 59 familles actives en 12 pôles ; cadence 4 par semaine et 2 par jour au plus ; maillage pilier ↔ satellite et 2 liens cycliques par famille ; priorité posée depuis la demande mesurée par angle (autocomplétion Google et pages de résultats DataForSEO, scripts/seo/questions.mjs, depuis le 19/09/2026 ; un angle de priorité 1 sans mesure datée fait échouer --check)',
        'pillar': {'title': pilier['titre'], 'keyword': pilier['requete'], 'volume': 10, 'template': pilier['gabarit'], 'wordCount': pilier['mots'], 'url': pilier['url'], 'slug': pilier['slug'], 'family': pilier['famille'], 'status': pilier['statut'], 'date': pilier['date']},
        'clusters': clusters,
        'links': [{'from': l['de'], 'to': l['vers'], 'type': l['type'], 'anchor': l['ancre']} for l in liens],
        'meta': {'totalPosts': len(satellites), 'plannedPosts': sum(1 for e in satellites if e['statut'] == 'planned'), 'publishedPosts': sum(1 for e in satellites if e['statut'] == 'published'), 'totalClusters': len(clusters), 'totalFamilies': len({e['famille'] for e in satellites}), 'totalLinks': len(liens), 'estimatedWords': pilier['mots'] + sum(e['mots'] for e in satellites)},
    }
    (ICI / 'cluster-plan.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return data


def ecrire_md(data, familles):
    L = ['# Plan de cluster v3 — « automatisation cabinet comptable »', '',
         f"Généré le {data['date']} par `build-cluster-plan.py` (source unique : `backlog-v3.json`, `src/data/familles.ts`, `src/content/blog`). {data['meta']['totalPosts']} satellites ({data['meta']['publishedPosts']} publiés, {data['meta']['plannedPosts']} planifiés) en {data['meta']['totalFamilies']} familles et {data['meta']['totalClusters']} pôles, {data['meta']['totalLinks']} liens, {data['meta']['estimatedWords']} mots estimés.", '',
         '## Méthode', '', data['methode'] + '.', '',
         'Recouvrement SERP entre familles (relevés WebSearch des 10/09 et 16/09/2026) : au plus deux domaines partagés, jamais quatre ; chaque famille est donc un cluster distinct, interlié par le pilier, et les quatre angles d’une même famille se lient entre eux.', '',
         '## Pilier', '', f"- **{data['pillar']['title']}** — `{data['pillar']['url']}` — « {data['pillar']['keyword']} » — {data['pillar']['status']} ({data['pillar']['date']}).", '']
    for c in data['clusters']:
        L += [f"## {c['name']} (`{c['id']}`)", '']
        for fid in c['families']:
            L += [f"### {familles[fid]['libelle']} (`{fid}`)", '', familles[fid]['description'], '', '| Date | Article | Requête primaire | Format | Rôle | P | Statut |', '|---|---|---|---|---|---|---|']
            for p in [p for p in c['posts'] if p['family'] == fid]:
                L.append(f"| {p['date']} | [{p['title']}]({p['url']}) | {p['keyword']} | {p['format']} | {p['role']} | {p['priority']} | {p['status']} |")
            L.append('')
    L += ['## Règles de maillage vérifiées', '', '- chaque satellite renvoie au pilier et le pilier renvoie à chaque satellite ;', '- deux liens cycliques entre les quatre angles d’une famille ;', '- au moins trois liens entrants par article, aucune orpheline ;', '- une requête primaire par article, unique sur tout le site.', '']
    (ICI / 'cluster-plan.md').write_text('\n'.join(L) + '\n', encoding='utf-8')


def ecrire_calendrier(pilier, satellites, familles, poles):
    tous = sorted([pilier] + satellites, key=lambda e: (e['date'], e['slug']))
    L = ['# Calendrier éditorial v3 — quatre articles par semaine', '',
         f"Généré le {date.today().strftime("%d/%m/%Y")} par `build-cluster-plan.py` depuis `backlog-v3.json` : ne pas éditer à la main, corriger le backlog ou la taxonomie puis régénérer. Cadence décidée par Kevin : quatre articles par semaine, deux par jour au plus, du lundi au jeudi. Les dates sont des créneaux de production, pas des promesses : un article qui n'atteint pas le gate attend le créneau suivant, et le backlog se réordonne à chaque signal (impressions Search Console par famille, demandes de contact citant une tâche).", '',
         '## Règles', '',
         "- Ordre de production : les articles publiés d'abord, puis la priorité mesurée 1 → 3 (1 : la requête primaire a des suggestions d'autocomplétion Google ; 2 : seule une requête secondaire en a ; 3 : aucune demande mesurée — relevé `scripts/seo/questions.mjs`, bloc `demande` de chaque angle), puis l'angle (méthode, contrôle ou checklist, exceptions et refus, définition), puis l'ordre des familles dans la taxonomie.",
         '- Chaque famille active compte quatre angles ; aucune famille n’est épuisée avant que toutes n’aient leur méthode.',
         '- Une requête primaire par article, unique ; sources officielles obligatoires pour toute matière paie, sociale, fiscale, juridique ou données.',
         '- Le pilier reçoit un lien à chaque publication (republication scellée par la forge).', '',
         '## Volume', '', f"- {len(satellites)} satellites + 1 pilier ; {sum(1 for e in satellites if e['statut'] == 'published')} satellite(s) publié(s) au 16/09/2026 ; dernier créneau planifié : {tous[-1]['date']}.", '',
         '## Semaine par semaine', '']
    par_sem = defaultdict(list)
    for e in tous:
        par_sem[semaine_iso(date.fromisoformat(e['date']))].append(e)
    for (annee, sem), entrees in sorted(par_sem.items()):
        L += [f'### Semaine {annee}-W{sem:02d}', '', '| Date | Article | Famille | Pôle | Format | P | Statut |', '|---|---|---|---|---|---|---|']
        for e in sorted(entrees, key=lambda e: (e['date'], e['slug'])):
            L.append(f"| {e['date']} | [{e['titre']}]({e['url']}) | {familles[e['famille']]['libelle']} | {poles[e['pole']]['libelle']} | {e['format']} | {e['priorite']} | {e['statut']} |")
        L.append('')
    (ICI / 'CONTENT-CALENDAR.md').write_text('\n'.join(L) + '\n', encoding='utf-8')


def ecrire_html(data):
    gabarit = GABARIT.read_text(encoding='utf-8')
    debut = gabarit.index('const CLUSTER_DATA = {')
    fin = gabarit.index('\n    };', debut) + len('\n    };')
    cd = {'pillar': data['pillar'], 'clusters': [{'name': c['name'], 'color': c['color'], 'posts': c['posts']} for c in data['clusters']], 'links': data['links'], 'meta': data['meta']}
    html = gabarit[:debut] + 'const CLUSTER_DATA = ' + json.dumps(cd, ensure_ascii=False) + ';' + gabarit[fin:]
    html = html.replace('<title>', '<title>Memlia v3 — ', 1)
    (ICI / 'cluster-map.html').write_text(html, encoding='utf-8')


if __name__ == '__main__':
    poles, familles, publies, pilier, satellites, liens, par_famille = construire()
    erreurs, entrants, par_semaine = verifier(poles, familles, publies, pilier, satellites, liens, par_famille)
    data = ecrire_json(poles, familles, pilier, satellites, liens, entrants)
    ecrire_md(data, familles)
    ecrire_calendrier(pilier, satellites, familles, poles)
    ecrire_html(data)
    print(f"cluster-plan : {data['meta']['totalPosts']} satellites ({data['meta']['publishedPosts']} publiés), {data['meta']['totalFamilies']} familles, {data['meta']['totalClusters']} pôles, {data['meta']['totalLinks']} liens ; entrants min = {min(entrants[e['slug']] for e in satellites)} ; semaines planifiées = {len(par_semaine)} ; dernier créneau = {max(e['date'] for e in satellites)}")
    for e in erreurs:
        print('ERREUR :', e)
    if erreurs and '--check' in sys.argv:
        sys.exit(1)
    print('invariants : OK' if not erreurs else f'{len(erreurs)} erreur(s)')
