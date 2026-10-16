# Robots · Agents IA · Intégrations — recette technique

Décision de Kevin du 15 octobre 2026. Le design validé est conservé. Les entrées commerciales sont **Robots**, **Agents IA** et **Intégrations** ; les pôles du blog restent une taxonomie éditoriale.

## Migration réalisée

- Douze anciens services et douze guides par environnement retirés du rendu public, des contrats de requêtes actifs, du sitemap, de llms.txt et des exports Markdown.
- Vingt-quatre redirections permanentes contextuelles, avec variantes barre finale, `.html` et anciennes versions Markdown : 96 règles. Aucun joker sous `/automatisation/*`, les 21 robots sont conservés. Les Pages Functions appliquent la même décision pour les routes qu’elles interceptent.
- Salomé dispose de sa propre fiche Paie et social : 10 tâches, 3 livrables, 4 cas fictifs, 6 FAQ, 3 points de départ contact. Le site compte 12 agents, 10 fiches et 2 destinations partagées (CAC et compatibilités).
- Menus/pied, fiches robots/agents, outils gratuits, pages institutionnelles, accueil et ponts commerciaux du blog pointent directement vers les destinations actives. Les corps d’articles scellés sont intacts. Honoré reprend le lien contextuel vers le générateur de relance, en complément de Méthode.
- Le hub des compatibilités conserve ses logiciels, logos et recherche ; aucun second annuaire de guides. Le hub robots conserve ses six sections sans le renvoi aux anciens guides.
- Les anciennes recettes restent des archives contrôlées. Les 12 transitions de dépublication sont autorisées, datées et scellées par la forge ; leur audit est figé à la date de retrait. Une nouvelle publication garde ses contrôles de fraîcheur.

Matrice et autorité : `config/migration-catalogues.json`. Recommandations et correspondances détaillées : `audit-migration.md`. Sauvegarde avant retrait (204 fichiers, manifeste SHA) : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/migration-catalogues/2026-10-15/`.

## Référencement et découverte

- 95 HTML au lieu de 118 ; **87 pages indexables**, et 87 URL de sitemap avec leurs exports Markdown. Les dates sont régénérées depuis le contenu rendu.
- Titles, descriptions, H1, canonical, Open Graph, images sociales et schémas contrôlés sur le rendu. Les services des agents ne pointent plus vers d’anciennes entités `#service` ; chaque règle reste sur sa fiche.
- llms.txt adopte les trois catalogues et le nouvel inventaire ; llms-full.txt et les liens alternatifs Markdown dérivent uniquement des pages du sitemap.
- Propriété des requêtes : 348 URL, 403 déclarations croisées, aucun conflit non motivé. Les requêtes archivées restent dans les preuves mais ne concurrencent plus les propriétaires actifs. Le filtre vérifie les URL avant de reconnaître une archive.
- Ancienne déclaration `sitemap-0.xml` : renvoi permanent vers l’index actuel, sans nouvelle soumission de preview.
- Garde d’export ajoutée à la chaîne de build : absence des anciennes surfaces HTML/Markdown, cibles/ancres/canonical/indexabilité, liens/JSON-LD/llms et redirections. Onze mutants de l’artefact et trente invariants de données/archives protègent ce retrait.

La migration suit les recommandations officielles sur les [changements d’URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), les [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) et les [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), relues le 15/10/2026. Les anciens guides visaient « tâche + logiciel » ; le catalogue commun couvre l’environnement et relie aux agents. Cette simplification demandée ne constitue pas une promesse de conserver chaque classement long-tail.

## Mesures et limites

Audit Search Console en lecture seule : trois anciennes URL inspectées sont indexées ; 21 anciennes routes cumulent 5 clics et 303 impressions sur la période observée. Les redirections sont donc conservées, sans suppression sèche. CrUX mobile ne fournit pas de données terrain pour le domaine ; aucun résultat terrain n’est inventé. Voir `audit-global.md` et les preuves JSON.

Au moment où cette version sera effectivement publiée en production, retirer l’ancienne soumission GSC `sitemap-0.xml` et resoumettre l’index officiel, puis contrôler le recrawl. Ces mutations externes ne sont pas exécutées depuis une prévisualisation.

## Vérifications locales du candidat

- Régénération publique et compilation ciblée : PASS, 95 pages, 83 images sociales.
- Astro : 0 erreur, 0 avertissement (47 indications informatives).
- **308 tests Node ciblés réussis**, sans saut de test ; 22 contrôles Python de positionnement et export réussis.
- Contrat de page VERT, forge services et guides, schémas, source unique, propriété des requêtes, images, contact, navigation et témoins négatifs.
- Audit HTML global : 95 pages, 87 indexables, 6 535 liens internes et 814 images, zéro erreur/avertissement mesuré. Voir `audit-apres.json` pour le compte faisant foi.
- Lighthouse mobile local indexable : Salomé 100/100/100/100 ; Intégrations 99/100/100/100 (performance/accessibilité/bonnes pratiques/SEO). Rapports complets dans `.lighthouse/`, résumé dans `lighthouse.json`. Aucune équivalence à des mesures terrain.
- Revue indépendante PASS : `revue-independante.md` ; 36 recettes/corps/revues et 12 reçus de publication sauvegardés vérifiés sans modification.
- Inspection visuelle réelle de Salomé dans le gabarit partagé ; la recette distante suit ci-dessous.

La CI globale GitHub n’est pas simulée sur le Mac. La livraison reste une branche et une prévisualisation, sans fusion ni production.

## Prévisualisation et recette distante

Candidat produit `a089fff4b96d09af948e71fd531b773e921fb747`, branche `site/agents-robots-integrations` : **[ouvrir la prévisualisation](https://45a5abeb.memlia.pages.dev)**. Les ajouts ultérieurs portent uniquement sur les preuves de recette et les tests, sans changement de ce rendu.

- **192 vérifications HTTP réussies** : GET et HEAD pour les 96 variantes des 24 anciennes routes, redirection 301 directe vers la destination attendue. Trois routes inconnues restent de vraies 404. Preuve : `redirects-http.json`.
- **87 pages actives vérifiées sur Cloudflare** : réponse 200, canonical de production et H1 unique. Les cinq fichiers de découverte/Markdown testés répondent avec le type de contenu attendu. Preuve : `preview-http.json`.
- La prévisualisation porte volontairement `noindex, nofollow` et bloque l’exploration dans son robots.txt ; le candidat destiné à la production garde ses 87 pages indexables. Aucun changement d’indexation de production n’a été déclenché.
- Inspection visuelle réelle de Salomé sur la prévisualisation : [capture du rendu](visuel/salome-preview.png). Le gabarit commun, les figurines et la direction graphique validée sont conservés.
- **136/136 scénarios navigateur réussis**, sans échec ni saut, sur cette livraison Cloudflare : agents, robots, compatibilités, recherche, navigation, clavier, mobile/grand écran, mouvement réduit, repli sans JavaScript, contact, présélections et CSP sans réseau. Preuves : `navigateurs-sortie.txt` et `navigateurs.json`.
- Trois anciennes attentes de tests ont été adaptées à la migration, puis relues indépendamment : recherche dans toute la carte logiciel, position courante après redirection d’un guide et redirection des services retirés. Aucune modification du rendu n’a été nécessaire ; voir l’addendum de `revue-independante.md`.
