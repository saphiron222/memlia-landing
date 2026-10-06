# Remise au développement — revue analytique CAC

## Résultat attendu

Préparation récurrente des comparaisons et constats dans les outils existants, avec règle, recette et maintenance. Le service ne vise ni le téléchargement d'un classeur ni l'opinion du CAC. Requête commerciale `automatisation revue analytique`, zéro suggestion effectivement mesuré, volume inconnu. Exception d'audience motivée dans recette.json ; H1 et titre désignent le CAC.

## Recette et revue

Les neuf sections, sources officielles et jeux fictifs vivent dans ce dossier. Rejouer `node commercial/recettes/revue-analytique-cac/preuves/rejouer.mjs` : neuf cas, dont base nulle, compte nouveau, montant absent, reclassement non validé/validé, changement de signe et préservation d'une saisie. Le démonstrateur ne vaut pas livraison produit ni validation professionnelle d'une mission réelle. Le CAC choisit les paramètres et établit ses conclusions.

Le profil metier est le relecteur indépendant. Son verdict est revues.json, sa motivation revue-metier.md. Le seul défaut initial était la coercition null→zéro d'un montant comparatif absent : garde avant calcul et deux tests ajoutés, puis re-revue limitée à ce défaut.

## Fichiers générés et ordre de livraison

`service:preparer` matérialise déjà une page. Sans SERVICE_DESIGN, cette page casse volontairement le build sur « Direction artistique absente » : ne pas fusionner une route sans son cadre. Le lot marketing sur main porte donc la recette et ses preuves ; le paquet remis sur la carte porte aussi le candidat généré et son sceau. Le développement peut régénérer ce candidat avec `npm run service:sceller -- revue-analytique-cac` après avoir ajouté ses données de présentation. Ce rejeu de scellement ne crée pas une seconde revue du fond.

Ne pas modifier la charte v5 dans ce lot : PR107 a déjà sa revue métier ; sa fusion appartient à B1. La charte v5 a été lue comme référence de rédaction, pas présentée comme déjà intégrée sur main.

## À appliquer lors de la publication (carte t_fa16682f)

- Audience `Cabinets de commissariat aux comptes` dans Service ; WebPage et fil d'Ariane ; auteur public Kevin Kitanga sans titre professionnel.
- Cadre HTML figé propre au service, cas de variation et décision, jamais image d'une autre page.
- Les trois liens entrants projetés sont dans recette.json. Ces articles sont futurs dans l'architecture : vérifier leur disponibilité, et si nécessaire substituer trois sources indexables et pertinentes réellement publiées, avec la même ancre « Automatiser la revue analytique ». Ni footer ni nav ne comptent parmi les trois.
- La fiche outil est un livrable Memlia décrivant fonctionnement, données, paramètres, version, limites et essais ; pas un document imposé par NEP315 §14. L'appréciation/documentation du CAC renvoie aux §§46/48 d).
- SERVICE_DESIGN, SERVICE_EEAT, contrat d'intention, registre de publication, sources rendues compactes et CTA distinct visuellement.
- Tests, build et revue QA du code à cette phase ; publication servie vérifiée sans query string, sitemap/footer, suivis J+7 et J+28.

Aucune publication de cette route ni compatibilité éditeur n'est revendiquée dans la phase marketing.
