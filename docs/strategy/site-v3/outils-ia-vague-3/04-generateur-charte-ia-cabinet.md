# 04 — Générateur de charte IA du cabinet

## Décision produit et intention
Dirigeant ou référent outils voulant fixer les usages, les responsables et les validations.
Besoin : Usages autorisés, familles de données, outils retenus (descriptions génériques), rôles, validations, arrêts, formation, date de relecture. → Trame de charte non officielle éditable, checklist des arbitrages restant à compléter, export .md/.txt et impression CSS propre.
Catégorie décidée : `ecrire`. Route décidée : `/outils-comptables-gratuits/generateur-charte-ia-cabinet`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 04 organise les usages ; 08 situe les pratiques. Pas de document normatif.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 04) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Trame originale composée localement : objet, usages, données, contrôles, rôles, incident/arrêt, formation, révision. Rôles plutôt que noms de salariés. Aucun choix dangereux présélectionné ni clause qui dit conforme. Sans responsable : placeholder visible et checklist, pas inventé. Refuser règles contradictoires (données confidentielles interdites et envoi de fichiers clients à IA publique autorisé). Source de l’Ordre liée comme ressource distincte. Modifications conservées ; export même version que aperçu.

## SEO et corps statique
Requête primaire : `générateur charte ia cabinet comptable`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Générateur de charte IA du cabinet ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Générateur de charte IA du cabinet | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Préparez une trame de charte IA adaptée aux usages du cabinet, avec responsabilités, données autorisées et validation humaine. ».
Plan : Préparer une charte de travail ; choix ; aperçu éditable ; points restant à décider ; source de l’Ordre ; mise en pratique et FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : CNOEC charte/livret à réouvrir ; CNIL pour données, aucun modèle officiel copié.
Matrice : matrice-skills.json/md, colonne 04 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Usages relance + synthèse fictive → clauses uniquement sur ces usages, responsable et fréquence visibles.
2. Responsable manquant → « à compléter » et checklist ; aucun nom inventé.
3. Choix contradictoires données/envoi → alerte bloquante expliquée.
4. Ajouter clause éditée puis modifier questionnaire → confirmation de remplacement.
5. Export et impression → clauses identiques, limites et statut trame non officielle inclus.
6. Aucune exigence légale ou certification affirmée sans texte actuel vérifié par metier.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Usages choisis vers trois clauses, responsable à compléter et prochain contrôle. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /garanties, /methode. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
