# Handoff revue unique puis publication

Article : ia-comptabilite-confidentialite-donnees.
Worktree isolé : /Users/kevinkitanga/.hermes/kanban/workspaces/t_afe116b0/site.
Branche : blog/confidentialite-t_afe116b0, base origin/main 503de2ed au départ. Pas de commit, push ni PR à ce stade.

## Revue métier indépendante unique
Lire recette/corps, paquet-revue.json, copies de sources dans editorial/articles/<slug>/preuves/sources, master.png et visual-review.json, HTML .qa/render-<slug>/blog/<slug>.html, audit et couverture-candidat.json/COUVERTURE-CANDIDAT.md. couverture-skills.json reste le checkpoint de lecture antérieur. Registre actuel 63 compétences, 65 fichiers lus ; final de phase 29 exécutées, 2 partielles (jugement), 28 N/A motivés, 3 indisponibles, 1 contrôle publication à exécuter. Les artefacts d'origine et leurs limites sont explicités.

Écrire revues.json selon RUNBOOK-QUOTIDIEN.md §7 et le schéma de l'autre recette verifier-reponse-ia-comptabilite. Ses grilles ne sont PAS des verdicts transférables : juger effectivement ce candidat. Reviewer réel metier:<carte>, auteur distinct. Toutes les grilles nécessaires (editorial, business claims, image, sources, qualite) sont les volets d'une seule revue. Calculer le subject avec commande empreinte après lecture du HTML actuel. Ne modifier ni article ni programme pour rendre un verdict favorable. Verdict PASS ou FAIL et défauts concrets.

Claims : trois citations CNIL sensibles, contexte pseudonymisé conservé. Pas de fournisseur ni offre testée ; ENV-FICTIF est explicitement protocole local, pas outil approuvé. Rejeu ne détecte pas le contenu d'un texte : qualifications préalables déclarées puis routage déterministe, transmission false dans quatre cas. Juger les implications RGPD/confidentialité et le risque de compréhension de 'préparation prête'. Un extrait officiel exact n'excuse pas une inférence excessive autour.

## Preuves locales réellement obtenues
- preparer : zéro erreur, deux sources ouvertes par forge.
- Quatre formulations autocomplétées : résultats vides avec ok, pas volume nul.
- Rejeu local : quatre états assertés et test qualification absente.
- Palette deuxième image : forge sans erreur ; première rejetée. Deux générations à 2,75 crédits.
- renderer --check : 30 cadres conformes, historiques sans modification.
- Astro rendu preview réussit ; npm run check zéro erreur (hints préexistants et un import de candidat retiré).
- test:blog-contract : 20 tests passent, contrat de 15 articles vert après ajout d'exemption motivée de rubrique et description intent-first.
- verifier-candidat : canonical, metadata, schema auteur, liens, figures et navigateurs 390/1280 sans débordement, images réellement chargées ; captures dans recette.
- build-cluster-plan.py --check et slot 05/10 verts, git diff --check vert.

Aucun build public complet après scellement, CI distante, ni contrôle production revendiqué. Preview porte encore le témoin privé normal. Vue pleine page mobile respecte la méthode image unique ; figures contextuelles reprennent les données lisibles dans les tableaux du corps. Une première capture prise après scroll plaçait le header sticky au milieu (artefact de capture), régénérée depuis haut de page.

## Reprise par marketing après revue
Conserver ce dossier et la branche. Lire la carte revue, sceller, publier localement, lastmod/registre/calendrier et sceau Ressources selon runbook ; build complet et CI. Publier par PR puis fusion constitutionnelle après revue PASS unique et CI verte (ne pas ajouter deuxième revue QA juste pour les grilles). Contrôler deployment propre et memlia.fr, canonical, auteur, index blog/RSS/sitemap/llms et neuf médias, navigateur. Finaliser la ligne publication de matrice et les états partiels depuis la revue, puis transmettre URL et preuves.

Les contrôles locaux blog-only anciens peuvent refuser les fichiers globaux générés ; ne pas élargir de garde. Constitution gouverne le circuit autorisé de fusion après revue unique + CI. Entrants /blog seul assumé ; pas de republication inutile d'un frère pour un quota. Liens, date réelle ou nouvelle empreinte ne déclenchent pas de nouvelle revue du fond. Sources fraîches 0–7 jours réutilisables selon forge. Candidat non scellé : ne pas pousser comme si build public passait.

Hotspots : docs/design/blog-article-proofs/{index.html,content-contract.json}, docs/qa/blog-article-proofs/manifest.json et dérivés du calendrier. Reprendre main frais avant livraison en préservant les frères. Réconciliation documentée avant commit ; aucune édition hors périmètre.
