# Revue indépendante de la recommandation tarifaire

15 octobre 2026. Relecture de `RECOMMANDATION.md`, confrontée à `ECONOMIE-OFFRE.md`, `CONCURRENTS.md`, `MODELES-2026.md` et à la charte marketing v8. Aucun changement de code produit ni modification du rapport principal.

Version du rapport relue après corrections : SHA-256 `11976f6671af805fee8a5b2d61b40c753c8e0ffcc64409930a7a2509ad9984a2`.

**Verdict final : PASS pour le document de recherche et de décision commerciale.** Le modèle est cohérent, les calculs de la grille sont justes et les corrections de cette revue ont été intégrées au rapport principal : baisse de revenu, coût marginal, comparaison avec les paliers, prorata saisonnier et budget de support du socle agents. Le rapport peut être présenté à Kevin comme une proposition interne, avec ses incertitudes actuelles. Ce PASS ne valide pas les prix comme rentables ni leur publication : le rapport maintient explicitement les mesures et décisions préalables. Il ne permet pas encore de vendre les neuf routines au prix indiqué comme une offre économiquement validée.

## Points validés

- La séparation robots au forfait / agents à l’usage respecte la différence entre campagnes de portefeuille et travaux variables.
- La mise en service est séparée de l’abonnement ; le rapport ne promet pas de financer une adaptation de plusieurs jours dans 600 € annuels.
- La grille robots est monotone et rejoint exactement 600 € à 100 dossiers, 1 200 € à 250 et 1 800 € à 500. Elle retire les grands sauts au 101e et au 251e dossier.
- Les prix concurrents ne sont pas transformés en coûts Memlia, en consentement à payer ni en prix optimal. Le 7 €/h Factory 456 reste correctement qualifié d’historique et d’unité non déterminée.
- Le socle de 99 €/mois est présenté comme candidat ; aucun prix unitaire de livrable n’est fabriqué.
- Le travail livré et les décisions du cabinet sont distingués. Pannes, attentes et sous-agents internes ne deviennent pas des compteurs supplémentaires cachés.
- Le texte précise que ni la facturation ni les plafonds techniques ne sont prouvés disponibles. Les prix expérimentaux ne sont pas destinés au balisage `Offer` ni aux pages publiques.

## 1. Grille progressive : mathématiquement correcte, concession commerciale réelle

Pour un nombre entier `n` de dossiers de 1 à 500 :

```text
P(n) = 600
       + 4 × min(max(n − 100, 0), 150)
       + 2,40 × max(n − 250, 0)
```

Contrôle indépendant en arithmétique décimale des exemples et de la monotonie sur les 500 tailles de portefeuille : **PASS**.

| Dossiers | Proposition Memlia HT/an | Grille Outils-EC observée HT/an | Écart Memlia |
|---:|---:|---:|---:|
| 100 | 600 € | 600 € | 0 € |
| 101 | 604 € | 1 200 € | −596 € |
| 150 | 800 € | 1 200 € | −400 € |
| 250 | 1 200 € | 1 200 € | 0 € |
| 251 | 1 202,40 € | 1 800 € | −597,60 € |
| 350 | 1 440 € | 1 800 € | −360 € |
| 500 | 1 800 € | 1 800 € | 0 € |

L’absence de saut est un avantage de lisibilité et d’équité perçue à tester. Mais elle **diminue aussi le revenu** sur toute la partie intérieure de chaque tranche. Le rapport doit dire que cette concession est choisie, plutôt que laisser penser que l’on conserve économiquement les mêmes paliers avec une simple amélioration de présentation.

Ce n’est pas une erreur de la grille. Il faut néanmoins tester sa viabilité sur la répartition réelle des tailles de cabinet : un portefeuille de 150 dossiers ne finance pas la même charge à 800 € qu’à 1 200 €. Aucun gain de conversion n’a été mesuré pour compenser cette baisse. **Point documentaire clos :** le rapport révisé chiffre désormais ces concessions et demande le test face aux paliers classiques.

Lisibilité recommandée pour la future offre, si adoptée : « 600 € par an jusqu’à 100 dossiers, puis 4 € par dossier supplémentaire jusqu’à 250, puis 2,40 € jusqu’à 500. » Afficher le **total annuel calculé** après une seule saisie du portefeuille. Ne pas multiplier les cartes par tranche de facturation. Au-delà de 500, afficher « forfait à définir », sans prolonger automatiquement le dernier taux.

Le minimum de 600 € pour un petit portefeuille doit rester visible. Le cas de zéro dossier doit être explicite dans le simulateur : absence de simulation utile, et non promesse d’un abonnement à zéro euro.

## 2. Point économique à ajouter : coût moyen et coût marginal

Le rapport révisé cite les 180 € de coûts directs finançables par 600 € à une marge cible de 70 % et les plafonds marginaux des deux tranches. Les sensibilités ci-dessous conservent le détail de la revue.

| Taille du portefeuille | Revenu HT/an | Coûts directs max. à 70 % | Coût direct moyen max./dossier/an | Coûts max. à 80 % |
|---:|---:|---:|---:|---:|
| 100 | 600 € | 180 € | 1,80 € | 120 € |
| 150 | 800 € | 240 € | 1,60 € | 160 € |
| 250 | 1 200 € | 360 € | 1,44 € | 240 € |
| 350 | 1 440 € | 432 € | environ 1,23 € | 288 € |
| 500 | 1 800 € | 540 € | 1,08 € | 360 € |

Tous les coûts directs sont concernés : supervision et support attribuables au cabinet, calcul et appels externes, reprises, maintenance et infrastructure. Le revenu n’est pas uniquement disponible pour le modèle IA.

La grille ajoute :

- 4 € de revenu par dossier entre 101 et 250, soit **1,20 € de coût direct marginal maximal** pour garder 70 % de marge marginale ; 0,80 € à 80 % ;
- 2,40 € entre 251 et 500, soit **0,72 € de coût marginal maximal** à 70 % ; 0,48 € à 80 %.

Ces limites marginales ne sont pas les coûts réels constatés, et la marge totale dépend aussi des coûts fixes. Elles montrent l’échelle requise pour que l’extension de portefeuille préserve la marge : les 250 derniers dossiers doivent être très peu coûteux à servir.

À 100 dossiers, les 180 € de budget direct à 70 % financeraient au maximum **2,4 heures humaines annuelles à 75 €/h**, avant tout autre coût. Pour neuf routines, cela représenterait une moyenne de **16 minutes par routine et par an** si l’on répartissait ce budget également. Le partage réel ne sera pas égal ; cette illustration sert à tester l’ordre de grandeur, pas à fixer une allocation support.

**Point documentaire clos :** coût marginal ajouté et comparaison des modèles demandée avant publication ; neuf routines présentées comme une nouvelle proposition non validée, à mesurer avec sources, fréquences et livrables définis. Le fait que le même ensemble apparaisse dans le simulateur concurrent ne démontre pas qu’il soit le meilleur premier pack Memlia. La recommandation ne contredit pas `ECONOMIE-OFFRE.md` puisqu’elle annonce une proposition ; elle augmente toutefois sensiblement l’engagement proposé par rapport au simple principe de routines réutilisables.

La mutualisation peut rendre ce pack viable. Elle doit être mesurée : coût de connecteur partagé, réserve de maintenance commune répartie, incidents spécifiques à un cabinet et travail variable. Ne pas compter un incident de portail une seule fois dans la technique puis omettre le temps de vérification et de remise en service chez chaque cabinet.

## 3. Prorata des ajouts : distinguer surveillance et campagne

La première version du rapport proposait un prorata de période restante pour tout ajout. C’est lisible pour un service continu, mais ce n’est pas automatiquement adapté à une campagne annuelle.

Exemple : un cabinet de 100 dossiers passe à 150. L’écart annuel de grille est 200 €. Une extension au milieu du contrat donnerait 100 € sous un prorata de moitié. Pour six mois de surveillance régulière, ce mécanisme est cohérent à tester. Si les 50 dossiers arrivent juste avant la campagne CFE, ils peuvent bénéficier de la collecte annuelle complète alors que seule une courte fraction d’année est facturée.

**Point documentaire clos :** la version révisée réserve le prorata au suivi continu et annonce un chiffrage selon le travail de campagne restant pour une campagne proche. Toute somme reste annoncée et acceptée avant lancement. Aucun minimum de campagne n’est inventé : son coût est inconnu.

Préciser aussi, avant contractualisation : date de référence du portefeuille, retraits/dossiers dormants, crédit ou absence de crédit lors d’une baisse, changement de tranche au renouvellement, durée d’engagement et paiement annuel ou mensuel. Le tableau de prix annuels ne définit pas ces conditions. « 50 €/mois » ne devra pas devenir un abonnement mensuel sans que ce choix soit réellement adopté.

## 4. Socle agents de 99 €/mois : hypothèse défendable, couverture non calibrée

L’idée de financer le maintien en service séparément est cohérente avec l’analyse économique. Aucun élément ne démontre néanmoins que 99 € soit supérieur à 50 ou 149 €, ou soit accepté par un décideur français. Le rapport le dit honnêtement.

À 99 € par mois, le revenu de socle est 1 188 € par an. À 70 % de marge cible, il permet 356,40 € de coûts directs annuels ; à 80 %, 237,60 €. Au coût humain illustratif de 75 €/h, cela représente respectivement **4,75 h ou 3,17 h par an**, avant infrastructure et autres coûts directs. Ce montant ne suffit donc pas à annoncer une maintenance humaine générale des douze agents et de toutes les tâches.

**Point documentaire clos :** le rapport révisé borne le périmètre au devis, interdit la lecture « maintenance illimitée des douze agents », et chiffre le budget direct à 29,70 €/mois à 70 %. Son exemple retranche 120 € annuels hypothétiques avant le coût humain de 75 €/h : `(356,40 − 120) / 75 = 3,152 h/an`, arrondi correctement à 3,15 h. La définition d’un périmètre standard commun et sa mesure restent nécessaires avant un prix public ; ce sont des gates explicites de la recommandation, pas un résultat prétendument déjà connu.

Pour le cumul robots + agents, « déduire les coûts communs effectivement déjà couverts » est une bonne instruction interne mais ne constitue pas encore une remise calculable par l’acheteur. Définir ultérieurement un montant commercial consolidé, avec une seule couverture et un seul total. Ne pas exposer la comptabilité des coûts internes au cabinet ni la faire passer pour une formule tarifaire objective.

Le prix d’usage doit couvrir son coût variable propre. Un socle ne doit pas subventionner indéfiniment des unités vendues sous leur coût ; il finance aussi le service des petits consommateurs. Réserver les coûts fixes au socle et le coût incrémental aux unités, avec une réserve réaliste pour les reprises, est une allocation à tester, pas une observation de ce qui existe.

## 5. Livrable facturable : bon choix, définition et recours à compléter

Ne pas ajouter de tarifs par facture ou par dossier tant que coûts, bornes et valeur ne sont pas mesurés. Cette absence est une limite honnête de la recommandation, pas un motif pour fabriquer des montants.

Avant toute offre publique, compléter un petit contrat de compteur pour les deux premières familles :

- entrée et volume bornés ; état final objectivement vérifiable et sortie attendue ;
- règle de quantité facturée si un lot n’est livré qu’en partie ;
- distinction entre une exception métier prévue, un résultat inexploitable et un diagnostic explicitement commandé ;
- correction d’un défaut Memlia, sans nouvelle unité, et nouvelle demande du cabinet, chiffrée distinctement ;
- plafond de lot, réservation du budget avant démarrage et traitement des travaux concurrents ;
- relevé de consommation, contestation et avoir si une unité a été comptée à tort ;
- durée de validité ou report éventuel d’une enveloppe, et conséquence d’un mois sans usage.

Le tableau existant couvre déjà une partie de ces points. Il ne promet pas prématurément la fonctionnalité technique ; conserver cette distinction dans la future copy. « Unité livrée » ne doit pas être synonyme de « sortie quelconque générée » ni exiger de Memlia une décision réglementaire qui reste au cabinet.

## 6. Simulateur et ordre de décision

Les contraintes du rapport sont bonnes : pas de 117 minutes concurrentes présentées comme gains Memlia, pas d’équivalence entre heure humaine et heure machine, pas de rentabilisation journalière linéaire de routines saisonnières.

**Point à verrouiller :** la demande d’une grille concrète pour réfléchir n’est pas la décision de publier cette grille. Le simulateur public peut utiliser un montant de service saisi par le visiteur, qualifié d’hypothèse, tant que le prix n’est pas adopté. Éviter de charger les 600/1 200/1 800 € comme « tarif Memlia » par défaut sous couvert d’une simple note de bas de page.

Ne pas demander au visiteur de connaître un prix unitaire d’agent qui n’existe pas encore. Si aucun tarif unitaire n’est arrêté, ne pas afficher un ROI net agent artificiel. Une estimation de valeur du temps avec coût de service modifiable suffit, avec première année distincte des années suivantes.

## Décision de revue

La recommandation révisée est **solide sur le modèle**, **exacte sur les calculs**, **prudente sur les preuves** et suffisamment concrète pour une discussion commerciale. Elle a intégré les corrections sur le revenu sacrifié par le lissage, le coût marginal, la viabilité encore à mesurer du pack de neuf routines, le prorata saisonnier et la couverture du socle de 99 €.

**PASS documentaire, aucune correction bloquante restante pour remettre ce rapport de recherche.** Les coûts, les conditions contractuelles, la définition des premières unités et l’acceptation commerciale doivent être mesurés ou décidés avant une adoption des prix et leur publication comme offre. Ils n’imposent ni de modifier les tarifs pour modifier les tarifs, ni de reprendre du développement produit dans ce chantier de recherche.
