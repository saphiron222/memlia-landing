# Vidéo CAC — intégration E9

La R4 approuvée par Kevin est la référence. La variante `cac-r4-clean` retire uniquement les deux mentions périphériques demandées (haut-droite et bas-gauche) dans `Cac.tsx`. Aucun crop, masque ni changement du montage. Le test `cac-clean.test.mjs` a été observé rouge puis vert. La comparaison de source vérifie que seules ces deux lignes sont retirées.

Le rendu conserve 1920 × 1080, 30 images/s, 45 s et 1 350 images. L’AAC approuvé est remuxé avec `-c copy`, sans synthèse, mixage ni réencodage. Le contrôle extrait l’AAC ADTS original et livré : même SHA-256. Décodage intégral ffmpeg PASS. Les 37 images de chaque scène et des deux côtés des raccords conservent le logo, les titres et les données ; aucun sous-titre incrusté. Les éléments entrant momentanément dans le cadre restent ceux du film approuvé.

## Reproduction

Extraire `cac-video-source-r4.zip` du parent E8 puis appliquer la suppression des deux overlays dans `video/src/compositions/Cac.tsx`. Conserver l’archive originale intacte. Dans `video/` :

    npm ci
    npm test
    npm run typecheck
    npx remotion render src/index.ts CacHero <nouveau-dossier>/hero-silent.mp4 --codec=h264 --pixel-format=yuv420p --image-format=png --color-space=bt709 --muted --concurrency=2 --overwrite=false
    ffmpeg -i <nouveau-dossier>/hero-silent.mp4 -i <r4-originale>/hero.mp4 -map 0:v -map 1:a -c copy -movflags +faststart <nouveau-dossier>/hero.mp4

Extraire le poster à 25 s. Copier les VTT/SRT R4 sans modification. Le dossier doit contenir `verification.json` (PASS, révision `cac-r4-clean`, audio identique, overlays retirés, empreintes des trois sources). Les sources nettoyées, tests, script de vérification et planches sont livrés avec cette carte.

Dans le dépôt du site :

    node scripts/import-cac-media.mjs <dossier-r4-clean>
    node --test tests/scripts/cac-video.test.mjs tests/scripts/accueil-cac-copy.test.mjs tests/scripts/accueil-cac-medias.test.mjs tests/scripts/accueil-cac-publication.test.mjs
    npm run regen:generated

L’import refuse toute source divergente avant d’écrire les actifs. Son manifeste est `video-manifest.json`. Il ne touche pas la R9 EC. Musique : « Motivating Mornings », Ahjay Stelino/Mixkit, licence commerciale archivée par E7/E8 et inchangée.

## Lecteur et recette

Lecteur R8 commun : boucle muette en visibilité, bouton « Activer le son » repartant à zéro, pause/reprise par clic, Entrée et Espace, poster sans lecture en reduced-motion, fallback téléchargeable. CAC ajoute seulement un bouton de sous-titres optionnels, désactivés au chargement. La provenance fictive est dans la description accessible, pas incrustée dans les coins. Sans JavaScript, les liens vidéo/VTT restent disponibles ; aucun bouton de captions inactif n’est affiché.

`tests/browser/cac-video.spec.ts` exerce lecture, dimensions/durée, seek, clavier et activation/désactivation des douze cues aux largeurs 320, 375, 768, 1024, 1440 et 1920. `accueil-cac.spec.ts` préserve la page et `integrated-media.spec.ts` couvre la non-régression EC. Utiliser `QA_URL` avec le serveur déjà construit ou la production, sans query string. CI complète : GitHub « Repository gates » ; pas de suite complète rejouée sur le Mac.

Retour arrière : nouvelle branche depuis main, revert du commit de fusion E9, régénération des données dérivées, PR/CI/fusion. Ne pas restaurer le film EC sur la page CAC.
