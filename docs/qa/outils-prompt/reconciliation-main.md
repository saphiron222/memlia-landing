# Réconciliation de PR51 avec main

## Résultat

La branche `outils/prompt-comptable` intègre main sans fusionner PR51 dans main. Les ajouts prompt et pseudonymisation sont conservés ensemble dans les contrats SEO, le registre des requêtes et le scénario navigateur sans réseau ni stockage. Les corrections contraste/oracle ne sont pas modifiées.

La reproduction locale a donné huit conflits : les sept chemins produit documentés, puis le workflow après l’intégration de PR84. Résolution par contenu, sans remplacement global d’un parent. Le workflow conserve le runner Mac spécifique au dépôt adopté sur main et le budget fini de 60 minutes de PR51 ; mêmes étapes de contrôle, installation Chromium adaptée à macOS héritée de main. Le test `ci-budget.test.mjs` et le rapport `ci-budget.md` sont conservés.

## Données et revue métier

La matière du glossaire et ses 27 verdicts sont repris de main, avec sa campagne conservée. Le rendu `<main>` du témoin construit depuis main est identique à celui du candidat. Seul le chrome change avec le lien du générateur ; l’instrument existant `refresh-glossary-chrome.mjs` reporte la revue, puis vérifie deux reconstructions réelles identiques. Les registres dérivés et reçus sont recalculés, sans nouvelle revue ni nouveau verdict.

Le registre lastmod est synchronisé depuis le rendu final : les 33 routes des deux parents survivent sans doublon. Le footer partagé modifie réellement le HTML des pages ; les nouvelles dates correspondent à ce rendu, non à une publication revendiquée.

## Vérification réelle

- Reproduction rouge : conflits de merge, puis test Python des preuves `33 != 32`. Le total est réconcilié à 33 (main plus preuve prompt), sans supprimer une image ; la liste exacte des images sociales garde les deux ajouts.
- `npm run build` : PASS, 130 tests Python et 651 tests scripts, audits blog/service/ressource verts.
- `npm run check` : zéro erreur, zéro warning, huit hints existants.
- Budget, moteur prompt, oracle propriétaire/concurrent et report de revue/campagne : dix tests ciblés PASS ; oracle documentaire réel PASS.
- Chromium sur preview reconstruite : 28 tests prompt/contraste/reprise/pseudonymisation PASS, puis cinq tests hub/footer/métadonnées/maillage/zéro réseau-zéro stockage PASS. Le scénario conflictuel exécute les deux outils.
- Vérification de conservation des contrats SEO des deux parents, matière métier, 27 verdicts, corrections contraste/oracle, test CI et absence de doublons lastmod : PASS.
- `git diff --check` et intégration de main dans le candidat : PASS.

Les contrôles d’ascendance éditoriale ont logiquement refusé le candidat avant le commit de merge ; ils sont verts après enregistrement de l’intégration. Une exécution foreground du rescellement a dépassé la limite du terminal ; reprise depuis les métadonnées originales de main, puis exécution complète en processus suivi réussie, sans neutraliser le refus d’ancrer un sujet non revu.

## Suite

Le verdict complet Repository gates appartient à platform `t_5cb5b65f`, après déclenchement sur cette branche. La revue unique reste `t_b3f1ff96` via `t_27451296` ; publication `t_6d974686`. Aucun déploiement ni fusion de PR51 n’est effectué par cette réconciliation.
