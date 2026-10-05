# Rattrapage IA du 5 octobre 2026

## Décision et décompte

La direction de Kevin du 05/10 à 12:08 Europe/Paris, relayée sur t_f9e51486, rattache les quatre articles IA à la semaine éditoriale 2026-W40. La règle exécutable est `rattrapage-ia-2026-10-05.json`, version 1. Il ne s'agit ni d'une revue ni d'une preuve de publication.

| Sujet | Semaine éditoriale | Date publique réelle |
|---|---|---|
| utiliser-chatgpt-cabinet-comptable | 2026-W40 | 2026-10-04 |
| verifier-reponse-ia-comptabilite | 2026-W40 | 2026-10-05 |
| ia-comptabilite-confidentialite-donnees | 2026-W40 | 2026-10-05 |
| automatiser-avec-ia-sans-changer-logiciel | 2026-W40 | 2026-10-05 |

Le lot a son décompte de quatre sujets W40, distinct des quatre nouveaux sujets W41 et du rattrapage W39 déjà publié. Les anciens articles W39 et leurs décomptes existants ne sont pas modifiés. Les quatre sujets IA ne sont pas de nouvelles réservations ordinaires de W41.

Le décompte quotidien reste réel : le 05/10 peut accueillir trois articles uniquement si toutes les entrées de ce jour appartiennent au lot désigné. Un autre sujet n'acquiert jamais cette troisième place. Ailleurs, deux articles par jour et quatre nouveaux articles par semaine restent les plafonds ordinaires. Les portes de qualité, les sources, la revue éditoriale et le scellement restent obligatoires. Aucune publication n'est antidatée.

## Implémentation

- `scripts/lib/blog-ia-catchup.mjs` valide le périmètre du mandat et charge la règle. Ajouter un sujet, changer une date, une semaine ou le plafond ne crée pas une nouvelle permission.
- Le planificateur Python consomme ce même validateur Node. Il conserve les dates publiées, réserve seulement les sujets inscrits au backlog et sépare le quota du lot du quota courant. Il ne crée pas le dernier article à sa place.
- `verifierPlafonds`, la création et la forge lisent cette règle. La forge recontrôle aussi une entrée déjà présente dans la file avant toute matérialisation.
- Le préflight de la forge emploie le même décompte ; il ne réintroduit pas un refus général de trois articles après préparation.
- `cluster-plan.json` expose la règle dans `rattrapageIA` ; le calendrier affiché conserve les dates réelles. Les quatre dérivés sont régénérés, pas corrigés à la main.

## Vérifications exécutées

Les tests du troisième article et de la capacité W41 ont d'abord échoué avec les plafonds antérieurs. Après correction : tests de cadence, tests du lot, contrôles historiques W39, suites Python et Node du build, `npm run check` et `npm run build` passent. `check` : zéro erreur et zéro warning, neuf hints préexistants.

Le vrai candidat marketing a été copié dans un checkout isolé, sans écrire dans son worktree auteur. Dans cette copie, les commandes natives suivantes passent :

```sh
python3 docs/strategy/site-v3/build-cluster-plan.py --check
python3 docs/strategy/site-v3/build-cluster-plan.py
python3 docs/strategy/site-v3/build-cluster-plan.py --slot automatiser-avec-ia-sans-changer-logiciel 2026-10-05
node scripts/blog-forge.mjs preparer automatiser-avec-ia-sans-changer-logiciel
```

Résultat de `preparer` : `erreurs: []`. Cinq mutations natives refusées : ajout d'un cinquième slug à la règle, déplacement de date, plafond porté à quatre, demande du dernier candidat au 06/10, demande d'un autre sujet au 05/10. Les tests couvrent également série Cicatrices usurpée, quatrième article réel et cinquième sujet ordinaire W41.

## Reprise après intégration technique

### Oracle de stock indépendant

`tests/proof/test_mandated_blog_inventory.py` vérifie le stock de briefs avec des dates synthétiques futures, pas les réservations du mandat W40. Il construit d'abord le plan réel avec la garde `origin/main` et contrôle les dates/statuts de toutes les publications intégrées. Dans sa seule fixture, il remplace ensuite le lot IA par des réservations futures espacées d'une semaine, tout en conservant ses entrées, familles, liens et déplacements d'angle. Le mandat est désactivé seulement après cette séparation. Ainsi une vraie réservation saturée du candidat ne peut plus être confondue avec un ajout futur ; la publication ultérieure du quatrième sujet ne réintroduit pas trois archives W40 dans un calendrier ordinaire synthétique.

Les assertions d'unicité, d'idempotence, de familles et de dates historiques sont conservées ; angle arbitraire, mauvaise famille et doublon restent des témoins négatifs. Les dates publiques réelles, plafonds W40 et cadence ordinaire sont toujours exercés séparément par `test_ia_catchup.py` et les tests natifs de cadence. Aucun planificateur, mandat, article ni règle de publication n'est modifié par cette réparation de fixture.

QA intègre la PR technique après son unique revue et la CI verte. Marketing intègre ensuite main dans sa propre branche, en conservant son déplacement d'angle 08 et sa revue éditoriale t_003f2bb5. La PR technique n'emporte ni le texte candidat, ni sa publication, ni une nouvelle revue du fond.

Point de reprise réellement rencontré : le relevé `mesures/titres-intent-2026-10-05.json` de main contient les requêtes confidentialité, mais la restauration du stash auteur n'avait pas remis les quatre requêtes du passage. Pour le rejeu isolé, ces quatre mesures originales ont été réunies avec les mesures existantes depuis `editorial/recettes/automatiser-avec-ia-sans-changer-logiciel/autocompletion.json`. Ne pas écraser les mesures confidentialité, inventer un relevé ou annoncer une nouvelle mesure.

Après cette réconciliation et la régénération : rejouer `--slot`, préparer, consommer la revue acquise, sceller et suivre la publication native/CI sur t_f9e51486. Les dates réelles et les sujets publiés restent intouchés. La publication du dernier article et le bilan des quatre restent à la charge de marketing.
