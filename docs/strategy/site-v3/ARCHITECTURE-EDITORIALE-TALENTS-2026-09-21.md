# Architecture éditoriale rectifiée — charge, compétences et transmission

Date de décision : 21 septembre 2026

Carte : `t_708fba22`

Données structurées : `mesures/architecture-editoriale-talents-2026-09-21.json`

## Décision

Ne pas créer de page pilier ni de guide central « recrutement cabinet comptable ».

Conserver un maillage de trois articles autonomes sous `/blog/`, regroupés en interne sous le nom **charge, compétences et transmission** :

1. diagnostiquer où la charge se forme dans le flux ;
2. distinguer ce que l’automatisation prépare de ce que le professionnel décide ;
3. rendre une consigne transmissible sans promettre un résultat de fidélisation.

Cette architecture rectifie le cluster existant sans créer de nouveau slug. Elle remplace son ancien nom interne « charge, compétences et fidélisation », qui faisait de la fidélisation un résultat implicite. Le troisième article porte désormais l’intention **transmission du savoir-faire**. La fidélisation et le turnover restent du vocabulaire de contexte, jamais une promesse de titre, de métadonnée, de CTA ou de résultat.

Le verdict métier `FAIL` ne supprime donc pas le territoire. Il ferme la publication des trois versions hashées tant que les corrections P1 ne sont pas appliquées, les sources ne sont pas réalignées et une nouvelle revue indépendante n’a pas jugé les candidats corrigés et figés.

## Pourquoi il n’y a pas de pilier

Quatre signaux convergent :

- le head term `recrutement cabinet comptable` mène vers l’emploi et l’intermédiation : 10 résultats sur 10 dans la capture SERP utilisée par la recherche ;
- le site n’a encore aucune requête propriétaire visible sur le territoire charge, talents ou compétences dans la fenêtre Search Console du 21 août au 18 septembre 2026 ;
- la demande employeur observée se fragmente en décisions distinctes, avec un signal plus net sur charge/surcharge qu’auprès des formulations compétences ou transmission ;
- Memlia ne vend ni recrutement, ni ATS, ni marque employeur. Un hub générique créerait une fausse catégorie commerciale et entrerait en concurrence avec `/automatisation-cabinet-comptable`.

La future création d’une rubrique publique ne se réévalue qu’après publication et mesure des trois articles : impressions propriétaires sur plusieurs requêtes du territoire, liens internes réellement suivis et capacité de la rubrique à porter une intention propre. Trois articles seuls ne justifient pas une page d’étiquettes maigre.

## Preuves retenues et limites

Les décisions utilisent les artefacts suivants :

- `RECHERCHE-DEMANDE-EMPLOI-CABINET-2026-09-21.md` : 40 amorces Google Suggest, 15 SERP et 150 résultats DuckDuckGo France, Search Console, tentative DataForSEO et Last30days ;
- `talents-demande-2026-09-21.json` et `talents-serp-ddg-2026-09-21.json` : mesures structurées ;
- `REGISTRE-PREUVES-TALENTS-2026-09-21.md` et `registre-preuves-talents-2026-09-21.json` : 22 claims et 6 sources, verdict métier `FAIL` ;
- les trois candidats existants relus dans `wt/t_2d164da6`, dont les hashes sont consignés dans le registre métier.

Limites à conserver dans toute transmission :

- Suggest mesure des formulations, pas un volume de recherche ;
- la SERP DuckDuckGo est un proxy ponctuel, pas une position Google ;
- DataForSEO a répondu `40200 Payment Required`, donc aucun volume n’est disponible et aucun volume ne doit être estimé ;
- Last30days n’a rien produit de suffisamment solide sur la fenêtre ;
- Apec soutient seulement une formulation datée du 9 décembre 2021 ;
- l’OEC Paris 2023 résume un corpus intersectoriel ;
- OPCO Atlas fournit un contexte de branche qualitatif et prospectif, sans date de publication ni protocole affiché ;
- aucun taux de pénurie, turnover, salaire, alternance ni résultat RH n’est publiable à partir du corpus contrôlé.

## Méthode de priorité

Le score est `impact × confiance ÷ effort`, sur une échelle de 1 à 5 pour chaque facteur. Il sert uniquement à ordonner le travail éditorial. Il ne représente ni un volume SEO ni un résultat commercial attendu.

- **Impact** : proximité d’une décision de cabinet et du service Memlia.
- **Confiance** : qualité du signal de demande et possibilité de soutenir les affirmations.
- **Effort** : recherche, fact-check, preuve fonctionnelle et risque de confusion à traiter.

## Carte mots-clés × intention × persona × format × concurrence × valeur

| Rang | Sujet regroupé et mots-clés | Intention | Persona | Type de page | Concurrence observée | Valeur Memlia | Score | Décision |
|---:|---|---|---|---|---|---|---:|---|
| 1 | `charge de travail cabinet comptable`, `surcharge de travail cabinet comptable` | Diagnostiquer le flux avant de choisir une réponse | Dirigeant, responsable de production | Article de décision avec journal fictif | Outils de pilotage, conseils, prévention et presse sectorielle | Séparer attente, répétition, exception et décision sans classer les personnes | 8,33 | Publier, priorité 1 |
| 2 | `organisation cabinet expertise comptable` | Réorganiser le fonctionnement | Dirigeant | Section de l’article charge | Conseils de gestion, fédérations et éditeurs ; intention large | Revenir aux états du flux plutôt qu’à un organigramme générique | 6,00 | Fusionner dans charge |
| 3 | `diagnostic capacité cabinet comptable` | Choisir une réponse à la charge | Dirigeant, responsable de production | Outil gratuit | Le `plan de charge` est dominé par les logiciels | Classer localement les unités de travail, sans donnée nominative | 5,00 | Transmettre comme idée d’outil |
| 4 | `turnover cabinet comptable` | Comprendre les départs | Dirigeant, RH de cabinet | Vocabulaire secondaire | SERP éditoriale dense, sources chiffrées fragiles | Poser la non-causalité et orienter vers la transmission d’une règle | 4,50 | Fusionner dans transmission ; aucun taux |
| 5 | `métier comptable intelligence artificielle compétences` | Comprendre l’évolution du travail | Dirigeant, responsable formation, référent outils | Article d’autorité | Formations, écoles et contenus IA génériques | Montrer la frontière préparation, validation, décision et arrêt | 4,00 | Publier, priorité 2 |
| 6 | `plan de charge cabinet comptable` | Planifier la capacité | Dirigeant, manager | Section de l’article charge | Logiciels de planning et de gestion de cabinet | Donner un cadre de décision, pas vendre un logiciel de planning | 4,00 | Fusionner dans charge |
| 7 | `transmission savoir cabinet comptable` | Rendre une consigne transmissible | Dirigeant, chef de mission, responsable formation | Article d’autorité opérationnel | Peu de signal exact ; contenus onboarding et RH adjacents | Transformer une consigne orale en règle relisible, testable et maintenable | 3,00 | Publier, priorité 3 |
| 8 | `sous-traitance cabinet comptable` | Trouver du renfort ou arbitrer faire/sous-traiter | Dirigeant | Comparatif futur | SERP très commerciale de prestataires | Comparer réorganisation, formation, sous-traitance et automatisation | 2,40 | Refuser maintenant ; fact-check déontologique, RGPD et sécurité requis |
| 9 | `grille entretien collaborateur comptable`, `test recrutement assistant comptable` | Évaluer une situation de travail | Dirigeant, RH | Outil gratuit | Modèles RH, recruteurs et contenus généralistes | Cas pratiques de règle, exception et décision, jamais profil psychologique | 2,00 | Transmettre comme idée d’outil |
| 10 | `intégrer nouveau collaborateur cabinet comptable`, `onboarding collaborateur cabinet comptable` | Transmettre plus vite une manière de travailler | Manager, responsable formation | Outil gratuit ou guide de phase 2 | Guides sectoriels et éditeurs installés | Canevas de règle transmissible, pas checklist RH générique | 2,00 | Transmettre comme idée d’outil ; pas d’article en vague 1 |
| 11 | `matrice compétences cabinet comptable` | Cartographier les compétences nécessaires | Dirigeant, formation | Outil gratuit | Référentiels formation et RH | Relier une compétence à un geste, une validation et une exception | 1,50 | Transmettre après validation d’un référentiel de branche |
| 12 | `marque employeur cabinet comptable` | Attirer et fidéliser | Dirigeant, RH | Aucun contenu autonome maintenant | Guides, prestataires RH, éditeurs et cabinets de recrutement | Faible adéquation : Memlia ne vend pas la communication employeur | 1,50 | Refuser maintenant |

## Regroupement des doublons

### À publier comme pages autonomes

#### Charge et surcharge

- **Sujet** : où la charge se forme dans un flux de cabinet.
- **Promesse opérationnelle** : distinguer répétition, attente, exception et décision sur une semaine fictive, puis choisir une première règle à examiner.
- **Angle différenciant** : agrégats de flux, jamais productivité nominative ; pas de moyenne sectorielle ni de promesse de baisse de charge.
- **Preuve de demande** : deux suggestions sur `charge de travail cabinet comptable`, quatre sur l’amorce surcharge, SERP sectorielle mêlant organisation, renfort et prévention.
- **Concurrence** : logiciels de pilotage, conseils, presse sectorielle, droit du travail et prévention.
- **CTA** : `Confier cette tâche` vers `/contact`, seulement après le cadre de diagnostic ; lien contextuel vers `/methode`.
- **Risque de cannibalisation** : élevé avec la carte des tâches et le suivi de production sociale si l’article devient un catalogue ou un tableau de bord. Le contenu doit rester transversal et décisionnel.

#### Compétences et intelligence artificielle

- **Sujet** : ce que le dispositif automatisé prépare, ce que l’équipe valide et ce qui reste une décision.
- **Promesse opérationnelle** : donner une frontière en trois colonnes et trois cas fictifs, dont une ambiguïté et une règle absente.
- **Angle différenciant** : partir d’une règle et de ses conditions d’arrêt, pas de la question spectaculaire du remplacement d’un métier.
- **Preuve de demande** : aucune suggestion exacte sur la formulation testée ; SERP de formations et contenus génériques ; contexte de branche Atlas utilisable seulement comme signal qualitatif et prospectif.
- **Concurrence** : écoles, organismes de formation, médias comptables et blogs IA.
- **CTA** : `Confier cette tâche` vers `/contact`, avec liens préalables vers `/methode` et `/garanties`.
- **Risque de cannibalisation** : moyen à élevé avec la carte des tâches et l’article sur l’adoption des outils. Ne pas dresser une liste de tâches et ne pas traiter le choix du véhicule.

#### Transmission du savoir-faire

- **Sujet** : passer d’une consigne orale à une règle relisible, testable et maintenable.
- **Promesse opérationnelle** : écrire le déclencheur, les conditions, la proposition, la validation et les refus d’une consigne fictive.
- **Angle différenciant** : la transmission est le résultat éditorial démontrable ; aucun effet de fidélisation, turnover ou autonomie n’est promis.
- **Preuve de demande** : aucune suggestion exacte sur `transmission savoir cabinet comptable` ; SERP adjacentes sur fidélisation et onboarding ; cinq suggestions autour de `turnover cabinet comptable`, sans preuve chiffrée publiable.
- **Concurrence** : OEC Paris, médias sectoriels, éditeurs et cabinets RH sur fidélisation ; guides éditeurs sur onboarding.
- **CTA** : `Confier cette tâche` vers `/contact`, centré sur la consigne à rendre transmissible ; lien vers `/methode`.
- **Risque de cannibalisation** : moyen avec `/a-propos` et `/methode`. L’article doit livrer un geste et un jeu fictif, sans répéter le manifeste de marque ni les quatre étapes de mission.

### À fusionner

| Sujet | Cible de fusion | Raison | Traitement autorisé |
|---|---|---|---|
| Surcharge, charge, plan de charge, capacité | Article charge | Même décision de cabinet ; trois pages créeraient des variantes artificielles | Employer charge et surcharge dans le H1/corps ; traiter le plan de charge comme cadre de décision, pas comme logiciel |
| Organisation du cabinet | Article charge | Intention trop large et SERP hétérogène | Une section sur les états du flux ; aucun organigramme générique |
| Turnover et fidélisation | Article transmission | Signal lexical réel, mais aucune preuve causale ni taux publiable | Une section de non-causalité ; ne pas placer ces mots dans la promesse ou les métadonnées |
| Montée en compétences, données, cybersécurité, conseil | Article IA/compétences | Même territoire Atlas ; multiplier les pages diluerait une preuve déjà limitée | Présenter comme facteurs qualitatifs attribués à la page de branche, pas comme effets de l’IA |

### À refuser maintenant

| Sujet | Motif de refus | Condition éventuelle de réouverture |
|---|---|---|
| Pilier `recrutement cabinet comptable` | Intention emploi/intermédiation, 10/10 résultats observés ; mauvaise catégorie commerciale | Aucune sans changement d’offre et preuve d’une intention dirigeant distincte |
| Offres, CV, lettre de motivation, fiche de poste, salaire, alternance | Persona candidat dominant, faible qualification commerciale et données sensibles/fraîches | Nouveau besoin employeur mesuré, corpus primaire et page distincte de l’intention candidat |
| Taux de pénurie ou turnover | Sources primaires spécifiques aux cabinets absentes | Source primaire datée avec définition, population et méthode |
| Marque employeur | Memlia ne vend ni communication RH ni recrutement | Cas d’usage prouvable sur l’organisation réelle, sans promesse d’attractivité |
| Sous-traitance / recruter ou automatiser | Forte demande commerciale mais sujet juridique, déontologique, RGPD et sécurité | Fact-check spécialisé et intention de comparatif neutre confirmée |
| Épuisement professionnel / RPS | Le corpus ne soutient aucun diagnostic de santé au travail | Sources officielles ANACT/INRS et compétence dédiée ; ne jamais relier causalement à l’automatisation |
| Variantes autonomes charge, surcharge et plan de charge | Cannibalisation interne certaine et intention logicielle pour plan de charge | Jamais en pages séparées sans SERP distinctes et demande propriétaire |

## Idées d’outils gratuits à transmettre, sans construction

### 1. Diagnostic de capacité par états du flux

- **Promesse complète** : saisir localement des événements fictifs ou anonymisés, les classer en attente, répétition, exception et décision, puis obtenir une matrice de réponses possibles.
- **Entrées** : type d’événement, fréquence choisie par le cabinet, stabilité de la règle, coût du doute et réversibilité.
- **Sortie utile** : aucun score de personne ; un tableau indiquant « observer davantage », « écrire la règle », « former », « réorganiser », « envisager une automatisation » ou « garder humain ».
- **Acquisition naturelle** : requêtes charge/surcharge et intention plan de charge, sans promettre un logiciel de planning.
- **CTA secondaire** : `Comprendre la méthode` vers `/methode` ; `Confier une première tâche` vers `/contact` après le résultat.
- **Garde-fous** : aucune donnée client, aucun nom, aucune durée présentée comme norme, aucun diagnostic médical ou juridique.

### 2. Grille d’entretien par situations de travail

- **Promesse complète** : fournir des cas fictifs de pièce absente, règle contradictoire, exception et décision, avec une grille d’observation des raisonnements.
- **Valeur** : évaluer une situation de travail et l’explicitation d’une règle, jamais un profil psychologique.
- **Condition** : distinguer le contenu employeur des nombreux résultats destinés aux candidats ; aucune prétention prédictive sur la réussite ou la rétention.

### 3. Canevas d’onboarding par règle écrite

- **Promesse complète** : transformer une consigne orale en frontière, proposition, validation, arrêt et jeu d’essai.
- **Valeur** : un livrable utilisable sans inscription, imprimable et réutilisable pour une tâche complète.
- **Condition** : ne pas promettre une montée en autonomie mesurée ; ne pas dupliquer l’article transmission.

### 4. Matrice de compétences par geste et décision

- **Promesse complète** : relier chaque geste à ce qui se prépare, se valide et se décide, puis identifier les compétences de contrôle et d’exception.
- **Condition** : attendre un référentiel primaire de branche daté. La page Atlas seule ne suffit pas à produire une taxonomie normative.

## Maillage retenu

Il n’y a ni hub public ni page de rubrique dans cette vague. Le maillage s’appuie sur le pilier de tâches existant, les pages commerciales canoniques et les liens croisés entre les trois articles.

### Liens entrants à créer

| Depuis | Vers | Ancre proposée | Placement |
|---|---|---|---|
| `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` | article charge | `repérer où la répétition absorbe le flux` | Famille pilotage ou choix de la première tâche |
| `/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils` | article charge | `observer le flux avant de choisir une réponse` | Passage sur le relevé de la tâche |
| `/blog/suivre-la-production-sociale-dans-excel` | article charge | `mesurer les états du flux sans classer les personnes` | Passage sur les agrégats et la charge |
| `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` | article IA | `ce que l’automatisation prépare et ce qui reste humain` | Frontière entre préparation et décision |
| `/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils` | article IA | `partir de la règle plutôt que de l’outil` | Passage sur le choix du véhicule |
| `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` | article transmission | `rendre une règle de cabinet transmissible` | Passage sur le savoir-faire du cabinet |
| `/a-propos` | article transmission | `de la consigne orale à la règle écrite` | Une seule occurrence dans le passage sur le savoir-faire |

Ces liens entrants sont des instructions d’intégration, pas des modifications à appliquer depuis cette carte. Le parent du cluster doit les ajouter par la forge, puis repasser le scellement des pages touchées.

### Liens sortants des trois articles

| Article | Liens canoniques obligatoires | Liens croisés |
|---|---|---|
| Charge | pilier des tâches, `/methode`, `/automatisation-cabinet-comptable`, glossaire `règle de cabinet` et `agrégat non nominatif` | IA/compétences ; transmission |
| IA/compétences | pilier des tâches, `/methode`, `/garanties`, `/automatisation-cabinet-comptable`, glossaire `règle de cabinet` et `validation humaine` | charge ; transmission |
| Transmission | `/methode`, `/garanties`, `/automatisation-cabinet-comptable`, glossaire `règle de cabinet` et `validation humaine` | charge ; IA/compétences |

Chaque lien doit être contextuel. Aucun article ne réexplique intégralement le pilier, la méthode ou le service.

## Matrice de cannibalisation

| Surface existante | Conflit possible | Niveau | Arbitrage obligatoire |
|---|---|---:|---|
| `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` | Liste de tâches et choix de ce qui s’automatise | Élevé | Les trois nouveaux articles traitent une décision et une preuve, jamais une nouvelle carte |
| `/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils` | Relevé de la tâche et choix du véhicule | Moyen à élevé | Charge observe les états ; IA définit la frontière ; aucun récit d’adoption |
| `/blog/suivre-la-production-sociale-dans-excel` | Charge et pilotage agrégé | Élevé pour l’article charge | L’article existant garde le tableau de bord social ; le nouveau reste transversal |
| `/methode` | Règle écrite et jeu fictif | Moyen | Les articles montrent une application ; ils lient la méthode au lieu de répéter les quatre étapes de mission |
| `/automatisation-cabinet-comptable` | Promesse commerciale et prise en charge | Élevé pour tout faux pilier | Un seul lien après la valeur ; aucun second pilier de service |
| `/a-propos` | Savoir-faire, temps et bras | Faible à moyen | L’article transmission apporte une méthode et un jeu fictif ; la page de marque reste institutionnelle |
| Articles paie, DSN, saisie et relance | Exemples de préparation et validation | Faible | Les citer comme preuves concrètes seulement, sans déplacer leur intention métier |

## Première vague — exactement trois briefs

### Brief 1 — charge de travail

- **Slug existant à conserver** : `/blog/cabinet-comptable-surcharge-de-travail-ou-passe-le-temps`
- **Requête principale** : `charge de travail cabinet comptable`
- **Requêtes secondaires regroupées** : `surcharge de travail cabinet comptable`, `organisation cabinet expertise comptable`, `plan de charge cabinet comptable`
- **Titre SEO** : `Charge de travail en cabinet comptable : diagnostic | Memlia`
- **H1** : `Charge de travail en cabinet comptable : où passe le temps ?`
- **Intention** : diagnostiquer avant de réorganiser, former, recruter, sous-traiter ou automatiser.
- **Audience** : dirigeant et responsable de production.
- **Promesse** : classer un flux fictif en répétition, attente, exception et décision, puis choisir une première règle à examiner sans mesurer les personnes.
- **Information nouvelle** : un journal fictif fermé sur quatre états et une matrice fréquence, stabilité, coût du doute ; aucun concurrent n’est crédité d’un manque non vérifié.

Structure H2 :

1. `Réponse directe`
2. `Pourquoi la surcharge ne se lit pas dans une liste de tâches`
3. `Quatre endroits où le temps disparaît`
4. `Mesurer le flux sans surveiller les personnes`
5. `La règle écrite`
6. `Rejoué sur le jeu fictif`
7. `Choisir la première répétition à observer`
8. `Ce que l’automatisation ne résout pas`
9. `Les erreurs à éviter`
10. `Pour aller plus loin`
11. `Sources`

Sources autorisées :

- **Apec × Conseil supérieur de l’Ordre, 9 décembre 2021** : seulement pour écrire qu’en décembre 2021 les institutions situaient leur partenariat dans un contexte de tensions sur l’emploi cadre, en particulier sur les fonctions d’expertise comptable.
- **OEC Paris, 11 janvier 2023** : seulement comme article résumant un livre blanc intersectoriel ; aucun effet propre aux cabinets, à la charge ou à l’automatisation.
- **OPCO Atlas, page consultée le 21 septembre 2026** : contexte qualitatif de la branche expertise comptable, CAC et audit ; aucune équivalence automatique entre transition numérique et IA.

Liens internes : pilier des tâches, article IA, article transmission, `/methode`, `/automatisation-cabinet-comptable`, glossaire `règle de cabinet` et `agrégat non nominatif`.

CTA : `Confier cette tâche` vers `/contact`. Le texte dit que nous observons la répétition avec l’équipe, écrivons sa règle, l’automatisons dans les outils du cabinet et la faisons recetter ; le cabinet garde la décision et n’envoie aucun fichier.

Corrections obligatoires sur le candidat hashé :

- ligne 72 : remplacer le présent `Le contexte de branche est tendu` par la formulation Apec explicitement datée de décembre 2021 ;
- ligne 102 : introduire `dans le livre blanc intersectoriel résumé par l’OEC Paris en 2023` et ne tirer aucune causalité sur la charge ou l’automatisation ;
- ligne 161 : attribuer la montée en compétences à la page de branche Atlas, la qualifier de constat qualitatif et ne pas la présenter comme un effet de l’IA ;
- conserver les gardes sur les agrégats, l’absence de diagnostic de santé au travail et l’absence de promesse de gain ;
- après correction : recalculer les claims, figer le candidat, produire de nouveaux hashes et relancer une revue indépendante complète.

### Brief 2 — intelligence artificielle et compétences

- **Slug existant à conserver** : `/blog/intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain`
- **Requête principale** : `métier comptable intelligence artificielle compétences`
- **Requêtes secondaires** : `intelligence artificielle cabinet comptable`, `compétences métier comptable automatisation`
- **Titre SEO** : `Intelligence artificielle et métier comptable | Memlia`
- **H1** : `Intelligence artificielle et métier comptable : ce qu’elle prépare, ce qui reste humain`
- **Intention** : comprendre la frontière d’un dispositif automatisé dans un cabinet.
- **Audience** : dirigeant, responsable formation et référent outils.
- **Promesse** : montrer trois familles de préparation et une frontière explicite entre proposition, validation, décision et arrêt.
- **Information nouvelle** : trois cas fictifs, dont une ambiguïté et une règle absente, avec sortie attendue plutôt qu’une liste spéculative d’emplois remplacés.

Structure H2 :

1. `Réponse directe`
2. `Pourquoi remplacer est la mauvaise unité de mesure`
3. `Ce que le dispositif peut préparer`
4. `Ce qu’il ne garantit pas`
5. `La règle écrite`
6. `Rejoué sur le jeu fictif`
7. `Ce que cela change pour les compétences`
8. `Les erreurs à éviter`
9. `Pour aller plus loin`
10. `Sources`

Sources autorisées :

- **OPCO Atlas** : transition numérique, montée en compétences, gestion de données, cybersécurité, conseil et automatisation future, toujours attribués à une page de branche qualitative et non datée ; le passage sur l’automatisation reste prospectif.
- **Apec × Conseil supérieur de l’Ordre, 9 décembre 2021** : contexte historique daté uniquement.
- **OEC Paris 2023** : transmission et évolution des savoir-faire dans un livre blanc intersectoriel résumé par l’Ordre régional ; aucune preuve d’un effet propre aux cabinets.
- **Méthode Memlia** : la frontière proposition/validation et l’arrêt dans le doute sont des principes de conception Memlia, pas des conclusions attribuées à Atlas.

Liens internes : pilier des tâches, article charge, article transmission, `/methode`, `/garanties`, `/automatisation-cabinet-comptable`, glossaire `règle de cabinet` et `validation humaine`.

CTA : `Confier cette tâche` vers `/contact`, pour une répétition déjà choisie ; aucune promesse d’emploi supprimé, de temps gagné ou de montée en compétences.

Corrections obligatoires sur le candidat hashé :

- ligne 60 : remplacer la capacité générale de `l’IA` par `dans le dispositif décrit ici, l’automatisation peut être conçue pour…` ;
- ligne 68 : garder `transition numérique` comme terme Atlas, rappeler la portée branche EC/CAC/audit et ne pas le remplacer par IA ;
- ligne 70 : dater le constat Apec au 9 décembre 2021 ; qualifier la publication OEC de résumé d’un corpus intersectoriel ;
- ligne 144 : présenter la phrase Atlas comme un passage prospectif non daté, sans horizon ni proportion ;
- ligne 146 : transformer la réaffectation du temps en hypothèse locale à mesurer après recette, sans gain ni progression de compétences présumés ;
- séparer visuellement les faits attribués des choix de conception Memlia ;
- après correction : recalculer les claims, figer le candidat, produire de nouveaux hashes et relancer une revue indépendante complète.

### Brief 3 — transmission du savoir-faire

- **Slug existant à conserver, sans en créer un autre** : `/blog/fideliser-collaborateurs-cabinet-comptable-ecrire-savoir-faire`
- **Requête principale corrigée** : `transmission savoir cabinet comptable`
- **Vocabulaire secondaire dans le corps seulement** : `fidéliser collaborateurs cabinet comptable`, `turnover cabinet comptable`
- **Titre SEO** : `Transmission du savoir-faire en cabinet comptable | Memlia`
- **H1** : `Transmission du savoir-faire en cabinet comptable : de la consigne orale à la règle écrite`
- **Intention** : rendre une manière de travailler relisible et maintenable.
- **Audience** : dirigeant, chef de mission et responsable formation.
- **Promesse** : transformer une consigne orale fictive en déclencheur, conditions, proposition, validation et refus, sans rigidifier le jugement.
- **Information nouvelle** : quatre cas de transmission, dont un cas ressemblant au courant mais absent de la règle ; la sortie est un refus lisible, pas une promesse RH.

Structure H2 :

1. `Réponse directe`
2. `Pourquoi une consigne orale se transmet mal`
3. `Écrire sans rigidifier le métier`
4. `La règle écrite`
5. `Rejoué sur le jeu fictif`
6. `Ce qui devient plus facile à transmettre`
7. `Ce qui reste une décision humaine`
8. `Ce que cette méthode ne permet pas de conclure sur la fidélisation`
9. `Les erreurs à éviter`
10. `Pour aller plus loin`
11. `Sources`

Sources autorisées :

- **Apec × Conseil supérieur de l’Ordre, 9 décembre 2021** : uniquement pour le contexte historique daté des tensions sur l’emploi cadre et les fonctions d’expertise comptable.
- **OEC Paris, 11 janvier 2023** : transmission des savoir-faire et compétences dans le livre blanc intersectoriel résumé par l’article ; ne pas présenter ce corpus comme une étude de cabinets ni comme une preuve de fidélisation.
- **Aucune source Atlas** si aucun claim Atlas ne subsiste dans le corps.
- **Garde de non-causalité** : écrire le savoir-faire ne permet pas, à lui seul, de conclure à un effet sur la fidélisation.

Liens internes : article charge, article IA, `/methode`, `/garanties`, `/automatisation-cabinet-comptable`, glossaire `règle de cabinet` et `validation humaine`.

CTA : `Confier cette tâche` vers `/contact`, centré sur la consigne à rendre transmissible. Il ne mentionne ni fidélisation, ni rétention, ni résultat RH.

Corrections obligatoires sur le candidat hashé :

- frontmatter lignes 2 à 5 : remplacer le titre, le titre d’onglet, le résumé et la description par le territoire transmission ; aucune relation causale ou promesse de fidélisation dans les métadonnées ;
- ligne 13 : remplacer la requête principale par la formulation transmission mesurée, malgré l’absence de suggestion exacte ;
- lignes 36 à 39 : utiliser le CTA canonique `Confier cette tâche` et décrire la prise en charge de la consigne, pas un résultat RH ;
- ligne 62 : remplacer la liste présentée comme facteurs causaux par la limite du registre : les sources contrôlées évoquent plusieurs dimensions dans des périmètres différents et ne permettent pas d’isoler l’effet d’un levier ;
- ligne 64 : dater Apec au 9 décembre 2021 et présenter l’OEC 2023 comme résumé d’un livre blanc intersectoriel ;
- ligne 86 : même qualification intersectorielle, sans conclure à un effet sur la fidélisation ;
- ligne 141 : ne pas présenter l’énoncé OEC comme mesure propre aux cabinets ; conserver l’absence de causalité ;
- section Sources, lignes 169 à 172 : ajouter l’Apec effectivement citée et retirer Atlas si aucun claim Atlas ne subsiste ;
- conserver le slug existant pour respecter la décision d’architecture : pas de second candidat, pas de redirection et pas de canonical concurrent ;
- après correction : recalculer les claims, figer le candidat, produire de nouveaux hashes et relancer une revue indépendante complète.

## Contrat de reprise pour le parent du cluster

Le parent `t_2d164da6` doit reprendre les recettes existantes. Il ne doit ni créer un quatrième article, ni créer un nouveau slug, ni ouvrir un hub recrutement.

Ordre d’exécution :

1. appliquer les corrections P1 ci-dessus dans les recettes, jamais directement dans un candidat généré ;
2. régénérer les candidats et leurs claims ;
3. vérifier que les sources listées correspondent exactement aux citations encore présentes ;
4. figer les versions corrigées et recalculer les hashes ;
5. relancer une revue indépendante sur ces versions exactes ;
6. ne sceller que si chaque claim est soutenu dans sa portée, si la revue qualité atteint le seuil de la forge et si aucun P0 ne subsiste ;
7. respecter l’autorisation séparée sur les couvertures et l’arrêt avant production déjà décidé par Kevin ;
8. ne publier qu’après le GO humain prévu par le chantier et dans les plafonds de la forge.

Aucun élément de ce document ne constitue un GO de publication.

## Mesure après publication

Pendant huit semaines, relever séparément :

- impressions et clics GSC sur `charge`, `surcharge`, `turnover`, `fidéliser`, `transmission`, `compétences`, `intelligence artificielle` et les URL des trois articles ;
- requêtes candidat ou emploi qui indiqueraient un mauvais ciblage ;
- liens internes entrants réellement déployés et pages orphelines ;
- clics vers `/methode`, `/automatisation-cabinet-comptable` et `/contact`, sans attribuer une conversion au dernier clic sans preuve ;
- demandes qualifiées mentionnant charge, règle transmissible ou frontière humain/automatisation.

Réévaluer une rubrique seulement si les trois pages reçoivent une demande propriétaire cohérente et si la page de rubrique peut répondre à une intention autonome. Sinon, maintenir le maillage plat.
