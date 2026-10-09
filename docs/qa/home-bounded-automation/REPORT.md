# Accueil — promesse d’automatisation bornée

Objectif : lever le passage absolu relevé par l’audit t_2caf75a7.

## Changement

Seul le paragraphe `.daily-note` de `Quotidien.astro` change :

> Écrire la règle, c’est notre métier. Une règle écrite appartient au cabinet. Nous en automatisons la part répétitive lorsque les formats, les accès et les cas couverts le permettent.

La phrase introductive, le hero, les URL, les styles, les illustrations, les CTA et la décision humaine sont conservés. Recherche du passage dans le dépôt : aucune autre surface publique ne reprend cette même phrase ; le texte de la page service est déjà borné. Aucune modification des articles, de la charte, des lots A–D ou du beacon.

## Recette auteur

- Test ajouté avant modification et exécuté sur le rendu initial : FAIL sur la promesse absolue (sortie `red-test.log` dans le workspace).
- Test de non-régression : exactitude du passage dans le HTML construit, refus de l’ancienne formulation.
- Build complet PASS : 126 tests Python, 612 tests Node. Première passe après changement : registre lastmod encore lié au rendu initial, resynchronisé après construction ; une autre passe échoue sur un port occupé du test de serveur préexistant, puis reprise complète verte sans changement de ce test.
- `npm run check` : 0 erreur, 0 avertissement, 8 hints existants.
- 9 contrats Chromium PASS : texte/hero/non-débordement sur six largeurs (320, 375, 768, 1024, 1440, 1920), et trois parcours positionnement existants.
- Captures pleines pages : `.qa/home-bounded-automation/` ; capture 375 px examinée, passage complet et aucun débordement visible. Les captures prennent les animations en cours : les zones révélées tardivement ne constituent pas un retrait de contenu.
- `git diff --check` PASS ; registre lastmod mis à jour uniquement pour `/`.

## Suite de livraison

Une QA indépendante sur ce correctif, puis fusion après CI verte et constat du texte sur l’URL Cloudflare du déploiement et sur https://memlia.fr/ (sans query string). Rendre ces preuves à t_2caf75a7 ; ne pas reprendre les revues A–D. Rien n’est encore déclaré publié dans ce rapport auteur.
