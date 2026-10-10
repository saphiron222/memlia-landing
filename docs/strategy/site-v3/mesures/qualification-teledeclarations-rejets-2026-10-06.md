# Qualification — télédéclarations et rejets

Décision du 6 octobre 2026 : ne pas ouvrir /automatisation/teledeclarations-rejets à ce stade. Rattachement commercial documentaire à /automatisation-cabinet-comptable. La famille reste active ; sa qualification ne crée ni redirection, ni canonical HTML, ni nouvelle requête réservée.

## Demande

Huit sondes d’autocomplétion Google fr-FR réussies, huit listes vides, aucune suggestion. Amorce commerciale exacte : « automatisation suivi rejets télédéclarations cabinet comptable ». Autres sondes : suivi rejets télédéclarations ; rejet EDI TDFC ; suivi télédéclaration ; accusé réception EDI ; logiciel suivi télédéclarations ; jedeclare suivi rejets ; télédéclaration EDI EFI. Mesures brutes dans teledeclarations-rejets-mesures-2026-10-06.json.

Aucun volume mensuel mesuré. Une liste vide ne prouve pas une demande nulle. Ce relevé n’établit pas une intention commerciale distincte de confier la consolidation des retours.

## Besoin et offre native

Le besoin métier est tangible : rapprocher dossier, période, envoi et compte rendu ; repérer les rejets, les retours absents ou contradictoires et présenter une file de traitement. Il ne faut pas confondre transmission et acceptation.

ECMA documente déjà le suivi natif jedeclare, sur sa page produit ouverte dans le navigateur le 06/10/2026 :

- « Suivre facilement chaque déclaration jusqu'à son acceptation par le destinataire »
- « Tableau de bord : suivi en un coup d’œil de la transmission, de l’acceptation ou du rejet de toutes les déclarations »
- « Alertes mail ou SMS en cas de déclaration non déposée, rejetée ou déposée après échéance »

Source : https://ecma-solutions.com/produits-expert-comptable/jedeclare

Cela documente une offre de suivi et d’alertes, pas une compatibilité Memlia, pas une couverture EFI ni une consolidation multi-portails testée. Si ce suivi natif suffit, ne pas reconstruire sa mécanique. Le différentiel potentiel de Memlia serait une file unifiée entre sources hétérogènes, sur règles du cabinet, dont le besoin commercial reste à établir.

## Sources officielles ouvertes

DGFiP, https://www.impots.gouv.fr/linformation-entre-le-partenaire-edi-et-la-dgfip, HTTP 200 le 06/10/2026, page mise à jour le 16/07/2019 :

« des comptes rendus : un compte rendu de rejet syntaxique (message CONTRL) est adressé, en cas d'erreur, au partenaire EDI émetteur après réception et lecture de chaque transmission. Il est envoyé via le support utilisé par le partenaire EDI pour émettre les données. »

« Un compte rendu de traitement (message INFENT CR) détaillant le statut de chaque dépôt transmis (acceptation, rejet partiel ou total) est adressé au partenaire EDI émetteur après traitement d'intégration de chaque transmission. Il est envoyé via le support utilisé par le partenaire EDI pour émettre les données. »

Ces extraits établissent des retours distincts et des rejets partiels/totaux en EDI, pas un modèle commun EFI.

DGFiP, https://www.impots.gouv.fr/cahier-des-charges-edi-tdfc-0, HTTP 200 le 06/10/2026, page modifiée le 07/04/2026 :

« Le cahier des charges de la procédure TDFC rédigé par la Direction générale des finances publiques décrit les flux électroniques qu'elle échange avec les partenaires EDI. »

La page donne les documents de campagne 2026. Aucun code de rejet ni délai réglementaire n’est inventé ; les volumes techniques ne sont pas analysés dans cette qualification.

## Frontière de la piste

| Préparé seul après vérification des accès | Attend une validation | Reste humain |
|---|---|---|
| Rapprocher les références exactes et présenter une file de retours avec leur provenance | Résoudre un rapprochement ambigu, un retour absent ou contradictoire ; qualifier une action proposée | Interprétation fiscale, correction des données, dépôt ou nouveau dépôt, paiement et clôture du rejet |

L’absence de retour ne vaut jamais acceptation. Aucun statut fiscal n’est déduit d’un transport réussi. Les traces de saisies humaines ne sont pas écrasées. Les retours DSN et la gestion des échéances fiscales sont hors de cette piste ; l’EFI exige sa propre preuve d’accès et de statut.

## Anti-cannibalisation

Aucune occurrence EDI/télédéclaration/rejet retrouvée dans le registre de requêtes courant. La famille existe dans src/data/familles.ts. Quatre angles du backlog sont des pistes informationnelles, avec mesures nulles du 19/09, et non quatre articles acquis ni quatre services à ouvrir :

- suivre-la-liasse-edi-tdfc-et-ses-rejets
- checklist-avant-le-depot-d-une-teledeclaration-edi
- les-rejets-edi-qu-un-suivi-automatique-ne-doit-pas-corriger-seul
- qu-est-ce-que-la-teletransmission-edi-tdfc-en-cabinet-comptable

Le service général reste le point commercial utile sans recopier le suivi natif. Aucun article propriétaire publié spécifique n’a été identifié dans les sources du dépôt ; les pistes restent distinctes de la DSN et des échéances.

## Vérification publique et limites

Service général HTTP 200 ; candidate HTTP 404, sans paramètre d’URL et avec Cache-Control: no-cache. Pas de modification publique, du registre partagé, du sitemap ou du chrome.

Firecrawl recherche et extraction refusées (403), reprise par curl et navigateur. Python urllib a rencontré le certificat local ; curl a repris sans désactiver TLS. La page jedeclare redirige vers ECMA et exige JavaScript : les extraits viennent du DOM rendu, pas du shell HTML. La recherche Google reçue en HTTP 200 ne contient qu’un écran de redirection : aucun classement SERP ni inventaire exhaustif concurrent revendiqué. Deux URL DGFiP devinées ont renvoyé 404 ; les bonnes pages ont été retrouvées dans le moteur du site puis ouvertes. Les sources sont consultées aujourd’hui mais leur ancienneté éditoriale est conservée.

## Réouverture et handoff

Réouvrir seulement avec un cas explicite de cabinet recopiant des états de plusieurs portails/exportations, insuffisance du suivi natif identifiée, preuve d’accès EDI et EFI distincte, et qualification d’une intention de délégation. Ne pas prendre une plainte de rejet isolé pour un besoin de service autonome.

L’enfant dev est réorienté vers l’intégration documentaire de cette qualification, des mesures et de la vérification dans docs/strategy/site-v3/mesures. Pas de page, recette, revue métier PASS ou scellement revendiqués : ces gates sont conditionnelles à une page retenue.
