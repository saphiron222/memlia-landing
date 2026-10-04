# Contact — choix saisi avant le chargement JavaScript

## Constat et cause

Le contrat outil → contact pouvait cocher `#consentement_origine` dès que le HTML devenait interactif, avant le téléchargement et l'exécution du script Astro. `change` n'était alors pas écouté. Le script installait ensuite l'écouteur sans relire l'état de la case : `#origine` restait vide jusqu'à un nouveau changement ou à une soumission volontaire.

Reproduction déterministe sur https://memlia.fr : le test `contact : accord saisi avant le chargement JavaScript conservé et appliqué` retient les scripts `/_astro/*.js`, saisit un nom fictif et coche l'accord, puis libère les téléchargements. Après `load`, la case reste cochée mais l'origine attendue `/outils-comptables-gratuits/temoin-calcul-local` est vide : FAIL. Le référent est explicitement interne pour isoler le défaut d'initialisation du défaut éventuel de référent. Aucun POST réel.

Ce test qualifie le mécanisme de course observé ; il ne prétend pas reconstituer les durées réseau des deux anciens échecs.

## Correction minimale

`src/pages/contact.astro` : appeler `actualiserOrigine()` immédiatement après l'installation de l'écouteur `change`. La fonction existante relit le choix déjà saisi, vérifie le référent et n'attribue rien sans accord distinct. Aucun champ saisi n'est remis à zéro, aucune case n'est cochée par le script. Le retrait et la vérification avant envoi restent inchangés.

Le registre `src/data/pages-lastmod.json` est régénéré par `npm run lastmod:sync` pour la seule route `/contact`. Ni texte public, ni finalités, ni CSP, ni API ne changent. Le beacon bloqué reste la limite acceptée.

## Vérifications locales

- Rouge contrôlé sur domaine : 1 FAIL, origine vide après libération des scripts.
- `npx playwright test tests/browser/outils.spec.ts tests/browser/contact-form.spec.ts tests/browser/contact-origin-consent.spec.ts` : 35 PASS, dont le test de course, le parcours outil → contact, le refus, l'accord et le retrait, le sans-JavaScript et les pannes du widget.
- Build de préparation navigateur : 126 tests Python PASS après régénération lastmod (premier essai correctement refusé pour rendu contact modifié).
- Astro check : 0 erreur, 0 avertissement, 8 hints existants.
- Tests Node des fonctions contact / Turnstile / purge : 32 PASS.
- `git diff --check` : PASS.

Les envois des contrats habituels sont interceptés par Playwright, avec noms/adresses fictifs et widget simulé. Ce n'est ni une validation Turnstile réelle, ni un envoi de courriel, ni une écriture D1.

## Livraison restant à qualifier par la QA unique

La QA vérifie indépendamment le candidat et la CI. Après PASS et CI verte, fusion/publier et rejouer les trois fichiers navigateur sur URL de déploiement et domaine, ainsi que le test retardé (déjà inclus dans outils.spec.ts). Transmettre le constat à l'audit `t_2caf75a7`. Ne pas lever la réserve production avant ces preuves.
