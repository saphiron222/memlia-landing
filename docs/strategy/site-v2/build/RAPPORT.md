# Site v2 — rapport de construction

Carte `t_c2262a1b` SITE-V2-BUILD. Généré le 2026-09-16 par
`docs/strategy/site-v2/build/rapport.py`, qui lit les JSON de contrôle et refuse de
s'écrire si l'un d'eux est rouge.

## Source de vérité

| Élément | Valeur |
|---|---|
| Branche | `site/v2` |
| Commit | `1fccbeaff4a5543e91c1488a7ef7a216228afd58` |
| Projet Cloudflare Pages | `memlia` |
| URL immutable de preview | https://bceec1bb.memlia.pages.dev |
| Alias de branche | https://preview-site-v2.memlia.pages.dev |
| Dossier déployé | `.qa/preview-dist` (copie noindex, jamais `dist`) |
| Routes contrôlées à distance | 20, toutes conformes |

La preview porte `noindex, nofollow` en balise et en en-tête HTTP. Aucune poussée vers
`main`, aucune mise en production.

## Routes servies

12 routes indexables sur 15 pages construites,
12 URL au sitemap.

| Route | Indexable | Liens entrants | Profondeur | Schémas |
|---|---|---|---|---|
| `/` | oui | 14 | 0 | FAQPage, Organization, Service, WebSite |
| `/404` | non | 0 | — | — |
| `/a-propos` | oui | 14 | 1 | AboutPage, BreadcrumbList, Organization, Person, WebSite |
| `/automatisation-cabinet-comptable` | oui | 14 | 1 | BreadcrumbList, Organization, Service, WebPage, WebSite |
| `/blog` | oui | 14 | 1 | Blog, BreadcrumbList, Organization, Person, WebSite |
| `/blog/comprendre-les-comptes-rendus-metier-dsn` | oui | 4 | 2 | BlogPosting, BreadcrumbList, Organization, Person, WebSite |
| `/blog/controler-les-bulletins-de-paie-avant-la-dsn` | oui | 6 | 2 | BlogPosting, BreadcrumbList, Organization, Person, WebSite |
| `/blog/suivre-la-production-sociale-dans-excel` | oui | 6 | 2 | BlogPosting, BreadcrumbList, Organization, Person, WebSite |
| `/contact` | oui | 14 | 1 | BreadcrumbList, ContactPage, Organization, WebSite |
| `/garanties` | oui | 14 | 1 | BreadcrumbList, Organization, WebPage, WebSite |
| `/glossaire` | oui | 14 | 1 | BreadcrumbList, CollectionPage, DefinedTermSet, Organization, WebSite |
| `/mentions-legales` | non | 14 | 1 | — |
| `/methode` | oui | 14 | 1 | BreadcrumbList, Organization, WebPage, WebSite |
| `/politique-de-confidentialite` | non | 14 | 1 | — |
| `/ressources` | oui | 14 | 1 | BreadcrumbList, CollectionPage, ItemList, Organization, WebSite |

## Oracle SEO et schéma

0 erreur — résultat **PASS**. Les mutants existent
parce qu'un oracle vert qu'aucune mutation ne fait rougir ne prouve rien :

- noindex retiré d'une page légale — attrapé par C2
- canonical cassée — attrapé par C1
- téléphone Memlia introduit — attrapé par C5
- auteur changé — attrapé par C5
- route future ajoutée au sitemap — attrapé par C2
- ancre historique supprimée — attrapé par C6

## Revue de copy

26/26 affirmations du registre portées par leur
page, aucune promesse chiffrée ou légale hors registre — résultat **PASS**.

- affirmation absente ajoutée au registre — attrapé
- promesse chiffrée non enregistrée injectée dans une page — attrapé
- source retirée d'une affirmation — attrapé

## Lighthouse — médiane de trois mesures

Seuil 95 sur les quatre axes, par gabarit et par profil. Les trois passes
de chaque ligne sont conservées dans `lighthouse-medianes.json`.

| Gabarit | Profil | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| accueil | mobile | 100 | 100 | 100 | 100 |
| accueil | desktop | 100 | 100 | 100 | 100 |
| page commerciale | mobile | 100 | 100 | 100 | 100 |
| page commerciale | desktop | 100 | 100 | 100 | 100 |
| liste blog | mobile | 100 | 100 | 100 | 100 |
| liste blog | desktop | 100 | 100 | 100 | 100 |
| article | mobile | 99 | 100 | 100 | 100 |
| article | desktop | 100 | 100 | 100 | 100 |
| hub ressources | mobile | 100 | 100 | 100 | 100 |
| hub ressources | desktop | 100 | 100 | 100 | 100 |
| glossaire | mobile | 100 | 100 | 100 | 100 |
| glossaire | desktop | 100 | 100 | 100 | 100 |

## Captures

14 captures pleine page, desktop 1440 et mobile 375, prises après
un parcours de défilement complet. Aucun débordement horizontal, aucune erreur console,
aucune réponse 4xx. Empreintes dans `captures/manifeste.json`.

## Réserves

- Le bandeau mobile occupe 261 px à 320 px de large : c'est la hauteur qu'exigent six
  entrées à 48 px, et la consigne l'accepte explicitement. La première vue utile de
  l'accueil tient à 12 px près à 320×740. Le hero n'appartient pas à cette carte ; un
  allègement de sa marge haute rendrait cette marge confortable.
- `src/components/Footer.astro` importe `CTA` sans l'utiliser, et `CTA.humain` n'est plus
  référencé par aucun composant depuis que l'appel à l'action mène à `/contact`. Code mort
  signalé, non supprimé : l'un et l'autre précèdent ce lot ou relèvent d'un arbitrage
  éditorial — le second rendez-vous Cal.com existe toujours et peut reprendre sa place.
- La revue métier du dossier Ressources reste épinglée au jour du 2026-09-16 :
  le contrat impose des copies de source du jour même. Le dossier redeviendra rouge
  demain sans nouvelle vérification des sources.
