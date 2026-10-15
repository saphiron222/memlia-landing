# Agents IA Memlia : grille de consommation et mise en service

> **Étude historique remplacée commercialement.** Après lecture, Kevin refuse la complexité des huit prix et demande de recalculer le socle, le prix et le quota de chaque agent. Lire [la proposition actuelle](../agents-individuels/GRILLE.md). Ses anciens 1 000 € + 300 € ne sont pas des contraintes tarifaires. Les calculs et le classeur de cette étude restent conservés, sans représenter le tarif actuel proposé.

15 octobre 2026. **Socle de 99 € HT/mois et principe de consommation par travail remis validés par Kevin. Les montants unitaires ci-dessous constituent la recommandation chiffrée issue de cette seconde étude.** Fournisseur IA retenu : API Mammouth. Kevin confirme qu’aucune clé n’est disponible : les coûts sont calculés sur les tarifs publics, sans consommation API réelle ni temps humain mesuré en production.

## Offre recommandée

**Une mise en service au forfait, un socle cabinet de 99 € HT/mois, puis le travail réellement remis au prix annoncé.** Pas d’abonnement par collaborateur ni par agent. Les étapes techniques et sous-agents internes ne multiplient pas la facture.

Le socle finance le maintien en service des tâches et intégrations nommées au devis : supervision, support et maintenance du périmètre déployé. Il ne vend pas la maintenance sans limites de toutes les tâches du catalogue. Les licences des logiciels métier, d’une plateforme de signature ou d’un outil BI restent distinctes lorsqu’elles sont à la charge du cabinet.

## Grille standard : prix et plafond par travail

| Travail remis | Prix fixe HT, plafond par unité | Ce que l’unité couvre |
|---|---:|---|
| **Pièce lue et structurée** | **1 €** | Une pièce lisible de 5 pages maximum, jusqu’à 30 champs ; extraction, proposition prévue par la règle et exceptions. |
| **Message préparé** | **2 €** | Un brouillon de 600 mots maximum, 5 pages de contexte, un destinataire/contexte et une révision sur les mêmes entrées ; envoi exclu. |
| **Jeu de données contrôlé** | **5 €** | Jusqu’à 250 lignes, 10 règles écrites, tableau d’exceptions et références aux entrées. |
| **Lot rapproché** | **10 €** | Deux populations de 500 éléments maximum chacune, même entité/période ; propositions, suspens et ambiguïtés. |
| **Synthèse préparée** | **12 €** | Une question et un dossier, jusqu’à 20 pages ou 2 000 lignes structurées ; note de 2 pages avec renvois aux entrées. |
| **Dossier préparé pour revue** | **25 €** | Jusqu’à 10 documents et 50 pages au total, un gabarit déjà déployé ; index, manquants et note de 3 pages maximum. |
| **Reporting préparé** | **39 €** | Une entité, une période, jusqu’à 5 000 lignes, 5 indicateurs et 2 pages de commentaires, sur le modèle déjà recetté. |
| **Scénario financier préparé** | **79 €** | Une entité, horizon 12 mois, 3 hypothèses, jusqu’à 500 flux, tableaux et note de 3 pages, sur un modèle déjà recetté. |

La synthèse ne cumule pas 20 pages et 2 000 lignes de données. Dossiers mixtes, nouveaux modèles, nouvelles recherches, actes, rédaction longue et tâches hors bornes sont qualifiés avant accord. Une construction nouvelle relève de la mise en service ; elle n’est pas facturée comme une petite consommation.

Les pages et lignes ont une densité définie : page logique jusqu’à 3 000 caractères, tableaux plats jusqu’à 20 colonnes et 200 caractères par cellule texte, avec un schéma convenu. Une page physique dense peut représenter plusieurs pages logiques, indiquées avant accord. Les gros tableaux sont contrôlés par un moteur déterministe et transmis au modèle sous forme d’agrégats bornés. **Le plafond de 5 000 lignes n’autorise pas un prompt sans limite.** Ces conditions d’acceptation doivent être recettées ; ce ne sont pas des capacités obtenues par un benchmark.

Un travail complet reçoit une seule qualification. Par exemple, le reporting à 39 € comprend l’extraction et la synthèse nécessaires à sa restitution : on n’y ajoute pas automatiquement 1 € par pièce, 5 € de contrôle et 12 € de synthèse. Si un robot remet déjà le même livrable dans son forfait, l’agent le réutilise sans seconde facture. Le nom de la figurine n’est jamais une unité tarifaire.

Le cabinet conserve sa revue, ses validations et ses décisions. Un tarif de préparation ne comprend pas la décision fiscale, sociale ou juridique, l’opinion d’audit, un envoi, une signature ou un dépôt autonome.

## Plafond mensuel : démarrer à 299 € HT maximum

**Proposition de départ : 99 € de socle + une enveloppe maximale d’usage de 200 € = 299 € HT maximum par mois, hors installation.** Les 200 € sont un plafond choisi, pas une consommation minimale ni un pack de crédits qui expire. Si l’usage remis vaut 80 €, la facture vaut 179 €, et non 299 €. À zéro usage, elle vaut 99 €.

| Enveloppe d’usage choisie | Maximum mensuel HT | Maximum du premier mois avec installation standard à 790 € |
|---:|---:|---:|
| 0 € — nouveaux travaux en pause | 99 € | 889 € |
| 200 € — proposition initiale | 299 € | 1 089 € |
| 500 € | 599 € | 1 389 € |
| 1 000 € | 1 099 € | 1 889 € |

Le plafond de chaque lot est connu avant lancement : quantité convenue × prix unitaire. Un lot de 40 messages à 2 € est plafonné à 80 €. Réserver ce montant avant de démarrer évite que plusieurs traitements concurrents dépassent ensemble l’enveloppe. Si le budget restant est insuffisant, proposer un lot plus petit ou un nouveau plafond ; ne pas tronquer silencieusement un travail.

Politique à implémenter : avertissement à 80 % et 95 % du budget consommé ou réservé ; pause des nouveaux travaux au plafond ; aucune recharge ou hausse automatique. Le traitement d’une unité en cours doit rester couvert par sa réservation. **Le classeur vérifie un devis ; il ne met pas en œuvre un compteur ni un plafond dans le produit.**

Facturation proposée : socle au mois de service, après la recette de mise en service ; usage à terme échu sur un relevé des travaux remis. Une reprise technique, une attente d’authentification ou une correction d’un défaut Memlia ne génère pas une nouvelle unité. Un tableau d’exceptions est facturable si c’est le livrable commandé ; un échec technique sans livrable ne l’est pas. Une restitution défectueuse doit être corrigée ou créditée selon la recette convenue.

## Mise en service : prix fixe avant de commencer

| Niveau | Prix HT recommandé | Périmètre de référence | Coût direct calculé, hypothèse de base |
|---|---:|---|---:|
| **Standard** | **790 €** | Une tâche déjà conçue, un connecteur standard, un livrable, jusqu’à deux formats d’entrée et une recette. | **326,30 €** |
| **Adaptation** | **1 990 €** | Jusqu’à trois tâches existantes, deux connecteurs standards, règles/formats adaptés et recette commune. | **815,30 €** |
| **Construction sur mesure** | **À partir de 4 900 €** | Nouveau périmètre : étude et prix ferme au devis. Exemple économique de 24 h d’effort prévisionnel. | **1 958,50 €** pour cet exemple |

Les coûts de référence supposent respectivement **4, 10 et 24 heures** à **75 €/h de coût humain chargé**, plus provisions techniques et encaissement, dont deux frais fixes provisionnés pour les deux versements 50/50. Ce sont des budgets internes, pas des durées client garanties ni un suivi horaire vendu. Le prix standard ne promet aucun connecteur nouveau. Un projet de 60 heures ne devient pas un forfait à 4 900 €.

Le **plafond de mise en service est le prix ferme du devis accepté** : 790 € ou 1 990 € pour le périmètre standard/adaptation accepté ; montant explicite pour le sur mesure. Aucune heure supplémentaire ne s’ajoute sans extension demandée et acceptée. Corriger un défaut du périmètre accepté relève de Memlia. Proposition de paiement : 50 % au démarrage, 50 % après la recette convenue ; critères et sort d’une interruption écrits au devis.

Un même connecteur partagé par plusieurs tâches n’est pas installé plusieurs fois dans la facture. En cas de cumul robots et agents, consolider également la maintenance réellement commune ; ne pas empiler deux forfaits dont les couvertures se recoupent.

## Coûts API : prix vérifiés, volumes hypothétiques

Le [catalogue public Mammouth](https://api.mammouth.ai/public/models) et sa [documentation API](https://info.mammouth.ai/fr/docs/api-quick-start/) distinguent entrées et sorties. Repères utilisés :

| Modèle fixé dans le chiffrage | Entrée USD / million | Sortie USD / million | Usage du modèle économique |
|---|---:|---:|---|
| `gpt-6.1-sol` | 2 | 10 | Référence standard pour U1–U5 et U7 |
| `claude-opus-5-5` | 4 | 20 | Référence complexe pour U6 et U8 |
| `gpt-6-astra` | 10 | 50 | Simulation d’un routage premium plus coûteux |

Le choix opérationnel d’un modèle dépend aussi de sa qualité sur les cas de recette et du périmètre de données autorisé. Le calcul économique ne prouve pas ces qualités. L’alias `mammouth-recommended` change de modèle et comporte un repli : il est exclu de notre budget à prix de modèle fixe. Aucune remise de cache ni crédit offert par l’abonnement n’est retranché.

Formule du coût IA : `(tokens entrée × tarif entrée + tokens sortie × tarif sortie) / 1 000 000 × facteur de reprises × conversion budgétaire × éventuels frais non récupérables`. Les tokens sont cumulés par travail, pas confondus avec un nombre de pages. Les tarifs API sont observés ; **les volumes et facteurs ne sont pas des consommations observées**.

Hypothèse de base : conversion de budget **1 USD = 1,10 €**, sans prétendre au cours de change du jour ; **25 % de volume de reprises API** ; coût humain **75 €/h** ; réserve d’encaissement **2 % du chiffre d’affaires + 0,25 € par facture**, qui n’est pas un tarif Mammouth. La colonne « autres » provisionne l’exécution/OCR/outils selon le travail ; elle ne prouve pas un prix de licence ou de worker. Les taxes/frais fournisseur non récupérables sont testés séparément dans les scénarios, sans transformer un tarif public USD en facture HT connue.

| Travail | API calculée de base | Temps humain moyen provisionné | Coût variable total calculé* | Prix HT |
|---|---:|---:|---:|---:|
| Pièce | 0,030 € | 5 s | 0,184 € | 1 € |
| Message | 0,043 € | 10 s | 0,321 € | 2 € |
| Contrôle | 0,089 € | 30 s | 0,894 € | 5 € |
| Rapprochement | 0,179 € | 60 s | 1,779 € | 10 € |
| Synthèse | 0,121 € | 90 s | 2,386 € | 12 € |
| Dossier | 0,550 € | 180 s | 5,100 € | 25 € |
| Reporting | 0,330 € | 300 s | 8,360 € | 39 € |
| Scénario | 0,880 € | 600 s | 16,960 € | 79 € |

*API, temps humain variable, provision outils et part variable d’encaissement. Infrastructure, maintenance fixe et part fixe d’encaissement sont comptées une seule fois au mois ; acquisition, catalogue et frais généraux sont distingués. La revue métier du cabinet n’est pas le temps de reprise Memlia de cette colonne.

Ces coûts calculés donnent environ **78 à 84 % de marge variable de base**, avant coûts fixes et allocations. **Ce n’est pas une marge réalisée.** U1 à 1 € ne tolère qu’environ **10,5 secondes humaines moyennes** pour viser 70 % de marge variable avec ces autres hypothèses. À 30 secondes humaines, son coût devient environ **0,705 €** avec la réserve d’encaissement : la marge tombe à **29,5 %**. Il faut alors environ **2,45 €** pour retrouver 70 % après une réserve variable de 2 % ; ne pas maintenir 1 € en cachant le travail humain.

## Vue totale : un exemple mensuel fictif

100 pièces, 10 messages, 4 contrôles, 1 rapprochement et 2 synthèses :

| Ligne | Montant calculé |
|---|---:|
| Consommation remise | 174,00 € HT |
| Socle | 99,00 € HT |
| **Facture mensuelle** | **273,00 € HT**, dans le plafond de 299 € |
| API Mammouth, scénario de base | 4,23 € |
| Temps humain variable provisionné | 20,00 € |
| Autres outils variables provisionnés | 4,07 € |
| Infrastructure et maintenance fixe provisionnées | 28,75 € |
| Encaissement provisionné | 5,71 € |
| **Coûts directs de service** | **62,76 €** |
| Frais généraux alloués | 30,00 € |
| Acquisition allouée : 300 € amortis sur 12 mois | 25,00 € |
| Développement du catalogue alloué : 600 € amortis sur 24 mois | 25,00 € |
| **Contribution après ces allocations** | **130,24 €**, avant impôts et frais non alloués |

Avec une installation standard : **1 063 € HT le premier mois** ; maximum accepté pour ce premier mois **1 089 € HT** ; **4 066 € HT la première année si le même usage revient douze fois**. Ce dernier montant est une projection constante, pas une observation du comportement d’un cabinet.

Sur le même panier, le scénario « reprises élevées » porte les coûts directs à **153,25 €** et la contribution à **39,75 €**. Le scénario premium, avec modèles coûteux, davantage de tokens/reprises/humain et infrastructure dédiée, coûte **236,40 €**, soit une contribution de **−43,40 €** après allocations. **Ce routage premium ne doit pas devenir le défaut de la grille standard.** Cadrer et chiffrer un usage réellement plus lourd avant son acceptation, sans majorer après coup le travail au prix fixe convenu.

À zéro usage, le socle de 99 € couvre 30,98 € de coûts directs dans la base, mais laisse **−11,98 € après les 80 € d’allocations hypothétiques**. Les allocations doivent être remplacées par nos frais réels et le socle reconsidéré si de nombreux comptes restent sans usage. Le simple coût du modèle ne suffit pas à conclure à la rentabilité d’un cabinet.

## Catalogue complet et travaux hors grille

La [matrice exhaustive](./COUVERTURE-TRAVAUX.md) rapproche **128 éléments source**, les **88 familles**, **12 démonstrations** et **21 robots**. Elle distingue **94 versions bornées**, **31 prises en charge à cadrer spécifiquement** et **3 alias/renvois non facturables**. Les prix couvrent les versions bornées, sans réduire l’ambition des fiches ni faire croire qu’une mission entière de clôture ou de conseil vaut une unité à 25 €.

Pour un travail hors grille : budget technique + temps humain prévisionnel + coût d’exécution, puis prix ferme de lot communiqué avant lancement. Le prix doit financer les coûts et la valeur du livrable ; sa borne économique est `coûts directs hors encaissement / (1 − marge cible − taux d’encaissement)`. Ce calcul de plancher ne remplace ni la définition du livrable ni son prix de valeur. Une unité nouvelle devient réutilisable après recette et peut alors compléter les données tarifaires ; aucun compteur opaque en jetons n’est vendu au cabinet.

## Ce qui est établi et ce qu’il reste à vérifier

- **Établi :** tarifs et limites publiés Mammouth, calculs arithmétiques, couverture du catalogue, propagation des hypothèses et limites de devis dans le classeur.
- **Hypothèses explicites :** tokens, fréquence de reprises, secondes de support, capacité de mutualisation, frais d’encaissement, frais généraux, acquisition et développement alloués. Aucune de ces lignes n’est baptisée coût réellement mesuré.
- **Avant exécution client :** recette qualité sur lots fictifs représentatifs, relevés API réels, temps humains et frais effectivement supportés ; calibration des bornes et règles de facturation. Le fichier permet de remplacer chaque hypothèse par ces mesures.
- **Point fournisseur :** les [conditions Mammouth](https://info.mammouth.ai/fr/docs/terms-of-service/) couvrent l’API mais décrivent un usage interne et encadrent la mise à disposition à des tiers. La documentation propose aussi l’intégration en application. Faire préciser le montage Memlia pour des cabinets clients ; ne déduire ni une autorisation de revente générale ni une interdiction générale. Aucun fournisseur n’a été contacté et aucun traitement client n’a été lancé.

## Fichiers et vérification

- `bareme-agents.json` : source du barème et des hypothèses du modèle.
- `calcul-economie.mjs` : calcul reproductible sans réseau ; prix/plafonds en centimes entiers, cas limites et conversions contrôlés.
- `calculs-agents.json`, `grille-couts-agents.csv` : résultats calculés, sans sortie de modèle inventée.
- `build-classeur.mjs` : constructeur du classeur avec les seules dépendances groupées Codex ; formules Excel conservées et recalculées.
- Classeur livré : `outputs/01a13e1c-ec37-74f0-8a26-6ad074cde9ac/couts-et-tarifs-agents-mammouth.xlsx` à la racine du worktree.
- `FOURNISSEUR.md`, `tarifs-modeles.json`, `archives/` et `manifest.json` : preuves Mammouth.
- `ECONOMIE-AGENTS.md` : étude économique intermédiaire avec ses propres hypothèses ; le présent barème et son JSON remplacent ses provisions provisoires pour la recommandation consolidée.

Le classeur a trois vues : Budget, Unités et Hypothèses. Trois scénarios sont recalculés dans le même modèle ; zéro consommation, absence de mise en service, frontière du plafond, quantité invalide, prix et conversion modifiés ont été contrôlés. Les formules du fichier exporté ont aussi été réimportées et recalculées. La vérification ne prétend pas à un essai dans l’application native Microsoft Excel.
