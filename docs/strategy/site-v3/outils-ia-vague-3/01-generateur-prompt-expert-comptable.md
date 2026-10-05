# 01 — Générateur de prompt pour expert-comptable

## Décision produit et intention
Responsable de pôle qui veut décrire une tâche sans improviser les règles.
Besoin : Tâche abstraite (800 caractères max), entrée autorisée, format de sortie, validateur, condition d’arrêt. Quatre amorces : relance de pièces, tri d’écarts, synthèse de suivi, préparation de liste de contrôles. → Consigne structurée éditable, frontière en trois colonnes, conditions d’arrêt et cas fictifs ; copie texte et téléchargement .txt.
Catégorie décidée : `ecrire`. Route décidée : `/outils-comptables-gratuits/generateur-prompt-expert-comptable`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 01 ↔ 02 pour choisir une amorce ; 01 ↔ 07 pour contrôler un prompt existant.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 01) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Champs obligatoires tâche/sortie/validation/arrêt. Le moteur local assemble contexte, but, entrées, sortie, frontière, arrêt et essais. Garder les éditions utilisateur jusqu’à remplacement confirmé ; recalculer le contrôle structurel après édition. Un montant dans un cas fictif choisi est permis, pas dans une description client réelle. Expliquer la détection comme heuristique, pas garantie de confidentialité.

## SEO et corps statique
Requête primaire : `générateur prompt expert comptable`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Générateur de prompt pour expert-comptable ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Générateur de prompt pour expert-comptable | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Décrivez une tâche abstraite du cabinet et préparez un prompt structuré, avec validation humaine, conditions d’arrêt et exemples fictifs. ».
Plan : Consigne adaptée à la tâche ; formulaire ; exemple avant/après ; ce qui se prépare/valide/reste humain ; limites de l’assemblage ; comment essayer ; FAQ ciblée.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : Cegid et CNOEC pour le besoin ; méthode Memlia pour les blocs, non norme.
Matrice : matrice-skills.json/md, colonne 01 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Tâche fictive « préparer une relance » → sept blocs et frontière préparation/validation/humain ; sortie contient le format sélectionné.
2. Supprimer la condition d’arrêt → génération bloquée et erreur liée au champ, saisie conservée.
3. Éditer la sortie puis changer une amorce → confirmation avant remplacement ; annuler conserve la sortie byte à byte.
4. Supprimer validation dans sortie éditée → contrôle actualisé, copie identique au texte édité.
5. Email/IBAN fictif au champ abstrait → avertissement/refus selon règle documentée ; aucun appel réseau.
6. Copie indisponible → texte sélectionnable ; export UTF-8 relu conforme.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Une tâche de relance fictive devient les sept blocs, avec arrêt sur pièce illisible. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /blog/prompt-chatgpt-expert-comptable, /methode. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
