# Recette : harmonisation du bento

Carte `t_0a859fbf`, 10 septembre 2026. Implémentation terminée, soumise à revue Claude puis validation esthétique de Kevin. Aucun feu vert production.

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

- Section `--surface-page` (#fcfbf7), cinq cartes `--surface-feuille` (#fffefb), titres `--texte-fort`, corps `--texte-2`.
- Aucun voile vert conservé : les sections voisines ne justifient pas un aplat supplémentaire pour la carte principale. Sa largeur et son titre assurent déjà la hiérarchie.
- Cinq `Picto.astro` conservés à **24×24 px**, trait **1,5** sur la grille native24. Même couleur `--picto-repos`, reprise des garanties et de la FAQ.
- Cinq conteneurs **48×48 px**, rayon `--r-pastille` (10px), fond `--surface-page`, aucune bordure ni séparation ni soulignement.
- Suppression des cinq traitements autonomes : transparent principal, bouclier bordé, rapprochement scindé, suivi souligné, main mint. Suppression des deux `color-mix` secondaires.
- Structure inchangée : cinq articles, un principal pleine largeur puis2×2 à768+, une colonne mobile. Même famille d'icônes, même ordre, titres et descriptions strictement identiques.
- Les icônes réduites rendent les cartes moins hautes : c'est une conséquence intentionnelle du rythme demandé, pas une conservation des hauteurs au pixel. Colonne d'icône principale ajustée144→48px ; espace icône/texte secondaire28→20px. Aucun changement de grille, de typographie, de contenu ou de largeur de carte.
- Méthode en quinconce, DOM texte puis image, alt et médias intacts. Hero, CTA, navigation, légaux, SEO et toutes les autres sections inchangés.

La demande de préservation prime sur les prescriptions génériques des skills : Fraunces, thème clair de marque, famille Picto maison et quatre étapes en quinconce ne sont pas refondus. Ni photographies nouvelles ni faux écrans ajoutés.

## Mesures exécutées

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
- Les contrats navigateur mesurent les couleurs résolues via les alias CSS, les cinq dimensions/contours/fonds/alignements, l'absence de pseudo-éléments décoratifs, la taille SVG et le trait. Le contrat source interdit aussi un color-mix qui ne serait pas visible au breakpoint échantillonné.
- Comparaison indépendante avant/après : textes des30cartes et24étapes identiques ; DOM statique hors bento identique après exclusions **comptées** (1section,1blocCSS,366attributs de portée Astro de chaque côté).
- L'exclusion du CSS compilé ne vaut pas preuve de son innocuité : contrôle Git complémentaire imposant que **seul Usages.astro** change dans `src` et `public`, autres sources et médias inchangés. Méthode contrôlée aussi par géométrie dans la suite héritée.

### Contrastes calculés sur les couleurs réellement rendues

| Élément | Rapport |
|---|---:|
| Titres / fond de carte | 16,16:1 |
| Corps / fond de carte, alpha composé | 5,61:1 |
| Pictogrammes décoratifs / fond de pastille | 2,56:1 |

Le texte respecte AA. **Les pictogrammes n'atteignent pas3:1** : ils reprennent volontairement le jeton décoratif de repos du site, sont `aria-hidden`, non interactifs, sans information exclusive (les titres portent le sens). Aucune conformité3:1 ni conformitéWCAG exhaustive n'est revendiquée pour eux. Aucun vert vif `--accent` sur crème.

## Passe écran

Captures depuis l'origine de la page, images décodées, polices chargées, reduced-motion ; découpe aux coordonnées DOM, sans masquer la navigation fixe. Avant : pleine page et crop1440 inspectés. Après local : pleine page1440, crop1440 et375 inspectés. Preview finale : pleine page1440 et crop375 inspectés ; comparaison côte à côte1440 relue.

Verdict : le bento ne constitue plus un îlot d'aplats mint ; les cinq pictogrammes sont secondaires et homogènes, le suivi n'évoque plus un état actif. Les cinq cartes mobiles sont complètes, sans chevauchement ; le titre long « Rapprocher et synthétiser » se répartit normalement sur deux lignes. Continuité visuelle avec la section processus avant et méthode après confirmée sur pleine page.

Réserves visibles : icônes volontairement pâles ; microtextes des images de preuve restent petits, hors périmètre. Les espacements des autres sections et le lecteur natif ne sont pas touchés. Pas de Safari/iOS physique ni lecteur d'écran testé. Validation esthétique finale réservée à Kevin.

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

Revue croisée Claude demandée sur la même carte, puis validation Kevin. Aucune sous-revue déléguée créditée : la lecture courte du harnais n'a pas rendu de synthèse exploitable. Code mort hérité signalé dans la recette amont, non supprimé.

Auto-évaluation : exactitude4/5 (périmètre et tests prouvés, causalité des variations Lighthouse non établie) ; complétude4/5 (acceptance d'implémentation couverte, validation esthétique aval) ; clarté4/5 (rapport détaillé, pictos pâles explicités) ; actionnabilité4/5 (preview et archive disponibles, accord production requis) ; concision4/5 (preuves volumineuses mais isolées du résultat). Amélioration prioritaire : jugement esthétique Kevin sur la discrétion des pictos, sans rouvrir les autres sections.
