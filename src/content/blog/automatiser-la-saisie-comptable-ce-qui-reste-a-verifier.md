---
titre: "Automatiser la saisie comptable : ce qui reste à vérifier"
titreOnglet: "Automatisation saisie comptable : les 6 contrôles | Memlia"
resume: "La lecture extrait, une personne vérifie. Six contrôles dans un ordre fixe : nature, émetteur, mentions, montants, période, doublon. Puis une file d’anomalies à motifs fermés. Rien ne s’enregistre sans validation, et le reliquat se recompte à chaque période."
description: "Automatisation saisie comptable : six contrôles à garder, une file d’anomalies et ce qui exige encore une validation humaine."
datePublication: 2026-09-17
dateMiseAJour: 2026-09-29
auteur: kevin
sujets: [saisie, pieces, automatisation, ia]
motsCles: ["saisie comptable automatisée", "OCR comptable", "pré-comptabilité", "contrôles de saisie", "file d’anomalies", "doublon de facture"]
brouillon: false
image: img-art-saisie-comptable
pipelineVersion: 1
primaryQuery: "automatisation saisie comptable"
secondaryQueries: ["pré-comptabilisation automatique pièces", "extraction automatique facture comptabilité", "automatisation saisie comptable OCR"]
intent: executer
fanOut: ["ce que la lecture extrait vraiment d’une pièce", "quels contrôles restent après l’extraction", "ce qui part en file d’anomalies et pourquoi"]
cluster: production-comptable
famille: saisie-ocr
rolePrincipal: collaborateurs-comptables
rolesSecondaires: [assistants-comptables, chefs-mission-portefeuille]
tache: "Faire lire les pièces et proposer les écritures sans que rien ne s’enregistre sans contrôle, et faire remonter ce que la lecture n’a pas su traiter."
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-09-30
funnel: MOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Scénario fictif explicite de cinquante pièces avec sorties attendues, sans prétendre à une exécution ; tableau déclencheur-condition-action-exception ; cinq affirmations sourcées."
reviewRule: "Réviser à la publication de l’article sur le rapprochement bancaire et de celui sur le lettrage, et dès qu’une étape du calendrier de la facturation électronique change ; relecture des sources à six mois."
reviewer: metier:t_303e7c6d
sourcesVerifieesLe: 2026-09-29
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons la règle de saisie de votre cabinet dans vos mots, fournisseurs récurrents et motifs de refus compris, nous l’automatisons dans les outils que vos équipes utilisent déjà, et elles la recettent sur un lot de pièces. Chaque écriture reste validée par une personne. Rien à envoyer : décrivez la tâche, nous vous disons ce qu’il faut pour la prendre en charge."
imageOg: "/images/img-art-saisie-comptable-og.webp"
imageAlt: "Saisie comptable en diorama 3D : pile de feuilles, barre de lecture verte, plateau rangé, plateau graphite de côté, loupe"
statutEditorial: publie
sources:
  - editeur: "Service Public"
    titre: "Mentions obligatoires sur une facture"
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F31808"
    consulte: 2026-09-29
  - editeur: "Service Public"
    titre: "Comment se mettre en conformité avec l’obligation de facturation électronique ?"
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F39785"
    consulte: 2026-09-29
  - editeur: "Service Public"
    titre: "Quels sont les délais de conservation des documents pour les entreprises ?"
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F10029"
    consulte: 2026-09-29
  - editeur: "CNIL"
    titre: "Définition : donnée personnelle"
    url: "https://www.cnil.fr/fr/definition/donnee-personnelle"
    consulte: 2026-09-29
---

## Réponse directe

Automatiser la saisie comptable, c’est laisser une lecture automatique extraire les champs d’une pièce et proposer une écriture, puis vérifier ce que cette lecture ne peut pas garantir : l’émetteur, les mentions de la facture, la cohérence des montants, la période, l’absence de doublon. Ce qui ne se vérifie pas seul ne se force jamais : la pièce part dans une file d’anomalies relue par une personne, et c’est ce reliquat qui se mesure.

## Qu’est-ce que la saisie comptable automatisée, et que fait-elle vraiment ?

**La saisie comptable** est l’enregistrement d’une pièce en écriture : date, journal, comptes, libellé, montants, TVA. **La [reconnaissance optique de caractères](/glossaire#reconnaissance-optique-de-caracteres)**, dite OCR, est la lecture d’une image ou d’un PDF pour en extraire du texte et des champs. **La [pré-comptabilité](/glossaire#pre-comptabilite)** est l’étape intermédiaire : la pièce est lue, ses champs sont extraits, une écriture est proposée, et rien n’entre en comptabilité avant qu’une personne ne l’ait validée.

Confondre ces trois étapes est l’erreur d’origine. Une lecture qui rend « 1 248,00 » a extrait un nombre ; elle n’a pas établi que ce nombre est le total TTC de cette facture, ni que la facture vient du fournisseur attendu, ni qu’elle appartient à la période traitée. L’extraction est une hypothèse documentée, l’imputation est une décision, la validation engage le cabinet. Une automatisation tenable garde les trois séparées et montre ce qu’elle a supposé.

À la main, la saisie casse pour une raison connue de tous les cabinets : elle est répétitive sur la plupart des pièces et délicate sur quelques-unes, et c’est la même personne qui traite les deux, dans le même mouvement, à la même vitesse. La pièce ambiguë passe alors comme les autres. Le collaborateur sait pourtant ce qui distingue l’une de l’autre : quel fournisseur s’impute où, quel écart mérite un regard, quel ticket ne vaut rien. Ce savoir n’est écrit nulle part, et il part avec lui. Automatiser sans l’écrire ne corrige rien : cela accélère aussi les erreurs. La méthode ci-dessous, une méthode Memlia, sépare ce que la lecture propose de ce qu’une personne vérifie, et fait remonter le reste au lieu de le forcer.

## Que faut-il avoir sous la main avant de commencer ?

- Les pièces d’une période complète, telles qu’elles arrivent aujourd’hui : PDF, photos, tickets, pièces jointes de courriels.
- La liste des fournisseurs récurrents du dossier, avec leur imputation habituelle : c’est elle qui rend une proposition d’écriture possible.
- Le plan de comptes du dossier et les journaux utilisés, dans leur état réel, pas dans leur état théorique.
- La règle de TVA applicable au dossier et les taux pratiqués par ses fournisseurs.
- Une personne désignée pour valider les écritures proposées et relire la file d’anomalies.

## Brique 1 : ce que la lecture extrait, et avec quelle certitude

Une lecture automatique produit des champs, et chaque champ n’a pas la même solidité. Un montant imprimé en gros caractères se lit presque toujours ; une date manuscrite, rarement ; un taux de TVA se déduit parfois d’un tableau mal aligné. Le premier travail consiste donc à écrire, champ par champ, ce que la lecture rend et ce qu’elle ne rend pas. Un champ extrait n’est pas un champ vérifié : c’est une proposition assortie d’un doute, et ce doute doit rester visible jusqu’à la validation.

| Champ | Ce que la lecture en fait | Ce qui reste à vérifier |
|---|---|---|
| Émetteur | Rapproche le nom lu d’un fournisseur connu du dossier | Homonymes, changement de raison sociale, facture d’un tiers |
| Date et numéro | Extrait les deux quand ils sont typographiés | Date de la pièce contre période traitée, numéro déjà présent |
| Montants | Lit HT, TVA et TTC quand ils sont étiquetés | Somme cohérente, arrondis, remises, acomptes déduits |
| Taux et base de TVA | Propose le taux dominant de la pièce | Pièce à plusieurs taux, autoliquidation, exonération |
| Devise et pays | Détecte le symbole ou le code | Facture étrangère, conversion, mentions particulières |
| Nature de l’achat | Propose une imputation d’après l’historique du fournisseur | Achat inhabituel chez un fournisseur habituel |

La dernière ligne est la plus trompeuse. Une proposition d’imputation fondée sur l’historique reste juste tant que le fournisseur fait toujours la même chose ; le jour où le loueur de véhicules facture une immobilisation, la proposition demeure confiante et devient fausse. C’est un cas à écrire dans la règle, pas un défaut à corriger après coup.

## Brique 2 : les contrôles qui restent, et dans quel ordre les passer

Les contrôles se passent dans un ordre fixe, du plus grossier au plus fin, parce qu’un contrôle raté en amont rend inutiles ceux d’après. On vérifie d’abord que le document est bien une facture et non un devis, un bon de livraison ou un relevé ; puis que l’émetteur est le fournisseur attendu ; puis que les mentions attendues sur la pièce sont présentes ; puis que les montants s’additionnent ; puis que la pièce appartient à la période ; puis qu’elle n’est pas déjà enregistrée. L’imputation ne se juge qu’en dernier, quand tout le reste tient.

| Contrôle | Condition qui le rend concluant | Sortie quand la condition manque |
|---|---|---|
| Nature du document | Facture identifiable, ou justificatif de dépense à qualifier séparément | Devis ou relevé : motif « document non facturé » ; ticket ou note de frais : qualification humaine avant toute proposition |
| Émetteur | Le nom lu correspond à un fournisseur du dossier | Fiche fournisseur à créer, par une personne |
| Mentions de la pièce | Numéro, date, identité des parties et montants présents | Pièce incomplète, demande au client |
| Cohérence des montants | HT et TVA reconstituent le TTC lu | Écart typé, jamais arrondi d’office |
| Période | La date de la pièce tombe dans la période traitée | Pièce hors période, conservée pour la bonne période |
| Doublon | Le couple fournisseur et numéro est absent du journal | Rapprochement proposé, aucune écriture créée |

Ces six contrôles peuvent préparer des comparaisons et des alertes ; aucun ne supprime le contrôle humain. Une nature ambiguë, un émetteur inconnu ou un doublon probable demandent une décision. L’imputation d’un achat inhabituel intervient ensuite, une fois ces six contrôles passés, et reste elle aussi une décision du cabinet. La frontière n’est pas entre ce qui est facile et ce qui est difficile : elle passe entre une comparaison reproductible et une appréciation qui engage le dossier.

<figure data-blog-proof="saisie-six-controles">
  <img src="/proofs/blog/saisie-six-controles-mobile.webp" alt="Six contrôles de saisie illustratifs, arrêtés sur une facture fictive de la période précédente." width="1200" loading="lazy" decoding="async">
</figure>

## Brique 3 : la file d’anomalies, et le reliquat qui se compte

Tout ce qui ne franchit pas un contrôle tombe dans une [file d’anomalies](/glossaire#file-d-anomalies) unique, avec la pièce, le contrôle qui a échoué et la date. Une file unique, relue à heure fixe, vaut mieux qu’une alerte par pièce, qui finit ignorée. Chaque ligne porte un motif fermé : document non facturé, fournisseur inconnu, pièce incomplète, écart de montants, hors période, doublon probable. Ces motifs sont peu nombreux à dessein, ils servent à décider et non à décrire.

Le reliquat, c’est la part des pièces qui termine dans cette file. Il se compte, période par période, et il n’a de sens que rapporté au jeu de pièces sur lequel il a été compté : un dossier de commerce avec beaucoup de tickets ne produit pas le même reliquat qu’un dossier de prestations à dix factures par mois. Ce chiffre n’est pas un argument de vente, c’est un instrument de réglage : quand un motif domine la file, c’est la règle qu’il faut corriger, pas la personne qui relit.

<figure data-blog-proof="saisie-file-anomalies">
  <img src="/proofs/blog/saisie-file-anomalies-mobile.webp" alt="Six motifs possibles sans décompte mesuré et ticket coupé fictif à qualifier par une personne." width="1200" loading="lazy" decoding="async">
</figure>

## La règle dans les mots du cabinet

| Déclencheur | Condition | Action | Exception |
|---|---|---|---|
| Une pièce arrive dans le dossier | Elle est lisible et porte les marques d’une facture | Les champs sont extraits, une écriture est proposée | Pièce illisible : file d’anomalies, aucune extraction |
| Les champs sont extraits | L’émetteur correspond à un fournisseur connu | L’imputation habituelle du fournisseur est proposée | Fournisseur inconnu : file d’anomalies, aucune fiche créée |
| Une écriture est proposée | Les montants s’additionnent et la période est la bonne | L’écriture attend la validation d’une personne | Écart de montants : écart typé, aucune correction d’office |
| Une écriture est validée | Le couple fournisseur et numéro est absent du journal | L’écriture est enregistrée, la pièce est liée | Doublon probable : rapprochement proposé, rien d’enregistré |
| La période est close | La file d’anomalies est vide | Le lot est déclaré traité | File non vide : le lot reste ouvert, motifs listés |

## Que refuse l’outil, et pourquoi ?

Le refus est la partie utile de la règle. L’outil ne crée jamais une fiche fournisseur de lui-même : un fournisseur créé par erreur se retrouve six mois plus tard dans une balance que personne ne comprend. Il n’arrondit pas un écart de montants, même d’un centime, parce qu’un centime est parfois le symptôme d’une remise mal lue. Il ne réimpute pas un achat inhabituel sur l’habitude du fournisseur. Il n’enregistre rien tant qu’une personne n’a pas validé, même quand la proposition est certaine. Et il ne supprime jamais une pièce qu’il croit être un doublon : il propose un rapprochement, la suppression reste une décision.

Ces refus ont un coût visible, des lignes dans une file, et c’est exactement ce qu’on veut. Une automatisation qui ne refuse rien ne dit pas qu’elle a tout compris ; elle dit qu’elle ne vérifie rien.

## Ce qui s’automatise, ce qui attend une validation, ce qui reste humain

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| L’extraction des champs d’une pièce lisible | L’enregistrement de chaque écriture proposée | La qualification d’une pièce ambiguë |
| Les contrôles de cohérence, de période et de doublon | La création d’une fiche fournisseur | Le choix d’imputation d’un achat inhabituel |
| Le classement des anomalies par motif | La clôture d’un lot dont la file est vide | La relation avec le client pour une pièce manquante |

## Le scénario fictif : cinquante pièces inventées

Cinquante pièces inventées décrivent ici un scénario de recette avant qu’une règle ne touche un dossier réel. Ce scénario contient ses propres pièges : trente-deux factures de fournisseurs récurrents, six factures de fournisseurs jamais vus, quatre photos de tickets dont deux coupées, trois factures datées de la période précédente, deux exemplaires de la même facture reçus par deux canaux, deux notes de frais sans justificatif lisible, et un avoir. Ces catégories décrivent des entrées, pas des sorties exclusives : une facture peut cumuler un fournisseur inconnu et une mauvaise période, et « deux exemplaires » ne dit pas lequel est déjà au journal. Les visuels ci-dessus illustrent des sorties attendues de la règle ; ils ne constituent ni un logiciel exécuté ni une mesure obtenue sur cinquante fichiers.

Le résultat attendu s’écrit avant le test, sans aucun décompte mesuré : les factures récurrentes complètes peuvent devenir des écritures proposées après les six contrôles, mais le montant inhabituel est une appréciation humaine pour l’imputation, pas un écart HT + TVA. Les fournisseurs inconnus attendent la création d’une fiche par une personne ; cette décision précède les contrôles suivants. Les deux tickets coupés et les deux notes de frais sans justificatif lisible vont au motif « pièce incomplète », sous réserve de qualification humaine de leur nature ; les deux autres tickets restent à qualifier, et « passer » ne signifie pas enregistrer. Les factures de la période précédente restent affectées à leur période si aucun motif prioritaire ne les arrête ; un exemplaire éventuellement déjà enregistré est proposé au rapprochement, jamais supprimé. L’avoir est orienté vers une décision humaine sur sa nature et sa facture d’origine avant toute imputation : il n’est pas forcé dans le motif « document non facturé ». Si plusieurs contrôles échouent, la file garde la première sortie selon l’ordre du tableau, les autres restant à vérifier après décision ; ces entrées ne permettent pas de calculer le reliquat. Lors d’une mise en œuvre réelle, ces attentes deviennent des cas reproductibles, exécutés ligne par ligne ; le reliquat mesuré appartient alors uniquement au lot rejoué.

## Quel cadre pour les pièces, la facture électronique et les données ?

Une pièce lue n’est pas une pièce valable. Une facture reste un document dont le contenu est encadré : selon Service-Public, pour être conforme aux règles de facturation, une facture doit obligatoirement [comporter les mentions suivantes, que le client soit un particulier, un professionnel ou une entité publique](https://entreprendre.service-public.gouv.fr/vosdroits/F31808). Une lecture automatique peut constater l’absence d’un numéro ou d’une date ; elle ne peut pas décider que la pièce est régulière. Le contrôle des mentions se conçoit donc comme un signalement, jamais comme un verdict.

Pour les flux concernés, la facture électronique déplace ce travail sans le supprimer. La même administration note que [la facturation électronique impose un suivi des factures reçues tout au long de leur cycle de vie](https://entreprendre.service-public.gouv.fr/vosdroits/F39785). La fiche distingue l’obligation de réception au 1er septembre 2026 du calendrier d’émission, qui dépend de la taille de l’entreprise et des opérations concernées. Avant d’automatiser, le cabinet détermine donc quels flux et quelles échéances s’appliquent au dossier ; la règle suit ensuite les états de ces seules factures.

Le traitement des anomalies change lui aussi de nature. La même fiche décrit la possibilité, pour l’entreprise, [de signaler directement sur la plateforme toute anomalie (erreur, facture non conforme ou désaccord)](https://entreprendre.service-public.gouv.fr/vosdroits/F39785). La file interne du cabinet et ce signalement ne se confondent pas : la première sert à trier ce que la lecture n’a pas su traiter, le second engage la relation avec le fournisseur. Une règle peut préparer le motif et les pièces utiles, mais une personne décide si l’anomalie devient un signalement externe.

La pièce, elle, se conserve. Service-Public rappelle que les livres, registres, [documents ou pièces sur lesquels peuvent s’exercer les droits de communication, d’enquête et de contrôle de l’administration doivent être conservés](https://entreprendre.service-public.gouv.fr/vosdroits/F10029). La même fiche distingue notamment les pièces justificatives comptables, conservées dix ans à compter de la clôture de l’exercice, et certains documents relevant du contrôle fiscal, conservés six ans selon leur propre point de départ. Une chaîne de saisie ne remplace pas cette qualification : elle associe chaque catégorie à sa durée, garde l’accès au document requis et documente séparément les copies de travail.

Enfin, une facture peut porter des données personnelles : un nom de contact, une adresse, parfois un identifiant bancaire. La CNIL le pose simplement : [une donnée personnelle est toute information se rapportant à une personne physique identifiée ou identifiable](https://www.cnil.fr/fr/definition/donnee-personnelle). La présence de ces données ne suffit pas à qualifier automatiquement les rôles du cabinet, de son client et du service de lecture. Avant le branchement, ils sont déterminés traitement par traitement selon les finalités et les moyens ; les accès, la durée de conservation et le périmètre transmis sont ensuite écrits dans le cadre contractuel applicable.

## Les erreurs fréquentes

- **Prendre un champ extrait pour un champ vérifié.** La lecture propose ; elle ne certifie ni l’émetteur, ni la période, ni le total.
- **Laisser l’outil créer des fiches fournisseurs.** Deux fiches pour un même fournisseur coûtent plus cher que six créations à la main.
- **Arrondir un écart de montants.** L’écart est une information ; l’arrondi la supprime et garde l’erreur.
- **Imputer d’après l’habitude sans clause de sortie.** L’achat inhabituel chez un fournisseur habituel est le cas qui passe inaperçu.
- **Traiter les anomalies une par une.** Une file relue à heure fixe se traite ; une alerte par pièce se perd.
- **Confondre le reliquat d’un lot avec une performance.** Il se recompte à chaque période et ne se transporte pas d’un dossier à l’autre.

## Questions fréquentes

### Une lecture automatique peut-elle se passer de relecture humaine ?

Non, et pas pour une raison de qualité de lecture : pour une raison de responsabilité. C’est le cabinet qui répond de l’écriture enregistrée. La lecture réduit la frappe, elle ne transfère pas la décision. Le bon réglage consiste à rendre la validation rapide sur les pièces sans doute, et détaillée sur celles que la règle a signalées.

### Comment traiter une facture reçue en double par deux canaux ?

En la signalant comme doublon probable, jamais en la supprimant d’office. Le couple fournisseur et numéro constitue un premier indice ; la date, le montant, le contenu et l’identifiant de la pièce complètent la comparaison. Une personne décide ensuite d’écarter ou non un exemplaire, car un numéro identique peut aussi désigner deux pièces réellement différentes.

### Que faire d’une pièce datée de la période précédente ?

La conserver pour sa période, avec un état dédié. La rejeter la fait disparaître ; la saisir dans la période en cours fausse deux périodes au lieu d’une. C’est le même principe que pour la [relance des pièces manquantes](/blog/automatiser-la-relance-des-pieces-clients) : une pièce hors période n’est ni reçue ni absente.

### Faut-il commencer par les tickets ou par les factures fournisseurs ?

Par les factures de fournisseurs récurrents : elles sont nombreuses, régulières, et leur imputation est connue. Les tickets photographiés concentrent les cas illisibles et donnent une impression trompeuse de la règle si l’on commence par eux.

### La facture électronique rend-elle la lecture automatique inutile ?

Elle en réduit le périmètre là où elle s’applique, puisque les données arrivent structurées. Elle ne supprime ni les pièces reçues autrement, ni les contrôles de cohérence, de période et de doublon, ni le suivi des états décrit plus haut.

## La règle à retenir

Une extraction n’est pas une vérification. Six contrôles dans un ordre fixe préparent des alertes, les cas ambigus et l’imputation restent décidés par une personne, chaque enregistrement attend une validation, et le reliquat n’est mesuré qu’après le rejeu effectif d’un lot reproductible.

## Pour aller plus loin

Cette famille est l’une des treize du pôle production comptable décrites dans [la carte des tâches automatisables d’un cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches), et elle commence là où finit la collecte : sans pièce reçue, rien à lire. Nous prenons cette tâche entière : nous écrivons la règle de saisie de votre cabinet, fournisseurs récurrents, imputations habituelles et motifs de refus compris, nous l’automatisons dans les outils que vos équipes utilisent déjà, elles la recettent sur un lot de pièces, et nous la maintenons quand un fournisseur change. Vous gardez la validation de chaque écriture et l’imputation des achats inhabituels. C’est [la méthode](/methode), et c’est [le service](/automatisation-cabinet-comptable) : une tâche prise en charge, pas des sièges.
