# Couverture exhaustive des travaux des douze agents

**Décision interne en préparation — 15 octobre 2026.** Aucun prix, aucune capacité mesurée et aucun nouveau tarif public dans ce document. Les huit unités U1–U8 sont alignées sur le volet `ECONOMIE-AGENTS.md`. Les plafonds sont des hypothèses de qualification à éprouver avant engagement, pas des performances obtenues.

## Couverture calculée depuis le catalogue réel

Le chargement de la source unique donne **12 agents, 10 fiches, 99 lignes de tâches, 2 lignes « Aussi dans son périmètre », 22 familles des deux agents sans fiche et 5 usages de l’accueil CAC**. Cela représente **128 éléments source**, tous affectés. Les **88 familles titulaires** sont couvertes. Aude et Octavie n’ont pas de tableau de tâches dans les données ; leurs familles réellement attribuées sont donc inventoriées, avec leurs descriptions de la taxonomie. Les 12 démonstrations renvoient à ces mêmes travaux et ne créent aucune unité nouvelle.

Deux familles sont des alias historiques tenus hors page (`audit-legal`, `complements-excel`) ; un usage CAC renvoie à des travaux déjà couverts et un autre distingue les travaux déjà décrits d’un rapprochement fichier/balance borné. Ils sont visibles dans la matrice mais **non facturables**. Trois autres usages CAC restent explicitement sur mesure. Les lignes de deux familles identiques sur une fiche restent distinctes lorsqu’elles décrivent des gestes différents (DSN, financement, reporting…).

Le JSON associé conserve chaque texte source exact, sa position, l’empreinte SHA-256 de chaque fichier lu, les bornes, les validations, les renvois et les contrôles calculés. Le résultat PASS vérifie l’exhaustivité documentaire ; il ne certifie ni l’exécution technique ni la rentabilité de ces prises en charge.

## Les huit familles de petits travaux

| Unité | Quantité strictement bornée proposée | Livraison et frontière |
|---|---|---|
| U1 · Pièce lue et structurée | Une pièce ou un message autonome, un dossier identifié. pieces ≤ 1; pages_entree ≤ 5; champs_extraits ≤ 30 | Pièce référencée, champs et classification, anomalies de lecture ; renommage et rattachement si la règle est déjà déployée. Le cabinet contrôle les champs sensibles ; aucune imputation nouvelle, suppression, diffusion ou écriture métier autorisée. |
| U2 · Message préparé | Un brouillon pour un destinataire ou un contexte, un canal, une finalité. mots_sortie ≤ 600; pages_contexte ≤ 5; brouillons ≤ 1; revision_meme_contexte ≤ 1 | Brouillon et références du contexte ; message court ou publication courte, sans diffusion. Le destinataire, le contenu, la qualification métier et chaque envoi ou publication restent au cabinet. |
| U3 · Contrôle structuré | Une passe sur un tableau ou un registre borné, selon une règle déjà écrite. lignes_entree ≤ 250; regles ≤ 10; passes ≤ 1 | Tableau contrôlé et exceptions avec la règle et la ligne en cause ; pas de qualification juridique définitive. Le cabinet fournit ou accepte la règle, tranche les exceptions et applique toute correction métier. |
| U4 · Rapprochement | Deux populations comparables, une entité, une période, un rapprochement. lignes_population_A ≤ 500; lignes_population_B ≤ 500; populations ≤ 2 | Correspondances proposées et écarts, avec références aux deux entrées. Le cabinet accepte la clé, les tolérances et les appariements ambigus ; intégration, paiement et conclusion restent humains. |
| U5 · Synthèse | Une question et un contexte définis, à partir de sources fournies ou déjà collectées. pages_entree ≤ 20; ou_lignes_tableau ≤ 2000; pages_sortie ≤ 2 | Note de synthèse avec renvois aux données et points non résolus. Le professionnel vérifie interprétations, droit applicable et conclusions ; pas de recherche ouverte ni d’avis juridique définitif. |
| U6 · Dossier préparé | Un dossier, une finalité et un gabarit déjà déployé. documents_entree ≤ 10; pages_entree ≤ 50; pages_note ≤ 3 | Pièces assemblées et indexées, champs du gabarit repris, manquants et note de préparation ; pas d’acte juridique rédigé. Le cabinet revoit la complétude, apprécie le dossier et déclenche toute signature, dépôt, notification ou remise externe. |
| U7 · Reporting | Une entité, une période et un modèle de reporting déjà recetté. lignes_export ≤ 5000; indicateurs ≤ 5; pages_commentaires ≤ 2 | Restitution selon le modèle existant, indicateurs et commentaires préparés, écarts reliés aux données. Le cabinet valide les retraitements et les commentaires ; les vues internes restent agrégées, sans classement des salariés. |
| U8 · Scénario financier | Une entité, un horizon et un modèle de scénario déjà recetté. mois_horizon ≤ 12; hypotheses_maximum ≤ 3; flux_entree ≤ 500; pages_note ≤ 3 | Tableaux calculés et note avec les hypothèses, leurs sources et les limites. Le cabinet fournit ou approuve hypothèses et barèmes, choisit le scénario et formule le conseil ; pas de décision d’investissement ou d’éligibilité automatique. |

**Bornes U5 :** 20 pages *ou* 2 000 lignes, sans cumul de deux corpus. Les fichiers mixtes sont estimés avant accord. **U6 :** assemblage dans un gabarit existant et note ≤3 pages ; actes, contrats, rédaction longue et construction de gabarit sont hors unité. **U7/U8 :** le modèle est déjà recetté ; construire ou adapter ce modèle relève du déploiement/devis, sans faire passer ces travaux pour de simples consommations. Une entité U7 peut être le cabinet pour son reporting interne agrégé.

**Normalisation proposée, à tester :** une page logique contient au plus 3 000 caractères de texte ; une page dense peut donc représenter plusieurs pages logiques, annoncées avant accord, tout en conservant aussi le plafond de pages physiques. Un tableau est plat, à schéma validé, avec au plus 20 colonnes et 200 caractères par cellule texte. Archives, macros, liens externes, formules non évaluées et structures imbriquées sont hors unité ; aucun contenu entrant ne s’exécute implicitement.

**Condition économique à recetter :** U3/U4/U7/U8 supposent des calculs structurés déterministes, puis une agrégation textuelle bornée (hypothèse : 30 000 caractères par demande de commentaire) transmise au modèle. Les exports bruts de 5 000 lignes ne doivent pas être confondus avec un prompt. Les exceptions détaillées peuvent sortir sous forme structurée sans génération par LLM. Un travail qui exige de faire lire tout un corpus plus large par le modèle se requalifie avant accord : le nombre de lignes seul ne démontre pas son coût API. Cette architecture est proposée, pas présentée comme déjà mesurée dans Memlia.

Les volumes plus importants ne sont pas fractionnés et facturés automatiquement. Nous annonçons le lot et son plafond, ou un devis. Un message collectif rédigé une fois n’est pas multiplié par le nombre de clients destinataires ; une déclinaison réelle dans un nouveau contexte reste une demande distincte.

## Une seule facturation pour un même travail

1. Données, gabarits, barèmes et connecteurs autorisés et déjà recettés ; configuration initiale et adaptation ne sont pas incluses arbitrairement dans une petite unité.
2. Quantité et plafond en euros acceptés avant traitement ; si une borne est dépassée, arrêt et proposition ; aucun découpage ou dépassement silencieux.
3. Un travail métier avec ses étapes internes = une seule qualification et une seule consommation. Extraction, classement, contrôles de lecture et synthèse courte nécessaires ne sont pas additionnés lorsqu’ils sont inclus au livrable choisi.
4. La clé anti-doublon porte sur cabinet, dossier/entité, période, finalité, empreinte des entrées, version de règle et livrable ; le nom ou le nombre d’agents internes ne multiplie pas la facture.
5. Si le même livrable est déjà inclus à un robot/abonnement/devis, aucune consommation IA additionnelle. L’agent peut le présenter ou le réutiliser ; un travail distinct doit être nommé et accepté.
6. Reprises de panne Memlia, doublons involontaires, attentes d’authentification, portails indisponibles et validations humaines : pas de nouvelle consommation proposée ; le compteur produit n’est pas encore implémenté.
7. Un arrêt technique sans livrable n’est pas une réussite facturable. Une restitution de contrôle listant des anomalies peut être un livrable si cela était explicitement l’objet accepté ; pas un échec requalifié après coup.
8. Une révision du même brouillon sur les mêmes entrées reste dans l’unité ; une modification réelle de périmètre/entrées se requalifie avant traitement, sans réécriture des données humaines.
9. La supervision technique, recette et maintenance du service se distinguent de la revue métier : aucun expert humain ou jugement professionnel individuel inclus à l’insu du client.
10. Aucun envoi, dépôt, signature, paiement, écriture métier, suppression ni changement de droits engageant sans la validation prévue ; opinion et responsabilité au professionnel.
11. Les états active:true/false viennent de la taxonomie éditoriale et ne sont ni des badges de disponibilité ni des mesures de capacité.

## Matrice de toutes les tâches

Lecture : une unité U1–U8 désigne **uniquement la version bornée décrite**. Le reste de la tâche commerciale passe au devis ; aucune étape exclue n’est silencieusement promise dans le petit prix. « Sur mesure » signifie que le geste entier ne tient pas proprement dans les huit unités. Cela ne retire pas la tâche de l’offre Memlia.

### Balthazar · Comptabilité

Destination actuelle : `/agents-ia/comptabilite`. 12 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `comptabilite:t01` · Réclamer les pièces manquantes | U2 | Une relance pour un dossier ; liste des manquants déjà disponible ou préparée dans ce même traitement borné. |
| `comptabilite:t02` · Lire et pré-imputer les pièces | U1 | Une facture ≤5 pages, 30 champs ; compte connu proposé selon la règle déjà recettée. |
| `comptabilite:t03` · Reprendre les factures électroniques reçues | U4 | Une période, deux populations ; exclut choix de PA et déclaratif. Robots : annuaire-facturation-electronique — L’annuaire renseigne le rattachement ; il ne reprend pas les factures reçues et ne les rapproche pas. |
| `comptabilite:t04` · Contrôler les factures d’achat | U3 | Une passe et les contrôles déjà écrits ; règlement exclu. |
| `comptabilite:t05` · Rapprocher la banque | U4 | Une banque et le jeu d’écritures comparable ; ambiguïtés isolées. |
| `comptabilite:t06` · Lettrer les comptes de tiers | U4 | Une population de factures et une de règlements ; cas partiels à valider. |
| `comptabilite:t07` · Intégrer ventes, caisse et e-commerce | Sur mesure | Mise au format et import multi-sources ne sont aucune des 8 unités ; traitement recetté/devis distinct. |
| `comptabilite:t08` · Tenir immobilisations et emprunts | Sur mesure | Fiches, dotations, amortissements, emprunts et écritures forment une préparation composite à cadrer ; aucune règle comptable inventée. |
| `comptabilite:t09` · Réviser par cycle | U3 | Un cycle et une passe bornée ; proposer les écritures nouvelles ou conclure reste hors unité. |
| `comptabilite:t10` · Préparer la clôture | Sur mesure | Clôture complète, contrôle du FEC, états et plaquette dépassent une petite unité ; périmètre sur mesure. |
| `comptabilite:aussi01` · Notes de frais | U1 | Une pièce selon U1 ; lecture, contrôle borné et classement du même traitement ne sont pas des unités cumulées. |
| `comptabilite:aussi02` · GED, dossier permanent et nommage des pièces | U1 | Une pièce selon U1 ; lecture, contrôle borné et classement du même traitement ne sont pas des unités cumulées. |

Frontière de la source : **prépare** Lire les pièces et en extraire les champs ; **validation** Chaque écriture proposée, lot par lot ; **humain** Le jugement de révision.

### Salomé · Paie et social

Destination actuelle : `/agents-ia/paie-social`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `paie-social:t01` · Rassembler les variables du mois | U1 | Une pièce de variables ; historique de comparaison fourni et champs bornés ; relance type fixe liée au cas, sans envoi. |
| `paie-social:t02` · Contrôler les bulletins avant la DSN | U3 | Une passe bornée sur des bulletins déjà calculés, sans recalcul de paie. |
| `paie-social:t03` · Préparer les contrôles de la DSN | U3 | Un tableau de cohérence fourni ; dépôt et correction déclarative exclus. |
| `paie-social:t04` · Trier les retours DSN | U1 | Un CRM lisible ; rattachement et champs d’écart ; correction métier au gestionnaire. Robots : suivi-urssaf — Les messages URSSAF déjà collectés par le robot ne sont pas recollectés/facturés ; un CRM DSN distinct reste identifié. |
| `paie-social:t05` · Préparer les entrées et les sorties | Sur mesure | Contrats, DPAE, solde et pièces de départ : préparation composite réglementée, actes et dépôts hors petites unités. |
| `paie-social:t06` · Suivre les absences et les indemnités journalières | U4 | Deux populations : absences/IJSS attendues et versements ; dates et droit à prestation validés au cabinet. Robots : suivi-urssaf — Les versements/états accessibles déjà collectés sont réutilisés ; rapprochement IJSS seulement si absent du résultat robot. |
| `paie-social:t07` · Suivre les échéances de cotisations | U4 | État de cotisations et attendu paie/DSN, une période ; pas de paiement. Robots : suivi-urssaf — Soldes et échéances collectés une seule fois ; concordance avec paie/DSN supplémentaire seulement si distincte. |
| `paie-social:t08` · Préparer le journal de paie pour la comptabilité | Sur mesure | Transformation au format d’import et intégration comptable hors barème des 8 unités. |
| `paie-social:t09` · Préparer la remise des bulletins et des états | U1 | Un document nommé et rattaché ; diffusion seulement après validation, pas facturée automatiquement à chaque destinataire. |
| `paie-social:t10` · Suivre la production sociale | U7 | Cabinet = entité du reporting, une période, avancement agrégé ; pas de performance individuelle. |

Frontière de la source : **prépare** Comparer au mois précédent et à la règle du dossier ; **validation** Chaque écart de bulletin ; **humain** Le dépôt de la DSN et de la DPAE.

### Grégoire · Juridique et fiscal

Destination actuelle : `/agents-ia/juridique-fiscal`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `juridique-fiscal:t01` · Préparer la TVA | Sur mesure | Préparation et calcul de déclaration fiscale : devis de traitement recetté ; un contrôle de tableau ne couvre pas la déclaration entière. Robots : situation-tva — Situation et solde du portail ne sont pas préparation de la déclaration TVA ; réemploi sans seconde collecte. |
| `juridique-fiscal:t02` · Calculer acomptes et solde d’IS | Sur mesure | Calcul IS et relevés réglementés, historiques et échéancier : périmètre spécifique. |
| `juridique-fiscal:t03` · Préparer la liasse fiscale | Sur mesure | Liasse fiscale et contrôles entre tableaux : préparation réglementée spécifique. |
| `juridique-fiscal:t04` · Préparer les déclarations annexes | Sur mesure | Plusieurs déclarations et régimes distincts : cadrage séparé ; collecte CFE déjà incluse au robot non refacturée. Robots : cfe — Avis, récapitulatif et communications CFE du robot sont inclus ; une déclaration nouvelle réglementée reste cadrée séparément. |
| `juridique-fiscal:t05` · Tenir le calendrier fiscal du portefeuille | U3 | Contrôle d’un calendrier fourni, ≤250 lignes et 10 règles déjà validées ; constitution de toutes les échéances juridiques hors unité. Robots : suivi-declarations-fiscales — Le même calendrier/état attendu-déposé en sortie du robot ne devient pas une nouvelle U3 agent. |
| `juridique-fiscal:t06` · Suivre télédéclarations et rejets | U1 | Un accusé ou rejet ; collecte robot réutilisée ; toute proposition de correction nouvelle est distincte et explicitée. Robots : suivi-declarations-fiscales — Traces et états de dépôt déjà collectés sont réutilisés ; correction métier hors routine robot à cadrer. |
| `juridique-fiscal:t07` · Préparer les documents de l’approbation des comptes | Sur mesure | Convocation, rapport, résolutions et procès-verbal : rédaction d’actes hors U6. |
| `juridique-fiscal:t08` · Préparer le dépôt des comptes | U6 | Un dossier de pièces déjà approuvées, assemblé ; dépôt exclu et échéance fournie/validée. Robots : informations-legales-rne — Documents et identités collectés une seule fois ; assemblage des comptes approuvés distinct si demandé. |
| `juridique-fiscal:t09` · Constituer les dossiers de formalités | Sur mesure | Création/modification/cessation et actes de formalités : périmètre spécifique ; collecte administrative existante réutilisée. |
| `juridique-fiscal:t10` · Mettre à jour registres et bénéficiaires effectifs | Sur mesure | Tenue de registres et déclaration BE : actes et décision métier hors petites unités ; données RNE/BE/BODACC du robot réutilisées. Robots : informations-legales-rne — Identités, actes et changements déjà remis par le robot ne sont pas une seconde unité agent. ; beneficiaires-effectifs — Données et divergences BE déjà remises sont réutilisées ; déclaration BE reste un travail distinct. ; veille-bodacc — La même annonce/alerte n’est pas facturée à nouveau sous le nom de l’agent. |

Frontière de la source : **prépare** Calculer échéances et acomptes depuis les données tenues ; **validation** Chaque déclaration avant télétransmission ; **humain** La télédéclaration, le dépôt des comptes et des formalités.

### Florent · Finance

Destination actuelle : `/agents-ia/finance`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `finance:t01` · Préparer les situations intermédiaires | U7 | Une situation selon le modèle existant ; retraitements proposés mais validés au cabinet. Robots : tableaux-de-bord-fec — Restitution/commentaires déjà inclus au robot FEC : zéro unité supplémentaire pour la même sortie. |
| `finance:t02` · Tenir le tableau de bord du client | U7 | Une entité, une période ; si le robot FEC remet déjà cette restitution et ses commentaires, aucune unité agent supplémentaire. Robots : tableaux-de-bord-fec — Le même tableau de bord FEC et ses commentaires sont une seule prestation. |
| `finance:t03` · Préparer le rendez-vous bilan | U5 | Une note de deux pages à partir des données fournies ; pas une mission de conseil complète. Robots : tableaux-de-bord-fec — Synthèse/commentaires déjà inclus au reporting robot ne sont pas refacturés ; nouvelle note seulement si finalité distincte. |
| `finance:t04` · Projeter la trésorerie | U8 | Modèle de trésorerie déjà recetté, 12 mois/3 hypothèses/500 flux maximum ; les durées et flux ne sont pas des capacités mesurées. Robots : tableaux-de-bord-fec — Un scénario déjà compris dans le périmètre robot FEC ne déclenche pas U8 en plus. |
| `finance:t05` · Construire le prévisionnel | U8 | Seulement exécution d’un modèle existant ; la construction du prévisionnel et les hypothèses nouvelles passent au devis. Robots : tableaux-de-bord-fec — Les scénarios convenus du robot FEC et la même exécution de modèle ne s’additionnent pas. |
| `finance:t06` · Comparer budget et réalisé | U4 | Budget et réalisé comparables, une période ; commentaire court des écarts inclus, nouveau budget exclu. |
| `finance:t07` · Monter le dossier de financement | U6 | Prévisionnel et états déjà établis, dossier assemblé dans un gabarit ; construire les chiffres est exclu. |
| `finance:t08` · Repérer aides et crédits d’impôt à étudier | Sur mesure | Recherche de dispositifs et examen de leurs critères : recherche ouverte hors petites unités ; éligibilité au cabinet. |
| `finance:t09` · Simuler la rémunération du dirigeant | U8 | Modèle existant de rémunération, barèmes de l’année fournis et validés ; création/actualisation du modèle à cadrer. |
| `finance:t10` · Préparer évaluation et transmission | U6 | Éléments et retraitements déjà validés réunis ; calcul de valeur, conseil et jugement d’évaluation exclus. |

Frontière de la source : **prépare** Projeter les flux datés et chiffrés ; **validation** Chaque hypothèse et chaque retraitement ; **humain** Le conseil au client.

### Aude · Missions d’audit

Destination actuelle : `/commissaires-aux-comptes`. 18 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `missions-audit:famille:cac-fec-reception` · Réception du FEC | U3 | Seulement constat de forme sur un extrait borné ou fichier qui tient la limite ; FEC complet au-delà de 250 lignes sur mesure. |
| `missions-audit:famille:cac-demandes-documents` · Demandes de documents | U6 | Une demande par dossier/cycle, liste et gabarit fournis ; relances du même travail sans double unité. |
| `missions-audit:famille:cac-revue-analytique` · Revue analytique | U7 | Une entité, une période et comparatif prévu dans le modèle ; aucune appréciation de la portée des variations. |
| `missions-audit:famille:cac-revue-ecritures` · Sélection des écritures | U3 | Une population bornée, critères et graine fournis ; le CAC choisit la méthode et les paramètres. |
| `missions-audit:famille:cac-confirmations-audit` · Confirmations de tiers | U4 | Deux populations de demandes/réponses ; la sélection, les envois, non-réponses et conclusions restent maîtrisés par le CAC. |
| `missions-audit:famille:cac-dossier-de-travail` · Dossier de travail | U6 | Un cycle, dix documents/50 pages au maximum ; dossier d’audit complet hors unité. |
| `missions-audit:famille:cac-rapport-certification` · Synthèse et lettre d’affirmation | U6 | Assembler les observations et la lettre existante ; rédaction de l’opinion, rapport de certification ou acte hors unité. |
| `missions-audit:famille:cac-suivi-mandats` · Mandats et préparation du déclaratif | U3 | Une passe sur registre de mandats fourni ; données préparées, aucun dépôt. |
| `missions-audit:famille:cac-planification-missions` · Planification des missions | Sur mesure | Planification sous contraintes et arbitrage humain : sur mesure. |
| `missions-audit:famille:cac-heures-realisees` · Heures et budgets | U7 | Temps déjà saisis et budgets, modèle agrégé ; le barème réglementaire ne devient pas du temps réalisé. |
| `missions-audit:famille:cac-acceptation-mandats` · Acceptation et maintien | U6 | Éléments déjà fournis assemblés ; indépendance et acceptation au signataire. |
| `missions-audit:famille:cac-attestations-chiffres` · Attestations de chiffres | U4 | Deux populations de chiffres/pièces ; attestation, assurance et signature exclues. |
| `missions-audit:famille:audit-legal` · Audit légal | Alias, non facturable | Aude : identifiant historique de la carte EC, détaillé par les familles CAC (AGENTS-CONTENU §5). Renvois : missions-audit:famille:cac-fec-reception, missions-audit:famille:cac-demandes-documents, missions-audit:famille:cac-revue-analytique, missions-audit:famille:cac-revue-ecritures, missions-audit:famille:cac-confirmations-audit, missions-audit:famille:cac-dossier-de-travail, missions-audit:famille:cac-rapport-certification, missions-audit:famille:cac-suivi-mandats, missions-audit:famille:cac-planification-missions, missions-audit:famille:cac-heures-realisees, missions-audit:famille:cac-acceptation-mandats, missions-audit:famille:cac-attestations-chiffres. |
| `cac-accueil:certification` · Préparer la sélection et les rapprochements | U4 | Pour le rapprochement des fichiers de paie, immobilisations ou inventaire avec la balance : une paire de populations selon U4. Les sélections et écarts de confirmation renvoient aux familles existantes, sans nouvelle ligne de consommation parce que l’accueil les redécrit. L’ensemble du bloc n’est pas vendu pour une seule U4. Renvois : missions-audit:famille:cac-revue-ecritures, missions-audit:famille:cac-confirmations-audit, missions-audit:famille:cac-revue-analytique. |
| `cac-accueil:interventions` · Préparer les comparaisons d’une intervention légale | Sur mesure | Opération d’apport/fusion/transformation : sources, comparaisons et nature de mission à cadrer. |
| `cac-accueil:sacc` · Cadrer la mécanique d’une prestation distincte | Sur mesure | Prestation distincte : périmètre et indépendance propres, pas de forfait petit travail implicite. Renvois : missions-audit:famille:cac-attestations-chiffres. |
| `cac-accueil:durabilite` · Relier un indicateur à ses pièces | Sur mesure | Indicateurs et pièces d’une mission conditionnelle : cadrage, règles et contrôles spécifiques. |
| `cac-accueil:administration` · Préparer les repères du portefeuille de mandats | Renvoi, non facturable | Échéancier/budget : mêmes travaux que les familles de mandats ; ne pas ajouter une unité parce que l’accueil les décrit. Renvois : missions-audit:famille:cac-suivi-mandats, missions-audit:famille:cac-heures-realisees, missions-audit:famille:cac-planification-missions. |

Frontière de la source : **prépare** Tester la forme des fichiers reçus ; **validation** La méthode et les paramètres de chaque sélection ; **humain** Les conclusions, l’opinion et la signature.

### Victoire · Commercial

Destination actuelle : `/agents-ia/commercial`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `commercial:t01` · Repérer les entreprises à contacter | Sur mesure | Recherche/enrichissement de prospects, territoire et sources : campagne à cadrer ; aucun contact envoyé. Robots : informations-legales-rne — Données d’identité RNE déjà acquises réutilisées ; recherche de nouvelles entreprises différente. |
| `commercial:t02` · Qualifier les demandes entrantes | U1 | Une demande entrante ou note d’appel déjà transcrite ; pas d’écoute/transcription audio implicite. |
| `commercial:t03` · Préparer le premier rendez-vous | U6 | Un prospect, pièces fournies et questionnaire existant ; recherche ouverte exclue. |
| `commercial:t04` · Chiffrer la proposition de mission | U6 | Une proposition commerciale dans le gabarit et le barème déjà recettés ; contrat/lettre de mission et choix de prix restent au cabinet. |
| `commercial:t05` · Relancer les propositions en attente | U2 | Une relance d’une proposition ; le suivi de la date ne crée pas une deuxième unité. |
| `commercial:t06` · Réunir les pièces d’entrée en relation | U6 | Un dossier d’entrée, dix documents au plus ; collecte robot déjà payée réutilisée. Robots : informations-legales-rne — Actes/statuts déjà collectés réutilisés. ; beneficiaires-effectifs — Données BE déjà collectées réutilisées ; appréciation LCB-FT reste humaine. |
| `commercial:t07` · Préparer le dossier d’appréciation du risque | U6 | Une préparation factuelle du dossier ; appréciation LCB-FT et niveau de risque au professionnel. Robots : beneficiaires-effectifs — Le même relevé et les mêmes divergences BE ne sont pas une unité IA supplémentaire. |
| `commercial:t08` · Rédiger la lettre de mission | Sur mesure | Projet de lettre de mission, acte contractuel : hors U6, cadrage sur mesure. |
| `commercial:t09` · Ouvrir le dossier dans vos outils | Sur mesure | Création dans plusieurs logiciels et reprise d’un confrère : adaptation et import spécifiques, hors petites unités. Robots : rattachement-fiscal — Adhésion/substitution fiscale déjà comprise au robot non refacturée ; ouverture dans logiciels distincte. |
| `commercial:t10` · Renouveler les lettres de mission | Sur mesure | Révision contractuelle et renouvellement de lettres : hors unités standard ; pas de signature automatique. |

Frontière de la source : **prépare** Chiffrer depuis votre barème écrit ; **validation** Chaque proposition et son prix ; **humain** L’appréciation du risque et la vigilance LCB-FT.

### Colette · Communication

Destination actuelle : `/agents-ia/communication`. 9 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `communication:t01` · Suivre l’actualité utile à vos clients | Sur mesure | Veille et recherche officielle ouvertes : sources, rythme et profondeur à cadrer ; une synthèse ne couvre pas une surveillance illimitée. |
| `communication:t02` · Rédiger la lettre d’information | U2 | Une lettre courte ≤600 mots, sujets/sources déjà retenus ; lettre longue ou recherche nouvelle sur mesure. |
| `communication:t03` · Adapter une note à un secteur | U2 | Une adaptation sectorielle courte à partir d’une note fournie ; un contexte, pas autant d’unités que de destinataires. |
| `communication:t04` · Préparer les rappels collectifs | U2 | Un rappel collectif court ; sources et échéance validées ; diffusion exclue. |
| `communication:t05` · Rédiger les publications du cabinet | U2 | Une publication courte ≤600 mots, contexte fourni ; article long sur mesure. |
| `communication:t06` · Tenir le calendrier éditorial | U3 | Une passe sur calendrier fourni ≤250 lignes ; nouvelle stratégie éditoriale exclue. |
| `communication:t07` · Préparer les invitations aux événements | U6 | Un dossier événement dans des gabarits existants ; nouveau support long/créatif ou textes distincts hors bornes à cadrer. |
| `communication:t08` · Mettre à jour la présentation du cabinet | U6 | Un lot existant de présentation à assembler/actualiser ; nouveau site, nouvelle plaquette ou rédaction longue sur mesure. |
| `communication:t09` · Lire les retours en agrégats | U5 | Retours fournis ≤2000 lignes, synthèse ≤2 pages ; aucun suivi nominatif des lecteurs. |

Frontière de la source : **prépare** Lire les sources officielles et repérer les changements ; **validation** Chaque texte avant envoi ou publication ; **humain** Le choix des sujets et la parole du cabinet.

### Émile · Relation client

Destination actuelle : `/agents-ia/relation-client`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `relation-client:t01` · Trier la boîte partagée | U1 | Un message autonome ≤5 pages, champs et priorité selon la règle ; pas toute la boîte pour une unité. Robots : messagerie-fiscale — Collecte, classement et alertes déjà compris au robot ne deviennent pas une U1 pour le même message. ; suivi-urssaf — Même exclusion pour les messages URSSAF déjà couverts. |
| `relation-client:t02` · Relier chaque demande à son dossier | U1 | Un message rattaché au dossier ; si déjà classé dans le même traitement, pas de seconde U1. |
| `relation-client:t03` · Préparer les réponses courantes | U2 | Une réponse courte, contexte fourni ; envoi au cabinet. |
| `relation-client:t04` · Accuser réception et classer les pièces | U1 | Une pièce reçue nommée/rattachée ; accusé type fixe intégré au même travail ; réponse libre distincte seulement si demandée. Robots : messagerie-fiscale — La même pièce jointe fiscale classée par le robot n’est pas retraitée/facturée. ; suivi-urssaf — Pièces jointes déjà classées au titre du robot URSSAF réutilisées. |
| `relation-client:t05` · Rattacher le courrier numérisé | U1 | Un courrier scanné lisible ≤5 pages ; pas de montant extrapolé. |
| `relation-client:t06` · Suivre les demandes en attente | U3 | Une passe sur l’état des demandes ≤250 lignes, règles de délai fournies. |
| `relation-client:t07` · Suivre les envois périodiques | U3 | Une passe sur le registre d’envoi ≤250 lignes ; aucune remise automatique. Robots : attestation-fiscale — Attestation déjà demandée, collectée et suivie par le robot : aucun nouveau coût pour cette collecte. ; attestation-sociale — Même règle pour les attestations sociales ; la remise reste validée. |
| `relation-client:t08` · Préparer les rendez-vous clients | U6 | Un dossier de rendez-vous depuis les pièces fournies ; invitation type et ordre du jour intégrés, réservation humaine. |
| `relation-client:t09` · Préparer la fin de mission et le transfert | U6 | Un dossier de transfert et sa liste de pièces ; exports techniques, révocations et remise exclus. |
| `relation-client:t10` · Recueillir l’avis des clients | U5 | Réponses déjà recueillies et questionnaire existant ; synthèse agrégée ; déploiement de la collecte sur mesure. |

Frontière de la source : **prépare** Trier, relier au dossier et prioriser ; **validation** Chaque réponse avant envoi ; **humain** Toute réponse qui engage le cabinet ou donne un conseil.

### Honoré · Gestion du cabinet

Destination actuelle : `/agents-ia/gestion-cabinet`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `gestion-cabinet:t01` · Préparer la facturation du mois | U3 | Un relevé d’actes/facturation ≤250 lignes et 10 règles ; application d’un barème existant, aucune émission sans accord. |
| `gestion-cabinet:t02` · Réviser les honoraires | U3 | Une passe sur les clauses et montants structurés fournis ; aucune interprétation ou rédaction contractuelle. |
| `gestion-cabinet:t03` · Constituer les lots de prélèvement | U3 | Un lot déjà structuré ; contrôle des références et mandats ; transformation SEPA, signature et ordre de paiement exclus. |
| `gestion-cabinet:t04` · Traiter les rejets de prélèvement | U1 | Un relevé de rejet rattaché au dossier ; échéancier nouveau ou négociation exclus. |
| `gestion-cabinet:t05` · Rapprocher les encaissements | U4 | Règlements/factures bornés ; une nouvelle projection de trésorerie n’est pas incluse dans le même rapprochement. |
| `gestion-cabinet:t06` · Relancer les impayés | U2 | Une relance au bon stade ; suspension de mission et envoi restent à l’associé. |
| `gestion-cabinet:t07` · Mesurer la rentabilité par dossier | U7 | Une entité cabinet, une période ; marge par dossier depuis temps déjà saisis, agrégats, sans classement des salariés. |
| `gestion-cabinet:t08` · Suivre les dossiers par état | U3 | Une passe d’état ≤250 lignes ; connecteurs et collecte déjà configurés. |
| `gestion-cabinet:t09` · Tenir le tableau de bord de production | U7 | Un reporting de production agrégé, modèle existant ; pas de tableau individuel. |
| `gestion-cabinet:t10` · Préparer le plan de charge | Sur mesure | Répartition et arbitrage de charge au-delà d’indicateurs : règles, contraintes et intervention du cabinet à cadrer. |

Frontière de la source : **prépare** Rapprocher actes, relevés et barèmes ; **validation** Chaque facture ; **humain** Toute appréciation d’un collaborateur.

### Raphaël · RH du cabinet

Destination actuelle : `/agents-ia/rh-cabinet`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `rh-cabinet:t01` · Préparer un recrutement | U2 | Une annonce courte à partir d’une fiche de poste fournie ; nouvelle définition de poste ou campagne multi-canaux sur mesure. |
| `rh-cabinet:t02` · Organiser les candidatures | U6 | Un dossier candidat sans classement ni notation ; invitation type existante ; choix et entretiens au responsable. |
| `rh-cabinet:t03` · Préparer l’arrivée d’un collaborateur | Sur mesure | Contrat, DPAE, mutuelle et accès : tâche composite réglementée et technique à cadrer. |
| `rh-cabinet:t04` · Préparer un départ | Sur mesure | Documents de départ et révocations : tâche composite, actes/droits d’administration hors barème. |
| `rh-cabinet:t05` · Préparer les entretiens annuels et professionnels | U6 | Un dossier d’entretien dans une trame existante ; aucun avis sur la personne ni appréciation de performance. |
| `rh-cabinet:t06` · Rassembler les demandes de congés | U3 | Demandes/soldes déjà exportés, contrôle de cohérence borné ; accord du responsable requis. |
| `rh-cabinet:t07` · Suivre la formation continue | U3 | Un registre de formation ≤250 lignes, pièces fournies ; contrôle de règle existante, pas de certification de conformité. |
| `rh-cabinet:t08` · Tenir la preuve de formation à l’IA | U3 | Un registre de formations IA fourni ; aucune formation créée ou dispensée dans cette unité. |
| `rh-cabinet:t09` · Produire la synthèse annuelle de rémunération | U7 | Une restitution salarié/année depuis la paie tenue, modèle existant ; autorisations RH et remise au cabinet. |
| `rh-cabinet:t10` · Préparer les indicateurs sociaux | U7 | Cabinet/période, indicateurs selon le modèle validé ; nouvel index/règle de droit et mise à jour de barème sur mesure. |

Frontière de la source : **prépare** Rassembler depuis la paie tenue et vos modèles ; **validation** Chaque document remis à un salarié ou à un candidat ; **humain** Toute appréciation sur une personne.

### Octavie · Informatique et outils

Destination actuelle : `/integrations`. 9 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `informatique-outils:famille:integration-connecteurs` · Connecteurs, imports et synchronisation | Sur mesure | Nouveau connecteur, synchronisation ou adaptation : mise en service/sur mesure, pas unité de consommation IA. |
| `informatique-outils:famille:exports-imports-logiciels` · Exports et imports des logiciels | Sur mesure | Préparation d’import et contrôle de schéma/idempotence : traitement technique configuré et devis distinct. |
| `informatique-outils:famille:excel-classeurs-suivi` · Classeurs de suivi Excel | Sur mesure | Création/maintenance de classeur et dictionnaire : adaptation de l’environnement, pas unité IA générique. |
| `informatique-outils:famille:comptes-acces` · Comptes et droits d’accès | U3 | Un inventaire fourni, règles de droits prévalidées ; aucune création/révocation de droit par l’agent. Robots : habilitations-fiscales — Inventaire EDI/EFI du robot réutilisé ; droits d’autres logiciels distincts. |
| `informatique-outils:famille:sauvegardes-mises-a-jour` · Sauvegardes et mises à jour | U1 | Un rapport de sauvegarde lisible ; installer une mise à jour, tester la restauration ou surveiller en continu est hors unité. |
| `informatique-outils:famille:support-outils` · Support des outils | U2 | Une réponse courte tirée d’une procédure fournie ; intervention d’administration et diagnostic nouveau sur mesure. |
| `informatique-outils:famille:migrations-reprises` · Migrations et reprises de données | Sur mesure | Reprise d’historiques et rapprochement avant/après : chantier sur mesure avec recette, hors petits travaux. |
| `informatique-outils:famille:inventaire-outils` · Inventaire des outils et des usages d’IA | U3 | Un inventaire structuré fourni ; collecte exhaustive des postes et audit de sécurité sur mesure. |
| `informatique-outils:famille:complements-excel` · Compléments greffés sur Excel | Alias, non facturable | Octavie : son libellé « Compléments greffés sur Excel » ne sort sur aucune page (charte §9). Renvois : informatique-outils:famille:excel-classeurs-suivi. |

Frontière de la source : **prépare** Préparer fichiers d’import, listes d’accès et réponses de support ; **validation** Chaque import avant intégration ; **humain** Les droits d’administration et la sécurité.

### Prudence · Protection des données

Destination actuelle : `/agents-ia/protection-donnees`. 10 éléments source couverts.

| Identifiant / geste exact | Unité ou statut | Périmètre et anti-doublon |
|---|---|---|
| `protection-donnees:t01` · Préparer la mise à jour du registre des traitements | U3 | Une passe sur registre fourni ≤250 lignes, dix critères ; collecte dans des outils non configurés exclue. |
| `protection-donnees:t02` · Préparer la réponse à une demande d’accès | U6 | Un dossier de demande depuis les exports autorisés ; identité vérifiée humainement et réponse approuvée ; recherche exhaustive multi-outils non bornée exclue. |
| `protection-donnees:t03` · Préparer les autres demandes de droits | U6 | Un dossier de droit depuis les données fournies ; décision sur conservation/effacement et exécution exclues. |
| `protection-donnees:t04` · Revoir les contrats de sous-traitance | U3 | Un contrat représenté en ≤250 lignes et dix critères prévalidés ; repérage de clauses, aucune appréciation juridique définitive. |
| `protection-donnees:t05` · Suivre les durées de conservation | U3 | Un inventaire fourni, règle de durée validée ; suppression et archivage non déclenchés. |
| `protection-donnees:t06` · Préparer le dossier d’un incident | U6 | Un dossier factuel d’incident et trame existante ; qualification, notification et communication humaines. |
| `protection-donnees:t07` · Préparer l’analyse d’impact | Sur mesure | Analyse d’impact : appréciation des risques, cadrage et rédaction spécifique ; pas une simple synthèse facturée en U5. |
| `protection-donnees:t08` · Préparer les mentions d’information | U2 | Une mention courte ≤600 mots dans un contexte fourni ; validation juridique requise ; politique longue ou nouveau cadre sur mesure. |
| `protection-donnees:t09` · Préparer une copie pseudonymisée | Sur mesure | Routine couverte par le robot Anonymisation selon son périmètre ; aucune consommation IA supplémentaire pour la même copie. Besoin hors robot sur mesure. Robots : anonymisation-documents — La copie masquée/pseudonymisée et les exceptions du robot ne génèrent aucune unité agent supplémentaire. |
| `protection-donnees:t10` · Suivre les obligations liées à l’IA | U6 | Un dossier d’outils et obligations depuis sources datées fournies ; recherche juridique ouverte et appréciation de conformité exclues. |

Frontière de la source : **prépare** Inventorier traitements, outils et sous-traitants ; **validation** Chaque réponse à une personne concernée ; **humain** La décision du responsable de traitement et de la personne qu’il a désignée.

## Recoupement avec les 21 robots

Tous les identifiants ci-dessous sont chargés depuis `ROBOTS`, sans inventer d’offre supplémentaire. Un lien indique un réemploi d’entrée ou une sortie identique/partielle, pas un second prix. Le détail du recoupement se trouve dans chaque ligne JSON `robots_proches`.

| Robot | Travaux agents rapprochés |
|---|---|
| `cfe` · Collecte CFE | `juridique-fiscal:t04` |
| `taxes-foncieres` · Collecte des taxes foncières | Aucune équivalence explicite avec une tâche agent actuelle identifiée ; conserver le prix/périmètre robot autonome. |
| `suivi-urssaf` · Suivi URSSAF | `paie-social:t04`, `paie-social:t06`, `paie-social:t07`, `relation-client:t01`, `relation-client:t04` |
| `dette-fiscale` · Suivi des dettes fiscales | Aucune équivalence explicite avec une tâche agent actuelle identifiée ; conserver le prix/périmètre robot autonome. |
| `suivi-declarations-fiscales` · Suivi des déclarations fiscales | `juridique-fiscal:t05`, `juridique-fiscal:t06` |
| `habilitations-fiscales` · Habilitations fiscales | `informatique-outils:famille:comptes-acces` |
| `rattachement-fiscal` · Rattachement fiscal | `commercial:t09` |
| `informations-legales-rne` · Informations légales et RNE | `juridique-fiscal:t08`, `juridique-fiscal:t10`, `commercial:t01`, `commercial:t06` |
| `messagerie-fiscale` · Messagerie fiscale | `relation-client:t01`, `relation-client:t04` |
| `veille-bodacc` · Veille BODACC | `juridique-fiscal:t10` |
| `annuaire-facturation-electronique` · Annuaire de facturation électronique | `comptabilite:t03` |
| `attestation-fiscale` · Attestation de régularité fiscale | `relation-client:t07` |
| `attestation-sociale` · Attestations URSSAF | `relation-client:t07` |
| `fiches-dgfip-facturation-electronique` · Fiches DGFiP par dossier | Aucune équivalence explicite avec une tâche agent actuelle identifiée ; conserver le prix/périmètre robot autonome. |
| `mandats-plateforme-agreee` · Mandats de plateforme agréée | Aucune équivalence explicite avec une tâche agent actuelle identifiée ; conserver le prix/périmètre robot autonome. |
| `beneficiaires-effectifs` · Bénéficiaires effectifs | `juridique-fiscal:t10`, `commercial:t06`, `commercial:t07` |
| `anonymisation-documents` · Anonymisation de documents | `protection-donnees:t09` |
| `tableaux-de-bord-fec` · Tableaux de bord à partir du FEC | `finance:t01`, `finance:t02`, `finance:t03`, `finance:t04`, `finance:t05` |
| `collecte-ir` · Collecte IR | Aucune équivalence explicite avec une tâche agent actuelle identifiée ; conserver le prix/périmètre robot autonome. |
| `collecte-ifi` · Collecte IFI | Aucune équivalence explicite avec une tâche agent actuelle identifiée ; conserver le prix/périmètre robot autonome. |
| `situation-tva` · Situation TVA | `juridique-fiscal:t01` |

Exemples qui évitent une fausse équivalence : la **Situation TVA** lit l’avis et le solde, Grégoire prépare une déclaration ; l’**Annuaire de facturation électronique** lit un rattachement, Balthazar rapproche des factures ; une **attestation sociale** n’est pas une DPAE ni un document de départ. À l’inverse, le même tableau FEC et ses commentaires ou la même copie pseudonymisée ne sont jamais vendus deux fois parce qu’un agent les présente.

## Résultat des contrôles

- **PASS : 12 agents, 128 éléments, 88 familles titulaires, 12 démonstrations reliées, 21 robots et 8 unités.**
- 0 élément sans affectation, 0 identifiant dupliqué, 0 référence robot inconnue et 0 famille titulaire oubliée.
- Statuts : 94 versions bornées conditionnelles ; 31 sur mesure ; 2 alias et 1 renvoi non facturables.
- Les limites légales, accès, validations et conditions d’arrêt viennent des données existantes et restent conservées dans le JSON. Aucun accès à un espace client réel, aucune API payante et aucune communication externe.

Les familles de taxonomie portant `active: false` restent signalées dans le JSON ; cet état éditorial ne sert pas de badge de disponibilité. Ni les unités proposées ni cette matrice ne remplacent une recette produit ou la validation par le cabinet.

## Reproductibilité

Instantané du code : `218dcdd0b0ae8a75f0455f31d8aa4074fe4dca14`. Import réel par Node avec décapage des types : `src/data/specialistes.ts`, `src/data/familles.ts`, `src/data/robots.ts`, `src/data/accueil/cac.ts`. Les fichiers des spécialistes et la page CAC sont empreintés. Les assertions vérifient les cardinalités et chaque famille de chaque agent ; aucune recherche par mot-clé seule ne déduit la couverture.

Le JSON voisin `COUVERTURE-TRAVAUX.json` est la matrice complète exploitable : `agents`, `unites`, `couverture`, `robots`, `sources`, `controle_calcule`. Les prix sont volontairement absents : le barème financier consolidé fait autorité dans `bareme-agents.json` et sa présentation `GRILLE-AGENTS.md`. `ECONOMIE-AGENTS.md` reste l’étude intermédiaire.
