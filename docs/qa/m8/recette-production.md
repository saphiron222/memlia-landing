# M8 — Recette de production du 9 septembre 2026

> **Document historique — la section 5 est périmée.** Elle décrit un état réel de la fin d'après-midi
> du 9 septembre, où `www.memlia.fr` renvoyait NXDOMAIN. **Ce n'est plus la production** : la règle
> Cloudflare a été activée côté humain dans la soirée et `www` redirige désormais en 301, un seul
> saut, chemin et query conservés (oracle 8/8). Voir la section 5 réécrite plus bas, et le rapport
> qui fait foi : **`docs/qa/m8/recette-finale-publication.md`**. Les sections 1 à 4 restent valides
> et sont les mesures d'origine ; elles ne sont pas réattribuées à une passe ultérieure.

## Verdict

**Candidat publié et vérifié sur https://memlia.fr ; clôture M8 en attente de décision sur `www.memlia.fr`** — *verdict de cette passe, levé depuis : `www` est configuré et vert, cf. bandeau et section 5.* Aucun changement produit, copy ou design dans cette reprise. Aucun commit, push, nouvelle fusion ni déploiement effectué par ce run.

- Parent M7-R1 `t_69fbf26b` relu `done`, avec go Kevin et acceptation explicite de la réserve juridique.
- Commit exact : `17f7658da65038763ade695c96cf40b43e5fb3cf`. Identique sur `main` et le worktree `t_f16e5a39`. Diff produit final vide.
- Déploiement effectué humainement par Kevin après blocage du runner : **`030591b5-bbc7-48b4-be1a-9d66c025e7a9`**.
- Wrangler relu : projet **`memlia`**, environnement **Production**, branche **main**, source **17f7658**, URL **https://030591b5.memlia.pages.dev**.
- La commande humaine et le fast-forward appartiennent aux handoffs précédents, pas à cette reprise. Aucun contournement de `approvals.deny`.

## 1. Suites fraîches

| Contrôle | Résultat | Preuve sous `.qa/m8/` |
|---|---:|---|
| Astro check | 0 erreur, 0 warning, 1 hint préexistant | `tests/check.log` |
| Build | 7 pages, succès | `tests/build.log` |
| Python | 28/28 | `tests/build.log` |
| Oracle images | 23/23 | `tests/build.log` |
| Playwright complet production, passe finale | 64/64 ; 0 skipped/flaky | `tests/playwright-full-final.json` |
| Menu Chromium/Firefox/WebKit | 45/45 ; 0 skipped/flaky | `tests/mobile-menu.json` |

Les 15 tests de menu Chromium sont communs aux suites 64 et 45 : ne pas les additionner comme tests uniques. Premier lot complet : **63/64**, navigation 320 px interrompue par `net::ERR_NETWORK_CHANGED`, avant assertion produit. Cas isolé rejoué 1/1, puis **suite complète rejouée 64/64**, sans correction produit. Échec initial et capture conservés.

## 2. Chaîne indépendante sur les fichiers réellement servis

Le premier contrôle délégué a comparé 12 routes sur **pages.dev**, mais n'avait pas démontré l'équivalence HTML complète de l'apex. Cette lacune a été fermée par `verify-production.mjs`, rejoué directement contre **https://memlia.fr**, après le build.

| Contrôle apex | Résultat |
|---|---:|
| Routes comparées au dist | 12/12 |
| Autres fichiers dist, octets et SHA-256 | 46/46 |
| Fichiers dist couverts au total | 58/58 |
| Médias du manifeste R8 | 25/25, inclus dans les fichiers ci-dessus |
| Entrée documentaire du manifeste exclue | 1/26 : Markdown interne, pas un média public |
| CSS/JS autonomes dans dist | 0/0 : intégrés au HTML, pas omis |
| Polices dans l'inventaire exhaustif | 8/8 |

`independent/report.json` et les corps HTTP sauvegardés portent les hashes bruts ; le manifeste média détaillé reste dans `http/report.json`.

**Transformation Cloudflare mesurée, non ignorée :** la comparaison brute échouait sur les sept HTML, alors que les cinq fichiers de découverte étaient identiques. Cause : protection des emails spécifique à l'apex. L'oracle a décodé réellement chaque adresse XOR avant comparaison exacte au dist, sans remplacer aveuglément par l'adresse attendue. Transformations comptées : **12 liens**, **6 textes**, **7 scripts de décodage** ; **6 blocs Pages Analytics** retirés séparément. Aucune autre normalisation. Rapport rouge initial conservé dans `independent/report-before-email-normalization.json`. Résultat après normalisation bornée : 12/12, aucun écart restant.

Le navigateur a ensuite confirmé l'email `mailto:contact@memlia.fr` fonctionnel et zéro élément email non décodé sur accueil, légales, confidentialité et blog (`contact.json`). Sans JavaScript, la protection Cloudflare reste une dépendance de lecture des emails ; aucune modification d'infrastructure dans la release.

R8 MP4 : `164f6090f7d7a820d544d6679e5f68257fb4f929fe35079b5ce9a22ef86585e4`, conforme au média M7 validé. VTT, deux posters, neuf preuves statiques et médias blog comparés. Les anciennes ressources également présentes dans dist ont été vérifiées, pas supprimées hors périmètre.

## 3. HTTP, indexabilité et canonicalisation

- Apex : HTTP 200, TLS accepté par les clients, sans en-tête global `X-Robots-Tag: noindex`.
- Accueil, blog et deux articles : meta `index, follow, max-image-preview:large`, canonical exact `https://memlia.fr` + chemin correspondant.
- Mentions légales et confidentialité : meta `noindex, follow` **intentionnelle**, pas une fuite du noindex preview.
- Route inexistante : **404 réelle**, contenu 404 du candidat.
- Domaine de déploiement `030591b5.memlia.pages.dev` : HTTP200 et en-tête `noindex` attendu ; pas une preuve de noindex production.
- RSS, sitemap index, sitemap enfant, robots et llms : **5/5 HTTP200 et octets identiques au dist** sur apex. La suite a vérifié les métadonnées, FAQ/JSON-LD et ancres.
- Indexabilité technique vérifiée ; aucune affirmation d'indexation réelle dans Google/Search Console, ni mesure CrUX/Lighthouse nouvelle.

## 4. Écran, navigation, CTA et vidéo

- Capture Playwright **headful** du hero et des pages blog/légales à 375 et 1440 ; lecture visuelle effective du hero aux deux largeurs et de la page légale mobile.
- Menu : clics, fermeture X/Escape, focus, scroll interne, six liens et CTA, fond opaque éprouvé par pixels et hit-tests sur **320/375/390/430 × 844/568/360**, trois moteurs. **48 captures de menu extraites**, avec lecture visuelle d'une capture par moteur (320×844) ; ne pas présenter toutes les captures comme examinées individuellement.
- Neuf preuves : **45 figures** mesurées à 320/375/768/1280/1440, aucun overflow ; **18/18 proportions desktop égales à 0,5**, images statiques. Capture de la ligne `01-flux` desktop relue : texte/média latéraux, pas de légende ni de lien externe au média. Les suites couvrent également 1024/1920 et les microtextes interdits globaux.
- Vidéo : démarrée au **clavier Space**, fin réelle **45 s**, **20 cues français**, **1 350 frames** dont **17 perdues**, son non muet/volume1 et **1 113 066 octets audio décodés**. Pas d'audition humaine nouvelle revendiquée. Controls natifs/playsinline/preload metadata et absence d'autoplay vérifiés par tests.
- Les annotations internes résiduelles **dans** le média R8, dont le texte de validation au bas du poster, sont visibles et signalées, mais déjà hors suppression ciblée du cartouche R5/Denise supérieur droit selon l'arbitrage R8. Aucun remplacement furtif du média approuvé.
- CTA : le clic site est éprouvé avec interception dans les tests afin de ne pas réserver. **Les deux destinations Cal.com ont aussi été ouvertes réellement en lecture seule**, HTTP200, titres « Découvrir Memlia (démo guidée) » et « Échanger avec l'équipe Memlia ». Aucun créneau choisi, formulaire soumis, mail envoyé ou rendez-vous créé.

Preuves : `screen/screen-report.json`, `layout/report.json`, `menu-screens/`, `contact.json`, JSON des suites. Pas d'iPhone physique/VoiceOver ni de nouvelle certification WCAG exhaustive.

## 5. www — écart résolu depuis cette passe

**État courant, mesuré le 9 septembre en soirée : `www.memlia.fr` est fonctionnel et vert.** Une
règle Bulk Redirect a été activée côté humain dans le tableau de bord Cloudflare, sans redéployer le
site et sans toucher le dépôt. `node scripts/verify-www-redirect.mjs` passe **8/8** en résolution DNS
normale (`forcedDns: false`) : 301 exact, `Location` exacte préservant chemin et query — y compris
une query encodée à clés répétées —, **un seul saut**, statut final attendu (200, et 404 réelle pour
la route inexistante), canonical apex unique. L'apex ne redirige pas : la règle ne boucle pas.
Détail et preuves : `docs/qa/m8/recette-www.md` et `docs/qa/m8/recette-finale-publication.md`.

Ce qui suit est l'**état historique** au moment de cette recette, conservé tel quel. Il ne décrit
plus la production.

**`www.memlia.fr` renvoyait alors NXDOMAIN** : résolution système, résolveurs **1.1.1.1** et **8.8.8.8**, serveurs autoritaires **pranab.ns.cloudflare.com** et **jamie.ns.cloudflare.com**, types A/AAAA/CNAME. Requête directe complémentaire 1.1.1.1 également négative. Ce n'est pas seulement un cache local à attendre.

`wrangler pages project list` ne liste pour `memlia` que **memlia.pages.dev et memlia.fr**. `www.memlia.fr` n'est pas rattaché au projet. Il n'y a donc ni endpoint HTTPS ni redirection www→apex à valider. Configuration et DNS non modifiés.

**Décision humaine nécessaire :** configurer/rattacher `www.memlia.fr` dans Cloudflare avec HTTPS et redirection permanente vers `https://memlia.fr`, en conservant chemin et paramètres, puis refaire la recette ; ou accepter explicitement une publication sans domaine www. Le go de déploiement du candidat ne vaut pas arbitrage tacite de cette réserve.

M8 reste non close ; les deux enfants SEO précréés ont été lus mais ne sont pas libérés tant que ce point n'est pas tranché. Il ne faut pas redéployer le candidat pour régler une absence de DNS.

*Fin de l'état historique.* La décision a été prise dans le sens « configurer www », appliquée
humainement, puis vérifiée : le candidat n'a pas été redéployé pour cela.

## Réserves héritées maintenues

- Absence de téléphone professionnel MEMLIA et TVA non confirmée omise : **acceptées explicitement par Kevin**, pas une conformité juridique exhaustive revendiquée.
- Seek lointain à froid Cloudflare Pages : limite acceptée, aucune promesse de HTTP206. Lecture continue vérifiée, pas nouvelle correction de seek.
- Lecture globale des microtextes acceptée : aucune garantie de lisibilité exhaustive ni zoom ajouté.
- Onze liens Légifrance : challenges403 historiques non conclus ; non rejoués, pas qualifiés de liens cassés.

## Auto-évaluation

| Axe | Note | Limite et amélioration |
|---|---:|---|
| Exactitude | 4/5 | Production reliée au commit et aux octets ; aucune audition humaine/iOS physique. |
| Complétude | 3/5 | www non fonctionnel : arbitrage ou configuration humaine requis avant clôture. |
| Clarté | 4/5 | Rapport sépare publication réelle et clôture ; preuves détaillées volumineuses. |
| Action | 4/5 | Décision www explicite, prochaine recette ciblée ; pas d'accès DNS exercé en écriture. |
| Concision | 4/5 | Résumé utilisateur court, historique d'incidents conservé dans ce rapport. |

Moyenne calculée : **3,8/5**. Priorité : fermer www sans retoucher le candidat ; conserver la distinction HTML brut/transformations Cloudflare dans la recette suivante. Kevin devrait retrouver ici le site effectivement publié et le seul arbitrage externe restant, pas un faux « tout vert ».
