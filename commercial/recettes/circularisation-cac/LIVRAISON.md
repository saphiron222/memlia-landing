# Circularisation CAC — remise à la publication

## Décision

Préparation et suivi maintenus d’une campagne dans les outils du cabinet. Une seule page commerciale sur « automatiser circularisation », distincte du modèle gratuit et des articles de méthode. Aucune page variante banque/client/fournisseur. C2 classe le geste priorité 1 ; la requête commerciale compte zéro suggestion, sans volume ni trafic revendiqué. Le registre C2 donne quatre suggestions pour « circularisation commissaire aux comptes », une pour « réponse circularisation fournisseurs » et deux pour « procédures alternatives circularisation ».

L’architecture C3 et les lectures C1/C2 sont sur main. La charte v5 utilisée est celle de PR107, approuvée par metier et encore en attente de fusion lors de la préparation ; la v4 de main contient encore l’ancienne réserve audit. Cette recette n’altère aucune charte ni aucun ancien contenu.

## Valeur distincte et concurrence

C2 DEMANDE-CAC.md §§3 et 4 décrit les ouvertures de Gest On Line/e-Circu et Paris Ouest Audit du 06/10. Les concurrents couvrent déjà la chaîne de circularisation : aucun vide ni supériorité non mesurée n’est allégué. Notre angle est la séparation observable réception/rattachement/examen, l’arrêt sur refus/périmètre différent, et la maintenance d’une règle dans l’environnement existant. Le rejeu donne les entrées et sorties de huit situations, pas une intégration ou un produit de campagne prêt à utiliser.

Terrain : C1 V014–V016. Demande et propriétaires : docs/strategy/site-v3/cac/{DEMANDE-CAC.md,ARCHITECTURE-CAC.md,page-intent-plan.json,pages-maillage.json}. Les mesures sont reprises telles quelles depuis la capture C2, sans nouvel appel ni fausse fraîcheur. Le relevé titres-intent-2026-10-06.json est un adaptateur pour la forge, avec provenance et horodatage de chaque entrée.

## Ce que prouve la recette

Huit cas de suivi exécutables : retour non rapproché, écart documenté −300, absence de réponse transmise au CAC, validation d’envoi absente, refus de direction, saisie conservée, périmètre différent et demande ouverte. La simulation n’envoie pas, ne lit ni ne génère de lettre/pièce, ne choisit aucune diligence et ne conclut jamais. Une fiche outil est annoncée comme support Memlia ; le CAC documente son appréciation, sans modèle normatif ou agrément implicite.

Sources : deux pages officielles H2A ouvertes le 06/10 par web_extract et curl ; sept extraits exacts vérifiés dans le HTML, avec versions et paragraphes dans preuves/sources.json. Les textes complets gardent aussi NEP505 §§10–15 et NEP315 §§14/46/48 d). Les dates de contrôle restent internes ; références publiques compactes.

## Publication dev (carte t_f91e7a2e)

- Préserver la revue metier du fond. Cette livraison ne publie pas la page ; seul le candidat scellé doit être intégré ici.
- Créer un visuel HTML figé propre à la campagne, illustrant un retour reçu mais non rapproché, un écart et une absence, sans logos ni cartouche réglementaire.
- Ajouter SERVICE_DESIGN, SERVICE_EEAT (Kevin Kitanga, sans qualification CAC), schéma Audience CAC et le contrat de page à la publication. Le socle de recette suit les cinq types acceptés par la forge ; les données de rendu doivent cibler les CAC, pas l’audience EC écrite par défaut.
- Poser trois liens contextuels avec l’ancre exacte « Automatiser la circularisation ». Les trois articles prévus sont non publiés lors de cette préparation : pilier CAC, campagne, réponse/rapprochement. S’ils ne sont pas disponibles au lancement, choisir trois sources indexables pertinentes réellement présentes et noter la substitution avant publier. Ni footer ni composants globaux ne comptent.
- Toute évolution du corps réglementé revient à la revue existante uniquement sur les défauts signalés ; un changement d’image, d’EEAT ou de maillage ne constitue pas une nouvelle revue du fond.
- Exécuter les essais d’acceptation réels sur les accès, validations et réception sous maîtrise du CAC avant de revendiquer une livraison opérationnelle. Ne pas convertir le rejeu d’états en preuve d’intégration.
- Conserver les preuves et sceaux. En cas de conflit sur titres-intent-2026-10-06.json, fusionner les mesures par requête, jamais écraser un lot frère. La forge ajoute l’entrée registre service au scellement : préserver les entrées sœurs et la recherche CAC.
- Après construction : cycle service:publier, régénération, tests/build, revue QA du code, PR/CI/fusion ; vérifier la production sans query string, puis créer J+7/J+28.

## Rejeu

Depuis la racine : `node commercial/recettes/circularisation-cac/preuves/rejouer.mjs --check`. La commande de préparation des preuves utilise les deux fichiers HTML de téléchargement du workspace et sert au run d’auteur seulement ; le contrôleur métier peut relire les copies durables dans preuves/ sans les redater.
