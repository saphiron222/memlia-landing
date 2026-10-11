# QA — sources des services

Carte : t_163a261e. Revue indépendante technique du 10 octobre 2026.
Verdict final : PASS, après correction du seul défaut signalé.

Cause reproduite : la validation DILA introduite dans la forge service exigeait
une copie pour toutes les sources, dont la source officielle DGFiP de la recette
facture-electronique. Le nouveau test a échoué avec ce refus exact sur la base.
Dans une copie isolée de PR172 (c9fb36ce), service:audit est passé de FAIL
(ce seul refus, 11 services) à PASS avec uniquement le script corrigé.
Aucun contenu, preuve ni avis métier de cette recette n'a été changé.

Le correctif impose toujours le contrôle complet pour les URL Légifrance et
pour toute déclaration de copie, même vide ou partielle. Les autres sources
conservent leur lien public obligatoire sans copie DILA fictive. Les lecteurs
homologues blog et Ressources sont déjà conditionnels ; ils restent inchangés.

Premier verdict QA : FAIL sur l'hôte Légifrance avec point terminal. Ce défaut
a été reproduit par le même test, puis corrigé par normalisation de l'hôte
uniquement pour sa classification ; l'URL passée au lecteur DILA ne change pas.
Re-revue limitée à ce défaut et au critère de fini : PASS.

Commande exécutée indépendamment par QA :
`node --test tests/scripts/service-forge.test.mjs tests/scripts/dila*.test.mjs`
Résultat : 27 réussis, 0 échec, code 0. Contrôles positifs et négatifs : DGFiP,
lien public absent, déclarations vides/partielles, copie absente, domaines
Légifrance avec/sans www et point terminal, copies fraîches/périmées, extraits,
empreintes, inclusion dans le sceau et conservation historique.

Limite : le branchement hors DILA n'atteste pas la fraîcheur des preuves hors
DILA ; cette carte ne modifie pas leur contenu ni leur revue métier. La CI et
la livraison doivent encore conclure avant fusion.
