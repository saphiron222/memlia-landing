# Recherche et proposition tarifaire Memlia

Chantier du 15 octobre 2026, branche `site/agents-robots-integrations`. Suite à la demande de Kevin : distinguer prix des robots et consommation des agents, vérifier Outils-EC et Factory 456, puis choisir un modèle adapté au service Memlia. **Aucun tarif de cette recherche n’a été publié sur le site.**

Lire d’abord [RECOMMANDATION.md](./RECOMMANDATION.md) : offre proposée, grille robots, agents, coûts manquants, conséquences pour le simulateur et étapes avant publication.

| Document | Contenu |
|---|---|
| [CONCURRENTS.md](./CONCURRENTS.md) | Outils-EC, Factory 456, Xpert-iA ; prix, conditions, manipulations et limites |
| [MODELES-2026.md](./MODELES-2026.md) | Modèles IA actuels, sources primaires et absence de preuve de consentement à payer français |
| [ECONOMIE-OFFRE.md](./ECONOMIE-OFFRE.md) | Marges, support, mise en service, consommation et variantes |
| [calculs-verifies.json](./calculs-verifies.json) | Frontières, progression, sensibilités et nature hypothétique des données |
| [grille-proposee.csv](./grille-proposee.csv) | Exemples de prix annuels proposés, réutilisables dans un tableur |
| `raw/` | Captures, HTML publics, moteur public et relevés concurrents ; usage documentaire interne |
| `preuves/modeles-2026/` | Réponses HTTP compressées, manifeste et empreintes ; échecs d’accès explicitement conservés |

Les 600/1 200/1 800 € sont un repère concurrent actuel ; le prix progressif intermédiaire est notre proposition. Les 99 €/mois sont un montant candidat Memlia. Le 7 €/h Factory est une communication officielle liée à 2025, sans conditions contractuelles publiques suffisantes pour en faire une offre actuelle équivalente. Aucun de ces nombres ne constitue un prix optimal mesuré.

Les HTML, scripts, textes et en-têtes bruts sont compressés en `.gz` afin de préserver leurs octets originaux, y compris espaces et fins de ligne HTTP, sans les confondre avec du code du site. Les empreintes et tailles portent sur le contenu décompressé lorsque le manifeste l’indique. Les captures et JSON restent lisibles directement. Aucun script concurrent n’est importé par le site.

La simplification des outils gratuits et le comportement de défilement continuent dans [le plan UX](../../qa/outils-simples-2026-10-15/PLAN.md). La recherche tarifaire précède le choix des hypothèses commerciales du simulateur ; elle ne modifie ni les moteurs de collecte, ni un espace client, ni une facturation réelle.
