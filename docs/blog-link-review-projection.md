# Projection de maillage sans nouvelle revue du fond

La forge accepte l'ajout explicite d'un lien interne sur des mots déjà relus. Elle ne normalise pas tous les liens et ne réécrit jamais `revues.json` : identités, verdicts, observations et date de lecture restent ceux de l'avis original.

Dans `editorial/recettes/<slug>/review-link-projection.json`, déclarer `version: 1`, `reviewSha256` (SHA-256 de `JSON.stringify` de l'avis original parsé) et `additions`, liste d'objets `{ text, url }`. Exemple bancaire : texte `rapprochement bancaire`, URL `/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter`. Ce nom dédié distingue la projection de revue des rapports SEO historiques `maillage.json`, qui restent inchangés et ne sont pas interprétés comme des projections.

Ajouter le lien Markdown sur ces mots et sa destination dans `recette.links.outgoing`. Les destinations doivent exister dans `src/content/blog`, y compris comme candidats de la même livraison. Seuls des libellés simples sans markup et des routes blog sans query/fragment sont admis ; un ajout unique par destination. Pas de modification ni de retrait de lien existant dans cette voie.

Le contrôle inverse uniquement ces ajouts, puis compare le corps aux octets relus et la recette à son fond relu (empreinte de substance dans l'avis ou baseline historique existante). Dans le HTML, il retire seulement l'enveloppe `<a href="…">` correspondante, avec un enfant texte exact et aucun autre attribut. Le rendu ainsi projeté doit retrouver son empreinte originale. Texte, citations, sources documentaires, figures, métadonnées de fond et tout autre changement de rendu restent contrôlés normalement. Un avis divergent, une cible absente, un ajout non déclaré, un titre de lien ou un libellé changé sont refusés.

`materialiser` archive la projection valide et le sujet original dans `editorial/articles/<slug>/preuves/review-link-projection.json`. `ecrireSceau` inclut automatiquement cette preuve dans son inventaire ; une projection refusée supprime toute preuve de projection antérieure. Le gate continue de vérifier les liens obligatoires et leurs cibles. Ce fichier est une preuve technique, pas un nouvel avis.

## Publication et construction

`blog-forge publier` appelle encore `production-check`, lequel rend Astro puis lance `build:site` complet. Ne pas lancer cette commande sur le Mac pour contourner la règle CI. La projection native est l'API existante `materialiser({ statut: 'publie', … })` suivie de `ecrireSceau(root, slug)` : elle écrit le candidat et son sceau, sans construire ni déployer. Elle ne constitue pas à elle seule une permission de publier : le rendu réel, les gates, la revue indépendante et la livraison PR/CI restent nécessaires. Utiliser les contrôles rendus en CI, puis livrer via `main` et le déploiement Pages automatique. Aucun garde du publisher n'est supprimé ici.

## Témoins

La fixture du pilier lit la déclaration dédiée lorsqu'elle existe et reconstruit une référence indépendante sans **tous les ajouts déclarés**, non pas sans tous les liens. Sans déclaration, elle ne retire rien. Son inverse propre au test n'appelle pas la projection de production : il valide la version, l'avis original, la liste non vide, les libellés simples, les routes blog et l'unicité des destinations, puis exige exactement une enveloppe Markdown et une entrée `links.outgoing` par ajout. Il travaille sur une copie de la recette ; tous les autres liens, textes, sources et figures restent ceux du vrai pilier. Aucun avis ni fichier éditorial n'est réécrit et aucun garde de production n'est modifié.

La matrice couvre zéro ajout (absence de déclaration), un ajout bancaire, un ajout fiscal et les deux ensemble. La suite rejoue aussi le vrai pilier avant backlink, déjà lié et dans son état courant, que les ajouts soient candidats ou déjà publiés. Les références obtenues restent confrontées à l'avis original, jamais à une empreinte recalculée sur le contenu courant. Cible absente, outgoing absent/dupliqué, déclaration invalide, texte/source/figure/avis divergent et enveloppe HTML enrichie restent refusés. Les empreintes HTML des petits témoins synthétiques sont réservées aux tests du rendu ; elles ne remplacent pas l'avis du vrai pilier.

Pour rejouer la fixture corrigée sur un autre worktree de livraison sans le modifier :

```sh
BLOG_LINK_FIXTURE_ROOT=/chemin/du/worktree-de-livraison node --test tests/scripts/blog-link-review-projection.test.mjs
```

Cette option lit seulement le corps, la recette, l'avis et la déclaration du pilier dans ce worktree. Les témoins candidats sont écrits dans un répertoire temporaire et détruits après le test ; le code testé reste celui du worktree courant.

`node --test tests/scripts/blog-link-review-projection.test.mjs tests/scripts/blog-forge.test.mjs tests/scripts/blog-review-projection.test.mjs tests/scripts/table-review-binding.test.mjs tests/scripts/responsive-proof-review-binding.test.mjs`

Le témoin du vrai pilier échouait sur les empreintes du corps et de la recette avant correction. Le rejeu fiscal de PR259 reproduisait deux FAIL parce que l'ancien inverse ne retirait que le lien bancaire ; le nouveau témoin multi-ajouts a également été observé rouge avant correction, puis vert avec les deux ajouts. La suite couvre la projection HTML bornée, les refus de texte/source/figure/cible/avis et la matérialisation puis l'inventaire du sceau. Le témoin historique `ia-comptabilite-confidentialite-donnees` vérifie que son rapport SEO n'invalide plus sa revue, sans modifier ni le rapport ni l'avis. Le candidat bancaire réel est contrôlé séparément avec son HTML relu, sans réémission d'avis. Aucun texte public n'est modifié par ce correctif.
