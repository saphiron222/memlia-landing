# Revue métier IA R3 — Hub Ressources et Glossaire

Carte `t_e9292ec4`. 16 septembre 2026. Revue en lecture seule : aucun contenu, code, manifeste ni source n'a été modifié.

**VERDICT : FAIL — un défaut P1 sur une affirmation juridique sensible.**

Le reviewer est un agent, pas un professionnel diplômé de la paie ou du droit social. Ce verdict établit la traçabilité des affirmations vers leurs sources primaires ; il ne vaut pas attestation juridique.

## Candidat revu

Branche `site/ressources-r3`, commit `dc5b2ba`, base `main` au commit `de3d821`. Deux surfaces : Hub Ressources et Glossaire. 49 affirmations enregistrées, dont 25 sensibles au sens du contrat, réparties en 9 sur le Hub et 40 sur le Glossaire.

## Fraîcheur des sources — le jour du run

Les 12 sources déclarées ont été rouvertes le 16 septembre 2026. Trois sont des surfaces internes de Memlia ; les 9 sources externes répondent toutes en HTTP 200.

Les instantanés scellés sont des extraits, pas des captures de page entière : une comparaison d'empreinte n'a donc aucun sens. Le contrôle appliqué est le bon : **le passage cité est-il encore présent dans la page d'aujourd'hui ?** Résultat, 26 passages cités sur 28 sont retrouvés mot pour mot.

Deux mises en garde sur l'instrument lui-même, car il a d'abord menti :

- un repli d'encodage mal ordonné décodait une page en cp1252 et produisait des accents cassés ; toutes les phrases accentuées ressortaient alors comme absentes ;
- l'extraction du texte insère un espace à chaque frontière de balise, si bien que « traitées (minimisation » devenait « traitées ( minimisation ».

Avec ces deux défauts, le premier passage rendait 20 passages sur 50 et aurait fait conclure à un effondrement des sources. Après correction — détection du jeu de caractères déclaré, et comparaison sur une forme sans espaces ni accents — le compte réel est de 26 sur 28. **Les deux écarts restants sont donc des écarts vrais, pas des artefacts.**

## Les deux écarts

**Écart 1, artefact d'extraction du 14 septembre, sans conséquence.** L'instantané de la définition CNIL de la donnée personnelle porte « Une personne physique peut être identifiée directement ou indirectement. » La page d'aujourd'hui écrit la même chose sous forme de liste : « Une personne physique peut être identifiée : directement (exemple : nom et prénom) ; indirectement (exemple : par un numéro de téléphone ou de plaque d'immatriculation) ». Le sens est identique ; l'extracteur du 14 avait aplati la liste. L'affirmation `claim-t-donnee-personnelle-context` reste soutenue.

**Écart 2 — P1-R3-01, la page CNIL a changé de formulation.** L'instantané du 14 septembre porte « Sauf exception (par exemple, lorsqu'un dispositif de contrôle est imposé par la loi), un dispositif de contrôle de l'activité du personnel doit cumulativement : ». La page du 16 septembre écrit « Pour être licite (c'est-à-dire autorisé par la loi), un dispositif de contrôle de l'activité du personnel doit cumulativement : satisfaire aux tests de justification et de proportionnalité ; être soumis aux instances représentatives du personnel selon les règles en vigueur ; être porté à la connaissance des salariés ».

L'affirmation `claim-h-social-monitoring-summary-2` dit : « **Sauf exception légale**, un dispositif de contrôle de l'activité du personnel doit être justifié et proportionné. »

La substance — justification et proportionnalité exigées — reste exacte et soutenue. **C'est le qualificatif qui n'a plus de source.** La page ne concède aujourd'hui aucune exception légale à ces deux tests ; elle les pose comme conditions cumulatives de licéité. Elle mentionne seulement que des règles particulières peuvent s'ajouter selon le dispositif, ce qui est l'inverse d'une dispense.

Un cabinet lisant cette page pourrait en déduire qu'un dispositif imposé par la loi échappe aux tests de justification et de proportionnalité. La source ne le dit pas. Sévérité **P1** : l'affirmation affaiblit une exigence sans preuve, sans pour autant énoncer un fait faux sur le fond.

## Les 25 affirmations sensibles

24 sur 25 sont soutenues par leur source primaire relue aujourd'hui. Cinq avaient un soutien lexical faible et ont été examinées une par une :

| Affirmation | Jugement |
|---|---|
| `claim-t-annule-et-remplace-dsn-commonConfusion` | soutenue : la source distingue elle-même la DSN mensuelle, qui a une échéance, du signalement d'événement, qui n'en a pas |
| `claim-t-donnee-personnelle-commonConfusion` | soutenue par déduction directe : remplacer le nom est une pseudonymisation, et la source qualifie la pseudonymisation de traitement de données personnelles |
| `claim-t-donnee-personnelle-exampleFictitious` | soutenue : la source décrit le remplacement des données directement identifiantes par des données indirectement identifiantes, et maintient le caractère personnel |
| `claim-t-pseudonymisation-context` | soutenue, même raisonnement |
| `claim-t-recouvrement-amiable-commonConfusion-sequence` | soutenue mot pour mot : « généralement par une relance puis, en cas d'échec, par une mise en demeure » |

Le soutien lexical seul n'a jamais servi de preuve : il a seulement servi à choisir quoi lire.

## Les six critères de la grille qualité

La revue technique `t_8f07fd85` a établi que le script de scellement écrit `PASS` pour ces six critères sans qu'aucun chemin mène à `FAIL`. Cette revue ne les hérite donc pas. Verdict indépendant :

| Critère | Poids | Verdict de cette revue | Motif |
|---|---:|---|---|
| intent-satisfaction | 20 | PASS | les deux surfaces répondent à une tâche nommée, avec filtres par rôle et par format ; parcours vérifié à l'écran |
| serp-format-rankability | 15 | ND | aucune donnée SERP fournisseur ; l'indisponibilité est documentée |
| eeat-sources | 20 | PASS | 9 sources externes, toutes officielles de premier niveau, rouvertes ce jour, 26 passages cités sur 28 retrouvés |
| information-gain-proof | 20 | **ND** | aucun corpus concurrent n'a été comparé ; le gain d'information est affirmé, pas mesuré |
| technical-onpage-seo | 10 | PASS | un seul `h1`, canonical, schéma, aucun débordement de 320 à 1920 pixels, 98 tests navigateur au vert |
| ai-citability | 10 | PASS | définitions autonomes, réponses directes, sources nommées dans le corps |
| contextual-conversion | 5 | PASS | appel à l'action unique, sans promesse au-delà des modules livrés |

**Score recalculé indépendamment : 65 points bruts acquis sur 65 mesurables, soit 100 normalisé ; mais 65 sur 100 en brut, avec 35 points non déterminés.**

Ce résultat diffère de celui du candidat, qui ne déclarait qu'un seul critère non déterminé. La différence porte sur `information-gain-proof` : le candidat le déclare `PASS` sur la foi d'un build réussi, alors qu'établir un gain d'information demande de comparer à ce qui existe déjà. Aucune comparaison n'a été produite. Cette revue le classe donc **ND**, conformément à la consigne de ne pas hériter d'un `PASS` non établi.

## Conséquence

`AI_REVIEW_PASS` exige zéro P1 et aucun critère sensible non déterminé. Les deux conditions manquent :

1. le défaut **P1-R3-01** ci-dessus, qui est **corrigeable** : il suffit d'aligner le qualificatif de l'affirmation sur la formulation actuelle de la source ;
2. un second critère de la grille passé en **ND** faute de mesure, ce qui n'est pas un défaut mais une donnée absente.

La doctrine retenue pour ce chantier distingue les deux : un défaut factuel se corrige avant publication ; un score amputé par des données absentes ne bloque pas, à condition que la limite reste visible et que le contenu soit publié comme non attesté. Le premier point doit donc être corrigé ; le second se déclare.

## Ce que cette revue n'a pas fait

Aucune modification de contenu, de manifeste, de source ou de code. Aucun `AI_REVIEW_PASS` écrit. Aucune preuve réseau nouvelle au-delà de la relecture des 9 sources. Aucun push, preview ni publication.
