PASS — D1 levé : un montant N-1 ou N absent est refusé avant calcul, sans conversion en zéro ni taux infini dans les cas contrôlés.

# Re-revue métier ciblée — 2026-10-06

Reviewer : metier. Même candidat revue-analytique-cac. Contrôle limité au défaut D1 et au critère de levée de la première revue ; aucune nouvelle revue globale ni réouverture des sources réglementaires. L'intégralité du rapport initial est conservée ci-dessous comme historique, avec son verdict FAIL de première revue.

## Résolution de D1 et preuves exécutées

- Correction lue : `preuves/rejouer.mjs:6` vérifie `Number.isFinite(previous)` et `Number.isFinite(current)` avant la soustraction et le calcul du taux, lignes 7–8. Le statut `montant-absent-ou-invalide` conserve delta, percentage et conclusion à null. La ligne `corps.md:31` décrit un montant N-1 ou N absent sans écart ni taux, à obtenir avant comparaison.
- Cas décisif : `compare(null, 8000, true)` retourne `{ status: 'montant-absent-ou-invalide', delta: null, percentage: null, conclusion: null }`. `compare(8000, null, true)` retourne la même exception. Aucun de ces cas ne reçoit `critere-examen` ou `sous-critere` ; les champs null sont vérifiés avant et après sérialisation JSON.
- Distinction maintenue : `compare(0, 8000, true)` reste `base-nulle`, delta 8 000 et taux null ; `compare(null, 8000, false)` reste `compte-nouveau`. Le montant absent d'un compte présent n'est donc ni une base explicitement nulle ni un compte nouveau.
- Rejeu réel d'une copie inchangée du script dans `/Users/kevinkitanga/.hermes/profiles/metier/cache/scratch/re-revue-cac-d1-p9pGgG/rejouer.mjs` : code de sortie 0, « 9 cas fictifs PASS ; saisies préservées et aucune conclusion produite. » Les sorties concordent avec `preuves/rejeu.json`, hors seul horodatage executedAt. Les nouveaux cas `montant-comparatif-absent` et `montant-courant-absent` sont présents ; les sept cas antérieurs restent PASS.
- Contrôle indépendant des valeurs brutes : mêmes corps de fonctions dans un contexte Node VM, écriture de fichier interceptée ; adaptation de l'URL de module et du clonage de l'objet utilisateur pour le contexte VM seulement. Aucun NaN, Infinity ou -Infinity dans les sorties des neuf cas avant JSON. Des appels directs à `compare` confirment également le refus de null, undefined, NaN, Infinity, -Infinity et de la chaîne '0' sur chaque période, avant arithmétique.
- Commande de contrôle : `node /Users/kevinkitanga/.hermes/profiles/metier/cache/scratch/re-revue-cac-d1.mjs`. Résultat final : code de sortie 0, verdict D1 PASS. Les deux premières tentatives du harnais indépendant avaient échoué sur l'environnement VM (import.meta puis prototypes de clonage), pas sur la règle ; le harnais a été corrigé dans le scratch, sans modification du candidat.

Critère de levée atteint : exception nommée pour N-1 absent d'un compte présent, aucun écart ni taux calculé, aucun classement ordinaire, cohérence après JSON, distinction zéro/compte absent et résultats antérieurs conservés. Aucune correction métier supplémentaire requise au titre de D1.

## Limites inchangées et fichiers

Le contrôle porte sur ce démonstrateur fictif ; il n'établit pas une intégration livrée, une persistance des saisies ou une conformité de dossier. Les inconnues de la première revue restent inchangées, sans nouveau motif de FAIL. Build recette seule annoncé PASS, non relancé ici ; image, rendu et publication restent à dev. Aucun Kanban ni aucune action Git. Seuls `revues.json` et `revue-metier.md` sont modifiés dans le dossier candidat ; `preuves/rejeu.json` n'a pas été réécrit. Les fichiers du candidat ont été contrôlés inchangés pendant l'exécution des essais, avant rédaction de ce verdict.

# Première revue — historique conservé

Verdict initial : FAIL — une absence de montant N-1 était convertie en zéro dans le démonstrateur, contrairement à la règle annoncée. Les constats ci-dessous décrivent la version initialement examinée ; leur résolution est consignée ci-dessus.

# Revue métier indépendante — revue analytique CAC

Date : 2026-10-06. Reviewer : metier, profil IA indépendant de l'auteur marketing ; ni avocat, ni expert-comptable humain, ni autorité administrative.

Périmètre : recette.json, corps.md, preuves/sources.json, preuves/rejeu.json et preuves/rejouer.mjs. Références : charte v5 du 6 octobre 2026 dans le workspace t_c5695136 et grille ~/hermes/recherche/audit-legal-revue.md, §5. Première revue de ce candidat, sans réécriture et sans publication.

## Défaut matériel unique et correction requise

**D1 — Montant comparatif absent d'un compte présent : absence traitée comme zéro.**

- Engagement contrôlé : corps.md:19, « L'absence de valeur N-1 reste une absence ; elle n'est pas remplacée silencieusement par zéro. » La frontière et les explications sur l'absence se trouvent également aux lignes 13, 25–30 et 74–76.
- Localisation : preuves/rejouer.mjs:4–9. Seule l'absence du compte (`exists === false`) est traitée avant le calcul. Aucune garde ne traite le montant N-1 manquant d'un compte présent.
- Preuve exécutée : les fonctions originales, extraites sans modification dans un contexte Node VM, retournent pour `compare(null, 8000, true)` : `status: 'critere-examen'`, `delta: 8000`, `percentage: Infinity`, `conclusion: null`.
- Cause : JavaScript convertit ici `null` en zéro dans la soustraction et dans `Math.abs(previous)`. Le test strict `previous === 0` ne reconnaît pas `null` ; le taux devient infini et le classement d'examen est activé. Lors d'une sérialisation JSON, `Infinity` devient `null`, ce qui masque ce taux invalide sans corriger le calcul ni le statut.
- Impact métier : un montant absent produit un écart chiffré injustifié et un classement comme variation ordinaire à examiner. L'équipe peut croire la comparaison possible alors que la base comparative manque. La distinction compte nouveau/base nulle du jeu existant ne couvre pas cette absence de montant. Ce défaut affecte la méthode démontrée et la condition d'arrêt promise, pas le jugement ni l'opinion du CAC.
- Correction requise à l'auteur : détecter l'absence du montant comparatif avant tout calcul, la conserver sous un statut explicite distinct de zéro et de compte nouveau, et compléter le jeu d'essai avec un compte présent dont le montant N-1 est absent. Ne pas présenter une valeur manquante comme un solde nul.
- Critère de levée : pour un compte présent, N-1 absent et N = 8 000, obtenir une exception nommée, aucun delta ni taux calculé et aucun statut ordinaire `critere-examen`/`sous-critere`. Le résultat doit rester cohérent après sérialisation JSON. Les cas déjà fournis doivent continuer à distinguer N-1 explicitement nul et compte absent, et conserver leurs résultats attendus. La re-revue éventuelle porte sur D1 et ce critère, pas sur un nouveau périmètre.

Le FAIL repose uniquement sur D1. Le candidat n'a pas été corrigé.

## Rejeu effectué et constats établis

Le script a été copié sans changement dans un dossier temporaire du profil metier : son écriture automatique de rejeu.json n'a donc pas touché la preuve du candidat.

Commande exécutée :
`node /Users/kevinkitanga/.hermes/profiles/metier/cache/scratch/revue-cac-t_0cd26f80/rejouer.mjs`

Résultat réel, code de sortie 0 : « 7 cas fictifs PASS ; saisies préservées et aucune conclusion produite. » Un contrôle Node indépendant a vérifié l'identité du script copié et l'égalité des sorties avec preuves/rejeu.json, hors seul horodatage executedAt.

| Cas | Résultat constaté |
|---|---|
| Base explicitement nulle | Écart 12 000 ; taux null ; statut base-nulle. |
| Compte nouveau absent de N-1 | Delta et taux null ; statut compte-nouveau, distinct de base-nulle. |
| Reclassement non validé | Aucun calcul regroupé ; correspondance-a-valider. |
| Reclassement validé fictivement | Écart et taux nuls ; presentationChanged: true ; montants d'origine conservés dans les entrées du jeu. |
| Changement de signe | Écart −12 000 ; taux −120 ; statut changement-signe. |
| Variation ordinaire | Écart 6 000 ; taux 30 ; critere-examen selon les paramètres fictifs. |
| Saisie séparée de la génération | Commentaire inchangé dans l'objet utilisateur ; conclusion générée null. |

Contrôles complémentaires sur les fonctions originales : un changement de signe de 100 vers −20 reste signalé malgré un écart absolu inférieur au critère fictif ; un compte présent avec N-1 explicitement nul reste base-nulle. En revanche, l'absence de montant d'un compte présent produit D1.

Toutes les sorties générées examinées ont `conclusion: null`. Aucun code ne produit d'opinion. Le test de commentaire démontre la séparation de deux objets en mémoire ; il n'établit pas une persistance dans un dossier réel ni la migration d'une conclusion humaine déjà renseignée. Cette limite est compatible avec la qualification explicite de démonstrateur, non d'automatisation livrée (preuves/rejeu.json:9 ; corps.md:36 et 58).

## Sources réglementaires vérifiées

Les deux pages officielles H2A ont été rouvertes le 2026-10-06, avec lecture du contexte, de la version et des cinq extraits demandés. Il s'agit des reproductions institutionnelles des normes homologuées, non d'un agrément Memlia ; aucune consolidation exhaustive de LEGI ni authentification d'un téléchargement JORF n'est revendiquée.

**NEP 315**, arrêté du 13 novembre 2024, JO du 19 novembre 2024, article A.821-72. La page indique l'application aux missions de certification relatives aux exercices ouverts à compter de sa publication au JO, soit le 19 novembre 2024. Le champ est consigné dans preuves/sources.json:24 ; le corpus ne prétend pas appliquer rétroactivement cette révision à tous les exercices.

Source : https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/

- §14 : « Ces outils et techniques automatisés se distinguent des plateformes et logiciels d’audit utilisés pour documenter les travaux du commissaire aux comptes. » Extrait concordant.
- §46 : « Pour ce faire, il apprécie : » puis « la manière dont les outils fonctionnent ; et » et « le degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils. » Extrait concordant. Le contexte porte sur l'aide à l'identification et à l'évaluation des risques et sur l'atteinte de l'objectif des procédures avec esprit critique : ce n'est pas une homologation de l'outil.
- §48 d) : « Les éléments d’appréciation des outils et techniques automatisés visés au paragraphe 46. » Extrait concordant, dans la documentation au dossier par le CAC.

**NEP 520**, arrêté du 13 novembre 2024, JO du 19 novembre 2024, article A.821-77. La page consultée ne comporte pas la clause particulière d'application par exercice de la NEP 315 ; celle-ci n'est pas transposée à la NEP 520 par analogie.

Source : https://h2a-france.org/normes/procedures-analytiques/

- §05 : « Procédures analytiques de substance : procédures analytiques menées en déterminant les montants ou ratios attendus dans les comptes et les écarts jugés acceptables entre ces montants ou ratios et ceux enregistrés. » Extrait concordant.
- §09 : « Lorsque les procédures analytiques mettent en évidence des informations qui ne sont pas en corrélation avec d’autres informations ou des variations significatives ou des tendances inattendues, le commissaire aux comptes détermine les procédures d’audit à mettre en place pour élucider ces variations et ces incohérences. » Extrait concordant.

Le corps, lignes 46–48 et 60, restitue correctement ces frontières : N/N-1 n'est pas une démarche d'audit complète ni une procédure analytique de substance complète ; les attentes, les écarts acceptables et les suites restent professionnels. La fiche outil, lignes 40–42 et 60, est un livrable Memlia proposé, pas un document normativement prescrit ou homologué.

## Grille de dix points

| N° | Résultat | Motivation et preuve |
|---|---|---|
| 1. Population et mission | Satisfait | Cabinets CAC, préparation de comparaisons pour la certification ; aucune assimilation EC/CAC, aucun seuil de nomination ni régime ALPE/EIP/PE universalisé. recette.json:10,16 ; corps.md:5. |
| 2. Source, version et calendrier | Satisfait | Cinq extraits concordants, versions 2024 et champ de NEP 315 vérifiés ci-dessus. Aucun texte ancien présenté comme une nouvelle règle 2026. |
| 3. Titre, opinion et responsabilité | Satisfait | Le CAC désigne le lecteur, pas Memlia. Constats, questions et calculs seulement ; diligences et conclusions humaines. corps.md:13–17,46–48,58 ; toutes les sorties examinées ont conclusion null. |
| 4. Indépendance et autorévision | Hors champ motivé pour un cumul de fonctions | Aucun service de production des comptes, cumul préparation/audit des mêmes comptes ou mutualisation EC/CAC vendu comme garanti. L'indépendance d'une mission réelle n'est pas évaluée par cette page. |
| 5. Secret et données | Satisfait au niveau éditorial | Flux, accès, support et éventuels tiers à inventorier ; absence de transfert expressément non déduite du classeur. corps.md:52–54. Jeu fictif, aucune donnée client ni certification de sécurité. Architecture réelle à vérifier avant usage. |
| 6. Méthode, données et reproductibilité | Défaut matériel D1 | Sept cas reproductibles et paramètres explicites, mais montant N-1 absent d'un compte présent converti en zéro ; condition déterminante de la règle annoncée non tenue. |
| 7. Diligences et exceptions | Défaut matériel D1, même cause | Seuils, fiabilité, attentes et travaux complémentaires bien réservés au CAC. Reclassement et inversion de signe visibles. L'absence de montant peut néanmoins être traitée comme comparaison ordinaire au lieu d'exception. |
| 8. Documentation et réversibilité | Satisfait dans le périmètre éditorial | Sources non modifiées, saisies séparées, version de règle et points ouverts annoncés ; aucune garantie d'archivage/conformité. corps.md:17,40–42,52,80–88. Persistance réelle non démontrée par le simple jeu en mémoire. |
| 9. LCB-FT et durabilité | Hors champ motivé | Ni TRACFIN, ni obligations de durabilité, ni automatisation de ces décisions dans ce candidat. |
| 10. Preuves commerciales et compréhension | Satisfait, sous réserve du traitement de D1 | Service récurrent maintenu distinct d'un tableau autonome ponctuel, corps.md:58,66. Jeu explicitement fictif, pas de gains chiffrés, témoignage ni intégration éditeur prétendue. Zéro suggestion ne vaut pas volume de recherche, recette.json:16. Aucun outil tiers n'est déclaré gratuit. |

## Charte v5 et limites de livraison

Le corpus respecte le positionnement service : observation, règle écrite à quatre parties, frontière en trois colonnes, proposition distincte des saisies, recette fictive, maintenance et prix à la tâche plutôt qu'au siège. Il ne présente ni logiciel Memlia, ni audit automatisé, ni conformité aux NEP, ni caution H2A/CNCC. Le point de charte sur l'arrêt dans le doute est précisément celui que D1 met en échec dans le démonstrateur.

L'absence attendue de SERVICE_DESIGN n'est pas un défaut métier et le build n'a pas été relancé. Image, cadre HTML, rendu public, liens entrants réellement disponibles et publication appartiennent à dev t_fa16682f. Les éventuelles dates de rejeu et références internes affichables sont à traiter dans ce rendu, sans nouvelle revue du fond. Aucun fichier commercial/services ou src/content/services n'a été généré ni introduit sur main ; aucun commit, push, merge ou déploiement effectué. Aucune carte Kanban touchée.

Inconnues restantes non utilisées comme nouveaux motifs de FAIL : formats et éditeurs réellement intégrés ; cartographie technique des données d'une future livraison ; preuve de persistance et de versionnement des saisies ; résultat de recette sur le périmètre d'un cabinet ; rendu et maillage finaux. Le PASS du jeu fourni ne prouve pas ces propriétés, et le corpus ne le prétend pas.

Livrables de cette revue : revues.json et le présent revue-metier.md. Une correction ultérieure se contrôle sur D1 et son critère de levée.
