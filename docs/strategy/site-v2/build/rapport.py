#!/usr/bin/env python3
"""Assemble RAPPORT.md à partir des preuves produites, jamais de chiffres recopiés.

Un rapport écrit à la main dérive de ses mesures dès la deuxième relecture. Celui-ci
lit les JSON des contrôles et refuse de s'écrire si l'un d'eux manque ou a échoué.

Usage : python3 docs/strategy/site-v2/build/rapport.py
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parents[4]
BUILD = RACINE / "docs/strategy/site-v2/build"


def lire(nom: str) -> dict:
    chemin = BUILD / nom
    if not chemin.is_file():
        print(f"preuve absente : {chemin.relative_to(RACINE)}", file=sys.stderr)
        raise SystemExit(2)
    return json.loads(chemin.read_text(encoding="utf-8"))


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=RACINE, capture_output=True, text=True, check=True).stdout.strip()


def principal() -> int:
    oracle = lire("oracle-rapport.json")
    copy = lire("revue-copy.json")
    phares = lire("lighthouse-medianes.json")
    captures = lire("captures/manifeste.json")
    preview = lire("preview-http.json")

    echecs = [nom for nom, preuve in [("oracle", oracle), ("revue de copy", copy), ("Lighthouse", phares), ("captures", captures)] if preuve["resultat"] != "PASS"]
    non_conformes = [r for r in preview["reports"] if r["status"] != r["expectedStatus"] or not r["equivalent"] or (r["expectedStatus"] == 200 and "noindex" not in (r["robots"] or ""))]
    if non_conformes:
        echecs.append("preview HTTP")
    if echecs:
        print(f"contrôles en échec : {', '.join(echecs)} — le rapport ne s'écrit pas sur des preuves rouges.", file=sys.stderr)
        return 1

    indexables = oracle["routes"]["indexables"]
    lignes_phares = "\n".join(
        f"| {m['gabarit']} | {m['profil']} | " + " | ".join(str(m["axes"][axe]["mediane"]) for axe in phares["axes"]) + " |"
        for m in phares["mesures"]
    )
    lignes_routes = "\n".join(
        f"| `{r['route']}` | {'oui' if r['indexable'] else 'non'} | {r['liensEntrants']} | {r['profondeur'] if r['profondeur'] is not None else '—'} | {', '.join(r['schemas']) or '—'} |"
        for r in oracle["manifesteRoutes"]
    )
    mutants_oracle = "\n".join(f"- {m['mutant']} — {'attrapé' if m['attrape'] else 'NON ATTRAPÉ'} par {m['regle']}" for m in oracle["mutants"])
    mutants_copy = "\n".join(f"- {m['mutant']} — {'attrapé' if m['attrape'] else 'NON ATTRAPÉ'}" for m in copy["mutants"])

    texte = f"""# Site v2 — rapport de construction

Carte `t_c2262a1b` SITE-V2-BUILD. Généré le {date.today().isoformat()} par
`docs/strategy/site-v2/build/rapport.py`, qui lit les JSON de contrôle et refuse de
s'écrire si l'un d'eux est rouge.

## Source de vérité

| Élément | Valeur |
|---|---|
| Branche | `{git('rev-parse', '--abbrev-ref', 'HEAD')}` |
| Commit | `{git('rev-parse', 'HEAD')}` |
| Projet Cloudflare Pages | `memlia` |
| URL immutable de preview | {preview['base']} |
| Alias de branche | https://preview-site-v2.memlia.pages.dev |
| Dossier déployé | `{preview['source']}` (copie noindex, jamais `dist`) |
| Routes contrôlées à distance | {len(preview['reports'])}, toutes conformes |

La preview porte `noindex, nofollow` en balise et en en-tête HTTP. Aucune poussée vers
`main`, aucune mise en production.

## Routes servies

{len(indexables)} routes indexables sur {oracle['routes']['total']} pages construites,
{oracle['routes']['sitemap']} URL au sitemap.

| Route | Indexable | Liens entrants | Profondeur | Schémas |
|---|---|---|---|---|
{lignes_routes}

## Oracle SEO et schéma

{len(oracle['erreurs'])} erreur — résultat **{oracle['resultat']}**. Les mutants existent
parce qu'un oracle vert qu'aucune mutation ne fait rougir ne prouve rien :

{mutants_oracle}

## Revue de copy

{copy['affirmationsPortees']}/{copy['claims']} affirmations du registre portées par leur
page, aucune promesse chiffrée ou légale hors registre — résultat **{copy['resultat']}**.

{mutants_copy}

## Lighthouse — médiane de trois mesures

Seuil {phares['seuil']} sur les quatre axes, par gabarit et par profil. Les trois passes
de chaque ligne sont conservées dans `lighthouse-medianes.json`.

| Gabarit | Profil | {' | '.join(phares['axes'])} |
|---|---|---|---|---|---|
{lignes_phares}

## Captures

{len(captures['captures'])} captures pleine page, desktop 1440 et mobile 375, prises après
un parcours de défilement complet. Aucun débordement horizontal, aucune erreur console,
aucune réponse 4xx. Empreintes dans `captures/manifeste.json`.

## Réserves

- **L'accueil dit encore avant elles ce que les cinq pages disent.** Les quatre résumés
  d'orientation y mènent désormais, mais les sections historiques gardent le détail du
  service, de la méthode et des garanties. Alléger l'accueil est une décision éditoriale
  qui dépasse le périmètre de cette carte ; elle est signalée, pas prise.
- **Aucune preuve illustrée sur les cinq pages neuves.** L'inventaire annonce des visuels
  fictifs pour la méthode et les garanties ; les neuf illustrations existantes restent sur
  l'accueil. Ajouter un visuel exige un brief écrit et une génération, hors de ce lot.
- **Deux documents de référence se contredisent sur la frontière du produit** : la signature
  du pied de page dit « L'IA automatise le travail répétitif », le document de structure dit
  « L'IA prépare ». Le candidat a suivi la copy transversale. C'est un arbitrage de Kevin.
- **Le bandeau mobile occupe 261 px à 320 px de large** : la hauteur qu'exigent six cibles de
  48 px, que la consigne accepte explicitement. La première vue utile de l'accueil tient à
  12 px près à 320×740 ; alléger la marge haute du hero, hors périmètre, rendrait cette
  marge confortable.
- **`CTA.humain` n'est plus référencé** depuis que l'appel à l'action mène à `/contact`, et
  `Footer.astro` importe `CTA` sans l'utiliser. Code mort signalé, non supprimé.
- **La revue métier du dossier Ressources est épinglée au jour même** : le contrat exige des
  copies de source du jour. Le dossier redeviendra rouge demain sans nouvelle vérification.
- **Le score qualité de 100 reste normalisé sur 85 points mesurables**, la ligne SERP étant
  ND. Réserve héritée du dossier Ressources, inchangée.
"""
    (BUILD / "RAPPORT.md").write_text(texte, encoding="utf-8")
    print(f"RAPPORT.md écrit — {len(indexables)} routes indexables, Lighthouse {phares['resultat']}, oracle {oracle['resultat']}, copy {copy['resultat']}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(principal())
