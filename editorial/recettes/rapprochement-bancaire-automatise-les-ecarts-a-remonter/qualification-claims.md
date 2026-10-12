# Qualification auteur des affirmations, 12/10/2026

Ce document n’est pas une revue indépendante. Il sépare les citations officielles, les paramètres de démonstration et les résultats exécutés. Aucun score ni approbation métier attribué par l’auteur.

| Affirmation dans le corps | Support ouvert ou exécuté | Portée exacte |
|---|---|---|
| L’ANC publie le plan de comptes version1erjanvier2026 | anc-plan, copie fraîche de la forge sous editorial/articles/.../preuves/sources/anc-plan.source.txt | L’extrait exact établit l’existence et la version du document, pas la clé ni ses refus. |
| Le compte512 est le compte bancaire de l’exemple | anc-plan-comptes-2026.pdf, téléchargé réellement HTTP200 ; provenance séparée anc-pdf-provenance.json | Page10/18 : «512 Banques», «5121 Comptes en euros», «5124 Comptes en devises». La page HTML ne porte pas ces numéros : le PDF complémentaire est indispensable, et ne justifie pas à lui seul la conversion de signes de la méthode. |
| Définition de donnée personnelle | cnil-definition, copie fraîche de la forge | Citation exacte «toute information se rapportant à une personne physique identifiée ou identifiable» ; aucun élargissement à toutes les coordonnées d’entreprise. |
| Minimisation | cnil-principes, article5§1c | Citation «adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées». Pas de conformité garantie déduite. |
| Sécurité appropriée | cnil-principes, article5§1f | Citation exacte ; aucun hébergement, certification ou sécurité absolue revendiqué. |
| La clé exige compte, devise, signe normalisé, montant et référence | oracle.mjs lignes11à34, jeu-fictif.json | Convention locale, pas norme ANC. Conversion d’un crédit de relevé et d’un débit comptable en entrée d’argent. Référence non vide et candidat unique. |
| RB-01 propose R-01/J-01, V-041,125,00€ | oracle.mjs --write-proof, preuve-rejeu.json | Proposition, jamais validation ni écriture générée. Les deux sources ouvrent à1000€ et ferment à1125€. |
| RB-02 laisse J-02,80,00€, en transit possible | mêmes fichiers | Relevé1000€, journal1080€, entrée comptable sans paire. Cause non confirmée ; consulter le relevé suivant. |
| RB-03 refuse deux candidats | mêmes fichiers | R-03 face à J-03/J-04,50€ chacun, référenceV-043. Refus du cas entier ; aucune paire choisie. Relevé1050€, journal1100€. |
| RB-04 refuse ouverture absente | mêmes fichiers | ouverture du relevé null ; motif exact «solde d’ouverture du relevé manquant». |
| Conservation des originaux/décisions et reprise d’un reliquat | Consignes de méthode et de conception, charte v5 | Pas attestées comme capacités de ce programme. Le corps distingue ces consignes des quatre résultats et exige les essais correspondants avant livraison. |
| Préparation et maintenance de la tâche Memlia | Charte v5 et méthode publiée | Offre de service avec périmètre défini et recette équipe ; aucun éditeur remplacé ou compatibilité universelle revendiqués. |

Les trois pages officielles ont été ouvertes par la forge dans cette session. Le PDF ANC a une preuve réseau indépendante ; il n’est pas prétendu extrait par le vérificateur HTML de la forge. Le relecteur lit également son texte réel. Aucun claim ne transforme le titre du lien ANC en preuve des numéros512/5121.

Le prototype historique rejouer-v0.mjs est archivé : il réécrivait les attendus et ne normalisait pas les signes. L’entrée actuelle rejouer.mjs importe oracle.mjs ; seuls jeu-fictif.json → oracle.mjs → comparaison stricte à rejeu.json → preuve-rejeu.json constituent le rejeu courant. Les quatre cas ont été réellement exécutés. Ni audit exhaustif, ni qualification des imports PDF/CSV, ni test de toutes les branches de l’oracle n’en sont déduits.
