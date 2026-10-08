# Garde de propriété des requêtes

`npm run test:query-ownership` est la première étape de `npm run build` (donc de la CI et de Cloudflare). Le contrôle est hors réseau, sans API ni dépense.

Il croise toutes les déclarations de `config/page-intent-contract.json`, du registre des requêtes, du backlog v3 et des collections Markdown blog/services (récursives, candidats inclus). Une URL peut apparaître plusieurs fois si sa requête est identique. Une divergence entre sources échoue. Les collections historiques sans `primaryQuery` doivent avoir leur requête dans le contrat de page ; une collection absente ou un frontmatter invalide échoue.

Les URL absolues memlia.fr et les chemins locaux sont ramenés au même chemin, sans barre finale. Les URL externes, paramètres et fragments sont refusés. La requête exacte est normalisée en minuscules, espaces et apostrophes typographiques. Deux URL distinctes avec la même requête échouent toujours : aucune exception n'autorise un doublon.

La proximité est une heuristique locale reproductible : accents retirés, mots de liaison français retirés, pluriel final `s` retiré pour les mots de plus de quatre lettres, puis Jaccard des ensembles de mots >= 0,8. Les noms de produits, années et modificateurs d'intention restent présents. Ce n'est ni une analyse sémantique exhaustive ni une preuve de chevauchement des SERP ; une mesure Google reste un travail éditorial séparé.

Une paire proche doit figurer dans `config/query-ownership-exceptions.json` avec exactement deux URL, les deux requêtes et une justification de 30 caractères au moins expliquant les intentions distinctes. Changer les requêtes invalide l'exception. La longueur est un garde-fou mécanique, pas une validation éditoriale : la revue apprécie la raison.

## Alignements initiaux

- Le contrat du pilier commercial cible maintenant « automatisation tâches répétitives cabinet comptable », plutôt que la requête générique déjà portée par l'article cartographique. Aucun contenu public ou sceau du blog n'est modifié ; aucun volume mesuré n'est revendiqué.
- Le backlog de la saisie est aligné sur la requête publiée (sans OCR). L'ancien slug planifié de la Cicatrice W39 devient son slug réellement publié : pas de nouvelle page ni de redirection nécessaire.
- Une exception distingue le diagnostic de maturité d'une tâche des limites du jugement professionnel, conformément aux familles et intentions déjà inscrites au backlog.

Les tests fabriquent notamment un doublon dans plusieurs sources et exécutent le CLI : sortie 1 exigée. Ils couvrent aussi divergence, proximité sans raison, exception périmée, noms de logiciels distincts et données absentes.
