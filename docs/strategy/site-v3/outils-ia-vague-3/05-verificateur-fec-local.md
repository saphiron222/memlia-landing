# 05 — Vérificateur FEC gratuit et local

## Décision produit et intention
Collaborateur de production qui veut localiser une anomalie de structure avant retour à son logiciel.
Besoin : Un fichier texte FEC local profil commercial 18 colonnes, limite 20 Mo annoncée avant choix ; séparateur tabulation ou pipe, UTF-8/BOM ou Windows-1252 explicitement choisi. → Rapport par contrôle : exécuté/non applicable/non évalué, lignes et colonnes concernées, explication et export CSV/JSON sans modification du FEC.
Catégorie décidée : `verifier`. Route décidée : `/outils-comptables-gratuits/verificateur-fec-local`.
Ce brief remplace les exclusions historiques. Produit utile entièrement sans inscription ; résultat avant discours commercial.
Différenciation : 05 observe, 10 transforme une copie. Le local seul n’est pas avantage inédit.
Concurrence et signal : voir recherche-et-sources.md (ligne outil 05) et demande-autocomplete.json ; aucun volume inventé.

## Contrat exécutable
Worker local pour lecture/contrôle, annulation, pagination 100 anomalies sans tronquer total/export. Contrôles bornés après source actuelle : en-tête et ordre des 18 champs, largeur des lignes, dates YYYYMMDD et calendrier, nombres décimaux, présence champs obligatoires selon profil ; équilibre débit/crédit par écriture si implémenté et sourcé ; pas jugement fiscal. Déclarer profil non reconnu au lieu invalide. Parser conserve index ligne source et zéros initiaux. Ne pas proposer correction automatique. Montants via décimaux exacts, pas floats binaires. Journal des règles/version/profil dans rapport.

## SEO et corps statique
Requête primaire : `vérificateur fec gratuit`. Une formulation sondée sans suggestion reste une mesure, pas une promesse de trafic.
H1 : « Vérificateur FEC gratuit et local ». og:title et headline si présent reprennent le H1 à l’identique.
Title : « Vérificateur FEC gratuit et local | Memlia » (raccourcissement de largeur permis sans changer intention).
Description : « Contrôlez localement la structure d’un FEC et trouvez les lignes en anomalie, avec règles expliquées et rapport exportable non certifiant. ».
Plan : Contrôler la structure localement ; fichier et profil ; rapport explicable ; règles exécutées/exclues ; exemple fictif ; Test Compta Demat ; FAQ.
Canonical propre absolu, index/follow seulement au lancement réel, une route sans slash final et un seul H1. WebPage + WebApplication + BreadcrumbList véridiques ; 02 peut compléter CollectionPage/ItemList. Pas Article/BlogPosting fictif, avis ni rating.
Sources : DGFiP Test Compta Demat et article A.47 A-1 actuel ; BOFiP si règle de contrôle exige interprétation, metier.
Matrice : matrice-skills.json/md, colonne 05 ; preuves-skills.md. Le cadrage ciblé est exécuté ; les lignes différées sont à rejouer sur le produit, pas à marquer PASS depuis ce brief.

## Usage / garde-fous / valeur
La préparation est celle de l’outil ; validation et décision appartiennent au cabinet. Pas écriture comptable, envoi de mail ni connexion à un dossier réel.
Local sans stockage par défaut pour 01/02/04–10 ; 03 a son contrat distant distinct. Un transfert temporaire entre pages peut être une exception annoncée/testée selon CONTRAT-COMMUN.md ; préférer ID d’amorce public, pas persistance de texte. Mention de traitement exacte au formulaire, pas affirmation générique sur le hub. Export/copie reflètent le résultat actuellement affiché ; erreur garde les saisies ; réinitialisation explicite.
Lier Memlia à la tâche répétitive que le résultat aide à décrire. CTA « Confier une première tâche » vers /contact après la valeur, pas pour déverrouiller le résultat.

## Tests d’acceptation spécifiques (à exécuter par dev puis revue unique)
1. Jeu FEC fictif nominal → aucune anomalie des règles exécutées, pas mot conformité/certification.
2. En-tête déplacé et ligne courte → anomalies exactes de colonne/ligne.
3. Date 20260230, nombre ambigu → erreurs dédiées, pas coercition silencieuse.
4. Fichier UTF-8 BOM et Windows-1252 choisi → accents et labels conservés.
5. Profil BNC/BA différent ou binaire → non évalué/hors périmètre, pas FEC déclaré faux.
6. 20 Mo dépassés → refus avant parse ; cancel → aucun rapport déclaré complet.
7. 300 anomalies → pagination, total et export complets ; network/stockage zéro données sortantes.

## Design / accessibilité
Réutiliser Outil.astro et sections canoniques, tokens/Fraunces/Hanken/Picto ; ne pas réinventer un mini-formulaire isolé. Tous les états entrée/exemple/chargement/erreur/résultat/export ont un texte utile. Navigation visible et tactile à 320 px. Champ lié au label et erreur par aria-describedby, résultat annoncé sobrement en aria-live, clavier complet, focus visible, pas couleur seule. Cibles confort 44 px (minimum WCAG 24 px), reflow 400 %, contrastes texte 4.5:1 et composants 3:1, reduced-motion.
Scène HTML figée propre : FEC fictif : date impossible ligne 4, colonne EcritureDate ; règle et action source. Source index.html/styles.css/content-contract.json ; 1600×900, <150 Ko, police chargée, pas texte coupé, WebP + OG 1200×630, jamais recyclage d’un autre outil ni image IA. La scène illustre un vrai résultat fictif vérifié.
Captures pleine page 1440/375 et tests six largeurs 320/375/768/1024/1440/1920 ; comparer gabarit et voisins historiques.

## Maillage et livraison
Entrants décidés : /outils-comptables-gratuits, /automatisation-cabinet-comptable, /garanties. Ajouter le lien seulement quand la destination répond publiquement, dans un passage qui nomme le geste. Si un entrant ne permet pas une ancre utile, documenter son remplacement avant livraison ; pas lien décoratif pour compter.
Sortants hub, /methode, /contact plus liens fonctionnels cités ci-dessus ; ne pas lier les quatre futurs articles tant que non publiés. Footer généré depuis collection. Filtres/états/questions ne créent pas de nouvelles pages indexables ni données saisies dans les URLs.
Compléter registres outils/requêtes/lastmod, preuves renderer et tests ; préserver témoin/noindex et outils actuels. Nommage schema/traitement voir CONTRAT-COMMUN.md.
Fini public : CI/build verts, revue indépendante unique adaptée, déploiement réussi, GET canonical sans query string avec Cache-Control no-cache, rejeu réel scénario/copie/export/refus et six largeurs, présence sitemap/hub/footer et liens entrants, médias accessibles, ND pour mesures non collectées. Conserver URL/rapport/déploiement dans carte de livraison.
État actuel : uniquement brief ; aucun test de cette future page exécuté ici.
