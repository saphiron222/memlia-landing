PASS — aucun défaut matériel bloquant relevé dans la recette de service dossier-travail-cac.

# Revue métier indépendante

- Date : 2026-10-06. Relecteur : `metier-independent` (revue documentaire IA, sans qualité de CAC ni certification juridique).
- Périmètre : `recette.json`, `corps.md`, `rejouer.mjs`, `preuves/rejeu.json`, `preuves/sources.json` et passages exacts des copies H2A `nep230.html` / `nep315.html`.
- Référentiels : grille `/Users/kevinkitanga/hermes/recherche/audit-legal-revue.md`, § 5 ; charte v5 approuvée du workspace `t_c5695136` (PR107 non fusionnée).
- Une seule revue indépendante ; ni réécriture du candidat, ni QA supplémentaire, ni publication, ni clôture de carte.

## Motifs du verdict

| Point de grille | Résultat et justification |
|---|---|
| 1. Population et mission | Satisfait. Équipe de commissariat aux comptes ; assistance documentaire bornée à l’index et aux renvois. Aucune règle de nomination, de seuil ou de régime universalisée. |
| 2. Sources, version et calendrier | Satisfait. Sources institutionnelles exactes lues dans les copies conservées : NEP 230, arrêté 28/12/2023, JO 31/12/2023, A.821-66 ; NEP 315 révisée, arrêté 13/11/2024, JO 19/11/2024, A.821-72, application aux exercices ouverts dès publication. Les empreintes SHA-256 calculées correspondent à `sources.json`. La citation NEP 230 § 08 est exacte. |
| 3. Titre, opinion et responsabilité | Satisfait. Frontière à trois colonnes (`corps.md`, lignes 11–17), puis lignes 40–44 : choix des diligences, appréciation des éléments, conclusions, revue, opinion et signature restent professionnels. L’index ne prouve ni pertinence, ni caractère probant, ni suffisance des diligences. |
| 4. Indépendance et autorévision | Hors champ motivé. Aucun cumul production comptable/audit des mêmes comptes ni mutualisation EC/CAC vendu comme compatible. L’assistance de référencement ne prétend pas régler l’indépendance du cabinet. |
| 5. Secret et données | Satisfait pour la proposition commerciale. Jeu exclusivement fictif ; formats, droits et accès vérifiés avant engagement. Données, flux éventuels vers IA tierce, destinataires, support et conservation sont à expliciter au devis (lignes 48–50). Aucune localité, absence de transfert ou confidentialité universelle revendiquée. Architecture réelle non attestée. |
| 6. Méthode et reproductibilité | Satisfait dans le périmètre démontré. Six cas fictifs avec attendus, sorties et assertions de conservation et de non-mutation. La fiche outil est un support Memlia volontaire, non un modèle normatif. La NEP 315 § 14 distingue documentation et outils analytiques ; §§ 46/48 d) ne sont invoqués que pour identification/évaluation des risques (lignes 38 et 58). |
| 7. Diligences et exceptions | Satisfait. Références absentes/dupliquées bloquées, orphelins non affectés par invention, conflits soumis à validation, verrouillage respecté. Aucune procédure d’audit ou décision automatique déduite de ces contrôles. Le complément NEP 230 § 10 entre signature et approbation reste explicitement au CAC, hors régénération ordinaire. |
| 8. Documentation et réversibilité | Satisfait pour la recette proposée. Contributions, auteurs et dates fournis préservés ; aucune invention de métadonnées. Journal des versions et reprise antérieure sont des livrables/critères de recette à réaliser dans les outils du cabinet, non une restauration physique prétendument testée. Le service s’arrête au signé/clôturé : borne volontaire plus restrictive, pas négation des modifications de forme/classement permises par NEP 230 § 09. Aucun archivage conforme garanti. |
| 9. LCB-FT et durabilité | Hors champ motivé. Aucune décision TRACFIN, vigilance ou obligation de durabilité annoncée. |
| 10. Preuve commerciale et compréhension | Satisfait. Convention sur jeu fictif explicitement distinguée d’une intégration déjà livrée (ligne 23). Aucun gain chiffré, donnée réelle, agrément ou statut de conformité NEP/H2A. Service maintenu, périmètre et prix définis au devis. |

## Exécution vérifiée

Commande exécutée depuis le site :

```sh
node commercial/recettes/dossier-travail-cac/rejouer.mjs --check
```

Code de sortie : `0`.

```text
6 cas PASS ; contributions conservées ; entrées inchangées ; résultats reproductibles.
```

Le mode `--check` confirme également l’égalité exacte du résultat avec `preuves/rejeu.json`, sans réécrire cette preuve. Les cas sont : référence absente, doublon, pièce orpheline, contributions concurrentes, renvoi unique en attente de validation et dossier verrouillé. Le conflit conserve les deux commentaires avec leurs auteurs/dates ; le dossier verrouillé ne produit aucun renvoi.

## Sources exactes et intégrité

- [H2A, NEP 230](https://h2a-france.org/normes/documentation-de-laudit-des-comptes/) : copie `nep230.html`, lignes 576–605 ; §§ 04–06, 08–10 relus, notamment identité/date, revue éventuelle et complément post-signature.
  SHA-256 : `77ab2afdf9a878d3793227323a1f68baff4e6799bb571278ac0f592ac754040e`.
- [H2A, NEP 315 révisée](https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/) : copie `nep315.html`, lignes 576–577, 613 et 739–758 ; § 14 et §§ 46/48 d) relus intégralement dans leur contexte pertinent.
  SHA-256 : `d43cb7c3ac35bc46a041a9518b5b317318e4ecbbe626a93c7e4ede3b707f8fac`.

Lecture des copies primaires déjà ouvertes le 06/10/2026 selon `sources.json` ; aucun nouveau téléchargement ou accès direct à Légifrance n’est revendiqué.

## Défauts matériels et inconnues

Défaut matériel : aucun. Aucune correction du corps demandée.

Limites explicites, non bloquantes pour ce candidat commercial : aucune intégration client, restauration physique, persistance de versions, vérification réseau, contrôle effectif des droits ou détection du statut signé/clôturé dans un outil réel n’a été éprouvée. Le rejeu teste une convention en mémoire et un drapeau de verrouillage. Ces éléments restent à recetter avant activation, comme l’indique le candidat ; le PASS ne certifie ni le dossier d’audit, ni une intégration, ni le respect du secret dans un déploiement réel.

Incident d’exécution : une extraction auxiliaire Python via `execute_code` a été refusée par le mode non supervisé ; lecture directe des passages et calcul des empreintes par terminal réalisés ensuite. Aucun blocage restant pour la revue.
