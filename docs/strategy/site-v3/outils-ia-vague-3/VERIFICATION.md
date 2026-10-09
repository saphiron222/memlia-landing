# Vérification réelle du cadrage

## PASS documentaires
Commande : `python3 docs/strategy/site-v3/outils-ia-vague-3/validate-docs.py`.
Résultat conservé : document-check.json.
- Dix briefs, dix routes finales uniques et dix primaires sans collision avec registre existant.
- Dix cartes dev identifiées, au moins trois entrants et cinq cas spécifiques par outil.
- 62 scénarios d'acceptation définis (à exécuter sur futurs produits, pas 62 tests passés).
- 64 définitions complètes : identité contenu/empreinte et 640 couples skill/outil uniques contrôlés par le parent.
- 250 applications ciblées de cadrage, 172 contrôles différés, 218 N/A motivés ; aucun statut « différé » présenté comme exécuté.
- Onze réponses d'autocomplétion HTTP 200 avec réponse brute, pas volume mensuel.
- Oracle du brief ROI calculé réellement avec Decimal : 6,666… heures/mois, capacité 266,67 €/mois ; coût horizon 1600 €, cash net 800 €, ROI cash 50 %, récupération 6,67 mois sur hypothèses fictives.

## PASS du dépôt existant
- `npm ci --ignore-scripts` dans le worktree isolé : réussi, package-lock inchangé. L'installation signale quatre vulnérabilités préexistantes (une moderate, trois high), non corrigées par ce mandat documentaire.
- `node --test tests/scripts/seo-registres.test.mjs` : 21/21, aucun skip ni échec. Trace test-registre.log. Cela vérifie l'oracle existant du registre, pas l'ajout futur du type outil.
- `npm run build` : terminé sortie 0. Trace build-cadrage.log. Vérifie que les documents n'altèrent pas le build de main source ; aucune nouvelle route n'est créée.
- `git diff --check` : sortie 0 ; seul le dossier documentaire est ajouté, code/public/editorial inchangés.

## Reprises transparentes
Le sous-travail a d'abord trouvé parse5 absent : après installation dans le bon worktree, le test registre a réellement passé. Un premier npm ci lancé par erreur à la racine scratch (sans lockfile) a refusé sans changer le dépôt ; reprise dans repo réussie.
La sonde Python HTTPS a trouvé un certificat local non résolu ; reprise avec curl et validation TLS active a réussi. execute_code et python -c indisponibles en unattended ; aucune configuration modifiée, scripts ordinaires écrits puis exécutés.

## Ce qui ne passe pas encore de porte dans cette carte
Pas de QA du générateur PR51 ni nouvelle revue du cadrage (revues déjà downstream), pas de fournisseur IA choisi/testé, pas d'obligation réglementaire actuelle attestée, pas de nouveaux outils publics, pas de tests navigateurs des futurs produits, pas de déploiement ou de croissance. Tous ces éléments sont des critères des cartes correspondantes. Aucun `PASS` documentaire ne les remplace.

## Conservation et transmission
Documents sur branche dédiée poussée non destructivement ; transmission à dix cartes dev et QA/publication existantes 01. Six cartes manquantes 05–10 créées, toutes relues ; 02/06/07 également liées à publication 01 pour reprise du moteur intégré.
Le README et contrat-routes.json sont la référence finale ; les tables de proposition du sous-travail sont une trace, notamment pour la requête proposée initialement de 01, remplacée par générateur prompt expert comptable.
