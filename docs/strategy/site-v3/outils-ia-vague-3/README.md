# Vague 3 — dix briefs prêts pour développement

## Résultat de cette carte
Dix briefs produit/SEO, dix routes et intentions distinctes, scénarios d'usage attendus, maillage, sources et matrice complète SEO/Blog. Aucune page nouvelle ni modèle IA public n'est livré par le cadrage.
Branche : strategy/outils-ia-t_6c7dba9d, depuis origin/main c4a399c8. Seul docs/strategy/site-v3/outils-ia-vague-3/ est modifié. Les quatre articles IA ne sont pas conditionnés par ces outils.

## Ordre de lecture
1. CONTRAT-COMMUN.md : décisions communes et architecture, traitement local/distant, design et fini public.
2. contrat-routes.json : contrat FINAL des routes, primaires, catégories et cartes ; les propositions de matrice/preuves sont antérieures à l'arbitrage final et n'ont pas priorité.
3. Brief 01 à 10 : entrées/sorties, interaction complète, exceptions, plan statique, sources, tests, scène propre et entrants.
4. recherche-et-sources.md et demande-autocomplete.json : preuves de marché, limites et sources réellement ouvertes.
5. matrice-skills.md/json et preuves-skills.md : tous les skills chargés, 640 cellules par outil et traces de cadrage ; les lignes différées restent du travail de développement/publication, pas des PASS.
6. VERIFICATION.md : contrôle documentaire et test registre existant réellement exécutés.

## Cartes et chaîne
| Outil | Brief | Carte dev |
|---|---|---|
| 01 générateur cabinet | 01-generateur-prompt-expert-comptable.md | t_371a73be |
| 02 bibliothèque | 02-bibliotheque-prompts-comptables.md | t_cb184759 |
| 03 assistant réel | 03-assistant-ia-comptable.md | t_badb4d88 |
| 04 charte | 04-generateur-charte-ia-cabinet.md | t_ef550f25 |
| 05 FEC | 05-verificateur-fec-local.md | t_38b4100f |
| 06 prompt générique | 06-generateur-prompt-ia-gratuit.md | t_d71914cd |
| 07 vérificateur prompt | 07-verificateur-prompt-ia.md | t_aff5d6e9 |
| 08 maturité | 08-diagnostic-maturite-ia-cabinet.md | t_54545d77 |
| 09 ROI | 09-calculateur-roi-automatisation.md | t_e5ca28b3 |
| 10 préparation fichier | 10-preparer-pseudonymiser-fichier-csv-fec.md | t_163dc43d |

Les six cartes 05–10 manquantes ont été créées et attendent ce cadrage. 02/06/07 attendent aussi publication du moteur 01 (t_6d974686) pour réutiliser le code intégré plutôt que copier une branche en cours. 01 conserve PR51, QA t_b3f1ff96 et publication t_6d974686. Les autres cartes créent leur phase revue/livraison si nécessaire ; fini public constaté downstream, pas dans ce document.

## Arbitrages à retenir
- Le primaire de 01 devient « générateur prompt expert comptable ». L'article existant garde « prompt chatgpt expert comptable », la bibliothèque sélectionne, le contrôleur analyse. Les dix routes proposées par la matrice sont conservées, les catégories sont décidées dans le contrat final.
- L'outil 10 garde le besoin de préparation avant IA mais s'appelle pseudonymisation, pas anonymisation garantie. CSV/FEC texte, limites affichées ; risque résiduel évalué.
- 03 doit répondre avec un vrai modèle. Backend distant isolé ; découvrir accès et coût avant lancement. Aucun secret ou budget n'est supposé acquis, aucun formulaire simulant une IA.
- La charte est une trame non officielle ; FEC un contrôle structurel non certifiant ; ROI un scénario et non un gain promis.
- Neuf des onze formulations actualisées n'ont pas de suggestion. Ce résultat ne retire aucun besoin autorisé et ne justifie aucune promesse de trafic. L'usage entier et les parcours utiles sont prioritaires.

## Corrections issues de la lecture des skills
Le validateur SEO actuel ne reconnaît pas le type outil : extension et tests à faire par dev. Les routes Astro sont explicites : ajouter un objet de registre ne crée pas la page. Le layout/FAQ/garanties/hub disent tout-local : les séparer réellement pour 03. Préserver et reprendre les corrections gabarits du lot A t_235498b2 sans écraser PR51.

## Limites honnêtes
64 définitions chargées intégralement, classement exhaustif ; application ciblée des méthodes de cadrage, pas lancement de tous audits/connecteurs. Les données de recherche sont de vraies sondes/autocomplétions et des pages ouvertes, sans volumes mensuels ni SERP France reproductible. Aucune évaluation de fournisseur IA, aucun résultat FEC/pseudonymisation de production, aucune mesure de croissance prétendue. Les sources réglementaires actuelles nécessaires aux clauses/règles finales seront ouvertes par dev/metier.
