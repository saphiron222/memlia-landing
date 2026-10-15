# Outils gratuits simplifiés — recette du 15 octobre 2026

Prévisualisation : [hub des outils](https://preview-outils-simples.memlia.pages.dev/outils-comptables-gratuits) · [simulateur de ROI](https://preview-outils-simples.memlia.pages.dev/outils-comptables-gratuits/calculateur-roi-automatisation).

Branche `site/agents-robots-integrations`, [PR 270](https://github.com/saphiron222/memlia-landing/pull/270). Aucun déploiement en production ni fusion automatique. Le verdict de la vérification complète sur le SHA exact est disponible dans les [contrôles de la PR](https://github.com/saphiron222/memlia-landing/pull/270/checks).

## Livré

- 21 outils conservés, six essentiels en premier choix ; filtres natifs, sans compte et sans dépendance JavaScript pour parcourir le hub.
- Gabarit commun crème/vert et figurines existantes ; cartes, focus et typographie du site. Le formulaire réel arrive avant les explications et les réglages spécialisés restent repliés.
- ROI court : offre, volume, coût horaire, calcul. Les temps sont un exemple fictif modifiable. Le budget récurrent, la mise en service et la première année restent distincts ; un coût inconnu reste à chiffrer et un résultat négatif reste négatif. Le comparateur détaillé reste accessible.
- Quotas des agents accompagnés de profils approximatifs. Pour Balthazar, 5 000 crédits représentent environ 20 dossiers légers, 8 courants ou 3 chargés, pour les seuls travaux décrits. Ce ne sont ni des dossiers comptables complets ni des consommations mesurées.
- FAQ et panneaux Dans vos outils suivent leur section sur grand écran. Les panneaux hauts laissent lire leur bas ; mobile en flux normal, sans barre de défilement imbriquée.
- Titres, URL et intentions des outils conservés. 22 images sociales originales de composition, construites avec les figurines Memlia, dans `public/outils/social/` ; variantes JPEG du pipeline existant. Manifeste et empreintes : `social-manifest.json`.

## Références de prix

Deux documents commerciaux font foi : [RECOMMANDATION.md](../../strategy/pricing-2026-10-15/RECOMMANDATION.md) et [agents-individuels/GRILLE.md](../../strategy/pricing-2026-10-15/agents-individuels/GRILLE.md). [README du pricing](../../strategy/pricing-2026-10-15/README.md) les distingue des preuves fournisseurs et des hypothèses de coûts. Les anciennes grilles et leur classeur ont été supprimés du checkout. Source structurée unique : `src/data/tarifs-memlia.json`.

## Vérifications

- Calculs, arrondis, limites, scénarios négatifs, imports et exports : tests ciblés des outils et des tarifs. Aucun appel Mammouth facturé ni dossier client réel.
- Navigation sans JavaScript, filtres au clavier, accordéons, réglages invalides révélés, focus et mouvement réduit. Parcours de 320 à 1 920 px ; 21 outils contrôlés à 375 et 1 440 px. Revue des captures et inspection dans le navigateur.
- 105 contrats navigateur des cartes, gabarits et parcours actuels réussis. Revue des tâches paie/juridique et du cadre robot. Le titre juridique ne déborde plus à 320 px.
- Échantillons des tableaux robot CFE et agent juridique : aller/retour Tab, flèches et absence de débordement dans Chromium et WebKit, à 320/375 px. La suite complète dérive toutes les fiches actives des catalogues typés.
- 11 tests de livraison des outils réussis : réseau et soumission bloqués, GET/HEAD, retrait du beacon, scripts utiles et en-têtes conservés. Le contact conserve son circuit distinct.
- Contrat des 95 pages compilées et 23 tests de ses garde-fous réussis. Les anciens écrans de démonstration ne sont plus imposés au-dessus de l’outil réel ; identité de l’outil, saisies, action et image sociale propre sont contrôlées.
- Migration : 12 anciens services et 12 guides retirés, 301 exactes et destinations pertinentes ; 21 robots conservés. Recettes et sceaux archivés sans réécriture. 59 tests services/migrations et rendu Astro du guide synthétique isolé réussis.
- Revue rédaction et E-E-A-T : 33 tests ciblés réussis ; auteur humain, fournisseur Organization, citations officielles, validations et limites. Aucune Person pour une figurine, FAQPage, certification, note ou avis inventé.
- Revue navigateur complémentaire : 83 contrôles du hub, du gabarit et des pages commerciales ; 63 interactions des outils ; 69 contrôles visuels et de performance réussis. Les anciennes assertions ont été remplacées par les parcours du catalogue actuel, sans réduire les seuils.
- Chargement tardif des polices : le dernier élément du fil d’Ariane occupe une rangée stable sur mobile. Les 17 contrôles passent, CLS ≤ 0,1 et déplacement du chapeau ≤ 2 px, notamment à 320 px pour Salomé et CFE.
- Lien éditorial conservé du hub robots vers la carte des tâches du cabinet ; les six sections restent inchangées. Contrôle du lien rendu à 375, 768 et 1 440 px réussi.
- Prévisualisation distante : 25 contrôles réussis, dont les 21 fiches robots, les présélections de contact et les redirections. Copie préparée avec balise et en-tête `noindex, nofollow`, en conservant les protections. Les 95 HTML du paquet local concordent avec l’artefact construit et vérifié en CI.
- Audit des 95 HTML : 6 563 liens internes, aucune destination ou ancre manquante. 87 pages dans les sitemaps ; index XML par type, dates synchronisées depuis le registre, anciennes routes et aperçus exclus. `llms.txt`, Markdown et `llms-full.txt` dérivés des pages publiées, avec contrôle de chaque lien et du contenu intégral.

## Performance et portée des mesures

Mesures Lighthouse locales sur le hub, le ROI, la bibliothèque, le FEC et le barème CAC : 99–100 en performance après correction de la bibliothèque, 100 en accessibilité et bonnes pratiques. Déplacement initial de la bibliothèque corrigé : CLS mesuré 0. Le hub obtient 100 en SEO. Les pages outils obtiennent 92 : le contrôle Lighthouse de robots.txt essaie une requête depuis leur page et se heurte à `connect-src 'none'`. Le fichier robots.txt et les sitemaps sont contrôlés séparément par HTTP et sur l’export. La CSP n’est pas ouverte pour améliorer ce score. Ce sont des mesures de laboratoire, pas des données de terrain ni une garantie de classement.

## Preuves et compétences

`references/` conserve les captures du hub et des 27 outils Outrank ainsi que les manipulations du ROI Outils-EC. Les captures de recette, journaux détaillés, Lighthouse et audits de liens sont dans `.qa/outils-simples/` du worktree ; ils ne sont pas des actifs publics du site.

Compétences utilisées pour cette phase : exclusivement celles de l’installation Claude, dont free-tools, cro, copywriting, copy-editing, direction de design, accessibilité, seo-technical, seo-schema, seo-images, seo-sitemap, seo-content et seo-audit. L’audit global prévoit une revue spécialisée en parallèle ; les revues migrations, rédaction et livraison ont été effectuées. Aucun modèle d’image ni consommation API n’a été simulé.
