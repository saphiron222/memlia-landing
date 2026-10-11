# Contrat réseau de circularisation

## Cause démontrée

Le 11/10/2026, le dist H4 conservé dans la livraison t_3a63473a a été servi par Astro preview, sans reconstruction locale. Le scénario d'import complet, avec CPU Chromium ralenti ×6 et réseau à 20 ms / 1 Mo par seconde, a reproduit l'échec ancien : 1 échec sur 10, GET `/favicon.svg`, type Playwright `other`, corps absent, après `document.fonts.ready`. Les trois GET du Worker étaient locaux. Trois passages à 200 ms / 100 ko par seconde avaient passé avant cette reproduction.

`fonts.ready` ne constitue pas une barrière pour l'icône demandée par le navigateur. La trace historique CI 37831298424 ne contenait pas l'URL : l'identité de son GET ne peut donc pas être affirmée rétrospectivement. Le même mécanisme de faux positif est désormais reproduit et couvert.

## Mesure et frontière

L'écoute commence sur le BrowserContext avant navigation, pour inclure les requêtes Worker. Chaque requête porte sa phase (`load` ou `operations`), URL, type, méthode et présence d'un corps. Aucun contenu de fichier ni corps n'est journalisé. Une pièce JSON Playwright est jointe même en cas d'échec du scénario.

Dans les deux phases : uniquement GET sans corps, origine comparée par `URL.origin`, aucun paramètre, fragment ou identifiant d'authentification dans l'URL. Pendant les opérations : uniquement scripts locaux sous `/_astro/`, plus l'URL exacte `/favicon.svg` déclarée par le document, exclusivement pour le type natif `other`. Un fetch/XHR vers cette même URL, un autre chemin d'icône ou une URL avec paramètres échoue. Les polices/images tardives ne sont pas ajoutées à une allowlist. La création effective de Workers locaux est également exigée.

Le test mécanistique sert un document minimal sur l'origine réelle du preview puis insère son icône après la frontière de mesure : il observe le GET natif `other`, puis un fetch de la même URL et vérifie son refus. Cette fixture est distincte du scénario produit réel ; elle ne prétend pas reproduire le contenu produit.

## Vérifications

- Ancien prédicat réseau : échec navigateur réel décrit ci-dessus ; prédicat initial également rouge sur les tests unitaires du contrat.
- Nouveau contrat : 3 tests unitaires verts ; les tests scripts circularisation existants passent également.
- 20 tests navigateur verts (4 scénarios ×5), dont 5 imports complets sous CPU ×6 ; fixture native différée verte 5 fois.
- Suite navigateur circularisation ciblée exécutée sans ralentissement, résultat dans les preuves de livraison.
- Pas de build complet sur le Mac : la preuve de construction reste la CI GitHub Repository gates.

Rejeu sur un preview déjà construit :

    node --test tests/scripts/circularisation-network.test.mjs
    QA_URL=http://127.0.0.1:4329 QA_NETWORK_SLOW=1 npx playwright test tests/browser/circularisation-import.spec.mjs tests/browser/circularisation-network.spec.mjs --repeat-each=5

## Observation distincte en production

Trois imports réels sur `https://memlia.fr` sous ralentissement ont atteint la fin fonctionnelle mais le nouveau contrôle échoue au chargement : GET externe `https://static.cloudflareinsights.com/beacon.min.js`, type script, sans corps. Aucune donnée envoyée n'est démontrée par cette observation. Le contrôle ne l'autorise pas et aucune correction produit/Cloudflare n'est incluse ici. Ce constat n'invalide pas la QA H4 ; il doit être qualifié séparément de cette stabilisation CI locale.
