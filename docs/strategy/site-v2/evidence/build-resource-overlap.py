"""Compare le plan site v2 au corpus Ressources deja publie.

L interdit « ne pas creer de doublon du Hub ni du Glossaire » etait une consigne
humaine, donc invérifiable. Ce script la rend reproductible : il extrait les
slugs, les titres et les termes des deux manifestes publies, les confronte aux
pages et aux sujets du plan, et distingue trois cas.

  duplicate_slug  une page du plan reprend une route deja publiee   -> echec
  duplicate_term  un sujet du plan reprend un terme du Glossaire     -> echec
  overlapping_intent  une intention se recoupe sans etre identique   -> decision exigee
"""
import hashlib, json, pathlib, re, sys, unicodedata

ROOT = pathlib.Path(__file__).resolve().parents[4]
PLAN = pathlib.Path(__file__).resolve().parents[1]
OUT = pathlib.Path(__file__).with_name("resource-overlap.json")

def cle(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def main() -> int:
    publie_slugs, publie_termes = set(), {}
    for nom in ("hub", "glossaire"):
        m = json.loads((ROOT / "editorial" / "resources" / nom / "manifest.json").read_bytes())
        for u in m.get("claimsEvidence", {}).get("renderedUnitInventory", []):
            titre = u.get("title") or u.get("label") or u.get("text", "")[:80]
            if titre:
                publie_termes[cle(titre)] = {"surface": nom, "titre": titre}
        publie_slugs.add(cle(m.get("candidate", {}).get("slug") or nom))
    contrat = json.loads((PLAN / "evidence" / "resources-release-contract.json").read_bytes())
    routes_publiees = {cle(r) for r in contrat["routes"]}

    inv = json.loads((PLAN / "page-inventory.json").read_bytes())
    pages = inv if isinstance(inv, list) else inv.get("pages", [])
    dup_slug, dup_terme, overlap = [], [], []
    for p in pages:
        url = p.get("url") or p.get("path") or ""
        titre = p.get("title") or p.get("titre") or ""
        k = cle(url)
        if k in routes_publiees and not p.get("ownedByResourceChain"):
            dup_slug.append({"url": url, "raison": "route deja publiee par la chaine Ressources"})
        t = cle(titre)
        if t and t in publie_termes:
            dup_terme.append({"url": url, "titre": titre, "publie": publie_termes[t]})
        # Un mot nu sur-declare massivement : « memlia » apparait partout, et un
        # recouvrement sur la marque ne dit rien. On exige au moins deux mots de
        # fond communs, hors marque et hors vocabulaire structurel du site.
        BANALS = {"memlia", "cabinet", "comptable", "automatisation", "methode",
                  "controle", "controles", "donnees", "service", "processus"}
        mots_page = {w for w in cle(titre).split("-") if len(w) > 4} - BANALS
        for kt, v in publie_termes.items():
            if t == kt:
                continue
            communs = mots_page & ({w for w in kt.split("-") if len(w) > 4} - BANALS)
            if len(communs) >= 2:
                overlap.append({"url": url, "terme_publie": v["titre"], "mots": sorted(communs)})
    vus = set(); ov = []
    for o in overlap:
        s = (o["url"], o["terme_publie"])
        if s not in vus: vus.add(s); ov.append(o)
    rapport = {
        "genereLe": "2026-09-16",
        "corpusPublie": {"routes": sorted(routes_publiees), "termes": len(publie_termes)},
        "pagesDuPlan": len(pages),
        "duplicate_slug": dup_slug,
        "duplicate_term": dup_terme,
        "overlapping_intent": ov,
        "regle": "duplicate_slug et duplicate_term font echouer le controle. overlapping_intent exige une decision ecrite : enrichir l existant, ou creer avec une preuve distincte.",
        "contratSha256": hashlib.sha256((PLAN / "evidence" / "resources-release-contract.json").read_bytes()).hexdigest(),
    }
    OUT.write_text(json.dumps(rapport, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[recouvrement] {len(pages)} pages du plan contre {len(publie_termes)} termes publies")
    print(f"  duplicate_slug={len(dup_slug)} duplicate_term={len(dup_terme)} overlapping_intent={len(ov)}")
    return 1 if dup_slug or dup_terme else 0

if __name__ == "__main__":
    raise SystemExit(main())
