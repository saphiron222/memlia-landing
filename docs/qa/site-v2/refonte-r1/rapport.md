# SITE-V2-REFONTE — pages commerciales dans le langage de l'accueil, formulaire de contact

Carte Hermes `t_3aa92bac` (sous le verrou `t_c64814ed`). Branche `site/v2-refonte`, base `main` à `2cf4931`, fusionnée en avance rapide jusqu'à `4f0d91d`. Exécutée dans Claude Code le 16/09/2026, sur le retour de Kevin après la release du site v2.

## Ce que Kevin a demandé, et ce qui a été fait

| Demande | Réponse |
|---|---|
| Retirer partout les mentions de processus lisibles (« Contenu non attesté », « Comment ce guide a-t-il été vérifié ? », statut du glossaire) | Retirées des trois articles, du glossaire, de `/garanties` et `/a-propos` (`e2196a3`). Le frontmatter éditorial reste intact ; `test_article_3_contract.py` refuse désormais tout encart de méthode rendu. |
| Dates du hub Ressources cohérentes avec les pages d'articles | Le hub date de la publication, comme la page (`src/data/resources.ts`). |
| Pages « à plat », sans image, sans le langage de l'accueil | Cinq pages refondues avec l'anatomie de l'accueil : pastille, titre centré, **preuve fonctionnelle plein cadre** dans le cadre de verre du hero, rangées preuve/copy alternées, bandes à filets, cartes, étapes numérotées, renvois, appel final propre à la page (`3e83340`). |
| « Pas des images type blog : les mêmes que l'accueil, plusieurs par page » | L'accueil ne porte aucune photo (vidéo + cadres HTML). Dix-huit cadres HTML rendus (treize de section, cinq de tête avec leur image sociale 1200 × 630), entre trois et six preuves par page. Les cinq natures mortes générées d'abord (Higgsfield, 32,5 crédits) ne sont pas retenues ; leurs sources restent hors dépôt. |
| Un vrai formulaire de contact | Page `/contact` : formulaire complet (nom, cabinet, courriel, message, consentement, piège hors écran, aucun fichier), fonctionnel **sans JavaScript** (envoi HTML, pages `/contact/merci` et `/contact/erreur` en noindex) et **avec** (envoi en place, état annoncé). Fonction Pages `functions/api/contact.js` + base D1 `memlia-contact` (`b06926d`, durcie en `f1f0854`). |

## Chaînes de preuve rejouées

| Contrôle | Résultat |
|---|---|
| `npx astro check` | 140 fichiers, 0 erreur |
| `npm run build` (audit blog, `build:site`, audit Ressources QA) | PASS — Python 64/64, Node 4 + 151, `errors: []` partout |
| `npx playwright test` (preview locale `astro preview`) | 111/111 dont 4 sur le formulaire (sans JS, avec JS via route interceptée, page d'erreur nommant le champ, pages de réponse) |
| Fonction de contact, tests unitaires (`contact-function.test.mjs`, `contact-purge.test.mjs`) | 18/18 |
| Bout en bout local, `wrangler pages dev` + D1 locale | 303 → merci ; `null`/tableau → 400 ; caractères de contrôle retirés en base ; message court → 303 erreur?champ=message ; 4ᵉ message même réseau → 429 |
| Preview Cloudflare `0669b745` (alias `preview-site-v2-refonte`) | équivalence octet pour octet sur 22 routes ; fonction : 200 / 400 / 303 en curl, **envoi réel depuis le navigateur** : « Message envoyé » ; lignes de test effacées |
| Production `e42ab971` (memlia.fr) | `verifier-production.py` : 12 indexables, 2 noindex, 12 au sitemap, 0 adresse obscurcie — PASS ; équivalence 22 routes ; fonction 405 / 400 / 200 / 303 ; base vide après effacement de la ligne de test |
| Revue de copy (`revue-copy.py`, 3 mutants) | 27/27 affirmations portées sur 6 pages — PASS |
| Oracle robot (`oracle.py`, 6 mutants) | 12 routes indexables, 12 URL au sitemap, 0 erreur |
| Preuves v2 (`render-proofs-v2.mjs --check`) | 23 actifs conformes au manifeste (18 cadres + 5 recadrages sociaux) |
| Lighthouse, médiane de 3 (`lighthouse-medianes.mjs`) | 100 partout, sauf Performance 99 sur « page commerciale mobile » et « article mobile » |
| Captures pleine page 1440 / 375 (`captures.mjs`) | 14 captures, 0 débordement ; revues à l'écran |
| Revue de code indépendante (agent `code-reviewer`) | APPROVE — 0 CRITICAL, 0 HIGH ; 1 MEDIUM (rétention) et 3 LOW, tous traités |
| Revue de sécurité indépendante (agent `security-reviewer`) | 1 CRITICAL, 3 HIGH, 4 MEDIUM, 2 LOW — voir ci-dessous |

## Ce que la revue de sécurité a changé

- **C1** sel absent → empreinte réversible : fermé par défaut (`503` sans `CONTACT_SALT`) ; sel posé en production et en preview.
- **H1** injection d'en-têtes de courriel par `nom`/`cabinet` : caractères de contrôle retirés des champs d'une ligne ; le chemin courriel est retiré (la liaison `send_email` n'existe que pour les Workers) et remplacé par un signal **Telegram sans donnée personnelle** (numéro et heure du message).
- **H2** corps JSON `null` faisait planter la fonction : `400 illisible` pour tout JSON qui n'est pas un objet.
- **H3** promesses de conservation sans mécanisme : Worker horaire `memlia-contact-purge` (`workers/purge-contact`, cron `17 * * * *`) qui efface les empreintes à 24 h et les messages à 365 jours ; déployé.
- **M1** rotation IPv6 : la limite compte le préfixe /64 ; plafond global de 60 messages/heure en plus.
- **M2** sans `cf-connecting-ip` la limite était sautée : `503`.
- **M3** taille de corps : `413` au-delà de 20 Ko annoncés.
- **M4** Turnstile côté serveur sans widget : chemin retiré (à réintroduire avec le widget, ensemble).
- **L1** interpolation d'une date calculée dans la CLI d'administration : laissée telle quelle (aucune entrée libre ; `wrangler d1 execute --command` ne lie pas de paramètres), notée.
- **L2** `.dev.vars` ajouté à `.gitignore`.

## Mise en service côté Kevin (16/09, après la release)

| Geste | État |
|---|---|
| Commande de build Cloudflare (`npm run build:site`, `dist`, Node 22) | fait ; construction git réussie depuis `e0324c06` |
| Paragraphe de la politique de confidentialité | validé |
| Email Routing pour `contact@memlia.fr` | MX `route1/2/3.mx.cloudflare.net` et SPF `v=spf1 include:_spf.mx.cloudflare.net ~all` en place (l'ancien `v=spf1 -all` supprimé) ; règle lue par l'API le 16/09 : statut `ready`, `literal=contact@memlia.fr → forward` vers le Gmail de Kevin, **active**. Courriel réel envoyé par Kevin : Cloudflare l'a reçu et transmis (son avis « missing email? » n'est pas un échec — Gmail replie un message qu'on s'envoie à soi-même). La règle *catch-all* reste inactive en mode « drop » : seule `contact@` reçoit. |
| Bot Telegram | secrets `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` posés au tableau de bord (production et preview) — le collage en saisie masquée ne marchait pas dans le terminal de l'app ; token révoqué et régénéré après avoir été collé en clair dans la conversation. Prouvé : après redéploiement `34d54d58`, un message d'essai par le formulaire est passé au statut `notifie` (Telegram a répondu OK), puis effacé |

**Les quatre gestes sont faits ; le formulaire est en service de bout en bout.** L'assistant `scripts/assistant-mise-en-service-contact.sh` reste dans le dépôt pour une remise en service (token lu dans `~/.memlia-telegram.token`, étape DNS sautée si les MX sont là).

## Après la release : la construction git publie (16/09 après-midi)

Kevin a posé la commande de build au tableau de bord. Première construction git avec ce réglage (`8e89cc5e`, commit `b1061a2`) : échec, aucun du site — le test de rendu du blog lance Chromium, absent du builder, et un test du pipeline blog expirait à 20 s sur un builder plusieurs fois plus lent que le poste local ; les 64 tests Python y passaient. Correctif `e0b11f6` : `scripts/test-scripts.mjs` joue `tests/scripts` sans les tests navigateur et imprime ce qu'il écarte (le rendu reste joué par `npm run test:blog-pipeline:render`, 1/1 en local), délais à 120 s. Construction git suivante `e0324c06` : **réussie et en ligne**, contrôle de production PASS, 22 routes identiques octet pour octet au build local, fonction de contact 405 / 400 / 200, base vide après effacement. **Désormais, pousser `main` publie** ; le déploiement explicite par wrangler n'est plus qu'un secours.

## Correction du 16/09 au soir : le menu mobile revient

Kevin : « la nav bar est mal faite en mode téléphone et sûrement en mode tablette […] on avait un burger menu avant à droite qui se dépliait, maintenant on a juste les différents liens en haut de page en pêle-mêle, je trouve ça moche. Remets comme c'était avant. »

Le site v2 avait déplié les cinq entrées dans le bandeau, en deux colonnes : atteignables sans action, mais lues comme une liste en vrac, et occupant le haut de chaque page. Le panneau refermable est restauré sous 1024 px (téléphone **et** tablette), avec les propriétés qu'il tenait déjà : cible de 48 px, fond opaque mesuré au pixel, fond rendu inerte, défilement verrouillé puis restauré à la position d'origine, sortie par Échap comme par la croix, section courante marquée. Deux choses restent hors du panneau parce qu'elles ne doivent dépendre d'aucun geste : le lien du Hub Ressources dans le bandeau, et une navigation en clair pour qui n'a pas JavaScript — le panneau, lui, ne s'ouvrirait pas. Le bandeau desktop est inchangé.

Preuves : `mobile-menu.spec.ts` restauré et adapté aux cinq pages (15 combinaisons de viewport, dont la tablette, plus clavier, verrou, viewport changeant, marquage de section), bandeau couvert à part, six specs réalignées — **132 tests navigateur**, 64 Python, 154 Node, oracle 12 routes, copy 27/27, Lighthouse inchangé (100 partout, 99 sur deux gabarits mobiles), 14 captures sans débordement. Surfaces Ressources rescellées et revue r4 réaffirmée sur l'écart déclaré. Publié par la construction git `968595fa` ; contrôle de production PASS, panneau vérifié ouvert sur memlia.fr à 375 px.

## Suites du 16/09 au soir : le bandeau, puis le sitemap

**Le bandeau.** Kevin : « pourquoi t'as mis Ressources à l'extérieur du menu ? Il faut le mettre dans le menu dépliant ! Et pas la peine de mettre "Menu", juste l'icône avec les 3 barres suffit. » Fait : le bandeau mobile ne porte plus que le logo et un bouton de 48 × 48 px sans texte, dont le nom accessible est porté par `aria-label` (mesuré : Lighthouse accessibilité 100). Toutes les destinations, Hub compris, vivent dans le panneau.

**Le sitemap — un défaut réel, trouvé en répondant à sa question.** Search Console annonçait quatre pages découvertes. L'API le confirme : Google avait lu `sitemap-0.xml` le 16/09 à **02:28**, avant la mise en ligne des cinq pages, et n'avait pas de raison de le relire — le sitemap datait toutes les pages du **09/09**, une constante écrite à la main que personne n'avait bougée. L'inspection d'URL le montre aussi : `/methode` et `/contact` étaient « Google ne reconnaît pas cette URL », tandis que `/` et l'article 3 étaient indexés.

Deux mécanismes ont été essayés avant le bon :

| Mécanisme | Ce qu'il fait | Pourquoi il ne tient pas |
|---|---|---|
| Constante `SITE.derniereMiseAJour` | une date dans les sources | ne bouge que si quelqu'un y pense ; personne n'y a pensé |
| Date du dernier commit (`git log`) | automatique | l'image de construction de Cloudflare clone en **profondeur 1** : le commit de tête y paraît tout avoir écrit. Le sitemap servi (14:33:48) divergeait du sitemap construit ici (14:23:39) — mesuré, et la chaîne de preuve compare ces octets |
| **Registre versionné** (retenu) | `src/data/pages-lastmod.json` : par page, l'empreinte de son HTML rendu et le jour où elle a changé | lu à la construction, donc identique partout ; mis à jour par `npm run lastmod:sync`, jamais par le build ; `npm run test:lastmod` entre dans la chaîne et refuse un registre périmé |

Mesures : deux constructions du même commit rendent le même octet de sitemap (`2d9e80da…`), et l'octet servi en production est **le même**. Les articles gardent leur date de frontmatter (15/09), les neuf autres pages portent le 16/09. `test_build.py` vérifie les deux sens : la date du sitemap vient du registre, et l'empreinte du registre est celle du HTML construit.

**Deux mesures de plus, après la première tentative.** La date au jour ne suffisait pas : le sitemap annonçait `2026-09-16T00:00:00Z`, plus **ancien** que la lecture de Google le matin même (02:28). Le registre porte donc l'horodatage à la seconde. Et re-soumettre l'index ne fait relire que l'index : Google l'a relu deux fois (15:08, 15:11) sans jamais redemander l'enfant, resté à sa lecture de 02:28. C'est la déclaration directe de `sitemap-0.xml` — celui qui porte les douze URL — qui l'a débloqué.

Résultat mesuré à 15:19:15, avec l'accord de Kevin pour agir sur sa propriété : **`sitemap-0.xml` lu, 12 URL soumises** (au lieu de 4). L'indexation des cinq pages suivra son cours ; elle prend quelques jours et ne dépend plus de nous.

Preuves de cette passe : 132 tests navigateur, 64 Python, 154 Node, oracle 12 routes, copy 27/27, Lighthouse 100 partout (99 sur deux gabarits mobiles), 14 captures, équivalence 22 routes contre le déploiement immuable `d442193b`, contrôle de production PASS.

## Balayage des mentions de processus et indexabilité (16/09, fin de journée)

Kevin a relevé que le glossaire portait encore, sous chacune des 23 définitions : « Nature · Rédaction · Revue métier : requise avant publication · Sources relues : 14 septembre 2026 ». Retiré, ainsi que le marqueur `data-business-reviewer="pending"` qui disait la même chose dans le HTML sans que rien ne s'en serve. **Les Sources restent** : ce sont des références, pas du processus, et la date de relecture demeure une donnée éditoriale dans `src/data/glossary.ts`.

Balayage complet des 17 pages construites puis des **14 routes servies en production**, sur le texte visible *et* sur la source : aucune occurrence de « Revue métier », « Sources relues », « Éditoriale Memlia », « Requise avant publication », « non attesté », « fact-check », « a-t-il été vérifié », `data-business-reviewer`, `statutEditorial`. Les trois occurrences restantes du mot-racine « attest » sont du contenu légitime, vérifié une à une : « Nous ne délivrons pas d'attestation… » (positionnement), « le certificat atteste la conformité à la norme » (explication sourcée), « Nature du retour » (en-tête de colonne d'un tableau CRM).

Pour que la consigne ne dépende plus de la mémoire de personne, `test_build.py` balaie désormais le contenu visible de chaque page à chaque construction et refuse ces neuf formules.

**Indexabilité, mesurée page par page en production :** les douze routes indexables portent `index, follow, max-image-preview:large`, une canonical exacte, une entrée au sitemap et des liens entrants internes (15 à 73 selon la page) ; les deux pages légales portent `noindex, follow` et restent hors sitemap, comme voulu. Rien ne bloque côté site.

Côté Google, l'inspection d'URL du 16/09 à 15:35 :

| État | Routes |
|---|---|
| Envoyée et indexée | `/`, `/a-propos` (exploré à 15:25, après la re-soumission), `/blog`, les 3 articles |
| Détectée, non encore indexée | `/methode`, `/ressources`, `/glossaire` |
| Pas encore connue | `/automatisation-cabinet-comptable`, `/garanties`, `/contact` |
| Exclue par `noindex` (voulu) | `/mentions-legales`, `/politique-de-confidentialite` |

Ce qui reste est le délai de Google, pas un défaut : il explore déjà les nouvelles pages. Aucune API publique ne force l'indexation d'une page ordinaire ; Kevin peut, s'il veut accélérer, demander l'indexation des trois dernières depuis l'inspection d'URL de Search Console (une dizaine de demandes par jour au maximum).

## Rollback

Production précédente : déploiement `88af1244` (commit `55a7c05`, build `2cf4931`). Le rejouer depuis le tableau de bord Cloudflare, ou `git checkout 2cf4931` dans un worktree propre, `npm ci && npm run build:site`, `npx wrangler pages deploy dist --project-name memlia --branch main`. La base D1 et le Worker de purge peuvent rester : sans formulaire, rien ne les appelle.
