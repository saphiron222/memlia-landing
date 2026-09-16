#!/usr/bin/env python3
"""Vérification de la production après publication.

Ce contrôle se fait EN LIGNE, sur le domaine réel, et pas sur une prévisualisation :
Cloudflare applique au bord des transformations qui n'existent que là — le bandeau
d'analyse, et l'obscurcissement des adresses de courriel. Une preview ne peut donc pas
prouver ce que voit un visiteur, en particulier un visiteur sans JavaScript.

Usage : python3 docs/strategy/site-v2/release/verifier-production.py
"""
from __future__ import annotations

import html
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

RACINE = Path(__file__).resolve().parents[4]
SITE = "https://memlia.fr"
RAPPORT = RACINE / "docs/strategy/site-v2/release/verification-production.json"
NAVIGATEUR = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36"}

INDEXABLES = ["/", "/automatisation-cabinet-comptable", "/methode", "/garanties", "/a-propos",
              "/contact", "/blog", "/ressources", "/glossaire",
              "/blog/controler-les-bulletins-de-paie-avant-la-dsn",
              "/blog/comprendre-les-comptes-rendus-metier-dsn",
              "/blog/suivre-la-production-sociale-dans-excel"]
NOINDEX = ["/mentions-legales", "/politique-de-confidentialite"]
ANCRES = ["usages", "methode", "integration", "garanties", "questions", "preuves"]


def lire(chemin: str) -> tuple[int, str]:
    requete = urllib.request.Request(SITE + chemin, headers=NAVIGATEUR)
    try:
        reponse = urllib.request.urlopen(requete)
        return reponse.getcode(), reponse.read().decode("utf-8")
    except urllib.error.HTTPError as erreur:
        return erreur.code, erreur.read().decode("utf-8", errors="replace")


def texte_visible(page: str) -> str:
    sans = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", page)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"(?s)<[^>]+>", " ", sans)))


def principal() -> int:
    defauts: list[str] = []
    pages: dict[str, dict] = {}

    for chemin in INDEXABLES + NOINDEX:
        code, page = lire(chemin)
        canonical = re.search(r'<link rel="canonical" href="(.*?)"', page)
        robots = re.search(r'<meta name="robots" content="(.*?)"', page)
        attendue = f"{SITE}/" if chemin == "/" else f"{SITE}{chemin}"
        h1 = len(re.findall(r"<h1[\s>]", page))
        pages[chemin] = {"status": code, "canonical": canonical.group(1) if canonical else None,
                         "robots": robots.group(1) if robots else None, "h1": h1, "octets": len(page)}
        if code != 200:
            defauts.append(f"{chemin} répond {code}")
        if not canonical or canonical.group(1) != attendue:
            defauts.append(f"{chemin} canonical {canonical.group(1) if canonical else 'absente'} au lieu de {attendue}")
        if h1 != 1:
            defauts.append(f"{chemin} porte {h1} H1")
        indexable = chemin in INDEXABLES
        if indexable and robots and "noindex" in robots.group(1):
            defauts.append(f"{chemin} est noindex en production")
        if not indexable and (not robots or "noindex" not in robots.group(1)):
            defauts.append(f"{chemin} devrait être noindex")

    code_404, _ = lire("/route-qui-n-existe-pas-" + datetime.now(timezone.utc).strftime("%H%M%S"))
    if code_404 != 404:
        defauts.append(f"une route inexistante répond {code_404} au lieu de 404")

    _, sitemap = lire("/sitemap-0.xml")
    urls = re.findall(r"<loc>(.*?)</loc>", sitemap)
    attendues = {f"{SITE}/" if c == "/" else f"{SITE}{c}" for c in INDEXABLES}
    if set(urls) != attendues:
        defauts.append(f"sitemap : {sorted(set(urls) ^ attendues)}")

    _, flux = lire("/blog/rss.xml")
    if flux.count("<item>") != 3 or flux.count("Kevin Kitanga") < 3:
        defauts.append("flux RSS : items ou attribution incomplets")

    identites = set()
    for chemin in ["/a-propos", "/blog"] + [c for c in INDEXABLES if c.startswith("/blog/")]:
        _, page = lire(chemin)
        for bloc in re.findall(r'(?is)<script[^>]+ld\+json[^>]*>(.*?)</script>', page):
            for noeud in (json.loads(bloc).get("@graph") or []):
                if noeud.get("@type") == "Person":
                    identites.add(noeud["@id"])
    if identites != {f"{SITE}/a-propos#kevin-kitanga"}:
        defauts.append(f"identités d'auteur : {sorted(identites)}")

    _, accueil = lire("/")
    for ancre in ANCRES:
        if f'id="{ancre}"' not in accueil:
            defauts.append(f"ancre historique #{ancre} absente de l'accueil")

    # Transformations de bord : elles n'existent qu'ici, une preview ne peut pas les montrer.
    obscurcies, sans_js = 0, True
    for chemin in INDEXABLES + NOINDEX:
        _, page = lire(chemin)
        obscurcies += len(re.findall(r"/cdn-cgi/l/email-protection|__cf_email__", page))
    _, contact = lire("/contact")
    if "contact@memlia.fr" not in texte_visible(contact):
        sans_js = False
        defauts.append("/contact : l'adresse de courriel n'est pas lisible sans JavaScript")
    if obscurcies:
        defauts.append(f"{obscurcies} adresse(s) de courriel obscurcie(s) par Cloudflare")

    _, artefact = lire("/.DS_Store")
    rapport = {
        "schemaVersion": 1,
        "controle": "vérification de la production après publication",
        "regle": "Contrôle en ligne sur le domaine réel : Cloudflare transforme au bord, une prévisualisation ne peut pas le montrer.",
        "date": datetime.now(timezone.utc).isoformat(),
        "routesIndexables": len(INDEXABLES),
        "routesNoindex": len(NOINDEX),
        "sitemap": len(urls),
        "identiteAuteur": sorted(identites),
        "ancresHistoriques": len(ANCRES),
        "adressesObscurcies": obscurcies,
        "adresseLisibleSansJavaScript": sans_js,
        "artefactDePoste": {"/.DS_Store": lire("/.DS_Store")[0]},
        "pages": pages,
        "defauts": defauts,
        "resultat": "PASS" if not defauts else "FAIL",
    }
    RAPPORT.write_text(json.dumps(rapport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for d in defauts:
        print("KO", d)
    print(f"{len(INDEXABLES)} routes indexables, {len(NOINDEX)} noindex, {len(urls)} URL au sitemap, "
          f"{obscurcies} adresse obscurcie — {rapport['resultat']}")
    return 0 if not defauts else 1


if __name__ == "__main__":
    raise SystemExit(principal())
