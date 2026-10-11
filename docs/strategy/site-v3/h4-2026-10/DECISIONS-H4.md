# H4 — décisions et mesure de base du 06/10/2026

État : matrice et choix de maillage produits ; aucune modification fusionnée par cette livraison. Les titres restent inchangés avant le créneau fixé après le 15/10. H4 ne peut pas être déclarée finie aujourd’hui.

## Mesure réelle

Crawl du site public : 58 pages, dont 55 indexables, toutes en HTTP 200 et canonical exact. Couverture : les URL des sitemaps plus les deux pages légales et le témoin de calcul local. Les états 404 et contact/merci, contact/erreur ne sont pas des pages d’acquisition. La matrice JSON conserve chaque ancre, sa destination, son fragment et sa zone ; le CSV conserve les pages sources distinctes et les destinations. Le tableau Markdown résume toutes les pages. Les nombres dans main comprennent les fils d’Ariane : ce ne sont pas des scores d’autorité éditoriale. Le chrome et le footer sont identifiés séparément. Deux cibles hors matrice sont des ressources, pas des pages manquantes : protection des emails Cloudflare et vidéo MP4.

Production : 16 articles, 9 guides, 5 services, 13 outils indexables et 53 termes dans le DefinedTermSet du glossaire. llms.txt annonce encore 43 définitions : écart confirmé. Ces comptes décrivent la production au relevé, pas un plafond et pas une constante à recopier dans un test.

Trois articles ont seulement deux pages entrantes dans main ; quatre satellites sont absents du pilier ; huit articles n’ont aucune page source hors blog dans main ; les treize cartes du hub outils portent la même ancre « Utiliser sans compte → ». Zéro orpheline indexable dans main. Les pages légales et le témoin noindex ne demandent pas un quota de liens éditoriaux.

Search Console W41 (brut conservé, pas nouvelle interrogation) : 27/09–03/10, 177 impressions et 4 clics ; 06/09–03/10, 467 impressions et 26 clics, CTR déclaré 5,57 %, totaux 28 jours complets. Ne pas confondre le tableau parArticle, qui inclut outils et ressources, avec le seul blog. Aucun effet du maillage ni gain de clics ne peut être attribué à cette baseline.

## Maillage décidé

Ajouter des liens au geste concerné dans les sections existantes, avec une phrase de transition courte ; pas de nouvelle section commerciale et pas de liens en footer pour combler une absence contextuelle.

1. Pilier /blog/automatiser-un-cabinet-comptable-la-carte-des-taches → /blog/cabinet-comptable-surcharge-de-travail-ou-passe-le-temps : « repérer où passe le temps du cabinet », à l’endroit du choix de la première tâche. Ce lien donne un troisième entrant au satellite surcharge.
2. Même pilier → /blog/intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain : « distinguer préparation IA et compétences humaines », à la frontière préparation/décision. Troisième entrant du satellite métier.
3. Même pilier → /blog/utiliser-chatgpt-cabinet-comptable : « choisir un premier usage de ChatGPT au cabinet », dans la famille IA générative.
4. Même pilier → /blog/verifier-reponse-ia-comptabilite : « vérifier une réponse IA avant de décider », dans la validation de la proposition.
5. /methode → /blog/tests-verts-et-regle-des-trois-passes : « recetter le parcours en trois passes », dans l’étape éprouver/recette. Troisième entrant de cet article, et route hors blog utile.
6. Dans le pilier, le lien « rapprochement bancaire » vers /glossaire devient « définition du rapprochement bancaire », avec le fragment du terme existant vérifié ; l’ancre du service garde son intention d’automatisation. Ne pas inventer de fragment.

Les quatre premiers liens et le cinquième résolvent les sept tâches inserer-lien C3 ; le sixième résout varier-ancre. Conserver les IDs d’origine de maintenance-integrite et ne les passer à fait qu’après lecture de la production.

### Routes hors blog : couvrir les huit articles actuellement absents

- /automatisation-cabinet-comptable → surcharge : « repérer où passe le temps du cabinet », au choix de la tâche.
- /automatisation-cabinet-comptable → métier IA : « ce que l’IA prépare et ce qui reste humain », à la frontière de la prestation.
- /integrations → sans changer de logiciel : « écrire le passage entre les outils », dans l’explication des environnements.
- /garanties → confidentialité : « préparer les données avant de les confier à une IA », au cadrage des entrées. Aucun fait juridique nouveau.
- /methode → logiciel IA : « comparer le parcours complet d’un outil IA », avant l’épreuve d’un outil.
- /methode → tests verts : lien de recette défini plus haut, une seule insertion.
- /outils-comptables-gratuits/generateur-prompt-expert-comptable → premier usage ChatGPT : « choisir un premier usage utile de ChatGPT », au cadrage de l’usage avant la consigne.
- /outils-comptables-gratuits/verificateur-prompt-ia → vérifier réponse : « vérifier ensuite la réponse produite », après le contrôle de la consigne. Clarifier naturellement la différence prompt/réponse, sans laisser croire que l’outil vérifie une réponse.

Ancres du hub outils : nommer le résultat de chaque destination (calculer une marge, calculer une échéance, préparer un prompt…), depuis les données canoniques des outils. La disponibilité sans compte reste dans l’introduction du hub. Pas seulement un aria-label : le texte visible et l’ancre du lien doivent être parlants. Contrôler les cartes mobiles si le texte s’allonge.

## llms.txt

Ne pas créer une nouvelle copie statique de compteurs. Réutiliser les inventaires canoniques de D3 à son intégration pour les termes publiés, guides, articles, outils et familles réellement ouvertes ; vérifier la sortie contre le build puis contre la production. Ajouter les hubs outils et guides et les pages de services publiées, sans lister de route candidate.

La section « Commissaires aux comptes » reprend la formulation validée pour /commissaires-aux-comptes à la livraison E4, avec son URL réellement publiée. Pas de lien vers une route absente, pas de garantie de conformité aux NEP, pas d’« audit automatisé ». Ne pas inventer cette copy sur H4. B2 conserve le retrait des anciennes exclusions de l’audit et la mise à jour du pilier ; E4 conserve la première description CAC. H4 raccorde ces résultats et vérifie le document complet. llms.txt n’est ni une demande d’indexation Google ni une preuve de citations IA.

## Titres : créneau après le 15/10

Conserver la proposition locale 2026-10-06-recaler-titre-prompt-chatgpt-expert-comptable-1. « chatgpt expert comptable » : position 12,2, 5 impressions/7 jours, zéro clic ; « calcul echeance » : 8,6, 5 impressions, zéro clic. Ce sont des candidats à examiner, pas des décisions de réécriture. Lire également les pages dont le CTR est faible mais les impressions significatives dans la mesure fraîche.

Après le 15/10, relancer C2 ou utiliser son dernier brut complet avec dates précises ; comparer page/requête, marque/hors marque et position, puis choisir quelques titres et descriptions réellement liés à l’intention. Pas de taux présenté sans son dénominateur, ni de gain déduit de cinq impressions. La description donne une information utile différente du titre. Conserver URL, canonical et intention ; utiliser la forge pour un article. Revue unique du lot puis CI verte, fusion et constat de production.

## Comparaison J+28

À chaque fusion noter date réelle, URL, ancien et nouveau titre/description, liens ajoutés, baseline page/requête sur 28 jours et exclusions de mesure. Déclencher la comparaison 28 jours après la date de fusion, pas 28 jours après ce crawl. Comparer deux fenêtres complètes, en tenant compte du délai GSC, de la position et du nombre d’impressions. Le maillage et la réécriture peuvent se confondre : ne pas promettre un effet causal isolé. Si le volume reste trop faible, conserver le changement utile et prolonger l’observation plutôt que proclamer un succès.

## Hotspots et intégration

- editorial/articles/automatiser-un-cabinet-comptable-la-carte-des-taches : citations traitées par t_712a0bf3, ouverture CAC par B2 t_5ca575f3 ; intégrer les résultats sans écraser les sources ni modifier une revue existante sans raison de fond.
- public/llms.txt : D3 t_c712fbfe fournit les compteurs, B2 retire l’exclusion, E4 t_37eaef0a fournit la description CAC. H4 se raccorde, sans deuxième chaîne concurrente.
- Les pages choisies pour les entrants hors blog peuvent recevoir une passe de copy H2 : conserver ses améliorations lors de la fusion.

Fini final H4 : modifications intégrées, une revue adaptée par lot, CI verte, liens et llms relus en production, décision titres documentée après le 15/10, baseline conservée et comparaison J+28 planifiée depuis la fusion réelle.
