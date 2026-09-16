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

## Ce qui reste à Kevin (assistant : `bash scripts/assistant-mise-en-service-contact.sh`)

Fait par Kevin le 16/09 après la release : la commande de build du projet Cloudflare (`npm run build:site`, sortie `dist`, Node 22) et la validation du paragraphe de la politique de confidentialité.

1. **Email Routing** : `memlia.fr` n'a **aucun MX** et un SPF `v=spf1 -all` ; `contact@memlia.fr`, affiché sur le site, ne peut pas recevoir. Activer Email Routing et router l'adresse vers son Gmail.
2. **Bot Telegram** dédié : token et chat id posés en secrets Pages par l'assistant ; la fonction prévient alors à chaque message. Lecture : `npm run contact:messages`.

## Rollback

Production précédente : déploiement `88af1244` (commit `55a7c05`, build `2cf4931`). Le rejouer depuis le tableau de bord Cloudflare, ou `git checkout 2cf4931` dans un worktree propre, `npm ci && npm run build:site`, `npx wrangler pages deploy dist --project-name memlia --branch main`. La base D1 et le Worker de purge peuvent rester : sans formulaire, rien ne les appelle.
