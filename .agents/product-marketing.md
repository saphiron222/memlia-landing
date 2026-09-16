# Contexte marketing Memlia

Document version : v2
Last updated : 2026-09-15

## Produit et modèle économique
Memlia automatise le travail répétitif des cabinets d’expertise comptable dans leurs outils existants. C’est un service : observer une tâche, définir ses règles et ses limites, construire une automatisation, éprouver ses résultats et ses refus, puis remettre un périmètre à la recette du cabinet. L’IA prépare, l’humain décide.

Le résultat et les critères d’acceptation sont définis au devis ; prix à la complexité, jamais au siège. Maintenance, support et évolutions sont définis au contrat, sans délai ni disponibilité universels promis. Excel est une intégration structurante (compléments Office.js ou COM/.NET suivant le cas), pas la catégorie commerciale ni une promesse de compatibilité générale. Les logiciels métier et exports restent en place lorsque les formats et accès le permettent.

## Audience et personas
- Expert-comptable / dirigeant : identifier une tâche qui mérite un investissement, connaître le périmètre, les limites, la recette et le prix.
- Responsable de production sociale : rendre les étapes et les exceptions visibles sans classer les collaborateurs ; contrôler avant la transmission.
- Gestionnaire / collaborateur : moins de ressaisies et de rapprochements ; comprendre ce qui est proposé et conserver ses saisies.
- Référent outils / sécurité : savoir quels fichiers, accès, droits, traces et conditions de maintenance sont requis.

JTBD : préparer des informations répétitives ; rendre les écarts vérifiables ; suivre l’avancement agrégé des dossiers ; garder le jugement humain. France, proximité commerciale bretonne. Aucun besoin de pages-villes pour trouver des clients de cabinets plutôt que des cabinets clients.

## Problèmes, objections et dynamique de changement
| Objection | Réponse autorisée |
|---|---|
| Nous avons déjà un logiciel | Nous partons de la tâche entre les outils ; les accès et formats sont vérifiés avant de s’engager. |
| Une IA peut se tromper | Cas limites et données absentes font partie des essais ; la proposition n’est pas la décision. |
| Cela va changer notre organisation | Un périmètre limité est cadré avant développement et soumis à recette. Aucune migration évitée garantie avant examen. |
| Combien cela coûte ? | La complexité des règles, formats, exceptions et contraintes détermine le devis ; ni tarif fictif ni pack de sièges. |
| Qui voit quoi ? | Accès et traitements à documenter par mission ; démonstrations fictives, vues de pilotage agrégées. Pas de certification ou localisation d’hébergement inventée. |

Push : travail répétitif et exceptions dispersées. Pull : un résultat vérifiable dans l’existant. Habitude : classeurs et procédures connus. Anxiété : perte de contrôle, données, maintenance. Anti-personas : salarié cherchant une vérification individuelle de sa paie ; acheteur d’un moteur de paie ou d’une plateforme comptable complète ; demande de surveillance nominative.

## Alternatives et différence
Inqom, Dext, Pennylane, MyUnisoft et Silae sont des alternatives de budget/processus et parfois des outils sources, pas cinq concurrents directs prouvés. Leurs sites officiels ont été lus le 15/09/2026 (docs/strategy/site-v2/COMPETITOR-ANALYSIS.md). Aucune prétention d’exclusivité sur le « contrôle humain » : Dext et Inqom le mettent également en avant. Notre différence à démontrer est le service circonscrit, ses règles, ses exceptions et sa recette ; ne pas dénigrer leurs intégrations.

## Vocabulaire et voix
Français professionnel, concret, calme ; vouvoiement public. Tâche, cabinet, dossier, bulletin, DSN, règle, proposition, écart, recette, validation humaine. Définir « recette » et « fail-closed » lors de leur première apparition. Éviter plateforme tout-en-un, autonome, zéro erreur, conformité garantie, révolution, gains chiffrés sans mesure. Aucun faux verbatim client : les formulations sont des synthèses, sauf source autorisée explicite.

| Terme | Sens partagé |
|---|---|
| Périmètre | Sources, règles, exceptions, accès, sorties, validations et environnement couverts. |
| Recette | Vérification par le cabinet des cas attendus, des exceptions et des refus avant livraison. |
| Fail-closed | Bloquer le traitement concerné hors règle plutôt que compléter silencieusement une donnée. |
| Jeu fictif | Données sans client réel utilisées pour développer, tester ou démontrer ; ne décrit pas les traitements nécessaires en exploitation. |
| Famille de tâches | Exemple à cadrer, pas module publiquement disponible. |

Le cabinet doit pouvoir nommer un référent pour la recette. Une tâche sans règle explicable, testable ou maintenable n'est pas un bon périmètre. Les manipulations manuelles et les plateformes généralistes sont aussi des alternatives ; le choix n'est pas limité aux cinq éditeurs du benchmark. Rillet reste une référence de message « résultat livré », pas une équivalence de produit ni un texte à copier.

## Preuves autorisées
src/data/proofs.ts décrit des illustrations fonctionnelles fictives : elles ne sont ni des captures produit ni des résultats client. Les deux guides publiés sont des preuves pédagogiques, pas une attestation métier. Les capacités précises doivent être reliées à un module livré et à une preuve de recette ; l’existence d’un dépôt ne suffit pas. Aucun logo client, témoignage, nombre de cabinets ni pourcentage de gain disponible pour la copy publique. Aucun nom client interne à republier. Kevin Kitanga est l’auteur public des articles et le fondateur, pas un expert-comptable diplômé présumé.

## Garde-fous
Aucune donnée client réelle dans ces livrables, aucun téléphone public ni TVA non confirmée, y compris dans le JSON-LD et les légales. Pas de classement de salariés. Ne pas promettre « toutes vos données restent locales », une certification ou une compatibilité universelle. Faits juridiques : relire la source légale courante ; le siège légal et le lieu d’exercice ne sont pas synonymes.

## Objectif et conversion
Une action principale : Identifier une tâche à automatiser. Destination interne décidée pour v2 : /contact, puis liens existants Cal.com et contact@memlia.fr. Aucun formulaire collecteur ni dépôt de fichier dans v2. Le visiteur apporte une description sans données client. Mesures de trafic, conversion et requêtes propres à memlia.fr : ND à ce jour dans le présent audit. Un clic CTA ne prouve pas un rendez-vous ni un prospect qualifié.

## Sources
- Carte t_630c4a13, mandat et décisions du 15/09/2026.
- Coffre 10-memlia/00-socle.md ; marketing/positionnement-memlia-automatisation-ia.md ; produit/offre-et-modules.md ; marketing/seo/20-voix-client-vocabulaire.md.
- src/data/site.mjs, src/data/proofs.ts, src/components/JsonLd.astro et deux articles src/content/blog/ ; lecture du 15/09/2026.
- docs/strategy/site-v2/evidence/ : collecte publique et limites datées.

## Changelog
- v2 (2026-09-15) — Contexte resserré et actualisé depuis le socle et le mandat site v2 : alternatives relues, preuves circonscrites, auteur exact, contact interne et distinction Blog/Ressources. Le positionnement service existant est conservé, pas recréé.
- v1 (2026-09-08) — Contexte initial : Memlia est repositionné comme service d'automatisation IA pour cabinets, sans catalogue public ; Excel devient un environnement possible plutôt que la catégorie du produit.

## Invariants v1 → v2

La version 2 de ce contexte a fortement remplacé la version 1. Cette table dit ce que chaque règle
de la v1 est devenue, pour qu'une revue de copy puisse la tracer sans relire l'historique Git.

| Invariant de la v1 | Devenu | Section de la v2 qui fait foi |
|---|---|---|
| Memlia vend un service, pas un catalogue de sièges | conservé | positionnement |
| Le prix suit la complexité, jamais le nombre de sièges | conservé | positionnement |
| L'automatisation prépare, une personne valide ; fail-closed en cas de doute | conservé | méthode |
| On automatise dans les outils existants ; Excel n'est pas la catégorie | resserré : l'outil existant est le point de départ, pas l'argument | offre |
| Aucune donnée client réelle, jeux d'essai fictifs | conservé | garanties |
| Aucune métrique client publiée, aucun gain chiffré non sourcé | conservé | garanties |
| Anti-surveillance : agrégats, jamais de classement nominatif | conservé | garanties |
| Interdits de copy : superlatifs, promesses de conformité, comparatifs non testés | conservé | interdits |
| Les contenus sont signés Kevin Kitanga, sans qualification professionnelle supposée | conservé | auteur |
| Familles de tâches détaillées, anti-persona, preuves par thème | remplacé : le détail vit désormais dans le plan site v2 et le Hub Ressources publiés | renvoi |
