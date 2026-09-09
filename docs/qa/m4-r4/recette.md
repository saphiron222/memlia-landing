# M4-R4 — images statiques et vidéo R8

## Correction globale après QA opérateur — 09/09, 07:26

- **Candidat courant : https://b2bf0d1e.memlia.pages.dev**, commit `d291abe`, alias `preview-m4-r4`. Remplace la preview `7e55394e` ci-dessous. Aucun push/main/production.
- Les trois ancres `Lire le détail` des repères étaient réellement présentes. L'exclusion de périmètre du rapport précédent était erronée. Elles sont maintenant supprimées, avec leur import/icône, href et style dédiés ; titres, descriptions et contenus cibles restent intacts.
- Cause du faux vert : Python/Playwright ne cherchaient que `Lire le détail —` avec suffixe. Les deux assertions portent désormais sur `Lire le détail` dans toute la page, sans suffixe ; CDP contrôle aussi le texte global. Rouge préalable : Python 1 échec sur 5, Playwright 320px 1 échec, tous deux sur les liens résiduels réels.
- R8 reste obligatoire selon le commentaire opérateur du fil et le parent `t_421d6828`, qui remplacent le corps initial R7. Aucun média n'a changé dans cette reprise. La clôture de cette phase libère F1 ; elle ne vaut pas validation finale du site.

| Vérification rejouée sur ce correctif | Résultat |
|---|---|
| Astro check / build | 65 fichiers, 0 erreur/0 warning, 1 hint hérité ; 7 pages |
| Python / images | 26/26 ; 23 images |
| Playwright local / distant | 44/44 chacun, sans skip ni flaky |
| Texte DOM global / cibles | 0 microtexte interdit aux six largeurs ; 3 cibles non vides conservées |
| Comparaison indépendante des deux previews | Corps textuel identique après exclusion explicite des 3 seuls anciens liens ; 3 contenus cibles strictement identiques |
| Figures / CDP | 36 figures et 72 cibles sans écouteur à 320/375/768/1440, local et distant ; aucun overflow |
| Captures statiques | 52 locales + 52 distantes, dont les repères aux quatre largeurs |
| HTTP / médias | 12 routes équivalentes au dist et noindex ; 25 médias SHA identiques, 1 document exclu ; 26 cibles locales rehashées |
| Chaîne R8 indépendante | 1350 frames sans cartouche, témoin R7 positif sur 1350 ; AAC/PCM/VTT identiques, poster frame418, 26 historiques inchangés |
| Lecture distante | Fin45s, son non muet/volume1, 20 cues, 1113066 octets audio décodés ; 1350 frames dont 35 perdues |
| Lighthouse local mobile / desktop | 100/100/100/100 chacun |
| Lighthouse distant mobile / desktop | 98/100/96/69 et 100/100/96/69 ; sorties1 assumées |

Le SEO69 vient du header noindex obligatoire ; BP96 du beacon Cloudflare CORS, détails relus dans les rapports JSON. Pas de certification lecteur d'écran/Safari. Repères locaux375/1440, distants320, lecteur distant1440 et illustration distante375 ouverts et examinés : aucune légende extérieure, microliens absents, pas de coupure du texte des repères. Les microtextes internes aux images restent petits conformément au périmètre statique.

Preuves actuelles : `.qa/m4-r4/global-fix/` (témoins rouges, comparaison de copy, résultats Playwright, HTTP, captures et lecture). `remote-media.json` pointe sur la nouvelle URL. Les preuves négatives de seek et les archives historiques restent intactes. **Seek à froid non corrigé ni requalifié** : suite spécialisée `t_89a7f08e`, puis revue `t_69fbf26b` ; aucune approbation globale revendiquée.

## Candidat livré à la suite de recette

- Carte `t_6900a385`, branche `wt/t_f16e5a39`, worktree `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_f16e5a39`.
- Nettoyage HTML/CSS : `93254d4` ; intégration R8 : `19a6c03`.
- Preview historique avant correction globale : https://7e55394e.memlia.pages.dev ; alias désormais remplacé par le candidat courant ci-dessus.
- Déploiement autorisé sur `preview-m4-r4` seulement. Aucun push, merge main ou production.
- **Phase de nettoyage et intégration terminée ; validation finale non acquise.** Un défaut supplémentaire de seek à froid est confié à `t_89a7f08e`, placé avant la revue Claude existante `t_69fbf26b`.
- **Statut Kanban : clôture refusée deux fois par le juge**, qui applique encore le corps initial « conserver R7 » et ignore la consigne ultérieure du fil imposant R8. Intervention opérateur nécessaire pour actualiser le goal ; ne pas restaurer R7. L'enfant F1 reste en attente de cette clôture. Les fichiers de captures/archive existent localement, mais leur téléversement par `kanban_complete` n'est pas confirmé puisque la transition a été refusée.

## Périmètre

Neuf figures contiennent uniquement une image informative responsive avec alt. Aucune légende, lien de détail sous image, disclaimer, wrapper interactif, tabindex, rôle, lightbox ou affordance de zoom. Les aides/transcription visibles sous la vidéo ont été retirées. Le lecteur garde contrôles natifs, playsinline, preload metadata, nom accessible, focus visible et track FR. Aucun autoplay.

R8 remplace R7 conformément au dernier retour Kevin : MP4, VTT et poster original copiés sans modification, chemins versionnés `/media/r8/`. Seul le poster de diffusion est dérivé à1200px/qualité90, comme R3. Son poids est24176octets. L'original est la vraie frame418. Les sources R7 et les rapports R3 ne sont pas écrasés.

H1/CTA/tagline/copy principale/blog/preuves inchangés. L'ancienne exclusion des trois liens « Lire le détail » des repères était erronée ; corrigée au commit `d291abe` ci-dessus. Les champs `title/detail` inutilisés de proofs.ts sont signalés, pas supprimés.

## Trois passes réellement rejouées

| Contrôle | Résultat sur R8 |
|---|---|
| Rouge préalable | Deux tests Python ciblés échouent sur poster R7 et preload R7 avant intégration |
| Astro check | 65 fichiers, 0 erreur/0 warning, 1 hint Lighthouse historique |
| Build | 7 pages ; Python26/26 ; oracle23 images sur manifeste R4 |
| Playwright local | 44/44, 0 skip/échec |
| Playwright distant | 44/44, 0 skip/échec/flaky ; six largeurs320/375/768/1024/1440/1920 |
| Images statiques CDP | 36figures à320/375/768/1440 ;72cibles figure+img, aucun écouteur, local et distant |
| Clavier/images | Parcours Tab complet revient au début et atteint la vidéo ; aucune preuve focusable ; clic/Entrée/Espace ne créent ni navigation, onglet ni dialogue |
| Captures contextualisées | 48locales et48distantes dans les dossiers `r8-*-screens` |
| Lecture intégrale | 45s en local et distant, fin atteinte, son non muet/volume1,1113066octets audio décodés,20cues affichées |
| Frames lecteur | Local1350/25perdues ; distant1350/0perdue |
| HTTP pages/flux | 12routes relues, statuts attendus, équivalence au dist ; injection Cloudflare comptée |
| Médias HTTP actifs | 25téléchargés et SHA comparés ;1document non public explicitement exclu |
| Source→public→dist | 26entrées au manifeste ;13copies/13dérivés ;26empreintes historiques R3 inchangées |
| Vidéo indépendante | 1350frames R8 :0pixel sombre dans ROI cartouche ; témoin1350frames R7 :1987–1991pixels sombres/frame |
| Audio et VTT | AAC et PCM décodé bit-identiques àR7 ; VTT bit-identique,20cues non vides ordonnées dans45s |
| Poster indépendant | Décodage RGB du WebP original strictement égal à la frame418 du MP4 intégré |

Les preuves arithmétiques HTML supprimées ne sont pas créditées : aucune valeur des images n'a été régénérée. Les images sont reliées par SHA aux sources validées ; leur interprétation numérique n'est pas une nouvelle mesure de cette passe.

### Lighthouse13.4.1

| Candidat | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| Local mobile | 99 | 100 | 100 | 100 |
| Local desktop | 100 | 100 | 100 | 100 |
| Preview mobile | 98 | 100 | 96 | 69 |
| Preview desktop | 100 | 100 | 96 | 69 |

Les deux commandes distantes sortent1 : le seuil95 sur quatre axes n'est **pas** satisfait. Le seul audit SEO rouge est `is-crawlable`, source `x-robots-tag: noindex, nofollow`, obligatoire. Le seul audit bonnes pratiques rouge est `errors-in-console`, beacon Cloudflare `cloudflareinsights.com/cdn-cgi/rum` bloqué CORS. Aucun retrait du noindex ni baisse de seuil. Le score automatique100 accessibilité ne vaut pas certification WCAG ou recette lecteur d'écran.

## Réserve nouvelle — seek à froid

Contrôle supplémentaire après les suites : `Range: bytes=0-1023` renvoie200 et2925093octets sur R8, pas206/1024octets. Témoin R7 sur la même preview :200 également. Le fichier retourné porte bien le noindex. Une sonde Chromium en nouvelle page, dès readyState>=2, demande currentTime41 ; `seeked` se déclenche mais currentTime revient0, bufferedEnd18.906, readyState4, errornull. Reproduit deux fois. **Un événement seeked ne prouve pas le déplacement.** Les étapes suivantes de la sonde sont non jouées après ce rouge.

La lecture continue45s, Space lecture/pause et les sous-titres restent prouvés ; le seek à froid ne l'est pas. La cause serveur exacte, le seek après téléchargement complet et le geste natif de scrub restent à diagnostiquer, sans inventer que toute navigation temporelle est cassée. Pas de modification d'infrastructure ni faux header Accept-Ranges pour cacher le défaut.

Correctif spécialisé `t_89a7f08e` dépend de cette phase et retient désormais la revue finale `t_69fbf26b`. Celle-ci doit utiliser l'URL suivante après ce correctif, pas approuver automatiquement cette preview.

## Écran et limites

Captures Chromium headful ouvertes et examinées : hero320 local, lecteur1440 local et distant, preuve02 à375 et1440 distante, frame de lecture distante vers30s. Le cartouche supérieur droit R5/Denise est absent, contrôles et sous-titre natif visibles, aucune légende sous les médias. La mesure DOM complète l'image, qui ne prouve pas l'absence d'écouteur.

Les microtextes **dans** les illustrations sont peu lisibles à375px : limite conservée conformément à la demande d'images statiques sans agrandissement. Le texte alternatif est présent. Les autres mentions techniques incrustées en haut à gauche de la vidéo (« Script, voix, musique et raccords à valider · Schéma conceptuel ») sont volontairement inchangées dans R8, hors retrait du cartouche supérieur droit.

Pas de Safari/iOS, lecteur d'écran, mesure terrain ni nouvelle audition humaine revendiqués. L'accord audio R7 reste celui de Kevin, avec identité AAC/PCM mesurée. Validation juridique/éditoriale et go production distincts.

## Reproduction et artefacts

```sh
node scripts/import-r8-media.mjs /Users/kevinkitanga/dev/interne/memlia-video/out/r8
npm run check
npm run build
QA_URL=http://127.0.0.1:4337 npm test
python3 scripts/verify-r8-integration.py
QA_URL=https://7e55394e.memlia.pages.dev npm test
QA_URL=https://7e55394e.memlia.pages.dev node scripts/verify-preview.mjs
QA_URL=https://7e55394e.memlia.pages.dev node scripts/verify-remote-media.mjs
QA_URL=https://7e55394e.memlia.pages.dev QA_OUTPUT=.qa/m4-r4/r8-remote-screens node scripts/verify-static-media.mjs
QA_URL=https://7e55394e.memlia.pages.dev QA_OUTPUT=.qa/m4-r4/r8-remote-playback node scripts/capture-integrated.mjs
node .qa/m4-r4/verify-remote-seeks.mjs # rouge documenté, correctif enfant
```

- Manifeste actif `media-manifest.json`, mesure indépendante `r8-independent.json`, HTTP médias `remote-media.json` dans ce dossier.
- `.qa/m4-r4/r8-*` : logs actuels, résultats suites, HTTP et captures ; résultats intermédiaires gardés séparés.
- Lighthouse : `.lighthouse/mobile-2026-09-09T05-48-01-402Z.json`, `desktop-2026-09-09T05-48-20-289Z.json`, `mobile-2026-09-09T05-53-13-086Z.json`, `desktop-2026-09-09T05-53-26-043Z.json`.
- Archive de livraison `.qa/m4-r4-preuves-r8.zip` : captures distantes, rapports/logs des deux passes, preuves négatives et manifeste SHA par entrée. Pas de données client.

## Auto-évaluation

| Axe | Note /5 | Preuve et amélioration |
|---|---:|---|
| Exactitude | 4 | SHA/pixels/DOM nomment le candidat ; seek rouge et Lighthouse69 restent explicites |
| Complétude | 4 | Nettoyage demandé éprouvé ; réserve de diffusion confiée au correctif avant revue |
| Clarté | 4 | Preview utilisable et limites distinguées ; historique intermédiaire reste long |
| Actionnable | 4 | URL, scripts et captures disponibles ; validation finale attend F1 |
| Concision | 4 | Handoff court mais rapport détaillé pour reproductibilité |

Moyenne4,0/5. Priorités : fermer le seek à froid, puis revue croisée et validation visuelle Kevin. Pas d'auto-approbation finale.
