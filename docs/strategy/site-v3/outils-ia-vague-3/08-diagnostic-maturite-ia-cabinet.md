# 08 — Diagnostic de maturité IA du cabinet

## Décision produit et intention
Dirigeant qui veut décider d’une prochaine expérimentation sans classer ses salariés.
Besoin : Quinze questions : trois par dimension usages/règles/données/validation/mesure. Réponses non commencé/en essai/formalisé/je ne sais pas. → Synthèse par dimension, preuves déclarées, inconnues et trois actions prioritaires justifiées ; rapport immédiat imprimable/export .md.
Catégorie décidée : `se-situer`. Route décidée : `/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 08 situe ; 09 chiffre des hypothèses. Aucun gain déduit d’un niveau.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 08) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Rubrique originale de travail Memlia, pas norme. Pas note globale scientifique. États ordonnés uniquement sur réponses connues : dimension formalisée si ses trois réponses le sont ; en essai si au moins une réponse en essai ou formalisée et pas trois formalisées ; à démarrer si toutes non commencées ; incomplet si inconnue. Priorités : sécuriser données/validation manquantes, écrire une règle, mesurer une tâche ; justification cite réponses, pas percentile. Aucun classement individuel, collecte mail ou nom de salarié. Revenir aux réponses sans perte, toutes facultatives avec inconnu.

## SEO et corps statique
Requête primaire : `diagnostic maturité ia cabinet comptable`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Diagnostic de maturité IA du cabinet ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Diagnostic de maturité IA du cabinet | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Situez les pratiques IA de votre cabinet et choisissez une prochaine action à partir de vos réponses, sans inscription ni classement des équipes. ».
Plan : Se situer à partir de ses pratiques ; questionnaire ; dimensions et inconnues ; prochaines actions ; méthode déclarative ; FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : EFIMOVE/Yes We Prompt concurrence ; méthode Memlia déclarative ; CNOEC gouvernance.
Matrice : matrice-skills.json/md, colonne 08 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Toutes réponses inconnues → incomplet partout, aucune conclusion « faible maturité ».
2. Données non cadrées + usage formalisé → priorité données avant expansion.
3. Quinze réponses formalisées → proposer suivi des exceptions, pas certifier conformité.
4. Changer une réponse → seule synthèse dépendante change, justification traçable.
5. Résultat et export disponibles sans mail ; navigation précédent/suivant garde réponses.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Dimensions données/validation, inconnue visible et prochaine action écrire une règle. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /methode, /automatisation-cabinet-comptable. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
