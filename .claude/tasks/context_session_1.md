# context_session_1 — SEO/GEO audit loop (memlia-landing)

## Hermes — 2026-09-19 — sources de la forge : encodage et contexte

- `verifySource` décode désormais les octets avec le `charset` déclaré par `Content-Type`, UTF-8 par défaut, et refuse une séquence invalide au lieu d'écrire une copie corrompue.
- Le contexte d'un claim est extrait du bloc HTML visible qui contient la citation, puis borné à sa phrase ; `head`, CSS, scripts, `noscript` et `template` sont exclus. Extraction et validation partagent désormais cette projection : un contexte traversant une balise inline reste relié au snapshot exact et passe le gate.
- TDD rouge puis vert sur une vraie distinction ISO-8859-15 (`€`, octet `0xA4`) et sur une page HTML monoligne chargée de CSS dont une balise `<a>` entoure la citation. Le nouveau test échouait au gate sur le contexte avant correction. Vérification fraîche : check 0 erreur (11 hints hérités), Python 71/71, scripts 248/248, Playwright 123/123, build 19 pages.
- Aucun contenu public, déploiement, push ou publication. Diff limité à quatre fichiers de code/test et ce contexte ; nouvelle passation en revue croisée marketing sur la carte `t_2ab266bf`.

## Claude Code — 2026-09-16 — reprise des cartes Hermes, plan de chantier

- Hermes figé depuis le 15/09 12:26 (auth Codex perdue : workers rc=0 × 5, disjoncteur). Les 25 cartes landing
  ouvertes seront exécutées dans Claude Code et closes par `hermes kanban complete` avec preuves.
- Plan : `~/memlia-vault/10-memlia/chantiers/site-memlia-fr/plan.md` (phases 0 à 3, protocole par carte). Ordre :
  hygiène du kanban → A3 (t_46ed91b5 → t_cb5e619c) → Ressources (t_391e2204 → … → t_4cd25435) ∥ site v2 docs
  (t_74efbe3a → t_42bc3eed) → site v2 code (t_c2262a1b → t_80055166 → t_4659b272).
- Faits mesurés : prod = 939464c = origin/main ; `main` local +11 commits docs/tests ; article 3, /ressources et
  /glossaire → 404 en prod ; preview A3 6c8f8a89 vivante en noindex ; téléphone encore dans mentions légales sur
  `main` (retrait b6ee043 à intégrer avec la release Ressources).
- Aucun push, aucune carte modifiée, aucun code touché.


## Hermes — 2026-09-15 — intégration des branches abandonnées, t_bb13ea9f

- Inventaire trié intégralement : 36 branches, dont 10 `INTEGRER`, 26 `OBSOLETE`, 0 à décider. Verdicts et motifs dans `docs/qa/integration-branches-abandonnees-2026-09-15.md`.
- `main` landing contient les trois branches retenues ; `git cherry main <branche>` rend zéro commit pour chacune. Vérifications fraîches sur le build servi : Playwright 79/79, Astro check 0 erreur/1 hint hérité, build 7 pages, Python 37/37, images 23 et scripts 9/9.
- `main` memlia-desk contient les sept branches retenues, le descendant de preuve S52 puis sa clôture `wt/t_d8660ef0` ; `git cherry` rend zéro commit restant. Déclaratif : Vitest 58 fichiers/1 532 tests, TypeScript 0 erreur ; parité 78 entrées, 71 couvertes, 5 écartées, 2 remplacées.
- Les worktrees des 36 branches sont retirés après contrôle de propreté. Deux worktrees S52 auxiliaires hors inventaire restent volontairement présents car ils contiennent des preuves non suivies.
- Aucun push ni déploiement. Le serveur de preview local a été arrêté.
## Hermes — 2026-09-15 — fraîcheur R4, t_54774b16

- Autorité courante : articles publics byte-identiques à `939464c`, Kevin Kitanga, `brouillon:false`. Les anciennes références 92ec8350 du paragraphe suivant sont historiques.
- Dossiers migrés sans legacy avec reçus complets d'adoption, sources historiques datées du 13 inchangées et limites explicites : aucune nouvelle recherche/fact-check, aucune attestation ni autorisation. Gates preview/production fermés.
- Recette fraîche : Blog 2/2, Python 56/56, Blog Node 82/82 + rendu 1/1, Ressources 35/35, Playwright 98/98. H/T 41 unités/49 claims/57 citations ; QA/build complet rouges exclusivement businessReview PENDING, aucune erreur liaison/buildOutput.
- Rapport courant : `docs/qa/hub-ressources/freshness-r4-exec.md`, preuves hashées associées. Commit local exact et état propre à lire dans le handoff t_54774b16 ; aucune publication. Adoption t_391e2204 puis revue technique t_8f07fd85, sans nouveau candidat.

## Hermes — 2026-09-15 — candidat Ressources v3, t_d078dd62

- Candidat v3 repris dans le worktree landing isolé, sans commit, push ni déploiement : 41 unités, 49 claims, 57 citations et 12 sources uniques ; relations unit↔claim↔citation↔source bidirectionnelles, zéro orpheline selon l’oracle indépendant (5/5).
- Correctifs post-contre-revue : restauration octet pour octet des deux dossiers Blog autoritaires du commit `92ec8350bb7810bd64f6a0507dc02efd1ebdf244` ; doctrine de recouvrement atomisée en deux affirmations ; reçu de build lié au snapshot et vérification explicite de chaque code de sortie. Le scelleur préconstruit le candidat draft, écrit manifeste/reçu/registre, puis fait passer la chaîne complète et refuse toute divergence du bundle.
- Vérifications fraîches : scelleur code 0 (Astro 9 pages, Python 56/56, médias 23/23, preview-export 4/4, Blog 68/68 + rendu 1/1, Ressources 35/35), `npm run check` 0 erreur/0 warning/1 hint, audit Blog 68/68, oracle v3 5/5, Playwright 100/100 à 375/1440. Captures Ressources mobile et Glossaire desktop relues ; pas de défaut majeur constaté.
- `resource:audit:qa` et le build complet candidat rendent le code 1 uniquement sur 59 occurrences `businessReview`/`AI_REVIEW_PASS` volontairement absentes ; paie/social reste non attesté et aucune validation métier n’est fabriquée. Score mécanique : 85/100 brut, 100/100 normalisé ; aucun score final tant que la gate métier manque. SERP Hub desktop reste ND historique.
- Rapport exhaustif : `docs/qa/hub-ressources/metier-fix-c-astra.md`. Registre : `docs/qa/hub-ressources/metier-fix-c-register.json`. Suite précréée : orchestration `t_c58b168b` ; ne pas fabriquer la revue métier et ne pas publier.

## Hermes — 2026-09-14 — santé production, t_cde15777

- Diagnostic reproduit : l’apex servait une réponse âgée de 98 244 s avec `X-Robots-Tag: noindex`, `s-maxage=604800` et `<track default>` ; les deux derniers déploiements Production 153298f4 et b32f5bb3 répondaient 404, tandis que 393e365e servait encore l’ancien HTML. Une query fraîche sur l’apex tombait elle aussi en 404 : le cache masquait donc un origin Production invalide.
- `dist` a été reconstruit depuis `6b202a7`, sans `_headers`, avec meta `index, follow, max-image-preview:large` et `<track>` sans `default`, puis redéployé explicitement sur `main`. Déploiement : `c566bfe2-65b0-4d41-ac5b-c4f0ad52bcbb`, https://c566bfe2.memlia.pages.dev.
- Readback final apex et query : HTTP 200, aucun `X-Robots-Tag`, `cache-control: public, max-age=0, must-revalidate`, aucun `age`, `<track>` sans `default`. La liste Wrangler rattache le déploiement Production à la source `6b202a7`.
- Régression de test corrigée : le scénario reduced-motion vérifie désormais le mode initial `disabled`, puis passe le track en `hidden` pour prouver les 20 cues sans les afficher. Check 82 fichiers/0 erreur/1 hint hérité, build 7 pages/Python 37/37/images 23/preview 3/3, Playwright local 79/79. Production : 11 scénarios vidéo, 10 verts au premier passage et un timeout réseau au chargement ; le cas isolé a repassé 1/1. Capture 1440 relue : hero et lecteur rendus, aucun sous-titre visible ni défaut évident.
- Revue croisée appliquée : l’oracle vérifie désormais l’absence stricte de l’attribut booléen `default` (`getAttribute(...) === null`). Un poison `default="default"` a fait rougir les 6 largeurs exactement sur cette assertion, puis la source a été restaurée et comparée ; test ciblé 6/6, suite Playwright 79/79, check 82 fichiers/0 erreur/1 hint et build complet verts. Aucun redéploiement : l’apex frais reste HTTP 200, `DYNAMIC`, sans `X-Robots-Tag` ni `Age`, avec meta indexable et track sans `default`.
- Aucun changement de contenu, design, média ou configuration de cache. Aucun push Git. Retour arrière Cloudflare disponible vers le déploiement antérieur, mais il restaurerait précisément l’ancien HTML avec sous-titres par défaut et n’est pas recommandé.

## Hermes — 2026-09-12 — bouton sonore seul, reprise après revue, t_96481743

- Revue marketing appliquée au commit `571d34b` : le bouton seul porte désormais directement un fond vert translucide, un `backdrop-filter: blur(8px)`, une ombre douce et un halo discret. L’overlay reste transparent, sans bordure, ombre, flou, padding, carte ou annotation ; aucun comportement vidéo ni média n’a changé.
- TDD : assertion de styles calculés rouge sur `box-shadow: none`, puis test ciblé 11/11. Build : 7 pages, Python 37/37, images 23, preview 3/3 ; check 0 erreur/0 warning/1 hint hérité ; Playwright complet 79/79 sur la preview finale. Deux essais locaux non crédités : serveur statique sans clean URLs, puis toolbar Astro dev injectée.
- Preview finale uniquement : https://37e55bfb.memlia.pages.dev, alias https://preview-site-video-button.memlia.pages.dev, déploiement `37e55bfb-c468-4e25-88c4-978d9723d14c`, source `571d34b`, environnement Preview. Header et meta `noindex, nofollow` relus sur les deux hôtes ; production toujours sur `f20096f`.
- Sonde distante : annotation 0 et enfant overlay 1 aux six largeurs ; overlay sans carte, bouton avec ombre + `blur(8px)`, cible minimale 158,06×44 px, aucun overflow à 320/375/768/1024/1440/1920. Captures 375/1440 relues dans `.qa/site-video-button/` : halo/ombre visibles, pas de panneau additionnel.
- R8 : quatre SHA locaux inchangés et 8/8 concordances sur URL immuable + alias ; R7 : 8/8 réponses 404. Aucun push, fusion main ou déploiement production. Suite : nouvelle revue croisée marketing.

## Hermes — 2026-09-12 — bouton sonore seul, t_96481743

- Parent R8 approuvé repris jusqu’à `631ddb6`, puis correction limitée au hero et à ses tests : suppression du conteneur `.hero-video-invitation` et de l’annotation ; bouton `Activer le son` directement centré dans l’overlay. Aucun comportement vidéo ni média modifié.
- TDD : oracle DOM/Python rouge avant correction ; cible tactile mobile rouge à 43,59 px puis portée à 44 px. Build : 7 pages, Python 37/37, images 23, preview 3/3 ; check 0 erreur/0 warning/1 hint hérité ; Playwright ciblé 11/11 local et suite 79/79 sur la preview finale.
- Preview uniquement : https://7fd97733.memlia.pages.dev, alias https://preview-site-video-button.memlia.pages.dev, branche Cloudflare `preview-site-video-button`, source `53a3dd4`, environnement Preview. Header et meta `noindex, nofollow` relus sur les deux hôtes ; production restée sur `f20096f`.
- R8 : 4/4 SHA identiques au parent et aux deux hôtes ; R7 : 8/8 réponses 404. Largeurs 320/375/768/1024/1440/1920 sans overflow ; captures finales 375/1440 relues dans `.qa/site-video-button/` : bouton seul, focus visible, aucun panneau ou débordement.
- Aucun push, fusion main ou déploiement production. Suite : revue croisée marketing du candidat local.

## Hermes — 2026-09-12 — lecteur R8 dirigé, t_dd5e7251

- Parent R7 repris par cherry-pick jusqu’à `083e18f` : export `dist` sans R7 et préparation preview séparée `.qa/preview-dist`, protégée `noindex, nofollow` dans header et meta. Aucun contournement du mécanisme approuvé.
- Lecteur hero R8 sans contrôles natifs : autoplay muet + boucle en régime normal ; overlay Memlia `Activer le son`, reprise à zéro avec son et loop coupée ; clic/Entrée/Espace pause-reprise, focus visible et libellés ARIA synchronisés. Reduced-motion reste à l’arrêt sur poster ; refus autoplay/erreur média/fallback sans JS sont actionnables.
- TDD : 11/11 rouges avant implémentation, puis 11/11 ciblés locaux et distants. Suites : check0/0/1hint hérité, build7/Python37/images23/preview3, Playwright79/79 sur dist frais. R8 quatre SHA identiques public/dist/deux hôtes ; R7 8/8 en 404.
- Preview uniquement : https://cbf3f3a6.memlia.pages.dev, alias https://preview-site-video.memlia.pages.dev, deux hôtes header+meta noindex,nofollow. Aucune production, fusion main ou poussée.
- Écran : 320/375/768/1024/1440/1920 sans overflow ; captures 375/1440 relues après animation dans `.qa/site-video/`. Le script générique `qa:screens` cale sur des `.rv` hors écran hérités ; sonde hero ciblée utilisée sans élargir le périmètre. Rapport : `docs/qa/site-video/recette.md`.
- Suite : revue croisée marketing sur le candidat local. Ne pas rendre l’autoplay statique dans le HTML : son activation JS après lecture de reduced-motion évite un départ anticipé ; le no-JS reste explicitement arrêté avec téléchargement.

## Hermes — 2026-09-12 — retrait R7 de l’export public, t_9712f072

- Reprise après revue : commit `c8f3f35` durcit `scripts/prepare-preview.mjs`. La copie `.qa/preview-dist` reçoit header et meta `noindex, nofollow` sur les 7 HTML ; le script refuse de viser `dist` et refuse toute meta absente/dupliquée avant copie. Tests Node rouge (export absent), puis 3/3 verts, intégrés au build ; `dist` reste sans `_headers` et ses metas restent inchangées.
- Nouvelle preview : https://d595c794.memlia.pages.dev, alias https://preview-r7-export.memlia.pages.dev, déploiement `d595c794-9a5f-415b-a3a3-0a713b47b231`, branche Preview, source `c8f3f35`. Lecture HTTP fraîche : 2/2 headers + metas `noindex, nofollow`, R7 8/8 en 404, R8 8/8 en 200/SHA identiques, 22 surfaces sans référence R7, un lecteur DOM R8 par accueil.
- Rejeu final : build7 pages/Python37/images23/preview3, check82/0 erreur/0 warning/1 hint, Playwright local76/76 et distant média8/8, recalcul9PNG/21actifs. Captures375/1440 relues : lecteur/poster visibles, aucun débordement ou chevauchement visible. Browser Harness indisponible au démarrage ; passe écran faite par Playwright + lecture des PNG. Aucune production, fusion main ou poussée.
- Commit `03035c4` : `scripts/strip-briefs.mjs` retire récursivement `dist/media/r7/` après la copie Astro, compte quatre assets exclus et refuse de continuer si le dossier subsiste. Les quatre sources R7 du dépôt et les manifestes historiques restent inchangés ; R8 n’est ni réencodée ni modifiée.
- TDD : build rouge 1/35 avec quatre chemins R7, puis build vert 37/37 Python + images23 +7pages. Poison explicite `media/r7` dans `dist/index.html` rejeté, restauration par copie puis8/8. Check81fichiers/0erreur/0warning/1hint ; Playwright local76/76 sur le serveur exact4322 ; recalcul9PNG/21actifs.
- Preview noindex uniquement : https://9dd0fea0.memlia.pages.dev, alias https://preview-r7-export.memlia.pages.dev, déploiement `9dd0fea0-a5d8-43c5-8804-b924d12e3cdf`, branche `preview-r7-export`, source `03035c4`. Quatre chemins R7 × deux URL =8/8 HTTP404 ; R8 4/4 HTTP200 et SHA identiques ; 11 surfaces exportées sans référence R7 ; un seul lecteur DOM R8. Playwright média distant8/8, captures375/1440 inspectées, aucun débordement.
- Rapport `docs/qa/r7-export/recette.md`, preuve `preview-http.json`. La première commande Playwright locale a touché un serveur concurrent périmé4321 et rendu61/76 : exclue, non créditée. Aucune production, fusion main ou poussée GitHub.


## Hermes — 2026-09-12 — revue sémantique/visibilité IA, t_4f574adf

- Deux propositions 40/50 relues contre les réponses DataForSEO sauvegardées du run marketing : frontmatters conformes 2/2, matrice nationale 16/16, intentions et probabilités 16/16 exactes, volumes nationaux 2 à 10/mois + 14 `null`, Bretagne 6/6 `null`, KD 16/16 `null`.
- Coût recalculé : détail $0.39696, écart à $0.344 = +$0.05296. Le lot national rejoué à $0.09 explique à lui seul le franchissement du plafond : sans lui, $0.30696. Huit SERP et cinq exécutions ChatGPT facturées sont tracées ; le constat éditorial reste 0/3 prompts finaux, n=1 chacun.
- Les 14 liens publics répondent HTTP 200 ; Google, CNIL et net-entreprises ont été relus sur leurs affirmations. Une double comptabilisation de la Bretagne dans le tableau de traçabilité a été corrigée : lot final hors Bretagne $0.11784, ce qui réconcilie tableau + SERP/ChatGPT à $0.39696. Aucun client réel, promesse hors produit, nouvel appel DataForSEO, fichier public du site, publication ou push.

## Hermes — 2026-09-12 — reprise de revue inventaire SEO, t_2a29be13

- Notes 00/01/02 relues intégralement ; SHA recalculés identiques à la revue précédente (3/3), frontmatters conformes (3/3). Les cinq corrections du commentaire730 restent nécessaires ; détail actualisé au commentaire740. Sources officielles GSC/Liens/Bing/IndexNow reconsultées par curl ; aucune nouvelle mesure du site créditée.
- Mur de routage : `request_changes` réassigne l'implémenteur historique `claude` sans override (code installé lu), contrairement à la reprise GPT. Escalade opérateur pour transférer la même carte en correction vers `marketing`, avec revue `dev`, sans doublon et sans libérer les quatre enfants todo.
- Aucun livrable SEO ni code produit modifié ; aucun test TS/Python/build/écran recertifié pour cette revue documentaire, aucun commit/push/publication. Suite : corriger ensemble 00/01/02 puis nouvelle revue ; ne pas reprendre les conclusions non prouvées.

## Hermes — 2026-09-10 — revue inventaire SEO, t_2a29be13

- Trois propositions 00/01/02 relues intégralement, frontmatters 3/3 conformes ; corrections requises consignées dans le commentaire Kanban 730. TXT Google présent ≠ propriété GSC vérifiée ; collecte dès ajout selon Google, pas dès vérification. 404 Bing/IndexNow ≠ absence de configuration.
- HTTP frais via curl : accueil200, Cal.com6liens/formulaire0/beaconprésent ; sitemap200, BingSiteAuth/IndexNow404. Deux résolveurs confirment TXT Google/MXvide. Documents officiels Google/Bing/IndexNow consultés ; les conclusions globales et la correspondance hypothèse/instrument restent à corriger.
- Aucun livrable SEO ni code produit modifié ; aucun test TS/Python/build/écran crédité pour cette revue documentaire, aucun push/déploiement. Aval non libéré ; reprendre les cinq demandes du commentaire730 avant approbation.

## Hermes — 2026-09-10 — M8, revue documentaire finale (round 3)

- `t_4f92e99e` : corrections P1/P2 vérifiées ; la recette distingue la release réelle de la consolidation et qualifie correctement les trois rapports et les preuves comme locaux/non versionnés. Rapport `docs/qa/m8/recette-finale-publication.md`, SHA-256 `adcdfe5ca826b6c0194ee8286bbeadd22f18ce8f5b728db8bafb8269abc10b8d`.
- Contrôles frais : check72 fichiers/0erreur/0warning/1hint ; Python28/28 ; images23/9 ; candidat ancêtre de main3d0867d, diff produit vide. Tableau16/16 SHA+tailles conformes ; ZIP final64entrées/CRC intact, inventaire63/63 identique au disque ; ZIP historique175entrées intact. Aucun rapport Markdown dans le ZIP final.
- JSON de production relus et empreintes vérifiées : PW64/menu45, équivalence58/58, SEO6pages/8assets/0erreur, console12/12, captures18+18/R8 ended45s. Build/PW/écran NON rejoués dans cette revue strictement documentaire. HTTP frais apex200/www301 avec query exacte. Aucun fichier produit ni rapport modifié par le reviewer ; aucun commit/push/déploiement.
- Suite : clôture documentaire libérant M8 précréée, sans refaire la release. Sauvegarder hors machine le ZIP final AVEC les trois rapports ; aucun push sans go. Les sections www bloqué ci-dessous sont historiques, pas l'état courant.

## Hermes — 2026-09-09 — M8, redirection www hors `_redirects`

- Kevin a choisi configurer www et ajouté le CNAME. Résolveurs publics1.1.1.1/8.8.8.8 positifs ; résolution système encore ENOTFOUND lors de cette reprise. HTTPS forcé sur les IP proxy fonctionne, mais `/` et `/blog?source=www-test` répondent200 sans redirection.
- Ne pas écrire `https://www.memlia.fr/*` dans `_redirects` : docs officielles + parseur Wrangler4.101.0 le rejettent réellement (0valide/1invalide, « Only relative URLs are allowed »). Sonde locale `.qa/m8-www/probe/` jamais publiée. Un `/*` relatif créerait une boucle apex.
- Voie correcte : règle Cloudflare Bulk Redirects301, source `www.memlia.fr/`, cible `https://memlia.fr/`, préserver query/suffixe et activer subpath, sans inclure d'autres sous-domaines. Runbook `docs/qa/m8/recette-www.md`. OAuth actuel sans droit de règles annoncé, navigateur-harness indisponible ; activation humaine requise, pas un nouveau deploy.
- Oracle `node scripts/verify-www-redirect.mjs` :8cas HTTP réels, DNS normal/TLS/301/Location exacte/un saut/canonical/indexabilité ; rouge0/8ENOTFOUND, aucune clôture. Préserver cet échec et rejouer après règle/propagation.
- Aucun changement produit/copy/design/Worker/preview/production/push. Check0/1hint,build7/Python28/images23 et chaîne apex58/58 relancés ; écranhero375/1440 relu. Résultat navigateur final dans le rapport de cette reprise. Réserves héritées inchangées.

## Hermes — 2026-09-09 — M8, production vérifiée / www à arbitrer

- Kevin a déployé `030591b5-bbc7-48b4-be1a-9d66c025e7a9` ; Wrangler relu Production/main/source17f7658. Apex https://memlia.fr sert le commit exact `17f7658da65038763ade695c96cf40b43e5fb3cf`, identique au worktree final. Aucune fusion/déploiement/push supplémentaire par cette reprise.
- Mesures fraîches : check0/1hint, build7pages/Python28/images23, Playwright final64/64 et menu45/45 trois moteurs. Premier PW63/64 : ERR_NETWORK_CHANGED à320 avant assertion, cas isolé puis suite complète verts, logs conservés. R8 lue45s/20cues/1350frames dont17perdues, son décodé ; hero375/1440, légal375, menu3moteurs et ligne50/50 relus à l'écran.
- Chaîne apex exhaustive :12routes +46autres fichiers =58/58dist ;25médias du manifeste inclus,1document interne exclu du manifeste. HTML transformé par Cloudflare email protection :12liens/6textes réellement décodés,7scripts et6blocs analytics comptés ; comparaison exacte ensuite. Emails restaurés au navigateur4pages. Deux CTA Cal.com ouverts HTTP200 sans réservation/envoi. Indexabilité apex correcte, légales noindex intentionnel, pages.dev noindex attendu.
- Seul arbitrage externe restant : `www.memlia.fr` NXDOMAIN système/1.1.1.1/8.8.8.8/deuxNS autoritaires ; absent des domaines du projet Pages. Demander configuration HTTPS+redirection permanente conservant chemin/query ou acceptation explicite sanswww. Pas de clôture/libération enfantsSEO avant arbitrage. Ne pas redéployer pour un DNS absent.
- Recette `docs/qa/m8/recette-production.md`, preuves `.qa/m8/`. Réserves téléphone/TVA acceptées, seekfroid et lectureglobale maintenus ; annotations résiduelles R8 connues, aucun changement média/copy/design. Fichiers préexistants conservés, rapport/contexte non commités.

## Hermes — 2026-09-09 18:23 WAT — M8, publication bloquée

- M7-R1 `done` et go humain explicite relus : candidat `17f7658da65038763ade695c96cf40b43e5fb3cf`, réserve juridique acceptée. Aucun changement de copy/design autorisé.
- Pendant M8, le parent marketing a avancé `main` par fast-forward. SHA exact, reflog et absence de diff produit vérifiés dans cette reprise ; ne pas refaire la fusion. Ses check/build/Python28/images23 sont attribués au handoff, non rejoués ici.
- Déploiement interdit par `approvals.deny`, mur confirmé par l'opérateur. Aucun contournement ni publication par M8. Commande humaine : `cd /Users/kevinkitanga/dev/interne/memlia-landing && npx wrangler pages deploy dist --project-name memlia --branch main --commit-dirty=true`.
- Mesure HTTP de cette reprise : apex HTTPS 200, `www.memlia.fr` non résolu (curl6). Cela ne prouve pas la publication du candidat ; contrôle complet du HTML/médias/navigation/CTA et indexabilité à reprendre après URL de déploiement ou « fait ».
- Carte `t_852aa1a1` bloquée ; aucune clôture de release. Travaux préexistants conservés. Rapport parent : `.worktrees/t_f16e5a39/docs/qa/m7/t_69fbf26b-publication.md`.

## Hermes — 2026-09-10 — harmonisation du bento

- Carte `t_0a859fbf`, base `a1f817d`, produit `b9d800a9e4df437a7e6557bc712d92d5c732d731`, branche `site/harmonisation-bento`. Preview exacte https://57e995b9.memlia.pages.dev, branche Cloudflare `preview-harmonisation-bento`, noindex et environnement Preview relus. Aucun push/main/production ; six identités production inchangées.
- Seul fichier produit : Usages.astro. Cinq cartes feuille sur page, cinq Picto24/trait1,5 gris repos dans conteneurs48/rayon10 uniformes. Aucun mint, gradient, color-mix ou état actif par carte. Textes, ordre, structure1+2×2, méthode en quinconce et médias inchangés ; hauteur du bento réduite par les icônes plus petites.
- Check0erreur/0warning/1hint hérité ; build7/Python34/images23 ; Playwright76local+76distant, sept poisons rejetés puis restaurationSHA et suite complète. Recalcul9PNG/21actifs ; HTTP12noindex/25médias identiques. Six largeurs320/375/768/1024/1440/1920 sans overflow ;36captures plus2comparaisons, inspection pleinepage1440/crops1440/375. DOM horsbento identique après exclusions comptées ; seul Usages change dans src/public.
- Contraste texte16,16/5,61 ; pictos décoratifs2,56:1 volontairement jeton de repos des garanties, pas de revendication3:1. Lighthouse local100partout ; distant mobile90/89, desktop68/99, a11y100/BP96/SEO69. LCPmobile2540/2827ms dépasse2500 ; réserve explicite, hors correctionbento, pas de faux vert. Témoin ancien desktop99 ; causalité réseau non démontrée.
- Rapport `docs/qa/harmonisation-bento/recette.md`, preuves `.qa/harmonisation/`, archive `.qa/harmonisation-bento-preuves.zip`. Suite : revue croisée Claude puis Kevin. Aucun élargissement du périmètre ni nettoyage du code mort hérité. Lecture courte déléguée sans synthèse exploitable, non créditée comme revue.

## Hermes — 2026-09-09 — capacités et méthode en quinconce

- Carte `t_7c202a39`, base exacte `76214ba`, produit `fef42bf4f90eda2448911703ffbf536cda528932`, branche `site/redesign-capacites-methode`. Preview seule https://be1eb235.memlia.pages.dev, branche Cloudflare `preview-redesign-capacites-methode`, environnement Preview relu. Aucun push/main/production.
- Usages : bento cinq blocs, principal pleine largeur puis2×2 ; suppression des paragraphes scénario et non-contractuel. Titres/corps inchangés. Méthode : quatre splits50/50, images gauche/droite/gauche/droite à1024+, texte puisimage en mobile ; libellés Étape1–4 conservés sans chips. Les neuf images nettoyées, alt, R8 et tout le reste restent intacts.
- Vérifié : check0/1hint hérité, build7/Python32/images23, Playwright70local+70preview sur serveur frais,4poisons rejetés/restaurés, recalcul9PNG/21actifs ; HTTP12noindex,25médias SHA identiques auparent.24géométries identiques,40captures et inspection375/1440. Aucun overflow aux320/375/768/1024/1440/1920.
- Lighthouse local100partout ; preview mobile94 puis98,desktop99,accessibilité100,BP96,SEO69. Premier LCPmobile2699ms, répétition2329ms ; CORSbeacon/noindex documentés, pas de faux vert. Rapport `docs/qa/redesign-capacites-methode/recette.md`, archive `.qa/redesign-capacites-methode-preuves.zip`.
- Pièges : capture d'élément long incruste headerfixed au milieu ; remplacée par pleinepage depuisorigine puis découpeDOM. Ancien vérificateur média tente `index.html#flux` commebinaire ; nouvelle sonde de recette compare25publics auparent, rendu indépendant séparé. Styles/observer morts hérités signalés, nonnettoyés. Microtextes centraux des images gardés selonbrief.
- Suite : revue croiséeClaude sur cette carte, puis validationKevin ; aucune production sansnouveaugo. Deux sous-revues courtes sans verdict exploitable, noncréditées. Proposition coffre sur originefixe enrichie, pas de modification directe du skill.

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

## Recette finale de publication M8 — 2026-09-09 (documentation QA seule)

- **Nouveau rapport qui fait foi : `docs/qa/m8/recette-finale-publication.md`.** Verdict **VALIDÉ**,
  conditionné aux trois verts : audit HTTP/SEO `t_95915808`, audit interface/parcours `t_f6c811c5`,
  équivalence externe 58/58.
- `docs/qa/m8/recette-production.md` : bandeau d'obsolescence + section 5 réécrite. Elle affirmait
  encore NXDOMAIN sur `www` ; l'historique est conservé et daté, non effacé.
- Faits revérifiés dans le dépôt avant écriture : `HEAD=3d0867d`, candidat `17f7658` ancêtre, diff
  produit **vide**, `main` **22 commits en avance sur `origin/main`** (aucun push), déploiement
  `030591b5-…` / `https://030591b5.memlia.pages.dev`.
- Chiffres relus dans les artefacts, pas recopiés : check 0/0/1 hint · build 7 pages · Python 28/28 ·
  images 23 · Playwright 64/64 · menu 45/45 (3 moteurs) · oracle www **8/8** `forcedDns:false` ·
  independent **12/12 routes + 46/46 fichiers**, 0 exclusion · audit SEO 6 pages/8 assets/4 URL
  sitemap/0 erreur · console 12/12 pages, 0 erreur, 2 `ERR_ABORTED` non affectants · écran 18+18
  captures, R8 45 s `ended`, 1350 frames/9 perdues.
- Réserves non bloquantes consignées (juridique acceptée, Légifrance 403, seek à froid, annotations
  R8, lecture globale, règle Cloudflare non relue à la source, protection email CF, couverture non
  revendiquée) + **`.qa/` est gitignoré** : seuls les rapports `docs/qa/m8/` sont durables.
- Rien d'autre touché : aucun fichier produit, aucune copy/design, aucun commit, aucun push, aucun
  déploiement, aucune écriture Cloudflare/DNS.
- Restent deux gestes humains : `git push origin main` et libération des deux enfants SEO précréés.

## Hermes — 2026-09-20 — C2, forge des pages service

- Carte `t_9149e763`, branche `wt/t_9149e763` : forge dédiée `scripts/service-forge.mjs`, collection Astro `services`, route `/automatisation/<tache>`, rendu commercial et registre SEO partagé avec les autres types. Aucun article ni plafond de cadence blog n’est lu ou réécrit.
- Portes fail-closed : mesure d’intention fraîche, requête primaire unique inter-types, contenu borné, vocabulaire public, quatre surfaces alignées, cinq schémas exacts, jeu fictif, trois liens entrants réellement présents et rattachés à leur URL, revue indépendante avant scellement, empreintes et preuve de publication.
- Preuves : Node 263/263 dans le build, Playwright 167/167, Python 120/120, Astro check 0 erreur/0 avertissement, build complet PASS. Recette visuelle synthétique Chromium 375 et 1440 : un H1, cinq types JSON-LD, zéro débordement ; fixture retirée avant le build final.
- Revue indépendante finale : zéro défaut Critical/Important. Deux défauts trouvés puis corrigés : URL entrante non rapprochée de son fichier source et suppression d’un fichier scellé non détectée.
- Piège : Astro conserve les entrées supprimées dans `node_modules/.astro/data-store.json`; après une fixture temporaire, nettoyer `node_modules/.astro`, `.astro` et `dist` avant la preuve finale.
- Suite : `t_343871c3` peut produire et éprouver la première page manuelle avec les commandes documentées dans `ARCHITECTURE-ACCES-COMMERCIAUX.md`. Aucun push ni déploiement exécuté.
