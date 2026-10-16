# Hub robots Memlia — chantier du 15 octobre 2026

Livraison : prévisualisation complète, sans fusion ni production. Branche `site/hub-robots`, checkout isolé `.worktrees/hub-robots`.

## Base et décisions

Référence agents IA : `ef483a83` (dernier commit distant au démarrage), enrichie de `origin/main` `c5da8bf9`. Aucune implémentation des agents n'existe dans les références inspectées : seuls les gabarits sont validés. Les composants du hub et des fiches sont réutilisables, conformes à ces gabarits. Aucun fichier du checkout principal ni du worktree `hub-specialistes` n'est modifié.

L'instruction de Kevin du 15 octobre remplace les anciennes portes d'approbation : offre ambitieuse, aucune exigence de livraison client préalable, logos sans statut, chaque fiche avec sa démonstration fictive, pas de FAQPage. Le hub agents distingue un métier ; le robot une routine, un déclencheur, un résultat.

## Exécution et preuves attendues

- [x] Isoler le chantier et comparer branches, session Claude et décisions.
- [x] Lire les références et compétences applicables ; consigner leurs limites.
- [x] Relever les 12 pages Outils-EC et les 18 robots Xpert-iA ; matrice de couverture dédoublonnée à 21 robots, six agents exclus.
- [x] Matrice objections → réponse Memlia → emplacement, règles officielles datées, intentions et migration exhaustive des anciennes routes.
- [x] Modèle typé unique ; écrire et relire le pilote CFE.
- [x] Pilote visuel CFE : figurine comparée à Balthazar ; hub six sections, fiche onze blocs, inspection 375 et 1440 px.
- [x] Généraliser les 21 fiches : livrables, rythmes, quatre cas fictifs dont arrêt motivé, FAQ propres, voisins et contacts.
- [x] Générer séparément les 21 figurines avec référence du pilote ; originaux, PNG 1024, dérivés, manifeste et planche contact.
- [x] Intégrer SEO, liens, sitemap, images sociales, llms.txt, contact par identifiants autorisés et sécurité sans réseau.
- [x] Tests invariants et navigation ; revue contenu métier, mobile, clavier, filtres sans JS, mouvement réduit, liens et non-régression.
- [x] Construire et rendre la prévisualisation consultable ; documenter les preuves et limites réelles.

## Fichiers prévus

`src/data/robots.ts` : source unique typée et fonctions de catalogue. `src/components/catalogue/` : carte, figurine, démonstration, gabarits communs. `/automatisation-cabinet-comptable` : hub remplacé. `/automatisation/[slug]` : nouvelles fiches sans collision avec les services conservés. Contacts : sélection facultative visible et sessionStorage à usage unique, URL sans données personnelles. Dérivés sous `public/robots/`, hors des images éditoriales.

## Contrat visuel et états

Fraunces / Hanken, crème et vert, jetons existants, trois colonnes maximum, bandeau teinté et figurine débordante. Largeurs 375×812 et 1440×1000. Annuaire rendu intégralement au serveur ; filtres radio CSS ; absence de JS et de `:has` = catalogue complet. Pas de chargement distant ni traitement réel. Chaque arrêt de démonstration garde sa raison lisible. Contact vide / présélection valide / invalide / stockage indisponible à vérifier.

## Livraison

Prévisualisation : https://3d972653.memlia.pages.dev/automatisation-cabinet-comptable. Recette achevée : `docs/qa/hub-robots/RECETTE.md`. Catalogue et collection complets. Le contrôle global des anciens titres de services reste en échec sur les mêmes 24 erreurs de la base, sans nouvelle erreur ; détail et preuves dans la recette. Aucune production ni fusion.
