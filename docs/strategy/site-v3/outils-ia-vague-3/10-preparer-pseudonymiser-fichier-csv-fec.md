# 10 — Préparer et pseudonymiser un fichier comptable avant IA

## Décision produit et intention
Référent outils qui veut minimiser une copie locale avant une revue des données partageables.
Besoin : CSV/TSV ou FEC texte local, 20 Mo max ; choix explicite colonnes à supprimer, remplacer par alias ou conserver ; aperçu et séparateur/encodage. → Copie CSV pseudonymisée, rapport des transformations et risques restants ; mapping optionnel local séparé, jamais joint automatiquement au résultat.
Catégorie décidée : `preparer`. Route décidée : `/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 10 transforme une copie de travail, 05 contrôle la structure. Aucun anonymat garanti.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 10) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Nom public honnête, conserve l’idée 10 anonymiseur avec périmètre CSV/FEC réalisable. Worker local, parser commun 05 si pertinent, original jamais modifié. Alias stables par colonne dans une session ; valeurs égales → même alias ; valeurs distinctes → alias distincts. Pas hash non salé présenté anonyme. Champs libres : supprimer par défaut ou demander choix de conservation et alerter, détection email/IBAN/noms heuristique seulement. Dates/montants/combinaisons rares peuvent identifier : afficher contrôles résiduels et rien « prêt ChatGPT ». Export CSV nommé copie-pseudonymisee, jamais FEC fiscal conforme ; neutraliser formules Excel au début cellule =,+,-,@ et control chars selon contrat explicite sans altérer silencieusement le sens. Mapping si demandé accompagné avertissement et détruit à reset. Sans réseau/stockage, pas transfert direct à 03.

## SEO et corps statique
Requête primaire : `pseudonymiser fichier comptable avant ia`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Préparer et pseudonymiser un fichier comptable avant IA ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Préparer et pseudonymiser un fichier comptable avant IA | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Supprimez ou remplacez des colonnes d’un fichier CSV ou FEC local et examinez les risques restants avant tout partage avec une IA. ».
Plan : Minimiser une copie, pas garantir l’anonymat ; fichier/colonnes ; aperçu comparatif ; risques résiduels ; export ; CNIL et FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : CNIL anonymisation/pseudonymisation page ouverte ; MessyMatch concurrence.
Matrice : matrice-skills.json/md, colonne 10 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Fichier fictif deux noms répétés → noms absents en sortie, alias cohérents, original inchangé.
2. Nom/email dans libellé libre → suppression choisie par défaut ou alerte explicite avant export si conservé.
3. Dates/montants uniques conservés → risque de réidentification mentionné, aucun badge anonymisé.
4. CSV guillemets/retour ligne/BOM/accents → roundtrip parse correct ; encodage inconnu → choix/refus, pas corruption.
5. Cellule formule =HYPERLINK(...) → export neutralisé, risque expliqué ; mapping jamais exporté sans choix.
6. Refus >20 Mo/binaire, cancel → pas copie partielle ; reset → contenu/mapping retirés du DOM et mémoire référencée.
7. Network/storage pendant import/preview/export → aucun contenu sortant ou persisté ; copie n’est pas envoyée à assistant.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Avant/après fictif : noms retirés mais montant rare conservé, risque restant affiché. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /garanties, /outils-comptables-gratuits/verificateur-fec-local. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
