# Décisions du chantier robots — 15 octobre 2026

## Sources d’autorité et base

La session Claude « Hub de spécialistes IA Memlia » a été extraite sans les appels d’outils et les notifications techniques. Interventions décisives : validation D1–D14 du 14/10 20:57 UTC ; arbitrages du 14/10 23:04 UTC (15/10 Paris) : ambition de l’offre, logos, aucun statut de disponibilité, chaque fiche a son exemple fictif, retrait de FAQPage. Ces décisions et la demande du présent chantier priment sur les passages anciens encore présents dans le cadrage, la bible, l’architecture et le plan.

Référence la plus récente inspectée après récupération distante : `site/hub-specialistes` / `origin/site/hub-specialistes`, `ef483a83`, propre. Aucun fichier d’implémentation `specialistes.ts` ou route `/agents-ia` n’existe dans les branches pertinentes. Le checkout principal est à `5280ea69` ; il n’est pas la base. Le worktree isolé part de `ef483a83` et intègre `origin/main` `c5da8bf9` (mise à jour de documents, aucun gabarit agent supplémentaire). Les deux checkouts préexistants sont préservés.

## Modèle et structure

Un robot = une routine précise avec un déclencheur, un rythme et un livrable. Un agent IA = plusieurs tâches d’un métier. Le registre `src/data/robots.ts`, ses types et son annexe de contenu `robots/catalogue.ts` forment un catalogue unique ; les pages, compteurs, voisins, contacts, JSON-LD et projections SEO le consomment.

Le hub garde `/automatisation-cabinet-comptable`, six sections. Chaque fiche garde l’ordre du gabarit agents : fil, héros avec table, livrables, trois étapes, tâches/outils, comparaison, règle sombre, voisins/méthode, questions, contact et trois départs, retour. La preuve sociale n’existe pas. Les 12 services historiques restent à leur URL : aucune redirection n’est justifiée. Leur parcours contextuel reste obligatoire, même si le nouveau catalogue de routines ne les liste plus tous directement ; le registre de publication et son contrôle évoluent explicitement sur ce point, sans autoriser de service orphelin.

Filtres radio et `:has()` CSS, rendus sans JavaScript. Pas de prise en charge `:has()` : tous les robots restent consultables. Cartes entières cliquables, trois colonnes maximum, médaillons 116 px et figurines de carte 84 px, bandeaux 138 px. Espaces et typographies du système du 07/10. Les composants `catalogue/` sont le socle réutilisable pour la future implémentation agents ; aucun autre hub agents n’est inventé dans ce chantier.

## Frontière commerciale et technique

Nous vendons la tâche prise en charge, observation, construction, recette et maintenance. Aucun tarif, pack, client, partenaire, certification ni temps gagné n’est repris. Les propriétés d’exécution locale et d’hébergement des concurrents ne sont pas transférées à Memlia. L’environnement, les plages, les accès et les destinations sont définis avant installation. Une réauthentification nécessaire arrête le dossier ; aucune protection n’est contournée.

Les lectures, téléchargements et classements opèrent dans le périmètre configuré. Toute action engageante suit les validations décrites. Le rattachement peut traiter un lot autorisé après validation ; les autres routines ne deviennent pas des services d’émission, de paiement ou de signature.

## Contact et sécurité

Sélection visible et facultative, trois identifiants autorisés par robot. `sessionStorage` à usage unique : aucun texte libre ni donnée personnelle dans l’URL. Sans stockage, le lien continue ; sans JavaScript, le contact reste consultable et le courriel fournit le repli déjà prévu par le site. Le serveur traduit l’identifiant autorisé en libellé et l’associe au message existant : aucune migration D1 nécessaire pour cette prévisualisation, aucun envoi réel réalisé.

Les nouveaux écrans de démonstration utilisent le filtre Pages déjà employé par les outils gratuits : retrait du beacon, CSP `connect-src 'none'`, `no-transform`, HSTS limité au domaine de production. Le routeur ne change pas le comportement des services historiques. La prévisualisation est une copie `noindex, nofollow`, jamais une fusion ni une production.
