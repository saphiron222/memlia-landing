---
statut: valide
auteur: hermes
---

# RESSOURCES-FRESHNESS-R4-EXEC — recette du candidat local

Tâche : `t_54774b16`. Workspace unique : `/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/t_d078dd62`. Base : `939464c90ecee928bfd9d7f7be26ea028758cf8b`.

## Verdict et limites

**PASS mécanique local ; revue métier PENDING ; aucune autorisation de publication.** Le SHA du vrai commit et la propreté après commit sont à lire dans le handoff Kanban, vérifié après écriture de ce rapport. Ce document ne prétend pas qu'un commit existe avant sa création. Il remplace le diagnostic intermédiaire `freshness-r4-exec-fail.md` et le rapport historique `metier-fix-c-astra.md`.

L'audit Blog porte sur les dossiers complets des deux articles déjà publiés, sans exemption legacy. C'est une conservation vérifiée, pas un nouveau fact-check. Les sept reçus de sources hérités gardent le 13 septembre 2026 ; la relecture au 15 reste une déclaration des octets publics du commit 939464c, non démontrée par une nouvelle collecte. Les revues héritées ne deviennent ni de nouvelles revues métier ni des autorisations. GSC/SERP ND ne sont pas crédités comme recherche fraîche. Le PASS mécanique n'atteste pas le fond paie/social.

## Corrections réalisées

1. Deux articles restaurés exactement depuis Git 939464c, sans modifier leur corps, leur auteur Kevin Kitanga, leur statut `publie-non-atteste`, leur date du 15 ni `brouillon: false`.
2. Migration explicite des dossiers éditoriaux : originaux inchangés sous `preuves/inherited/`, inventaire complet et hashes dans `preuves/published-adoption.json`. Les liens vers article/manifeste sont réassociés ; les unités décrivent le rendu public. Claims, citations et résultats historiques ne sont pas réécrits. Les paragraphes publics de non-attestation sont identifiés comme notices éditoriales.
3. Mode `published-audit` borné aux deux SHA publiés, avec contrôles de dossier et de provenance. Il émet `freshFactCheck: false` et `publicationAuthorized: false`. Les gates preview/production restent fermés ; `prepare-preview` refuse le reçu de conservation comme autorisation.
4. Tests/fixtures périmés alignés sur les routes publiques : inventaire Blog, auteurs, RSS, sitemap, llms et liens Glossaire. Aucun retour aux brouillons 92ec8350.
5. H/T rescellés depuis un build frais ; registre à 41 unités, 49 claims, 57 citations et 15 lignes source (sources communes aux surfaces comptées dans chaque surface). Zéro orpheline selon l'oracle bidirectionnel. `validAsOf`, la clause anti-envoi automatique, parse5 direct et le reçu de build hashé sont conservés.

## Exécution réelle

Les journaux originaux résident dans `.qa/freshness-r4/`, les extraits durables et hashes dans `freshness-r4-evidence.json` et `freshness-r4-evidence/`.

- `npm ci --ignore-scripts` : PASS ; `npm ls parse5 --depth=0` : 8.0.1 direct ; `npm audit --omit=dev` : 0 vulnérabilité.
- `npm run check` : 0 erreur, 0 avertissement, 1 hint.
- `npm run blog:audit` : 2 articles, 2 dossiers pipeline, 0 legacy, 0 erreur.
- `npm run build:site` : PASS. Python 56/56, export preview 4/4, Blog 82/82 dont 14 contrôles conservation/mutations, rendu candidat 1/1, Ressources 35/35. Validation images PASS.
- `node --test tests/scripts/*.test.mjs` : 127/127, aucune erreur, y compris les tests d'origine preview et de batch non inclus dans le raccourci build.
- `npm run build` et `npm run resource:audit:qa` : FAIL attendu sur exactement 59 diagnostics `businessReview`/`AI_REVIEW_PASS`. Aucune erreur de liaison ou `buildOutput`, classement automatique avec liste fermée de diagnostics admis. Ce rouge n'est pas requalifié en build vert.
- Playwright : 98/98, sans skip ni flaky, serveur Astro local isolé démarré programmatiquement, readiness HTTP 200, puis arrêté. Aucun déploiement de preview distant.
- Captures H/T et Blog pleine page 375/1440 ; les largeurs 320/375/768/1024/1440/1920 sont couvertes par les tests H/T.
- Relecture visuelle : Hub mobile refait après retour au scroll top, aucun recouvrement ni débordement. Le premier full-page capturé en bas de page plaçait artificiellement le header sticky au niveau du CTA ; capture corrigée, aucun changement CSS nécessaire. Glossaire desktop relu en crop natif (header/recherche/premières définitions), sans défaut manifeste ; la vue entière très longue dépasse la limite de l'outil, sa réduction ne permet pas une appréciation fine. Le DOM et les tests vérifient les 23 entrées et un seul H1.
- `git diff --check` et empreintes exactes : vérifiés avant commit ; manifeste de paths et hashes conservé pour le handoff.
- Deux copies source immuables contiennent des blancs d'extraction en fin de ligne (Net-entreprises CRM et Microsoft Protect Sheet). L'exception `.gitattributes` `whitespace=-blank-at-eol` vise uniquement ces deux fichiers ; ni leurs octets, ni leurs SHA-256, ni leurs citations n'ont été normalisés. Le contrôle de whitespace reste actif sur le code et tous les autres fichiers.

## Contre-revue ciblée et réponses

Contre-revue GPT locale, non métier, lecture seule : trois observations examinées.

- Réécriture de date dans `claim.claim` : suppression de l'instruction, même si aucun claim actuel ne contenait ce motif. La correspondance d'unités entre le 13 et le 15 ne prétend pas changer une collecte ; elle reflète exclusivement le texte public immuable.
- Provenance protégée seulement par `checkedAt` : comparaison structurelle ajoutée sur les résultats historiques, hors les seuls hashes de liaison et les correspondances d'unités admises. Un mutant qui change le résultat et recalcule le reçu est rejeté.
- Branche legacy de l'audit : elle reste pour le contrat historique général, mais les deux articles migrés passent par des dossiers complets. Le témoin suppression de manifeste les fait passer à blocked, jamais legacy ; les anciens hashes de baseline ne concordent pas avec les articles publics. Aucun crédit legacy sur ce candidat.

Témoins négatifs complémentaires : article modifié, auteur divergent, brouillon, lien croisé, reçu absent, inventaire falsifié, collecte redatée malgré rehachage, table de provenance retirée, résultat historique falsifié, gates preview/production et préparation preview depuis un simple audit. Tous sont automatisés dans `tests/scripts/blog-published-authority.test.mjs`. Les mutants validAsOf, timestamps/reçu de build, source/citation et snapshots restent dans les suites Ressources/Python.

## Handoff

`t_391e2204` doit adopter/vérifier le commit exact transmis, sans produire un deuxième candidat. La revue technique précréée `t_8f07fd85` reste la revue indépendante du code complet ; la contre-revue ciblée ci-dessus ne la remplace pas. Le dossier métier reste PENDING, sans faux reviewer ni `AI_REVIEW_PASS`.

Aucun push, merge, preview Cloudflare, publication, cron, donnée client, recherche réseau métier/SEO ou intervention memlia-desk. Le WIP initial a été archivé avant modification : `.qa/freshness-r4/before.diff`, SHA-256 `3426c69ca5f7531cab76d8c3b6c6b928cb2bb177146eba50c2d1cc0d7e180777`.
