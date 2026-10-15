# Mémoire collective et modèle IA privé — plan d’implémentation

> Exécution native dans ce worktree, puis revue indépendante. Les décisions réversibles sont autorisées par Kevin ; aucune validation intermédiaire ni déploiement en production.

**Objectif.** Livrer deux pages commerciales complètes dans la direction Memlia validée : Memlia OS pour les cabinets comptables, modèle IA privé pour les entreprises.

**Base.** 392268488f0fdeb07f18f23a9ca7d7b05bcf0757, version robots/agents/outils vérifiée. Le checkout précédent et sa PR sont préservés.

**Stack.** Astro et composants/tokens existants. Scènes originales ; bureau collectif à étapes manuelles et animation automatique du modèle privé, avec lecture stable au survol/focus et sélection manuelle, sans appels à une IA.

## 1. Recherche et cadrage
- [x] Sauvegarder et segmenter les 63,865 s de vidéo en environ 256 images ; planches de comparaison et relevé des séquences.
- [x] Étudier ReStructure et ASHR : pages, déroulé, mécanismes et limites observables. Profils datés et références brutes.
- [x] Comparer Mac mini, NVIDIA et infrastructure dédiée sur sources officielles ; distinguer mémoire documentaire, orchestration, adaptation de modèles et inférence.
- [x] Définir droits, données, provenance, budget, évaluation, maintenance, propriété/licence et périmètre de chaque offre.

## 2. Contenu et direction visuelle
- [x] Fixer routes, intentions et maillage ; étendre charte et contexte à la demande du 16/10.
- [x] Écrire puis réviser les deux pages ; offre, résultats remis, fonctionnement, objections et CTA.
- [x] Intégrer le bureau collectif validé, sans figurine conformément au dernier arbitrage de Kevin et la boucle du modèle privé avec exemples fictifs. Les deux vues matérielles initiales ont été rejetées par Kevin et archivées hors dépôt.

## 3. Réalisation
- [x] Source de données typée des deux offres ; composants de page communs et scènes spécialisées séparées.
- [x] Page OS : bureau collectif, sources/outils, mémoire, règles, savoir-faire, agents, sessions, validations et traces.
- [x] Page modèle privé : données qualifiées, recette, expérimentation budgétée, entraînement, évaluation, publication, chat d’illustration et maintenance.
- [x] Navigation, contact facultatif, SEO, images sociales, sitemap et exports LLM selon le pipeline existant.

## 4. Recette et livraison
- [x] Cas d’accès refusé/source contradictoire, aucune promesse de stockage ou propriété non définie.
- [x] Tests ciblés : données/routes, étapes manuelles, boucle automatique/sélection, clavier, sans JS, mouvement réduit, mobile/grand écran, réseau et contact.
- [x] Inspection visuelle réelle, performances et revue indépendante.
- [ ] Régénération autorisée, CI complète sur commit exact et prévisualisation noindex. Pas de fusion automatique.

## Fichiers et responsabilités
La recherche vit dans `docs/strategy/memoire-modeles-2026-10-16/`, les sources lourdes hors dépôt dans `memlia-landing-sources/memoire-modeles/2026-10-16/`. Routes : /memoire-collective-cabinet-comptable et /modele-ia-prive-entreprise. Source typée src/data/solutions.ts, gabarit PageSolution, scènes SceneOS et SceneModele, styles partagés solutions.css. Chaque scène conserve sa responsabilité.

## Points de revue
Confusion RAG/entraînement ; attribution des droits de la base et des poids adaptés ; sorties réseau selon le modèle choisi ; séparation des dossiers et permissions ; illusion d’un produit en direct ; animation incontrôlable ou scroll capturé ; concurrence SEO avec les agents et les intégrations.


## Recette avant CI
4tests scripts et9tests navigateur PASS ;97HTML au contrat de page,89exports Markdown ; Lighthouse mobile99/100/100/100 pour les deux offres. Revues indépendantes copie et code PASS, tableau clavier corrigé. Dernière décision : aucun emblème/figurine, bureau collectif avec pictogramme. Détails dans docs/qa/memoire-modeles/RECETTE.md. La livraison attend le verdict de CI sur le SHA exact et sa prévisualisation noindex ; aucune fusion automatique.

## Dernier ajustement demandé
- [x] Nos services : quatre offres ; Intégrations en lien direct ; footer identique.
- [x] Huit familles de modèles à poids accessibles, logos officiels optimisés et sources archivées. Licences et choix documentés par version.
- [x] Rejouer les tests ciblés de navigation et modèles, inspection réelle, revue du delta : 12 tests scripts et 86 tests navigateur PASS, sans test ignoré.
- [ ] CI sur le nouveau SHA puis prévisualisation de son artefact. Le premier lancement CI a été annulé pour intégrer cette demande.

## Présentation finale
Notes didactiques répétées retirées des pages de service et des blocs de démonstration. Huit modèles, GLM et Kimi sans nom d’éditeur dans leur carte ; gpt oss avec logo OpenAI noir sur blanc et nom à côté. L’animation démarre automatiquement, sans bouton de pause : 2400ms par étape, 9,6s par cycle ; vrai Lockup Memlia en haut à gauche. Survol/focus et sélection permettent de lire ; mouvement réduit respecté.
