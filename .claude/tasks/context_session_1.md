# context_session_1 — SEO/GEO audit loop (memlia-landing)

## Hermes — 2026-09-09 — nettoyage des annotations des neuf preuves

- Carte `t_3fa941a1`, branche `site/nettoyage-annotations-preuves`, produit `4d8b8d8`. Preview uniquement : https://fb1e3ae7.memlia.pages.dev, branche Cloudflare `preview-nettoyage-annotations-preuves`, type Preview relu ; aucun push/main/production.
- 36 libellés des quatre coins + `Brouillon partagé` retirés. HTML/CSS d'origine non versionnés rapatriés, polices locales, reflow neuf compositions, neuf PNG/WEBP et douze couvertures dérivées de 06/09 régénérés. Texte central exact, gardes-fous, versions, alt et layout intacts ; HTML identique à7ec1d409 après1blocAnalytics compté.
- Check0erreur/0warning/1hint hérité, build7pages/Python32/images23, Playwright64local+64preview. Recalcul9PNG/21actifs identiques,40poisons rejetés/restaurés ;200nœudstexte contrôlés. HTTP12équivalents/noindex,25médiasSHA ;45relevésDOMidentiques sur5largeurs,50captures locales+50distantes,inspection individuelle9images.
- Total9WebP317480octets(+7,54%),1600×900. Rapport `docs/qa/annotations-preuves/recette.md`, preuves `.qa/annotations/`, planche `avant-apres.jpg`. Revue Claude précréée `t_512011a3` puis Kevin ; aucune validation humaine revendiquée.
- Pièges : curseur01 masquait2boutons, corrigé/oracle rouge-vert ; capture planche défilante divergeait de1niveaucouleur, origine fixe puis octets identiques. Le build vérifie8sources+9PNG scellés sans exigerChromium ; recette complète `npm run test:proof-render`. Ne pas lancer l'importR7 historique, ne pas se fier au message `preview-m4-r4` du préparateur : branche Wrangler explicite ci-dessus. Microtextes mobile nonzoomables conservés selon arbitrage antérieur.

## Hermes — 2026-09-09 — M4-R4, correction globale des repères

- Candidat courant `d291abe`, https://b2bf0d1e.memlia.pages.dev (`preview-m4-r4`). Trois liens résiduels `Lire le détail` supprimés ; périmètre antérieur trop étroit explicitement corrigé. Test global sans suffixe : rouge Python1/PW1, puis Python26/images23/Playwright44local+44distant. H1/CTA/blog/médias/R8 intacts ; comparaison DOM des deux previews identique hors3liens exclus,3cibles conservées.
- Check/build verts ; CDP36figures/72cibles et52captures par environnement ; HTTP12noindex/équivalents,25médiasSHA. Chaîne indépendante1350framesR8/témoinR7, son/VTT identiques et poster418 rejoués. Lecture distante45s/20cues,1350frames/35perdues. Lighthouse local100partout ; distant98/100/96/69 et100/100/96/69, noindex/beaconCORS documentés.
- Preuves `.qa/m4-r4/global-fix/`, rapport `docs/qa/m4-r4/recette.md`. R8 remplace R7 par consigne opérateur, ne pas restaurerR7. Ancienne preview7e55394e insuffisante. Les styles morts préexistants `.preuves-embleme/.repere-chiffre` restent signalés, non supprimés.
- Suite précréée inchangée : F1 `t_89a7f08e` pour seek à froid, puis revue `t_69fbf26b`. Phase nettoyage terminée, pas de validation globale ni correction seek revendiquée ; aucun push/main/production.

## Hermes — 2026-09-09 — M4-R4, R8 intégrée

- **Blocage administratif de fin** : deux refus du juge `kanban_complete`, motif R8 contraire au corps initial R7, malgré rappel du commentaire opérateur06:15 et parentR8. Ne pas restaurer R7 ; demander opérateur actualisation du goal et clôture de phase. F1 `t_89a7f08e` reste donc en todo derrière cette carte. Livrables locaux vérifiés, upload via completion non confirmé.

- Carte `t_6900a385` : nettoyage `93254d4`, intégration média `19a6c03`. Preview actuelle https://7e55394e.memlia.pages.dev (`preview-m4-r4`), R8 sans cartouche supérieur droit. Sources R7, preuves, blog, H1/CTA/tagline inchangés. Ne pas relancer l'import historique R3 pour le candidat courant ; `scripts/import-r8-media.mjs` produit le manifeste R4.
- Check0erreur/1hint, build7pages/Python26/images23, Playwright44local+44distant. CDP36figures/72cibles sans écouteur sur4largeurs ;48captures par environnement. HTTP12équivalents/noindex,25médiasSHA ;1350framesR8 sans cartouche avec témoinR7 positif, AAC/PCM/VTT identiques, poster vraie frame418. Lecture45s locale/distance,20cues ; distant1350frames/0perdue.
- Lighthouse local99/100/100/100 mobile,100partout desktop ; preview98/100/96/69 et100/100/96/69. SEO69=noindex requis, BP96=beaconCloudflare CORS ; ne pas les masquer.
- **Réserve nouvelle** : réponse200 àRange surR8 et témoinR7. Seek àfroid vers41s revient0 (buffer18.906), malgré `seeked`. Correctif enfant `t_89a7f08e` (Claude) créé, puis revue `t_69fbf26b` dépend deF1. Ne pas approuver globalement cette preview ni confondre lecture complète et seek. Sonde rouge `.qa/m4-r4/verify-remote-seeks.mjs` et logs gardés.
- Rapport `docs/qa/m4-r4/recette.md`, manifeste et `r8-independent.json` ; archive `.qa/m4-r4-preuves-r8.zip`. Images volontairement non zoomables, microtextes internes petits surmobile ; autres annotations vidéo hautgauche hors périmètre. Pas de Safari/iOS/lecteur d'écran/nouvelle audition humaine. Aucun push/main/production.

## Hermes — 2026-09-09 — M4-R4, attente vidéo R8

- Carte `t_6900a385`, correctif commité `93254d4` sur `wt/t_f16e5a39`. Neuf preuves strictement statiques, alt conservés ; plus de légende, détails, liens d’agrandissement, transcription ni aide sous le hero. H1/CTA/tagline/blog/médias inchangés.
- Preview **intermédiaire** créée avant le nouveau retour Kevin : https://da46bff3.memlia.pages.dev, branche `preview-m4-r4`. Ne pas la qualifier de finale : R7 contient le cartouche incrusté rejeté. Parent R8 `t_421d6828` ajouté par l’opérateur ; attendre sa livraison puis remplacer MP4/poster, versionner les chemins et mettre à jour tests/manifeste/preload.
- Mesures actuelles : rouge préalable Python3échecs/26 et Playwright320rouge ; check0erreur, build7pages/Python26/images23 ; Playwright44local et44distant, parcours Tab complet renforcé rejoué. CDP36figures/72cibles sans écouteur,48captures locales et48distantes,12routes noindex identiques,25médias distants hashés. Lighthouse local100/100/100/100 sur mobile/desktop. Pas de nouvelle lecture45s ni Lighthouse distant crédités.
- Rapport et reprise détaillée : `docs/qa/m4-r4/recette-intermediaire.md`, `.qa/m4-r4/`. Le script `verify-remote-media.mjs` écrit dans le rapport historique R3 : copier le résultat R4 puis restaurer l’historique, déjà fait ici avec diff nul. Les champs `title/detail` de proofs.ts sont désormais non utilisés, laissés en place hors nettoyage.
- Suite : dépendance automatique R8, intégration et trois passes finales puis clôture pour libérer l’enfant revue Claude `t_69fbf26b`. Aucun push/main/production ; microtextes à l’intérieur des images non zoomables selon demande, contrôles vidéo natifs gardés.

## Hermes — 2026-09-09 — M3-S-F1, correctifs après revue

- Carte `t_81c6b3c2`, même candidat/branche que M3-S. La revue a invalidé l’affirmation historique « toutes les surfaces » : mentions légales, confidentialité et 404 conservaient le vocabulaire Excel/modules ; trois textes corrigés sans toucher au code mort.
- Oracle récursif sur toutes les surfaces texte du dist et attributs publics ; singulier générique permis uniquement par exception fermée. `npm run build` exécute désormais les oracles Python et refuse les régressions lexicales. Python 3 requis au build.
- 15/15 Python, 27/27 Playwright locaux et 27/27 distants, check 0 erreur/0 warning/1 hint hérité, build 4 pages. Ancien contenu rouge sur les trois pages, trois mutations de fichier imbriqué rejetées, restauration verte.
- Nouvelle preview : https://1dd069c7.memlia.pages.dev ; 8 routes relues/équivalentes, noindex header sur 7 réponses 200 et meta sur la 404. 9 captures, 6 distantes relues à 375/1440, aucun chevauchement constaté sur les corrections.
- Rapport `docs/qa/2026-09-09-m3-s-f1.md`, preuves `.qa/m3-s-f1-preuves.zip`. Revue Claude déjà reliée via l’enfant `t_e64c75cd` : terminer F1 libère cette revue, pas M4/M5. Aucun push/main/production.
- Pièges : Astro refuse une seconde preview dans le même worktree (serveur existant 4341 réutilisé) ; lien légal « ← Retour à l’accueil » nécessite de ne pas exiger le libellé exact sans flèche. Images/Lighthouse hors correctif, pas de nouvelle mesure créditée.

## Hermes — 2026-09-09 — M3-S automatisation IA (état courant)

- Carte `t_e64c75cd`, base M3-R `76f174d0661896ac75b76d329e03c51019ef1a75`, branche isolée `wt/t_e64c75cd`. Aucun push/main/production.
- Catalogue retiré de toutes les surfaces publiques. Hero, CTA, parcours quotidien/usages/intégration, FAQ, garanties, JSON-LD, llms.txt, OG alignés sur M1-R. Excel n’est plus la catégorie. Charte et garde-fous M3-R conservés.
- Preview : https://3a35d3fd.memlia.pages.dev ; noindex vérifié, 8 routes comparées au build hors bloc Pages Analytics compté.
- Recette : 24/24 Playwright en local et distant, 12/12 Python, 2 mutations rejetées puis restauration. 42 captures aux 7 largeurs ; passe écran effectuée. Lighthouse local mobile et desktop 100 sur les 4 axes, LCP 1654/369 ms, CLS/TBT nuls. Pas de mesure terrain.
- Sept nouveaux briefs IMG-16 à 22 et 34 placeholders ; registre `docs/design/2026-09-09-m3-s-briefs.md`. 48 fichiers images actifs déployés, anciens essais exclus de dist mais conservés en source. OG généré par `scripts/og.mjs`, plus d’ancienne promesse conseil.
- Rapport : `docs/qa/2026-09-09-m3-s.md`. Revue croisée Claude demandée ; M4/M5 attendent son verdict et doivent reprendre ce candidat, pas main ni les anciens briefs modules.
- Pièges : test Python ajouté non découvert par l’ancien script npm (désormais unittest discover) ; Modules.astro archivé mais encore typé par Astro, image gardée par appartenance au registre. Browser Harness indisponible, remplacement réel par Playwright/Chromium. Ancien catalogue et grille restent du code mort signalé, non supprimé.

## Hermes — 2026-09-08 — M3 Astro (historique)

- Migration Astro dans le worktree `t_83ada3bb` : quatre pages, charte Memlia/Navattic,
  copy M1, sept périmètres explicites, FAQ 11 réponses et quatre nœuds JSON-LD,
  collection blog Zod prête mais vide, 44 placeholders et 11 briefs.
- Preview vérifiée : https://f5c68d50.memlia.pages.dev ; alias https://preview-astro-m3.memlia.pages.dev.
- `npm run check` : 0 erreur/0 warning, 1 hint ; build 4 pages ; Playwright 14/14 local
  et distant ; oracle Python 8/8, mutation d’ID module rouge puis restauration verte.
- Lighthouse local mobile/desktop : 100/100/100/100 ; distant mobile : 99/100/96/69.
  Écart SEO = noindex de sécurité injecté sur preview ; bonnes pratiques = beacon Cloudflare CORS.
  Ne jamais retirer noindex pour verdir une preview. Huit routes relues, dont vraie 404,
  HTML identique au build hors un bloc analytics par page normale (hashes bruts conservés).
- Passe écran : six largeurs capturées, hero desktop/mobile et méthode examinés ; correctifs
  propagation des attributs Astro/Picto, burger exclusif, méthode mobile dans le flux,
  ancres FAQ/demo et erreur de fragment `%`. Revue design complète confiée à M3-R.
- Source et preuves : `docs/qa/2026-09-08-m3.md`, `.qa/`, `.lighthouse/`.
- Suite : M3-R `t_9faece2d` reprend le commit M3 avant M4 images et M5 blog ; pas de fusion
  ni push ni production. Configuration Cloudflare prod encore héritée : ne la modifier
  qu’à l’intégration autorisée (build `npm run build`, sortie `dist`).
- Historique ci-dessous conservé, notamment la mention de domaine non résolu : ancien état,
  ne pas le prendre comme diagnostic actuel. Projet Cloudflare réel = `memlia`.

**Started:** 2026-07-03 · **Mode:** `/loop` dynamic (self-paced) · **Model:** Opus 4.8
**Task:** Audit crawlability, indexation, page intent, titles, internal links, structured
data, source citations, answer-first content. Rank gaps by impact, fix the highest-leverage,
re-benchmark, repeat until no critical tech issue remains and every priority query maps to an
answer-ready page.

## Site snapshot
- Static mono-page landing (`index.html`) + 2 legal pages (`noindex`) + `llms.txt`,
  `robots.txt`, `sitemap.xml`, `og-memlia.png`. No build, no deps. Cloudflare Pages.
- Product: **Memlia** — IA opérationnelle pour cabinets d'expertise comptable (FR). Brand new.
- **Domain `memlia.fr` does NOT resolve yet** (not registered/deployed). ⇒ No live SERP/AI-engine
  benchmarking possible. Benchmark = **answer-readiness proxy** until launch.

## Foundations already SOLID (do not "fix")
Title/desc/canonical/robots-meta ✓ · OG + Twitter ✓ · JSON-LD Organization+WebSite+Software
(honest, no fake reviews) ✓ · llms.txt (excellent) ✓ · robots.txt (AI search bots allowed,
Bytespider blocked, sitemap declared) ✓ · semantic HTML, skip link, aria, reduced-motion ✓ ·
self-hosted fonts + font-display:swap ✓ · legal pages noindex+canonical ✓ · one H1, clean
heading hierarchy ✓.

## Gaps ranked by expected impact
| # | Gap | Dimension | Impact | Status |
|---|-----|-----------|--------|--------|
| 1 | **No answer-first / FAQ content** mapping priority NL queries to citable passages | answer-first, page intent, structured data | **HIGH** | FIX iter 1 |
| 2 | Organization schema thin — no `logo`/`email`/`contactPoint`/`sameAs` (weak brand entity) | structured data | MEDIUM | pending |
| 3 | `n°1` / "L'IA n°1" unverifiable superlative in title+H1 (AEO trust + FR ad-claim risk) | titles, citations | MEDIUM (needs owner sign-off, positioning) | flagged, not auto-changed |
| 4 | Legal pages: broken text `Retour à l'"'"'accueil` (shell-escape artifact leaked into HTML) | content quality | LOW (noindex, but visible defect) | flagged |
| 5 | index brand link `href="#"` should be `/` | internal links | LOW | pending |
| 6 | Legal internal links use `.html` while canonical is extensionless → redirect hop | internal links | LOW | pending |

No CRITICAL (nothing blocks indexing).

## Priority queries (FR, ICP = cabinets d'expertise comptable) + answer-readiness BEFORE
Score: ✅ answer-ready extractable passage · 🟡 implied by marketing prose · ❌ none
1. "IA pour cabinet d'expertise comptable" — 🟡 (hero prose, no direct definition passage)
2. "quelle IA / logiciel IA pour expert-comptable" — 🟡
3. "Memlia c'est quoi / Memlia avis" — 🟡 (schema desc only, no on-page Q&A)
4. "détecter opportunités de conseil cabinet comptable" — 🟡 (section exists, not Q-shaped)
5. "automatiser relances / pièces / échéances cabinet comptable" — 🟡
6. "IA expert-comptable RGPD / secret professionnel" — 🟡 (trustline chip only)
7. "IA cabinet comptable sans migration / au-dessus des outils" — 🟡 (trustline chip only)
8. "Memlia est-il un chatbot / différence chatbot" — ❌ (only in llms.txt, not on-page)
9. "l'IA agit-elle seule / envoie des mails automatiquement" (human-in-the-loop) — ❌ on-page
10. "prix / tarif Memlia" — ❌
**Before score: 0 ✅ / 7 🟡 / 3 ❌** — no query has a clean extractable answer passage on-page.

## Answer-readiness AFTER iter 1+2
All 10 priority queries → ✅ (self-contained extractable passage, mirrored verbatim in FAQPage
schema). **Before 0✅/7🟡/3❌ → After 10✅/0🟡/0❌.**

## Iteration log
- **Iter 1 (DONE):** Gap #1 fixed — added visible answer-first FAQ (8 Q&A grounded in
  already-published facts) at `#faq` + FAQPage JSON-LD (schema text = visible text, verified
  verbatim) + nav/footer `#faq` links + llms.txt FAQ pointer + sitemap lastmod → 2026-07-03.
  Verified: JSON-LD parses, 8 Q, 8 visible items, 1 H1.
- **Iter 2 (DONE):** Gap #2 fixed — enriched Organization schema (logo=apple-touch-icon.png,
  email + contactPoint contact@memlia.fr, areaServed FR). Gap #5 fixed — index brand link
  `href="#"` → `/`. Verified: @graph still parses, 4 nodes.
- **LOOP CONCLUDED (2026-07-03):** Terminal condition met — 0 critical tech issues, 10/10
  priority queries answer-ready, no HIGH gap remaining. Diff: index.html +~145, llms.txt +1,
  sitemap ±1. Not deployed (memlia.fr not live) — live SERP/AI-engine tracking deferred to launch.

## Iteration 3 (DONE 2026-07-03) — remaining points resolved via 6-agent workflow (wf_20d873d0)
- **#3 RESOLVED:** removed "n°1" (title l.6 + H1 l.295). 3-lens (SEO/GEO/compliance) + synthesis
  converged. Compliance verdict: "L'IA n°1" = allégation de supériorité invérifiable (Code conso
  art. L121-1), impossible à prouver pré-lancement, contredit la ligne rouge JSON-LD "aucune
  preuve inventée". New title = "Memlia — L'IA du conseil pour les experts-comptables" (54 char,
  now identical to og/twitter title). New H1 = "L'IA qui aide les cabinets comptables à proposer
  plus de <em>conseil</em>." Alternatives kept in workflow output if Kevin prefers a variant.
- **#4 RESOLVED** (earlier this session): legal back-link text fixed → "Retour à l'accueil".
- **#6 RESOLVED:** all 7 internal legal links → root-relative extensionless (`/mentions-legales`,
  `/politique-de-confidentialite`) across index + both legal pages. Matches canonical, hop-free on
  Cloudflare Pages default clean-URLs. NOTE: local static preview will 404 these (no clean-URL);
  they resolve only on Cloudflare Pages — that's the deploy target.
- Verified: 0 `n°1`, 0 `.html` legal links, JSON-LD parses (4 nodes), title==og==twitter.

## Correction to launch-agent advice
The launch checklist suggested adding the legal pages to sitemap.xml. **Do NOT** — they are
`noindex`; listing a noindex URL in the sitemap is self-contradictory. Keep sitemap = "/" only.

## Post-launch runbook (blocked on domain registration) — full detail in workflow output
Register memlia.fr as full Cloudflare zone → attach apex+www to Pages, HTTPS, 301 www→apex →
GSC Domain property (DNS TXT) + submit sitemap + request indexing → Bing WMT (import from GSC) →
IndexNow via Cloudflare Crawler Hints (Bing/Copilot, NOT Google) → add real Organization `sameAs`
once profiles exist → repeatable LIVE benchmark (Google/Perplexity/ChatGPT Search/Bing Copilot)
on the 7 priority queries, baseline at launch then D7/D30/monthly.

## Iteration 4 (DONE 2026-07-03) — FAQ design upgrade (/frontend-design + ui-ux-pro-max)
Flat centered hairline list → **asymmetric editorial**: sticky left rail (eyebrow + Fraunces
h2 + intro + "Parler à un humain" CTA) beside the visible Q&A list. Reuses the page's own 2-col
accordion rhythm; distinct from the 3-card grid. Signature = the pinned rail (`position:sticky;
top:88px`) that stays while you read — encodes the human-in-the-loop ethos + adds a useful CTA.
- **Deliberately NO 01/02 numbering** (frontend-design: numbering only honest for real sequences;
  a FAQ isn't one).
- Answers kept **visible in the DOM** (protects the GEO/answer-readiness win from iter 1).
- `text-wrap:pretty` on questions → no orphaned "?" (French punctuation), graceful fallback.
- Verified in preview: desktop sticky pins at 88px; mobile (≤820px) stacks 1-col + rail unsticks,
  no horizontal overflow; div-balanced (150/150); 8 answers intact; JSON-LD 4 nodes intact.
- Local preview server on :8788 (config .claude/launch.json).

## STATUS: all in-scope SEO/GEO gaps resolved + FAQ visually elevated. Only blocked-on-launch items remain (runbook above).

## LIVE AUDIT 2026-07-04 (/loop dynamic, Opus 4.8) — domain now LIVE
Full CLI audit of live memlia.fr. Re-runnable tools in scratchpad: `markup_audit.py` + `live.html`.
Results across the 10 requested check-categories:
- ✅ memlia.fr HTTP 200, TLS valid (CN=memlia.fr, Google Trust Services WE1, valid Jul3→Oct1 2026, ssl_verify=0)
- ✅ serves current markup (live == repo, 49545 B byte-identical)
- ✅ memlia.com + memlia.org → 301 → https://memlia.fr/ (both http AND https)
- ❌ SPF+DMARC on all 3 zones — **FAIL: memlia.fr has ZERO TXT** (no SPF, no DMARC, no MX),
     confirmed via 1.1.1.1 + 8.8.8.8. .com/.org carry `v=spf1 -all` + `v=DMARC1; p=reject;`.
- ✅ title no "n°1" & == og:title (== twitter:title)
- ✅ canonical https://memlia.fr/
- ✅ JSON-LD valid (@graph 4 nodes: Org+WebSite+SoftwareApplication+FAQPage), 8 Q, schema text == visible text VERBATIM
- ✅ single H1
- ✅ robots.txt/sitemap.xml/llms.txt reachable (200) AND well-formed (sitemap declared, single "/" URL lastmod 2026-07-03, AI search bots allowed, Bytespider blocked)
- ✅ FAQ answer-first, 8 Q/R visible in DOM
LOW/optional: www.memlia.fr does NOT resolve (NXDOMAIN) → no www→apex redirect.

### Classification by impact
- **Only real gap (MEDIUM):** memlia.fr missing SPF+DMARC → PRIMARY brand domain is spoofable while
  the two secondary domains are locked (inverted security posture). Cloudflare DNS gap → SIGNALLED, NOT touched.
- **LOW/optional:** www no redirect (Cloudflare DNS).
- **NO repo gap** — every file-based check green on both live and repo. Nothing to edit in-repo, so the
  loop's "fix the principal repo gap" has no target.

### Exact Cloudflare step signalled (memlia.fr zone → DNS → Records)
- TXT `@`      = `v=spf1 -all`
- TXT `_dmarc` = `v=DMARC1; p=reject;`   (identical to what .com/.org already have)
At launch (Brevo sending): SPF → `v=spf1 include:spf.brevo.com -all` + add Brevo DKIM + optional DMARC `rua=` once a mailbox exists.
NOTE: memlia.fr SPF/DMARC was DELIBERATELY deferred by Kevin on 2026-07-03 ("pour memlia.fr — pas pour l'instant").
Kevin chose LOCK NOW (2026-07-04) via AskUserQuestion. He applies the 2 TXT records in Cloudflare himself
(no CF access from CLI + task forbids touching infra); re-run the audit on his "c'est fait". Did NOT touch Cloudflare, did NOT commit/push.
**RESOLVED 2026-07-04:** Kevin added both TXT. Verified at authoritative Cloudflare NS + 1.1.1.1:
SPF `v=spf1 -all` + DMARC `v=DMARC1; p=reject;` present on memlia.fr. (8.8.8.8 apex SPF briefly
cache-lagged on a stale negative response — self-heals, not a config issue.) **AUDIT NOW 10/10 GREEN.**

### Loop terminal condition — REACHED → loop STOPPED
No repo gap is fixable by editing; the only red check is a user-gated Cloudflare DNS change. A 2nd pass brings
zero autonomous progress → no ScheduleWakeup. Re-run `python3 scratchpad/markup_audit.py` + the `dig` TXT checks
after Kevin adds the two records to confirm green.

## Hermes — 2026-09-09 — M4-R3, candidat intégré

- Carte `t_f16e5a39`, branche `wt/t_f16e5a39` : base blog `cd71227`, positionnement M3 conservé, neuf preuves M4-R1 et vidéo R7 intégrées. Premier commit `a6eaebf`, correction poster et recette dans le commit suivant.
- Preview finale : https://bbade7ba.memlia.pages.dev ; branche Cloudflare `preview-m4-r3`. Aucun push, merge main ni production.
- Trois passes : check sans erreur, build 7 pages, Python25, Playwright44, images23 ; copie SHA13 + dérivés13, médias HTTP25 ; écran réel Chromium 320–1920, vidéo45s et sous-titres20, transcription/plein écran pour les microtextes mobile.
- Lighthouse candidat indexable : mobile et desktop 100/100/100/100. Preview : 98/100/96/69 et 100/100/96/69 ; SEO69 dû au `X-Robots-Tag: noindex, nofollow` obligatoire, bonnes pratiques96 dû au beacon Cloudflare injecté (CORS). Ne pas retirer le noindex pour fabriquer un vert.
- Pièges : le poster natif 1920 pesait trop pour le LCP distant ; dérivé1200/qualité90 et preload high, original conservé. VTT importé `?raw` pour le build Astro. Les figures SVG des articles ne contiennent pas d’img ; le harnais vise `.article-couverture`.
- Rapport/manifeste : `docs/qa/m4-r3/recette.md`, `media-manifest.json`, `remote-media.json`. Captures et lecture : `.qa/m4-r3-delivery/`.
- À revoir : enfant croisé précréé `t_69fbf26b`, puis Kevin pour l’ensemble du site et les textes juridiques. Annotations R5 historiques du poster R7 approuvé conservées ; pas de QA Safari/iOS ni audition humaine revendiquée.
