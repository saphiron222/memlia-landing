# Recherche et proposition tarifaire Memlia

Chantier du 15 octobre 2026, branche `site/agents-robots-integrations`. Suite à la demande de Kevin : distinguer prix des robots et consommation des agents, vérifier Outils-EC et Factory 456, puis choisir un modèle adapté au service Memlia. **Aucun tarif de cette recherche n’a été publié sur le site.**

**Lire d’abord [la grille recalculée par agent](./agents-individuels/GRILLE.md)**, puis [son économie](./agents-individuels/ECONOMIE.md). Kevin précise que **1 000 € + 300 € étaient un ancien modèle à adapter, pas des montants à reprendre**. La proposition active recalcule donc le socle à 199 € HT/mois, les douze agents de 149 à 399 € et un quota propre à chacun, avec un compteur commun et des suppléments plafonnés. Tous ces nouveaux prix et quotas sont proposés, pas validés ni publiés. La partie robots de [RECOMMANDATION.md](./RECOMMANDATION.md) reste inchangée.

**Historique du 15/10/2026 :** Kevin accepte d’abord le modèle proposé, puis demande une grille agents complète et impose Mammouth ; faute de clé disponible, il confirme un chiffrage sur les prix publics. La [grille historique](./mammouth/GRILLE-AGENTS.md) et son classeur conservent huit exemples de travaux et les coûts étudiés. Il refuse ensuite cette complexité commerciale. La phase `offre-simple` a repris à tort les niveaux de l’ancien tarif ; sa [nouvelle demande](./agents-individuels/PLAN.md) corrige cette lecture et exige de recalculer chaque agent. Aucun prix de ces phases n’a été ajouté au site public.

| Document | Contenu |
|---|---|
| [agents-individuels/GRILLE.md](./agents-individuels/GRILLE.md) | Proposition actuelle : socle, douze prix et douze quotas, exemples, suppléments et installation |
| [agents-individuels/ECONOMIE.md](./agents-individuels/ECONOMIE.md) | Cinq socles comparés, coûts par agent et 4 095 combinaisons, sensibilités |
| `agents-individuels/offre.json`, `calcul.mjs`, `calculs.json` | Source du nouveau modèle, calcul reproductible et résultats |
| [offre-simple/OFFRE.md](./offre-simple/OFFRE.md) | Phase historique remplacée : reprise non souhaitée des anciens montants |
| [CONCURRENTS.md](./CONCURRENTS.md) | Outils-EC, Factory 456, Xpert-iA ; prix, conditions, manipulations et limites |
| [MODELES-2026.md](./MODELES-2026.md) | Modèles IA actuels, sources primaires et absence de preuve de consentement à payer français |
| [ECONOMIE-OFFRE.md](./ECONOMIE-OFFRE.md) | Marges, support, mise en service, consommation et variantes |
| [calculs-verifies.json](./calculs-verifies.json) | Frontières, progression, sensibilités et nature hypothétique des données |
| [grille-proposee.csv](./grille-proposee.csv) | Exemples de prix annuels proposés, réutilisables dans un tableur |
| `raw/` | Captures, HTML publics, moteur public et relevés concurrents ; usage documentaire interne |
| `preuves/modeles-2026/` | Réponses HTTP compressées, manifeste et empreintes ; échecs d’accès explicitement conservés |

Les 600/1 200/1 800 € sont un repère concurrent actuel ; le prix progressif intermédiaire est notre proposition. Les 99 €/mois appartiennent à la première étude agents ; les 1 000 € + 300 € étaient un historique communiqué par Kevin et non une contrainte tarifaire. Le 7 €/h Factory est une communication officielle liée à 2025, sans conditions contractuelles publiques suffisantes pour en faire une offre actuelle équivalente. Aucun de ces nombres ne constitue un prix optimal mesuré.

Les HTML, scripts, textes et en-têtes bruts sont compressés en `.gz` afin de préserver leurs octets originaux, y compris espaces et fins de ligne HTTP, sans les confondre avec du code du site. Les empreintes et tailles portent sur le contenu décompressé lorsque le manifeste l’indique. Les captures et JSON restent lisibles directement. Aucun script concurrent n’est importé par le site.

La simplification des outils gratuits et le comportement de défilement continuent dans [le plan UX](../../qa/outils-simples-2026-10-15/PLAN.md). La recherche tarifaire précède le choix des hypothèses commerciales du simulateur ; elle ne modifie ni les moteurs de collecte, ni un espace client, ni une facturation réelle.
