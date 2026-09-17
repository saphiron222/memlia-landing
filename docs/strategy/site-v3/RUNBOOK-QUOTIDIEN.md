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

## 3. Écrire la recette (la recette éditoriale Memlia, héritée de l'article 3)

Créer `editorial/recettes/<slug>/recette.json` et `corps.md` sur le modèle exact des recettes publiées : `editorial/recettes/automatiser-la-relance-des-pieces-clients/` (satellite, gabarit how-to-guide) et `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/` (pilier). Le contrat de la recette est décrit en tête de `scripts/blog-forge.mjs`. La recette suit les skills blog (`~/.claude/skills/blog*/`) : `blog-brief` (le brief de la stratégie), `blog-outline` (le gabarit `~/.claude/skills/blog/templates/<format>.md`), `blog-write` (les six piliers : réponse d'abord, définitions, preuves sourcées, maillage, structure extractible, FAQ), `blog-factcheck` (les claims du pipeline), `blog-style` (`cognitive_load.py`), `blog-seo-check`, `blog-geo`, `blog-schema`, `blog-image`, `blog-analyze` (revue indépendante à 100 points, §7).

Le corps (1 800 à 2 500 mots pour un satellite, 3 000 à 4 000 pour un pilier, Markdown sans frontmatter, H2 et H3 seulement) suit ce plan : `## Réponse directe` (40 à 80 mots) ; `## Qu'est-ce que … ?` avec les définitions en gras (**Le terme** est …, une phrase autonome par entité) ; pourquoi la tâche casse à la main ; `## Avant de commencer` (liste de ce qu'il faut avoir) ; la méthode en briques ou en étapes numérotées, avec un tableau des conditions quand la règle en dépend ; `## La règle dans les mots du cabinet` (tableau déclencheur, condition, action, exception) ; `## Ce que l'outil refuse, et pourquoi` ; `## Ce qui s'automatise, ce qui attend une validation, ce qui reste humain` (tableau à trois colonnes) ; `## Le jeu fictif` (cas courant, cas limite, cas de refus, jamais nommés comme réels) ; `## Le cadre` sourcé (données, conservation, obligations) avec **les citations officielles en lien dans le corps** (`[texte](https://…)` vers la page exacte, une par claim) ; `## Les erreurs fréquentes` (liste en gras) ; `## Questions fréquentes` (quatre à cinq H3 en question, réponses de deux à quatre phrases, sans mot légal normatif non sourcé) ; `## La règle à retenir` (deux phrases) ; `## Pour aller plus loin` (liens internes). Étiqueter « méthode Memlia » ce qui est notre méthode et non une règle réglementaire. Ton : direct, concret, sans superlatif, sans « nous constatons », sans chiffre de gain.

Pièges mesurés : le mot « module » est interdit ; « s'arrête » est lu comme « arrêtés » par le détecteur de matière légale (écrire « cesse ») ; `description` entre 50 et 160 caractères ; `tabTitle` ≤ 70 ; `image.alt` ≤ 125 ; un paragraphe qui contient une URL `https://` ou un mot légal (« réglementation », « code du travail », « loi », « décret ») avec un verbe normatif (« doit », « obligatoire ») exige un claim de type sensible relié à une autorité officielle ; chaque lien externe du corps est donc porté par un claim.

Sources : 3 à 5 pages officielles ouvertes le jour même, chacune avec un `excerpt` verbatim d'au moins 40 caractères pris dans le HTML brut de la page (une seule ligne du fichier, sans entité HTML au milieu). Claims : 4 à 8, chacun une sous-chaîne exacte d'un paragraphe (`unite` = un fragment unique de ce paragraphe, `claim` = la phrase, `excerpt` = la citation exacte, `type` parmi `legal-reglementaire`, `fiscal`, `dsn`, `paie`, `social`, `juridique`, `information`, `methode`, `produit`, `statistique-chiffre`) ; la citation doit partager au moins 60 % des mots de quatre lettres et plus du claim, sinon ajouter `translationTerms` (deux paires). Les types sensibles exigent une source officielle reconnue (Service-Public, CNIL, impots.gouv, Net-entreprises, Insee, travail-emploi).

Liens : `links.outgoing` = le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, les articles publiés voisins, `/methode`, une ou deux ancres de `/glossaire#…` existantes (`grep -o "anchor: '[^']*'" src/data/glossary.ts`) ; chaque lien doit apparaître dans le corps sous la forme `](/chemin`. `links.incoming` = `["/blog", "/blog/automatiser-un-cabinet-comptable-la-carte-des-taches"]` : ajouter dans `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/corps.md` un lien vers le nouvel article là où sa famille est nommée, et le slug dans `links.outgoing` de la recette du pilier. `businessReview.reviewerId` = `relecteur-metier-ia-memlia`, `role` = le rôle du lecteur. `serp` = relevé WebSearch du jour (acteurs, formats, note) ; `gsc` = état Search Console (impressions 0 pour une page nouvelle, « aucun crédit métrique revendiqué »). `preuvesSkills` = une observation par skill blog réellement joué (brief, outline avec le gabarit utilisé, style avec le verdict de `cognitive_load.py`, schema, image).

### L'image de tête : la recette d'image des articles

Jamais un cadre HTML pour un article publié. L'image est générée depuis un **brief à six composantes** (sujet, composition, style, palette, interdits, alt), en continuité avec les couvertures existantes (IMG-23, IMG-24, IMG-25 : diorama 3D isométrique, formes géométriques simplifiées, matières mates et translucides, fond crème papier, palette Memlia vert #27b657 / vert profond #1c8a41 / crème / graphite, lumière douce du haut gauche ; interdits : texte, chiffres, logo, personnage, donnée client, fausse interface, alerte rouge, symbole d'envoi automatique). Génération payante par la CLI Higgsfield (compte pro) : annoncer le coût avant de lancer, puis :

```bash
higgsfield generate cost gpt_image_2_5 --prompt "<prompt du brief>" --aspect_ratio 16:9 --quality high --resolution 2k
higgsfield generate create gpt_image_2_5 --prompt "<prompt du brief>" --aspect_ratio 16:9 --quality high --resolution 2k --wait --json > /tmp/higgs.json
higgsfield generate list --json   # result_url (PNG pleine résolution, pas min_result_url)
```

Télécharger le PNG `result_url` dans `editorial/recettes/<slug>/image-source.png`, écrire `image-source.json` (generationId, model, provider, quality, resolution, url, createdAt, credits) et renseigner `recette.image.source` (path, generationId, model, provider, generatedAt, credits) et `recette.image.brief` (les six composantes, `prompt`, `reviewCriteria`). Regarder l'image (outil Read) avant de continuer : si elle contient du texte, un personnage, une fausse interface ou s'éloigne de la charte, régénérer (3 crédits) plutôt que publier. La forge recadre à 1920×1080, produit l'OG 1200×630 et les dérivés 768/1200/1600 AVIF et WebP, et déclare le hero dans `src/data/images.mjs`.

## 4. Préparer, faire relire, sceller

```bash
node scripts/blog-forge.mjs preparer <slug>
```

Corriger la recette tant que `erreurs` n'est pas vide (le message dit quoi). Puis rendre la page pour la revue :

```bash
BLOG_PREVIEW_SLUGS=<slug> npx astro build --outDir .qa/render-<slug> > /dev/null && ls .qa/render-<slug>/blog/<slug>.html
```

et lancer un sous-agent relecteur (modèle sonnet, identité distincte de l'auteur) avec le prompt du §7, qui écrit `editorial/recettes/<slug>/revues.json` : grille éditoriale du pipeline, verdict métier par affirmation, grille image, et **revue qualité à 100 points** (barème `~/.claude/skills/blog/references/quality-scoring.md`, cinq catégories) sur le HTML rendu. Le score doit atteindre 90 avec 0 P0 ; la forge écrit `quality-review.json` et `seo-geo-review.md` dans le dossier. Un `FAIL`, un `p0` ou un verdict autre que « soutient » se corrige dans la recette (jamais dans la revue), puis on relance `preparer` et une nouvelle revue. Ensuite :

```bash
node scripts/blog-forge.mjs sceller <slug>
```

Le gate doit rendre `"pass": true`. Sinon lire les `errors`, corriger la recette, recommencer (deux fois au plus).

## 5. Publier, prouver, pousser

Dans cet ordre, pour tous les articles du jour puis le pilier (qui a reçu un lien) :

```bash
node --input-type=module -e "import { materialiser } from './scripts/blog-forge.mjs'; for (const slug of ['<slug>', 'automatiser-un-cabinet-comptable-la-carte-des-taches']) { const r = await materialiser({ root: process.cwd(), slug, statut: 'go-production' }); console.log(slug, r.erreurs); }"
npx astro build && npm run lastmod:sync
npm run resource:seal-surfaces && node scripts/reaffirm-resource-review.mjs reaffirmer   # la surface Ressources scellée est le glossaire seul (la page /ressources est retirée depuis le 16/09/2026 au soir) ; à rejouer dès que le HTML du glossaire ou le chrome du site change
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

Le message de commit se termine par la ligne d'attribution `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Puis attendre le déploiement : `npx wrangler pages deployment list --project-name memlia --json` donne l'identifiant du déploiement du commit poussé (`Source`), mais son statut `Active` s'affiche dès le push, avant la fin du build ; la preuve que le build est fini est l'URL propre du déploiement `https://<id>.memlia.pages.dev/<page>` (en-tête User-Agent de navigateur, `pages.dev` refuse curl nu) qui sert un marqueur du contenu poussé (nouveau titre, nombre de termes, texte ajouté), en général cinq à dix minutes après le push. Ensuite contrôler en ligne :

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://memlia.fr/blog/<slug>
PREVIEW_SOURCE=dist QA_URL=https://<id>.memlia.pages.dev node scripts/verify-preview.mjs
~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py
node scripts/seo/forge-seo.mjs apres-publication <slug>
```

La dernière commande est l'extension F1 (`RUNBOOK-SEO.md` §6) : elle attend que la production serve le titre d'onglet de l'article, pose les baselines de dérive (article, `/blog`, pilier), inscrit la requête primaire au registre `docs/strategy/site-v3/mesures/registre-requetes.json` (la commande `publier` l'a déjà fait) et envoie le ping IndexNow ; son JSON va dans la note du journal.

Consigner dans `docs/strategy/site-v3/JOURNAL.md` (une ligne par article : date, slug, commit, identifiant de déploiement, code HTTP, équivalence octets, sitemap renvoyé) et commiter le journal.

## 6. Jour sans créneau (vendredi, ou semaine complète)

Dans l'ordre, sans publier d'article :

1. Régénérer le plan (`build-cluster-plan.py --check`) et vérifier que les articles de la semaine sont bien `published`.
2. Relever l'indexation des URL publiées depuis sept jours (Search Console : `~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py` affiche le sitemap ; l'inspection d'URL unitaire reste manuelle, Kevin la fait dans la propriété).
3. Glossaire : la vague 1 (vingt termes) est intégrée depuis le 16/09/2026 par la chaîne Ressources (revue métier R5 : `docs/qa/hub-ressources/metier-review-r5/`, rapport de sources : `docs/qa/hub-ressources/glossaire-vague-1.md`). Pour une vague suivante, rejouer la même chaîne et jamais un simple ajout dans le fichier : entrées dans `src/data/glossary.ts` (une seule apostrophe typographique, jamais droite, dans les textes) ; copies de source datées dans `docs/qa/hub-ressources/<vague>-sources/` (curl avec en-tête de navigateur ; Légifrance et l'assistance Net-entreprises exigent un navigateur) ; spécifications de preuve et planchers `DEFINITIONS_ATTENDUES` / `UNITES_ATTENDUES` dans `scripts/lib/resource-metier-evidence.mjs` ; champs à portée juridique déclarés dans `ADDITIONAL_UNITS` de `resource-metier-v3.mjs` ; compteurs des tests (`tests/proof/test_glossary.py`, `tests/browser/glossary.spec.ts`, totaux de `test_resource_v3_traceability.py`) ; `npm run resource:seal-surfaces` ; revue métier par un agent distinct sous une carte kanban `t_…` (verdict par couple affirmation/source sur les types sensibles) ; injection de la revue dans les deux manifestes puis `node scripts/reaffirm-resource-review.mjs ancrer` ; `npm run resource:audit:qa` vert.
4. Maintenance SEO, l'extension F2 (`RUNBOOK-SEO.md` §7) : `node scripts/seo/forge-seo.mjs maintenance lister` donne les tâches déposées par les crons ; en traiter deux au plus, par gravité, chacune par republication scellée (la recette pour un article v3 ; `scripts/migrate-published-blog.mjs` pour les trois articles antérieurs à la v3), puis `node scripts/seo/forge-seo.mjs maintenance cloturer <id> --commit <sha>` ; une tâche jugée fausse s'écarte avec `ecarter <id> --motif "…"` et son motif dans le journal.
5. Consigner dans `JOURNAL.md` ce qui a été fait, et pousser.

## 7. Prompt du sous-agent relecteur (version complète)

Remplacer `<slug>` et `<role>` (rôle du lecteur, ex. `collaborateurs-comptables`), lancer avec le modèle sonnet, après avoir rendu la page (§4) :

> Tu es le relecteur indépendant d'un article candidat de memlia.fr (site de Memlia : automatisation, avec IA, des tâches répétitives des cabinets d'expertise comptable français, dans les outils existants, avec validation humaine). Tu portes trois identités distinctes de l'auteur (« kevin ») : le reviewer éditorial « marketing », le reviewer métier « relecteur-metier-ia-memlia » (rôle : `<role>`) et le reviewer qualité « relecteur-qualite-ia-memlia » qui applique le barème blog-analyze à 100 points. Tu ne réécris rien : tu juges, et tu écris un seul fichier JSON.
>
> Lis, dans cet ordre : 1. `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/recettes/<slug>/paquet-revue.json` (article, sources, claims avec citation et contexte, critères, brief d'image) ; 2. `/Users/kevinkitanga/dev/interne/memlia-landing/.qa/render-<slug>/blog/<slug>.html` (la page rendue : c'est sur elle que s'applique le barème à 100 points) ; 3. `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/articles/<slug>/preuves/image/master.png` (regarde-la) et `preuves/image/prompt.json` (le brief) ; 4. pour chaque claim, la copie locale `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/articles/<slug>/preuves/sources/<sourceId>.source.txt` (grep de la citation) ; 5. `/Users/kevinkitanga/.claude/skills/blog/references/quality-scoring.md` et `/Users/kevinkitanga/dev/interne/memlia-landing/.agents/product-marketing.md`.
>
> Écris `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/recettes/<slug>/revues.json` avec exactement cette forme : `{"editorial": {"criteria": {"intent-satisfaction": {"result": "PASS", "observations": ["…"]}, "serp-format-rankability": {…}, "eeat-sources": {…}, "information-gain-proof": {…}, "technical-onpage-seo": {…}, "ai-citability": {…}, "contextual-conversion": {…}}, "p0": []}, "business": {"claims": {"<claimId>": {"verdict": "soutient", "reasoning": "…"}}}, "image": {"criteria": {"brief-six-components": {"result": "PASS", "observations": ["…"]}, "generation-constraints": {…}, "fictive-provenance": {…}, "recognizable-subject": {…}, "technical-derivatives": {…}, "alt-information": {…}}, "directionArt": 18, "semanticRelevance": 22}, "sources": {"reviewedBy": "relecteur-metier-ia-memlia", "observations": {"<sourceId>": "…"}}, "qualite": {"reviewer": "relecteur-qualite-ia-memlia", "score": 0, "p0": [], "categories": {"contentQuality": {"score": 0, "max": 30}, "seoOptimization": {"score": 0, "max": 25}, "eeatSignals": {"score": 0, "max": 15}, "technicalElements": {"score": 0, "max": 15}, "aiCitationReadiness": {"score": 0, "max": 15}}, "evidence": ["…"], "reservations": ["…"], "seo": ["…"], "geo": ["…"], "verdict": "…"}}`.
>
> Règles : grille éditoriale, chaque `result` PASS ou FAIL selon ton jugement réel, observations d'au moins 30 caractères citant un élément concret, score à atteindre 90/100 (poids 20, 15, 20, 20, 10, 10, 5), `p0` = défauts bloquants. Verdict métier « soutient » seulement si la citation exacte soutient l'affirmation telle qu'écrite, sans changement de portée ni de polarité, sinon « soutient_partiellement », « contredit » ou « hors_sujet » avec `reasoning` d'au moins 40 caractères ; vérifie l'absence de chiffre de gain, de promesse de fonction, de donnée client, du mot « module », et que les délais sont des paramètres du cabinet. Image : six critères observables sur le PNG contre le brief (six composantes ; 16:9, diorama 3D isométrique, palette crème/vert/graphite, aucune fausse interface ; provenance fictive ; sujet reconnaissable ; dérivés 1920×1080, OG 1200×630, 768 px déclarés ; alt ≤ 125 caractères décrivant l'image) ; `directionArt` 16-20, `semanticRelevance` 20-25. `sources.observations` : une phrase par source (éditeur, domaine, niveau). Revue qualité sur la page rendue : chaque catégorie notée sur son maximum avec les critères du barème ; `score` = somme ; `p0` = défauts critiques (statistique inventée, hiérarchie cassée, claim sans source, auteur absent) ; `evidence` 4 à 8 constats ; `reservations` (Lighthouse, citation réelle non mesurées) ; `seo` et `geo` 4 à 6 puces factuelles ; `verdict` une phrase. Message final : chemin écrit, score éditorial, score qualité par catégorie, nombre de « soutient », réserves. Ne modifie aucun autre fichier.

Un score qualité sous 90, un P0, un FAIL ou un verdict autre que « soutient » se corrige dans la recette (jamais dans la revue), puis `preparer`, rendu, nouvelle revue.

## 8. Ce que cette procédure ne fait jamais

Elle ne crée pas de page commerciale, ne touche pas aux cinq pages du tunnel, ne modifie pas un article publié autrement que par une republication scellée par la forge (le pilier pour ses liens), ne demande pas l'inspection d'URL à Search Console (action manuelle de Kevin), et ne dépasse pas les plafonds même si le calendrier a pris du retard : le retard se rattrape à quatre par semaine, pas plus.
