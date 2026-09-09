# Recette : capacités et méthode

Carte `t_7c202a39`, 9 septembre 2026. Implémentation soumise à revue croisée, puis validation de Kevin. Aucune validation humaine revendiquée.

## Candidat et preview

- Base exacte : `76214ba85602b88689e82fb235069dc5baa849bd`.
- Commit produit : `fef42bf4f90eda2448911703ffbf536cda528932`.
- Branche Git : `site/redesign-capacites-methode`.
- Preview exacte : **https://be1eb235.memlia.pages.dev**.
- Branche Cloudflare : `preview-redesign-capacites-methode`.
- Déploiement : `be1eb235-7984-439a-9292-c8bea8c9cb9b`, environnement **Preview**, source `fef42bf`, relus avec Wrangler.
- Aucun push, aucune fusion main, aucune production. Liste des productions avant/après identique.
- Les commits suivants de passation ne modifient que les outils de recette et la documentation ; la preview reste le produit ci-dessus.

## Direction et périmètre

Redesign-preserve B2B réglementé, calme et démonstratif. Variance 5, mouvement 2, densité 3. Charte existante conservée : crème `#fffefb`, papier `#fcfbf7`, encre `#231f20`, vert `#27b657`, voile `#eafaef`, vert de texte `#176f37`. Fraunces pour les titres, Hanken Grotesk pour les corps ; rayon des cartes 16 px. Aucun ajout de dépendance, nouveau média, promesse commerciale ou CTA.

- **Capacités** : cinq articles avec h3, premier bloc pleine largeur, quatre suivants en 2×2 dès 768 px. Une colonne en dessous. Pictogrammes existants, repères feuilles/bouclier/rapprochement/flux/main, surfaces sobres différenciées. Pas de tableau, numéros, badges, petites étiquettes ou liste à filets. Titres et corps conservés.
- **Méthode** : quatre rangées indépendantes, deux colonnes égales dès 1024 px, image gauche/droite/gauche/droite. DOM toujours texte puis image, identique à l'ordre mobile. Textes et « Étape 1 » à « Étape 4 » conservés, sans les anciennes chips ni pictogrammes de chips. Images 04/05/06/07 inchangées, statiques et non interactives.
- **Tout le reste** : aucune modification des routes, hero, vidéo R8, CTA, navigation, styles globaux, SEO, textes légaux, données métier, images ni alt.

La demande explicite de quinconce sur quatre étapes, des libellés « Étape » et de préservation de la charte prime sur les prescriptions génériques des skills (interdiction de zigzag, nouveaux pictogrammes, thème sombre ou nouvelle typographie). Aucun tableau de bord fictif ajouté. Les images fonctionnelles approuvées restent les preuves, pas des images générées de remplacement.

## Diff de copy exact

Suppression sans remplacement de deux paragraphes dans `#usages` :

1. « Exemple de parcours : une information arrive, les contrôles prévus s’exécutent, une exception est signalée, le référent valide. »
2. « Exemples non contractuels, à étudier selon vos sources, règles, exceptions et accès. Ils ne décrivent pas des fonctions prêtes à installer. »

Aucun mot changé dans les cinq titres/corps de capacités ni dans les quatre blocs textuels de méthode. Comparaison DOM automatisée avant/après. Aucun autre garde-fou retiré ; restent notamment validation humaine, proposition vs saisie, jeux fictifs, refus et agrégats jamais nominatifs.

## Résultats exécutés

| Vérification | Résultat |
|---|---|
| `npm ci` | installation réalisée, audit 0 vulnérabilité |
| `npm run check` | 0 erreur, 0 warning, 1 hint préexistant (`lighthouse.mjs:76`) |
| `npm run build` | 7 pages, sortie 0 |
| Python (`test:proof`, inclus au build) | **32/32** |
| Images (`test:images`, inclus au build) | **23/23**, neuf preuves 1600×900 |
| Recalcul indépendant (`test:proof-render`) | **9 PNG et 21 actifs** identiques au sceau, Chromium 153.0.8010.12 |
| Playwright local, serveur frais 4365 | **70/70**, 0 sauté, 0 flaky |
| Playwright preview exacte | **70/70**, 0 sauté, 0 flaky |
| Témoins négatifs ciblés | **4/4** rejetés, build restauré octet pour octet |
| HTTP preview | **12/12** statuts/contenus attendus, noindex sur les réponses 200 |
| Médias HTTP | **25/25** : octets/SHA égaux au local, au manifeste et au parent exact, noindex |
| Captures | **20 locales + 20 distantes** ; deux sections à six largeurs et quatre détails d'étapes à375/1440 |
| Géométrie locale/distance | **24/24** relevés d'images méthode identiques (4×6), alt et dimensions intrinsèques inclus |
| Débordement horizontal | aucun dans les deux sections ni sur la page aux **320/375/768/1024/1440/1920** |
| Préservation hors périmètre | HTML statique identique après exclusions comptées : **2 sections, 1 bloc CSS, 329 attributs de portée Astro**, mêmes comptes avant/après |

Le contrôle de débordement ne se contente pas de `scrollWidth` du document (le body a déjà `overflow-x:clip`) : tous les descendants des deux sections sont contrôlés, limites gauche/droite et débordements internes. Le test mesure les deux colonnes, leur largeur égale, leurs centres verticaux et leur ordre réel ; il ne conclut pas d'une simple classe CSS.

### Tailles réellement rendues des images méthode

| Viewport | Largeur image |
|---:|---:|
| 320 | 286 px |
| 375 | 341 px |
| 768 | 638 px |
| 1024 | 479 px |
| 1440 | 647 px |
| 1920 | 647 px |

Le conteneur conserve son plafond existant. Sur desktop, la boîte image occupe exactement la moitié de la rangée et la boîte texte l'autre moitié ; l'espacement interne est dans le texte. Les images ne sont ni recadrées ni étirées.

### Ce qui aurait rougi

- Rouge préalable sur le parent : absence des cinq h3 du bento et présence de la phrase interdite dans l'oracle Python. Le premier build exploratoire `astro build` non nettoyé a également fait rougir le contrôle de briefs ; le vrai `npm run build` exécute le nettoyage attendu, puis les 32 tests passent.
- Réinsertion de la phrase supprimée : test navigateur rouge.
- Réinsertion d'une petite annotation : rouge.
- Grille desktop forcée sur une colonne : rouge.
- Retour des images 1/3 à droite : rouge.
- Chaque poison opère seulement sur `dist/index.html`, avec restauration `finally`, hash de restauration consigné et suite complète rejouée ensuite.
- Les tests hérités qui exigeaient l'ancienne phrase et toutes les images à droite ont été mis à jour sur le nouvel invariant, pas supprimés. Les cinq autres preuves restent contrôlées selon leur disposition antérieure.

## Écran et accessibilité

Inspection réelle des deux sections à1440 et375, local puis preview. Les cinq cartes sont complètes, les quatre rangées alternent correctement, les quatre étapes mobiles montrent le texte avant l'image ; titres et corps lisibles, pas de chevauchement final ni micro-annotation DOM. Vérification des h3, noms accessibles des articles, alt inchangés, images non focusables, parcours clavier et reduced-motion par les suites.

**Piège de capture corrigé** : `locator.screenshot()` sur une section plus haute que le viewport a incrusté la navigation fixe au milieu de la capture. Les premiers constats de masquage étaient des défauts de capture, pas du produit. Le script capture désormais la page entière depuis son origine, puis découpe aux coordonnées DOM mesurées, sans cacher la navigation ni changer le CSS. Marge inférieure 16 px ajoutée aux exports pour montrer les bords complets. Les quatre captures finales distantes ont été réinspectées.

**Images conservées** : les textes centraux et les grands numéros internes aux compositions de méthode restent ceux du parent, expressément conservés. Les 37 annotations retirées par le parent restent absentes par conservation des octets, contrat Python et recalcul indépendant. Ne pas confondre le contenu central approuvé avec une nouvelle annotation de page. Les microtextes de ces images sont petits sur mobile : aucun zoom ajouté, conformément à la demande. Les alt et les textes extérieurs portent l'explication accessible.

Pas de recette Safari/iOS physique ni de lecteur d'écran effectuée ; pas de conformité WCAG exhaustive revendiquée à partir du score automatique.

## Lighthouse mesuré (laboratoire, pas terrain)

| Cible | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| Local mobile | 100 | 100 | 100 | 100 |
| Local desktop | 100 | 100 | 100 | 100 |
| Preview mobile, première mesure | 94 | 100 | 96 | 69 |
| Preview mobile, répétition | 98 | 100 | 96 | 69 |
| Preview desktop | 99 | 100 | 96 | 69 |

- Mobile distant : LCP 2699 ms au premier passage (cible 2500 ms dépassée), puis 2329 ms ; CLS 0,012 puis0,032 ; TBT0 puis50 ms. Le premier résultat n'est ni effacé ni transformé en vert.
- Local mobile : LCP1879 ms, CLS0, TBT0 ; local desktop : LCP426 ms, CLS0, TBT0.
- SEO69 dû au `noindex` requis. Bonnes pratiques96 : beacon Cloudflare Insights bloqué par CORS, lu dans le rapport. Ne pas enlever noindex ni toucher la navigation/hero pour verdir cette preview.
- Commandes Lighthouse distantes en sortie1 selon le seuil95, rapports conservés ; pas de prétention « tous les indicateurs verts ». INP terrain non mesuré.

## Artefacts et reproduction

Dossier du worktree : `.qa/redesign/`. Archive : `.qa/redesign-capacites-methode-preuves.zip`.

Captures à ouvrir en priorité :

- `.qa/redesign/preview/usages-1440.png`
- `.qa/redesign/preview/usages-375.png`
- `.qa/redesign/preview/methode-1440.png`
- `.qa/redesign/preview/methode-375.png`

Commandes depuis ce worktree :

```sh
npm ci
npm run check
npm run build
npm run test:proof-render
npm run preview -- --host 127.0.0.1 --port 4365
QA_URL=http://127.0.0.1:4365 npm run test
QA_URL=http://127.0.0.1:4365 node scripts/verify-sections-witnesses.mjs
QA_URL=http://127.0.0.1:4365 node scripts/capture-sections-redesign.mjs
QA_URL=https://be1eb235.memlia.pages.dev npm run test
QA_URL=https://be1eb235.memlia.pages.dev node scripts/verify-preview.mjs
QA_URL=https://be1eb235.memlia.pages.dev node scripts/verify-redesign-media.mjs
QA_URL=https://be1eb235.memlia.pages.dev QA_OUTPUT=.qa/redesign/preview node scripts/capture-sections-redesign.mjs
```

`capture-sections-redesign.mjs` utilise `.qa/redesign/baseline.html`, capture du build du parent exact avant modification, incluse dans l'archive. Ne pas remplacer ce témoin par le candidat. Les JSON Playwright local/distant, copy, géométrie, HTTP, médias et les logs rouges sont conservés dans ce dossier ; Lighthouse sous `.lighthouse/`, inclus dans l'archive.

La commande historique `verify-remote-media.mjs` tente désormais de lire une source HTML avec fragment `#flux` comme un fichier binaire : elle a échoué, sans crédit de preuve. Le vérificateur dédié de cette recette compare les 25 fichiers publics téléchargés au parent exact et au manifeste ; le recalcul source/rendu a été joué séparément. Aucun rapport historique n'a été écrasé.

## À la revue

- Validation esthétique par Kevin après revue croisée Claude ; pas de push ni production sans nouveau go.
- Code mort hérité signalé, non nettoyé : anciens styles `.parcours-visuel`, `.parcours-images`, `.parcours-filet` et l'observer de sélection active sans effet visuel sur ces images statiques. Hors demande de suppression du code adjacent.
- Les deux tentatives de sous-revue courte n'ont rendu aucun verdict exploitable (confusion de lifecycle du sous-agent). Elles ne sont **pas** créditées comme revue. La transition Kanban demande une vraie revue Claude.
- Auto-évaluation : exactitude4/5 (preuves mesurées, limites labo explicites), complétude4/5 (critères d'implémentation couverts, validation humaine aval), clarté4/5 (copy inchangée, microtextes internes petits), actionnabilité4/5 (preview et preuves disponibles, pas de livraison production), concision4/5 (rapport détaillé, synthèse courte à Kevin). Amélioration prioritaire : jugement humain de lisibilité des images à375, sans introduire de zoom interdit.
