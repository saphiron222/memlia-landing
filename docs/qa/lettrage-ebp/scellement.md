# Lettrage EBP — scellement du 7 octobre 2026

La revue métier indépendante t_03a70eff est PASS, sans correction requise. `guide:sceller -- lettrage-ebp` réussit ; `guide:audit` réussit sur les deux états. Aucun contenu de recette ni visuel n’a été modifié depuis la revue. Le guide n’est pas publié.

Le contrat d’intention et le registre des requêtes incluent `lettrage ebp`, neuf suggestions Google mesurées le 6 octobre ; publication laissée à null. `regen:generated` réussit, y compris réaffirmation de la revue du glossaire et audit ressources. Le test de recette réussit (1/1), query ownership réussit (7/7, aucune collision).

## Défauts amont reproduits après scellement

- `npm run build` : échec dans la fixture blog d’intention dépendante du jour réel, réparation PR152 / t_f0ec22d6 déjà en cours. Aucun changement parallèle.
- `test:guide-forge` : 14/17 PASS, échecs 5, 8, 14 ; `test:guide-render` échoue à son audit ligne 33. Les fixtures copient les collections publiques sans les recettes/états, et le rejeu historique attend une collection vide. Réparation t_de488db9, revue t_9594de52 déjà organisées pour cette cause.
- `test:page-contract` : seul échec clause images du guide. `manifestedMedia` découvre docs/qa et editorial/articles, pas guides/etats ; l’image est pourtant réellement scellée. Réparation indépendante t_aef7fa3c, sans exception d’URL ni modification du fond.
- `test:proof` : 148/150 PASS après retrait des briefs et rendu des textes publics. Deux assertions de corpus figé dans test_build.py (pages et sitemap) ignorent les nouveaux guides générés ; transmises à t_aef7fa3c.

## Reprise

Intégrer les réparations livrées depuis main, préserver le candidat métier inchangé. En cas de conflits de données dérivées, reprendre main puis `regen:generated`. Rejouer build complet, forge/rendu et CI ; fusionner après vert avec la revue métier conservée. Constater ensuite `guide:publier`, vérifier le sitemap et les liens publics sans query string, Cache-Control no-cache. Créer les suivis J+7/J+28 depuis la publication réelle. Aucun reçu de publication, aucune fusion, aucune date de suivi anticipée.
