# H4 — llms.txt raccordé aux inventaires

Le gabarit `public/llms.txt` conserve le fond B2 et la description CAC E4, désormais dans sa section dédiée. Il ne porte plus de quantité du glossaire à maintenir manuellement. La baseline W41 et les décisions de maillage livrées par PR124 restent inchangées ; aucune réécriture de titre sur ce lot.

## Une seule chaîne

`npm run build` rend les inventaires canoniques D3 en pages et sitemaps, puis appelle le générateur Markdown existant. Celui-ci raccorde `llms.txt` à cette sortie, sans nouveau fichier de compteurs :

- définitions : `DefinedTermSet.hasDefinedTerm` du glossaire rendu depuis `GLOSSARY_ENTRIES` ;
- guides, outils et services : routes indexables des sitemaps, sans leur hub ;
- articles : pages indexables portant le schéma `BlogPosting`, donc sans les rubriques ;
- hubs et services : H1 et description des pages rendues, pas une seconde copie de leur texte ;
- liens du gabarit : présence exigée dans les sitemaps ; les routes candidates et le témoin noindex ne rejoignent pas la sortie.

Les familles et pôles restent décrits sans quantité figée, comme dans B2. L’index des versions Markdown conserve toutes les pages indexables. La sortie est idempotente ; toute absence de hub, de métadonnées ou de définitions bloque la génération. Le gabarit est une source, seul `dist/llms.txt` est livré.

## Vérifications

Tests ciblés : `node --test tests/scripts/llms-inventory.test.mjs tests/scripts/agent-markdown.test.mjs tests/scripts/data-driven-counts.test.mjs tests/scripts/accueil-cac-publication.test.mjs`.

Le test d’extension ajoute un terme et un service fictifs : quantités et lien suivent, sans plafond. Témoins négatifs : route candidate absente et glossaire sans inventaire. Le test du générateur exerce aussi le raccordement complet, la conservation des Markdown et l’idempotence.

La recette locale `npm run regen:generated` réaffirme les données dérivées ; après nettoyage du texte public, `node scripts/generate-agent-markdown.mjs` puis `node scripts/verify-agent-markdown.mjs` exercent la livraison. Le build complet et les suites complètes font foi dans la CI Repository gates, pas par un rejeu local.

Constat local du 10 octobre : 53 définitions, 9 guides, 16 articles, 18 outils et 10 services ; 67 versions Markdown. Ce relevé est une observation, jamais une constante de production ni un plafond de test.

## Livraison et mesure

Une seule QA indépendante du lot avant fusion, puis Repository gates vert et lecture entière de `https://memlia.fr/llms.txt` avec `Cache-Control: no-cache`, sans query string. Vérifier les quantités contre le glossaire et les sitemaps publics, les liens et la description CAC intacte ; comparer les octets au livrable du déploiement quand disponible.

La baseline W41 (`semaine-2026-W41-demande.json`) est conservée. Le relevé avant livraison de llms est joint à la carte H4 ; il annonce encore 43 définitions alors que le glossaire rendu en compte 53. Noter la date réelle de fusion et transmettre à H4 une comparaison à J+28 calculée depuis cette date, pas depuis le crawl du 6 octobre. Ne pas attribuer un effet SEO ou des citations IA à la simple présence du document.

Retour arrière : PR retirant le raccordement dans `scripts/generate-agent-markdown.mjs` et son helper ; conserver les contributions B2/E4 et les changements ultérieurs, régénérer les données dérivées puis passer la CI. Aucun retour arrière exécuté.
