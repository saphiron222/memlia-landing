# 06 — Générateur de prompt IA gratuit

## Décision produit et intention
Professionnel qui veut une consigne texte claire pour rédiger, résumer, classer ou préparer une réunion.
Besoin : Objectif abstrait, public, contexte, ton, données autorisées, contraintes et format texte/tableau/JSON ; description 1500 caractères max. → Prompt professionnel générique éditable avec critères d’acceptation et exemple de test ; .txt/.json et copie.
Catégorie décidée : `ecrire`. Route décidée : `/outils-comptables-gratuits/generateur-prompt-ia-gratuit`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 06 généraliste, 01 cadre cabinet ; ne pas copier ses formulaires/textes métier.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 06) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Moteur commun de blocs avec 01/07, mais aucune amorce comptable par défaut. Écrire/résumer/classer/préparer réunion : parcours et exemples propres. Format JSON produit une consigne avec schéma de sortie validé, pas JSON mal formé. Choix arrêter sur manque d’information. Prévisualisation au fil des choix et remplacement confirmé des éditions. Local déterministe explicitement nommé, aucune IA réellement appelée. Le besoin image/vidéo n’est pas servi ni prétendu.

## SEO et corps statique
Requête primaire : `générateur prompt ia gratuit`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Générateur de prompt IA gratuit ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Générateur de prompt IA gratuit | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Préparez un prompt texte pour rédiger, résumer ou classer, avec contexte, format de sortie, contraintes et critères de validation. ».
Plan : Une consigne texte professionnelle ; construction ; formats et contraintes ; exemples propres ; test et révision ; limites et FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : Custos concurrence ; conventions Memlia explicites non benchmark.
Matrice : matrice-skills.json/md, colonne 06 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Compte rendu fictif + liste actions → consigne avec public, champs action/responsable/délai et arrêt.
2. Choisir JSON → schéma parseable et contraintes de syntaxe cohérentes.
3. Objectif vide ou contraintes contradictoires → erreur expliquée.
4. Cas image/vidéo → périmètre texte explicite, pas résultat prétendu adapté.
5. Édition conservée, export et copie exacts ; aucun appel réseau.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Préparation réunion générique, format tableau et critère de vérification. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /outils-comptables-gratuits/verificateur-prompt-ia, /methode. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
