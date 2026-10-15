# Revue indépendante — migration des catalogues

**Verdict : PASS.** Aucun défaut produit bloquant encore ouvert à la fin de cette revue.

Date : 15 octobre 2026. Relecteur : agent Codex `/root/audit_migration_seo`, distinct de l’auteur de l’implémentation produit. Revue en lecture seule ; aucun code produit, test supplémentaire, recette ou archive modifié pendant cette phase. La phase précédente avait adapté des tests historiques ; cette revue porte sur le code produit de migration et le rendu final.

Base Git : `bf09e2e3902ae3bdaa5dd00a071685858b458371`. Candidat : diff de travail courant et nouveaux fichiers. Empreinte agrégée des 105 chemins produit concernés (`src/`, `functions/`, `scripts/`, `config/`, `public/`, `commercial/`, `package.json`, chemins triés puis contenu ou marqueur de retrait) : `d9170c40ecb2d7bd96b06fb64482d48403cef843d31e9a5a5ac4e2beb16fe6b0`.

## Contrôles et observations

### Routage et absence de régression des robots

- Le registre contient exactement 24 retraits : 12 services et 12 guides. Chaque source a une destination métier ou environnement pertinente, sans joker, doublon, boucle ou seconde ancienne URL en destination.
- Les 21 slugs robots restent hors de l’ensemble retiré ; leurs pages et leurs entrées sitemap sont présentes.
- Le générateur des anciennes fiches services filtre les retraits explicitement. Il ne se contente pas d’un noindex : aucun de leurs anciens fichiers HTML ou Markdown ne subsiste dans le rendu final.
- `INTEGRATIONS_ARCHIVEES` conserve les 12 définitions ; `INTEGRATIONS_INDEXABLES` est vide. La route Astro des guides ne produit plus de page, sans altérer le corpus de recherche scellé.
- Salomé possède désormais sa fiche réelle ; le catalogue garde 12 agents, avec 10 fiches et deux destinations partagées. Les cartes, le contact et le maillage ne conduisent plus à l’ancien service paie.
- Les redirections statiques sont synchronisées : 96 règles exactes, couvrant URL nue, barre finale, `.html` et ancien Markdown. Les destinations Markdown sont des fichiers texte de page, sans fragment HTML.
- Les deux Pages Functions traitent les anciennes routes avant de lire un asset. Les routes inconnues gardent la réponse404 ; les robots gardent leurs réponses GET/HEAD et leur CSP sans réseau. Les tests de handlers passent en mémoire. La vérification du comportement Cloudflare distant appartient à la recette de livraison du parent ; elle n’est pas simulée par ce verdict.

### Dépublication et conservation des preuves

- Les 12 services ont une déclaration autorisée et datée, un statut durable `depublie`, une destination et un sceau de dépublication. La demande de Kevin constitue l’autorité de retrait.
- Comparaison indépendante avec `HEAD` : les **36 fichiers recette/corps/revue** sont identiques ; les 12 Markdown services ne changent que de statut. Les recettes des guides, leurs états et les collections générées restent inchangés.
- Les **12 anciens reçus de publication** ont été retrouvés dans `/Users/kevinkitanga/dev/interne/memlia-landing-sources/migration-catalogues/2026-10-15/` et comparés octet par octet aux reçus de `HEAD` avant retrait du dossier actif.
- L’audit des services vérifie toujours les empreintes, les déclarations et les recettes. Pour une archive, les contrôles datés restent évalués au jour du retrait ; une nouvelle préparation/publication reste soumise au jour courant. L’audit a été rejoué aujourd’hui puis avec `today: 2027-01-01` : les 12 archives passent dans les deux cas.
- La provenance de quatre dossiers de guides passe encore son audit. Leurs anciens statuts de préparation/scellement/publication sont historiques ; le registre de migration porte séparément le retrait public.

### Maillage et découverte

- Les anciennes destinations visibles ont été migrées dans les données commerciales, les pages institutionnelles, les robots et les outils. Les corps d’articles scellés restent intacts ; les ponts commerciaux utilisent leur table dédiée.
- Les anciens `#service` n’apparaissent plus dans les graphes actifs : les données agents ne déclarent plus les services retirés. Le schéma continue à représenter l’agent ou le robot comme Service, avec son fournisseur Organization.
- Le contrat d’intention actif retire les anciennes pages et ajoute Salomé. La collecte des requêtes exclut les seules routes retraitées, après validation canonique ; elle continue à contrôler les candidats et les autres pages.
- llms.txt et son inventaire généré décrivent les trois catalogues. Robots, fiches agents, articles et outils sont comptés depuis le rendu publié ; les versions Markdown et llms-full sont régénérées depuis le même HTML.
- Le rendu contrôlé comprend **95 documents HTML et 87 URL indexables** dans huit sous-sitemaps. Les 24 anciennes URL sont absentes du sitemap et des exports. Les 21 robots et dix fiches agents restent présents. Aucun ancien lien ni ancre de destination manquante n’est signalé par la garde de migration.
- Les anciens groupes de fichiers sitemap conservent leur nom historique ; cela ne modifie ni leurs URL canoniques ni leur contenu valide. L’alias `/sitemap-0.xml` conduit désormais à l’index courant. Aucune exclusion robots.txt n’empêche les moteurs de lire les anciennes redirections.
- Le nouvel accès contextuel au générateur de relance est relié à la tâche de relances d’impayés d’Honoré. La méthode conserve également son lien ; cet outil n’est pas devenu orphelin après retrait des anciens liens de hub.

## Constats corrigés pendant la revue

1. **Filtre de propriété des requêtes — corrigé.** La première version filtrait les archives par le seul `pathname`. Une URL externe ayant le même chemin qu’un service retiré pouvait alors disparaître de l’audit et provoquer un faux PASS. Le défaut a été reproduit dans une fixture isolée puis remonté à l’auteur. Le correctif appelle `canonicalUrl` avant le filtre ; le mutant registre `https://example.com/automatisation/paie` est maintenant refusé. Les contrôles génériques des candidats et conflits restent actifs.
2. **Raison du registre de publication — corrigée.** La phrase « les services historiques restent publiés » contredisait les 12 dépublications. Elle décrit désormais les trois catalogues et les 24 retraits, en conservant l’historique des migrations entrantes.
3. **Artefact intermédiaire non nettoyé — résolu par la génération normale.** Un lancement du contrat de page pendant la régénération trouvait encore des briefs et anciens noms d’images dans le dist brut. Après `render:public`/nettoyage, le même contrôle passe intégralement. Aucun garde n’a été assoupli pour cela.

## Vérifications effectivement exécutées

- **109/109 tests ciblés** : migration/routage, mutants d’export, propriété des requêtes, forge des services, garde de design, archives intégrations, rendu de compatibilités et inventaire llms.
- **104/104 contrôles complémentaires** : ponts commerciaux du blog, schémas agents/robots, sitemaps et livraison des catalogues.
- **51/51 rejeux après corrections**, recouvrant une partie des groupes précédents : propriété des requêtes, migration, mutants d’export et llms. Ces chiffres ne sont pas additionnés comme des tests uniques.
- Forge services : PASS, 12 archives ; forge guides : PASS, quatre dossiers de provenance.
- Synchronisation des redirections : PASS, 24 migrations / 96 variantes.
- Propriété des requêtes : 348 URL, 403 déclarations croisées, aucun conflit non motivé. Il s’agit du registre de requêtes incluant les candidats, pas du nombre de pages publiques.
- Contrat de page final : **VERT**, 95 pages, cinq clauses, 36 exemptions documentées ; positionnement, design des services restants, forge, contrat du blog et intention des titres passent.
- Garde d’export de migration : **PASS**, 24 retraits, 95 HTML, aucune erreur.
- Contrat Markdown : **PASS**, 87 pages correspondant au rendu indexable.

Aucun build complet, déploiement, appel à un espace fiscal/social ni envoi de formulaire n’a été lancé par cette revue. Le PASS valide la cohérence du code et des artefacts inspectés ; il ne constitue ni un verdict de CI globale ni une mesure de classement Google. La recette HTTP distante et l’inspection visuelle finale restent exécutées par le parent avant livraison.

## Addendum — attentes navigateur de livraison

**PASS**, le 15 octobre 2026. Relecture limitée au dernier diff de trois fichiers de tests ; aucune modification de l’implémentation ni des tests par le relecteur.

- `integrations.spec.ts` : la recherche est évaluée sur les champs réellement recherchables de chaque carte (nom, éditeur, description). Le témoin doit être non vide et les identifiants exacts des résultats sont maintenant comparés en plus du compte : ce changement renforce le contrôle et supprime une attente devenue inexacte.
- `navigation-v3.spec.ts` : l’ancienne URL du guide est vérifiée comme une entrée redirigée vers le catalogue commun lors de la livraison Pages. La destination finale et son fragment sont exigés ; `aria-current="page"` est approprié sur le lien du catalogue, et le groupe garde `aria-current="true"`. Les tests de souris, clavier, focus, fermeture et navigation mobile restent inchangés.
- `robots.spec.ts` : les 12 anciennes fiches de services ne doivent plus répondre avec leur ancien gabarit. Elles doivent être absentes du sitemap et répondre301 vers la destination exacte en livraison Pages ; les destinations finales doivent répondre200. Les contrôles des 21 robots, des démonstrations sans réseau, de CSP, de contact, du clavier et du rendu restent conservés.

Aucun garde encore pertinent n’a été supprimé ou affaibli. Les branches conditionnelles distinguent le routage Cloudflare réel du serveur Astro local ; la recette distante utilise `QA_PAGES_DELIVERY=1`. La nouvelle exécution des 136 scénarios et le relevé HTTP distant sont conduits par le parent, distinctement de cette relecture du diff.
