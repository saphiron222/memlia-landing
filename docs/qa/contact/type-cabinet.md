# D7 — type de cabinet et provenance

Le formulaire `/contact` ajoute un seul choix facultatif, sans présélection : `type_cabinet` vaut `ec`, `cac` ou `mixte`. Une valeur absente ou hors liste donne `NULL` et ne bloque pas l'envoi. Les demandes historiques ne sont pas qualifiées rétroactivement.

`origine` reste le chemin interne du référent, sans paramètres ni ancre, uniquement après l'accord distinct existant. Aucun référent externe n'est conservé. Le type n'est jamais déduit de cette page. La notification Telegram reste sans données personnelles ; les deux champs sont lisibles dans `npm run contact:messages`.

## Mise en service

1. Avant fusion, vérifier `PRAGMA table_info(messages)` sur `memlia-contact` : `origine` existe déjà. Si `type_cabinet` est absent, appliquer une seule fois `db/contact/0002-type-cabinet.sql` avec un accès D1 en écriture. Vérifier ensuite la colonne et le nombre de lignes historiques (inchangé).
2. Fusionner la PR après CI verte et QA PASS ; laisser la publication automatique de main faire le déploiement.
3. Envoyer volontairement une demande fictive identifiée « TEST D7 », depuis une page interne, avec choix du type et accord d'origine. Lire uniquement son identifiant, `recu_le`, `type_cabinet` et `origine` en D1 et vérifier les deux valeurs. Ne pas contourner Turnstile en production.
4. Consigner la date d'activation et l'identifiant du test pour le rapport I1 ; exclure ce test des demandes commerciales mesurées. Aucun envoi de production ni date d'activation ne sont revendiqués avant cette étape.

## Vérification locale

Deux tests ajoutés ont échoué avant l'implémentation (valeur manquante), puis passent. Le test `contact-cabinet-storage.test.mjs` exécute la fonction réelle et la migration sur SQLite en mémoire : seul le service anti-abus est simulé. Il vérifie l'écriture des deux champs, la conservation de l'historique et la contrainte de valeurs.

Les tests navigateur vérifient les trois choix, l'envoi avec et sans sélection, l'accord/refus/retrait de provenance et la remise à zéro après succès. Le champ utilise les styles et le focus des autres champs.

QA indépendante locale : PASS. La migration distante reste obligatoire avant fusion ; un jeton D1 lecture seule ne suffit pas.
