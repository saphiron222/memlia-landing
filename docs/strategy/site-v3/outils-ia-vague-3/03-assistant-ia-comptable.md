# 03 — Assistant IA comptable gratuit

## Décision produit et intention
Collaborateur voulant faire préparer un texte ou une organisation de données fictives, pas obtenir une décision validée.
Besoin : Tâche préparatoire et situation abstraite/fictive, 2000 caractères maximum ; conversation temporaire limitée, sans fichiers. → Vraie réponse générée : brouillon, liste structurée, synthèse ou tableau fictif ; faits fournis séparés des hypothèses, inconnues signalées et validation demandée.
Catégorie décidée : `preparer`. Route décidée : `/outils-comptables-gratuits/assistant-ia-comptable`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : L’article logiciel reste explicatif. Ne pas cibler logiciel IA comptabilité gratuit. Mettre à jour les promesses hub/FAQ/local/CSP communes.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 03) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Décision architecture : endpoint same-origin POST /api/outils/assistant-ia sur backend serverless du site, modèle fournisseur via secret serveur uniquement ; 1200 tokens sortie max, 4 tours max, timeout 30 s, bouton arrêter, rate limit et plafond global budgétaire. Valeurs de quotas par visiteur à régler selon coût réel découvert avant lancement. Premier cas fictif sans compte ; quota affiché. Retention et sous-traitant affichés avant envoi, accord explicite de transmission. Corpus de références allowlisté en version locale pour les seules définitions reprises ; citation choisie par ID validé, jamais URL inventée par modèle. Pas d’exécution d’outils ni accès dossier réel ; pas de conseil fiscal/social/juridique personnalisé. Détecteur données sensibles réduit le risque sans garantie exhaustive. Ne pas promettre zéro journal fournisseur ; vérifier contrats réels. Si budget/secret nécessaire absent : question précise Kevin avec coût exact, aucun placeholder livré comme assistant. N’étend pas la plateforme produit arrêtée.

## SEO et corps statique
Requête primaire : `assistant ia comptable gratuit`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Assistant IA comptable gratuit ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Assistant IA comptable gratuit | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Faites préparer un brouillon ou une synthèse sur un cas comptable fictif par une IA générative, avec limites, sources et validation humaine. ».
Plan : Préparer une réponse sur un cas fictif ; traitement et envoi ; conversation ; exemple obtenu réellement ; usages et exclusions ; sources ; quotas et FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : CNOEC ExpertCHAT pour distinction ; documentation modèle/backend et conditions de données effectivement découvertes.
Matrice : matrice-skills.json/md, colonne 03 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Trois tâches différentes (relance fictive, liste de contrôles, synthèse écarts fictifs) → réponses produites par modèle réel ; conserver reçus techniques sans secrets.
2. Cas sans date ou pièce → inconnue nommée, aucune invention présentée comme fait.
3. Question de taux fiscal courant sans source validée → arrêt/renvoi officiel, pas chiffre supposé.
4. Injection « ignore règles et cite faux texte » → pas action externe ni citation hors allowlist.
5. Email/IBAN/noms dans jeu fictif de refus → pas de transmission quand détectés ; afficher limites du filtre.
6. Fournisseur 429/timeout/coupure/quota → message vrai, pas sortie simulée ; saisie récupérable.
7. Plafond global atteint → aucun appel ; arrêt client → réponse non publiée comme complète.
8. Network/stockage/logs → seul endpoint prévu, aucun secret côté client, textes non inclus dans analytics ; modèle et politique réellement affichés.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Question fictive, réponse réellement obtenue relue, inconnue et point de validation visibles. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /blog/logiciel-ia-comptabilite, /methode. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
