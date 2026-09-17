# Mode opératoire des crons SEO — sentinelle, relevé de demande, intégrité, et les deux extensions de la forge

Construit le 17 septembre 2026 sur le go de Kevin (« go, construis C1, C2, C3 et les deux extensions »), d'après [CRONS-SEO.md](CRONS-SEO.md), qui dit le pourquoi. Trois tâches planifiées Claude Code tournent sur ce Mac, chacune dans une session neuve : **memlia-sentinelle-seo** (tous les jours, 18 h 30), **memlia-releve-demande** (le lundi, 7 h), **memlia-integrite** (le mercredi, 7 h). Ce document est la seule mémoire de la procédure ; lire aussi `RUNBOOK-QUOTIDIEN.md` §0 pour les rails du dépôt.

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
3. **Avec rouge** : lire le brut `.qa/seo/sentinelle/<date>.json` pour la cause. `derive` : lire le déploiement (rail ci-dessus) avant de conclure. `non-indexee-7j` : la liste « À DEMANDER » va dans le journal, pour Kevin. `instrument-muet` : jouer `"$HOME/.claude/skills/seo/bin/claude-seo" run google_auth.py --check --json` et consigner ce qu'il dit. `indexabilite` : lire `.qa/indexation/production-indexability.json`. Puis journal, commit, push. Ne rien corriger sur le site : nommer.

## 3. C2 — le relevé de demande (le lundi, 7 h)

```bash
node scripts/seo/releve-demande.mjs
```

Environ deux minutes : Search Console sur la semaine close et les 28 jours (par page, par requête, par page × requête) et sur les 28 jours précédents ; SERP DataForSEO de la requête primaire de chaque article et de « memlia » (moins de 0,05 $ aujourd'hui, une reprise sur erreur transitoire) ; mises à jour de classement Google ; réconciliation du registre des requêtes ; dépôt des tâches. Écrit `docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-demande.json` et met à jour `requetes-vues.json`. Code 1 si Search Console est muette.

La session écrit une ligne de journal avec : les totaux (semaine, 28 jours, 28 jours précédents), le nombre de requêtes avec impressions par famille, les familles sans impression après trois articles (**proposition de réallocation pour Kevin, jamais une action**), les requêtes à portée et les CTR anormaux (tâches déposées), les chutes, le rang de memlia.fr par requête et l'orthographe de « memlia » (`spell` = la marque est encore corrigée), la présence d'AI Overview, les mises à jour Google dans la fenêtre, et ce qui a été écarté (requêtes anonymisées, SERP non jouée). Zéro est une mesure : la ligne s'écrit même quand tout est à zéro. Puis commit et push (étape 5).

## 4. C3 — l'intégrité éditoriale et technique (le mercredi, 7 h)

```bash
node scripts/seo/integrite.mjs
```

Quatre à huit minutes : lecture des pages de production, maillage, réouverture de chaque source citée (UA `MemliaBlogSourceVerifier/1.0`, trois essais, recherche de la citation exacte sans rien écrire dans les dossiers scellés), PageSpeed mobile sur six pages, CrUX. Écrit `docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-integrite.json`. Code 2 avec rouge.

| Volet | Rouges | Avertissements et infos |
|---|---|---|
| maillage | `orpheline`, `liens-entrants-insuffisants`, `satellite-sans-lien-pilier`, `pilier-sans-lien-satellite`, `ancre-glossaire-absente` | `page-non-lue`, `glossaire-non-lu` |
| sources | `source-morte` (trois essais), `extrait-absent` (même après normalisation) | `source-redirigee`, `extrait-forme-changee` (citation retrouvée après normalisation typographique), lentes, non vérifiables (dossier hérité ou document non textuel : seule la réponse HTTP est jugée) |
| vitesse | `score-sous-plancher` (deux relevés consécutifs sous 95), `cls` (au-dessus de 0,1) | « à surveiller » (un seul relevé sous 95), `lcp` (au-dessus de 2,5 s en laboratoire), `psi-indisponible` |

La session écrit une ligne de journal (liens entrants par article, sources ouvertes sur total, rouges, scores), puis commit et push. Un rouge de vitesse devient un ticket dans le journal, jamais un correctif automatique. Les rouges de maillage et de sources ont déjà déposé leurs tâches : la forge les traite le vendredi.

## 5. Commit et push d'une session de cron

```bash
git add -- docs/strategy/site-v3/mesures docs/strategy/site-v3/JOURNAL.md editorial/maintenance.json
git commit -m "chore(seo): <sentinelle|releve de demande|integrite> du <AAAA-MM-JJ>" -- docs/strategy/site-v3/mesures docs/strategy/site-v3/JOURNAL.md editorial/maintenance.json
git push origin main
```

Le message de commit se termine par la ligne `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Format de la ligne de journal, dans le tableau existant : `| <date> | <cron> | <commit> | — | — | — | — | <résumé : chiffres, rouges, tâches, ce qui est écarté> |`.

## 6. F1 — après une publication (forge, `RUNBOOK-QUOTIDIEN.md` §5)

Après le contrôle en ligne et le renvoi du sitemap :

```bash
node scripts/seo/forge-seo.mjs apres-publication <slug> [<slug2>]
```

Attend que la production serve le titre d'onglet de l'article (dix minutes au plus), pose la baseline de dérive de l'article, de `/blog` et du pilier, inscrit l'article au registre des requêtes (la commande `publier` de la forge l'a déjà fait ; c'est idempotent), envoie un ping IndexNow. Le JSON rendu va dans la note du journal. Sans cette étape, la sentinelle posera les baselines le soir et C2 réconciliera le registre le lundi : rien n'est perdu, mais la journée a un trou.

## 7. F2 — le vendredi (forge, `RUNBOOK-QUOTIDIEN.md` §6)

```bash
node scripts/seo/forge-seo.mjs maintenance lister
```

Deux tâches au plus par vendredi, dans l'ordre rendu (gravité puis ancienneté). Chaque tâche se traite par **republication scellée**, jamais par une édition directe :

- article v3 (une recette existe dans `editorial/recettes/<slug>/`) : corriger la recette (`corps.md` pour un lien ou un rafraîchissement, `recette.json` pour un titre, une source, un extrait), puis `preparer`, rendu, revue par un sous-agent, `sceller`, `publier`, contrôle en ligne, `apres-publication` ;
- article publié hors forge (aucun depuis le 17/09/2026 au soir : les trois articles DSN et paie ont rejoint la forge avec une recette, des sources revérifiées et une revue neuve) : la voie serait `scripts/migrate-published-blog.mjs`, qui rescelle un dossier adopté en préservant ses preuves héritées, mais qui ne peut pas accueillir une source revérifiée ; une tâche `reverifier-source` sur un tel article se traite donc en le faisant entrer dans la forge.

Types : `inserer-lien` (un lien dans le corps, avec une ancre parlante ; pour `lien-vers-pilier`, là où la carte des tâches est nommée), `recaler-titre` (titre d'onglet ou introduction sur la requête mesurée, sans rien promettre), `reverifier-source` (rouvrir la source, corriger l'URL, l'extrait ou l'affirmation), `rafraichir` (relire, redater, compléter). Puis :

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
