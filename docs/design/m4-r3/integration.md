# M4-R3 — intégration des références approuvées

## Périmètre et provenance

- Carte `t_f16e5a39`, worktree isolé `wt/t_f16e5a39`.
- Base intégrée : `cd71227` (M5), descendant de `642769e` (M3-S/F1). Comparaison exécutée `git diff 2948a10 642769e -- src tests package.json` : aucune différence.
- M4 photographique `63bfee5` non repris : ses photographies sont explicitement rejetées. Son principe d’oracle formats/dimensions est repris dans `scripts/verify-m4-images.mjs`, adapté au lot fonctionnel.
- M4-R1 : les neuf WebP de `docs/design/m4-r1-functional-proofs/optimized` dans le dépôt principal sont copiés sans transformation. Matrice et alt de la proposition Obsidian `m4-r1-preuves-fonctionnelles-navattic.md`.
- R7 : copie depuis `memlia-video/out/r7` exclusivement, jamais les dossiers R4/R5. MP4, VTT et poster inchangés ; script source conservé ici pour traçabilité.
- Le script et les incrustations du média R7 approuvé portent encore des mentions historiques R5/« à valider ». Elles sont conservées, pas effacées ni réinterprétées comme un défaut de copie. L’accord humain R7 est documenté par le parent `t_ce5f6481`.

## Direction imposée, sans génération nouvelle

La proposition amont interdit toute nouvelle génération payante : les neuf références sont la source visuelle, pas une invitation à reconstruire une plateforme. Palette conservée : crème `#fffefb`, feuille `#fcfbf7`, encre `#231f20`, verts `#27b657` et `#1c8a41`. Typographies existantes Fraunces/Hanken, cadres fins et profondeur sobre.

L’analyse de la planche et des médias signale un risque réel : les microtextes d’un écran 1600×900 ne sont pas lisibles à 320px. Réponse d’intégration : aucun recadrage, grand média dans le flux, alt précis, description HTML dépliable au clavier, lien vers l’original agrandissable. Pour la vidéo : contrôles natifs, plein écran et transcription synchronisée au contenu du VTT.

## Matrice conservée

| Preuve | Emplacement |
|---|---|
| 01 flux | Promesse / service, jamais à la place du hero |
| 02 répétition | Quotidien |
| 03 contrôle | Contrôle humain / proposition vs saisie |
| 04 observer | Méthode, étape 1 |
| 05 cadrer | Méthode, étape 2 |
| 06 éprouver | Méthode, étape 3 |
| 07 livrer | Méthode, étape 4 |
| 08 intégration | Outils existants |
| 09 garanties | Garanties |

Les étapes de méthode restent toutes dans le flux, y compris sans JavaScript, plutôt que de dissimuler des preuves informatives derrière un panneau décoratif `aria-hidden`. Le blog conserve ses deux articles, schémas, RSS et routes ; ses deux couvertures sont dérivées des preuves 06 et 09 pour supprimer également la papeterie de cette surface. Alt corrigés, aucune modification éditoriale des articles.

## Contrat de livraison

Le MP4 R7 fait 2 937 013 octets : aucun réencodage supplémentaire n’est nécessaire ni souhaitable. SHA-256 attendu : `649d2d767f086cb22c870b88ab71797fe09b6d73f228e2e3b89406b062fa2700`.

`media-manifest.json` décrit 13 copies exactes (9 preuves, 3 médias, 1 script), 12 dérivés blog et 1 dérivé de diffusion du poster. Les tests relisent les fichiers dans `public` puis `dist`, vérifient les 20 cues, leurs frontières temporelles, leur présence dans la transcription et le bilan fictif 48 = 47 + 1.

Le poster de diffusion `hero-poster-1200.webp` (1200×675, qualité 90) pèse 24 482 octets, contre 136 132 pour l’original conservé. Il est préchargé avec priorité haute. Aucun changement de contenu, aucun recadrage ni réencodage vidéo. Cette correction répond à trois mesures mobiles distantes à 94 avant optimisation ; après correction : 98. L’original approuvé reste disponible et son hash est vérifié.

La allowlist du post-build ne publie plus que les 12 dérivés blog sous `/images/`. Les 78 anciens assets et les 20 briefs sont exclus et comptés. Les originaux fonctionnels vivent sous `/proofs/` ; la vidéo sous `/media/r7/`.

## Code historique hors périmètre

Les composants/données catalogue non importés, les entrées historiques du manifeste et certains styles de l’ancien panneau collant restent dans les sources, signalés plutôt que nettoyés hors demande. Aucun de ces médias historiques n’est livré dans `dist`. Les tests récursifs anti-catalogue couvrent aussi le VTT nouvellement public.

## Mesure et preview

Lighthouse mesure le candidat local indexable ; la preview reçoit séparément un en-tête `X-Robots-Tag: noindex, nofollow`. Le noindex est une exigence de sécurité de diffusion : il ne doit jamais être retiré pour améliorer artificiellement le score SEO d’une preview. La preuve d’équivalence HTTP relie la version locale testée au déploiement distant, en comptant tout bloc analytics injecté par Cloudflare.

Aucun push, merge dans main ou déploiement production. Revue croisée réservée à l’enfant existant `t_69fbf26b`, puis Kevin.
