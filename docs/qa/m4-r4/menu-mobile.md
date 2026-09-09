# M4-R4-F2 — Menu mobile réellement peint

Carte `t_98a0d067`, 2026-09-09. Worktree `wt/t_f16e5a39`, base `78832de`.

## Verdict de phase

Correctif local terminé ; revue croisée `t_69fbf26b` et nouvelle preview `t_ca174e4d` précréées en aval. **Aucun push, fusion main, déploiement ou publication dans cette carte.** L’ancienne preview `https://b2bf0d1e.memlia.pages.dev` ne contient pas ce correctif et ne doit pas être présentée comme finale.

R8, neuf preuves statiques, textes et navigation desktop conservés. La réserve de seek vidéo relève toujours de `t_89a7f08e`, hors de cette carte.

## Cause reproduite, et non présumée

`Nav.astro` plaçait un panneau `position:fixed;top:var(--nav-h);bottom:0` dans un header sticky portant `backdrop-filter` et `-webkit-backdrop-filter`. Sous WebKit 26.6, ce header devenait le contenant du fixed : à 390×844, panneau **y56/h45**, bas101 ; les boîtes des sept liens existaient mais étaient rognées. Les hits à y150/350/650/820 revenaient au contenu principal.

Contre-épreuve A/B sans édition produit : enlever uniquement le filtre du header donne **y56/h788**, bas844, cinq hits sur cinq dans le menu. Chromium153 et Firefox155 locaux avaient déjà h788, sans reproduire cette erreur. Ne pas attribuer cette mesure aux appareils réels de Kevin ni exclure d’autres navigateurs sur iOS.

Le nouveau test WebKit a rougi avant le correctif : bas101 reçu,844 attendu. Les captures originales montrent « Usages » et le hero derrière. `toBeVisible` seul n’aurait pas réfuté le défaut.

Sources : `.qa/t_98a0d067/diagnosis.json`, `red.log`, `red.json`, `*-original.png`, `*-without-filter.png`.

## Correction chirurgicale

- Panneau rendu **frère** du header : plus aucun ancêtre filtré entre lui et le viewport.
- Header z50, panneau z49 ; panneau crème explicite `#fffefb`, header ouvert opaque sans filtre. Header fixé uniquement pendant l’ouverture mobile ; rendu desktop conservé.
- Hauteur `100dvh`, repli `100vh`, déduction de la hauteur de header et de sa bordure ; safe areas top/right/bottom/left par `env`. Scroll interne et confinement du défilement vertical.
- Six liens 16px, cibles≥44px ; CTA mobile16px/≥44px, retour à la ligne possible à320px, dans le flux sous les liens. Burger/X44px.
- Fond `inert`, body fixé avec position de défilement mémorisée ; restauration immédiate avant action native d’un lien. États `inert` préexistants et variable inline conservés.
- État unique `menu.hidden` ; `aria-expanded`, `aria-controls`, labels ouvrir/fermer, SVG exclusifs. Tab/Shift+Tab contenus dans burger+sept liens, Escape/X referment et rendent le focus ; passage desktop et `pagehide` libèrent le fond.
- Safari pouvait ignorer les liens dans le parcours Tab natif : le test clavier a rougi, puis le parcours de toute la boucle a été explicité. Aucun raccourci clavier global quand le menu est fermé.

Aucune refonte visuelle : palette, police Hanken, alignements et libellés existants conservés. Les anciens sélecteurs de dropdown morts sont seulement signalés, non supprimés.

## Passe 1 — Suites réellement exécutées

| Commande / oracle | Résultat |
|---|---:|
| `npm run check` | 0 erreur / 0 warning / 1 hint hérité |
| `npm run build` | 7 pages |
| `npm run test:proof` | 26/26 |
| Oracle images exécuté par build | 23/23 |
| `QA_URL=http://127.0.0.1:4337 npm test` | 59/59 |
| `QA_URL=http://127.0.0.1:4337 npx playwright test --config playwright.mobile.config.ts` | 45/45 |
| Échecs / ignorés / flaky finaux | 0 / 0 / 0 |

Les15tests menu sont présents dans la suite normale Chromium et dans la configuration dédiée aux3moteurs : **ne pas additionner les suites comme des scénarios distincts**. Les anciens44tests sont conservés, avec adaptation du seul test de focus menu au fond désormais inerte.

Matrice : **3 moteurs ×4largeurs (320/375/390/430) ×3hauteurs (360/568/844) =36cas de peinture**, plus9cas de comportement. **252 actions** mesurées, fonte minimale16px, cible minimale44px. À568/844px, les six liens+CTA sont visibles sans scroll ; à360px, chaque lien puis le CTA est mesuré après scroll interne.48captures de matrice, aucun doublon de combinaison.

Vérifications : grille9hits sur le panneau, colonne entière de pixels crème, rects inclus et3hits par action, non-chevauchement, ordre des6libellés, burger/X exclusifs ; boucle Tab complète, Tab arrière, focus interdit dans main, geste de molette sur fond verrouillé, retour scroll720, Escape/X, ancre Questions, CTA, navigation Blog, resize ouvert puis desktop/mobile et préservation d’un inert antérieur. Reduced-motion activé sur la matrice ; comportements également joués sans réduction.

Piège de harnais corrigé : le CTA réel est Cal.com, pas `#demo`. Premier test erroné a seulement ouvert la page externe, sans réservation ni envoi. Le test final intercepte cette destination avant réseau (réponse204) et compte la requête attendue ; il ne teste ni ne sollicite le service Cal.com.

## Passe 2 — Chaîne indépendante

Sujet servi : `http://127.0.0.1:4337`, HTML comparé octet par octet à `dist/index.html`.

- SHA256 HTML : `650bba56257b3203007bff36c81816ff994cd4d891a41e5878842394363f7a03`.
- Trois navigateurs **avec fenêtre**, ouverture réelle puis Tab : panneau y57/h787, bas844, focus Usages, main inerte, hit panneau.
- Mesure indépendante d’une zone vide386×200 : **77200/77200pixels crème sur chaque moteur**.
- Témoin : fond rendu transparent en mémoire du navigateur, différences positives sur chaque moteur ; remise de la couleur puis retour exact aux pixels nominaux. Le témoin n’est jamais écrit dans le produit.
- Comparaison à l’ancienne preview en lecture : `main.outerHTML` strictement identique ; SHA256 `82845aea55227ca394833866b4336a2652d6ea362111fea16e7503387dbd5506`.
- Header desktop1440 comparé au pixel brut : **identique**. Pas de modification des médias, du blog ou du hero ; oracle26vérifie de nouveau le manifeste média scellé et les preuves statiques.

Script indépendant et valeurs : `.qa/t_98a0d067/screen-proof.mjs`, `screen-proof.json`. Agrégation des rapports réelle par `summarize.py` ; `summary.json`, `measurements.json`, `capture-manifest.json`.

Limite d’instrument documentée : première sonde indépendante lisait un PNG RGBA comme RGB ; elle a rougi, puis normalisation explicite `removeAlpha` avant nouvelle mesure. Les tests de matrice normalisaient déjà les canaux.

## Passe 3 — Écran

Captures headful réellement ouvertes et inspectées : `chromium-final-focus.png`, `firefox-final-focus.png`, `webkit-final-focus.png`, `webkit-final-short.png`. Six liens+CTA visibles, fond opaque, aucun hero visible derrière, X accessible, focus Usages distinct. À320×360 après défilement : Intégration→Blog et CTA restent lisibles, CTA sur2lignes, X fixe.

Focus CTA vérifié par Shift+Tab réel, après **fin de transition** : `:focus-visible=true` et double anneau crème1px/vert3px sur les3moteurs. Capture courte relue avec anneau visible ; ne pas confondre une capture pendant la transition avec son état stabilisé.

## Limites et passation

- WebKit de bureau avec viewports mobiles n’est pas un iPhone physique. Safe areas non nulles et barres Safari/iOS dynamiques réelles restent à relire par Kevin sur la preview aval ; aucun test appareil physique ou VoiceOver revendiqué.
- Pas de nouvelle mesure Lighthouse ni de nouvelle audition/lecture vidéo45s ; médias inchangés et suites existantes rejouées, pas de crédit historique recopié.
- Correctif limité à `src/components/Nav.astro`, `tests/browser/mobile-menu.spec.ts`, `tests/browser/review.spec.ts`, `playwright.mobile.config.ts`, présent rapport. Commit local par pathspec, pas d’autre source embarquée.
- **Hotspot** : `.claude/tasks/context_session_1.md` déjà modifié par la revue parent à l’entrée ; son bloc et le rapport `docs/qa/m4-r4/revue-t_c5104f9c.md` sont conservés, non attribués à ce correctif. La passation de cette carte est ajoutée au contexte partagé mais laissée non commitée pour ne pas embarquer la modification d’autrui.
- Prochaine action : nouvelle preview noindex par `t_ca174e4d`, réexécution de la configuration multi-moteurs avec `QA_URL` distant, puis revue Claude `t_69fbf26b`. Ne pas restaurer R7 ni les microtextes retirés.
