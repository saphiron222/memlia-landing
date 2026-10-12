# Livraison platform : suivi des échéances fiscales

Résultat : corps et recette natifs exploitables par la forge, trois citations officielles exactes, classement fictif exécuté, figures canoniques et couverture OpenAI réelle. Avis indépendant acquis : PASS métier, éditorial et visuel sur la fabrication. Score qualité83/100, conseil seulement. Aucun P0 et aucune réserve de fond à lever. Les observations de palette et de libellé sont cosmétiques.

Route définitive : /blog/suivre-les-echeances-fiscales-d-un-portefeuille

## Où reprendre

Branche locale : site/rattrapage-w41-suivre-les-echeances-fiscales-d-un-portefeuille.
Worktree : /Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_e488b89b.
Base de fabrication : main06548228, récupéré avant la rédaction. Aucun commit ni push dans cette phase ; tous les fichiers créés sont dans editorial/recettes/suivre-les-echeances-fiscales-d-un-portefeuille/. Aucun fichier global édité. Le paquet ZIP attaché à la carte de fabrication est un repli durable si le worktree n’est plus disponible. Extraire depuis la racine d’un worktree main frais : l’archive conserve les chemins editorial/recettes/.

## Le paquet

- corps.md et recette.json : candidat de fond.
- BRIEF.md : besoin, recherche concurrentielle, gabarit, maillage et limites de mesure.
- image-source.png / image-source.json : nouveau diorama OpenAI, identifiant et prompt exacts, modèle et coût non communiqués.
- preuves/sources : réponses officielles HTTP200 et extraits exacts. preuves/claims-techniques.json contient les trois IDs de claims relus.
- preuves/rejouer.py et rejeu.json : douze lignes, onze clés uniques, un doublon ; totaux7/2/2/1. Huit tests complémentaires dans tester_rejeu.py et tests-rejeu.log. Les booléens sont des faits fictifs fournis ; aucun accès fiscal ni traitement d’un vrai portefeuille.
- preuves/figures.html : deux cadres utilisant les styles canoniques existants. preuves/figures-contract.json, figures/*.webp et *.png : textes et captures réels. Ne pas refaire les valeurs depuis une intuition.
- preuves/image : huit dérivés, OG regardé et palette mesurée en observation.
- preuves/apercu.html et apercu-1440.png / apercu-390.png : aperçu local Satteri/Chromium réel, NOINDEX, pas gabarit de publication.
- preuves/verification.json : quinze contrôles, six liens/ancres HTTP200, inventaire local.
- preuves/matrice-skills.json : les31sous-skills Blog et24SEO du registre, plus stratégie Memlia. États par phase honnêtes, N/A motivés ; contrôles publics explicitement laissés à la livraison, pas de RUN/score synthétique.
- revues.json et preuves/revue-independante.md : avis acquis par un agent distinct. Corps, citations, rejeu, master, OG et figures examinés ; revue de fabrication, pas sceau public.

## Réutiliser la revue, sans boucle administrative

Conserver cet avis métier et visuel. Les dates techniques, chemins, références et champs de preuve ne sont pas un nouveau fond. Si la forge exige le format de liaison natif, projeter l’avis réellement acquis sur le corps et les figures inchangés ; ne pas inventer un nouveau reviewer, un nouveau score ou une inspection inexistante. Le relecteur a délibérément laissé les métadonnées du gabarit final à la phase de livraison. Seul un vrai changement de portée du fond revient à cette même voie métier.

Les huit preuvesSkills de la recette ont été renseignées après l’avis : elles décrivent les sorties effectivement obtenues et ne changent aucun élément public du candidat. Le contrôle de cohérence a été rejoué ensuite avec le même corps.

## Intégration de la forge et livraison

1. Repartir de main frais et du paquet acquis. Réserver le créneau au jour réel de livraison, jamais au7octobre. Le préflight natif a retourné « créneau planned non actionnable » le12/10 ; rien n’a été contourné. Le mandat de rattrapage existe déjà, pas besoin d’un nouveau go Kevin.
2. Intégrer les deux sections de figures.html dans docs/design/blog-article-proofs/index.html et les deux entrées du contrat, avec les données identiques. Les styles canoniques n’ont pas besoin de modification. Passer par le renderer normal et comparer aux visuels relus. Les fichiers globaux des figures sont un point de collision possible avec les autres articles : séparer/coordonner cette intégration avant de sceller un lot.
3. Préparer via la forge normale, importer les sources avec leurs preuves exactes et gérer leur fraîcheur réelle. Le script fabriquer.mjs est une trace de fabrication, pas une alternative à preparer ; ne pas le relancer pour redater automatiquement le paquet ou remplacer les copies relues.
4. Matérialiser le gabarit public, intégrer le maillage entrant /blog et le paragraphe fiscal du pilier par la voie existante. Conserver les pages déjà publiques, leurs routes, canonicals et sitemap.
5. Vérifier le HTML réellement destiné à publication : titre/H1, auteur Kevin Kitanga, canonical, JSON-LD et dates, OG/Twitter, figures uniques et alts, indexabilité, robots et sitemap. Le NOINDEX de l’aperçu privé n’appartient pas à la page publique.
6. Livraison PR, CI verte, fusion sous les gardes existants et vérification de la surface réellement servie. Les suites complètes sont en CI, les contrôles locaux restent ciblés. Donner URL publique, déploiement, statut HTTP, rendu servi et présence sitemap dans la complétion.

Si un contrôle refuse une formulation légitime, la reformuler sans changer son sens et corriger le contrôle sur une carte distincte, pas parente de la publication. La palette quasi dépourvue de vert clair ne devient pas un nouvel achat ni un nouveau sujet. Ne pas déclarer une fonction d’intégration fiscale comme livrée : ce candidat explique une convention et son classement fictif.

## Rejouer les preuves ciblées

Depuis la racine du dépôt :

    python3 editorial/recettes/suivre-les-echeances-fiscales-d-un-portefeuille/preuves/rejouer.py
    python3 editorial/recettes/suivre-les-echeances-fiscales-d-un-portefeuille/preuves/tester_rejeu.py
    node editorial/recettes/suivre-les-echeances-fiscales-d-un-portefeuille/preuves/verifier.mjs
    node editorial/recettes/suivre-les-echeances-fiscales-d-un-portefeuille/preuves/rendre.mjs

Les figures sont un HTML autonome seulement pour la fabrication ; leur adoption publique utilise le renderer canonique. Ne pas faire croire que cet aperçu est la page en production.
