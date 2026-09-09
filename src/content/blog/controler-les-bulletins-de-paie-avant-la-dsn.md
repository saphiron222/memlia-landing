---
titre: "Comment contrôler les bulletins de paie avant la DSN ?"
resume: "Contrôler avant de déposer : le remplacement d’une DSN se ferme la veille de l’échéance à minuit. Une liste de contrôles écrite, rejouée chaque mois sur les identités, les mentions, les variables et les écarts avec le mois précédent, puis DSN-Val et les comptes rendus métier. Le cabinet décide."
description: "Liste de contrôles à rejouer chaque mois entre la paie et le dépôt de la DSN : échéances, pénalités 2026, annule et remplace, DSN-Val, comptes rendus métier."
datePublication: 2026-09-09
auteur: kevin
sujets: [paie, dsn, cabinet, methode]
motsCles: ["contrôle des bulletins de paie", "DSN mensuelle", "annule et remplace DSN", "compte rendu métier URSSAF", "pénalités DSN", "DSN-Val"]
brouillon: false
image: img-23-controle-bulletins-paie
sources:
  - { editeur: "Légifrance", titre: "Code de la sécurité sociale, article R243-6 (échéances)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034668597", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code de la sécurité sociale, article R243-12 (défaut de déclaration)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039222430", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code de la sécurité sociale, article R243-13 (inexactitudes)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039222423", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code de la sécurité sociale, article R243-10 (droit à l’erreur)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039222442", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code de la sécurité sociale, article R133-14-2 (correction après compte rendu)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048854851", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code du travail, article R3243-1 (mentions du bulletin)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041757540", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Arrêté du 22 décembre 2025 portant fixation du plafond de la sécurité sociale pour 2026", url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053143451", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Arrêté du 11 août 2025 (report du bulletin de paie rénové)", url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052097236", consulte: 2026-09-09 }
  - { editeur: "Service-Public Entreprendre", titre: "Bulletin de paie simplifié : report au 1er janvier 2027", url: "https://entreprendre.service-public.gouv.fr/actualites/A18500", consulte: 2026-09-09 }
  - { editeur: "Service-Public Entreprendre", titre: "Plafond de la sécurité sociale 2026", url: "https://entreprendre.service-public.gouv.fr/actualites/A15386", consulte: 2026-09-09 }
  - { editeur: "Service-Public", titre: "Bulletin de paie : mentions obligatoires", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F559", consulte: 2026-09-09 }
  - { editeur: "net-entreprises.fr", titre: "Annule et remplace DSN mensuelle et signalements", url: "https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/~/annule-et-remplace-dsn-mensuelle-et-signalements", consulte: 2026-09-09 }
  - { editeur: "net-entreprises.fr", titre: "La fiabilisation des données de la DSN", url: "https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/", consulte: 2026-09-09 }
  - { editeur: "net-entreprises.fr", titre: "Comptes rendus métiers DSN", url: "https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/", consulte: 2026-09-09 }
  - { editeur: "net-entreprises.fr", titre: "Outils de contrôle DSN-Val", url: "https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/", consulte: 2026-09-09 }
  - { editeur: "net-entreprises.fr", titre: "Le bilan d’anomalies (BAN)", url: "https://net-entreprises.custhelp.com/app/answers/detail_dsn/a_id/2941/~/le-bilan-danomalies---ban", consulte: 2026-09-09 }
  - { editeur: "net-entreprises.fr", titre: "DSN : CRM de rappel et DSN de substitution, quand et pourquoi", url: "https://www.net-entreprises.fr/dsn-crm-de-rappel-et-dsn-de-substitution-quand-et-pourquoi-2/", consulte: 2026-09-09 }
  - { editeur: "Sécurité sociale (DSS)", titre: "L’Urssaf s’engage à renforcer la fiabilisation des données DSN", url: "https://www.securite-sociale.fr/home/medias/presse/list-presse/l'urssaf-s'engage-a-renforcer--1.html", consulte: 2026-09-09 }
  - { editeur: "Sénat", titre: "Question écrite n° 04132 : droit à l’erreur et DSN de substitution", url: "https://www.senat.fr/questions/base/2025/qSEQ250404132.html", consulte: 2026-09-09 }
---

Le contrôle des bulletins de paie se joue dans une fenêtre courte : entre le calcul de la paie et l'échéance de la DSN, le 5 ou le 15 du mois suivant. Une fois la DSN mensuelle déposée, elle ne peut plus être remplacée que jusqu'à la veille de l'échéance à minuit. Au-delà, l'erreur se corrige dans la déclaration du mois suivant, avec un compte rendu métier de l'URSSAF entre les deux. Ce guide décrit une liste de contrôles à rejouer chaque mois avant le dépôt, les délais qui l'encadrent, les pénalités qu'elle évite et ce qu'une automatisation peut prendre en charge sans jamais décider à la place du cabinet.

Il s'adresse aux gestionnaires de paie et aux responsables de pôle social en cabinet d'expertise comptable, qui produisent des bulletins pour des dizaines de dossiers avec des échéances différentes. Les textes cités sont ceux en vigueur au 9 septembre 2026.

## Pourquoi contrôler avant le dépôt, pas après

Le calendrier réglementaire ne laisse pas de marge après le dépôt. La DSN mensuelle est due au plus tard le 5 du mois suivant pour les employeurs d'au moins 50 salariés dont la paie est versée le mois même de la période de travail, et le 15 pour les autres ([Code de la sécurité sociale, article R243-6](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034668597)). Une DSN « annule et remplace » n'est acceptée que tant que cette échéance n'est pas dépassée, et net-entreprises précise que « l'échéance de dépôt des DSN “annule et remplace” est située la veille du jour de l'échéance à minuit », tandis que « pour les DSN initiales, le dépôt jusqu'au jour de l'échéance à midi demeure en place » ([net-entreprises, fiche 434](https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/~/annule-et-remplace-dsn-mensuelle-et-signalements), modifiée le 22 mars 2025).

Les pénalités sont calculées sur le plafond mensuel de la sécurité sociale, fixé à 4 005 € pour 2026 par l'arrêté du 22 décembre 2025 ([Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053143451) ; [Service-Public Entreprendre](https://entreprendre.service-public.gouv.fr/actualites/A15386), plafond annuel de 48 060 €). Trois articles du Code de la sécurité sociale s'appliquent :

- **Défaut de déclaration ou omission de salariés** : « une pénalité de 1,5 % du plafond mensuel de sécurité sociale » par salarié et par mois ou fraction de mois de retard, soit, calculé sur le plafond 2026, 60,08 € par salarié et par mois ; lorsque le retard n'excède pas cinq jours, la pénalité est plafonnée à 150 % du plafond mensuel par entreprise, soit 6 007,50 €, une seule fois par année civile ([article R243-12](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039222430)).
- **Inexactitude des rémunérations qui minore les cotisations** : 1 % du plafond mensuel par salarié, soit 40,05 € sur le plafond 2026 ; pour les autres omissions ou inexactitudes, un tiers de ce montant ([article R243-13](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039222423)).
- **Droit à l'erreur** : pas de pénalité si la déclaration rectifiée et le complément de cotisations « sont adressées au plus tard lors de la première échéance suivant celle de la déclaration et du versement initial », hors omission de salariés et inexactitudes répétées ([article R243-10](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039222442)).

Les montants par salarié paraissent faibles ; multipliés par l'effectif d'un dossier et par les mois de retard, ils ne le sont plus. Et le volume d'anomalies n'est pas anecdotique : sur l'année 2023, l'URSSAF « a mis en œuvre 95 points de contrôles différents sur les déclarations » et a comptabilisé « près de 6 millions d'anomalies déclaratives comptabilisées au niveau des établissements et 13,3 millions de situations individuelles qui ont été signalées » ([securite-sociale.fr, communiqué du 5 avril 2024](https://www.securite-sociale.fr/home/medias/presse/list-presse/l'urssaf-s'engage-a-renforcer--1.html)).

<figure>
<svg viewBox="0 0 720 240" role="img" aria-labelledby="fig-dsn-titre" xmlns="http://www.w3.org/2000/svg" font-family="Hanken Grotesk, Arial, sans-serif">
<title id="fig-dsn-titre">Le cycle mensuel : paie, contrôle, dépôt, compte rendu à H+4, veille de l’échéance à minuit, échéance, compte rendu à J+5, correction dans la DSN suivante</title>
<rect x="0" y="0" width="720" height="240" fill="#fcfbf7"/>
<text x="360" y="30" text-anchor="middle" font-size="14" font-weight="600" fill="#231f20">Chaque mois, la même fenêtre : contrôler avant, corriger pendant, régulariser après</text>
<rect x="40" y="122" width="320" height="16" rx="8" fill="#eafaef"/>
<line x1="40" y1="130" x2="680" y2="130" stroke="#231f20" stroke-opacity="0.25" stroke-width="2"/>
<text x="210" y="116" text-anchor="middle" font-size="11" font-weight="600" fill="#176f37">fenêtre de correction : annule et remplace</text>
<g fill="#231f20">
<circle cx="60" cy="130" r="7" fill="#231f20"/><text x="60" y="100" text-anchor="middle" font-size="12">paie calculée</text>
<circle cx="160" cy="130" r="7" fill="#27b657" stroke="#1c8a41" stroke-width="2"/><text x="160" y="164" text-anchor="middle" font-size="12" font-weight="600">contrôles</text><text x="160" y="182" text-anchor="middle" font-size="11" fill-opacity="0.7">liste rejouée</text>
<circle cx="260" cy="130" r="7" fill="#231f20"/><text x="260" y="100" text-anchor="middle" font-size="12">dépôt DSN</text><text x="260" y="82" text-anchor="middle" font-size="11" fill-opacity="0.7">compte rendu à H+4</text>
<circle cx="360" cy="130" r="7" fill="#231f20"/><text x="360" y="164" text-anchor="middle" font-size="12">veille, minuit</text><text x="360" y="182" text-anchor="middle" font-size="11" fill-opacity="0.7">fin du remplacement</text>
<circle cx="460" cy="130" r="9" fill="#fffefb" stroke="#a4322a" stroke-width="3"/><text x="460" y="100" text-anchor="middle" font-size="12" font-weight="600">échéance</text><text x="460" y="82" text-anchor="middle" font-size="11" fill-opacity="0.7">le 5 ou le 15</text>
<circle cx="560" cy="130" r="7" fill="#231f20"/><text x="560" y="164" text-anchor="middle" font-size="12">compte rendu à J+5</text><text x="560" y="182" text-anchor="middle" font-size="11" fill-opacity="0.7">écarts à corriger</text>
<circle cx="660" cy="130" r="7" fill="#231f20"/><text x="700" y="100" text-anchor="end" font-size="12">DSN du mois suivant</text><text x="700" y="82" text-anchor="end" font-size="11" fill-opacity="0.7">sur la période d’origine</text>
</g>
<text x="360" y="222" text-anchor="middle" font-size="11" fill="#231f20" fill-opacity="0.6">Délais publiés par net-entreprises (fiabilisation des données de la DSN, mise à jour du 18 mai 2026).</text>
</svg>
<figcaption>Le cycle mensuel d'un dossier de paie et la place du contrôle avant le dépôt.</figcaption>
</figure>

## Étape 1 : écrire la liste des contrôles une fois pour toutes

À la fin de cette étape, le cabinet dispose d'une liste de contrôles écrite, numérotée, la même pour tous les dossiers, avec pour chaque contrôle ce qui déclenche un écart.

Un contrôle qui n'est pas écrit dépend de la personne qui le fait ce mois-là. La liste ci-dessous couvre quatre familles ; le cabinet l'adapte à ses conventions collectives et à ses logiciels.

| Famille | Contrôles | Repère réglementaire |
| --- | --- | --- |
| Identité et effectif | Entrées et sorties du mois cohérentes avec les contrats et les déclarations d'embauche ; aucun salarié présent le mois précédent absent sans motif de sortie ; identifiants complets | Omission de salariés : pénalité de l'article R243-12 |
| Mentions du bulletin | Les rubriques de l'article R3243-1 sont présentes, dont « l'assiette, le taux et le montant de la retenue à la source » (9°), le montant défini à l'article R844-1 du Code de la sécurité sociale (9° bis, base du montant net social) et « le montant de la somme effectivement reçue par le salarié » (10°) | [Code du travail, article R3243-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041757540) |
| Variables du mois | Heures au taux normal et heures supplémentaires, absences, congés payés, primes et indemnités saisies conformément aux pièces reçues ; rien saisi sans pièce | [Fiche bulletin de paie, service-public](https://www.service-public.gouv.fr/particuliers/vosdroits/F559) |
| Assiettes et taux | Assiette plafonnée cohérente avec le plafond mensuel 2026 (4 005 €) ; taux de cotisations de l'année en vigueur ; taux de prélèvement à la source issus du dernier compte rendu nominatif de la DGFiP | [Arrêté du 22 décembre 2025](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053143451) |

Un point de calendrier à intégrer dès maintenant : le modèle rénové de bulletin de paie devient obligatoire le 1er janvier 2027, l'arrêté du 11 août 2025 ayant remplacé la date du 1er janvier 2026 par celle du 1er janvier 2027 ([Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052097236)) ; le modèle actuel « reste autorisé jusqu'au 31 décembre 2026 » ([Service-Public Entreprendre, 1er octobre 2025](https://entreprendre.service-public.gouv.fr/actualites/A18500)). Le contrôle des mentions devra être réécrit pour la paie de janvier 2027.

Vérification : donnez la liste à deux gestionnaires et un même bulletin fictif comportant trois erreurs volontaires. S'ils ne relèvent pas les trois, la liste est ambiguë ; reformulez les contrôles concernés.

## Étape 2 : comparer chaque bulletin au mois précédent

À la fin de cette étape, chaque dossier dispose d'un état des écarts entre le mois courant et le mois précédent, salarié par salarié, et chaque écart est soit expliqué par une pièce, soit signalé.

La plupart des erreurs de paie ne sont pas des erreurs de calcul, que le logiciel fait juste, mais des erreurs d'entrée : une absence non saisie, une prime oubliée, un taux non mis à jour, un salarié sorti encore présent. La comparaison avec le mois précédent les fait apparaître. Le cabinet fixe ses seuils : variation du brut ou du net au-delà d'un pourcentage, apparition ou disparition d'une rubrique, changement de taux de prélèvement à la source, changement de temps de travail.

Un écart n'est pas une erreur. Une prime annuelle ou une entrée en cours de mois produisent un écart légitime. Le principe de la méthode est de séparer la détection, qui est mécanique, de la qualification, qui demande le dossier et le jugement du gestionnaire. Chaque écart signalé reçoit une réponse courte : « prime exceptionnelle, pièce reçue le 3 » ou « à corriger ». C'est ce que Memlia appelle [proposition vs saisie](/#preuves) : la mécanique propose, la personne qualifie.

Vérification : pour un dossier, comptez les écarts signalés et les écarts qualifiés. S'ils diffèrent, un écart est passé sans décision.

## Étape 3 : passer le fichier au contrôle avant de le déposer

À la fin de cette étape, le fichier DSN a été testé hors ligne et ne contient plus d'anomalie bloquante connue.

net-entreprises met à disposition un outil dédié : « l'outil de contrôle Dsn-Val permet de tester votre fichier DSN avant de le déposer ». La version publiée suit la norme DSN de l'année en cours (norme 2026.1 au 9 septembre 2026) ; une brique de contrôle intégrée au logiciel de paie sert « à détecter les erreurs de saisies à la source et éviter des rejets » ([net-entreprises, outils de contrôle DSN-Val](https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/)). Ce contrôle vérifie la structure et la cohérence du fichier au regard de la norme ; il ne sait pas qu'une prime manque. Il complète les étapes 1 et 2, il ne les remplace pas.

Après dépôt, le bilan d'anomalies informe le déclarant des anomalies détectées aux contrôles de la plateforme et, le cas échéant, de l'invalidité de la déclaration ([net-entreprises, le bilan d'anomalies](https://net-entreprises.custhelp.com/app/answers/detail_dsn/a_id/2941/~/le-bilan-danomalies---ban)). Un dépôt sans bilan bloquant n'est pas encore une déclaration juste ; c'est une déclaration acceptée.

Vérification : conservez, pour chaque dossier et chaque mois, la trace du passage à DSN-Val et son résultat. Un dossier sans trace n'est pas contrôlé.

## Étape 4 : lire les comptes rendus métier et corriger dans la bonne fenêtre

À la fin de cette étape, chaque retour d'organisme a été lu, daté et traité dans le délai qui lui correspond.

Un compte rendu métier « est un rapport permettant à l'organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu'une erreur ou suspicion d'erreur est détectée » ([net-entreprises, comptes rendus métiers](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/)). L'URSSAF en émet trois qui rythment le mois ([net-entreprises, fiabilisation des données de la DSN](https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/), mise à jour du 18 mai 2026) :

1. **Le compte rendu transmis à H+4 après le dépôt.** Il permet de corriger en paie et de redéposer une annule et remplace avant minuit la veille de l'échéance. La recommandation de la plateforme est explicite : corriger « au plus tôt les erreurs signalées en réalisant la modification en paie et en transmettant une DSN “annule et remplace” ». Corriger la DSN sans corriger la paie recrée l'erreur le mois suivant.
2. **Le compte rendu transmis à J+5 après l'échéance.** Il liste les écarts à corriger dans la DSN suivante ; « les écarts de taux et d'assiette doivent être corrigés dans la DSN du mois suivant sur la période d'afférence ».
3. **Le compte rendu de rappel annuel, en mars.** Il récapitule les anomalies de l'année précédente non corrigées. Depuis le décret du 30 décembre 2023, l'employeur doit corriger « lors de l'échéance déclarative la plus proche qui ne peut être inférieure à trente jours » ou s'opposer de façon motivée ; à défaut, l'organisme peut établir une déclaration corrigée qui se substitue à celle de l'employeur ([Code de la sécurité sociale, article R133-14-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048854851)). net-entreprises indique que « les premières DSN de substitution seront transmises en mai 2026 » et que la correction est attendue « au plus tard lors de la seconde échéance déclarative suivant la notification du CRM de rappel » ([net-entreprises, CRM de rappel et DSN de substitution](https://www.net-entreprises.fr/dsn-crm-de-rappel-et-dsn-de-substitution-quand-et-pourquoi-2/), mise à jour du 7 avril 2026).

En réponse à une question écrite, le ministère du Travail a confirmé que ce dispositif préserve « le droit à l'erreur, le déclarant pouvant régulariser sans sanction sa DSN lors de sa prochaine déclaration » et qu'une période contradictoire précède toute substitution ([Sénat, question n° 04132, réponse du 19 février 2026](https://www.senat.fr/questions/base/2025/qSEQ250404132.html)). Le droit à l'erreur existe ; il suppose de lire les retours et de répondre dans le délai.

Vérification : pour le mois écoulé, listez les comptes rendus reçus par dossier, la date de lecture et l'action décidée. Une ligne vide est un délai qui court.

## Étape 5 : tracer qui a contrôlé quoi, et quand

À la fin de cette étape, le contrôle est visible dans le suivi du pôle, dossier par dossier, sans devenir un outil de mesure des personnes.

Le contrôle avant DSN est une étape du cycle de production, entre « bulletins établis » et « DSN déposée ». Il mérite sa colonne d'état dans le classeur de suivi et une date, pour que le responsable de pôle sache combien de dossiers sont contrôlés à trois jours de l'échéance. La façon de structurer ce classeur sans le transformer en surveillance des gestionnaires est décrite dans [suivre la production sociale dans Excel sans surveiller les personnes](/blog/suivre-la-production-sociale-dans-excel).

Vérification : à trois jours de l'échéance, comptez les dossiers du mois sans date de contrôle. Chacun est une DSN qui partira sans avoir été relue, ou en retard.

## Ce qu'une automatisation peut prendre en charge

Les étapes 1 à 3 sont, pour l'essentiel, mécaniques : rejouer une liste de contrôles écrite, comparer deux mois, lancer un outil de validation et lire son résultat. Elles se prêtent à une automatisation intégrée aux [outils que le cabinet utilise déjà](/#integration), à trois conditions. La liste de contrôles est écrite avec le cabinet et testée sur un jeu de bulletins fictifs comprenant les erreurs attendues. L'automatisation signale les écarts avec la règle qui les a produits ; elle ne corrige pas la paie et ne dépose rien. Un cas qu'elle ne sait pas qualifier est bloqué et remonté, pas complété en silence.

Ce cadre est celui du service Memlia : automatiser avec l'IA les tâches chronophages des cabinets d'expertise comptable, en gardant au cabinet la décision et l'envoi. Une automatisation de contrôle ne garantit pas à elle seule la conformité de la paie ou de la DSN ; les textes cités plus haut placent la déclaration et sa correction sous la responsabilité du déclarant, et c'est le gestionnaire qui valide avant le dépôt. Les [garanties du service](/#garanties) reprennent ce principe : aucun envoi externe sans validation humaine.

## Les erreurs fréquentes

**Contrôler après le dépôt.** Le compte rendu à H+4 est utile, mais la fenêtre se ferme la veille de l'échéance à minuit. Déposer le jour de l'échéance à midi, c'est renoncer au remplacement.

**Corriger la DSN sans corriger la paie.** L'erreur revient le mois suivant, et le compte rendu avec elle. La correction se fait en paie, puis dans la déclaration.

**Laisser un compte rendu sans réponse.** Le rappel annuel de mars ouvre un délai ; passé la seconde échéance suivante, l'organisme peut substituer sa déclaration à celle du cabinet.

**Démarrer l'année avec les paramètres de l'année précédente.** Le plafond 2026 est passé à 4 005 € par mois et 48 060 € par an, en hausse de 2 % ; un contrôle d'assiette plafonnée sur l'ancienne valeur laisse passer des écarts sur tous les salariés concernés.

## Questions fréquentes

### Jusqu'à quand peut-on remplacer une DSN mensuelle déjà déposée ?

Jusqu'à la veille de l'échéance à minuit, par une DSN annule et remplace, tant que l'échéance retenue pour l'entreprise (le 5 ou le 15) n'est pas dépassée. Après, la correction passe par la DSN du mois suivant, sur la période d'origine. Les signalements d'événement, eux, n'ont pas de date limite de remplacement.

### Une erreur corrigée le mois suivant est-elle pénalisée ?

Pas si la déclaration rectifiée et le complément de cotisations sont adressés au plus tard à la première échéance suivante, dans les conditions de l'article R243-10 du Code de la sécurité sociale. L'omission de salariés et les inexactitudes répétées restent hors de ce droit à l'erreur.

### DSN-Val suffit-il comme contrôle ?

Non. DSN-Val vérifie la conformité du fichier à la norme, pas la justesse des variables de paie. Une prime oubliée ou une absence non saisie produisent un fichier valide et une déclaration fausse. Les contrôles des étapes 1 et 2 restent nécessaires.

### Faut-il refaire la paie ou régulariser sur le bulletin suivant ?

Cela dépend de l'erreur et de la date. Avant l'échéance, la correction en paie suivie d'une annule et remplace remet le mois d'aplomb. Après l'échéance, la régularisation sur la période suivante est la voie prévue par les textes, avec correction en paie pour ne pas reproduire l'écart. C'est une décision du gestionnaire et de l'expert-comptable, dossier par dossier.

## Ce qu'il faut retenir

Le contrôle des bulletins avant la DSN tient en cinq gestes rejoués chaque mois : une liste de contrôles écrite, une comparaison avec le mois précédent où chaque écart est qualifié, un passage à DSN-Val, une lecture datée des comptes rendus métier dans la fenêtre qui leur correspond, et une trace du contrôle dans le suivi du pôle. La mécanique de ces gestes peut être automatisée ; la qualification des écarts, la correction en paie et le dépôt restent des décisions du cabinet.
