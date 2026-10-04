# Source ouverte pour rapprochement-bancaire-sage

Consultée le 4 octobre 2026. URL : https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211010150055768

[Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150055768&hypermediatext=null#solutionTop) [Skip to content](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150055768&hypermediatext=null#main-content)

Back

# S'informer sur la description des zones dans le Rapprochement bancaire manuel en Comptabilité

Created on 30 December 2019 \| Last modified on 11 February 2024

- PDF
- [Print](https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150055768&view=print "Print")
- Copy To Clipboard

## Summary

Cet article informe sur les descriptions des zones dans le rapprochement manuel sur le logiciel Sage 100.

## Resolution

![Image](https://fr-kb.sage.com/portal/app/portlets/results/onsitehypermedia/090250304304213.png)

|     |     |
| --- | --- |
| Fichier comptable ne contenant qu'un seul exercice ou sélection de l'exercice le plus ancien d'un fichier en contenant plusieurs | Fichier comptable contenant plus d'un exercice et sélection d'un exercice autre que le plus ancien |
| **Ancien Solde**<br>Solde des écritures saisies sur le compte de trésorerie (512) au 1er jour de l'exercice sur un journal autre que celui auquel est lié le compte. L'ancien solde peut être modifié ponctuellement en double cliquant sur la zone. | **Ancien Solde**<br>Solde des écritures saisies sur le compte de trésorerie (512) au 1er jour de l'exercice N-1 sur un journal autre que celui auquel est lié le compte. L'ancien solde peut être modifié ponctuellement en double cliquant sur la zone. |
| **Encaissements / Décaissements**<br>Somme de toutes les écritures saisies sur l'exercice courant dans le journal de trésorerie. | **Encaissements / Décaissements**<br>Somme de toutes les écritures saisies sur l'exercice précédent et sur l'exercice courant dans le journal de trésorerie. |
| **Solde comptable**<br>Ancien solde + Totaux journal Débit ? Totaux journal Crédit.<br>Cette valeur doit correspondre au Nouveau Solde du journal de trésorerie au dernier jour de l'exercice. Ce solde doit également correspondre au solde du compte (512) dans la fonction Interrogation et lettrage du menu Traitement. Dans le cas contraire, soit l'ancien solde est erroné, soit le compte bancaire (512) a été utilisé sur un autre journal que celui de trésorerie à une date différente du 1er jour de l'exercice. | **Solde comptable**<br>Ancien solde + Totaux journal Débit N et N-1 ? Totaux journal Crédit N et N-1.<br>Cette valeur doit correspondre au Nouveau Solde du journal de trésorerie au dernier jour de l'exercice N. Ce solde doit également correspondre au solde du compte (512) dans la fonction Interrogation et lettrage du menu Traitement. Dans le cas contraire, soit l'ancien solde est erroné, soit le compte bancaire (512) a été utilisé sur un autre journal que celui de trésorerie à une date différente du 1er jour de l'exercice.<br>Autre possibilité : les reports à nouveau sur l'exercice N n'ont pas été générés. |
| **Solde pièce trésorerie**<br>Solde des écritures dont la colonne Pièce trésorerie correspond à celle saisie dans la zone Pièce de l'écran de rapprochement bancaire. | **Solde pièce trésorerie**<br>Solde des écritures dont la colonne Pièce trésorerie correspond à celle saisie dans la zone Pièce de l'écran de rapprochement bancaire. |
| **Cumuls des écritures non rapprochées**<br>Totaux mouvements Débit et Crédit des écritures non rapprochées de l'exercice. | **Cumuls des écritures non rapprochées**<br>Totaux mouvements Débit et Crédit des écritures non rapprochées de l'exercice précédent et de l'exercice courant. |
| **Solde Relevé théorique**<br>Ancien Solde - Zone rapprochement débit + Zone rapprochement crédit.<br>Il doit correspondre au solde du relevé envoyé par l'établissement bancaire. | **Solde Relevé théorique**<br>Ancien Solde - Zone rapprochement débit + Zone rapprochement crédit.<br>Il doit correspondre au solde du relevé envoyé par l'établissement bancaire. |