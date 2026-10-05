# 02 — Bibliothèque de prompts comptables

## Décision produit et intention
Collaborateur qui cherche un point de départ déjà lisible pour un geste précis.
Besoin : Filtres pôle (production/relation client/pilotage), tâche, format attendu et recherche textuelle locale. → Catalogue de douze modèles complets minimum, exemples fictifs entrée/sortie, copier/exporter et ouvrir dans 01 pour adapter.
Catégorie décidée : `explorer`. Route décidée : `/outils-comptables-gratuits/bibliotheque-prompts-comptables`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 02 choisit, 01 construit. Aucun texte de méthode blog recopié.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 02) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Douze fiches : relance pièces, accusé de réception, liste pièces attendues, tri exceptions, synthèse suivi, reformulation note, ordre du jour, compte rendu, checklist transmission, tableau de contrôles, synthèse écarts fictifs, fiche règle. Chaque fiche porte contexte/entrées/sortie/frontière/arrêt/jeu fictif. Filtres combinables, compteur et état vide utiles. Fiches statiques visibles sans JS ; pas douze routes indexées. Transfert 01 par état temporaire local ou payload typé sans contenu sensible en URL ; reprise versionnée, repli si 01 absent.

## SEO et corps statique
Requête primaire : `bibliothèque prompts comptables`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Bibliothèque de prompts comptables ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Bibliothèque de prompts comptables | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Choisissez un modèle de prompt comptable par tâche, consultez son exemple fictif, puis copiez-le ou adaptez-le sans inscription. ».
Plan : Trouver un modèle ; filtres et fiches ; exemple de préparation ; adapter une consigne ; différence avec générateur ; sources et FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : Cegid/Welyb concurrence, CNOEC usages ; corpus original Memlia.
Matrice : matrice-skills.json/md, colonne 02 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Sans JS → titres, corps des douze fiches et limites disponibles.
2. Filtrer relation client + mail → uniquement fiches correspondantes ; compteur exact.
3. Recherche introuvable → état vide et effacer filtres, pas catalogue disparu.
4. Choisir relance → copie complète, fictive, tous blocs présents, exemple sortie visible.
5. Adapter dans 01 → amorce correcte et éditions confirmées si déjà présentes.
6. Lire/exporter les douze fiches → aucune instruction d’envoi automatique ni décision fiscale.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Filtre relation client, fiche relance, entrée fictive et brouillon prêt à relire. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /blog/prompt-chatgpt-expert-comptable, /outils-comptables-gratuits/generateur-prompt-expert-comptable. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
