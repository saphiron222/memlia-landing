# Agents IA et compatibilités communes — finalisation du 15 octobre 2026

La version robots et pages commerciales Codex est la référence choisie par Kevin. Le socle Claude `03acf961` est repris dans `site/agents-robots-integrations` depuis `54e37be6`, sans modifier le checkout Claude ni fusionner main. Le diff interrompu et les fichiers temporaires ont une sauvegarde durable avec SHA.

## Ce que livre le candidat

- `/agents-ia` : douze agents, six sections identiques au hub robots, mêmes cartes, figurines, bande verte, espacements et filtres natifs sans JavaScript. Les styles du hub et des fiches sont partagés avec les robots.
- Neuf fiches complètes : comptabilité, juridique-fiscal, finance, commercial, communication, relation client, gestion du cabinet, RH, protection des données. Trois livrables, fonctionnement en trois étapes, tâches/outils, comparaison, règle sombre, voisins, cinq ou six FAQ, trois points de départ contact.
- Salomé mène à la paie, Aude à l’accueil CAC et Octavie aux compatibilités. Leur destination les identifie. Octavie présente son propre rejeu ; les démonstrations de Salomé/Aude restent dans les données, conformément au cadrage.
- `/integrations` : catalogue commun des robots et agents, quinze domaines, 365 cartes de logiciels, recherche accessible avec état vide, logos locaux et guides conservés. Aucun total de logiciels affiché, aucun badge de disponibilité ni lien commercial vers les éditeurs. Les sources officielles demandées par Kevin conservent leur bande dédiée et leurs logos.
- Les choix de contact des agents réutilisent la sélection facultative existante : identifiant autorisé en stockage local de session, usage unique, aucun paramètre personnel d’URL, repli sans JavaScript et stockage bloqué. L’API valide la même liste et n’insère que le libellé canonique dans le message. Pas de migration D1 nécessaire.
- Les articles scellés restent intacts : maillage vers l’agent par leur gabarit et leur famille. Les services et guides reçoivent le même renvoi. Le lien supprimé de Méthode est remplacé par une migration explicite vers la tâche de Balthazar, vérifiée par AST et 40 témoins négatifs.

## Sources et actifs

- Source typée des agents : `src/data/specialistes.ts` et `src/data/specialistes/*.ts`.
- Source des compatibilités : `src/data/connecteurs.ts` ; recherche/logo, guides et JSON-LD dérivés.
- Figurines validées, originaux et prompts : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/hub-agents-ia/figurines-2026-10-15/`.
- Production : `public/agents/<slug>-{128,256,512}.{webp,avif}`, 72 fichiers. Manifeste de dimensions/poids/SHA : `figurines-production.json`. Aucune nouvelle génération prétendue : ce sont les dérivés des figurines déjà validées.
- Logos : `public/logos/`, 352 fichiers. `logos-manifest.json`, `logos-remplacements.json`, `logos-audit.md`. 38 décisions d’apport ou de remplacement officiels, contrôle des 299 bruts et de la sécurité SVG. Treize noms seuls documentés : quatre cartes État, RNE, BODACC, Chorus Pro, modèle de registre CNIL et Liasse 360, puis Air France, e-Circu, e-Recup et FollowApp après second audit. Aucun faux logo ni logo générique substitué.
- Sauvegarde Claude et planches logos : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/hub-agents-ia/reprise-codex-2026-10-15/`.
- Recherche, intentions et revue métier : `docs/strategy/site-v3/hub-agents-ia/`, notamment `AGENTS-CONTENU.md`, `CONNECTEURS.md`, `MOTS-CLES.md`, `FACT-CHECK.md` ; revue indépendante dans `revue-independante-codex.md`.
- Nouveau relevé Google réel : `docs/strategy/site-v3/mesures/titres-intent-2026-10-15.json` (33 requêtes), sans volume inventé ni affaiblissement des gardes.

## Adaptations décidées

- La copy suit la charte v8 : catalogue, déploiement et adaptation dans le cabinet, maintenance, construction sur mesure si nécessaire. Les H1 des fiches ont été raccourcis ; les métiers conservent leur intention SEO.
- Le héros agents n’a plus son ancien cadre HTML décoratif. Son trio reprend les figurines des cartes ; les démonstrations restent des tables HTML. Exemptions d’images nommées, page par page, documentées dans le contrat du site.
- Les métadonnées des quatre pages commerciales conservent les ouvertures v8 ; l’import de tâche 8 avait ramené les anciennes ouvertures, corrigées sans changer les textes validés.
- Le témoin de l’accueil est renouvelé uniquement pour le lien du catalogue agents désormais disponible (`/methode#cadrer` devient `/agents-ia`, action « Explorer les agents IA »). Les témoins de mutation restent actifs.
- Le mobile conserve les mots des décisions sur une ligne. La FAQ est un accordéon HTML natif, utilisable sans script ; avec JavaScript, une ancre de question ouvre son panneau.

## Recette

Les résultats finaux et la prévisualisation sont consignés en fin de ce document après la recette. Les captures de `visuel/` sont celles du candidat réellement rendu ; elles ne constituent pas des captures client ou produit.

### Résultats du candidat

- Régénération des surfaces et reçus, compilation Astro : 118 pages ; 110 exports Markdown vérifiés ; 99 images sociales.
- 227 contrôles Node ciblés réussis : données, routage, familles, contact, logos, schémas, CSP et livraison, robots, témoins et contrats.
- 137 parcours navigateur couverts, dont 134 verts au premier passage et trois anciens sélecteurs/parcours repris. Les douze contrôles des guides repassent tous après correction (deux liens Clôture rétablis dans la section existante du hub robots et sélecteurs séparant recherche de guide/logiciel).
- 13 contrôles complémentaires des cartes agents et des grilles de logiciels réussis. La variante de carte du catalogue garde la coque commune, avec bandeau bord à bord et corps à 24 px, comme les robots.
- CSP : neuf fiches et hub parcourus sur mobile/bureau, zéro appel hors origine, zéro violation et scripts/navigation actifs ; tests négatifs des API réseau et scripts inline conservés.
- Contrat de page, audit services, blog et propriété des requêtes : verts. 22 contrôles de positionnement et analyse finale des exports verts.
- Contrôle des 19 destinations affectées : 1 217 liens internes, 554 images et toutes les images sociales, aucune absence ni ancre cassée.
- Lighthouse mobile du rendu indexable local : hub agents 100/100/100/100 ; fiche Comptabilité 100/100/100/100 ; compatibilités 99/100/100/100. Ordre : performance/accessibilité/bonnes pratiques/SEO. Ce sont des mesures de laboratoire, pas des données de terrain ni des scores sur la preview noindex.
- Revue indépendante de source/métier et contact : PASS après correction des quatre constats. Inspection visuelle réelle CUA à 375 et 1440 ; neuf captures dans `visuel/` ; registre de preuve du skill validé.

Aucune collecte réelle et aucun formulaire de contact réel soumis pendant cette recette. CI globale GitHub non exécutée localement, conformément aux instructions du dépôt ; ces contrôles ciblés ne constituent pas un verdict de CI sur main.

### Relecture de livraison des marques et du réseau

Un défaut de correspondance hérité a été trouvé après le premier audit : l’empreinte était correcte mais le logo Bluebiz figurait sous Air France. Le second contrôle visuel a corrigé ce cas, les marques Caseware et trois identifiants ambigus. Registre des rejets et preuves conservés ; aucun quota de logos ne prime sur l’identité. État final : 352 logos / 13 noms seuls.

Le hub commun contenant le rejeu d’Octavie réutilise aussi la Function/CSP des agents : suppression de la balise Insights de l’hébergeur, connexions fermées et scripts de l’origine. Les guides conservent leurs propres routes. Les 27 tests CSP de la première preview ont passé ; le hub commun est ajouté à la recette finale distante.

La reprise finale des marques passe 17 contrôles Node (logos/source/CSP) et 42 contrôles navigateur, puis le témoin de présence des trois routes repasse après adaptation explicite de son assertion. La vérification distante finale ajoute `/integrations` aux dix routes agents.
