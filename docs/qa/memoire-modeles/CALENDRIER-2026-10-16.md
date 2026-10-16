# Créneau éditorial échu — 16 octobre 2026

La CI du candidat `496b56ee` a passé les quatre lots de contrats navigateur. Sa porte déterministe a rencontré deux erreurs de calendrier après minuit UTC : la réservation du 15/10 de `cac-circularisation-campagne` était encore active, sans article publié.

`origin/main` a été relu au commit `c5da8bf9` : aucune modification concurrente pertinente des entrées du calendrier n’était à intégrer. Le précédent `0060898e` documente la convention : retirer une réservation non produite, conserver `dateManquee`, laisser l’article en `a-replanifier` et ne pas inventer une nouvelle date de publication.

La correction retire seulement `datePlanifiee: 2026-10-15`. La trace initiale du 09/10 reste. Les autres réservations sont intactes. Le planificateur est inchangé, et un test vérifie qu’une réservation échue est toujours refusée. Aucun article publié ni son corps n’a été modifié ; aucune nouvelle autorisation de publication n’est créée.

Les quatre dérivés du calendrier ont été régénérés au jour réel avec le script existant. Leurs projections non réservées évoluent à partir du 16/10 ; elles restent non actionnables sans décision de programmation. Aucun changement du rendu des offres, de leurs prix ou de leurs intentions SEO.

Le rejeu des horloges futures supposait également qu’une réservation échue resterait toujours dans le vrai backlog. Cette dépendance devenait fausse après la remise en file légitime. Le test vérifie désormais la restauration de l’horloge, puis injecte une réservation échue dans une copie temporaire du backlog réel. Dans cette seule copie, les autres réservations ordinaires non publiées sont retirées pour que le refus identifie bien le sujet injecté, même en 2030. Il appelle le vrai `construire()`, avec l’autorité Git et le planificateur inchangés. La copie est isolée et le chemin source restauré. Les scénarios du 16/10/2026 et du 01/01/2030 restent exercés sans test ignoré.
