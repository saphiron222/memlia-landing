# Recette — outils gratuits — vague 1

Date : 20 septembre 2026  
Candidat : worktree `t_c49dffe2`  
Périmètre : calculateur de marge commerciale, calculateur de date d’échéance de facture, modèle de rapprochement bancaire CSV ouvrable dans Excel.

## Verdict

**PASS technique local et preview.** Les trois outils sont indexables dans le candidat, présents dans le hub, reliés depuis trois contextes rendus, calculés entièrement dans le navigateur et couverts par un témoin réseau/storage qui rougit lorsqu’une requête est injectée.

Ce verdict ne publie rien en production et ne vaut pas attestation métier. La preview Cloudflare est volontairement protégée par `noindex, nofollow` dans la meta et l’en-tête HTTP.

## Sources officielles contrôlées

| Outil | Source servie | Contrôle du 20/09/2026 |
|---|---|---|
| Marge commerciale | [Insee — définition c1774](https://www.insee.fr/fr/metadonnees/definition/c1774) | HTTP 200. La définition porte bien la différence entre ventes HT de marchandises et coût d’achat HT des marchandises vendues. L’ancien identifiant `c1660`, qui menait à « Délit », a été écarté. |
| Date d’échéance | [Légifrance — article L441-10](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392) et [Entreprendre.Service-Public.fr — F23211](https://entreprendre.service-public.gouv.fr/vosdroits/F23211) | La fiche Service-Public répond HTTP 200 et lie l’article L441-10 sous cet identifiant. Elle expose les plafonds de 60 jours / 45 jours fin de mois et les deux conventions de calcul de « 45 jours fin de mois ». L’ancien identifiant `…4397` a été écarté. |
| Rapprochement bancaire | [ANC — Plan comptable général](https://www.anc.gouv.fr/plan-comptable-general-0) | HTTP 200. Le PDF officiel « version au 1er janvier 2026 » a été téléchargé ; l’article 121-1 décrit la comptabilité comme un système qui saisit, classe et enregistre les données de base pour refléter une image fidèle. |

## Cas fonctionnels rejoués

| Outil | Cas vert | Refus observé |
|---|---|---|
| Marge | achat 80 €, vente 100 € → marge 20 €, taux de marge 25 %, taux de marque 20 % ; achat 100 €, vente 80 € → marge −20 € | montant d’achat nul refusé |
| Échéance | facture du 20/01/2026 → 31/03/2026 pour « +45 jours puis fin de mois », 17/03/2026 pour « fin de mois puis +45 jours », 21/03/2026 à 60 jours ; réception du 01/02/2026 → 03/03/2026 à 30 jours | convention « 45 jours fin de mois » absente refusée |
| Rapprochement | soldes ajustés à 1 000 € → différence 0 €, export CSV UTF-8 BOM ; lignes détaillées, états et mention de validation présents | différence de 50 € refusée, téléchargement désactivé |

Le CSV est séparé par des points-virgules, porte un BOM UTF-8, contient les hypothèses, les soldes, les éléments de rapprochement, des lignes en circulation à détailler, la différence et la mention « À valider par le collaborateur — aucune écriture produite ». L’URL Blob temporaire est révoquée après le téléchargement.

## Preuve réseau et stockage

Commande verte :

```bash
QA_URL=http://127.0.0.1:8789 npx playwright test tests/browser/outils.spec.ts --reporter=line
```

Résultat : **17/17 tests réussis**. Après armement, chaque calcul complet des trois outils produit exactement **0 requête**. `localStorage`, `sessionStorage` et `indexedDB` restent tous à **0**.

Commande rouge :

```bash
NETWORK_GUARD_RED=1 QA_URL=http://127.0.0.1:8789 \
  npx playwright test tests/browser/outils.spec.ts \
  --grep 'le garde détecte' --reporter=line
```

Résultat attendu et observé : **1/1 test en échec, exit 1** après injection d’un `fetch('/robots.txt')`. Le test retire seulement la CSP de la réponse locale pour prouver que le garde réseau voit l’appel indépendamment de la CSP publique. Journal : `.qa/outils-vague-1/witness-red.log`.

## SEO, maillage et rendu

- un H1 unique, `title`, description, canonique, Open Graph et Twitter concordants par outil ;
- graphes JSON-LD `WebPage`, `WebApplication`, `BreadcrumbList` ;
- `ItemList` du hub limité aux trois outils disponibles ;
- trois liens entrants distincts par outil : hub, méthode et page de service contextuelle ;
- source officielle datée et limites visibles ;
- aucune occurrence publique du vocabulaire interdit contrôlé par `test_positioning.py` ;
- aucun débordement horizontal mesuré à 320, 375, 768, 1024, 1440 et 1920 px.

## Commandes de clôture rejouées

```bash
npm ci
npm run check
npm run lastmod:sync
npm run build
QA_URL=http://127.0.0.1:8789 npm run test
NETWORK_GUARD_RED=1 QA_URL=http://127.0.0.1:8789 npx playwright test tests/browser/outils.spec.ts --grep 'le garde détecte' --reporter=line
npm run preview:prepare
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy .qa/preview-dist --project-name memlia --branch preview-outils-o3
git diff --check
```

| Contrôle | Résultat mesuré |
|---|---|
| `npm run check` | 178 fichiers, 0 erreur, 0 avertissement, 12 hints hérités |
| `npm run lastmod:sync` | 17 pages au registre, 3 pages d’outils redatées |
| `npm run build` | exit 0 ; 30 pages construites ; 77 tests de preuve Python et 269 tests de scripts verts ; audit ressource QA `PASS` |
| Playwright complet | 140/140 verts, dont 17/17 tests outils |
| Témoin réseau rouge | 1/1 rouge attendu, exit 1 |
| `git diff --check` | exit 0 |

Inspection d’écran : captures desktop du hub et des trois outils après action dans `.qa/outils-vague-1/screens/`. Aucun chevauchement, texte tronqué, débordement ou élément masqué observé sur les captures finales ; l’outil de rapprochement reste contenu à 320 px. Les champs HTML natifs `type="date"` conservent la présentation imposée par le navigateur et son système d’exploitation, sans modifier la valeur ISO contrôlée par le moteur.

## Preview distante et empreintes

- alias : `https://preview-outils-o3.memlia.pages.dev` ;
- preview immuable vérifiée : `https://8a75a08e.memlia.pages.dev` ;
- les quatre routes (hub + trois outils) répondent HTTP 200 sur les deux origines avec une requête `Cache-Control: no-cache`, un canonical `https://memlia.fr/...`, une meta `noindex, nofollow` et `X-Robots-Tag: noindex, nofollow` ;
- aucun déploiement `main` n’a été exécuté.

| Route | SHA-256 candidat indexable `dist` | SHA-256 preview protégée |
|---|---|---|
| Hub | `9fbd86a1032ad1bdb8783911abf05d899184e52214314e83e689ea831d0ae3a2` | `4eb37a357eb84ba9c041a88c2424c2f50f8c8e1e33e25d539473ebac1af74abe` |
| Marge | `c343bf1a61068bd099c49aa853d9ec93635ebc347ea46f98e9153734891e301f` | `7173630ab3c9e55cca5fe6e006877e527a50ef91470332583b683842591ec0d6` |
| Échéance | `99385f710e730790e23b3db14adb72151b1378afa34d691c813dcbd7ced3775f` | `ac8ec7cb2c1ffc4d6ab696fefeee251b08504858156692bada15a1cb5048f385` |
| Rapprochement | `127fb3935b436fab3889fe231e448a32b8dddc4f6d6f87078868898e9698471b` | `2dcfcf0530f885085b9c8ab6bab454587fdcd7f2ed856b289402c0176b92903d` |

La différence d’empreinte entre les deux colonnes est bornée par `npm run preview:prepare` : il remplace la meta robots unique et ajoute l’en-tête de preview, sans modifier `dist`.

Suppression de la preview finale :

```bash
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deployment delete 8a75a08e-66aa-4dae-a083-b002048aece6 --project-name memlia --force
```

Le commit exact est consigné dans la passation Kanban ; les empreintes ci-dessus portent le candidat réellement construit et la copie de preview réellement déployée.
