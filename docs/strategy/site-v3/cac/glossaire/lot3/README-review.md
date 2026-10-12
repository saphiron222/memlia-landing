PASS — revue métier indépendante du glossaire CAC, lot 3.

Livraison de t_f87ddaa1, 11 octobre 2026.

Pièces

- review/REVUE.md : rapport motivé, portée et limites A4, consignes d’intégration.
- review/lot-review.json : avis sur le paquet d’origine, 88 motifs individuels, texte soutenu par chaque source.
- review/business-review.json : enveloppe native AI_REVIEW_PASS de la projection du seul lot 3.
- review/claims-evidence-projection.json : 50 champs rendus, 88 claims, citations et sources reliées. Cette projection n’est pas un manifeste global publiable.
- review/claims-check.json : contrôle réel du sous-contrat claims/revue de resource-pipeline et six mutations refusées.
- review/source-recheck.json et review/captures : cinq pages H2A rouvertes avec TLS vérifié, cinq copies A4 réexportées à l’identique, instants réels.
- review/format-check.log, author-mutations.log et dila-tests.log : contrôles ciblés rejoués.
- candidate/ : paquet et toutes les copies d’origine ; le candidat n’est pas réécrit.
- build-review.mjs, check-review.mjs et collect-review.py : scripts réellement exécutés. build-review matérialise les motifs déjà décidés par le reviewer ; ce n’est pas un moteur de revue sémantique automatique. Le relancer change la date de la preuve : ne pas l’utiliser pour redater l’avis acquis.

Base contrôlée

origin/main fraîche : f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f. La fonction native validateClaims est exercée par une copie temporaire de scripts/lib/resource-pipeline.mjs avec uniquement un export ajouté. Ses dépendances sont celles du dépôt. Aucun fichier suivi du dépôt n’est modifié.

Rejeu technique dans le workspace de revue :

  node check-review.mjs

Un autre environnement doit fournir un checkout de cette base en fresh-main/ avec npm ci, et le paquet parent à son emplacement durable pour la comparaison au candidat. La projection et l’avis peuvent être contrôlés directement sans regénérer la décision. Le relevé initial d’exécution reste conservé.

Intégration

Consommer le paquet parent inchangé et cet avis comme pièces de t_c7724c9d. Conserver les 64 verdicts source/claim et les 24 avis de méthode, leurs instants et motifs ; remapper les chemins candidate/ vers les pièces importées. La projection borne à sa source chaque phrase composite sur la population et sépare convention terminologique et définition normative, sans modifier le texte public. Refaire uniquement l’enveloppe de preuve du manifeste groupé, en conservant les autres revues acquises. Ne pas recopier comme empreinte du manifeste global celle de la projection de ce lot.

Les sources DILA portent leur collecte originale, pas le jour du réexport ; aucune visite Légifrance n’est prétendue. Réserve A4 et clause d’application NEP 330 préservées. Les dates et le chrome ne déclenchent pas une seconde revue du fond inchangé. Les fichiers globaux, leur scellement, la CI et la production restent à l’intégrateur ; rien n’est publié ici.
