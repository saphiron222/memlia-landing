---
titre: "Suivre la production sociale dans Excel sans surveiller les personnes"
resume: "Un classeur de suivi tient si son unité est le dossier et l’étape, jamais la personne : une ligne par dossier et par mois, des états fermés, des agrégats par étape et par période, des exceptions signalées avant la DSN. Le droit impose proportionnalité, information des salariés et avis du CSE."
titreOnglet: "Suivi de production sociale dans Excel, sans surveillance | Memlia"
description: "Méthode en cinq étapes pour structurer un classeur Excel de suivi de la production sociale d’un cabinet : dossier, étape, agrégats, exceptions, cadre CNIL."
datePublication: 2026-09-09
auteur: kevin
sujets: [production-sociale, excel, cabinet, methode]
motsCles: ["suivi de production sociale", "classeur Excel cabinet comptable", "pôle social", "surveillance des salariés CNIL", "tableau structuré Excel"]
brouillon: false
image: img-24-suivi-production-sociale
sources:
  - { editeur: "Légifrance", titre: "Code du travail, article L1121-1", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900785", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code du travail, article L1222-4", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900861", consulte: 2026-09-09 }
  - { editeur: "Légifrance", titre: "Code du travail, article L2312-38", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035610275/2022-04-12", consulte: 2026-09-09 }
  - { editeur: "CNIL", titre: "Contrôle de l’activité des personnes employées", url: "https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees", consulte: 2026-09-09 }
  - { editeur: "CNIL", titre: "Surveillance excessive des salariés : sanction de 40 000 euros", url: "https://www.cnil.fr/fr/surveillance-excessive-des-salaries-sanction-de-40-000-euros-entreprise-secteur-immobilier", consulte: 2026-09-09 }
  - { editeur: "CNIL", titre: "Les questions-réponses de la CNIL sur le télétravail", url: "https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-le-teletravail", consulte: 2026-09-09 }
  - { editeur: "CNIL", titre: "Règlement européen sur la protection des données, chapitre 2 (article 5)", url: "https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2", consulte: 2026-09-09 }
  - { editeur: "Service-Public Entreprendre", titre: "Déclaration sociale nominative (DSN)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F24013", consulte: 2026-09-09 }
  - { editeur: "Service-Public Entreprendre", titre: "Déclaration préalable à l’embauche (DPAE)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F23697", consulte: 2026-09-09 }
  - { editeur: "Service-Public", titre: "Bulletin de paie : mentions obligatoires", url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F559", consulte: 2026-09-09 }
  - { editeur: "Microsoft Support", titre: "Overview of Excel tables", url: "https://support.microsoft.com/en-us/office/overview-of-excel-tables-7ab0bb7d-3a9e-4b56-a3c9-6c94334e492c", consulte: 2026-09-09 }
  - { editeur: "Microsoft Support", titre: "Apply data validation to cells", url: "https://support.microsoft.com/en-us/office/apply-data-validation-to-cells-29fecbcc-d1b9-42c1-9d76-eff3ce5f7249", consulte: 2026-09-09 }
  - { editeur: "Microsoft Support", titre: "Protect a worksheet", url: "https://support.microsoft.com/en-us/office/protect-a-worksheet-3179efdb-1285-4d49-a9c3-f4ca36276de6", consulte: 2026-09-09 }
  - { editeur: "Raymond R. Panko (arXiv)", titre: "What We Don’t Know About Spreadsheet Errors Today", url: "https://arxiv.org/abs/1602.02601", consulte: 2026-09-09 }
---

Un pôle social de cabinet tient presque toujours un classeur de suivi : quels dossiers ont reçu leurs variables, quels bulletins sont établis, quelles DSN restent à déposer avant le 5 ou le 15 du mois. Ce classeur rend service tant qu'il décrit des dossiers. Il devient un problème le jour où une colonne « gestionnaire » se transforme en classement des personnes, ou le jour où plus personne ne sait quelle formule fait foi.

Ce guide propose une méthode en cinq étapes pour construire, dans Excel, un suivi de production sociale utile au pilotage du pôle, construit dans le cadre posé par le Code du travail et la CNIL, et assez structuré pour être automatisé plus tard sans le refaire. Il s'adresse aux responsables de pôle social, aux experts-comptables et aux gestionnaires de paie. Ils veulent voir ce qui avance, ce qui bloque et ce qui manque, sans regarder par-dessus l'épaule de leurs collègues.

## Pourquoi un classeur de suivi dérive

Un tableau de suivi dérive quand son unité de compte change sans que personne ne l'ait décidé. Au départ, chaque ligne décrit un dossier client et son avancement dans le mois. Puis on ajoute une colonne pour savoir qui s'en occupe, une autre pour compter les bulletins produits, un onglet qui totalise par gestionnaire. Le tableau ne suit plus la production ; il mesure des individus.

Cette dérive a trois conséquences. La première est juridique : un dispositif qui collecte des informations sur l'activité des salariés doit respecter des conditions précises, décrites plus bas. La deuxième est pratique : dès que le tableau sert à comparer les personnes, les saisies deviennent moins fiables, parce que chacun sait ce qu'on en fera. La troisième est technique : un classeur où les états, les formules et les totaux vivent dans les mêmes cellules casse silencieusement. Raymond Panko rappelle en 2016, selon les études qu'il recense, que les erreurs de tableur sont rares cellule par cellule, mais qu'un tableur volumineux a de fortes chances de contenir au moins une valeur finale fausse ([arXiv 1602.02601](https://arxiv.org/abs/1602.02601), consulté le 9 septembre 2026).

Le calendrier ajoute la pression : la DSN mensuelle est due au plus tard le 15 du mois suivant pour les employeurs de moins de 50 salariés, et le 5 pour ceux d'au moins 50 salariés dont la paie est versée le mois même ([Service-Public Entreprendre, fiche F24013](https://entreprendre.service-public.gouv.fr/vosdroits/F24013), vérifiée le 1er juin 2026). Un pôle qui gère des dizaines de dossiers a besoin de savoir, chaque jour du cycle, ce qui reste à faire avant ces deux dates. La liste des vérifications à rejouer sur les bulletins eux-mêmes fait l'objet d'un article distinct, cité à l'étape 1.

## Ce que le droit impose avant de construire le tableau

Un classeur de suivi de production n'est pas un outil de surveillance par nature. Il peut le devenir par son contenu, et le droit français fixe trois conditions que le tableau doit remplir dès sa conception.

**La proportionnalité.** Le Code du travail dispose que « nul ne peut apporter aux droits des personnes et aux libertés individuelles et collectives de restrictions qui ne seraient pas justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché » ([article L1121-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900785)). La CNIL en tire une règle simple : « une surveillance constante est excessive » ([CNIL, contrôle de l'activité des personnes employées](https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees), page du 9 juillet 2026). La même page donne un exemple utile pour un pôle social : un logiciel qui compte et transmet, de façon transparente, le nombre de dossiers traités par trimestre et par salarié « semble proportionné car la fréquence de la remontée d'information n'est pas assimilable à une surveillance constante ». La fréquence et le niveau d'agrégation font la différence.

**L'information préalable.** « Aucune information concernant personnellement un salarié ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance » ([article L1222-4](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006900861)). Si le classeur enregistre qui a fait quoi et quand, les gestionnaires doivent le savoir avant, pas après.

**La consultation du CSE.** Lorsqu'il existe, le comité social et économique « est informé et consulté, préalablement à la décision de mise en œuvre dans l'entreprise, sur les moyens ou les techniques permettant un contrôle de l'activité des salariés » ([article L2312-38](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000035610275/2022-04-12)).

Le règlement européen ajoute le principe de minimisation : les données doivent être « adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités » ([RGPD, article 5, reproduit par la CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2)). Et la sanction n'est pas théorique : le 19 décembre 2024, la CNIL a prononcé une amende de 40 000 euros contre une société qui mesurait les périodes d'inactivité de ses salariés et prenait des captures d'écran régulières, une « atteinte disproportionnée » selon la décision ([CNIL, 4 février 2025](https://www.cnil.fr/fr/surveillance-excessive-des-salaries-sanction-de-40-000-euros-entreprise-secteur-immobilier)).

La conclusion pour le classeur est nette : suivre des dossiers et des étapes est proportionné ; compter les gestes des personnes en continu ne l'est pas. Ce principe est aussi celui que Memlia applique à toute vue de pilotage : [des agrégats, jamais un classement individuel](/#faq-surveillance).

## Étape 1 : choisir le dossier et l'étape comme unité de suivi

À la fin de cette étape, vous avez une grille où chaque ligne représente un dossier client pour un mois de paie, et où l'avancement se lit dans une colonne d'état à valeurs fermées.

Le cycle mensuel d'un dossier de paie passe par des étapes que tout pôle reconnaît. Leur liste exacte dépend du cabinet ; celle-ci sert de point de départ.

| Étape | Ce qu'elle constate | Repère public |
| --- | --- | --- |
| Pièces reçues | Le client a transmis ses variables du mois : heures, absences, entrées, sorties, primes | Les entrées relèvent de la DPAE, à faire au plus tôt huit jours avant l'embauche ([fiche F23697](https://entreprendre.service-public.gouv.fr/vosdroits/F23697)) |
| Variables saisies | Les éléments sont intégrés dans le logiciel de paie | Le bulletin doit distinguer heures au taux normal et heures supplémentaires, congés payés et activité partielle ([fiche F559](https://www.service-public.gouv.fr/particuliers/vosdroits/F559)) |
| Bulletins établis | Les bulletins du mois sont calculés | Mentions obligatoires de la [fiche F559](https://www.service-public.gouv.fr/particuliers/vosdroits/F559) |
| Contrôle avant DSN | Les vérifications de cohérence sont faites, les écarts traités | Liste de contrôles décrite dans l'article sur [le contrôle des bulletins avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn) |
| DSN déposée | La déclaration est transmise avant le 5 ou le 15 | [Fiche F24013](https://entreprendre.service-public.gouv.fr/vosdroits/F24013) |
| Documents envoyés | Bulletins et journaux remis au client | Conservation du double du bulletin : [fiche F559](https://www.service-public.gouv.fr/particuliers/vosdroits/F559) |

Deux règles rendent cette grille robuste. La première : une ligne par dossier et par mois, jamais une ligne par gestionnaire. La seconde : l'état d'un dossier est une valeur choisie dans une liste fermée (« en attente de pièces », « pièces incomplètes », « saisi », « contrôlé », « déposé », « envoyé »), pas un texte libre. Un texte libre ne se compte pas ; une liste fermée se compte, se filtre et se vérifie.

Vérification : prenez trois dossiers du mois dernier et décrivez leur parcours avec la grille. Si une situation réelle ne rentre dans aucun état, la liste est incomplète et il faut l'amender avant d'aller plus loin.

## Étape 2 : structurer le classeur pour qu'il se compte

À la fin de cette étape, le classeur sépare ce que le cabinet saisit de ce que les formules calculent, et la saisie est contrainte.

<figure>
<svg viewBox="0 0 720 260" role="img" aria-labelledby="fig1-titre" xmlns="http://www.w3.org/2000/svg" font-family="Hanken Grotesk, Arial, sans-serif">
<title id="fig1-titre">Trois feuilles : saisie par le cabinet, calcul par formules, vue en agrégats du pôle</title>
<rect x="0" y="0" width="720" height="260" fill="#fcfbf7"/>
<g>
<rect x="24" y="40" width="200" height="170" rx="12" fill="#fffefb" stroke="#231f20" stroke-opacity="0.18"/>
<text x="124" y="72" text-anchor="middle" font-size="16" font-weight="600" fill="#231f20">Feuille Saisie</text>
<text x="124" y="98" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">une ligne par dossier et par mois</text>
<text x="124" y="120" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">états en liste fermée</text>
<text x="124" y="142" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">dates de réception et de dépôt</text>
<text x="124" y="186" text-anchor="middle" font-size="12" font-weight="600" fill="#176f37">le cabinet écrit ici</text>
</g>
<path d="M232 125 H264" stroke="#1c8a41" stroke-width="2"/>
<path d="M258 118 L268 125 L258 132" fill="none" stroke="#1c8a41" stroke-width="2"/>
<g>
<rect x="272" y="40" width="176" height="170" rx="12" fill="#fffefb" stroke="#231f20" stroke-opacity="0.18"/>
<text x="360" y="72" text-anchor="middle" font-size="16" font-weight="600" fill="#231f20">Feuille Calcul</text>
<text x="360" y="98" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">formules seulement</text>
<text x="360" y="120" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">jours avant l’échéance</text>
<text x="360" y="142" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">exceptions détectées</text>
<text x="360" y="186" text-anchor="middle" font-size="12" font-weight="600" fill="#176f37">feuille protégée</text>
</g>
<path d="M456 125 H488" stroke="#1c8a41" stroke-width="2"/>
<path d="M482 118 L492 125 L482 132" fill="none" stroke="#1c8a41" stroke-width="2"/>
<g>
<rect x="496" y="40" width="200" height="170" rx="12" fill="#eafaef" stroke="#1c8a41" stroke-opacity="0.5"/>
<text x="596" y="72" text-anchor="middle" font-size="16" font-weight="600" fill="#231f20">Feuille Vue</text>
<text x="596" y="98" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">dossiers par état</text>
<text x="596" y="120" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">avancement du mois du pôle</text>
<text x="596" y="142" text-anchor="middle" font-size="13" fill="#231f20" fill-opacity="0.72">aucune colonne nominative</text>
<text x="596" y="186" text-anchor="middle" font-size="12" font-weight="600" fill="#176f37">agrégats par étape et par période</text>
</g>
<text x="360" y="240" text-anchor="middle" font-size="12" fill="#231f20" fill-opacity="0.6">Ce que le cabinet saisit ne se touche jamais ; ce qui est calculé se régénère.</text>
</svg>
<figcaption>Un classeur qui se compte : la saisie, le calcul et la vue de pilotage vivent dans trois feuilles distinctes.</figcaption>
</figure>

Quatre fonctions natives d'Excel suffisent pour poser cette structure.

1. **Un tableau structuré pour la feuille Saisie.** Microsoft résume son intérêt : « pour faciliter la gestion et l'analyse d'un groupe de données liées, vous pouvez convertir une plage de cellules en tableau Excel » ; chaque colonne porte alors filtre et tri dans son en-tête, et les colonnes calculées se propagent à toute nouvelle ligne ([Overview of Excel tables](https://support.microsoft.com/en-us/office/overview-of-excel-tables-7ab0bb7d-3a9e-4b56-a3c9-6c94334e492c)).
2. **La validation des données sur la colonne d'état.** Elle sert à « restreindre le type de données ou les valeurs que les utilisateurs saisissent dans une cellule, par exemple une liste déroulante » ([Apply data validation to cells](https://support.microsoft.com/en-us/office/apply-data-validation-to-cells-29fecbcc-d1b9-42c1-9d76-eff3ce5f7249)). La liste fermée de l'étape 1 devient une contrainte, pas une consigne.
3. **La protection de la feuille Calcul.** Elle empêche de modifier, déplacer ou supprimer, par accident ou délibérément, les données des cellules verrouillées. Microsoft précise que « la protection au niveau de la feuille n'est pas conçue comme une fonction de sécurité » ([Protect a worksheet](https://support.microsoft.com/en-us/office/protect-a-worksheet-3179efdb-1285-4d49-a9c3-f4ca36276de6)) : elle protège des maladresses, pas d'un accès indu, ce qui relève des droits sur le fichier partagé.
4. **Des dates, pas des cases à cocher.** Une date de réception des pièces et une date de dépôt de la DSN permettent de calculer les jours restants avant l'échéance et de reconstituer le cycle a posteriori. Une case cochée ne dit ni quand ni combien de temps.

Vérification : essayez de taper un état qui n'est pas dans la liste, et essayez d'écrire dans une cellule de la feuille Calcul. Les deux doivent être refusés.

## Étape 3 : calculer des agrégats par étape, jamais des classements

À la fin de cette étape, la feuille Vue répond aux questions du pilotage sans nommer personne.

Les indicateurs utiles à un responsable de pôle portent sur le flux de dossiers : combien de dossiers sont encore en attente de pièces à dix jours de l'échéance, combien sont contrôlés mais non déposés, quelle part du portefeuille est déposée à la date du jour, combien de dossiers ont dépassé l'échéance ce mois-ci. Chacun se calcule avec une fonction de comptage conditionnel sur la colonne d'état et sur les dates, à l'échelle du pôle ou par échéance (5 ou 15).

Ce que la feuille Vue ne contient pas est aussi important que ce qu'elle contient. Pas de colonne « gestionnaire », pas de nombre de bulletins par personne, pas de temps passé par ligne. Si la répartition de la charge doit être discutée, elle l'est à partir du nombre de dossiers affectés en début de mois, à une fréquence compatible avec l'exemple retenu par la CNIL, et en présence des personnes concernées. La CNIL cite d'ailleurs, pour le télétravail, deux alternatives à la surveillance permanente : « un contrôle de la réalisation par objectifs pour une période donnée » et « un compte rendu régulier du salarié » ([questions-réponses sur le télétravail](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-le-teletravail), 12 novembre 2020).

Vérification : montrez la feuille Vue à un gestionnaire et demandez-lui s'il y trouve quelque chose sur lui. La bonne réponse est non.

## Étape 4 : signaler les exceptions avant l'échéance

À la fin de cette étape, le classeur met en évidence les dossiers qui demandent une décision, avec la règle qui les a signalés.

Une exception est un dossier qui ne suit pas le cycle attendu : pièces non reçues à une date fixée par le cabinet, pièces reçues mais incomplètes, contrôle qui a relevé un écart, DSN non déposée alors que l'échéance approche. Chaque règle s'écrit en une phrase (« pièces non reçues cinq jours ouvrés avant l'échéance du dossier »), puis en une formule dans la feuille Calcul, puis en une mise en forme conditionnelle visible dans la feuille Saisie.

Le classeur signale ; il ne décide pas. Relancer le client, accepter une paie sur des variables partielles ou reporter un dépôt sont des décisions du gestionnaire et de l'expert-comptable. Cette séparation entre la mécanique et le jugement est celle que décrit la [méthode Memlia](/#methode) : ce qui est certain est préparé, ce qui est ambigu est signalé.

Vérification : introduisez un dossier fictif avec une date de réception vide et une échéance dans trois jours. Il doit apparaître dans les exceptions, avec la règle qui l'a détecté.

## Étape 5 : encadrer l'usage et le dire à l'équipe

À la fin de cette étape, l'usage du classeur est écrit, connu et limité.

Trois documents courts suffisent. Une note de finalité, qui dit ce que le classeur suit (des dossiers et des étapes), qui le lit (le responsable de pôle et l'expert-comptable) et ce qu'il ne fait pas (aucune évaluation individuelle). Une information des gestionnaires, avant la mise en service, conforme à l'article L1222-4. Une consultation du CSE lorsqu'il existe, conforme à l'article L2312-38. Si le classeur ne contient ni nom de gestionnaire ni mesure d'activité personnelle, ce cadrage est rapide ; c'est justement ce que la structure des étapes 1 à 3 permet.

Vérification : demandez à un gestionnaire de dire, en une phrase, à quoi sert le classeur et qui le lit. S'il ne peut pas, la note de finalité n'a pas circulé.

## Quand Excel ne suffit plus

Excel reste un bon support pour ce suivi tant que la saisie est faite par une ou deux personnes, que les règles d'exception sont peu nombreuses et que le classeur n'est pas alimenté à la main depuis d'autres outils. Trois signaux indiquent que la limite est atteinte : les mêmes informations sont ressaisies depuis le logiciel de paie, la messagerie ou un dossier partagé ; une règle a été modifiée dans une formule sans que personne ne l'ait relue ; plusieurs personnes éditent le classeur en même temps et les états se contredisent.

À ce stade, la question n'est pas de quitter Excel. C'est de retirer à l'équipe la mécanique répétitive, en gardant les décisions au cabinet. Une automatisation peut proposer, dans la feuille Saisie, des lignes à valider à partir des sources convenues, rejouer les règles d'exception écrites à l'étape 4 et régénérer la feuille Vue, qui lui appartient, dans un périmètre cadré et testé sur un jeu de dossiers fictif. Elle travaille dans le classeur existant, sans macro ni ressaisie, comme elle peut le faire dans le logiciel de paie ou la messagerie. Excel n'est qu'un des environnements possibles ; le logiciel de paie, la messagerie ou un dossier partagé peuvent faire partie du même processus, comme l'explique la page sur [l'intégration aux outils existants](/#integration).

Le service Memlia se place exactement là : automatiser avec l'IA les tâches chronophages d'un cabinet d'expertise comptable, avec des règles écrites, des exceptions signalées et une validation humaine sur ce qui compte. Le classeur de suivi structuré comme ci-dessus en est un point de départ naturel, parce que ses règles sont déjà explicites.

## Les erreurs fréquentes

**Mesurer les personnes au lieu des dossiers.** C'est la dérive la plus courante et la plus coûteuse, juridiquement et humainement. Le remède est structurel : aucune colonne nominative dans la vue de pilotage.

**Laisser l'état en texte libre.** « OK », « ok », « fait » et « déposé » sont quatre valeurs pour un même état ; les comptages deviennent faux sans qu'aucune formule ne signale l'erreur. La validation des données ferme cette porte.

**Mélanger saisie et calcul.** Une formule écrasée par une valeur tapée à la main ne se voit pas. Séparer les feuilles et protéger celle des calculs rend l'écrasement impossible par inadvertance.

**Confondre protection de feuille et confidentialité.** Microsoft le dit : la protection de feuille n'est pas une fonction de sécurité. L'accès au classeur se règle au niveau du dossier partagé, avec les droits adaptés au secret professionnel.

## Questions fréquentes

### Un tableau de suivi de production est-il un dispositif de contrôle de l'activité ?

Il le devient dès qu'il collecte des informations sur l'activité des salariés eux-mêmes, par exemple un nombre de bulletins par personne ou un temps de traitement par ligne. Un tableau qui décrit des dossiers et des étapes, lu en agrégats, reste un outil de gestion de la production. Dans le doute, appliquez les trois conditions du Code du travail, rappelées par la CNIL : proportionnalité, information préalable, consultation du CSE.

### Peut-on quand même savoir qui s'occupe de quel dossier ?

L'affectation d'un dossier à un gestionnaire est une information d'organisation, nécessaire pour que le client sache qui appeler. Elle peut figurer dans la feuille Saisie. Ce qui doit rester hors de la feuille Vue, c'est son usage comme mesure de performance individuelle : classement, cadence, temps passé.

### Faut-il un logiciel dédié plutôt qu'Excel ?

Pas par principe. Tant que la structure des étapes 1 à 3 tient et que la saisie n'est pas dupliquée, Excel suffit. Le passage à une automatisation se justifie par la ressaisie, la fragilité des formules ou le nombre de mains sur le classeur, pas par le seul fait d'utiliser un tableur.

### Combien de temps garder l'historique des mois passés ?

Gardez ce qui sert à reconstituer le cycle en cas de question du client ou d'un organisme, dans une feuille d'archive distincte de la saisie du mois. Le principe de minimisation du RGPD s'applique : conservez les états et les dates des dossiers, pas des traces d'activité des personnes.

## Ce qu'il faut retenir

Un classeur de suivi de production sociale tient dans la durée s'il compte des dossiers et des étapes, jamais des personnes ; s'il sépare ce que le cabinet saisit de ce que les formules calculent ; s'il signale les exceptions avant l'échéance DSN et laisse la décision au gestionnaire ; et si son usage a été écrit, annoncé à l'équipe et, le cas échéant, présenté au CSE. Construit ainsi, il est déjà prêt pour l'étape suivante : confier la mécanique à une automatisation, dans un périmètre cadré, et garder au cabinet ce qui demande du jugement. Pour la partie amont du cycle, le contrôle des bulletins avant la DSN, décrit plus haut, suit la même logique.
