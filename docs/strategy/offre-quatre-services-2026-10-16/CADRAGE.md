# Offre Memlia et suite commerciale — décision du 16 octobre 2026

## Demande et périmètre

Kevin autorise la mise à jour des deux accueils puis la publication du site. La suite commerciale locale doit ensuite présenter la même offre : Memlia Support (accueil, R1 et R2 pour EC et CAC), Memlia Scripts (français parlé), et le souffleur relié aux écrans. Les treize inspirations fournies et Twenty guident le design de Support. Support est un support de vente en rendez-vous, pas un SaaS destiné aux prospects.

## Offre commune

1. **21 robots** : une routine précise, un déclencheur, un résultat. Catalogue préconçu, adaptation et mise en service dans les outils du cabinet ; robot sur mesure si nécessaire.
2. **12 agents IA** : les tâches d’un métier préparées avec les règles du cabinet, leurs livrables et les validations. Catalogue préconçu, adaptation ; agent sur mesure si nécessaire.
3. **Memlia OS** : mémoire collective reliée aux personnes, documents, outils et agents, avec sources et accès définis. Reprendre la représentation du bureau collectif validée, sans boîtier ni nouvel emblème.
4. **Modèle IA privé** : préparation et qualification des données autorisées, budget d’essai, adaptation/entraînement, évaluation et publication d’une version acceptée. Distinguer entraînement et mémoire documentaire. Droits selon licence de la base et contrat.

Les intégrations sont transversales. Elles relient les services aux outils existants ; elles ne constituent pas un cinquième service. Le travail débute dans le catalogue, et la construction personnalisée répond à un besoin identifié.

## Conversion et rendez-vous

- **R1** : comprendre le contexte, faire reconnaître une priorité, montrer les prises en charge pertinentes et convenir d’un R2 avec les bonnes personnes. Montrer quelques scénarios liés au besoin plutôt que dérouler 35 fiches.
- **R2** : reprendre ce qui a été dit, proposer une première sélection, décrire entrées, livrables, limites, accès, critères de recette, responsabilités, prix et prochaine décision. L’accord récapitule le périmètre choisi ; il ne vend pas automatiquement tous les services.
- **Scripts** : phrases courtes de français parlé, liaisons naturelles, questions et silences utiles. Les consignes pour Kevin restent distinctes du texte à lire. Aucun tarif ou chiffre cabinet inventé ; les montants variables se lisent à l’écran.
- **Souffleur** : les deux professions, les deux rendez-vous, les étapes et chaque fiche du catalogue restent adressables. Le texte affiché suit le support et les modifications enregistrées dans Scripts.

## Design

Twenty et les images fournies inspirent la densité, les gris chauds, les filets, la typographie sans empattement et la navigation latérale. Le support de rendez-vous conserve des écrans lisibles à distance, une progression et une décision principale par écran. Pas de faux indicateurs clients, factures, abonnements, inbox ou boutons d’administration inspirés d’un SaaS.

Les figurines originales Memlia identifient robots et agents. Memlia OS et le modèle privé reprennent leurs représentations validées ; aucun nouvel emblème n’est imposé. Les interfaces de démonstration utilisent des exemples fictifs, identifiés sobrement. Couleurs, ombres, focus et mouvements sont cohérents avec l’identité Memlia.

## Contraintes

- Skills uniquement depuis `~/.claude`, aucun ancien skill Codex.
- Ne pas réinitialiser les checkouts d’autres sessions. Reprendre le travail non enregistré dans une copie isolée, avec sauvegarde et manifeste.
- Prix conservés : `docs/strategy/pricing-2026-10-15/RECOMMANDATION.md` et `agents-individuels/GRILLE.md`. Socle agents 199 € HT/mois + agents choisis et quotas propres. Le forfait robots couvre neuf routines de référence, pas les 21 robots sans limite. OS, modèle privé et extensions : devis.
- Aucun gain, client, témoignage, partenariat, hébergement ou conformité inventé. Les chiffres généraux éventuels exigent une source officielle datée et un périmètre réellement pertinent ; préférer une observation métier à une statistique décorative.
- Pour le CAC : jugement, procédures et opinion au professionnel ; périmètre, accès et indépendance par mission. Aucun audit complet automatisé promis.
- Ne pas modifier les articles scellés ni les données de vrais rendez-vous. Préserver les connexions Twenty, la sauvegarde locale, les contrats natifs et les textes personnalisés.
- Publication du site par fusion après CI exacte et revue indépendante, puis contrôle en production. Aucun déploiement manuel `--branch main`.

## Sources et lieux

- Site : `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/memoire-modeles-prives`, branche `site/memoire-modeles-prives`, PR 271.
- Support/Scripts : copie isolée `/Users/kevinkitanga/dev/.worktrees/memlia-rdv-offre-2026-10-16`, branche `chantier/offre-quatre-services`.
- Sauvegarde du travail existant et inspirations : `/Users/kevinkitanga/dev/interne/memlia-rdv-donnees/refonte-offre-2026-10-16/`.
- Ligne de message : `.agents/product-marketing.md`, avec les dernières décisions ci-dessus prioritaires. Le site actuel est la référence des catalogues, médias, compatibilités et prix.
