# Finalisation Codex : agents IA et intégrations communes

Demande de Kevin après arrêt explicite de Claude. Base : version robots et copy validée `54e37be6`, reprise du socle agents `03acf961` et des 17 chemins interrompus. Aucune production ni fusion sur main dans cette livraison ; prévisualisation complète.

## Protection et autorité

- [x] Sauvegarder le diff, les fichiers interrompus, le registre et les logos temporaires dans `memlia-landing-sources/hub-agents-ia/reprise-codex-2026-10-15/` (670 fichiers, SHA dans `sauvegarde.json`). Checkout Claude laissé intact.
- [x] Créer `site/agents-robots-integrations`, reprendre le socle sur le checkout Codex. Résoudre les seuls conflits générés en conservant nos sources ; régénérer les reçus ensuite. Navigation reprise avec ses trois destinations.
- [x] Lire le plan Claude, ses arbitrages R1–R27 et le contexte tâche 8. Appliquer charte v8 et dernières demandes de Kevin en priorité.

## Étapes à terminer

1. **Catalogue commun et direction visuelle** : hub agents avec les six sections du hub robots, mêmes cartes, héros, bande verte et espacements. Douze destinations, sans réduire artificiellement le catalogue ; neuf fiches propres et trois destinations existantes. Reprendre les figurines validées et produire leurs dérivés.
2. **Compatibilités** : terminer `/integrations` depuis les données Claude, logos officiels assainis, catégories, recherche/filtres accessibles et repli sans JS. Une seule page pour robots et agents. Préserver les guides et leurs URLs ; pas de second hub concurrent.
3. **Fiches** : remplir les huit données restantes depuis AGENTS-CONTENU et FACT-CHECK, aligner les neuf pages sur l’ordre des fiches robots, avec leurs propres démonstrations et FAQ. Relecture métier dédiée.
4. **Contact et maillage** : réutiliser le mécanisme des robots pour les familles d’agents autorisées, sans donnée personnelle en URL, sans migration de production inutile. Hub ↔ fiches ↔ outils, destinations Salomé/Aude/Octavie, liens de contenu par données.
5. **Référencement et sécurité** : métadonnées, schémas, images sociales, sitemap, llms, source de vérité, CSP sans réseau. Refaire le relevé Google vieillissant sans contourner ses contrôles.
6. **Recette et livraison** : tests ciblés et invariants, inspection réelle 375/1440, claviers et mouvement réduit, tous logos/assets/liens, revues indépendantes, prévisualisation vérifiée. Pas de production.

## Décisions d’adaptation du plan ancien

- Ruling C1 : le hub robots et les pages Codex sont la référence de design, explicitement choisis par Kevin. Les anciens grands cadres HTML, tableau de métiers et sections redondantes du hub Claude sont remplacés par les six sections communes. Les informations utiles restent dans les fiches.
- Ruling C2 : la tâche 8 et les données des fiches sont indépendantes après reprise de leurs interfaces. Deux implémenteurs sont délégués selon le skill subagent-driven-development (un pour les huit fiches, un pour les logos), le contrôleur gère l’interface commune et relit leurs résultats. Aucun commit partagé pendant l’intégration.
- Ruling C3 : l’accord actuel couvre les logos publics nécessaires. Les anciennes demandes d’accord fichier par fichier ne bloquent plus des remplacements officiels réversibles ; les fichiers impossibles à obtenir restent identifiés, jamais remplacés par un faux logo.
- Ruling C4 : le contact des robots existe déjà et couvre stockage bloqué, choix facultatif, validation et conservation. Adapter ce mécanisme aux identifiants d’agents plutôt que créer une seconde mécanique concurrente et une migration D1 de production sans nécessité.
- Ruling C5 : le plan Claude annonçait une mise en production mais la livraison en cours reste une prévisualisation, conformément au périmètre déjà arrêté avec Kevin. Ni main ni déploiement de production automatique.

## Avancement

- Reprise : `530263b7`, socle fusionné ; tâche 8 importée et sauvegardée.
- Fiches : terminées et relues par `fiches_agents` (huit fichiers de données, corrections métier tracées).
- Logos : terminés et relus par `logos_compatibilites` (fichiers, sécurité, provenance et remplacements officiels).
- Interface, contact, maillage, référencement et contrôles terminés par le contrôleur ; prévisualisation finale publiée et vérifiée.

## Recette du candidat

- [x] Douze agents, neuf fiches complètes et trois destinations identifiées ; figurines validées réutilisées, 72 dérivés légers et manifeste.
- [x] Catalogue de compatibilités commun : 365 cartes, quinze domaines, recherche, 352 logos officiels contrôlés et treize noms seuls documentés ; guides et URLs conservés.
- [x] Contact facultatif et liste blanche commune de 90 points de départ, maillage par données et gabarits sans retoucher les articles scellés.
- [x] SEO, onze rendus sociaux de la série, schémas, sitemap, llms/Markdown, CSP sans réseau, nouveau relevé Google des services.
- [x] Revue métier indépendante PASS ; contrôles de données, de contrats, de liens et parcours navigateur ; inspection mobile/bureau et Lighthouse ≥99.
- [x] Prévisualisation finale publiée et vérifiée : https://fbc59424.memlia.pages.dev/agents-ia ; hub commun https://fbc59424.memlia.pages.dev/integrations. 13 réponses HTTP et 32 tests navigateur distants réussis.

Ruling C6 : les tableaux mobiles conservent les mots de décision sur une ligne. Le filtre Vie du cabinet (quatre agents) passe à deux colonnes au bureau, pour éviter une dernière carte isolée. Les composants et styles restent ceux des robots.
Ruling C7 : les treize cartes sans logo restent nommées et documentées ; aucun substitut trompeur. Les services officiels conservent leurs logos dans la bande dédiée demandée par Kevin.
Ruling C8 : les styles et mesures des cartes du catalogue sont vérifiés comme variante validée par Kevin : coque commune, bandeau bord à bord, corps à 24 px. Le test historique qui exigeait une marge extérieure au-dessus du bandeau est adapté à cette variante et conserve ses témoins et contrastes.

Ruling C9 : l’identité visuelle est contrôlée en plus du SHA. Bluebiz n’est pas le logo Air France ; les anciens pictogrammes Working Papers ne présentent pas tous les produits Caseware. Rejets/remplacements documentés, trois favicon ambigus écartés et 215 SVG normalisés sans modifier leur dessin.
Ruling C10 : le hub /integrations contient la démonstration Octavie ; sa livraison réutilise donc la Function et la CSP sans réseau des agents, y compris le retrait des balises analytiques injectées par l’hébergeur.
