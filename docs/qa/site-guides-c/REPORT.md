# Lot C — portée des neuf guides d’environnement

Candidat préparé le 4 octobre 2026 depuis origin/main après le lot B. Sources éditeurs rouvertes le même jour, copies dans `sources/`, index dans `sources.json`. Les neuf URL, canonicals et visuels sont conservés. Publication initiale du 20 septembre conservée ; révision de fond datée du 4 octobre.

## Décisions par guide

| Guide sous /integrations/ | Correction ou maintien motivé |
| --- | --- |
| rapprochement-bancaire-sage | Source remplacée par la fiche des zones du rapprochement manuel (11/02/2024). N/N-1 concerne les cumuls lorsqu’on sélectionne un exercice autre que le plus ancien ; le cas N-2 est une exclusion de notre illustration, pas une limite générale de Sage. Suppression de l’accès « Entrée » non établi. Outil lié = contrôle de soldes + CSV, pas appariement. |
| lettrage-sage | Deux accès maintenus, documentés par la fiche du 05/09/2023. Le piège décrit désormais la différence d’incrémentation des codes par tiers ou collectif. Équilibre/tolérance distingués comme convention du cabinet ; suppression de l’attribution d’écritures d’écart à cette source. |
| dsn-sage | L’ancienne fiche 211010160115920 vise Sage Business Cloud Paie / Sage Service Paie, et non Sage 100. Remplacement par la FAQ contrats sociaux Sage Paie / Sage 100 Paie & RH du 12/06/2024. Grille et exemples ciblent option A déclarer DSN, référence et plage de transfert. Aucune conformité exhaustive DSN ni consigne ARRCO/AGIRC actuelle déduite de l’ancienne fiche. |
| bulletin-de-paie-sage | L’ancienne FAQ 211010160115059 vise Sage Business Cloud Paie / Sage Service Paie. Remplacement par la note v4.11 Sage 100 Paie & RH non hébergée du 04/04/2023, explicitement historique. Accès aux éditions de bulletins clarifiés 2022 seulement ; aucune recommandation d’utiliser cette version en 2026. Recalcul automatique et verrouillage retirés des affirmations produit ; invalidation d’un contrôle après changement = convention du cabinet. |
| saisie-comptable-sage | Accès Fenêtre / Traitement / Saisie par lot et limites de contexte maintenus sur fiche du 30/08/2023. Mention .LOT ; chaque champ précise son rôle. Doublon interne distinct de contrôle du dossier complet. |
| cloture-sage | Liste des étapes corrigée selon la fiche TDFA du 31/10/2024 : contrôles/intégration, sauvegardes, journaux, nouvel exercice, reports définitifs, clôture exercice, FEC. Distinction guide v8 et antérieures conservée. La fiche pose la question du refus caisse ; elle ne démontre pas toutes ses causes, donc cas de caisse créditeur présenté comme règle illustrative. |
| lettrage-cegid | Source API JSON maintenue, pas de version ni de date de modification affichée. Faux menu supprimé. Clés corrigées en journal/date/compte/tiers/debit.amount/credit.amount ; codeLettrage et refPiece conservés. Compte général ou tiers lettrable ; création d’une demande d’import distincte de son succès final. Aucun appel exécuté. |
| dsn-silae | Page DSN éditeur accessible mais commerciale : cycle et CRM maintenus comme repères, pas comme preuve technique de menus. Grille de cadrage, aucune version inventée. Les taux PAS et AT/MP sont des informations à contrôler avec le gestionnaire, pas des champs natifs prouvés par cette page. |
| bulletin-de-paie-silae | Collecte, production, contrôle/validation et distribution maintenus comme étapes de la présentation commerciale. Champs et comparaison par rubrique qualifiés comme grille de cadrage, sans procédure d’interface testée. |

## Citations primaires déterminantes

Les copies de source contiennent notamment :

- Sage zones : « Fichier comptable contenant plus d’un exercice et sélection d’un exercice autre que le plus ancien », puis « Somme de toutes les écritures saisies sur l’exercice précédent et sur l’exercice courant dans le journal de trésorerie. »
- Sage lettrage : « Dans la gestion des tiers, lorsque le lettrage y est effectué, le code lettrage est propre à chaque tiers. »
- Sage contrats DSN : « Il est nécessaire de réaliser un transfert DSN sur une plage de date au moins équivalente à celle du contrat social afin de mettre à jour la base DS. »
- Sage bulletin : « Cette fiche décrit les nouveautés contenues dans la v4.11 de Sage 100 Paie & RH (non hébergée) ». La portée est celle de cette note, pas celle de règles sociales 2026.
- Sage saisie lot : « les écritures sont stockées dans ce fichier, elles n’alimentent pas directement le fichier comptable » ; « il ne sera pas possible d’afficher les soldes des comptes, de lettrer ... »
- Sage TDFA : « Génération des reports à nouveaux définitifs » précède « Clôture de l’exercice » dans la liste ; « Pour les versions 8 et antérieures, le guide ci-dessous est toujours disponible ».
- Cegid : « Soit le compte général est lettrable, soit le tiers l’est » ; « Le paquet lettré doit être équilibré (débit = crédit) pour un même compte lettrable. »
- Silae DSN : « Chaque bulletin de paie généré alimente directement votre DSN ». La FAQ commerciale évoque télédéclarations et CRM ; elle ne prouve pas une version d’interface.
- Silae paie : « Contrôle et validation des cycles de paie » et « Distribution des bulletins de paie dématérialisée ».

Sonde HTTP réelle : `curl -sSL -o /dev/null -w '%{http_code} %{url_effective}\n' https://www.silae.fr/conformite-dsn/` a rendu `200 https://www.silae.fr/ressources/conformite-dsn/` le 04/10/2026. L’extraction retrouve un article, contrairement à la redirection vers l’accueil observée par l’audit. Aucun menu n’en est déduit ; le guide conserve sa source commerciale propre, pas un tutoriel concurrent.

## Preuves de simulation et frontières

Aucun journal exécutable ne soutient les 27 lignes des neuf tableaux. Leur titre devient « Cas illustratifs sur données fictives », avec « État attendu » et « Trace attendue », y compris en mobile. Le texte précise que le visuel est une simulation locale de présentation et qu’aucun essai éditeur n’est rapporté. Les visuels canoniques restent inchangés ; ils ne deviennent pas des captures produit. Les trois frontières Préparé / À valider / Reste humain sont maintenues.

Le renvoi du service bancaire décrit lui aussi le contrôle de soldes fictifs et le CSV, sans appariement de mouvements. Aucun corps d’article, formulaire, image publique ou calcul d’outil n’a changé.

## Vérifications exécutées

- Avant correction : quatre nouveaux tests de portée en échec, dont JSON présenté comme menu et absence de portée produit.
- Après correction : 22 contrats ciblés PASS (4 données/portée, 10 HTML, 8 intégrations existants).
- HTML servi par Astro preview : 10 contrats PASS.
- `npm run check` : 0 erreur, 0 avertissement, 8 hints existants.
- `npm run build` : PASS, dont 124 tests Python et suite scripts de 589 tests, sans échec ; audit ressources PASS.
- `npx playwright test tests/browser/integrations.spec.ts` : 9 PASS, neuf guides aux largeurs 320/375/768/1024/1440/1920, maillage et accès sans JavaScript.
- Quatre captures Cegid/Silae, 375 et 1440 px, réalisées sans JavaScript pour lire toute la page sans état transitoire des animations. Inspection mobile Silae : huit cartes et trois frontières présentes, pas de troncature ni de débordement.
- `git diff --check` : PASS. Images publiques inchangées.

Un avancement indépendant de main (PR63, planification blog) a été intégré par fast-forward avant le build complet ; aucune modification du planificateur par ce lot.

## Revue et publication à effectuer par métier

Relire le candidat et ses sources, particulièrement les portées Sage paie/DSN, la version historique 4.11 et l’ordre TDFA. Une seule revue métier porte sur ce fond. Après PASS et Repository gates SUCCESS : fusionner la PR, constater Cloudflare Pages SUCCESS, puis rejouer sur l’URL de déploiement et sur https://memlia.fr :

    QA_URL=https://<deployment>.memlia.pages.dev node --test tests/scripts/integration-scope-html.test.mjs
    QA_URL=https://memlia.fr node --test tests/scripts/integration-scope-html.test.mjs

Le contrôle doit rendre 10 PASS sur chaque cible, sans query string, avec sources datées, canonicals, neuf médias et mentions de portée. Transmettre le résultat et les URLs à t_2caf75a7, puis clore pour libérer le lot D t_7e236be7. Cette implémentation n’annonce pas une publication avant ces preuves.

Risque résiduel : aucune recette dans Sage/Cegid/mySilae n’a été effectuée ; c’est désormais dit explicitement. Les dépendances installées signalent 1 vulnérabilité modérée et 2 hautes, préexistantes ; aucune mise à jour hors périmètre.
