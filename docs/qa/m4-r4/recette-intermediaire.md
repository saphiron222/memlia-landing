# M4-R4 — nettoyage des médias, attente R8

## Statut au 9 septembre 2026, 06:18 WAT

Correctif HTML/CSS terminé au commit local `93254d4`, sur `wt/t_f16e5a39`. **Carte non terminée** : le retour Kevin reçu pendant la recette impose désormais R8 à la place de R7 (parent `t_421d6828`). Ne pas présenter cette preview comme finale.

Preview intermédiaire, créée **avant réception** de cette nouvelle consigne : https://da46bff3.memlia.pages.dev ; alias https://preview-m4-r4.memlia.pages.dev. Aucun push, main ni production.

## Périmètre corrigé

- Les neuf `ProofMedia` sont uniquement des figures contenant une image informative, responsive, avec alt. Ancres d’agrandissement, détails, légendes et disclaimers supprimés.
- Texte d’aide, transcription et téléchargement sous le hero supprimés. Le lecteur garde son nom accessible, ses contrôles natifs, le focus visible et le track FR. La référence `aria-describedby` devenue orpheline est retirée. Le fallback interne à `<video>` ne renvoie plus vers une transcription absente.
- Aucun changement de H1, CTA, tagline, blog ou fichiers média. `git diff e76c590 HEAD -- public src/content src/data src/pages` est vide.
- Les trois liens historiques « Lire le détail » des repères de méthode ne sont pas les microliens ajoutés sous les images en M4-R3 : ils appartiennent à la copy principale, hors suppression. Les champs `title/detail` désormais inutilisés de `src/data/proofs.ts` sont signalés, non nettoyés.

## Preuves rejouées sur ce candidat intermédiaire

| Contrôle | Résultat |
|---|---|
| Rouge sur M4-R3 avant modification | Python : 3 échecs ciblés sur 26 ; Playwright320 : 1 échec, trouve les deux blocs supprimables |
| Astro check | 0 erreur, 0 warning, 1 hint historique Lighthouse ; 64 fichiers |
| Build | 7 pages ; Python26/26 ; oracle23 images |
| Playwright local | 44/44 puis 8/8 médias après renforcement du parcours Tab complet |
| Playwright preview | 44/44, dont 6 largeurs320/375/768/1024/1440/1920, panne vidéo et sans JS |
| Figures × largeurs | 9 × 4 = 36, à320/375/768/1440, local et distant |
| CDP écouteurs | 72 cibles (figure+image) examinées en distant, 0 écouteur ; clic/Entrée/Espace sans navigation, onglet ni dialogue dans Playwright |
| Images au clavier | Aucun focus au clic/Tab/focus programmatique ; parcours Tab revient au premier élément et atteint le lecteur |
| Captures | 48 locales et48 distantes ; hero375 local, preuve02 desktop, hero320 distant et lecteur1440 distant examinés visuellement |
| HTTP preview | 12/12 routes relues, noindex et équivalence au dist ; beacon Cloudflare compté explicitement |
| Médias distants | 25/25 téléchargés et SHA256 comparés ; 1 document non public exclu et compté |
| Lighthouse local | Mobile100/100/100/100 et desktop100/100/100/100 |

Le retrait du texte HTML supprime l’ancien oracle arithmétique fondé sur sa transcription : il n’est pas crédité à cette passe. La chaîne SHA des images reste vérifiée ; aucune valeur n’a été régénérée. Le contrôle VTT conserve20 cues non vides ordonnées dans45s, sans exiger leur duplication HTML. Vidéo démarrée/pausée par Espace, sous-titres chargés20 ; pas de nouvelle lecture intégrale45s ni audition humaine revendiquée dans cette passe.

## Artefacts

- `.qa/m4-r4/python-red.log`, `playwright-red.log` : rouge préalable.
- `.qa/m4-r4/playwright-remote.json` :44 tests.
- `.qa/m4-r4/preview-http.json` :12 routes, hashes et noindex.
- `remote-media-intermediate.json` :25 médias distants, URL intermédiaire.
- `.qa/m4-r4/local-screens/` et `.qa/m4-r4/screens/` :48 captures et rapport CDP par environnement.
- `.lighthouse/mobile-2026-09-09T05-17-07-388Z.json`, `desktop-2026-09-09T05-17-19-886Z.json` : audits locaux actuels.

Le script historique `verify-remote-media.mjs` écrit dans `docs/qa/m4-r3/remote-media.json` : résultat R4 copié ici, historique restauré et diff nul vérifié. `prepare-preview.mjs` imprime encore le nom de branche R3 ; la commande réellement exécutée utilise la branche explicitement autorisée `preview-m4-r4`.

## Reprise obligatoire après R8

1. Lire le handoff `t_421d6828`, vérifier les chemins et empreintes `out/r8/`, ne pas écraser R7.
2. Intégrer MP4 + poster corrigés dans un chemin public versionné R8 ; reprendre VTT vérifié. Mettre à jour preload, sources hero, scripts d’import/contrôle et contrats de tests/manifeste sans altérer les preuves/blog. Le dérivé poster1200 garde l’optimisation de diffusion, source corrigée traçable.
3. Rejouer check/build/Python/Playwright, chaîne média, lecture intégrale, captures et accessibilité. Mesurer aussi Lighthouse distant sur la nouvelle preview ; ne jamais retirer son noindex pour obtenir un score SEO vert.
4. Commit local, nouvelle preview, relire DOM/headers/hashes et regarder les frames/poster sans cartouche. Archiver les preuves finales, compléter contexte/journal.
5. Clôturer uniquement après ces passes : cela libère la revue précréée `t_69fbf26b`, sans dupliquer une revue de la même carte.

Le cartouche « R5 · ANIMATIQUE DE REVUE · DENISE » est encore visible dans le poster de la preview intermédiaire, confirmé à l’écran. Il n’est pas du HTML. R8 doit le retirer à la source, jamais via CSS. Les microtextes internes aux illustrations sont petits sur mobile ; leur zoom volontairement supprimé n’est pas revendiqué comme disponible. Pas de recette Safari/iOS ni lecteur d’écran.
