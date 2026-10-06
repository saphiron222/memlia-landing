# Revue indépendante unique B2 — PASS

Date : 2026-10-06. Relecteur : `qa:doctrine-b2-independent` ; posture de lecteur métier : `relecteur-metier-ia:doctrine-b2-independent`. Une seule session de revue, indépendante de Kevin et de la rédaction du candidat. Cette posture IA n'est ni une seconde personne réelle ni une certification par un commissaire aux comptes.

## Décision et périmètre

**PASS du candidat doctrinal et de la figure ; aucun défaut bloquant trouvé dans le périmètre B2.** Ce verdict ne vaut ni scellement, ni CI de livraison, ni autorisation de publication. Rien n'a été publié et aucun contenu, source ou test n'a été modifié par cette revue.

Le diff de contenu du pilier est bien limité à la ligne Audit légal du tableau et au paragraphe « Que ne contient pas cette carte ? ». S'y ajoutent la doctrine de la page service, llms.txt, le repère historique du référentiel et la figure d'inventaire. Le diff de travail complet comporte aussi les matérialisations de forge, le compte Usages et le test de copy déjà modifiés par l'auteur ; ils n'ont pas été réécrits ici.

Documents lus : `.agents/product-marketing.md`, `docs/design/blog-article-proofs/RECETTE.md`, recette, corps, paquet-revue et revues existantes. La charte réellement présente est **v4**, et non v3 annoncée dans le mandat ; les règles de message applicables sont conservées. Sa clause historique « audit légal non ouvert » reste à mettre à jour dans B1 selon la décision d'ouverture confiée à B2 ; elle ne constitue pas ici un veto au mandat explicite.

## Critères et constats

| Critère | Résultat | Motivation |
|---|---|---|
| Frontière professionnelle CAC | PASS | Demandes de documents, suivi des réponses et comparaisons entre exercices sont des préparations. Sélection des travaux, appréciation et opinion restent explicitement au CAC dans le tableau, le paragraphe, le service et llms.txt. Aucune promesse d'audit autonome, de certification ou de conformité NEP. |
| Taxonomie et compte EC | PASS | `audit-legal` reste inactif, identifiant historique EC. Les familles CAC actives sont distinctes et restent source de vérité : réception FEC, demandes, revue analytique, synthèse/lettre, confirmations, sélection des écritures, dossier de travail, mandats. `Usages.astro` filtre `famillesDeLaProfession('ec')` avant compte des familles/pôles ; aucun ajout CAC au total EC. Le pilier garde son inventaire historique avec « 1 repère transversal », non une nouvelle famille CAC. |
| Affirmations officielles | PASS | Six affirmations inchangées relues contre copies locales et metadata du 29/09 ; SHA-256 recalculés concordants. Aucun nouveau texte NEP attribué à une source qui ne le porte pas. |
| Charte et intention | PASS | Pilier informatif, réponse directe, tableaux, règle et jugement humain ; voix nous/vous, pas de gain inventé. Publication initiale conservée au 16/09, mise à jour au 06/10. |
| Maillage | PASS | Aucun lien ajouté vers `/commissaires-aux-comptes` ou un pilier blog CAC inexistant. « carte CAC » est un repère textuel, pas un lien cassé. Les ancres internes de l'article sont présentes ; CTA du pilier vers `/contact`. Pas de preuve HTTP de toutes les destinations existantes revendiquée. |
| HTML candidat | PASS | Rendu exact ouvert en navigateur puis servi localement en HTTP 200. Un H1, canonical attendu, BlogPosting et dates cohérents ; preview privée `noindex, follow` normale. À 1280 px : aucun débordement global et inventaire chargé, dimensions naturelles 1600 × 900, confiné à la colonne. |
| Figure et provenance | PASS | Inventaire et référence `social-dictionnaire.webp` inspectés visuellement ; couverture et fiche de relance également regardées. Inventaire 1600 × 900, 43014 octets ; alt correspondant aux six lignes fictives, aucun résultat client induit. |

### Sources archivées effectivement vérifiées

Les chemins ci-dessous sont relatifs à `editorial/articles/automatiser-un-cabinet-comptable-la-carte-des-taches/preuves/sources/`. Les empreintes correspondent aux `contentSha256` des metadata `.json` lus. Les `.source.txt` et ces metadata ne diffèrent pas de la base ; seules les classifications sont matérialisées dans le diff de l'auteur.

| Copie | Passage | Portée conservée | SHA-256 |
|---|---|---|---|
| `cnil-roles.source.txt` | 732–734 | Qualification au cas par cas, fondée sur les faits et documentée ; aucun rôle déduit du seul fichier client. | `0aa8bb40f50528952782ebbf7cd9515e5e2a33b17bc2b4a0c862b75bec98ce11` |
| `sp-conservation.source.txt` | 307 | Durée minimale variable selon document et obligations ; aucune durée universelle. | `fffbe0ab21c00944167fe668fe08deca5ef83ceac9dc697d7f61d67cedd332b1` |
| `net-crm.source.txt` | 156 | Retour après déclaration en cas d'erreur ou suspicion ; décision de correction humaine. | `9a6b8de31b36259329bdf8c110680cee10c1127166e1c47c22801f09ebbb653f` |
| `impots-calendrier.source.txt` | 642 | TVA mensuelle septembre 2026, fenêtre 15–24, date dans l'espace professionnel ; pas une échéance générique d'octobre. | `15c908d3ce9a54af55fd1c9cdc96d0d1b477eb2e4f1968471322a3a189c4bc7b` |
| `cnil-principes.source.txt` | 528–533 | Minimisation parmi les autres obligations RGPD, finalité conservée. | `1c73164bc14a3174abe3737f4551cdab68ee530893619a286ad9f60bf8259c7b` |
| `cnil-durees.source.txt` | 774–776 | Analyse de conformité du responsable par traitement ; pas une dispense de conservation documentaire. | `392f8e1800d89961a4286ff0542eb2fc8e5b046bfcd250118ad78e2b0c2dde74` |

## Grille visuelle obligatoire — 5 questions

Objet : `public/proofs/blog/carte-inventaire-taches.webp` ; comparaison réellement faite avec `public/proofs/blog/social-dictionnaire.webp`.

| Question RECETTE | Réponse | Constat |
|---|---|---|
| 1. Est-ce l'écran d'un outil qu'un cabinet pourrait avoir sous les yeux ? | Oui | Inventaire avec filtres, colonnes pôle/famille/fréquence/règle/statut, pastilles et compteurs ; pas une diapositive. |
| 2. Les données sont-elles fictives, concrètes et sans marque ? | Oui | En-tête « Jeu d'essai fictif · cabinet de démonstration », tâches et fréquences concrètes, aucune marque, personne ou donnée client. |
| 3. L'image se comprend-elle sans lire l'article, et l'article se lit-il sans l'image ? | Oui | Pour le lecteur de cabinet, inventaire et maturité des règles sont identifiables seuls. L'article porte la carte et la frontière en texte ; la figure n'est pas un support indispensable d'explication. EC/CAC/DSN restent des sigles métier, et 60 est le total des repères, pas les seules six lignes montrées. |
| 4. N'y a-t-il ni schéma d'étapes commenté, ni slogan, ni avertissement ? | Oui | Un titre court, tableau et statuts ; ni frise, ni phrase-thèse, ni avertissement. « À cadrer » est un état, pas une garantie. |
| 5. Posée à côté des références, passerait-elle pour l'une d'elles ? | Oui | Même fenêtre blanche arrondie, bandeau à pastille, fond quadrillé, typographie et palette gris/vert avec badges ; écran métier fictif de la même famille graphique. |

**Résultat figure : PASS (cinq oui).** La ligne Audit légal dit « Demandes de documents / Par mission / À cadrer / Carte CAC », pas « Non ouvert », pas « opinion automatisée ». Les petits textes sont ceux d'un aperçu illustratif ; aucune exigence de lire le tableau-image à la place du texte. La recette interdit d'en faire une explication supplémentaire : aucun ajout de légende, lien d'agrandissement ou variante mobile demandé.

## Binding réel de la revue

Commande canonique exécutée avec succès :

```sh
node scripts/blog-forge.mjs empreinte automatiser-un-cabinet-comptable-la-carte-des-taches .qa/doctrine-render/blog/automatiser-un-cabinet-comptable-la-carte-des-taches.html
```

- bodySha256 : `3846993327d57db4b6c8f0b939b91206f1f3aff160167390cf3d47d8db241c9a`
- recipeSha256 : `9c7cbfbefa53bcd5945af16cdd80c02b31337f2b078b095567644b23d71d535f`
- recipeSubstanceSha256 : `246a4cf9fcc1249a4f84851d6799f0f99bfe20dc6e2dac199752d0886adc6f09`
- renderedSha256 : `fab7b59b9aff581fc2cb149c623f247bab2988d8f245f1656ab2df8321ce201e`

`revues.json` contient désormais ces empreintes, les sept critères éditoriaux, six verdicts métier, six critères image, les observations de sources et une grille qualité réévaluée. Les anciens constats éditoriaux sur un autre article (tests rouges, récit personnel, quinze paragraphes) ont été remplacés : ils ne justifiaient pas une revue du pilier. Le score 91 est une appréciation qualitative, pas une nouvelle mesure de SERP ou de performance.

## Limites et incidents

- Pas de recherche SERP, de nouveau fetch officiel, de test de production, de Lighthouse ou de recette mobile. Pas de promesse de HTTP 200 pour l'ensemble des liens.
- Le premier accès `file://` ne chargeait pas les ressources absolues ; l'inspection visuelle d'intégration a donc été faite avec un serveur HTTP local du rendu, vérifié en 200 avant lecture. La figure d'inventaire y charge bien en 1600 × 900.
- L'environnement non interactif a refusé `execute_code` et un script `node -e`. Aucun résultat n'a été inventé : lecture, recherche, `shasum`, `sips`, navigateur et commande forge existante ont fourni les preuves.
- `git diff --check` exécuté, sans erreur. `preparer`, `sceller`, `publier` non relancés : ils matérialiseraient d'autres fichiers hors du mandat. Le parent doit reprendre la matérialisation et les portes de livraison après cette revue ; le PASS ne prétend pas que l'ancien dossier dérivé est déjà rescellé.

## Fichiers produits

- `/Users/kevinkitanga/.hermes/kanban/workspaces/t_5ca575f3/site/editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/revues.json` — remplacé par la revue B2 motivée et liée au candidat exact.
- `/Users/kevinkitanga/.hermes/kanban/workspaces/t_5ca575f3/site/docs/qa/doctrine-cac/REVUE.md` — présent rapport.
