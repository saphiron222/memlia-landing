"""Extrait le contrat de la release Ressources depuis les manifestes publies.

Le plan site v2 ne doit jamais inventer les routes ni les titres du Hub et du
Glossaire : il les reprend de la source de verite. Ce script les extrait et
scelle l empreinte des deux manifestes, pour que validate-plan.py detecte toute
divergence entre le plan et ce qui est reellement en ligne.
"""
import hashlib, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
OUT = pathlib.Path(__file__).with_name("resources-release-contract.json")
SURFACES = {"hub": "/ressources", "glossaire": "/glossaire"}

def main() -> int:
    manifests, routes = {}, {}
    for nom, route in SURFACES.items():
        p = ROOT / "editorial" / "resources" / nom / "manifest.json"
        if not p.is_file():
            print(f"[contrat] manifeste absent : {p}", file=sys.stderr)
            return 1
        raw = p.read_bytes()
        m = json.loads(raw)
        manifests[nom] = {
            "path": str(p.relative_to(ROOT)),
            "sha256": hashlib.sha256(raw).hexdigest(),
            "formatAdapter": m.get("formatAdapter"),
            "editorialStatus": m.get("candidate", {}).get("editorialStatus"),
        }
        routes[route] = {
            "surface": nom,
            "title": m.get("candidate", {}).get("title"),
            "summary": m.get("candidate", {}).get("summary"),
            "businessReviewStatus": m.get("claimsEvidence", {}).get("sensitiveMatter", {}).get("businessReview", {}).get("status"),
        }
    OUT.write_text(json.dumps({
        "sourceCommit": "103e23d",
        "releaseTask": "t_4cd25435",
        "releaseStatus": "DONE",
        "publishedAt": "2026-09-16",
        "productionUrls": [f"https://memlia.fr{r}" for r in SURFACES.values()],
        "manifests": manifests,
        "routes": routes,
        "rule": "Le plan reprend ces routes et ces titres tels quels. Il ne cree ni doublon ni taxonomie concurrente.",
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[contrat] {len(routes)} routes extraites, {len(manifests)} manifestes scelles")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
