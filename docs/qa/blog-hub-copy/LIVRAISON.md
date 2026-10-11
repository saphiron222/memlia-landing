# Hub blog : passe de copy du 08/10/2026

## Décision et périmètre

Le hub oriente vers le geste recherché, puis distingue la méthode publiée du service qui prend la tâche en charge. Hypothèse de navigation éditoriale, aucun gain de trafic ou de conversion annoncé.

L’audit H1 classe la copy de `/blog` « Conserver » : H1, title, description, canonical, cartes, ordre chronologique, données des articles et DA conservés. Trois liens de rubrique dans le chapeau utilisent des destinations déjà publiées. Les liens sont soulignés avec le traitement et le token vert existants. Aucun nouveau fait réglementaire. La série Cicatrices est présentée sous le nom de Kevin Kitanga, sans modifier ses récits ni leur authentification.

## Base observée avant publication

Lecture réelle de https://memlia.fr/blog le 08/10/2026 : HTTP 200, 16 cartes dont le pilier, zéro lien de rubrique dans le paragraphe d’orientation. Les trois rubriques existaient déjà au pied de page. Capture candidate : mêmes 16 cartes et même ordre, trois liens de rubrique dans le chapeau. H1, canonical, titre d’onglet et description comparés par script : identiques. Aucun débordement aux captures 375 et 1440 px.

Cette base décrit la surface, pas les comportements. Aucun taux de lecture, clic de rubrique, trafic, demande ou conversion disponible dans cette passe. Les liens ne prouvent pas leur usage. Les captures pleines pages utilisent le mode natif reduced-motion : il rend les cartes hors viewport sans figer artificiellement les styles. Une première capture avec défilement doux trop rapide n’avait pas déclenché toutes les apparitions ; elle est remplacée, pas utilisée comme preuve d’une page vide.

## Vérification exécutée

- `npm run regen:generated` : PASS ; seul `/blog` change de date au registre.
- `python3 -m unittest discover -s tests/proof -p test_positioning.py -v` : 9 tests PASS, dont le nouveau contrat du hub.
- `QA_URL=http://127.0.0.1:4329 npx playwright test tests/browser/blog-hub-copy.spec.ts tests/browser/blog.spec.ts tests/browser/positioning.spec.ts` : 22 tests PASS. Le nouveau fichier couvre six largeurs (320, 375, 768, 1024, 1440, 1920), les trois parcours hub → rubrique → article, l’auteur et le CTA. Les tests historiques vérifient RSS, ordre des cartes, schéma et attribution.
- Captures desktop/mobile avant/après et lecture visuelle : liens lisibles, 16 cartes présentes, CTA final distinct, aucun texte coupé constaté.
- La première tentative navigateur visait 4328, occupé par un autre serveur : Astro avait choisi 4329. Les résultats de cette tentative sont écartés ; la reprise ci-dessus vise le serveur de ce worktree.
- `npm run build`, Astro check et suite navigateur complète : verdict de la CI Repository gates obligatoire avant fusion. Les sorties locales ciblées ne s’y substituent pas.

Les fichiers du glossaire et ses rapports modifiés sont les dérivés de la commande de régénération ; le fond, les sources et la revue métier ne changent pas. En cas de collision d’intégration, prendre les dérivés de main puis régénérer, sans fusion manuelle.

## Revue et publication

Revue unique QA sur t_5cdc2a3a. Après PASS et CI verte : fusion, puis lecture de `/blog`, des trois rubriques, d’un article et du RSS en production, sans query string et avec `Cache-Control: no-cache`. Conserver la revue lors de la régénération des dérivés. Si une intégration dev est nécessaire après PASS, créer une carte de publication portant ce verdict.

## Suivis J+7 et J+28

J0 est la date réelle de mise en production, à consigner par le publieur ; les échéances se calculent depuis J0, pas depuis le brouillon. Ne pas afficher comme réalisée une mesure future.

- J+7 : vérifier la copy et les liens servis ; relever impressions, clics et CTR Search Console de `/blog` sur une fenêtre comparable si les données sont disponibles. Les interactions hub → rubrique demandent un événement déjà exploitable : si absent, écrire « non mesuré ». Séparer un clic de contact d’une demande réellement reçue.
- J+28 : refaire les mêmes relevés ; noter dates de changement du stock d’articles, de navigation ou de rubriques. Comparer les fenêtres et documenter les limites (volume faible, déploiements simultanés). Décider de conserver ou raccourcir les ancres selon l’usage documenté, sans attribution causale à cette copy seule.

Prochaine expérience utile : vérifier si les trois liens d’entrée sont réellement utilisés avant de modifier la structure ou d’ajouter une grille de rubriques.
