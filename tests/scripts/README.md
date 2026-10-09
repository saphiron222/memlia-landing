# Fixtures temporaires des tests Node

Enregistrer le nettoyage immédiatement après `mkdtempSync`, avant la copie, l’écriture ou toute autre préparation qui peut échouer : `t.after` pour une fixture propre au test, `test.after` pour un helper partagé. Garder les `finally` existants pour libérer immédiatement les fixtures ; le nettoyage de secours utilise `rmSync(root, { recursive: true, force: true })`.

Une préparation partagée asynchrone doit vivre dans `test.before`, avec `test.after` enregistré avant elle : un hook placé après une assertion au niveau du module n’est jamais atteint si cette assertion échoue. Lors de plusieurs fermetures asynchrones, imbriquer les `finally` pour qu’un échec de fermeture du navigateur ne saute pas la suppression du répertoire.

`node --test tests/scripts/fixture-cleanup.test.mjs` lance les suites dans des sous-processus dont `os.tmpdir()` pointe sur un dossier isolé. Le test compare son contenu avant/après, sans toucher aux temporaires d’autres workers. Il vérifie le succès de blog-intent, l’échec après copie partielle, l’échec d’une assertion, les préparations des helpers et l’échec d’une allocation successive. Le contexte `NODE_TEST_CONTEXT` du parent n’est pas transmis au nouveau runner Node.

Les témoins succès/assertion de blog-intent exigent le HTML dans `dist` et sont ignorés sans ce préalable. En CI, `npm run build` construit `dist` avant `test:scripts`, qui découvre automatiquement ce test ; « Repository gates » reste la preuve du build complet. Sur le Mac, rejouer seulement les tests ciblés avec le HTML réellement construit ou servi, jamais avec une page inventée pour les faire passer.
