# Crons SEO — suivre, optimiser, améliorer en continu

Proposition du 17 septembre 2026. **Statut : C1, C2, C3 et les extensions F1, F2, F3 sont construits et planifiés depuis les 17 et 18/09/2026 sur le go de Kevin ; le mode opératoire des sessions est [RUNBOOK-SEO.md](RUNBOOK-SEO.md). C4 et C5 restent des propositions, décisions D2 à D4 au §7.** Le seul cron en place est la forge éditoriale (`memlia-forge-quotidienne`, jours ouvrés 9 h, `RUNBOOK-QUOTIDIEN.md`) : elle écrit. Ce document décrit ce qui doit **mesurer, décider et corriger** autour d'elle, sur le modèle de `SEO-STRATEGY.md` §8 : des seuils de décision, pas des prévisions.

## 1. Ce que les instruments disent aujourd'hui (relevé du 17/09/2026)

Chaque ligne a été mesurée dans la session du jour, avec l'instrument nommé. C'est le point zéro des crons.

| Mesure | Valeur | Instrument |
|---|---|---|
| Sitemap | 14 URL, 0 erreur, 0 avertissement, renvoyé et relu le 17/09 à 13:14 UTC | Search Console, API Sitemaps |
| Indexation des 9 URL clés (accueil, blog, 6 articles, glossaire) | 9/9 « Submitted and indexed », canonique Google = canonique déclarée, pilier exploré le 16/09 à 23:47 UTC ; `http://memlia.fr/` = « Page with redirect » (301 vers https) | Search Console, URL Inspection en lecture |
| Search Console, 90 jours (19/06 → 14/09) | 10 clics, 52 impressions, position 3,7 ; **une seule page** (l'accueil) ; **deux requêtes** : « emlia » (11 impressions, position 2,5) et « mlia » (1) | API Search Analytics |
| Search Console, 28 jours | 3 clics, 15 impressions, **zéro ligne de requête** (anonymisées sous le seuil) | idem |
| SERP « automatisation cabinet comptable » (France, bureau) | AI Overview + People Also Ask ; eliott-markus, getyooz, agiris, queoval-expert, bonjouria, everial, factory456, septeo ; **memlia.fr absent des 20 premiers** | DataForSEO, REST direct |
| SERP « automatisation saisie comptable » | AI Overview + vidéo + PAA ; chaintrust, dext, medius, welyb, qonto, pennylane, sage ; **memlia.fr absent des 20 premiers** | DataForSEO |
| SERP « memlia » | `spell = did_you_mean → « mellia »`, 19 résultats Seb Mellia, bloc Knowledge Graph pour lui ; memlia.fr/contact au rang 20, **accueil absent** | DataForSEO |
| Autocomplétion « memlia » | aucune suggestion | suggestqueries.google.com |
| Liens entrants internes par article (pages distinctes, hors navigation) | relance 7, saisie 6, pilier 5, CRM DSN **3**, bulletins 7, tableau de bord 6 ; plancher §8 (≥ 3) tenu, le CRM DSN est au plancher | `dist` construit du jour |
| Sources externes des six articles | 17 URL distinctes (net-entreprises, cnil, service-public, impots, microsoft) ; **17/17 en 200**, deux au-delà de 25 s | curl avec l'UA du vérificateur |
| Vitesse (PageSpeed Insights, mobile) | accueil 96 / 100 / 100 / 100 ; pilier 99 ; article saisie 99 (plancher maison : 95) | API PSI v5 |
| Web Vitals de terrain | **aucune donnée** : trafic Chrome insuffisant | API CrUX |
| Autorité | Moz DA 4, 19 domaines référents, 28 liens externes, exploré le 26/07 | Moz, palier gratuit |
| Audience | seule balise servie : Cloudflare Web Analytics, injectée au bord (absente des sources) ; **le GA4 configuré dans le skill `seo` est celui de 1lab.fr, à ne jamais citer** | HTML servi, `google-api.json` |
| Dérive | baseline n° 1 de l'accueil posée (17 règles), 0 dérive | `seo-drift` |
| Indexabilité en production | PASS sur 14 URL | `scripts/verify-production-indexability.mjs` |

Lecture : la base technique est propre (indexée, rapide, canonique) et le site est **invisible sur la demande** ; la marque est réécrite. Les crons doivent donc (a) attraper les **premières impressions par famille** dès qu'elles apparaissent, parce que c'est ce qui décide de la réallocation des créneaux ; (b) garder la base propre pendant que le corpus est multiplié par six en deux mois ; (c) mesurer la confirmation d'entité.

## 2. Le principe

**Une boucle, pas une liste.** Écrire (la forge) → être indexé → apparaître → être cliqué → convertir → réallouer. Chaque cron tient un arc de la boucle et lit un seuil de `SEO-STRATEGY.md` §8, qui existe sur le papier sans instrument.

**Un script mesure, Claude juge.** Chaque cron est une tâche planifiée Claude Code (comme la forge) dont le travail lourd est un script déterministe (`scripts/seo/`) qui écrit un registre ; la session lit le verdict, écrit le journal, et dépose des tâches dans une **file de maintenance** que la forge consomme le vendredi. Claude ne mesure jamais « à la main », et une mesure absente est écrite comme absente, jamais remplacée par un souvenir.

**La règle de la maison.** Chaque registre nomme ce qu'il **écarte** (requêtes anonymisées, pages lentes, quotas) et ce qui **l'aurait fait rougir**. Un cron qui ne peut pas rougir ne prouve rien.

**Les interdits.** Aucune écriture dans Search Console hors le renvoi du sitemap déjà autorisé ; l'inspection d'URL par l'API est en **lecture seule**, le bouton « Demander l'indexation » reste à Kevin. Aucun article modifié hors une republication scellée par la forge. Aucune donnée nominative dans un registre (le formulaire de contact se compte, ne se cite pas). DataForSEO derrière la porte de coût (`dataforseo_costs.py check` puis `log`). Jamais un seuil déplacé pour rester vert.

## 3. Les cinq crons

### C1 — Sentinelle d'indexation et de dérive · tous les jours, 18 h 30

Google explore aussi le week-end ; la sentinelle tourne sept jours sur sept, après la journée de la forge.

- **Mesure.** Pour chaque URL de `sitemap-0.xml` : URL Inspection (lecture) → `coverage_state`, `last_crawl_time`, canonique Google contre canonique déclarée, `referring_urls`, rich results ; état du sitemap (dernière lecture par Google, erreurs) ; l'oracle maison `verify-production-indexability.mjs` ; `drift_compare.py` de chaque URL contre la baseline posée à sa publication (F1) ; les variantes `http://`, `www.`, barre finale ne doivent recevoir aucune impression.
- **Rouge.** Une URL publiée depuis plus de 7 jours qui n'est pas « Submitted and indexed » ; une canonique divergente ; une URL sortie de l'index ; un sitemap non relu depuis 72 h ou en erreur ; une dérive CRITICAL ou WARNING sans déploiement depuis la baseline ; l'oracle d'indexabilité en FAIL.
- **Déclenche.** Une ligne de journal avec la cause et l'URL. Pour Bing : un ping IndexNow (gratuit, dès que la clé est posée, §7). Pour Google : la liste des URL à « Demander l'indexation », action manuelle de Kevin. Rien d'autre : la sentinelle ne corrige pas, elle nomme.
- **Coût.** 0 $. 14 inspections par jour aujourd'hui, une cinquantaine en décembre, pour un quota de 2 000.
- **N'est pas mesuré.** La position, le rendu visuel, ce que Google a compris de la page.

### C2 — Relevé de demande · le lundi, 7 h

Avant la forge, pour que le lundi commence par ce que Google a montré la semaine passée (décalage de deux à trois jours des données).

- **Mesure.** Search Console sur la semaine ISO close et sur 28 jours glissants : par page, par requête, par page × requête, par jour ; agrégation **par famille** via le registre des requêtes (§5), qui relie chaque article à sa requête primaire, ses secondaires et sa famille. Puis DataForSEO, SERP France bureau, pour la requête primaire de chaque article publié et pour « memlia » : rang de memlia.fr, dix premiers domaines, blocs (AI Overview, PAA, vidéo), champ `spell`. GSC ne montre que les positions où l'on a eu des impressions ; la SERP montre **qui est là quand on n'y est pas**, et si un AI Overview a pris la place.
- **Détections.** Requêtes à portée : position 5 à 20 avec impressions → candidate au recalage de titre ou d'introduction. CTR anormal : 20 impressions ou plus et CTR sous 1 % → titre et description. Requête nouvelle jamais vue. Famille à **zéro impression après trois satellites** (§8) → proposition de réallocation des créneaux, décision de Kevin. Chute : impressions divisées par deux d'une semaine à l'autre sur une page à 20 impressions ou plus ; requête de marque qui perd le rang 1. Annotation des mises à jour de classement Google (page officielle `developers.google.com/search/updates/ranking`, en HTML ; le script `seo_updates.py` du skill est cassé, fichier de données absent).
- **Déclenche.** Des tâches dans la file de maintenance (`recaler-titre`, `rafraichir`) et une ligne de journal par semaine, même quand tout est à zéro : **zéro est une mesure**, et la série commence au jour un.
- **Coût.** Search Console : 0 $. DataForSEO : 0,0035 $ par requête mesuré aujourd'hui, soit 7 requêtes maintenant (0,025 $ par semaine) et une quarantaine fin novembre (0,15 $ par semaine).
- **N'est pas mesuré.** Les requêtes anonymisées (le total `totals_complete` dit si la somme des lignes est complète) ; la SERP mobile et les autres localisations.

### C3 — Intégrité éditoriale et technique · le mercredi, 7 h

- **Sources.** Pour chaque article publié, chaque source du manifeste : ouverture avec l'UA du vérificateur (`MemliaBlogSourceVerifier/1.0`), code final, URL finale (une redirection vers une autre page est une alerte), et **présence de l'extrait exact** (`excerpt`) dans le HTML : c'est la preuve du claim, pas seulement le code HTTP. Lent n'est pas mort : deux pages dépassent 25 s aujourd'hui ; trois essais espacés avant de déclarer.
- **Maillage.** Liens entrants par article depuis `dist` (≥ 3, §8), pilier ↔ satellite dans les deux sens, ancres de glossaire résolues, aucune orpheline, chaque nouvel article lié depuis le pilier là où sa famille est nommée. « À lire ensuite » liste déjà les autres articles du plus récent au plus ancien, donc les anciens pointent d'eux-mêmes vers les nouveaux ; ce que ce bloc ne fait pas, c'est le lien **dans le corps**, celui qui porte une ancre parlante.
- **Vitesse.** PSI mobile sur l'accueil, `/blog`, le pilier, le dernier article, `/contact`, `/glossaire` ; plancher maison 95 (consigne du 08/09/2026) ; LCP, CLS, INP de laboratoire ; CrUX d'origine le jour où il existera. Les dérivés d'image AVIF et WebP de chaque article sont le premier suspect si le LCP glisse.
- **Rouge.** Source hors 200 après trois essais, extrait absent, ou redirigée ailleurs → l'article passe `a-maintenir` ; article sous trois liens entrants ; performance sous 95 ; CLS au-dessus de 0,1.
- **Déclenche.** File de maintenance (`reverifier-source`, `inserer-lien`) ; pour la vitesse, un ticket dans le journal, jamais un correctif automatique.
- **Coût.** 0 $.
- **N'est pas mesuré.** Une page source dont le sens change sans que l'extrait bouge.

### C4 — Autorité, entité et visibilité IA · le 1er du mois, 7 h 30

- **Autorité.** Moz (gratuit) : DA, domaines référents, nouveaux et perdus ; Common Crawl ; Bing inbound links dès que memlia.fr y sera vérifié ; DataForSEO `backlinks_summary` (0,02 $) pour les mouvements du mois ; les trois fiches `sameAs` (annuaire-entreprises, pappers, societe.com) et la page LinkedIn répondent toujours.
- **Entité.** SERP « memlia » : le champ `spell` (`did_you_mean → mellia` aujourd'hui) et le rang de `memlia.fr/` ; autocomplétion « memlia » ; Knowledge Graph (`/seo google entity`). **Le KPI** : le jour où `spell` disparaît et où l'accueil prend le rang 1, l'entité est confirmée.
- **IA.** DataForSEO `ai_optimization_chat_gpt_scraper` avec `force_web_search: true` sur l'échantillon versionné C1 + C6 + glossaire : memlia.fr cité ? quels domaines et quelles pages occupent la réponse ? La notoriété sans recherche reste un historique séparé, jamais un dénominateur de citation. Le relevé mesure aussi les règles réellement servies à onze crawlers/fetchers, le `x-robots-tag` de l'accueil, et la présence de `llms.txt` sans lui attribuer d'effet.
- **Rouge.** DA qui recule ; domaine référent toxique nouveau ; `spell` toujours actif à M+3 (décembre) → plan d'entité (annuaires, mentions, LinkedIn) ; zéro citation IA à M+6.
- **Coût.** Environ 0,40 $ par mois.
- **N'est pas mesuré.** La qualité d'une mention, le trafic réel des assistants IA (la plupart arrivent sans référent).

**Construit le 19/09/2026, instrument corrigé le 21/09.** `scripts/seo/autorite.mjs`, règles pures dans `scripts/lib/seo-autorite.mjs`, relevé dans `mesures/mois-<AAAA-MM>-autorite.json`, mode opératoire dans [RUNBOOK-SEO.md](RUNBOOK-SEO.md) §4 bis. Premier relevé d'autorité : 6 domaines référents, marque toujours réécrite en « mellia ». Les six réponses historiques sans recherche mesurent seulement la notoriété. Le scraper ancré est câblé et testé ; la première ligne de base complète reste `NON_MESUREE` tant que DataForSEO répond HTTP 402, sans faux zéro et sans effacer les dernières mesures valides.

### C5 — Décroissance et cannibalisation · mensuel, armé en décembre 2026 (M+3)

Inutile avant qu'il y ait du trafic à perdre ; C2 accumule d'ici là la série dont C5 a besoin.

- **Décroissance.** `content_decay.py` (skill `blog-decay`) sur 28 jours contre les 28 précédents, par page : −20 % avertissement, −40 % élevé, −60 % critique → rafraîchir (`blog-rewrite` par la forge), chercher le glissement de requête, ou consolider.
- **Cannibalisation.** Une requête avec impressions sur **deux pages memlia ou plus** la même semaine (GSC page × requête) ; et le mode local du skill `blog-cannibalization` sur titres, H1 et H2 du corpus, qui grossit de quatre articles par semaine → différencier, fusionner, ou ne rien faire en le notant. Le backlog est propre aujourd'hui : 236 requêtes primaires, aucun doublon.
- **Coût.** 0 $ (DataForSEO `page_intersection` à 0,01 $ en option).

## 3 bis. Maillage interne : ce qui a été ajouté le 18/09/2026

Lecture de « 8 internal linking hacks to improve SEO » (Distribb, Borja). Sa preuve est l'observation de onze pages Mailchimp **sans test d'effet sur le classement**, l'auteur l'écrit ; la structure vaut d'être copiée, l'effet n'est pas démontré. Trois de ses huit étapes manquaient chez nous, les cinq autres étaient déjà tenues ou sans sujet.

| Étape de l'article | Chez nous |
|---|---|
| relever Search Console | C2, depuis le 17/09 |
| grouper les sujets | fixé par `src/data/familles.ts` (60 familles, 12 pôles) : une donnée, pas une découverte |
| choisir les piliers | un seul `format: pillar-page`, verrouillé par `test_build.py`, Playwright et C3 |
| choisir les pages de conversion | l'appel unique de la charte ; **routes mesurées depuis le 18/09** |
| choisir les articles de soutien | C3, liens entrants ≥ 3 |
| pousser les pages de page 2 | **aucun sujet** : 0 impression sur les six articles, memlia absent du top 20. À armer dans C2 aux premières impressions |
| liens du pied de page | déjà en place (cinq pages commerciales, blog, glossaire) : contrôle unique, pas une routine |
| varier les ancres | **mesuré depuis le 18/09**, avec la réserve que l'article pose lui-même : répéter l'ancre la plus claire est voulu |

Construit : deux volets dans C3 (ancres, routes) et l'extension **F3** de la forge (les liens qui manquent autour d'un article, dans les deux sens). Détail des règles et des refus dans [RUNBOOK-SEO.md](RUNBOOK-SEO.md) §4 et §6 bis.

## 3 ter. Le relevé des questions : ce qui a été ajouté le 19/09/2026

Revue de la stratégie blog avec Kevin : les articles sont bons (97 à 99) mais posés sur des requêtes dont le chercheur n'est pas l'acheteur, et le backlog avait été construit de l'intérieur (60 familles) sans mesure de demande. Décisions : **la cadence reste à quatre par semaine** ; le mécanisme est nommé dans la charte (§2 bis « la règle écrite ») et exigé par la forge pour tout article daté à partir du 19/09 ; le backlog se recale depuis les questions mesurées ; les six articles publiés ne bougent pas avant une lecture Search Console utile (mi-octobre).

Construit : `scripts/seo/questions.mjs` (relever, rapport, recaler ; règle dans `scripts/lib/seo-questions.mjs`), l'invariant « priorité 1 ⇒ demande mesurée » dans `build-cluster-plan.py --check`, l'alerte d'autocomplétion dans **C2**, les amorces de marché `mesures/amorces-marche.json`. Détail dans [RUNBOOK-SEO.md](RUNBOOK-SEO.md) §3 bis. Ce que cela ne mesure pas : le volume exact d'une requête (l'autocomplétion est un seuil, pas un compte) et l'effet sur le classement (aucune impression sur les articles à ce jour).

## 4. Deux extensions de la forge existante

- **F1, à la publication (§5 du runbook).** Poser la baseline de dérive de l'URL publiée (`drift_baseline.py --skip-cwv`), inscrire la requête primaire et les secondaires au registre des requêtes, envoyer un ping IndexNow (Bing) quand la clé existe.
- **F2, le vendredi (§6 du runbook).** Consommer `editorial/maintenance.json` par gravité, deux tâches au plus par vendredi, toujours par **republication scellée** (recette corrigée, `preparer`, revue, `sceller`, `publier`). Types : `recaler-titre`, `reverifier-source`, `inserer-lien`, `rafraichir`. La règle « aucun article modifié hors la forge » reste entière.

## 5. Où vont les mesures

- `docs/strategy/site-v3/mesures/registre-requetes.json` : `{ "slug": "…", "url": "https://memlia.fr/blog/…", "requete": "…", "secondaires": ["…"], "famille": "…", "publie_le": "2026-09-17" }`, initialisé depuis `backlog-v3.json` et corrigé par l'audit des titres du 17/09 ; les trois articles antérieurs à la v3 (hors backlog) y entrent avec les requêtes retenues ce jour-là.
- `.qa/seo/` (non suivi, comme `.qa/indexation/`) : les relevés bruts quotidiens de C1.
- `docs/strategy/site-v3/mesures/semaine-2026-W38.json`, `mois-2026-09.json` : les instantanés de C2, C3, C4, C5, commités avec leur ligne de journal. La série vit dans git.
- `editorial/maintenance.json` : `{ "slug": "…", "type": "recaler-titre", "motif": "…", "mesure": { "valeur": "…", "instrument": "…", "date": "2026-09-21" }, "gravite": "haute", "cree_le": "2026-09-21", "statut": "a-faire" }`.
- `JOURNAL.md` : une ligne par exécution qui a quelque chose à dire, une par semaine au minimum pour C2.

## 6. Ordre de mise en place et coûts

| Ordre | Cron | Prérequis | Coût API | Session |
|---|---|---|---|---|
| 1 | C1 sentinelle | aucun (accord sur l'inspection en lecture) | 0 $ | courte, quotidienne |
| 2 | C2 relevé de demande + F1 | registre des requêtes | ≈ 0,6 $/mois en novembre | 15 min, hebdomadaire |
| 3 | C3 intégrité + F2 | file de maintenance | 0 $ | 10 min, hebdomadaire |
| 4 | C4 autorité, entité, IA | Bing vérifié, jeton Cloudflare Analytics (facultatifs) | ≈ 0,4 $/mois | 15 min, mensuelle |
| 5 | C5 décroissance | trois mois de série C2 | 0 $ | 15 min, mensuelle, dès décembre |

Total DataForSEO : moins de 1 $ par mois ; Google : 0 $ ; Higgsfield : rien.

## 7. Ce que Kevin seul peut faire, et les décisions demandées

Étapes hors de portée d'un agent (secrets, comptes tiers) :

- **Bing Webmaster Tools** : vérifier memlia.fr (import depuis Search Console en un clic). Débloque IndexNow (une clé libre, fichier `public/<clé>.txt`, que l'agent posera) et les liens entrants Bing ; Bing alimente ChatGPT et Copilot.
- **Cloudflare** : un jeton d'API « Account Analytics : Read », posé en variable d'environnement comme ceux de DataForSEO, jamais dans le dépôt. Débloque les référents (dont les assistants IA) de Cloudflare Web Analytics.
- **Search Console** : confirmer que l'inspection d'URL **en lecture seule** par l'API convient à C1 ; le bouton « Demander l'indexation » reste manuel.

Décisions :

- **D1** — go sur C1, C2, C3 et les deux extensions F1, F2 (0 $ hors les centimes DataForSEO). Recommandation : oui, dans cet ordre, une tâche planifiée par cron.
- ~~**D2**~~ — **accordée et construite le 19/09/2026** : C4 tourne le 1er du mois à 7 h 30, budget explicite écrit dans chaque relevé. ⚠ Périmètre révisé sur mesure : les citations d'assistants ne sont pas mesurables sur ce compte (l'interface répond sans recherche web), seul « la marque est nommée » l'est. Ancien libellé : C4 avec les endpoints IA de DataForSEO (0,05 $ l'appel, sous confirmation dans la porte de coût). Recommandation : oui, une fois par mois.
- **D3** — les trois étapes ci-dessus, **seul Kevin peut les faire**, et voici ce que chacune débloque au juste :
  1. **Bing Webmaster Tools** (bing.com/webmasters) : « Importer depuis Google Search Console », un clic, aucune balise à poser. ⚠ **Correction mesurée le 19/09/2026 : la vérification Bing ne débloque PAS IndexNow.** Une URL réelle a été envoyée et acceptée en HTTP 200 sans que memlia.fr soit vérifié dans Bing Webmaster (`node scripts/seo/forge-seo.mjs indexnow envoyer <url>`) ; la clé est servie depuis le 17/09 et suffit. Ce que la vérification apporte vraiment : la vue de ce que Bing a indexé, les liens entrants que Bing connaît et que Moz ignore, et la confirmation que nos envois atterrissent. C'est de la **mesure**, pas un levier — l'affirmation inverse venait du cadrage et n'avait jamais été éprouvée.
  2. **Le seul geste qui débloque vraiment une mesure : le jeton Cloudflare « Account Analytics : Read »** (tableau de bord, Mon profil, Jetons d'API) : à poser en variable d'environnement comme ceux de DataForSEO, **jamais dans le dépôt**. Il débloque les référents de Cloudflare Web Analytics, seule façon de voir arriver un visiteur envoyé par un assistant.
  3. **Accord sur l'inspection d'URL en lecture seule** par l'API pour C1 : le bouton « Demander l'indexation » reste manuel et le restera.
- ~~**D4**~~ — **fait le 19/09/2026** : le formulaire retient le chemin de la page d'origine (champ caché, chemin interne seulement), colonne ajoutée à la base, politique de confidentialité mise à jour, schéma versionné dans `docs/qa/contact/schema-d1.sql`. Ancien libellé : le formulaire de contact n'enregistre pas la page d'origine (colonnes : `recu_le`, `nom`, `cabinet`, `courriel`, `message`, `statut`) ; le seuil M+6 « demandes citant un article » ne se mesurera que sur le texte du message. Ajouter un champ caché « page d'origine » est un changement produit, à décider séparément.

## 8. Ce que ces crons ne feront jamais

Ils n'écrivent pas dans Search Console (hors sitemap), ne publient rien hors la forge, ne modifient pas un titre sans republication scellée, n'inventent pas un chiffre absent, ne stockent aucune donnée nominative, ne déplacent aucun seuil, et ne déclarent pas un incident sur une signature HTTP sans lire les étages de déploiement (leçon du 17/09).
