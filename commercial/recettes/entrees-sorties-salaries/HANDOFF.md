# Handoff t_b4aaf366 → t_a487210f

Ce paquet remplace entièrement l’ancienne recette t_9b2a2acb. Base locale : origin/main 93142cff ; aucun commit/push ni publication. Le gel de publication fixé sur t_a487210f est conservé : cette livraison ne le lève pas.

## Résultat

Titre et héros centrés sur les annonces hors portail, corpus en neuf sections, frontière trois colonnes, sept cas fictifs, revue indépendante du nouveau fond PASS et scellement. Les fonctions mySilae/PayFit sont reconnues avant la proposition de valeur. Aucun geste du portail utilisé ne se revend ; DPAE uniquement pour une entrée, champs proposés à valider sans dépôt/création effective. Appels seulement via compte rendu écrit autorisé.

## Intégrer

1. Extraire commercial/recettes/entrees-sorties-salaries/ et commercial/services/entrees-sorties-salaries/ ainsi que src/content/services/entrees-sorties-salaries.md. Ne pas utiliser l’ancien paquet.
2. Fusionner uniquement couverture-entrees-sorties-salaries.json dans COUVERTURE_SERVICES de src/data/couverture-logiciels.mjs ; le fichier complet fourni est un socle local, pas un remplacement des changements voisins. Conserver les autres entrées. Le test service-couverture fourni est le socle déjà utilisé sur onboarding-client ; reprendre sa version courante si intégrée.
3. Fusionner les trois entrées d’autocomplétion/provenance du relevé original fourni avec les autres mesures actuelles, sans remplacer le relevé entier. Le registre d’origine n’est pas livré ; registre-entrees-sorties-salaries.json ne porte que la réservation concernée. service:sceller peut réappliquer cette réservation sur le registre courant après fusion des mesures.
4. Conserver le PASS métier du nouveau fond. Une seule revue QA pour l’implémentation, pas une seconde revue du contenu pour une date/lien ou les données dérivées.
5. Produire une preuve HTML figée propre à ces sept cas (pas celle de paie), puis SERVICE_DESIGN/EEAT, liens entrants déclarés et frère paie. Le bloc de couverture doit être rendu et testé après build. Aucun rendu ou test navigateur n’est revendiqué dans ce paquet.
6. Respecter le gel de la carte dev ; n’exécuter la chaîne de publication qu’après sa libération prévue. Ensuite tests/build/CI et contrôle effectif de production selon son critère de fini.

## Vérification effectuée

Rejeu auteur terminé code 0, sept comparaisons intégrales et invariance des entrées. Relecture indépendante : assertions franchies, écriture de rejeu.json volontairement refusée (détail dans revues.json). Préparer/sceller/auditer PASS ; audit six services ; vingt tests couverture/forge PASS ; git diff --check PASS. Le contrôle HTML conditionnel de couverture n’a pas de build à inspecter sur cette phase.

## Hotspots

src/data/couverture-logiciels.mjs et docs/strategy/site-v3/mesures/{titres-intent-2026-10-06.json,registre-requetes.json} : fusion ciblée, jamais remplacement par cette copie locale.
