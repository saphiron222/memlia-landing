# Rattrapage W41 au jour réel

La demande de Kevin du 12/10/2026 est bornée aux douze sujets de
`scripts/lib/blog-w41-catchup.json` (copie du périmètre joint à la carte de fabrication).
Ce fichier n'est ni un reçu HTTP ni une revue de contenu.

À partir du 12/10, une réservation explicite de ces sujets au **jour courant de
Europe/Paris** sort des seuls quotas et de l'alternance éditoriale. Sans réservation
explicite, le stock continue d'être ordonnancé normalement. Une réservation échue
reste refusée et doit être replanifiée au jour réel ; une réservation future ne
bénéficie pas de l'exception. La forge JS refuse une préparation W41 datée autrement
que du jour réel à partir du 12/10. Le CLI Python utilise aussi Europe/Paris.

Les articles déjà publiés gardent leur date et leur texte. Leurs dates réelles
restent affichées, sans consommer les trois places quotidiennes et quinze places
hebdomadaires normales. Les autres réservations, priorités et règles d'alternance
restent celles du plan ordinaire. Aucun flag de contournement n'est fourni par une
recette ou par la ligne de commande.

## Remise aux propriétaires, après livraison du correctif

1. Repartir de main à jour. Pour un sujet non encore publié du périmètre, conserver
   `dateManquee` et fixer explicitement `datePlanifiee` dans le backlog au jour de
   Paris. Aligner la date de la recette sur ce jour, sans réécrire le fond ni les
   citations approuvés. Ne pas modifier les dates des articles acquis.
2. Rééditer les dérivés depuis les sources avec
   `python3 docs/strategy/site-v3/build-cluster-plan.py`, puis exécuter
   `python3 docs/strategy/site-v3/build-cluster-plan.py --check`.
3. Vérifier le créneau frais, en remplaçant `<slug>` par le sujet réel :

   ```sh
   JOUR=$(TZ=Europe/Paris date +%F)
   python3 docs/strategy/site-v3/build-cluster-plan.py --slot <slug> "$JOUR"
   ```

4. Reprendre la forge normale : sources, fond, images, avis indépendants, CI et
   contrôle HTTP restent obligatoires. Un `créneau : OK` ou `invariants : OK`
   n'autorise ni n'atteste une publication. Une cible absente ou un calendrier
   désaligné restent refusés. Au changement de jour, reprendre la réservation et
   l'édition au jour réel, pas avec une horloge de test.

Les lignes `OBSERVATION cadence` donnent les nombres réels du jour et de la semaine,
rattrapages inclus, en distinguant les articles publiés et seulement réservés.
Elles peuvent dépasser la préférence normale sans inventer une attestation.

## Témoins ciblés

```sh
node --test tests/scripts/blog-w41-catchup.test.mjs
node --test tests/scripts/cron-w41-preflight.test.mjs
python3 -m unittest discover -s tests/proof -p test_w41_catchup.py -v
```

Le témoin JS appelle les vrais `--check` et `--slot` sur une copie du stock réel,
avec les douze sujets au même jour : dates étrangères, cible manquante, dérive des
dérivés et recette absente restent refusées ; les autres réservations restent en
place. Le même calendrier traverse aussi le vrai `cron-preflight --phase maintenance`
dans un checkout Git propre et synchronisé. Le préflight ne retire de ses quotas
que les réservations explicites du jour Paris et les archives acquises du lot ;
hors lot, dates étrangères, absence de réservation et quotas ordinaires restent
contrôlés. Le week-end réel est admis pour ce lot seulement. Les horloges fixes
sont locales aux fixtures. La construction complète est
vérifiée par la CI GitHub « Repository gates ».
