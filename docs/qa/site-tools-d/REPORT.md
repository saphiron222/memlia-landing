# Lot D — quatre outils existants

Implémentation et recette du 4 octobre 2026. Publication non encore effectuée ; revue métier unique puis CI/fusion et constat Cloudflare/domaine restent requis.

## Décisions et preuve avant/après

- Marge : les trois formules étaient uniquement produites après calcul JS ; elles sont désormais dans le HTML initial, avec prix strictement positifs et arrondis expliqués. Calcul et CSV inchangés. Insee définit la marge commerciale annuelle avec les stocks ; notre calcul borné à deux prix ne prétend pas la remplacer. Bpifrance distingue les dénominateurs des taux.
- Échéance : « sans accord particulier » excluait à tort les délais convenus proposés. Remplacé par une confirmation de l’applicabilité du délai sélectionné ; plafonds contractuels et exclusions visibles avant les champs. Les trois délais et deux méthodes fin de mois restent les seuls calculs couverts : ce n’est pas un validateur de contrat et les délais convenus plus courts ne sont pas calculés.
- Amortissement : le dégressif utilisait le mois de mise en service. Champ acquisition distinct et obligatoire pour ce mode ; exemple acquisition novembre / mise en service décembre = 2/12 et 583,33 € sur 10 000 € / cinq ans. Linéaire comptable : début usuel à la mise en service, convention jours réels/exercices calendaires conservée, pas présentée comme règle fiscale universelle. Bascule dégressive au quotient résiduel présentée comme option retenue. La valeur saisie est la base amortissable ; la durée et l’éligibilité restent humaines.
- Arrondis : un plan linéaire de 0,02 € sur trois ans pouvait produire une dernière dotation de −0,01 € après surconsommation de la base. Test observé rouge puis dotation plafonnée à la base restante. Balayage des durées 1–50 ans, douze mois, six bases et deux modes : aucune dotation négative, aucun cumul au-delà de la base, total réconcilié et valeur finale nulle.
- Rapprochement : le téléchargement était seulement un CSV, bloqué à tout écart. Ajout d’un vrai fichier OOXML .xlsx, trois feuilles Notice / Exemple fictif / À remplir ; saisies vides dans la dernière, formules d’ajustement et différence arrondies, statut NON VALIDÉ en cas d’incomplétude, période inversée, précision/bornes non respectées, écart ou élément inexpliqué. Signes documentés ; pas de macro, connexion externe ni appariement de lignes. Le CSV fictif existant est préservé ; ses exceptions deviennent exportables avec un état NON VALIDÉ, jamais comme réussite comptable.

Les quatre nouveaux contrats Node et le test fichier ont échoué avant implémentation. Le test d’arrondis a échoué séparément avant correction. Aucune image publique ni cadre scellé modifié ; pas de nouveau suivi analytics.

## Sources primaires réellement ouvertes

Consultation interne du 4 octobre 2026, non destinée à l’affichage public.

- Insee : https://www.insee.fr/fr/metadonnees/definition/c1774 — « différence entre le montant hors taxes des ventes de marchandises et le coût d’achat hors taxes des marchandises vendues ». Frais annexes et stocks relèvent de la définition annuelle ; explicitement exclus du calcul de deux prix.
- Bpifrance Création : https://bpifrance-creation.fr/taux-marque — « Taux de marque = Marge / PVHT » et « Taux de marge = Marge / Prix de revient ». Ici coût = prix d’achat HT saisi, sans frais.
- DGCCRF, fiche écrite le 23/12/2025 : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/delais-de-paiement-les-regles-connaitre — délais convenus plafonnés, conditions contractuelles et deux méthodes fin de mois ; factures périodiques et régimes spécifiques distincts. Copie de la page ouverte : `sources/dgccrf.md`.
- ANC, PCG au 1er janvier 2026 : https://www.anc.gouv.fr/files/anc/files/1_Normes_fran%C3%A7aises/Reglements/Recueils/PCG_janvier2026/PCG--1er-janvier-2026.pdf — art. 214-12 : « L’amortissement d’un actif commence à la date de début de consommation des avantages économiques qui lui sont attachés. Cette date correspond généralement à la mise en service de l’actif. » Art. 214-13 : durée et mode propres à chaque actif, linéaire à défaut de mieux adapté. Ce texte n’impose pas le prorata jours réels/365 ou 366 retenu ici.
- DGFiP : https://bofip.impots.gouv.fr/bofip/4699-PGP.html — § 190 : « premier jour du mois d’acquisition ou de construction » ; § 220 : acquisition 15 novembre / mise en service 15 décembre = 2/12 ; § 250/260 : option quotient résiduel et année initiale entière. Copie ouverte : `sources/bofip-degressif.md`.

Légifrance a refusé les ouvertures du chercheur délégué ; aucune page inaccessible n’est présentée comme consultée. Les liens historiques utiles restent conservés.

## Recette exécutée

- `npm ci` : succès ; trois vulnérabilités préexistantes annoncées (une modérée, deux hautes). Aucune montée de dépendance opportuniste.
- `npm run build` : PASS, dont 125 tests Python et 607 tests scripts ; audit ressources PASS.
- `npx astro check` : 0 erreur, 0 avertissement ; huit hints préexistants.
- `npx playwright test tests/browser/outils.spec.ts tests/browser/tools-d.spec.ts` : 49 PASS, incluant formules sans JS, téléchargement réel ZIP/.xlsx sans compte, dates distinctes, exception CSV, calcul sans requête/stockage et six largeurs (320/375/768/1024/1440/1920).
- `uv run scripts/build-reconciliation-workbook.py` : fichier réel construit ; aucune dépendance ajoutée au navigateur ni au build Node. openpyxl 3.1.5 épinglé dans le script de construction.
- `uv run scripts/verify-reconciliation-workbook.py` : dix cas PASS dans LibreOfficeDev 26.8.0.0.alpha0, formules réellement recalculées, entrées préservées. Concordant, écart, inexpliqué même avec différence nulle, découvert, centimes, période inversée, saisie manquante, sous-centime, borne dépassée et feuille vide. Valeurs sorties dans `workbook-recipe.json` ; aucun résultat de formule inventé.
- Export PDF par LibreOffice : trois pages, notice complète, exemple et feuille vide. Rendu raster vérifié visuellement ; largeur/mise en page de la notice corrigées après une première troncature. `modele-rapprochement-bancaire.pdf` et `workbook-page-*.png`.
- Huit captures de pages 375/1440 stabilisées avec reduced motion et chargement des images, sans modification des styles pour la preuve. Après correction de la capture prématurée, aucun bloc absent/flouté ni débordement observé.
- `git diff --check` : PASS.

Logs finaux bruts dans `execution-logs.zip` : `build.log`, `browser.log`, `astro-check.log`, `workbook-recipe.log`. L’archive conserve les espaces/échappements produits par les outils sans les réécrire.

## Limites et suite de livraison

Le vrai moteur exercé est LibreOffice, pas Microsoft Excel (non installé sur cette machine). Le fichier emploie des formules classiques compatibles OOXML ; aucune recette Excel précise n’est revendiquée. Il faut ouvrir le fichier, laisser le tableur recalculer, saisir seulement les cellules jaunes et vérifier les justificatifs. Les lignes de détail sont manuelles et non totalisées automatiquement ; la notice le dit. Un écart nul ne vaut jamais validation humaine.

Le classeur est un téléchargement statique du site ; aucune valeur utilisateur ne part avec cette requête. Ses formules se calculent localement après téléchargement. Les saisies en ligne restent fictives et locales.

Les dates de consultation encore visibles sur la base de ce lot relèvent de PR68/t_18b05dcb, déjà qualifiée indépendamment ; ne pas dupliquer ce retrait ni réintroduire ces mentions. Coordonner l’intégration du registre `src/data/pages-lastmod.json` (hotspot) et vérifier les quatre routes après les fusions. L’injection beacon Cloudflare non corrigée est une limite connue, chantier abandonné ; CSP inchangée.

Revue attendue : vérifier particulièrement départ fiscal, bascule facultative, dénominateurs, signes du contrôle et frontière NON VALIDÉ ; après PASS et CI verte, fusionner puis constater déploiement officiel, HTML des quatre routes et téléchargement .xlsx sur memlia.fr et URL Cloudflare. Transmettre ce constat à t_2caf75a7. Aucun candidat n’est déclaré publié dans ce rapport.
