# Source ouverte pour bulletin-de-paie-sage

Consultée le 4 octobre 2026. URL : https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=220124154343280

[Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=220124154343280&hypermediatext=null#solutionTop) [Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=220124154343280&hypermediatext=null#main-content)

Back

# Découvrir la version 4.11 de Sage 100 Paie & RH

Created on 24 January 2022 \| Last modified on 04 April 2023

- PDF
- [Print](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=220124154343280&view=print "Print")
- Copy To Clipboard

## Summary

Cette fiche décrit les nouveautés contenues dans la v4.11 de Sage 100 Paie & RH (non hébergée)

## Description

Cette version est uniquement disponible **en téléchargement à partir de Sage Paie & RH v4**. **10**

Elle est accompagnée d'une nouvelle version de DS v12.11.

## Resolution

1. **Nouveautés :**

**1.1 Bulletin de rappel :**

\- Possibilité de réaliser plusieurs bulletins de rappels sur un même mois pour le même salarié

\- Ajout de l'option "bulletin de rappel" dans les états Livre de paie, état charges salariales et patronales, état des bases de cotisation ainsi que l'état CTP

\- Les périodes de rattachement (si elles existent) sont supprimées lors de la création d'un nouveau contrat d'un salarié sorti

\- Calcul du bulletin de rappel sur l'année 2021.

**1.2  : Bulletins clarifiés 2022**

        \- 2 bulletins (avec et sans calendrier) disponibles depuis les bulletins salariés, en édition en masse des bulletins et en personnalisation des bulletins

**1.3  : Autour de la DSN :**

        \- IEG :lorsque les informations libres salarié SAGEDSN045  et SAGEDSN046 ne sont pas renseignées (valeur 0,00), nous synchronisons l’information \[!VIDE\]

        \- OETH : Fiche consigne 2353 : « Les informations relatives aux accords agréés sont à déclarer uniquement par le SIRET déclarant pour le compte de l’entreprise ». De ce fait lors de la synchronisation DSN, les informations OETH de chaque établissement sont générées dans l'établissement principal (celui des paramètres de paie)

        \- CIBTP :

           \- N° d'adhésion : reprise en DSN uniquement pour le spectacle

           \- Ancienneté : Gestion de l'ancienneté dans l'entreprise et dans la profession

**1.4  : Divers :**

        \- Import Taux AT : Tous les taux AT du CRM sont importés avec un contrôle sur la date d’effet (ne peut être < à la date d’effet du taux AT déjà présent en paie)

        \- Constante S\_HOSPITALISATION : La case à cocher Hospitalisation dans les arrêts de travail peut être utilisée dans la carence

        \- Constante DATEVISPRO : Il est possible d’utiliser la constante DATEVISPRO dans les alertes

### Solutions connexes

Les contenus ci-dessous peuvent vous être utiles :

Fiches de la base de connaissances:

[Découvrir la version 12.10 de Déclaration Sociale](https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211123134115247)

Article OHC : Découvrez les nouveautés dans notre Centre d'aide en ligne [ici](https://sagepaiepme.online-help.sage.fr/release-notes/?PROJECT=PMEPAIE)