# Tracker : Markdown local

Les specs et tickets du site Astro memlia.fr vivent dans des fichiers Markdown sous `.scratch/`. Aucun tracker externe n'est utilisé, y compris pour les travaux de contenu, de SEO et de déploiement Cloudflare Pages.

## Conventions

- Un dossier par chantier : `.scratch/<chantier>/`.
- La spécification est `.scratch/<chantier>/spec.md`.
- Chaque ticket d'implémentation a son propre fichier `.scratch/<chantier>/issues/NN-<slug>.md` ; jamais de fichier unique regroupant tous les tickets.
- `NN` est unique dans tout `.scratch/`, pas seulement dans un chantier. Avant de créer un ticket, rechercher le plus grand numéro existant dans tous les dossiers `issues/`, puis prendre le suivant.
- Chaque ticket porte près du début une ligne `Status:` utilisant le vocabulaire de `triage-labels.md` ou l'état d'exécution `claimed` / `resolved`.
- Chaque ticket porte près du début une ligne `Blocked by:`. Utiliser `Blocked by: —` sans dépendance, ou une liste de numéros séparés par des virgules.
- Les commentaires et l'historique de conversation s'ajoutent en fin de fichier sous `## Comments`.

## Quand un skill dit « publier dans le tracker »

Créer le fichier approprié sous `.scratch/<chantier>/`, ainsi que les dossiers manquants. Ne pas créer d'issue GitHub, GitLab, Jira ou Linear.

## Quand un skill dit « récupérer le ticket concerné »

Lire le fichier au chemin ou au numéro fourni. Pour un numéro seul, rechercher ce numéro dans tous les dossiers `.scratch/*/issues/` et refuser de choisir si plusieurs fichiers correspondent.

## Opérations de wayfinding

`wayfinder` utilise une carte et un fichier enfant par ticket.

- **Carte** : `.scratch/<chantier>/map.md`, qui porte les notes, les décisions acquises et les zones de flou.
- **Ticket enfant** : `.scratch/<chantier>/issues/NN-<slug>.md`, avec la question dans le corps. Une ligne `Type:` indique `research`, `prototype`, `grilling` ou `task` ; `Status:` indique notamment `claimed` ou `resolved`.
- **Blocage** : `Blocked by: NN, NN`. Un ticket n'est débloqué que lorsque tous les fichiers cités portent `Status: resolved`.
- **Frontière** : parcourir tous les fichiers du dossier `issues/` et retenir le premier numéro dont le ticket est ouvert, non bloqué et non réclamé.
- **Réclamation** : écrire `Status: claimed` et enregistrer avant de commencer le travail.
- **Résolution** : ajouter la réponse sous `## Answer`, écrire `Status: resolved`, puis ajouter dans `map.md` un pointeur concis vers la décision et son ticket.
