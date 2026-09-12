# Recette : harmonisation du bento

Carte `t_0a859fbf`, recette initiale du 10 septembre 2026, corrigée et recoupée le 12 septembre par `t_c0ca3c23`. Go visuel de Kevin consigné sur la carte : la discrétion actuelle est acceptée. Revue technique aval encore requise ; aucun feu vert production.

## Candidat

- Base demandée : `a1f817d1624336e707780a3a14bec20de4ff5faf`, produit antérieur `fef42bf4f90eda2448911703ffbf536cda528932`.
- Produit corrigé : `b9d800a9e4df437a7e6557bc712d92d5c732d731`.
- Git : `site/harmonisation-bento` ; seul fichier produit modifié : `src/components/sections/Usages.astro`.
- Preview exacte : **https://57e995b9.memlia.pages.dev**.
- Alias : https://preview-harmonisation-bento.memlia.pages.dev.
- Cloudflare : branche `preview-harmonisation-bento`, déploiement `57e995b9-86c1-4b61-9998-a27280315aac`, environnement **Preview**, source `b9d800a` relus dans Wrangler.
- Aucun push, aucune fusion main, aucune production. Six identités de déploiements production avant/après identiques, seul le champ d'âge `Status` est exclu et compté (12 champs).

## Décisions et périmètre

Redesign-preserve B2B réglementé, calme. Variance 5, mouvement 2, densité 3. Aucun ajout de dépendance, nouvelle couleur, image ou animation.

- Section `--surface-page` (#fcfbf7), cinq cartes `--surface-feuille` (#fffefb), titres `--texte-fort`, corps `--texte-2`. Carte/section : **1,027:1**, séparation ton sur ton très discrète, pas un contour nettement contrasté.
- Aucun voile vert conservé : les sections voisines ne justifient pas un aplat supplémentaire pour la carte principale. Sa largeur et son titre assurent déjà la hiérarchie.
- Cinq `Picto.astro` conservés à **24×24 px**, trait **1,5** sur la grille native24. Même couleur `--picto-repos`, reprise des garanties et de la FAQ.
- Cinq conteneurs **48×48 px**, rayon `--r-pastille` (10px), fond `--surface-page`, aucune bordure ni séparation ni soulignement. Pastille/carte : **1,027:1** ; dimensions et arrondis existent dans le DOM, mais le fond est presque confondu avec la carte. Cette présence technique ne prouve pas une perceptibilité minimale.
- Suppression des cinq traitements autonomes : transparent principal, bouclier bordé, rapprochement scindé, suivi souligné, main mint. Suppression des deux `color-mix` secondaires.
- Structure inchangée : cinq articles, un principal pleine largeur puis2×2 à768+, une colonne mobile. Même famille d'icônes, même ordre, titres et descriptions strictement identiques.
- Les icônes réduites rendent les cartes moins hautes : c'est une conséquence intentionnelle du rythme demandé, pas une conservation des hauteurs au pixel. Colonne d'icône principale ajustée144→48px ; espace icône/texte secondaire28→20px. Aucun changement de grille, de typographie, de contenu ou de largeur de carte.
- Méthode en quinconce, DOM texte puis image, alt et médias intacts. Hero, CTA, navigation, légaux, SEO et toutes les autres sections inchangés.

La demande de préservation prime sur les prescriptions génériques des skills : Fraunces, thème clair de marque, famille Picto maison et quatre étapes en quinconce ne sont pas refondus. Ni photographies nouvelles ni faux écrans ajoutés.

## Mesures exécutées le 10 septembre (historique)

| Vérification | Résultat |
|---|---:|
| `npm ci` | audit0 vulnérabilité |
| `npm run check` | 0erreur,0warning,1hint hérité dans lighthouse.mjs |
| `npm run build` | 7pages, sortie0 |
| Python, inclus au build | **34/34**, dont2nouveaux contrats |
| Images, inclus au build | **23/23** |
| Rendu indépendant des médias existants | **9PNG +21actifs** identiques au sceau |
| Playwright local après restauration des poisons | **76/76**, 0sauté/0flaky |
| Playwright preview exacte | **76/76**, 0sauté/0flaky |
| Témoins négatifs | **7/7** divergences rejetées séparément |
| HTTP preview | **12/12**, contenus/stats attendus, noindex des réponses200 |
| Médias HTTP | **25/25**, SHA/octets identiques au local, manifeste et ancêtre média |
| Captures | **12avant +12locales +12preview**, plus2comparaisons |
| Largeurs mesurées | **320/375/768/1024/1440/1920** |
| Mesures cartes | **30locales**, mêmes30distantes |
| Comparaison rendu local/preview | **6/6** relevés complets identiques |
| Overflow | 0débordement document ; tous descendants bento et méthode contrôlés |

### Chaîne de preuve et témoins

- Rouge préalable :6tests navigateur, fond de section transparent au lieu de l'alias attendu ;2tests Python rejettent les variantes `.use-mark`, gradients et `color-mix`.
- Après correction, les sept anciens traitements sont réintroduits séparément dans le HTML construit : cinq conteneurs et deux fonds. Chacun fait échouer une assertion de style calculé sur le test1440 ; un simple plantage du harnais n'est pas accepté. Restauration du fichier par `finally`, SHA de restauration enregistré, puis suite complète rejouée.
- Les contrats navigateur vérifient les couleurs résolues via les alias CSS, les dimensions48×48, l'absence de pseudo-éléments décoratifs, la taille SVG24×24 et le trait1,5. Les bordures, le rayon et l'alignement sont comparés entre les cinq conteneurs : cela prouve leur **uniformité**, pas leur conformité à une valeur attendue ni une perceptibilité minimale. Une même bordure ajoutée aux cinq conteneurs passerait cette comparaison ; les sept témoins couvrent les divergences par carte, pas toute dérive uniforme. Le contrat source interdit aussi un color-mix qui ne serait pas visible au breakpoint échantillonné.
- Comparaison indépendante avant/après : textes des30cartes et24étapes identiques ; DOM statique hors bento identique après exclusions **comptées** (1section,1blocCSS,366attributs de portée Astro de chaque côté).
- L'exclusion du CSS compilé ne vaut pas preuve de son innocuité : contrôle Git complémentaire imposant que **seul Usages.astro** change dans `src` et `public`, autres sources et médias inchangés. Méthode contrôlée aussi par géométrie dans la suite héritée.

### Contrastes calculés sur les couleurs réellement rendues

| Élément | Rapport |
|---|---:|
| Titres / fond de carte | 16,16:1 |
| Corps / fond de carte, alpha composé | 5,61:1 |
| Pictogrammes décoratifs / fond de pastille | 2,56:1 |
| Fond de pastille / fond de carte | **1,027:1** |
| Fond de carte / fond de section | **1,027:1** |

Le texte respecte AA. **Les pictogrammes n'atteignent pas3:1** : ils reprennent volontairement le jeton décoratif de repos du site, sont `aria-hidden`, non interactifs, sans information exclusive (les titres portent le sens). Aucune conformité3:1 ni conformitéWCAG exhaustive n'est revendiquée pour eux. Aucun vert vif `--accent` sur crème.

Les deux rapports de surfaces sont identiques : luminance sRGB WCAG de #fcfbf7 et #fffefb, rapport non arrondi **1,026659863288983:1**. Il ne s'agit pas d'une mesure d'un seuil perceptif humain. Les surfaces restent presque confondues ; aucun test navigateur existant ne garantit leur distinction visuelle minimale. Le go visuel accepte ce rendu, sans autoriser une modification du composant.

## Passe écran

Captures depuis l'origine de la page, images décodées, polices chargées, reduced-motion ; découpe aux coordonnées DOM, sans masquer la navigation fixe. Avant : pleine page et crop1440 inspectés. Après local : pleine page1440, crop1440 et375 inspectés. Preview finale : pleine page1440 et crop375 inspectés ; comparaison côte à côte1440 relue.

Verdict : le bento ne constitue plus un îlot d'aplats mint ; les cinq pictogrammes sont secondaires et homogènes, le suivi n'évoque plus un état actif. Les cinq cartes mobiles sont complètes, sans chevauchement ; le titre long « Rapprocher et synthétiser » se répartit normalement sur deux lignes. Continuité visuelle avec la section processus avant et méthode après confirmée sur pleine page.

Réserves visibles : icônes volontairement pâles ; fonds des cartes et des pastilles presque confondus avec leur voisin (**1,027:1**), leurs limites ne doivent pas être présentées comme nettement perceptibles. Microtextes des images de preuve toujours petits, hors périmètre. Les espacements des autres sections et le lecteur natif ne sont pas touchés. Pas de Safari/iOS physique ni lecteur d'écran testé. Discrétion acceptée par le go visuel de Kevin consigné après cette passe initiale.

## Lighthouse : ne pas confondre la preview avec un vert global

| Cible | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| Local mobile | 100 | 100 | 100 | 100 |
| Local desktop | 100 | 100 | 100 | 100 |
| Preview mobile initiale / répétition | 90 /89 | 100 | 96 | 69 |
| Preview desktop initiale / répétition | 68 /99 | 100 | 96 | 69 |
| Ancienne preview desktop, témoin contemporain | 99 | 100 | 96 | 61 |

Mobile distant : LCP2540 puis2827ms, cible2500ms dépassée. Desktop distant :3970 puis839ms ; témoin antérieur821ms. Le premier résultat n'est pas effacé. La variabilité desktop est mesurée, sa cause réseau n'est pas prouvée ; pas de diagnostic causal inventé pour le mobile.

Les commandes distantes sortent1 : seuil95 de performance dépassé vers le bas selon le run, SEO noindex obligatoire. Bonnes pratiques96 : erreurs CORS du beacon Cloudflare Insights effectivement lues dans les JSON. Pas de retrait de noindex pour verdir la preview. Pas de mesure INP terrain. Cette carte corrige le bento, ne certifie pas la performance du site entier.

## Reproduction et livrables

Dossier `.qa/harmonisation/`, archive `.qa/harmonisation-bento-preuves.zip` ; rapports Lighthouse inclus dans l'archive.

À ouvrir :

- `preview/page-1440.png` : pleine page desktop.
- `preview/bento-1440.png` : crop bento desktop.
- `preview/page-375.png` et `preview/bento-375.png` : mobile.
- `avant-apres-1440.png` et `avant-apres-375.png` : **avant à gauche, après à droite**.

```sh
npm run check
npm run build
npm run test:proof-render
npm run preview -- --host 127.0.0.1 --port 4371
QA_URL=http://127.0.0.1:4371 npm run test
node scripts/capture-bento-harmonisation.mjs
node scripts/verify-bento-harmonisation.mjs
node scripts/verify-bento-witnesses.mjs
QA_URL=https://57e995b9.memlia.pages.dev npm run test
QA_URL=https://57e995b9.memlia.pages.dev node scripts/verify-preview.mjs
QA_URL=https://57e995b9.memlia.pages.dev node scripts/verify-redesign-media.mjs
QA_URL=https://57e995b9.memlia.pages.dev QA_OUTPUT=.qa/harmonisation/preview node scripts/capture-bento-harmonisation.mjs
```

`verify-bento-harmonisation.mjs` requiert le témoin `baseline.html` et les mesures `before/` inclus dans l'archive, produits sur le build exacta1f817d. Ne jamais les remplacer par le candidat. Le préparateur preview imprime un ancien nom de branche : le déploiement a explicitement utilisé `--branch preview-harmonisation-bento`, confirmé par relecture distante.

## Revue et auto-évaluation

Revue historique Claude (session `7b2481a5-d2ff-4c04-837a-e442406eebae`) et commentaire722 de `t_0a859fbf` relus : code/local verts, correction rédactionnelle et recoupement distant requis. Aucun nouvel appel au CLI Claude. La revue aval précréée `t_0a859fbf`, désormais assignée à `dev`, reprend le candidat intact après BENTO-R. Aucune sous-revue initiale créditée : la lecture courte du harnais n'avait pas rendu de synthèse exploitable. Code mort hérité signalé dans la recette amont, non supprimé.

Auto-évaluation initiale : exactitude4/5, complétude4/5, clarté4/5, actionnabilité4/5, concision4/5. La réserve documentaire sur les surfaces est corrigée ci-dessus ; la causalité Lighthouse n'est toujours pas établie. Le go visuel ne remplace ni la revue technique aval ni l'accord production.

## Recoupement BENTO-R — 12 septembre 2026

Sujet : HEAD `92b605d1`, branche `site/harmonisation-bento`, produit `b9d800a9e4df437a7e6557bc712d92d5c732d731`, preview exacte **https://57e995b9.memlia.pages.dev**. Worktree propre avant intervention. Seul fichier versionné modifié par BENTO-R : la présente recette ; aucun composant, test ou script produit changé. Aucun commit, push, fusion ou déploiement pendant ce recoupement.

| Commande / contrôle rejoué | Résultat du 12 septembre |
|---|---|
| `npm run check` | sortie0 ; 81 fichiers, 0 erreur, 0 warning, 1 hint hérité |
| `npm run build` | sortie0 ; 7 pages, Python **34/34**, images **23/23** |
| `npm run test:proof-render` | sortie0 ; **9 PNG / 21 actifs** conformes au sceau |
| Identité serveur local4371 / `dist/index.html` | HTTP200, octets identiques ; SHA256 `ab377b1ec84e369d6939a570b3d4489ca06bca79e4df7721dc2204244543b87a` |
| `QA_URL=http://127.0.0.1:4371 npm run test` | sortie0 ; **76/76**, 0 échec, 0 sauté, 0 flaky |
| `QA_URL=https://57e995b9.memlia.pages.dev npm run test` | sortie0 ; **76/76**, 0 échec, 0 sauté, 0 flaky |
| `verify-preview.mjs` sur la preview exacte | sortie0 ; **12/12** routes équivalentes au build, 11 réponses200 avec `X-Robots-Tag` noindex, 1 vraie404 ; **6 blocs Analytics** exclus et comptés |
| `verify-redesign-media.mjs` sur la preview exacte | sortie0 ; **25/25** médias HTTP200/noindex, SHA256 et octets identiques au local, manifeste et ancêtre `76214ba` ; **1 entrée documentaire non publique exclue** |
| `capture-bento-harmonisation.mjs` sur la preview exacte | sortie0 ; **12 captures**, **6 largeurs** 320/375/768/1024/1440/1920, **30 cartes** mesurées ; aucun overflow document/bento |
| Recalcul indépendant Python depuis les couleurs DOM distantes | **30/30** paires pastille/carte et carte/section : **1,026659863288983:1**, soit **1,027:1** |

Les contrats bento des six largeurs sont inclus dans les76 tests distants. Les limites d'assertion précisées plus haut demeurent : leur vert ne prouve pas une perceptibilité minimale.

Incident de harnais conservé : tentative de lancer une seconde preview sur4387 refusée par Astro (serveur4371 déjà actif), puis sonde4387 en connexion refusée ; aucun test local crédité à cette tentative. Rapport distant copié à tort dans le dossier local après cet échec retiré ; suite locale réellement relancée sur4371 seulement après vérification des octets du candidat, résultat76/76 ci-dessus. Aucun serveur tiers arrêté ou remplacé.

Passe écran neuve : pleine page1440 et crop375 inspectés ; cinq cartes mobiles complètes, titre long réparti sur deux lignes, pictogrammes linéaires homogènes, pas de chevauchement visible. Continuité avec processus et méthode conservée ; surfaces/pastilles ton sur ton très discrètes, sans prétendre qu'un seuil perceptif est mesuré. Les observations automatiques d'image ne remplacent pas les styles DOM mesurés (notamment aucune bordure sur les pastilles).

Preuves du présent rejeu : `.qa/bento-r/2026-09-12/` — `local/` (check/build/rendu et Playwright), `remote/playwright.json`, `preview-http.json`, `remote-media.json`, `screens/measurements.json`, `contrast.json` et captures `screens/page-1440.png`, `screens/bento-375.png`. L'archive historique n'est pas actualisée ; le nouveau lot est distinct.

**Non rejoués** : Lighthouse, sept témoins négatifs et comparaison avant/après du10 septembre ; leurs résultats restent historiques, pas recertifiés. Les réserves de performance mobile restent ouvertes. Cette phase corrige la recette et ferme le recoupement distant demandé, pas la performance globale ni une autorisation de production. Suite : revue technique déjà reliée `t_0a859fbf`, sans doublon de revue sur BENTO-R.
