# Qualification de l’avis acquis — liaison CAC F4

## Nature et autorité

Les deux `editorial/recettes/<slug>/revues.json` lient exclusivement `docs/qa/cac-f4-metier/AVIS.md` aux objets actuellement produits. Identité conservée : `relecteur-metier-ia-memlia`, revue du **11/10/2026** (`reviewedAt: 2026-10-11`), carte **t_8bb28890**, verdict **PASS AVEC RÉSERVES**. Ce document et le vérificateur ne constituent ni une nouvelle revue indépendante ni une autorisation de publication. Aucun sceau, commit, push ou publication n’a été exécuté.

Les `business.claims` reprennent les constats textuels exacts de §3, avec leur localisation, la proposition réellement produite et ses extraits. Les enrichissements documentaires R1 sont seulement ceux autorisés par §4. Les sources reprennent §2, notamment les versions et champs NEP315/330, leur application par ouverture d’exercice, la distinction avec les versions historiques et les limites de consolidation locale. Les régimes SACC/durabilité/ALPE, les exercices anciens et les inconnues produit ne sont pas réputés validés.

## R1 : vérification mécanique, pas nouvel avis

Commande reproductible depuis la racine :

```sh
node .qa/verifier-liaison-avis.mjs
```

Preuve : `docs/qa/cac-f4-livraison/liaison-avis/VERIFICATION-R1-LIAISON.json`.

Le rejeu réel de `construireClaims` de la forge restitue exactement les deux registres réellement produits : **10 claims pilier, 5 claims satellite**, zéro erreur de préflight et de règle écrite. Vérification des unités de non-réponse (1 claim), calendrier §9/§10 (2), appréciation d’outil pilier (3), appréciation d’outil satellite (2). Les conditions signature/approbation, refus de direction distinct de non-réponse et portées NEP315/NEP330 sont conservées dans les explications et le raisonnement contextualisé de la liaison. Les empreintes des copies sources concordent avec les reçus ; les extraits sont présents. `claims-preflight.json` historique n’est pas réécrit : le préflight courant est le rejeu effectué ici.

`INTEGRITE-AVANT.json` fournit l’inventaire avant liaison : corps, recettes, claims produits, pièces sources, preuves de recette et quatre figures restent byte-identiques après cette opération. Cette preuve est limitée à cette opération, pas une revalidation indépendante de tout le chantier.

## Rendu : empreinte véritable, sans revue visuelle nouvelle

Le build Astro existant emploie le format `file` : ses objets véritables sont `.qa/render-cac-f4/blog/<slug>.html`, et non les `index.html` demandés. Des copies **byte-identiques** ont été placées sous `.qa/render-cac-f4/blog/<slug>/index.html` ; aucune page n’a été inventée, modifiée ou rebâtie. Les reçus `<slug>-alias-rendu.json` documentent les deux chemins et leurs empreintes égales.

Les subjects viennent de la sortie réelle de `node scripts/blog-forge.mjs empreinte <slug> .qa/render-cac-f4/blog/<slug>/index.html`. Les deux sorties `<slug>-empreinte.json` sont conservées. `reviewBindingErrors` exécuté sur ces HTML retourne deux listes vides. L’empreinte du corps rendu est une liaison technique ; **elle ne prétend pas que le relecteur du 11/10 a examiné Astro** (§1 et §7 disent explicitement le contraire).

## Champs et critères restant à qualifier

### Images

- `fictive-provenance` et `recognizable-subject` : seuls critères complets soutenus explicitement par §6 ; PASS transféré dans la stricte limite des images réellement regardées, pas pour une interface fonctionnelle.
- `brief-six-components`, `generation-constraints`, `alt-information` : `NON_EXAMINE`. Aucun constat explicite sur ces critères complets dans l’avis ; ni contrôle du brief complet ni appréciation indépendante des attributs alt n’est inventé.
- `technical-derivatives` : `NON_EXAMINE`. §6 mesure PNG/OG JPG/WebP relus ; il ne vérifie pas les nouveaux dérivés de forge 768/1200/1600 AVIF/WebP et OG WebP. Les dimensions acquises sont conservées comme observation partielle, pas comme PASS de toute la chaîne.
- `directionArt`, `semanticRelevance`, `score` : absents, aucun nombre acquis. Aucun relecteur visuel supplémentaire inventé.
- Réserve cosmétique conservée textuellement : mention fictive et petits textes moins saillants en OG réduit ; amélioration après publication selon la décision fixée, non bloquante pour le fond. Aucun texte tronqué dans les cadres regardés, aucune obligation nouvelle de couverture IA.

### Éditorial et qualité

Les sept critères de la forge sont explicitement `NON_EXAMINE` **comme critères complets** : `intent-satisfaction`, `serp-format-rankability`, `eeat-sources`, `information-gain-proof`, `technical-onpage-seo`, `ai-citability`, `contextual-conversion`.

L’avis soutient des observations partielles sur sources, jeu fictif, limites de service et CTA ; elles sont conservées aux bons critères, sans les transformer en validation globale de satisfaction de requête, gain informationnel, conversion ou E-E-A-T. Rendu final, liens servis, SEO, SERP/rankability et citabilité restent sans constat indépendant acquis. La matrice Blog/SEO du parent n’a été ni modifiée ni utilisée comme une validation métier indépendante.

`qualite` est omis : aucun barème blog-analyze, catégories, total /100 ou score numérique n’existe dans l’avis. Aucun P0 vide n’est ajouté pour faire croire à un contrôle complet.

### Attention au comportement de la forge

`scripts/blog-forge.mjs` ne respecte pas entièrement ces nuances :

- lignes 147, 751, 759 : la simple présence d’une section business/editorial déclenche un statut synthétique PASS ; ligne 754, la présence editorial entraîne `pret-preview` ; cela n’est **pas** un constat de cet avis ;
- lignes 490 et 500 : la présence image déclenche PASS et score **100** indépendamment de l’absence de score acquis ; `directionArt`/`semanticRelevance` deviennent null ;
- ligne 752 : critère absent devient FAIL et PASS gagne le poids du barème ; `NON_EXAMINE` ne doit pas être pris pour un nouveau FAIL métier ni converti en PASS ;
- lignes 723–736 : `qualite` produit statuts et scores lorsqu’elle existe ; elle n’est donc pas fournie.

**Ne pas sceller sur la seule présence de ces sections.** Les fichiers de liaison ne franchissent aucune porte. Les champs manquants pour une grille exhaustive restent à qualifier explicitement dans la même voie métier, par constats effectivement rendus, sans identité/score/verdict inventé et sans nouvelle revue de fond des propositions déjà soutenues pour la seule liaison R1. Le contrôle technique Blog/SEO de marketing demeure distinct. Aucune modification de la forge n’est faite dans cette tâche.
