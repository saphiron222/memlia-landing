# Source ouverte pour saisie-comptable-sage

Consultée le 4 octobre 2026. URL : https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150075937

[Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150075937#solutionTop) [Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150075937#main-content)

Back

# Connaitre la saisie par lot

Created on 24 January 2018 \| Last modified on 30 August 2023

- PDF
- [Print](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp;jsessionid=8014FF62D8C2CE9D7C32C81406B9CEFA?solutionid=211010150075937&view=print "Print")
- Copy To Clipboard

## Summary

Cette fiche vous parle de la saisie par lot dans Sage 100 Comptabilité

## Description

La saisie par lot permet une saisie à deux ou plusieurs utilisateurs en même temps sur un même fichier, un même journal et sur la même période.

L'utilisateur ouvre ou crée un fichier de saisie qu'il va nommer, l'extension est \*.LOT

La saisie des écritures dans ce fichier lot, diffère d'une saisie classique par les points suivants:

\- les écritures sont stockées dans ce fichier, elles n'alimentent pas directement le fichier comptable.

\- l'utilisateur n'a pas accès aux écritures comptable déjà enregistrées dans le fichier comptable

\- il ne sera pas possible d'afficher les soldes des comptes, de lettrer ...

## Resolution

Pour créer un fichier lot :

\- se positionner dans l'exercice concerné par le menu fenêtre

\- accéder à l'option saisie par lot par le menu traitement

Cliquer sur le bouton nouveau puis saisir le nom du fichier lot

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090230830658630.png)

Pour ouvrir un fichier existant, il convient dans la fenêtre de sélectionner le fichier et de cliquer sur le bouton \[Ouvrir\].

Dans les deux cas, la fenêtre suivante apparait :

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090230830325186.png)

Le masque de saisie reste le même que dans la saisie classique, il convient d'ouvrir le journal sur le mois concerné.

Le bouton \[Rapport\] permet d'obtenir un état des mouvements effectué dans le lot avec un classement par utilisateur ou par date d'entrée sur une période définie.

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090230830305805.png)

Le bouton \[Brouillard\] permet l'impression des écritures saisie :

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090230830592184.png)

Le bouton \[Actions\] permet de sélectionner l'option de _mettre à jour la comptabilité._

_Sélectionner les journaux à mettre à jour, puis sur le bouton Actions - Mettre à jour la comptabilité._

_La liste des journaux sélectionnée s'affiche avec les options de comptabilisation_

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090230830579785.png)

"Comptabiliser les écritures à une date unique" : non cochée par défaut, les pièces seront mises à jour avec les dates de saisie. Sinon, renseigner la date

"Supprimer les écritures mises à jour" : cochée par défaut, les écritures du fichier lot seront supprimées suite au transfert dans la comptabilité.

Attention : En cas de non suppression des écritures du lot, il sera possible de comptabiliser plusieurs fois les mêmes écritures.

Une alerte existe lors de la demande de comptabilisations sur le même journal grâce au message suivant :

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090230830546422.png)

"Imprimer le rapport de numérotation" : cochée par défaut, permet d'imprimer sur papier ou en aperçu un état de correspondance des numéros de pièce du lot et des numéros de pièce définitifs.