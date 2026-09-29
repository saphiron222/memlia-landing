---
titre: "Automatiser un cabinet comptable : la carte des tâches"
titreOnglet: "Automatisation cabinet comptable : carte des tâches | Memlia"
resume: "Soixante familles de tâches réparties en douze pôles, avec pour chacune la règle typique et sa frontière : ce qui se prépare seul, ce qui attend une validation, ce qui reste humain. Une carte pour choisir par où commencer, sans changer de logiciel."
description: "Automatisation cabinet comptable : une carte pour choisir une tâche, écrire sa règle et fixer ce qui se prépare, se valide ou reste humain."
datePublication: 2026-09-16
dateMiseAJour: 2026-09-29
auteur: kevin
sujets: [automatisation, methode, cabinet]
motsCles: ["automatisation cabinet comptable", "tâches répétitives", "validation humaine", "règle de cabinet", "familles de tâches"]
brouillon: false
image: img-art-carte-des-taches
pipelineVersion: 1
primaryQuery: "automatisation cabinet comptable"
secondaryQueries: ["automatiser cabinet expertise comptable", "tâches répétitives cabinet comptable", "automatisation sans changer de logiciel"]
intent: comprendre
fanOut: ["quelles tâches automatiser dans un cabinet", "par où commencer une automatisation", "ce qui reste humain"]
cluster: methode-decision-humaine
famille: choisir-cadrer
rolePrincipal: direction-associes
rolesSecondaires: [chefs-mission-portefeuille, numerique-it-data]
tache: "Dresser la carte des tâches automatisables du cabinet et repérer celles qui ont une règle écrite."
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-09-29
funnel: TOFU
contentType: searchable
format: pillar-page
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Douze pôles et soixante familles listés depuis src/data/familles.ts ; pour chacun des onze pôles ouverts, un tableau se-prépare-seul / attend-une-validation / reste-humain ; le douzième (audit légal) listé et non ouvert ; six affirmations sourcées sur des pages officielles ouvertes le jour de la publication."
reviewRule: "Réviser à chaque publication de satellite (ajout d’un lien) et à chaque changement des sources officielles citées ; relecture trimestrielle des passages fiscaux et données."
reviewer: qa:t_e5c72326
sourcesVerifieesLe: 2026-09-29
cta:
  label: "Confier une première tâche"
  destination: "/contact"
  outcome: "Nous écrivons la règle de la tâche que vous choisissez dans vos mots, nous l’automatisons dans les outils que vos équipes utilisent déjà, et elles la recettent sur vos dossiers. La décision reste à vos équipes, à chaque endroit où elle engage le cabinet. Rien à envoyer : décrivez la tâche, nous vous disons ce qu’il faut pour la prendre en charge."
imageOg: "/images/img-art-carte-des-taches-og.webp"
imageAlt: "Carte des tâches en diorama 3D : îlots reliés par des chemins, jeton vert sur un chemin choisi devant une bifurcation"
statutEditorial: publie
sources:
  - editeur: "CNIL"
    titre: "Responsable du traitement, sous-traitants : comment bien identifier son rôle ?"
    url: "https://cnil.fr/fr/rgpd-comment-bien-identifier-son-role"
    consulte: 2026-09-29
  - editeur: "Service Public"
    titre: "Quels sont les délais de conservation des documents pour les entreprises ?"
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F10029"
    consulte: 2026-09-29
  - editeur: "CNIL"
    titre: "Règlement européen sur la protection des données, chapitre 2 : principes"
    url: "https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2"
    consulte: 2026-09-29
  - editeur: "CNIL"
    titre: "Les durées de conservation des données"
    url: "https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees"
    consulte: 2026-09-29
  - editeur: "impots.gouv.fr"
    titre: "Calendrier fiscal des professionnels"
    url: "https://www.impots.gouv.fr/professionnel/calendrier-fiscal"
    consulte: 2026-09-29
  - editeur: "Net-entreprises"
    titre: "Les comptes rendus métiers DSN"
    url: "https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/"
    consulte: 2026-09-29
---

## Réponse directe

Automatiser une tâche de cabinet, c’est exécuter une règle écrite sans intervention humaine à chaque occurrence, et faire remonter ce qui sort de la règle. Un cabinet d’expertise comptable en compte des dizaines qui s’y prêtent : collecte de pièces, lettrage, échéances, honoraires, courriels, paie. Cette carte les classe en douze pôles et soixante familles, avec pour chacune la règle typique et la frontière : ce qui se prépare seul, ce qui attend une validation, ce qui reste humain.

## Qu’est-ce qu’une tâche automatisable dans un cabinet ?

**Une tâche automatisable** est une tâche qui se répète à l’identique, que le cabinet sait décrire par une règle dans ses propres mots, et dont les exceptions se comptent. **La règle de cabinet** est cette description : un déclencheur, une condition, une action, une exception, écrits par les personnes qui font la tâche aujourd’hui. **La frontière d’automatisation** est la ligne, propre à chaque tâche, entre ce qu’un outil peut préparer seul, ce qu’il peut proposer à une personne, et ce qui reste une décision humaine.

Ces trois définitions suffisent à trier n’importe quelle tâche du cabinet. Quand la règle ne s’écrit pas sans « ça dépend », la tâche n’est pas mûre. Quand les exceptions sont plus nombreuses que les cas courants, elle ne l’est pas non plus. Le [glossaire](/glossaire#regle-de-cabinet) définit la règle de cabinet, le [cas de refus](/glossaire#cas-de-refus) et la [validation humaine](/glossaire#validation-humaine) avec un exemple fictif pour chacun.

## Comment lire cette carte ?

Une tâche se prête à l’automatisation quand trois conditions tiennent ensemble. Elle se répète : chaque mois, chaque dossier, chaque pièce. Elle s’écrit en une règle que le cabinet formule dans ses propres mots. Et ses exceptions se comptent : une pièce illisible, un client en litige, un montant hors seuil. Quand l’une des trois conditions manque, la tâche reste humaine, et c’est très bien ainsi.

La plupart de ces règles existent déjà dans votre cabinet. Elles ne sont écrites nulle part : elles vivent dans la tête des collaborateurs qui les appliquent chaque mois, entre deux dossiers qui demandent leur jugement, et elles partent avec eux. Cette carte sert d’abord à cela : repérer, pôle par pôle, le savoir-faire que personne n’a écrit, et décider par quelle règle commencer.

Chaque famille ci-dessous est décrite par sa règle typique, puis par sa frontière, en trois colonnes. Ce qui se prépare seul : l’outil calcule, trie, prépare une relance, contrôle, sans que personne n’intervienne. Ce qui attend une validation : l’outil propose, une personne du cabinet valide avant que quoi que ce soit ne parte ou ne s’écrive. Ce qui reste humain : le jugement professionnel, la relation, la décision engageante. Cette frontière n’est pas un aveu de faiblesse de l’outil, c’est la règle de cabinet elle-même. Ce classement est une méthode Memlia, née d’un cabinet observé de près et de deux postes documentés ; il se corrige à chaque cabinet rencontré.

Un dernier repère avant de lire : rien ici ne suppose de changer de logiciel. Les règles décrites se posent sur les classeurs, les messageries et les logiciels de production que le cabinet utilise déjà. [La plateforme que personne n’a achetée](/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils) raconte pourquoi cette règle existe. Quand une famille est déjà documentée par un article détaillé, le lien y mène ; les autres articles viennent semaine après semaine, la carte se complète.

## La carte en un tableau

| Pôle | Familles | Tâches les plus répétitives | Ce qui reste toujours humain |
|---|---|---|---|
| Production comptable | 13 | relance de pièces, saisie, lettrage, rapprochement, révision, clôture | la qualification d’une pièce ambiguë, l’écriture d’inventaire, la clôture |
| Portefeuille et échéances | 5 | échéances par dossier, télédéclarations, suivi par état, tableau de bord | l’arbitrage entre dossiers, la conversation avec le client |
| Paie et social | 7 | variables de paie, contrôles de bulletins, dépôt, retours après dépôt | la décision de déposer, la correction qui engage un salarié |
| Juridique et fiscal | 7 | TVA, acomptes, déclarations annexes, secrétariat juridique, lettre de mission | l’arbitrage fiscal, la signature, le dépôt |
| Facturation et recouvrement | 4 | honoraires, prélèvements, relances d’impayés, rentabilité | la négociation, l’accord d’un échéancier |
| Administration et secrétariat | 5 | boîte mail, entrée en relation, envois, rendez-vous | la réponse à un client mécontent, la signature |
| RH et formation | 3 | arrivée d’un collaborateur, synthèse de rémunération, formation | l’entretien, la décision RH |
| Numérique, IT et data | 4 | brouillons IA, imports, connecteurs, conformité | l’usage d’une donnée à une autre fin, le choix d’un sous-traitant |
| Excel et outils existants | 3 | classeurs de suivi, règles greffées, exports | la propriété de la règle |
| Conseil et missions spéciales | 4 | prévisionnel, trésorerie, financement, évaluation | l’hypothèse et le conseil |
| Méthode et décision humaine | 4 | choisir, écrire la règle, recetter, mesurer | tout ce qui précède |
| Audit légal | 1 | commissariat aux comptes : famille listée, aucune tâche ouverte | tout |

<figure data-blog-proof="carte-douze-poles">
  <img src="/proofs/blog/carte-douze-poles.webp" alt="Carte des douze pôles et de leurs soixante familles, avec l’audit légal listé mais non ouvert." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## Production comptable : de la pièce reçue au bilan livré

C’est le pôle le plus large, treize familles, parce que c’est là que la répétition est la plus dense. La [collecte et la relance des pièces](/blog/automatiser-la-relance-des-pieces-clients) ouvrent la chaîne : chaque dossier attend, pour chaque période, une liste de pièces qui dépend de son régime. La règle typique tient en trois états, attendu, reçu, lisible, et une cadence de relance qui cesse à réception. [La saisie et la pré-comptabilité](/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier) suivent : lecture des pièces, extraction des champs, pré-imputation, avec un reliquat d’exceptions que la lecture n’a pas su traiter et qui doit remonter plutôt que d’être forcé.

Pour rédiger la première demande de pièce sans perdre la décision d'envoi, voyez le [patron de prompt sur cas fictif](/blog/prompt-chatgpt-expert-comptable). Si vous comparez des outils plutôt que des formulations, la [grille de choix d'un logiciel IA comptable](/blog/logiciel-ia-comptabilite) fait rejouer la pièce, l'exception et la reprise par l'équipe, sans classement de marques.

Le [lettrage](/glossaire#lettrage-comptable) et le [rapprochement bancaire](/glossaire#rapprochement-bancaire) obéissent à des règles d’appariement que le cabinet connaît par cœur mais écrit rarement : montant identique, référence présente, tolérance de quelques centimes, délai entre facture et règlement. Écrites, ces règles deviennent une proposition d’écriture et une liste d’écarts typés. Les factures d’achat, les ventes importées d’une caisse ou d’une boutique en ligne, les notes de frais, les tableaux d’amortissement et d’emprunt suivent la même logique : un import sans ressaisie, un contrôle de schéma, une écriture récurrente générée puis validée.

La [révision par cycles](/glossaire#revision-comptable) et la clôture concentrent des contrôles répétitifs : justification de chaque solde, comparaison avec l’exercice précédent, cohérence entre journaux. Une checklist datée, rejouée sur chaque dossier, prépare le travail du réviseur sans jamais le remplacer. Les situations intermédiaires et le reporting client s’en déduisent. La facture électronique change la matière première de tout ce pôle : ce que le cabinet reçoit, sous quel format, par quel canal. Enfin la gestion documentaire, dossier permanent compris, se règle par un nommage et un classement automatiques que l’on vérifie par échantillon.

Sur la conservation des pièces, le cadre est clair et il borne la règle de classement. [Service-Public](https://entreprendre.service-public.gouv.fr/vosdroits/F10029) le formule ainsi : une entreprise doit conserver tout document émis ou reçu dans l’exercice de son activité pendant une durée minimale. La durée dépend de la nature du document ; la règle de nommage doit donc porter la date et la nature de la pièce, sinon rien ne peut être purgé proprement plus tard.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le brouillon de relance d’une pièce manquante, à cadence, jusqu’à réception | L’envoi de cette relance et l’écriture proposée par le lettrage ou le rapprochement | La qualification d’une pièce ambiguë |
| L’import d’un export de caisse ou de facturation, avec contrôle de schéma | La checklist de révision remplie, avant la revue du réviseur | L’écriture d’inventaire qui engage un jugement |
| Le nommage et le classement d’une pièce reçue | La liste des écarts à traiter avant clôture | La décision de clôturer |

## Portefeuille et échéances : piloter la production sans classer les personnes

Cinq familles, et un principe qui les traverse : on pilote des dossiers et des étapes, jamais des personnes. Le calendrier des échéances fiscales et sociales du portefeuille se tient par dossier, avec une alerte quand une échéance approche sans que le dossier soit à l’étape attendue. Les télédéclarations et leurs rejets se suivent de la même façon : envoyé, accusé, rejeté, corrigé. Le suivi des dossiers par état, dans un classeur que le cabinet possède déjà, donne en une lecture l’étape de chacun et ses exceptions.

Le tableau de bord de production agrège tout cela en [indicateurs non nominatifs](/glossaire#agregat-non-nominatif) : combien de dossiers à chaque étape, combien en retard, combien d’exceptions ouvertes. Le plan de charge en découle, pour répartir les périodes de pointe. La ligne rouge est nette : un indicateur qui classe les collaborateurs n’est pas un indicateur de production, c’est de la surveillance, et la carte ne le prévoit nulle part.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le statut d’un dossier par étape, mis à jour depuis les fichiers du cabinet | L’alerte sur une échéance proche, à traiter ou à écarter | L’arbitrage entre deux dossiers en retard |
| Le compte des rejets de télédéclaration par motif | La réaffectation d’un dossier proposée par le plan de charge | La conversation avec le client dont le dossier bloque |

## Paie et social : le pôle déjà documenté

Sept familles, dont plusieurs sont déjà couvertes par des articles détaillés, parce que c’est le pôle où Memlia a livré ses premières automatisations. La collecte des variables de paie, chaque mois, ressemble trait pour trait à la relance de pièces : une liste attendue par client, une cadence, un arrêt à réception. Les [contrôles des bulletins avant le dépôt](/blog/controler-les-bulletins-de-paie-avant-la-dsn) rejouent des cohérences connues : variables saisies, bulletin calculé, fichier prêt à partir. Le [suivi de la production sociale](/blog/suivre-la-production-sociale-dans-excel) tient chaque dossier par étape dans le classeur existant, sans classement individuel.

Les retours après dépôt ont leur propre famille. [Net-entreprises](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) les définit précisément : un compte rendu métier est un rapport permettant à l’organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu’une erreur ou suspicion d’erreur est détectée. [Lire un compte rendu métier](/blog/comprendre-les-comptes-rendus-metier-dsn), déterminer sa portée et organiser la correction est une tâche qui se prépare, mais dont la décision reste au responsable. Les entrées et sorties de salariés, les absences et leurs indemnités, les échéances de charges sociales complètent le pôle.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le brouillon de relance des variables de paie manquantes | L’envoi de cette relance et le contrôle de cohérence d’un bulletin, écarts listés | La décision de déposer |
| Le statut de chaque dossier du pôle social, par étape | La qualification d’un retour après dépôt | La correction qui engage les droits d’un salarié |

## Juridique et fiscal : préparer, contrôler, ne jamais décider seul

Sept familles où la frontière est la plus stricte, parce que le jugement professionnel y est engagé à chaque pas. La TVA se prépare : les contrôles de cohérence avant déclaration, le rapprochement entre chiffre d’affaires et TVA collectée, la liste de ce qui a été vérifié. Le [calendrier fiscal de l’administration](https://www.impots.gouv.fr/professionnel/calendrier-fiscal) donne le cadre : pour septembre 2026, il indique une fenêtre pour le dépôt et le paiement de la déclaration mensuelle de TVA entre les 15 et 24 septembre 2026, à la date figurant dans l’espace professionnel de chaque entreprise. La règle du cabinet part de là, dossier par dossier.

L’impôt sur les sociétés, ses acomptes et ses soldes, les déclarations annexes, le secrétariat juridique annuel, les formalités de création et de modification, les registres et obligations périodiques suivent la même logique : le calcul et le suivi se préparent, la déclaration et la signature restent des actes humains. La lettre de mission et la vigilance ont une place à part : leur renouvellement se suit par dossier, leur contenu se rédige et se signe par des personnes.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Les contrôles de cohérence avant une déclaration, résultats listés | Le montant d’un acompte calculé, avant transmission | Le dépôt de la déclaration |
| Le suivi des renouvellements de lettres de mission par dossier | Le procès-verbal préparé depuis les données tenues | L’arbitrage fiscal et la signature |

## Facturation et recouvrement du cabinet : ce qui se perd entre deux tableaux

Quatre familles, observées de près chez un cabinet client. Les honoraires mensualisés et les actes hors forfait se facturent une seule fois : la règle d’unicité paraît évidente, elle se casse dès que deux personnes tiennent deux tableaux. Les prélèvements s’assemblent en lots, les rejets reviennent de la banque avec un motif, et un échéancier de rattrapage se propose après plusieurs rejets. Les relances d’impayés se préparent au bon stade depuis les messages types du cabinet, et rien ne part sans validation. Enfin le temps, la rentabilité et la sous-facturation se mesurent par dossier, en agrégats.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| La détection d’un acte déjà facturé | La relance d’honoraires préparée au stade prévu | La négociation avec un client en difficulté |
| La détection d’un rejet de prélèvement et son motif | L’échéancier de rattrapage proposé | L’accord d’un échéancier |

## Administration et secrétariat : la boîte mail et les jalons

Cinq familles. La boîte mail du cabinet, assainie puis tenue par client et par priorité, est la plus demandée et la plus mal comprise : les règles de tri s’écrivent, et ce qui ne se trie jamais seul (un contentieux, une urgence humaine, une ambiguïté) doit remonter en tête plutôt que d’être classé. L’entrée en relation d’un nouveau client, la fin de mission et le transfert d’un dossier, les envois de plaquettes et de documents, la préparation des rendez-vous sont des suites de jalons : chacun se prépare, certains se valident, quelques-uns se signent.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le tri d’un courriel d’un client connu vers son dossier | Le courrier type préparé pour un client | La réponse à un client mécontent |
| Le suivi des jalons d’une entrée en relation | La liste des pièces d’entrée manquantes à réclamer | La signature de la lettre de mission |

## RH et formation : l’équipe du cabinet

Trois familles, tournées vers l’intérieur. L’arrivée d’un collaborateur, les entretiens, la synthèse annuelle de rémunération d’un salarié se préparent depuis la paie tenue, sans reconstruire les chiffres. La formation à l’IA et à ses limites devient une tâche à part entière : l’équipe doit comprendre ce que les outils préparent et ce qu’ils ne garantissent pas, et le cabinet doit pouvoir en montrer la trace.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| La checklist d’arrivée d’un collaborateur, jalon par jalon, depuis la date d’entrée | La synthèse annuelle de rémunération préparée depuis la paie tenue | L’entretien, et toute décision qui concerne une personne |
| Le suivi des formations suivies et à planifier, par équipe | Le support de formation à l’IA et à ses limites, avant diffusion | Ce que le cabinet décide de confier à un outil |

## Numérique, IT et data : le cadre de toute automatisation

Quatre familles qui ne sont pas des tâches de production mais qui les conditionnent toutes. L’IA générative et les agents préparent des brouillons, des résumés, des propositions ; ils ne décident pas. Pour rédiger une demande de pièce, voyez [le prompt sur un cas fictif et ses conditions d’arrêt](/blog/prompt-chatgpt-expert-comptable). Les connecteurs, les imports et la synchronisation relient les logiciels par interface quand elle existe, par fichiers sinon. Les données personnelles encadrent tout : avant de brancher une règle, il faut identifier la finalité, les accès et le rôle de chaque partie pour le traitement concerné. Ce rôle ne se déduit pas du seul fait que le fichier vient d’un client. [La CNIL rappelle](https://cnil.fr/fr/rgpd-comment-bien-identifier-son-role) que les acteurs doivent déterminer leur qualification au cas par cas : qui décide de la finalité et des moyens essentiels, qui agit sur instruction ? Un cabinet peut avoir des rôles différents selon le traitement ; il faut les qualifier et les documenter, non décréter un rôle unique à partir de l’origine du fichier.

Deux principes de la CNIL sont à examiner pour chaque traitement, parmi d’autres obligations RGPD. Le premier est la [minimisation](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2) : les données traitées doivent être adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées. Un outil qui relance des pièces n’a pas besoin des bulletins de paie. La seconde porte sur la durée : selon la [fiche de la CNIL sur les durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees), la définition de la durée de conservation relève de l’analyse de conformité que le responsable doit mener pour son traitement. Une règle de purge fait donc partie de toute automatisation qui garde des données, et [la minimisation](/glossaire#minimisation-des-donnees) se vérifie avant d’écrire la première ligne.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Un brouillon de réponse ou un résumé de document | Tout envoi externe préparé par un outil | La décision d’utiliser une donnée à une autre fin |
| Un import de fichier avec contrôle de schéma | La correspondance de champs entre deux logiciels | Le choix d’un sous-traitant et le contrat qui l’encadre |

## Excel et outils existants : automatiser en place

Trois familles, et le parti pris de Memlia. Un classeur de suivi partagé se structure : dictionnaire des colonnes, états fermés, contrôles. Les règles se greffent sur ce classeur, en place, sans macro ni migration. Les exports des logiciels de production s’importent sans ressaisie, avec un contrôle de schéma qui refuse d’écrire quand une colonne a changé de nom. Le cabinet garde ses fichiers, ses habitudes et la propriété de ses règles.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le contrôle de structure d’un classeur partagé : colonnes, états, doublons | Une règle greffée sur le classeur, avant sa première exécution sur les vrais dossiers | La propriété de la règle, et sa modification |
| L’import d’un export de logiciel de production, refusé si une colonne a changé de nom | Le remplacement d’une formule fragile par une règle écrite | Le choix de garder ou de changer de support |

## Conseil et missions spéciales : ce qui se déduit des données tenues

Quatre familles adjacentes : prévisionnel et business plan, trésorerie prévisionnelle, dossiers de financement et d’aides, éléments chiffrés d’une évaluation ou d’une transmission. Elles ne sont pas répétitives au même sens que la production, mais leur matière première l’est : des données déjà tenues, à projeter avec des hypothèses tracées. Ce qui se prépare, c’est l’extraction et la mise en forme ; ce qui reste humain, c’est l’hypothèse et le conseil.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| L’extraction et la mise en forme des données déjà tenues, période par période | Un prévisionnel ou un plan de trésorerie préparé sur des hypothèses tracées | L’hypothèse elle-même, et le conseil qui en découle |
| Le rapprochement d’un dossier de financement avec les pièces disponibles | Les éléments chiffrés d’une évaluation, avant remise | La présentation au client et la décision qu’il prend |

## Méthode et décision humaine : la famille transversale

Quatre familles qui ne produisent rien mais qui décident de tout. Choisir et cadrer une automatisation, en commençant par une tâche qui a une règle écrite plutôt que par la plus douloureuse. Écrire la règle dans les mots du cabinet, la rejouer sur un jeu d’essai fictif qui couvre le cas courant, le cas limite et le cas de refus, puis la recetter sur les fichiers du cabinet. Placer la validation humaine là où une action engage le cabinet ou un client. Mesurer le temps réellement gagné, avant et après, plutôt que de reprendre un chiffre lu ailleurs.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le jeu d’essai fictif rejoué à chaque changement de règle | La règle écrite, avant son premier passage en recette | Le choix de la tâche par laquelle commencer |
| La mesure du temps avant et après, sur le même jeu d’essai | La place de chaque validation humaine, écrite dans la règle | La décision d’interrompre ou d’étendre une automatisation |

<figure data-blog-proof="carte-test-regle">
  <img src="/proofs/blog/carte-test-regle.webp" alt="Test fictif d’une tâche candidate selon répétition, règle écrite et exceptions dénombrables." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## Que ne contient pas cette carte ?

Elle ne contient aucun chiffre de gain. Les promesses en heures par semaine ou en pourcentage d’impayés circulent ; aucune de celles que nous avons lues n’est accompagnée de sa mesure, et nous n’en publierons pas sans jeu fictif et protocole. Elle ne documente pas l’audit légal et le commissariat aux comptes : ce douzième pôle et sa famille unique sont listés, aucune tâche n’y est ouverte. Elle ne promet enfin aucune fonction : chaque famille décrit une tâche et sa règle, pas une fonction livrée.

## Les erreurs à éviter quand on automatise un cabinet

- **Commencer par la tâche la plus douloureuse.** Elle est souvent la moins déterministe ; on commence par celle dont la règle s’écrit sur une page.
- **Automatiser sans écrire la règle.** Un outil qui « fait comme d’habitude » reproduit les erreurs de l’habitude, sans qu’on puisse les voir.
- **Laisser partir un envoi sans validation.** Une relance, une déclaration, une facture engagent le cabinet ; l’outil prépare, une personne valide.
- **Mesurer les personnes au lieu des dossiers.** Un tableau de bord qui classe les collaborateurs n’aide pas la production, il la déforme.
- **Croire un chiffre de gain sans sa mesure.** Le seul chiffre qui vaut est celui du cabinet, mesuré avant et après sur un jeu d’essai.
- **Changer de logiciel pour automatiser.** La règle se pose sur les fichiers existants ; la migration est une autre décision, avec ses propres coûts.

## Questions fréquentes

### Par quelle famille un cabinet commence-t-il le plus souvent ?

Par celle dont la règle est déjà écrite dans les habitudes : la relance de pièces, les contrôles avant dépôt de la paie, le suivi des échéances. Ce sont des tâches répétitives, aux exceptions connues, dont la règle tient en quelques phrases.

### Automatiser une tâche veut-il dire que personne ne la contrôle plus ?

Non. La frontière place une validation humaine avant toute action qui engage le cabinet ou un client, et une file de refus pour ce que la règle ne couvre pas. L’outil prépare et signale ; la personne décide.

### Faut-il un outil différent par famille ?

Non. La plupart des familles se règlent dans le classeur de suivi et la messagerie que le cabinet utilise déjà, complétés par une règle codée en place. Ce qui change d’une famille à l’autre, c’est la règle, pas l’outil.

### Comment savoir si une tâche est mûre pour l’automatisation ?

Écrire sa règle sur une page : déclencheur, condition, action, exception. Si la page se remplit sans « ça dépend » et que les exceptions se comptent, la tâche est candidate. Sinon, elle attend.

### Où va la carte à partir de maintenant ?

Chaque famille reçoit son article détaillé, au rythme de plusieurs par semaine, dans l’ordre des familles observées sur le terrain. La carte se complète et ses liens s’ajoutent au fil des publications.

## La règle à retenir

Une tâche s’automatise quand elle se répète, que sa règle s’écrit dans les mots du cabinet et que ses exceptions se comptent. Tout le reste est une frontière à placer : ce qui se prépare seul, ce qui attend une validation, ce qui reste humain.

## Par où commencer ?

Choisissez une seule famille, la plus répétitive de votre cabinet, et écrivez sa règle sur une page : déclencheur, condition, action, exception. Si la page se remplit sans hésitation, la tâche est candidate. Si elle appelle des « ça dépend », gardez-la pour plus tard. Puis confiez-nous la tâche entière : nous observons le geste avec vos équipes, nous écrivons la règle dans vos mots, nous la construisons dans les outils que vous utilisez déjà, vos équipes la recettent, et nous la maintenons. Vous gardez la décision à chaque endroit où elle engage le cabinet ou un client. C’est [la méthode](/methode), [le service](/automatisation-cabinet-comptable) et ses [garanties](/garanties) ; le [glossaire](/glossaire) fixe le vocabulaire de ces règles, terme par terme.
