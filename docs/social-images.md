# Images de partage

Le layout `Base` réserve une variante JPEG aux balises `og:image` et `twitter:image`.
Les images du contenu, le frontmatter et les images JSON-LD ne changent pas.
La variante conserve le chemin source sous `/social/`, suivi de `.jpg` ; par exemple
`/proofs/outil.webp` devient `/social/proofs/outil.webp.jpg`.

L’intégration `memlia-social-images` produit les fichiers à la fin de chaque build
Astro, y compris les builds directs et les prévisualisations. Elle lit les cartes
réellement rendues, déduplique leurs images et convertit les sources déjà copiées
dans `dist`. Aucun binaire dérivé n’est versionné et une source manquante fait
échouer le build, plutôt que de publier un lien cassé.

Les variantes mesurent 1200 × 630, avec conservation du visuel entier et marges
crème si nécessaire. La compression JPEG vise au plus 300 000 octets ; le build
échoue si cette limite reste dépassée. Les médias WebP restent disponibles.

Vérifications :

- `node --test tests/scripts/social-images.test.mjs` : rendu réel avec Sharp,
  dimensions, poids, source intacte, déduplication et source manquante.
- `npm run test:page-contract` : URL OG unique, absolue HTTPS Memlia, `.jpg` ou `.png`.
- `npm run regen:generated` puis `npm run build` : registres et surfaces régénérés.
- Après publication : parcourir le sitemap et vérifier les deux balises, le HTTP
  200 des fichiers, leur type MIME, leurs dimensions et leur poids.

L’inspection authentifiée LinkedIn reste une recette manuelle facultative ; une
réponse HTTP 200 ne prouve pas à elle seule le rendu d’une carte sur LinkedIn.
