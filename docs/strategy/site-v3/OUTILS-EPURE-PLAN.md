# Épure des pages d'outils gratuits — conception et plan (phases 2 et 3, 14/10/2026)

> **Pour l'exécutant :** plan exécuté en natif dans la session du 14/10 (décision de Kevin : « go, suis tes recommandations D1 à D8 sauf D5 »). Cases à cocher en fin de tâche.

**But :** l'outil au premier écran, chaque information dite une fois, une seule fin d'appel, sur les 22 pages du gabarit `Outil.astro` et sur le hub.

**Architecture :** le gabarit garde ses composants de section (`src/components/sections/Outil*.astro`) mais n'en compose plus que six : héros allégé, zone, source, FAQ, suite, appel. Les textes propres au gabarit (titres par catégorie, FAQ) vivent dans un seul module de données, lu à la fois par le rendu et par le JSON-LD `FAQPage`, pour que les deux ne puissent pas diverger.

**Pile :** Astro 7, CSS maison (`src/styles/tokens.css`, `global.css`), Playwright (`tests/browser`), contrat de page `scripts/verify-page-contract.mjs`.

**Spécification :** `OUTILS-EPURE-BENCHMARK.md` (§b inventaire, §c structure cible, décisions D1–D8).

## Décisions de Kevin (14/10/2026)

| | Décision |
|---|---|
| D1 | 22 pages : le gabarit commun et le hub. |
| D2 | Charte §7 bis : source, extrait et lien visibles ; la date reste dans `source.verifieeLe`, jamais rendue. |
| D3 | L'image figée quitte le héros. Elle descend sous l'outil, dans « Comment c'est calculé », en `lazy`, et reste l'image Open Graph. Hub : sous le catalogue, avant l'appel. |
| D4 | Le contrat de liens fait foi : hub, ressource exacte éventuelle, page service, puis **un seul** `/contact`. Les tests sont réécrits. |
| D5 | **Refusée** : tout se livre maintenant. La refonte se date dans `OUTILS-BOUCLE.md` pour que la lecture du 21/10 la voie. |
| D6 | ~~`FAQPage` ajouté au JSON-LD des pages outils~~ — **rouverte et retirée le 14/10** : Google ne montre plus le résultat enrichi FAQ depuis le 07/05/2026 (journal Search Central) ; la FAQ reste visible. |
| D7 | DataForSEO change de compte (identifiants posés par Kevin dans `~/.claude/settings.json`) ; relevé SERP relancé dès qu'ils sont présents. |
| D8 | Épure maintenant ; l'exemple chiffré par calculateur est un chantier de contenu séparé. |

## Contraintes globales

- Jamais « module » ni « complément Excel » (`tests/proof/test_positioning.py`).
- `src/components/outils/*` ne change pas (ni logique, ni texte) ; les évènements `memlia:outil` restent ceux d'aujourd'hui, `cta` compris.
- CSP `connect-src 'none'` inchangée.
- `title`, `description`, canonical, Open Graph, URL et slugs inchangés ; un seul `h1`.
- Mention locale (`outil.mentionLocale`) rendue **une fois**, dans `[data-local-notice]`.
- Limites rendues une fois, sous le titre « Ce que cette page ne fait pas » ; source officielle une fois, dans `[data-official-source]`, sans « vérifiée le » ni « consultée le ».
- Un seul lien « Confier une première tâche » dans `main`, à l'intérieur de `.feuille`.
- Commits par chemin : `git commit -m "…" -- <chemins>`.

## Ce que le gabarit rend, dans l'ordre (`[data-tool-section]`)

1. `hero` : fil d'Ariane sur une ligne en mobile, H1, chapô (`outil.description`), ligne « Gratuit, sans compte. » ; surtitre « Démonstration technique » pour le témoin seulement. Ni image, ni bouton d'ancre.
2. `calcul` : le plateau de l'outil (slot inchangé), puis une colonne (à droite dès 1 024 px, dessous avant) : la mention locale en un paragraphe, puis « Ce que cette page ne fait pas » et les limites.
3. `source` : titre par catégorie, `source.titre` éventuel, lien `source.nom` et extrait, complément éventuel, puis l'image figée en `lazy`.
4. `faq` : « Gratuité et données », deux `details` fermés ; la réponse sur les données absorbe la CSP et la phrase de consentement, sans recopier la mention locale.
5. `suite` : une ligne de liens dans `nav[data-tool-links]` : hub, ressource exacte éventuelle, page service.
6. `appel` (`#outil-confier`) : titre par catégorie, une phrase, un bouton ; plus de liste à puces.

Textes fixés (copywriting, charte v5 §8) :

| Clé | Texte |
|---|---|
| ligne gratuite, outil | Gratuit, sans compte. |
| ligne gratuite, hub | Gratuit, sans inscription. |
| source, `calculer` | Comment c’est calculé |
| source, `verifier` | Comment c’est vérifié |
| source, `preparer` | Comment c’est préparé |
| source, `se-situer` | Comment le diagnostic est établi |
| source, `ecrire` et `explorer` | Comment c’est assemblé |
| appel, `calculer` | La règle de votre cabinet ne tient pas dans un calculateur. (inchangé) |
| appel, `ecrire` et `explorer` | Une consigne écrite est le départ, pas la tâche entière. (inchangé) |
| appel, `verifier` | Ce contrôle revient dans tous vos dossiers ? |
| appel, `preparer` | Cette préparation revient dans tous vos dossiers ? |
| appel, `se-situer` | Du diagnostic à une première tâche prise en charge. |
| appel, `suivi-circularisation` | Cette préparation revient sur tous vos mandats ? (charte §5 : le portefeuille d'un CAC se dit en mandats) |
| appel, `verificateur-prompt-ia` | titre de `ecrire` (vérifier une consigne n'est pas un contrôle de dossier) |
| FAQ, titre | Gratuité et données |
| FAQ, données | Non. La politique de sécurité de cette page bloque les connexions sortantes pendant que vous utilisez l’outil. Si vous ouvrez ensuite le formulaire de contact, le chemin de cette page n’est associé à votre message qu’avec votre accord, et seulement si vous l’envoyez. (Corrigé après revue : l'ancienne phrase « seul un clic volontaire… change de page » était fausse, la navigation et le pied de page changent aussi de page.) |
| hub, chapô | Choisissez la tâche que vous voulez préparer, puis ouvrez l’outil. Chaque page montre sa règle, sa source et ses limites. Vous gardez la validation et la décision pour votre dossier. |

## Fichiers

- Créer `src/data/outil-page.ts` : `OUTIL_GRATUIT`, `titreSource(categorie)`, `titreAppel(categorie)`, `questionsOutil()`, `faqPageNode(url, questions)`.
- Créer `src/components/sections/OutilSource.astro` (remplace `OutilPreuves.astro`).
- Modifier `OutilHero.astro`, `OutilZone.astro`, `OutilFaq.astro`, `OutilSuite.astro`, `src/layouts/Outil.astro`, `src/pages/outils-comptables-gratuits.astro`.
- Supprimer `OutilPromesse.astro`, `OutilGaranties.astro`, `OutilPreuves.astro` (seul `Outil.astro` les importe).
- Modifier `scripts/verify-page-contract.mjs` (`expectedSchema` des pages outils : + `FAQPage`) et `config/page-route-contracts.json` (témoin).
- Tests : `tests/browser/outils.spec.ts`, `tests/browser/template-a.spec.ts`, `tests/browser/roi-automatisation.spec.ts:113`.
- Tests touchés en cours d'exécution (écarts au plan) : `tests/proof/test_build.py` (graphe du témoin), `tests/browser/cartes.spec.ts` (la page échéance n'a plus de cartes), `tests/scripts/bibliotheque-prompts-page.test.mjs` (titre de la section source), et sept gardes « zéro requête après armement » qui chargent désormais les images différées avant d'armer (`tests/browser/helpers/images-chargees.ts`).
- Docs : `OUTILS-BOUCLE.md` (refonte datée), `OUTILS-EPURE-BENCHMARK.md` (statut et mesure après).

## Points à surveiller (sans test dédié ailleurs)

1. Une limite ou un extrait de source recopié **dans un composant d'outil** compterait deux fois : le test compte les occurrences dans tout `main`, pas seulement dans le gabarit.
2. Un outil `suspendu` rend la suspension à la place du plateau : la zone doit garder la mention et les limites.
3. Le témoin n'a ni `proof` ni ressource : la section source sans image, la ligne de liens à deux entrées.
4. L'évènement `cta` doit encore partir du seul bouton de fin : le test l'intercepte sans quitter la page.
5. Le texte propre à certains outils précède leur premier champ (jusqu'à 914 px mesurés en mobile) : la liste des pages qui ne tiennent pas au premier écran est nommée, mesurée et comptée dans le test, et elle échoue si une page en sort sans être retirée de la liste.

---

### Tâche 1 : tests d'abord (rouge)

**Fichiers :** `tests/browser/outils.spec.ts`, `tests/browser/template-a.spec.ts`, `tests/browser/roi-automatisation.spec.ts`.

- [x] Réécrire les tests de structure (hub, contrat de liens, pour continuer, outils publiés, témoin, outil vers contact) et ajouter : premier champ au premier écran (375×812 et 1440×900), mention une fois, limites une fois, source une fois, `FAQPage` égal aux questions rendues, un seul appel, ordre des sections, image figée en `lazy` sous l'outil, évènement `cta`.
- [x] Lancer contre la construction actuelle : rouge attendu sur chacun de ces invariants.

### Tâche 2 : données du gabarit

- [x] `src/data/outil-page.ts` avec les textes ci-dessus ; types `OutilCategory` repris de `src/data/outils.ts`.

### Tâche 3 : gabarit et sections

- [x] Recomposer `Outil.astro` (six sections, `FAQPage` dans le graphe), alléger `OutilHero`, `OutilZone`, `OutilFaq`, `OutilSuite`, créer `OutilSource`, supprimer les trois sections sorties.
- [x] `npx astro check` : 0 erreur ; tests de la tâche 1 au vert, sauf la liste nommée du point 5 après mesure.

### Tâche 4 : hub

- [x] Retirer le surtitre, les `dl` et la ligne gratuite des 21 cartes ; ligne gratuite une fois sous le H1 ; image sous le catalogue en `lazy` ; nouveau chapô.

### Tâche 5 : contrats, registres, documentation

- [x] `expectedSchema` + contrat du témoin ; `npm run lastmod:sync` si le registre l'exige ; `OUTILS-BOUCLE.md` daté ; mesure après dans le benchmark.

### Tâche 6 : trois passes et livraison

- [ ] Suites : `npx astro check`, `npm run build`, Playwright ciblé (comptes avant/après).
- [ ] Chaîne de preuve : mêmes entrées, mêmes résultats sur les quatre calculateurs historiques ; diff JSON-LD avant/après ; mots avant/après mesurés.
- [ ] Écran : captures 375×812 et 1440×900, Lighthouse ≥ 95 sur un échantillon.
- [ ] Revues `seo-content`, `a11y-architect`, `code-reviewer`, puis `/code-review`.
- [ ] Prévisualisation `preview-outils-epure`, push de la branche après contrôle du diff ; ni fusion ni production.

## Décisions de Kevin après la livraison en prévisualisation (14/10/2026, « ok pour tout sauf le 5, il faut mettre en ligne maintenant ; replanifie l'article du blog »)

| | Décision | Où |
|---|---|---|
| 1 | Retirer le JSON-LD `FAQPage` (D6 rouverte) ; la FAQ visible reste. | `Outil.astro`, `outil-page.ts`, contrats et tests revenus à trois types |
| 2 | Description du hub : « Des outils gratuits pour calculer, contrôler ou préparer une tâche comptable. Chaque outil montre sa règle, sa source et ses limites, sans inscription. » | `outils-comptables-gratuits.astro` |
| 3a | La première « limite » du rapprochement décrivait le classeur : retirée de la liste (le composant dit déjà ce que contient le classeur et la notice des signes). | `outils.ts` |
| 3b | Nouvelle source du rapprochement : proposée à Kevin, livrée dans une seconde demande de fusion. | à venir |
| 4 | Introductions des neuf outils hors premier écran mobile raccourcies : textes proposés à Kevin, seconde demande de fusion. | à venir |
| 5 | Mise en ligne immédiate : fusion sur `main` après la CI ; l'article CAC réservé au 13/10, jamais produit, devient une trace `dateManquee` (`f5b8e31b`). | — |

