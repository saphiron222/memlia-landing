# Preuves responsives — IMG-01

Le hook `memlia-responsive-proofs` dans `astro.config.mjs` enrichit les balises `img` et les preloads d'images de preuve après le rendu Astro. Ce point commun couvre ProofMedia, les héros commerciaux et le HTML des articles, sans changer les sources éditoriales scellées ni le dessin des cadres.

Les masters `/proofs/**/*.webp` restent identiques, disponibles à leur URL, et restent le `src` ainsi que le candidat 1600w. Les variantes 400/800/1200 sont produites dans `dist/proofs/responsive/` avec Sharp, qualité 90 comme le renderer existant, sans recadrage. Leur nom porte le contenu du master pour éviter une ancienne réponse en cache après sa régénération. Les images sociales et les couvertures illustratives ne sont pas concernées. Aucun agrandissement n'est ajouté (décision de Kevin du 07/10).

` sizes="auto, …" ` sur les images lazy utilise la largeur réelle de la colonne ; le repli et les images eager utilisent une largeur bornée par le viewport et le cadre de 1200px. Les preloads reçoivent `imagesrcset` et `imagesizes` pour ne pas télécharger le master en plus du candidat mobile. Un master hors 1600 × 900 fait échouer le build plutôt que de déclarer des dimensions incorrectes.

Vérification :

- `node --test tests/scripts/responsive-proofs.test.mjs tests/scripts/blog-contract.test.mjs` : témoin rouge puis vert ; dimensions/décodage, master inchangé, preload, rejeu stable, refus d'une variante étrangère/portrait.
- `QA_URL=<preview> npx playwright test tests/browser/responsive-proofs.spec.ts` : avant/après sur le même HTML (retrait des seuls attributs responsive pour le témoin), cache froid, six routes à 375/1440px et DPR 1/2, currentSrc, décodage et HTTP 200 du master. La comparaison mesure les octets des ressources `/proofs/` chargées après défilement, pas le transfert complet du site ni un score Lighthouse.
- `npm run test:images`, `npm run test:proof`, contrat blog ; CI Repository gates pour la suite complète.

Mesure locale initiale à 375px DPR 1 : accueil 317480 → 39842 octets (-87,5 %), contact 112486 → 15646 (-86,1 %), méthode 180288 → 27950 (-84,5 %), DSN Silae 31798 → 4852 (-84,7 %), ROI 62356 → 9008 (-85,6 %), article logiciel IA 71732 → 10316 (-85,6 %). Les 94 masters référencés produisent 282 variantes. Les fichiers générés lastmod et glossaire se régénèrent avec `npm run regen:generated` ; aucune revue métier du fond ne change.

Retour arrière : retirer le hook et son import, puis régénérer les fichiers dérivés. Les masters et les articles n'ont pas besoin de restauration.
