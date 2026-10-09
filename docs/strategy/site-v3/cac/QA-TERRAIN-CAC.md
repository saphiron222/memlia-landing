# QA indépendante — Terrain CAC

## Verdict : PASS

Le livrable satisfait les exigences de recherche terrain communiquées pour la carte : au moins 60 extraits datés et sourcés, rattachement aux 25 tâches du support, vocabulaire, irritants, questions, outils et saisonnalité. Il est exploitable comme document interne de recherche, avec les limites de preuve annoncées. Aucun défaut bloquant relevé.

## Contrôles effectués

- **Volume, traçabilité et cohérence** : recomptage indépendant de `terrain-verbatims.json` : **70 citations distinctes, 23 URL et 25 tâches couvertes**. Les comptes par type, nature de date et tâche concordent exactement avec `terrain-controle.json`. Les citations, URL, dates, types de date, tâches et réserves individuelles concordent entre la banque JSON et `TERRAIN-CAC.md`.
- **Fidélité** : les **70 citations** sont présentes dans les textes sources archivés, après les seules normalisations d’espaces et Unicode NFC annoncées. Le script original `validate-quotes.py` a été lu, mais n’a pas été exécuté afin de ne pas régénérer de fichiers ; le contrôle indépendant a été exécuté en lecture seule et a retourné **zéro erreur**.
- **Dates** : les **13 extraits de messages humains** ont été confrontés à la date du message individuel précédant leur citation dans les quatre fils archivés, et non à la date globale du fil : tous concordent. Les dates de publication/modification des autres sources sont étayées par les métadonnées HTML ou les dates visibles ; septembre 2022 et août 2026 restent correctement au mois. Les **9 dates de consultation** sont explicitement distinguées d’une publication connue, sans prétendre dater le propos d’origine.
- **Vidéo** : l’identifiant `81ayKiM3K0c`, l’URL et la date de publication du **22 septembre 2026** concordent avec `video-terrain.info.json`. Les trois extraits sont retrouvés dans les sous-titres archivés et leur contexte horodaté. Les plages indiquées sont des repères approximatifs de passage, pas un minutage audio certifié. Leur statut de sous-titres automatiques, le contexte en francs CFA et l’absence de vérification audio sont explicites.
- **Anonymisation de la restitution** : aucune identité individuelle, aucun pseudonyme, aucune coordonnée ni aucun montant d’entreprise repris dans les 70 citations. Les liens sources restent publics et identifiants pour les publications d’origine ; le document ne prétend pas garantir leur anonymat. Les copies brutes sont distinguées de la restitution.
- **Rattachement aux tâches** : les identifiants correspondent tous exactement à `/Users/kevinkitanga/dev/interne/memlia-rdv/src/donnees/cac/taches.json`. Lecture qualitative des rattachements et des réserves : cohérents pour une couverture descriptive du vocabulaire, sans présenter cette couverture comme une validation des fonctionnalités ou de la demande.
- **Qualité des conclusions** : distinction maintenue entre praticiens, cabinets, éditeurs, institutions et proxies EC/OTI/avocat/vidéo. Les messages anciens, les sources non indépendantes, la faiblesse de certaines tâches et les limites de collecte sont visibles. Les 70 extraits ne sont pas présentés comme 70 entretiens ; les questions de découverte ne sont pas attribuées à des praticiens. Saisonnalité et outils historiques ne deviennent pas des faits CAC universels.

## Défauts bloquants

**Aucun.**

## Périmètre

Revue unique du contenu et des preuves locales conservées, sans modification des trois livrables ni des sources. Pas de revue juridique : les citations servent au langage et aux gestes, et aucune règle réglementaire n’est validée ici. Ce PASS ne certifie ni une enquête représentative, ni l’audio de la vidéo, ni une PR, sa CI ou sa fusion. Aucun outil kanban utilisé ; carte laissée ouverte.
