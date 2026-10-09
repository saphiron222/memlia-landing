# Collecte et relance des pièces : conserver le parcours existant

Décision du 6 octobre 2026 — carte t_3f4202bc, vague 3 rang 23.

## Décision

Ne pas ouvrir `/automatisation/collecte-pieces` à ce stade. Le besoin de collecte et de relance est identifiable, mais la recherche ne confirme pas encore une intention distincte de confier sa prise en charge à Memlia. Conserver la méthode dans `/blog/automatiser-la-relance-des-pieces-clients` et la délégation dans `/automatisation-cabinet-comptable`, puis `/contact`. Cette décision porte sur une page supplémentaire, pas sur la possibilité de prendre cette tâche en charge.

La requête longue candidate et les formulations d’automatisation n’ont aucune suggestion. La seule suggestion obtenue porte sur la collecte générique. Les pages de Dext et MyCompanyFiles confirment un marché d’outils de collecte et un vocabulaire de relance ; elles ne prouvent ni une demande de prestation sur mesure ni une lacune concurrentielle. Une liste vide n’est pas une preuve d’absence de besoin.

## Mesure réelle

Instrument du dépôt : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, Google client firefox, hl=fr et gl=fr. Mesure 06:19 UTC le 06/10/2026, huit réponses réussies, sept listes vides, une suggestion. Résultats complets : `autocomplete.json`. Aucun volume mensuel attribué.

| Sonde | Suggestions |
|---|---|
| automatisation collecte pièces clients cabinet comptable | aucune |
| automatisation collecte pièces comptables | aucune |
| collecte pièces comptables | collecte des pièces comptables |
| relance pièces clients cabinet comptable | aucune |
| logiciel collecte pièces comptables | aucune |
| automatiser relance pièces comptables | aucune |
| collecte documents expert comptable | aucune |
| service collecte pièces comptables | aucune |

Le backlog du 19/09 donnait zéro suggestion à la famille. La nouvelle mesure apporte un signal générique, pas un signal commercial confirmé. Ne pas transformer le nombre de suggestions en recherches mensuelles. La sonde courte n’est pas une réservation d’intention pour une nouvelle URL.

## Besoin et concurrence

Sources ouvertes au navigateur le 06/10, puis récupérées en HTML HTTP 200 ; extraits dans `sources-ouvertes.json`, HTML dans `sources/`.

Dext, https://dext.com/fr : « Vos clients peuvent vous transmettre leurs documents (factures, reçus, relevés bancaires...), via l’une de nos 4 méthodes de collecte : prise de photo depuis notre application mobile, connecteurs marchands, email dédié ou téléchargement de PDF. » La page annonce une collecte multicanal, pas la règle de complétude particulière d’un cabinet. Aucun essai de Dext réalisé ; aucune garantie d’intégration Memlia déduite de cette page.

MyCompanyFiles, https://www.mycompanyfiles.fr/experts-comptables/ : la collecte est présentée avec « «Je dois toujours relancer!» ». Ce langage rend l’irritant identifiable. C’est un message d’éditeur, pas un verbatim issu de nos entretiens et pas la preuve que ses relances traitent tous les cas de réception ou d’illisibilité. La page décrit un extranet de collecte et d’échanges. Aucun classement concurrentiel ni comparaison de qualité.

Conclusion : le cabinet peut déjà chercher un outil de collecte. Pour ouvrir une page de délégation différente, il faut documenter ce qui casse entre les outils existants et pourquoi une règle spécifique prise en charge répond mieux que le standard. Ce différentiel n’est pas établi ici. Il serait artificiel de le déduire uniquement d’une variante de titre.

## Séparation avec l’existant

L’article existant possède la requête « relance pièces manquantes cabinet comptable », et une secondaire « collecte de pièces comptables automatisée ». Sa recette décrit exactement le périmètre candidat : checklist conditionnelle, quatre états, cadence arrêtée à réception et envoi validé. Sa clôture propose déjà de confier la tâche, avec écriture, automatisation, recette et décision humaine. Le registre et le backlog confirment ce rattachement à `collecte-pieces`.

Une page de service distincte pourrait être légitime avec une intention commerciale et une preuve spécifiques ; elle n’est pas exclue par principe. Aujourd’hui, renommer le même jeu et ajouter prix/maintenance ne suffit pas à confirmer sa nécessité. Aucun article, H1, canonical, requête propriétaire ou maillage existant n’est déplacé. Les deux surfaces existantes répondent HTTP 200 et la candidate 404 lors des GET sans query string avec Cache-Control: no-cache.

## Rattachement utile

- Méthode / suivi des pièces : article existant, propriétaire de l’intention d’exécution.
- Prise en charge dans les outils du cabinet : service général existant ; description de la tâche au contact, pas de donnée client demandée.
- Pièces d’entrée d’un nouveau client : cadrage entrée en relation, sans confondre collecte périodique et onboarding.
- Extraction d’un document déjà reçu : saisie comptable, pas une seconde page de collecte.

Conserver ce périmètre dans une future qualification : attendu / reçu / lisible / hors période ; réception et lisibilité sont deux constats différents. Arrêter la cadence pour la pièce reçue, sans déclarer le dossier complet ni relancer une pièce déjà reçue à cause de son illisibilité. Une demande de remplacement éventuelle est une nouvelle proposition validée. Recontrôler les réceptions avant l’envoi pour invalider une relance préparée devenue inutile. Litige, pièce ambiguë ou règle manquante : arrêt et décision du cabinet.

## Critère de réouverture

Un entretien, une demande entrante ou une recherche accessible doit montrer un cabinet cherchant à faire prendre en charge ce circuit dans ses outils, avec un défaut concret du standard (réception intervenant entre préparation et envoi, checklist conditionnelle non couverte, traitement des pièces illisibles). Mesurer alors la formulation réelle et confirmer la différence de décision avec le blog. Produire seulement ensuite recette, neuf sections, rejeu exécuté et revue métier avant scellement.

Aucun entretien indépendant, volume, conversion, compatibilité ou classement SERP revendiqué. Firecrawl a répondu 403 ; Google a servi une page anti-robot et Bing a expiré. La collecte concurrentielle directe a été utilisée en alternative, sans présenter ces pages comme des résultats organiques classés.

## Livraison

Recette non retenue : `service:preparer`, revue métier et `service:sceller` non applicables. Aucun faux PASS, aucun faux rejeu créé. La carte enfant t_ff817158 est réorientée vers l’intégration documentaire de cette qualification : pas de page commerciale, de preuve visuelle, de réservation de requête, de mutation du blog ou de suivi de publication J+7/J+28.

Le paquet contient ce rapport, les mesures et les sources ouvertes, les GET publics, un vérificateur exécuté et les scripts utilisés. Le dépôt de travail part de origin/main ; aucun fichier du site n’a été modifié. L’enfant intègre les documents dans `docs/strategy/site-v3/qualifications/collecte-pieces/` en préservant les autres chantiers. Une seule revue QA documentaire de son changement suffit ; aucune nouvelle revue de fond n’est demandée pour une page inexistante.
