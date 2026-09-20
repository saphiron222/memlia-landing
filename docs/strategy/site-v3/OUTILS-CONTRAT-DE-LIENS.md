# Contrat de liens des outils comptables gratuits

Ce contrat borne le maillage du hub `/outils-comptables-gratuits` et de chaque page dédiée. Le registre `src/data/outils.ts` porte les destinations ; le rendu ne les invente pas.

## Pages publiées

- Le hub ne rend que les entrées `statut: disponible`.
- Une page outil disponible reçoit un lien du hub et reste atteignable en deux clics au plus depuis celui-ci.
- Avant sa publication, une page outil disponible compte au moins trois liens internes entrants, dont le hub et une ressource qui traite exactement le même geste. Cette ressource peut être un article, une définition de glossaire ou une page service ; un contenu général n’est jamais ajouté pour faire le compte.
- Le témoin `temoin-calcul-local` est `noindex, follow`, absent du hub et du sitemap. Il est exempté du minimum de liens entrants et n’est atteint que par les tests.

## Liens sortants d’une page outil

Chaque page rend, dans cet ordre :

1. le hub ;
2. zéro ou une ressource exacte, uniquement si `articleExact` est renseigné ;
3. une page de service déclarée dans le registre ;
4. un seul appel à l’action vers `/contact`, sans paramètre ni balise réseau.

Un article renvoie vers un outil uniquement quand le geste et le résultat attendu correspondent exactement. Un article général ne reçoit pas de lien par défaut.

## Contrôles

`tests/browser/outils.spec.ts` vérifie le témoin, son absence du hub, l’ordre des sorties, l’unicité de l’appel à l’action et les trois liens entrants contextuels de chaque outil publié.
