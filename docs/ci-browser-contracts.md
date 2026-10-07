# CI : réutiliser la sortie validée

Le job `Repository gates` conserve toutes ses étapes : dépendances verrouillées,
Chromium, contrôle Astro/contenu, forge blog, cadres Chromium, build avec contrôles
déterministes, puis suite navigateur complète.

L'étape navigateur lance `node scripts/ci-browser-contracts.mjs` : elle sert le
`dist` du build précédent avec l'API `preview()` d'Astro, sur loopback et un port
attribué par le système. `QA_URL` transmet cette adresse à Playwright, dont le
`webServer` reste désactivé dans ce mode. Le serveur appartient à cette invocation,
est arrêté dans `finally`, et la fermeture effective est attendue. Le code de
sortie des tests est conservé ; SIGINT et SIGTERM sont transmis au processus enfant.
Il n'y a ni serveur partagé ni relance de `build:site` dans cette étape.

La commande locale `npm run test` reste inchangée : sans `QA_URL`, elle reconstruit
le site avant la recette. La commande CI doit être précédée d'un `npm run build`
réussi, et ne remplace jamais ses contrôles.

Vérification ciblée : `node --test tests/scripts/ci-browser-contracts.test.mjs`.
Deux fixtures réelles sans commande de build servent des contenus déjà construits
sur des ports distincts, puis leurs serveurs sont inaccessibles après fermeture.
Un échec enfant reste un échec de la commande propriétaire.

## Capacité du Mac : décision du 6 octobre 2026

Le second runner est conditionné à une marge RAM suffisante avec la charge des
workers. À 00:48–00:49 CEST : 16 Gio de RAM, 10 CPU, swap utilisé 3965,88 Mio,
pression mémoire noyau à 2 et load average 72,73/71,30/67,25. Cette mesure ne permet
pas d'autoriser une deuxième CI lourde : aucun runner supplémentaire n'est installé.
La suppression du double build ne prouve pas un doublement du débit.

Baseline verte GitHub : run `37374347963`, job `111979017211`, le 5 octobre 2026,
21:11:45–21:25:43 UTC. Comparer la durée du job (hors file d'attente) et chaque
étape à la CI candidate ; les différences de charge et de contenu empêchent
d'attribuer tout l'écart au seul correctif. Les deux PR simultanées vertes restent
un critère non démontré tant que la capacité sûre n'est pas disponible.
