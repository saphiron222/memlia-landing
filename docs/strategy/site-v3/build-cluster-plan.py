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
RATTRAPAGE_W39 = {'prompt-chatgpt-expert-comptable': '2026-09-22', 'logiciel-ia-comptabilite': '2026-09-24', 'tests-verts-et-regle-des-trois-passes': '2026-09-26'}
DATE_RATTRAPAGE = '2026-09-28'
DATES_RATTRAPAGE = {DATE_RATTRAPAGE, '2026-09-29'}
TITRE_CICATRICE_W39 = 'Pourquoi des tests verts manquent des défauts : la règle des trois passes'

def creneau(e):
    """La date réelle du 28 ou 29/09 ne déplace pas les créneaux W39 désignés."""
    if e.get('statut') == 'published' and e['date'] in DATES_RATTRAPAGE:
        return RATTRAPAGE_W39.get(e['slug'], e['date'])
    return e['date']
GABARIT_PAR_FORMAT = {'pillar-page': 'ultimate-guide', 'how-to-guide': 'how-to', 'faq-knowledge': 'explainer', 'listicle-checklist': 'listicle', 'tutorial': 'how-to', 'resource-template': 'landing-page', 'thought-leadership': 'essai'}
MOTS_PAR_FORMAT = {'pillar-page': 3200, 'how-to-guide': 1500, 'faq-knowledge': 1300, 'listicle-checklist': 1400, 'tutorial': 1500, 'resource-template': 1200, 'thought-leadership': 1400}


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


def exception_autorisee(e, champ, jour):
    exemption = e.get('exceptionAlternance', {}).get(champ)
    return bool(exemption and exemption['date'] == jour)


def verifier_alternance(entrees):
    ordinaires = sorted((e for e in entrees if e.get('serie') != 'cicatrices'),
                        key=lambda e: (e['date'], e.get('_ordre_calendrier', e['slug'])))
    erreurs = []
    for e in entrees:
        exception = e.get('exceptionAlternance')
        if exception is None:
            continue
        if e.get('serie') == 'cicatrices' or not isinstance(exception, dict) or not exception or set(exception) - {'pole', 'format'}:
            erreurs.append(f"exception d'alternance invalide : {e['slug']}")
            continue
        for champ, preuve in exception.items():
            if (not isinstance(preuve, dict) or set(preuve) != {'date', 'raison'}
                    or not isinstance(preuve['raison'], str) or not preuve['raison'].strip()
                    or preuve['date'] != e['date']):
                erreurs.append(f"exception {champ} sans date/raison concordante : {e['slug']}")
    for precedent, e in zip(ordinaires, ordinaires[1:]):
        if e.get('statut') == 'published':
            continue  # archives intouchables, y compris les doublons historiques
        for champ in ('pole', 'format'):
            if e[champ] == precedent[champ] and not exception_autorisee(e, champ, e['date']):
                erreurs.append(f"alternance {champ} rompue : {precedent['slug']} -> {e['slug']}")
    for index, e in enumerate(ordinaires):
        for champ in e.get('exceptionAlternance', {}):
            if index == 0 or e.get('statut') == 'published' or ordinaires[index - 1][champ] != e[champ]:
                erreurs.append(f"exception {champ} non utilisée : {e['slug']}")
    return erreurs


def alterner(entrees):
    """Réattribue uniquement les créneaux libres, sans changer la priorité des candidats compatibles."""
    for e in entrees:
        exception = e.get('exceptionAlternance')
        if exception is None:
            continue
        if (e.get('serie') == 'cicatrices' or not isinstance(exception, dict) or not exception
                or set(exception) - {'pole', 'format'}):
            raise SystemExit(f"exception d'alternance invalide : {e['slug']}")
        for champ, preuve in exception.items():
            if (not isinstance(preuve, dict) or set(preuve) != {'date', 'raison'}
                    or not isinstance(preuve['date'], str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', preuve['date'])
                    or not isinstance(preuve['raison'], str) or not preuve['raison'].strip()):
                raise SystemExit(f"exception {champ} sans date/raison : {e['slug']}")
            try:
                date.fromisoformat(preuve['date'])
            except ValueError as exc:
                raise SystemExit(f"date d'exception invalide : {e['slug']}") from exc
    ordinaires = sorted((e for e in entrees if e.get('serie') != 'cicatrices'),
                        key=lambda e: (e['date'], e['slug']))
    dates = [e['date'] for e in ordinaires]
    fixes = {i: e for i, e in enumerate(ordinaires) if e.get('statut') == 'published' or e.get('datePlanifiee')}
    libres = [e for e in entrees if e.get('serie') != 'cicatrices' and e.get('statut') != 'published' and not e.get('datePlanifiee')]
    # Les exceptions datées sont réservées à leur créneau : elles ne créent pas de date nouvelle.
    for e in libres:
        for preuve in e.get('exceptionAlternance', {}).values():
            if preuve['date'] not in dates:
                raise SystemExit(f"exception hors calendrier : {e['slug']}")
    essais = 0

    def compatible(precedent, e, jour):
        return precedent is None or e.get('statut') == 'published' or all(
            precedent[champ] != e[champ] or exception_autorisee(e, champ, jour)
            for champ in ('pole', 'format'))

    def chercher(i, disponibles, precedent):
        nonlocal essais
        essais += 1
        if essais > 200000:
            raise SystemExit('alternance : recherche épuisée (stock ou exceptions à revoir)')
        if i == len(dates):
            return []
        # Les dates fixes restantes peuvent séparer une majorité du stock libre ;
        # ne pas élaguer sur les seuls disponibles (borne fausse avec une date intercalée).
        jour = dates[i]
        if i in fixes:
            e = fixes[i]
            if compatible(precedent, e, jour):
                suite = chercher(i + 1, disponibles, e)
                if suite is not None:
                    return [(i, e)] + suite
            return None
        # Un seul représentant par signature suffit, sauf exception portée par une entrée précise.
        vus = set()
        ordre = sorted(range(len(disponibles)), key=lambda index: (
            -sum(x['format'] == disponibles[index]['format'] for x in disponibles), index))
        for index in ordre:
            e = disponibles[index]
            signature = (e['pole'], e['format'], json.dumps(e.get('exceptionAlternance'), sort_keys=True))
            if signature in vus:
                continue
            vus.add(signature)
            if any(preuve['date'] != jour for preuve in e.get('exceptionAlternance', {}).values()):
                continue
            if not compatible(precedent, e, jour):
                continue
            suite = chercher(i + 1, disponibles[:index] + disponibles[index + 1:], e)
            if suite is not None:
                return [(i, e)] + suite
        return None

    solution = chercher(0, libres, None)
    if solution is None:
        raise SystemExit('alternance impossible sans déplacer une date figée ou inventer une exception')
    for i, e in solution:
        e['date'] = dates[i]
    for i, e in sorted(solution + list(fixes.items())):
        e['_ordre_calendrier'] = i


def planifier(entrees, publies, aujourd_hui=None):
    """Planifie 4 articles ordinaires lun-jeu et 1 cicatrice le samedi, par semaine ISO."""
    aujourd_hui = aujourd_hui or date.today()
    par_jour, par_semaine = Counter(), Counter()
    if any(p['date'] == DATE_RATTRAPAGE and slug not in RATTRAPAGE_W39 for slug, p in publies.items()):
        raise SystemExit('rattrapage W39 réservé aux trois sujets désignés')
    if any(slug in RATTRAPAGE_W39 and p['date'] not in DATES_RATTRAPAGE | {RATTRAPAGE_W39[slug]} for slug, p in publies.items()):
        raise SystemExit('rattrapage W39 hors dates réelles autorisées')
    slugs_cicatrices = {e['slug'] for e in entrees if e.get('serie') == 'cicatrices'}
    for slug, p in publies.items():
        if slug in slugs_cicatrices:
            continue
        if p['date']:
            d = date.fromisoformat(RATTRAPAGE_W39.get(slug, p['date']) if p['date'] in DATES_RATTRAPAGE else p['date'])
            par_jour[d] += 1
            par_semaine[semaine_iso(d)] += 1
    # La série « Cicatrices » (charte §7 ter) a sa propre cadence : un samedi par semaine ISO,
    # en sus des quatre articles ordinaires. Son stock reste factuel ; le planificateur place les
    # entrées existantes mais n'en invente jamais pour combler une semaine future.
    series = [e for e in entrees if e.get('serie') == 'cicatrices']
    semaines_reservees = set()

    def reserver_cicatrice(e, candidat):
        rattrapage = e['slug'] == 'tests-verts-et-regle-des-trois-passes' and e['slug'] in publies and candidat.isoformat() in DATES_RATTRAPAGE
        cle_semaine = semaine_iso(date.fromisoformat(RATTRAPAGE_W39[e['slug']])) if rattrapage else semaine_iso(candidat)
        if candidat.weekday() != 5 and not rattrapage:
            raise SystemExit(f"une cicatrice paraît le samedi : {e['slug']} ({candidat.isoformat()})")
        if cle_semaine in semaines_reservees:
            raise SystemExit(f"deux cicatrices la même semaine ISO : {e['slug']} ({candidat.isoformat()})")
        e['date'] = candidat.isoformat()
        e['statut'] = 'published' if e['slug'] in publies else 'manque' if candidat < aujourd_hui else 'planned'
        semaines_reservees.add(cle_semaine)

    # Une date publiée fait foi. Une date explicite du backlog doit lui être identique et ne bouge
    # jamais au gré d'une régénération.
    for e in [x for x in series if x['slug'] in publies]:
        date_publiee = publies.get(e['slug'], {}).get('date')
        if date_publiee and e.get('date') and date_publiee != e['date'] and not (e['slug'] == 'tests-verts-et-regle-des-trois-passes' and date_publiee in DATES_RATTRAPAGE and e['date'] == RATTRAPAGE_W39[e['slug']]):
            raise SystemExit(f"date publiée divergente du backlog : {e['slug']} ({date_publiee} != {e['date']})")
        reserver_cicatrice(e, date.fromisoformat(date_publiee or e['date']))

    # Les dates explicites du backlog restent des décisions, pas des indications de tri :
    # seul un créneau non daté peut avancer jusqu'au prochain samedi libre.
    depart_cicatrice = max(PREMIER_JOUR, aujourd_hui)
    premier_samedi = depart_cicatrice + timedelta(days=(5 - depart_cicatrice.weekday()) % 7)
    for e in sorted([x for x in series if x['slug'] not in publies], key=lambda x: (x.get('date') or '', x['priorite'], x['rang_famille'])):
        candidat = date.fromisoformat(e['date']) if e.get('date') else premier_samedi
        if not e.get('date'):
            while semaine_iso(candidat) in semaines_reservees:
                candidat += timedelta(days=7)
        reserver_cicatrice(e, candidat)

    # Une décision éditoriale peut fixer quelques créneaux ordinaires sans figer tout le calendrier.
    # Ils sont réservés avant l'ordonnancement automatique afin que la cadence reste fail-closed.
    for e in entrees:
        valeur = e.get('datePlanifiee')
        if not valeur or e.get('serie') == 'cicatrices' or e['slug'] in publies:
            continue
        candidat = date.fromisoformat(valeur)
        if candidat < aujourd_hui:
            raise SystemExit(f"date planifiée échue : {e['slug']} ({valeur}) ; replanifier sans antidater")
        if candidat < PREMIER_JOUR or candidat.weekday() not in JOURS_DE_PUBLICATION:
            raise SystemExit(f"date planifiée hors fenêtre lundi-jeudi : {e['slug']} ({valeur})")
        if par_jour[candidat] >= PAR_JOUR_MAX or par_semaine[semaine_iso(candidat)] >= PAR_SEMAINE_MAX:
            raise SystemExit(f"date planifiée au-delà de la cadence : {e['slug']} ({valeur})")
        e['date'] = valeur
        e['statut'] = 'planned'
        par_jour[candidat] += 1
        par_semaine[semaine_iso(candidat)] += 1

    jour = max(PREMIER_JOUR, aujourd_hui)
    for e in entrees:
        if e.get('serie') == 'cicatrices':
            continue
        if e['slug'] in publies:
            e['date'] = publies[e['slug']]['date']
            e['statut'] = 'published'
            continue
        if e.get('datePlanifiee'):
            continue
        while not (jour.weekday() in JOURS_DE_PUBLICATION and par_jour[jour] < PAR_JOUR_MAX and par_semaine[semaine_iso(jour)] < PAR_SEMAINE_MAX):
            jour += timedelta(days=1)
        e['date'] = jour.isoformat()
        # Une date proposée après un créneau manqué n'est pas une nouvelle décision éditoriale.
        e['statut'] = 'a-replanifier' if e.get('dateManquee') else 'planned'
        par_jour[jour] += 1
        par_semaine[semaine_iso(jour)] += 1
        # En régime : un article par jour ouvré ; le même jour ne reçoit un second article que pour finir une semaine entamée.
        jours_restants = sum(1 for d in range(1, 4) if (jour + timedelta(days=d)).weekday() in JOURS_DE_PUBLICATION and semaine_iso(jour + timedelta(days=d)) == semaine_iso(jour))
        if par_semaine[semaine_iso(jour)] < PAR_SEMAINE_MAX and (jours_restants >= PAR_SEMAINE_MAX - par_semaine[semaine_iso(jour)] or par_jour[jour] >= PAR_JOUR_MAX):
            jour += timedelta(days=1)
        elif par_semaine[semaine_iso(jour)] >= PAR_SEMAINE_MAX:
            jour += timedelta(days=1)
    # Le pôle vient de la famille ; les dates figées et le stock Cicatrices restent hors permutation.
    familles = taxonomie()[1] if any('pole' not in e for e in entrees if e.get('serie') != 'cicatrices') else {}
    for e in entrees:
        if e.get('serie') != 'cicatrices' and 'pole' not in e:
            e['pole'] = familles[e['famille']]['pole']
    alterner(entrees)
    erreurs = verifier_alternance(entrees)
    if erreurs:
        raise SystemExit('; '.join(erreurs))


def construire():
    poles, familles = taxonomie()
    publies = etat_publie()
    backlog = json.loads(BACKLOG.read_text(encoding='utf-8'))
    slug_w39 = 'tests-verts-et-regle-des-trois-passes'
    if slug_w39 in publies:
        p = publies[slug_w39]
        if p['titre'] != TITRE_CICATRICE_W39:
            raise SystemExit('titre signé W39 divergent')
        if p['date'] not in DATES_RATTRAPAGE or p['format'] != 'thought-leadership' or p['famille'] != 'ia-generative-agents':
            raise SystemExit(f'cicatrice W39 hors contrat : {slug_w39}')
        # Le créneau du 26/09 porte le même titre et la même requête : remplacer le
        # sujet planifié par la Cicatrice réellement publiée, sans créer un doublon.
        ancien = next((e for e in backlog if e['slug'] == 'trois-bugs-que-des-tests-verts-n-ont-pas-vus'), None)
        inscrit = next((e for e in backlog if e['slug'] == slug_w39), None)
        if ancien is not None:
            if ancien['titre'] != TITRE_CICATRICE_W39:
                raise SystemExit('titre signé W39 du backlog divergent')
            if inscrit or ancien['requete'] != p['requete'] or ancien.get('date') != '2026-09-26' or ancien.get('serie') != 'cicatrices' or ancien['slug'] in publies:
                raise SystemExit('cicatrice W39 planifiée divergente ou déjà publiée')
            backlog.remove(ancien)
        if inscrit is not None and inscrit['titre'] != TITRE_CICATRICE_W39:
            raise SystemExit('titre signé W39 du backlog divergent')
        if inscrit is not None and (inscrit['requete'] != p['requete'] or inscrit.get('date') != RATTRAPAGE_W39[slug_w39] or inscrit.get('serie') != 'cicatrices'):
            raise SystemExit('cicatrice W39 inscrite hors contrat')
        if inscrit is None:
            backlog.append({'slug': slug_w39, 'titre': TITRE_CICATRICE_W39, 'requete': p['requete'], 'secondaires': [], 'famille': p['famille'], 'role': 'direction-associes', 'intent': 'diagnostiquer', 'funnel': 'MOFU', 'format': p['format'], 'preuve': f"cicatrice W39 signée, publiée le {p['date']}", 'sourcesOfficielles': [], 'priorite': 1, 'serie': 'cicatrices', 'date': p['date']})
    for i, e in enumerate(backlog):
        e['rang_famille'] = sum(1 for x in backlog[:i] if x['famille'] == e['famille'])
    # Le pilier transversal est désigné par son slug : des grappes spécialisées peuvent aussi
    # employer le gabarit pillar-page sans remplacer le hub éditorial de tout le cabinet.
    pilier = next(e for e in backlog if e['slug'] == 'automatiser-un-cabinet-comptable-la-carte-des-taches')
    satellites = [e for e in backlog if e is not pilier]
    for slug, famille in FAMILLE_HISTORIQUE.items():
        p = publies.get(slug)
        if p and slug not in {e['slug'] for e in backlog}:
            satellites.append({'slug': slug, 'titre': p['titre'], 'requete': p['requete'], 'secondaires': [], 'famille': famille, 'role': 'paie-responsables-sociaux', 'intent': 'executer', 'funnel': 'MOFU', 'format': p['format'] or 'how-to-guide', 'preuve': 'article historique conservé (dossier scellé sur ses octets)', 'sourcesOfficielles': ['net-entreprises.fr', 'urssaf.fr'], 'priorite': 1, 'rang_famille': 4, 'historique': True})
    # Ordre de production : publiés d'abord, puis priorité, puis angle (méthode avant checklist, exceptions, définition), puis rang de la famille.
    satellites.sort(key=lambda e: (0 if e['slug'] in publies else 1, e['priorite'], e['rang_famille'], familles[e['famille']]['rang']))
    for e in [pilier] + satellites:
        e['pole'] = familles[e['famille']]['pole']
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
        # La série « Cicatrices » (charte §7 ter) prend un créneau mais n'est pas un angle de famille :
        # elle vise la marque, pas une requête, et n'entre donc pas dans le compte des quatre.
        angles = [e for e in membres if not e.get('historique') and not e.get('serie')]
        # La grappe IA est bornée aux trois pages arbitrées le 20/09/2026 : preuve ChatGPT,
        # catégorie logicielle puis hub. Les déclinaisons outil × pôle/rôle restent des sections.
        attendu = 3 if fid in {pilier['famille'], 'ia-generative-agents'} else 4
        if len(angles) != attendu:
            erreurs.append(f'{fid} : {len(angles)} angles au lieu de {attendu}')
    for slug in publies:
        if slug not in slugs:
            erreurs.append(f'article publié absent du backlog et de la table historique : {slug}')
    for e in tous:
        if e['slug'] in publies and (e['date'] != publies[e['slug']]['date'] or e.get('statut') != 'published'):
            erreurs.append(f"date ou statut publié divergents : {e['slug']}")
        if e.get('statut') == 'published' and e['slug'] not in publies:
            erreurs.append(f"statut publié sans article source : {e['slug']}")
    # Depuis le 19/09/2026, une priorité 1 se mérite par une mesure : autocomplétion ou page de résultats datée (scripts/seo/questions.mjs).
    for e in satellites:
        if e.get('historique') or e.get('serie') or e['slug'] in publies:
            continue
        if e['priorite'] == 1 and not (e.get('demande') or {}).get('mesureeLe'):
            erreurs.append(f"angle de priorité 1 sans demande mesurée : {e['slug']}")
    ordinaires = [e for e in tous if e.get('serie') != 'cicatrices']
    cicatrices = [e for e in tous if e.get('serie') == 'cicatrices']
    par_jour, par_semaine = Counter(), Counter()
    for e in ordinaires:
        if e['date'] == DATE_RATTRAPAGE and e.get('statut') == 'published' and e['slug'] not in RATTRAPAGE_W39:
            erreurs.append(f"rattrapage W39 hors périmètre : {e['slug']}")
        if e.get('datePlanifiee') and creneau(e) != e['datePlanifiee']:
            erreurs.append(f"date planifiée non respectée : {e['slug']} ({e['date']} != {e['datePlanifiee']})")
        slot = date.fromisoformat(creneau(e))
        par_jour[slot] += 1
        par_semaine[semaine_iso(slot)] += 1
        if slot >= PREMIER_JOUR and slot.weekday() not in JOURS_DE_PUBLICATION:
            erreurs.append(f"article ordinaire hors lundi-jeudi : {e['slug']} ({e['date']})")
    if any(n > PAR_JOUR_MAX for n in par_jour.values()):
        erreurs.append('plus de deux articles le même jour')
    if any(n > PAR_SEMAINE_MAX for n in par_semaine.values()):
        erreurs.append('plus de quatre articles la même semaine')
    erreurs.extend(verifier_alternance(tous))
    cicatrices_par_semaine = Counter()
    dates_cicatrices = []
    for e in cicatrices:
        if e['date'] in DATES_RATTRAPAGE and (e['slug'] != 'tests-verts-et-regle-des-trois-passes' or e.get('statut') != 'published'):
            erreurs.append(f"rattrapage W39 hors périmètre : {e['slug']}")
        d = date.fromisoformat(creneau(e))
        dates_cicatrices.append(d)
        cicatrices_par_semaine[semaine_iso(d)] += 1
        if d.weekday() != 5:
            erreurs.append(f"cicatrice hors samedi : {e['slug']} ({e['date']})")
    if any(n > 1 for n in cicatrices_par_semaine.values()):
        erreurs.append('plus d’une cicatrice la même semaine ISO')
    dates_cicatrices.sort()
    if any((b - a).days != 7 for a, b in zip(dates_cicatrices, dates_cicatrices[1:])):
        erreurs.append('la série Cicatrices ne tient pas sa cadence hebdomadaire du samedi')
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
            {'title': e['titre'], 'keyword': e['requete'], 'volume': None, 'template': e['gabarit'], 'format': e['format'], 'wordCount': e['mots'], 'url': e['url'], 'slug': e['slug'], 'family': e['famille'], 'role': e['role'], 'intent': e['intent'], 'funnel': e['funnel'], 'priority': e['priorite'], 'date': e['date'], 'missedDate': e.get('dateManquee'), 'secondaryKeywords': e['secondaires'], 'proof': e['preuve'], 'officialSources': e['sourcesOfficielles'], 'status': e['statut'], 'incomingLinks': entrants[e['slug']]}
            for e in sorted(posts, key=lambda e: (familles[e['famille']]['rang'], e['rang_famille']))]})
    data = {
        'version': 2, 'date': date.today().isoformat(), 'seed': 'automatisation cabinet comptable',
        'methode': 'backlog de quatre angles par famille (méthode, contrôle ou checklist, exceptions et refus, définition), 59 familles actives en 12 pôles ; cadence de 4 articles ordinaires par semaine, 2 par jour au plus du lundi au jeudi, plus 1 Cicatrice le samedi ; maillage pilier ↔ satellite et 2 liens cycliques par famille ; priorité posée depuis la demande mesurée par angle (autocomplétion Google et pages de résultats DataForSEO, scripts/seo/questions.mjs, depuis le 19/09/2026 ; un angle de priorité 1 sans mesure datée fait échouer --check)',
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
    tous = sorted([pilier] + satellites, key=lambda e: (e['date'], e.get('_ordre_calendrier', 0)))
    L = ['# Calendrier éditorial v3 — quatre articles et une Cicatrice par semaine', '',
         f"Généré le {date.today().strftime('%d/%m/%Y')} par `build-cluster-plan.py` depuis `backlog-v3.json` : ne pas éditer à la main, corriger le backlog ou la taxonomie puis régénérer. Cadence décidée par Kevin : quatre articles ordinaires par semaine, deux par jour au plus du lundi au jeudi, plus une Cicatrice le samedi. Les dates sont des créneaux de production, pas des promesses : un article qui n'atteint pas le gate attend le créneau suivant, et le backlog se réordonne à chaque signal (impressions Search Console par famille, demandes de contact citant une tâche).", '',
         '## Règles', '',
         "- Les priorités mesurées 1 → 3 restent celles du backlog (1 : la requête primaire a des suggestions d'autocomplétion Google ; 2 : seule une requête secondaire en a ; 3 : aucune demande mesurée — relevé `scripts/seo/questions.mjs`). Elles guident l'ordre des candidats compatibles avec l'alternance ; l'équilibre du stock de formats peut différer une priorité 1 sans changer sa mesure ni son angle.",
         '- Les créneaux ordinaires non figés alternent pôle et format entre deux articles successifs ; les dates publiées et `datePlanifiee` ne bougent jamais. Si un conflit daté est inévitable, `exceptionAlternance` dans le backlog désigne séparément `pole` ou `format`, chacun avec `date` (YYYY-MM-DD) et `raison` non vide ; seul le champ effectivement en conflit à cette date est dispensé. La série factuelle Cicatrices ne peut pas porter cette exception.',
         '- Chaque famille active conserve ses quatre angles (méthode, contrôle ou checklist, exceptions et refus, définition) ; leur ordre de sortie dépend des contraintes de calendrier et du stock disponible.',
         '- Une requête primaire par article, unique ; sources officielles obligatoires pour toute matière paie, sociale, fiscale, juridique ou données.',
         '- Le pilier reçoit un lien à chaque publication (republication scellée par la forge).', '',
         '- Une Cicatrice factuelle peut paraître le samedi, au plus une par semaine ISO, en sus du plafond des quatre articles ordinaires ; sans faits signés ni recette, le créneau reste vide. `manque` désigne une date échue conservée en trace, pas une publication.', '',
         '- Les anciennes réservations ordinaires manquées restent dans `dateManquee` du backlog ; leur date proposée au statut `a-replanifier` n’est pas actionnable. Une décision humaine fixe une nouvelle `datePlanifiee`, soumise aux portes de qualité et au quota du jour réel.', '',
         '## Volume', '', f"- {len(satellites)} satellites + 1 pilier ; {sum(1 for e in satellites if e['statut'] == 'published')} satellite(s) publié(s) dans le registre au {date.today().strftime('%d/%m/%Y')} ; dernier créneau planifié : {tous[-1]['date']}.", '',
         '## Semaine par semaine', '']
    par_sem = defaultdict(list)
    for e in tous:
        par_sem[semaine_iso(date.fromisoformat(e['date']))].append(e)
        if e.get('dateManquee'):
            par_sem[semaine_iso(date.fromisoformat(e['dateManquee']))].append({
                **e, 'date': e['dateManquee'], 'statut': 'manque', '_trace_manquee': True,
            })
    for (annee, sem), entrees in sorted(par_sem.items()):
        L += [f'### Semaine {annee}-W{sem:02d}', '', '| Date | Article | Famille | Pôle | Format | P | Statut |', '|---|---|---|---|---|---|---|']
        for e in sorted(entrees, key=lambda e: (e['date'], e.get('_ordre_calendrier', 0))):
            if e.get('_trace_manquee'):
                L.append(f"| {e['date']} | Ancien créneau manqué de « {e['titre']} » — trace, non actionnable | — | — | — | — | manque |")
            else:
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
