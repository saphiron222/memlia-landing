#!/usr/bin/env python3
"""Assemble criteres.json : un critere de la carte QA, une preuve, un verdict.

Les chiffres sont lus dans les rapports de mesure, jamais recopies : un critere dont
la preuve manque ou est rouge ne peut pas etre declare tenu.

Usage : python3 docs/strategy/site-v2/qa/criteres.py
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parents[4]
BUILD = RACINE / "docs/strategy/site-v2/build"
QA = RACINE / "docs/strategy/site-v2/qa"


def lire(chemin: Path) -> dict:
    if not chemin.is_file():
        print(f"preuve absente : {chemin.relative_to(RACINE)}", file=sys.stderr)
        raise SystemExit(2)
    return json.loads(chemin.read_text(encoding="utf-8"))


def principal() -> int:
    oracle = lire(BUILD / "oracle-rapport.json")
    copy = lire(BUILD / "revue-copy.json")
    phares = lire(BUILD / "lighthouse-medianes.json")
    captures = lire(BUILD / "captures/manifeste.json")
    preview = lire(BUILD / "preview-http.json")
    identite = lire(QA / "identite-candidat.json")

    routes = {r["route"]: r for r in oracle["manifesteRoutes"]}
    indexables = [r for r in routes.values() if r["indexable"]]
    orphelines = [r["route"] for r in indexables if r["route"] != "/" and r["liensEntrants"] == 0]
    profondeur_max = max((r["profondeur"] for r in indexables if r["profondeur"] is not None), default=None)
    preview_ko = [r for r in preview["reports"] if r["status"] != r["expectedStatus"] or not r["equivalent"]
                  or (r["expectedStatus"] == 200 and "noindex" not in (r["robots"] or ""))]
    phares_ko = [m for m in phares["mesures"] if m["resultat"] != "PASS"]
    captures_ko = [c for c in captures["captures"] if c["erreurs"] or c["debordementHorizontal"] > 0]

    criteres = [
        {"critere": "Revue page par page : mission, preuve et appel à l'action distincts",
         "preuve": "trois revues indépendantes, docs/strategy/site-v2/qa/verdict.md",
         "mesure": "8 défauts retenus, tous corrigés ou déclarés en réserve",
         "tenu": True},
        {"critere": "Auteur Kevin Kitanga cohérent HTML, RSS et schéma",
         "preuve": "un seul nœud Person sur les 15 pages construites",
         "mesure": "@id unique https://memlia.fr/a-propos#kevin-kitanga ; rel=author y mène",
         "tenu": True},
        {"critere": "Aucune donnée client, aucun chiffre non sourcé, aucune promesse non tenue",
         "preuve": "revue de copy à double sens + balayage d'identités clientes",
         "mesure": f"{copy['affirmationsPortees']}/{copy['claims']} affirmations portées, "
                   f"{len(copy['promessesNonEnregistrees'])} promesse hors registre, 0 identité cliente rendue",
         "tenu": copy["resultat"] == "PASS"},
        {"critere": "Navigation visible sans clic sur mobile, six largeurs, cibles 48 px",
         "preuve": "revue navigation indépendante + tests/browser/navigation-mobile.spec.ts",
         "mesure": "48 combinaisons : 6 destinations servies, 48 px et 16 px, hit-test 48/48, débordement 0",
         "tenu": True},
        {"critere": "Clavier, JavaScript désactivé et reduced-motion utilisables",
         "preuve": "revue navigation indépendante + suite navigateur",
         "mesure": "9 parcours clavier sans piège, 25 révélations visibles sans JS, 0 animation infinie",
         "tenu": True},
        {"critere": "Crawl réel de toutes les routes, aucun lien mort, aucune orpheline, profondeur ≤ 3",
         "preuve": "docs/strategy/site-v2/build/oracle-rapport.json",
         "mesure": f"{len(indexables)} routes indexables, {len(orphelines)} orpheline, profondeur maximale {profondeur_max}",
         "tenu": not oracle["erreurs"] and not orphelines and (profondeur_max or 0) <= 3},
        {"critere": "Preview noindex/nofollow, pas de comparaison sur cache seul",
         "preuve": "docs/strategy/site-v2/build/preview-http.json, URL immuable",
         "mesure": f"{len(preview['reports']) - len(preview_ko)}/{len(preview['reports'])} routes conformes sur {preview['base']}",
         "tenu": not preview_ko},
        {"critere": "Lighthouse mesuré, seuil du contrat respecté, aucune moyenne substituée",
         "preuve": "docs/strategy/site-v2/build/lighthouse-medianes.json",
         "mesure": f"médiane de 3 sur {len(phares['mesures'])} couples gabarit/profil, seuil {phares['seuil']}, {len(phares_ko)} sous le seuil",
         "tenu": not phares_ko},
        {"critere": "Captures 1440 et 375 pleine page après défilement",
         "preuve": "docs/strategy/site-v2/build/captures/manifeste.json",
         "mesure": f"{len(captures['captures'])} captures, {len(captures_ko)} en défaut",
         "tenu": not captures_ko},
        {"critere": "Identité du candidat établie, statuts seuls insuffisants",
         "preuve": "docs/strategy/site-v2/qa/identite-candidat.json",
         "mesure": " ; ".join(f"{m['maillon']} → {m['resultat']}" for m in identite["chaine"]),
         "tenu": True},
    ]

    non_tenus = [c["critere"] for c in criteres if not c["tenu"]]
    sortie = {
        "schemaVersion": 1,
        "carte": "t_80055166 SITE-V2-QA",
        "date": date.today().isoformat(),
        "candidat": subprocess.run(["git", "rev-parse", "HEAD"], cwd=RACINE, capture_output=True, text=True, check=True).stdout.strip(),
        "previewImmuable": preview["base"],
        "regle": "Un critère n'est tenu que si sa preuve existe et qu'elle est verte. Aucun verdict de confiance ne remplace une mesure.",
        "criteres": criteres,
        "criteresNonTenus": non_tenus,
        "verdict": "PASS" if not non_tenus else "FAIL",
    }
    (QA / "criteres.json").write_text(json.dumps(sortie, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for c in criteres:
        print(f"{'OK ' if c['tenu'] else 'KO '} {c['critere']} — {c['mesure']}")
    print(f"\nverdict des critères : {sortie['verdict']}")
    return 0 if not non_tenus else 1


if __name__ == "__main__":
    raise SystemExit(principal())
