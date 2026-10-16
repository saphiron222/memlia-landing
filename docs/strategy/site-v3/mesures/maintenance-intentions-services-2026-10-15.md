# Entretien des intentions des services — 15/10/2026

Reprise Codex sur `site/agents-robots-integrations`. Aucun contenu de service, aucune recette scellée,
aucun garde ni réglage de date n'a été modifié pour ce relevé.

## Mesure réelle

Commande de production existante : `node scripts/seo/relever-titres-services.mjs`.
Instrument : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, requêtes HTTPS réelles vers
`suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=…`.

- Relevé : [titres-intent-2026-10-15.json](titres-intent-2026-10-15.json).
- Début du relevé : `2026-10-15T13:21:11.383Z` (15 h 21 à Paris).
- Captures : de `2026-10-15T13:21:11.546Z` à `2026-10-15T13:21:13.153Z`.
- Périmètre dérivé des recettes existantes : 12 services, 33 requêtes distinctes.
- 33 appels réussis ; 9 requêtes avec suggestions, 24 listes vides. Une liste vide est une réponse
  Google mesurée, pas un volume nul ni une preuve d'absence de demande.
- Chaque requête porte son URL et son heure de capture dans `provenance`. Aucun résultat absent,
  aucune suggestion inventée et aucun ancien relevé redaté.

## Audit avant et après

`npm run service:audit` avant le relevé : `pass: false`, 12 services, 25 erreurs.
24 erreurs concernaient l'absence de requête fraîche pour le H1 et le titre d'onglet des 12 services.
La 25e concernait le lien contextuel de Méthode vers la facture électronique.

Même audit après le relevé : `pass: false`, 12 services, **une erreur** :

```text
/methode : aucun lien contextuel avec l’ancre « éprouver la préparation des appels de facture électronique » vers /automatisation/facture-electronique dans src/pages/methode.astro.
```

Les 24 erreurs d'intention ont disparu. Le lien de Méthode relève du contrôleur du chantier ; il est
laissé intact ici. Le seuil de fraîcheur reste de huit jours.

## Vérifications ciblées

- `node --test tests/scripts/service-intent-fresh.test.mjs` : 1/1 PASS. Ce test historique joue cinq
  recettes sous l'horloge fixe du 29/09 ; il n'est pas présenté comme la vérification du relevé actuel.
- Vérification supplémentaire en lecture seule sur les données réelles du jour : les 33 requêtes des
  12 recettes figurent dans le nouveau relevé, chaque réponse est un tableau, chaque provenance a
  l'URL Google attendue et une capture du 15/10. `verifierTitreIntentMesure` accepte les 24 surfaces
  H1/onglet et indique pour chacune le fichier `titres-intent-2026-10-15.json`.
- `node --test tests/scripts/relever-titres-services.test.mjs` : 3/3 PASS. Les cas couvrent la
  découverte des recettes, le jour Europe/Paris, la conservation des mesures du jour et le refus
  d'écrire sur une panne.

Cette opération ne lance aucun build, aucune régénération du site ni aucun commit. Elle ne réserve
aucune nouvelle requête commerciale.

## Suite : lien entrant traité séparément

L'unique erreur de lien restante a ensuite été résolue par une migration historique déclarée,
sans réintroduire le paragraphe supprimé de Méthode et sans toucher à la recette scellée.
La [note de migration](../hub-robots/migration-lien-methode-facture-electronique-2026-10-15.md)
décrit le remplacement par le lien de tâche de la fiche Comptabilité. L'audit complet des 12
services est désormais PASS. Ce résultat ne change pas les observations avant/après du relevé
Google ci-dessus.
