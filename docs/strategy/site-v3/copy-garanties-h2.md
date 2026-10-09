# /garanties — copy H2, CONT-08

Carte : t_33056bf2. Base : origin/main 4f42a88b. Préparation : 8 octobre 2026.

## Décision

« Aucune conformité » devient « Aucune attestation de conformité ». La documentation du traitement, la recette et une attestation sont distinguées. Les accès, flux, destinataires, hébergements éventuels et conservation sont cadrés par mission ; la maintenance est bornée par le devis. La décision reste au cabinet. Pour une tâche CAC, choix des travaux, conclusions et signature ne sont pas délégués à Memlia.

Structure, H1, sous-titre, métadonnées, ancres, liens existants et CSS de page conservés. Après le retour métier D1, seule l’illustration du bloc données est remplacée par un cadre propre à /garanties, borné au cadrage et au développement. Le CTA reste « Confier une première tâche » vers /contact. Aucune nouvelle promesse de conformité, certification, délai ou gain. Les paragraphes restent cohérents avec la FAQ commune (données réelles, recette, validation, maintenance), sans modifier celle-ci.

## Sources ouvertes le 8 octobre 2026

CNIL — Travail, ressources humaines : le contrôle de l’activité des personnes employées (page datée du 9 juillet 2026).
https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees
Extrait exact : « Un employeur a le pouvoir d’encadrer et de contrôler l’activité des membres du personnel ainsi que leur usage des équipements au travail. Il s’agit d’une contrepartie normale et inhérente au contrat de travail. Néanmoins, ce pouvoir ne peut pas être exercé de manière excessive. »
Portée : repère officiel pour le contrôle de l’activité. Les vues agrégées et l’absence de classement individuel sont notre choix de conception, plus étroit que ce cadre ; nous ne les présentons pas comme une interdiction légale générale.

CNCC — Code de déontologie de la profession de commissaire aux comptes, mars 2026, article 10.
https://doc.cncc.fr/docs/codedeontologiemars2026/attachments/brochure-code-de-deontologie-mars-2026
Extrait exact, espaces de mise en page normalisés : « Le commissaire aux comptes peut se faire assister ou représenter par des collaborateurs ou des experts. Il ne peut leur déléguer ses pouvoirs. Il conserve toujours l’entière responsabilité de sa mission ou de sa prestation. »
Portée : responsabilité conservée lors d’une assistance. Aucune qualification de Memlia comme expert/CAC ; aucune conformité aux NEP ni suffisance du dossier déduite de nos essais. Le lien compact est dans le paragraphe CAC. Le document CNCC indique que seuls les textes publiés au JO font foi ; la revue métier contrôle le périmètre applicable.

Les engagements opérationnels (règle écrite, jeux fictifs, accès documentés, support et maintenance au devis) viennent de la charte v5 .agents/product-marketing.md, §§2, 2 bis, 4, 6 et 10. La limitation « aucune attestation » précise l’offre, elle ne prétend pas décrire une obligation légale.

## Vérification exécutée

- npm run regen:generated : PASS.
- npm run build : PASS après conservation du passage de décision humaine déjà protégé par site-copy-b.
- Python positionnement : 8 tests PASS ; garanties : 2 tests PASS.
- Playwright positionnement et garanties : 5 tests PASS, dont /garanties à 375 et 1440 px, canonical, CTA, ancres, frontières et absence de débordement horizontal.
- Captures pleines pages 375 et 1440 inspectées : texte du bloc attestation entier et lisible ; aucun débordement ou texte coupé visible. Les suggestions de rythme/visuels historiques sont hors de cette passe de copy.
- Contrôle de périmètre : tous les liens existants conservés, mêmes identifiants de sections et CSS identique.
- lastmod --check et git diff --check : PASS.

Incidents de vérification résolus : le premier serveur de test port 4329 appartenait à une autre prévisualisation ; le serveur de cette carte a annoncé 4330, où les 5 tests ont été rejoués avec succès. Un rebuild Astro isolé a réintroduit les briefs internes ; strip-briefs et render-public-source-text ont été appliqués, et les tests de positionnement ont été rejoués avec succès. Le build public complet avait déjà passé.

## Base et suivi

Relevé avant livraison : GET https://memlia.fr/garanties avec Cache-Control: no-cache, le 8 octobre 2026. La réponse servie porte encore « Aucune conformité ». CONT-08 est donc confirmé en production et corrigé seulement dans le candidat à ce stade.

Base d’audit du 6 octobre (t_a80f53ec/AUDIT.md) : HTTP 200, canonical/H1/JSON valides, indexable et sitemap OK ; Lighthouse 94/100/100/100, LCP 2,824 s, CLS 0,0000. Ce sont les valeurs de l’audit, pas une nouvelle mesure ni un gain attribuable à la copy. Aucun nombre de clics, impression ou conversion inventé.

Après PASS métier : intégrer la PR avec CI verte, puis lire la page réellement servie sans paramètre d’URL. Vérifier le nouveau titre de limite, le paragraphe, les CTA /contact, le canonical et la présence sitemap. Enregistrer la date effective de publication.

J+7 et J+28 depuis cette publication : comparer Search Console /garanties (impressions, clics, CTR, position, requêtes) sur fenêtres de même durée ; compter les demandes de contact dont la provenance est effectivement connue. Si les données sont absentes ou trop faibles, noter non mesurable. Vérifier à nouveau CONT-08 et les liens. Ne pas attribuer de gain à ce changement sans données suffisantes.

## Correction D1 — 8 octobre 2026

Le titre « Vos fichiers restent chez vous » est remplacé par « Des essais fictifs, des flux cadrés par mission ». Le rappel final parle désormais du développement sur jeux fictifs. Le corps conserve la lecture en place des seuls fichiers autorisés au cadrage et la cartographie des accès, destinataires, flux et hébergements éventuels avant mise en service.

Le nouveau cadre HTML figé v2/45-cadrage-donnees distingue Cadrage et Développement. La non-copie porte sur les dépôts ; aucune absence universelle de transmission en exploitation n’est affirmée. Texte alternatif et détail bornent la scène aux mêmes phases. L’ancien cadre v2/08 et ses métadonnées restent intacts : aucune autre page n’est modifiée. Source : docs/design/garanties-cadrage-proof ; manifeste : docs/qa/garanties-cadrage/proofs-manifest.json. Le langage visuel reprend la composition canonique, sans nouveaux tokens ni logos.

Vérification rejouée : renderer adopt puis check PASS (1600 × 900, polices chargées, absence de texte tronqué, actif inférieur à 150 Ko) ; regen:generated et npm run build PASS ; Python garanties 3 PASS, positionnement 8 PASS ; Playwright 5 PASS dont 375/1440. Captures pleines pages et actif figé inspectés : concordance des phases, aucune troncature visible. Les détails des illustrations restent petits sur mobile, constat de confort hors D1. Contrôle des liens, ancres et CSS PASS. Sources et autres constats métier acquis inchangés ; re-revue demandée sur D1 uniquement. Fusion et production restent à réaliser après PASS métier et CI verte.
