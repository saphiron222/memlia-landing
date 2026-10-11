PASS — F1 levé sur le paquet corrigé des dix termes du lot CAC 2.

Revue indépendante du 12 octobre 2026 (heure de Paris), carte t_135675b2, profil metier, agent IA sans qualification professionnelle humaine. Réexamen limité à F1 et au critère de fini ; le fond inchangé conserve sa revue du 11 octobre. Aucune modification du candidat ni des fichiers globaux, aucune publication.

## Candidat

Paquet canonique : corrected/docs/strategy/site-v3/glossaire-cac-lot-2.json, auteur initial t_b084bb7e, correction auteur t_b92f3e26. Les dix entrées publiques, huit sources, dates et copies sont inchangées. Le paquet initial correspond à celui jugé dans prior/PREUVE.json ; seize fichiers de copies comparés octet pour octet à l’archive initiale.

Les 18 couples signalés concernaient 13 champs. L’auteur remplace leurs 32 lignes, y compris les lignes compagnes composites, par 36 sous-claims. Le contrôle indépendant démontre leur couverture intégrale des champs publics ; 51 autres lignes sont identiques et leurs avis acquis sont reportés à la date initiale. Résultat : 87 avis, dont 66 couples normatifs et 21 unités de méthode/vocabulaire.

## F1 — preuves de levée

- Assertions : définition NEP 500 §03 / A.821-74 §3 et NEP 315 §05 distincte du rôle des travaux. Liste NEP 500 §09 / A.821-74 §9 distincte des assertions pertinentes NEP 315 §06. Confusion rattachée à §§05/17 plutôt qu’à §§06/17 seuls. La phrase sur le rôle des assertions est une explication pédagogique des critères et procédures, lue dans l’ensemble NEP 315 §§05/17/18/21, non une citation littérale.
- Anomalie significative : définition et cumul NEP 200 §04 distincts du montant, de la nature, des circonstances et du jugement de NEP 320 §§09/10. Cumul seul également corroboré par NEP 320 §04 ; point-virgule public couvert.
- Risque inhérent : composantes et absence de prise en compte des contrôles NEP 200 §11 distinctes des facteurs et de l’évaluation NEP 315 §§02/39/40 ; aucun niveau automatiquement attribué.
- Risque lié au contrôle : définition NEP 200 §11 / NEP 315 §02 ; conception/mise en œuvre distinctes des tests NEP 315 §§34/41 ; conséquence de l’absence de tests isolée au §41. Risque de l’entité distinct de non-détection de la mission, NEP 200 §§11/12.
- IPE : convention lexicale professionnelle isolée, sans prétendre que les NEP définissent cet acronyme ni lui donner une portée normative autonome. Fiabilité et exactitude/exhaustivité NEP 500 §§05–07 / A.821-74 §§5–7 distinctes des informations intégrées aux outils NEP 315 §46. Export ou rapprochement n’est pas une dispense de diligence ni une garantie de caractère probant.

Chaque avis, motif et date figure dans lot-review.json ; chaque couple sensible est repris dans business-review.json. Les sources soutiennent désormais le sous-claim associé, pas toutes les propositions d’un champ composite. Aucun défaut F1 restant.

## Vérifications exécutées

Origin/main récupéré : b896a3a37f6a4fbf902d7889fdaf184711d6c573. Charte, architecture CAC, resource-metier-evidence et resource-metier-v3 lus sur cette base.

- Validateur auteur PASS : 10 entrées, 8 sources, 87 unités, 2 liens attestés, 55 ancres existantes préservées.
- verify-f1.py PASS : 18 localisations, 13 champs, 36 sous-claims, 51 lignes inchangées, 16 copies. Trois réintroductions ciblées de F1 refusées.
- Six mutations auteur spécifiques et sept initiales refusées ; cinq tests DILA source-copy sur main frais PASS.
- Sous-contrat Ressources validateClaims et fonction native de liaison du sujet PASS : zéro erreur sur 50 champs, 87 claims, 213 citations, 9 sources (8 officielles + méthode Memlia). Six mutations de preuve refusées. Ce n’est pas un manifeste global publiable.
- Ouvertures indépendantes des quatre H2A du 11 octobre conservées dans prior/sources/independent-access.json ; copies corrigées identiques aux textes relus. Aucune nouvelle ouverture HTTP ni certification de consolidation revendiquée ici.

Note de livraison, non nouveau FAIL : f1.test.mjs annoncé dans CORRECTIONS-F1.md manque dans l’archive. Node lancé avec plusieurs chemins n’a exécuté que les six mutations ; le lancement ciblé seul confirme l’absence. Les trois tests positifs auteur ne sont donc pas revendiqués comme rejoués. Leur objectif de couverture/localisation est effectivement vérifié par verify-f1.py et ses trois réintroductions négatives, livrés ici. La conclusion ne dépend pas du script manquant.

## Classification des sources

H2A : pages institutionnelles reproduisant les NEP et attestant homologations/articles ; pas caution d’un outil Memlia. DILA A4 : textes LEGI locaux issus du dérivé DINUM, provenance/version tracées, sans ouverture Légifrance revendiquée. Méthode Memlia : exemples fictifs, frontières et convention lexicale professionnelle, sans portée réglementaire autonome.

## Limites et transmission

Réserve A4 maintenue : collecte originale du 6 octobre à Paris, sans garantie de consolidation générale à jour ni comparaison actuelle avec Légifrance. Les copies ne se redatent pas ; renouveler par la voie autorisée si la fenêtre de préparation DILA n’est plus satisfaite. Une date seule ne déclenche pas une nouvelle revue générale du fond.

NEP 315 révisée : missions de certification relatives aux exercices ouverts à compter du JO du 19 novembre 2024 ; condition conservée. Signification distincte de planification ; paramètres, risque, diligences et conclusions décidés par le CAC. Sécurité/produit, restauration, CI globale et production non audités.

L’intégrateur t_c7724c9d consomme le paquet corrigé, pas l’original historique ; conserve les 87 avis, motifs et dates ; remappe les chemins et reconstruit seulement l’enveloppe de la livraison groupée avec les bibliothèques Ressources. Canonical /glossaire et ancres ipe-audit/seuil-planification-audit préservés ; liens différés non promus sans livraison attestée. Construction, CI, sceaux et preuve de production restent à l’intégrateur. Le PASS couvre ce paquet, pas un outil autonome ni une garantie de conformité NEP.
