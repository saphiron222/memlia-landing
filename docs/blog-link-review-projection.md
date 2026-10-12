# Projection de maillage sans nouvelle revue du fond

La forge accepte l'ajout explicite d'un lien interne sur des mots déjà relus. Elle ne normalise pas tous les liens et ne réécrit jamais `revues.json` : identités, verdicts, observations et date de lecture restent ceux de l'avis original.

Dans `editorial/recettes/<slug>/review-link-projection.json`, déclarer `version: 1`, `reviewSha256` (SHA-256 de `JSON.stringify` de l'avis original parsé) et `additions`, liste d'objets `{ text, url }`. Exemple bancaire : texte `rapprochement bancaire`, URL `/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter`. Ce nom dédié distingue la projection de revue des rapports SEO historiques `maillage.json`, qui restent inchangés et ne sont pas interprétés comme des projections.

Ajouter le lien Markdown sur ces mots et sa destination dans `recette.links.outgoing`. Les destinations doivent exister dans `src/content/blog`, y compris comme candidats de la même livraison. Seuls des libellés simples sans markup et des routes blog sans query/fragment sont admis ; un ajout unique par destination. Pas de modification ni de retrait de lien existant dans cette voie.

Le contrôle inverse uniquement ces ajouts, puis compare le corps aux octets relus et la recette à son fond relu (empreinte de substance dans l'avis ou baseline historique existante). Dans le HTML, il retire seulement l'enveloppe `<a href="…">` correspondante, avec un enfant texte exact et aucun autre attribut. Le rendu ainsi projeté doit retrouver son empreinte originale. Texte, citations, sources documentaires, figures, métadonnées de fond et tout autre changement de rendu restent contrôlés normalement. Un avis divergent, une cible absente, un ajout non déclaré, un titre de lien ou un libellé changé sont refusés.

`materialiser` archive la projection valide et le sujet original dans `editorial/articles/<slug>/preuves/review-link-projection.json`. `ecrireSceau` inclut automatiquement cette preuve dans son inventaire ; une projection refusée supprime toute preuve de projection antérieure. Le gate continue de vérifier les liens obligatoires et leurs cibles. Ce fichier est une preuve technique, pas un nouvel avis.

## Publication et construction

`blog-forge publier` appelle encore `production-check`, lequel rend Astro puis lance `build:site` complet. Ne pas lancer cette commande sur le Mac pour contourner la règle CI. La projection native est l'API existante `materialiser({ statut: 'publie', … })` suivie de `ecrireSceau(root, slug)` : elle écrit le candidat et son sceau, sans construire ni déployer. Elle ne constitue pas à elle seule une permission de publier : le rendu réel, les gates, la revue indépendante et la livraison PR/CI restent nécessaires. Utiliser les contrôles rendus en CI, puis livrer via `main` et le déploiement Pages automatique. Aucun garde du publisher n'est supprimé ici.

## Témoins

La fixture du pilier reconstruit sa référence sans l'ajout bancaire : elle retire uniquement l'enveloppe Markdown exacte du lien déclaré et son entrée `links.outgoing`, sur une copie de la recette. Tous les autres liens, textes, sources et figures restent lus dans le vrai pilier, avec son avis original. La même suite rejoue les états sans backlink et déjà lié ; elle ajoute ensuite le lien une seule fois et vérifie aussi le refus d'un outgoing absent ou dupliqué. La publication effective du backlink ne doit donc ni casser le témoin positif ni rendre son témoin négatif inopérant. Aucun fichier éditorial n'est écrit par cette fixture.

`node --test tests/scripts/blog-link-review-projection.test.mjs tests/scripts/blog-forge.test.mjs tests/scripts/blog-review-projection.test.mjs tests/scripts/table-review-binding.test.mjs tests/scripts/responsive-proof-review-binding.test.mjs`

Le témoin du vrai pilier échouait sur les empreintes du corps et de la recette avant correction. La suite couvre la projection HTML bornée, les refus de texte/source/figure/cible/avis et la matérialisation puis l'inventaire du sceau. Le témoin historique `ia-comptabilite-confidentialite-donnees` vérifie que son rapport SEO n'invalide plus sa revue, sans modifier ni le rapport ni l'avis. Le candidat bancaire réel est contrôlé séparément avec son HTML relu, sans réémission d'avis. Aucun texte public n'est modifié par ce correctif.
