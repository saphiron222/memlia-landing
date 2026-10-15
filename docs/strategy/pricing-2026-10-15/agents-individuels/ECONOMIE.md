# Socle, prix des agents et activité incluse : méthode de décision

15/10/2026. Lire d’abord [la grille proposée](./GRILLE.md). `offre.json` est la source des nouveaux montants et réserves ; `calcul.mjs` produit `calculs.json`. Les huit unités de l’étude précédente sont uniquement des éprouvettes de coûts pour des paniers représentatifs. **Leur barème de vente n’est pas repris.** Ni la grille à huit prix, ni le socle à 99 €, ni la formule 1 000 € + 300 € par pôle ne sont la proposition active.

## Contexte et décision

Kevin demande des montants recalculés pour le socle, chaque agent et son usage inclus. Son ancien tarif renseigne la structure, sans obliger à conserver ses niveaux. Le catalogue comporte douze agents métier. Tous les utilisateurs d’un cabinet bénéficient de leurs résultats ; le siège et les sous-agents internes ne sont pas facturés. Les forfaits robots restent distincts, avec consolidation de tout fonctionnement réellement commun.

Compétences appliquées : Claude `pricing` et `offers`, et les principes Codex `pricing-strategy` / rédaction déjà lus pendant le chantier. Les coûts posent un plancher ; l’acceptabilité du prix et la valeur de la délégation ne se déduisent pas des tokens. Faute de retours d’achat réels, nous retenons une grille de lancement testable, sans prétendre au prix optimal.

Le socle finance les fonctions communes. Le prix de chaque agent finance sa maintenance propre et l’activité incluse. Le premier déploiement et les constructions nouvelles sont au forfait distinct. Cette séparation réduit l’effet de seuil du socle à 1 000 € sans promettre le même service humain pour 199 € : le travail spécifique est désormais financé par l’agent et la mise en service.

## Pourquoi des crédits communs

Les sources primaires réouvertes le 15 octobre montrent plusieurs modèles, pas une préférence universelle : [Make](https://help.make.com/credits) utilise des crédits dont le débit peut varier pour l’IA ; [Salesforce Agentforce](https://www.salesforce.com/agentforce/pricing/) a une grille de Flex Credits. [Factory 456](https://www.factory456.com/) décrit une prestation d’orchestration et d’accompagnement ; sa page actuelle ne suffit pas à déterminer un forfait équivalent au nôtre. Le 7 €/h historique ne fixe aucun de nos prix.

Nous retenons un seul compteur transversal pour couvrir les demandes mixtes et les tâches non prévues par les huit familles de livrables. **Le crédit n’est pas une action technique ou un livrable universel à coût identique.** Il réserve un centime de coût variable prévisionnel complet, ce qui permet d’additionner les enveloppes d’agents sans changer leur valeur économique. Les coûts de production comprennent modèle, exécution/OCR/outils marginaux et humain opérationnel prévu ; la maintenance fixe et les incidents non facturables sont provisionnés séparément. Ne pas compter deux fois la même intervention humaine.

Au cadrage d’une routine, un calcul déterministe sur ses paramètres donne son budget en crédits. Il est annoncé et figé avant lancement du lot. Une routine nouvelle peut utiliser la même unité après qualification, quel que soit le format de son résultat. L’ancienne matrice de 128 entrées reste l’inventaire fonctionnel : elle n’impose plus huit catégories de vente. Un prix inconnu, une source non qualifiée ou un coût manquant entraînent une qualification avant exécution ; pas un traitement gratuit supposé.

Les crédits ne sont pas un solde Mammouth ni un remboursement en euros. La réserve d’un centime est notre convention interne proposée, pas une caractéristique du fournisseur. Le cabinet voit l’estimation, la routine, le lot et le résultat, avec un barème consultable et des exemples propres à l’agent. Si l’essai de compréhension montre que le cabinet ne sait pas anticiper ses dépenses, le compteur doit être revu avant publication : les crédits ne sont pas une solution magique à l’opacité.

Un supplément vaut cinq centimes de prix par crédit, soit **50 €/1 000 crédits au prorata**. Il finance au plus 10 € de production prévisionnelle par tranche de 1 000 crédits. Après la provision d’encaissement de 2 %, il conserve 39 € de marge marginale de base. Cette propriété dépend de la tenue du budget complet, humain compris ; elle n’est pas garantie par le seul prix Mammouth.

## Coûts et hypothèses du socle

Base hypothétique : 30 minutes de support/maintenance communs par cabinet à 75 €/h, 20 € d’infrastructure commune, encaissement 2 % du chiffre d’affaires + 0,25 € par facture mensuelle. Les licences métier du cabinet ne sont pas financées implicitement. Les 30 minutes ne sont pas un forfait d’accompagnement illimité : les interventions propres aux agents sont budgétées dans leurs lignes. Le contrat reste à préciser, sans SLA inventé.

Frais alloués, une seule fois par cabinet : 30 € de frais généraux, acquisition 300 € amortis sur douze mois (25 €), catalogue 600 € amortis sur vingt-quatre mois (25 €), soit **80 €/mois**. Ce sont des hypothèses explicites, avant impôts et frais non alloués, pas nos charges réelles connues.

| Socle testé | Coût commun direct calculé | Solde du socle après 80 € alloués* | Marge directe du socle + Colette pleinement utilisée |
|---:|---:|---:|---:|
| 99 € | 59,73 € | −40,73 € | 57,9 % |
| 149 € | 60,73 € | 8,27 € | 64,6 % |
| **199 €** | **61,73 €** | **57,27 €** | **69,4 %** |
| 249 € | 62,73 € | 106,27 € | 73,0 % |
| 299 € | 63,73 € | 155,27 € | 75,8 % |

*Isoler le socle est un diagnostic interne ; nous ne recommandons pas de vendre un socle sans agent. 149 € pourrait être viable avec certains ensembles d’agents, mais laisse peu de réserve dans ce découpage et ne passe pas la cible de 65 % avec le plus petit abonnement. **199 € est le plus petit des cinq candidats qui passe ce contrôle**, pas un optimum de marché ni une démonstration exhaustive de toutes les valeurs possibles.

## Prix et quotas par agent

Le fichier source décrit la raison du montant et du quota de chacun. Les crédits d’usage financent, à pleine utilisation, 15 à 50 € de coûts variables mensuels par agent. Leur prix finance aussi de 15 à 50 minutes de maintenance spécifique à 75 €/h, de 3 à 8 € d’exécution fixe et une réserve d’incidents de 5 à 20 €. Une réserve d’incidents est un budget de risque mensuel ; elle n’est pas une facture réelle ni une garantie suffisante pour tout incident.

| Agent | Prix seul | Budget variable inclus | Maintenance propre | Réserve incidents | Facture avec socle | Coût direct cabinet, inclus utilisé à 100 % | Contribution après 80 € alloués |
|---|---:|---:|---:|---:|---:|---:|---:|
| Balthazar | 349 € | 50 € | 30 min | 10 € | 548 € | 171,21 € | 296,79 € |
| Salomé | 349 € | 40 € | 35 min | 15 € | 548 € | 172,46 € | 295,54 € |
| Grégoire | 349 € | 30 € | 40 min | 15 € | 548 € | 168,71 € | 299,29 € |
| Florent | 399 € | 40 € | 45 min | 15 € | 598 € | 188,96 € | 329,04 € |
| Aude | 399 € | 40 € | 50 min | 20 € | 598 € | 200,21 € | 317,79 € |
| Victoire | 199 € | 20 € | 15 min | 8 € | 398 € | 115,46 € | 202,54 € |
| Colette | 149 € | 15 € | 15 min | 5 € | 348 € | 106,46 € | 161,54 € |
| Émile | 199 € | 30 € | 20 min | 8 € | 398 € | 131,71 € | 186,29 € |
| Honoré | 249 € | 30 € | 25 min | 10 € | 448 € | 142,96 € | 225,04 € |
| Raphaël | 199 € | 20 € | 25 min | 8 € | 398 € | 127,96 € | 190,04 € |
| Octavie | 249 € | 20 € | 30 min | 15 € | 448 € | 144,21 € | 223,79 € |
| Prudence | 249 € | 20 € | 30 min | 12 € | 448 € | 141,21 € | 226,79 € |

Les pôles production/paie/juridique à 349 € financent un entretien plus important que les flux simples de communication. Florent et Aude à 399 € financent davantage de maintenance des modèles et de réserves ; leur prix n’achète pas une compétence réglementée. À prix identique, Émile reçoit plus de crédits que Victoire pour ses flux nombreux ; l’entretien d’Octavie limite sa réserve d’activité même si son prix est supérieur. Ce sont des hypothèses de segmentation et de charge, à confronter aux cas réels.

La cible de **65 % de marge directe** est un objectif de gestion que nous posons pour ce service, pas une norme du marché. Les 4 095 sous-ensembles non vides des douze agents ont été recalculés à pleine consommation, sans supposer de ventes de suppléments. La marge minimale de base est **66,1 %** pour Aude + Émile, au revenu mensuel de 797 € et au coût direct de 270,19 €. Les 80 € d’allocations sont ensuite déduits, une seule fois. Le modèle ne démontre ni la capacité de service à l’échelle, ni la volonté d’achat, ni l’absence de corrélation des incidents.

## Paniers et tarifs fournisseur

Les exemples de la grille utilisent les coûts variables complets de l’[étude Mammouth](../mammouth/GRILLE-AGENTS.md), hors part d’encaissement déjà comptée au mois : environ 0,1644 € par petite pièce, 0,2810 € par brouillon, 0,7944 € par contrôle, 1,5788 € par rapprochement, 2,146 € par synthèse, 4,60 € par dossier, 7,58 € par reporting et 15,38 € par scénario financier. Ce ne sont **ni des tarifs de vente publics ni des coûts réellement mesurés**. Chaque résultat est arrondi au crédit supérieur, puis multiplié par la quantité ; l’exemple de Balthazar consomme ainsi 4 510 crédits.

Bornes des éprouvettes : pièce lisible jusqu’à 5 pages/30 champs ; brouillon 600 mots avec 5 pages de contexte ; contrôle jusqu’à 250 lignes/10 règles ; rapprochement de deux populations jusqu’à 500 éléments chacune ; synthèse jusqu’à 20 pages ou 2 000 lignes d’entrée ; dossier jusqu’à 10 documents/50 pages ; reporting déjà configuré jusqu’à 5 000 lignes/5 indicateurs ; scénario déjà configuré sur douze mois/3 hypothèses/500 flux. Les éléments mixtes et le schéma sont qualifiés avant lot. Les frontières détaillées restent dans les fichiers historiques : ne pas déduire qu’une « préparation de dossier » remplace une mission complète d’audit ou de clôture.

[Mammouth](https://info.mammouth.ai/fr/docs/api-quick-start/) publie des plafonds de tarifs entrée/sortie et distingue l’achat de crédits API de l’abonnement de chat. Les repères vérifiés à cette date sont 2/10 USD par million pour `gpt-6.1-sol`, 4/20 pour `claude-opus-5-5` et 10/50 pour `gpt-6-astra`. Le modèle nominal garde une conversion budgétaire de 1 USD = 1,10 €, un facteur de reprises API 1,25 et des provisions de temps humain par éprouvette. **Kevin confirme l’absence de clé : aucun appel facturé ni benchmark de qualité ou de débit.** L’alias mobile `mammouth-recommended` n’est pas utilisé pour figer les coûts.

Le modèle opérationnel devra constater les frais réellement imputés et l’humain réel. Les prix/crédits d’une routine sont fixés à l’avance, pas corrigés rétroactivement selon le coût de ses erreurs. Toute nouvelle routine requiert une estimation complète ; tout coût inconnu interdit la qualification automatique. Le changement de modèle ou de portail impose une recette et une révision des budgets futurs si nécessaire.

## Sensibilité, dépassements et conditions d’arrêt

Le scénario défavorable double le coût de production non budgété, le temps propre des agents et les réserves d’incidents ; l’heure humaine monte à 100 €, le commun à 60 minutes, l’infrastructure commune à 40 €, l’exécution propre est multipliée par 1,5 et l’encaissement vaut 3 % + 0,30 €. Ce scénario simule une sous-estimation des coûts **sans augmenter le débit client déjà accepté**. Tous les cas à un agent restent contributeurs après les 80 € alloués, mais échouent à la cible de 65 % ; la contribution d’Émile n’est plus que **18,59 €**. Une estimation moyenne trop optimiste érode donc fortement la marge malgré un plafond en crédits.

Un incident de dix heures communes sur Balthazar, dans ce scénario, rend le mois déficitaire ; ce coût ne devient pas une consommation client. Aucun tarif n’assure de ne jamais perdre d’argent. Le socle et chaque agent doivent avoir des engagements de support compatibles avec les réserves. Le devis ne promet pas une intervention humaine systématique et illimitée sur chaque sortie.

Avant le lot, réserver les crédits de prix dans le budget du cabinet et les coûts maximums dans une réserve d’exécution distincte ; borner tokens, appels, outils, concurrence et reprises. Stopper les nouvelles commandes avant dépassement. Maintenir une clé d’idempotence et un relevé pour éviter les doubles débits ; ne pas ajouter les extractions internes quand elles sont comprises au travail. Les coûts d’un échec restent à Memlia ; seuls les résultats convenus sont débités. **Ces mécanismes sont à construire et recetter dans le produit ; cette étude ne les implémente pas.**

Les quotas inclus peuvent se mutualiser parce qu’un crédit a le même budget de réserve pour tous les agents ; cela ne donne aucun droit d’accès à des données d’une autre mission. Les quotas mensuels non utilisés ne s’accumulent pas ; les suppléments sont facturés au prorata à terme échu, avec plafond préalable, sans préachat de crédits expirants. Un lot qui ne tient plus dans le plafond attend l’accord ou une réduction explicite de son périmètre.

## Mise en service, validation et contrôles

Premier agent : prix candidat 1 990 €, 10 h à 75 €/h + 25 € de technique + 2 % d’encaissement et deux parts fixes de 0,25 €, soit **815,30 € de coût direct**. Agent supplémentaire standard avec réutilisation de l’environnement : prix candidat 990 €, 4 h + 20 € de technique + encaissement, soit **340,30 €**. Les heures sont des budgets internes, pas des durées garanties. Les routines, connecteurs, formats et critères de recette sont nommés dans le devis ; tout développement nouveau au-delà est chiffré séparément. Aucun ajout d’heure automatique.

Octavie ne fait pas payer une seconde fois les connexions communes déjà couvertes par le socle. Elle finance des travaux et scénarios distincts, par exemple préparation d’exports ou de reprises de données, avec les validations prévues. Les tâches déjà couvertes par les robots ne sont pas redébitées ; la part de maintenance réellement commune est consolidée au devis, sans remise forfaitaire inventée.

Avant publication de la grille : calibrer les scénarios sur jeux fictifs, leurs budgets et leur qualité, puis vérifier que le cabinet comprend les crédits à partir de ses volumes. Le montage d’usage client avec Mammouth reste à qualifier selon ses [conditions](https://info.mammouth.ai/fr/docs/terms-of-service/) ; la documentation API seule ne démontre pas une autorisation générale de mise à disposition. Aucun contact ou achat fournisseur n’a été lancé.

Tests ciblés : couverture des douze agents ; paniers inférieurs à chaque enveloppe ; socle unique et mutualisation ; calcul exact des suppléments et pause au crédit suivant ; entrée inconnue/manquante invalide ; crédits et arrondis ; coûts complets ; 4 095 combinaisons à usage plein. Les résultats sont des simulations sans réseau. Aucun test de cette étude n’est présenté comme une preuve de facturation ou de débit de production.
