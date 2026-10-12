"""Classement de faits fournis, fictif et sans connexion ni calcul fiscal."""
import json
from collections import Counter
from pathlib import Path

BASE = dict(qualifie=True, date_confirmee=True, pieces=True, transmis=False,
            retour=None, paiement=None, periode_retour_ok=True, doublon=False)
SPECS = [
    ("F-01", dict(date_confirmee=False), "À qualifier"),
    ("F-02", dict(pieces=False), "Pièces attendues"),
    ("F-03", {}, "Préparation prête"),
    ("F-04", dict(transmis=True), "Retour attendu"),
    ("F-05", dict(transmis=True, retour="rejete"), "Rejet à reprendre"),
    ("F-06", dict(transmis=True, retour="accepte"), "Dépôt confirmé, paiement à vérifier"),
    ("F-07", dict(transmis=True, retour="accepte", paiement="confirme"), "Éléments confirmés"),
    ("F-08", dict(retour="accepte"), "Incohérence à qualifier"),
    ("F-09", dict(transmis=True, retour="inconnu"), "Retour non reconnu"),
    ("F-10", dict(qualifie=False), "À qualifier"),
    ("F-11", dict(doublon=True), "Doublon à qualifier"),
    ("F-12", dict(transmis=True, retour="accepte", periode_retour_ok=False), "Période à qualifier"),
]
GROUPS = {
    "Pièces attendues": "Préparation", "Préparation prête": "Préparation",
    "Retour attendu": "Retour ou paiement attendu",
    "Dépôt confirmé, paiement à vérifier": "Retour ou paiement attendu",
    "Éléments confirmés": "Éléments confirmés",
}

def classer(c):
    if c["doublon"]:
        return "Doublon à qualifier"
    if not c["periode_retour_ok"]:
        return "Période à qualifier"
    if not c["transmis"] and c["retour"] is not None:
        return "Incohérence à qualifier"
    if c["retour"] not in (None, "accepte", "rejete"):
        return "Retour non reconnu"
    if c["retour"] == "rejete":
        return "Rejet à reprendre"
    if not c["qualifie"] or not c["date_confirmee"]:
        return "À qualifier"
    if not c["pieces"]:
        return "Pièces attendues"
    if not c["transmis"]:
        return "Préparation prête"
    if c["retour"] is None:
        return "Retour attendu"
    if c["paiement"] != "confirme":
        return "Dépôt confirmé, paiement à vérifier"
    return "Éléments confirmés"


def rejouer():
    rows = []
    for i, (id_, overrides, expected) in enumerate(SPECS, 1):
        entree = BASE | overrides
        # F-11 est la copie de F-03 ; elle est isolée, pas une nouvelle obligation.
        key = "D-003|TVA|2026-09" if id_ == "F-11" else f"D-{i:03}|TVA|2026-09"
        actual = classer(entree)
        assert actual == expected, (id_, expected, actual)
        rows.append(dict(id=id_, cle=key, entree=entree, attendu=expected, obtenu=actual,
                         file=GROUPS.get(actual, "À qualifier ou reprendre")))
    totals = dict(Counter(r["file"] for r in rows))
    assert sum(totals.values()) == len(rows)
    assert len(set(r["cle"] for r in rows)) == 11
    return dict(nature="Simulation locale déterministe sur données fictives fournies",
                limite="Aucun compte fiscal, aucun calcul d'obligation, aucun dépôt ou paiement",
                lignes=12, cles_uniques=11, doublons_isoles=1, agrege=totals, cas=rows)

if __name__ == "__main__":
    result = rejouer()
    Path(__file__).with_name("rejeu.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({k: v for k, v in result.items() if k != "cas"}, ensure_ascii=False, indent=2))
