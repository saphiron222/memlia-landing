# Hub des agents IA — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** publier sur memlia.fr un hub `/agents-ia`, neuf fiches `/agents-ia/<métier>` et la page des outils `/integrations`, lus depuis une source de données unique, sans régression du référencement acquis.

**Architecture:** deux feuilles de données typées (`specialistes.ts`, `connecteurs.ts`) qui référencent les familles de `familles.ts` par identifiant ; un gabarit de hub et un gabarit de fiche Astro, rendus au build, sans JavaScript pour les filtres ni le rejeu ; des Pages Functions qui posent une CSP sans réseau. Chaque invariant est un test écrit rouge avant le code.

**Tech Stack:** Astro, TypeScript (feuilles importées par `node --test` sous Node 22), Python `unittest` (tests de preuve), Playwright, Cloudflare Pages Functions, D1.

**Spec:** [`docs/strategy/site-v3/HUB-AGENTS-IA-SPEC.md`](../../strategy/site-v3/HUB-AGENTS-IA-SPEC.md) et ses annexes
[`hub-agents-ia/ARCHITECTURE.md`](../../strategy/site-v3/hub-agents-ia/ARCHITECTURE.md) (chemins et lignes de chaque
réutilisation, appelée ci-dessous « l'annexe »), [`JSON-LD.md`](../../strategy/site-v3/hub-agents-ia/JSON-LD.md),
[`OUTILS.md`](../../strategy/site-v3/hub-agents-ia/OUTILS.md), [`FACT-CHECK.md`](../../strategy/site-v3/hub-agents-ia/FACT-CHECK.md),
[`MOTS-CLES.md`](../../strategy/site-v3/hub-agents-ia/MOTS-CLES.md). Décisions : cadrage D1–D14, ADR 0001, charte v6 §9 bis.

## Global Constraints

- Charte v6 : « agent IA » défini à sa première apparition ; jamais « agent autonome », « collaborateur IA », « employé IA », « embaucher/recruter », « agent IA CAC », « commissaire aux comptes IA », « DPO IA », « agent comptable » ou « agent administratif » sans « IA » ; jamais « module », « complément Excel », « plateforme », « logiciel » pour Memlia, « sans erreur », gain chiffré.
- Tout ce qui sort du cabinet est préparé, jamais envoyé : chaque fiche le dit (« Ce qui ne part jamais sans vous »).
- Système de page du 07/10 : aucune capitale dans un surtitre ni un libellé (`text-transform`, `small-caps` absents des sources neuves) ; trois colonnes de cartes au plus ; la carte entière est le lien ; aucun hex littéral si le jeton existe dans `tokens.css`.
- Formulations réglementées : celles de `FACT-CHECK.md`, et aucune de sa liste « à éviter ».
- Page de compatibilité (porte 2) : un connecteur par logiciel avec son logo, aucun statut, aucun total, « d'autres s'intègrent sur demande », mention « Marques et logos de leurs titulaires, cités sans partenariat ». Les agents visent grand (charte v7 §2) : rien n'est présenté comme déjà en service chez un client.
- Aucune requête réseau sur `/agents-ia/*` ; aucun lien ni mention livrée de `revisaudit[.]fr`.
- Requêtes primaires : spec §6 (mesurées sur Google le 15/10/2026) ; zéro conflit à `scripts/verify-query-ownership.mjs`.
- `FAQPage` non émise sauf décision contraire de Kevin à la porte 2 (gabarit prêt, désactivé par donnée).
- Commits : `git commit -m "…" -- <pathspec>` uniquement ; sur le Mac, tests ciblés ; la CI « Repository gates » juge le SHA.

## Review Focus

1. **Filtres à 375 px** : les puces de filtre passent à la ligne sans défilement horizontal de la page ; chaque état garde ses cartes lisibles. Test : Tâche 4, `agents-ia.spec.ts` « filtres à 375 px sans débordement ».
2. **Filtres au clavier et au lecteur d'écran** : les radios se parcourent aux flèches, le focus est visible, le nombre de cartes de chaque filtre est lu dans le libellé. Test : Tâche 4, « filtres au clavier ».
3. **`sessionStorage` indisponible** (navigation privée, stockage bloqué) : le clic sur une tâche de départ mène quand même à `/contact`, sans erreur, champ vide. Test : Tâche 10, « stockage bloqué ».
4. **Carte qui mène à une page existante** (Salomé → `/automatisation/paie`) : la page d'arrivée montre l'agent annoncé par la carte. Test : Tâche 11, « bandeau sur la page d'arrivée ».
5. **Avatar absent** (`avatar: null` avant la Tâche 12) : un monogramme teinté s'affiche, sans image cassée ni `alt` vide. Test : Tâche 4, « monogramme quand l'avatar manque ».

---

### Task 1: Socle de contrôles rouges et garde `domaine-proscrit`

**Files:**
- Create: `tests/scripts/domaine-proscrit.test.mjs`, `config/agents-interdits.json`, `tests/scripts/specialistes-partition.test.mjs`, `tests/scripts/familles-hub.test.mjs`, `tests/scripts/specialistes-copy.test.mjs`, `tests/scripts/connecteurs.test.mjs`, `tests/scripts/agents-rejeu-source.test.mjs`
- Modify: `tests/proof/test_positioning.py` (lecture de `config/agents-interdits.json`)

**Interfaces:**
- Produces: `config/agents-interdits.json` = `{ "expressions": string[] }` (les interdits du §9 bis), lu par Node et Python ; les tests I1, I3, I8, I9 (connecteurs complets), I10 (démonstrations bien formées) importent des modules qui n'existent pas encore.

- [ ] **Step 1: Porter la garde** depuis `~/dev/interne/memlia-rdv/tests/preuve/domaine-proscrit.test.ts` : témoins d'abord (un lien, la mention neutralisée `revisaudit[.]fr`, le nom d'outil seul) ; livré (`src`, `public`, `functions`, `scripts`, `config`, `db`) : zéro mention ; `docs` : aucune forme cliquable hors la liste fermée datée `docs/strategy/site-v3/cac/TERRAIN-CAC.md:204` et `cac/terrain-verbatims.json:35`, qui échoue si elle grossit.
- [ ] **Step 2: Run** `node --test tests/scripts/domaine-proscrit.test.mjs` — Expected: PASS (l'état de base est propre), et le témoin « lien ajouté » échoue quand on l'injecte.
- [ ] **Step 3: Écrire les tests I1, I3, I8, I9, I10** tels que l'annexe §8.2 les décrit (noms de fichiers ci-dessus), contre `src/data/specialistes.ts` et `src/data/connecteurs.ts`.
- [ ] **Step 4: Run** `node --test tests/scripts/specialistes-partition.test.mjs tests/scripts/familles-hub.test.mjs tests/scripts/specialistes-copy.test.mjs tests/scripts/connecteurs.test.mjs` — Expected: FAIL « Cannot find module …/specialistes.ts » (et non une erreur de syntaxe) ; imprimer la liste des échecs attendus.
- [ ] **Step 5: Commit** `git commit -m "test: socle rouge du hub d'agents IA et garde domaine-proscrit" -- tests/scripts config tests/proof/test_positioning.py`

### Task 2: Données (PR isolée, fusionnée tôt)

**Files:**
- Modify: `src/data/familles.ts` (pôle `developpement-cabinet`, `FAMILLES_HUB`, `TOUTES_LES_FAMILLES`)
- Create: `src/data/specialistes.ts`, `src/data/specialistes/<slug>.ts` (×9), `src/data/specialistes/autres.ts` (3 cartes), `src/data/specialistes-controle.ts`

**Interfaces:**
- Consumes: Task 1 tests.
- Produces: `AgentId`, `GROUPES`, `ISSUES`, `Specialiste`, `Fiche`, `Destination`, `HUB`, `AGENTS`, `FICHES`, `cheminAgent(a: Specialiste): string`, `titulaireDe(familleId: string): Specialiste | undefined`, `comptesParGroupe(): Record<string, number>` (types exacts : annexe §1.1) ; `FAMILLES_HUB: readonly Famille[]` (`active: false` imposé), `TOUTES_LES_FAMILLES`.

- [ ] **Step 1: Ajouter le pôle** `'developpement-cabinet'` à `PoleId` et `POLES` (`{ libelle: 'Développement du cabinet', couleur: '#c2410c' }`, sur une ligne lisible par `build-cluster-plan.py:179`) et `FAMILLES_HUB` avec `propositions-mission`, `lettre-information-clients`, `actualite-a-diffuser`, `publications-cabinet` (pôle neuf), `registre-traitements`, `demandes-droits` (pôle `numerique-it-data`). `IDS_FAMILLES` et `famillesDeLaProfession` restent sur `FAMILLES`.
- [ ] **Step 2: Écrire les douze agents** depuis la spec §0 et §3 (prénoms, groupes, teintes, destinations, familles titulaires de la partition) ; les contenus de fiche des huit fiches hors Comptabilité restent vides (remplis à la Tâche 9) ; `avatar: null`.
- [ ] **Step 3: Run** `node --test tests/scripts/specialistes-partition.test.mjs tests/scripts/familles-hub.test.mjs tests/scripts/specialistes-copy.test.mjs` — Expected: PASS ; `famillesDeLaProfession('ec').length === 60` ; douze pôles EC ; partition 60/60 et 6 familles neuves assignées.
- [ ] **Step 4: Run** `python3 docs/strategy/site-v3/build-cluster-plan.py --check` — Expected: exit 0.
- [ ] **Step 5: Commit** `git commit -m "feat(donnees): agents IA, familles du hub et pôle développement du cabinet" -- src/data/familles.ts src/data/specialistes.ts src/data/specialistes src/data/specialistes-controle.ts` ; PR isolée, prévenir les sessions éditoriales (`familles.ts` est une entrée du calendrier du blog).

### Task 3: Utilitaires JSON-LD

**Files:**
- Modify: `src/data/schema.mjs`
- Create: `src/data/schema-agents.mjs`, `tests/scripts/schema-agents.test.mjs`

**Interfaces:**
- Produces: `pageId`, `breadcrumbNode`, `itemListNode`, `collectionPageNode`, `webPageNode`, `agentServiceNode`, `faqPageNode`, `assertGraph(graph): void` (lève sur `Person`, `SoftwareApplication`, `offers`, `aggregateRating`, `review`, `@id` dupliqué, URL relative, plus d'un `Service`) dans `schema.mjs` ; `hubGraph(hub, agents)`, `ficheGraph(agent)`, `outilsGraph(page, connecteurs)` dans `schema-agents.mjs` (gabarits : `JSON-LD.md` §4). `serviceNode` inchangé.

- [ ] **Step 1: Write the failing test** : un cas par interdit (`assertGraph` doit lever) ; `hubGraph` ⇒ 0 `Service`, `ItemList.numberOfItems === 12` ; `ficheGraph` ⇒ exactement 1 `Service`, `alternateName` contient le prénom, `name` ne le contient pas ; `BreadcrumbList` à 3 niveaux dont le dernier = la canonique.
- [ ] **Step 2: Run** `node --test tests/scripts/schema-agents.test.mjs` — Expected: FAIL (fonctions absentes).
- [ ] **Step 3: Implémenter** les signatures ci-dessus.
- [ ] **Step 4: Run** le même test — Expected: PASS ; `node --test tests/scripts/schema-render.test.mjs` inchangé (PASS).
- [ ] **Step 5: Commit** `git commit -m "feat(schema): graphes des agents IA et garde assertGraph" -- src/data/schema.mjs src/data/schema-agents.mjs tests/scripts/schema-agents.test.mjs`

### Task 4: Le hub `/agents-ia`

**Files:**
- Create: `src/pages/agents-ia/index.astro`, `src/components/sections/{AgentCarte,AgentAnnuaire,AgentAvatar,Derriere}.astro`, `tests/browser/agents-ia.spec.ts`
- Modify: `src/styles/tokens.css` (`--avatar-carte: 84px`, `--avatar-heros`), `scripts/lib/sitemaps.mjs` (type `agents`), `tests/proof/test_build.py` (`agent_pages()`, `PAGES_FIXES`), `tests/proof/test_sitemaps_types.py`, `scripts/verify-page-contract.mjs` (`sourceForRoute`, `expectedSchema`), `config/page-intent-contract.json` (`/agents-ia`, requête « agent ia comptable »), `config/page-route-contracts.json`, série de preuves `agents-ia` (cadre `49-hero-agents-ia`)

**Interfaces:**
- Consumes: `AGENTS`, `GROUPES`, `HUB`, `cheminAgent`, `comptesParGroupe` (Task 2) ; `hubGraph` (Task 3).
- Produces: `<AgentCarte agent={Specialiste} />` (réutilisée par les voisins des fiches), `<AgentAvatar agent={Specialiste} taille="carte"|"heros" />` (monogramme si `avatar === null`).

- [ ] **Step 1: Write the failing tests** (`agents-ia.spec.ts`, avec `javaScriptEnabled: false` sauf mention) : 12 `[data-carte-agent]` visibles par défaut, chacun lien vers `cheminAgent` ; filtre « Production et conseil » = 5 cartes disposées 3 + 2 centrées, « Relation client » = 3, « Vie du cabinet » = 2 × 2 ; aucun `<script>` de filtre ; un seul `h1` ; aucune capitale calculée (`text-transform !== 'uppercase'`) ; **filtres à 375 px sans débordement** (`scrollWidth <= clientWidth`) ; **filtres au clavier** (flèches, focus visible, compte lu dans le libellé) ; **monogramme quand l'avatar manque**.
- [ ] **Step 2: Run** `npx playwright test tests/browser/agents-ia.spec.ts` — Expected: FAIL (route 404).
- [ ] **Step 3: Implémenter** le hub selon la spec §1 et l'annexe §2 (héros centré, « Derrière chaque agent, nous », annuaire avec radios + `:has()` + surcharge `flex-basis` par filtre, définition détaillée, tableau des métiers depuis `frontiereEnBref`, « Construit sur votre cabinet », mention, appel final).
- [ ] **Step 4: Run** `npx playwright test tests/browser/agents-ia.spec.ts tests/browser/cartes.spec.ts`, `python3 -m unittest tests.proof.test_build tests.proof.test_sitemaps_types tests.proof.test_cartes`, `node scripts/verify-query-ownership.mjs` — Expected: PASS, 0 conflit.
- [ ] **Step 5: Commit** `git commit -m "feat(hub): annuaire des agents IA, filtres sans JavaScript" -- <fichiers ci-dessus>`

### Task 5: Navigation

**Files:**
- Modify: `src/data/navigation.mjs`, `src/components/Footer.astro`, `tests/navigation-attendue.mjs`, `tests/scripts/navigation-v3.test.mjs`, `tests/browser/{site,navigation-v3,navigation-mobile,responsive-site-v2}.spec.ts` (assertions listées à l'annexe §0 E10)

**Interfaces:**
- Produces: groupe `{ id: 'automatise', sousEntrees: [Par tâche → /automatisation-cabinet-comptable, Par métier → /agents-ia, Dans vos outils → /integrations] }`.

- [ ] **Step 1: Mettre à jour les attendus** (sept destinations) et les specs, rouges contre la navigation actuelle.
- [ ] **Step 2: Run** `node --test tests/scripts/navigation-v3.test.mjs && npx playwright test tests/browser/navigation-v3.spec.ts tests/browser/navigation-mobile.spec.ts` — Expected: FAIL sur les nouvelles destinations.
- [ ] **Step 3: Implémenter** le groupe dans `navigation.mjs` et le pied (`Nav.astro` n'a rien à changer : il gère déjà tout groupe).
- [ ] **Step 4: Run** les mêmes commandes + `npx playwright test tests/browser/site.spec.ts tests/browser/navigation-mobile-burger.spec.ts` — Expected: PASS, menu au clavier, à la souris, en mobile et sans JavaScript.
- [ ] **Step 5: Commit** `git commit -m "feat(nav): ce qu'on automatise, par tâche, par métier, dans vos outils" -- <fichiers>`

### Task 6: Fiche pilote `/agents-ia/comptabilite`

**Files:**
- Create: `src/pages/agents-ia/[metier].astro`, `src/layouts/Agent.astro`, `src/components/sections/{AgentHero,AgentRejeu,Frontiere,RegleEcrite,AgentLivrables,AvecSans,AgentFamilles,AgentOutils,AgentDepart}.astro`, `scripts/render-agents-proofs.mjs`
- Modify: `src/data/specialistes/comptabilite.ts` (contenu complet), `scripts/render-proofs-v2.mjs` (`--series=agents-ia`, `data-og-only`), `config/page-contract-exemptions.json` (clause média motivée), `config/page-intent-contract.json` (« ia comptabilité »)

**Interfaces:**
- Consumes: Tasks 2-4 ; `couvertureDe` (`couverture-logiciels.mjs`).
- Produces: le gabarit de fiche, lu par `getStaticPaths` sur `FICHES` ; `AgentRejeu` rend `Fiche['rejeu']`.

- [ ] **Step 1: Write the failing tests** : `agents-rejeu-source.test.mjs` (la démonstration de `comptabilite` a quatre cas, chaque issue ∈ {Préparé, À valider, Arrêt}, au moins un Arrêt avec sa raison, mention « dossier fictif » rendue) ; `agents-ia.spec.ts` « fiche » (un `h1` = `og:title` = `headline`, ligne `Arrêt` barrée avec sa raison, « Ce qui ne part jamais sans vous » présent, aucun prix, lien vers la source du rejeu).
- [ ] **Step 2: Run** `node --test tests/scripts/agents-rejeu-source.test.mjs` (après `npm run build`) — Expected: FAIL (route absente).
- [ ] **Step 3: Implémenter** le gabarit selon la spec §2 (douze sections) et l'annexe §2 ; remplir `comptabilite.ts` depuis la spec §3, copy passée par `marketing-skills:copywriting` puis `copy-editing`.
- [ ] **Step 4: Run** les deux tests + `node scripts/verify-page-contract.mjs` — Expected: PASS ; fiche relevée à 375 et 1440 px ; revue `metier` PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(fiche): gabarit d'agent IA et fiche comptabilité" -- <fichiers>` ; **ne pas fusionner sur `main` avant la Tâche 7**.

### Task 7: Livraison sans réseau (CSP et Functions)

**Files:**
- Create: `functions/agents-ia.js`, `functions/agents-ia/<slug>.js` (×9), `tests/scripts/agents-ia-delivery.test.mjs`, `tests/scripts/agents-ia-csp.test.mjs`
- Modify: `public/_headers`

**Interfaces:**
- Produces: CSP `default-src 'self'; script-src 'self'; connect-src 'none'` posée par `_headers` **et** par chaque Function (patron `functions/contact.js`, balise Insights retirée).

- [ ] **Step 1: Write the failing tests** : chaque Function répond avec la CSP ; aucun `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` dans les chunks chargés par `/agents-ia/*` ; Playwright avec la CSP injectée : 0 violation, 0 requête hors origine.
- [ ] **Step 2: Run** `node --test tests/scripts/agents-ia-delivery.test.mjs tests/scripts/agents-ia-csp.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implémenter** les Functions et l'en-tête.
- [ ] **Step 4: Run** les deux tests + `npx playwright test tests/browser/agents-ia.spec.ts` — Expected: PASS ; mutant « `fetch` ajouté » ⇒ FAIL.
- [ ] **Step 5: Commit** `git commit -m "feat(livraison): CSP sans réseau sur les agents IA" -- functions public/_headers tests/scripts/agents-ia-delivery.test.mjs tests/scripts/agents-ia-csp.test.mjs`

### Task 8: Page de compatibilité `/integrations`

**Files:**
- Create: `src/data/connecteurs.ts`, `src/components/sections/QuiPrendCeMetier.astro`
- Modify: `src/pages/integrations/index.astro` (ajout, recherche des guides intacte), `config/page-intent-contract.json` (« intégration logiciels cabinet comptable »), `config/page-contract-exemptions.json` (raison corrigée), `scripts/verify-page-contract.mjs` (`expectedSchema` + `BreadcrumbList`), `tests/browser/integrations-hub-copy.spec.ts`, `tests/scripts/integration-scope-html.test.mjs`

**Interfaces:**
- Consumes: `outilsGraph` (Task 3).
- Produces: `STATUTS`, `Statut`, `DOMAINES`, `Connecteur`, `MENTION_MARQUES`, `PAGE_OUTILS` (annexe §1.2) ; `<QuiPrendCeMetier agent variante="bandeau"|"ligne" />`.

- [ ] **Step 1: Write the failing test** `connecteurs.test.mjs` (déjà rouge depuis la Tâche 1) : chaque connecteur a nom, éditeur, domaine, logo (`/logos/<id>.svg|webp` présent) et une ligne « ce que nos agents font avec » ; ids uniques ; aucun champ de statut ; `guides` ⊂ `INTEGRATIONS` ; aucun `lien` ni logo vers un domaine proscrit ; aucun total rendu.
- [ ] **Step 2: Run** `node --test tests/scripts/connecteurs.test.mjs` — Expected: FAIL.
- [ ] **Step 3: Implémenter** `connecteurs.ts` depuis `hub-agents-ia/CONNECTEURS.md`, logos téléchargés depuis les sites des éditeurs **après accord de Kevin** (liste des fichiers, sources et tailles), puis la page selon la spec §5 (sections par domaine, cartes à logo, « intégration sur demande », un seul lien par guide, mention de marques).
- [ ] **Step 4: Run** `node --test tests/scripts/connecteurs.test.mjs` + `npx playwright test tests/browser/integrations.spec.ts tests/browser/integrations-hub-copy.spec.ts tests/browser/cartes.spec.ts` + `node scripts/verify-query-ownership.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(outils): /integrations devient la page de compatibilité logiciels" -- <fichiers>`

### Task 9: Les huit fiches restantes et les trois cartes cibles

**Files:**
- Modify: `src/data/specialistes/{juridique-fiscal,finance,commercial,communication,relation-client,gestion-cabinet,rh-cabinet,protection-donnees}.ts`, `config/page-intent-contract.json` (requêtes de la spec §6), `config/page-contract-exemptions.json`, `public/llms.txt` (section « Agents IA »), `scripts/lib/llms-inventory.mjs`, `tests/scripts/llms-inventory.test.mjs`

- [ ] **Step 1: Étendre** `agents-rejeu-source.test.mjs` aux neuf fiches : chacune a sa démonstration bien formée (spec §2.1).
- [ ] **Step 2: Run** — Expected: FAIL (contenus vides).
- [ ] **Step 3: Remplir** chaque fiche depuis `hub-agents-ia/AGENTS-CONTENU.md` et la spec §6, formulations réglementées depuis `FACT-CHECK.md` ; copywriting puis copy-editing.
- [ ] **Step 4: Run** `npm run build && node --test tests/scripts/agents-rejeu-source.test.mjs tests/scripts/specialistes-copy.test.mjs tests/scripts/llms-inventory.test.mjs && node scripts/verify-page-contract.mjs && node scripts/verify-query-ownership.mjs` — Expected: PASS ; revues `metier` (paie, fiscal, RGPD) PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(fiches): huit fiches d'agents IA" -- <fichiers>`

### Task 10: Pré-remplissage du contact (`ready-for-human` : migration)

**Files:**
- Create: `db/contact/0003-tache.sql`, `tests/scripts/contact-tache-storage.test.mjs`, `tests/browser/contact-tache.spec.ts`
- Modify: `src/components/sections/AgentDepart.astro` (script externe), `src/pages/contact.astro`, `functions/api/contact.js`, `scripts/contact-messages.mjs`, `src/pages/politique-de-confidentialite.astro`, `package.json` (`contact:schema:tache`)

**Interfaces:**
- Produces: clé `sessionStorage` `memlia:tache` = `{ version: 1, id: string }` ; champ `<select name="tache">` (options = `TOUTES_LES_FAMILLES`) ; colonne `messages.tache` (CHECK de forme, annexe §6).

- [ ] **Step 1: Write the failing tests** : chaque id accepté, `x'; DROP` refusé par le CHECK, id inconnu ⇒ `null` et message écrit ; clic ⇒ champ prérempli et annoncé ; rechargement ⇒ vide ; valeur falsifiée ignorée ; **stockage bloqué** ⇒ navigation et envoi possibles ; sans JavaScript ⇒ champ vide ; `origine` et consentements intacts.
- [ ] **Step 2: Run** `node --test tests/scripts/contact-tache-storage.test.mjs && npx playwright test tests/browser/contact-tache.spec.ts` — Expected: FAIL.
- [ ] **Step 3: Implémenter** (annexe §6).
- [ ] **Step 4: Run** les deux + `node --test tests/scripts/contact-chrome-csp.test.mjs` — Expected: PASS.
- [ ] **Step 5: Commit** ; **Kevin applique `0003` en production avant la fusion de la fonction**.

### Task 11: Maillage

**Files:**
- Modify: `src/layouts/Service.astro` (ligne « Qui prend cette tâche »), `src/pages/automatisation-cabinet-comptable.astro` (#perimetre), `src/data/accueil/ec.ts` (5ᵉ destination), `src/layouts/Article.astro` (ligne « Qui prépare cette tâche »), `src/data/blog-commercial-links.mjs` (`estLienCommercialBlog`), `tests/scripts/data-driven-counts.test.mjs`

- [ ] **Step 1: Write the failing test** : un test d'existence dans le HTML rendu pour chaque flèche de la matrice (spec §6), dont **bandeau sur la page d'arrivée** (Salomé sur `/automatisation/paie`, Octavie sur `/integrations`) ; `estLienCommercialBlog('/agents-ia/comptabilite') === true`, `estLienCommercialBlog('/agents-ia?x=1') === false`.
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implémenter** sans toucher la copy existante ni un article scellé.
- [ ] **Step 4: Run** le test + `npx playwright test tests/browser/accueil-cac.spec.ts` (inchangé) — Expected: PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(maillage): agents IA reliés aux services, au pilier, à l'accueil et au blog" -- <fichiers>`

### Task 12: Avatars (`ready-for-human` : génération par Kevin dans ChatGPT)

**Files:**
- Create: `scripts/render-agent-avatars.mjs`, `docs/design/hub-specialistes/avatars/<slug>.master.webp`, `docs/design/hub-specialistes/briefs/<slug>.md`, `docs/qa/agents-ia/avatars-manifest.json`, `public/agents/<slug>-{128,256,512}.{avif,webp}`
- Modify: `src/data/specialistes*.ts` (`avatar`)

- [ ] **Step 1: Write the failing test** (`render-agent-avatars.mjs --check`) : carré 1024², fond crème dominant, signature `#27b657` présente (≥ 0,5 %), teinte du corps épinglée à la valeur du brief ; témoins : image synthétique à parts connues lue exactement, image sans signature refusée.
- [ ] **Step 2:** Kevin génère le pilote puis les onze (bible `docs/design/hub-specialistes/prompts-images.md` §5 bis) et les dépose dans `~/dev/interne/memlia-landing-sources/hub-agents-ia/`.
- [ ] **Step 3: Implémenter** la conversion et la mesure ; écrire `alt` et briefs.
- [ ] **Step 4: Run** `node scripts/render-agent-avatars.mjs --check` — Expected: PASS pour les douze ; revue côte à côte contre agpt et Factory (silhouette distincte).
- [ ] **Step 5: Commit** les dérivés, maîtres, briefs et manifeste.

### Task 13: Passe finale (les trois passes)

- [ ] **Step 1:** `AVATARS_REQUIRED = true` (plus aucun `avatar: null`) ; `npm run regen:generated` (`lastmod:sync`, scellés, `render:public`) ; tout le site est redaté (menu et pied) : le dire dans la PR.
- [ ] **Step 2: Suites** : `npx astro check` (0 erreur), CI « Repository gates » verte sur le SHA ; comptes de tests comparés à ceux d'avant le chantier (aucun compte qui baisse sans échec).
- [ ] **Step 3: Chaîne de preuve** : chaque démonstration relue par la revue `metier` ; chaque logo vérifié à sa source officielle ; comparaison par séquences de six mots contre les textes relevés d'agpt et de Factory (`~/dev/interne/memlia-landing-sources/hub-agents-ia/recherche-2026-10-14/releve/textes/`) : 0 séquence commune ; JSON-LD extrait de `dist/` et validé.
- [ ] **Step 4: Écran** : captures côte à côte agpt / Memlia par section à 1440 et 375 ; Lighthouse ≥ 95 sur les quatre axes ; agents `a11y-architect`, `seo-content`, `seo-schema`, `code-reviewer`, puis `/code-review`.
- [ ] **Step 5:** prévisualisation `npx wrangler pages deploy dist --project-name memlia --branch preview-hub-specialistes` ; branche poussée ; **aucune fusion sur `main` sans Kevin**.
