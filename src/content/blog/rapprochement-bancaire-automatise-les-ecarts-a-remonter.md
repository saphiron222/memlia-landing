---
titre: "Rapprochement bancaire automatique : les écarts à remonter"
titreOnglet: "Rapprochement bancaire automatique : écarts | Memlia"
resume: "Une clé d'appariement univoque, quatre cas fictifs rejoués et des refus explicites : le rapprochement prépare les paires sans masquer les écarts ni prendre la décision."
description: "Rapprochement bancaire automatique : comparer relevé et compte 512, proposer les paires univoques et remonter les écarts à valider."
datePublication: 2026-10-12
auteur: kevin
sujets: [lettrage, revision, automatisation]
motsCles: ["rapprochement bancaire automatique", "écarts rapprochement bancaire", "clé de rapprochement bancaire comptabilité"]
brouillon: false
image: img-art-rapprochement-bancaire
pipelineVersion: 1
primaryQuery: "rapprochement bancaire automatique"
secondaryQueries: ["clé de rapprochement bancaire comptabilité", "logiciel rapprochement bancaire cabinet comptable"]
intent: executer
fanOut: ["quelles lignes apparier", "comment traiter un transit", "que faire avec plusieurs candidats"]
cluster: production-comptable
famille: banque-rapprochement
rolePrincipal: collaborateurs-comptables
rolesSecondaires: [chefs-mission-portefeuille]
tache: "Comparer le relevé et le compte bancaire, proposer les paires univoques et remonter les lignes ouvertes sans les solder d'office."
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-10-12
funnel: MOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Clé écrite et quatre cas fictifs RB-01 à RB-04, avec paire unique, transit possible, refus d'ambiguïté et entrée incomplète ; ne prouve pas l'exhaustivité des écarts."
reviewRule: "Revoir toute extension de l'oracle, du périmètre des exports ou des sources officielles avant republication."
reviewer: marketing
sourcesVerifieesLe: 2026-10-12
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons la clé de rapprochement dans vos mots, préparons les paires et les écarts dans vos outils, puis faisons recetter les refus par vos équipes. Votre cabinet garde la décision. Rien à envoyer : décrivez la tâche."
imageOg: "/images/img-art-rapprochement-bancaire-og.webp"
imageAlt: "Deux plateaux de cartes vierges appariées par des attaches vertes, une carte isolée pour examen."
statutEditorial: publie
sources:
  - editeur: "ANC"
    titre: "Plan comptable général"
    url: "https://www.anc.gouv.fr/plan-comptable-general-0"
    consulte: 2026-10-12
  - editeur: "CNIL"
    titre: "Donnée personnelle"
    url: "https://www.cnil.fr/fr/definition/donnee-personnelle"
    consulte: 2026-10-12
  - editeur: "CNIL"
    titre: "RGPD chapitre II — Principes"
    url: "https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2"
    consulte: 2026-10-12
---

## Réponse directe

Un rapprochement bancaire automatique utile au cabinet ne force pas les lignes à coïncider. Il compare le relevé et le compte bancaire en comptabilité, propose les correspondances univoques et laisse les écarts ouverts. Nous éprouvons ici quatre situations fictives : une paire unique, une écriture absente du relevé, plusieurs candidats et un solde d'ouverture manquant. Le collaborateur retrouve les lignes d'origine et décide ; aucun de ces résultats ne valide le rapprochement à sa place.

## De quoi parle-t-on ?

**Le rapprochement bancaire** compare les mouvements et les soldes d'un compte bancaire dans la comptabilité avec ceux du relevé. L'ANC publie le [plan de comptes (version au 1er janvier 2026)](https://www.anc.gouv.fr/plan-comptable-general-0). Une différence n'est pas en soi une erreur : une opération comptabilisée en fin de mois peut figurer sur le relevé suivant. Elle doit néanmoins pouvoir s'expliquer.

**La clé d'appariement** réunit les indices utilisés pour proposer qu'une ligne du relevé correspond à une écriture : montant, sens économique normalisé, référence, compte et devise. Un crédit du relevé (entrée d'argent) correspond ainsi à un débit du compte 512, pas à un crédit comptable. Le montant seul ne suffit pas quand plusieurs opérations identiques existent.

**L'état de rapprochement** conserve la période, le solde de chaque source, les lignes proposées comme correspondantes et les lignes encore ouvertes. Un total qui s'équilibre sans explication ligne par ligne ne constitue pas une validation.

Notre [glossaire du rapprochement bancaire](/glossaire#rapprochement-bancaire) précise la frontière avec le [lettrage comptable](/glossaire#lettrage-comptable). Le lettrage rapproche des écritures entre elles ; ici, il faut aussi confronter les écritures à une source externe, le relevé.

## Pourquoi la tâche casse à la main

Une personne sait souvent qu'un virement annoncé le dernier jour ouvré ne sera visible sur le relevé que plus tard, ou qu'un prélèvement groupé ne correspond pas à une facture unique. Si ce savoir n'est pas écrit, une autre personne peut apparier par montant, marquer l'écart comme traité et perdre sa piste d'explication. Le problème n'est pas de cliquer moins : c'est de transmettre la clé, ses priorités et ses cas d'arrêt.

Le relevé peut arriver en CSV, PDF ou par un export de l'outil bancaire. Le journal peut porter une date comptable distincte de la date d'opération. L'import doit préserver l'original : on ne corrige pas une ligne source pour obtenir un total attendu. Notre [carte des tâches à automatiser](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches) situe ce contrôle parmi les gestes de production qui se préparent et ceux qui restent à décider.

## Avant de commencer

Réunissez deux exports du même compte et une période commune : les lignes du relevé et les écritures du compte bancaire en comptabilité. Conservez les identifiants d'origine, les dates, le sens débit ou crédit, le montant, la devise et les références telles qu'elles figurent dans chaque source. Notez les dates de début et de fin et, de chaque côté, les soldes d'ouverture et de clôture. Si l'export ne fournit pas de total ou d'indicateur d'exhaustivité, demandez le relevé complet : une ligne manquante peut passer inaperçue même lorsque les calculs internes concordent.

Reprenez aussi les lignes ouvertes du rapprochement précédent. Une opération ancienne encore en attente ne devient pas invisible au changement de mois. Ce suivi est une consigne de travail pour le cabinet ; les quatre essais présentés plus bas partent chacun d'un solde d'ouverture fictif, sans reliquat antérieur.

Décidez avec l'équipe ce qui fait une correspondance *certaine*. Dans notre jeu fictif, une proposition exige le même montant, le même sens économique après conversion des signes débit/crédit propres à chaque source, une référence commune non vide et un candidat unique. Les deux dates doivent être dans la période d'essai (du 1er au 31 août 2026, bornes incluses) ; la date du relevé et la date comptable sont utilisées chacune de leur côté. Une référence vide, deux candidats possibles ou une devise différente empêchent cette proposition. Ce sont des choix de démonstration, non des tolérances à appliquer à tous les cabinets.

## Comparer les lignes sans effacer l'écart

1. **Vérifier les entrées.** Confirmer le compte, la période, les soldes d'ouverture et de clôture et la lisibilité des deux exports ; recalculer les soldes de clôture depuis les lignes. La règle à mettre en place prévoit un refus si une entrée est incohérente ou signalée incomplète. Le rejeu ci-dessous éprouve précisément le solde d'ouverture manquant, pas tous les défauts d'import. Un export qui omet des lignes tout en gardant des soldes concordants ne peut pas être détecté par le seul contrôle arithmétique.
2. **Normaliser sans transformer la preuve.** Construire une copie de travail : date au même format, montant en unités entières de centimes, sens explicite. Garder la ligne brute à côté de la copie pour contrôler toute proposition.
3. **Proposer uniquement les paires univoques.** Convertir d'abord le sens en entrée ou sortie d'argent du point de vue du compte de l'entreprise ; conserver les signes d'origine. Trier les clés communes, compter les candidats de part et d'autre, puis proposer une paire seulement si la clé a un candidat unique dans chaque source. Un libellé proche n'est pas une référence commune.
4. **Classer le reliquat.** Les lignes non appariées ne disparaissent pas. Les marquer « mouvement en transit possible », « écriture absente », « mouvement bancaire sans pièce », « plusieurs candidats » ou « entrée incohérente », selon l'indice réellement observé. Le mot « possible » compte : il ne remplace pas l'enquête.
5. **Réconcilier les soldes.** Recalculer chaque solde à partir des lignes fournies et confronter l'écart final au reliquat, avec les sens. Un reliquat qui explique le montant sans expliquer les lignes demeure ouvert. Le collaborateur examine les pièces, valide ou délie les propositions, et décide des écritures éventuelles.

Cette démarche sépare la préparation du rapprochement de la [validation humaine](/methode). Nous n'attribuons pas une cause à un mouvement bancaire sur la seule base de son montant.

La recherche de pièces suit une autre règle : notre méthode pour [automatiser la relance des pièces clients](/blog/automatiser-la-relance-des-pieces-clients) organise les demandes sans confondre une pièce réclamée avec une opération justifiée.

## La clé dans les mots du cabinet

| Déclencheur | Condition dans le jeu fictif | Proposition | Exception visible |
|---|---|---|---|
| Deux lignes candidates | Même compte, sens économique normalisé, montant, devise, référence non vide et unique ; dates dans la période | Paire proposée, sources et dates conservées | Deux écritures portent la même clé : aucune paire choisie |
| Écriture sans ligne bancaire à la clôture | Date comptable dans la période, référence non trouvée sur le relevé | Ligne ouverte « transit possible » | Chercher le relevé suivant avant d'expliquer la cause |
| Ligne bancaire sans écriture | Aucune clé univoque dans le journal | Ligne ouverte « écriture ou pièce à rechercher » | Ne créer aucune écriture par déduction |
| Import incomplet | Solde d'ouverture ou période absent | Refus de l'état complet | Redemander la source plutôt que produire un solde trompeur |

Cette clé est un exemple contrôlable, pas une règle comptable universelle. Sur un paiement groupé, le cabinet peut décider de tester des combinaisons, mais une somme identique obtenue de plusieurs manières ne départage rien. Il faut alors présenter les combinaisons et attendre un choix.

<figure data-blog-proof="banque-cle">
  <img src="/proofs/blog/banque-cle.webp" alt="Fiche fictive RB-01 : relevé R-01 et journal J-01, référence V-041, paire à valider." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## La règle écrite

**La frontière.** Pour cette tâche, les trois colonnes suivantes se lisent avant de lancer le traitement.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Import contrôlé, candidats uniques et état des écarts avec références et dates | Accepter ou délier une paire proposée, expliquer un transit documenté | Chercher une pièce, trancher entre plusieurs affectations, décider d'une écriture de régularisation |

**La proposition.** Nous produisons une liste de paires candidates et de lignes ouvertes, jamais une saisie irréversible. Chaque paire porte ses deux lignes sources et la version de la clé. Les commentaires et décisions saisis par le collaborateur sont conservés à part ; un nouveau calcul ne les remplace pas.

**L'arrêt.** Si la période ou le solde d'ouverture manque, le calcul de l'état complet cesse. Si plusieurs lignes partagent la même clé, aucune paire n'est choisie. Une ligne sans pièce reste ouverte : aucun montant n'est imputé pour forcer l'équilibre.

**Le jeu d'essai.** Nous rejouons ci-dessous quatre mini-dossiers indépendants sur la même période fictive, dont une paire unique, un transit possible, une ambiguïté et une entrée incomplète. Les entrées, les sorties et le programme local qui les compare aux résultats attendus sont conservés avec la recette ; ce n'est ni un dossier client ni une mesure de performance.

## Rejoué sur le jeu fictif

Le compte fictif est en euros. Les montants ci-dessous sont des données de test, pas des montants observés dans un cabinet. Chaque décision reste à confirmer sur les justificatifs.

Chaque essai couvre août 2026 et utilise le compte fictif A. Les soldes d'ouverture sont de 1 000,00 € dans les deux sources, sauf le relevé de RB-04 où ce champ manque. Nous calculons en centimes et convertissons les signes : un crédit du relevé et un débit comptable valent tous deux une entrée d'argent. Les quatre essais ne s'additionnent pas en un rapprochement mensuel unique.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| RB-01 : relevé R-01 crédité et compte 512 J-01 débité de 125,00 €, référence V-041 | PROPOSITION_UNIQUE : paire V-041, 125,00 €, sources R-01 et J-01 | Attendre la validation du collaborateur |
| RB-02 : écriture J-02 de 80,00 € datée en fin de période, absente du relevé | ECART_OUVERT : J-02, 80,00 €, transit possible non confirmé | Consulter le relevé suivant et garder la ligne ouverte |
| RB-03 : deux écritures J-03 et J-04 de 50,00 € portent la même référence que R-03 | REFUS_AMBIGUITE : deux candidats pour R-03, aucune paire écrite | Examiner les pièces et choisir ou refuser l'appariement |
| RB-04 : solde d'ouverture du relevé absent | REFUS_ENTREE : solde d'ouverture du relevé manquant | Demander un relevé complet avant le contrôle des soldes |

Le rejeu est limité à ces conditions écrites. Il ne démontre pas le traitement de toutes les banques, des commissions, des devises multiples ni des paiements groupés. Il ne détecte pas une omission invisible dans deux exports aux soldes cohérents. Ces cas s'ajoutent à la règle seulement après une nouvelle recette sur données fictives.

Dans RB-01, les deux soldes recalculés atteignent 1 125,00 €. Dans RB-02, le relevé reste à 1 000,00 € et le journal atteint 1 080,00 € : les 80,00 € de J-02 expliquent la différence numérique, pas la cause du mouvement. Dans RB-03, le relevé atteint 1 050,00 € et le journal 1 100,00 € ; deux candidats partagent la référence V-043, donc le programme refuse l'appariement du cas entier. Dans RB-04, aucun contrôle complet des soldes n'est produit.

Le programme ne lit ni PDF ni connexion bancaire : il traite les lignes fictives déjà structurées. Ses quatre résultats éprouvent cette clé restreinte et ses refus. Un vrai dossier peut mélanger des paires et des écarts ; leur coexistence, la reprise des décisions et la conservation des lignes ouvertes nécessitent leurs propres essais avant livraison.

<figure data-blog-proof="banque-rejeu">
  <img src="/proofs/blog/banque-rejeu.webp" alt="Registre fictif RB-01 à RB-04 : paire à valider, transit ouvert, ambiguïté et entrée refusées." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## Ce qu'il faut contrôler avant de valider

Un appariement n'efface aucune ligne d'origine. Le dossier de contrôle associe la version du relevé, celle du journal, la période, les deux soldes d'ouverture, la clé appliquée et la liste des refus. Pour chaque paire, le collaborateur doit pouvoir revenir aux deux lignes source. Pour chaque ligne ouverte, il doit voir le motif, pas seulement un écart net.

Les exports peuvent contenir des informations sur des personnes physiques. La [CNIL définit la donnée personnelle](https://www.cnil.fr/fr/definition/donnee-personnelle) comme « toute information se rapportant à une personne physique identifiée ou identifiable ». Le [RGPD, article 5, publié par la CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2), indique que les données personnelles sont « adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées » et « traitées de façon à garantir une sécurité appropriée des données à caractère personnel ». Dans ce guide, nous utilisons des références et des montants fictifs ; les vrais exports restent dans le circuit du cabinet, avec les accès prévus pour la mission. Une vue de pilotage porte des agrégats, jamais un classement nominatif.

## Les erreurs fréquentes

- **Rapprocher seulement par montant.** Des virements de même montant peuvent viser des dossiers différents. Il faut une clé discriminante et une règle pour les collisions.
- **Appeler « régularisé » un transit supposé.** Le relevé suivant et la pièce éventuelle permettent d'expliquer le décalage ; avant cela, l'étiquette reste une hypothèse.
- **Compenser deux écarts.** Deux lignes ouvertes de sens opposés peuvent donner zéro sans se justifier mutuellement.
- **Écraser les corrections humaines au prochain import.** Les propositions sont recalculables ; les décisions de l'équipe sont historisées séparément.
- **Comparer deux périodes différentes.** Un rapport sans compte, période et solde de départ vérifiables doit refuser sa conclusion.

## Questions fréquentes

### Un même montant suffit-il pour automatiser le rapprochement bancaire ?

Non. Dans notre règle fictive, il faut aussi le sens économique normalisé, la devise, le compte et une référence commune non vide. Deux candidats avec la même clé restent ouverts.

### Pourquoi les soldes peuvent-ils diverger sans erreur de saisie ?

Une ligne présente dans le journal en fin de période peut apparaître sur le relevé suivant. Cette possibilité se vérifie sur les sources : l'étiquette « transit possible » ne vaut pas justification.

### Que faire d'un prélèvement bancaire sans écriture correspondante ?

Le placer dans les lignes ouvertes avec son identifiant, sa date et son montant, puis rechercher la pièce et l'écriture. Nous ne créons pas une écriture sur la seule base d'un libellé.

### Comment traiter un paiement groupé ?

Écrire d'abord quelles combinaisons sont admissibles et quels justificatifs les relient. Si plusieurs combinaisons conviennent, présenter les candidats au collaborateur ; ne pas choisir au hasard pour faire coïncider les totaux.

## La règle à retenir

Une paire est une proposition contrôlable ; une ligne non expliquée reste une ligne ouverte. Le rapprochement vaut par la traçabilité des écarts, pas par un voyant vert.

## Pour aller plus loin

Nous partons du rapprochement que votre outil métier prépare déjà, sans refaire ce qu'il prend en charge. Nous écrivons avec votre équipe la règle des exceptions restantes, automatisons leur préparation dans vos outils, puis faisons recetter les cas qui doivent aboutir et ceux qui doivent être refusés : cette recette est le test d'acceptation par l'équipe. Nous maintenons ensuite la règle et ses essais. Votre cabinet garde la décision sur chaque appariement et toute écriture. La [page de service consacrée au rapprochement bancaire](/automatisation/rapprochement-bancaire) précise le périmètre d'une tâche confiée, distinct de cette méthode ; [nos engagements](/garanties) expliquent ses limites.
