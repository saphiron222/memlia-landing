# Source ouverte pour lettrage-cegid

Consultée le 4 octobre 2026. URL : https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html

##### Table of Contents

# _**Imports au format JSON**_

## _**Présentation générale de l'API et finalité fonctionnelle**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#pr%C3%A9sentation-g%C3%A9n%C3%A9rale-de-lapi-et-finalit%C3%A9-fonctionnelle)

Cette API permet d'effectuer un import de tous les éléments rattachés aux mouvements comptables au format JSON :

- écritures comptables,
- écritures analytiques,
- comptes généraux,
- tiers,
- axes et sections analytiques,
- journaux,
- gestion des pièces jointes liées aux écritures,
- récupération du lettrage,
- modes de paiements.

Toutes données seront exploitées dans Cegid Loop.

## _**Procédure**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#proc%C3%A9dure)

Il faut appeler un endpoint permettant d’enregistrer une demande d’import d’écritures au format JSON. Après insertion, un service interne récupèrera la demande pour la traiter et effectuer l’import.

| Route | Méthode http | Description |
| --- | --- | --- |
| /importJson | POST | Insère une demande d’import d’écritures au format JSON |

### _**Paramétrage de l’appel**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#param%C3%A9trage-de-lappel)

Méthode http pour la demande : _POST_

Header(s) attendu(s) obligatoire(s) de la demande : _API-KEY_

Format du corps de la demande : _JSON (format UTF8)_

### _**Structure du corps de la demande :**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#structure-du-corps-de-la-demande-)

| Clé | Type | Description | mandatory |
| --- | --- | --- | --- |
| codeIbs | String | Code du dossier dans Loop | OUI |
| SIRET | String | Numéro SIRET (14 chiffres) | NON |
| data | Objet JSON | Objet JSON contenant l’ensemble des paramètres et données à importer | OUI |

#### _**Structure JSON de l’objet data :**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#structure-json-de-lobjet-data-)

| Clé | Type | Description |
| --- | --- | --- |
| contexte | Object JSON | Objet JSON contenant 2 propriétés, les dates de début et de fin des écritures à importer |
| options | Object JSON | Objet JSON contenant des options de l’import |
| ecritures | Array JSON | Tableau de JSON décrivant une écriture |

##### _**Structure JSON de l’objet contexte :**_

| Clé | Type | Description |
| --- | --- | --- |
| from | String | Date de début des écritures à importer au format iso |
| to | String | Date de fin des écritures à importer au format iso |

_Exemple de dates_ :

\- "from" : _"2020-02-01T00 :00 :00.000Z"_

\- "to" : _"2020-06-04T00:00:00.000Z"_

\\* La propriété "contexte" n’est pas obligatoire si l’option multiPeriode vaut _true_.

_Focus sur la notion de multipériode_

Cette option devra être utilisée si le contenu du fichier JSON concerne plusieurs périodes ouvertes (excecice en cours et exercice suivant).

##### _**Structure JSON de l’objet options :**_

| Clé | Type | Description |
| --- | --- | --- |
| separatorDecimal | String | Séparateur de décimal pour les montants |
| formatDate | String | Format de date à utiliser pour l’import des écritures |
| multiPeriode | Boolean | Permet d’indiquer si les écritures sont autorisées sur toutes les périodes ouvertes ( _true_) ou juste sur la dernière période ouverte ( _false_) |
| failOnUnbalanced | Boolean | Permet de déterminer si l’on souhaite lever une erreur en cas de groupes d’écritures non-équilibrés |
| createNewJournaux | Boolean | Permet d'indiquer s’il faut créer un nouveau journal quand le journal de l’écriture n’existe pas dans le dossier |
| createNewComptes | Boolean | Permet d'indiquer s’il faut créer un nouveau compte quand le compte de l’écriture n’existe pas dans le dossier |
| createNewTiers | Boolean | Permet d'indiquer s’il faut créer un nouveau tiers quand le tiers de l’écriture n’existe pas dans le dossier. _true_ par défaut. Si _false_, alors l’écriture sera créée avec les tiers d’attente de l’écriture. |
| defaultJournalId | String | uuid permettant de spécifier le journal par défaut. _null_ par défaut |
| sortLines | Boolean | Permet de trier les lignes. _false_ par défaut |
| comptesRules | Tableau | Permet de gérer les règles de correspondance pour les comptes (correspondance par racine ou par fourchette de compte). _null_ par défaut |
| newFolio | Boolean | Permet de créer un nouveau groupe. _false_ par défaut |
| balanceAuto | Boolean | Permet de créer l'équilibrage automatiquement. _true_ par défaut |
| aNouveaux | Boolean | Permet de gérer les à-nouveaux. _true_ par défaut |
| defaultCompte | String | uuid du compte à créer par défaut si l'option createNewCompte est à false. _null_ par défaut |
| createPieceRef | Boolean | Permet de créer la référence de la pièce si aucune pièce n'est trouvée. _false_ par défaut |

_Exemple d'options_ :

\- "separatorDecimal": _"."_,

\- "formatDate": _"AAAA-MM-JJThh:mm:ss.nnnZ"_,

\- "multiPeriode": _false_,

\- "failOnUnbalanced": _true_,

\- "createNewJournaux": _false_,

\- "createNewComptes": _true_,

\- "createNewTiers": _true_.

##### _**Structure JSON de l’objet ecritures :**_\*

| Clé | Type | Value | Description |
| --- | --- | --- | --- |
| fichier | Object JSON |  | Objet JSON contenant l’url authentifiée de la pièce jointe associée au mouvement |
| date | String |  | Date comptable de l’écriture |
| dateJustif | String |  | Date du justificatif au format ISO ( _YYYY-MM-DDTHH:mm:ss.SSSZ_) |
| debCutOff | String |  | Date de début de cut-off au format ISO ( _YYYY-MM-DDTHH:mm:ss.SSSZ_). Doit être renseignée avec **finCutOff** |
| finCutOff | String |  | Date de fin de cut-off au format ISO ( _YYYY-MM-DDTHH:mm:ss.SSSZ_). Doit être renseignée avec **debCutOff** |
| debit | Object JSON |  | Objet JSON contenant les informations sur le débit (amount, currency, currencyAmount, currencyRate) |
| credit | Object JSON |  | Objet JSON contenant les informations sur le crédit (amount, currency, currencyAmount, currencyRate) |
| journal | String |  | Code du journal |
| compte | String |  | Numéro de compte général |
| libelle | String |  | Libellé de l’écriture |
| reference | String |  | Référence de l’écriture |
| tiers | String |  | Code du tiers |
| refPiece | String |  | Référence de la pièce |
| commentaire | String |  | Commentaire sur la ligne |
| dateLettrage<br>Cf. "Cas particuliers" |  |  | Date du lettrage |
| codeLettrage<br>Cf. "Cas particuliers" | String |  | Code du lettrage |
| compteLib | String |  | Libellé du compte général |
| journalLib | String |  | Libellé du journal |
| dateOperation | String |  | Date d'opération |
| dateEcheance | String |  | Date d'échéance |
| datePointage | String |  | Date de pointage |
| codePointage | String |  | uuid code pointage |
| SIRET | String |  | Numéro SIRET de l'établissement (14 chiffres). Cette information est optionnelle ; si elle est vide, l'écriture est importée sur l'établissement principal. |
| modePaiement | Integer |  | Mode de paiement de la ligne {Aucun:1, Espèces:2, Chèque:3, Carte bancaire:4, Virement:5, Prélèvement:6, TIP:7, LCR BOR:8, LCR magnétique:9, Traite:10, Télérèglement:11} |
| typeMouvement | String |  | Type de mouvement pour l'entête {Générale:1, Prévisionnelle:2, Simulation:3, Projet:4, Initial:5, Budget:6, Brouillard:7} |
| type | String |  | Type d'écriture {Général:1, Simulation:2, Prévisionnel:3, Projet:4, Initial:5, Budget:6, Brouillard:7} |
| lot | String |  | uuid du lot d'écriture |
| typeLot | String |  | Type de lot {Saisie de trésorerie:1, Reconnaissance de facture:2, Quickbooks:4} |
| ecritureMere | String |  | uuid ecriture mère |
| ecritureOrigine | String |  | Ecriture d’origine au format uuid |
| axeAna\[codeAxe\]<br>Cf. "Cas particuliers” | Array JSON |  | Objet JSON décrivant l’analytique avec \[codeAxe\] représentant le code l’axe analytique |

## _**Les différents codes retour en cas de succès**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#les-diff%C3%A9rents-codes-retour-en-cas-de-succ%C3%A8s)

Code retour http de la réponse : 200

Format corps de la réponse : JSON

Structure du corps de la réponse :

| Clé | Type | Valeur |
| --- | --- | --- |
| accountingImportRequestId | String | String sous forme de guid par exemple : _"e8bec446-1d5c-4e78-9017-6e2600887a09"._ Ce guid permettra de suivre la demande via un autre endpoint _getImportStatus_ |

## _**Les différents codes retour en cas d’erreur**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#les-diff%C3%A9rents-codes-retour-en-cas-derreur)

Code retour http de la réponse : 200

Format corps de la réponse : JSON

Structure du corps de la réponse :

| Clé | Type | Valeur |
| --- | --- | --- |
| error | Object JSON | Objet JSON contenant 2 propriétés : _instanceId_ et _message_ |
| instanceId | String | String sous forme de guid correspondant à l’id de l’instance du service d’import |
| message | String | Message explicatif de l’erreur : Cf. liste ci-dessous |

## _**Liste des messages d’erreurs possibles :**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#liste-des-messages-derreurs-possibles-)

- Il n'y a pas de payload : la méthode est-elle bien en POST dans la requête ?
- Le contexte est obligatoire sans l'option multiPeriode
- Il n'y a pas d'écritures à importer (l'objet écritures est vide)
- Les écritures doivent être présentées sous formes de tableau
- Le tableau d'écritures doit comporter au moins deux lignes
- Les dates du contexte doivent être au format ISO ' _YYYY-MM-DDTHH:mm:ss.SSSZ_'
- La date du justificatif doit être au format ISO ' _YYYY-MM-DDTHH:mm:ss.SSSZ_'
- Les dates de début et fin de cut-off doivent être renseignées ensemble
- La date de début de cut-off doit être au format ISO ' _YYYY-MM-DDTHH:mm:ss.SSSZ_'
- La date de fin de cut-off doit être au format ISO ' _YYYY-MM-DDTHH:mm:ss.SSSZ_'
- Le numéro SIRET est invalide : il doit comporter 14 chiffres et respecter l'algorithme de Luhn sur l'écriture numéro {numeroEcriture}
- Les SIRET des écritures doivent appartenir à la même entreprise (SIREN identique)
- L'établissement correspondant au SIRET {SIRET} n'est pas reconnu pour le dossier {codeIBS}

## _**Règles établissement**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#r%C3%A8gles-%C3%A9tablissement)

- Le champ **SIRET** peut être renseigné sur chaque objet du tableau **ecritures** pour cibler l'établissement à alimenter.
- Le champ **SIRET** est optionnel : s'il est absent ou vide, l'écriture est importée sur l'établissement principal du dossier.
- Lorsqu'il est renseigné, le **SIRET** doit contenir 14 chiffres et respecter l'algorithme de Luhn.
- Tous les **SIRET** renseignés dans un même fichier doivent appartenir à la même entreprise (SIREN identique).
- Chaque **SIRET** renseigné doit correspondre à un établissement reconnu pour le dossier **codeIbs**.
- Si plusieurs établissements valides sont présents, les écritures sont ventilées automatiquement par établissement.

Dans l’interface des imports partenaires, il n'est pas possible de récupérer les statuts 10 et 20 ("en attente" et "en cours").

En effet, en fin de traitement de l'import via l'API, on aura uniquement les statuts à partir de 25.

Afin de récupérer les statuts "en attente" et "en cours", il faut utiliser l’API " **getImportStatus**".

## _**Cas spécifiques**_ : [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#cas-sp%C3%A9cifiques)

### _**Import avec analytique**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#import-avec-analytique)

_Pré-requis_ :

- Le compte général doit être ventilable,
- la section et l'axe doivent être paramétrés,
- si la section n'est pas définie dans le dossier Cegid Loop, elle sera créée lors le l'import.

![Capture import analytique](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Analytique_1.PNG)

_**Remarque :**_

Dès lors que l'objet **devise** n'est pas renseigné (Propriétés _Ecritures_ et _axeAna_), la devise de traitement du mouvement comptable par défaut sera l'Euro.

![Capture import analytique2](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Analytique_2%27%27.PNG)

### _**Import avec lettrage**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#import-avec-lettrage)

Pour que le lettrage soit correctement importé :

- Soit le compte général est lettrable, soit le tiers l'est,
- Le code lettrage doit être sur le même compte lettrable,
- Le paquet lettré doit être équilibré (débit = crédit) pour un même compte lettrable.

![Capture import lettrage](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Lettrage_1.PNG)

### _**Import avec pièce jointe**_ [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#import-avec-pi%C3%A8ce-jointe)

_A propos du champ "fichier URI"_ :
Afin que la pièce jointe soit associée à l'écriture, le champ "fichier.uri" doit contenir une URL authentifiée. Celle-ci constituera un lien vers la pièce jointe de l'écriture et sera déposée dans le Sharepoint.

_Pré-requis_ :
L'URL pour l'authentification au fichier (pièce jointe liée à l'écritutre comptable) doit être valide pendant au moins 24 heures (recommandation de Microsoft).
L'objectif est de pouvoir gérer le processus de "retry" et de suivre les interruptions de service, qu'elles soient volontaires ou involontaires.

![Capture import PJ](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Pi%C3%A8ce%20jointe_2.PNG)

## _**Exemple de fichier JSON**_ : [Anchor](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html\#exemple-de-fichier-json)

```json
{
	"codeIbs": "D000000000",
	"data": {
		"contexte": {
			"from": "2026-01-01T00:00:00.000Z",
			"to": "2026-01-31T00:00:00.000Z"
		},
		"options": {
			"separatorDecimal": ".",
			"formatDate": "YYYY-MM-DDTHH:mm:ss.SSSZ",
			"multiPeriode": false,
			"failOnUnbalanced": true,
			"createNewJournaux": false,
			"createNewComptes": true,
			"createNewTiers": true
		},
		"ecritures": [\
			{\
				"SIRET": "12345678900010",\
				"date": "2026-01-15T00:00:00.000Z",\
				"debit": {\
					"amount": 120,\
					"currency": "EUR",\
					"currencyAmount": 120,\
					"currencyRate": "1.0"\
				},\
				"credit": {\
					"amount": 0,\
					"currency": "EUR",\
					"currencyAmount": 0,\
					"currencyRate": "1.0"\
				},\
				"journal": "AC",\
				"compte": "607000",\
				"libelle": "Achat établissement secondaire",\
				"reference": "FAC-001"\
			},\
			{\
				"SIRET": "12345678900028",\
				"date": "2026-01-15T00:00:00.000Z",\
				"debit": {\
					"amount": 0,\
					"currency": "EUR",\
					"currencyAmount": 0,\
					"currencyRate": "1.0"\
				},\
				"credit": {\
					"amount": 120,\
					"currency": "EUR",\
					"currencyAmount": 120,\
					"currencyRate": "1.0"\
				},\
				"journal": "AC",\
				"compte": "401000",\
				"libelle": "Contrepartie établissement secondaire",\
				"reference": "FAC-001"\
			}\
		]
	}
}
```

![Capture fichier Json_1](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Json_01.PNG)

![Capture fichier Json_2](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Json_02.PNG)

![Capture fichier Json_3](https://assistanceloop.blob.core.windows.net/documentation/Import-Export/Impotrs%20partenaires%20format%20JSON/Json_03.PNG)