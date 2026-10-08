# Companion Lighthouse : preuve robots conservée

## Cause et correctif

Le gatherer passé directement dans `artifacts[].gatherer` est copié par
`deepCloneConfigJson` de Lighthouse. La collecte s'exécutait sur cette copie,
mais `scripts/lighthouse.mjs` sérialisait `evidence` de l'instance originale :
`robotsEvidence: null` malgré un artefact RobotsTxt utilisé par l'audit.

`withRobotsCrawler` fournit désormais `gatherer: { instance: crawler }`.
Lighthouse conserve ainsi l'instance partagée avec le companion. Aucun second
GET n'est effectué pour remplir le rapport. Le collecteur HTTP, ses erreurs,
l'audit natif `seo/robots-txt`, les poids, catégories et paramètres sont inchangés.
Sans `--robots-crawler`, la définition native est conservée.

## Non-régression

`node --test tests/scripts/lighthouse-robots-crawler.test.mjs` : le nouveau test
reproduit d'abord le companion vide après `initializeConfig` réel (échec attendu),
puis les trois tests passent avec le correctif. Le serveur HTTP réel vérifie que
les réponses 200 et 503 sont les mêmes dans l'artefact et le companion, avec URL,
URL finale et date ; une réponse 503 reste un échec de l'audit natif. Deux appels
de collecte produisent exactement deux GET. Les catégories et paramètres résolus
restent identiques à ceux de la configuration native. Les tests existants couvrent
le robots invalide et l'échec réseau.

## Exécution publique du candidat — 5 octobre 2026

Commandes :

- `npm run lighthouse -- https://memlia.fr/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec --robots-crawler`
- Même commande avec `--desktop`.

Lighthouse 13.4.1, seuil 95 : mobile 98/100/100/100 ; desktop 100/100/100/100
(performance/accessibilité/bonnes pratiques/SEO). Les fractions brutes sont toutes
au moins 0,95. L'audit natif robots-txt vaut 1 dans les deux LHR.

Companions : `https://memlia.fr/robots.txt`, URL finale identique, HTTP 200 et corps
complet conservé. Collectes à 21:18:15.254Z (mobile) et 21:18:31.117Z (desktop).
LHR et companions bruts archivés ensemble, sans retouche, dans
`lighthouse-robots-evidence.zip` remis sur la carte t_762862cb, avec les logs rouge,
vert, check, build et commandes publiques. Le check et le build complets passent.

Ces mesures exécutent le script du candidat sur la page publique existante : elles
ne constituent pas un déploiement du correctif. La CI du candidat et la QA technique
unique sont consignées sur la carte et la PR. Aucun fichier de l'outil 10, contenu,
publication, CSP ou ancien rapport n'est modifié ou réécrit.
