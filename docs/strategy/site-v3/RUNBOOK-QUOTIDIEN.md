# Mode opératoire quotidien — la forge éditoriale de memlia.fr

Exécuté par la tâche planifiée « memlia-forge-quotidienne » du lundi au samedi à 9 h (heure locale), sur ce Mac, dans une session Hermes neuve avec le profil GPT configuré. Autorisations de Kevin : quatre articles ordinaires par semaine (16/09/2026), puis une Cicatrice chaque samedi en plus (19/09/2026). Chaque exécution part de zéro : ce document est la seule mémoire de la procédure. Lire aussi `README.md` et `IMPLEMENTATION-ROADMAP.md` de ce dossier avant d'agir.

## 0. Rails non négociables

### Règle courante de livraison et de revue (constitution du 03/10)

Cette règle remplace les prescriptions historiques contraires des sections ci-dessous.
Le push de branche est libre ; la fusion suit une CI verte et une seule revue PASS
(QA pour le code, métier pour le contenu réglementé). `main` publie le blog via
Cloudflare Pages, sans go individuel ni déploiement manuel de production.

Une date de recette, un horodatage, un lien ou une empreinte technique ne demandent
pas de nouvelle revue du fond. Les verdicts et identités historiques ne sont jamais
réécrits. Le garde compare le fond de la recette : dates techniques, références URL
et empreintes en sont exclus ; titre, affirmations, extraits, périmètre et preuve
restent contrôlés. Pour les avis historiques, `editorial/review-substance-baseline.json`
inventorie les recettes dont les octets concordent avec leur revue existante ou
leur inventaire historique. Cet inventaire technique ne crée aucun PASS.
Pour les nouvelles revues, conserver aussi `recipeSubstanceSha256` fourni par
`blog-forge.mjs empreinte`, avec les autres champs `subject`.

Le créneau et la cadence sont des préférences du planificateur, pas des motifs de
refus de l'audit. Le nombre de mots et les scores SEO/qualité sont des conseils,
sans seuil bloquant. Un P0 réel, une source mensongère, une donnée client, un corps
absent, un changement du fond non relu ou une preuve incohérente restent refusés.
Le changement d'une référence impose de vérifier sa cohérence technique, pas de
fabriquer un nouvel avis métier. Un changement du texte ou d'une figure n'est pas
assimilé automatiquement à une simple modification logistique.

Rejeu : `node --test tests/scripts/blog-constitution.test.mjs`, puis
`npm run blog:audit` et `npm run build`. Le test change uniquement la date de
recette, conserve la revue intacte, puis vérifie qu'un titre divergent est refusé.

- **Dépôt** : `/Users/kevinkitanga/dev/interne/memlia-landing`. Chaque exécution utilise un worktree isolé, une branche neuve `site/blog-<sujet>` à la base fraîche de `main`, puis une PR. Le clone dédié du cron ne sert que de source propre synchronisée par `forge_checkout_gate.py` ; il ne reçoit aucune écriture éditoriale. D'autres workers peuvent tourner en parallèle. Seule la fusion contrôlée sur `main` déclenche la publication Cloudflare ; jamais de push direct sur `main`.
- **Cadence** : au plus 2 articles ordinaires par jour et 4 par semaine ISO ; planification automatique du lundi au jeudi, réservation explicite possible à la date réelle hors de ces jours (§2), puis exactement 1 Cicatrice le samedi en sus (`verifierPlafonds`). Le vendredi reste normalement un jour de maintenance (§6). La décision du 29/09 distingue le retard seul des portes de sûreté : le reliquat déjà mandaté W39 n'exige pas une nouvelle signature Kevin à chaque jour de retard. Son seul cadrage opérateur courant est décrit ci-dessous ; aucun second slug ou second exemplaire W39 n'en découle. Le dossier éditorial et la production restent soumis à leurs gardes distincts.

### Reçu opérateur W39 — ponctuel, non renouvelable

Le préflight `build-cluster-plan.py --slot <slug> <jour-Paris>` utilise pour ce seul reliquat
le contrôle en lecture seule `blog-forge.mjs verifier-creneau-w39 <slug> <jour-Paris>` :
identité recette/file, jour réel, reçu exact, RAW signé et quota sont ceux du garde de la forge.
Une publication déjà présente dans les sources ou la file reste un refus, pas une republication.

**État publié et brouillon de republication sont distincts.** Dans un vrai checkout
Git, le planificateur lit une seule base `origin/main`, intégrée à HEAD, pour
reconnaître un article antérieurement non-brouillon dont la forge prépare maintenant
la nouvelle version en `brouillon:true`. Il conserve les métadonnées de cette base
pour le calendrier, sans modifier le candidat ni le considérer comme revu ou servi.
Une date historique changée, une base absente/non intégrée ou une référence qui
change pendant la lecture arrêtent ce contrôle. Un nouveau brouillon ou un commit
de branche seul ne créent pas de publication antérieure. Le préflight doit toujours
avoir vérifié `main` frais ; cette lecture Git n'est pas une preuve HTTP. Le build
public final, les revues liées aux octets et les autres portes restent inchangés.
La CI sélectionne explicitement le SHA de tête de la PR (pas son merge synthétique)
et récupère l'historique Git complet
(`fetch-depth: 0`) pour fournir cette base intégrée, y compris sur une PR. Une
copie de test privée de `origin/main` reste un refus explicite, pas un repli silencieux.
L'édition du calendrier doit toujours être fraîche et intégralement conforme aux sources ;
la trace historique du 26/09 n'est ni déplacée ni transformée en `planned` du jour réel.
Les autres slugs conservent le contrôle ordinaire `planned` au jour courant. Aucun drapeau
de bypass, aucun nouveau cadrage, aucune reconduction : en cas de reçu absent/divergent,
horloge expirée ou sous-processus indisponible, arrêt avant écriture. Les trois tests
`tests/scripts/blog-w39-slot.test.mjs` exercent Python → Node et la forge → Python → Node,
avec horloges figées uniquement dans les fixtures, sans réseau, rendu ou publication.

Le propriétaire `default`, carte `t_73628f94`, a cadré le 01/10/2026 la seule préparation `t_f94d562f`, slug `tests-verts-et-regle-des-trois-passes`, semaine éditoriale `2026-W39`. Autorités existantes : mandat/Clarification du 27/09, autonomie technique du 28/09 et décision directe du 29/09, conservées dans le dépôt privé Hermes (`docs/MEMLIA-BLOG-RATTRAPAGE-W39-2026-09-27.md` et `AGENTS.md`). Les références du JSON désignent ces sources externes à ce dépôt, pas des fichiers publics ni des signatures nouvelles. Un avis QA, un booléen de recette ou un commentaire ne remplace pas le reçu.

`docs/strategy/site-v3/w39-cadrage-operateur.json` porte le schéma v1 exact. `scripts/lib/blog-w39-framing.mjs` vérifie toutes ses clés/valeurs, y compris tâches, autorités et plafond 1 ; la fenêtre civile Europe/Paris du 01/10 au 04/10 inclus (fin 04/10 à 23:59:59) doit couvrir la date proposée ET le jour courant. Le lecteur calcule SHA-256 sur les octets bruts de `editorial/recettes/<slug>/corps.md`, sans trim : `76ffb89670b44fa9acecc86b709546f3044b10e8bf3e9288a1b0e9e0fa5e5e3b`. La fixture privée `tests/fixtures/w39-signed-body.md` est une copie de test de ces octets, jamais un article candidat ni une surface publiée.

API minimale : `verifierPlafonds(actifs, date, { serie: recette.serie, slug, root })`. Avant ce contrôle, forge et gate direct vérifient la série réelle `cicatrices` et l'identité slug/date de la recette ; toute entrée courante de file doit porter exactement les mêmes slug/série/date avant d'être exclue du comptage. Série absente, null ou autre : refus, jamais valeur fabriquée ni correction implicite. Sans racine/reçu valide, après le 29/09 le refus historique demeure. `now` est un point d'injection d'horloge pour les tests seulement ; aucune commande, variable d'environnement ou recette ne le remplace en production. Les témoins historiques 27–29/09 restent lisibles ; la forge exige désormais la date réelle pour toute nouvelle matérialisation du reliquat, donc ils ne permettent aucune antidate. Toutes les occurrences du slug comptent en W39 indépendamment de leur date réelle en W40. Les autres Cicatrices gardent le samedi.

La forge contrôle ce cadrage avant toute écriture/réseau et encore avant mise à jour de la file, même à date inchangée ; une entrée W39 déjà publiée refuse toute édition ou nouvel exemplaire. Le gate preview/production le recontrôle aussi, avec la file et la date réelle. L'audit d'une publication scellée conserve ses autres contrôles d'intégrité et ne demande pas une prolongation du reçu expiré. Arrêt au premier refus de sûreté/autorité, doublon, corps divergent, expiration, dépense/secret/nouveau périmètre. Aucun achat, génération, cron, Preview Cloudflare, ordinaire supplémentaire ou édition d'un ordinaire public. Une extension ne peut pas venir de marketing/platform ni d'une liste de dates ajoutées au code : préserver le refus et remettre le fait au propriétaire opérateur.

Le calendrier archive la date réelle d'une Cicatrice W39 publiée dans le cadrage
existant 01–04/10, tout en comptant son créneau éditorial au 26/09 en W39. Cette
lecture historique reste valide après le 04/10 : elle ne renouvelle jamais le
reçu, ne prépare pas un nouvel exemplaire et ne modifie ni les dates des deux
ordinaires W39 ni leurs plafonds. Les tests traversent aussi cette transition
publié → archive après expiration, pas seulement le préflight de préparation.

Cette PR technique ne publie aucun article. Après QA indépendante du HEAD final et CI exact-head, son intégration séparée doit être prouvée sur `origin/main` avant reprise du blog, sans élargir `blog-only`. Les cartes éditoriales existantes métier/QA doivent être réconciliées par le propriétaire opérateur, avec de nouveaux triplets/SHA et audit natif ; aucun ancien PASS transféré. Au-delà du 04/10, arrêter sans reconduction automatique.
- **Aucun chiffre de gain non mesuré, aucune donnée client, aucune promesse de fonction, aucun mot de catalogue** (« module », « complément Excel/Memlia ») sur une surface publique. L'IA prépare, l'humain décide ; agrégats, jamais nominatif. Fact-check daté pour toute matière paie, sociale, fiscale, juridique ou données.
- **Sources** : `verifySource` ouvre l'URL avec `MemliaBlogSourceVerifier/1.0`, vérifie l'extrait dans la réponse 2xx, puis écrit la copie locale et son SHA-256. Pour un candidat reporté, la forge réutilise une preuve ouverte de 0 à 7 jours civils Europe/Paris avant la revue seulement si identifiant, URL demandée et finale, extrait, niveau, provenance, statut, classification, copie locale et empreinte concordent. `checkedAt` est exactement la date civile Europe/Paris de `retrievedAt` (timestamp UTC réel, non futur) : une ouverture à 22 h UTC peut tomber le lendemain civil, mais une date antidatée ou avancée ne prolonge pas la fraîcheur. `sourcesVerifiedAt` est la date de la source la plus ancienne. Une preuve périmée, future, incomplète ou divergente déclenche une seule nouvelle ouverture par source ; un HTTP 429 arrête la préparation, sans proxy, cookie, navigateur connecté, identité de rechange ni fausse preuve de lecture. Respecter `Retry-After` lors d'une reprise distincte, jamais en boucle immédiate. La classification est revue et reliée au SHA du nouveau candidat, même si la copie réseau est conservée. Pour les nouvelles URLs, vérifier l'URL finale ; certaines autorités peuvent refuser l'accès, ce n'est pas un PASS.
- **Frontière minuit Paris** : la date par défaut du candidat et celle du gate sont celles du calendrier Europe/Paris, non celles de l'UTC. La forge lit une seule fois le jour initial pour le candidat implicite et sa garde : deux lectures indépendantes de part et d'autre de minuit laisseraient passer une revue de la veille. Lors d'une nouvelle ouverture, `retrievedAt` est l'instant UTC réellement enregistré et `checkedAt` est calculé depuis ce même instant dans le fuseau Europe/Paris. Si minuit Paris survient pendant l'ouverture ou la matérialisation, la forge s'arrête en erreur, avant de livrer un candidat : elle ne produit pas de revue de la veille comme si elle portait le jour nouveau. La preuve réseau déjà écrite conserve son instant et sa copie, mais le manifeste provisoire et les fichiers partiels ne doivent être ni scellés ni commités. Reprendre `preparer` au jour réel (copie 0–7 jours réutilisée sous les mêmes gardes), rendre à nouveau le candidat exact et obtenir sa revue indépendante avec ses empreintes ; ne jamais retamponner la revue précédente. Le gate reste une porte distincte avant publication.
- **Rien ne se pousse à moitié** : un candidat préparé mais non scellé fait échouer `blog:audit`, donc le build. Soit l'article est publié et scellé, soit ses fichiers ne sont pas commités.
- **Sessions parallèles** : toujours `git add -- <chemins>` puis `git commit -m "…" -- <chemins>` ; jamais `git commit -a`, jamais `--amend`, jamais `--force`, pas de backtick dans un message de commit.
- **Un test n'est jamais modifié pour passer** : `tests/proof/test_build.py` dérive l'inventaire public des frontmatters non-brouillons. Une divergence de build se résout à sa cause, pas par l'édition d'un compteur historique.
- **Échec** : deux tentatives de correction au plus sur une recette ; ensuite, ne rien pousser, consigner la cause dans `JOURNAL.md`, et s'arrêter. Kevin lit le journal.

## 1. Préflight de la forge (avant toute écriture)

Quota réel : les créneaux W39 des 22/24 restent visibles en historique, mais les deux
articles ordinaires effectivement publiés le 29/09 occupent aussi les deux places de ce
jour et deux places de W40. Le hub IA conserve sa réservation humaine `datePlanifiee` au
29/09 dans le backlog ; le calendrier le marque `a-replanifier`, non actionnable tant
qu'une personne n'a pas fixé une nouvelle date. Une date `manque` ou `a-replanifier` ne
crée aucune capacité réelle. Le générateur `--check` et le préflight comptent ensemble
`published` réel et `planned` actionnable, sans redater une publication.

```bash
cd /Users/kevinkitanga/dev/interne/memlia-forge-cron-checkout
# Le monitor a synchronisé ce clone propre ; aucune écriture métier ici.
RUN_ID=$(date -u +%Y%m%dt%H%M%Sz)-$$
PR_BRANCH="site/blog-forge-$RUN_ID"
FORGE_WORKTREE="/Users/kevinkitanga/dev/interne/memlia-forge-runs/$RUN_ID"
git worktree add -b "$PR_BRANCH" "$FORGE_WORKTREE" HEAD || exit 1
cd "$FORGE_WORKTREE" || exit 1
PREFLIGHT=$(node scripts/cron-preflight.mjs --root "$PWD" --job forge --phase maintenance) || { printf '%s\n' "$PREFLIGHT"; exit 1; }
BASE_SHA=$(printf '%s' "$PREFLIGHT" | node -e 'let s="";process.stdin.on("data",c=>s+=c).on("end",()=>{const r=JSON.parse(s);if(!r.ok)process.exit(1);console.log(r.head)})') || exit 1
```

La phase `maintenance` vérifie racine/cwd, branche `main` ou `site/blog-*`, arbre propre, fichiers requis, fetch frais et HEAD identique au main récupéré. Elle liste les créneaux échus dans `maintenanceRequired` sans les rendre actionnables ni écrire un fichier ; les dates invalides et les dépassements de quotas réels restent rouges. Son `ok:true` permet uniquement la maintenance du calendrier (§2), jamais la préparation d'un article. Le mode historique `initial`, sans phase explicite, conserve son refus des créneaux échus sur `main`.

Conserver le `head` comme `BASE_SHA` jusqu'à la fin. Après maintenance, `--phase before-selection --base "$BASE_SHA"` refuse encore les créneaux échus, les quotas excessifs et toute écriture hors des cinq fichiers calendrier/backlog. Il exige HEAD et main distant inchangés. Avant commit, `before-commit` accepte les fichiers préparés sur la branche isolée mais conserve les mêmes contrôles de calendrier/base. Après commit, `before-push --base "$BASE_SHA" --commit "$COMMIT_SHA"` exige arbre propre, branche `site/blog-*` (pas `main`), commit exact, parent égal à la base et main distant inchangé. Un refus arrête sans commit/push ni pull/rebase automatique ; aucun test des processus voisins. SEO reste non autorisé. Un `ok:true` ne prouve ni revue, ni article, ni CI, ni publication.

## 2. Lire le créneau du jour

Les quatre briefs IA du 03/10 étendent l'inventaire initial, sans publier ni réserver
eux-mêmes : `utiliser-chatgpt-cabinet-comptable`, `verifier-reponse-ia-comptabilite`
et `automatiser-avec-ia-sans-changer-logiciel` dans `ia-generative-agents` ;
`ia-comptabilite-confidentialite-donnees` dans `rgpd-secret-securite`.
Le planificateur ajoute une place par slug mandaté réellement inscrit dans sa
famille. Il conserve les angles initiaux, refuse les ajouts non mandatés et les
familles divergentes ; unicité des requêtes, mesures, maillage et quotas restent
contrôlés. Inscrire le sujet, ses mesures et sa réservation dans le backlog,
puis régénérer les dérivés. Une succession de même pôle/format peut nécessiter
`exceptionAlternance` datée et motivée sur le seul champ effectivement en conflit,
selon la règle existante ; le brief ne crée pas d'exception implicite.

Réservation mandatée d'un article ordinaire (constitution du 03/10, décision du
29/09) : `datePlanifiee` dans le backlog peut fixer la date réelle, y compris
vendredi, samedi ou dimanche. Ce champ existant est la décision éditoriale ; une
recette, un brief ou une ligne de dérivé seuls ne réservent pas de créneau. Les
jours lundi-jeudi restent ceux de la planification automatique, non une porte de
sûreté. Les plafonds restent 2 ordinaires par jour et 4 par semaine ISO, en
comptant les publications réelles et les réservations. Une date échue reste
refusée ; un jour saturé par les publications devient `a-replanifier`. Marketing
réserve le backlog et régénère les dérivés, puis passe le préflight natif
`--slot <slug> <jour-Paris>` : fraîcheur et reconstruction complète restent
obligatoires. Une publication intégrée conserve ensuite sa date hors lundi-jeudi
sans nécessiter de réservation rétrospective. Aucun changement de la série
Cicatrices, du reçu W39, des revues ou de la CI n'en découle.

```bash
python3 docs/strategy/site-v3/build-cluster-plan.py --check
grep -n "^| $(date +%Y-%m-%d) |" docs/strategy/site-v3/CONTENT-CALENDAR.md
```

`--check` vérifie les invariants sans régénérer ni redater les fichiers ; la date « Généré le » du calendrier est celle de sa dernière édition, pas celle du contrôle du jour. La forge refuse avant toute écriture un slug inédit si son créneau source n'est pas `planned` au jour Paris, si les deux dérivés ne sont pas datés de ce jour, ou si le plan JSON complet et le calendrier complet diffèrent de leur reconstruction depuis les sources (`build-cluster-plan.py --slot <slug> <jour-Paris>`, lecture seule). La comparaison inclut les rôles, intentions, preuves, requêtes secondaires, liens, compteurs et toutes les lignes du calendrier, pas seulement la cible. Les republications conservent leur date publiée et ne dépendent pas de ce garde de sélection. Si le calendrier n'a pas été édité aujourd'hui, la ligne trouvée n'est qu'une trace. Revoir le backlog et les publications effectives, décider explicitement les créneaux puis régénérer sans `--check` avant d'utiliser une ligne `planned`. Cette édition n'invente aucune publication : seul le fichier source de l'article publié en fait foi.

Avant de choisir le créneau du jour, lire `maintenanceRequired` et confronter les anciens `planned` au backlog et aux publications effectives. Pour un ordinaire non publié, conserver l'ancienne date dans `dateManquee` du backlog (une trace divergente exige examen, pas écrasement) et retirer une `datePlanifiee` échue. Sans décision explicite de nouvelle réservation, le générateur le rend `a-replanifier` : sa proposition future n'autorise aucune publication. Pour une Cicatrice, conserver sa date historique explicite ; le générateur la rend `manque`. Ne déplacer ni date publiée, ni cadrage W39, ni corps personnel. Vérifier ensuite les invariants avec `--check`, régénérer sans `--check` et examiner le diff des dérivés avant toute sélection :

```bash
python3 docs/strategy/site-v3/build-cluster-plan.py --check || exit 1
python3 docs/strategy/site-v3/build-cluster-plan.py || exit 1
node scripts/cron-preflight.mjs --root "$PWD" --job forge --phase before-selection --base "$BASE_SHA" || exit 1
```

Ce contrôle ne remplace pas `--slot` dans la forge : date Paris fraîche, reconstruction complète depuis les sources et authenticité du récit restent obligatoires. Aucun article disponible après maintenance : consigner le fait, conserver le worktree pour examen, arrêter sans fabrication ni publication. Le reliquat W39 reste sur ses cartes existantes. Le prompt versionné `FORGE-CRON-PROMPT.md` doit être installé sur le seul cron marketing `e4eaaf20655f`, en conservant son état paused ; sa réactivation appartient à la reprise éditoriale après intégration et revue.

Chaque ligne de la date du jour au statut `planned` est un article à produire (une, parfois deux du lundi au jeudi ; une seule Cicatrice le samedi). Son slug donne l'entrée complète dans `docs/strategy/site-v3/backlog-v3.json` : titre, requête primaire, requêtes secondaires, famille, rôle, intention, entonnoir, format, preuve attendue, autorités à citer. Aucune ligne un jour ordinaire : aller au §6. Aucune ligne un samedi : ne pas inventer de récit ; consigner le stock vide dans `JOURNAL.md` et ouvrir une carte de réapprovisionnement depuis les leçons et faits mesurés.

## 3. Écrire la recette (la recette éditoriale Memlia, héritée de l'article 3)

Constat historique de la relecture du 04/10/2026 après PR54 : les deux alertes de source plus récente du lot
`t_b101bf53` sont déjà absorbées par les ajouts du 03/10 ci-dessous. Le diff entre la dernière
édition de ce runbook et main est vide pour `scripts/blog-forge.mjs` et
`scripts/render-blog-article-proofs.mjs` ; leur dernier changement est `2e8ea7c0`.
Maintien motivé, pas réécriture de la procédure : la forge injecte une image directe 1600 × 900
par figure, conserve les provenances et projette les identités de revue réellement présentes.
Le renderer scellait alors 24 cadres pour 12 articles, deux par recette de cette série :
ce contrat précis d'actifs historiques n'est pas un quota universel pour les prochains articles.
Son `--check` local rend les pixels ; sur Pages (`CF_PAGES=1`), il compare sources, manifeste et
actifs versionnés sans certifier un nouveau rendu visuel. Historique, avis acquis et intégration
documentaire IA du §3 conservés. [Qualification et commandes](QUALIFICATION-SOCLES-2026-10-04.md).

Qualification courante après PR60 (`e4929b8f`, intégrée sur main `92ee0c81`) : le renderer
retire les constantes 24 cadres/12 articles et dérive l'inventaire de `content-contract.json`.
Il vérifie un inventaire non vide, des identifiants uniques, la concordance des cadres et
exactement deux preuves par recette de cette série. Le contrat actuel contient 24 cadres
pour 12 articles : photographie vérifiée, ni plafond ni taille imposée aux lots suivants.
La procédure d'inventaire ci-dessous issue de PR60, les modes local/Pages, les clauses de
réservation PR57 et l'intégration IA sont conservés ; le constat PR54 ci-dessus reste historique.

### Objectifs éditoriaux et preuves requises au scellement

Trois sources vérifiables et deux pages entrantes distinctes sont des objectifs
éditoriaux, pas des conditions numériques de preview, de scellement ou de build
public (constitution du 03/10, §4). Le manifeste garde des listes explicites
`sources` et `links.incoming` ; chaque source présente est intégralement contrôlée,
même sous l'objectif : identité, URL publique, dates, provenance/classification,
reçu réseau, copie locale et intégrité. Les claims restent reliés aux citations
vérifiées et la matière sensible à sa revue métier. Un tableau vide n'autorise
jamais une affirmation sans la preuve que le gate exige pour elle.

Chaque entrant déclaré doit réellement pointer vers l'article : `/blog` est
vérifié dans le rendu Astro, les autres pages dans le corpus. Ne pas déclarer
un entrant projeté comme acquis ni ajouter de source de remplissage. La revue
normale apprécie la suffisance du fond ; les améliorations de quantité rejoignent
la maintenance après publication, sans nouvelle revue de fond pour cette seule
réparation. Les contrôles critiques de sources, claims, liens, rendu, revue,
fraîcheur, intégrité et plafonds de publication restent inchangés.

### Couverture exhaustive Blog et SEO, automatique à chaque rédaction (décision Kevin du 03/10/2026)

Cette règle s'applique à toute nouvelle rédaction, réécriture et republication, sans rappel de Kevin. Elle remplace la sélection usuelle de sous-skills décrite ci-dessous ; lire une liste ou recopier un ancien PASS n'est pas exécuter les contrôles.

1. **Inventorier à chaque lot.** Appeler `skills_list`, conserver sa sortie et confronter le catalogue courant au pack Hermes installé, à `editorial/templates/skills.json`, aux tableaux `BLOG_SKILLS` / `SEO_SKILLS` de `scripts/lib/blog-pipeline.mjs` et aux orchestrateurs `blog` / `seo`. Charger les deux racines et chaque sous-skill de l'union, y compris les extensions disponibles. Contrôle du 03/10 : 63 entrées uniques, soit 2 racines + 31 Blog + 30 SEO ; 56 sont exposées au catalogue, le registre technique conserve 31 Blog / 24 SEO. Les sept fichiers du pack absents du catalogue sont `blog-audio`, `blog-notebooklm`, `seo-ahrefs`, `seo-bing`, `seo-profound`, `seo-seranking` et `seo-unlighthouse` : lire et tracer cette différence, sans installation implicite. Les nombres sont une photographie, pas une constante à reconduire. Ne pas injecter les extensions hors registre dans le manifeste technique `skills.json`.
2. **Matrice obligatoire par article.** Conserver `editorial/recettes/<slug>/couverture-skills.json` et sa vue Markdown, ou une matrice de lot dont chaque ligne nomme les slugs couverts. Champs : `skill`, chemin/version chargé, phase, `applicable` ou `N/A` motivé, état d'exécution, preuve/commande/artefact, constat, changement effectué (ou maintien justifié). Distinguer `lu`, `execute`, `partiel`, `indisponible`, `a-executer` et `N/A` ; ne jamais transformer `lu` en `RUN/PASS`. Les preuves partagées de lot restent reliées à chaque article.
3. **Exécuter ce qui s'applique.** Analyse de l'existant, demande et fraîcheur GSC, SERP, intentions, maillage/cannibalisation, brief, plan, rédaction, sources, style, images, schémas, contrôle du rendu et preuve servie sont couverts selon leur phase. Au stade diagnostic, les contrôles de rédaction/rendu/publication restent explicitement `a-executer`, pas PASS anticipés. Pour une source/API absente, noter `indisponible`, jamais zéro. Les scores sont des heuristiques éditoriales, pas des données Google ; un analyseur anglais ou un parseur non adapté aux frontmatters français ne certifie pas la qualité du candidat.
4. **N/A reste une décision documentée.** Lire et justifier les sous-skills sans intention correspondante (local/maps, ecommerce, hreflang, traduction/localisation, audio, NotebookLM, programmatic, comparaison d'éditeurs, réutilisation hors blog). Ne créer ni campagne, compte, dépense, besoin international ou nouvelle surface pour cocher une case. Les règles de la constitution sur les dépenses et l'arrêt LinkedIn/mail/CRM/plateforme produit priment.
5. **Vérifier dans la revue normale.** L'unique revue indépendante applicable contrôle l'exhaustivité de la matrice, les justifications N/A, les preuves réellement exécutées et les omissions ; aucune deuxième revue dédiée aux skills. Les compétences applicables non exécutées ne disparaissent pas sous un N/A générique. Le `skills.json` v1 généré par la forge reste un manifeste technique ; ses RUN/PASS et observations synthétiques ne remplacent pas cette matrice sourcée.
6. **Lire honnêtement l'historique.** Examiner `recette.preuvesSkills`, `editorial/articles/<slug>/skills.json`, `preuves/skills/*`, les revues qualité/SEO et les journaux avant de conclure. L'absence dans `preuvesSkills` ne prouve pas une absence d'exécution. Une attestation générée sans sortie spécifique prouve une trace déclarée, pas l'exécution complète du skill. Ne pas régénérer rétrospectivement des preuves ni requalifier un ancien verdict sous l'identité d'un reviewer.

Critère de fini des prochaines cartes rédaction/publication : matrice exhaustive Blog/SEO sans omission, contrôles applicables exécutés avec preuves et N/A motivés, vérifiés dans la revue normale, en plus des sources et de la preuve de publication existantes.

**Point de départ vérifié et contrôle reproductible.** Lire le [diagnostic du 03/10](mesures/diagnostic-2026-10-03/DIAGNOSTIC.md), les [quatre briefs IA](mesures/diagnostic-2026-10-03/BRIEFS-QUATRE-ARTICLES.md), la [matrice finale](mesures/diagnostic-2026-10-03/couverture-livraison.json) et sa [vue Markdown](mesures/diagnostic-2026-10-03/COUVERTURE-LIVRAISON.md), puis l'[état d'intégration et les limites du rejeu](mesures/diagnostic-2026-10-03/INTEGRATION.md). `couverture-skills.json` / `COUVERTURE-SKILLS.md` restent le checkpoint antérieur, pas l'état final. Le catalogue et les lectures sont archivés dans le même dossier. Le vérificateur local se rejoue avec :

```bash
node docs/strategy/site-v3/mesures/diagnostic-2026-10-03/verifier-livraison.mjs docs/strategy/site-v3/mesures/diagnostic-2026-10-03/couverture-livraison.json
```

Il contrôle l'union actuelle, les motifs/états, l'existence des preuves et les constats de ce lot ; quatre mutations testent omission, doublon, exécution sans preuve et motif vide. Ce contrôle est celui du diagnostic daté, **pas un garde universel intégré à la forge**, ni une certification de vérité métier. Pour un lot suivant, refaire l'inventaire et les mesures, adapter les preuves à ses slugs et exécuter le contrôle de couverture avant préparation ; ne pas relancer aveuglément le finaliseur du 03/10 pour attribuer des états aux futurs textes. Un contrôle hérité de fichiers suffit à prouver leur cohérence, jamais leur exécution nouvelle. La revue normale conserve la lecture du fond. Le catalogue peut croître sans modifier le registre technique ; une omission détectée se résout dans la matrice, pas par ajout artificiel de surface.

**Constitution prioritaire pour l'autorité et les coûts.** Les mentions historiques de go individuel, de nouvelle signature de revue pour une date/lien/empreinte ou d'enveloppe Higgsfield globale ci-dessous ne priment pas sur `~/hermes/AGENTS.md` du 03/10 : une seule revue normale du fond, QA pour le code ou `metier` pour le contenu réglementé ; les corrections du même candidat suivent cette revue ; Higgsfield au plus 40 crédits par génération, sans plafond global. Les preuves techniques doivent rester cohérentes avec ce qui est rendu, sans fabriquer un verdict ni contourner une porte du code. Une divergence du code se rapporte avec sa cause, elle n'est pas réécrite dans le verdict. Le blog se publie sous l'autorité constitutionnelle après revue et CI ; ces quatre briefs ne réservent pas des dates et ne publient rien.

Créer `editorial/recettes/<slug>/recette.json` et `corps.md` sur le modèle exact des recettes publiées : `editorial/recettes/automatiser-la-relance-des-pieces-clients/` (satellite, gabarit how-to-guide) et `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/` (pilier). Le contrat de la recette est décrit en tête de `scripts/blog-forge.mjs`. Le H1 `title` et le `tabTitle` portent dès cette recette la requête primaire ou une requête secondaire présente dans le dernier relevé frais `mesures/questions-AAAA-MM-JJ.json` ; une liste d’autocomplétion vide reste une mesure, une requête absente bloque `preparer`. La recette suit les skills blog du pack Hermes `~/hermes/packs/claude-blog/skills/` : `blog-brief` (le brief de la stratégie), `blog-outline` (les gabarits du pack), `blog-write` (les six piliers : réponse d'abord, définitions, preuves sourcées, maillage, structure extractible, FAQ), `blog-factcheck` (les claims du pipeline), `blog-style` (`cognitive_load.py`), `blog-seo-check`, `blog-geo`, `blog-schema`, `blog-image`, `blog-analyze` (revue indépendante à 100 points, §7).

Le corps (1 800 à 2 500 mots pour un satellite, 3 000 à 4 000 pour un pilier, Markdown sans frontmatter, H2 et H3 seulement) suit ce plan : `## Réponse directe` (40 à 80 mots) ; `## Qu'est-ce que … ?` avec les définitions en gras (**Le terme** est …, une phrase autonome par entité) ; pourquoi la tâche casse à la main ; `## Avant de commencer` (liste de ce qu'il faut avoir) ; la méthode en briques ou en étapes numérotées, avec un tableau des conditions quand la règle en dépend ; `## La règle dans les mots du cabinet` (tableau déclencheur, condition, action, exception) ; `## Ce que l'outil refuse, et pourquoi` ; `## Ce qui s'automatise, ce qui attend une validation, ce qui reste humain` (tableau à trois colonnes) ; `## Le jeu fictif` (cas courant, cas limite, cas de refus, jamais nommés comme réels) ; `## Le cadre` sourcé (données, conservation, obligations) avec **les citations officielles en lien dans le corps** (`[texte](https://…)` vers la page exacte, une par claim) ; `## Les erreurs fréquentes` (liste en gras) ; `## Questions fréquentes` (quatre à cinq H3 en question, réponses de deux à quatre phrases, sans mot légal normatif non sourcé) ; `## La règle à retenir` (deux phrases) ; `## Pour aller plus loin` (liens internes). Étiqueter « méthode Memlia » ce qui est notre méthode et non une règle réglementaire. Ton : direct, concret, sans superlatif, sans « nous constatons », sans chiffre de gain.

**Le mécanisme, nommé (charte §2 bis, 19/09/2026) — obligatoire pour tout article daté à partir du 19/09/2026, refusé par la forge sinon.** Après la section « pourquoi la tâche casse à la main » et avant les questions fréquentes, le corps porte deux sections au titre exact :

- `## La règle écrite` — quatre paragraphes ouverts par les libellés en gras **La frontière.** (le tableau à trois colonnes « Se prépare seul | Attend une validation | Reste humain » de la tâche), **La proposition.** (ce que nous produisons, ce que le collaborateur saisit ou valide, ce que le cabinet garde), **L'arrêt.** (les conditions précises où la règle refuse d'écrire, dans les mots de la tâche : pièce illisible, cas hors règle, écart inexpliqué) et **Le jeu d'essai.** (le dossier fictif sur lequel la règle a été rejouée : combien de cas, de quelle nature).
- `## Rejoué sur le jeu fictif` — un tableau d'au moins trois lignes « Cas joué | Sortie obtenue | Décision » avec des sorties réelles du rejeu (un montant, un statut, un refus nommé), jamais des sorties supposées ; quand une capture du banc existe, la déclarer dans `recette.preuves.rejeu` (chemin de l'image et date) et la placer sous le tableau. Aucun chiffre de gain, aucune donnée réelle : le jeu est fictif et le dit.

### Preuves fonctionnelles dans le corps — revue du 30/09/2026

L'objectif éditorial est **deux figures de preuve** en plus de la couverture, montrant les artefacts utiles à la compréhension sur un jeu d'essai fictif. Depuis la décision Kevin du 29/09, ce nombre n'est pas une porte universelle : une preuve requise manquante ou mensongère est critique, un quota non atteint sans défaut réel est un objectif d'amélioration. La recette déclare les figures retenues dans `inlineProofs` : `id`, H2 d'ancrage `insertBeforeHeading`, `alt`, `source`, éventuelle `sourceUrl` officielle et `capturedAt`. La forge les injecte avant le H2 exact sans modifier les phrases de `corps.md` ; un ancrage disparu, un alt absent, une date invalide ou une URL non HTTPS ferme la matérialisation.

La source visuelle vit dans `docs/design/blog-article-proofs/` (`index.html`, `styles.css`, `content-contract.json`). Elle forme une série distincte, parce que les renderers de l'accueil et du site v2 scellent des nombres exacts d'actifs. Chaque cadre mesure 1600 × 900, charge les polices locales, refuse le texte tronqué ou masqué et produit un WebP inférieur à 150 Ko. Après contrôle visuel du rendu :

L'inventaire de cette série blog vient du contrat, non d'un total figé de 24
cadres ou 12 articles. Ajouter les cadres et les entrées de contrat des nouveaux
articles avec leurs recettes concordantes ; le renderer conserve deux preuves
par article de cette série, identifiants uniques, provenance et contrôle de
chaque écran. Ne modifier ni les écrans ni le texte ni les recettes historiques
pour accueillir le nouvel article. Un rendu doit laisser leurs WebP identiques ;
le manifeste inclut aussi le programme de rendu courant. Les autres séries de
preuves historiques gardent leurs propres inventaires et contrats.

```bash
node scripts/render-blog-article-proofs.mjs --adopt  # fige le texte et publie le lot après revue
node scripts/render-blog-article-proofs.mjs --check  # aucune écriture publique, dérive refusée
```

Chaque figure injectée par la forge est un `<figure data-blog-proof>` contenant directement une image fixe responsive et son alt descriptif, sans panneau défilant ni légende technique publique. Le changement de `scripts/blog-forge.mjs` au commit `633aca82d5c9ddbd6c8f15cd43d40cb87cf009e8` retire précisément ces deux éléments du rendu, pas la provenance interne ni la suspension Saisie. Le candidat conserve aussi la lecture des figures historiques dans `verify-blog-contract.mjs` : ce chemin de compatibilité n'est pas le gabarit des nouvelles preuves. Ni consigne « Ouvrir la preuve en grand » ni attestation de recette scellée sur la page. La source exacte, son URL éventuelle, la date de capture et le statut de reconstitution restent obligatoires dans `recette.json`, les manifestes et le contrat de rendu internes ; la véracité de la source relève toujours de la revue indépendante, pas de la seule syntaxe HTML. Vérifier la lisibilité sur le HTML construit à largeur mobile. Une trace absente se constate, elle ne se remplace jamais par un écran inventé. Aucune image générée, aucun crédit Higgsfield et aucune donnée client ne servent à ces preuves.

**Recette de référence des figures de corps (décision Kevin du 03/10/2026).** Une figure de corps est UNE image 1600 × 900, la même sur bureau et sur téléphone : jamais de variante `-mobile`, jamais de bande verticale. Elle montre l'écran d'un outil fictif dans la fenêtre de référence (pastille, nom de l'écran, « Jeu d'essai fictif · contexte ») : registre, file de travail, checklist à statuts, fiche, compteurs ou fenêtre de discussion, remplis de données fictives (D-012, FA-2026-0412, ORGANISME-A…) et de pastilles d'état. Elle illustre, elle n'explique pas : ni schéma d'étapes numérotées commenté, ni slogan, ni phrase d'avertissement, ni reprise du texte de l'article, ni marque réelle, ni chiffre qui se lirait comme un résultat mesuré. Les cadres de référence (suivi social, bulletins, CRM, relance) et les quatorze écrans du 03/10 vivent tous dans `docs/design/blog-article-proofs/` ; `render-blog-article-proofs.mjs` refuse un cadre sans cette fenêtre et ne produit aucun portrait ; la forge sert toujours `/proofs/blog/<id>.webp` en 1600 × 900 et `verify-blog-contract.mjs` refuse une image `-mobile`, même si le fichier existe. `npx playwright test tests/browser/blog-proof-mobile.spec.ts tests/browser/blog-cicatrice-mobile.spec.ts` vérifie les quatorze figures à 320/375/1440 px : image 1600 × 900 sélectionnée, colonne remplie en 16:9, aucun débordement, captures haut et bas. Recette détaillée, exemples refusés et grille de revue : `docs/design/blog-article-proofs/RECETTE.md`.

**Citation exacte et contexte.** Une citation HTML contenant des espaces insécables, des espaces multiples ou `<sup>` garde ses octets dans la phrase source bornée, avec son périmètre et ses exceptions. Retourner seulement l'extrait pour éviter une divergence d'espaces perd ces réserves. La reconstruction par offsets exclut les commentaires et les sous-arbres `head/script/style/noscript/template` avant extraction ; leur présence dans la copie brute ne constitue pas un contexte probant. Le validateur des claims applique cette même frontière. Les témoins `blog-citation-context.test.mjs` contrôlent citation exacte, réserves visibles, fragments et paragraphe implicite ; `blog-pipeline-hardening.test.mjs` refuse un contexte qui n'existe que dans du code/commentaire. Les citations textuelles ordinaires gardent leur extraction visible historique. Ces tests ne remplacent ni l'avis métier sur une source ni la revue des figures.

**Recette technique ≠ republication.** Le test navigateur `blog-proof-mobile.spec.ts` distingue maintenant une fixture technique explicitement non publiée (HTML produit par la vraie forge depuis les sept recettes, quatorze images de référence, gabarit/CSS/serveur d'actifs réels) du contrôle des sept articles réellement rematérialisés. Les captures sont séparées dans `technical-fixture/` et `republication/`. La PR d'actifs ne change pas les corps historiques pour satisfaire ce test : ses trois contrôles finaux sont annoncés SKIP, jamais PASS de republication. Dès qu'un seul des sept corps porte une figure directe, le contrôle final complet est obligatoire : une republication partielle ne peut l'éviter. `QA_URL` ou `QA_BLOG_REPUBLICATION_REQUIRED=1` l'exigent aussi même sans portrait local. Les assertions images directes, chargement, absence de légende/panneau, géométrie et captures haut/bas restent identiques. Les deux témoins Node vérifient cette frontière et le générateur réel ; aucune recette, source, revue ou publication n'est écrite par la fixture.

**Doctrine et code ne se confondent pas.** La requalification technique du 01/10/2026 dans `t_c3229442` retire le refus numérique universel de `scripts/verify-blog-contract.mjs`, pas les défauts critiques : corps absent, figure sans image ou alternative accessible, provenance/date invalide, doublon et preuve déclarée dans `inlineProofs` absente du rendu sont refusés. Les témoins couvrent 0, 1, 2 et 3 figures sans défaut et les mutations critiques ; une preuve essentielle non déclarée reste à juger en revue indépendante. Les renderers des séries historiques conservent leurs contrats exacts d'actifs scellés, pas un quota applicable à tout nouvel article. Ne pas fabriquer une figure pour rendre un build vert. Longueur, score SEO/qualité, retard de cadence, pont commercial et cosmétique sont des objectifs d'amélioration sauf défaut critique réel ; sources sensibles, authenticité, données client, routes et octets de revue restent bloquants. Les prescriptions de score et de longueur ci-dessous décrivent le contrôle codé restant à requalifier, non une autorité supérieure à la décision du 29/09. Cette correction locale ne vaut ni revue finale, ni CI distante, ni déploiement.

**La charte de message fait foi** (`.agents/product-marketing.md`, §7 bis « Les articles du blog », 17/09/2026) : la section « pourquoi la tâche casse à la main » nomme la règle que le cabinet applique sans l'avoir écrite ; Memlia parle en « nous » ; une seule frontière, dite une fois (« ce qui reste au cabinet »), jamais un avertissement répété (« ne remplace pas », « à adapter », « Memlia peut… ») ; aucun tiret cadratin ; les ancres d'accueil (`/#methode`) ne servent plus, on lie les pages `/methode`, `/garanties`, `/automatisation-cabinet-comptable`. `## Pour aller plus loin` dit ce que nous prenons en charge pour cette tâche, entière, dans les outils du cabinet. Le `cta` de la recette : `label` = « Confier cette tâche », `destination` = `/contact`, `outcome` = deux ou trois phrases sur ce que nous faisons de cette tâche, ce que le cabinet garde, et « rien à envoyer » (jamais une description de ce que le lecteur devrait fournir). Une republication porte `updatedAt` (AAAA-MM-JJ) dans la recette ; `date` ne change jamais.

Pièges mesurés : le mot « module » est interdit ; « s'arrête » est lu comme « arrêtés » par le détecteur de matière légale (écrire « cesse ») ; `description` entre 50 et 160 caractères ; `tabTitle` ≤ 70 ; `image.alt` ≤ 125 ; un paragraphe qui contient une URL `https://` ou un mot légal (« réglementation », « code du travail », « loi », « décret ») avec un verbe normatif (« doit », « obligatoire ») exige un claim de type sensible relié à une autorité officielle ; chaque lien externe du corps est donc porté par un claim.

Sources : 3 à 5 pages officielles ouvertes réellement dans la fenêtre bornée du §0 (0 à 7 jours, copie et SHA inchangés), chacune avec un `excerpt` verbatim d'au moins 40 caractères pris dans la copie (une seule ligne, sans entité HTML au milieu). La revue éditoriale, la revue métier, les claims, le fact-check et les preuves de classification restent datés du jour du candidat exact, et les SHA de revue restent ceux de ce candidat ; reporter la publication ne reporte ni ces revues ni les dates de la source. Claims : 4 à 8, chacun une sous-chaîne exacte d'un paragraphe (`unite` = un fragment unique de ce paragraphe, `claim` = la phrase, `excerpt` = la citation exacte, `type` parmi `legal-reglementaire`, `fiscal`, `dsn`, `paie`, `social`, `juridique`, `information`, `methode`, `produit`, `statistique-chiffre`) ; la citation doit partager au moins 60 % des mots de quatre lettres et plus du claim, sinon ajouter `translationTerms` (deux paires). L'exigence de source officielle s'applique au **texte exact du claim** ou à son type sensible, pas à une phrase voisine du même paragraphe : « pôle social » dans le récit n'en fait pas une obligation sociale. Un claim sur la paie, le social ou une règle réglementaire reste sensible même étiqueté `methode`, et exige une source officielle reconnue (Service-Public, CNIL, impots.gouv, Net-entreprises, Insee, travail-emploi). Le signal de matière sensible du paragraphe et la revue métier restent indépendants de cette portée de source.

Les revues, sources et relevés d'autocomplétion non scellés utilisent tous le jour civil de Paris, y compris pendant le décalage avec UTC. Les fixtures datent leur horodatage de récupération à leur création réelle, jamais à un minuit futur. Cette cohérence n'élargit ni l'âge maximal des preuves ni la date réelle de publication.

Avant d'arrêter les liens, demander à la forge ce qui existe déjà :

```bash
node scripts/seo/forge-seo.mjs liens <slug>
```

Elle rend les paragraphes des articles publiés qui nomment déjà la tâche du nouvel article sans le lier (`entrants`, traités par le vendredi après publication) et ceux du nouvel article qui nomment la tâche d'un ancien sans le lier (`sortants`, **à poser maintenant** dans `corps.md`). Lecture seule, aucune écriture.

Liens : `links.outgoing` = le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, les articles publiés voisins, `/methode`, une ou deux ancres de `/glossaire#…` existantes (`grep -o "anchor: '[^']*'" src/data/glossary.ts`) ; chaque lien doit apparaître dans le corps sous la forme `](/chemin`. `links.incoming` = `["/blog", "/blog/automatiser-un-cabinet-comptable-la-carte-des-taches"]` : ajouter dans `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/corps.md` un lien vers le nouvel article là où sa famille est nommée, et le slug dans `links.outgoing` de la recette du pilier. `businessReview.reviewerId` = `relecteur-metier-ia-memlia`, `role` = le rôle du lecteur. `serp` = relevé WebSearch du jour (acteurs, formats, note) ; `gsc` = état Search Console (impressions 0 pour une page nouvelle, « aucun crédit métrique revendiqué »). `preuvesSkills` = une observation par skill blog réellement joué (brief, outline avec le gabarit utilisé, style avec le verdict de `cognitive_load.py`, schema, image).

### L'image de tête : la recette d'image des articles

Jamais un cadre HTML pour la **couverture** d'un article publié ; les deux preuves fonctionnelles du corps suivent la recette distincte ci-dessus. L'image de tête est générée depuis un **brief à six composantes** (sujet, composition, style, palette, interdits, alt), en continuité avec les couvertures existantes (IMG-23, IMG-24, IMG-25 : diorama 3D isométrique, formes géométriques simplifiées, matières mates et translucides, fond crème papier, palette Memlia vert #27b657 / vert profond #1c8a41 / crème / graphite, lumière douce du haut gauche ; interdits : texte, chiffres, logo, personnage, donnée client, fausse interface, alerte rouge, symbole d'envoi automatique). Génération payante par la CLI Higgsfield (compte pro) : annoncer le coût avant de lancer, puis :

**La palette s'épingle, puis se mesure (leçon du 18/09/2026).** Le champ `palette` du brief nomme chaque couleur **avec son code hex** : une couleur nommée sans hex (« crème », « touches de graphite ») fait refuser la recette d'un article daté à partir du 19/09/2026, parce qu'elle ne se mesure pas. Les qualificatifs comptent : une couleur dite **dominante** doit couvrir au moins 2 % des pixels, une **touche** ou une couleur simplement listée au moins 0,5 % (planchers calibrés le 19/09 sur les six couvertures livrées, `scripts/lib/palette.mjs`). La forge mesure le master à l'adoption et écrit le résultat dans `preuves/image/visual-review.json` (`palette.parts`, `palette.statut`) ; un écart bloque un article nouveau et reste une **dette écrite** pour un article antérieur. Pour mesurer une image à la main avant de l'adopter :

```bash
node scripts/mesurer-palette.mjs <image.png> "#27b657,#1c8a41,#fcfbf7,#231f20"
```

⚠ Avant toute génération Higgsfield, contrôler le coût et réserver atomiquement dans le budget global via `~/hermes/scripts/higgsfield-credit-budget.py` ; l'enveloppe engagée doit rester strictement sous 40 crédits. Réconcilier la réservation après exécution ; en cas de budget ou de preuve indisponible, arrêter sans dépenser. La décision blog-only du 25/09/2026 retire le go individuel de Kevin pour la couverture, pas cette limite de dépense.

```bash
higgsfield generate cost gpt_image_2_5 --prompt "<prompt du brief>" --aspect_ratio 16:9 --quality high --resolution 2k
higgsfield generate create gpt_image_2_5 --prompt "<prompt du brief>" --aspect_ratio 16:9 --quality high --resolution 2k --wait --json > /tmp/higgs.json
higgsfield generate list --json   # result_url (PNG pleine résolution, pas min_result_url)
```

Télécharger le PNG `result_url` dans `editorial/recettes/<slug>/image-source.png`, écrire `image-source.json` (generationId, model, provider, quality, resolution, url, createdAt, credits) et renseigner `recette.image.source` (path, generationId, model, provider, generatedAt, credits) et `recette.image.brief` (les six composantes, `prompt`, `reviewCriteria`). Regarder l'image (outil Read) avant de continuer : si elle contient du texte, un personnage, une fausse interface ou s'éloigne de la charte, régénérer (3 crédits) plutôt que publier. La forge recadre à 1920×1080, produit l'OG 1200×630 et les dérivés 768/1200/1600 AVIF et WebP, et déclare le hero dans `src/data/images.mjs`.

Le contrat de rendu refuse aussi un `.article-corps` présent mais vide : blancs, commentaires et balises sans texte ne remplacent pas le contenu. Le texte des `script`, `style`, `template`, `noscript` et des sous-arbres portant l'attribut HTML `hidden` ne compte pas comme contenu éditorial ; la présence de `hidden`, même écrit `hidden="false"`, masque le sous-arbre. L'extraction JSON-LD reste distincte. Ce contrôle statique ne calcule pas la cascade CSS : la visibilité effective reste à vérifier dans le navigateur en QA. Ce contrôle ne fixe aucune longueur minimale et n'exige aucune figure ; une recette lisible avec `inlineProofs: []` ne dispense pas de rendre le corps. Les témoins de `tests/scripts/blog-contract.test.mjs` couvrent ces pertes ainsi qu'un corps court sans figure accepté.

## 4. Préparer, faire relire, sceller

```bash
node scripts/blog-forge.mjs preparer <slug>
```

Corriger la recette tant que `erreurs` n'est pas vide (le message dit quoi). Puis rendre la page pour la revue :

```bash
BLOG_PREVIEW_SLUG=<slug> npx astro build --outDir .qa/render-<slug> > /dev/null && ls .qa/render-<slug>/blog/<slug>.html
```

et lancer un sous-agent relecteur GPT avec le profil Hermes `marketing`, distinct de l'auteur, avec le prompt du §7. Il écrit `editorial/recettes/<slug>/revues.json` : grille éditoriale du pipeline, verdict métier par affirmation, grille image, et **revue qualité à 100 points** (barème `~/hermes/packs/claude-blog/skills/blog/references/quality-scoring.md`, cinq catégories) sur le HTML rendu. Le score doit atteindre 90 avec 0 P0 ; la forge écrit `quality-review.json` et `seo-geo-review.md` dans le dossier. Un `FAIL`, un `p0` ou un verdict autre que « soutient » se corrige dans la recette (jamais dans la revue), puis on relance `preparer` et une nouvelle revue. Ensuite :

Le relecteur calcule les empreintes **après avoir lu** le corps, le rendu et les sources, dans le même worktree et sur la même version : `node scripts/blog-forge.mjs empreinte <slug> .qa/render-<slug>/blog/<slug>.html`. Il copie exactement les quatre champs `slug`, `bodySha256`, `recipeSha256`, `renderedSha256` sous `subject` dans `revues.json` ; cette commande ne rédige ni ne valide l'avis. Le hash du rendu porte les octets de la zone HTML `.article-corps`, figures incluses (et non le chrome ou le témoin preview). `recipeSha256` lie aussi les champs de la recette, dont `updatedAt` et les liens. `sceller`, `publier` et le gate refusent une revue sans empreintes ou sur un autre corps/rendu. Après un changement éditorial, même un simple lien ajouté à un pilier déjà publié, refaire `preparer`, rendre et relire **la version modifiée** avant de poser un nouveau `subject`. Ne jamais retamponner les anciens verdicts : le relecteur reformule ses constats sur la nouvelle version. `editorial/legacy-review-baseline.json` inventorie uniquement les octets des neuf recettes/revues publiées sur `origin/main` au SHA indiqué (pas de nouvelle approbation) : avec un sceau et un corps inchangés, elles restent auditables sans recertification fictive ; toute mutation de ces recettes ou revues invalide cette exception. Ne jamais régénérer cette baseline pour faire passer une republication.

Le gate vérifie séparément la présence de `corps.md`, `recette.json` et `revues.json` pour **chaque dossier pipeline**, avant de comparer les empreintes. Supprimer le corps seul, les deux fichiers corps/revue, ou la recette doit rendre `blog:audit` rouge, même si l'article déjà publié reste présent et scellé. La baseline historique n'autorise que la conservation des octets intacts et ne remplace jamais un fichier absent ; restaurer l'artefact manquant ou refaire une revue indépendante sur la version modifiée. Un article hors pipeline, conservé par son mécanisme d'inventaire historique, reste soumis à son propre contrat.

L'identité effectivement portée par `revues.json` (`editorial.reviewer`, par exemple `qa:<id-de-carte>`) est projetée dans le manifeste, `review.json`, `preuves/review.json` et le paquet de revue. Le gate refuse une discordance ; en l'absence de ce champ sur une revue historique, l'identité préexistante `marketing` est conservée, sans attribuer rétroactivement une revue à QA. Le contrat HTML inspecte les pages publiques même si leur fichier construit manque (rouge), et les brouillons uniquement quand ils sont rendus en preview ; `--slug <brouillon>` exige sa page construite et contrôle toutes les clauses. Tout `--slug` inconnu dans les sources échoue explicitement au lieu de valider zéro article. Un build public ne doit jamais exposer un brouillon pour satisfaire le test.

```bash
node scripts/blog-forge.mjs sceller <slug>
```

Le gate doit rendre `"pass": true`. Sinon lire les `errors`, corriger la recette, recommencer (deux fois au plus).

## 4 bis. Si le créneau du samedi est un article de la série « Cicatrices »

Le calendrier place exactement un article portant `serie: "cicatrices"` chaque samedi, en sus des quatre articles ordinaires (charte §7 ter). Il est **signé Kevin, à la première personne**, et raconte une chose qui a cassé dans la construction de Memlia, ce qu'elle a coûté, et la règle qui en est sortie.

Le plan juge la cadence sur le créneau éditorial, non sur la date réelle de publication : la seule Cicatrice W39 `tests-verts-et-regle-des-trois-passes`, signée pour le 26/09, reste comptée en W39. Les dates de rattrapage du 28–29/09 sont historiques ; le seul cadrage courant 01–04/10 figure au §0. Une autre Cicatrice la même semaine ISO ou une lacune dans les samedis reste refusée. C'est un témoignage personnel, pas un satellite de recherche : l'objectif éditorial du HTML rendu est de 1 000 mots uniquement pour ce slug, contre 1 500 pour les autres articles, y compris les autres Cicatrices. Un écart sous cet objectif (corps ou JSON-LD) est signalé comme reliquat, sans casser le build ; la cohérence `wordCount` avec le corps rendu (écart strictement inférieur à 10 %) reste bloquante. Une perte du rendu par rapport au contenu signé reste soumise aux empreintes de revue, sans dérogation de longueur. Cette exception ne donne pas le droit de compléter ni de réécrire le texte signé pour atteindre un quota. L'ancien sujet de backlog `trois-bugs-que-des-tests-verts-n-ont-pas-vus` reste une trace de planification, remplacée par le slug du planificateur ; ses promesses et sa famille ne sont pas des faits à attribuer au témoignage final.

**Tu ne l'inventes pas.** La forge le prépare et le scelle seulement si une recette fondée sur les faits vécus fournis par Kevin existe déjà (`editorial/recettes/<slug>/`). La décision blog-only du 25/09/2026 retire l'approbation individuelle de fusion et de publication, pas l'authentification du corps personnel exact attribué à Kevin. Pour W39, cette authentification est bornée au SHA-256 `76ffb89670b44fa9acecc86b709546f3044b10e8bf3e9288a1b0e9e0fa5e5e3b` ; si ces octets changent, réauthentifier avant attribution. Aucune nouvelle demande si les octets restent identiques. Si les faits manquent, consigner le créneau vide dans `JOURNAL.md` et s'arrêter, sans second article ordinaire.

Si la recette n'existe pas, ne l'invente pas : une cicatrice est un fait vécu, pas un sujet. Note dans `JOURNAL.md` que le créneau est vide faute de recette, et arrête-toi.

## 5. Publier, prouver, pousser

### Régénérer après un conflit ou un changement du chrome

`npm run regen:generated` construit d'abord le site sans exiger des fichiers générés déjà
à jour, synchronise `pages-lastmod.json`, rescelle le glossaire (avec reconstruction du
rendu après la synchronisation), réaffirme la revue métier existante, puis contrôle
le registre et exécute l'audit QA Ressources. Chaque échec arrête la chaîne ; cette
commande ne remplace pas `npm run build` ni la revue QA de la PR.

Après `git fetch origin` puis `git merge origin/main`, si seuls les fichiers générés
ci-dessous sont en conflit, prendre **la version de main**, jamais assembler leurs
empreintes à la main (`--theirs` signifie main uniquement dans ce merge, pas dans un rebase) :

```bash
git restore --source=origin/main --staged --worktree -- src/data/pages-lastmod.json editorial/resources/glossaire/manifest.json docs/qa/site-copy-b/preuve-glossaire-metier.json docs/qa/hub-ressources/metier-review-r5/reaffirmation.json docs/qa/hub-ressources/metier-fix-c-register.json docs/qa/hub-ressources/metier-fix-c-build-receipt.json
npm run regen:generated
npm run build
git diff --check
git add -- src/data/pages-lastmod.json editorial/resources/glossaire/manifest.json docs/qa/site-copy-b/preuve-glossaire-metier.json docs/qa/hub-ressources/metier-review-r5/reaffirmation.json docs/qa/hub-ressources/metier-fix-c-register.json docs/qa/hub-ressources/metier-fix-c-build-receipt.json
```

Résoudre séparément les conflits de sources avant de régénérer. Cette recette vaut pour
les données dérivées d'un changement de navigation ou de pied de page ; si la branche
change les affirmations, les sources ou la revue du glossaire, préserver ces changements
et suivre le circuit métier, pas cette sélection de main. Ne pas modifier l'ancre ni
élargir sa déclaration pour faire passer un refus. Examiner le diff final : la revue,
ses verdicts et sa date restent conservés ; seul leur scellement suit le rendu. Terminer
le merge une fois tous les conflits résolus et les contrôles verts.

Pour un lot de rattrapage, la séquence détaillée et les conditions de réconciliation sont dans `docs/blog-pipeline.md` § « Lot de rattrapage ». Appliquer ces étapes à **tous** les candidats dans une branche isolée, jamais `publier` le premier alors que les autres restent brouillons. Sous l'autorité blog-only du 25/09, tracer le reçu de l'opérateur réel lié aux octets scellés ; aucun nouveau go personnel de Kevin n'est demandé ni fabriqué. Un texte signé refusé par une porte éditoriale reste inchangé et bloque le lot. Ordre avant commit :

```bash
node --input-type=module -e "import { materialiser } from './scripts/blog-forge.mjs'; for (const slug of ['<slug-1>', '<slug-2>', '<slug-3>', 'automatiser-un-cabinet-comptable-la-carte-des-taches']) { const r = await materialiser({ root: process.cwd(), slug, statut: 'go-production' }); if (r.erreurs.length) throw Error(slug + ': ' + r.erreurs.join('; ')); }"
node scripts/seo/forge-seo.mjs registre reconcilier --date 2026-09-29 # uniquement pour ce rattrapage, date réelle ; examiner le diff et les provenances
npm run blog:production-check -- <slug-1> <slug-2> <slug-3>
node scripts/blog-forge.mjs publier <slug-1> # répéter pour chaque slug du lot, puis le pilier si modifié et revu
node scripts/seo/forge-seo.mjs registre reconcilier --date 2026-09-29
npm run regen:generated
```

Si `publier` ou le build échoue, relever la cause et arrêter sans retirer de porte : vérifier les frontmatters non-brouillons de tout le lot, les entrées anticipées du registre et leurs provenances, `llms.txt`, le ledger lastmod et les sceaux Ressources. Ne jamais modifier `PUBLIC_ARTICLES` (inventaire dynamique) ni réécrire le corps signé pour obtenir un build vert. Rejouer la séquence et la QA sur les octets finaux avant livraison. Ensuite :

```bash
npm run build
git add -- editorial/recettes/<slug-1> editorial/recettes/<slug-2> editorial/recettes/<slug-3> editorial/articles/<slug-1> editorial/articles/<slug-2> editorial/articles/<slug-3> src/content/blog/<slug-1>.md src/content/blog/<slug-2>.md src/content/blog/<slug-3>.md docs/strategy/site-v3/mesures/registre-requetes.json # inclure aussi explicitement les autres fichiers réellement modifiés du lot, dont le pilier s'il a été revu
node scripts/cron-preflight.mjs --root "$PWD" --job forge --phase before-commit --base "$BASE_SHA" || exit 1
# PR_BRANCH est déjà la branche isolée créée au §1 ; ne pas changer de base.
git commit -m "feat(blog): <lot revu>" -- editorial public/images public/llms.txt src tests docs/qa docs/strategy/site-v3/CONTENT-CALENDAR.md docs/strategy/site-v3/cluster-plan.json docs/strategy/site-v3/cluster-plan.md docs/strategy/site-v3/cluster-map.html docs/strategy/site-v3/JOURNAL.md docs/strategy/site-v3/mesures/registre-requetes.json
COMMIT_SHA=$(git rev-parse HEAD)
node scripts/cron-preflight.mjs --root "$PWD" --job forge --phase before-push --base "$BASE_SHA" --commit "$COMMIT_SHA" || exit 1
git push origin "HEAD:refs/heads/$PR_BRANCH" || exit 1
test "$(git ls-remote origin "refs/heads/$PR_BRANCH" | cut -f1)" = "$COMMIT_SHA" || exit 1
gh pr create --base main --head "$PR_BRANCH" --title "feat(blog): <lot revu>" --body "Lot candidat ; QA et CI requises avant fusion" || exit 1
```

Le message de commit suit la convention du dépôt, sans attribution à un runtime ou à un modèle. Le push de branche n'est pas une publication. Obtenir une QA Kanban indépendante `qa`, terminée avec verdict canonique `PASS` sans réserve, sur le numéro et le HEAD exacts de cette PR, ainsi que la preuve CI `Repository gates` complète et réussie sur ce HEAD. Depuis un checkout propre de `main` à jour, exécuter `node scripts/blog-auto-merge.mjs --pr N --qa-task t_ID --expected-head "$COMMIT_SHA" --expected-main "$BASE_SHA"` en lecture seule, puis la même commande avec `--merge` seulement si la première rend `pass:true` et si les références/QA/CI sont encore exactes. La garde refuse tout chemin hors blog, notamment le registre W39 `docs/strategy/site-v3/mesures/registre-requetes.json`, `public/images/`, `public/llms.txt`, `src/data/images.mjs` et les autres fichiers globaux : leur présence exige un circuit de revue et d'autorisation adapté, **pas** une extension opportuniste de l'allowlist ni un push direct. Pour le lot W39 avec registre, arrêter cette fusion autonome et transmettre la PR de contenu aux responsables du circuit adapté. La garde ne verrouille pas atomiquement la base sur GitHub Free privé : après la demande de fusion autorisée, lire le retour GitHub, la PR et `origin/main`, vérifier l'ascendance et le SHA fusionné ; une réponse de commande seule ne suffit pas.

Puis attendre le déploiement : `npx wrangler pages deployment list --project-name memlia --json` donne l'identifiant du déploiement du commit fusionné (`Source`), mais son statut `Active` s'affiche dès le push, avant la fin du build ; la preuve que le build est fini est l'URL propre du déploiement `https://<id>.memlia.pages.dev/<page>` (en-tête User-Agent de navigateur, `pages.dev` refuse curl nu) qui sert un marqueur du contenu fusionné (nouveau titre, nombre de termes, texte ajouté). Ensuite contrôler en ligne :

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://memlia.fr/blog/<slug>
PREVIEW_SOURCE=dist QA_URL=https://<id>.memlia.pages.dev node scripts/verify-preview.mjs
~/hermes/packs/claude-seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py
node scripts/seo/forge-seo.mjs apres-publication <slug>
```

La dernière commande est l'extension F1 (`RUNBOOK-SEO.md` §6) : elle attend que la production serve le titre d'onglet de l'article, pose les baselines de dérive (article, `/blog`, pilier), inscrit la requête primaire au registre `docs/strategy/site-v3/mesures/registre-requetes.json` (la commande `publier` l'a déjà fait) et envoie le ping IndexNow ; son JSON va dans la note du journal.

Consigner dans `docs/strategy/site-v3/JOURNAL.md` (une ligne par article : date, slug, commit, identifiant de déploiement, code HTTP, équivalence octets, sitemap renvoyé) et commiter le journal.

## 6. Jour ordinaire sans créneau (vendredi, ou semaine complète)

Dans l'ordre, sans publier d'article :

1. Vérifier les invariants (`build-cluster-plan.py --check`, sans écriture), puis vérifier dans les sources que les articles de la semaine sont bien publiés ; régénérer sans `--check` uniquement après avoir revu le backlog et les publications effectives.
   Le premier vendredi du mois, avant : `node scripts/seo/questions.mjs relever`, `rapport`, puis `recaler` (`RUNBOOK-SEO.md` §3 bis, environ 0,13 $ derrière la porte de coût) ; lire le rapport et la SERP, vérifier l'intention cabinet, puis corriger à la main si nécessaire les formulations sans suggestion relevée ou dont l'intention est « logiciel » (titre et requête, dans `backlog-v3.json`) avant de régénérer. Zéro suggestion sur les formulations testées ne prouve ni zéro volume ni absence de demande ; une panne reste non mesurée. Un angle de priorité 1 sans date de relevé `demande.mesureeLe` fait échouer `--check`.
2. Relever l'indexation des URL publiées depuis sept jours (Search Console : `~/hermes/packs/claude-seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py` affiche le sitemap ; l'inspection d'URL unitaire reste manuelle, Kevin la fait dans la propriété).
3. Glossaire : la vague 1 (vingt termes) est intégrée depuis le 16/09/2026 par la chaîne Ressources (revue métier R5 : `docs/qa/hub-ressources/metier-review-r5/`, rapport de sources : `docs/qa/hub-ressources/glossaire-vague-1.md`). Pour une vague suivante, rejouer la même chaîne et jamais un simple ajout dans le fichier : entrées dans `src/data/glossary.ts` (une seule apostrophe typographique, jamais droite, dans les textes) ; copies de source datées dans `docs/qa/hub-ressources/<vague>-sources/` (curl avec en-tête de navigateur ; Légifrance et l'assistance Net-entreprises exigent un navigateur) ; spécifications de preuve et planchers `DEFINITIONS_ATTENDUES` / `UNITES_ATTENDUES` dans `scripts/lib/resource-metier-evidence.mjs` ; champs à portée juridique déclarés dans `ADDITIONAL_UNITS` de `resource-metier-v3.mjs` ; compteurs des tests (`tests/proof/test_glossary.py`, `tests/browser/glossary.spec.ts`, totaux de `test_resource_v3_traceability.py`) ; `npm run resource:seal-surfaces` ; revue métier par un agent distinct sous une carte kanban `t_…` (verdict par couple affirmation/source sur les types sensibles) ; injection de la revue dans les deux manifestes puis `node scripts/reaffirm-resource-review.mjs ancrer` ; `npm run resource:audit:qa` vert.
4. Maintenance SEO, l'extension F2 (`RUNBOOK-SEO.md` §7) : `node scripts/seo/forge-seo.mjs maintenance lister` donne les tâches déposées par les crons ; en traiter deux au plus, par gravité, chacune par republication scellée par la forge (depuis le 17/09/2026 au soir, les six articles ont une recette dans `editorial/recettes/` ; `scripts/migrate-published-blog.mjs` ne sert plus qu'à un article qui serait publié hors forge), puis `node scripts/seo/forge-seo.mjs maintenance cloturer <id> --commit <sha>` ; une tâche jugée fausse s'écarte avec `ecarter <id> --motif "…"` et son motif dans le journal.
5. Consigner dans `JOURNAL.md` ce qui a été fait ; tout changement suit le circuit branche/PR/QA/CI/garde du §5, jamais un push direct sur `main`.

## 7. Prompt du sous-agent relecteur (version complète)

Remplacer `<slug>` et `<role>` (rôle du lecteur, ex. `collaborateurs-comptables`), lancer avec le profil GPT Hermes `marketing`, après avoir rendu la page (§4) :

> Tu es le relecteur indépendant d'un article candidat de memlia.fr (site de Memlia : automatisation, avec IA, des tâches répétitives des cabinets d'expertise comptable français, dans les outils existants, avec validation humaine). Tu portes trois identités distinctes de l'auteur (« kevin ») : le reviewer éditorial « marketing », le reviewer métier « relecteur-metier-ia-memlia » (rôle : `<role>`) et le reviewer qualité « relecteur-qualite-ia-memlia » qui applique le barème blog-analyze à 100 points. Tu ne réécris rien : tu juges, et tu écris un seul fichier JSON.
>
> Lis, dans cet ordre : 1. `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/recettes/<slug>/paquet-revue.json` (article, sources, claims avec citation et contexte, critères, brief d'image) ; 2. `/Users/kevinkitanga/dev/interne/memlia-landing/.qa/render-<slug>/blog/<slug>.html` (la page rendue : c'est sur elle que s'applique le barème à 100 points) ; 3. `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/articles/<slug>/preuves/image/master.png` (regarde-la) et `preuves/image/prompt.json` (le brief) ; 4. pour chaque claim, la copie locale `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/articles/<slug>/preuves/sources/<sourceId>.source.txt` (grep de la citation) ; 5. `/Users/kevinkitanga/hermes/packs/claude-blog/skills/blog/references/quality-scoring.md` et `/Users/kevinkitanga/dev/interne/memlia-landing/.agents/product-marketing.md`.
>
> Écris `/Users/kevinkitanga/dev/interne/memlia-landing/editorial/recettes/<slug>/revues.json` avec les grilles éditoriale, métier, image, sources et qualité ci-dessous, plus `"subject": {"slug": "<slug>", "bodySha256": "<SHA-256 du corps exact>", "recipeSha256": "<SHA-256 de recette.json>", "renderedSha256": "<SHA-256 de .article-corps rendu>"}` calculé sur les fichiers que tu viens de relire avec `node scripts/blog-forge.mjs empreinte <slug> .qa/render-<slug>/blog/<slug>.html`. Ne reporte pas une revue antérieure après une mutation, même si ses claims n'ont pas changé.
>
> Règles : grille éditoriale, chaque `result` PASS ou FAIL selon ton jugement réel, observations d'au moins 30 caractères citant un élément concret, score à atteindre 90/100 (poids 20, 15, 20, 20, 10, 10, 5), `p0` = défauts bloquants. Verdict métier « soutient » seulement si la citation exacte soutient l'affirmation telle qu'écrite, sans changement de portée ni de polarité, sinon « soutient_partiellement », « contredit » ou « hors_sujet » avec `reasoning` d'au moins 40 caractères ; lis `preuves/image/visual-review.json` : le bloc `palette` porte la mesure des pixels, ne juge pas la palette à l'œil et ne contredis pas la mesure ; vérifie, pour un article daté à partir du 19/09/2026, que la section « La règle écrite » déroule ses quatre parties (frontière, proposition, arrêt, jeu d'essai) pour cette tâche précise et non en formules générales, et que « Rejoué sur le jeu fictif » montre des sorties concrètes (un FAIL sur `information-gain-proof` sinon) ; vérifie l'absence de chiffre de gain, de promesse de fonction, de donnée client, du mot « module », et que les délais sont des paramètres du cabinet ; vérifie aussi la charte de message (`.agents/product-marketing.md` §7 bis) : Memlia parle en « nous », aucune formule défensive répétée (« ne remplace pas », « à adapter », « Memlia peut »), aucun tiret cadratin, un lien vers le pilier et vers `/methode`, un appel de fin « Confier cette tâche » dont le texte dit ce que nous faisons et ce que le cabinet garde ; un écart est un FAIL du critère `contextual-conversion`. Image : six critères observables sur le PNG contre le brief (six composantes ; 16:9, diorama 3D isométrique, palette crème/vert/graphite, aucune fausse interface ; provenance fictive ; sujet reconnaissable ; dérivés 1920×1080, OG 1200×630, 768 px déclarés ; alt ≤ 125 caractères décrivant l'image) ; `directionArt` 16-20, `semanticRelevance` 20-25. `sources.observations` : une phrase par source (éditeur, domaine, niveau). Revue qualité sur la page rendue : chaque catégorie notée sur son maximum avec les critères du barème ; `score` = somme ; `p0` = défauts critiques (statistique inventée, hiérarchie cassée, claim sans source, auteur absent) ; `evidence` 4 à 8 constats ; `reservations` (Lighthouse, citation réelle non mesurées) ; `seo` et `geo` 4 à 6 puces factuelles ; `verdict` une phrase. Message final : chemin écrit, score éditorial, score qualité par catégorie, nombre de « soutient », réserves. Ne modifie aucun autre fichier.

Un score qualité sous 90, un P0, un FAIL ou un verdict autre que « soutient » se corrige dans la recette (jamais dans la revue), puis `preparer`, rendu, nouvelle revue.

## 8. Ce que cette procédure ne fait jamais

Elle ne crée pas de page commerciale, ne touche pas aux cinq pages du tunnel, ne modifie pas un article publié autrement que par une republication scellée par la forge (le pilier pour ses liens), ne demande pas l'inspection d'URL à Search Console (action manuelle de Kevin), et ne dépasse pas les plafonds même si le calendrier a pris du retard : le retard se rattrape à quatre par semaine, pas plus.
