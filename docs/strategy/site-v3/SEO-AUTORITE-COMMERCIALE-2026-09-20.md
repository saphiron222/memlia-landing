# SEO, contenu et autorité commerciale — décision du 20 septembre 2026

Statut : exécutable
Périmètre : accueil, `/automatisation-cabinet-comptable`, cinq routes filles, blog, graphe d’entités, indexation, autorité externe
Sources versionnées : `mesures/audience-requetes-2026-09-20.json`, `mesures/semaine-2026-W38-demande.json`, `mesures/echantillon-ia.json`, `registre-requetes.json`, `backlog-v3.json`

## Verdict

Memlia n’a pas un problème de socle technique visible dans le build. Le site a des canonicals exacts, un sitemap filtré, un graphe `Organization` cohérent et sept articles publiés. Le déficit est un déficit d’autorité et de profondeur : aucune citation IA observée sur dix réponses, zéro impression Search Console pour les pages hors accueil au relevé disponible, deux petits ensembles éditoriaux seulement, et trois intentions commerciales spécialisées sans satellite éditorial.

La stratégie retenue est une architecture en trois niveaux :

1. l’accueil porte la marque, le mécanisme « règle écrite » et l’appel unique ;
2. `/automatisation-cabinet-comptable` porte la requête commerciale générique et distribue l’autorité ;
3. cinq routes filles portent cinq intentions spécialisées, sans créer de page pour une simple variante lexicale.

Le blog répond aux questions informationnelles puis mène vers la page commerciale pertinente après avoir rendu sa valeur. Il ne remplace pas la page de service.

## 1. Mesures de départ

### 1.1 Demande, visibilité et fraîcheur

- Relevé Search Console versionné, fenêtre de 28 jours close trois jours avant le 20/09 : `4 clics`, `17 impressions`, tous sur l’accueil ; les articles sont à zéro impression.
- Échantillon IA du 19/09 : `10` requêtes testées, `7` réponses IA, `0` citation Memlia, `1` présence organique Memlia. La présence organique observée est le hub `/blog`, pas une page commerciale.
- Une interrogation DataForSEO fraîche des six requêtes a été autorisée par `porteDeCout` pour un coût prévu de `0,012 $`. Sa réponse détaillée n’a pas été versée aux mesures versionnées ; elle n’est donc pas utilisée dans ce verdict. Le tableau d’intention ci-dessous lit exclusivement le relevé SERP versionné du 20/09.

### 1.2 Core Web Vitals et Lighthouse

Le relevé instrumenté du 17/09/2026 consigné dans `CRONS-SEO.md` donne, en laboratoire mobile, Performance 96 pour l’accueil, 99 pour le pilier et 99 pour l’article saisie : le plancher interne de 95 était tenu sur les trois gabarits. Il indique aussi **aucune donnée CrUX de terrain**, faute de trafic Chrome suffisant.

La tentative de relecture PageSpeed du 20/09 a répondu `429`. Les scores du 17/09 restent donc une référence laboratoire datée, pas des Core Web Vitals de terrain. Aucun problème prioritaire n’est démontré sur ces trois gabarits : aucune optimisation n’est lancée à l’aveugle. Prochaine mesure : CrUX dès qu’un échantillon existe ; entre-temps, PSI/Lighthouse mobile sur accueil, pilier et article, avec conservation du JSON brut.

### 1.3 Indexabilité déclarée et vérifiée dans le build

Le build et les manifestes de la forge donnent l’état suivant. Ce tableau n’est pas présenté comme une inspection fraîche de la production : le relevé HTTP tenté pendant l’audit n’a pas laissé de sortie exploitable.

| URL | statut source | robots du build | sitemap du build | verdict |
|---|---|---|---|---|
| `/` | publié | `index, follow` | présente | indexable |
| `/automatisation-cabinet-comptable` | publié | `index, follow` | présente | indexable |
| `/automatisation/rapprochement-bancaire` | publié | `index, follow` | présente | indexable |
| `/automatisation/factures-fournisseurs` | `pret-preview` | `noindex, follow` | absente | candidat, non indexable |
| `/automatisation/notes-de-frais` | `pret-preview` | `noindex, follow` | absente | candidat, non indexable |
| `/automatisation/saisie-comptable` | `pret-preview` | `noindex, follow` | absente | candidat, non indexable |
| `/automatisation/paie` | `pret-preview` | `noindex, follow` | absente | candidat, non indexable |

Ce comportement est volontaire : le statut `pret-preview` produit une route testable mais exclue du sitemap. La forge seule passe une route à `publie` après recette, trois liens entrants contextuels distincts, scellement et observation de l’artefact servi.

## 2. Diagnostic audience et intention

### 2.1 Rôles à servir

Le recoupement du backlog et des six pages donne quatre groupes utiles, pas des personas inventés :

| rôle | problème recherché | page d’entrée prioritaire |
|---|---|---|
| direction / associés | choisir une première tâche et borner le risque | accueil, pilier, article carte |
| responsables de production comptable | rendre les flux répétitifs contrôlables sans changer d’outil | pilier, saisie, factures, rapprochement |
| responsables de pôle social | préparer les contrôles et exceptions sans céder les décisions | paie, rubrique Paie et DSN |
| collaborateurs / gestionnaires | comprendre une règle, un refus et la preuve à vérifier | articles spécialisés, glossaire, puis route fille |

La page ne doit pas promettre une fonction à chacun. Elle doit faire reconnaître la situation, montrer la frontière entre proposition et décision, puis permettre de confier une première tâche.

### 2.2 Ce que répond la SERP, requête par requête

Verdict fondé sur les détenteurs organiques enregistrés le 20/09. « Aligné » juge le type de page, pas la qualité de la copie.

| requête assignée | détenteurs observés | type dominant | URL Memlia unique | adéquation |
|---|---|---|---|---|
| `automatisation cabinet comptable` | Eliott & Markus, Yooz, Agiris, Queoval, BonjourIA, Zuora, Everial, Factory456, Pennylane | guides et articles dominants, une minorité de pages service | `/automatisation-cabinet-comptable` | **fragile** : une page service pure serait en décalage ; garder un corps pédagogique et relier l’article carte |
| `factures fournisseurs des dossiers clients` | Regate, Lexware, Pennylane, Hubdoc, Visma | pages produit/service et guides de flux | `/automatisation/factures-fournisseurs` | **aligné** avec une page service spécialisée |
| `notes de frais des clients en cabinet` | Dext, ClearTax, Sage Advice, Je Pilote | produit/service et guides pratiques ; SERP fragmenté | `/automatisation/notes-de-frais` | **acceptable**, à soutenir par des cas cabinet et non un comparatif logiciel |
| `rapprochement bancaire en cabinet` | Sage, Agicap, Memsoft, Bench, Indy | pages produit/service et guides | `/automatisation/rapprochement-bancaire` | **aligné** |
| `saisie comptable en cabinet` | Implid, ISCA, Pennylane, Sage | pages de cabinet, produit et service | `/automatisation/saisie-comptable` | **aligné** |
| `automatisation paie pôle social` | Academy Compta, Afigec, MyFiteco, Factorial | guides, formation, conseil et logiciel ; SERP fragmenté | `/automatisation/paie` | **acceptable**, avec preuve de méthode et vocabulaire pôle social |

Décision d’architecture : la requête générique appartient à la page commerciale ; l’article carte répond à l’intention informationnelle « quelles tâches automatiser dans un cabinet comptable ». Lors de sa prochaine révision par la forge, son `primaryQuery` doit être réassigné à cette question afin que le registre ne conserve pas deux URLs sur la même requête exacte.

## 3. Architecture SEO et commerciale

### 3.1 Hiérarchie

- `/` — entité Memlia, mécanisme « règle écrite », preuve de fonctionnement, CTA unique.
- `/automatisation-cabinet-comptable` — page pilier commerciale ; requête générique ; explique le service et distribue vers les routes spécialisées sans faire une grille-catalogue.
- `/automatisation/factures-fournisseurs`
- `/automatisation/notes-de-frais`
- `/automatisation/rapprochement-bancaire`
- `/automatisation/saisie-comptable`
- `/automatisation/paie`
- `/blog/rubrique/gestion-pieces-comptables` et `/blog/rubrique/paie-dsn-cabinet-comptable` — hubs éditoriaux.
- articles — une question ou un geste, une preuve, une frontière, puis un lien commercial contextuel.

Interdits : page par ville, page par synonyme, page par logiciel, page « IA + métier » sans preuve, liste publique de toutes les tâches prises en charge.

### 3.2 Rôle de l’accueil

L’accueil ne doit pas se battre avec le pilier sur la requête générique. Il porte la marque et le mécanisme :

1. reconnaître le savoir-faire non écrit ;
2. expliquer « la règle écrite » ;
3. montrer une preuve fonctionnelle ;
4. établir proposition puis validation, arrêt dans le doute et jeu fictif ;
5. mener vers `Confier une première tâche`.

Le pilier a été corrigé pour ouvrir son H1 par l’intention « Automatisation pour cabinet comptable » et son chapeau ne publie plus une mini-liste de tâches.

### 3.3 Maillage interne observé et corrigé

Avant correction, `3/7` articles comportaient un lien vers le pilier et `0/7` un lien direct vers une route fille. Après correction :

- `7/7` articles publiés mènent à une page commerciale après leur contenu utile ;
- l’article sur la saisie mène à `/automatisation/saisie-comptable` ;
- les trois articles social/DSN mènent à `/automatisation/paie` ;
- les articles transversaux et collecte mènent au pilier ;
- le pilier relie les cinq routes filles dans des paragraphes contextuels ;
- les routes filles remontent au pilier par le fil d’Ariane et restent dans le footer généré.

Les ancres décrivent la décision du lecteur. Elles ne répètent pas mécaniquement le mot-clé exact.

### 3.4 Questions de cabinet rendues extractibles

Quatre réponses déjà présentes dans le pilier commercial sont désormais exposées comme H2 explicites, sans ajouter de promesse ni de réponse inventée :

| Question de cabinet | H2 publié dans le pilier | Réponse et destination |
|---|---|---|
| Que garde le cabinet ? | `Que garde le cabinet quand une tâche est automatisée ?` | décision humaine, arrêt dans le doute, puis `/automatisation/rapprochement-bancaire` |
| La tâche est-elle automatisable ? | `Comment savoir si une tâche est prête à être automatisée ?` | formats, accès, cas limites et environnement |
| Qu’est-ce qui est livré ? | `Que livre Memlia pour une tâche automatisée ?` | périmètre, recette et maintenance |
| Faut-il changer d’outil ? | `Faut-il changer d’outil pour automatiser une tâche ?` | réponse dans les outils existants, puis route factures fournisseurs |

Le rapprochement bancaire est lié directement dans la réponse sur la décision humaine : les appariements se proposent, les écarts restent à décider. Les articles publiés restent scellés par la forge ; leur Markdown n’a pas été contourné pour obtenir ces H2.

### 3.5 Gain d’information, page par page

Le gain d’information n’est pas un volume de texte. C’est la réponse propre à la page, qui ne doit pas être répétée ailleurs.

| Page | Gain d’information propre | Frontière anti-duplication |
|---|---|---|
| `/` | thèse « savoir-faire non écrit » et mécanisme de la règle écrite | pas d’inventaire détaillé des familles |
| `/automatisation-cabinet-comptable` | prise en charge commerciale complète et orientation vers cinq familles | pas de carte exhaustive des tâches |
| `/automatisation/factures-fournisseurs` | réception, lecture, contrôle, doublons, avoirs et pièces illisibles isolés | pas de mécanique notes de frais ou banque |
| `/automatisation/notes-de-frais` | justificatif, doublon, pièce absente et cas hors règle | pas de règles générales de saisie |
| `/automatisation/rapprochement-bancaire` | règle d’appariement et traitement visible des écarts | pas de panorama générique |
| `/automatisation/saisie-comptable` | extraction, imputation habituelle, proposition traçable et file d’examen | pas de copie de l’article pédagogique |
| `/automatisation/paie` | frontière entre préparation, contrôle et décisions qui engagent la paie | pas de conseil générique sur l’outillage |
| article carte des tâches | taxonomie transversale et critères de maturité d’une tâche | pas de description commerciale complète |
| article saisie | chaîne pièce → champs → contrôles → exceptions | pas de description complète du service |
| article relance des pièces | règle de relance, états attendus et arrêt à réception | pas de traitement aval de la saisie |
| article bulletins avant DSN | contrôles déterministes avant dépôt | pas d’interprétation des retours après dépôt |
| article comptes rendus métier DSN | lecture des retours et frontière de qualification | pas de contrôle amont du bulletin |
| article suivi de production sociale | état des dossiers et pilotage agrégé | pas de décision paie nominative |
| article nouveaux outils | obstacle d’adoption et automatisation en place | pas de catalogue de prestations |

## 4. Autorité thématique et lacunes

### 4.1 État réel

Le registre contient `7` articles publiés et `5` pages service. Le backlog contient `243` sujets. Deux rubriques éditoriales sont matérialisées :

- Paie et DSN : `3` articles — le meilleur début de cluster ;
- Gestion des pièces comptables : `2` articles — cluster émergent ;
- transversal choisir/cadrer : `2` articles hors rubrique ;
- factures fournisseurs, notes de frais et rapprochement bancaire : une page service, aucun satellite publié.

Verdict : **aucun cluster n’est encore assez profond pour revendiquer une autorité thématique**. Paie et DSN est le seul ensemble cohérent ; saisie et pièces commence à relier le flux ; les trois autres routes spécialisées sont des têtes de pont sans profondeur.

### 4.2 Lacunes prioritaires

1. **Rapprochement bancaire** — cas d’écart, paiements groupés, frais et preuve de clôture ; route déjà indexable mais sans satellite publié.
2. **Factures fournisseurs** — cycle de réception, doublon, avoir, état et validation ; forte proximité avec la saisie mais intention distincte.
3. **Notes de frais** — justificatif, doublon, dépense hors règle, frontière cabinet/client ; SERP fragmenté à spécialiser pour le cabinet.
4. **Saisie et pièces** — compléter entre collecte, lecture, contrôle, exception et écriture proposée.
5. **Paie et DSN** — approfondir sans publier de règle réglementaire non sourcée : variables, absences, contrôle suivant, clôture.
6. **Décision d’achat** — coût de la complexité, intégration à l’existant, recette, maintenance, ce qui fait refuser une tâche.

## 5. Stratégie éditoriale 12 / 30 / 90 articles

Les seuils sont cumulatifs. Le corpus part de `7` articles. Au plafond de quatre publications par semaine, atteindre 90 demande 83 articles supplémentaires, soit au minimum 21 semaines ISO continues ; le plan réaliste arrondit chaque phase et vise les semaines 2, 7 et 22.

### Seuil 12 — rendre les routes filles défendables

Ajouter 5 articles :

- 2 pour rapprochement bancaire : règle d’appariement ; traiter un écart inexpliqué ;
- 1 pour factures fournisseurs : doublon, avoir et pièce illisible dans le même circuit ;
- 1 pour notes de frais : justificatif manquant et cas hors règle ;
- 1 pour la décision : choisir une première tâche sans changer d’outil.

Répartition rôle : 2 responsables de production, 1 collaborateur, 1 direction, 1 responsable social/comptable selon la demande mesurée.

Critère de passage : chaque route fille publiée a au moins trois liens entrants contextuels depuis trois URLs indexables, un article propre à son intention et un lien retour vers le pilier.

### Seuil 30 — former quatre clusters reconnaissables

Ajouter 18 articles après le seuil 12 :

- 5 Saisie et pièces ;
- 4 Paie et DSN ;
- 3 Banque et rapprochement ;
- 3 Achats/factures ;
- 3 Choisir, cadrer, intégrer et recetter.

Règle de portefeuille : aucun quatrième article dans une famille dont les trois premiers restent à zéro impression après une fenêtre Search Console utile ; le créneau passe à une famille qui obtient des impressions ou couvre une route commerciale orpheline.

### Seuil 90 — couvrir le cabinet sans devenir un catalogue

Ajouter 60 articles après le seuil 30, par grappes de trois :

1. une réponse d’exécution ;
2. une réponse de diagnostic ou de contrôle ;
3. une réponse de limite, refus ou décision.

Prioriser les familles de backlog marquées `priorite: 3`, puis les rôles non encore couverts. Garder les sujets réglementaires derrière une source primaire française datée et la règle de fact-check. Une famille n’obtient un quatrième satellite que si les trois premiers ont produit au moins un signal observable : impression, clic, lien entrant, citation IA ou passage qualifié vers la page commerciale.

## 6. E-E-A-T et graphe d’entités

### 6.1 État conservé et limites

Le graphe partagé expose déjà :

- une `Organization` canonique avec `legalName`, SIREN, SIRET, adresse et liens vers des registres publics ;
- une `Person` canonique `https://memlia.fr/a-propos#kevin-kitanga`, reliée à l’organisation par `worksFor` ;
- le même identifiant de personne dans les pages commerciales, services et articles ;
- un auteur visible, une date de publication et une date de modification sur les surfaces éditoriales et commerciales qui l’exigent.

L’audit a volontairement écarté `foundingDate`, `founder`, des profils sociaux et `knowsAbout` : aucune preuve primaire versionnée dans le dépôt ne permettait de les publier sans ambiguïté. Le graphe n’est pas enrichi par déduction. `node --test tests/scripts/page-eeat.test.mjs` vérifie l’attribution et les relations déjà prouvées.

### 6.2 Preuve de première main

La preuve E-E-A-T doit rester proche de l’affirmation :

- jeu fictif et sortie observée dans l’article ;
- source primaire datée pour la règle réglementaire ;
- expérience datée seulement quand elle existe ;
- auteur visible, date de publication et de modification ;
- aucune attestation métier inventée.

## 7. Lisibilité par les moteurs IA

Ce qui est déjà favorable : HTML statique, une question par article, tables, étapes, sources, frontières explicites, JSON-LD, `llms.txt`, robots ouverts aux crawlers de réponse.

Ce qui manque pour être cité : une masse critique de pages sur un même sujet et des mentions externes. Le format de réponse à conserver dans chaque article :

1. réponse directe en 2 à 4 phrases ;
2. règle écrite ;
3. entrée, sortie, exception et décision ;
4. exemple fictif rejoué ;
5. source primaire près de l’affirmation ;
6. résumé « se prépare / attend validation / reste humain ».

Ne pas ajouter des blocs artificiels « pour ChatGPT ». La clarté éditoriale et les entités cohérentes servent à la fois Google et les moteurs de réponse.

## 8. Stratégie de backlinks

Objectif : obtenir des mentions éditoriales qui renforcent l’entité et les clusters, pas remplir des annuaires.

### Actifs à proposer

- tableaux de décision et règles rejouables sur jeu fictif ;
- modèles et outils gratuits qui rendent une valeur avant le CTA ;
- relevés anonymisés et agrégés sur les questions des cabinets, si la méthode et l’échantillon sont publiés ;
- explications sourcées sur proposition/validation, arrêt dans le doute et recette.

### Canaux prioritaires

1. partenaires d’intégration réellement utilisés : page partenaire, étude technique ou tutoriel commun ;
2. médias et newsletters de la profession : contribution pédagogique signée, sans tribune promotionnelle ;
3. réseaux professionnels et événements régionaux : page intervenant et ressource citée ;
4. écosystème entrepreneurial officiel : fiches d’entité cohérentes avec le SIREN et le site ;
5. mentions non liées : transformer une citation existante de Memlia ou Kevin en lien vers la page canonique ;
6. ressources universitaires/formation continue uniquement lorsqu’un support pédagogique justifie la citation.

Refus : achat de liens, PBN, annuaires génériques en série, ancres exactes imposées, échange massif de liens, communiqué sans information.

Mesure hebdomadaire : domaines référents nouveaux, URL cible, ancre, contexte, statut d’indexation, clics référents. Une mention de marque vers l’accueil renforce l’entité ; un lien contextuel vers un article renforce le cluster ; un lien vers une route fille n’est recherché que si la page apporte la meilleure réponse.

## 9. Indexation Google : procédure exacte

### Routes déjà indexables

1. Construire et vérifier : `npm run build && npm run test:indexability`.
2. Vérifier en production, sans query string : `npm run test:indexability`.
3. Dans Search Console, propriété `sc-domain:memlia.fr`, ouvrir Inspection de l’URL.
4. Inspecter successivement :
   - `https://memlia.fr/automatisation-cabinet-comptable`
   - `https://memlia.fr/automatisation/rapprochement-bancaire`
5. Lancer « Tester l’URL publiée » ; demander l’indexation seulement si le test voit HTTP 200, canonical utilisateur = canonical Google attendu, et aucun `noindex`.
6. Dans Sitemaps, soumettre une seule fois `https://memlia.fr/sitemap.xml`. Ne pas soumettre les sous-sitemaps séparément.
7. Le lendemain, exécuter `node scripts/seo/sentinelle.mjs --json`; le rapport écrit zéro comme une mesure et liste les URLs encore à demander.

### Quatre candidats `pret-preview`

Ne pas demander leur indexation tant qu’ils répondent `noindex`. Pour chaque slug :

1. obtenir trois liens entrants contextuels déclarés et réellement présents ;
2. exécuter `npm run service:sceller -- <slug>` ;
3. vérifier le candidat servi à l’URL canonique ;
4. exécuter `npm run service:publier -- <slug>` ;
5. reconstruire, pousser `main` une seule fois et attendre le déploiement Git Cloudflare ;
6. exécuter `npm run test:indexability` ;
7. demander l’indexation dans Search Console seulement après lecture de `index, follow` et présence dans `sitemap.xml`.

Ordre recommandé : `saisie-comptable`, `paie`, `factures-fournisseurs`, `notes-de-frais`. Le rapprochement bancaire est déjà publié.

## 10. Ordre d’exécution

1. Publier le H1 et le maillage après la chaîne verte ; conserver le graphe d’entités sur les seules preuves déjà versionnées.
2. Réassigner par la forge la requête primaire de l’article carte pour supprimer le doublon exact avec le pilier.
3. Produire les cinq articles du seuil 12 ; ils débloquent les liens entrants des routes filles.
4. Passer les quatre candidats par la forge, sans lever `noindex` à la main.
5. Demander l’indexation des routes devenues indexables.
6. Lancer le cycle hebdomadaire : demande, dérive, citations IA, liens entrants, puis allocation des quatre créneaux suivants.

La priorité n’est pas « écrire 90 articles ». La priorité est de faire de chaque groupe de trois articles une preuve de profondeur autour d’une page commerciale qui répond à une intention distincte.