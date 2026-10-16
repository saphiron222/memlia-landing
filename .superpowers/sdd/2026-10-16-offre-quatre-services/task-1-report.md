# Task 1 — Accueils quatre services : code et validation locale

Statut : **DONE** pour le périmètre délégué. Revue indépendante, CI exacte, prévisualisation distante et publication restent au contrôleur.

- Base : `a5ae0a36`, branche `site/memoire-modeles-prives`.
- Commit de code et documents actifs : `8c39776f` — `feat(site): orienter les accueils vers les quatre services Memlia`.
- Worktree : `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/memoire-modeles-prives`.
- Aucun push, aucune fusion, aucun déploiement distant, aucun sous-agent. `node_modules` non suivi laissé intact.

## Changements

`ChoisirTache.astro` propose désormais quatre destinations explicites, dans cet ordre : robots, agents IA, Memlia OS, modèle IA privé. Les compteurs viennent de `ROBOTS.length` et `AGENTS.length` (21 et 12). Les deux autres routes et noms viennent de `SOLUTIONS`. Le sur mesure devient une continuité sous les cartes, avec un lien Contact. Les intégrations disposent d’un renvoi transversal distinct.

La grille affiche deux colonnes et deux rangées à partir de 768 px, une colonne en dessous. Elle réutilise les couleurs, polices, arrondis, liens et figurines existants. `SceneOS` et `SceneModele` acceptent une variante compacte décorative pour ces cartes ; leurs scènes complètes et interactions existantes sont conservées. Aucun nouvel emblème, boîtier, personnage, fichier image ou style graphique extérieur. Les quatre cartes sont des liens natifs, sans commande interactive imbriquée. Le composant étant partagé par `PageEditoriale`, les quatre pages de conversion présentent aussi ces quatre destinations ; leurs autres compositions restent en place.

Les accroches SEO et H1 des deux accueils restent identiques. Les introductions ouvrent le champ au savoir du cabinet et aux formats métier, sans faire du hero un catalogue des quatre services. Le bloc de choix les nomme explicitement. L’accueil CAC précise les accès par mission et garde le choix des travaux et les conclusions à l’équipe. Les cinq usages et onze FAQ de chacun sont conservés ; les réponses réglementaires CAC et leurs références ne sont pas réécrites.

Contact, À propos, Garanties et Méthode accueillent les quatre besoins. Les garanties distinguent les essais fictifs des robots/agents des données autorisées de mémoire ou d’entraînement. Le modèle privé garde un budget d’essai, des données d’évaluation séparées, l’acceptation de version et les droits selon la licence de base. Les préfixes SEO contractuels des descriptions de ces pages sont conservés.

La charte passe en v11 ; `CLAUDE.md`, le README, la tagline partagée et `public/llms.txt` reflètent les quatre services. La copie active CAC est synchronisée chaîne par chaîne. Les anciennes copies de la recette du 15 octobre portent un avis d’archive et renvoient au cadrage du 16 octobre. Les dérivés de Ressources et le registre lastmod sont régénérés par la chaîne du dépôt. Le changement de tagline partagée explique la mise à jour des 66 empreintes non éditoriales.

Les documents de prix validés, le code du formulaire, les consentements, le catalogue, les contenus des articles scellés et les données de rendez-vous n’ont pas changé.

## Skills et décisions éditoriales

Skills lus et appliqués uniquement depuis Claude :

- `/Users/kevinkitanga/.claude/plugins/marketplaces/marketingskills/skills/copywriting/SKILL.md` (2.2.0), puis sa checklist AI tells.
- `/Users/kevinkitanga/.claude/plugins/marketplaces/marketingskills/skills/copy-editing/SKILL.md` (2.1.1).
- `/Users/kevinkitanga/.claude/skills/frontend-design-direction/SKILL.md`.

Les sept passes ont vérifié clarté, voix, utilité, preuves, précision, lien au travail du lecteur et friction de conversion. Aucun chiffre de résultat, client, tarif, délai, témoignage, hébergement ou conformité ajouté. Les seuls compteurs des cartes sont issus des catalogues. La mémoire documentaire et l’entraînement sont explicitement distingués. Le catalogue et l’adaptation précèdent toujours la construction de robots/agents sur mesure.

## RED puis GREEN

Test ajouté : `tests/browser/accueil-quatre-services.spec.ts`.

Avant implémentation :

```text
QA_URL=http://127.0.0.1:4396 npx playwright test tests/browser/accueil-quatre-services.spec.ts --grep '1440' --max-failures=1
ÉCHEC attendu sur / à 1440 px :
Locator: .editorial-choix .catalogue-carte
Expected: 4
Received: 3
1 failed, 1 did not run (arrêt au premier échec).
```

Après implémentation : **4/4 PASS**, puis **4/4 PASS** dans la recette statique finale. Pour chaque accueil, à 375 et 1440 px, le test vérifie : quatre routes exactes dans l’ordre attendu, mémoire/entraînement et sur mesure, focus visible, Enter vers Memlia OS, réponse HTTP 200 des quatre destinations, géométrie 1 ou 2 colonnes, absence de débordement, un seul H1 et onze FAQ.

## Vérifications et résultats

| Commande / périmètre | Résultat |
|---|---|
| `npm run regen:generated` | PASS ; dernière exécution dans `preuves/regeneration-finale.log`. Ressources QA PASS, 66 entrées lastmod à jour avant export Markdown. La commande autorisée appelle elle-même Astro en interne ; aucune compilation complète ou suite locale lancée séparément. |
| `node scripts/generate-agent-markdown.mjs` | 89 pages + llms-full générés depuis le HTML statique. |
| `node scripts/verify-agent-markdown.mjs` | PASS, 89 pages. |
| `node scripts/verify-page-contract.mjs` | VERT : 97 pages, 5 clauses, 37 exemptions existantes. Gardes délégués positionnement, design des services, service-forge, blog-contract et blog-title-intent PASS. |
| `node --test tests/scripts/solutions.test.mjs tests/scripts/apropos-copy.test.mjs tests/scripts/accueil-contenu.test.mjs tests/scripts/accueil-cac-copy.test.mjs tests/scripts/accueil-cac-publication.test.mjs tests/scripts/site-copy-b.test.mjs tests/scripts/agent-markdown.test.mjs` | **36/36 PASS**. |
| `PYTHONPATH=tests/proof python3 -m unittest test_positioning test_integrated_media -v` | **29/29 PASS** ; 489 surfaces textuelles contrôlées, médias validés préservés. |
| `PYTHONPATH=tests/proof python3 -m unittest test_build.BuildProof.test_five_generic_examples_no_product_statuses test_build.BuildProof.test_structured_data_no_unreleased_features test_build.BuildProof.test_llms_anchors -v` | **3/3 PASS** : cinq usages EC, onze FAQ JSON-LD, liens llms. Le test CAC vérifie aussi ses cinq usages et onze FAQ. |
| `QA_URL=http://127.0.0.1:4397 npx playwright test tests/browser/accueil-quatre-services.spec.ts tests/browser/accueil-copy.spec.ts tests/browser/accueil-cac.spec.ts tests/browser/solutions.spec.ts tests/browser/garanties-copy.spec.ts tests/browser/contact-copy.spec.ts tests/browser/editorial-figurines.spec.ts --max-failures=3` | **40/40 PASS**, en une minute. Aucun formulaire envoyé. |
| `node /Users/kevinkitanga/.claude/skills/frontend-design-direction/scripts/check-evidence.js .superpowers/sdd/2026-10-16-offre-quatre-services/preuves/evidence.json` | PASS, preuves complètes ; captures inspectées réellement. |
| `git diff --check` et `git diff --cached --check` | PASS avant commit. |

Échecs intermédiaires expliqués et résolus :

1. Les assertions de copie de Contact/Garanties et le compte de trois cartes de la recette A ont été alignés sur les formulations et les quatre destinations demandées. Les gardes métier et les contrôles de parcours restent intacts.
2. Trois tests de recette A voyaient un 404 sur les images sociales générées via le serveur de développement 4396. Leur même contrôle passe sur la sortie statique 4397, qui contient ces fichiers ; aucun garde n’a été retiré.
3. Le contrat de page a signalé trois préfixes de description SEO modifiés. Ils ont été restaurés et complétés avec les quatre services ; contrat final VERT.
4. Un `lastmod --check` lancé après l’export Markdown a signalé toutes les pages : cet export ajoute des liens `alternate` au HTML. Le registre conservé est celui vérifié par `regen:generated` **avant** cet export, conformément à l’ordre CI. Il n’a pas été recalculé sur le HTML enrichi après export. La vérification finale Markdown et le contrat de page passent.

## Inspection visuelle et accessibilité

Captures finales inspectées :

- [EC mobile, 375 × 900](preuves/ec-375-services.png).
- [EC bureau, 1440 × 900](preuves/ec-1440-services.png).
- [CAC mobile, 375 × 900](preuves/cac-375-services.png).
- [CAC bureau, 1440 × 900](preuves/cac-1440-services.png).

Titres longs et liens passent à la ligne sans coupe ; les paires de cartes gardent leurs alignements sur bureau. Les figurines gardent leur cadre arrondi. Les aperçus OS/modèle restent secondaires et décoratifs ; toute l’information utile se lit dans les textes accessibles de la carte. Les captures pleines pages restent aussi disponibles localement dans `preuves/*-page.png`.

Les tests contrôlent les pages CAC et Contact de 320 à 1920 px, les six pages éditoriales à 375/768/1440, les solutions à 390/1024/1440, le repli sans JavaScript, les focus et les animations à mouvement réduit. Les contrastes des textes de cartes, avec composition alpha sur leur fond blanc, vont de **5,63:1 à 16,30:1** ; liens et repères verts à **6,24:1**. Détails : [contraste.json](preuves/contraste.json) et [evidence.json](preuves/evidence.json).

## Auto-revue du delta

- **Offre** : quatre catégories distinctes, aucune carte de cinquième offre, intégrations transversales, catalogue avant adaptation et sur mesure.
- **Architecture** : aucun paquet ajouté, données canoniques réutilisées, variante compacte opt-in, aucune modification de comportement du formulaire ni des scènes complètes. Les tests des scènes sont verts.
- **Design** : jetons et composants Memlia, figurines existantes, grille symétrique ; aucun nouvel asset graphique.
- **Métier** : distinction mémoire/entraînement, sources et droits explicites, jugements et conclusions au CAC, pas de nouvelle affirmation réglementaire.
- **SEO** : titres et descriptions EC/CAC, canonical et schémas conservés ; préfixes contractuels des pages de conversion préservés. FAQ/usages, médias, export Markdown et liens vérifiés.
- **Périmètre Git** : seuls les fichiers de cette tâche et les dérivés du pipeline ont été ajoutés explicitement. Aucun article scellé ni document de prix modifié. Aucun `node_modules` ajouté.

## Suite au contrôleur et limites

La revue indépendante et la CI du SHA exact restent nécessaires avant fusion, comme prévu dans la délégation. Pas de nouveau score Lighthouse revendiqué ; la compilation et les suites complètes appartiennent à la CI. Les captures documentent le rendu local ; aucune URL de prévisualisation distante ni vérification de production n’est revendiquée.

Serveurs laissés disponibles : développement `http://127.0.0.1:4396` (session 14664), sortie statique `http://127.0.0.1:4397` (session 69495). Ils étaient absents au début et ont été démarrés dans ce worktree ; aucun serveur d’une autre session n’a été arrêté. La sortie statique contient l’export Markdown final. Pour revalider lastmod, respecter l’ordre de la chaîne avant cet export.
