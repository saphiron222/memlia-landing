# Correction F1 — CAC lot 2

Livraison auteur t_b92f3e26, sans PASS métier ni publication. Le paquet canonique livré est docs/strategy/site-v3/glossaire-cac-lot-2.json dans cette archive.

## Périmètre

Les dix entrées publiques restent identiques, y compris IPE, exemples et frontières. Les huit sources et leurs copies, leurs dates, preparedAt, les liens et le statut de revue sont inchangés. Les 18 couples signalés dans PREUVE.json sont tous localisés par f1-plan.json et f1-mapping.json. Les 13 champs correspondants avaient 32 lignes de preuve : leurs 14 lignes compagnes sont également redistribuées pour ne pas garder de recopie composite contradictoire. Ils portent désormais 36 lignes de sous-claims ; les 51 autres preuves restent identiques. Total : 87 lignes.

Même mécanisme que resource-metier-v3.mjs : text porte le sous-claim, unitText conserve intégralement le champ public, unitId groupe le champ et claimId identifie l’affirmation (éventuellement corroborée par plusieurs sources). Aucun verdict « soutient » n’est attribué par l’auteur.

## Corrections localisées

- Assertions, définition : NEP 315 §05 ajouté pour la définition ; §17 pour la fonction des travaux. NEP 500 §§03/05 et équivalents DILA séparés de la même manière.
- Assertions, contexte : liste des assertions NEP 500 §09 / DILA §9 distincte des assertions pertinentes NEP 315 §06.
- Assertions, confusion : NEP 315 §§05/17 remplace §§06/17 ; les sources NEP 500 §§03/05 restent sur cette explication de la distinction assertion/travaux/conclusion.
- Anomalie, contexte : définition NEP 200 §04 distincte de montant/nature/circonstances/jugement NEP 320 §§09/10.
- Anomalie, confusion : montant/nature/circonstances NEP 320 §09 ; proposition sur le cumul NEP 200 §04 / NEP 320 §04. Le point-virgule public est conservé dans le second sous-claim.
- Risque inhérent, contexte : distinction NEP 200 §11 ; évaluation séparée et facteurs NEP 315 §§02/39/40.
- Risque inhérent, confusion : absence de prise en compte des contrôles NEP 200 §11 ; facteurs à examiner et évaluation NEP 315 §§02/40.
- Risque lié au contrôle, définition : NEP 315 §02 remplace §§34/41 ; NEP 200 §11 conservé, §12 non nécessaire à ce champ.
- Risque lié au contrôle, contexte : définition NEP 200 §11 ; conception/mise en œuvre/tests NEP 315 §§34/41 ; absence de tests NEP 315 §41 dans un sous-claim propre.
- Risque lié au contrôle, confusion : décrire/tester NEP 315 §§34/41 ; contrôle de l’entité/non-détection de la mission NEP 200 §§11/12.
- IPE, définition : première phrase isolée comme convention lexicale professionnelle et illustrations éditoriales sans source réglementaire ni portée normative autonome ; les NEP ne définissent pas l’acronyme IPE. Seconde phrase sur la fiabilité portée par NEP 500 §§06/07 et DILA §§6/7. NEP 315 §46 ne reçoit plus la définition entière.
- IPE, contexte : exactitude/exhaustivité NEP 500 §06 / DILA §6 distincte des informations intégrées aux outils NEP 315 §46.
- IPE, confusion : suffisant/approprié, exactitude/exhaustivité/pertinence NEP 500 §§05/06 / DILA §§5/6 ; suppression du rattachement intégral à NEP 315 §46.

## Contrôles et rejeu

Échec réel du test ciblé avant correction conservé dans f1-red.log (2/3 PASS, défaut de sous-claims attendu). Après correction : 3/3 tests F1, 6/6 mutations spécifiques refusées, 7/7 mutations initiales refusées ; validateur adapté PASS (10 entrées, 8 sources, 87 lignes, 2 liens), tests DILA 5/5 PASS.

Le validateur vérifie la couverture par union des textes (sans omission de caractères publics hors espaces), le maintien de unitText, les identifiants distincts et les citations littérales localisées. f1.test.mjs vérifie le plan précis des textes et paragraphes. Ces contrôles ne remplacent pas le jugement sémantique indépendant de métier.

À extraire à la racine d’une archive du dépôt (base de rejeu : b896a3a37f6a4fbf902d7889fdaf184711d6c573), sans intégrer de fichiers globaux :

    node docs/qa/hub-ressources/glossaire-cac-lot-2-sources/validate.mjs
    node --test docs/qa/hub-ressources/glossaire-cac-lot-2-sources/f1.test.mjs docs/qa/hub-ressources/glossaire-cac-lot-2-sources/f1-mutations.test.mjs
    node docs/qa/hub-ressources/glossaire-cac-lot-2-sources/mutations.mjs
    node --test tests/scripts/dila-source-copy.test.mjs

original/docs/strategy/site-v3/glossaire-cac-lot-2.json est exclusivement la référence immuable des tests ; review/PREUVE.json et review/REVUE.md sont le FAIL historique pour localiser F1, pas un nouveau verdict. Les anciens draft.json/extraits.md et anciens résultats de préparation ne sont pas repris comme preuves actuelles dans cette archive.

## Réserves et état de livraison

Copies DILA : collecte originale du 6 octobre à Paris conservée ; A4 est un dérivé DINUM sans garantie de consolidation générale à jour, aucune ouverture Légifrance revendiquée. Fenêtre historique et condition d’application de NEP 315 révisée aux exercices ouverts à compter du JO du 19 novembre 2024 conservées. Aucun rafraîchissement ou redatage des sources pour cette correction de rattachements.

Travail dans scratch depuis archive de origin/main ; dépôt principal inchangé, ni commit, ni push, ni publication. Pas de CI complète locale ni preuve de production requise pour ce paquet séparé. Reprise de t_135675b2 limitée à F1 et au critère de fini ; l’intégration reste conditionnée à son PASS.
