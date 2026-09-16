# Scellement de la revue métier dans les manifestes

Carte `t_ce6042ee`. 16 septembre 2026. Branche `site/ressources-r3`.

**Scellé. Le build complet du candidat passe en code 0 pour la première fois.**

## Ce que le contrat exigeait, et qui n'était pas rempli

Le verdict `AI_REVIEW_PASS` ne suffit pas à sceller. Le contrat impose en plus que **chaque affirmation sensible et chaque source aient été consultées le même jour que la revue, et moins de vingt-quatre heures avant elle**. Les copies de source dataient du 14 septembre, la revue du 16. Le gate aurait refusé, et il avait raison de le faire.

Le scellement a donc commencé par rendre la preuve vraie plutôt que par contourner la règle.

## Reconsultation intégrale des sources

Les cinquante-sept citations des deux surfaces ont été contrôlées une par une contre les pages vivantes du 16 septembre. Vingt-quatre portent sur des surfaces internes de Memlia. Sur les trente-trois adossées à des sources externes, **une seule** avait cessé de correspondre : la CNIL a remplacé « Une personne physique peut être identifiée directement ou indirectement » par une liste avec exemples. La citation suit désormais la page courante.

Les neuf copies de source ont été réécrites depuis les relevés du jour, chacune contenant ses citations mot pour mot, et la date du corpus est passée au 16 septembre. Toutes les affirmations et toutes les sources portent maintenant cette date, ce qui est exact et non plus déclaratif.

## Le bloc de revue

Scellé dans les deux manifestes, sans toucher au contenu revu :

| Champ | Valeur |
|---|---|
| Reviewer | `t_91444ae1`, agent IA, profil métier, rôle interne de reviewer Memlia |
| Distinct de | auteur, reviewer éditorial, classificateur de sources |
| Verdict | `AI_REVIEW_PASS` |
| Verdicts par couple affirmation/source | 7 pour le Hub, 18 pour le Glossaire, chacun avec ses citations, l'empreinte de sa copie de source et son raisonnement |
| Preuve | un fichier par surface, dont l'empreinte est scellée dans le manifeste |

Les empreintes dérivées, celle du candidat et celle de l'audit, ont été recalculées jusqu'à convergence. **Elles n'ont jamais été écrites à la main : le validateur dicte la valeur attendue et le script l'applique**, ce qui évite de reproduire un calcul et de le voir dériver.

## Mesures

| Contrôle | Résultat |
|---|---|
| `npm run check` | 112 fichiers, 0 erreur |
| Suite Python | 63 / 63 |
| Suite Node | 133 / 133 |
| `npm run resource:audit:qa` | code 0, **zéro diagnostic** |
| `npm run build` | **code 0** |
| `npx playwright test` | 98 / 98 |
| Gates G0 à G4 | PASS sur les deux surfaces ; G5 et G6 restent PENDING, ils appartiennent à la preview et à la release |

## Témoin négatif

Cinq poisons appliqués au manifeste scellé, un par un, puis restauration :

| Poison | Le gate |
|---|---|
| verdict ramené à ND | rougit, 4 erreurs |
| reviewer non relié à une carte traçable | rougit, 5 erreurs |
| un verdict affirmation/source retiré | rougit, 5 erreurs |
| empreinte du candidat falsifiée | rougit, 4 erreurs |
| une source antidatée de trois jours | rougit, 4 erreurs |

Après restauration, l'audit repasse à zéro erreur. **Le scellement n'est pas un laissez-passer : chacune de ses conditions est vérifiée à chaque audit.**

## Deux conséquences consignées

**Le registre lisible par machine a dû être reprojeté à la main.** Il est normalement produit par `resource:seal-surfaces`, mais relancer ce script aurait **effacé le bloc de revue** que ce scellement venait d'écrire. C'est exactement le défaut signalé par la revue technique : le scellement des surfaces réinitialise sans condition les listes de défauts et le blocage. Tant qu'il n'est pas corrigé, **ne jamais rejouer `resource:seal-surfaces` après un scellement de revue**.

**Un test du pipeline encodait l'état « revue absente ».** Il affirmait que la QA du candidat courant ne passait pas et réclamait un agent IA. L'état a légitimement changé ; le test affirme désormais que la QA passe, tout en conservant son rôle utile : vérifier qu'aucune exigence de preview, de GO ou de release ne fuit dans la phase QA.

## Ce que ce scellement ne dit pas

Le contenu reste publié comme **non attesté** : aucun professionnel de la paie ou du droit social ne l'a validé. Les deux réserves de la revue R4 tiennent toujours, la grille qualité étant affirmée par le scellement plutôt que mesurée, et le critère de position dans les résultats de recherche restant non déterminé. Aucun push, aucune preview, aucune publication.
