# Recette — lecteur R8 dirigé du hero

Date : 12 septembre 2026
Carte : `t_dd5e7251`
Candidat fonctionnel : `e8eb2a7`
Preview immuable : <https://cbf3f3a6.memlia.pages.dev>
Alias : <https://preview-site-video.memlia.pages.dev>

## Périmètre livré

Le lecteur R8 démarre automatiquement sans son et boucle tant que l’utilisateur n’a pas activé le son. L’overlay centré reprend la charte Memlia et expose uniquement `Activer le son` avec l’aide `La vidéo redémarrera depuis le début.`. L’activation repart de zéro, coupe la boucle, active le son puis masque l’overlay.

La surface vidéo ne propose aucun contrôle natif. Un clic, Entrée ou Espace bascule uniquement pause/reprise, avec focus visible et libellé ARIA d’état. `prefers-reduced-motion: reduce` maintient le poster à l’arrêt et conserve l’action explicite. Les refus d’autoplay et erreurs média rendent un état `status` actionnable ; le fallback sans JavaScript garde le téléchargement et le VTT reste `default`.

## TDD et suites

| Contrôle | Résultat frais |
|---|---:|
| Rouge ciblé avant implémentation | 11/11 échecs attendus |
| Ciblé local après implémentation | 11/11 |
| `npm run test` sur `dist` frais | 79/79 |
| `npm run check` | 0 erreur, 0 warning, 1 hint hérité |
| `npm run build` | 7 pages, Python 37/37, images 23/23, preview-export 3/3 |
| Ciblé sur preview immuable | 11/11 |

Le test ciblé couvre l’autoplay muet, la boucle, le redémarrage à zéro avec son, la disparition de l’overlay, l’absence de contrôles natifs, clic/Entrée/Espace, les deux libellés ARIA, les six largeurs reduced-motion, le refus d’autoplay, l’erreur média et le fallback sans JavaScript.

## Passe écran et responsive

La sonde ciblée `.qa/site-video/responsive.json` mesure les largeurs 320, 375, 768, 1024, 1440 et 1920 : 6/6 sans débordement, sans erreur de page, lecteur contenu dans le viewport, `controls=false`, lecture muette et boucle actives en régime normal.

Captures relues après la fin de l’animation du hero :

- `.qa/site-video/375-hero-viewport.png` et `.qa/site-video/375-hero-player.png` ;
- `.qa/site-video/1440-hero-viewport.png` et `.qa/site-video/1440-hero-player.png`.

L’overlay, son bouton et son aide sont nets, entièrement lisibles et centrés aux deux largeurs. Aucun contrôle natif, orange, halo néon, débordement ou chevauchement indésirable n’est visible.

Le script générique `npm run qa:screens` s’est arrêté sur `Révélations incomplètes avant capture`, avant production de sa preuve. Ce défaut hors hero n’a pas été masqué ni corrigé hors périmètre ; la sonde ciblée ci-dessus remplace explicitement cette passe pour la carte.

## Intégrité média et preview

Preuve HTTP : `.qa/site-video/preview-http.json`.

| Invariant | Résultat |
|---|---:|
| Header `X-Robots-Tag: noindex, nofollow` | 2/2 hôtes |
| Meta `robots=noindex, nofollow` | 2/2 hôtes |
| Quatre chemins R7 | 8/8 réponses 404 |
| Quatre assets R8 | 8/8 réponses 200 |
| SHA-256 R8 source = dist = hôtes | 8/8 correspondances distantes |

SHA-256 R8 scellés :

- MP4 : `164f6090f7d7a820d544d6679e5f68257fb4f929fe35079b5ce9a22ef86585e4` ;
- VTT : `9526c00b857eed59ded3c58aa8e27ef3191aa4e8ddf11883a4a55fca12ecc3a9` ;
- poster 1200 : `ea70ca8acfcef091a5f9879dcc9023002a777cfa8c2b73f83c4cb89bb31eda7e` ;
- poster original : `c549233d274e7ec926f2e2de296436a0c510ddeeeda1ec1ecbfe06de21a9d1f1`.

## Revue interne

La revue Standards n’a trouvé aucune violation bloquante ou importante ; elle signale seulement de petites répétitions de préparation dans les tests, conservées pour leur lisibilité locale. La revue Spec questionne l’absence d’`autoplay` dans le HTML initial. Cette décision est volontaire : l’attribut est posé uniquement après vérification de `prefers-reduced-motion`, ce qui empêche un départ anticipé contraire à la préférence ; le régime normal et le régime réduit sont tous deux joués en navigateur. Sans JavaScript, le lecteur ne démarre pas et propose le téléchargement.

Aucune production, fusion de `main` ou poussée n’a été effectuée.
