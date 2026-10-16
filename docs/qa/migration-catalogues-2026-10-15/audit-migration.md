# Audit de migration vers les trois catalogues Memlia

Date : 15 octobre 2026. Audit en lecture seule du code et du dernier export local existant ; aucune compilation, dépublication, modification de recette, requête à un portail client ni mise en production. Seul ce rapport a été écrit.

## Décision de référence

Kevin retire les guides par environnement et l’ancien catalogue de services par pôle. Les entrées commerciales deviennent : robots pour les routines, agents IA pour les métiers, intégrations pour les environnements. Le design apprécié reste en place. Les articles, outils gratuits, pages institutionnelles et accueil CAC restent des contenus distincts, avec leurs parcours mis à jour.

Skills réellement lus : `~/.claude/skills/seo-technical/SKILL.md`, `seo-sitemap/SKILL.md`, `seo-schema/SKILL.md`. Les recommandations ci-dessous portent sur des observations du dépôt ; aucune position Google ni amélioration de classement n’a été supposée.

## État mesuré avant migration

- 21 robots, 12 agents, 9 véritables fiches agents. Trois agents conduisent à une destination partagée : Salomé vers `/automatisation/paie`, Aude vers `/commissaires-aux-comptes`, Octavie vers `/integrations`.
- **12 anciens services** sous `/automatisation/<slug>`, tous `status: publie` et inscrits au registre durable `config/service-publication-ledger.json`.
- **12 guides rendus et indexables**, et non neuf : neuf historiques dans `src/data/integrations.ts` et trois générés dans `src/data/guides.generated.json`.
- Les quatre dossiers de provenance de guides sont : rapprochement-bancaire-sage (historique préparé), export-fec-ebp et lettrage-ebp (scellés), cloture-ebp (publié). Le statut de ces dossiers ne définit pas le routage public : `INTEGRATIONS_INDEXABLES = INTEGRATIONS` les rend tous.
- `src/pages/automatisation/[slug].astro` rend actuellement toutes les entrées de la collection services, même non publiées ; un simple passage à `a-valider` laisse donc une page HTML accessible en noindex. Une suppression commerciale réelle exige aussi le filtrage des routes de sortie.
- `public/_redirects` ne contient actuellement que le renvoi de `/automatisation/` vers le hub et une ancienne migration de blog. Aucune des 24 migrations demandées n’est définie.

## Priorités bloquantes avant livraison

1. **Créer la fiche Salomé avant le retrait de la paie**. La carte paie/social, les voisins et le contact doivent mener vers `/agents-ia/paie-social`. Rediriger l’ancien service vers l’ancienne destination de Salomé créerait une boucle ; supprimer la route sans changer sa destination casserait le catalogue.
2. Retirer les **12 anciens services et 12 guides du rendu, des sitemaps, de llms.txt et des exports Markdown**, puis ajouter 24 redirections permanentes explicites vers des destinations réellement rendues. Ne pas appliquer de joker à `/automatisation/*` : il engloberait les 21 robots conservés.
3. Corriger les liens visibles et les références JSON-LD à la source. Les redirections servent aux anciennes URL externes, elles ne remplacent pas le nettoyage du maillage interne.
4. Respecter les recettes et archives scellées : ne pas les réécrire, les supprimer ou contourner les contrôles pour obtenir un build vert. Documenter la décision de retrait et adapter les contrôles publics à cette transition autorisée.

## Matrice des anciens services

Les ancres des fiches déjà présentes ont été relues dans `src/layouts/Agent.astro` et dans le HTML du dernier `dist`. Les nouvelles ancres de Salomé restent à vérifier après sa création.

| Ancienne route | Destination permanente recommandée | Couverture et précaution |
| --- | --- | --- |
| `/automatisation/saisie-comptable` | `/agents-ia/comptabilite#tache-saisie-ocr-2` | Lecture et pré-imputation des pièces. |
| `/automatisation/factures-fournisseurs` | `/agents-ia/comptabilite#tache-achats-fournisseurs-4` | Contrôles des factures d’achat et exceptions. |
| `/automatisation/rapprochement-bancaire` | `/agents-ia/comptabilite#tache-banque-rapprochement-5` | Appariement bancaire et suspens. |
| `/automatisation/notes-de-frais` | `/agents-ia/comptabilite#taches-titre` | Les justificatifs de frais sont dans « Aussi dans son périmètre » ; aucune ancre de ligne spécifique existante. Ajouter une ancre stable à ce complément serait plus précis. |
| `/automatisation/facture-electronique` | `/agents-ia/comptabilite#tache-facture-electronique-3` | Ancien service de flux et relances hors outil. Ne pas le confondre avec les trois robots annuaire/fiches DGFiP/mandats. |
| `/automatisation/paie` | `/agents-ia/paie-social` | Nouvelle fiche obligatoire. |
| `/automatisation/bulletins-controle` | `/agents-ia/paie-social` | Cibler l’ancre des contrôles de bulletins une fois la fiche construite. |
| `/automatisation/entrees-sorties-salaries` | `/agents-ia/paie-social` | Cibler l’ancre de préparation des entrées/sorties une fois la fiche construite. |
| `/automatisation/secretariat-juridique` | `/agents-ia/juridique-fiscal#tache-secretariat-juridique-7` | Préparation des documents d’approbation ; le dépôt reste aussi couvert par la ligne8. |
| `/automatisation/registres-obligations` | `/agents-ia/juridique-fiscal#tache-registres-obligations-10` | Périmètre large registres/obligations. Ne pas réduire arbitrairement au seul robot bénéficiaires effectifs. |
| `/automatisation/evaluation-transmission` | `/agents-ia/finance#tache-evaluation-transmission-10` | Préparation de l’évaluation et transmission. |
| `/automatisation/circularisation-cac` | `/commissaires-aux-comptes#use-certification` | Ancre réellement rendue ; population, sélection et rapprochements, décisions conservées au CAC. |

Une redirection permanente directe en 301 ou 308 est cohérente. Le dépôt emploie déjà308. Conserver une seule étape et vérifier les règles sur la prévisualisation Cloudflare, y compris avec barre finale et anciennes ancres. Le fragment transmis n’est pas envoyé au serveur : une ancienne ancre doit être remplacée explicitement par l’ancre cible si nécessaire.

## Matrice des guides par environnement

Les destinations ci-dessous respectent le nouveau rôle de `/integrations`. Les quatre ancres de marque sont présentes dans les données et dans le dernier HTML du hub. Les anciens guides avaient une intention plus précise (« tâche + logiciel ») que le nouveau répertoire : la redirection maintient un parcours utile vers le bon environnement, sans garantir la conservation d’un classement sur la requête longue.

| Guide retiré | Destination permanente recommandée |
| --- | --- |
| `/integrations/rapprochement-bancaire-sage` | `/integrations#sage-100-comptabilite` |
| `/integrations/lettrage-sage` | `/integrations#sage-100-comptabilite` |
| `/integrations/saisie-comptable-sage` | `/integrations#sage-100-comptabilite` |
| `/integrations/cloture-sage` | `/integrations#sage-100-comptabilite` |
| `/integrations/dsn-sage` | `/integrations#sage-100-paie-rh` |
| `/integrations/bulletin-de-paie-sage` | `/integrations#sage-100-paie-rh` |
| `/integrations/lettrage-cegid` | `/integrations#cegid-loop` |
| `/integrations/dsn-silae` | `/integrations#silae` |
| `/integrations/bulletin-de-paie-silae` | `/integrations#silae` |
| `/integrations/export-fec-ebp` | `/integrations#ebp-comptabilite` |
| `/integrations/lettrage-ebp` | `/integrations#ebp-comptabilite` |
| `/integrations/cloture-ebp` | `/integrations#ebp-comptabilite` |

L’export FEC n’équivaut pas au robot de tableaux de bord à partir du FEC : ne pas rediriger ce guide vers un livrable différent pour utiliser une nouvelle fiche.

## Sources publiques à migrer

- `src/data/accueil/ec.ts` : `orientation.services` porte encore cinq anciennes destinations. Remplacer les liens dans le bloc existant, sans déplacer son design.
- `src/data/robots/catalogue.ts` : nombreux liens contextuels vers les anciens services, notamment URSSAF, bénéficiaires effectifs, tableaux de bord FEC et situation TVA. Les remplacer par l’agent et la tâche correspondants.
- `src/pages/methode.astro`, `garanties.astro`, `a-propos.astro` : les liens de texte vers les services restent présents. Reformuler les libellés autour des robots et agents ; garder les engagements techniques/commerciaux déjà validés.
- `src/data/blog-commercial-links.mjs` : les liens commerciaux des articles sont déjà séparés des corps scellés. Les migrer dans cette table ; élargir précisément `estLienCommercialBlog` qui refuse actuellement les routes agents et les ancres. Ne pas faire une liste blanche arbitrairement ouverte.
- `src/data/outils.ts`, `src/components/sections/OutilSuite.astro` : destinations des outils gratuits. L’assistant lettrage comporte en outre des liens explicites vers lettrage Sage/Cegid dans sa page Astro.
- `/integrations` et hub robots : supprimer les blocs/liens de guides tout en conservant la composition des catalogues.
- `src/data/specialistes/*.ts`, `src/data/specialistes.ts`, `src/data/specialistes-controle.ts` : `servicesLies`, `pageDeLaRegle`, destination Salomé et neuf-fiches/trois-destinations doivent devenir cohérents avec les dix fiches/deux destinations. La propriété historique peut être conservée comme provenance si elle n’émet plus de liens publics et si son contrat est adapté explicitement.
- `src/pages/agents-ia/[metier].astro` : résout la page de règle et les liens des familles depuis les seuls services publiés. Après retrait, privilégier les articles et tâches du nouveau catalogue ; éviter une autoréférence inutile vers la même ligne de l’agent.
- `src/data/schema-agents.mjs` : `servicesLiesIds` émet actuellement des références aux anciens `#service`. Ces entités n’existeront plus ; retirer ou remapper vers les services agents/robots réels sans faire de la figurine une Person. Les autres Person d’auteur humain restent légitimes.

## Dépendances de gouvernance

### Services

`service-forge.mjs depublier` est une transition existante. Elle attend une déclaration datée : slug, route, `authorizedBy: Kevin Kitanga`, raison durable d’au moins60caractères, et exactement un `replacement` ou un `redirect` interne. La demande actuelle autorise le retrait. La transition conserve recette, corps, revue et sceau, retire le reçu de publication et marque le registre `depublie`.

Attention : l’audit des services vérifie encore les recettes, les sources et les sceaux après retrait. Ne pas détruire `src/content/services` ni `commercial/services`. Le garde de design (`scripts/verify-service-design.mjs`) considère aujourd’hui **tous** les fichiers de collection comme « servis » ; il doit exclure explicitement les services retirés et conserver ses assertions sur ceux qui seraient encore publics. Les robots ont leur propre garde.

Le registre durable garde encore une décision textuelle « les services historiques restent publiés ». Cette décision du15octobre doit être remplacée par la nouvelle décision de Kevin, avec l’historique des migrations conservé. Le mécanisme `service-incoming-migrations.mjs` lit des AST très précis de la route et du layout agents : toute adaptation de ces composants doit être accompagnée de ses tests de régression, sans assouplir globalement leur sécurité.

### Guides

La forge de guides n’a **pas de transition de retrait** : seuls prepare/scelle/publie sont admis. Conserver les quatre archives de provenance et les trois entrées générées exactes ; faire porter le retrait public sur un registre de migration dédié ou une transition explicitement testée. Modifier directement la collection générée scellée provoquerait une divergence de preuve et de métadonnées.

Les tests de guides doivent distinguer leur fonction historique de provenance et les invariants du nouveau site public : absence de routes guides, compatibilités toujours accessibles, redirections24/24, aucune route robot absorbée.

## SEO technique à aligner

- **Sitemap** : `astro.config.mjs` découvre actuellement services et guides ; filtrer toutes les routes retirées. `scripts/lib/sitemaps.mjs` appelle encore le groupe `/integrations` « guides » et `/automatisation` « services ». Renommer les sous-sitemaps en robots/compatibilites serait plus clair, tout en évitant de casser l’index et ses tests. Aucun sitemap vide, noindex, ancien301/308 ou doublon.
- **lastmod** : utiliser le mécanisme de contenu existant, pas la date de build. Retirer les24routes du registre rendu ; les dates des archives peuvent rester historiques.
- **llms.txt** : sa source cite encore « familles et pôles » et « recherche et guides par tâche ». `renderLlmsInventory` compte encore guides et services et ne met pas les agents dans sa liste principale ; il faut compter et décrire robots/agents/compatibilités depuis les pages réellement publiées. Les cartes Octavie/Aude ne sont pas des fiches agents supplémentaires.
- **Markdown / llms-full** : régénérer depuis le HTML final et le sitemap ; vérifier absence de toutes les24URL sources, absence d’exports résiduels retirés, cohérence des alternates et Content-Type. Les anciens exports Markdown étaient noindex ; ne pas les conserver dans les inventaires actuels.
- **Propriété des requêtes** : le contrat de page et le registre SEO réservent encore les intentions des24pages. `collectQueries` lit même les services non publiés ; distinguer une archive de requête et sa nouvelle propriétaire canonique pour ne pas recréer ensuite une page concurrente. Ajouter le contrat de Salomé. Conserver la distinction agent juridique (préparation) / robots fiscaux (collecte et suivi), agent finance (analyse et scénarios) / robot FEC (restitution), articles (méthode informationnelle) / fiches (service commercial).
- **Schémas** : vérifier chaque URL et `@id`, BreadcrumbList et ItemList après retrait. Aucun item ne doit désigner un service absent. Pas de FAQPage ajouté au catalogue contrairement à la décision validée ; pas de prix/avis/partenariat/SoftwareApplication inventés.
- **Réseau/indexation** : ne pas bloquer les anciennes routes dans robots.txt, les moteurs doivent pouvoir lire leur redirection. Prévisualisation noindex, canonical de production, production indexable conservée. La nouvelle fiche paie doit bénéficier de la même CSP sans réseau que les autres agents.

## Recette recommandée, sans changer le design

1. Tests unitaires de migration : couverture exacte24routes, ancienneté/provenance conservée, aucune collision avec21robots, cible locale réelle, pas de boucle/chaîne, état retiré cohérent.
2. Tests de catalogue et contact :12cartes,10fiches,2destinations, Salomé visible/joignable, voisins et présélections sans données personnelles en URL.
3. Crawl de **toutes** les pages HTML rendues et de tous leurs liens/ancres/images/OG ; pas seulement les19routes du précédent audit. Les liens internes doivent déjà être les destinations finales.
4. Contrôles ciblés contrats de page, query ownership, service/guide archives, dernier export, sitemap, llms et Markdown. La suite globale reste en CI conformément à CLAUDE.md.
5. Sur le véritable preview Cloudflare :24redirections, destinations et ancres, robots/noindex/canonical, erreurs404 réelles, headers/CSP et absence Insights sur les démonstrations.
6. Inspection visuelle ciblée accueil, intégrations, Salomé mobile/bureau pour confirmer que le nettoyage technique n’a pas changé la direction validée.

Aucune note SEO, performance ni indexation Google n’est attribuée par cet audit : ces mesures n’ont pas été rejouées. La réussite technique de la migration est vérifiable ; un classement « intouchable » ne peut pas être garanti.
