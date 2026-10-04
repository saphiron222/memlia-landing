# Livraison du lot W39

La Cicatrice conserve exactement le RAW signé `tests/fixtures/w39-signed-body.md` et les avis indépendants métier t_3a224b17 / QA éditoriale t_c9dd7b40. Le pilier conserve ses six claims et leurs verdicts historiques ; seul le lien vers la Cicatrice est ajouté. Les dates des recettes revues sont conservées suivant la constitution. Les dérivés SEO (registre, llms, lastmod) sont réconciliés sans mesure inventée ; les déplacements globaux du calendrier ne sont pas livrés.

## Isolation du test de créneau

Le build du lot réel a reproduit deux échecs de `blog-w39-slot.test.mjs` : sa fixture sans Git copiait la Cicatrice désormais `brouillon: false`, et interprétait ce candidat comme une publication préexistante. La fixture vierge retire uniquement ce slug de sa copie temporaire. Les tests de doublon recréent explicitement leur article et leur file publiés : leurs refus restent contrôlés. Aucun garde produit n'est modifié.

QA indépendante bornée de cette correction : PASS, trois tests de créneau exécutés, zéro échec. Rouge conservé dans le log de livraison ; build final : 533 tests scripts PASS, preuves Python PASS, audit ressources PASS. `astro check` : zéro erreur, zéro warning, dix hints préexistants.
