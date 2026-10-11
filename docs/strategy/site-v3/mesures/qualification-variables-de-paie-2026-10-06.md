# Qualification — collecte des variables de paie

Décision du 6 octobre 2026 : ne pas ouvrir /automatisation/variables-de-paie à ce stade. Rattachement commercial documentaire à /automatisation/paie. La famille variables-de-paie reste active ; aucun canonical croisé, aucune redirection et aucune réservation de requête ne sont créés.

## Demande mesurée

Huit sondes Google fr-FR réussies : six listes vides, huit suggestions au total dans deux listes. L’amorce commerciale exacte « automatisation collecte variables paie cabinet comptable » reste vide, de même que les amorces de collecte clients cabinet, relance automatique, formulaire, logiciel et contrôle. « collecte variables de paie » donne « collecte des variables de paie ». « tableau variables de paie » donne sept variantes de tableau, exemple, Excel et gratuit. Les réponses exactes sont dans variables-de-paie-mesures-2026-10-06.json.

Le signal observable concerne une méthode de collecte et un tableau utilisable, pas une intention distincte de confier cette tâche à un prestataire. Aucun volume mensuel n’a été mesuré. Une liste vide ne prouve pas une demande nulle ; le besoin métier n’est pas rejeté.

## Besoin et concurrence ciblée

Le geste utile consiste à rapprocher une liste de variables attendues par dossier et période avec les réponses reçues, préparer une relance limitée aux manquants et montrer les contradictions au gestionnaire. Réception, complétude et validation sont trois états distincts. Une absence de réponse n’est ni un zéro ni une déclaration « néant ».

Silae documente déjà une collecte déclarative et une validation intégrées sur sa page dédiée, ouverte le 06/10/2026 : https://www.silae.fr/solution-rh-paie/elements-variables-de-paie/

Citations exactes visibles dans la capture navigateur jointe :

- « Un processus d’intégration automatisé » ; le titre se poursuit par « des variables de paie ».
- « soumise à validation ».
- « Gardez la main sur les » ; le titre se poursuit par « éléments variables saisissables ! ».
- « les primes, les heures supplémentaires et les absences ».

Le texte rendu indique que mySilae recueille les variables de manière déclarative et soumise à validation, les intègre en paie, permet de paramétrer les éléments saisissables et conserve leur historique. Ce sont des fonctionnalités annoncées par l’éditeur, pas un test fonctionnel ni une garantie de conformité. Les affirmations de gains et de conformité absolue de l’éditeur ne sont pas reprises comme faits établis.

Si le portail natif répond au besoin, l’utiliser avant de reconstruire son circuit. Le différentiel possible de Memlia est le rapprochement d’attendus et de reçus entre fichiers, messagerie et sources hétérogènes qui subsistent hors portail. Aucun cas commercial explicite ni preuve d’accès à ce flux n’est établi ici. Cette piste ne justifie donc pas encore une nouvelle page de service.

## Frontière de la piste

| Se prépare seul après vérification des accès | Attend une validation | Reste humain |
|---|---|---|
| Rapprocher dossier, période et variable selon les identifiants exacts ; classer reçu/manquant ; préparer un message sur les seuls manquants | Correspondance ambiguë, réponse contradictoire, correction tardive ; destinataire et envoi de la relance ; complétude du lot à remettre | Qualification sociale, choix du code de paie, correction, décision individuelle, validation et calcul du bulletin, dépôt DSN |

Une règle future devra arrêter les relances dès réception exploitable ou suspension humaine, retirer les variables reçues d’un brouillon non envoyé, éviter les doublons, garder la provenance et les décisions, et ne jamais écraser une saisie humaine. Elle ne reconduit pas les valeurs du mois précédent pour combler un manque. La cadence et la date de collecte sont des règles écrites du cabinet ; aucun délai légal universel n’est revendiqué. Les vues de pilotage restent agrégées et les détails de dossier réservés aux personnes habilitées.

Ce tableau cadre une piste, pas une automatisation livrée. Aucun rejeu de produit n’est revendiqué.

## Source officielle actualisée par consultation

CNIL, « Sécurité : Gérer les habilitations », publiée le 13 mars 2024, ouverte le 06/10/2026, HTTP 200 : https://www.cnil.fr/fr/securite-gerer-les-habilitations

Citations exactes :

- « Limiter les accès aux seules données dont un utilisateur a besoin. »
- « Faire valider toute demande d’habilitation ».

Ces recommandations fondent la vérification des accès et destinataires ; elles ne certifient pas un outil et ne constituent pas une règle de calcul de paie. Aucun taux, barème, délai DSN ou traitement de maladie n’est énoncé dans cette qualification.

## Anti-cannibalisation et rattachement utile

Le service existant /automatisation/paie prend déjà le contrôle de présence des variables, la donnée manquante et la variation hors règle dans son jeu fictif. Une nouvelle page commercialisant seulement « reçu/manquant + validation » répéterait aujourd’hui cette valeur. Le registre contient aussi l’article /blog/controler-les-bulletins-de-paie-avant-la-dsn, propriétaire du contrôle bulletin ; ne pas lui transférer la collecte ni traiter le calcul des bulletins dans cette piste.

Quatre angles informationnels existent dans backlog-v3, mais ne sont pas quatre pages à fabriquer :

- collecter-les-variables-de-paie-sans-relancer-a-la-main ;
- checklist-de-controle-des-variables-de-paie-avant-le-bulletin ;
- les-variables-de-paie-qu-un-formulaire-automatique-ne-doit-jamais-valider-seul ;
- qu-est-ce-qu-une-variable-de-paie-et-qui-doit-la-transmettre.

Le signal tableau/gratuit mérite d’être conservé pour l’arbitrage éditorial ou produit ultérieur, pas de déclencher un outil supplémentaire dans cette carte. Ne pas rediriger la candidate inexistante ni modifier le registre, le footer ou le sitemap.

## Vérification et limites

/automatisation/paie : HTTP 200. /automatisation/variables-de-paie : HTTP 404. Requêtes sans paramètre avec Cache-Control: no-cache. Aucun contenu public n’a été modifié.

La recherche et l’extraction Firecrawl ont renvoyé 403 ; reprise par navigateur et curl, sans désactivation TLS. La concurrence est une comparaison documentaire ciblée de Silae, pas un inventaire SERP exhaustif ni un classement de résultats. Le besoin de relance et l’insuffisance du portail natif restent à confirmer auprès d’un cabinet. Source CNIL ancienne, consultation actuelle ; aucune nouveauté réglementaire déduite de sa consultation.

## Critère de réouverture et handoff

Réouvrir sur un cas explicite de cabinet avec liste d’attendus et sources hors portail, relances manuelles récurrentes, insuffisance précise de l’offre native et accès démontrés. Requalifier alors l’intention de délégation et la séparation avec le service paie ; rejouer au minimum réception complète, réponse partielle/contradictoire et arrêt/refus avant toute recette.

L’enfant dev est réorienté vers l’intégration documentaire de cette qualification, du relevé et de la vérification dans docs/strategy/site-v3/mesures. Page non retenue : service:preparer, revue métier PASS et service:sceller ne s’appliquent pas ; aucune recette ou revue fictive n’est créée.
