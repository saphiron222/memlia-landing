# Recette M4-R3 — 9 septembre 2026

## Candidat remis à la revue croisée

- Carte : `t_f16e5a39` ; revue existante : `t_69fbf26b` (Claude).
- Worktree : `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_f16e5a39`.
- Branche Git : `wt/t_f16e5a39`. Intégration initiale : `a6eaebf` ; le commit qui porte cette recette ajoute le poster optimisé et les preuves finales.
- Preview immuable finale : https://bbade7ba.memlia.pages.dev ; alias https://preview-m4-r3.memlia.pages.dev.
- Branche Cloudflare dédiée : `preview-m4-r3`. Aucun push, merge main ni production.

## Trois passes exécutées

| Contrôle | Résultat |
|---|---|
| `npm run check` | 0 erreur, 0 warning, 1 hint historique dans Lighthouse |
| `npm run build` | 7 pages, 25 tests Python, oracle 23 images |
| `QA_URL=https://bbade7ba.memlia.pages.dev npm test` | 44/44 Playwright, dont les 8 nouveaux cas média |
| `scripts/verify-preview.mjs` | 12/12 routes : status attendu, noindex, équivalence au build hors beacon Cloudflare explicitement compté |
| `scripts/verify-remote-media.mjs` | 25/25 médias téléchargés et hashés ; 1 script Markdown documentaire hors périmètre public |
| Manifeste des sources | 13 copies exactes, 13 dérivés déclarés ; vidéo R7 intacte |
| Post-build | 78 anciens assets et 20 briefs exclus, 12 dérivés blog attendus et présents |
| Écran | Chromium réel, captures desktop1440/mobile375 ; tests 320/375/768/1024/1440/1920, clavier et reduced motion |
| Lecture complète | 45s, 1350 frames, 18 frames perdues à la dernière mesure, 20 sous-titres FR actifs, 1 113 066 octets audio décodés, non muet |

La lecture est déclenchée par Espace après focus du lecteur. Une capture à30s montre « Traitement suspendu. » et le sous-titre « Le traitement s’arrête. ». L’état `ended=true` est observé après45s, pas simulé. L’audio est décodé et actif ; aucune audition humaine nouvelle n’est revendiquée. Kevin a approuvé R7 en amont.

Les tests contrôlent également : panne réseau vidéo et accès à la transcription/téléchargement, fonctionnement sans JavaScript, noms accessibles, alt, 9 preuves distinctes, descriptions HTML et liens d’agrandissement, absence de photos rejetées, H1/CTA/tagline, anti-catalogue récursif, FAQ DOM/JSON-LD, articles, RSS/sitemaps/llms et pages légales. Le bilan fictif est recalculé indépendamment :48=47+1. Les20cues sont relues depuis VTT et comparées au texte HTML.

## Lighthouse — ne pas confondre candidat et preview

| Surface | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---:|---:|---:|---:|
| Candidat local indexable, mobile | 100 | 100 | 100 | 100 |
| Candidat local indexable, desktop | 100 | 100 | 100 | 100 |
| Preview finale noindex, mobile | 98 | 100 | 96 | 69 |
| Preview finale noindex, desktop | 100 | 100 | 96 | 69 |

Rapports bruts finaux : `.lighthouse/mobile-2026-09-09T04-46-48-614Z.json`, `desktop-2026-09-09T04-47-01-459Z.json`, `mobile-2026-09-09T04-47-13-986Z.json`, `desktop-2026-09-09T04-47-27-657Z.json`.

Le seuil95 sur les quatre axes est démontré pour le candidat indexable. Sur la preview, Lighthouse sort volontairement en erreur sur SEO : `X-Robots-Tag: noindex, nofollow` est la protection demandée. La meta locale indexable n’annule pas cet en-tête restrictif, relu sur la preview finale et signalé à l’opérateur. Ce résultat n’est pas présenté comme un SEO distant vert. Les bonnes pratiques96 proviennent du beacon analytics injecté par Cloudflare (erreur CORS), absent du build ; il reste au-dessus du seuil.

Historique non masqué : avant optimisation, mobile distant94 sur trois mesures isolées ; desktop distant70 avant préchargement. Correction : preload high puis dérivé poster1200×675/qualité90, sans recadrage,24 482octets au lieu de136 132. L’original approuvé reste intact et hashé. Pas de modification des paramètres Lighthouse ni suppression de l’analytics par interception du test.

## Preuves livrées

- `media-manifest.json` : sources, chemins, tailles et SHA256 des26entrées.
- `remote-media.json` :25URLs et SHA256 effectivement relus.
- `.qa/m4-r3-preview-final.json` :12routes et en-têtes noindex.
- `.qa/m4-r3-delivery/screen-report.json` : captures, neuf preuves dans deux largeurs, état réel de lecture et erreurs JS observées.
- `.qa/m4-r3-preuves.zip` : captures et rapports nécessaires à la revue (généré à la clôture).
- `docs/design/m4-r3/integration.md` : matrice complète et choix d’intégration.

## Réserves explicites, sans dette cachée

- Microtextes des références illisibles en miniature mobile : agrandissement de l’image, descriptions HTML, plein écran vidéo et transcription disponibles. Cadres et CTA sans chevauchement observé.
- Les annotations historiques R5/« à valider » appartiennent au poster R7 approuvé ; elles ne sont ni effacées ni une substitution par les dossiers R4/R5.
- Pas de recette Safari/iOS ni lecteur d’écran revendiquée. Validation éditoriale et juridique humaine requise avant production.
- Certains composants/styles historiques non importés restent dans les sources ; aucun média rejeté n’est livré dans `dist`. Aucun nettoyage adjacent hors demande.
- Revue croisée de l’enfant précréé puis validation Kevin ; aucune autorisation de publication implicite.
