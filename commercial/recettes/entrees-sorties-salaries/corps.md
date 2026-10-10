## La tâche dans les mots du cabinet

Le client annonce une embauche par e-mail, ou un départ lors d’un appel dont le gestionnaire consigne le compte rendu. Une pièce arrive ailleurs, une date change dans le message suivant. Le travail à confier commence là : réunir les informations hors portail avant de les présenter au pôle social.

Le circuit déjà outillé reste en place. [mySilae](https://www.silae.fr/solution-rh-paie/gestion-des-salaries/) collecte les pièces, crée la fiche salarié et transmet la déclaration préalable à l’embauche (DPAE) lorsque l’entrée passe par son portail ; il outille aussi les documents de sortie. [PayFit](https://payfit.com/fr/gestion-du-personnel/) génère les contrats, les fait signer avec Yousign et rappelle les pièces attendues dans l’espace salarié. Nous ne présentons ni cette collecte ni ces signatures comme un gain supplémentaire.

Avant de retenir la tâche, nous vérifions votre édition, vos options et le circuit réellement utilisé. Une embauche prise en charge dans mySilae reste dans mySilae. Le périmètre présenté ici concerne seulement les annonces hors de ce circuit que votre outil ne reprend pas déjà.

## La règle écrite

**La frontière.** Une annonce reçue n’est ni une embauche déclarée ni une sortie validée. Les propositions ne remplacent pas les saisies du cabinet.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Rattacher les messages et comptes rendus autorisés, comparer les informations reçues à la liste du cabinet, nommer les manques et conflits | Brouillon de questions au client ; pour une entrée hors portail, champs de DPAE et de fiche salarié ; pour une sortie, synthèse des informations reçues | Choix du contrat ou du motif de rupture, correction des dates, contrôle des champs, création effective dans la paie, transmission par le circuit du cabinet, montants et signatures |

**La proposition.** Chaque champ préparé garde sa source : message, pièce ou compte rendu d’appel écrit par le gestionnaire. La demande au client nomme les informations manquantes. Pour une entrée hors portail, les champs de DPAE et de fiche salarié sont préparés séparément, sans dépôt ni création effective. Une sortie ne produit jamais de DPAE. La synthèse de sortie laisse les décisions sociales au gestionnaire.

**L’arrêt.** Un rattachement ambigu, une pièce illisible, deux dates contradictoires ou un cas absent de la règle arrête la préparation concernée et nomme le motif. Un manque bloque sa finalisation. Une annonce déjà traitée dans le portail est orientée vers ce circuit sans proposition en double. Un appel non consigné ne fournit aucune donnée à lire : nous ne prétendons pas écouter ou retranscrire le téléphone.

**Le jeu d’essai.** Une règle fictive est exécutée sur sept cas : entrée par e-mail, sortie consignée après appel, manque, dates contradictoires, cas hors règle, entrée déjà traitée dans le portail et appel sans compte rendu. Le test vérifie le routage des états déclarés et les sorties attendues, pas l’extraction de pièces, une connexion ni une transmission.

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Entrée par e-mail, informations présentes et dates cohérentes | Champs fictifs de DPAE et de fiche salarié préparés, à valider | Le gestionnaire contrôle avant toute saisie ou transmission |
| Sortie consignée après appel, informations présentes | Synthèse fictive de sortie à valider, sans DPAE | Le gestionnaire garde le traitement de la rupture |
| Entrée hors portail, information attendue absente | Liste des manques, aucune préparation finalisée | Le gestionnaire valide les questions au client |
| Deux dates différentes pour le même événement | Préparation arrêtée, conflit nommé | Le gestionnaire tranche la version retenue |
| Départ absent des cas écrits | Préparation arrêtée, cas hors règle nommé | Le pôle social examine la situation |
| Entrée déjà traitée dans mySilae | Circuit existant conservé, aucune proposition en double | Le gestionnaire poursuit dans son outil |
| Appel sans compte rendu écrit | Préparation arrêtée, source absente | Le gestionnaire consigne les informations |

Les champs et listes sont fictifs, définis pour cet essai ; ils ne constituent pas une liste réglementaire. Le rejeu local figure dans `preuves/rejeu.json`, rejoué le 2026-10-06.

## Ce que nous prenons en charge

Nous observons une annonce reçue hors portail avec votre équipe. Nous écrivons les informations attendues, les sources autorisées, les cas déjà couverts et les points d’arrêt, puis construisons leur préparation. La mission comprend le jeu d’essai fictif, la recette par les gestionnaires, c’est-à-dire leur vérification du résultat attendu, et la maintenance du périmètre convenu.

Le résultat est une fiche des informations reçues, manquantes ou contradictoires, avec les questions à poser. Pour une entrée, elle présente les champs de DPAE et de fiche salarié à valider. Pour une sortie, elle prépare le dossier d’information sans calculer de droits ni générer les documents finaux. La forme de restitution dépend des accès vérifiés avant engagement.

## Ce que le cabinet garde

Le pôle social choisit les informations utiles, qualifie l’événement, tranche les contradictions et valide les propositions. Il garde le contrat, le motif de rupture, les montants, les signatures et les transmissions dans son circuit habituel. La présence de toutes les informations attendues ne vaut pas validation sociale.

Cette mission se distingue de [la préparation des contrôles de paie](/automatisation/paie) : elle traite une annonce d’entrée ou de sortie reçue hors portail, pas les variables mensuelles, un bulletin ou le calcul d’un solde de tout compte.

## Dans vos outils

Nous partons de la messagerie, des pièces autorisées et des comptes rendus écrits après les appels. Nous vérifions d’abord si votre logiciel reprend déjà ces annonces : si oui, nous gardons ce circuit. Une information transmise au portail ou déjà validée dans la paie n’est pas reprise pour créer un second dossier.

L’édition, les options, les droits et les formats de restitution se vérifient avant engagement. Une fonction non trouvée dans les pages d’un éditeur ne signifie pas qu’elle est absente de votre installation. Les pièces individuelles restent réservées aux personnes autorisées ; le suivi se lit en agrégats de dossiers et d’étapes, sans classer les salariés ni les collaborateurs.

## La preuve

Le rejeu produit des propositions fictives distinctes pour une entrée et une sortie. Il montre aussi cinq situations sans préparation finalisée, dont le retour au portail déjà utilisé. [Notre méthode](/methode) explique comment votre équipe vérifie ces cas avant utilisation ; [nos garanties](/garanties) précisent les engagements de la mission.

Le script lit des données déjà structurées : il ne démontre ni lecture d’un e-mail libre, ni extraction d’une pièce, ni détection automatique d’un dossier existant, ni connexion à mySilae ou PayFit. Ces capacités se recettent sur le périmètre retenu, avant utilisation.

## Le prix

Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des canaux hors portail, des événements retenus, des règles de rattachement, des exceptions et des validations. Nous écrivons le résultat attendu et ses critères d’acceptation avant de construire. Un circuit déjà couvert ne devient pas une seconde mission.

## Questions de décision

### Nous utilisons déjà mySilae. Que reste-t-il à confier ?

Rien pour une entrée ou une sortie déjà prise en charge dans votre circuit mySilae. Nous regardons seulement les annonces reçues ailleurs et non reprises par votre outil. S’il sait déjà les traiter, cette tâche ne justifie pas une automatisation supplémentaire.

### PayFit fait déjà signer nos contrats. Que proposez-vous ?

Nous ne refaisons ni sa génération ni sa signature, ni ses rappels de pièces dans l’espace salarié. Le besoin éventuel porte sur les informations reçues hors du circuit que vous utilisez, à réunir avant votre décision. Nous le vérifions avec vous avant de retenir une mission.

### La DPAE est-elle envoyée et le salarié créé seuls ?

Non. Pour une entrée hors portail, nous préparons les champs et leurs sources. Le gestionnaire valide puis utilise le circuit déclaratif et le logiciel de paie du cabinet. Nous ne doublons pas la transmission et la création déjà réalisées par mySilae. Pour une sortie, aucune DPAE n’est préparée.

### Une annonce téléphonique suffit-elle ?

Elle doit être consignée par le gestionnaire dans un compte rendu autorisé. Sans cette source écrite, la préparation s’arrête. Les informations incertaines restent des questions à poser, pas des valeurs devinées.

### Cette page répond-elle au délai de remise du solde de tout compte ?

Non. Elle décrit une tâche pour les cabinets, pas le délai applicable à une situation individuelle. Le pôle social garde l’analyse de cette situation et des échéances à appliquer.
