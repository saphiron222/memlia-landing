# Prévisualisation non indexable du Hub Ressources

Carte `t_9703f4ae`. 16 septembre 2026. Candidat scellé `ea9c59e`, recette de contenu `1088d28`.

**PASS.** La prévisualisation est en ligne, non indexable, et la production n'a pas bougé.

## Adresses

| | |
|---|---|
| URL immuable | `https://3deabfee.memlia.pages.dev` |
| Alias de branche | `https://preview-ressources.memlia.pages.dev` |
| Projet Cloudflare | `memlia` — jamais `memlia-landing`, cette erreur a fait échouer des déploiements pendant des jours |
| Branche | `preview-ressources` |
| Dossier déployé | `.qa/preview-dist`, la copie protégée, jamais `dist` |
| Retrait | `wrangler pages deployment delete 3deabfee --project-name memlia --force` |

## Protection contre l'indexation

Les neuf routes répondent 200 et portent **à la fois** l'en-tête HTTP et la balise de page :

| Route | En-tête | Balise |
|---|---|---|
| `/`, `/ressources`, `/glossaire` | noindex, nofollow | noindex, nofollow |
| `/blog` et les trois articles | noindex, nofollow | noindex, nofollow |
| les deux pages légales | noindex, nofollow | noindex, nofollow |

L'alias de branche porte la même protection. **La double protection compte** : un en-tête seul disparaîtrait si la copie était servie ailleurs, une balise seule ne protégerait pas les ressources non HTML.

## Identité du candidat servi

Le HTML distant est comparé à la copie locale déployée, la balise de mesure d'audience injectée par la plateforme mise à part. **Cinq routes sur cinq sont identiques octet pour octet**, dont les deux nouvelles pages. L'écart de 214 octets sur chaque page est exactement cette balise.

## Écran

Les deux nouvelles pages ont été ouvertes sur la prévisualisation distante, à 375 et 1440 pixels : réponse 200, un seul `h1`, aucun débordement. Captures pleine page en 1440 et premier écran en 375 conservées à côté de ce rapport.

## La production n'a pas bougé

`memlia.fr/ressources` et `memlia.fr/glossaire` répondent toujours 404, lus depuis l'origine avec un paramètre anti-cache. Rien n'a été publié par cette carte.

## Avertissement pour la release

Le défaut de construction automatique de la plateforme reste ouvert. Une poussée de la branche principale publie un dossier vide et met le site entier hors service, comme observé deux fois ce matin. **La release devra pousser, attendre la fin de la construction automatique, puis déployer explicitement le dossier vérifié, et enfin relire l'origine avec un paramètre anti-cache.** Déployer avant la fin de la construction ne sert à rien : elle écrase.
