# Modèles tarifaires IA : décision utile pour Memlia

Recherche arrêtée au **15 octobre 2026**. Document interne de décision, pas une nouvelle offre publiée. Sources primaires consultées : pages tarifaires et documentations des éditeurs, analyses originales de Stripe et BCG, enquêtes originales de Thomson Reuters et Wolters Kluwer. Les montants USD restent en USD : aucune comparaison par conversion monétaire approximative. Les tarifs exacts et le périmètre de Factory 456 et Outils-EC sont traités dans l'autre volet du chantier.

## Décision proposée

**Deux familles commerciales, avec une même règle de lisibilité : le cabinet connaît le travail inclus et son budget maximal.**

- **Robots : forfait annuel borné**, adapté aux campagnes et aux routines répétitives ; le portefeuille effectivement couvert peut dimensionner le forfait. Le nombre de personnes qui utilisent les résultats ne le fait pas varier. Une campagne ponctuelle peut aussi s'acheter au forfait défini.
- **Agents IA : service maintenu + usage encadré**, avec une enveloppe en euros et une unité proche d'un livrable ou d'un travail terminé. Le coût varie avec le travail confié, pas avec le nombre d'agents disponibles dans le catalogue. Un devis couvre séparément les adaptations qui dépassent le standard.
- **L'heure machine active est une option de lancement**, si nous pouvons la mesurer et l'expliquer. Ce n'est pas automatiquement l'unité la plus acceptable pour un expert-comptable. Elle ne se confond jamais avec une heure de collaborateur économisée.

C'est une recommandation, pas une préférence tarifaire mesurée auprès de cabinets français. Aucun prix Memlia « optimal » en euros ne peut être démontré par les seuls tarifs des autres éditeurs : il manque les coûts réels par famille de travail, la charge de maintenance et des entretiens d'achat.

## Ce que montre réellement le marché

| Source actuelle | Modèle et faits vérifiés | Ce que cela apprend à Memlia |
|---|---|---|
| [Salesforce Agentforce](https://www.salesforce.com/agentforce/pricing/) | 500 USD pour 100 000 Flex Credits ; une action standard consomme 20 crédits, soit 0,10 USD par calcul. La même page vend un accès employé à 5 USD/utilisateur/mois avec crédits, et un accès employé non mesuré à 125 USD/utilisateur/mois. Les exemples excluent d'autres coûts, notamment Data 360. | L'unité « action » est facturable mais plusieurs actions peuvent constituer une tâche métier. Le siège et le forfait subsistent même chez un fournisseur d'agents. Ces prix ne comprennent pas le service Memlia. |
| [Intercom / Fin](https://www.intercom.com/pricing) | À partir de 0,99 USD par outcome, une seule facturation par conversation. Une résolution déclarée, l'absence de nouvelle demande après réponse ou une procédure achevée avec transfert peuvent compter. La page indique le remboursement de l'outcome si la conversation est rouverte. Sur un helpdesk existant : pas de siège Fin, avec minimum mensuel indiqué, par exemple 50 outcomes. Le helpdesk Intercom conserve une tarification par siège. | Un « résultat » doit avoir une définition contractuelle. Le résultat facturable de Fin n'est pas toujours une satisfaction explicitement confirmée. Pour Memlia, un livrable préparé et contrôlé automatiquement est plus attribuable qu'un gain financier ou une validation fiscale. |
| [Make : crédits](https://help.make.com/credits), [tarifs](https://www.make.com/en/pricing) | Abonnement incluant un volume de crédits. Beaucoup d'opérations consomment un crédit ; certaines fonctions IA ont une consommation dynamique selon opérations, modèle et tokens. Avec sa propre clé fournisseur, les tokens peuvent être payés séparément au fournisseur IA. | Un crédit commun facilite la facture mais peut cacher des taux variables. Éviter de demander au cabinet de comprendre modèles, tokens et étapes techniques pour anticiper sa dépense. |
| [Zapier : tâches](https://help.zapier.com/hc/en-us/articles/8496196837261-How-is-task-usage-measured-in-Zapier) | Une action réussie compte ; déclencheurs, filtres, attentes Delay et étapes en erreur ne comptent pas. Mais rejouer des étapes déjà réussies peut consommer de nouvelles tâches. Les dépassements peuvent être désactivés ; les nouvelles exécutions sont alors mises en attente au plafond. | Échec technique et travail réussi sont des événements différents. Le prix de plusieurs étapes réussies n'est pas le prix d'un dossier terminé : définir l'unité Memlia indépendamment du découpage du code. |
| [Zapier : Agents](https://help.zapier.com/hc/en-us/articles/26559132765325-How-is-Zapier-Agents-usage-measured) | Documentation mise à jour le 1er octobre 2026 : quota d'activités distinct des tâches, avec limites par exécution. Les tests du plan payant sont exclus du quota, ceux du gratuit inclus. Le document annonce aussi la migration vers AI by Zapier. | Ne pas mélanger les grilles des produits d'un même éditeur. Le plafond par exécution est utile pour empêcher une boucle de vider l'enveloppe mensuelle. |
| [UiPath : licence des agents](https://docs.uipath.com/agents/automation-cloud/latest/user-guide/licensing) | Les Platform Units varient selon le niveau du modèle et les appels LLM. Le modèle géré par le client est compté par exécution plutôt que par appel ; des contrôles LLM supplémentaires peuvent consommer séparément. | L'usage facturable dépend du contrat technique. L'étiquette « agent » seule ne permet de comparer ni les coûts ni les tarifs. |

Les pages fournisseurs prouvent leurs offres affichées, pas leur succès commercial ni la préférence des acheteurs. Leurs unités sont différentes et leurs produits ne remplacent pas une prestation d'adaptation, recette et maintenance.

## Pourquoi la consommation pure n'est pas une vérité de 2026

Dans son [analyse du 11 septembre 2025](https://stripe.com/blog/a-framework-for-pricing-ai-products), Stripe rapporte que **56 % des dirigeants d'entreprises IA interrogés** utilisent un modèle hybride, contre 38 % pour l'usage pur. La [présentation de l'enquête](https://stripe.com/au/lp/pricing-trends) indique plus de 2 000 dirigeants au total ; elle ne donne pas ici la taille du sous-échantillon IA. Ne pas transformer ces chiffres en parts de marché, en préférence des clients, ni en résultat spécifique aux cabinets comptables. Stripe vend des outils de facturation : intérêt commercial à garder en tête.

Son [guide du 19 avril 2026](https://stripe.com/en-ca/resources/more/ai-pricing-models) distingue toujours abonnement, consommation, hybride, résultat, siège et niveau de capacité. Il recommande une unité comprise par le client, une structure simple et une attention aux coûts variables. Un forfait peut convenir si l'usage est stable ; la consommation aide à suivre les coûts mais réduit la prévisibilité budgétaire.

Le [point de vue de Metronome publié par Stripe le 1er octobre 2026](https://stripe.com/blog/where-pricing-is-headed) distingue les **inputs** techniques, les **outputs** remis et les **outcomes** économiques. Il défend les outputs parce que le revenu gagné ou le churn évité sont difficiles à attribuer. C'est une opinion de dirigeant, pas une enquête de consentement à payer. Pour Memlia, « récapitulatif préparé » peut être vérifié ; « risque fiscal évité » ne constitue pas une unité fiable.

L'[analyse BCG du 13 août 2025](https://www.bcg.com/publications/2025/rethinking-b2b-software-pricing-in-the-era-of-ai) recommande de relier prix et valeur tout en préparant télémétrie, prévision d'usage et accompagnement. Elle souligne les risques de volatilité des marges et de mauvaise attribution du résultat. Ne pas reprendre ses chiffres cités d'autres études sans lire ces études originales ; aucun de ces chiffres ne fixe le budget d'un cabinet français.

## Ce que l'on sait de l'acceptabilité en cabinet

| Étude originale | Fait utile et population | Limite pour notre décision tarifaire |
|---|---|---|
| [Thomson Reuters, AI in Professional Services 2026](https://www.thomsonreuters.com/en/institute/reports/2026-ai-in-professional-services-report) | Plus de 1 500 professionnels de plusieurs secteurs ; seulement 18 % disent que leur organisation suit le ROI de l'IA. | Ce n'est pas une enquête française de prix. Elle justifie une estimation explicite et un suivi observable, pas une promesse de gain ou de ROI Memlia. |
| [Thomson Reuters, volet tax & audit 2026](https://www.thomsonreuters.com/en/institute/future-of-professionals-2026/report-tax-and-accounting) | 538 réponses de professionnels de cabinets tax/audit, 40 pays, recueillies en mars-avril 2026 ; environ un tiers vient des États-Unis. Les pressions financières et organisationnelles sont documentées. | N'établit ni 7 €/h, ni un prix par dossier, ni une préférence entre ces deux unités. Le périmètre international et le fournisseur de solutions qui publie l'étude limitent la généralisation. |
| [Wolters Kluwer, Future Ready Accountant 2025](https://www.wolterskluwer.com/fr-be/know/future-ready-accountant) | 2 768 professionnels, 14 pays, enquête au T2 2025 ; 77 % disent prévoir d'accroître l'investissement IA. | Les pays listés **n'incluent pas la France**. Intention d'investir et montant acceptable ne sont pas interchangeables. Ce rapport de 2025 doit rester daté ainsi. |

**Absence de preuve :** aucune étude primaire de consentement à payer des cabinets français pour des agents facturés à l'heure machine, au crédit ou à la tâche n'a été authentifiée dans cette recherche. Des pages secondaires annoncent une « enquête OEC 2026 » ou un budget idéal sans fournir le rapport original vérifiable : ces chiffres sont écartés.

**Inférence proposée :** une équipe qui doit budgéter une dépense récurrente a intérêt à connaître le plafond avant une campagne. Une unité concrète, un relevé et l'absence de facturation des pannes sont plus faciles à défendre qu'un compteur technique opaque. Cette hypothèse doit être testée en entretien ; elle n'est pas présentée comme une préférence statistiquement démontrée de la profession.

## Choisir l'unité Memlia

| Unité | Intérêt | Risque | Usage conseillé |
|---|---|---|---|
| Forfait cabinet | Lisible, couvre le maintien en service. | Petit et grand portefeuille supportent mal le même prix ; l'illimité peut rendre le service déficitaire. | Socle robots ou campagne avec périmètre et limites explicites. |
| Dossier couvert | Vocabulaire connu, dimensionnement simple. | Un dossier actif ne vaut pas un dossier dormant ; un SIREN peut avoir plusieurs comptes et obligations. | Dimensionner un forfait robots, en définissant l'entité, la période et les comptes inclus ; éviter de compter les mêmes dossiers à chaque robot ou passage. |
| Livrable ou tâche terminée | Le cabinet peut vérifier ce qu'il achète. | Un email, une facture et une synthèse complexe ne coûtent pas pareil ; les tentatives et reprises doivent être définies. | Familles homogènes d'usage IA, avec périmètre mesurable et prix annoncé avant lancement. |
| Heure machine active | Une unité commune, comparaison commerciale intuitive. | Payer la lenteur ; confondre machine et humain ; attentes, parallélisme et reprises peuvent gonfler le compteur. | Option si le chronométrage est fiable, borné et auditable ; pas un équivalent d'heure de salaire économisée. |
| Tokens / appel LLM | Suit les coûts techniques. | Impossible pour un cabinet d'estimer facilement son besoin ; change avec l'architecture. | Mesure interne de coûts, pas unité principale de la page commerciale. |
| Siège | Utile quand chacun dispose d'un assistant individuel. | Freine le partage des résultats alors que le travail reste le même. | Peu aligné avec la prise en charge collective de Memlia ; cela ne rend pas le siège obsolète pour tous les logiciels. |
| Pourcentage du gain financier | Semble aligner les intérêts. | Attribution et contrefactuel contestables ; qualité et responsabilité indépendantes du gain. | Écarter au lancement. |

### Le socle d'usage à définir avant un tarif public

1. **Le compteur et son fait générateur.** Un identifiant unique de traitement, la version du barème et le livrable associé. Une demande rejouée à l'identique pour une panne ne devient pas une nouvelle vente.
2. **Les exceptions de facturation.** Authentification, attente de validation humaine, indisponibilité d'un portail, session expirée et reprise d'un défaut Memlia : pas de consommation facturée selon la politique proposée. Les documents manquants sont signalés, sans boucle payante indéfinie. Un arrêt utile n'est facturé que si la restitution d'exception fait explicitement partie du livrable acheté.
3. **Le plafond.** Prix estimé ou plafond par lot et par mois, alerte avant épuisement, arrêt au montant autorisé. Dépassement seulement après décision explicite du cabinet ; pas de rechargement automatique imposé.
4. **Le relevé.** Travail confié, résultat remis, quantité facturable, prix et exceptions exclues du compteur. Détail technique conservé pour résoudre un litige, sans données client dans les URL.
5. **Les heures, si retenues.** Définir précisément les phases actives, les temps exclus, l'arrondi et les exécutions parallèles. Facturation au prorata, sans arrondir chaque petit travail à une heure. L'addition de plusieurs agents internes pour une seule demande ne doit pas être une surprise.
6. **Le service.** Déploiement standard, support, maintenance et adaptations spécifiques distingués. Les coûts d'autres licences, plateformes, stockage ou signature sont inclus ou explicitement séparés au devis.

Ces règles sont des **conditions proposées pour l'offre**, pas des propriétés techniques déjà implémentées dans Memlia. Le site vitrine ne dispose pas d'un moteur de facturation ni d'une preuve d'exécution en production permettant d'annoncer ce suivi comme existant.

## Conséquence pour le simulateur

Conserver une interface courte. Pour un simulateur de robots, le nombre de dossiers et le périmètre des routines peuvent conduire à un forfait annuel explicite. Pour l'IA, ne pas multiplier le « temps humain évité » par le tarif d'une heure machine : ce sont deux durées différentes. Le calcul des gains doit retirer le temps de contrôle et ne pas compter les tâches déjà couvertes par le logiciel métier. Une simulation économique utilise une hypothèse déclarée, pas une promesse de performance client.

Le meilleur prochain test commercial : comparer, sur **le même travail et le même budget maximum**, une formule par heure active et une formule par livrable. Faire expliquer la facture attendue au décideur et observer sa capacité à estimer un mois chargé. Recueillir séparément le budget et les raisons d'achat. Cette recherche commerciale est à réaliser avec des interlocuteurs autorisés ; aucun contact n'a été envoyé dans ce chantier.

## Preuves et méthode

- Recherches exécutées le 15/10/2026, 20 requêtes initiales ciblées sur éditeurs, pricing IA et études métier, puis ouverture/lecture des sources primaires citées. Pas de formulaire soumis, pas de compte créé, pas d'enquête administrée.
- Les skills Claude `market-research` et `deep-research` ont guidé le travail ; leur outillage Firecrawl/Exa n'était pas exposé ici. Recherche effectuée avec l'outil web disponible, puis archivage des réponses HTTP publiques. Le skill Codex `pricing-strategy` a servi pour le choix de l'unité et les limites d'une recommandation sans WTP.
- Captures brutes, extraction texte, en-têtes HTTP et SHA-256 : `preuves/modeles-2026/manifest.json`. Les réponses 403 sont conservées comme telles et ne sont pas présentées comme des captures de page réussies. Pour ces pages, la lecture accessible via l'outil web fait foi et la limite d'archivage est signalée.
- Aucun volume de recherche, tarif client Memlia, coût interne, témoignage, résultat mesuré ou préférence d'acheteur n'a été inventé. Les pages des fournisseurs peuvent changer après cette date.
