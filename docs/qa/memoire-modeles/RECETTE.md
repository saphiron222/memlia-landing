# Recette — mémoire collective et modèle privé

Base de travail :392268488f0fdeb07f18f23a9ca7d7b05bcf0757, conservée dans le chantier agents/robots/outils. Travail isolé sur site/memoire-modeles-prives. Aucune fusion ni production.

## Direction finale de Kevin
Bureau collectif Memlia OS validé. Pictogramme de mémoire au centre. Boîtier, pile au scroll et figurine retirés entièrement. Les pistes rejetées restent dans les sources hors dépôt avec README explicite. Le modèle privé conserve son illustration animée, avec pause, sélection manuelle et mouvement réduit.

## Contrôles ciblés effectués
- 4 tests données, navigation, contact et GET/HEAD des2 routes CSP : PASS.
- 9 tests navigateur sur serveur de développement puis artefact statique : PASS. Formats390/1024/1440, sans débordement global ; FAQ clavier ; présélection facultative ; repli sans JS ; pause dès le premier clic, reprise et arrêt hors écran ; mouvement réduit ; quatre étapes OS manuelles ; tableaux nommés et défilables au clavier ; absence de fetch/XHR et de stockage des illustrations.
- Contrat de page :97 HTML,5clauses, PASS. Contrôle de positionnement, services scellés, blog et liens existants conservés. Les deux routes ont une intention dédiée ; aucun volume SEO inventé.
- Exports assistants :89 pages Markdown et llms-full.txt, inventaire llms.txt depuis sitemap, PASS. Les2nouvelles pages figurent dans sitemap-pages.xml.
- Migration des anciens catalogues :24redirections,97 documents, PASS. Aucun retour des anciens services ou guides.
- Lighthouse mobile local :99performance,100accessibilité,100bonnes pratiques,100SEO pour chacune des2 pages. Mesures de laboratoire, pas données de terrain.
- Images sociales propres1200×630 :2 cadres issus des scènes du site, empreintes et dimensions réelles contrôlées. JPEG produits par le pipeline social commun.
- Revue indépendante copie/offre : PASS. Distinction RAG/entraînement/licence/adaptation, accès, budget, validation et réversibilité.
- Revue indépendante code/QA : PASS après correction du tableau clavier ; preuve réseau déplacée avant navigation.

Les rapports et captures de travail sont dans `.qa/memoire-modeles/`. La preuve de CI et le déploiement final se lisent sur le SHA exact de la PR et son artefact `site-verifie-<SHA>` ; aucune réussite distante ne se déduit des seuls tests locaux. La prévisualisation est préparée avec meta et en-tête noindex,nofollow.

## Limites explicites
Site vitrine et exemples fictifs. Aucun boîtier acheté, modèle entraîné, débit matériel mesuré ni système client connecté. Pas de clé Mammouth ou d’appel payant. Les critères de dimensionnement et le choix du modèle de base restent définis par mission dans CADRAGE.md. Les deux grilles de pricing précédemment validées sont inchangées ; ces prestations font l’objet d’un devis dédié.
