# Revue du candidat — rapprochement bancaire automatisé

Statut : PASS limité à la cohérence de la règle et au rejeu fictif ; NON prêt pour scellement, preview ou publication.

## Sujet exact examiné

Revue métier/QA indépendante réalisée le 24 septembre 2026, sans édition des fichiers examinés. Le relecteur a exécuté `node editorial/recettes/rapprochement-bancaire-automatise-les-ecarts-a-remonter/oracle.mjs` : code 0, `PASS : 4 cas fictifs, entrées → oracle → résultats attendus concordants`. La preuve est `preuve-rejeu.json`. Ce test ne rapproche pas un compte bancaire réel, n'écrit aucune écriture comptable et ne valide pas le dispositif en production.

| Fichier | SHA-256 |
| --- | --- |
| `corps.md` | `b7648a6bd5e979677a846b418dc732292eca85aa0e29a0fb31a2f798ee749ed4` |
| `jeu-fictif.json` | `b43e10ff60d6ed8e9bcbdc52641f7c6d1092e633a8eb05e380cca21c5622c39e` |
| `rejeu.json` | `5520985510c166b67cc52b43a5eedcf21f5360bf710a068ab282e0e56c46189f` |
| `oracle.mjs` | `a322e8d15e805e99bc80dd363162a94ce9e67713da6c6cf33c37a6232370677e` |
| `preuve-rejeu.json` | `0283dc6badb3877e1abb69fc542db03f979ac951201fcbbc172677ef39b51388` |

Le relecteur n'a relevé aucun P0 sur les quatre cas. P1 : l'oracle s'arrête dès qu'il trouve une paire et ne retourne pas alors toutes les lignes ouvertes ; sans paire, il ne décrit que la première écriture sans ligne bancaire. Le texte borne son rejeu à ces cas. Toute extension de la promesse exige une nouvelle preuve et une nouvelle revue.

## Sources et limites

Pages institutionnelles consultées le 24 septembre 2026 : [ANC — plan comptable général](https://www.anc.gouv.fr/plan-comptable-general-0), [CNIL — donnée personnelle](https://www.cnil.fr/fr/definition/donnee-personnelle), [CNIL — RGPD, chapitre II](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2). Les pages ANC et CNIL chapitre II ont répondu HTTP 200 à une requête HEAD. Le relecteur a constaté la consultation des pages citées ; il n'a pas vérifié le PDF du plan de comptes ni les autres pages liées. Ce contrôle humain ne remplace pas les preuves de sources du pipeline de publication.

## Gates non franchis

- La recette complète `recette.json` et les `revues.json` du pipeline n'existent pas ; ne pas lancer `blog-forge sceller` ou `publier` en simulant une revue ou des sources.
- La couverture Higgsfield attend le prix exact et l'accord préalable de Kevin ; aucun crédit dépensé, aucune couverture de substitution.
- Le gate repository, les checks sur le SHA exact, la revue GitHub indépendante et la protection de branche applicable ne sont pas établis. La PR blog #3 est reportée ; ne pas ouvrir de voie parallèle vers `main`.
- Preview, accord de Kevin, release et contrôle de la surface de production restent à faire. Ne pas marquer l'article « publié » dans le calendrier.

Tout changement des cinq fichiers empreintés invalide ce verdict et impose une nouvelle exécution et une nouvelle revue indépendante.
