# Recette — outils gratuits — vague 2

Date : 20 septembre 2026
Branche candidate : `wt/outils-vague-2`
Périmètre : calculateur d’amortissement comptable et décision sur la condition Factur-X.

## Verdict

**PASS technique local pour l’amortissement. Factur-X écarté.**

Le calculateur produit dans le navigateur un plan linéaire ou dégressif, affiche le prorata et la trace annuelle, refuse les entrées incohérentes et n’émet aucune requête après l’armement du témoin. Ce verdict ne vaut pas attestation métier et ne décide ni de la durée d’utilisation, ni de l’éligibilité fiscale du bien.

Factur-X n’est pas livré : la chaîne exigée par le catalogue — PDF/A-3, profil EN 16931 annoncé et résultat d’un validateur de référence, le tout dans le navigateur sans envoyer le document — n’est pas reproductible avec les briques vérifiées le 20 septembre 2026.

## Règle couverte

Entrées :

- valeur amortissable de 0,01 € à 1 milliard d’euros, avec deux décimales au plus ;
- date ISO de mise en service ;
- durée entière de 1 à 50 ans, choisie par le cabinet ;
- méthode linéaire ou dégressive.

Sorties :

- exercice, période et prorata ;
- base d’ouverture, dotation, cumul et valeur nette ;
- taux annuel ;
- coefficient et bascule vers le quotient résiduel pour le dégressif.

Refus :

- valeur vide, inférieure à 0,01 €, au-delà de 1 milliard d’euros ou non représentable au centime ;
- date invalide ;
- durée non entière ou hors borne ;
- méthode inconnue ;
- dégressif sans confirmation explicite de l’éligibilité du bien.

Le dernier centime est réconcilié sur la dernière ligne afin que la somme des dotations égale exactement la valeur amortissable.

## Sources et limites

| Sujet | Source contrôlée le 20/09/2026 | Ce que l’outil en retient |
|---|---|---|
| Mode comptable | [ANC — Plan comptable général, version au 1er janvier 2026](https://www.anc.gouv.fr/plan-comptable-general-0), article 214-13 | Le mode traduit le rythme de consommation des avantages économiques ; à défaut de mode mieux adapté, le linéaire est appliqué. |
| Coefficients dégressifs | [CGI, article 39 A](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037987291) | Coefficients 1,25 pour 3 ou 4 ans, 1,75 pour 5 ou 6 ans, 2,25 au-delà ; prorata mensuel et bascule vers le linéaire résiduel. La référence BOFiP datée de 2017 a été retirée après contrôle HTTP 404 le 20/09/2026. |
| Durée | Aucune durée d’usage n’est prescrite par l’outil. | La durée est une entrée. Le calculateur ne recommande pas une durée et ne classe pas le bien. |

Le calcul ne traite ni valeur résiduelle, ni cession, ni exercice décalé, ni composant séparé, ni régime fiscal particulier.

## Cas fonctionnels rejoués

| Cas | Résultat mesuré |
|---|---|
| Linéaire, 10 000 €, mise en service le 01/04/2026, 5 ans | 6 lignes ; première dotation 1 506,85 € sur 275/365 ; total 10 000,00 €. |
| Dégressif, mêmes données, éligibilité confirmée | coefficient 1,75 ; première dotation 2 625,00 € ; bascule au quotient résiduel ; total 10 000,00 €. |
| Durée 0 | refus « compris entre 1 et 50 ans » ; aucun plan rendu. |
| Dégressif sans confirmation | refus explicite sur l’éligibilité du bien ; aucun plan rendu. |

Tests déterministes : `node --test tests/scripts/amortissement.test.mjs` → **3/3 PASS**.

## Preuve réseau et stockage

Commande verte :

```bash
QA_URL=http://localhost:4328 npm test -- tests/browser/outils.spec.ts
```

Résultat : **20/20 PASS**. Pour chaque outil publié, le test arme les observateurs avant l’action puis exige zéro requête, zéro écriture dans `localStorage`, `sessionStorage` et `indexedDB`.

Témoin rouge :

```bash
NETWORK_GUARD_RED=1 QA_URL=http://localhost:4328 \
  npm test -- tests/browser/outils.spec.ts --grep "le garde détecte" --reporter=line
```

Résultat attendu et observé : **exit 1**. L’injection `fetch('/robots.txt')` est relevée comme `GET http://localhost:4328/robots.txt` et fait échouer l’assertion qui exige une liste vide.

Rejeu sans injection : même test, sans `NETWORK_GUARD_RED` → **1/1 PASS**.

## Décision Factur-X

**Écarté, sans version simplifiée.**

La condition du catalogue demande trois preuves simultanées et locales :

1. un PDF/A-3 effectivement produit ;
2. le profil Factur-X EN 16931 annoncé et embarqué ;
3. un rapport d’un validateur de référence.

Constat au 20/09/2026 :

- [`pdf-lib`](https://github.com/Hopding/pdf-lib) sait créer et modifier des PDF en JavaScript, mais ne fournit pas une chaîne documentée de production et de validation PDF/A-3 ;
- [`veraPDF`](https://docs.verapdf.org/cli/) fournit le validateur PDF/A de référence sous forme d’application/CLI Java ;
- [`Mustangproject`](https://github.com/ZUGFeRD/mustangproject) fournit validation et conversion ZUGFeRD/Factur-X sous forme de bibliothèque/CLI Java ;
- aucune de ces deux chaînes de validation de référence n’est livrée comme validateur navigateur/WebAssembly utilisable ici sans envoyer le document.

La route `/convertisseur-factur-x` reste donc absente. Réouverture seulement avec un générateur PDF/A-3 navigateur, les validateurs de référence exécutables localement dans le navigateur et des jeux de test versionnés qui prouvent le profil annoncé.

## Rendu, accessibilité et SEO

- H1 unique, canonical, Open Graph et JSON-LD `WebPage`, `WebApplication`, `BreadcrumbList` ;
- quatre outils publiés dans l’`ItemList` du hub ;
- trois liens entrants contextuels vers le calculateur : hub, méthode, page service ;
- labels associés, erreurs reliées par `aria-describedby`, `aria-invalid`, résultat annoncé par `aria-live` ;
- navigation clavier native ;
- préférence `prefers-reduced-motion` contrôlée ;
- aucun débordement horizontal à 320, 375, 768, 1024, 1440 et 1920 px ;
- preuve `28-outil-amortissement.webp` inspectée : PASS, texte entier et distinction explicite entre le cas courant calculé et une autre entrée refusée.

## Chaîne de clôture locale

| Contrôle | Résultat mesuré |
|---|---|
| `npm run check` | 0 erreur ; 11 hints hérités. |
| `node --test tests/scripts/amortissement.test.mjs` | 3/3 PASS. |
| `node scripts/render-proofs-v2.mjs --check` | 38 preuves conformes au manifeste. |
| `npm run build` | exit 0 ; 31 pages ; 295 tests de scripts PASS ; audit ressource QA PASS. |
| Playwright outils | 20/20 PASS. |
| Témoin réseau rouge puis vert | exit 1 attendu, puis 1/1 PASS sans injection. |
