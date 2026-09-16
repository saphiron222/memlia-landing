#!/usr/bin/env python3
"""Oracle du site v2 : contrôle le rendu servi, pas l'intention du code.

Il lit `dist/` comme un robot le ferait — routes réelles, sitemap, flux — et refuse
si une seule des règles de TECHNICAL-SEO-SCHEMA.md casse. Ses cinq mutants existent
pour la raison inverse : un oracle vert qu'aucune mutation ne fait rougir ne prouve
rien. Chaque mutant casse une règle précise et doit être rattrapé par elle.

Usage : python3 docs/strategy/site-v2/build/oracle.py [--rapport <chemin.json>]
"""
from __future__ import annotations

import argparse
import copy
import json
import re
import sys
from collections import deque
from pathlib import Path

RACINE = Path(__file__).resolve().parents[4]
DIST = RACINE / "dist"
SITE = "https://memlia.fr"

# Pages servies mais hors index : elles DOIVENT porter noindex et rester hors sitemap.
NOINDEX_ATTENDUES = {"/mentions-legales", "/politique-de-confidentialite", "/404"}
# Les six ancres historiques citées par des liens existants, internes comme externes.
ANCRES_HISTORIQUES = ["usages", "methode", "integration", "garanties", "questions", "preuves"]
AUTEURS_AUTORISES = {"Kevin Kitanga", "Memlia", "Équipe éditoriale Memlia"}
PROFONDEUR_MAX = 3

TELEPHONE_FR = re.compile(r"(?<!\d)(?:\+33|0)[1-9](?:[ .\-]?\d{2}){4}(?!\d)")
TVA_FR = re.compile(r"\bFR\s?\d{2}\s?\d{9}\b")
# Seul l'hébergeur a le droit d'exposer un téléphone : la LCEN l'impose dans les mentions.
TEL_HEBERGEUR = "tel:+18889935273"


def chemin_depuis_fichier(fichier: Path) -> str:
    relatif = fichier.relative_to(DIST).with_suffix("")
    return "/" if relatif.name == "index" and relatif.parent == Path(".") else "/" + str(relatif)


def texte_visible(html: str) -> str:
    sans = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", html)
    return re.sub(r"\s+", " ", re.sub(r"(?s)<[^>]+>", " ", sans))


def lire_page(fichier: Path) -> dict:
    html = fichier.read_text(encoding="utf-8")
    titre = re.search(r"(?is)<title>(.*?)</title>", html)
    description = re.search(r'(?is)<meta\s+name="description"\s+content="(.*?)"', html)
    canonical = re.search(r'(?is)<link\s+rel="canonical"\s+href="(.*?)"', html)
    robots = re.search(r'(?is)<meta\s+name="robots"\s+content="(.*?)"', html)
    jsonld = []
    for bloc in re.findall(r'(?is)<script[^>]+application/ld\+json[^>]*>(.*?)</script>', html):
        jsonld.append(bloc)
    return {
        "chemin": chemin_depuis_fichier(fichier),
        "fichier": str(fichier.relative_to(RACINE)),
        "titre": (titre.group(1).strip() if titre else ""),
        "description": (description.group(1).strip() if description else ""),
        "canonical": (canonical.group(1).strip() if canonical else ""),
        "robots": (robots.group(1).strip() if robots else ""),
        "h1": re.findall(r"(?is)<h1[^>]*>(.*?)</h1>", html),
        "jsonld": jsonld,
        "liens": sorted({h for h in re.findall(r'(?is)href="([^"]+)"', html)}),
        "texte": texte_visible(html),
        "html": html,
    }


def charger() -> dict:
    pages = {}
    for fichier in sorted(DIST.rglob("*.html")):
        page = lire_page(fichier)
        pages[page["chemin"]] = page
    sitemap = re.findall(r"<loc>(.*?)</loc>", (DIST / "sitemap-0.xml").read_text(encoding="utf-8"))
    rss = (DIST / "blog/rss.xml").read_text(encoding="utf-8")
    fichiers = {("/" + str(f.relative_to(DIST))) for f in DIST.rglob("*") if f.is_file()}
    return {"pages": pages, "sitemap": sitemap, "rss": rss, "fichiers": fichiers}


def cible_interne(etat: dict, href: str) -> bool:
    chemin = href.split("#", 1)[0].split("?", 1)[0]
    if chemin in ("", "/"):
        return True
    if chemin in etat["pages"]:
        return True
    return chemin in etat["fichiers"] or (chemin + "/index.html") in etat["fichiers"]


def manifeste_routes(etat: dict) -> list[dict]:
    """Manifeste des routes réellement servies : ce que le build rend, pas ce qu'il vise."""
    pages = etat["pages"]
    graphe, entrants = {}, {c: 0 for c in pages}
    for chemin, page in pages.items():
        sortants = set()
        for href in page["liens"]:
            if href.startswith("/") and not href.startswith("//"):
                destination = href.split("#", 1)[0].split("?", 1)[0] or "/"
                if destination in pages:
                    sortants.add(destination)
        graphe[chemin] = sortants
    for source, destinations in graphe.items():
        for destination in destinations:
            if destination != source:
                entrants[destination] += 1
    profondeur, file = {"/": 0}, deque(["/"])
    while file:
        courant = file.popleft()
        for suivant in graphe.get(courant, ()):
            if suivant not in profondeur:
                profondeur[suivant] = profondeur[courant] + 1
                file.append(suivant)
    lignes = []
    for chemin, page in sorted(pages.items()):
        types = []
        for bloc in page["jsonld"]:
            try:
                donnees = json.loads(bloc)
            except json.JSONDecodeError:
                continue
            noeuds = donnees.get("@graph", [donnees]) if isinstance(donnees, dict) else donnees
            types += [n.get("@type") for n in noeuds if isinstance(n, dict) and n.get("@type")]
        lignes.append({
            "route": chemin,
            "fichier": page["fichier"],
            "indexable": "noindex" not in page["robots"].lower(),
            "canonical": page["canonical"],
            "titre": page["titre"],
            "description": page["description"],
            "schemas": sorted({t for t in types if isinstance(t, str)}),
            "liensEntrants": entrants.get(chemin, 0),
            "profondeur": profondeur.get(chemin),
        })
    return lignes


def controler(etat: dict) -> list[str]:
    erreurs: list[str] = []
    pages = etat["pages"]
    indexables = {c: p for c, p in pages.items() if "noindex" not in p["robots"].lower()}

    # 1. Chaque page indexable : un seul H1, canonical exacte, metadata non vide, schéma parseable.
    for chemin, page in sorted(indexables.items()):
        if len(page["h1"]) != 1:
            erreurs.append(f"C1 {chemin} : {len(page['h1'])} H1 au lieu d'un seul.")
        if page["canonical"] != f"{SITE}{'' if chemin == '/' else chemin}" and page["canonical"] != f"{SITE}/":
            erreurs.append(f"C1 {chemin} : canonical {page['canonical'] or 'absente'} ne correspond pas à la route.")
        if not page["titre"] or not page["description"]:
            erreurs.append(f"C1 {chemin} : titre ou description vide.")
        for bloc in page["jsonld"]:
            try:
                json.loads(bloc)
            except json.JSONDecodeError as erreur:
                erreurs.append(f"C1 {chemin} : JSON-LD illisible ({erreur.msg}).")

    # 2. Sitemap : exactement les indexables, aucune noindex, aucune route absente du build.
    attendu = {f"{SITE}{'' if c == '/' else c}" for c in indexables if c != "/404"}
    attendu.add(f"{SITE}/")
    attendu.discard(f"{SITE}")
    vus = set(etat["sitemap"])
    for url in sorted(vus - attendu):
        erreurs.append(f"C2 sitemap : {url} n'est pas une route indexable du build.")
    for url in sorted(attendu - vus):
        erreurs.append(f"C2 sitemap : {url} est indexable mais absente.")
    for chemin in sorted(NOINDEX_ATTENDUES):
        page = pages.get(chemin)
        if page is None:
            erreurs.append(f"C2 {chemin} : page attendue absente du build.")
        elif "noindex" not in page["robots"].lower():
            erreurs.append(f"C2 {chemin} : doit porter noindex, robots={page['robots'] or 'absent'}.")

    # 3. Fil d'Ariane : le dernier maillon est la page elle-même, positions croissantes.
    for chemin, page in sorted(indexables.items()):
        for bloc in page["jsonld"]:
            try:
                donnees = json.loads(bloc)
            except json.JSONDecodeError:
                continue
            for noeud in donnees.get("@graph", [donnees]) if isinstance(donnees, dict) else donnees:
                if not isinstance(noeud, dict) or noeud.get("@type") != "BreadcrumbList":
                    continue
                elements = noeud.get("itemListElement", [])
                positions = [e.get("position") for e in elements]
                if positions != sorted(positions):
                    erreurs.append(f"C3 {chemin} : positions du fil d'Ariane non croissantes.")
                dernier = elements[-1].get("item") if elements else None
                cible = dernier.get("@id") if isinstance(dernier, dict) else dernier
                if cible and cible.rstrip("/") != f"{SITE}{chemin}".rstrip("/"):
                    erreurs.append(f"C3 {chemin} : le fil d'Ariane finit sur {cible}.")

    # 3bis. Entités cohérentes entre le flux et les articles.
    for lien in re.findall(r"<link>(.*?)</link>", etat["rss"]):
        chemin = lien.replace(SITE, "").split("#")[0] or "/"
        if chemin != "/" and chemin not in pages:
            erreurs.append(f"C3 flux RSS : {lien} ne correspond à aucune page du build.")

    # 4. Liens internes vivants, aucune orpheline, profondeur bornée.
    graphe = {}
    for chemin, page in pages.items():
        sortants = set()
        for href in page["liens"]:
            if href.startswith("http") or href.startswith("mailto:") or href.startswith("tel:"):
                continue
            if not href.startswith("/"):
                continue
            if not cible_interne(etat, href):
                erreurs.append(f"C4 {chemin} : lien interne mort vers {href}.")
                continue
            destination = href.split("#", 1)[0].split("?", 1)[0] or "/"
            if destination in pages:
                sortants.add(destination)
        graphe[chemin] = sortants
    entrants = {chemin: 0 for chemin in pages}
    for source, destinations in graphe.items():
        for destination in destinations:
            if destination != source:
                entrants[destination] += 1
    for chemin in sorted(indexables):
        if chemin != "/" and entrants.get(chemin, 0) == 0:
            erreurs.append(f"C4 {chemin} : page orpheline, aucun lien interne n'y mène.")
    profondeur = {"/": 0}
    file = deque(["/"])
    while file:
        courant = file.popleft()
        for suivant in graphe.get(courant, ()):
            if suivant not in profondeur:
                profondeur[suivant] = profondeur[courant] + 1
                file.append(suivant)
    for chemin in sorted(indexables):
        if chemin == "/404":
            continue
        if chemin not in profondeur:
            erreurs.append(f"C4 {chemin} : inatteignable depuis l'accueil.")
        elif profondeur[chemin] > PROFONDEUR_MAX:
            erreurs.append(f"C4 {chemin} : profondeur {profondeur[chemin]} au-delà de {PROFONDEUR_MAX}.")

    # 5. Aucun téléphone Memlia, aucune TVA non confirmée, aucun auteur inventé.
    for chemin, page in sorted(pages.items()):
        for correspondance in TELEPHONE_FR.finditer(page["texte"]):
            erreurs.append(f"C5 {chemin} : numéro de téléphone français rendu ({correspondance.group(0)}).")
        if TVA_FR.search(page["texte"]):
            erreurs.append(f"C5 {chemin} : numéro de TVA publié sans confirmation.")
        for lien in page["liens"]:
            if lien.startswith("tel:") and lien != TEL_HEBERGEUR:
                erreurs.append(f"C5 {chemin} : lien téléphonique {lien} hors mention légale d'hébergeur.")
        for auteur in re.findall(r'"author"\s*:\s*\{[^}]*?"name"\s*:\s*"([^"]+)"', page["html"]):
            if auteur not in AUTEURS_AUTORISES:
                erreurs.append(f"C5 {chemin} : auteur déclaré « {auteur} » hors des noms autorisés.")

    # 6. Les six ancres historiques restent des cibles servies sur l'accueil.
    accueil = pages.get("/", {}).get("html", "")
    for ancre in ANCRES_HISTORIQUES:
        if not re.search(rf'id="{ancre}"', accueil):
            erreurs.append(f"C6 accueil : ancre historique #{ancre} absente du HTML rendu.")

    return erreurs


MUTANTS = [
    ("noindex retiré d'une page légale", "C2",
     lambda e: e["pages"]["/mentions-legales"].update(robots="index, follow")),
    ("canonical cassée", "C1",
     lambda e: e["pages"]["/methode"].update(canonical=f"{SITE}/mauvaise-route")),
    ("téléphone Memlia introduit", "C5",
     lambda e: e["pages"]["/contact"].update(texte=e["pages"]["/contact"]["texte"] + " 01 23 45 67 89")),
    ("auteur changé", "C5",
     lambda e: e["pages"]["/blog"].update(html=e["pages"]["/blog"]["html"] + '<script type="application/ld+json">{"author":{"name":"Jean Dupont"}}</script>')),
    ("route future ajoutée au sitemap", "C2",
     lambda e: e["sitemap"].append(f"{SITE}/guides")),
    ("ancre historique supprimée", "C6",
     lambda e: e["pages"]["/"].update(html=e["pages"]["/"]["html"].replace('id="preuves"', 'id="preuves-v2"'))),
]


def principal() -> int:
    parseur = argparse.ArgumentParser()
    parseur.add_argument("--rapport", default="docs/strategy/site-v2/build/oracle-rapport.json")
    options = parseur.parse_args()

    if not DIST.is_dir():
        print("dist/ absent : lancer npm run build:site avant l'oracle.", file=sys.stderr)
        return 2

    etat = charger()
    erreurs = controler(etat)

    resultats_mutants = []
    for nom, regle, mutation in MUTANTS:
        mute = copy.deepcopy(etat)
        mutation(mute)
        attrapes = [e for e in controler(mute) if e.startswith(regle)]
        nouveaux = [e for e in attrapes if e not in erreurs]
        resultats_mutants.append({"mutant": nom, "regle": regle, "attrape": bool(nouveaux), "erreurs": nouveaux[:3]})

    non_attrapes = [m["mutant"] for m in resultats_mutants if not m["attrape"]]
    pages_indexables = sorted(c for c, p in etat["pages"].items() if "noindex" not in p["robots"].lower())
    rapport = {
        "schemaVersion": 1,
        "regle": "Un oracle vert qu'aucune mutation ne fait rougir ne prouve rien : les six mutants doivent être attrapés.",
        "routes": {"total": len(etat["pages"]), "indexables": pages_indexables, "sitemap": len(etat["sitemap"])},
        "manifesteRoutes": manifeste_routes(etat),
        "erreurs": erreurs,
        "mutants": resultats_mutants,
        "resultat": "PASS" if not erreurs and not non_attrapes else "FAIL",
    }
    Path(RACINE / options.rapport).write_text(json.dumps(rapport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for erreur in erreurs:
        print(erreur)
    for mutant in resultats_mutants:
        print(f"mutant {'attrapé' if mutant['attrape'] else 'NON ATTRAPÉ'} : {mutant['mutant']} ({mutant['regle']})")
    print(f"{len(pages_indexables)} routes indexables, {len(etat['sitemap'])} URL au sitemap, {len(erreurs)} erreur(s).")
    return 0 if rapport["resultat"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(principal())
