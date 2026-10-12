# Recette des visuels du blog Memlia — référence du 12/10/2026

Décision de Kevin du 12/10/2026 : couvertures avec la génération d'images OpenAI directement dans Codex ; figures du corps en HTML figé. Higgsfield est abandonné pour les nouvelles générations.

## Couvertures : diorama 3D généré

Référence retrouvée : `docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md`, section « L'image de tête : la recette d'image des articles », et les recettes publiées `automatiser-la-relance-des-pieces-clients` et `automatiser-un-cabinet-comptable-la-carte-des-taches`. Le runbook a été relu sur main 06548228 le 12/10 ; sa dernière modification est du 12/10. Les commandes Higgsfield historiques sont remplacées par l'outil natif OpenAI.

- Brief à six composantes : sujet, composition, style, palette, interdits, alt descriptif.
- Diorama 3D isométrique : formes géométriques simplifiées, matières mates et éventuellement translucides, fond crème papier, lumière douce du haut gauche, ombres courtes, composition aérée.
- Couleurs épinglées : crème `#fcfbf7`, papier `#fffefb`, vert Memlia `#27b657`, vert profond `#1c8a41`, graphite `#231f20`. Mesurer et archiver les parts exactes en OBSERVATION ; les écarts de palette restent cosmétiques.
- Illustration propre au sujet, reconnaissable en vignette ; éléments importants compatibles avec le recadrage social.
- Aucun texte, lettre, chiffre, logo, personnage, main, donnée client, fausse interface, alerte rouge ou symbole d'envoi automatique. Aucun cadre HTML employé comme couverture.
- Générer avec `image_gen.imagegen` dans Codex, regarder le rendu et corriger un défaut concret si nécessaire. Aucun appel Higgsfield ni nouvelle dépense API.
- Conserver prompt exact, sortie originale, identifiant de génération, date réelle et empreinte. Le modèle exact et le coût ne sont pas communiqués par cet outil : ne pas les inventer ni présenter le nom demandé « GPT Image 2.5 » comme une mesure du fournisseur.
- La forge produit le master 1920×1080, l'OG 1200×630 et les dérivés 768/1200/1600 en AVIF/WebP. Alt ≤125 caractères, revue visuelle indépendante, sources de fond et figures inchangées.

## Corps : écrans HTML figés

Référence du **03/10/2026**, dernier commit du même jour `2e8ea7c0` : `docs/design/blog-article-proofs/RECETTE.md`. Confirmation Obsidian : `10-memlia/chantiers/cac-site-niveau-superieur/plan.md`, mise à jour du 06/10, ligne24.

- Partir d'un cadre existant de `docs/design/blog-article-proofs/index.html`, avec ses styles.
- Une image 1600×900 WebP de moins de150Ko, identique sur ordinateur et téléphone.
- Fenêtre sur fond quadrillé : pastille et nom d'écran à gauche, « Jeu d'essai fictif · contexte » à droite.
- Registre, file, checklist à statuts, fiche, compteurs ou discussion, rempli de données fictives concrètes.
- L'image illustre ; le texte explique. Ni slogan, schéma d'étapes commenté, avertissement ni reprise du texte.
- Rendre et regarder ; `render-blog-article-proofs.mjs --adopt` fige après revue, `--check` vérifie. La forge injecte la figure et l'alt ; aucun modèle d'image IA pour le corps.

La note Obsidian `visuels-fonctionnels-landing-gpt-image-2-5.md` du09/09 concerne neuf compositions de landing : ce n'est pas la recette des couvertures du blog.

## Correction des deux articles CAC

Les couvertures publiées étaient des captures des cadres HTML `cac-inventaire-taches` et `cac-fec-registre-reception`, fabriquées le11/10 : elles confondaient les deux recettes. Les remplacer par des dioramas OpenAI propres à ces articles ; garder les figures du corps, les sources et les avis métier de fond. La correction acquiert sa propre revue visuelle et sa livraison réelle.

