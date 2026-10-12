# Revue indépendante H5 — pilier EC

**Verdict : PASS limité au maillage H5 du candidat.** Aucun scellement, commit ou publication effectué. Relecteur : `qa:h5-independent-hermes`, agent IA distinct de l'auteur, sans prétendre être un CAC humain.

## Périmètre et jugement

Comparaison à `HEAD b78e6d26` dans `site`, lecture du corps et analyse du HTML réel `.qa/h5-render/blog/automatiser-un-cabinet-comptable-la-carte-des-taches.html`. Charte `.agents/product-marketing.md` v5 lue.

L'ajout dans « Que ne contient pas cette carte ? » est pertinent : il rend actionnable le renvoi aux familles CAC jusque-là seulement nommé. L'ancre « carte des tâches d’un cabinet de commissariat aux comptes » annonce clairement une autre carte, sans ancre générique ni promesse nouvelle. Le contexte conserve explicitement le repère transversal EC et réserve la sélection des travaux, leur appréciation et l'opinion au commissaire aux comptes. Les familles CAC ne sont pas ajoutées au compte EC. Aucun gain, fonction livrée, audit autonome ou conformité NEP n'est introduit. La cible publiée F4 n'est pas re-revue sur le fond.

Ce jugement porte réellement sur la nouvelle substance de recette et du passage ; les empreintes lient ce jugement au candidat, elles ne constituent pas son approbation.

## Contrôles exécutés

- Diff source limité : un seul remplacement de phrase dans `corps.md`, une entrée ajoutée à `links.outgoing`, `updatedAt` passé du 08/10 au 12/10/2026. Le remplacement inverse de l'ajout restitue exactement le corps HEAD. Les autres champs de recette sont identiques, dont claims, sources, image et preuves inline.
- Aucun lien existant retiré ; aucun lien du corps absent du DOM rendu. Une seule occurrence du nouveau lien dans `.article-corps`, avec `href="/blog/automatiser-un-cabinet-cac-la-carte-des-taches"` et libellé exact.
- GET public réel via Node fetch : `https://memlia.fr/blog/automatiser-un-cabinet-cac-la-carte-des-taches` répond **HTTP 200**, URL finale identique, canonical exact identique, robots `index, follow, max-image-preview:large`. H1 : « Automatisation cabinet audit : la carte des tâches du CAC ».
- Publication initiale **2026-09-16** maintenue ; mise à jour **2026-10-12** concordante dans recette, frontmatter, `<time>` et BlogPosting (`datePublished`/`dateModified`). Un H1 ; canonical EC `https://memlia.fr/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`. Preview `noindex, follow` normale.
- Fond, titres, tableaux, citations, limites et clôture maintenus par le diff exact. Couverture et deux preuves inline présentes au rendu avec alt et dimensions 1600 × 900 ; configuration image/preuves inline inchangée et aucun fichier dans `public`, `src/data` ou `src/pages` modifié. Aucune nouvelle génération ni appréciation artistique.

## Sujet canonique

Commande d'autorité exécutée avec succès :

```sh
node scripts/blog-forge.mjs empreinte automatiser-un-cabinet-comptable-la-carte-des-taches .qa/h5-render/blog/automatiser-un-cabinet-comptable-la-carte-des-taches.html
```

| Champ | SHA-256 |
|---|---|
| bodySha256 | `e36431f55ea9b6bc5213b90ecb7c212e407477e0610a6f3f5eb58e5f6d98947d` |
| recipeSha256 | `54f4182ea6c0a248e28dca474275906499356815401c6c8e565bbf29a13b9be7` |
| recipeSubstanceSha256 | `79f3b6d39998e03de435821e4b57ba6f2ffeb68dfff41d0ae22f3d465bf71453` |
| renderedSha256 | `8920b3f075d6361bf6ea2858491ce365d095d103cfa97486a799c905546ce479` |

## Historique et réserves

`revues.json` mis à jour : sujet canonique nouveau, provenance et `scopedReview` H5 avec observations de substance explicites. Ancien sujet, provenance et revue H4 conservés dans `historicalSubjectH4`, `historicalProvenanceH4`, `historicalScopedReviewH4`. Avis métier, images, sources, score qualité B2 et observations des critères B2/H4 préservés comme historiques, non réexécutés et non redatés.

Le diff global n'est pas réduit aux fichiers auteur : `preparer` a rematérialisé le dossier, changé les empreintes/métadonnées et invalidé les portes anciennes. Le Markdown candidat est normalement `brouillon: true`, `statutEditorial: a-valider`. Les FAIL de revue périmée ne sont pas forcés en PASS ici ; rematérialisation et scellement restent au parent. Ce verdict n'approuve pas une publication.

Pas de nouvelle vérification réglementaire, de réexécution B2/H4, de contrôle HTTP de toutes les anciennes destinations, de revue visuelle/mobile ni de CI générale. Contrôle public limité à la cible CAC ; le nouveau lien EC a été vérifié dans le candidat seulement.

Deux premières sondes inline ont été bloquées par le mode d'approbation non interactif ; l'analyse a réellement abouti via un script Node scratch exécuté avec succès. Aucun résultat inventé ni changement de configuration d'approbation.
