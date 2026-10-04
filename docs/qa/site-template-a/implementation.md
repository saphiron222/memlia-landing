# Lot A — gabarits et parcours

## Résultat

- `OutilZone` donne une cible unique `#outil-calcul` au CTA existant. Formulaires, conventions, calculs et routes inchangés.
- `ProofMedia` garde lazy par défaut ; `OutilHero` demande explicitement eager / priorité haute. Aucun cadre HTML ni média scellé retouché.
- La liste mobile revient à la ligne sans défilement horizontal. À 320 px : Tâches, Méthode, Contrôle humain puis Questions ; cibles de 44 px au moins, aucune réduction de police, aucun burger substitué. Aucun masquage de débordement ajouté.
- `Base` n'invente plus de dates. Les dates explicites des collections, des guides et des pages avec attribution éditoriale restent conservées. Son repli est désormais un WebPage typé. Le contrat universel n'exige plus de dates pour une page générique ; il les exige toujours pour les articles et les tests E-E-A-T vérifient les dates visibles.
- CSP et robots restent inchangés : le défaut Lighthouse robots était une violation CSP du contexte de mesure, pas une syntaxe invalide.

## Preuves

Rouge sur la base : Questions dépassait le viewport 320 (bord droit mesuré 372,64), image hero lazy, cible CTA absente (0 au lieu de 1), date de repli 2026-09-20 ; nouveau test de contrat sans provenance rouge.

Vert sur le candidat :

- Astro check : 0 erreur.
- Build complet : PASS, 118 tests Python et 546 tests scripts.
- Suite navigateur complète : 198 PASS ; 7 nouveaux contrats couvrent les quatre outils sur 320/375/768/1024/1440/1920, le clic CTA, le clavier, les métadonnées, le noindex légal et le maintien lazy sous la ligne de flottaison.
- Captures réelles 320/375/1440 et mesures : `execution.json`, `marge-*.png`.
- Le test historique qui exigeait le défilement horizontal a été remplacé par le contrat de deux lignes sans scroll ; les tests de hitbox vérifient maintenant les liens sans les faire défiler avant mesure.

Les 28 dates du registre sitemap sont mises à jour parce que le chrome rendu a réellement changé ; elles restent distinctes des dates éditoriales JSON-LD. Le rendu du glossaire est reconstruit deux fois et ses reçus suivent ; affirmations, sources et verdicts métier sont comparés à main et inchangés. Aucune nouvelle revue métier requise.

## Coordination et livraison

Base finale : origin/main c4a399c8, intégrant PR52 (oracle cache Paris). PR51 est encore ouverte ; `Outil.astro` n'est pas touché. Le test nouveau parcourt OUTILS_DISPONIBLES : il inclura le générateur après intégration. Les registres lastmod et les reçus du glossaire sont les seuls points de collision potentiels avec PR51 ; les recalculer après intégration, ne pas recopier des sorties anciennes.

Revue QA unique demandée sur cette carte, conformément au lot A. Après PASS et Repository gates SUCCESS, QA fusionne puis constate Cloudflare et memlia.fr sans query string. Rejouer `template-a.spec.ts` sur le déploiement ; sur le domaine, les erreurs beacon préexistantes appartiennent au lot plateforme et ne justifient aucune ouverture de connect-src.

URLs à contrôler : accueil, /contact, /mentions-legales, /methode, /outils-comptables-gratuits et les quatre routes de calcul présentes dans le registre. Transmettre URL de déploiement, URLs publiques et résultats à t_2caf75a7. Aucune production déclarée vérifiée par cette implémentation.
