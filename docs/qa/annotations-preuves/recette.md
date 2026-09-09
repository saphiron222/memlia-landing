# Recette — nettoyage des neuf preuves visuelles

Date : 9 septembre 2026. Carte : `t_3fa941a1`.

## Candidat remis à la revue croisée

- Commit produit : **`4d8b8d873c7e4b486ba9f4c93f4debfcdafbe921`**.
- Branche Git : `site/nettoyage-annotations-preuves`.
- Preview exacte : **https://fb1e3ae7.memlia.pages.dev**.
- Branche Cloudflare : `preview-nettoyage-annotations-preuves` ; type **Preview** confirmé dans la liste des déploiements, commit `4d8b8d8`.
- Identifiant de déploiement : `fb1e3ae7-5956-4876-9b31-3eb3e7ee13b9`.
- Aucun push GitHub, aucune fusion main, aucune publication production. La dernière production listée reste `030591b5`, commit `17f7658`.
- Phase d’implémentation terminée ; revue Claude précréée `t_512011a3`, puis validation visuelle de Kevin. Ce rapport ne vaut pas validation humaine.

## Périmètre exact

Sources HTML/CSS retrouvées dans le dépôt principal, jusque-là absentes du candidat versionné. Elles sont désormais autonomes dans `docs/design/m4-r1-functional-proofs/`, avec polices locales, contrat textuel, neuf PNG et commande de rendu. Aucun recadrage de WebP ni génération IA.

Les neuf WebP sont remplacés. Les douze dérivés des preuves 06 et 09, déjà utilisés comme couvertures de blog, sont également régénérés : laisser ces anciennes copies aurait laissé les mêmes annotations publiques ailleurs. Aucune modification de `src/`, de la copy, des alt, du layout, des vidéos ou posters.

### Inventaire exact des suppressions

Les quatre positions éditoriales de chaque image sont supprimées du HTML, pas masquées par CSS : **36 libellés périphériques**, plus **1 mention interne** dans la preuve 05.

| Preuve | Haut gauche | Haut droit | Bas gauche | Bas droit |
|---|---|---|---|---|
| 01 flux | Un processus cadré, de l’entrée à la décision | 01 / 09 | L’automatisation prépare. | L’exception reste visible ; le cabinet décide. |
| 02 répétition | Une tâche répétitive, sans gestes rejoués | 02 / 09 | La mécanique est regroupée. | Le résultat est proposé, jamais imposé. |
| 03 contrôle | Le doute arrête le traitement | 03 / 09 | Fail-closed par défaut. | Si la règle ne suffit pas, rien ne part. |
| 04 observer | Méthode · 01 Observer | 04 / 09 | Livrable visible : | une carte du processus, pas une promesse vague. |
| 05 cadrer | Méthode · 02 Cadrer | 05 / 09 | Livrable visible : | une règle testable et ses limites. |
| 06 éprouver | Méthode · 03 Éprouver | 06 / 09 | Livrable visible : | des cas d’essai et des résultats reproductibles. |
| 07 livrer | Méthode · 04 Livrer & recetter | 07 / 09 | Livrable visible : | un résultat recetté, pas un siège logiciel. |
| 08 intégration | Partir des outils existants | 08 / 09 | Le point d’entrée est choisi. | Les outils ne sont pas remplacés pour introduire l’automatisation. |
| 09 garanties | Des garanties visibles dans le mécanisme | 09 / 09 | La confiance n’est pas décorative. | Chaque garantie correspond à un comportement vérifiable. |

Preuve 05 : **`Brouillon partagé` retiré sans remplacement**. Les traits de séparation des bandeaux et les deux traits de bord de planche sont retirés avec leur chrome.

Tout le texte central restant est comparé exactement au contrat issu des sources antérieures. `v.04`, `Session 01`, `Version 1.0`, les étapes centrales 01–04, les gardes-fous fictifs, les états humains, les agrégats et la restriction de compatibilité sont conservés. Le pied « Fail-closed par défaut. » est bien supprimé ; **le comportement** reste visible dans le panneau : « Aucun export n’est produit avant décision. »

## Résultats exécutés

| Passe | Résultat |
|---|---|
| `npm run check` | 0 erreur, 0 warning, 1 hint préexistant dans `scripts/lighthouse.mjs:76` |
| `npm run build` | 7 pages ; Python **32/32** ; images **23/23** |
| Nouvel oracle Python | 4 tests, rouge avant correction puis vert |
| `npm run test:proof-render` | **9 PNG et 21 actifs recalculés identiques**, Chromium `153.0.8010.12` |
| Contrôle géométrique du rendu | **200 nœuds de texte contrôlés**, hors 2 caractères de secours de curseur à taille zéro ; 0 texte tronqué/masqué, étiquettes hors boutons |
| Témoins négatifs | **40/40 rejetés**, restauration octet pour octet puis recette verte |
| `npm run test`, serveur frais `127.0.0.1:4357` | Playwright TypeScript **64/64**, 1,7 min |
| `npm run test`, preview exacte | Playwright TypeScript **64/64**, 3,2 min |
| Routes preview | **12/12** statuts attendus et contenus équivalents ; noindex sur réponses 200, meta noindex de la 404 conservée |
| Médias preview | **25/25** HTTP 200, tailles et SHA-256 identiques au manifeste, noindex ; les 21 images nouvelles incluses |
| Comparaison de landing antérieure | HTML **strictement identique** à `7ec1d409`, après exclusion de **1** bloc Analytics Cloudflare compté |
| Géométrie/alt local versus preview | **45/45** relevés identiques : 9 preuves × 5 largeurs |
| Captures navigateur | **50 locales + 50 distantes**, aux largeurs 320/375/768/1280/1440 ; 0 débordement horizontal mesuré |

Le test images de build compare aussi le sceau des **8 sources** (HTML, CSS, contrat, moteur, lockfile et 3 polices) et des **9 PNG**. Une source modifiée sans rendu bloque le build, sans exiger Chromium sur Cloudflare. Le recalcul complet est une commande de recette séparée, réellement exécutée ici.

### Ce qui aurait rougi

- Les sources initiales ont déclenché 11 échecs/sous-cas dans 4 tests, dont les neuf contenus avec annotations.
- Chaque occurrence des **37** libellés interdits a été réintroduite : rejetée.
- Source CSS modifiée sans rendu : rejet par `test:images`.
- `Livrable visible :` injecté en pseudo-élément : rejet par le navigateur de rendu.
- Panneau central masqué : rejet par l’oracle de visibilité.
- Un défaut trouvé à l’œil sur la première 01 a été reproduit en rouge : l’étiquette de validation recouvrait deux boutons. Elle est replacée sous les boutons, puis oracle vert et nouvelle inspection.

### Stabilité du rendu

La capture d’une longue planche défilante a d’abord produit une divergence sur 03 : 2 888 composantes couleur, amplitude maximale 1. Le moteur capture désormais chaque scène entière à la même origine, sans défilement de planche. Deux recalculs consécutifs puis la recette finale retrouvent les mêmes octets ; aucun seuil de tolérance n’a été ajouté pour faire passer le test.

## Inspection individuelle des neuf images

Chaque WebP a été ouvert individuellement, quatre coins et contenu central, pas seulement la planche réduite. Les images 01 et 03 ont été réinspectées après correction de leurs curseurs. Les changements de rastérisation ultérieurs n’altèrent pas la géométrie ; les actifs servis sont comparés par SHA.

| Image | Inspection du centre et des quatre coins |
|---|---|
| 01 | Entrée/règles/décision distinctes, jeu fictif et blocage présents ; libellé humain sous les boutons, aucun masquage final |
| 02 | Gestes, résultat et exception lisibles ; 48 éléments = 47 proposés + 1 cas à vérifier |
| 03 | Comparaison attendue/reçue, refus d’export et décision humaine visibles ; curseur rapproché sans recouvrement |
| 04 | Timeline et jugement humain préservés, `Session 01` visible |
| 05 | Tableau et deux blocages présents ; aucun `Brouillon partagé` |
| 06 | Quatre essais et garde-fou `DONNÉES FICTIVES` dans le panneau |
| 07 | Checklist, cas fictifs, `Version 1.0`, décision du cabinet encore en attente |
| 08 | Quatre outils, centre et connecteurs cohérents ; aucune compatibilité universelle promise |
| 09 | Quatre groupes fictifs, non nominatif, anti-surveillance et validation humaine présents |

Aucun titre/compteur/pied éditorial dans les coins des neuf images finales. Les curseurs et étiquettes **dans** les panneaux 01/03 restent fonctionnels, ils ne sont pas du chrome périphérique. La passe écran de la landing a aussi inspecté les intégrations 01 desktop, 04 mobile, puis 05 mobile et 09 desktop sur la preview réelle.

Les microtextes internes restent petits sur mobile dans le layout statique/non zoomable demandé. Aucune promesse de lecture native de tous ces textes n’est faite ; les titres et textes extérieurs, les alt, les dimensions et le cadrage intégral restent intacts.

## Formats et poids

Tous les WebP : **1600 × 900**, neuf empreintes distinctes. PNG maîtres conservés à la même dimension. Plafond du rendu : 150 000 octets par preuve.

| WebP | Octets |
|---|---:|
| 01-flux | 48 436 |
| 02-repetition | 34 034 |
| 03-controle | 34 810 |
| 04-observer | 28 024 |
| 05-cadrer | 31 384 |
| 06-eprouver | 28 296 |
| 07-livrer | 37 050 |
| 08-integration | 47 982 |
| 09-garanties | 27 464 |
| **Total neuf preuves** | **317 480** |

Ancien total : 295 228 octets. Écart : **+7,54 %**, lié aux panneaux/textes agrandis et à l’encodage qualité 90 ; aucun visuel ne dépasse 49 ko. Pas de régression de dimensions ni de layout.

## Preuves et reprise

Dans le worktree `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_3fa941a1` :

- `.qa/annotations/avant-apres.jpg` : planche des neuf paires, 2400 × 6480.
- `.qa/annotations/comparisons/` : neuf paires individuelles PNG, 3200 × 960.
- `.qa/annotations/before/` : neuf WebP antérieurs.
- `docs/design/m4-r1-functional-proofs/renders/` : neuf PNG finaux versionnés.
- `.qa/annotations/render/report.json` et `recheck/report.json` : mesures/empreintes du navigateur.
- `.qa/annotations/comparison.json` : suppressions, poids, SHA et comparaison HTML.
- `.qa/annotations/mutations.json` : quarante cas rejetés ; `red.log`, `overlap-red.log`, `seal-red.log` : témoins initiaux.
- `.qa/annotations/check.log`, `build.log`, `repro-final.log`, `playwright-{local,preview}.{log,json}` : sorties réelles.
- `.qa/annotations/preview-http.json`, `remote-assets.json`, `deployments.log` : preuve distante.
- `.qa/annotations/{local,preview}-screen/` : cent captures et relevés DOM/alt/dimensions.

Le README des sources décrit les commandes reproductibles. Le script historique `prepare-preview.mjs` imprime encore `preview-m4-r4` ; la commande Wrangler réellement exécutée porte explicitement **`--branch preview-nettoyage-annotations-preuves`**, confirmé par relecture distante. Ne pas déduire la branche effective de ce message historique.

Hors périmètre : Lighthouse neuf, audition de la vidéo, Safari/iOS physique, correction du www, changement de copy ou validation juridique. Les sources/règles hors images ne sont pas nettoyées opportunément.
