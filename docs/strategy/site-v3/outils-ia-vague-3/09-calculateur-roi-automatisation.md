# 09 — Calculateur de ROI d’automatisation comptable

## Décision produit et intention
Dirigeant qui compare des scénarios de tâche et vérifie ses hypothèses avant devis.
Besoin : Volumes/mois V, temps manuel t minutes, part automatisable p %, adoption a %, contrôle/reprise c minutes par tâche adoptée, coût horaire H, investissement I, maintenance M/mois, dépenses réellement évitables E/mois, délai démarrage d mois, horizon n mois. → Heures de capacité libérée, valorisation du temps séparée, trésorerie nette hypothétique, ROI sur dépenses évitables, délai de récupération si atteignable et trace ; trois scénarios éditables, CSV/JSON.
Catégorie décidée : `calculer`. Route décidée : `/outils-comptables-gratuits/calculateur-roi-automatisation`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : Aucun 70 % par défaut comme gain garanti, aucun devis fictif.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 09) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Temps net par mois T = V*a*(t*p-c)/60 avec p/a en fractions ; T peut être négatif. Valeur de capacité = T*H, jamais économie cash. Mois actifs k=max(0,n-d). Bénéfice cash k*E ; coût C=I+k*M ; net=k*E-C ; ROI cash=(k*E-C)/C si C>0 sinon non défini. E est une hypothèse distincte saisie par le cabinet, n’inclut jamais automatiquement T*H. Payback après démarrage I/(E-M) si I>0 et E>M, si I>0 et E<=M : récupération impossible ; si I=0 : récupération non applicable (aucun investissement initial), résultat cash toujours calculé ; afficher délai d et horizon, convention approximation continue explicite. Sans E connu, ROI cash ND, calcul capacité seulement. Formules visibles, unités, décimales fr, aucune référence au tarif Memlia.

## SEO et corps statique
Requête primaire : `calculateur roi automatisation comptable`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Calculateur de ROI d’automatisation comptable ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Calculateur de ROI d’automatisation comptable | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Comparez des scénarios d’automatisation avec vos volumes, temps, coûts et hypothèses, en séparant capacité libérée et économies de trésorerie. ».
Plan : Tester des hypothèses économiques ; champs et scénarios ; capacité vs trésorerie ; formules ; exemple fictif ; limites et FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : Codea comparaison ; formules Memlia documentées, pas taux de gain du marché.
Matrice : matrice-skills.json/md, colonne 09 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. V=100,t=12,p=.5,a=.8,c=1,H=40,I=1000,M=50,E=200,d=0,n=12 → T=6h40, capacité 266,67 €/mois ; C=1600, net=800, ROI cash=50 %, récupération 6,67 mois selon convention.
2. E inconnu → cash/ROI ND ; capacité conservée.
3. p=0,c=1,a=1,V=100 → T négatif, pas clamp de gain.
4. C=0 → ROI non défini, pas Infinity ; E<=M et I>0 → pas payback.
5. d>n → aucun bénéfice, investissement conservé ; bornes p/a 0..100 %, temps/coûts négatifs refusés.
6. Comparer trois scénarios → hypothèses visibles et export reproduit exactement résultats/arrondis.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : Deux scénarios fictifs : temps libéré distinct de cash, coût récurrent visible. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /automatisation-cabinet-comptable, /methode. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
