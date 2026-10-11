# Qualification — annonces d’entrée et de sortie hors portail

Recadrage du 06/10/2026, remplaçant le dossier t_9b2a2acb. Aucune nouvelle dépense ni mesure répétée.

## Demande conservée et besoin réduit

Les mesures d’autocomplétion originales du 06/10 sont conservées avec leurs URL et heures dans docs/strategy/site-v3/mesures/titres-intent-2026-10-06.json : aucune suggestion pour « automatisation entrées sorties salariés cabinet comptable » et « gestion entrées sorties salariés cabinet comptable » ; dix pour « délai remise solde de tout compte ». Ce signal informatif ne prouve ni volume ni demande commerciale. L’ouverture reste une expérience ; la requête primaire, la route et la frontière avec /automatisation/paie ne changent pas.

La qualification initiale avait ouvert les sites Silae, l’aide sur les documents et bulletins, et Azenflow. Elle est remplacée sur la couverture fonctionnelle par l’étude de Kevin du 06/10, copiée sous preuves/etude-couverture/, et les deux pages éditeurs ouvertes lors du présent recadrage :

- https://www.silae.fr/solution-rh-paie/gestion-des-salaries/ : portail d’entrée, collecte et relances, synchronisation/création de fiche salarié, DPAE générée et transmise, circuit de sortie.
- https://payfit.com/fr/gestion-du-personnel/ : génération de contrats, signature Yousign, dépôt de pièces et rappels, préparation des départs.

Ce sont des capacités documentées, pas une démonstration de l’installation du cabinet. L’édition, les options et le circuit utilisé doivent être vérifiés. Une fonction non trouvée ne vaut pas absence. Aucun besoin supplémentaire n’est vendu face à un circuit mySilae déjà utilisé.

## Décision

Retenir uniquement les annonces reçues par e-mail ou dans un compte rendu écrit après appel, hors circuit existant et non déjà reprises par l’outil. Réunir les informations et contradictions ; préparer les champs de DPAE et de fiche salarié pour une entrée, une synthèse d’information pour une sortie. Aucun calcul social, génération de contrat ou document final, signature, création effective ou transmission. Les décisions et le circuit déclaratif restent au cabinet.

## Preuve réellement exécutée

Le script preuves/rejouer.mjs utilise sept jeux structurés fictifs. Il compare chaque résultat complet à l’attendu et vérifie l’invariance de l’entrée : entrée e-mail, sortie consignée, manque, conflit de dates, hors règle, portail déjà traité, appel sans compte rendu. Il interdit une DPAE de sortie. Deux cas produisent des propositions fictives à valider ; cinq ne produisent aucune préparation finalisée.

Ce test ne démontre pas une extraction, une écoute téléphonique, une détection réelle de doublon, une connexion, une traçabilité réelle par champ ou une transmission. Ces capacités sont à recetter avant utilisation. Les champs ne constituent pas une checklist réglementaire.

## Livraison

Revue indépendante du nouveau fond : revues.json, PASS. Scellement par la forge après lecture du verdict. Le relecteur a franchi les assertions en lecture seule puis rencontré le refus d’écriture volontaire du fichier rejeu.json ; le rejeu auteur a terminé avec code 0.

service:preparer, service:sceller et service:audit PASS ; tests service-couverture et service-forge : vingt PASS. Aucun rendu HTML ni build réalisé sur cette phase ; le test conditionnel de présence du bloc dans le HTML n’est donc pas exercé. L’intégration, la preuve HTML spécifique aux sept cas et la QA de production relèvent de t_a487210f, après le gel de publication maintenu.

Le paquet ne remplace pas les fichiers partagés de main : fusionner seulement l’entrée entrees-sorties-salaries de couverture, les trois mesures d’origine et la réservation de requête. HANDOFF.md décrit le résultat livré et cette fusion ciblée.
