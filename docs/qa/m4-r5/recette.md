# M4-R5 — recette du candidat latéral

## Verdict : phase acceptée après arbitrage marketing

La recomposition et la preview fonctionnent. L'arbitrage marketing inscrit sur `t_b3d5e4fe` le 09/09/2026 à 10:09 accepte la **lecture globale** des preuves avec l'explication DOM adjacente. Il demande de finaliser le candidat `c2dae8a`, sans recomposer les sources ni ajouter de zoom ou d'interaction. Cette acceptation de périmètre ne certifie pas la lecture exhaustive des microtextes : les sources1600×900 intégrales restent physiquement trop petites à607px, puis286px surmobile320.

Reprise225 sans modification produit : check/build, Python26, images23, Playwright local64 et menu3moteurs45 rejoués ; rapports JSON relus avec zéro échec/ignoré/flaky, HTML4337 identique au dist. Cinquante nouvelles captures distantes aux cinq largeurs, mesures45images :607px/50% à1280,647px/50% à1440, zéro overflow. Deux détails desktop/mobile relus à l'écran, limite des microtextes confirmée. HTTP200/noindex recontrôlé par Chromium (urllib reçoit403). Logs et mesures dans `.qa/m4-r5/resume-225/`. Les suites distantes complètes du tableau ci-dessous restent celles de la passe initiale, pas un nouveau rejeu225.

## Candidat et périmètre

- Worktree `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_f16e5a39`, branche `wt/t_f16e5a39`.
- Commit produit `51de12c`, successeur direct de `f0ff8754b3b1e70f8476abacf9ed6b318707d705`.
- Preview immuable : https://7479ddae.memlia.pages.dev ; alias https://preview-m4-r5.memlia.pages.dev.
- Cloudflare projet `memlia`, branche `preview-m4-r5`, copie `.qa/preview-dist` protégée `X-Robots-Tag: noindex, nofollow`.
- Nouveau composant `ProofRow.astro` : une copie à gauche, une figure à droite dès1024px ; empilement en dessous. Neuf instances réelles, aucun JS ajouté. Bord haut fin, surface discrète, `contain`, ratio16:9, aucune hauteur fixe sur la copie.
- Les compléments longs suivent la ligne principale sans réécriture ; les six garanties restent avec leur titre dans la colonne gauche. Les quatre étapes conservent leur ordre.
- Aucun push, merge main, production ni modification du hero/menu/médias/blog. R8 obligatoire ; aucun retourR7.

## Passe 1 — suites réellement rejouées

| Contrôle | Résultat final |
|---|---:|
| Astro check | 0 erreur, 0 warning, 1 hint historique |
| Build | 7 pages |
| Python unittest | 26/26 |
| Images | 23/23 dont9sources |
| Playwright complet local | 64/64 |
| Menu local Chromium/Firefox/WebKit | 45/45 |
| Playwright complet distant | 64/64 |
| Menu distant Chromium/Firefox/WebKit | 45/45 |

Les15cas menu Chromium sont inclus dans les deux suites : ne pas additionner64et45 comme tests uniques. Zéro ignoré/flaky dans les rapports finaux. Le test mobile historique est désormais ancré sur l'image réelle, pas sur l'ancien wrapper `.step-image` supprimé par le composant commun.

Historique des échecs conservé : rouge préalable1280, puis première passe4/5sur géométrie (ligne contrôle437px) corrigée à429px par espacement vertical20px. Première suite63/64 : sélecteur historique `.step-image`. Distant : première commande interrompue à300s avec timeouts `page.goto(load)` ; passe suivante63/64, délai de chargement/décodage d'une image à1440. Rejeu intégral sans modification produit, timeout explicite60s :64/64. Menu regroupé avec la suite interrompu par le plafond outil420s, puis rejoué seul45/45. Aucun échec masqué ni retry automatique.

## Passe 2 — mesures indépendantes

Rouge avant tout changement produit : **9/9 images1212px =94,6875% du viewport1280**, sans ligne latérale. Rapport `.qa/m4-r5/red.json` et captures `before/`.

| Viewport | Images comptées | Largeur image | Hauteur image | Part du conteneur | Hauteur ligne |
|---:|---:|---:|---:|---:|---:|
|320|9|286px|160,88px|100% empilé|385–668px|
|375|9|341px|191,81px|100% empilé|416–650px|
|768|9|638px|358,88px|100% empilé|559–799px|
|1280|9|607px|341,44px|50%|400–428,97px|
|1440|9|647px|363,94px|50%|404,94px|

- Local et distant comparés par code :45images, mêmes IDs, dimensions images et lignes identiques ; aucun overflow aux cinq largeurs. Textes et visuels se recouvrent verticalement surdesktop, copie entièrement à gauche ; texte au-dessus surmobile.
- Page1280 :15290→10111px (**−33,87%**) ;1440 :15641→10073px (**−35,60%**). Comptages calculés depuis les deux rapports, pas estimés à l'œil.
- Comparaison sémantique avec la preview parent0ed8c587 : texte complet,42liens/cibles,24titres,10sections,9images/alt, attributs vidéo, sous-titres et rectangle du hero identiques. Seuls scripts/styles exclus et comptés :5contre5sur les deux previews. Rapport `independent/semantic.json`.
- Douze routes HTTP relues,12équivalentes au dist ; injection Cloudflare comptée et retirée avant comparaison, hashes bruts conservés. Noindex présent sur réponses200,404comportement légal existant conservé.
- Douze ressources de l'accueil téléchargées et comparées SHA256 au dist :9preuves, MP4R8, poster, VTT. SHA MP4 `164f6090f7d7a820d544d6679e5f68257fb4f929fe35079b5ce9a22ef86585e4` inchangé.
- Autorevue de l'oracle : le premier sélecteur `main > section` rendait deux listes vides, et l'inventaire médias omettait `video[src]`. Corrigés vers `main .feuille > section` avec assertion positive10sections, et collecte src/poster vidéo ; les deux environnements ont été rejoués,12médias hashés. Les anciens11ne sont pas crédités comme chaîne complète.
- Statique/CDP local et distant :36figures et72cibles par environnement, aucun écouteur d'événement, clic/clavier sans navigation ni dialogue ; alt conservés, zéro focus sur images, microtextes retirés toujours absents.

## Passe 3 — écran réel

- Chromium headful : cinq pleines pages + neuf détails par largeur320/375/768/1280/1440, soit50captures locales et50distantes ;50captures avant correctif également. Les16anciens PNG présents dans `screens/` hors noms de cette passe ne sont pas crédités.
- Comparaison Navattic rejouée : trois vraies lignes1214×370,80–393,20px, colonnes607px. Un quatrième candidat géométrique trouvé puis exclu explicitement (témoignage empilé, colonnes1214px). Captures `navattic-row-0/1/2.png` : média de référence recadré, contrairement à Memlia qui garde le schéma entier. Aucun code/texte/asset Navattic intégré au produit.
- Relus : pleine page1280, types promesse/quotidien/méthode/intégration/contrôle/garanties sur desktop et échantillons mobiles/tablette ; détails distants méthode1440 et garanties375. Proportions équilibrées, aucune coupure informative visible ; **microtextes des images non lisibles exhaustivement**. La copie DOM reste lisible. Ne pas créditer une revue visuelle individuelle de tous les PNG.
- Menu distant : captures réelles375des trois moteurs assemblées `menu/three-engines.png`, fond opaque, six liens et CTA visibles ; la matrice45tests mesure également pixels de fond et hit-testing sur320/375/390/430×360/568/844.
- Browser Harness n'a pas démarré ; Playwright réel utilisé comme alternative. Navattic n'emploie pas deh2sur ces blocs : identification par boîtes mesurées, pas conclusion d'absence sur premier sélecteur vide. Navigation Navattic passée àDOMContentLoaded après un délai load tiers.

## Limites et suite

- **Limite acceptée par l'arbitrage marketing** : lecture globale, pas lecture exhaustive des microtextes ni certification WCAG. Sources et absence d'interaction conservées.
- Pas d'iPhone physique, VoiceOver ni nouveau Lighthouse dans cette carte. Les suites rejouent lecture clavier, durée45s/cues20 ; pas de nouvelle lecture continue45s ni correction du seek revendiquées.
- Phase R5 terminée : `t_89a7f08e` reprend le candidat pour le seek seulement, puis revueClaude `t_69fbf26b`. Aucun accord de production ; le seek reste non résolu par cette carte.
- `.claude/tasks/context_session_1.md` et `docs/qa/m4-r4/revue-t_c5104f9c.md` préexistants préservés. Contexte complété séparément, non embarqué au commit produit.
- Code mort antérieur conservé ; anciens styles `.integration-image` devenus sans usage après le déplacement sont signalés, pas nettoyés hors périmètre.

## Rejouer

```sh
npm run check
npm run build
QA_URL=http://127.0.0.1:4337 npm test
QA_URL=https://7479ddae.memlia.pages.dev npx playwright test --timeout=60000
QA_URL=https://7479ddae.memlia.pages.dev npx playwright test --config playwright.mobile.config.ts --timeout=60000
QA_URL=https://7479ddae.memlia.pages.dev QA_OUT=.qa/m4-r5/remote-screens node scripts/capture-proof-layout.mjs
QA_URL=https://7479ddae.memlia.pages.dev node scripts/verify-proof-layout.mjs
QA_URL=https://7479ddae.memlia.pages.dev node scripts/verify-preview.mjs
QA_URL=https://7479ddae.memlia.pages.dev QA_OUTPUT=.qa/m4-r5/remote-static node scripts/verify-static-media.mjs
```
