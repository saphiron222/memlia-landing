# Architecture des accès commerciaux

Décision du 20 septembre 2026 pour le chantier ACCÈS, carte C2 `t_2d42e66c`.
Ce document définit les routes, les intentions, le gabarit et le maillage. Il ne crée aucune page.

Sources de vérité lues avant décision :

- `.agents/product-marketing.md`, notamment §2 bis, §4, §7, §7 bis et §9 ;
- `tests/proof/test_positioning.py` ;
- registre de demande C1 du 20/09/2026 : 147 sondes d’autocomplétion, 89 SERP, 0 panne ;
- `docs/strategy/site-v3/mesures/semaine-2026-W38-demande.json` ;
- `docs/strategy/site-v3/mesures/registre-requetes.json` ;
- `docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md` et `IMPLEMENTATION-ROADMAP.md`.

## 1. Décision de nom et d’URL

**DECISION · `/automatisation/<tache>` ·** les requêtes qui justifient une page portent le mot
« automatisation » ou une forme automatique, la charte vend une automatisation livrée comme un
service, et le chemin reste court et lisible · **cela ferme** `/services/`, `/nos-automatisations/`,
`/automatiser/`, une taxonomie commerciale calquée sur les onze pôles du blog et tout nom de
véhicule technique.

Conséquences :

1. `/automatisation-cabinet-comptable` reste l’URL canonique du service général. Elle n’est ni
   déplacée ni dupliquée : cette route est déjà publique et sa formulation correspond à la seule
   requête de catégorie chiffrée, `automatisation cabinet comptable` (10 recherches mensuelles).
2. `/automatisation/` est un espace de chemin, pas une seconde page de catégorie. Si cette route
   nue est reçue, elle redirige en 308 vers `/automatisation-cabinet-comptable`.
3. Les pages de tâche vivent à un seul niveau sous cet espace. Le nom de la tâche complète le sens
   porté par le parent : `/automatisation/notes-de-frais`, pas
   `/services/automatisation-des-notes-de-frais-pour-cabinet-comptable`.
4. Aucune liste publique de « tout ce que nous faisons » n’est ajoutée au menu ou au hub. Les pages
   se découvrent depuis les contenus qui traitent réellement de la tâche. La couche commerciale ne
   devient pas un catalogue.
5. La navigation principale conserve « Automatisation » vers
   `/automatisation-cabinet-comptable`. Les pages de tâche ne forment pas un méga-menu.

### Pourquoi les autres candidats perdent

| Candidat | Demande mesurée | Charte | Lisibilité | Verdict |
|---|---|---|---|---|
| `/automatisation/` | reprend le mot des requêtes | conforme au service vendu | court, extensible | retenu comme espace de chemin, pas comme second hub |
| `/services/` | absent des requêtes retenues | vrai mais générique | ne nomme pas le résultat | refusé |
| `/nos-automatisations/` | absent des requêtes | possessif et proche d’un catalogue | plus long | refusé |
| `/automatiser/` | les requêtes de service sont surtout nominales | sonne comme un guide | confond action et offre | refusé |
| `/solutions/` | absent des requêtes | vocabulaire d’éditeur | trop vague | refusé |

## 2. Profondeur et arborescence exacte

**DECISION · un seul niveau sous `/automatisation/` ·** C1 mesure cinq tâches, mais aucune
sous-tâche qui justifierait une route fille · **cela ferme** les chemins du type
`/automatisation/paie/controle-des-bulletins` et tout croisement tâche × logiciel × rôle.

```text
Accueil (/)
├── Service général (/automatisation-cabinet-comptable) [existant, canonique]
├── Espace de chemin (/automatisation/) [308 vers le service général]
│   ├── Notes de frais (/automatisation/notes-de-frais)
│   ├── Saisie comptable (/automatisation/saisie-comptable)
│   ├── Factures fournisseurs (/automatisation/factures-fournisseurs)
│   ├── Rapprochement bancaire (/automatisation/rapprochement-bancaire)
│   └── Paie (/automatisation/paie)
├── Comparatifs (/comparatifs/<sujet>) [type distinct, aucun index de section sans requête]
└── Blog (/blog/<slug>) [méthodes et réponses informationnelles]
```

Il n’existe pas de route publique pour les synonymes `agence`, `prestataire`, `consultant`,
`intégrateur`, `sur mesure` ou « faire automatiser ». C1 n’y a mesuré ni suggestion ni volume.
Il n’existe pas non plus de page par pôle : les pôles organisent le blog ; ils ne prouvent pas une
intention de confier.

### Contrat route–requête

| Ordre C4 | Route | Requête primaire réservée | Mesure C1 | Famille éditoriale reliée | État |
|---:|---|---|---:|---|---|
| 0 | `/automatisation-cabinet-comptable` | `automatisation cabinet comptable` | 10/mois | `choisir-cadrer` | renforcer, ne pas recréer |
| 1 | `/automatisation/notes-de-frais` | `automatisation notes de frais` | 70/mois | `notes-de-frais` | nouvelle page |
| 2 | `/automatisation/saisie-comptable` | `saisie automatique comptabilité` | 10/mois | `saisie-ocr` | nouvelle page, cible distincte de l’article |
| 3 | `/automatisation/factures-fournisseurs` | `automatisation factures fournisseurs` | 30/mois | `achats-fournisseurs` | nouvelle page |
| 4 | `/automatisation/rapprochement-bancaire` | `rapprochement bancaire automatique` | 20/mois | `banque-rapprochement` | nouvelle page |
| 5 | `/automatisation/paie` | `automatisation paie` | 10/mois | `paie-social`, puis familles précises | nouvelle page |

L’ordre suit la recommandation finale de C1 : notes de frais, saisie, factures fournisseurs,
rapprochement bancaire, paie. Le volume seul ne départage pas les deux requêtes à 30 : la saisie
passe avant les factures fournisseurs parce qu’une méthode, un jeu fictif et une preuve existent
déjà dans le dépôt.

La route de saisie ne prend pas `automatisation saisie comptable`. Cette requête appartient déjà à
l’article `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier`. La variante mesurée
`saisie automatique comptabilité` évite de donner la même cible primaire à deux URL.

Le corps de la carte C2 disait que cet article était « l’un des deux seuls à recevoir des
impressions ». Le relevé plus frais du 20/09 contredit cette prémisse : 0 impression et 0 clic sur
7 et 28 jours pour cet article. La règle de séparation reste nécessaire, mais aucun trafic acquis
n’est revendiqué. Les articles publiés avant le 19/09 restent gelés jusqu’à la lecture utile de
mi-octobre prévue par la stratégie.

## 3. Pages de comparaison : une troisième famille

**DECISION · `/comparatifs/<sujet>` ·** une personne qui compare a déjà décidé d’automatiser mais
n’a pas encore choisi l’approche ; cette intention n’est ni « apprendre à faire » ni « confier
cette tâche » · **cela ferme** le rangement des comparatifs sous `/blog` ou sous
`/automatisation`, et trois URL `avis`, `alternative`, `tarif` pour une seule marque.

Une page de comparaison :

- porte l’intention `comparer-approches` ;
- utilise `WebPage` et `BreadcrumbList`, jamais `BlogPosting`, `Product`, `SoftwareApplication`,
  `Offer` ou `Review` pour Memlia ;
- vérifie le jour même chaque fait concurrent à sa source publique ;
- affiche une date « vérifié le » et une date de péremption ;
- dit où le concurrent est meilleur lorsque c’est vrai ;
- compare des périmètres et des architectures, jamais la qualité, le sérieux ou les clients ;
- commence par la différence de catégorie : collecte depuis des portails officiels pour Outils EC,
  règle du cabinet écrite et automatisée dans ses outils pour Memlia ;
- n’emploie une marque dans le titre d’onglet, le H1 et l’URL que si la requête mesurée la contient.

### Routes de comparaison ouvertes ou réservées

| Route | Requête | Mesure C1 | Décision |
|---|---|---:|---|
| `/comparatifs/logiciel-automatisation-comptable` | `logiciel automatisation comptable` | 50/mois | première page de comparaison admissible, hors C4 |
| `/comparatifs/logiciel-automatisation-saisie-comptable` | `logiciel automatisation saisie comptable` | 30/mois | différer jusqu’à la mesure de la page générique ; collision forte avec l’article et la page service de saisie |
| `/comparatifs/outils-ec` | meilleure des requêtes `outils ec avis`, `outils ec alternative`, `outils ec tarif` | non mesurée par C1 | chemin réservé, publication fermée jusqu’à un relevé frais |
| `/comparatifs/automatisation-cabinet-comptable` | `comparatif automatisation cabinet comptable` | non mesurée par C1 | ne pas créer |

Le premier comparatif ne transforme pas Memlia en éditeur. Il répond à une intention de choix et
compare notamment trois options : prendre un outil standard, faire écrire une règle sur mesure, ou
conserver le geste manuel. Il peut conclure que l’outil standard convient mieux lorsque le besoin
entre exactement dans son périmètre.

`/comparatifs/` ne reçoit pas de page d’index tant qu’une requête de section n’est pas mesurée. Un
segment d’URL n’oblige pas à fabriquer une page mère sans demande.

Les comparatifs n’entrent pas dans la carte C4, réservée aux pages de service. Leur production doit
être portée par une carte séparée après mise en place de leur recette, de leur péremption et de leur
contrôle de sources.

## 4. Gabarit d’une page de service

Une page de service s’adresse à quelqu’un qui cherche à confier une tâche. Elle ne réexplique pas
la méthode complète d’un article et ne promet pas une fonction préconstruite.

### Métadonnées et intention

1. **Requête primaire unique.** Elle est présente dès la recette et réservée à une seule URL
   indexable dans le registre commun blog–service–comparatif.
2. **H1 intent-first.** La requête mesurée ouvre le H1 ; un angle de marque peut suivre après les
   deux-points. `og:title` et le `headline` JSON-LD reprennent le H1 à l’identique. Le titre
   d’onglet peut raccourcir, mais vise la même requête.
3. **Description.** Elle nomme la tâche, la frontière humaine et la prise en charge ; aucun gain
   chiffré, aucune compatibilité universelle.
4. **Schéma.** `WebPage`, `Service`, `BreadcrumbList`, `Organization` et `WebSite`. Aucun prix,
   avis, note, fonction de logiciel ou offre fictive dans les données structurées.
5. **Auteur et preuve.** Pas de byline artificielle. La date de vérification du jeu fictif et des
   sources apparaît lorsque la page comporte une matière mouvante.

### Sections obligatoires, dans cet ordre

1. **Héros.** H1 intent-first, réponse commerciale en 40 à 80 mots, appel unique
   « Confier une première tâche » vers `/contact`.
2. **La tâche dans les mots du cabinet.** Déclencheur, entrées réelles, résultat attendu, moment où
   le geste revient. Une seule tâche, jamais une liste de capacités.
3. **La règle écrite.** Titre exact `## La règle écrite`, puis les quatre éléments de la charte :
   **La frontière**, **La proposition**, **L’arrêt**, **Le jeu d’essai**. La frontière se lit dans
   un tableau `Se prépare seul | Attend une validation | Reste humain`.
4. **Rejoué sur le jeu fictif.** Titre exact `## Rejoué sur le jeu fictif`, puis au moins trois cas
   réellement joués : courant, limite, refus. Tableau `Cas joué | Sortie obtenue | Décision`, date
   et chemin de la preuve locale. Une page sans sortie réelle du rejeu ne se publie pas.
5. **Ce que nous prenons en charge.** Observation, écriture, construction dans les outils existants,
   recette et maintenance, appliquées à cette tâche précise. Cette section ne prend jamais la
   forme d’une grille de fonctions.
6. **Ce que le cabinet garde.** Validation et jugement, dits une fois. Les conditions d’arrêt sont
   concrètes ; aucune formule défensive répétée.
7. **Dans vos outils.** Types d’entrées et de sorties possibles, puis vérification des formats et
   accès avant engagement. Aucun outil n’est promis compatible avant essai.
8. **La preuve.** Lien vers le jeu fictif rendu, vers la méthode publiée correspondante et vers les
   sources officielles lorsque la page touche à la paie, au social, au fiscal ou au juridique.
9. **Le prix.** Absence de tarif public assumée : « Vous payez une tâche prise en charge, pas des
   sièges. » Le devis dépend des sources, règles, exceptions, validations et accès. Aucun pack,
   « à partir de », remise ou faux ordre de grandeur.
10. **Questions de décision.** Trois à cinq questions propres à l’achat : périmètre, validation,
    accès, recette, maintenance. Elles ne recopient pas les questions informationnelles de
    l’article.
11. **Appel final.** Même appel unique : « Confier une première tâche » vers `/contact`. Le texte
    dit qu’une description suffit et qu’aucun fichier n’est demandé à ce stade.

Les deux sections de la forge s’appliquent donc aux pages de service. La règle écrite est le
mécanisme vendu ; le rejeu fictif est sa preuve. Elles ne sont pas supprimées sous prétexte que la
page n’est pas un article.

### Ce qui distingue la page de l’article

| Page de service | Article |
|---|---|
| répond « pouvez-vous prendre cette tâche en charge ? » | répond « comment cette tâche fonctionne-t-elle ? » |
| preuve courte, orientée décision | méthode exécutable et explication approfondie |
| prix par complexité, périmètre, recette, maintenance | pas de discussion commerciale développée |
| appel « Confier une première tâche » | appel « Confier cette tâche » |
| schéma `Service` + `WebPage` | schéma `BlogPosting` + `WebPage` |
| requête commerciale réservée | requête informationnelle ou d’exécution réservée |

Les pages de service ne comptent pas dans le plafond de quatre articles ordinaires par semaine :
ce ne sont ni des entrées du backlog blog ni des candidats d’`editorial/queue.json`. Elles doivent
avoir un type de recette distinct et leurs propres portes. Le vérificateur doit l’exprimer dans le
code avant C4 ; contourner `verifierPlafonds()` ou faire passer une page commerciale pour un
article est interdit.

## 5. Contrat de lien chiffré

### Plancher d’entrée

Chaque page de service exige **trois liens internes entrants contextuels depuis trois URL
indexables distinctes avant publication**. Les liens du header, du footer, du fil d’Ariane, du
sitemap et d’un composant global ne comptent pas.

Les trois sources minimales sont :

1. le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, depuis la famille
   correspondante ;
2. l’article de méthode le plus proche de la tâche, depuis sa clôture commerciale ;
3. un second satellite de la même famille ou d’une famille adjacente qui nomme réellement la
   tâche. S’il n’existe pas, la page reste prête mais non publiée : on ne fabrique pas un lien hors
   sujet pour atteindre le nombre.

Après publication, **chaque satellite futur de la famille** remplace son lien commercial générique
vers `/automatisation-cabinet-comptable` par un lien vers la page de tâche. Une page atteint ainsi
**cinq liens entrants contextuels au plus tard après la publication de deux nouveaux satellites**.
Il n’y a pas de quota de liens artificiels à poser ailleurs.

### Ancres

- Depuis un article : `confier la saisie comptable`, `prise en charge des notes de frais`,
  `automatisation du rapprochement bancaire` ; une ancre qui dit l’action commerciale, pas le titre
  exact de l’article.
- Depuis le pilier : `voir comment nous prenons en charge cette tâche` associé au libellé de la
  famille, sans répéter la requête exacte dans toutes les ancres.
- Depuis la page de service vers l’article : `voir la méthode et les contrôles`, `lire le rejeu
  détaillé`, jamais la même ancre que le lien entrant.
- Les ancres exactes de requête primaire pointent uniquement vers l’URL qui possède cette requête.

### Liens sortants d’une page de service

Une page de service porte au minimum :

- un lien vers `/methode` ;
- un lien vers l’article de méthode principal de la tâche ;
- un lien vers `/garanties` près des conditions d’arrêt ;
- un ou deux liens de glossaire utiles ;
- l’appel vers `/contact`.

Elle ne liste pas les autres tâches. Un lien vers une page sœur n’est posé que si le parcours réel
les enchaîne et si le paragraphe explique ce lien.

### Liens des comparatifs

Une page de comparaison lie la page de service correspondante une seule fois, sous une ancre
orientée choix : `voir l’approche par règle écrite` ou `confier une règle sur mesure`. La page de
service peut répondre par `comparer les approches`, dans une section de décision, sans reprendre
`avis`, `alternative` ou `tarif` comme cible. Cette asymétrie confirme deux intentions distinctes.

## 6. Contrat anti-cannibalisation

### Registre commun

Avant toute recette, une ligne unique réserve :

- l’URL ;
- le type `blog`, `service` ou `comparatif` ;
- la requête primaire ;
- les requêtes secondaires ;
- l’intention ;
- la famille ;
- les URL comparées ;
- la date du relevé et son instrument.

Invariant : **une requête primaire, une URL indexable**. Le build refuse un doublon entre les trois
types de pages, pas seulement dans le backlog blog.

### Règle de séparation

| Type | Question du lecteur | Signaux de titre | Contenu propriétaire |
|---|---|---|---|
| Blog | comment faire, comprendre ou contrôler ? | comment, contrôle, méthode, checklist | méthode complète, sources, cas et explications |
| Service | qui peut prendre la tâche en charge ? | automatisation de la tâche, prise en charge | périmètre livré, frontière, preuve, prix par complexité, appel |
| Comparatif | quelle approche choisir ? | comparatif, avis, alternative, tarif, logiciel | critères de choix, faits datés, avantages et limites des options |

Quand deux URL ont le même sujet mais des intentions différentes :

1. elles ne partagent ni requête primaire, ni H1, ni titre d’onglet ;
2. elles se lient réciproquement avec des ancres d’intention différentes ;
3. l’introduction répond immédiatement à la question propre à la page ;
4. la page service ne recopie pas le mode opératoire ; l’article ne développe pas le devis ;
5. le comparatif ne devient ni une fiche de vente ni un « top » où Memlia gagne partout.

### Collision saisie déjà connue

- Article conservé : `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier`, requête
  `automatisation saisie comptable`, intention d’exécution.
- Page de service : `/automatisation/saisie-comptable`, requête `saisie automatique comptabilité`,
  intention de délégation.
- Comparatif éventuel : `/comparatifs/logiciel-automatisation-saisie-comptable`, requête
  `logiciel automatisation saisie comptable`, intention de choix. Il reste différé.

La page service résume les six contrôles en une frontière et renvoie vers l’article pour le détail.
L’article remplace, à terme et par republication scellée, son lien commercial générique par la page
de service. Aucun canonical croisé : les contenus répondent à des intentions différentes.

### Mesure après publication

Pour chaque page nouvelle :

1. figer avant publication le relevé GSC des URL voisines et le top 10 de la requête ;
2. relever à J+7, J+28 puis chaque mois impressions, clics et URL servie par requête ;
3. déclarer une collision lorsque deux URL reçoivent des impressions sur la même requête dans la
   même fenêtre de 28 jours, ou lorsque la SERP alterne les deux URL pour la requête primaire ;
4. garder comme propriétaire l’URL dont l’intention correspond à la SERP et dont la preuve est la
   plus forte ; retitrer l’autre sur une requête mesurée distincte, ou fusionner avec redirection
   301 si les intentions sont en réalité identiques ;
5. ne jamais employer `noindex` ou un canonical comme pansement par défaut.

Si Search Console masque la requête pour faible volume, le relevé de SERP DataForSEO tranche. Une
absence de donnée reste une absence de donnée ; elle n’autorise ni victoire ni cannibalisation
inventée.

## 7. Collisions attendues et règle de décision

| Collision | Niveau | Règle |
|---|---|---|
| service général ↔ pilier « carte des tâches » sur `automatisation cabinet comptable` | existante, élevée | ne pas réécrire le pilier avant mi-octobre ; ensuite réserver la requête commerciale au service si la SERP confirme l’intention, et mesurer une requête informationnelle distincte pour le pilier |
| service saisie ↔ article saisie | élevée | trois requêtes primaires distinctes ; résumé commercial contre méthode complète ; liens croisés ; comparatif différé |
| service factures fournisseurs ↔ article saisie/OCR | moyenne | la page service traite le flux fournisseur entier ; l’article reste centré extraction et contrôles de saisie |
| service paie ↔ contrôle des bulletins et CRM DSN | moyenne | `automatisation paie` reste la tâche large ; chaque article garde un geste précis et aucune page fille paie n’est créée sans demande |
| service rapprochement ↔ futurs articles banque | moyenne | page de délégation large ; un article par question d’exécution ; aucune route `/rapprochement/<sous-tache>` |
| service notes de frais ↔ requêtes de logiciel grand public | élevée côté SERP | ouvrir par « pour un cabinet » dans la seconde proposition, garder la requête exacte en tête, prouver la règle du cabinet plutôt que promettre une application |
| comparatif logiciel comptable ↔ service général | moyenne | le comparatif évalue les approches ; le service vend la prise en charge ; ancres et schémas distincts |
| comparatif saisie ↔ article + service saisie | critique | ne pas publier avant que la page générique de comparaison ait produit une mesure et que le registre confirme trois requêtes distinctes |
| Outils EC ↔ comparatif générique | faible tant que non publié | une seule URL de marque consolidant avis, alternative et tarif ; page créée seulement après requête mesurée et contrôle de fraîcheur |

## 8. Contrat propre aux comparatifs

Le gabarit d’un comparatif contient :

1. la requête de comparaison en H1, `og:title` et `headline` ;
2. « Pour qui chaque approche convient » en réponse directe ;
3. le périmètre comparé et la date de vérification ;
4. un tableau de faits sourcés, où chaque ligne peut être gagnée par une option différente ;
5. « Ce que l’autre approche fait mieux » ;
6. « Ce que la règle écrite change » ;
7. prix publics exacts avec date et source, ou `non publié` — jamais une estimation ;
8. limites, données nécessaires, validation humaine et maintenance ;
9. sources primaires ouvertes le jour même ;
10. appel unique vers `/contact`, sans dénigrer l’autre option.

Péremption : 30 jours pour le prix et le périmètre fonctionnel, 90 jours pour les faits
institutionnels stables. Une source devenue inaccessible ou un fait périmé retire la page de la
publication tant qu’il n’est pas revérifié. Le contrôle est fail-closed.

## 9. Portes à coder avant C4

La forge actuelle est une forge d’articles : `RUNBOOK-QUOTIDIEN.md` §8 dit explicitement qu’elle
ne crée pas de page commerciale, et `verifierPlafonds()` ne connaît que les flux blog. C4 ne doit
pas contourner cette limite.

Avant la première page, le dépôt doit recevoir :

1. un type de recette `service` distinct du blog, hors `editorial/queue.json` ;
2. un validateur des quatre surfaces de titre, des deux sections de preuve, du CTA unique, du
   schéma et du vocabulaire ;
3. un registre de requêtes commun aux articles, services et comparatifs ;
4. un contrôle des trois liens entrants contextuels ;
5. un scellement et une preuve de publication propres aux pages commerciales ;
6. plus tard, un type `comparatif` avec sources datées et péremption fail-closed.

Pour C4, le cycle exact d’une page de service est distinct de celui du blog :

```bash
npm run service:preparer -- <slug>  # rend le candidat noindex après validation de la recette
# déposer ensuite la revue indépendante PASS dans commercial/recettes/<slug>/revues.json
npm run service:sceller -- <slug>   # réserve la requête et scelle le candidat de prévisualisation
npm run service:publier -- <slug>   # écrit la preuve de publication et son nouveau sceau
npm run service:audit               # relit toutes les recettes, mesures fraîches, liens et empreintes
```

Une commande refusée ne matérialise ni page ni manifeste. `preparer` précède la revue ; `sceller`
et `publier` exigent la revue indépendante. Le build joue `service:audit` en plus de `blog:audit`.

La cadence de quatre articles par semaine reste inchangée. Les pages de service en sortent par
type explicite, pas par exception manuelle.

## 10. Liste ordonnée remise à C4

1. Renforcer sans déplacer `/automatisation-cabinet-comptable` et enregistrer son conflit de
   requête avec le pilier ; ne pas toucher au pilier avant la lecture de mi-octobre.
2. Produire `/automatisation/notes-de-frais` sur `automatisation notes de frais` (70/mois).
3. Produire `/automatisation/saisie-comptable` sur `saisie automatique comptabilité` (10/mois),
   avec lien croisé vers l’article existant.
4. Produire `/automatisation/factures-fournisseurs` sur `automatisation factures fournisseurs`
   (30/mois).
5. Produire `/automatisation/rapprochement-bancaire` sur `rapprochement bancaire automatique`
   (20/mois).
6. Produire `/automatisation/paie` sur `automatisation paie` (10/mois).
7. Ne produire aucune page supplémentaire sans nouvelle requête mesurée. Les pages de comparaison
   suivent une carte et une forge distinctes ; la première admissible est
   `/comparatifs/logiciel-automatisation-comptable`, pas une page de marque non mesurée.

Chaque page reste non publiée tant qu’elle n’a pas : sa requête réservée, son jeu fictif réellement
rejoué, trois liens entrants contextuels, sa revue indépendante, son sceau et sa preuve sur
l’artefact servi.
