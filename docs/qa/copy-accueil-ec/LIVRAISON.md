# Accueil EC — passe ciblée de copy

Carte : t_1131eaa6. Base : origin/main au 8 octobre 2026, 4f42a88b.

## Décision

Conserver la page et préciser la délégation. L’audit H1 donne « Conserver » à la copy de `/` ; aucune refonte de structure, d’accroche ou de média n’est justifiée. Le rang 2/11 est une hypothèse d’impact par portée d’entrée, pas une mesure de conversion.

La passe porte uniquement sur `src/data/accueil/ec.ts` :

- Le hero ouvre sur « Confiez-nous une tâche répétitive » et garde la règle, les outils, la décision et le savoir du cabinet.
- La transition vers la méthode explique la recette dès sa première apparition.
- La promesse rappelle la prise en charge de l’observation à la maintenance ; une pièce illisible ou un cas hors règle arrête le traitement concerné.
- L’intégration distingue ce que le logiciel fait déjà des gestes à prendre en charge ; formats et accès sont vérifiés avant le devis.
- Les preuves existantes restent fictives. Le texte nomme les cas rejoués, la validation et les saisies préservées, sans inventer de résultats.
- L’appel final annonce le périmètre et le devis avant l’engagement. Le CTA reste « Confier une première tâche » vers `/contact`.

Aucun changement des composants, du chrome, des FAQ partagées, des garanties ou de la méthode partagée. Tous les H1/H2, liens, libellés, ancres, actifs vidéo et preuves sont conservés. La version D6 de navigation et la ligne CAC ne sont pas présentes dans cette base main : elles ne sont ni recréées ni supprimées par ce lot ; leur intégration ultérieure doit les conserver.

## Vérification effectuée

- `npm run regen:generated` : succès ; seul `/` change dans le registre lastmod. Les fichiers dérivés du glossaire sont régénérés sans modification de fond ni nouvelle revue métier.
- Positionnement Python : 8 tests verts.
- Média intégré Python : 8 tests verts ; vidéo R9 et neuf preuves inchangées.
- Playwright : 5 tests verts, dont les deux nouveaux contrôles d’accueil à 375 et 1440 px et les trois tests de positionnement existants.
- Captures avant/après pleine page aux deux largeurs ; comparaison automatisée de H1, sections, liens/libellés, ancres, médias et canonical : identiques, aucun débordement horizontal.
- Lecture visuelle des deux captures après : paragraphes et CTA complets, aucune troncature nouvelle. Les petits textes des preuves et la superposition historique du bouton audio relèvent de H3, pas de cette passe de copy.
- `git diff --check` : succès.
- La construction complète `npm run build`, Astro check et la suite navigateur complète sont exécutés par « Repository gates » en CI. Le résultat CI est à joindre au verdict QA.

## Base et suivi commercial

La base utile est qualitative : ancien hero et appel final archivés dans les captures et états avant. H1 (audit durable t_a80f53ec/AUDIT.md, ligne `/`) : copy à conserver, canonical/H1/JSON valides, aucun défaut contenu retenu. H1 n’avait pas d’accès Search Console ni de mesure de conversion : ces valeurs restent inconnues, et ne valent pas zéro.

Hypothèse à tester : annoncer une tâche confiée plutôt qu’une automatisation générale rend la prochaine action plus claire. Le lot n’ajoute aucun dispositif de suivi et n’attribue aucun gain à un clic.

Après fusion et vérification production, consigner la date effective de déploiement et les suivis :

- J+7 : vérifier le rendu servi, les CTA `/contact`, les ancres, la vidéo et les pages de navigation. Relever, si disponibles, impressions/clics/CTR de `/` dans Search Console et demandes réellement reçues décrivant une tâche, en agrégats. Signaler explicitement toute mesure indisponible.
- J+28 : refaire le relevé sur une fenêtre comparable, noter les autres changements intervenus et la saisonnalité ; ne pas attribuer une variation à cette copy seule. Conserver ou ajuster à partir de demandes observées, sans gain inventé.

## Handoff QA puis publication

Une seule revue QA sur cette carte. Après PASS, fusionner si la CI est verte, ou transmettre à dev la publication avec le verdict acquis ; pas de seconde revue de fond. Vérifier `https://memlia.fr/` en GET no-cache sans paramètres, texte du hero/appel final, structure, vidéo, canonical, CTA et ancres. Dater ensuite les suivis J+7/J+28 par rapport à la production réelle. Cette note ne prétend pas que le candidat est déjà publié.
