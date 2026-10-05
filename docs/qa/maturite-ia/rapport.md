# Diagnostic de maturité IA — livraison d’implémentation

## Résultat et méthode

Route candidate : `/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet`.
Quinze questions facultatives, trois dans chacune des dimensions usages/règles/données/validation/mesure. Rubrique originale Memlia version 1, sans note globale, audit normatif, comparaison de cabinets, classement de salariés ou gain déduit.

Une inconnue rend sa dimension incomplète. Les trois réponses formalisées rendent la dimension formalisée ; trois non commencées la rendent à démarrer ; les autres combinaisons connues sont en essai. Ordre de travail explicite : données, validation, règles, mesure, usages ; trois premières dimensions non formalisées. Les inconnues demandent clarification. Si tout est formalisé : suivre les exceptions, relire les règles et comparer les observations. Chaque action cite ses réponses.

Décision de présentation : états et actions visibles ; réponses et justifications dépliables avec `details` natifs pour éviter un long mur de texte. Rapport Markdown complet toujours sélectionnable, copie et export identiques. Exemple et réinitialisation demandent confirmation avant remplacement. Aucun texte libre ni identité de salarié collectés.

## Exécution réelle

- Test moteur écrit avant le moteur : échec observé `ERR_MODULE_NOT_FOUND`, puis sept tests PASS.
- `npx astro check` : 0 erreur, 0 warning, huit hints préexistants.
- `npm run build` : sortie 0 ; 124 tests Python et 613 tests Node PASS ; audits blog, service, contrat de page, positionnement, médias, lastmod et ressource PASS.
- `QA_URL=http://127.0.0.1:4348 npx playwright test tests/browser/maturite-ia.spec.ts` : 14 PASS sur le build final. Scénarios inconnues, données prioritaires, tout formalisé, changement isolé, précédent/suivant, refus de remplacement/reset, copie réussie/refusée, export UTF-8 identique, six largeurs, sans JavaScript, SEO et maillage.
- Réseau observé après chargement pendant saisie/synthèse/export : aucune requête. localStorage, sessionStorage, IndexedDB et cookies vides. Événements limités aux clés action/outil ; succès émis après synthèse réelle.
- Renderer `node scripts/render-proofs-v2.mjs --series=maturite --adopt` puis `--check` PASS : scène propre 1600×900, texte figé, polices chargées, pas de texte tronqué, WebP 54 Ko et OG 1200×630. Lecture visuelle effectuée.
- Captures pleine page 1440/375 avec vrai scroll préalable pour déclencher les animations et médias paresseux. Le premier essai capturait les sections avant révélation et la nav après scroll ; cette capture incorrecte a été remplacée. La grille de l’outil réutilise OutilZone ; aucun nouveau gabarit global.
- Lighthouse local mobile : performance 99, accessibilité 100, bonnes pratiques 100, SEO 92. Desktop : 100/100/100/92. Le seul audit SEO échoué est `robots-txt`, car Lighthouse tente un chargement réseau dans le contexte `connect-src none` et reçoit `CSP violation`. GET réel de robots.txt réussi. La CSP locale n’a pas été affaiblie pour augmenter un score. Ces rapports mesurent la page avant le seul ajustement de présentation dépliable du résultat ; à remesurer sur le candidat par QA et production. Aucun score de production revendiqué.

## SEO, sources et couverture

H1 et OG identiques au brief, canonical absolu sans slash final, WebPage/WebApplication/BreadcrumbList sans avis/rating. Corps statique expose les questions, méthode et limites. Catégorie Se situer ajoutée ; hub et footer générés depuis OUTILS. Entrants contextuels méthode et service livrés atomiquement avec la route. Primaire distinct au registre, aucune route supplémentaire par question/réponse et aucun contenu saisi dans l’URL. Le témoin conserve son noindex.

Aucune règle fiscale/juridique nouvelle : source de la rubrique = méthode originale Memlia explicitement nommée. La concurrence et la référence de gouvernance du cadrage ne servent pas à faire passer les états pour une norme. Pas de volume, benchmark, certification ou résultat client inventés.

`matrice-skills-08.json` couvre les 64 compétences de la colonne 08 : application ciblée locale et preuves distinguées des contrôles de visibilité après publication. Les instruments fournisseurs non appelés sont explicitement N/A instrument, avec alternative locale. Les compétences hors périmètre conservent leur N/A. GSC, indexation, backlinks, citations et résultats commerciaux : ND, pas zéro. La QA et la livraison doivent compléter les observations publiques, J+7/J+28 si données disponibles.

## Conservation du glossaire existant

L’ajout du lien au footer change tous les HTML non éditoriaux : lastmod synchronisé et revue glossaire conservée. Le rescellage a d’abord remis la campagne de revue à une date historique, ce qui faisait échouer deux verdicts récents. La date réelle déjà présente sur main a été rétablie, sans nouveau verdict ni nouvelle revue ; `reaffirmer` et audit QA PASS. Le fond et les sources du glossaire ne changent pas. Une réparation du script de rescellage est transmise séparément, pas incluse dans cette fonctionnalité.

## Publication constatée le 05/10/2026

La revue indépendante unique t_873665dd est PASS ; PR73 fusionnée après Repository gates SUCCESS. Cloudflare 7e11e252 build/deploy SUCCESS au commit 818320af ; URL publique et URL de déploiement éprouvées avec 22 parcours chacune et 20 GET sans query string avec Cache-Control no-cache. Export/copie/reprise/refus, six largeurs, impression complète, absence de réseau/stockage pendant les interactions et SEO/maillage PASS. Rapport de livraison : `livraison/rapport-production.md`. Les chiffres locaux ci-dessus restent historiques ; aucune indexation réelle, performance commerciale ni mesure J+7/J+28 n’est déduite de cette publication.

Retour arrière de la fonctionnalité : revert du commit livré, puis build et déploiement vérifiés ; ne pas retirer isolément une route en laissant ses liens entrants.
