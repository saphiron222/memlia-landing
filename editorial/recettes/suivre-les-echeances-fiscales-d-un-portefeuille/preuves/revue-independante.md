# Revue indépendante du paquet fiscal

**Verdict : PASS métier, éditorial et visuel, borné à la fabrication locale.** Aucun défaut de fond bloquant constaté. Aucun sceau, autorisation de publication, verdict de CI ou contrôle de production n’est délivré.

Relecteurs distincts de l’auteur : éditorial et image `marketing`, métier `relecteur-metier-ia-memlia`, qualité `relecteur-qualite-ia-memlia`. Références effectivement lues : charte `.agents/product-marketing.md` v5, barème `quality-scoring.md`, recette des figures du 03/10 et recette des couvertures OpenAI du 12/10. Le fond et les preuves du candidat n’ont pas été modifiés.

## Scope de fabrication et contrôles exécutés

- Lecture de `corps.md`, `recette.json`, `claims-techniques.json`, copies officielles et métadonnées, script et sortie de rejeu, contrats de figures, contrôles de rendu et provenance image.
- Rejeu indépendant de `rejouer()` par `runpy`, sans lancer sa branche qui écrit le fichier : sortie strictement égale à `rejeu.json`. **12 lignes, 11 clés uniques, 1 doublon isolé ; 7 à qualifier ou reprendre, 2 en préparation, 2 en attente de retour/paiement, 1 avec éléments confirmés.** F-11 reprend la clé de F-03 ; ce ne sont pas douze obligations distinctes.
- Empreinte du corps `trim()` conforme à `claims-techniques.json` : `ffd5b813febbb5ef4489385c751ceb3acfae4f2c6c6852808e2c2a7a81198a02`. L’empreinte brute avec le saut de ligne final est différente, conformément à la convention de lecture `.trim()` de la forge ; pas de dérive de fond.
- Comparaison effective des trois citations avec le HTML des copies, balises retirées et entités décodées ; les trois empreintes des copies concordent avec leurs métadonnées. **Pas de nouvelle recherche ni récupération réseau** : l’avis porte sur les copies officielles conservées et leur contexte.
- Inspection visuelle réelle du master, de l’OG et des deux WebP de figures. Sharp a contrôlé dimensions, octets et SHA-256 des huit dérivés et des deux figures.
- Chromium indépendant sur `preuves/apercu.html`, à 1440 et 390 px : un H1, quatre tableaux avec `thead`, deux figures, trois images décodées avec alt, aucun débordement horizontal du document, aucune erreur JavaScript ou requête échouée. Le défilement a déclenché normalement le chargement différé des figures.

Le renderer fourni utilise réellement Astro Satteri et Chromium. L’aperçu est **NOINDEX**, déclaré aperçu de fabrication : ni gabarit public final ni JSON-LD de publication. Les contrôles ci-dessus ne valent pas CI, performance Lighthouse, accessibilité d’un crawler public ou preuve en production.

## Métier : trois citations et frontières

| Claim exact | Verdict | Contexte contrôlé |
|---|---|---|
| `claim-unit-d20bfc6ae3b0-1` | soutient | DGFiP calendrier, lignes 625–627 : TVA au régime réel normal, phrase exacte du 15 au 24 octobre 2026 et date figurant dans l’espace professionnel. |
| `claim-unit-446c0389db2d-1` | soutient | DGFiP échéances, ligne 299 : TVA/IS, Mes services → Consulter → Compte fiscal → Accès par impôt → TVA ou IS → Échéancier. L’extrait partiel est complété par son contexte dans l’article. |
| `claim-unit-57e380a85d74-1` | soutient | CNIL, article 5 §1 c, ligne 531, avec principes voisins : minimisation des données personnelles ; pas certification RGPD de la méthode. |

La fenêtre TVA nationale n’est jamais convertie en date unique. Le cabinet qualifie l’obligation, confirme sa date propre et conserve une date interne distincte. Une date absente ne produit ni retard fiscal inventé ni conclusion positive.

Le rejeu **classe des faits fournis** : qualification, confirmation de date, transmission, retour, paiement, doublon et période sont injectés. Aucun accès à l’espace fiscal, aucun calcul d’impôt, aucune déclaration ou opération de paiement n’est réalisé. « Dépôt confirmé » et « Éléments confirmés » sont des sorties sur valeurs fictives, pas la preuve d’un dépôt ou paiement exécuté. Le paiement sans objet est explicitement hors de la branche jouée.

La frontière en trois colonnes, les quatre parties de la règle écrite et les cas de refus sont présents. Dates, commentaires et décisions humains ne doivent pas être écrasés ; qualification fiscale, interprétation des rejets, transmission, paiement et clôture restent au cabinet. **Le programme ne prouve pas une persistance applicative** : cette distinction est conservée dans l’avis, sans attribuer au jeu un système connecté ou livré.

## Éditorial

Les sept critères natifs sont PASS dans `revues.json`, avec constats par critère. Réponse d’abord, prérequis, étapes, dictionnaire des champs, états séparés, exceptions et FAQ satisfont une intention de suivi opérationnel, sans prétendre remplacer un calendrier fiscal exhaustif. Les liens officiels portent les citations dans le corps ; aucun encart administratif public de sources n’est imposé. Le CTA `Confier cette tâche` vers `/contact` et la clôture vendent une tâche prise en charge dans les outils, pas un logiciel. Le lecteur est invité à garder les fonctions déjà assurées par son logiciel métier.

Le relevé SERP est celui consigné dans la recette, pas une observation nouvelle ni une promesse de classement. Les liens entrants sont déclarés, pas vérifiés comme matérialisés.

## Figures : les cinq questions

Les deux figures reprennent les classes et styles du cadre de référence (`.frame`, `.window`, `.screen`, tableau, pastilles). Images de **1600×900**, **33 130 et 34 376 octets**, mêmes fichiers pour bureau et mobile.

| Question de la recette | Registre | Files agrégées |
|---|---|---|
| Écran d’un outil qu’un cabinet pourrait regarder ? | Oui : registre, onglets et ligne F-03 sans transmission. | Oui : compteurs et file d’exceptions. |
| Données fictives, concrètes et sans marque ? | Oui : F-01 à F-07, TVA septembre 2026, en-tête fictif. | Oui : F-01/F-05/F-08 à F-12, copie F-03 identifiée, aucun collaborateur nommé. |
| Image compréhensible seule et article lisible sans elle ? | Oui : préparation, retour et paiement séparés ; explication complète dans le texte. | Oui : files et anomalies lisibles ; totaux également explicités dans le corps. |
| Ni étapes commentées, slogan, avertissement ? | Oui. | Oui. |
| Passerait pour l’une des références ? | Oui : fenêtre sur quadrillage, pastille et nom d’écran, typographie et pastilles communes. | Oui : même fenêtre, toolbar, compteurs et tableau ; pas diapositive. |

**PASS sur les cinq questions pour chacune.** Observation non bloquante : « Date dossier » désigne ici un état de confirmation, pas une date affichée. Une amélioration précise serait « État de la date ». Cette illustration ne choisit aucune échéance fictivement qualifiée ; elle n’est pas le registre fiscal complet promis par le texte.

## Couverture : six critères

- **Brief-six-components : PASS.** Six composantes documentées ; sujet, composition, style, palette, interdits et alt.
- **Generation-constraints : PASS.** Diorama 3D mat, formes simplifiées, fond crème et bacs verts ; aucun texte, chiffre, marque, personnage, main, fausse interface, alerte rouge, envoi automatique ou sceau. Le prompt réel contient « ceramic », ajout absent du bloc historique : ne pas réécrire le prompt pour masquer cet ajout ; le rendu reste cohérent.
- **Fictive-provenance : PASS.** Master OpenAI natif fourni par le propriétaire, génération `exec-1ab7ca55-1c81-48f0-ae0c-0710064ef107`. Modèle exact et coût non communiqués ; aucune génération ni dépense engagée dans cette revue. Les figures sont HTML, pas IA ni captures client.
- **Recognizable-subject : PASS.** Calendrier vierge et dossiers reconnaissables. Disque graphite abstrait dans un bac distinct ; aucun symbole de validation fiscale. Le recadrage OG conserve les objets entiers.
- **Technical-derivatives : PASS.** Master 1920×1080, OG 1200×630, variantes AVIF/WebP 768/1200/1600, dimensions et empreintes contrôlées.
- **Alt-information : PASS.** Alt descriptif de 93 caractères, conforme aux objets vus ; alts des figures présents dans l’aperçu.

Direction artistique **17/20**, pertinence sémantique **23/25**, avis heuristiques. Le vert `#27b657` est quasi absent selon la mesure consignée, le vert profond domine : **observation cosmétique, pas FAIL**. Le disque a une fonction visuelle peu précise, sans devenir un symbole d’approbation.

## Qualité : score conseil, pas porte de publication

| Catégorie | Score |
|---|---:|
| Content Quality | 28/30 |
| SEO Optimization | 23/25 |
| E-E-A-T Signals | 12/15 |
| Technical Elements | 7/15 |
| AI Citation Readiness | 13/15 |
| **Somme calculée** | **83/100** |

Les sous-scores sont détaillés dans le JSON. Le score technique ne crédite pas le JSON-LD final, la vitesse ni les métabalises sociales absents du périmètre. La préparation aux citations ne crédite pas l’accès d’un crawler public sur un aperçu NOINDEX. Aucun nombre de statistiques, quota de mots ou nombre d’images artificiel n’est imposé au guide fiscal. Aucun défaut bloquant de fond constaté ; `p0` reste vide.

### Réserves à la phase platform

Matérialiser le gabarit de publication, puis contrôler canonical, schémas Article/Person/Organization/BreadcrumbList, OG/Twitter, indexabilité et accès des crawlers visés, maillage entrant, performances et livraison/CI sur SHA exact. Ne pas transformer ce manque de preuve de phase ultérieure en P0 du corps. Aucun triplet de rendu public calculé, aucun sceau, aucune publication.

### Incidents de contrôle

L’exécution Python via `-c` et `execute_code` a été refusée par les garde-fous de la session ; les contrôles ont effectivement abouti via deux petits scripts ciblés dans le scratch du profil marketing, sans script global ni changement du candidat. La première comparaison d’empreinte brute a été résolue en vérifiant la convention `trim()` de la forge. La première attente d’images a été corrigée dans le seul script de contrôle pour déclencher le lazy-load par défilement ; ce n’était pas une panne d’image de l’aperçu.

**Fichiers de revue créés :** `revues.json` et `preuves/revue-independante.md`. Aucun fichier de fond corrigé.
