# Fusion locale CSV — construction et recette

Route candidate : `/outils-comptables-gratuits/fusionner-fichiers-csv`.
Prévisualisation vérifiée : https://1c944a4b.memlia.pages.dev/outils-comptables-gratuits/fusionner-fichiers-csv (noindex HTTP propre à Pages preview). Aucune publication en production dans cette phase.

## Résultat

Consolidation verticale complète, 2 à 20 CSV et 20 Mo au total. Worker annulable ; encodage et séparateur par fichier ; mapping de chaque colonne, homonymes arrêtés jusqu’à résolution ; union explicitement confirmée ; ordre choisi. Identifiants texte et retours cités conservés. Doublons conservés par défaut, retrait strict optionnel avant provenance. Aperçu paginé 25 lignes, copie complète, CSV et rapport JSON version 1.

Le rapport comporte les comptes par fichier, colonnes manquantes, chaque doublon et première occurrence, provenance de toutes les lignes et chaque cellule/en-tête neutralisé. L’apostrophe protège les exports et la copie, sans modifier les sources. Aucun contrôle comptable, devise, conversion, jointure ou doublon métier n’est revendiqué. Limites supplémentaires affichées avant sélection : 100 000 lignes au total, 128 colonnes, 65 536 caractères par cellule.

## Tests réellement exécutés

- Test écrit et observé rouge avant implémentation (moteur absent).
- 9 scénarios moteur + 6 non-régressions du parseur pseudonymisation : 15 PASS. Options du parseur rétrocompatibles ; les autres outils conservent leurs refus.
- 12 parcours Chromium locaux PASS ; les mêmes 12 sur preview Cloudflare PASS : mapping inversé, homonymes, union, ordre, doublons, formule, Windows-1252, multiline et lignes physiques, annulation, limite totale, pagination/copie/exports/reset.
- Six largeurs 320/375/768/1024/1440/1920, reduced motion, clavier, captures pleines pages ; région du tableau horizontalement accessible. 320 px couvre le reflow d’une surface de 1280 px à 400 % ; pas un test de zoom natif système.
- Aucun POST ni donnée dans les requêtes ; seuls les GET statiques du Worker sont autorisés après chargement. Storage.setItem et IndexedDB.open instrumentés : aucun appel ; local/session/cookies vides. Aucun résultat en URL. La copie passe par le presse-papiers local après choix.
- 10 vérifications HTTP preview PASS : GET/HEAD avec conditions de cache et plage, réponse complète 200, CSP connect-src none, Cache-Control no-transform, absence de beacon ; hub, méthode et pilier entrants ; sitemap outils. Détails `docs/qa/fusion-csv/http-preview.json`.
- Preuve canonique : HTML généré depuis le moteur puis rendu par la recette historique ; `--check` PASS. WebP 1600×900 et OG 1200×630 <150 Ko ; cinq lignes et provenance relues visuellement. Contrat et manifeste inclus.
- `npm run regen:generated` PASS : lastmod et surfaces dérivées du glossaire réaffirmées, sans modification du fond.
- `npm run check` : 0 erreur, 0 avertissement (hints existants).
- `npm run build` complet PASS, journaux bruts annexés : audits query ownership/blog/service/guide/page contract/positionnement/sitemaps/images/lastmod/resource et tests Node.
- Lighthouse mobile local : 99/100/100/100 ; rapport brut et collecteur HTTP robots dans `docs/qa/fusion-csv/`. Aucun score public de production revendiqué.

## Incidents de recette résolus

Le build initial échouait sur une mesure historique expirée du prompt existant. Deux sondes Google réelles ont été rejouées (prompt existant et fusion CSV) et archivées dans `titres-intent-2026-10-07.json` : 1 et 8 suggestions, pas volumes. Les corrections générales d’horloge sont déjà portées par PR152/154 ; elles ne sont pas reprises ici. Les listes exactes de routes/images/en-têtes des tests historiques ont été étendues seulement à cette nouvelle surface.

Un build foreground a été interrompu par le timeout de l’outil ; reprise complète en processus suivi, code 0. Premier déploiement avec token injecté refusé, OAuth existant utilisé via `env -u CLOUDFLARE_API_TOKEN`, déploiement réussi et relu par HTTP. Aucun secret lu ou enregistré.

Les captures après navigation au tableau plaçaient la nav sticky au milieu de la capture longue : remise du scroll en haut avant capture, sans modification du chrome. Le tableau défile réellement jusqu’à la dernière colonne sur mobile ; retour à gauche pour la capture.

## Transmission

Hotspots : registre outils, intent contract, registre requêtes et paragraphes méthode/pilier. Ajouts limités à cet outil ; footer et hub automatiques depuis le registre. Réactualiser main et régénérer les dérivés si conflit, ne pas fusionner leurs empreintes à la main.

La revue indépendante unique appartient à t_d8afa665. La publication et les contrôles publics définitifs (dont Lighthouse sur domaine indexable, robots public et dates J+7/J+28) appartiennent à t_4d6b063b. La prévisualisation n’atteste ni indexation ni usage réel. Aucune métrique de succès/export ajoutée au réseau.

PR159 ouverte. Le premier passage CI a conclu FAILURE : 549 contrats navigateur PASS, un échec car le scénario réseau du nouveau slug manquait dans le contrat commun. Aucun transfert de données n’est démontré par cette exception.

## Reprise du contrat réseau commun

L’échec a été reproduit localement avant correction : « Scénario réseau à définir pour l’outil fusionner-fichiers-csv ». Le scénario ajouté dans `tests/browser/outils.spec.ts` importe deux fichiers fictifs après armement du garde, confirme le mapping et la provenance, consolide trois lignes, vérifie les exports CSV et rapport JSON complets puis réinitialise. Le garde n’autorise que deux GET du script statique local `fusion-csv.worker-*.js`, sans paramètres ; toute autre requête reste un échec. Les assertions localStorage/sessionStorage/IndexedDB restent inchangées ; le parcours dédié conserve aussi ses sentinelles d’écriture.

Test ciblé : 1 PASS après correction. Suite commune outils et suite fusion CSV complète sur le build local conservé : 35 PASS, dont les six largeurs. Journal brut : `docs/qa/fusion-csv/reprise-reseau-tests.txt`. Aucun changement du code produit ni du build. Les captures initiales sont conservées, sans remplacement par les captures de répétition.

La conclusion distante du nouveau passage reste à obtenir avant de libérer QA ; aucun PASS CI ni publication revendiqué ici. La revue et la publication restent sur leurs cartes existantes. Journaux bruts livrés en `.txt` (les `.log` sont ignorés par le dépôt).
