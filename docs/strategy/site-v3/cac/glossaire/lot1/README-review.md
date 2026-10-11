# Lot CAC 1 — revue indépendante acquise

PASS, carte t_ada6a80c. Lire review/REVUE.md. Ce paquet de revue clôt le réexamen D1–D3 ; il ne constitue pas un manifeste global ni une autorisation de publier sans les autres étapes du circuit.

Pièces :
- candidate/ : paquet corrigé et sources de t_79f71254, inchangés par métier.
- initial-review/ : rapport et preuve du FAIL initial, conservés pour tracer les corrections et les 53 avis reportés.
- review/lot-review.json : 60 avis de lot, dont 37 couples officiels et 23 avis de méthode ; sept unités ciblées, 53 reportées avec leurs dates initiales.
- review/business-review.json : preuve AI_REVIEW_PASS native des 29 couples sensibles legal-reglementaire. Les huit couples information sont jugés dans la preuve de lot, pas injectés à tort dans la liste native réservée aux claims sensibles.
- review/claims-evidence-projection.json : projection réelle 50 champs, 60 claims, 109 citations, 12 sources incluant la méthode Memlia.
- review/claims-check.json et controls/ : contrôles et refus des mutations effectivement exécutés.
- review/source-recheck.json : relectures ciblées H2A/CNCC, échecs d'URL et limites explicités.
- build-review.mjs / check-review.mjs / check.py : génération et vérification reproductibles, nécessitant le main frais et les dépendances du site. Le dossier main et node_modules ne sont pas inclus dans la livraison.

Pour intégrer sur t_c7724c9d :
1. Remplacer le candidat initial par celui de t_79f71254, ou employer la copie candidate/ incluse ici.
2. Importer ses sources, en conservant dates réelles, version, avertissements A4 et copies. Remapper candidate/ aux chemins effectivement importés.
3. Conserver les sujets H2A/CNCC (claimSubject), les statuts evidenceStatus et les références de synthèse (basedOnClaimIds dans la projection, basedOnUnitIds dans le paquet).
4. text désigne la sous-affirmation ; unitText le champ public complet, non attribué à la seule source. La synthèse et la frontière utilisent une source Memlia non officielle, jamais une citation institutionnelle.
5. Reporter les avis acquis sur le fond inchangé. Reconstruire seulement l'enveloppe et les références de la revue groupée avec les bibliothèques natives ; ne pas recopier le reviewedCandidateHash de cette projection dans un autre manifeste.
6. Rejouer le circuit Ressources complet, DILA aux dates réelles, CI et contrôles de publication. Ces opérations n'ont pas été faites par métier et restent à l'intégrateur. Une nouvelle date ou le chrome ne demande pas une seconde revue de fond.

Réserve A4 : dérivé DINUM sans garantie de consolidation complète. Collecte 06/10 maintenue, fenêtre de nouvelle préparation jusqu'au 13/10 inclus ; renouveler par le circuit autorisé après cette échéance sans redatage. Guide SACC 2018 : vocabulaire uniquement, aucune famille de services ouverte.
