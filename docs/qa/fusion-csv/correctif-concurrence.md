# Correctif F1/F2 — PR159

Reprise du FAIL QA de t_d8afa665, limitée aux deux défauts et au critère de fini. Aucune publication ni nouvelle fonctionnalité.

## Décisions et correctif

- F1 : un réordre effectif annule le Worker en attente avant de modifier l'ordre ; mapping déconfirmé, résultat invalidé, exports désactivés. Le garde d'identité du Worker rejette les réponses tardives. Une nouvelle consolidation capture les mappings du nouvel ordre. Les colonnes suivent le premier fichier réordonné : Montant/ID pour b.csv puis a.csv, valeurs 20/004 et 10/00123, provenance conservée.
- F2 : chaque requête export porte son action (copie/téléchargement), son format et la révision de validation ; le Worker les retourne sans booléen global. Invalidation ou changement de relecture rejette les exports précédents. Une copie déjà engagée auprès du navigateur ne peut pas être retirée du presse-papiers ; sa résolution tardive ne produit cependant ni faux succès ni erreur sur un lot réinitialisé.

## Tests réellement exécutés

- Avant correctif : cinq régressions concurrence exécutées dans Chromium avec le vrai Worker ; F1 et trois chevauchements F2 rouges, CSV puis copie vert. Journal `concurrence-rouge.txt`.
- Après correctif : onze régressions, répétées deux fois, 22 PASS. Les quatre ordres rapport/copie et CSV/copie sont couverts ; remise à zéro, mapping, réordre, retrait puis retour de relecture, et résolution tardive du presse-papiers aussi. Journal `concurrence-vert.txt`.
- Sur le build réel produit par Ubuntu et téléchargé depuis GitHub : onze nouvelles régressions + six contrats CSV existants, 17 PASS ; pagination, export intégral, absence d'envoi de contenu et stockage inclus. Journal `concurrence-build-ubuntu.txt`.
- `node --test tests/scripts/fusion-csv.test.mjs tests/scripts/pseudonymisation.test.mjs` : 15 PASS.
- Registre de 42 pages contrôlé à jour ; `resource:audit:qa` PASS après régénération Ubuntu, revue métier acquise conservée.

Les premières répétitions locales utilisent Astro dev et un empaquetage ciblé du vrai Worker, car son import ES n'est pas exécutable comme Worker classique non empaqueté. Aucun moteur ni réponse Worker simulé. Le test réseau existant refuse à juste titre l'URL `/src/workers/` de ce banc dev ; il est ensuite PASS sans adaptation sur le build Ubuntu (`/_astro/`). Aucun build ni suite globale exécuté sur le Mac.

## Intégration

Main intégré sans réécrire l'historique ; ajouts de preuve CSV et règle HTTP conservés avec les ajouts main. Dérivés régénérés par `npm run regen:generated` sur Ubuntu, run https://github.com/saphiron222/memlia-landing/actions/runs/37749641137 ; job de régénération SUCCESS. Le job temporaire est retiré du candidat final : workflow identique à main. L'échec des autres jobs du premier run précède l'intégration des dérivés et ne constitue pas la preuve du candidat final.

La conclusion Repository gates finale sera consignée dans le handoff de la carte après lecture GitHub. Re-revue QA à poursuivre sur F1/F2 et fini seulement ; aucune fusion main ni déploiement de production.
