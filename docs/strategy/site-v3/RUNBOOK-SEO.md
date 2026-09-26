# Mode opératoire des crons SEO — sentinelle, relevé de demande, intégrité, et les deux extensions de la forge

Construit le 17 septembre 2026 sur le go de Kevin (« go, construis C1, C2, C3 et les deux extensions »), d'après [CRONS-SEO.md](CRONS-SEO.md), qui dit le pourquoi. Trois tâches planifiées Hermes tournent avec le profil GPT configuré sur ce Mac, chacune dans une session neuve : **memlia-sentinelle-seo** (tous les jours, 18 h 30), **memlia-releve-demande** (le lundi, 7 h), **memlia-integrite** (le mercredi, 7 h). Ce document est la seule mémoire de la procédure ; lire aussi `RUNBOOK-QUOTIDIEN.md` §0 pour les rails du dépôt.

## 0. Rails non négociables

- **Dépôt** : `/Users/kevinkitanga/dev/interne/memlia-landing`, branche `main`. Toujours `git add -- <chemins>` puis `git commit -m "…" -- <chemins>` ; jamais `git commit -a`, jamais `--amend`, jamais `--force`, aucun accent grave dans un message de commit. Le push publie (Cloudflare Pages construit `main`) : un commit de mesures ne change pas le site.
- **Search Console en lecture seule.** `scripts/seo/gsc.py` n'appelle aucune méthode d'écriture. Le renvoi du sitemap reste `scripts/gsc-resubmit-sitemap.py` (seule écriture autorisée par Kevin) ; le bouton « Demander l'indexation » reste à Kevin : la sentinelle **liste** les URL, elle ne clique pas.
- **Aucun article n'est modifié par un cron.** Les crons déposent des tâches dans `editorial/maintenance.json` ; la forge les traite le vendredi par republication scellée (§6). Un cron ne corrige jamais un titre, un lien ou une source.
- **DataForSEO** derrière la porte de coût, déjà dans le script : si la porte refuse, la SERP est écartée et le relevé le dit. Ne jamais imprimer un identifiant (DataForSEO, Google, Cloudflare).
- **Une mesure absente s'écrit comme absente.** Un instrument muet est un rouge à part entière, pas un « tout va bien ».
- **Un rouge se lit avant de s'annoncer.** Pour `derive`, lire le déploiement (`npx wrangler pages deployment list --project-name memlia --json`, champ `Source` = commit) : si un déploiement est postérieur à la baseline, ce n'est pas un incident, on relance le script et il repose la baseline. Le 404 d'une URL de déploiement n'est pas un discriminant ; les étages de build le sont.
- **GateGuard** : le premier appel Bash de la session est refusé tant que deux faits n'ont pas été écrits (la demande en une phrase ; ce que la commande vérifie ou produit). Écrire les faits, puis relancer la même commande dans le même tour, sans terminer le tour sur les faits.

## 1. Se mettre à jour

```bash
cd /Users/kevinkitanga/dev/interne/memlia-landing && git pull --ff-only origin main && git status --short
```

Des fichiers modifiés par une autre session ne se touchent pas ; on travaille par chemins précis.

## 2. C1 — la sentinelle d'indexation et de dérive (tous les jours, 18 h 30)

```bash
node scripts/seo/sentinelle.mjs
```

Environ trois minutes : sitemap de production, inspection de chaque URL (lecture), état des sitemaps, variantes `http://` et `www.`, comparaison de dérive de chaque URL contre sa baseline, oracle d'indexabilité, puis pose des baselines manquantes et ping IndexNow des URL non indexées. Sortie : une ligne de tête (`URL · indexées · en attente · rouges · avertissements · commit`), les rouges, les avertissements, les infos, la ligne « À DEMANDER », IndexNow, et « à commiter : oui/non ». Code de sortie 2 avec rouge, 1 si le sitemap est illisible.

| Rouges | Avertissements | Infos |
|---|---|---|
| `non-indexee-7j`, `canonique-divergente`, `sortie-index`, `sitemap-erreur`, `sitemap-non-relu`, `derive`, `indexabilite`, `variante-non-redirigee`, `instrument-muet` | `inspection-indisponible`, `sitemap-avertissements`, `derive-indisponible`, `variante-redirection-temporaire`, `variante-chaine-de-redirections` | `en-attente`, `sans-baseline`, `derive-attendue`, `derive-info`, `variante-avec-impressions`, `sitemap-en-attente` |

Ce que la session fait ensuite :

1. **Sans rouge et « à commiter : non »** : rien à commiter ; terminer sur le résumé d'une ligne.
2. **Sans rouge et « à commiter : oui »** (une URL nouvelle indexée, une baseline posée) : une ligne dans `JOURNAL.md`, commit et push (étape 5).
3. **Avec rouge** : lire le brut `.qa/seo/sentinelle/<date>.json` pour la cause. `derive` : lire le déploiement (rail ci-dessus) avant de conclure. `non-indexee-7j` : la liste « À DEMANDER » va dans le journal, pour Kevin. `instrument-muet` : jouer `"$HOME/hermes/packs/claude-seo/.venv/bin/python" "$HOME/hermes/packs/claude-seo/scripts/google_auth.py" --check --json` et consigner ce qu'il dit. `indexabilite` : lire `.qa/indexation/production-indexability.json`. Puis journal, commit, push. Ne rien corriger sur le site : nommer.

## 3. C2 — le relevé de demande (le lundi, 7 h)

```bash
node scripts/seo/releve-demande.mjs
```

Environ deux minutes : Search Console sur la semaine close et les 28 jours (par page, par requête, par page × requête) et sur les 28 jours précédents ; SERP DataForSEO de la requête primaire de chaque article et de « memlia » (moins de 0,05 $ aujourd'hui, une reprise sur erreur transitoire) ; mises à jour de classement Google ; réconciliation du registre des requêtes ; dépôt des tâches. Écrit `docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-demande.json` et met à jour `requetes-vues.json`. Code 1 si Search Console est muette.

La session écrit une ligne de journal avec : les totaux (semaine, 28 jours, 28 jours précédents), le nombre de requêtes avec impressions par famille, les familles sans impression après trois articles (**proposition de réallocation pour Kevin, jamais une action**), les requêtes à portée et les CTR anormaux (tâches déposées), les chutes, le rang de memlia.fr par requête et l'orthographe de « memlia » (`spell` = la marque est encore corrigée), la présence d'AI Overview, les mises à jour Google dans la fenêtre, et ce qui a été écarté (requêtes anonymisées, SERP non jouée). Zéro est une mesure : la ligne s'écrit même quand tout est à zéro. Puis commit et push (étape 5).

## 3 bis. Le relevé des questions — `scripts/seo/questions.mjs` (mensuel, et à chaque refonte du backlog)

Depuis le 19/09/2026, le backlog éditorial se construit **de l'extérieur** : depuis ce que le lecteur tape, pas depuis notre taxonomie. Deux instruments, deux propriétés à ne pas confondre :

- **L'autocomplétion Google** (gratuite, `client=firefox`, `hl=fr&gl=fr`) ne propose que des requêtes au-dessus d'un seuil de volume : **une liste vide est une mesure**, un angle que personne ne tape. Une panne de l'instrument (HTTP 429, délai) n'est jamais comptée comme zéro : l'amorce reste « non mesurée » et la priorité de l'angle ne bouge pas.
- **La page de résultats DataForSEO** (`serp_organic_live_advanced`, 0,002 $ l'appel, porte de coût obligatoire) porte les questions « Autres questions », les recherches associées et les domaines qui gagnent : quand la moitié du haut de page est tenue par des éditeurs de logiciel (`DOMAINES_LOGICIEL`), l'intention est « logiciel », ce que Memlia refuse de vendre — l'angle se corrige, la priorité ne bouge pas toute seule.

```bash
node scripts/seo/questions.mjs relever            # toutes les requêtes du backlog + mesures/amorces-marche.json ; une SERP par famille (≤ 62 appels)
node scripts/seo/questions.mjs rapport            # mesures/questions-<jour>.md : la lecture par famille, pour corriger les angles à la main
node scripts/seo/questions.mjs recaler            # priorité + bloc `demande` de chaque angle du backlog
python3 docs/strategy/site-v3/build-cluster-plan.py --check   # calendrier régénéré ; refuse un angle de priorité 1 sans demande mesurée
```

Règle de priorité (`scripts/lib/seo-questions.mjs`, testée) : **1** si la requête primaire a des suggestions, **2** si seule une secondaire en a, **3** si rien n'en a ; le pilier n'est jamais recalé. Le relevé complet coûte environ 0,13 $ et deux minutes ; il se rejoue le premier vendredi du mois (`RUNBOOK-QUOTIDIEN.md` §6) et chaque fois qu'un angle est réécrit. Ce que le relevé ne fait pas : il ne réécrit ni titre ni requête — c'est une lecture, la correction d'un angle reste une décision écrite dans le backlog, puis un `--check`.

C2 porte depuis le même jour une alerte hebdomadaire : chaque requête primaire du registre est autocomplétée, et « requête primaire sans demande mesurée » sort dans `alertes` quand la liste est vide (`alertesDemande`, testée).

## 4. C3 — l'intégrité éditoriale et technique (le mercredi, 7 h)

```bash
node scripts/seo/integrite.mjs
```

Quatre à huit minutes : lecture des pages de production, maillage (liens entrants, ancres, routes), réouverture de chaque source citée (UA `MemliaBlogSourceVerifier/1.0`, trois essais, recherche de la citation exacte sans rien écrire dans les dossiers scellés), PageSpeed mobile sur six pages, CrUX. Écrit `docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-integrite.json`. Code 2 avec rouge.

| Volet | Rouges | Avertissements et infos |
|---|---|---|
| maillage | `orpheline`, `liens-entrants-insuffisants`, `satellite-sans-lien-pilier`, `pilier-sans-lien-satellite`, `ancre-glossaire-absente` | `page-non-lue`, `glossaire-non-lu` |
| ancres | `ancre-generique` (l'ancre ne décrit pas la destination), `ancre-ambigue` (les mêmes mots mènent à deux pages) | info `ancres-par-destination` : liens et ancres distinctes par destination, **sans verdict** |
| routes | — | `article-sans-route-hors-blog` (seul le blog y mène), `page-sans-route-vers-article` (une page qui nomme des tâches ne mène à aucun article) |
| sources | `source-morte` (trois essais), `extrait-absent` (même après normalisation) | `source-redirigee`, `extrait-forme-changee` (citation retrouvée après normalisation typographique), lentes, non vérifiables (dossier hérité ou document non textuel : seule la réponse HTTP est jugée) |
| vitesse | `score-sous-plancher` (deux relevés consécutifs sous 95), `cls` (au-dessus de 0,1) | « à surveiller » (un seul relevé sous 95), `lcp` (au-dessus de 2,5 s en laboratoire), `psi-indisponible` |

La session écrit une ligne de journal (liens entrants par article, sources ouvertes sur total, rouges, scores), puis commit et push. Un rouge de vitesse devient un ticket dans le journal, jamais un correctif automatique. Les rouges de maillage, d'ancres et de sources ont déjà déposé leurs tâches : la forge les traite le vendredi.

**Ce que le volet ancres ne fait pas.** Il ne réclame pas de varier les mots. Répéter l'ancre la plus claire vers une même destination est voulu, et le compte d'ancres distinctes est rendu en info, sans jugement. Deux défauts seulement le font rougir : une ancre qui ne décrit rien (« ici », « cet article ») et une ancre qui mène à deux endroits différents selon la page — celle-là trompe le lecteur. Un lien `aria-hidden` (la vignette des cartes du blog, qui double le titre juste à côté) n'est pas une ancre et n'est pas compté ; à défaut de texte, l'`alt` de l'image en tient lieu.

**Ce que le volet routes ne fait pas.** Il ne dépose aucune tâche : ses correctifs vivent hors de la forge (une page `.astro`, le glossaire et sa chaîne scellée), et un ticket que le vendredi ne saurait pas traiter serait un ticket qui ment. Les quatre pages surveillées sont `/`, `/automatisation-cabinet-comptable`, `/methode` et `/garanties` ; `/contact` en est exclue par décision (c'est la page de conversion, en sortir dessert), comme les pages légales et `/a-propos`.

## 4 bis. C4 — l'autorité, l'entité et la visibilité IA (le 1er du mois, 7 h 30)

```bash
node scripts/seo/autorite.mjs relever --budget 0.60
```

Trois grandeurs distinctes, qu'on ne mélange jamais : **l'autorité** (le profil de liens entrants, DataForSEO), **l'entité** (le moteur sait-il qui nous sommes : réécriture de la marque, rang sur son propre nom, autocomplétion) et **la visibilité IA**. Le relevé s'écrit dans `mesures/mois-<AAAA-MM>-autorite.json` et se compare au mois précédent ; sans mois précédent, aucun recul n'est conclu.

**Deux mesures séparées.** L'historique du 19/09 vient de `llm_responses` sans recherche : il mesure seulement ce que le modèle connaît déjà de Memlia, et ses citations valent `null`. La visibilité dans ChatGPT Search vient désormais du scraper `llm_scraper/live/advanced` avec `force_web_search: true` ; seules ses sources comptent dans `domainesCites` et `pagesCitees`. Un appel qui ne prouve pas ce paramètre est refusé. L'échantillon versionné `mesures/echantillon-ia.json` contient au moins quatre accès C1, quatre questions réelles C6 et trois définitions du glossaire, avec une page candidate fixée avant le relevé.

**Deux pièges du même jour, à ne pas rejouer.** L'appel exige `model_name` : sans lui l'interface rend `40501` et coûte 0, et le premier câblage enregistrait ce refus en « 0 citation sur 6 requêtes ». Et la réponse porte `items[].sections[].text`, pas `items[].message` : un lecteur qui cherche la mauvaise forme rend « aucune citation » sur des réponses pleines. **Trois zéros creux dans un seul instrument, tous attrapés en regardant la réponse brute.**

**Le coût et son autorisation.** Chaque appel payant passe par la porte de coût du poste. Les mesures IA y sont au-dessus du seuil d'approbation automatique : elles ne s'exécutent que si `--budget` les couvre, et ce dépassement est **écrit dans le relevé** avec le verdict qu'avait rendu la porte. C'est la décision D2 de Kevin du 19/09/2026 (environ 0,40 $ par mois), rendue vérifiable. Relevé réel du 19/09 : **0,0325 $** pour le profil de liens, la page de résultats de la marque et six requêtes d'assistant.

**Arrêt fail-closed.** Un HTTP 402 arrête les appels IA après le premier refus, conserve les dernières mesures d'autorité et d'entité avec leur date et inscrit l'échec courant. Il ne devient ni zéro citation ni recul. La reprise exige un solde DataForSEO positif ; le cron se relance alors une seule fois avec l'échantillon inchangé.

**Lisibilité machine.** Le même relevé ouvre en production `robots.txt`, l'accueil et `llms.txt` avec onze agents distinguant citation, recherche et entraînement. Le verdict robots vient de la règle du groupe spécifique, pas du seul HTTP 200 ; le `x-robots-tag` de la page est contrôlé. `llms.txt` est rapporté comme présence et taille seulement : aucun effet de citation ne lui est attribué, et Google Search l'ignore.

La ligne de base C7, son échantillon figé, la distinction des instruments et le verdict fail-closed sont consignés dans [CITATIONS-IA-2026-09-21.md](CITATIONS-IA-2026-09-21.md).

**Le volet audience** lit les référents de Cloudflare Web Analytics (gratuit, interface GraphQL). Il exige la variable **`CLOUDFLARE_ANALYTICS_TOKEN`** — ⚠ **jamais `CLOUDFLARE_API_TOKEN`** : ce nom-là est lu par Wrangler en priorité sur sa session, et un jeton limité aux statistiques ferait échouer tous les déploiements (mesuré le 14/09/2026). Sans le jeton, le relevé écrit « non relevée » et son motif ; il ne compte jamais zéro visite. ⚠ **Le total de chargements n'est pas une audience** : il inclut nos propres passages automatisés (recettes, contrôles de production, suites navigateur). Mesuré le 19/09/2026 : **1 890 chargements pour 15 impressions au moteur**, dont 1 460 sans référent et 420 de navigation interne. Ce qui vaut quelque chose ici est la **liste des référents externes** — au 19/09 elle tient en une ligne : `bing.com`, 10 visites, et **aucun assistant**. ⚠ Les visites venues d'un assistant qui arrivent **sans référent** tombent dans les visites directes : le compte des assistants est un **plancher**, jamais un total.

⚠ `autorite.rang` est le **rang de domaine de DataForSEO**, pas l'autorité de domaine de Moz : deux échelles, jamais comparées entre elles. Un relevé se compare au relevé du mois précédent **par le même instrument**.

## 5. Commit et push d'une session de cron

**Release des mesures (séparée de la forge blog).** `main` ne reçoit pas de push direct
depuis ces crons. Partir d'un `origin/main` propre sur une branche dédiée
`site/seo-mesures-<job>-<AAAAMMJJ>` ; ne versionner que les mesures, le journal et les
propositions de maintenance. Conserver le SHA du commit candidat et celui de
`origin/main` dans la carte de release. Une tâche QA indépendante doit rendre
`PASS` sans réserve sur le SHA exact de la PR et ses checks `Repository gates`.
Une autre carte, distincte de QA, doit enregistrer la décision humaine autorisant explicitement cette release
(`scope=seo-measures`, `decision=AUTHORIZE`, `pr`, `pr_head`, `main_sha`,
`qa_task` dans les métadonnées du dernier run terminé). Sans ces preuves,
ne pas fusionner ni activer les crons. La garde en lecture seule est :

```bash
node scripts/seo-release-gate.mjs --pr <N> --qa-task <t_ID> --authorization-task <t_ID> --expected-head <SHA_PR> --expected-main <SHA_MAIN>
```

La garde refuse tout fichier hors `docs/strategy/site-v3/mesures/`,
`docs/strategy/site-v3/JOURNAL.md` et `editorial/maintenance.json`. Elle ne
fusionne rien et n'autorise pas le blog ; `blog-auto-merge.mjs` ne donne aucune
autorité SEO. Après le verdict positif, revalider les refs juste avant la fusion
humaine, puis vérifier le SHA de `main`, les checks et la production avant toute
activation. Si la branche, QA, CI ou base change, redemander QA et autorisation.
Avant toute future activation, enregistrer une copie des quatre prompts et
leurs identifiants/révisions dans le dossier de release ; modifier un seul
prompt à la fois, relire exactement son contenu et son état par identifiant
après sauvegarde, puis vérifier le suivant. En cas d'écart, arrêter la série,
désactiver le prompt concerné et restaurer sa révision depuis la copie,
avec readback de la restauration. En cas d'incident Git : suspendre les crons
SEO, conserver les mesures datées et proposer une PR de revert soumise aux
mêmes contrôles ; ne pas écraser les données saisies par l'humain.

```bash
node scripts/seo-cron-preflight.mjs --root "$(pwd)" --job <job> --phase initial
git switch -c site/seo-mesures-<job>-<AAAAMMJJ> origin/main
git add -- docs/strategy/site-v3/mesures docs/strategy/site-v3/JOURNAL.md editorial/maintenance.json
node scripts/seo-cron-preflight.mjs --root "$(pwd)" --job <job> --phase before-commit --base <SHA_MAIN>
git commit -m "chore(seo): <job> du <AAAA-MM-JJ>"
node scripts/seo-cron-preflight.mjs --root "$(pwd)" --job <job> --phase before-push --base <SHA_MAIN> --commit "$(git rev-parse HEAD)"
git push origin HEAD
```

Le message de commit suit la convention du dépôt, sans attribution à un runtime ou à un modèle. Format de la ligne de journal, dans le tableau existant : `| <date> | <cron> | <commit> | — | — | — | — | <résumé : chiffres, rouges, tâches, ce qui est écarté> |`.

## 6. F1 — après une publication (forge, `RUNBOOK-QUOTIDIEN.md` §5)

Après le contrôle en ligne et le renvoi du sitemap :

```bash
node scripts/seo/forge-seo.mjs apres-publication <slug> [<slug2>]
```

Attend que la production serve le titre d'onglet de l'article (dix minutes au plus), pose la baseline de dérive de l'article, de `/blog` et du pilier, inscrit l'article au registre des requêtes (la commande `publier` de la forge l'a déjà fait ; c'est idempotent), envoie un ping IndexNow. Pour cette phase seulement, une `datePublication` future est admise si le frontmatter est `publie` et si le reçu `preuves/publication.json` scelle exactement l'article et son manifeste ; le contrôle HTTP reste obligatoire. Les instruments Python sont lancés directement par le runtime du pack SEO Hermes (`~/hermes/packs/claude-seo/.venv/bin/python`), sans lanceur ni profil Claude ; `MEMLIA_SEO_RUNTIME_ROOT`, `MEMLIA_SEO_PYTHON` et `MEMLIA_SEO_SCRIPTS` permettent un chemin explicite. Le JSON rendu va dans la note du journal. Sans cette étape, la sentinelle posera les baselines le soir et C2 réconciliera le registre le lundi : rien n'est perdu, mais la journée a un trou.

## 6 bis. F3 — les liens qui manquent autour d'un article

```bash
node scripts/seo/forge-seo.mjs liens <slug>
```

Cherche, dans les corps de recette des articles publiés, les paragraphes qui **nomment déjà la tâche** d'un article sans le lier, dans les deux sens : `entrants` (un article ancien devrait mener au nouveau), `sortants` (le nouvel article devrait mener à un ancien). Aucune recherche sémantique : un paragraphe candidat porte **tous** les mots significatifs d'une requête de l'article visé ; les sigles du métier (DSN, CRM, TVA, OCR) comptent mais doivent correspondre exactement, et une requête qui se réduit à un seul mot significatif ne propose rien.

Deux moments :

- **à l'écriture de la recette** (`RUNBOOK-QUOTIDIEN.md` §3) : lecture seule, pour poser les liens **sortants** du nouvel article avant sa publication ;
- **dans `apres-publication`** : les trois premiers `entrants` deviennent des tâches `inserer-lien` (clé `lien-vers-<slug>`, gravité moyenne, cron `F3`), avec le paragraphe exact dans le motif. Le sens sortant n'en dépose jamais : il se traite dans la recette, pas le vendredi.

Un article sans recette (publié hors forge) apparaît dans `sansRecette` : il ne peut ni être fouillé ni être republié, et c'est dit plutôt que deviné.

## 7. F2 — le vendredi (forge, `RUNBOOK-QUOTIDIEN.md` §6)

```bash
node scripts/seo/forge-seo.mjs maintenance lister
```

Deux tâches au plus par vendredi, dans l'ordre rendu (gravité puis ancienneté). Chaque tâche se traite par **republication scellée**, jamais par une édition directe :

- article v3 (une recette existe dans `editorial/recettes/<slug>/`) : corriger la recette (`corps.md` pour un lien ou un rafraîchissement, `recette.json` pour un titre, une source, un extrait), puis `preparer`, rendu, revue par un sous-agent, `sceller`, `publier`, contrôle en ligne, `apres-publication` ;
- article publié hors forge (aucun depuis le 17/09/2026 au soir : les trois articles DSN et paie ont rejoint la forge avec une recette, des sources revérifiées et une revue neuve) : la voie serait `scripts/migrate-published-blog.mjs`, qui rescelle un dossier adopté en préservant ses preuves héritées, mais qui ne peut pas accueillir une source revérifiée ; une tâche `reverifier-source` sur un tel article se traite donc en le faisant entrer dans la forge.

Types : `inserer-lien` (un lien dans le corps, avec une ancre parlante ; pour `lien-vers-pilier`, là où la carte des tâches est nommée ; pour une tâche déposée par F3, le motif porte le paragraphe exact où poser le lien), `varier-ancre` (réécrire l'ancre dans la phrase qui la porte, sans changer la destination), `recaler-titre` (titre d'onglet ou introduction sur la requête mesurée, sans rien promettre), `reverifier-source` (rouvrir la source, corriger l'URL, l'extrait ou l'affirmation), `rafraichir` (relire, redater, compléter). Puis :

```bash
node scripts/seo/forge-seo.mjs maintenance cloturer <id> --commit <sha>
node scripts/seo/forge-seo.mjs maintenance ecarter <id> --motif "…"     # une tâche jugée fausse, motif dans le journal
```

## 8. Ce que ces sessions ne font jamais

Elles n'écrivent pas dans Search Console hors le sitemap, ne demandent pas l'indexation, ne publient rien hors la forge, ne modifient aucun article, aucun titre, aucune source, ne déplacent aucun seuil, n'inventent pas un chiffre absent, ne stockent aucune donnée nominative, ne relancent pas un déploiement, et ne déclarent pas un incident sur une signature HTTP sans lire les étages de déploiement.

## 9. Fichiers

| Fichier | Rôle | Suivi par git |
|---|---|---|
| `docs/strategy/site-v3/mesures/registre-requetes.json` | quel article vise quelle requête, dans quelle famille | oui |
| `docs/strategy/site-v3/mesures/requetes-vues.json` | première et dernière date de chaque requête vue dans Search Console | oui |
| `docs/strategy/site-v3/mesures/sentinelle.jsonl` | une ligne par jour de sentinelle | oui |
| `docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-demande.json`, `-integrite.json` | les instantanés hebdomadaires | oui |
| `docs/strategy/site-v3/mesures/indexnow.json`, `public/<clé>.txt` | la clé IndexNow, publique par conception | oui |
| `editorial/maintenance.json` | la file de maintenance que la forge consomme | oui |
| `.qa/seo/etat-sentinelle.json`, `.qa/seo/sentinelle/<date>.json` | état local (premières vues, baselines) et relevés bruts | non (`.qa/` est ignoré) |
| `~/.cache/claude-seo/drift/baselines.db` | les baselines de dérive du skill `seo` | non |

Les scripts : `scripts/seo/sentinelle.mjs`, `releve-demande.mjs`, `integrite.mjs`, `forge-seo.mjs`, `gsc.py` ; les règles pures dans `scripts/lib/seo-regles.mjs`, les registres dans `seo-registres.mjs`, les instruments dans `seo-instruments.mjs` ; les tests dans `tests/scripts/seo-*.test.mjs`, joués par `npm run test:scripts`.
