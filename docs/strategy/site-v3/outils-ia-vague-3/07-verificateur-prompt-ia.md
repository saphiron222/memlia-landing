# 07 — Vérificateur de prompt IA

## Décision produit et intention
Responsable ou collaborateur qui a déjà rédigé une consigne et veut voir ce qui manque.
Besoin : Prompt abstrait existant, 10000 caractères max ; aucune pièce client. → Constats expliqués : détecté/manquant/à examiner, extrait correspondant, correction proposée éditable et cas d’essai ; pas score de fiabilité.
Catégorie décidée : `verifier`. Route décidée : `/outils-comptables-gratuits/verificateur-prompt-ia`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 07 analyse une consigne, 01/06 fabriquent. Rapport propre et usage direct.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 07) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Même schema/version que 01 ; analyse heuristique locale des blocs objectif/entrées/sortie/validation/arrêt, synonyms français et reformulation. Ne jamais confondre mot « validation » dans une interdiction avec validation décrite. Si doute « à examiner », pas fausse certitude. Suggestion structurelle ne remplace jamais original sans choix. Comparaison original/proposition, copier chaque version, export du rapport. Liens préremplis 01 ou 06 selon contexte ; texte pas dans URL.

## SEO et corps statique
Requête primaire : `vérificateur prompt ia`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Vérificateur de prompt IA ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Vérificateur de prompt IA | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Repérez les contraintes absentes d’un prompt IA et préparez des corrections expliquées, sans confondre structure et fiabilité des réponses. ».
Plan : Contrôler une consigne existante ; analyse ; raisons et corrections ; avant/après ; ce que le contrôle ne mesure pas ; FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : Custos référence comparative, méthode structurelle Memlia non certification.
Matrice : matrice-skills.json/md, colonne 07 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Prompt complet avec libellés → blocs détectés et extraits visibles.
2. Prompt vague « fais ma compta » → entrées/sortie/validation/arrêt manquants avec raisons.
3. Phrase « aucune validation » → conflit, pas bloc satisfaisant.
4. Consigne complète sans titres → détection ou à examiner, pas tout rouge par absence mot-clé.
5. Suggestion puis édition → original intact, export reflète version choisie.
6. Texte HTML hostile et instruction injection → rendu texte, aucun script ni réseau.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Prompt sans arrêt, extrait et suggestion ; aucun score vert rassurant. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /outils-comptables-gratuits/generateur-prompt-expert-comptable, /outils-comptables-gratuits/generateur-prompt-ia-gratuit. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
