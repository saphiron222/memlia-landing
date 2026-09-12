# M8 — Recette finale de publication (memlia.fr)

Date de consolidation : **9 septembre 2026**. Heures en **UTC** ; l'hôte est en WAT (UTC+1), les
horodatages des logs de build sont donc lus une heure plus tard que ceux des rapports JSON.

Corrections de **qualification** appliquées le **10 septembre 2026** (journal en section 12) :
aucune mesure refaite, aucun geste nouveau, aucun fichier produit touché.

## Verdict

**VALIDÉ.** Les trois conditions posées sont réunies :

1. audit HTTP/SEO parent `t_95915808` — **vert** ;
2. audit interface et parcours parent `t_f6c811c5` — **vert** ;
3. équivalence externe entre le contenu servi et le candidat — **vert** (58/58 fichiers).

`https://memlia.fr` et `https://www.memlia.fr` sont tous deux validés : l'apex sert le candidat,
`www` redirige en **301, un seul saut, chemin et query conservés**.

**Deux périmètres à ne pas confondre, détaillés en section 10.** M8 a bel et bien comporté des
gestes réels — un fast-forward de `main`, un déploiement Cloudflare Pages déclenché humainement, la
mise en place du domaine `www` (DNS puis règle Bulk Redirect). Ce sont eux qui ont publié le site.
**La passe de consolidation qui produit ce document, elle, n'a effectué aucun geste nouveau** :
aucun push, aucun build, aucun déploiement, aucune fusion, aucune écriture DNS ou Cloudflare, aucune
modification de copy, de design ou de fichier produit. Elle relit des mesures existantes et n'en
fabrique aucune. **La passe de correction du 10 septembre n'en a pas fait davantage** : elle ne
réécrit que la qualification des artefacts dans ce fichier.

Ce rapport remplace, sur le point `www`, la section 5 de `recette-production.md`, écrite quand
`www.memlia.fr` renvoyait encore NXDOMAIN. Cette section est désormais marquée historique.

## 1. Rattachement au candidat

| Élément | Valeur |
|---|---|
| Candidat validé et publié | `17f7658da65038763ade695c96cf40b43e5fb3cf` |
| `main` local au moment de la recette | `3d0867d59759fb470190fd38f1b37807f92268ed` |
| Déploiement Cloudflare Pages | `030591b5-bbc7-48b4-be1a-9d66c025e7a9` |
| URL technique du déploiement | `https://030591b5.memlia.pages.dev` |
| Projet / branche / source | `memlia` · `main` · `17f7658` |
| Production publique | `https://memlia.fr` et `https://www.memlia.fr` |

- `git merge-base --is-ancestor 17f7658 HEAD` : vrai. Le candidat est un ancêtre de `main`.
- `git diff --stat 17f7658..HEAD -- src public astro.config.mjs package.json package-lock.json` :
  **aucun fichier produit différent**.
- `git diff --name-only 17f7658..HEAD` : exactement **deux** fichiers, `docs/qa/m8/recette-www.md`
  et `scripts/verify-www-redirect.mjs` — documentation et oracle de recette. **Il n'y a donc rien à
  redéployer** : l'avance de `main` sur le candidat ne touche pas le site.
- `git rev-list --count origin/main..main` = **22**. `origin/main` reste à
  `59ee1a12fec05a4937eb7b2a0c973f2e806b3d57`. **Aucun push n'a été effectué**, conformément à la
  consigne ; la décision de pousser appartient à Kevin.

## 2. Suites et contrôles locaux sur l'arbre du candidat

| Contrôle | Commande | Résultat | Preuve |
|---|---|---:|---|
| Astro check | `npm run check` | 0 erreur, 0 warning, **1 hint** hérité | `.qa/m8-www/check.log` |
| Build | `npm run build` | **7 pages** | `.qa/m8-www/build.log` |
| Oracle Python | `npm run test:proof` (chaîné au build) | **28/28**, `OK` | idem |
| Oracle images | `npm run test:images` (chaîné au build) | **23 fichiers vérifiés**, 9 preuves originales | idem |
| Suite navigateur production | `QA_URL=https://memlia.fr npm test` | **64/64**, 0 skipped, 0 unexpected, 0 flaky | `.qa/playwright.json` |
| Matrice menu 3 moteurs | `playwright test --config playwright.mobile.config.ts` | **45/45**, 0 skipped/flaky | `.qa/mobile-menu.json` |

Le hint est `scripts/lighthouse.mjs:76` (`'await' has no effect on the type of this expression`),
préexistant et hors périmètre produit. Le build enchaîne `strip-briefs` : **20 briefs retirés de
`dist/images/`**, **78 anciens assets exclus**, **12 attendus**, **0 manquant**.

Les **15 tests de menu Chromium sont communs aux deux suites** (64 et 45) : ne pas les additionner
comme tests uniques. Aucune suite n'a été rejouée après le dernier vert ; les comptes ci-dessus sont
ceux des rapports JSON présents sur disque.

## 3. Équivalence externe — ce qui est servi est bien le candidat

`node .qa/m8/verify-production.mjs`, joué contre `https://memlia.fr` (rapport
`.qa/m8/independent/report.json`, mesure **2026-09-09T22:49:29Z**) :

| Contrôle | Résultat |
|---|---:|
| Routes HTML comparées au `dist` | **12/12** |
| Autres fichiers `dist`, octets et SHA-256 | **46/46** |
| Total de fichiers `dist` couverts | **58/58** |
| Exclusions | **0** |
| Erreurs | **0** |

**Transformations Cloudflare mesurées, non ignorées.** La comparaison brute échouait sur les sept
HTML alors que les fichiers de découverte étaient identiques : la protection d'email de Cloudflare
réécrit les adresses. L'oracle **décode réellement** chaque adresse XOR avant comparaison exacte au
`dist`, sans substitution aveugle par l'adresse attendue, et **compte** ce qu'il normalise :
12 liens, 6 textes, 7 scripts de décodage, plus **6 blocs Pages Analytics** retirés séparément
(`analyticsExcluded: 6`). Aucune autre normalisation. Le rapport rouge d'origine est conservé, non
écrasé : `.qa/m8/independent/report-before-email-normalization.json`.

Sans JavaScript, la lecture des emails dépend donc de cette protection Cloudflare : c'est une
propriété de l'infrastructure, pas une régression du candidat, et rien n'a été modifié pour elle.

## 4. HTTP, redirection www, indexabilité et canonicals

### 4.1 Redirection `www` — oracle 8/8

`node scripts/verify-www-redirect.mjs` → **8/8**, code de sortie **0**, `forcedDns: false`
(résolution DNS normale, pas de `--resolve` forcé). Rapport `.qa/www-redirect.json`, mesure
**2026-09-09T22:49:25Z**. Deux exécutions antérieures indépendantes (22:03:48 et 22:04:33 UTC)
avaient déjà donné 8/8.

Les huit cas, tous en **301 exact, une seule redirection, destination sans second saut** :

| Chemin sur `www` | `Location` | Statut final |
|---|---|---:|
| `/` | `https://memlia.fr/` | 200 |
| `/?source=www-test` | query conservée | 200 |
| `/blog?source=www-test` | query conservée | 200 |
| `/blog?source=a%2Fb&tag=un&tag=deux&term=cabinet+comptable` | **encodage et clés répétées rendus à l'identique** | 200 |
| `/mentions-legales?source=www-test` | query conservée | 200 |
| `/robots.txt?source=www-test` | query conservée | 200 |
| `/sitemap.xml?source=www-test` | query conservée | 200 |
| `/m8-www-page-inexistante?source=www-test` | query conservée | **404 réelle** |

L'oracle vérifie en plus la canonical apex unique et l'indexabilité des destinations HTML. Il vise
les **huit chemins canoniques déclarés** ; il ne prétend rien sur d'anciennes URLs `.html` ou à
slash terminal.

**Absence de boucle prouvée séparément** : `https://memlia.fr/` et `https://memlia.fr/blog`
répondent 200 sans `redirect_url` — l'apex ne redirige pas. Depuis `http://www` nu, la chaîne compte
2 sauts (`http://www` → `https://www` → apex) : forclusion HTTPS puis règle, même motif que l'apex
en HTTP nu, comportement attendu.

La règle Cloudflare (Bulk Redirect) a été **activée côté humain**, hors dépôt. Cette recette en
constate l'effet ; elle ne relit pas la configuration à la source, faute d'accès au tableau de bord.
Le paramètre « Include subdomains » n'est donc pas vérifié à la source.

### 4.2 Statuts, indexabilité, canonicals

Audit `.qa/t_95915808/audit-seo.json` (mesure **2026-09-09T22:37:13Z**) : **6 pages, 8 assets,
2 redirections, 4 URL de sitemap, 0 erreur**.

| Page | Canonical | Robots |
|---|---|---|
| `/` | `https://memlia.fr/` | `index, follow, max-image-preview:large` |
| `/blog` | `https://memlia.fr/blog` | `index, follow, max-image-preview:large` |
| `/blog/controler-les-bulletins-de-paie-avant-la-dsn` | apex identique | `index, follow, max-image-preview:large` |
| `/blog/suivre-la-production-sociale-dans-excel` | apex identique | `index, follow, max-image-preview:large` |
| `/mentions-legales` | `https://memlia.fr/mentions-legales` | `noindex, follow` **intentionnel** |
| `/politique-de-confidentialite` | `https://memlia.fr/politique-de-confidentialite` | `noindex, follow` **intentionnel** |

Chaque page porte exactement un H1, un `title`, une meta description, un `og:url`, une meta robots
et une canonical unique. Marqueurs de version retrouvés dans le HTML externe : H1 accueil
« Automatisez les tâches qui ralentissent votre cabinet. », H1 blog « Ce qui se vérifie, ce qui
s'automatise, ce qui se décide. », titres attendus des deux articles.

- `https://memlia.fr/` : **200**, `text/html`, **aucun `X-Robots-Tag: noindex`** global.
- Route inexistante `/m3-page-inexistante` : **vraie 404**, contenu 404 du candidat.
- `https://030591b5.memlia.pages.dev/` : **200 avec `X-Robots-Tag: noindex`** — garde-fou attendu
  sur le domaine technique, et **non** une preuve de noindex en production.
- Aucune page indexable ne porte le noindex de preview ; les deux pages légales le portent
  volontairement et sont exclues du sitemap.

### 4.3 Découverte

- `robots.txt` : **200**, aucun `X-Robots-Tag`, groupe général `Allow: /`, sitemap déclaré
  `https://memlia.fr/sitemap.xml`, Bytespider bloqué conformément au fichier source.
- `sitemap.xml` : **200**, pointe vers `sitemap-0.xml`, lui-même **200** avec **exactement quatre
  URL** : accueil, blog et les deux articles. Ni pages légales, ni 404.
- RSS, sitemap index, sitemap enfant, robots et llms : **5/5 en 200 et octets identiques au `dist`**
  sur l'apex.

**Limite explicite** : cette recette valide l'**indexabilité technique**. Elle ne prouve pas
l'indexation effective dans Google/Search Console, et n'apporte ni Lighthouse ni CrUX nouveaux.

## 5. Assets critiques et média R8

Huit assets critiques téléchargés depuis l'apex : **200**, type MIME attendu, **SHA-256 identique au
`dist`** — vidéo R8 MP4, VTT R8, poster R8 1200 WebP, image OG, Fraunces 600, Hanken Grotesk 400 et
les deux images principales du blog. L'oracle exhaustif couvre le reste : **46/46 fichiers
statiques**, médias et polices inclus.

Empreinte du média R8 servi :
`164f6090f7d7a820d544d6679e5f68257fb4f929fe35079b5ce9a22ef86585e4`, conforme au média M7 validé.
**Aucun remplacement furtif du média approuvé.**

## 6. Écran, navigation, CTA, blog, légales et preuves statiques

Source : audit parent `t_f6c811c5`, mesures du 9 septembre 22:35–22:43 UTC, captures
`.qa/t_f6c811c5-screen/` et rapport `screen-report.json` (**18 captures de pages, 18 captures de
preuves, 0 erreur**).

**Tailles réellement éprouvées** — accueil/overflow : 320, 375, 768, 1024, 1366, 1440 et 1920 px ;
menu mobile : 320/375/390/430 × 844/568/360 dans **trois moteurs** ; preuves : 320, 375, 768, 1280,
1440, plus 1024 et 1920 ; blog et article : 320, 375, 768, 1024, 1440 ; passe console : 375×812 et
1440×900.

- **Navigation desktop** : six liens attendus — `Usages`, `Méthode`, `Intégration`, `Garanties`,
  `Questions`, `Blog` — ancres réellement atteintes, CTA tenant sur une ligne à 1024 et 1366 px.
- **Navigation mobile** : panneau peint jusqu'au bas du viewport, **fond opaque** éprouvé par pixels
  et hit-tests, sept actions tactiles, cibles ≥ 44 px, texte ≥ 16 px, scroll interne en paysage,
  focus piégé, fond inerte, fermeture X et Escape, restauration du scroll, navigation Blog et ancres
  — conformes dans **Chromium, Firefox et WebKit**.
- **CTA** : destinations exactes `https://cal.com/kevin-svg/decouvrir-memlia` et
  `https://cal.com/kevin-svg/echanger-avec-l-equipe-memlia`. Les deux pages ont été ouvertes
  réellement **en lecture seule** (200, titres attendus) ; dans les tests, le clic est intercepté.
  **Aucun créneau choisi, aucun formulaire soumis, aucun rendez-vous créé, aucun mail envoyé.**
- **Blog** : liste, deux articles, auteur, RSS, fil d'Ariane, sources, JSON-LD, canonical et retour à
  la liste conformes ; aucun débordement aux cinq largeurs.
- **Pages légales** : mentions légales et confidentialité en 200, canonicals apex, contenu et retour
  accueil conformes, `noindex, follow` intentionnel.
- **Neuf preuves statiques** : neuf images présentes, 1600×900 chargées, **non interactives et non
  focalisables**, sans `figcaption`, sans dialogue, sans zoom, sans lien. Géométrie desktop entre
  48 % et 52 % de la ligne, texte à gauche et média à droite, sans chevauchement ; empilement mobile
  sans overflow.
- **Microtextes interdits absents globalement** : `Lire la transcription`, `Lire le détail`,
  `Illustration de fonctionnement sur données fictives, pas une capture produit.` ; aucun
  `.repere-lien`.
- **Vidéo R8** : lecteur natif, contrôles, poster, `playsinline`, `preload=metadata`, absence
  d'autoplay, focus clavier et VTT conformes. Lecture réelle jusqu'à **45 s** : `ended=true`,
  `muted=false`, volume 1, **20 cues français**, **1 350 frames dont 9 perdues**, **1 113 066 octets
  audio décodés**, 0 erreur de page. Aucune **audition humaine** nouvelle n'est revendiquée.
- **Positionnement** : H1 exact, cinq usages illustratifs, aucun catalogue public, FAQ visible
  identique au JSON-LD, pages légales et 404 conservant le positionnement service.

**Départ réel depuis `www`** : une passe écran dédiée a démarré sur `https://www.memlia.fr/` en 375
et 1440 px — chaîne `301 www → 200 apex`, URL finale `https://memlia.fr/`, un seul H1, canonical
apex, **débordement horizontal 0 px**, puis navigation interne réelle vers `/blog` (burger ouvert
d'abord en mobile, `aria-expanded` passant à `true`).

> L'artefact `.qa/m8-www/screen/mobile-375-echec.png` est la capture d'une **sonde fautive** (elle
> cliquait un lien présent mais replié dans le menu), corrigée ensuite. **Ce n'est pas un défaut de
> production** et il ne doit pas être lu comme tel.

## 7. Console, réseau et assets au fil des parcours

`node .qa/production-console-audit.mjs` (mesure **2026-09-09T22:37:30Z**), 12 rendus = 6 pages ×
{375×812, 1440×900} :

| Indicateur | Mesure |
|---|---:|
| Pages / HTTP 200 | 12 / **12** |
| Débordement horizontal | **0** |
| Images cassées (après décodage des images lazy) | **0** |
| Erreurs console | **0** |
| `pageerror` | **0** |
| Réponses HTTP ≥ 400 | **0** |
| Échecs de requête | 2 |
| Échecs **affectant** le parcours | **0** |

Les deux échecs bruts sont des `net::ERR_ABORTED` sur le MP4 **au moment de quitter la page**
d'accueil. Non affectants, et démontrés tels : dans les deux cas le lecteur avait déjà
`readyState=4`, une durée de 45 s et des contrôles actifs, et la passe R8 séparée a lu la vidéo
jusqu'à `ended=true`.

## 8. Commandes, inventaire des preuves et archives

### 8.1 Commandes de la recette

```text
git rev-parse HEAD
git branch --show-current
git log --oneline -8
git merge-base --is-ancestor 17f7658da65038763ade695c96cf40b43e5fb3cf HEAD
git diff --stat 17f7658da65038763ade695c96cf40b43e5fb3cf..HEAD -- src public astro.config.mjs package.json package-lock.json
git diff --name-only 17f7658da65038763ade695c96cf40b43e5fb3cf..HEAD
git rev-list --count origin/main..main
npm run check
npm run build                                   # inclut test:proof et test:images
QA_URL=https://memlia.fr npm test
QA_URL=https://memlia.fr ./node_modules/.bin/playwright test --config playwright.mobile.config.ts
node scripts/verify-www-redirect.mjs
node .qa/m8/verify-production.mjs
node .qa/t_95915808/audit-seo.mjs
node .qa/production-console-audit.mjs
QA_URL=https://memlia.fr QA_OUTPUT=.qa/t_f6c811c5-screen node scripts/capture-integrated.mjs
curl -sS -o /dev/null -D - --max-time 20 https://memlia.fr/
curl -sS -o /dev/null -D - --max-time 20 'https://www.memlia.fr/blog?source=audit'
```

### 8.2 Inventaire des preuves citées — empreintes SHA-256

**Ces preuves vivent sous `.qa/`, qui est dans `.gitignore` : elles ne sont pas versionnées et ne
survivront pas à un clone frais.** Ce tableau **ne l'est pas davantage** : il vit dans ce rapport, et
`docs/qa/m8/recette-finale-publication.md` est **non suivi par git** — `git status` le donne en `??`,
et `git ls-files docs/qa/m8/` ne retourne que `recette-www.md`. Le tableau n'est donc **pas durable**.
Il permet de vérifier après coup qu'un fichier retrouvé est bien celui qui a été lu ici, **à la seule
condition d'avoir été sauvegardé** avec les preuves — geste humain non fait à ce jour, réserve 9.

Empreintes relevées le **2026-09-09 à 23:09 UTC**, sur les fichiers présents sur la machine de Kevin.
Les `mtime` sont normalisés en UTC ; l'hôte étant en UTC+1, `ls` les affiche une heure plus tard.

| Preuve | Octets | mtime (UTC) | SHA-256 |
|---|---:|---|---|
| `.qa/www-redirect.json` | 3 223 | 2026-09-09T22:49:25Z | `9e3a566980707178ba7eb7c9f77171cc766877fc9967b266029074db475103c3` |
| `.qa/m8/independent/report.json` | 21 821 | 2026-09-09T22:49:46Z | `7f1ca2ff0b56ac2db76e7ff56d65273ecde55d169ee421a763c91f810b8f3b02` |
| `.qa/m8/independent/report-before-email-normalization.json` | 20 046 | 2026-09-09T17:44:29Z | `e22a3e342cb21cdf9669e4b05ec92d6b8c55292caf524a4d1b55bd3f14b1ee6a` |
| `.qa/t_95915808/audit-seo.json` | 7 254 | 2026-09-09T22:37:22Z | `f35a942405674adf693fff46a361dec01337fbd7a33beb0327f42f62deab2e20` |
| `.qa/production-console-audit.json` | 7 893 | 2026-09-09T22:37:50Z | `6a7ca3da9e9e578baeec9b82847d8b48d8f2f2689a55a839669fbea405d66ed1` |
| `.qa/playwright.json` | 479 888 | 2026-09-09T22:33:02Z | `eb1a12da04e3b4b139c7125aa0a92c30aa4e824c76a169995cdb19537620e62d` |
| `.qa/mobile-menu.json` | 1 325 643 | 2026-09-09T22:34:59Z | `495b4083188a57c15dc1fafbeda1f8fd211e2cd205ac68435441e5ae84f3362a` |
| `.qa/t_f6c811c5-screen/screen-report.json` | 3 871 | 2026-09-09T22:39:33Z | `098307fc81868e1be93d886f0bbda6da6359eeeed2c7d1b77a0a4b4781e4b0dc` |
| `.qa/m8-www/check.log` | 533 | 2026-09-09T20:27:05Z | `bddd2e4218d0c94b394f3713eb144690c2aaeffa465ea5d54560a76becb8f0ca` |
| `.qa/m8-www/build.log` | 8 330 | 2026-09-09T20:27:08Z | `ec740f5ec6718ff205bbc350ee4d565c92587abe4dbbe1ec29dd322a534d0261` |
| `.qa/m8-www/screen/screen.json` | 1 801 | 2026-09-09T22:07:44Z | `3d38bb2f90a0c684f707628a15725dfa21477097ab00fab0148b848b0e63102e` |
| `.qa/m8-www/oracle-red.json` | 1 929 | 2026-09-09T20:26:58Z | `89bbbac670f61f68fa1eb9f39684b82b9d2c6e84200dfd0fe49a8d28215d88e8` |
| `.qa/m8-www/oracle-green.log` | 3 277 | 2026-09-09T22:04:33Z | `efa56da8910f117257c78f802e920fc8cb9a2deaf05eccd2ff2c5e4112a5c740` |
| `.qa/m8-www/playwright-apres-regle.log` | 5 806 | 2026-09-09T22:11:42Z | `de6a46892577e36e6a4bec584bf0726fd9c17d17c239e44c1538b4cafa7dced2` |
| `.qa/m8/cloudflare-deployments.log` | 7 886 | 2026-09-09T17:46:01Z | `de71bd5b1f792027017030e99d7629135af868bb2e0b0e2e6da57641540b57f4` |
| `.qa/m8/cloudflare-projects.log` | 3 411 | 2026-09-09T17:45:58Z | `c358200adc5705bb04b4a6d1c4961f2c15a2c76ed248af199c3ad9d14f9bf2eb` |

Les quatre **oracles non versionnés** qui ont produit ces mesures sont archivés avec elles :
`.qa/m8/verify-production.mjs` (`b1cbd3b1…`), `.qa/t_95915808/audit-seo.mjs` (`20f5f5ff…`),
`.qa/production-console-audit.mjs` (`35b57c5a…`), `.qa/m8-www/verify-www-screen.mjs` (`b03706d4…`).
Les deux oracles **versionnés**, eux, sont durables et n'ont pas besoin d'archive :
`scripts/verify-www-redirect.mjs` et `scripts/capture-integrated.mjs` (`git ls-files` les confirme).

S'y ajoutent **43 captures d'écran** : les 37 de `.qa/t_f6c811c5-screen/` citées en section 6 et les
6 de `.qa/m8-www/screen/` — dont `mobile-375-echec.png`, la capture de sonde fautive. Leurs
empreintes individuelles sont dans l'inventaire complet de l'archive, non recopiées ici.

### 8.3 Les deux archives, et ce que chacune contient réellement

| Archive | Créée | Fichiers | SHA-256 de l'archive |
|---|---|---:|---|
| `.qa/m8-preuves.zip` — **historique**, intacte | 2026-09-09T17:51:03Z | 175 | `398c81f9ea9483d1d6c094b232c016e551634e22f6b937819262cb0af2937e55` |
| `.qa/m8-preuves-finales.zip` — **finale**, créée par cette consolidation | 2026-09-09T23:13:54Z | 64 | `7ea42716cd398a80862bd2cf4dde2dc149e643cdfbba92cd3ba2c6706ad97c45` |

> **Piège horaire, vérifié plutôt que supposé.** L'hôte est en WAT (UTC+1) et `stat -t '…Z'` imprime
> l'heure **locale** en la suffixant d'un `Z` mensonger : `.qa/m8-preuves.zip` y apparaît à
> « 18:51:03Z » alors que son mtime UTC réel est **17:51:03Z**. Toutes les heures de ce document sont
> relevées avec `TZ=UTC`. Contrôle de cohérence : le mtime UTC de `.qa/www-redirect.json` (22:49:25Z)
> coïncide avec le `measuredAt` inscrit dans le fichier (`2026-09-09T22:49:25.897Z`) — ce que
> l'heure locale, décalée d'une heure, ne ferait pas.

> ⚠️ **L'archive historique ne contient pas les preuves finales de ce rapport.** Elle a été scellée à
> 17:51 UTC ; les mesures qui fondent la validation ont été prises entre 20:26 et 22:49 UTC. Les
> seize rapports de la section 8.2 y ont été cherchés un par un, chemin par chemin, puis rehachés :

| Sort dans `.qa/m8-preuves.zip` | Combien | Lesquels |
|---|---:|---|
| **Absents** | 12 | `www-redirect.json`, `audit-seo.json`, `production-console-audit.json`, `playwright.json`, `mobile-menu.json`, `t_f6c811c5-screen/screen-report.json` et les six artefacts `m8-www/` (`check.log`, `build.log`, `screen/screen.json`, `oracle-red.json`, `oracle-green.log`, `playwright-apres-regle.log`) |
| **Présent, mais empreinte différente** | 1 | `.qa/m8/independent/report.json` : même nom, **même taille** (21 821 octets), pourtant `f98f2dd3…` dans l'archive contre `7f1ca2ff…` ici |
| **Identiques** | 3 | `report-before-email-normalization.json` (`e22a3e34…`), `cloudflare-deployments.log` (`de71bd5b…`), `cloudflare-projects.log` (`c358200a…`) |

> Trois des douze « absents » ont un **homonyme** ailleurs dans l'archive, issu du run de 17:xx et
> d'empreinte différente : `.qa/m8/tests/playwright-full-final.json` (`b947a64d…`),
> `.qa/m8/tests/mobile-menu.json` (`b2d35e34…`), `.qa/m8/screen/screen-report.json` (`5f8f5da1…`).
> Les confondre avec les rapports cités ici donnerait des comptes voisins et faux.
>
> Le cas de `independent/report.json` est le piège que ce contrôle sert à attraper : **nom identique,
> taille identique, contenu différent.** Seule l'empreinte le voit.
>
> L'archive historique reste utile comme trace de la passe de 17:xx, et n'a pas été écrasée : sa
> taille (14 137 075 octets) et son mtime (17:51:03Z) sont inchangés, son CRC est intact.

L'archive **finale** contient les 16 rapports **de mesure** de la section 8.2 (JSON et logs), les
4 oracles non versionnés, les 43 captures et un inventaire
`.qa/m8-preuves-finales-inventaire.txt` reprenant les 63 empreintes. Contrôle joué : chaque entrée
extraite du zip a été rehachée et comparée à son inventaire — **63/63 conformes, 0 divergence**,
CRC intact (`unzip -tq`).

> ⚠️ **L'archive finale ne contient aucun des trois rapports Markdown de `docs/qa/m8/`.** Vérifié
> plutôt que supposé : `unzip -l .qa/m8-preuves-finales.zip` donne **0 entrée `.md`** et **aucune**
> occurrence de `recette`, `audit-http` ou `docs/` sur ses 64 entrées. Ne pas confondre les deux
> emplois du mot « rapport » : les **16 rapports de mesure** (`.qa/*.json`, `.qa/*.log`) sont dans
> l'archive ; les **trois rapports Markdown** — celui-ci, `recette-production.md` et
> `audit-http-seo-t_95915808.md` — n'y sont pas. L'inventaire lui-même vit sous `.qa/` et n'est pas
> versionné non plus.
>
> Sauvegarder l'archive **sans** les rapports laisse les preuves sans le texte qui les interprète ;
> sauvegarder les rapports **sans** l'archive laisse le texte sans ses preuves. Les deux doivent
> partir ensemble — réserve 9.

```text
shasum -a 256 <chaque preuve citée>                     # inventaire
zip -X .qa/m8-preuves-finales.zip <preuves> <inventaire> # archive finale, sans écraser l'historique
unzip -p .qa/m8-preuves-finales.zip <entrée> | shasum -a 256   # relecture, 63/63
unzip -tq .qa/m8-preuves.zip                            # historique : CRC intact, non modifiée
git ls-files docs/qa/m8/                                # → recette-www.md seul : les 3 rapports ne sont pas versionnés
unzip -l .qa/m8-preuves-finales.zip | grep -c '\.md$'   # → 0 : aucun rapport Markdown dans l'archive
```

## 9. Réserves non bloquantes

Aucune de ces réserves n'empêche la validation ; chacune est explicite et déjà arbitrée.

1. **Mentions légales** — absence de téléphone professionnel MEMLIA et TVA non confirmée omise :
   **acceptées explicitement par Kevin**. Aucune conformité juridique exhaustive n'est revendiquée.
2. **Onze liens Légifrance** — challenges 403 historiques, non rejoués ici ; ils ne sont pas
   qualifiés de liens cassés.
3. **Seek lointain à froid sur Cloudflare Pages** — limite acceptée, aucune promesse de HTTP 206 ;
   la lecture continue est verte.
4. **Annotations internes dans le média R8 validé** — visibles, dont le texte de validation en bas
   du poster ; hors du périmètre de suppression arbitré (cartouche R5/Denise supérieur droit).
   Ce ne sont pas les microtextes interdits, retirés du DOM.
5. **Lecture globale des microtextes** acceptée : pas de garantie de lisibilité exhaustive.
6. **Règle Cloudflare non relue à la source** — effet mesuré, configuration non inspectée faute
   d'accès dashboard ; « Include subdomains » non vérifié. Le témoin `test-m8.memlia.fr` n'a aucun
   DNS, ce qui **n'exclut rien** et ne doit pas être présenté comme une preuve.
7. **Protection email Cloudflare** — sans JavaScript, la lecture des adresses en dépend.
8. **Couverture non revendiquée** : aucun appareil physique iPhone/Android, aucun VoiceOver ni
   TalkBack, aucune certification WCAG exhaustive, aucune audition humaine nouvelle, aucun
   Lighthouse rejoué dans cette passe, Chromium seul pour la passe écran depuis `www`.
9. **Rien de tout ceci n'est dans git, ni durable — ni les preuves, ni les rapports, ni les
   empreintes.** Trois familles d'artefacts, toutes locales à la machine de Kevin :
   - **Les preuves** : `.qa/` est ignoré (`.gitignore`, ligne `.qa/`).
   - **Les trois rapports Markdown** — `docs/qa/m8/recette-finale-publication.md`,
     `docs/qa/m8/recette-production.md`, `docs/qa/m8/audit-http-seo-t_95915808.md` — sont **non
     suivis par git** (`??` dans `git status`), donc **ni commités ni poussés**. Seul
     `docs/qa/m8/recette-www.md` est versionné. Le tableau d'empreintes de la section 8.2 vit dans
     le premier de ces trois : **il n'est pas durable non plus**.
   - **Les deux archives et leurs inventaires** : sous `.qa/`, hors git. L'archive finale ne
     contient pas les trois rapports (section 8.3).

   Conséquence à ne pas adoucir : **un clone frais du dépôt ne restitue ni les preuves, ni les trois
   rapports, ni les empreintes qui permettraient ne serait-ce que de constater une absence.** La
   perte du disque emporte l'ensemble, texte compris.

   Ce qui est réellement durable se limite au code du dépôt et aux deux oracles versionnés —
   `scripts/verify-www-redirect.mjs` et `scripts/capture-integrated.mjs`, tous deux présents dans
   `HEAD`.

   **Geste humain restant, non fait à ce jour** : sauvegarder hors machine
   `.qa/m8-preuves-finales.zip` **et, avec elle, les trois rapports Markdown**, puisque l'archive ne
   les embarque pas. L'archive historique `.qa/m8-preuves.zip` **ne contient pas** les preuves
   finales (section 8.3) : ne pas la présenter comme une sauvegarde de cette recette.

## 10. Gestes réellement effectués pendant M8, et absence de geste pendant la consolidation

Dire « aucun geste » sans préciser de quoi on parle serait faux : **M8 a modifié l'état du monde**.
Ce qui n'a rien modifié, c'est la passe de relecture qui produit ce document. Les deux tableaux
séparent l'un de l'autre.

### 10.1 Gestes réels de M8 — ce sont eux qui ont publié le site

| Geste | Auteur | Quand | Preuve |
|---|---|---|---|
| **Fast-forward de `main`** de `59ee1a1` vers le candidat `17f7658` | runner, sur go de Kevin | **2026-09-09T17:18:08Z** | `git reflog show main --date=iso` : `main@{2026-09-09 18:18:08 +0100}: merge 17f7658…: Fast-forward` (heure locale WAT ⇒ 17:18:08 UTC) |
| **Déploiement Cloudflare Pages `030591b5-bbc7-48b4-be1a-9d66c025e7a9`** (projet `memlia`, env. Production, branche `main`, source `17f7658`) | **déclenché humainement par Kevin**, le runner ayant été bloqué | **~17:25 UTC** — « 21 minutes ago » dans un relevé daté 17:46:01Z ; postérieur au fast-forward de 17:18, cohérent | `.qa/m8/cloudflare-deployments.log` (`de71bd5b…`) |
| **Ajout du CNAME `www` proxifié** et de son HTTPS dans la zone Cloudflare | Kevin, tableau de bord | **avant 20:26 UTC** : à la reprise de 20:26, 1.1.1.1 et 8.8.8.8 résolvaient déjà `www` vers les IP proxy Cloudflare, seule la résolution système restant en échec | `docs/qa/m8/recette-www.md`, section « État externe et accès » |
| **Activation de la règle Bulk Redirect `www → apex`** | Kevin, tableau de bord | **entre 20:26:58Z et 22:03:48Z** | l'oracle passe de **0/8 `ENOTFOUND`** à 20:26:58Z (`.qa/m8-www/oracle-red.json`, `89bbbac6…`) à **8/8** à 22:03:48Z puis 22:04:33Z (`.qa/m8-www/oracle-green.log`, `efa56da8…`) |
| **Deux commits de documentation et d'oracle** sur `main` : `976edd7` (**20:32:03Z**) et `3d0867d` (**22:13:54Z**) | runner | 9 septembre en soirée | `git diff --name-only 17f7658..HEAD` : `docs/qa/m8/recette-www.md` et `scripts/verify-www-redirect.mjs`, **rien de produit** |

Les trois gestes Cloudflare (déploiement, DNS, règle) sont **humains et hors dépôt**. Cette recette
en constate l'effet ; elle ne relit aucune configuration à la source, faute d'accès au tableau de
bord — voir la réserve 6.

### 10.2 La passe de consolidation — aucun geste nouveau, et c'est délibéré

- **Aucun `git push`.** `main` = `3d0867d`, `origin/main` = `59ee1a1`, `git rev-list --count
  origin/main..main` = **22**. La décision de pousser appartient à Kevin.
- **Aucun commit.** L'arbre de travail est celui trouvé à l'ouverture : `.claude/tasks/context_session_1.md`
  et `.gitignore` modifiés, `docs/qa/m8/` et quelques dossiers non suivis. Rien n'a été indexé.
- **Aucune modification de copy, de design ou de fichier produit.**
  `git diff --stat 17f7658..HEAD -- src public astro.config.mjs package.json package-lock.json` est
  **vide** ; les seuls fichiers écrits par cette passe sont `docs/qa/m8/recette-finale-publication.md`
  et deux artefacts sous `.qa/` (archive finale et son inventaire).
- **Aucun build, aucune suite rejouée, aucun déploiement, aucune preview, aucune fusion.** Les
  comptes de la section 2 sont ceux des rapports JSON déjà sur disque, pas de nouvelles exécutions.
- **Aucune écriture DNS, Cloudflare, `_redirects` ou Worker.**
- **Aucune archive écrasée.** `.qa/m8-preuves.zip` est intacte (section 8.3) ; l'archive finale est
  un **nouveau** fichier.
- **Aucun envoi externe** : pas de rendez-vous Cal.com, pas de formulaire, pas de mail.
- **La passe de correction du 10 septembre n'ajoute aucun geste** : elle réécrit la qualification des
  artefacts dans ce seul fichier (sections 8.2, 8.3, réserve 9, 11 et 12), sans mesure nouvelle, sans
  toucher l'archive scellée, sans indexer, commiter ni pousser quoi que ce soit.

**Il ne reste donc rien à redéployer** : l'avance de `main` sur le candidat publié ne touche que de
la documentation et un oracle de recette.

## 11. Auto-évaluation

| Axe | Note | Limite |
|---|---:|---|
| Exactitude | 5/5 | Chaque chiffre est relu dans l'artefact cité, chaque artefact est haché, et la comparaison à l'archive historique a été jouée entrée par entrée plutôt que supposée. Les mesures héritées sont datées et attribuées, non réattribuées à cette consolidation. |
| Complétude | 4/5 | Les trois conditions de sortie sont couvertes ; la règle Cloudflare n'est pas relue à la source, aucun Lighthouse n'est rejoué, et **ni l'archive finale ni les trois rapports** ne sont sauvegardés hors machine. |
| Clarté | 5/5 | Gestes réels de M8 et absence de geste de la consolidation séparés en 10.1/10.2 ; état courant séparé de l'historique ; **preuves, rapports, empreintes et archives tous qualifiés locaux et non versionnés**, les deux emplois du mot « rapport » distingués, sans confusion avec l'archive du soir. |
| Action | 4/5 | Restent trois gestes humains : `git push origin main`, sauvegarde hors machine de `.qa/m8-preuves-finales.zip` **accompagnée des trois rapports Markdown**, libération des enfants SEO précréés. |
| Concision | 3/5 | Volume assumé : la recette consolide deux audits et six passes de mesure, plus l'inventaire d'empreintes. |

Moyenne calculée : **4,2/5**. Kevin doit retrouver ici, sans chercher ailleurs, ce qui est
réellement publié, à quel commit, ce qui a été prouvé et par quelle commande, **quel geste a
réellement été posé et par qui**, où sont les preuves et sous quelle empreinte, et ce qui reste
explicitement non prouvé.

## 12. Journal des corrections de ce rapport

Corrections appliquées le **2026-09-09 en fin de soirée**, en réponse à deux demandes de revue.
Aucune mesure n'a été refaite : seules la qualification des preuves et l'attribution des gestes
changent.

1. **Archive** — la version précédente écrivait « les preuves listées existent localement et dans
   `.qa/m8-preuves.zip` ». C'était **faux** : vérification faite, **13 des 16** rapports cités n'y
   sont pas récupérables à l'identique — 12 absents, 1 présent sous une autre empreinte ; trois
   seulement s'y retrouvent inchangés. La réserve 9 est réécrite, la section 8.3
   documente l'écart entrée par entrée, et une **nouvelle** archive `.qa/m8-preuves-finales.zip` a été
   constituée à partir des preuves réellement citées, avec inventaire d'empreintes vérifié 63/63.
   L'archive historique n'a pas été touchée.
2. **Gestes** — la version précédente disait « pendant cette release : aucun `git push`, […] aucune
   écriture DNS ou Cloudflare », ce qui laissait croire que M8 n'avait rien changé. La section 10 est
   scindée : **10.1** liste les gestes réels de M8 (fast-forward, déploiement humain `030591b5`,
   CNAME `www`, règle Bulk Redirect) avec auteur, moment et preuve ; **10.2** liste ce que la passe de
   consolidation n'a pas fait. Le verdict en tête renvoie à cette distinction.

Correction appliquée le **10 septembre 2026**, également sans refaire aucune mesure :

3. **Durabilité** — la version précédente affirmait que le tableau d'empreintes était « la seule
   partie durable : il est dans `docs/`, donc dans git », et la réserve 9 que « ce qui est durable,
   c'est le tableau d'empreintes de la section 8.2 et les rapports de `docs/qa/m8/` ». Les deux
   étaient **fausses** : `git ls-files docs/qa/m8/` ne retourne que `recette-www.md`, et les trois
   rapports de cette recette sont `??` dans `git status` — non commités, donc non durables, comme le
   tableau qu'ils portent. De plus `unzip -l .qa/m8-preuves-finales.zip` donne **0 entrée `.md`** :
   l'archive finale ne contient pas les rapports, qui doivent donc être sauvegardés **avec** elle.
   Sections 8.2, 8.3 et réserve 9 réécrites en conséquence ; l'auto-évaluation suit. **L'archive
   scellée n'a pas été touchée** (`.qa/m8-preuves.zip` : 14 137 075 octets, mtime 17:51:03Z, `unzip
   -tq` sans erreur), et cette passe n'a produit **ni commit ni push**.
