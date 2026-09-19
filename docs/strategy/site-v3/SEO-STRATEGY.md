# Stratégie SEO et éditoriale v3 : tout le cabinet, pas seulement la paie

Écrite le 16 septembre 2026, validée par Kevin le jour même avec deux amendements (quatre articles
par semaine, territoire élargi à toute tâche automatisable du cabinet). **Remise à l'état réel le
19 septembre 2026**, après la revue mesurée de la demande. La thèse et le constat tiennent ; la
carte du territoire, les chiffres et les seuils sont ceux d'aujourd'hui.

Ce dossier remplace, pour l'éditorial, la stratégie v2 (`../site-v2/SEO-STRATEGY.md`, trois piliers
dont deux sur la production sociale) et les notes du coffre. Les pages commerciales suivent la
charte de message (`.agents/product-marketing.md` v3), pas ce document.

## 1. Le constat, relu le 19/09

- **Le corpus est né du pôle social**, parce que c'est là que les premières tâches ont été prises en charge. Trois des six articles publiés portent la paie, le bulletin ou la DSN, et six des 43 termes du glossaire portent la DSN ou la production sociale (comptés dans `src/content/blog/` et `src/data/glossary.ts`).
- **Le contrat éditorial prévoyait déjà tout le cabinet** : le schéma du blog (`src/content.config.ts`) accepte douze pôles et les rôles de la taxonomie Ressources. La taxonomie complète existe désormais en source unique, `src/data/familles.ts`.
- **Il n'y avait rien à perdre en élargissant, et il n'y a toujours rien à défendre** : sur 28 jours au 14/09, Search Console donne 4 clics et 17 impressions, tous sur l'accueil, sur des requêtes de marque mal orthographiées ; les six articles sont à zéro impression (`mesures/semaine-2026-W38-demande.json`). La base technique, elle, est propre : 14 URL au sitemap, 14 indexées, 0 rouge (`mesures/sentinelle.jsonl`, 18/09).

## 2. La thèse, inchangée

**Memlia est le site qui explique, tâche par tâche, comment un cabinet d'expertise comptable
automatise ce qu'il fait déjà, sans changer de logiciel, avec une règle écrite dans ses mots, un jeu
d'essai fictif, et une validation humaine.** Le sujet n'est pas « la production sociale » : c'est
**la tâche répétitive du cabinet**, où qu'elle se trouve.

Le terme de catégorie mesuré reste **« automatisation cabinet comptable »** (10 recherches par mois,
seule requête de catégorie chiffrée, relevé DataForSEO du 12/09/2026). La page de service
`/automatisation-cabinet-comptable` le porte. Le pilier
`/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` le porte côté éditorial et vise la même
requête (`mesures/registre-requetes.json`).

Depuis le 19/09, la thèse a un nom sur toute surface : **« la règle écrite »** (charte §2 bis), en
quatre parties, la frontière en trois colonnes, proposition puis validation, l'arrêt dans le doute,
le jeu d'essai fictif. Ce n'est pas un ajout éditorial : la forge refuse de matérialiser un article
daté à partir du 19/09/2026 qui ne porte pas `## La règle écrite` et `## Rejoué sur le jeu fictif`
(`verifierRegleEcrite`, `scripts/blog-forge.mjs`).

## 3. Ce qui a changé depuis la v2

| | v2 (15/09) | v3, en exécution au 19/09 |
|---|---|---|
| Territoire éditorial | production sociale et méthode | **toute tâche automatisable du cabinet** : 60 familles en 12 pôles (`src/data/familles.ts`) |
| Pilier | aucun ; la page de service tenait lieu de hub | **un article pilier publié** le 16/09, plus la page de service |
| Cadence | 1 à 2 articles par mois | **4 par semaine, 2 par jour au plus**, du lundi au jeudi ; plafonds codés et testés |
| Chaîne de production | rédaction directe | **la forge** : recette, sources ouvertes le jour même, revue indépendante, gate, publication scellée sur les octets |
| Glossaire | 23 termes, dont 6 sur la DSN et la production sociale | **43 termes rendus** depuis le 16/09 (23 + vague 1), vague 2 de 14 termes à faire |
| Priorité des sujets | jugée de l'intérieur | **mesurée** depuis le 19/09 : autocomplétion Google et pages de résultats, invariant au `--check` |
| Pages commerciales | 5 pages | **inchangées**. Aucune page par famille tant qu'une tâche n'est pas livrée et décrite (règle anti-catalogue) |

Ce qui ne bouge pas, parce que ce sont des règles de maison : aucune donnée client, aucun chiffre non
sourcé, fact-check daté sur la paie et le fiscal, validation humaine, anti-surveillance (agrégats,
jamais nominatif), fail-closed, pas de page « X contre Y », pas de page ville, pas de contenu macros.

## 4. La carte du territoire : 60 familles en 12 pôles

La source unique est `src/data/familles.ts` : un pôle est un `cluster` du schéma du blog, une famille
est la maille éditoriale. `audit-legal` (pôle audit et commissariat aux comptes) est **listée et non
ouverte** : aucune tâche documentée, aucun angle au backlog. Le backlog porte donc 59 familles
actives, quatre angles par famille, ce que le plan généré compte comme 11 pôles.

Colonnes mesurées : « angles » et « P1 » sont comptés dans `backlog-v3.json` après le recalage du
19/09 ; « publiés » est compté dans `CONTENT-CALENDAR.md`. La preuve terrain de chaque famille vit
dans le référentiel des besoins (`~/dev/produit/referentiel-besoins/`) et dans le champ `preuve` de
chaque angle du backlog : elle n'est pas recopiée ici, pour qu'il n'y ait qu'un endroit à corriger.

| Pôle (`cluster`) | Familles | Angles | Dont P1 | Publiés |
|---|---|---|---|---|
| Production comptable | 13 | 52 | 4 | 2 |
| Paie et social | 7 | 28 | 6 | 3 |
| Juridique et fiscal | 7 | 28 | 10 | 0 |
| Portefeuille et échéances | 5 | 20 | 2 | 0 |
| Administration et secrétariat | 5 | 20 | 2 | 0 |
| Facturation et recouvrement du cabinet | 4 | 16 | 2 | 0 |
| Numérique, IT et data | 4 | 16 | 2 | 0 |
| Conseil et missions spéciales | 4 | 16 | 1 | 0 |
| Méthode et décision humaine | 4 | 15 | 1 | 1 (le pilier) |
| RH et formation | 3 | 12 | 1 | 0 |
| Excel et outils existants | 3 | 12 | 0 | 0 |
| Audit et commissariat aux comptes | 1 | 0 | 0 | 0 |
| **Total** | **60** | **235** | **31** | **6** |

Le pilier compte pour un angle de priorité 1 supplémentaire, hors satellites : 32 angles en priorité
1 au total, 9 en priorité 2, 195 en priorité 3.

Deux lectures à ne pas confondre. **Priorité 1 ne veut pas dire famille importante** : elle dit
seulement que la requête primaire de l'angle a des suggestions d'autocomplétion, donc qu'elle passe
un seuil de volume. Le juridique et fiscal domine la colonne P1 parce que ses requêtes sont des
questions de définition largement tapées, pas parce qu'un cabinet y souffre plus qu'ailleurs.
**Priorité 3 ne veut pas dire sujet mort** : elle dit qu'aucune demande n'est mesurable sur la
formulation actuelle de l'angle, ce qui appelle une réécriture de l'angle avant un abandon.

## 5. Ce que la page de résultats dit (relevés des 17 et 19/09)

- **memlia.fr est absent des 20 premiers** sur « automatisation cabinet comptable » et sur « automatisation saisie comptable ». Sur la requête de marque, `spell = did_you_mean` corrige « memlia » en « mellia », une autre entité occupe la page, et seule `/contact` apparaît au rang 20 (`CRONS-SEO.md` §1).
- **Un aperçu IA occupe 57 des 59 pages de résultats relevées** le 19/09 (`mesures/questions-2026-09-19.json`). Ce n'est pas un détail de forme : sur ces requêtes, la première réponse lue n'est pas un lien.
- **Le haut de page appartient aux éditeurs de logiciel** sur les requêtes de production comptable (chaintrust, pennylane, sage, cegid, dext, qonto reviennent d'une famille à l'autre, `mesures/questions-2026-09-19.md`). Le détecteur automatique d'intention « logiciel » n'a pourtant rougi sur aucune des 59 pages : il exige que la moitié des cinq premiers domaines figure dans une liste fermée d'éditeurs (`DOMAINES_LOGICIEL`, `scripts/lib/seo-questions.mjs`), et cette liste ne connaît pas tous les acteurs rencontrés. **La lecture de l'intention reste donc humaine**, sur le rapport, pas sur le champ.
- **Le recouvrement entre familles reste faible** : au plus deux domaines partagés, jamais quatre (`cluster-plan.md`). Une famille reste un cluster distinct, interlié par le pilier.

Volumes : non mesurés, hors les deux requêtes chiffrées du 12/09. Ne pas en inventer.

## 5 bis. Ce que la demande mesurée a changé le 19/09

Relevé de `scripts/seo/questions.mjs` : 704 amorces, 704 mesurées, **72 avec au moins une
suggestion**, 59 pages de résultats, 0,2125 $, 0 panne (`mesures/questions-2026-09-19.json`). Les
priorités du backlog sont passées de 124 / 60 / 52 à **32 / 9 / 195**.

Quatre enseignements, qui commandent la réécriture des angles :

1. **Le langage du diagnostic n'a aucun volume.** Les formulations par lesquelles nous décrivons le problème (le manque de collaborateurs, les tâches répétitives, le temps gagné) ne sont pas tapées. Une amorce comme « cabinet comptable surcharge de travail » ne rend que deux suggestions, dont la sienne. Écrire pour le diagnostic, c'est écrire pour personne.
2. **Les têtes de requête portent une autre intention que la nôtre** : chercher un logiciel (le haut de page des familles de production), la situation d'un salarié (les requêtes de bulletin et de contrat), ou un modèle de document à télécharger (les recherches associées en « PDF », « Excel », « exemple », « modèle »).
3. **« Manuel de procédures cabinet expertise comptable » est le mot du marché pour ce que nous appelons écrire le savoir-faire.** L'amorce rend deux suggestions, ses secondaires jusqu'à sept, et le haut de page est tenu par des vendeurs de trames, pas par des méthodes (`mesures/questions-2026-09-19.md`). C'est la porte d'entrée lexicale de l'angle de marque, et un article de priorité 1 la vise déjà au calendrier.
4. **Les requêtes de métier précises tiennent.** « crm dsn » rend dix suggestions, jusqu'à la question hyper-spécifique (où trouver le compte rendu dans Net-entreprises, les codes 120, 114, 124, la substitution). Là où le vocabulaire est celui du praticien, la demande existe.

Ce que cela change dans la mécanique : un angle de priorité 1 **sans demande mesurée datée** fait
échouer `build-cluster-plan.py --check`, et C2 lève chaque semaine une alerte « requête primaire sans
demande mesurée » (`RUNBOOK-SEO.md` §3 bis). Ce que cela ne change pas : la cadence, confirmée à
quatre par semaine le 19/09, et les six articles publiés, qui ne bougent pas avant une lecture
Search Console utile.

## 6. La différenciation, article par article

Chaque article porte les marqueurs suivants ; un article qui n'en porte pas trois n'est pas publié,
et les deux derniers sont vérifiés par la forge, pas par le relecteur seul.

1. **Rejouable sans Memlia** : le lecteur peut exécuter la méthode avec ses outils. Sinon c'est une plaquette.
2. **La règle dans les mots du cabinet** : chaque tâche est décrite par sa règle (déclencheur, condition, action, exception), pas par un outil.
3. **Un jeu fictif qui montre le cas courant, le cas limite et le cas de refus.** « Ce que l'outil refuse de faire » est le bloc que personne d'autre n'écrit.
4. **Des sources primaires datées** (Service-Public, CNIL, impots.gouv, Net-entreprises, Insee, travail-emploi), citées mot pour mot, en lien dans le corps, ouvertes le jour même par le vérificateur. Aucun chiffre de gain.
5. **`## La règle écrite`** : la frontière en trois colonnes, la proposition, l'arrêt, le jeu d'essai, pour cette tâche précise et non en formules générales.
6. **`## Rejoué sur le jeu fictif`** : un tableau d'au moins trois lignes, cas joué, sortie obtenue, décision, avec des sorties réelles du rejeu.

Formats privilégiés parce que la page de résultats les récompense et que les concurrents les écrivent
en prose : checklist numérotée et datée, tableau anomalie, cause, action ; tableau de la frontière
d'automatisation ; définition autonome de 40 à 60 mots en tête, extractible par les moteurs et les
assistants.

## 7. Le pilier et les satellites

- **Pilier** : `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, publié le 16/09, format `pillar-page`. Il porte la carte des 60 familles en 12 pôles, l'audit légal listé et non ouvert. Il reçoit un lien de chaque satellite et rend un lien vers chacun ; il est en tête de `/blog`, hors de la liste, et cette position est contrôlée côté Python et côté navigateur (`JOURNAL.md`, « Tranché » du 17/09).
- **Satellites** : 1 800 à 2 500 mots, un par angle, `how-to-guide` par défaut, `faq-knowledge` pour les définitions, `listicle-checklist` pour les checklists. Le plan en compte **238** (les 235 angles satellites du backlog et les trois articles antérieurs à la v3, entrés dans la forge le 17/09), dont 5 publiés, plus le pilier (`cluster-plan.json`, champ `meta`).
- **Maillage** : satellite vers pilier et pilier vers satellite, obligatoires dans les deux sens ; 2 liens de famille ; 1 à 2 ancres de glossaire ; minimum trois liens entrants par article ; aucune orpheline. Contrôlé au `--check` avant chaque vague et chaque mercredi par C3.

## 8. Mesure : des seuils de décision datés, pas des prévisions

Aucune cible de trafic n'est inventée, et aucune promesse de résultat n'est écrite. Point zéro, au
17/09/2026 : 4 clics et 17 impressions sur 28 jours, tous sur l'accueil ; zéro impression sur les six
articles ; 14 URL indexées sur 14 ; memlia.fr hors des 20 premiers sur ses requêtes de tête ; marque
réécrite en « mellia ».

| Échéance | Ce qu'on regarde | Seuil de décision |
|---|---|---|
| chaque lundi (C2) | impressions par page et par famille | la ligne s'écrit même à zéro : zéro est une mesure, et la série commence au jour un. Aucune réallocation de créneau avant la première lecture utile |
| chaque mercredi (C3) | liens entrants (≥ 3), ancres, sources, vitesse (plancher 95) | un rouge se corrige le vendredi suivant par republication scellée, **avant** d'écrire un article de plus |
| **mi-octobre 2026**, première lecture Search Console utile | requêtes avec impressions, par page, sur les articles publiés depuis au moins 28 jours | si aucun article n'a d'impression, le défaut est d'indexation ou de demande, pas de rédaction : on relit la requête visée et le titre avant de toucher au corps. C'est aussi la date à partir de laquelle les six articles peuvent être réécrits (`JOURNAL.md`, « Tranché » du 19/09) |
| **fin novembre 2026** (le calendrier y place 47 articles, 6 publiés et 41 planifiés) | familles ayant trois satellites publiés | une famille à zéro impression sur ses requêtes après trois satellites ne reçoit pas de quatrième créneau ; ils vont à une famille qui en a. Le cron propose, Kevin décide |
| **31 décembre 2026** | le champ `spell` sur la requête de marque | encore actif, il déclenche un plan d'entité (annuaires, mentions, page publique) avant tout effort éditorial supplémentaire sur la marque (`CRONS-SEO.md` §3, C4) |
| **31 décembre 2026** | trois mois de série C2 | seuil d'armement de C5, décroissance et cannibalisation : sans série, il n'a rien à comparer |
| **31 mars 2027** | demandes de contact citant une tâche ou un article | tant que D4 n'est pas tranché, cela ne se mesure que sur le texte du message : la famille citée monte en priorité de production, une famille jamais citée et sans impression descend |

Indicateurs avancés, lisibles sans relancer un audit : nombre de requêtes avec impressions par page,
URL indexées sur URL du sitemap, liens entrants par article, sources rouvertes sur sources citées,
délai entre le créneau du calendrier et la publication.

## 9. Risques et réponses

| Risque | Réponse |
|---|---|
| Écrire sur une tâche qu'un prospect demande et qui n'est pas encore prise en charge | l'article est une méthode ; la page de service et le formulaire cadrent : nous écrivons la règle du cabinet, prix à la complexité. Aucune fonction promise |
| Faits fiscaux et sociaux mouvants (facture électronique, AI Act) | source officielle ouverte le jour même, citation verbatim vérifiée, réouverture hebdomadaire par C3 ; une citation disparue fait passer l'article en maintenance |
| Cadence de quatre par semaine sans baisse de qualité | la forge est le seul chemin : gate, revue indépendante à 100 points avec 0 défaut bloquant, scellement sur les octets. Un article qui n'atteint pas le seuil attend le créneau suivant |
| Écrire pour notre vocabulaire et non pour la demande | relevé mensuel des questions, invariant « priorité 1 implique demande mesurée », alerte hebdomadaire de C2 |
| L'aperçu IA capte la réponse | définition autonome en tête, tableaux extractibles, `llms.txt` à jour. L'effet n'est pas mesuré et ne doit pas être annoncé comme acquis |
| Cannibalisation entre angles voisins | une requête primaire par article, unique sur tout le site, contrôlée au `--check` ; C5 en décembre pour le corpus qui grossit |
| Le glossaire devient un catalogue de définitions génériques | chaque terme garde son contrat : exemple fictif, confusion courante, frontière d'automatisation, sources datées ; pas de terme sans article qui l'emploie |
