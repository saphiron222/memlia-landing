# Mode opératoire quotidien — la forge éditoriale de memlia.fr

Exécuté par la tâche planifiée « memlia-forge-quotidienne » chaque jour ouvré à 9 h (heure locale), sur ce Mac, dans une session Claude Code neuve. Autorisation de Kevin du 16 septembre 2026 : « on doit être à 4/semaine », « sinon go », « go, mets la tâche planifiée chaque jour ouvré à 9h ». Chaque exécution part de zéro : ce document est la seule mémoire de la procédure. Lire aussi `README.md` et `IMPLEMENTATION-ROADMAP.md` de ce dossier avant d'agir.

## 0. Rails non négociables

- **Dépôt** : `/Users/kevinkitanga/dev/interne/memlia-landing`, branche `main`. Le push publie (Cloudflare Pages construit `main`).
- **Cadence** : au plus 2 articles par jour et 4 par semaine ISO ; le pipeline refuse au-delà (`verifierPlafonds`). Le calendrier n'attribue de créneau que du lundi au jeudi ; un jour sans créneau est un jour de maintenance (§6).
- **Aucun chiffre de gain non mesuré, aucune donnée client, aucune promesse de fonction, aucun mot de catalogue** (« module », « complément Excel/Memlia ») sur une surface publique. L'IA prépare, l'humain décide ; agrégats, jamais nominatif. Fact-check daté pour toute matière paie, sociale, fiscale, juridique ou données.
- **Sources** : uniquement des pages officielles que le vérificateur ouvre réellement (`verifySource`, agent `MemliaBlogSourceVerifier/1.0`). Ouvertes le 16/09 : `entreprendre.service-public.gouv.fr`, `www.cnil.fr`, `www.impots.gouv.fr` (calendrier fiscal), `bofip.impots.gouv.fr`, `www.net-entreprises.fr`. Bloquées : `legifrance.gouv.fr` (403), `urssaf.fr` (connexion coupée). Tester chaque URL avec `curl -sS -L -A 'MemliaBlogSourceVerifier/1.0 (+https://memlia.fr)' -o /tmp/s.html -w '%{http_code} %{url_effective}\n' <url>` et prendre l'URL finale.
- **Rien ne se pousse à moitié** : un candidat préparé mais non scellé fait échouer `blog:audit`, donc le build. Soit l'article est publié et scellé, soit ses fichiers ne sont pas commités.
- **Sessions parallèles** : toujours `git add -- <chemins>` puis `git commit -m "…" -- <chemins>` ; jamais `git commit -a`, jamais `--amend`, jamais `--force`, pas de backtick dans un message de commit.
- **Un test n'est jamais modifié pour passer**, sauf un compte qui change légitimement avec la publication (nombre d'articles publics dans `tests/proof/test_build.py`, `PUBLIC_ARTICLES`), documenté dans le commit.
- **Échec** : deux tentatives de correction au plus sur une recette ; ensuite, ne rien pousser, consigner la cause dans `JOURNAL.md`, et s'arrêter. Kevin lit le journal.

## 1. Se mettre à jour

```bash
cd /Users/kevinkitanga/dev/interne/memlia-landing && git pull --ff-only origin main && git status --short
```

Si des fichiers sont modifiés par une autre session, ne pas y toucher ; travailler par chemins précis.

## 2. Lire le créneau du jour

```bash
python3 docs/strategy/site-v3/build-cluster-plan.py --check
grep -n "^| $(date +%Y-%m-%d) |" docs/strategy/site-v3/CONTENT-CALENDAR.md
```

Chaque ligne de la date du jour au statut `planned` est un article à produire (une, parfois deux). Son slug donne l'entrée complète dans `docs/strategy/site-v3/backlog-v3.json` : titre, requête primaire, requêtes secondaires, famille, rôle, intention, entonnoir, format, preuve attendue, autorités à citer. Aucune ligne : aller au §6.

## 3. Écrire la recette

Créer `editorial/recettes/<slug>/recette.json` et `corps.md` sur le modèle exact des deux recettes publiées le 16/09 : `editorial/recettes/automatiser-la-relance-des-pieces-clients/` (satellite) et `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/` (pilier). Le contrat de la recette est décrit en tête de `scripts/blog-forge.mjs`.

Le corps (1 200 à 1 800 mots, Markdown sans frontmatter, H2 et H3 seulement) suit ce plan : `## Réponse directe` (définition de 40 à 80 mots en tête) ; pourquoi la tâche casse à la main ; la méthode en briques ou en étapes ; `## La règle dans les mots du cabinet` (tableau déclencheur, condition, action, exception) ; `## Ce que l'outil refuse, et pourquoi` ; `## Ce qui s'automatise, ce qui attend une validation, ce qui reste humain` (tableau à trois colonnes) ; `## Le jeu fictif` (cas courant, cas limite, cas de refus, jamais nommés comme réels) ; le cadre sourcé (données, conservation, obligations) ; `## Pour aller plus loin` avec les liens internes. Ton : direct, concret, sans superlatif, sans « nous constatons », sans chiffre de gain.

Pièges mesurés : le mot « module » est interdit ; « s'arrête » est lu comme « arrêtés » par le détecteur de matière légale (écrire « cesse ») ; `description` entre 50 et 160 caractères ; `tabTitle` ≤ 70 ; un paragraphe qui contient une URL `https://` ou un mot légal (« réglementation », « code du travail », « loi », « décret ») avec un verbe normatif (« doit », « obligatoire ») exige un claim de type sensible ; ne pas mettre de lien externe dans le corps (les sources sont rendues depuis le frontmatter).

Sources : 3 à 5 pages officielles ouvertes le jour même, chacune avec un `excerpt` verbatim d'au moins 40 caractères pris dans le HTML brut de la page (une seule ligne du fichier, sans entité HTML au milieu). Claims : 3 à 6, chacun une sous-chaîne exacte d'un paragraphe (`unite` = un fragment unique de ce paragraphe, `claim` = la phrase, `excerpt` = la citation exacte, `type` parmi `legal-reglementaire`, `fiscal`, `dsn`, `paie`, `social`, `juridique`, `information`, `methode`, `produit`, `statistique-chiffre`) ; la citation doit partager au moins 60 % des mots de quatre lettres et plus du claim, sinon ajouter `translationTerms` (deux paires). Les types sensibles exigent une source officielle reconnue (Service-Public, CNIL, impots.gouv, Net-entreprises, Insee, travail-emploi).

Liens : `links.outgoing` = le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, les articles publiés voisins, `/methode`, une ou deux ancres de `/glossaire#…` existantes (`grep -o "anchor: '[^']*'" src/data/glossary.ts`) ; chaque lien doit apparaître dans le corps sous la forme `](/chemin`. `links.incoming` = `["/blog", "/blog/automatiser-un-cabinet-comptable-la-carte-des-taches"]` : ajouter dans `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/corps.md` un lien vers le nouvel article là où sa famille est nommée, et le slug dans `links.outgoing` de la recette du pilier. Image : `heroId` = `img-art-<court-slug>`, `alt` de 10 à 125 caractères, cadre à trois colonnes. `businessReview.reviewerId` = `relecteur-metier-ia-memlia`, `role` = le rôle du lecteur. `serp` = relevé WebSearch du jour (acteurs, formats, note) ; `gsc` = état Search Console (impressions 0 pour une page nouvelle, « aucun crédit métrique revendiqué »).

## 4. Préparer, faire relire, sceller

```bash
node scripts/blog-forge.mjs preparer <slug>
```

Corriger la recette tant que `erreurs` n'est pas vide (le message dit quoi). Puis lancer un sous-agent relecteur (modèle sonnet, identité distincte de l'auteur) avec le prompt du §7, qui écrit `editorial/recettes/<slug>/revues.json`. Un `FAIL`, un `p0` ou un verdict autre que « soutient » se corrige dans la recette (jamais dans la revue), puis on relance `preparer` et une nouvelle revue. Ensuite :

```bash
node scripts/blog-forge.mjs sceller <slug>
```

Le gate doit rendre `"pass": true`. Sinon lire les `errors`, corriger la recette, recommencer (deux fois au plus).

## 5. Publier, prouver, pousser

Dans cet ordre, pour tous les articles du jour puis le pilier (qui a reçu un lien) :

```bash
node --input-type=module -e "import { materialiser } from './scripts/blog-forge.mjs'; for (const slug of ['<slug>', 'automatiser-un-cabinet-comptable-la-carte-des-taches']) { const r = await materialiser({ root: process.cwd(), slug, statut: 'go-production' }); console.log(slug, r.erreurs); }"
npx astro build && npm run lastmod:sync
npm run resource:seal-surfaces && node scripts/reaffirm-resource-review.mjs reaffirmer
node scripts/blog-forge.mjs publier <slug>
node scripts/blog-forge.mjs publier automatiser-un-cabinet-comptable-la-carte-des-taches
```

Si `publier` échoue sur `test_build.py` à cause du compte d'articles publics, ajouter le slug à `PUBLIC_ARTICLES` et relancer ; si `llms.txt` est en cause, y déclarer l'article sur le modèle des lignes existantes ; si le ledger lastmod ou une surface Ressources diverge, rejouer `npx astro build && npm run lastmod:sync`, puis reseal et reaffirm, puis `publier` de nouveau. Ensuite :

```bash
npm run build
git add -- editorial/recettes/<slug> editorial/articles/<slug> src/content/blog/<slug>.md public/images/img-art-<court-slug>-*
git commit -m "feat(blog): <titre de l'article>" -- editorial public/images public/llms.txt src tests docs/qa docs/strategy/site-v3/CONTENT-CALENDAR.md docs/strategy/site-v3/cluster-plan.json docs/strategy/site-v3/cluster-plan.md docs/strategy/site-v3/cluster-map.html docs/strategy/site-v3/JOURNAL.md
git push origin main
```

Le message de commit se termine par la ligne d'attribution `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Puis attendre le déploiement (`npx wrangler pages deployment list --project-name memlia --json`, statut `Active` sur le commit poussé, cinq à dix minutes), contrôler en ligne :

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://memlia.fr/blog/<slug>
PREVIEW_SOURCE=dist QA_URL=https://<id>.memlia.pages.dev node scripts/verify-preview.mjs
~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py
```

Consigner dans `docs/strategy/site-v3/JOURNAL.md` (une ligne par article : date, slug, commit, identifiant de déploiement, code HTTP, équivalence octets, sitemap renvoyé) et commiter le journal.

## 6. Jour sans créneau (vendredi, ou semaine complète)

Dans l'ordre, sans publier d'article :

1. Régénérer le plan (`build-cluster-plan.py --check`) et vérifier que les articles de la semaine sont bien `published`.
2. Relever l'indexation des URL publiées depuis sept jours (Search Console : `~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py` affiche le sitemap ; l'inspection d'URL unitaire reste manuelle, Kevin la fait dans la propriété).
3. Si `docs/strategy/site-v3/glossaire-vague-1.json` n'est pas encore intégré : suivre le paragraphe « Glossaire vague 1 » de `IMPLEMENTATION-ROADMAP.md` (chaîne Ressources : candidat, revue métier par unité, sceau, réaffirmation). Ne pas ajouter les termes à `src/data/glossary.ts` sans cette chaîne.
4. Consigner dans `JOURNAL.md` ce qui a été fait, et pousser.

## 7. Prompt du sous-agent relecteur

Remplacer `<slug>` et `<role>` (rôle du lecteur, ex. `collaborateurs-comptables`), lancer avec le modèle sonnet :

> Tu es le relecteur indépendant d'un article candidat de memlia.fr (site de Memlia : automatisation, avec IA, des tâches répétitives des cabinets d'expertise comptable français, dans les outils existants, avec validation humaine). Tu portes deux identités distinctes de l'auteur (« kevin ») : le reviewer éditorial « marketing » et le reviewer métier « relecteur-metier-ia-memlia » (rôle : `<role>`). Tu ne réécris rien : tu juges, et tu écris un seul fichier JSON.
>
> Lis, dans cet ordre : 1. `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/recettes/<slug>/paquet-revue.json` (article, sources, claims avec citation et contexte, critères) ; 2. `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/articles/<slug>/preuves/image/master.png` (regarde-la) ; 3. pour chaque claim, la copie locale de sa source `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/articles/<slug>/preuves/sources/<sourceId>.source.txt` (grep de la citation, pas de lecture entière) ; 4. `/Users/kevinkitanga/dev/interne/memlia-landing/.agents/product-marketing.md`.
>
> Écris `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/recettes/<slug>/revues.json` avec exactement cette forme : `{"editorial": {"criteria": {"intent-satisfaction": {"result": "PASS", "observations": ["…"]}, "serp-format-rankability": {…}, "eeat-sources": {…}, "information-gain-proof": {…}, "technical-onpage-seo": {…}, "ai-citability": {…}, "contextual-conversion": {…}}, "p0": []}, "business": {"claims": {"<claimId>": {"verdict": "soutient", "reasoning": "…"}}}, "image": {"criteria": {"brief-six-components": {"result": "PASS", "observations": ["…"]}, "generation-constraints": {…}, "fictive-provenance": {…}, "recognizable-subject": {…}, "technical-derivatives": {…}, "alt-information": {…}}, "directionArt": 18, "semanticRelevance": 22}, "sources": {"reviewedBy": "relecteur-metier-ia-memlia", "observations": {"<sourceId>": "…"}}}`.
>
> Règles : chaque `result` vaut PASS ou FAIL selon ton jugement réel, chaque observation fait au moins 30 caractères et cite un élément concret ; score éditorial à atteindre 90/100 (poids 20, 15, 20, 20, 10, 10, 5) ; `p0` liste les défauts bloquants. Verdict métier « soutient » seulement si la citation exacte soutient l'affirmation telle qu'écrite, sans changement de portée ni de polarité, sinon « soutient_partiellement », « contredit » ou « hors_sujet » avec un `reasoning` d'au moins 40 caractères. Vérifie l'absence de chiffre de gain, de promesse de fonction, de donnée client, et que les délais sont des paramètres du cabinet, pas des normes. Image : six critères observables sur le PNG ; `directionArt` entre 16 et 20, `semanticRelevance` entre 20 et 25. `sources.observations` : une phrase par source sur la cohérence éditeur, domaine, niveau. Message final : chemin écrit, score, nombre de « soutient », réserves. Ne modifie aucun autre fichier.

## 8. Ce que cette procédure ne fait jamais

Elle ne crée pas de page commerciale, ne touche pas aux cinq pages du tunnel, ne modifie pas un article publié autrement que par une republication scellée par la forge (le pilier pour ses liens), ne demande pas l'inspection d'URL à Search Console (action manuelle de Kevin), et ne dépasse pas les plafonds même si le calendrier a pris du retard : le retard se rattrape à quatre par semaine, pas plus.
