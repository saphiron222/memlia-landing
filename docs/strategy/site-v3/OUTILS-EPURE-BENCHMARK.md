# Épure des pages d'outils gratuits — benchmark et inventaire (phase 1, 14/10/2026)

Statut : **en attente du go de Kevin** (porte de fin de phase 1). Aucune ligne de code n'a changé.
Base : `origin/main` 554fafc5, pages servies par memlia.fr le 14/10/2026.
Données brutes jointes dans `outils-epure/` :
- `inventaire-avant.json` : toutes les pages, 375×812 et 1440×900 ;
- `benchmark.json` : les références ;
- `mots-avant-apres.json` ;
- `captures/` : 26 captures du premier écran, mobile et bureau.

## 0. Ce que la mesure change au cadrage

1. **Le gabarit sert 22 pages, pas 4.** Les 22 pages sous `src/pages/outils-comptables-gratuits/` utilisent toutes `src/layouts/Outil.astro` : 21 outils `disponible` et le témoin. Toute modification du gabarit les touche toutes. Les 4 calculateurs nommés dans la consigne sont les plus anciens, pas les seuls.
2. **Sur aucune page, l'outil n'est visible au premier écran.**
   - Mobile 375×812 : le premier champ est à 1 147–1 975 px du haut (médiane 1 485), soit 1,4 à 2,4 écrans à défiler.
   - Bureau 1440×900 : il est à 994–1 320 px (médiane 1 192).
   - Sur mobile, le premier écran montre une **image figée de l'outil**, pas l'outil.
3. **La mention locale est dite 3 fois**, et le mot « navigateur » apparaît 5 fois sur la page marge.
4. **La source datée est en conflit avec la charte.** La consigne demande de garder « la source et sa date de vérification ». La charte §7 bis (décision de Kevin du 06/10) interdit d'afficher les dates de consultation ou de vérification. Les tests `template-a.spec.ts:64` et `outils.spec.ts:320` refusent « vérifiée le » dans `[data-official-source]`. La date reste dans les données (`source.verifieeLe`), mais aucun rendu ne la lit. → **décision D2**.
5. **L'épure était déjà prescrite par l'audit du 06/10** (CONT-15, `audit-2026-10/AUDIT.md:87-101`) :
   - une seule explication locale ;
   - une FAQ courte qui y renvoie ;
   - un seul bloc de suite ;
   - retrait de la « seconde clôture commerciale redondante ».
6. **Le fichier `mesures/outils-j7-2026-09-27.md` n'existe pas** (`veille-outils-2026-10-03.md:22` le décrit comme non versionné). Les chiffres de demande viennent de `mesures/semaine-2026-W41-demande.json`, sur 28 jours :

   | Page | Impressions | Clics |
   |---|---:|---:|
   | Hub | 37 | 0 |
   | Échéance | 59 | 0 |
   | Rapprochement | 51 | 0 |
   | Marge | 12 | 0 |
   | Amortissement | 3 | 0 |

   Les 17 autres outils n'ont aucune ligne.
7. **Aucune SERP Google France mesurée.** Les 8 appels DataForSEO ont été refusés (HTTP 402, solde du compte −0,0036 $, coût réel 0 $). La lecture des SERP ci-dessous vient d'un moteur de repli non localisé : **elle n'est pas un rang Google**. Le script est prêt à être relancé dès que le compte est rechargé (D7).
8. **Performance Lighthouse des pages outils au 06/10 : 57 à 94** (`AUDIT.md:189-201`), sous le plancher de 95. L'image figée chargée en `eager` en tête de page est un suspect à mesurer en phase 4, pas une certitude.
9. **Fenêtre de mesure en cours.** OUTILS-BOUCLE fixe :
   - 21/10 : lecture de la fenêtre du 20/09 au 17/10 ;
   - 19/12 : verdict à J+90.

   Une refonte pendant la fenêtre se **date dans le relevé** pour ne pas fausser la lecture (`OUTILS-BOUCLE.md:21, 82`).

## a. Grille de benchmark

Chaque référence a été visitée dans le navigateur intégré à 375×812, puis relevée à 375×812 et 1440×900 par le même script que nos pages (`benchmark.mjs`). Une ligne n'affirme que ce qui a été vu à l'écran ou mesuré dans le DOM.

| Page | Type | Ordre des sections (mobile) | Premier écran mobile | 1er champ mobile / bureau (px) | Formule | Source | Limites | FAQ | Appel à l'action | Mots |
|---|---|---|---|---|---|---|---|---|---|---:|
| [Urssaf, salaire brut/net](https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net) | simulateur officiel | H1 + date → encadré « Avant de commencer… » (limites, bouton « J'ai compris ») → simulateur → « Comment calculer… » ×2 → conseiller → ressources | H1, encadré des limites | ≈ 975–1 063 / 742 | sous l'outil | sous l'outil | **avant l'outil**, refermable | non (sections « Comment… ») | un seul (« Échanger avec un conseiller »), après l'explication | 677 |
| [Shine, simulateur auto-entreprise](https://www.shine.fr/simulateur-auto-entreprise/) | page d'entrée vers un simulateur | H1 + phrase + bouton « Accéder au simulateur » + 3 pastilles (Gratuit, Rapide, 3 minutes) → texte → produit → FAQ (3, accordéon) | H1, phrase, bouton, pastilles | outil hors page | non | non | non | accordéon | bouton de l'outil, puis produit | 643 |
| [PayFit, simulateur de charges](https://payfit.com/fr/fiches-pratiques/simulateur-charges-auto-entrepreneur/) | article (fiche pratique) | H1 + auteur + date → téléchargement contre e-mail → article → FAQ (5, `details`) | H1, auteur, encart de téléchargement | aucun outil sur la page | non | oui | oui (« frais cachés ») | 5 `details` | « Essayez maintenant » au milieu, téléchargements ×3 | 2 023 |
| [L-Expert-comptable, amortissement](https://www.l-expert-comptable.com/calculateurs/simulateur-amortissement-lineaire-vs-degressif.html) | outil + long guide | H1 + date → **outil (iframe) à 536 px** → guide (≈ 20 000 px) → FAQ | H1, date, début de l'outil | iframe à 536 / — | sous l'outil | oui | dans le guide | oui (h3) | « Devis gratuit » en en-tête | 3 241 |
| [Clementine, taux de marge](https://www.clementine.fr/blog/calculateurs/simulateur-taux-de-marge/) | article avec calculateur | grande image → H1 → **calculateur à 2 312 px** → article → FAQ (2, `details`) → partage → « Se faire accompagner » | image, menu, H1 | 2 312 (vu dans le navigateur) / — | oui | oui | oui | 2 `details` | en fin d'article | 1 389 |
| [Omni, margin](https://www.omnicalculator.com/finance/margin) | calculateur | H1 → **calculateur entier au premier écran** → explication (chargée en différé) | H1, tous les champs | 279–541 / 522 | sous l'outil | sous l'outil | non vu | sous l'outil | aucun | 291 au premier rendu mobile, 1 725 au rendu bureau |
| [Calculator.net, margin](https://www.calculator.net/margin-calculator.html) | calculateur | fil d'Ariane + H1 → une phrase → **champs pré-remplis d'un exemple, résultat déjà affiché** → définitions | H1, champs, bouton, résultat | 277 / 276 | définitions sous l'outil | non | non | non | aucun | 1 139 |
| [Ahrefs, Backlink Checker](https://ahrefs.com/backlink-checker) | outil gratuit d'éditeur | fil d'Ariane + H1 + une phrase → **saisie et bouton** → fonctions du produit payant → guides → tarifs | H1, phrase, champ, bouton | 505 / 437 | — | — | — | — | vente du produit **après** l'outil | 1 137 |
| **memlia.fr, marge** | outil + règle | fil d'Ariane + H1 + phrase + bouton d'ancre + **image figée de l'outil** → Promesse → Zone → Preuves → Garanties → FAQ (2) → Suite (3 cartes) → Appel final (3 puces) | fil d'Ariane, H1, phrase, bouton, image de l'outil | **1 317 / 1 112** | dans la Zone | dans Preuves | dans la Zone, puis 2 rappels | 2 `details` | 2 liens /contact dans `main` | 668 |
| **memlia.fr, hub** | catalogue | héros + image → 6 catégories, 21 cartes (Entrée / Résultat / Limite + « Gratuit, sans inscription. » ×21) → appel final | héros, image | — | — | — | 21 limites | non | 1 | 1 679 (17 209 px sur mobile, ≈ 21 écrans) |

**Ce que le benchmark établit :**
1. **Les outils qui servent l'utilisateur mettent la saisie au premier écran mobile** : Omni à 279 px, Calculator.net à 277 px, Ahrefs à 505 px, L-Expert-comptable à 536 px. Ceux qui ne le font pas sont des articles qui contiennent un outil (Clementine, PayFit) ou des pages d'entrée (Shine).
2. **Rien ne précède l'outil, sauf un H1 et une phrase.** Seule l'Urssaf place un encadré de limites avant l'outil, en version courte et refermable.
3. **L'explication vient après l'outil.** Formule, méthode, source et FAQ sont toujours sous l'outil : « Comment calculer… » chez l'Urssaf, guide chez L-Expert-comptable, définitions chez Calculator.net.
4. **Un seul appel commercial, après la valeur.** L'Urssaf en a un ; Omni et Calculator.net aucun ; Ahrefs vend après l'outil. Aucune référence ne répète son appel.
5. **Personne ne montre une image de l'outil au-dessus de l'outil.** Calculator.net montre plutôt un **résultat déjà calculé** sur un exemple.
6. **Le texte n'est pas l'ennemi, son emplacement l'est.**
   - Selon la lecture de repli, les pages qui se classent portent 1 000 à 1 500 mots **sous** l'outil : formule, exemple chiffré, FAQ.
   - Médiane de 1 451 mots sur 38 pages, 1 370 sur les seules pages outil ou modèle.
   - Aucun calculateur sans texte n'apparaît.
   - Les sources officielles sont rares chez les concurrents (vu sur échéance et FEC) : **c'est notre différence**.

## b. Inventaire de chaque information actuelle

**Gabarit `Outil.astro` : 22 pages, mêmes sections, contenu tiré de `src/data/outils.ts`.**

Mots médians par section :

| Section | Mots |
|---|---:|
| hero | 36 |
| promesse | 26 |
| calcul | 550 |
| preuves | 110 |
| garanties | 62 |
| faq | 85 |
| suite | 86 |
| appel | 65 |

Les références d'une raison renvoient à la grille (§a), au rapport de contraintes (A–H, relevé du 14/10) ou au dépôt.

| # | Section | Information | Occurrences | Verdict | Raison |
|---|---|---|---|---|---|
| 1 | Hero | fil d'Ariane, 3 niveaux ; le dernier répète le H1 | 1 | **garder** (compacter sur une ligne en mobile) | BreadcrumbList ; présent chez Ahrefs et Calculator.net ; test témoin `.ariane [aria-current]` = H1 |
| 2 | Hero | H1 | 1 | **garder** | un seul `h1` (SEO acquis) |
| 3 | Hero | chapô (`description`) | 1 | **garder**, une phrase | Ahrefs, Calculator.net : une phrase avant l'outil |
| 4 | Hero | bouton « Utiliser l'outil », ancre vers `#outil-calcul` | 1 | **supprimer** | l'outil suit immédiatement ; aucune référence n'a d'ancre vers son propre outil (test `template-a.spec.ts:35-41` à réécrire) |
| 5 | Hero | image figée de l'outil (`proof`, `eager`) | 1 | **déplacer ou retirer : D3** | rien ne précède l'outil chez les références ; ≈ 400 px de mobile ; suspect de performance ; garde son usage Open Graph |
| 6 | Promesse | « Vous saisissez / Vous obtenez » | 1 | **supprimer** | le formulaire montre déjà les champs ; aucune référence n'a ce bloc ; l'information reste sur les cartes du hub |
| 7 | Zone | h2 masqué « Utiliser l'outil » | 1 | **garder** | structure des titres et accessibilité |
| 8 | Zone | règle ou formule avant le formulaire | 1 | **garder** | Omni et L-Expert-comptable placent la formule près de l'outil ; charte : « la règle écrite reste lisible » |
| 9 | Zone | formulaire, bouton d'exemple fictif, résultat et trace | 1 | **garder tel quel** | cœur de la page ; logique des calculateurs inchangée ; événements `memlia:outil` |
| 10 | Zone | « Ce qui reste dans votre navigateur » + `mentionLocale` | **3** (Zone, Preuves, FAQ) | **garder une fois**, ici, près du formulaire | consigne : « exactement une fois » ; CONT-15 |
| 11 | Zone | phrase fixe « Seul un clic volontaire vers « Confier une première tâche »… consentement » | 1 | **replier** dans la FAQ « Mes données… » | détail de consentement, utile mais pas au cœur du calcul |
| 12 | Zone | « Ce que cette page ne fait pas » + `limites` (2–3) | 1 + 2 rappels | **garder une fois**, sous le résultat | charte : limites et refus lisibles une fois ; Urssaf : limites près de l'outil ; test `outils.spec.ts:309` |
| 13 | Preuves | surtitre « La règle reste lisible » + h2 « Le calcul, sa source et son refus sont visibles. » | 1 | **supprimer** | discours sur la page elle-même ; système de page : au plus 1 surtitre pour 3 sections |
| 14 | Preuves | cellule « Calcul local » (= `mentionLocale`) | doublon de 10 | **supprimer** | redite |
| 15 | Preuves | cellule « Arrêt explicite » (= dernière limite) | doublon de 12 | **supprimer** | redite |
| 16 | Preuves | source officielle : nom, extrait, lien, complément (`[data-official-source]`) | 1 | **garder**, dans « Comment c'est calculé », sous l'outil | fact-check obligatoire ; Urssaf « Comment calculer » ; rare chez les concurrents, donc différenciante ; test `outils.spec.ts:309` |
| 17 | Garanties | « Sans compte ni adresse e-mail… » | 1 + FAQ + carte Explorer | **fusionner** en une mention courte sous le H1 (« Gratuit, sans compte ») | les pastilles de Shine ; 3 occurrences aujourd'hui |
| 18 | Garanties | « Aucune connexion sortante… » (CSP) | 1 + FAQ | **fusionner** dans la réponse FAQ sur les données | redite ; la CSP `connect-src 'none'` ne bouge pas |
| 19 | Garanties | « Les limites avant le résultat… la source datée… » | 1 | **supprimer** | promet une date que la page n'affiche plus (incohérence `OutilGaranties.astro:20`) ; les limites sont en 12 |
| 20 | FAQ | « Avant d'utiliser l'outil. » + intro « Les deux objections… » | 1 | **supprimer l'intro**, garder un titre court | discours de conception |
| 21 | FAQ | « Cet outil est-il vraiment gratuit ? » | 1 | **garder** | Shine, PayFit, Clementine : FAQ en accordéon |
| 22 | FAQ | « Mes données quittent-elles le navigateur ? » (réponse = `mentionLocale` + CSP) | 1 | **garder**, sans recopier la mention : renvoyer à 10, plus la CSP et la phrase 11 | mention locale exactement une fois |
| 23 | Suite | surtitre « Après l'outil » + h2 « Choisissez la suite… » + intro | 1 | **supprimer** | trois lignes pour annoncer trois liens |
| 24 | Suite | carte « Explorer » → hub | 1 (+ fil d'Ariane) | **garder le lien**, sans carte | contrat de liens (hub) ; le fil d'Ariane y mène déjà |
| 25 | Suite | carte « Comprendre » → `pageService` | 1 | **garder le lien** | contrat de liens, `test_build.py` (liens entrants) |
| 26 | Suite | lien « Consulter la ressource associée » → `articleExact` (3 outils) | 1 | **garder le lien** | contrat de liens |
| 27 | Suite | carte « Passer à votre tâche » → /contact | 1 | **fusionner** avec l'appel final | double /contact (CONT-15 : « seconde clôture redondante ») |
| 28 | Appel final | titre « La règle de votre cabinet ne tient pas dans un calculateur. » (ou variante « Écrire ») | 1 | **garder**, en adaptant le titre aux outils qui ne calculent pas | un seul appel commercial, après la valeur ; le titre actuel est faux pour 16 outils qui ne calculent pas |
| 29 | Appel final | texte « Nous observons la tâche complète… » | 1 | **garder**, une phrase | charte : « Confier une première tâche » |
| 30 | Appel final | 3 puces geste / limite / résultat | 1 + texte de la carte 27 | **supprimer** | redite de la carte 27 ; aucune référence ne détaille son appel |
| 31 | Appel final | bouton « Confier une première tâche » → /contact | 1 dans `main` (2 aujourd'hui) | **garder une fois**, dans `.feuille` | événement `cta` (`Outil.astro:124`) ; contrat de liens « un seul appel » |
| 32 | Page | JSON-LD WebPage, WebApplication, BreadcrumbList | 1 | **garder** ; FAQPage : **D6** | SEO acquis |
| 33 | Page | `title`, `description`, canonical, Open Graph, URL | 1 | **inchangés** | hors périmètre |

**Hub `src/pages/outils-comptables-gratuits.astro`** : 1 679 mots, 17 209 px sur mobile.

| # | Information | Occurrences | Verdict | Raison |
|---|---|---|---|---|
| H1 | surtitre « Un besoin, un résultat, une limite » | 1 | **supprimer** | discours |
| H2 | H1 + chapô | 1 | **garder** | — |
| H3 | image du hub (`v2/24-outils-hub`) | 1 | **replier ou retirer (D3)** | même raison que l'image des outils |
| H4 | 6 sections de catégorie (h2) | 6 | **garder** | classement utile |
| H5 | carte : h3 + description | 21 | **garder** | — |
| H6 | carte : `dl` Entrée / Résultat / Limite | 21 | **réduire à une ligne de description** (la limite vit sur la page de l'outil) | ≈ 21 × 25 mots ; listes de Calculator.net et Omni : titre et une ligne (test `outils.spec.ts:16` à réécrire) |
| H7 | carte : « Gratuit, sans inscription. » | **21** | **dire une fois** sous le H1 | redite |
| H8 | carte : lien `libelleAction` | 21 | **garder** | — |
| H9 | appel final `#hub-confier` | 1 | **garder** | test l.16 ; un seul appel |

## c. Structure cible proposée (à valider)

L'hypothèse de départ est **confirmée sur l'ordre et les redites**, et **nuancée sur le volume** : les pages qui se classent gardent 1 000 à 1 500 mots sous l'outil. L'épure retire ce qui se répète ou parle de la page elle-même ; elle ne retire pas l'explication utile, qui descend sous l'outil.

1. **Tête, premier écran mobile** : fil d'Ariane compact, H1, une phrase, une ligne « Gratuit, sans compte ». Pas d'image, pas de bouton d'ancre.
2. **L'outil, immédiatement.**
   - Objectif : le premier champ visible sans défiler à 375×812 et à 1440×900.
   - La règle ou formule courte reste juste au-dessus du formulaire.
   - La mention locale, une fois, en une ligne près du formulaire.
3. **Le résultat avec sa trace**, inchangé, puis « Ce que cette page ne fait pas », une fois.
4. **« Comment c'est calculé »** : la source officielle (nom, extrait, lien, complément), plus l'image figée si D3 la garde ici.
5. **Une FAQ courte, 2 questions, en accordéon.** Elle absorbe les Garanties et la phrase de consentement, sans recopier la mention locale. FAQPage selon D6.
6. **Une seule fin.**
   - Les liens du contrat (hub, page service, article) sur une ligne.
   - Un seul bloc « Confier une première tâche » : un titre adapté à la catégorie, une phrase, un bouton.

Sections du gabarit :
- **retirées :** OutilPromesse, OutilGaranties, OutilPreuves comme section (sa source descend en 4) ;
- **fusionnées :** OutilSuite et AppelFinal ;
- **conservées :** OutilHero allégé, OutilZone, OutilFaq.

**Invariants de test proposés pour la phase 3**, en remplacement du compte de 8 `[data-tool-section]` :
- premier champ visible au premier écran mobile 375×812 ;
- mention locale exactement une fois ;
- limites et source officielle une fois chacune, sans date ;
- un seul `h1` ;
- types JSON-LD présents ;
- un seul lien /contact dans `main` ;
- liens du contrat présents ;
- `.feuille` contient le lien /contact (événement `cta`).

## d. Mots avant / après par page

L'« après » est une **estimation** calculée sur l'inventaire. Méthode :
- on retire la Promesse, les redites et le méta-discours des Preuves, les Garanties, le bouton d'ancre et la phrase de consentement ;
- on garde la source ;
- on compte une FAQ à 45 mots, des liens de suite à 20 et un appel à 30.

La mesure réelle se fera en phase 4.

| Page | Avant | Après (estimé) | Écart |
|---|---:|---:|---:|
| calculateur-marge-commerciale | 668 | 359 | −46 % |
| calculateur-date-echeance-facture | 739 | 447 | −40 % |
| calculateur-amortissement-comptable | 778 | 461 | −41 % |
| modele-rapprochement-bancaire-excel-gratuit | 786 | 443 | −44 % |
| assistant-lettrage-comptable-local | 1 042 | 654 | −37 % |
| bareme-heures-cac | 1 807 | 1 497 | −17 % |
| bibliotheque-prompts-comptables | 2 440 | 2 036 | −17 % |
| calculateur-roi-automatisation | 1 145 | 788 | −31 % |
| checklist-pieces-comptables | 1 248 | 882 | −29 % |
| comparateur-balances-comptables | 2 777 | 2 411 | −13 % |
| diagnostic-maturite-ia-cabinet | 826 | 504 | −39 % |
| fusionner-fichiers-csv | 1 016 | 641 | −37 % |
| generateur-charte-ia-cabinet | 1 056 | 717 | −32 % |
| generateur-prompt-expert-comptable | 1 152 | 819 | −29 % |
| generateur-prompt-ia-gratuit | 1 039 | 684 | −34 % |
| generateur-relance-facture-impayee | 1 173 | 810 | −31 % |
| preparer-pseudonymiser-fichier-csv-fec | 978 | 615 | −37 % |
| seuil-signification-audit | 1 585 | 1 245 | −21 % |
| suivi-circularisation | 1 451 | 1 134 | −22 % |
| verificateur-fec-local | 964 | 626 | −35 % |
| verificateur-prompt-ia | 930 | 595 | −36 % |
| temoin-calcul-local (noindex) | 502 | 215 | −57 % |
| **médiane, 22 pages** | **1 040** | **≈ 670** | **≈ −36 %** |
| hub | 1 679 | ≈ 700 (sans les 21 `dl` ni la mention ×21) | ≈ −58 % |

⚠ **Les 4 calculateurs historiques tombent à 360–460 mots**, loin des 1 000–1 500 portés par les pages qui se classent. Les mots retirés étaient des redites, pas de l'explication. La place pour un exemple chiffré utile existe dans « Comment c'est calculé ». L'ajouter serait du contenu nouveau (hors périmètre), donc une décision (D8).

## Décisions demandées à Kevin (porte)

| | Question | Recommandation |
|---|---|---|
| D1 | Périmètre : gabarit commun, donc 22 pages ; ou seulement les 4 calculateurs ? | **22 pages**. Deux gabarits feraient diverger les outils. |
| D2 | Source « datée » : la charte §7 bis interdit d'afficher la date ; la consigne demande de la garder. | **Charte** : source, extrait et lien visibles ; date dans les données seulement. |
| D3 | Image figée de l'outil (et celle du hub) : retirer de la page, ou déplacer sous l'outil dans « Comment c'est calculé » ? | **La déplacer sous l'outil**, en `lazy` ; elle reste l'image Open Graph. |
| D4 | Contrat et test divergent : ordre des liens, et 1 contre 2 appels /contact. | **Le contrat** : un seul /contact ; le test est réécrit. |
| D5 | Refonte pendant la fenêtre de mesure (lecture du 21/10, verdict au 19/12). | Livrer après la lecture du 21/10, **dater la refonte** dans OUTILS-BOUCLE. |
| D6 | Ajouter le JSON-LD `FAQPage` aux pages outils (absent aujourd'hui) ? | Oui si la FAQ reste ; 2 questions réelles. |
| D7 | Recharger DataForSEO pour une vraie SERP Google France avant la phase 2 ? | Recommandé : 8 SERP à 0,0035 $. Le relevé de repli n'est pas un rang Google. |
| D8 | Volume des 4 calculateurs après épure (360–460 mots). | Épurer maintenant ; un exemple chiffré par calculateur dans un chantier de contenu séparé. |
