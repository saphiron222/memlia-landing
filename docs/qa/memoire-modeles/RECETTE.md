# Recette — mémoire collective et modèle privé

Base de travail :392268488f0fdeb07f18f23a9ca7d7b05bcf0757, conservée dans le chantier agents/robots/outils. Travail isolé sur site/memoire-modeles-prives. Aucune fusion ni production.

## Direction finale de Kevin
Bureau collectif Memlia OS validé. Pictogramme de mémoire au centre. Boîtier, pile au scroll et figurine retirés entièrement. Les pistes rejetées restent dans les sources hors dépôt avec README explicite. Le modèle privé conserve son illustration animée, automatique sans bouton de pause, avec sélection manuelle et mouvement réduit.

## Contrôles ciblés effectués
- 5 tests données, modèles/logos, navigation, contact et GET/HEAD des2 routes CSP : PASS ; 7 tests de contrat navigation : PASS.
- Première recette : 10 tests navigateur propres aux offres, dont les six logos locaux. Le premier test des logos lisait leur état avant la fin du chargement différé ; il attend maintenant leur chargement réel. Les 86 tests ciblés (10 offres et 76 navigation/menu/footer) passent sur l’artefact statique avant les derniers ajustements, sans test ignoré. Formats390/1024/1440, sans débordement global ; FAQ clavier ; présélection facultative ; repli sans JS ; pause dès le premier clic, reprise et arrêt hors écran ; mouvement réduit ; quatre étapes OS manuelles ; tableaux nommés et défilables au clavier ; absence de fetch/XHR et de stockage des illustrations.
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

## Dernier delta modèles et navigation
Huit familles candidates : Llama, Mistral, Qwen, DeepSeek, Gemma, gpt-oss, GLM et Kimi. Logos officiels, locaux et optimisés , manifeste avec dimensions, empreintes et sources. Pas de licence universelle : la version retenue et ses conditions sont fixées par projet.

Nos services regroupe Robots, Agents IA, Memlia OS et Modèle IA privé. Intégrations est un lien direct. Le footer reprend exactement les quatre prestations et range Intégrations dans Vos outils. Repli sans JS, clavier, mobile 320–768 et bureau 1024/1440 contrôlés ; preuves visuelles dans .qa/memoire-modeles/. Les deux revues indépendantes du delta ont rendu PASS, sans contrôle juridique prétendu.

Le dossier de preuve visuelle evidence.json passe le vérificateur du skill Claude frontend-design-direction ; il décrit des captures réellement inspectées, pas une certification automatique du rendu. Les lancements de CI sur 5a4cd96c puis f8e13da8 ont été annulés pour intégrer les demandes suivantes de Kevin ; ils ne valent pas pour le nouveau candidat.

## Dernière recette des annotations, modèles et animation
65 tests navigateur ciblés PASS sur le statique : offres, compatibilités, fiches robots et agents. Deux générations de prompts avec édition, copie et exports PASS. Deux tests supplémentaires vérifient le survol/focus et la sélection persistante, les quatre étapes en9,6secondes, et le vrai Lockup en haut à gauche à390/1440px. Les huit logos et les libellés GLM, Kimi et gpt oss sont inspectés visuellement. Les notes pédagogiques répétées sont retirées dans le HTML, sans masquer les paragraphes en CSS. Les limites métier et les informations de saisie utiles restent dans leur contexte.

L’ensemble final est suivi par la CI sur son SHA exact ; le déploiement final utilise cet artefact. Les contrôles de scène testent l’absence d’appels réseau, le mouvement réduit, le mode sans JavaScript et les interactions clavier. La suppression du bouton de pause ne supprime pas les moyens de stabiliser la lecture.

Après accélération et remplacement du logo : les13tests navigateur des offres repassent sur le statique final, sans test ignoré. Contrat97HTML,89exports Markdown,24redirections et deux images sociales contrôlées : PASS. Revue indépendante du dernier delta : PASS.
