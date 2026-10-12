# Revue indépendante du candidat bancaire — 12 octobre 2026

## Verdict

**PASS métier, éditorial et visuel pour ce candidat borné. Aucun défaut critique identifié.** Quatre claims soutenus ; sept critères éditoriaux PASS, soit **100/100** dans la grille binaire pondérée native ; qualité **92/100**, détaillée ci-dessous. Ce verdict ne publie rien, n'atteste aucune automatisation bancaire livrée et ne remplace pas la CI.

Une seule lecture indépendante de l'auteur marketing, avec les rôles déclarés `marketing`, `relecteur-metier-ia-memlia` (collaborateurs-comptables) et `relecteur-qualite-ia-memlia`. Ce sont les rôles de cette lecture IA, pas des identités humaines ni trois revues distinctes. Aucun avis historique, notamment le 79/100 de septembre, n'est transféré.

## Objet exact

Workspace : `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_80e0d321`.

- Corps : `editorial/recettes/rapprochement-bancaire-automatise-les-ecarts-a-remonter/corps.md`.
- Recette et paquet : même dossier, `recette.json` et `paquet-revue.json`.
- Rendu lu : `.qa/render-banque/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter.html`.
- Sources lues : `editorial/articles/rapprochement-bancaire-automatise-les-ecarts-a-remonter/preuves/sources/`.
- Complément ANC lu et authentifié : dossier recette, `anc-plan-comptes-2026.pdf` et `anc-pdf-provenance.json`.
- Références appliquées : RUNBOOK-QUOTIDIEN §7, charte `.agents/product-marketing.md` v5, `docs/design/blog-article-proofs/RECETTE.md`, barème `/Users/kevinkitanga/hermes/packs/claude-blog/skills/blog/references/quality-scoring.md`.

Empreintes obtenues avec la commande native après lecture :

```text
slug: rapprochement-bancaire-automatise-les-ecarts-a-remonter
bodySha256: 35bafc1b60252726d1025326a392c3ac14d8220b435148cc142793b2bf9a7bba
recipeSha256: a9d20320ea81ae8cf54495b795634ea276c49fac7fe688bda989ab4150e1547c
recipeSubstanceSha256: 292dda9d453f9311f07cba9f9c7c401688cff6b250571e6b249bf249cb572b91
renderedSha256: f73970a5f4f0918737348aa6e89ce507a27da08ec6b2335b4448b61df6ff6254
```

## Rejeu et jugement comptable

Commande réellement exécutée, sans option d'écriture :

```text
node editorial/recettes/rapprochement-bancaire-automatise-les-ecarts-a-remonter/rejouer.mjs
PASS : 4 cas fictifs, entrées → oracle → résultats attendus concordants
exit_code: 0
```

L'entrée actuelle importe `oracle.mjs`, lit `jeu-fictif.json` et compare avec `rejeu.json` par `assert.deepEqual`. Elle ne régénère pas les attendus. Le prototype archivé n'est pas la preuve utilisée. Lecture du programme et recalcul indépendant en Python :

| Cas | Entrées et sortie contrôlées | Soldes recalculés, en euros | Jugement |
|---|---|---|---|
| RB-01 | R-01 crédit et J-01 débit, 125 €, V-041, un candidat par côté : PROPOSITION_UNIQUE | Relevé 1 125 ; journal 1 125 | Conversion des sens correcte pour le compte bancaire de l'entreprise. Une proposition reste à valider. |
| RB-02 | J-02 débit 80 €, 31 août, aucun mouvement relevé : ECART_OUVERT | Relevé 1 000 ; journal 1 080 | 80 € explique la différence numérique, pas sa cause. Transit possible non confirmé, relevé suivant à chercher. |
| RB-03 | R-03 face à J-03 et J-04, chacun 50 €, V-043 : REFUS_AMBIGUITE | Relevé 1 050 ; journal 1 100 | Deux candidats ne sont pas départagés. Le cas entier est refusé, aucune paire générée. |
| RB-04 | Ouverture du relevé null : REFUS_ENTREE | Relevé non calculable ; journal 1 000 | Refus correct du contrôle complet, pas solde nul inventé. |

Les quatre mini-dossiers sont indépendants. Le programme travaille sur du JSON déjà structuré ; aucune lecture de PDF, CSV ou connexion bancaire n'est exécutée. Il contrôle les soldes des données présentes, pas leur exhaustivité externe. Une omission compatible avec les soldes peut lui échapper.

**Limites substantives correctement dites dans le corps :** pas de test de dossier mêlant paires et écarts, pas de reprise du reliquat précédent, pas de persistance/reprise des décisions, pas de preuve pour commissions, devises multiples ou paiements groupés. L'oracle retourne dès qu'il trouve des paires et n'émet pas alors une liste complète de reliquats : il serait impropre à prouver un dossier mixte, mais le corps exclut explicitement cette extension. La conservation des originaux et des décisions relève ici de la méthode et de la conception, pas d'une capacité démontrée de ce programme. Aucune généralisation de fiabilité n'est acceptée.

## Sources : portée exacte

Les SHA-256 des trois copies HTML concordent avec leurs métadonnées. Les citations sont présentes dans le contenu visible après exclusion de head/script/style, pas seulement dans une meta ou un commentaire. Le SHA-256 du PDF concorde également avec sa provenance réseau.

- **ANC, anc.gouv.fr, tier-1 :** le lien visible « plan de comptes (version au 1er janvier 2026) » soutient exactement l'existence et la version du document. Il n'établit ni 512 ni la clé d'appariement. Le PDF réel complète `512 Banques`, `5121 Comptes en euros`, `5124 Comptes en devises`.
- **CNIL définition, cnil.fr, tier-1 :** la citation sur la personne physique identifiée ou identifiable soutient la qualification possible de données personnelles dans les exports. Le guide ne transforme pas toutes les coordonnées d'entreprise en données personnelles.
- **CNIL principes, cnil.fr, tier-1 :** l'article 5 §1 c et f porte les deux citations de minimisation et sécurité appropriée. Le corps ne déduit ni conformité garantie ni certification ni sécurité absolue.

Les quatre claims du paquet reçoivent `soutient`. La clé et ses refus sont une convention Memlia éprouvée localement, non une norme imposée par l'ANC. Les recommandations opérationnelles ne sont pas habillées d'une autorité réglementaire qu'elles n'ont pas.

**Défaut documentaire mineur découvert :** `qualification-claims.md` indique page 9/18 pour le compte 512. Extraction indépendante par `pypdf` : **page physique et imprimée 10/18**. Le PDF porte bien les comptes cités ; ni le corps public ni le claim n'affichent ce numéro de page. Corriger la qualification interne est utile, mais ce défaut ne constitue pas une source mensongère ni une réserve critique. Aucun fichier auteur n'a été corrigé dans cette sous-tâche.

## Revue visuelle réelle

Regardés avec `vision_analyze` : master, hero-768 et OG, les deux figures et une référence `relance-checklist.webp`. L'illustration OpenAI native fournie est conforme au brief fourni : vue du dessus, deux documents anonymes, exception ambre et main au crayon voulue. Le modèle demeure non communiqué ; crédits null, aucune dépense ou génération Higgsfield inventée. L'ancien brief isométrique sans personnage n'est pas appliqué rétroactivement.

La palette existante mesurée sur 57 600 pixels à largeur 320 et tolérance 45 donne `#fffefb: 0.634375`, `#244b36: 0.039114583333333335`, `#231f20: 0.04592013888888889`. Ces parts portent la palette d'adoption, pas une conformité au vert historique absent ni des hex tous imposés au prompt originel. Le FAIL « revue image non exécutée » de l'artefact auteur est un placeholder de forge, pas un avis indépendant antérieur transféré ; il n'a pas été modifié ici.

Dimensions effectivement lues par `sips` : master 1920×1080, hero 768×432, OG 1200×630 ; figures 1600×900, respectivement 27 722 et 28 752 octets. Les images de couverture et de corps référencées existent dans le rendu local. Absence de nom, montant réel ou interface produit dans la couverture. Les coches flottantes sont métaphoriques ; elles ne prouvent pas quatre appariements. Le cadrage OG conserve l'exception et la pointe du crayon. Direction artistique : 18/20, pour une composition lisible mais générique et des liaisons décoratives ; pertinence : 24/25, comparaison et contrôle humain reconnaissables sans précision comptable dans la couverture.

### Cinq questions RECETTE.md

| Question | banque-cle | banque-rejeu |
|---|---|---|
| Écran d'un outil plausible au cabinet ? | Oui, fiche de paire candidate. | Oui, registre des essais. |
| Données fictives concrètes sans marque ? | Oui, A/EUR, R-01/J-01, V-041, 125 €. | Oui, quatre identifiants, sorties et suites. |
| Compréhensible seul ; article lisible sans image ? | Oui, paire proposée et décision en attente ; solde expliqué par le texte. | Oui, proposition, écart et refus se distinguent ; le corps donne les détails. |
| Aucun schéma commenté, slogan ou avertissement ? | Oui. | Oui. |
| Cohérent à côté des références ? | Oui, fenêtre, quadrillage, hiérarchie et statuts canoniques. | Oui, mêmes codes, titre court et registre. |

**PASS pour les deux figures.** La fiche garde « À valider » et « En attente » ; le registre précise quatre cas indépendants. Ni ces illustrations ni la couverture ne sont des captures de produit livré. Le mot « Ouverture » dans RB-04 pourrait préciser « Solde d'ouverture » : petite ambiguïté visuelle, résolue par le refus et le contexte, non critique. Aucun avertissement public additionnel n'est requis par la recette.

## Barème réel, non historique

Le score éditorial natif est binaire : 20 + 15 + 20 + 20 + 10 + 10 + 5 = **100**. Tous les critères sont justifiés dans `revues.json`, sans transformer ce score en indicateur SEO ou performance.

| Catégorie qualité | Décomposition selon le barème | Score |
|---|---|---:|
| Contenu | couverture 7 ; lisibilité 6 ; originalité 5 ; structure 4 ; blocs 4 ; clarté 2 | 28/30 |
| SEO | hiérarchie 5 ; titre 4 ; sujet 4 ; maillage 3 ; URL 3 ; description 3 ; sources 2 | 24/25 |
| E-E-A-T | attribution 4 ; fidélité 4 ; confiance/transparence 4 ; preuve 3 | 15/15 |
| Technique | schema 4 ; images 3 ; tableaux 2 ; vitesse 1 ; mobile 1 ; social 1 | 12/15 |
| Citation IA | preuve 4 ; utilité 3 ; entités 3 ; structure 3 ; crawlers 0 | 13/15 |
| **Total calculé** | **28 + 24 + 15 + 12 + 13** | **92/100** |

Les retraits contenu portent sur la densité des prérequis et « certaine », plus fort que « candidate univoque ». Le contexte empêche déjà d'y lire une validation comptable. Le maillage est pertinent mais les retours depuis les autres pages n'ont pas été contrôlés. Les signaux techniques existent, mais les points d'observation vitesse/mobile/service OG ne sont pas tous attribués faute de mesure. L'accessibilité effective des crawlers cibles n'a pas été éprouvée en production : pas de crédit pour cette ligne, pas de défaut d'accessibilité inventé à partir du noindex privé.

Ni objectif de mots, ni seuil SEO, ni rubrique bancaire encore absente, ni nombre arbitraire de statistiques ne sont traités en défaut universel. La section « Sources » et les dates administratives publiques sont absentes conformément à la charte v5 ; les liens utiles sont dans les paragraphes.

## Réserves et périmètre final

- Aucun P0 ou défaut critique justifiant FAIL identifié.
- Améliorations non bloquantes : pagination de la qualification interne, « certaine » et précision du libellé d'ouverture de RB-04.
- Lighthouse/Core Web Vitals, affichage mobile de la page, citation IA réelle, classement, indexation, accès des crawlers et levée de noindex non mesurés ici. Les assertions de QA auteur ne sont pas présentées comme des mesures indépendantes.
- Pas de nouvelle QA globale, publication, scellement, Kanban, commit ou push.
- Seuls fichiers créés dans le dépôt : `revues.json` et ce rapport, dans le dossier recette du candidat. Corps, recette, oracle, attendus et preuves restent inchangés.
