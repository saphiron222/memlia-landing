#!/usr/bin/env python3
"""Revue de copy : ce que les pages affirment vraiment, comparé au registre de claims.

Deux contrôles, dans les deux sens, parce qu'un seul laisserait passer la moitié des
défauts :

  - chaque affirmation enregistrée doit être portée par une phrase de sa page ;
  - chaque promesse chiffrée, datée ou légale rendue sur une page doit être couverte
    par le registre, sinon la page promet ce que personne n'a sourcé.

La première version de ce contrôle comparait le registre à la prose caractère par
caractère. Elle a rendu douze « affirmations non rendues » qui étaient toutes sur
leurs pages, condensées ou reformulées : l'instrument mesurait l'identité littérale,
pas la présence de l'affirmation. Il compare désormais le vocabulaire porteur d'une
phrase, et ses mutants vérifient qu'une affirmation réellement absente rougit encore.

Usage : python3 docs/strategy/site-v2/build/revue-copy.py
"""
from __future__ import annotations

import csv
import html
import json
import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[4]
DIST = RACINE / "dist"
CLAIMS = RACINE / "docs/strategy/site-v2/copy/claims.csv"
RAPPORT = RACINE / "docs/strategy/site-v2/build/revue-copy.json"
COUVERTURE_MIN = 0.8

VIDES = {
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "l", "et", "ou", "que", "qui", "quoi",
    "a", "à", "au", "aux", "en", "dans", "sur", "pour", "par", "avec", "sans", "ne", "pas", "plus",
    "est", "sont", "ce", "cet", "cette", "ces", "se", "son", "sa", "ses", "nos", "notre", "votre",
    "vos", "nous", "vous", "je", "il", "elle", "on", "y", "s", "n", "c", "j", "qu", "comme", "mais",
    "aussi", "tel", "leur", "lui", "me", "moi", "the", "of",
}
# Une promesse qui engage : un chiffre, un délai, une garantie légale, une exclusivité.
MOTIFS_A_SOURCER = [
    (r"\b\d+\s*(?:%|pour cent)", "pourcentage"),
    (r"\b\d+\s*(?:h|heures?|jours?|semaines?|mois|ans?)\b", "durée chiffrée"),
    (r"\b\d[\d  ]*\s*(?:€|euros?)", "montant"),
    (r"(?<!non )\b(?:garantit|garantissons|certifié|certifie|conforme au RGPD|conformité RGPD|attesté|atteste)\b", "garantie ou conformité"),
    (r"\b(?:le seul|la seule|unique sur le marché|leader|n°\s*1)\b", "exclusivité"),
    (r"\b(?:tous les cabinets|100\s*%|toujours sans|jamais d'erreur)\b", "absolu"),
]
EXCEPTIONS = [r"étape\s+\d", r"une trentaine de minutes", r"non attest"]


def normaliser(valeur: str) -> str:
    return re.sub(r"\s+", " ", valeur.replace("’", "'").replace(" ", " ")).strip()


def corps_visible(chemin: Path) -> str:
    """Seul le contenu principal est lu : le bandeau et le pied répètent des mots sur chaque page."""
    brut = chemin.read_text(encoding="utf-8")
    principal = re.search(r"(?is)<main\b[^>]*>(.*?)</main>", brut)
    zone = principal.group(1) if principal else brut
    zone = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", zone)
    return normaliser(html.unescape(re.sub(r"(?s)<[^>]+>", " ", zone)))


def mots_porteurs(phrase: str) -> list[str]:
    mots = re.findall(r"[0-9a-zà-öø-ÿ']+", phrase.lower())
    return [m for m in mots if m not in VIDES and len(m) > 1]


def phrases(texte: str) -> list[str]:
    return [p.strip() for p in re.split(r"(?<=[.!?:;])\s+", texte) if p.strip()]


def meilleure_correspondance(affirmation: str, texte: str) -> tuple[float, str]:
    """Une affirmation est portée si une phrase contient presque tout son vocabulaire porteur."""
    if affirmation.lower() in texte.lower():
        return 1.0, affirmation
    attendus = mots_porteurs(affirmation)
    if not attendus:
        return 0.0, ""
    meilleur, phrase_retenue = 0.0, ""
    decoupe = phrases(texte)
    # Une affirmation condensée peut chevaucher deux phrases voisines : on teste aussi les paires.
    fenetres = decoupe + [f"{a} {b}" for a, b in zip(decoupe, decoupe[1:])]
    for fenetre in fenetres:
        presents = set(mots_porteurs(fenetre))
        couverture = sum(1 for mot in attendus if mot in presents) / len(attendus)
        if couverture > meilleur:
            meilleur, phrase_retenue = couverture, fenetre
    return meilleur, phrase_retenue


def analyser(textes: dict[str, str], claims: list[dict]) -> dict:
    non_portees, sans_source, portees = [], [], []
    for ligne in claims:
        affirmation = normaliser(ligne["affirmation"])
        couverture, phrase = meilleure_correspondance(affirmation, textes[ligne["page"]])
        entree = {"page": ligne["page"], "affirmation": affirmation, "couverture": round(couverture, 2), "phrase": phrase[:220]}
        (portees if couverture >= COUVERTURE_MIN else non_portees).append(entree)
        if not (ligne["source ou limite"] or "").strip() or not (ligne["statut"] or "").strip():
            sans_source.append({"page": ligne["page"], "affirmation": affirmation})

    non_enregistrees = []
    for page, texte in textes.items():
        enregistrees = [normaliser(l["affirmation"]) for l in claims if l["page"] == page]
        for motif, genre in MOTIFS_A_SOURCER:
            for trouve in re.finditer(motif, texte, flags=re.IGNORECASE):
                phrase = next((p for p in phrases(texte) if trouve.group(0) in p), texte[max(0, trouve.start() - 90): trouve.end() + 90])
                if any(re.search(exception, phrase, flags=re.IGNORECASE) for exception in EXCEPTIONS):
                    continue
                if any(meilleure_correspondance(claim, phrase)[0] >= 0.5 for claim in enregistrees):
                    continue
                non_enregistrees.append({"page": page, "genre": genre, "trouve": trouve.group(0), "phrase": phrase[:220]})
    return {"portees": portees, "nonPortees": non_portees, "sansSource": sans_source, "promessesNonEnregistrees": non_enregistrees}


def principal() -> int:
    if not DIST.is_dir():
        print("dist/ absent : lancer npm run build:site avant la revue.", file=sys.stderr)
        return 2
    with CLAIMS.open(encoding="utf-8") as flux:
        claims = list(csv.DictReader(flux, delimiter=";"))

    textes: dict[str, str] = {}
    for ligne in claims:
        page = ligne["page"]
        if page in textes:
            continue
        fichier = DIST / ("index.html" if page == "/" else f"{page.lstrip('/')}.html")
        if not fichier.is_file():
            print(f"page {page} déclarée au registre mais absente du build", file=sys.stderr)
            return 1
        textes[page] = corps_visible(fichier)

    analyse = analyser(textes, claims)

    # Mutants : un contrôle qu'aucune mutation ne fait rougir ne prouve rien.
    page_temoin = claims[0]["page"]
    mutants = []
    invente = claims + [{"page": page_temoin, "section": "mutant", "affirmation": "Memlia restitue quatre-vingt-quinze pour cent du temps de saisie du cabinet", "source ou limite": "inventée", "statut": "mutant"}]
    mutants.append({"mutant": "affirmation absente ajoutée au registre", "attrape": len(analyser(textes, invente)["nonPortees"]) > len(analyse["nonPortees"])})
    pollue = dict(textes)
    pollue[page_temoin] = textes[page_temoin] + " Memlia garantit une réduction de 40 % du temps de saisie."
    mutants.append({"mutant": "promesse chiffrée non enregistrée injectée dans une page", "attrape": len(analyser(pollue, claims)["promessesNonEnregistrees"]) > len(analyse["promessesNonEnregistrees"])})
    sans = [dict(l, **{"source ou limite": ""}) if l is claims[0] else l for l in claims]
    mutants.append({"mutant": "source retirée d'une affirmation", "attrape": len(analyser(textes, sans)["sansSource"]) > len(analyse["sansSource"])})

    echecs = analyse["nonPortees"] or analyse["sansSource"] or analyse["promessesNonEnregistrees"] or [m for m in mutants if not m["attrape"]]
    rapport = {
        "schemaVersion": 2,
        "regle": "Le registre et les pages se contrôlent dans les deux sens ; la présence se mesure sur le vocabulaire porteur d'une phrase, pas sur l'identité littérale.",
        "couvertureMinimale": COUVERTURE_MIN,
        "claims": len(claims),
        "pages": sorted(textes),
        "affirmationsPortees": len(analyse["portees"]),
        "affirmationsNonPortees": analyse["nonPortees"],
        "affirmationsSansSource": analyse["sansSource"],
        "promessesNonEnregistrees": analyse["promessesNonEnregistrees"],
        "mutants": mutants,
        "resultat": "PASS" if not echecs else "FAIL",
    }
    RAPPORT.write_text(json.dumps(rapport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for entree in analyse["nonPortees"]:
        print(f"non portée ({entree['couverture']}) — {entree['page']} : {entree['affirmation']}\n    page : {entree['phrase']}")
    for entree in analyse["sansSource"]:
        print(f"sans source — {entree['page']} : {entree['affirmation']}")
    for entree in analyse["promessesNonEnregistrees"]:
        print(f"promesse non enregistrée ({entree['genre']}) — {entree['page']} : {entree['phrase']}")
    for mutant in mutants:
        print(f"mutant {'attrapé' if mutant['attrape'] else 'NON ATTRAPÉ'} : {mutant['mutant']}")
    print(f"{len(analyse['portees'])}/{len(claims)} affirmations portées sur {len(textes)} pages — {rapport['resultat']}")
    return 0 if rapport["resultat"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(principal())
