# M8 — Reprise www du 9 septembre 2026

> **État au 9 septembre 22h05 UTC : le blocage est levé, la redirection fonctionne.** La règle Cloudflare
> décrite plus bas a été activée côté humain entre les deux reprises. Voir « Levée du blocage » en fin de
> document pour les mesures. Les sections qui suivent restent l'état **historique** de la reprise de 21h30 :
> elles décrivaient un blocage réel à ce moment-là, elles ne décrivent plus la production.

## Verdict : configuration Cloudflare requise, pas de correctif Astro

Le choix humain **configurer www** est conservé. La voie préférée `_redirects` est **inapplicable** : le parseur Wrangler 4.101.0 rejette réellement une source absolue. Aucun `_redirects` ajouté à `public/` ou `dist/`, aucune copy/design modifiée, aucun Worker ajouté, aucune preview/production déployée, aucun push.

Le candidat publié reste `17f7658da65038763ade695c96cf40b43e5fb3cf` (déploiement humain `030591b5`). Cette reprise apporte seulement un oracle HTTP et ce runbook ; elle ne revendique pas la résolution de www.

## Preuve de la limite `_redirects`

Sources officielles consultées le 9 septembre :

- https://developers.cloudflare.com/pages/configuration/redirects/ — tableau « Advanced redirects », `Domain-level redirects` non pris en charge.
- https://developers.cloudflare.com/pages/how-to/www-redirect/ — redirection www via **Bulk Redirects**.

Sonde jetable, jamais publiée : `.qa/m8-www/probe/_redirects`, contenant `https://www.memlia.fr/* https://memlia.fr/:splat 301`.

Commande jouée : `npx wrangler pages dev .qa/m8-www/probe --ip 127.0.0.1 --port 8797 --inspector-port 9297 --compatibility-date=2026-06-23`.

Résultat : **0 règle valide, 1 invalide**, `Only relative URLs are allowed. Skipping absolute URL https://www.memlia.fr/*`. Le serveur local démarre puis répond **200**, pas 301, avec `Host: www.memlia.fr` sur `/blog?source=www-test`. Preuves : `wrangler-probe.log`, `probe-headers.txt`, `probe-response.html` sous `.qa/m8-www/`.

Premier démarrage sans date explicite : le parseur rejetait déjà la règle, puis workerd refusait la date automatique 2026-09-09, supérieure à son maximum 2026-06-23. Second démarrage borné à la date supportée : même rejet de règle, serveur réellement démarré. Ce problème d'outillage est séparé de la limite fonctionnelle.

Ne pas remplacer la source par `/*` : une telle règle toucherait aussi l'apex et créerait une boucle. Ne pas utiliser une redirection JavaScript, qui laisserait HTTP200 et ne satisferait pas le contrat SEO.

## État externe et accès

- 1.1.1.1 et 8.8.8.8 résolvent www vers les IP proxy Cloudflare. Le CNAME humain est reconnu par les résolveurs publics.
- Résolution système normale : `curl` code6 et oracle Node `ENOTFOUND` lors de cette mesure. Ne pas présenter une résolution forcée comme preuve de propagation normale.
- Diagnostic séparé avec `curl --resolve www.memlia.fr:443:104.21.31.118` : HTTPS accepté sans `-k`, `/blog?source=www-test` répond **200 sans Location**. Ce n'est donc pas uniquement une question de cache DNS : la redirection manque réellement.
- `wrangler whoami` relu : OAuth Pages write et zone read, aucune permission d'édition des règles/listes de redirection annoncée. Aucun secret lu ou copié ; aucune nouvelle requête API403 revendiquée dans ce run.
- L'outil navigateur échoue avant navigation (`browser-harness: daemon default didn't come up`). Le challenge dashboard/403 DNS précédents restent des faits hérités, pas de nouvelles mesures.

## Action Cloudflare requise — sans redéployer le site

Dans le compte Cloudflare du projet **memlia**, **Bulk Redirects** :

1. Vérifier qu'aucune règle équivalente n'existe avant d'en créer une.
2. Créer une liste de redirection nommée `memlia_www_to_apex` avec **une seule entrée** :

| Champ | Valeur |
|---|---|
| Source URL | `www.memlia.fr/` (sans schéma : HTTP et HTTPS) |
| Target URL | `https://memlia.fr/` |
| Status | **301** |
| Preserve query string | **activé** |
| Subpath matching | **activé** |
| Preserve path suffix | **activé** |
| Include subdomains | **désactivé** : seul www est demandé |

3. Créer/activer une règle Bulk Redirect utilisant cette liste. Relire la liste **et** l'état actif de la règle.
4. Conserver le CNAME www proxy déjà ajouté et son HTTPS ; ne pas remplacer le DNS fonctionnel par l'exemple générique du guide.
5. Vérifier réellement les réponses ci-dessous. Aucune nouvelle commande Wrangler de publication n'est nécessaire pour une règle de compte.

Le runner ne dispose pas ici de l'accès permettant de faire cette écriture. Kevin doit l'appliquer dans son tableau de bord authentifié, ou fournir un accès autorisé adapté sans transmettre de secret dans le chat.

## Oracle prêt à rejouer

`node scripts/verify-www-redirect.mjs`

- Huit cas indépendants : accueil, query simple, blog, query encodée et clés répétées, légales, robots, sitemap, vraie404.
- Résolution normale, TLS vérifié, suivi manuel : **301 exact**, **Location exacte** préservant chemin/query, destination sans second saut, statut final attendu, canonical apex unique et indexabilité des pages HTML.
- Les légales restent intentionnellement noindex ; pas de noindex global Cloudflare sur apex.
- Rapport horodaté `.qa/www-redirect.json`, statut de sortie1 si un seul cas échoue. Les huit cas sont toujours comptés, pas d'arrêt au premier échec.
- Première exécution réelle : **0/8**, huit `ENOTFOUND`, exit1. Copie conservée `.qa/m8-www/oracle-red.json`. Aucun faux vert ni résultat synthétique.

Cet oracle cible les chemins canoniques. Il ne prétend pas éliminer les normalisations supplémentaires de Pages sur d'anciennes URLs `.html` ou slash terminal ; il exige un seul saut sur les huit chemins déclarés.

## Contrôles frais du candidat inchangé

- Astro check : **0 erreur, 0 warning, 1 hint** hérité (`scripts/lighthouse.mjs`).
- Build : **7 pages**, oracle Python **28/28**, images **23/23**.
- Chaîne indépendante apex : **12/12 routes et 46/46 autres fichiers**, **0 exclusion**, **0 erreur**, soit **58/58** fichiers dist. Comparaison HTML après décodage email Cloudflare et comptage des transformations, méthode M8 conservée. Rapport `.qa/m8-www/independent/report.json`.
- Écran réel headful : hero375 et1440 capturés puis examinés, titre/CTA/navigation présents, aucun débordement évident sur ces vues. Contrôles vidéo visibles en mobile ; bas du lecteur hors capture desktop, aucune lecture45s supplémentaire revendiquée.
- Suite navigateur complète sur `https://memlia.fr` : **64/64**, **0 skipped, 0 unexpected, 0 flaky**, durée204555,835ms. Rapport `.qa/m8-www/playwright.json`, log associé ; aucune nouvelle passe Firefox/WebKit créditée.

Les réserves juridiques déjà acceptées, seek à froid et lecture globale restent inchangées. Les mesures de la recette précédente restent historiques, non réattribuées à cette reprise.

## Suite — état historique du 9 septembre 21h30, satisfait depuis

M8 restait ouverte/bloquée jusqu'à activation de la règle et oracle réel **8/8** en résolution normale. Après configuration : vérifier aussi la navigation mobile/desktop via www, puis libérer les enfants SEO précréés. Ne pas demander une nouvelle publication du site pour une correction de règle Cloudflare. **Les deux conditions sont mesurées vertes ci-dessous ; la publication n'a effectivement pas été refaite.**

## Auto-évaluation de la reprise de 21h30 (historique)

Exactitude4/5 (parseur et réseau réellement mesurés, droit API non exercé), complétude2/5 (redirection non activée), clarté4/5 (distinction cache DNS/règle manquante), action4/5 (valeurs et oracle livrés, geste humain restant), concision4/5 (preuves détaillées séparées du résumé). Moyenne calculée3,6/5. Priorité : activer la règle puis obtenir8/8 en DNS normal ; un nouveau build ne comble pas ce manque. Kevin attend une redirection fonctionnelle : la tâche n'est donc pas terminée.

## Levée du blocage — reprise du 9 septembre 22h00-22h12 UTC

Aucun fichier de production modifié, aucun build, aucune preview, aucune publication, aucun `git push`, aucune fusion. Le candidat publié reste `17f7658da65038763ade695c96cf40b43e5fb3cf` ; `main` local est ce candidat plus un unique commit `976edd7` qui ne touche que `docs/qa/m8/recette-www.md` et `scripts/verify-www-redirect.mjs` (`git diff --stat 17f7658..976edd7` : 2 fichiers, 146 insertions, zéro fichier produit). **Il n'y avait donc rien à redéployer.**

### Ce qui a changé, et ce qui ne vient pas de nous

La règle Cloudflare a été activée côté humain. Cette reprise **n'a pas d'accès au tableau de bord** : elle constate l'effet de la règle, pas sa configuration. Le paramètre « Include subdomains » n'est donc pas relu à la source ; le témoin `test-m8.memlia.fr` n'a aucun DNS, ce qui n'exclut rien et ne doit pas être présenté comme une preuve d'exclusion.

La résolution DNS système, défaillante lors de la reprise précédente, est rétablie : `dig` système, `1.1.1.1` et `8.8.8.8` rendent les trois fois `172.67.176.125` et `104.21.31.118`. Toutes les mesures ci-dessous sont en **résolution normale**, `forcedDns: false`.

### Oracle — 8/8, sortie 0

`node scripts/verify-www-redirect.mjs`, deux exécutions indépendantes (22:03:48 et 22:04:33 UTC), **8/8** les deux fois, code de sortie **0**. Rapport `.qa/www-redirect.json`, log `.qa/m8-www/oracle-green.log`. Le rouge d'origine reste conservé et non écrasé dans `.qa/m8-www/oracle-red.json` (0/8, huit `ENOTFOUND`).

Les huit cas passent : accueil, query simple, blog, **query encodée à clés répétées** (`?source=a%2Fb&tag=un&tag=deux&term=cabinet+comptable`, rendue à l'identique dans le `Location`), légales, `robots.txt`, `sitemap.xml`, vraie 404. Chaque cas vérifie 301 exact, `Location` exacte, absence de second saut, statut final attendu, canonical apex unique et indexabilité — les légales restent `noindex` intentionnel, la 404 arrive bien en 404 après le saut.

### Contrôles indépendants de l'oracle

| Contrôle | Attendu | Mesuré |
|---|---|---|
| `https://memlia.fr/` | 200, **pas** de redirection | 200, `redirect_url` vide |
| `https://memlia.fr/blog` | 200, pas de redirection | 200, `redirect_url` vide |
| `https://www.memlia.fr/blog?source=www-test` suivi | 1 saut | `num_redirects=1`, final apex, 200 |
| `http://www.memlia.fr/blog?...` (HTTP nu) | chaîne propre | 2 sauts : `http://www` → `https://www` → `https://memlia.fr` |
| `http://memlia.fr/blog` (témoin apex HTTP nu) | 1 saut | 1 saut vers HTTPS |

L'apex ne redirige pas : **la règle ne boucle pas**. Les 2 sauts depuis HTTP nu sont la forclusion HTTPS suivie de la règle — même motif que l'apex, plus un saut ; c'est le comportement attendu et non un défaut.

### Passe écran — 2/2, sortie 0

`node .qa/m8-www/verify-www-screen.mjs` (sonde jetable, hors dépôt), Chromium, départ réel sur `https://www.memlia.fr/`. Rapport `.qa/m8-www/screen/screen.json`, captures dans le même dossier.

En **375** et en **1440** : chaîne document `301 www → 200 apex`, URL finale `https://memlia.fr/`, **un seul H1** (« Automatisez les tâches qui ralentissent votre cabinet. »), canonical apex, **débordement horizontal 0 px**, puis navigation interne réelle vers `/blog` (H1 « Ce qui se vérifie, ce qui s'automatise, ce qui se décide. »). En mobile, le burger est ouvert d'abord et son `aria-expanded` passe à `true`.

**Le premier passage était rouge en mobile, par défaut de la sonde et non du site** : le lien `/blog` vit dans le menu replié, la sonde cliquait un élément présent mais invisible. Corrigée pour ouvrir le burger, comme un humain. L'artefact `.qa/m8-www/screen/mobile-375-echec.png` est la capture de **cette première sonde fautive** — ne pas le lire comme un défaut de production.

### Suite navigateur contre la production

`QA_URL=https://memlia.fr npx playwright test` après activation de la règle : **64/64**, code de sortie **0**, 3,6 min. Log `.qa/m8-www/playwright-apres-regle.log`. Confirme qu'une règle au niveau du compte n'a pas perturbé l'apex.

### Ce qui n'est pas prouvé ici

Chromium seul pour la passe écran : pas de Firefox, WebKit, Safari iOS ni lecteur d'écran. Pas de Lighthouse rejoué, pas de nouvelle lecture vidéo 45 s, pas de suite Python ni de build rejoués — l'arbre de travail est inchangé et la correction est côté compte Cloudflare, pas côté dépôt. L'oracle vise les huit chemins canoniques déclarés ; il ne prétend rien sur d'anciennes URLs `.html` ou à slash terminal. Les réserves héritées (juridique acceptée, seek à froid, lecture globale) restent inchangées.

### Auto-évaluation de cette reprise

Exactitude 5/5 (deux exécutions de l'oracle, contrôles indépendants, rouge de sonde attribué à la sonde et non au site), complétude 4/5 (les deux conditions de sortie satisfaites ; règle non relue à la source faute d'accès), clarté 4/5 (historique et état courant séparés explicitement), action 4/5 (blocage levé, reste à pousser `main` et à libérer les enfants SEO), concision 3/5 (document long, mais l'historique est conservé par doctrine). Moyenne calculée 4,0/5. Priorité restante : décision humaine sur `git push origin main` (21 commits d'avance) et libération des enfants SEO précréés.
