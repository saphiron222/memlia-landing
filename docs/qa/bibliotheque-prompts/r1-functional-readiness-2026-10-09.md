# Recette R1 : attendre la reprise fonctionnelle du générateur

Carte t_520b86f5 — 9 octobre 2026. Périmètre : synchronisation de la recette navigateur, sans changement de bibliothèque, de générateur ou de configuration Cloudflare/CSP.

## Reproduction et cause

Sur memlia.fr, le fichier original `prompt-qa-reprise.spec.ts` rejoué avec `--grep R1 --trace on` donne un PASS immédiat et un FAIL avec destination différée : éditeur vide. La trace réseau confirme que l'URL du générateur et son HTML sont disponibles avant l'exécution complète des modules JavaScript. Le test coche déjà `confirmed` pendant cette fenêtre.

La trace fraîche distingue le mécanisme du constat historique de t_9c1fb76f : ici aucun GET natif du formulaire n'est observé. Le module appelle sa reprise après la confirmation anticipée ; `hasContent()` détecte cette saisie et ouvre « Charger le modèle de la bibliothèque dans les choix ? ». Playwright refuse ce dialogue sans gestionnaire, le modèle n'est pas repris et la soumission ne produit pas le prompt attendu. La trace historique observait une soumission native prématurée ; les deux effets viennent d'une interaction avant initialisation, mais ne sont pas confondus.

## Correction de la recette

`assembleModel` attend par assertions réessayées les six valeurs de `model.seed` (description, tâche, entrée, format, validateur, arrêt) avant de cocher la confirmation et d'assembler. Les valeurs sont lues sur le formulaire réel ; aucun remplissage par le test, dialogue accepté automatiquement, attente `networkidle`, délai ajouté ou nouvelle marque de disponibilité dans le produit. L'import synchronisé du modèle est un état fonctionnel observable. Un module manquant ou un transfert défectueux fait échouer cette étape, il n'est pas réparé par le test.

R1 immédiat et différé utilisent cette attente ; R3, autre adaptation suivie d'un assemblage dans le même fichier, utilise le même chemin. Le délai de destination déjà présent reste une injection de panne, pas une attente de disponibilité.

## Non-régression et preuves

Un test supplémentaire bloque le module réel du générateur après son identification dans le document. Il vérifie que l'assemblage refuse de continuer sur l'assertion de reprise, laisse la confirmation décochée et l'éditeur vide, et n'émet aucune navigation de soumission avec paramètres. Le délai maximal est celui de l'assertion Playwright, pas une temporisation de synchronisation.

Rouge : avec le corps antérieur d'assemblage (sans assertions), ce test échoue car la promesse résout au lieu de refuser l'assemblage. Vert : avec les assertions fonctionnelles, les 18 tests de ce fichier passent sur memlia.fr, y compris les deux R1, les 14 R2, R3 et le module bloqué. Les vérifications d'original édité, FormData conservée, export UTF-8 exact et stockage vide restent inchangées.

Les traces et rapports bruts sont remis sur la carte, hors dépôt. Ce résultat n'affirme pas qu'une interaction humaine avant chargement est protégée par le produit. Le formulaire reste interactif avant ses modules : un durcissement produit éventuel est un périmètre distinct, non traité ici. Aucun constat sur le beacon historique du générateur n'est modifié.
