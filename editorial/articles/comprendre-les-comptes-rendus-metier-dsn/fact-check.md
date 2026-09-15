# Fact-check BLOG-A3 — 2026-09-15

Verdict : PASS, non attesté métier

## Résultat

- Claims enregistrés : 33
- Claims officiels vérifiés : 21
- Méthodes Memlia, synthèses bornées ou cas de test : 12
- Claims non vérifiés : 0
- Sources primaires : 5
- Sources HTTP 200 lors du contrôle final : 5/5
- Source de vérité : `editorial/articles/comprendre-les-comptes-rendus-metier-dsn/claims-sources.json`

## Méthode

1. Les cinq documents ont été récupérés directement depuis `net-entreprises.fr` le 15 septembre 2026.
2. Les quatre pages HTML ont été extraites en texte ; le cahier technique 2026.1 a été extrait depuis le PDF officiel de 382 pages.
3. Chaque claim officiel a été rapproché d’un passage probant, d’un périmètre et d’une source.
4. Les recommandations internes ont été marquées `Méthode Memlia`, `bounded-synthesis`, `editorial-proof` ou `synthetic-test` ; elles ne sont pas présentées comme des règles réglementaires.
5. Les affirmations sensibles ont été bornées : CCO limité à la norme d’échange, règle annule et remplace limitée à la DSN mensuelle et soumise à la consigne du retour, diversité BAN/CRM dépendante du format et de l’organisme.

## Contrôle de fraîcheur final

| ID | URL | HTTP | Fraîcheur et limite |
| --- | --- | --- | --- |
| S1 | `https://www.net-entreprises.fr/declaration/retours-suite-au-depot-dsn-ou-signalement/` | 200 | Page historique modifiée en 2021 ; recoupée avec S3 et S5. |
| S2 | `https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/` | 200 | Page historique modifiée en 2021 ; utilisée pour la définition et la diversité, pas comme catalogue figé. |
| S3 | `https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/` | 200 | Modifiée le 18 mai 2026 ; source opérationnelle récente. |
| S4 | `https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/` | 200 | Modifiée le 23 juillet 2026 ; version 2026 affichée. |
| S5 | `https://www.net-entreprises.fr/media/documentation/dsn-cahier-technique-2026.1.pdf` | 200 | Norme 2026.1 ; section 1.4.1.5 pour le certificat de conformité. |

Le contrôle échoue si une date `consulte` ne vaut plus `2026-09-15`, si une source disparaît ou si son URL n’est plus citée dans le corps. Les mutations correspondantes sont exécutées dans `tests/proof/test_article_3_contract.py`.

## Point d’attestation

Aucune compétence paie/social indépendante n’a attesté le contenu. La page reste donc `publie-non-atteste` et affiche cette limite. Ce PASS établit la cohérence des claims avec les sources consultées, pas une attestation juridique, sociale ou de paie.

## Vérification indépendante complémentaire

Un second agent a extrait 28 claims mais n’a pas pu récupérer Net-entreprises dans son environnement (HTTP 403) : son verdict distant n’est pas utilisé comme preuve positive. La preuve reproductible retenue repose sur les cinq réponses HTTP 200 obtenues dans le workspace, les extractions locales et le registre détaillé.
