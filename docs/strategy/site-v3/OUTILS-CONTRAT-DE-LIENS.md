# Contrat de liens des outils comptables gratuits

Ce contrat borne le maillage du hub `/outils-comptables-gratuits` et de chaque page dédiée. Le registre `src/data/outils.ts` porte les destinations ; le rendu ne les invente pas.

## Pages publiées

- Le hub ne rend que les entrées `statut: disponible`.
- Une page outil disponible reçoit un lien du hub et reste atteignable en deux clics au plus depuis celui-ci.
- Avant sa publication, une page outil disponible compte au moins trois liens internes entrants, dont le hub et un article qui traite exactement le même geste.
- Le témoin `temoin-calcul-local` est `noindex, follow`, absent du hub et du sitemap. Il est exempté du minimum de liens entrants et n’est atteint que par les tests.

## Liens sortants d’une page outil

Chaque page rend, dans cet ordre :

1. le hub ;
2. zéro ou un article, uniquement si `articleExact` est renseigné ;
3. une page de service, `/automatisation-cabinet-comptable` ou `/methode` ;
4. un seul appel à l’action vers `/contact`, sans paramètre ni balise réseau.

Un article renvoie vers un outil uniquement quand le geste et le résultat attendu correspondent exactement. Un article général ne reçoit pas de lien par défaut.

## Contrôles

`tests/browser/outils.spec.ts` vérifie le témoin, son absence du hub, l’ordre de ses liens et l’unicité de son appel à l’action. Les outils réels ajoutés ensuite doivent être couverts par un contrôle de leurs liens entrants avant publication.
