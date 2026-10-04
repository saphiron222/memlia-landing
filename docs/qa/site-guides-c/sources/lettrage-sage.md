# Source ouverte pour lettrage-sage

Consultée le 4 octobre 2026. URL : https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010160118208

[Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010160118208#solutionTop) [Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010160118208#main-content)

Back

# Lettrer : le code lettrage est différent sur les tiers en saisie et en gestion des comptes tiers.

Created on 28 May 2021 \| Last modified on 05 September 2023

- PDF
- [Print](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp;jsessionid=31F18ADF71A7DE7630CC8B36E51A7DA4?solutionid=211010160118208&view=print "Print")
- Copy To Clipboard

## Summary

Cette fiche vous explique la différence de code lettrage généré par l'application Sage 100 Comptabilité lorsqu'il est fait via le code journal ou via la gestion des comptes tiers.

## Description

Dans Sage Comptabilité, il est possible de lettrer un compte soit via **Traitement/ Journaux de saisie**, après sélection de l'écriture du tiers, Actions/Lettrer le compte, soit via **Traitement/ Gestion des comptes tiers.**

On constate que le code lettrage effectué pour un même tiers ne s'incrémente pas.

## Resolution

Dans la gestion des tiers, lorsque le lettrage y est effectué, le code lettrage est propre à chaque tiers. Il s'incrémente suivant le dernier code lettrage présent sur le tiers.

En revanche, lorsque le lettrage est effectué via les journaux de saisie, le code lettrage se base sur le dernier présent sur les écritures tiers avec le même compte collectif.

De ce fait, on peut constater une discontinuité des codes lettrages sur chaque tiers.