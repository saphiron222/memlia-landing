# Intentions, mots-clés et migration — 15 octobre 2026

## Mesures et portée

DataForSEO REST configuré dans l’environnement : Google Ads France / français, lot de 28 expressions ; six SERP Google France / français, ordinateur, profondeur demandée 10. Réponses brutes et synthèse dans les sources externes `hub-robots/2026-10-15/recherche/` : `volumes.json`, `serp-1.json` à `serp-6.json`, `seo-summary.json`. Coût réellement renvoyé : 0,102 $ (0,09 + 6 × 0,002), journalisé. Le contrôle préalable estimait 0,05 $ pour Ads ; le lot a été facturé 0,09 $, sous le plafond disponible. Aucun volume inventé.

`null` reste inconnu : il ne signifie pas zéro. « robot comptable » 50 / mois et « automatisation cabinet comptable » 10 sont génériques ; « annuaire facturation électronique » 22 200 et « attestation vigilance urssaf » 4 400 visent largement une consultation ou une démarche officielle. Ces volumes ne deviennent pas ceux d’un robot Memlia. Les variantes ne sont pas additionnées.

Les six SERP (« robot cabinet comptable », « automatisation cfe cabinet comptable », « robot tva cabinet comptable », « suivi declarations fiscales cabinet comptable », « attestation fiscale robot », « anonymisation documents cabinet comptable ») sont fragmentées : produits, guides, démarches et résultats peu spécifiques. Aucune paire ne partage d’URL parmi les résultats organiques renvoyés. Ce petit relevé ne prouve pas un regroupement de tous les mots-clés du catalogue. Les filtres sont donc des besoins métier éditoriaux ; les vingt et une intentions distinctes reposent sur leurs tâches et livrables.

## Répartition des intentions

- `/automatisation-cabinet-comptable` : comparer et choisir des routines prises en charge ; définition du robot dès l’introduction. Conservation de l’URL historique : pas de second hub, pas de migration sans raison.
- `/automatisation/<robot>` : une tâche et sa sortie précise, preuve fictive, accès et exceptions, manière de commencer. L’expression primaire de chaque fiche est dans `robot.seo.requete`, projetée dans le contrat d’intention.
- `/agents-ia` et ses futures fiches : métier du cabinet et ensemble de tâches. Les gabarits validés sont conservés ; aucune route neuve d’agent non implémentée n’est liée.
- Les douze services existants : tâches détaillées déjà publiées, conservées. Le service facture électronique concerne les factures reçues ; l’annuaire, les mandats et les fiches DGFiP ont des sorties différentes. Le reporting FEC ne remplace pas la fiche évaluation/transmission. L’anonymisation multi-format de service se distingue de l’outil gratuit de pseudonymisation CSV/FEC.
- Articles et guides : apprendre, résoudre une procédure et comprendre une règle. Aucun corps scellé n’est modifié pour le chantier ; le maillage existant par données et gabarits continue.

Lecture blog-cannibalization locale : titres, requêtes réservées et ouvertures des contenus rapprochés des nouvelles intentions. À différencier, sans fusion : dettes / dépôts / situation TVA ; anonymisation de service / outil de pseudonymisation ; reporting FEC / évaluation ; annuaire / collecte de factures électroniques. Chaque frontière est expliquée dans les FAQ et les liens voisins. Contrôle instrumenté initial : 361 URL, 443 déclarations croisées, aucun conflit non motivé.

## Personnes et parcours

Associé : reconnaître une routine à confier et le modèle de devis. Responsable de pôle : vérifier le lot, les accès et les exceptions. Collaborateur : voir exactement le fichier ou la pièce reçue et les cas à reprendre. Le catalogue mène directement à chaque fiche ; chaque fiche revient au hub et à ses voisins, puis au contact avec une sélection facultative. Aucune définition ne remplace les livrables.

## Migration et balises

`migration.json` inventorie les 12 services publiés. Tous sont conservés, sans collision de slug ni redirection. Les anciennes ancres du hub sont cartographiées dans la recette finale. Les liens commerciaux qui pointent son URL restent valides ; les libellés de navigation, pages et export assistants prennent le nom du catalogue.

Le sitemap accepte les routes robots depuis la source typée, sans confondre leur présence avec le statut de publication des services historiques. Hub : CollectionPage + ItemList + BreadcrumbList ; fiche : WebPage + Service + BreadcrumbList, fournisseur relié à l’Organization existante. Aucun robot n’est une Person ou une SoftwareApplication ; aucune FAQPage, offre de prix ou note n’est émise.

Les images de restitution 1200×630 sont rendues depuis les quatre cas de la donnée, avec un manifeste de source. Le pipeline social existant fabrique ensuite les JPEG sous `/social/`. Canonical absolue, H1 unique, titre social identique au H1, description unique. La copie de prévisualisation reste `noindex, nofollow`.
