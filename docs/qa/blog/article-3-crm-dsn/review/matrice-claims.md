# Matrice de vérification — BLOG-A3, 33 claims

Carte `t_46ed91b5`, 16 septembre 2026. Chaque claim officiel a été rapproché d'un passage de sa source, rechargée le jour de la revue sans réutiliser les extractions du producteur.

## Sources rechargées

| ID | Source | HTTP | Contrôle |
|---|---|---:|---|
| S1 | Net-entreprises, retours après dépôt DSN | 200 | passages AEE, ARE, CCO, BAN, contrôles bloquants et non bloquants retrouvés |
| S2 | Net-entreprises, les comptes rendus métier DSN | 200 | définition, intégration et cohérence, tableau des organismes retrouvés |
| S3 | Net-entreprises, fiabilisation des données DSN | 200 | consultation mensuelle, organisme contre éditeur, annule et remplace, CRM normalisés retrouvés |
| S4 | Net-entreprises, outils Dsn-Val | 200 | test avant dépôt, cahier technique et JMN retrouvés |
| S5 | Cahier technique DSN 2026.1, PDF 382 pages | 200 | section 1.4.1.5 lue page 13 |

## Claims officiels

| ID | Objet | Source | Verdict |
|---|---|---|---|
| V01 | CRM, rapport de l'organisme sur erreur ou suspicion d'erreur | S2 | CONFIRMÉ |
| V02 | Chaque organisme intègre les éléments et vérifie la cohérence | S2 | CONFIRMÉ |
| V03 | Chaque organisme destinataire met un retour à disposition | S2 | CONFIRMÉ |
| V04 | Les anomalies des CRM doivent être prises en compte | S2 | CONFIRMÉ |
| V05 | Appellations : synthèse, notification, bilan de traitement, BIS, CID, CRM nominatif, CRM financier | S2 | CONFIRMÉ |
| V06 | AEE, dépôt enregistré et contrôles suivants possibles | S1 | CONFIRMÉ |
| V07 | ARE, conditions techniques d'acceptation non remplies | S1 | CONFIRMÉ |
| V08 | Le CCO libère des obligations déclaratives de transmission | S1 | CONFIRMÉ, restitué plus prudemment dans l'article |
| V09 | Les retours des organismes restent à vérifier après le CCO | S1 | CONFIRMÉ |
| V10 | BAN, une ou plusieurs anomalies et invalidité de la déclaration | S1 | CONFIRMÉ |
| V11 | Une DSN peut être acceptée avec CCO et porter un BAN | S1 | CONFIRMÉ |
| V12 | Contrôles bloquants avec rejet, non bloquants avec acceptation | S1 | CONFIRMÉ |
| V13 | Le certificat précise la conformité à la norme d'échange | S5 p.13 | CONFIRMÉ |
| V14 | Le compte rendu du certificat ne préjuge pas des demandes de rectification | S5 p.13 | CONFIRMÉ, voir O1 du rapport |
| V15 | Dsn-Val teste le fichier avant dépôt | S4 | CONFIRMÉ |
| V16 | Les contrôles portent sur le cahier technique et le JMN | S4 | CONFIRMÉ |
| V17 | Consulter chaque mois les CRM et retours après dépôt | S3 | CONFIRMÉ |
| V18 | L'organisme explique le retour métier, l'éditeur accompagne le logiciel | S3 | CONFIRMÉ |
| V19 | Annule et remplace avant minuit la veille de l'échéance, sinon mois suivant | S3 | CONFIRMÉ, borné à la DSN mensuelle dans l'article |
| V20 | CRM normalisés mensuels mis en place par les Urssaf et les caisses MSA | S3 | CONFIRMÉ |
| V21 | Le mot CRM ne suffit pas à connaître la portée d'un retour | S2 | SYNTHÈSE BORNÉE, soutenue par la diversité du tableau officiel |

Total : 21 claims officiels, 21 confirmés, 0 non soutenu, 0 périmé.

## Méthode Memlia et cas de test

| ID | Objet | Statut |
|---|---|---|
| M01 | Commencer par émetteur, type, déclaration, période, population | MÉTHODE, étiquetée dans le corps |
| M02 | Conserver « qualification à confirmer » quand la source ne statue pas | MÉTHODE |
| M03 | États internes expliqué, à corriger, à arbitrer | MÉTHODE, distinguée des statuts du CRM |
| M04 | Documenter retour, donnée, preuve, qualification, décision, auteur, date, canal | MÉTHODE |
| M05 | Fermer sur le résultat du contrôle suivant | MÉTHODE |
| M06 | Le registre sépare message reçu et décision humaine | MÉTHODE |
| M07 | La vue agrégée ne classe pas les gestionnaires | MÉTHODE, conforme à la règle anti-surveillance |
| M08 | L'automatisation rassemble, rapproche et s'arrête si la règle manque | MÉTHODE, voir O3 du rapport |
| M09 | Scénarios D-027, D-031, D-044, D-052 | FICTIF, déclaré comme tel dans le corps |
| M10 | Un registre partagé ne recopie pas le détail nominatif | MÉTHODE, conforme au RGPD affiché |
| M11 | Cinq sources vérifiées le 15 septembre 2026 | PREUVE ÉDITORIALE, revérifiée le 16 septembre |
| M12 | Les libellés varient selon version, portail, organisme ou logiciel | SYNTHÈSE BORNÉE |

Total : 12 entrées non officielles, toutes étiquetées comme méthode, synthèse bornée, preuve éditoriale ou cas fictif. Aucune n'est présentée comme une règle réglementaire.

## Témoins négatifs rejoués

Les sept mutations de `tests/proof/test_article_3_contract.py` rougissent quand on injecte le défaut : source primaire absente, date de consultation périmée, claim sans citation dans le corps, auteur autre que Kevin Kitanga, attestation fabriquée, canonical altéré, lien interne vers une route 404. Les mutations sont appliquées en mémoire ; aucun fichier de production n'est modifié.
