#!/usr/bin/env python3
"""Source unique du plan éditorial v3 : nourri du backlog par famille (backlog-v3.json), de la
taxonomie (src/data/familles.ts) et de l'état publié (src/content/blog), il génère
cluster-plan.json, cluster-plan.md, cluster-map.html et CONTENT-CALENDAR.md, et vérifie les
invariants (unicité, appartenance aux énumérations du schéma, maillage, cadence).

Usage, depuis la racine du dépôt :
    python3 docs/strategy/site-v3/build-cluster-plan.py            # régénère
    python3 docs/strategy/site-v3/build-cluster-plan.py --check    # vérifie sans écrire de dérivé
"""
import json
import os
import re
import subprocess
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
REGLE_IA = 'docs/strategy/site-v3/rattrapage-ia-2026-10-05.json'


def lire_rattrapage_ia():
    if not (RACINE / REGLE_IA).exists():
        return None
    controle = subprocess.run(['node', str(RACINE / 'scripts/lib/blog-ia-catchup.mjs'), str(RACINE)],
                              capture_output=True, text=True, timeout=10, check=False)
    if controle.returncode:
        raise SystemExit(controle.stderr.strip() or 'rattrapage IA illisible')
    return json.loads(controle.stdout)


def semaine_editoriale_ia(regle, slug, jour):
    if regle and regle['publications'].get(slug) == jour:
        annee, semaine = regle['semaineEditoriale'].split('-W')
        return int(annee), int(semaine)
    return semaine_iso(date.fromisoformat(jour))


def plafond_jour_ia(regle, slug, jour, actifs):
    if (regle and jour == '2026-10-05' and regle['publications'].get(slug) == jour
            and all(regle['publications'].get(e['slug']) == jour for e in actifs if e['date'] == jour)):
        return regle['maximumParJour']
    return PAR_JOUR_MAX


def cle_quota_ia(regle, slug, jour):
    semaine = semaine_editoriale_ia(regle, slug, jour)
    # Le lot est distinct du rattrapage W39 déjà compté aux dates réelles en W40.
    return ('rattrapage-ia', *semaine) if regle and regle['publications'].get(slug) == jour else semaine


def verifier_date_ia(regle, slug, jour, serie=None):
    if regle and slug in regle['publications'] and (regle['publications'][slug] != jour or serie == 'cicatrices'):
        raise SystemExit(f'rattrapage IA hors slug/date/série mandatés : {slug} ({jour})')

JOURS_DE_PUBLICATION = (0, 1, 2, 3)  # lundi à jeudi ; la semaine 38 (deux articles le 16/09) se complète le jeudi 17/09
PREMIER_JOUR = date(2026, 9, 17)
RATTRAPAGE_W39 = {'prompt-chatgpt-expert-comptable': '2026-09-22', 'logiciel-ia-comptabilite': '2026-09-24', 'tests-verts-et-regle-des-trois-passes': '2026-09-26'}
DATE_RATTRAPAGE = '2026-09-28'
DATES_RATTRAPAGE = {DATE_RATTRAPAGE, '2026-09-29'}
SLUG_CICATRICE_W39 = 'tests-verts-et-regle-des-trois-passes'
# Dates d'archive du reçu existant, pas autorité de préparation/publication.
# Le gate Node continue à vérifier reçu, jour courant et octets signés.
DATES_ARCHIVE_CICATRICE_W39 = DATES_RATTRAPAGE | {
    '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
}
TITRE_CICATRICE_W39 = 'Pourquoi des tests verts manquent des défauts : la règle des trois passes'

def date_archive_rattrapage(slug, jour):
    dates = DATES_ARCHIVE_CICATRICE_W39 if slug == SLUG_CICATRICE_W39 else DATES_RATTRAPAGE
    return jour in dates

def creneau(e):
    """Une publication cadrée conserve son créneau W39, même dans l'archive."""
    if e.get('statut') == 'published' and date_archive_rattrapage(e['slug'], e['date']):
        return RATTRAPAGE_W39.get(e['slug'], e['date'])
    return e['date']
GABARIT_PAR_FORMAT = {'pillar-page': 'ultimate-guide', 'how-to-guide': 'how-to', 'faq-knowledge': 'explainer', 'listicle-checklist': 'listicle', 'tutorial': 'how-to', 'resource-template': 'landing-page', 'thought-leadership': 'essai'}
MOTS_PAR_FORMAT = {'pillar-page': 3200, 'how-to-guide': 1500, 'faq-knowledge': 1300, 'listicle-checklist': 1400, 'tutorial': 1500, 'resource-template': 1200, 'thought-leadership': 1400}

# Intentions distinctes mandatées le 03/10 ; inscription et mesures restent au backlog.
# Ce registre étend le stock de base, jamais les quotas ou l'autorité de publication.
BRIEFS_IA_MANDATES = {
    'utiliser-chatgpt-cabinet-comptable': 'ia-generative-agents',
    'verifier-reponse-ia-comptabilite': 'ia-generative-agents',
    'ia-comptabilite-confidentialite-donnees': 'rgpd-secret-securite',
    'automatiser-avec-ia-sans-changer-logiciel': 'ia-generative-agents',
}


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


def metadonnees_publication(texte):
    morceaux = texte.split('---', 2)
    if len(morceaux) != 3 or morceaux[0].strip():
        raise SystemExit('frontmatter de publication illisible')
    fm = morceaux[1]

    def champ(nom):
        m = re.search(rf'^{nom}:\s*"?([^"\n]+?)"?\s*$', fm, re.M)
        return m.group(1) if m else None
    return champ('brouillon'), {
        'date': champ('datePublication'), 'famille': champ('famille'),
        'format': champ('format'), 'requete': champ('primaryQuery'), 'titre': champ('titre'),
    }


def git_publication(*arguments):
    # Every read is confined to this checkout, not inherited GIT_DIR/worktree.
    try:
        resultat = subprocess.run(['git', '-C', str(RACINE), *arguments],
            env={k: v for k, v in os.environ.items() if not k.startswith('GIT_')},
            capture_output=True, text=True, timeout=10, check=False)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise SystemExit('base de publication origin/main indisponible : arrêt sans écriture') from exc
    if resultat.returncode:
        raise SystemExit('base de publication origin/main illisible ou non intégrée au candidat')
    return resultat.stdout


def etat_publie():
    """Calendar state, not a production receipt or approval of draft bytes.

    A local go-production candidate is renderable, not integrated. Read the
    publication from one pinned origin/main commit, never from candidate bytes
    or a feature commit. Non-Git fixtures retain their source-only behaviour.
    """
    base = None
    fichiers_base = set()
    git_dir = RACINE / '.git'
    # Non-Git fixtures retain their source-only behaviour. A real checkout with
    # a missing/corrupt remote ref must never silently acquire that behaviour.
    if os.path.lexists(git_dir):
        if git_dir.is_symlink():
            raise SystemExit('base de publication origin/main : .git symbolique refusé')
        base = git_publication('rev-parse', '--verify', 'refs/remotes/origin/main^{commit}').strip()
        if not re.fullmatch(r'[0-9a-f]{40,64}', base):
            raise SystemExit('base de publication origin/main invalide')
        git_publication('merge-base', '--is-ancestor', base, 'HEAD')
        for ligne in git_publication('ls-tree', '-r', '-z', '--name-only', base,
                                    '--', 'src/content/blog').split('\0'):
            if ligne:
                fichiers_base.add(ligne)
    publies = {}
    for fichier in sorted(BLOG.glob('*.md')):
        if fichier.is_symlink():
            raise SystemExit(f'article symbolique refusé : {fichier.name}')
        brouillon, courant = metadonnees_publication(fichier.read_text(encoding='utf-8'))
        chemin = fichier.relative_to(RACINE).as_posix()
        integre = None
        if base and chemin in fichiers_base:
            ancien_brouillon, ancien = metadonnees_publication(git_publication('show', f'{base}:{chemin}'))
            if ancien_brouillon == 'false':
                if ancien['date'] != courant['date']:
                    raise SystemExit(f'date de publication historique modifiée : {fichier.stem}')
                integre = ancien
        if base is not None and integre is not None:
            publies[fichier.stem] = integre
        elif base is None and brouillon == 'false':
            publies[fichier.stem] = courant
    if base and git_publication('rev-parse', '--verify', 'refs/remotes/origin/main^{commit}').strip() != base:
        raise SystemExit('base de publication origin/main a changé pendant la lecture')
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
            # Une exception utilisée à la réservation reste la trace de la rupture
            # après publication ; le statut ne la rend pas soudain superflue.
            if index == 0 or ordinaires[index - 1][champ] != e[champ]:
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
        # Deux créneaux le même jour n'ont pas d'ordre éditorial imposé. Essayer
        # les deux places d'une date figée avant de déclarer le stock impossible.
        # Le budget d'essais est partagé entre les branches.
        solution = chercher_position(i, disponibles, precedent)
        if solution is not None or i + 1 >= len(dates) or dates[i] != dates[i + 1]:
            return solution
        premier, second = fixes.get(i), fixes.get(i + 1)
        if (premier is None and second is None) or (premier is not None and second is not None
                                                   and premier.get('statut') == second.get('statut') == 'published'):
            return None
        if second is None:
            fixes[i + 1] = fixes.pop(i)
        elif premier is None:
            fixes[i] = fixes.pop(i + 1)
        else:
            fixes[i], fixes[i + 1] = second, premier
        try:
            return chercher_position(i, disponibles, precedent)
        finally:
            if premier is None:
                fixes.pop(i, None)
            else:
                fixes[i] = premier
            if second is None:
                fixes.pop(i + 1, None)
            else:
                fixes[i + 1] = second

    def chercher_position(i, disponibles, precedent):
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
        if e.get('statut') != 'published' and not e.get('datePlanifiee'):
            e['date'] = dates[i]
    for i, e in solution:
        e['_ordre_calendrier'] = i


def planifier(entrees, publies, aujourd_hui=None):
    """Réserve les dates explicites, puis planifie les ordinaires lun-jeu et les cicatrices le samedi."""
    aujourd_hui = aujourd_hui or date.today()
    regle_ia = lire_rattrapage_ia()
    for slug, p in publies.items():
        verifier_date_ia(regle_ia, slug, p['date'])
    for e in entrees:
        if regle_ia and e['slug'] in regle_ia['publications']:
            valeur = e.get('datePlanifiee', regle_ia['publications'][e['slug']])
            verifier_date_ia(regle_ia, e['slug'], valeur, e.get('serie'))
            if e['slug'] not in publies:
                e['datePlanifiee'] = valeur
    par_jour, par_semaine = Counter(), Counter()
    if any(p['date'] == DATE_RATTRAPAGE and slug not in RATTRAPAGE_W39 for slug, p in publies.items()):
        raise SystemExit('rattrapage W39 réservé aux trois sujets désignés')
    if any(slug in RATTRAPAGE_W39 and not date_archive_rattrapage(slug, p['date'])
           and p['date'] != RATTRAPAGE_W39[slug] for slug, p in publies.items()):
        raise SystemExit('rattrapage W39 hors dates réelles autorisées')
    slugs_cicatrices = {e['slug'] for e in entrees if e.get('serie') == 'cicatrices'}
    for slug, p in publies.items():
        if slug in slugs_cicatrices:
            continue
        if p['date']:
            d = date.fromisoformat(RATTRAPAGE_W39.get(slug, p['date']) if p['date'] in DATES_RATTRAPAGE else p['date'])
            par_jour[d] += 1
            par_semaine[cle_quota_ia(regle_ia, slug, d.isoformat())] += 1
            # La trace W39 ne libère pas la capacité du jour réellement publié.
            if d.isoformat() != p['date']:
                reel = date.fromisoformat(p['date'])
                par_jour[reel] += 1
                par_semaine[semaine_iso(reel)] += 1
    # La série « Cicatrices » (charte §7 ter) a sa propre cadence : un samedi par semaine ISO,
    # en sus des quatre articles ordinaires. Son stock reste factuel ; le planificateur place les
    # entrées existantes mais n'en invente jamais pour combler une semaine future.
    series = [e for e in entrees if e.get('serie') == 'cicatrices']
    semaines_reservees = set()

    def reserver_cicatrice(e, candidat):
        rattrapage = e['slug'] == SLUG_CICATRICE_W39 and e['slug'] in publies and date_archive_rattrapage(e['slug'], candidat.isoformat())
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
        if date_publiee and e.get('date') and date_publiee != e['date'] and not (e['slug'] == SLUG_CICATRICE_W39 and date_archive_rattrapage(e['slug'], date_publiee) and e['date'] == RATTRAPAGE_W39[e['slug']]):
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
        actifs = [{'slug': slug, 'date': p['date']} for slug, p in publies.items() if slug not in slugs_cicatrices]
        actifs += [x for x in entrees if x.get('statut') == 'planned' and x.get('serie') != 'cicatrices']
        plafond = plafond_jour_ia(regle_ia, e['slug'], valeur, actifs)
        semaine = cle_quota_ia(regle_ia, e['slug'], valeur)
        if par_jour[candidat] >= plafond and sum(p['date'] == valeur for slug, p in publies.items() if slug not in slugs_cicatrices) >= plafond:
            # Créneau supplanté par les publications réelles ; conserver la décision
            # datée, sans la transformer en promesse ni déplacer la date du backlog.
            e['date'] = valeur
            e['statut'] = 'a-replanifier'
            continue
        if candidat < aujourd_hui:
            raise SystemExit(f"date planifiée échue : {e['slug']} ({valeur}) ; replanifier sans antidater")
        if candidat < PREMIER_JOUR:
            raise SystemExit(f"date planifiée avant le début du calendrier : {e['slug']} ({valeur})")

        if par_jour[candidat] >= plafond or par_semaine[semaine] >= PAR_SEMAINE_MAX:
            raise SystemExit(f"date planifiée au-delà de la cadence : {e['slug']} ({valeur})")
        e['date'] = valeur
        e['statut'] = 'planned'
        par_jour[candidat] += 1
        par_semaine[semaine] += 1

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
        if not date_archive_rattrapage(slug_w39, p['date']) or p['format'] != 'thought-leadership' or p['famille'] != 'ia-generative-agents':
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
    regle_ia = lire_rattrapage_ia()
    tous = [pilier] + satellites
    for e in tous:
        verifier_date_ia(regle_ia, e['slug'], e['date'], e.get('serie'))
    slugs = [e['slug'] for e in tous]
    if len(slugs) != len(set(slugs)):
        erreurs.append('slugs en double')
    reqs = [e['requete'].strip().lower() for e in tous]
    if len(reqs) != len(set(reqs)):
        erreurs.append('requêtes primaires en double (cannibalisation)')
    roles_ok, formats_ok, intents_ok, funnels_ok = enum_du_schema('rolePrincipal'), enum_du_schema('format'), enum_du_schema('intent'), enum_du_schema('funnel')
    for e in tous:
        if e['slug'] in BRIEFS_IA_MANDATES and e['famille'] != BRIEFS_IA_MANDATES[e['slug']]:
            erreurs.append(f"famille du brief mandaté divergente : {e['slug']}")
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
        # Conserver le stock initial ; chaque intention mandatée effectivement inscrite
        # dans sa famille ajoute une place, sans permettre un angle arbitraire.
        attendu = (3 if fid in {pilier['famille'], 'ia-generative-agents'} else 4) + sum(
            BRIEFS_IA_MANDATES.get(e['slug']) == fid for e in angles)
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
    # Une date seule ne prouve pas une mesure primaire. L'angle IA historique avec
    # deux formulations testées vides conserve sa P1 grâce aux questions SERP datées.
    # Contrôler aussi les entrées publiées du backlog sans modifier leurs fichiers :
    # seuls les trois historiques synthétiques sans mesure et la série sont hors gate.
    # Deux captures distinctes : primaire du 21/09, SERP familiale du 19/09.
    source_serp = json.loads((ICI / 'mesures/questions-2026-09-19.json').read_text(encoding='utf-8'))
    source_primaire = json.loads((ICI / 'mesures/titres-intent-2026-09-21.json').read_text(encoding='utf-8'))
    cache = json.loads((ICI / 'mesures/autocompletion-cache.json').read_text(encoding='utf-8'))
    for e in tous:
        if e.get('historique') or e.get('serie'):
            continue
        demande = e.get('demande') or {}
        signal_primaire = isinstance(demande.get('requete'), int) and demande['requete'] > 0
        if e['slug'] == 'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain':
            # Cette P1 publiée n'a pas de primaire positif. Ne pas attribuer la SERP
            # de l'amorce familiale à sa requête, ni inventer zéro sur ses secondaires.
            amorce = "former l'équipe à l'IA cabinet comptable"
            serp = source_serp.get('serp', {}).get(amorce, {})
            primaire = source_primaire.get('autocompletion', {}).get(e['requete'])
            secondaires = e['secondaires']
            signal = (e['slug'] in publies and e['statut'] == 'published'
                      and isinstance(source_primaire.get('measuredAt'), str)
                      and source_primaire['measuredAt'][:10] == '2026-09-21'
                      and demande.get('mesureeLe') == '2026-09-21'
                      and primaire == [] and type(demande.get('requete')) is int and demande['requete'] == 0
                      and demande.get('secondaires', 1) is None
                      and all(s not in source_primaire.get('autocompletion', {})
                              and s not in source_serp.get('autocompletion', {}) for s in secondaires)
                      and source_serp.get('jour') == '2026-09-19'
                      and serp.get('famille') == e['famille'] == 'formation-ia-competences'
                      and demande.get('serpFamille') == {
                          'mesureeLe': '2026-09-19', 'amorce': amorce, 'famille': e['famille']}
                      and bool(serp.get('questions'))
                      and demande.get('questions') == serp['questions']
                      and demande.get('apercuIa') == serp.get('apercuIa'))
        elif e is pilier:
            source = cache.get(e['requete'], {})
            signal = (signal_primaire and demande.get('mesureeLe') == source.get('le')
                      and demande.get('requete') == len(source.get('suggestions', [])))
        else:
            signal = bool(demande.get('mesureeLe') and signal_primaire)
        if e['priorite'] == 1 and not signal:
            erreurs.append(f"angle de priorité 1 sans signal mesuré : {e['slug']}")
    ordinaires = [e for e in tous if e.get('serie') != 'cicatrices']
    cicatrices = [e for e in tous if e.get('serie') == 'cicatrices']
    par_jour, par_semaine, par_jour_reel, par_semaine_reelle = Counter(), Counter(), Counter(), Counter()
    for e in ordinaires:

        if e['date'] == DATE_RATTRAPAGE and e.get('statut') == 'published' and e['slug'] not in RATTRAPAGE_W39:
            erreurs.append(f"rattrapage W39 hors périmètre : {e['slug']}")
        if e.get('datePlanifiee') and creneau(e) != e['datePlanifiee']:
            erreurs.append(f"date planifiée non respectée : {e['slug']} ({e['date']} != {e['datePlanifiee']})")
        slot = date.fromisoformat(creneau(e))
        if e.get('statut') != 'a-replanifier':
            par_jour[slot] += 1
            par_semaine[cle_quota_ia(regle_ia, e['slug'], slot.isoformat())] += 1
        if e.get('statut') in ('published', 'planned'):
            reel = date.fromisoformat(e['date'])
            par_jour_reel[reel] += 1
            if not regle_ia or regle_ia['publications'].get(e['slug']) != e['date']:
                par_semaine_reelle[semaine_iso(reel)] += 1
        # Les jours habituels régissent le seul ordonnancement automatique, pas
        # une réservation explicite concordante ni une publication intégrée.
        if (slot >= PREMIER_JOUR and slot.weekday() not in JOURS_DE_PUBLICATION
                and e.get('statut') not in ('a-replanifier', 'published')
                and e.get('datePlanifiee') != e['date']):
            erreurs.append(f"article ordinaire hors lundi-jeudi : {e['slug']} ({e['date']})")
    if any(n > plafond_jour_ia(regle_ia, e['slug'], d.isoformat(), ordinaires) for d, n in par_jour.items()
           for e in ordinaires if date.fromisoformat(creneau(e)) == d):
        erreurs.append('plus de deux articles le même jour')
    if any(n > PAR_SEMAINE_MAX for n in par_semaine.values()):
        erreurs.append('plus de quatre articles la même semaine')
    if any(n > plafond_jour_ia(regle_ia, e['slug'], d.isoformat(), ordinaires) for d, n in par_jour_reel.items()
           for e in ordinaires if e['date'] == d.isoformat()):
        erreurs.append('jour réel : plus de deux articles publiés ou planifiés')
    if any(n > PAR_SEMAINE_MAX for n in par_semaine_reelle.values()):
        erreurs.append('semaine réelle : plus de quatre articles publiés ou planifiés')
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


def construire_json(poles, familles, pilier, satellites, liens, entrants):
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
        'methode': f"backlog de quatre angles par famille (méthode, contrôle ou checklist, exceptions et refus, définition), {len({e['famille'] for e in satellites})} familles et {len(clusters)} pôles actifs dans ce plan (12 pôles dans la taxonomie) ; cadence de 4 articles ordinaires par semaine, 2 par jour au plus du lundi au jeudi, plus 1 Cicatrice le samedi ; maillage pilier ↔ satellite et 2 liens cycliques par famille ; priorités fondées sur les suggestions d'autocomplétion Google des formulations testées (704 amorces au relevé du 19/09/2026, scripts/seo/questions.mjs). Les 59 pages de résultats DataForSEO ont été relevées par famille, pas par angle ; elles éclairent l'intention à vérifier, sans mesurer la demande ni le volume de chaque angle. Aucune suggestion relevée ne prouve une absence de demande ; confronter SERP, intention cabinet et Search Console avant de réécrire ou d'écarter. --check contrôle les P1 du backlog, publiées comprises, sans réécrire les publications : date et signal primaire positif, ou exception du seul angle IA publié avec requête primaire à zéro le 21/09 (titres-intent), secondaires non mesurées et questions identiques à la SERP par famille du 19/09 (questions) ; les trois articles historiques synthétiques et la série restent hors gate",
        'pillar': {'title': pilier['titre'], 'keyword': pilier['requete'], 'volume': 10, 'template': pilier['gabarit'], 'wordCount': pilier['mots'], 'url': pilier['url'], 'slug': pilier['slug'], 'family': pilier['famille'], 'status': pilier['statut'], 'date': pilier['date']},
        'rattrapageIA': lire_rattrapage_ia(),
        'clusters': clusters,
        'links': [{'from': l['de'], 'to': l['vers'], 'type': l['type'], 'anchor': l['ancre']} for l in liens],
        'meta': {'totalPosts': len(satellites), 'plannedPosts': sum(1 for e in satellites if e['statut'] == 'planned'), 'publishedPosts': sum(1 for e in satellites if e['statut'] == 'published'), 'totalClusters': len(clusters), 'totalFamilies': len({e['famille'] for e in satellites}), 'totalLinks': len(liens), 'estimatedWords': pilier['mots'] + sum(e['mots'] for e in satellites)},
    }
    return data


def ecrire_json(poles, familles, pilier, satellites, liens, entrants):
    data = construire_json(poles, familles, pilier, satellites, liens, entrants)
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


def construire_calendrier(pilier, satellites, familles, poles, jour=None):
    jour = jour or date.today()
    tous = sorted([pilier] + satellites, key=lambda e: (e['date'], e.get('_ordre_calendrier', 0)))
    L = ['# Calendrier éditorial v3 — quatre articles et une Cicatrice par semaine', '',
         f"Généré le {jour.strftime('%d/%m/%Y')} par `build-cluster-plan.py` depuis `backlog-v3.json` : ne pas éditer à la main, corriger le backlog ou la taxonomie puis régénérer. Cadence décidée par Kevin : quatre articles ordinaires par semaine, deux par jour au plus du lundi au jeudi, plus une Cicatrice le samedi. Les dates sont des créneaux de production, pas des promesses : un article qui n'atteint pas le gate attend le créneau suivant, et le backlog se réordonne à chaque signal (impressions Search Console par famille, demandes de contact citant une tâche).", '',
         '## Règles', '',

         "- Les priorités 1 → 3 restent celles du backlog (1 : la requête primaire a des suggestions d'autocomplétion Google, sauf l'angle IA publié conservé en P1 : primaire à zéro le 21/09 dans `titres-intent-2026-09-21.json`, secondaires non mesurées, questions de la SERP par famille du 19/09 dans `questions-2026-09-19.json` ; 2 : seule une requête secondaire en a ; 3 : aucune suggestion relevée sur les formulations testées — relevé `scripts/seo/questions.mjs`). --check contrôle aussi les P1 publiées du backlog sans réécrire les publications ; les trois historiques synthétiques et la série sont hors gate. Ce signal ne permet de conclure ni au volume de recherche, ni à la demande, ni à l’audience ; une formulation non mesurée ne vaut pas zéro suggestion. Ces priorités guident l'ordre des candidats compatibles avec l'alternance ; l'équilibre du stock de formats peut différer une priorité 1 sans changer sa mesure ni son angle.",
         '- Les créneaux ordinaires non figés alternent pôle et format entre deux articles successifs ; les dates publiées et `datePlanifiee` ne bougent jamais. Si un conflit daté est inévitable, `exceptionAlternance` dans le backlog désigne séparément `pole` ou `format`, chacun avec `date` (YYYY-MM-DD) et `raison` non vide ; seul le champ effectivement en conflit à cette date est dispensé. La série factuelle Cicatrices ne peut pas porter cette exception.',
         '- Chaque famille active conserve ses quatre angles (méthode, contrôle ou checklist, exceptions et refus, définition) ; leur ordre de sortie dépend des contraintes de calendrier et du stock disponible.',
         '- Une requête primaire par article, unique ; sources officielles obligatoires pour toute matière paie, sociale, fiscale, juridique ou données.',
         '- Le pilier reçoit un lien à chaque publication (republication scellée par la forge).', '',
         '- Une Cicatrice factuelle peut paraître le samedi, au plus une par semaine ISO, en sus du plafond des quatre articles ordinaires ; sans faits signés ni recette, le créneau reste vide. `manque` désigne une date échue conservée en trace, pas une publication.', '',
         '- Les anciennes réservations ordinaires manquées restent dans `dateManquee` du backlog ; leur date proposée au statut `a-replanifier` n’est pas actionnable. Une décision humaine fixe une nouvelle `datePlanifiee`, soumise aux portes de qualité et au quota du jour réel.', '',
         '- Rattrapage IA : `rattrapage-ia-2026-10-05.json` rattache quatre sujets à 2026-W40, avec dates réelles 04/10 et 05/10. Le 05/10 accepte trois articles uniquement de ce lot. Ils ne consomment pas les quatre nouveaux sujets W41 ; le jour réel reste occupé. Les autres quotas et Cicatrices restent inchangés.', '',
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
    return '\n'.join(L) + '\n'


def ecrire_calendrier(pilier, satellites, familles, poles):
    (ICI / 'CONTENT-CALENDAR.md').write_text(construire_calendrier(pilier, satellites, familles, poles), encoding='utf-8')


def ecrire_html(data):
    gabarit = GABARIT.read_text(encoding='utf-8')
    debut = gabarit.index('const CLUSTER_DATA = {')
    fin = gabarit.index('\n    };', debut) + len('\n    };')
    cd = {'pillar': data['pillar'], 'clusters': [{'name': c['name'], 'color': c['color'], 'posts': c['posts']} for c in data['clusters']], 'links': data['links'], 'meta': data['meta']}
    html = gabarit[:debut] + 'const CLUSTER_DATA = ' + json.dumps(cd, ensure_ascii=False) + ';' + gabarit[fin:]
    html = html.replace('<title>', '<title>Memlia v3 — ', 1)
    (ICI / 'cluster-map.html').write_text(html, encoding='utf-8')


def verifier_creneau(slug, jour, donnees):
    """Exige une édition fraîche ; W39 tient son autorité du cadrage borné, pas du créneau manqué."""
    poles, familles, publies, pilier, satellites, liens, _ = donnees
    w39 = slug == 'tests-verts-et-regle-des-trois-passes'
    if w39:
        if slug in publies:
            raise SystemExit('La Cicatrice W39 est déjà publiée ; aucun nouvel exemplaire ni édition.')
        # Réutiliser le garde effectif de la forge, sans reproduire le reçu/RAW/quota
        # en Python ni convertir une trace historique en réservation ordinaire.
        try:
            controle = subprocess.run(
                ['node', str(RACINE / 'scripts/blog-forge.mjs'), 'verifier-creneau-w39', slug, jour.isoformat()],
                cwd=RACINE, capture_output=True, text=True, timeout=30, check=False)
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise SystemExit('préflight W39 indisponible : arrêt sans écriture') from exc
        if controle.returncode != 0:
            raise SystemExit('cadrage W39 refusé : ' + (controle.stderr.strip() or controle.stdout.strip()))
    elif slug in publies:
        return  # Une republication tient sa date du fichier publié.
    tous = [pilier] + satellites
    cible = next((e for e in tous if e['slug'] == slug), None)
    if not w39 and (cible is None or (cible['date'], cible['statut']) != (jour.isoformat(), 'planned')):
        raise SystemExit(f'créneau planned non actionnable : {slug} ({jour})')
    try:
        plan = json.loads((ICI / 'cluster-plan.json').read_text(encoding='utf-8'))
        calendrier = (ICI / 'CONTENT-CALENDAR.md').read_text(encoding='utf-8')
        if not isinstance(plan, dict):
            raise ValueError('plan JSON non objet')
    except (OSError, ValueError, KeyError, TypeError) as exc:
        raise SystemExit('calendrier absent ou illisible : rééditer depuis les sources') from exc
    if plan.get('date') != jour.isoformat() or not any(
            line.startswith(f"Généré le {jour.strftime('%d/%m/%Y')} ") for line in calendrier.splitlines()[:4]):
        raise SystemExit('calendrier périmé : rééditer depuis les sources avant la forge')
    # Réutiliser les rendus de l'édition sans écrire : aucun champ éditorial,
    # lien, compteur ou autre ligne du calendrier ne peut dériver silencieusement.
    entrants = Counter(l['vers'] for l in liens)
    attendu = construire_json(poles, familles, pilier, satellites, liens, entrants)
    attendu['date'] = jour.isoformat()
    if plan != attendu:
        raise SystemExit('calendrier désaligné des sources : rééditer depuis le backlog et les publications')
    if calendrier != construire_calendrier(pilier, satellites, familles, poles, jour):
        raise SystemExit('calendrier désaligné : rééditer le calendrier complet depuis les sources')

if __name__ == '__main__':
    poles, familles, publies, pilier, satellites, liens, par_famille = construire()
    erreurs, entrants, par_semaine = verifier(poles, familles, publies, pilier, satellites, liens, par_famille)
    if '--slot' in sys.argv:
        if erreurs:
            raise SystemExit('plan source invalide : ' + '; '.join(erreurs))
        index = sys.argv.index('--slot')
        if len(sys.argv) != index + 3:
            raise SystemExit('Usage : build-cluster-plan.py --slot <slug> <jour-Paris>')
        verifier_creneau(sys.argv[index + 1], date.fromisoformat(sys.argv[index + 2]),
                         (poles, familles, publies, pilier, satellites, liens, par_famille))
        print('créneau : OK')
        sys.exit(0)
    # Le contrôle valide le plan en mémoire ; seule la régénération explicite date les dérivés.
    if '--check' not in sys.argv:
        data = ecrire_json(poles, familles, pilier, satellites, liens, entrants)
        ecrire_md(data, familles)
        ecrire_calendrier(pilier, satellites, familles, poles)
        ecrire_html(data)
    print(f"cluster-plan : {len(satellites)} satellites ({sum(e['statut'] == 'published' for e in satellites)} publiés), {len({e['famille'] for e in satellites})} familles, {len({e['pole'] for e in satellites})} pôles, {len(liens)} liens ; entrants min = {min(entrants[e['slug']] for e in satellites)} ; semaines planifiées = {len(par_semaine)} ; dernier créneau = {max(e['date'] for e in satellites)}")
    for e in erreurs:
        print('ERREUR :', e)
    if erreurs and '--check' in sys.argv:
        sys.exit(1)
    print('invariants : OK' if not erreurs else f'{len(erreurs)} erreur(s)')
