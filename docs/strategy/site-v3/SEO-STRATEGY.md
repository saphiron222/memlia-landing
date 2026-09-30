# Stratégie SEO et éditoriale v3 : tout le cabinet, pas seulement la paie

Écrite le 16 septembre 2026, validée par Kevin le jour même avec deux amendements (quatre articles
par semaine, territoire élargi à toute tâche automatisable du cabinet). **Remise à l'état réel le
19 septembre 2026**, après la revue mesurée de la demande ; **réconciliée avec les sources du
28 septembre 2026**, puis relue avec les deux articles ordinaires W39 publiés le 29/09 et
la charte §7 ter : l'authentification d'un récit signé n'est pas un go individuel de publication.
Les relevés du 17–19/09 restent des photographies datées, non des mesures actuelles.

Ce dossier remplace, pour l'éditorial, la stratégie v2 (`../site-v2/SEO-STRATEGY.md`, trois piliers
dont deux sur la production sociale) et les notes du coffre. Les pages commerciales suivent la
charte de message (`.agents/product-marketing.md` v4, angle v3 conservé), pas ce document.

## 1. Le constat, relu le 19/09

- **Le corpus est né du pôle social** : trois articles publiés portent la paie, le bulletin ou la DSN. Le corpus courant compte 11 fichiers publiés (`src/content/blog/`), dont le Prompt et le Logiciel IA W39, et le glossaire 53 ancres (`src/data/glossary.ts`). Les six articles et 43 termes du relevé du 19/09 ne sont pas le stock actuel.
- **Le contrat éditorial prévoyait déjà tout le cabinet** : le schéma du blog (`src/content.config.ts`) accepte douze pôles et les rôles de la taxonomie Ressources. La taxonomie complète existe désormais en source unique, `src/data/familles.ts`.
- **Il n'y avait rien à perdre en élargissant, et il n'y a toujours rien à défendre** : sur 28 jours au 14/09, Search Console donne 4 clics et 17 impressions, tous sur l'accueil, sur des requêtes de marque mal orthographiées ; les six articles sont à zéro impression (`mesures/semaine-2026-W38-demande.json`). La base technique, elle, est propre : 14 URL au sitemap, 14 indexées, 0 rouge (`mesures/sentinelle.jsonl`, 18/09).

## 2. La thèse, inchangée

**Memlia est le site qui explique, tâche par tâche, comment un cabinet d'expertise comptable
automatise ce qu'il fait déjà, sans changer de logiciel, avec une règle écrite dans ses mots, un jeu
d'essai fictif, et une validation humaine.** Le sujet n'est pas « la production sociale » : c'est
**la tâche répétitive du cabinet**, où qu'elle se trouve.

Le terme de catégorie mesuré reste **« automatisation cabinet comptable »** (10 recherches par mois
au relevé DataForSEO du 12/09/2026, repère de catégorie et non inventaire des volumes mesurés).
La page de service `/automatisation-cabinet-comptable` le porte. Le pilier
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
| Glossaire | 23 termes, dont 6 sur la DSN et la production sociale | **53 termes rendus** : 23 historiques, 20 en vague 1, 10 en vague 2 ; quatre réglementaires reportés (`GLOSSARY-PLAN.md`) |
| Priorité des sujets | jugée de l'intérieur | **mesurée** depuis le 19/09 : autocomplétion Google et pages de résultats, invariant au `--check` |
| Pages commerciales | 5 pages | service général conservé et pages de tâche sous `/automatisation/<tache>` ; jamais une page par famille par défaut (`ARCHITECTURE-ACCES-COMMERCIAUX.md`) |

Ce qui ne bouge pas, parce que ce sont des règles de maison : aucune donnée client, aucun chiffre non
sourcé, fact-check daté sur la paie et le fiscal, validation humaine, anti-surveillance (agrégats,
jamais nominatif), fail-closed, pas de page « X contre Y », pas de page ville, pas de contenu macros.

## 4. La carte du territoire : 60 familles en 12 pôles

La source unique est `src/data/familles.ts` : un pôle est un `cluster` du schéma du blog, une famille
est la maille éditoriale. `audit-legal` (pôle audit et commissariat aux comptes) est **listée et non
ouverte** : aucune tâche documentée, aucun angle au backlog. Le backlog porte donc 59 familles
actives, quatre angles par famille, ce que le plan généré compte comme 11 pôles.

Colonnes mesurées : « angles » et « P1 » sont comptés dans `backlog-v3.json` après le recalage du
19/09 ; « publiés » est compté dans `CONTENT-CALENDAR.md`. **Photographie du registre au
29/09/2026**, relue le 30/09 dans les blobs de `cluster-plan.json`, `CONTENT-CALENDAR.md` et les
frontmatters non-brouillons au SHA source `bf9bd175d43f640abaeced9346f31ad35d689596` :
10 satellites et 1 pilier, dont 2 satellites Numérique publiés le 29/09
(`logiciel-ia-comptabilite` et `prompt-chatgpt-expert-comptable`). Ces statuts source ne sont
pas une nouvelle vérification des URL servies en production. À chaque publication ou
régénération du plan, le propriétaire éditorial recontrôle cette colonne et son total contre
les trois sources au même SHA ; les photographies historiques du 28/09 (§7 et §8) restent datées.
La preuve terrain de chaque famille vit
dans le référentiel des besoins (`~/dev/produit/referentiel-besoins/`) et dans le champ `preuve` de
chaque angle du backlog : elle n'est pas recopiée ici, pour qu'il n'y ait qu'un endroit à corriger.

| Pôle (`cluster`) | Familles | Angles | Dont P1 | Publiés |
|---|---|---|---|---|
| Production comptable | 13 | 52 | 4 | 2 |
| Paie et social | 7 | 31 | 9 | 3 |
| Juridique et fiscal | 7 | 28 | 10 | 0 |
| Portefeuille et échéances | 5 | 20 | 2 | 1 |
| Administration et secrétariat | 5 | 20 | 2 | 0 |
| Facturation et recouvrement du cabinet | 4 | 16 | 2 | 0 |
| Numérique, IT et data | 4 | 17 | 3 | 2 |
| Conseil et missions spéciales | 4 | 16 | 1 | 0 |
| Méthode et décision humaine | 4 | 21 | 1 | 1 satellite + 1 pilier |
| RH et formation | 3 | 12 | 1 | 1 |
| Excel et outils existants | 3 | 12 | 0 | 0 |
| Audit et commissariat aux comptes | 1 | 0 | 0 | 0 |
| **Total** | **60** | **245 satellites** | **35 satellites** | **10 satellites + 1 pilier** |

Ce tableau lit le plan généré (`cluster-plan.json`) : 245 satellites dont trois articles historiques
hors backlog et huit entrées de la série factuelle « Cicatrices ». Le backlog compte 243 entrées
dont le pilier : 33 P1, 9 P2 et 201 P3 (`backlog-v3.json`, 28/09). Ne pas additionner ses
priorités à celles du plan, qui réintroduit les trois historiques P1. La ligne Méthode du tableau
compte 21 satellites et signale à part le pilier publié.

Deux lectures à ne pas confondre. **Priorité 1 ne veut pas dire famille importante** : elle indique
un signal d'autocomplétion mesuré sur la formulation de l'angle, pas un seuil de volume de recherche.
Le lot blog du 19/09 n'a pas mesuré les volumes Ads des amorces (§5) ; la présence de suggestions
ne chiffre ni le lectorat ni la douleur d'un cabinet. Le juridique et fiscal domine la colonne P1
par ses formulations de questions de définition avec suggestions dans ce lot, pas par une mesure
comparative de la souffrance des cabinets. **Priorité 3 ne veut pas dire sujet mort** : aucun signal
d'autocomplétion n'a été relevé sur la formulation actuelle de l'angle dans ce lot ; cela appelle
une lecture de la SERP et de l'intention cabinet, puis une réécriture éventuelle, non un abandon.

## 5. Ce que la page de résultats dit (relevés des 17 et 19/09)

- **memlia.fr est absent des 20 premiers** sur « automatisation cabinet comptable » et sur « automatisation saisie comptable ». Sur la requête de marque, `spell = did_you_mean` corrige « memlia » en « mellia », une autre entité occupe la page, et seule `/contact` apparaît au rang 20 (`CRONS-SEO.md` §1).
- **Un aperçu IA occupe 57 des 59 pages de résultats relevées** le 19/09 (`mesures/questions-2026-09-19.json`). Ce n'est pas un détail de forme : sur ces requêtes, la première réponse lue n'est pas un lien.
- **Le haut de page appartient aux éditeurs de logiciel** sur les requêtes de production comptable (chaintrust, pennylane, sage, cegid, dext, qonto reviennent d'une famille à l'autre, `mesures/questions-2026-09-19.md`). Le détecteur automatique d'intention « logiciel » n'a pourtant rougi sur aucune des 59 pages : il exige que la moitié des cinq premiers domaines figure dans une liste fermée d'éditeurs (`DOMAINES_LOGICIEL`, `scripts/lib/seo-questions.mjs`), et cette liste ne connaît pas tous les acteurs rencontrés. **La lecture de l'intention reste donc humaine**, sur le rapport, pas sur le champ.
- **Le recouvrement entre familles reste faible** : au plus deux domaines partagés, jamais quatre (`cluster-plan.md`). Une famille reste un cluster distinct, interlié par le pilier.

Ce lot **questions de blog du 19/09** n'a pas mesuré les volumes Ads des 704 amorces.
Le relevé **commercial du 20/09** (`mesures/audience-requetes-2026-09-20.json`,
`AUDIT-AUDIENCE-REQUETES-2026-09-20.md`) chiffre plusieurs anciennes variantes nues,
notamment notes de frais et factures fournisseurs, mais retient des requêtes qualifiées
non chiffrées pour les cinq pages de tâche. Aucun transfert de volume de l'ancienne
variante vers la requête propriétaire ; `null` n'est ni zéro demande ni zéro lecteur.

## 5 bis. Ce que le relevé des suggestions a changé le 19/09

Relevé de `scripts/seo/questions.mjs` : 704 amorces, 704 mesurées, **72 avec au moins une
suggestion**, 59 pages de résultats, 0,2125 $, 0 panne (`mesures/questions-2026-09-19.json`). Les
priorités du backlog sont passées de 124 / 60 / 52 à **32 / 9 / 195**.

Quatre enseignements, qui commandent la réécriture des angles :

1. **Le langage du diagnostic est peu représenté dans cet échantillon d'autocomplétion.** Une amorce comme « cabinet comptable surcharge de travail » ne rendait que deux suggestions, dont la sienne, au relevé du 19/09. Cela ne mesure ni le volume Ads ni l'absence de lecteur ; tester la SERP, l'intention cabinet et Search Console avant de prioriser ou d'écarter un angle de diagnostic.
2. **Les têtes de requête portent une autre intention que la nôtre** : chercher un logiciel (le haut de page des familles de production), la situation d'un salarié (les requêtes de bulletin et de contrat), ou un modèle de document à télécharger (les recherches associées en « PDF », « Excel », « exemple », « modèle »).
3. **« Manuel de procédures cabinet expertise comptable » est une formulation à tester pour écrire le savoir-faire.** L'amorce rend deux suggestions, ses secondaires jusqu'à sept, et le haut de page est tenu par des vendeurs de trames, pas par des méthodes (`mesures/questions-2026-09-19.md`). C'est une entrée lexicale possible pour l'angle de marque, déjà visée par un article de priorité 1 au calendrier ; confirmer l'intention cabinet avant d'en déduire une audience.
4. **Certaines formulations de métier produisent des suggestions.** « crm dsn » en rend dix dans le relevé du 19/09, dont « crm dsn de substitution » et les codes 120, 119, 124, 121 et 34 (`mesures/questions-2026-09-19.json`, `autocompletion["crm dsn"]`). C'est un signal sur les formulations testées, non une mesure de volume Ads, de demande ou d'audience cabinet ; confronter la SERP, l'intention cabinet et Search Console avant d'en tirer une décision de page.

Ce que cela change dans la mécanique : `build-cluster-plan.py --check` contrôle aussi les P1 déjà publiées du backlog, pilier compris, sans réécrire leurs articles. Il exige une date et un signal primaire positif pour les P1 ordinaires ; le pilier doit correspondre aux trois suggestions et à la date du cache source `mesures/autocompletion-cache.json` (19/09), recopiées dans sa `demande`. Pour le seul angle IA publié « intelligence artificielle et métier comptable », le zéro de **sa requête primaire exacte** « métier comptable intelligence artificielle compétences » vient de `mesures/titres-intent-2026-09-21.json` (`measuredAt` le 21/09), et non des 704 amorces du 19/09. Ses deux secondaires ne figurent dans aucun de ces deux relevés : `secondaires: null` signifie non mesurées, pas zéro. Les quatre questions et l'aperçu IA proviennent de la SERP **par famille**, sur l'amorce différente « former l'équipe à l'IA cabinet comptable » (`formation-ia-competences`), relevée le 19/09 dans `mesures/questions-2026-09-19.json` ; ce ne sont pas des questions mesurées sur la requête primaire. `demande.mesureeLe` date le primaire (21/09), `demande.serpFamille.mesureeLe` date la SERP (19/09). L'exception P1 garde l'angle déjà publié pour cette lecture de famille malgré le zéro de suggestions sur le primaire ; elle ne démontre ni volume ni demande et ne dispense pas de vérifier l'intention cabinet. Le gate doit vérifier ces deux sources et leurs périmètres, et refuser un primaire fictivement positif. Les trois articles historiques synthétiques sans mesure et la série sont hors gate. C2 signale chaque semaine une requête primaire
testée sans suggestion relevée (`RUNBOOK-SEO.md` §3 bis). Une date de relevé seule n'implique pas
une suggestion ; une liste vide ne prouve pas l'absence de demande. Ce que cela ne change pas : la cadence, confirmée à
quatre par semaine le 19/09, et les articles publiés, qui ne bougent pas avant une lecture
Search Console utile.

## 6. La différenciation, article par article

Chaque article vise les marqueurs suivants. Depuis la décision Kevin du 29/09, un nombre de
marqueurs ou un score ne constitue pas à lui seul une porte universelle : on juge le besoin
résolu et les défauts critiques réels. Les deux sections finales restent vérifiées par la forge,
pas par le relecteur seul ; aucune preuve, donnée ou expérience ne se fabrique pour passer.

1. **Rejouable sans Memlia** : le lecteur peut exécuter la méthode avec ses outils. Sinon c'est une plaquette.
2. **La règle dans les mots du cabinet** : chaque tâche est décrite par sa règle (déclencheur, condition, action, exception), pas par un outil.
3. **Un jeu fictif qui montre le cas courant, le cas limite et le cas de refus.** « Ce que l'outil refuse de faire » est le bloc que personne d'autre n'écrit.
4. **Des sources primaires datées** (Service-Public, CNIL, impots.gouv, Net-entreprises, Insee, travail-emploi), citées mot pour mot, en lien dans le corps, ouvertes le jour même par le vérificateur. Aucun chiffre de gain.
5. **`## La règle écrite`** : la frontière en trois colonnes, la proposition, l'arrêt, le jeu d'essai, pour cette tâche précise et non en formules générales.
6. **`## Rejoué sur le jeu fictif`** : un tableau d'au moins trois lignes, cas joué, sortie obtenue, décision, avec des sorties réelles du rejeu.

La couverture ne compte pas comme preuve dans le corps : l'objectif de deux figures fonctionnelles issues de
cadres HTML figés sur un jeu fictif n'est pas un quota bloquant universel. Les figures utiles sont déclarées dans `inlineProofs`, ancrées avant des H2
existants et vérifiées par la forge (`RUNBOOK-QUOTIDIEN.md` §3). Leur provenance et date de
capture vivent dans la recette ; aucune interface cliente ni visuel IA n'est substitué à un rejeu.
Le refus général de moins de deux preuves reste codé dans `verify-blog-contract.mjs` au candidat
relu le 30/09 ; c'est une divergence à transmettre à la voie technique existante, pas à blanchir
dans cette réconciliation documentaire (`RUNBOOK-QUOTIDIEN.md` §3).
Les faits RGPD distinguent une obligation sourcée d'un conseil de la CNIL : classifier le second
en `information`, sans inventer de force normative. Le H1 de la recette est émis par le gabarit ;
si le corps source commence par un H1 identique, seule cette enveloppe est retirée ; un H1 divergent
est refusé (`scripts/lib/blog-body-envelope.mjs`). La revue porte sur ce rendu exact.

Formats privilégiés parce que la page de résultats les récompense et que les concurrents les écrivent
en prose : checklist numérotée et datée, tableau anomalie, cause, action ; tableau de la frontière
d'automatisation ; définition autonome de 40 à 60 mots en tête, extractible par les moteurs et les
assistants.

## 7. Le pilier et les satellites

- **Pilier** : `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, publié le 16/09, format `pillar-page`. Il porte la carte des 60 familles en 12 pôles, l'audit légal listé et non ouvert. Il reçoit un lien de chaque satellite et rend un lien vers chacun ; il est en tête de `/blog`, hors de la liste, et cette position est contrôlée côté Python et côté navigateur (`JOURNAL.md`, « Tranché » du 17/09).
- **Satellites** : un angle propre par URL, `how-to-guide` pour la méthode, `faq-knowledge` pour une définition, `listicle-checklist` pour une checklist, `thought-leadership` pour une Cicatrice ou un essai fondé. Le plan en compte **245** (242 entrées du backlog hors pilier et trois articles historiques), dont huit publiés, plus le pilier (`cluster-plan.json`, champ `meta`, 28/09). Une Cicatrice ne se fabrique jamais pour remplir le samedi.
- **Maillage** : satellite vers pilier et pilier vers satellite, obligatoires dans les deux sens ; 2 liens de famille ; 1 à 2 ancres de glossaire ; minimum trois liens entrants par article ; aucune orpheline. Contrôlé au `--check` avant chaque vague et chaque mercredi par C3.

### Rubriques, talents et arbitrage des formats (28/09)

`src/data/blog-rubriques.mjs` est le registre exécutable : deux hubs publiés, Paie et DSN
(`/blog/rubrique/paie-dsn-cabinet-comptable`) et Saisie et pièces
(`/blog/rubrique/gestion-pieces-comptables`). Ils ordonnent un geste commun, sans cannibaliser
les requêtes d'articles ; le pilier, la Cicatrice, la charge et l'article sur les compétences
restent explicitement hors rubrique. Pas de hub RH maigre à un seul article. Les pôles du backlog
ne deviennent pas mécaniquement des rubriques ou des pages commerciales.

| Idée | Décision | Destination et condition |
|---|---|---|
| Chaîne paie → DSN ; collecte → saisie | conservées | deux rubriques réelles, au moins deux articles visibles et des liens croisés |
| Pénurie, recrutement, compétences du cabinet | conservé comme territoire, non comme rubrique | pôle RH et formation du backlog, méthodes sourcées et frontières de décision humaine ; mesurer une intention de hub distincte avant de créer une rubrique |
| « logiciel de recrutement IA pour chaque pôle » | refusé | combinaison artificielle, ni service livré ni requête établie |
| Charge de travail, pénurie et adoption des outils | contexte relié, pas fusion automatique | la charge porte les états du flux, les compétences portent ce qui reste humain ; fusionner seulement si la SERP révèle la même intention |
| Calculateur, modèle, générateur de prompt | outil si autonome | `/outils-comptables-gratuits` ; besoin complet sans inscription, preuve du calcul, retour d'usage avant seconde vague (`OUTILS-BOUCLE.md`) |

Le rythme est un plafond, non un quota à remplir : quatre articles ordinaires par semaine ISO,
deux par jour au plus du lundi au jeudi ; une Cicatrice factuelle le samedi seulement si ses faits
existent (`RUNBOOK-QUOTIDIEN.md`). Avant chaque créneau non fixé, alterner autant que possible le
pôle et le format des derniers ordinaires pour éviter quatre déclinaisons de même geste ; ne jamais
déplacer un article déjà publié ni une date explicitement réservée. Une exception exige dans le
backlog une raison datée et vérifiable (urgence réglementaire sourcée, parcours d'une série dont
les étapes dépendent, ou fenêtre métier), distincte pour le pôle et pour le format. Elle ne dispense
ni de requête mesurée, ni de revue, ni du plafond. **État du candidat au 28/09** :
`build-cluster-plan.py` vérifie l'alternance pôle/format sur les ordinaires non figés,
préserve les dates publiées et les réservations futures `datePlanifiee`, et n'accepte qu'une exception datée et motivée
pour le champ effectivement en conflit (`exceptionAlternance.pole` ou `.format`). Le stock
peut différer un angle prioritaire sans changer sa mesure. Le contrôle `--check` et ses
tests positifs et négatifs s'appliquent au candidat ; seule son intégration autorisée
permettra de le dire effectif sur `origin/main`. Au 28/09, les créneaux du 22 et du 24/09
restent tracés dans `dateManquee` : leurs dates proposées portent `a-replanifier`, jamais
`planned` avant décision éditoriale. Le 26/09 (Cicatrice) reste à sa date historique au
statut `manque`, sans rattrapage inventé. Le préflight refuse les `planned` échus et
les réservations ordinaires expirées ; les quatre dérivés sont régénérés par le script.
On ne rattrape qu'après recette, source, revue et sceau valides, sur une nouvelle date autorisée
et dans les plafonds de la semaine effective. Aucun report ne force quatre sorties ni ne crée
une Cicatrice ; une date réservée échue reste dans l'historique, pas comme autorisation.

## 8. Mesure : des seuils de décision datés, pas des prévisions

Aucune cible de trafic n'est inventée, et aucune promesse de résultat n'est écrite. Point zéro, au
17/09/2026 : 4 clics et 17 impressions sur 28 jours, tous sur l'accueil ; zéro impression sur les six
articles ; 14 URL indexées sur 14 ; memlia.fr hors des 20 premiers sur ses requêtes de tête ; marque
réécrite en « mellia ».

| Échéance | Ce qu'on regarde | Seuil de décision |
|---|---|---|
| chaque lundi (C2) | impressions par page et par famille | la ligne s'écrit même à zéro : zéro est une mesure, et la série commence au jour un. Aucune réallocation de créneau avant la première lecture utile |
| chaque mercredi (C3) | liens entrants (objectif ≥ 3), ancres, sources, vitesse (objectif 95) | un défaut critique de source ou de route se traite en priorité ; un score, un nombre de liens ou une réserve cosmétique seuls rejoignent la maintenance du vendredi sans bloquer tous les autres articles |
| **mi-octobre 2026**, première lecture Search Console utile | requêtes avec impressions, par page, sur les articles publiés depuis au moins 28 jours | si aucun article n'a d'impression, le défaut est d'indexation ou de demande, pas de rédaction : on relit la requête visée et le titre avant de toucher au corps. C'est aussi la date à partir de laquelle les six articles peuvent être réécrits (`JOURNAL.md`, « Tranché » du 19/09) |
| **fin novembre 2026** (photographie du `cluster-plan.json` candidat du 28/09 : 8 satellites `published` + 1 pilier `published`, 41 satellites `planned` datés au plus tard le 30/11, soit 50 articles publiés/planifiés ; hors 2 `a-replanifier` et 1 `manque`, qui ne sont pas des publications autorisées) | familles ayant trois satellites effectivement publiés | une famille à zéro impression sur ses requêtes après trois satellites ne reçoit pas de quatrième créneau ; ils vont à une famille qui en a. Le cron propose, Kevin décide ; les créneaux planifiés ne prouvent pas des publications futures |
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
| Cadence de quatre par semaine sans baisse de qualité | la forge reste le chemin : sources, revue indépendante, 0 défaut critique et scellement sur les octets. Cadence, longueur, score et quota de visuels sont des objectifs, non des portes universelles ; consigner l'amélioration et faire requalifier les refus historiques par leur propriétaire technique sans contourner le code |
| Écrire pour notre vocabulaire plutôt que pour l'intention cabinet | relevé mensuel des suggestions sur les formulations testées, invariant « priorité 1 exige un signal primaire ou SERP historique daté », alerte hebdomadaire C2 ; absence de suggestion ≠ absence de demande ou volume nul. Décider après lecture de la SERP, de l'intention cabinet et de Search Console |
| L'aperçu IA capte la réponse | définition autonome en tête, tableaux extractibles, `llms.txt` à jour. L'effet n'est pas mesuré et ne doit pas être annoncé comme acquis |
| Cannibalisation entre angles voisins | une requête primaire par article, unique sur tout le site, contrôlée au `--check` ; C5 en décembre pour le corpus qui grossit |
| Le glossaire devient un catalogue de définitions génériques | chaque terme garde son contrat : exemple fictif, confusion courante, frontière d'automatisation, sources datées ; pas de terme sans article qui l'emploie |
