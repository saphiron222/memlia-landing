# Offre quatre services et suite commerciale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publier un site qui présente les quatre services puis livrer Support, R1/R2, Scripts et souffleur cohérents avec cette offre.

**Architecture:** Le site conserve Astro, ses catalogues typés et ses composants. Le support conserve React, le serveur local et ses contrats Twenty/souffleur ; un catalogue commercial structuré transporte les références du site sans dépendance réseau à l’exécution. Les rendez-vous consomment ce catalogue et les textes oraux suivent les identifiants d’écran.

**Tech Stack:** Astro/TypeScript, React 19, Vite, Hono, Zustand, Vitest, Playwright, Swift natif existant.

**Spec:** `docs/strategy/offre-quatre-services-2026-10-16/CADRAGE.md`.

## Global Constraints

- Skills uniquement depuis `~/.claude`, aucun ancien skill Codex.
- 21 robots et 12 agents IA préconçus ; adaptation et sur mesure au besoin ; Memlia OS et modèle IA privé complémentaires.
- Intégrations transversales, aucun cinquième service.
- Support est une présentation commerciale, pas un SaaS prospect.
- Prix validés inchangés ; aucun gain ou engagement inventé ; jugement et opinion au CAC.
- Protéger les modifications existantes, les données locales et les textes personnalisés.
- Site : tests ciblés locaux et régénération des dérivés autorisés ; compilation/suite complète dans la CI exacte ; revue indépendante avant fusion. Publication désormais autorisée par Kevin.

## Review Focus

- Un cabinet vient pour un besoin simple : comprendre le bon premier service sans devoir acheter les quatre.
- Un cabinet CAC : ne reçoit ni discours de tenue comptable ni promesse d’opinion automatisée.
- Un dossier existant ou un script personnalisé : conserve sa saisie et son historique après mise à jour.
- Un écran ou une fiche change : le souffleur reçoit le bon texte, sans position orpheline ni texte d’un autre service.
- Un prospect voit une démo : comprend le résultat remis et la prochaine décision, sans confondre le support avec un produit SaaS vendu.

## Task 1: Accueils et publication du site

**Files:** `src/data/accueil/{ec,cac,types}.ts`, `src/components/editorial/ChoisirTache.astro`, `src/components/sections/Orientation.astro`, `src/data/pages-v2.mjs`, `.agents/product-marketing.md`, dérivés du pipeline, tests ciblés des accueils.

**Interfaces:** Consumes `ROBOTS`, `AGENTS`, `SOLUTIONS`, navigation partagée et composants éditoriaux. Produces deux accueils qui orientent vers les quatre routes existantes, un message commun mis à jour et un SHA publiable.

- [ ] Examiner le choix actuel robot/agent et produire quatre parcours distincts en conservant le design validé et le catalogue en premier.
- [ ] Intégrer OS et modèle privé aux textes de conversion utiles, aux liens et à la charte, sans transformer le hero en liste de fonctionnalités.
- [ ] Ajouter un invariant ciblé des quatre destinations sur les deux accueils ; le regarder échouer avant correction.
- [ ] Vérifier mobile/bureau, clavier, liens et limites CAC ; régénérer les dérivés via les conventions du dépôt.
- [ ] Commit explicite, revue indépendante du delta et CI exacte. Préparer une prévisualisation depuis l’artefact vérifié.
- [ ] Après revue PASS et CI verte, fusionner la PR autorisée, attendre le mécanisme de production et vérifier les routes publiques, médias, metadata, sitemap, llms et robots.

## Task 2: Sauvegarde, inventaire et direction du support

**Files:** sauvegarde externe `memlia-rdv-donnees/refonte-offre-2026-10-16/`, plan et cadrage miroirs dans le worktree RDV, sources existantes R1/R2/Scripts/souffleur.

**Interfaces:** Consumes le checkout RDV existant avec son diff non enregistré. Produces un état initial sauvegardé, une base de travail isolée, un contrat visuel et une carte des identifiants du support.

- [ ] Sauvegarder le diff, les fichiers non suivis et les treize images avec empreintes ; reprendre dans un worktree isolé sans toucher au checkout original.
- [ ] Contrôler le socle repris avec typage et tests domaine/souffleur/preuves ; distinguer les défauts initiaux.
- [ ] Examiner réellement Twenty, les images fournies et le support actuel. Écrire le contrat visuel (1440×900, 1280×720, 390×844, plein écran visio) et les états de chargement/erreur/vide/partiel.
- [ ] Documenter l’objectif, le parcours et le texte oral de chaque étape R1/R2 EC/CAC avant généralisation.

## Task 3: Offre commune et catalogues commerciaux

**Files:** données typées et médias `src/donnees/`, domaine `src/domaine/`, showrooms `src/supports/`, docs commerciales actives, tests domaine/catalogue.

**Interfaces:** Consumes les 21 robots, 12 agents, deux offres et prix validés du site. Produces une sélection fermée des quatre services et des identifiants stables partagés entre showroom, proposition et discours.

- [ ] Importer les textes et figurines nécessaires dans un catalogue local stable avec provenance, 21/12 et deux représentations validées.
- [ ] Remplacer les anciennes catégories automatisation/IA et le tarif socle+pôle dans les nouvelles propositions ; préserver les dossiers historiques.
- [ ] Présenter pour chaque service le besoin, les entrées, le travail remis, la validation, les intégrations et le mode de devis. Le R2 chiffre seulement ce qui est retenu.
- [ ] Centraliser la nouvelle offre dans la documentation active ; signaler les anciennes propositions comme historiques sans réécrire les recherches datées ni multiplier les grilles tarifaires.
- [ ] Tester les comptes, slugs, images, liens, calculs, frontières et migration des anciennes sélections.

## Task 4: Support de vente, accueil, R1 et R2

**Files:** shell/navigation/styles, pages d’accueil, composants et sections R1/R2, showrooms, états de saisie, tests UI.

**Interfaces:** Consumes le catalogue Task 3 et les dossiers existants. Produces une présentation fluide avec navigation et identifiants d’étapes stables pour le souffleur.

- [ ] Refaire le shell et un pilote R1 complet selon le contrat Twenty/Memlia ; inspecter visuellement avant généralisation.
- [ ] Organiser le R1 autour du contexte, de la priorité, de scénarios choisis et d’un R2 utile ; ajouter les quatre services sans imposer leur visite.
- [ ] Organiser le R2 autour de la priorité reformulée, du périmètre, des livrables, des validations, du déploiement, du budget et de la décision.
- [ ] Préserver la préparation, l’enregistrement local, la synchronisation Twenty, les accès clavier et les états sans connexion.
- [ ] Vérifier les deux professions, les deux rendez-vous, les textes longs, le partage à 1280×720, les petites fenêtres et le mouvement réduit.

## Task 5: Scripts parlés et souffleur

**Files:** `src/souffleur/textes/{ec,cac}.json`, registres/contrats/selection/positions, page Scripts et éditeur, docs discours, routes et tests.

**Interfaces:** Consumes tous les écrans et fiches Task 4. Produces un texte oral pour chaque position et un changement enregistré dans Scripts visible dans le souffleur.

- [ ] Réécrire en français parlé naturel les deux rendez-vous et les fiches des quatre services, avec questions, transitions et objections propres au service et à la profession.
- [ ] Séparer les indications de Kevin du texte prononcé ; garder les montants variables à lire depuis le support et les limites CAC.
- [ ] Adapter la navigation et le design de Scripts pour retrouver le bon passage immédiatement et lire sous la caméra.
- [ ] Fermer le contrat support → position → texte → Scripts → enregistrement → souffleur, y compris reconnexion, position inconnue et textes personnalisés anciens.
- [ ] Tester la couverture exacte des positions, les mises à jour en direct, les erreurs et la conservation des brouillons.

## Task 6: Recette et mise à disposition locale

**Files:** rapports de recette, captures, scripts de lancement et applications natives existantes uniquement si nécessaire.

**Interfaces:** Consumes les offres, le support et les scripts vérifiés. Produces des liens consultables et les applications locales qui chargent la nouvelle version.

- [ ] Effectuer typage, compilation et suites applicables du support, puis revue indépendante du code et du message commercial.
- [ ] Inspecter réellement chaque parcours EC/CAC R1/R2 et le showroom, ainsi que Scripts et le souffleur ; enregistrer les preuves visuelles et le contrat d’états.
- [ ] Tester les contrats natifs et la chaîne de mise à jour sans écraser un brouillon ou une donnée de rendez-vous ; sauvegarder avant toute activation locale.
- [ ] Donner les URL et chemins de livraison, les contrôles effectués et les seules limites réelles ; ne pas déclarer une application installée ou une publication sans l’avoir constatée.
