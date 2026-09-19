# Glossaire, vague 2 — dix termes intégrés le 19/09/2026, quatre reportés

Le glossaire passe de **43 à 53 termes**. La vague prévue en comptait quatorze ; **quatre sont reportés**,
pour une raison mesurée et non pour un manque de source (voir « Les quatre termes reportés »).

Comptes relevés après la chaîne, sur le rendu et non sur une liste recopiée :
53 ancres uniques dans `dist/glossaire.html` · 76 unités · 77 affirmations · 90 citations · 27 sources ·
`npm run test:proof` 71 tests OK · `npm run test:scripts` 244/244 · `npx playwright test glossary.spec.ts` 9/9 ·
`npm run build` code 0.

## Vérification des sources

Les sept sources de la vague ont été **ouvertes le 19/09/2026**, par curl avec en-tête de navigateur, et la
phrase citée a été relue mot pour mot sur la page vivante avant d'être recopiée dans
`docs/qa/hub-ressources/glossaire-vague-2-sources/`. Codes HTTP relevés : 200 pour les sept.

| Source | Éditeur | Phrase relevée le jour même |
|---|---|---|
| `microsoft-power-automate-rpa` | Microsoft Learn | « Les flux de bureau élargissent les possibilités existantes d'automatisation robotisée des processus (RPA) dans Power Automate […] » |
| `rfc-9110-idempotence` | IETF — RFC Editor | « A request method is considered "idempotent" if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request. » |
| `cnil-ia-agentique` | CNIL | « L'IA agentique désigne couramment un ensemble de systèmes qui reposent sur la coordination de plusieurs sous-systèmes appelés agents IA. » |
| `microsoft-rag` | Microsoft Learn | « La génération augmentée par récupération (RAG) est un modèle qui étend les capacités des LLM en ancrant les réponses dans votre contenu propriétaire. » |
| `cnil-ia-generative-deploiement` | CNIL | « Choisir un système robuste et un mode de déploiement sécurisé, par exemple en privilégiant le recours à des systèmes locaux, sécurisés et spécialisés » |
| `microsoft-connecteurs` | Microsoft Learn | « Un connecteur personnalisé est un wrapper autour d'une API REST qui permet à Logic Apps, Power Automate, Power Apps ou Copilot Studio de communiquer avec cette API REST ou SOAP. » |
| `rfc-4180-csv` | IETF — RFC Editor | « The comma separated values format (CSV) has been used for exchanging and converting data between various spreadsheet programs for quite some time. » |

Deux sources pressenties par le plan ont été **écartées après mesure**, et non supposées :

- **France Num / AFNOR** pour la RPA : aucune page de définition ouverte le jour même ne porte le terme.
  Remplacée par la documentation d'un éditeur sur son propre produit, ce que le contrat admet pour un terme
  purement technique.
- **CNIL pour le RAG** : `cnil.fr/fr/definition/rag` et sa variante française rendent 404 le 19/09/2026.
  Remplacée par la documentation Microsoft. En revanche la CNIL **a** une page « IA agentique », qui sert
  de source à `agent-ia` — c'est elle que le plan cherchait sous « document institutionnel ».

## Classification des sources

Les sept sources sont classées `tier-1`, `primary`, `official`. Leur type d'affirmation est **`information`** :
chacune restitue la **définition** d'un terme technique, aucune n'énonce une obligation opposable au cabinet.
C'est le classement déjà retenu en vague 1 pour les définitions CNIL et pour `recette` (CCAG-TIC).
Les trois termes de convention — `reliquat-d-exceptions`, `seuil-d-alerte`, `cle-de-rapprochement` — restent
en `methode-memlia`, adossés à `/#methode`.

**Aucune affirmation de type sensible n'entre dans cette vague.** C'est ce qui rend la réaffirmation de la
revue R5 recevable plutôt qu'une nouvelle revue.

## Datation par source

Le contrat datait toutes les sources d'un seul horodatage de corpus. Une vague nouvelle aurait donc re-daté
les vingt sources de la vague 1 sans qu'elles aient été rouvertes. `loadMetierEvidence` accepte désormais un
`checkedAt` **par source** : les sept sources de la vague 2 portent le 19/09/2026, les vingt précédentes
gardent le 16/09/2026, et `validAsOf` comme la date d'affirmation suivent leur propre source.

## Réaffirmation de la revue R5, et ce qui la justifie

La revue métier en vigueur reste **`metier-review-r5`**, datée du 16/09/2026. Elle n'a pas été refaite : le
contrat exige que **toute** affirmation sensible, **toute** copie de source sensible et la revue partagent le
**même jour**. Un rescellement daté du 19/09/2026 aurait donc exigé de rouvrir les vingt copies le jour même.
Deux d'entre elles ne répondent pas aujourd'hui : **Légifrance rend 403** (vérification anti-robot Cloudflare,
trois essais) et **l'assistance Net-entreprises rend 401**. Franchir ces protections n'est pas une option.

La réaffirmation a donc été employée, avec une déclaration écrite et une mesure préalable
(`metier-review-r5/reaffirmation-declaration.json`, clé `mesureDuJour`) :

- 27 affirmations sensibles avant, 27 après, **identiques octet pour octet** ;
- 27 verdicts R5, **0 copie de source jugée modifiée** ;
- 0 affirmation et 0 unité conservées modifiées ; 13 ajoutées, toutes non sensibles ;
- seules lignes conservées à changer : les 30 citations adossées à `source-glossary-memlia` et cette source,
  dont la copie **est** `src/data/glossary.ts` — champs `contentSha256`, `sourceContentSha256`, `claimIds`.
  Cette source n'est officielle pour aucune affirmation sensible.

Le reste des 687 feuilles écartées est **positionnel** : les tableaux sont comparés par rang, et insérer
treize lignes décale les suivantes. Ce que la comparaison feuille par feuille ne sait pas dire, la mesure
ci-dessus le dit, et `resource:audit:qa` le revérifie en exigeant un verdict par couple affirmation/source
sensible — une affirmation sensible qui entrerait sans verdict fermerait le gate.

## Les quatre termes reportés

| Terme | Source relevée le 19/09/2026 | Pourquoi il ne peut pas entrer aujourd'hui |
|---|---|---|
| Supervision humaine | EUR-Lex, règlement (UE) 2024/1689, **article 14 « Contrôle humain »** (chapitre III, section 2) | affirmation de type `legal-reglementaire` |
| Maîtrise de l'IA | EUR-Lex, **article 4 « Maîtrise de l'IA »** (chapitre I) et **article 113** pour la date | affirmation de type `legal-reglementaire` |
| Lettre de mission | Service-Public Entreprendre, fiche `F31447`, vérifiée le 01/06/2026 | affirmation de type `legal-reglementaire` |
| Facture électronique et plateforme agréée | impots.gouv.fr, « Je passe à la facturation électronique », modifiée le 01/09/2026 | affirmation de type `fiscal` |

Ces quatre définitions énoncent une règle opposable, pas la restitution d'un mot : les classer `information`
pour passer le gate serait exactement le vert qui ne prouve rien. Elles exigent un **verdict métier par
couple affirmation/source**, donc une revue **R6** datée du jour, donc la réouverture de Légifrance et de
Net-entreprises. Elles entrent dès que ces deux sources répondent.

**Les dates ont été relevées sur le texte, pas déduites** — elles n'auront pas à être refaites :

- **Article 4, maîtrise de l'IA** : l'article 113 dispose « les chapitres I et II sont applicables à partir
  du **2 février 2025** ». L'article 4 est dans le chapitre I : l'obligation s'applique **depuis le 2 février 2025**.
- **Article 14, contrôle humain** : l'article 14 est dans le chapitre III, section 2. L'article 113 dispose
  « Il est applicable à partir du **2 août 2026** », les exceptions qu'il liste ne couvrant pas cette section
  (l'article 6 § 1 et les obligations correspondantes s'appliquent, eux, à partir du 2 août 2027).
- **Facture électronique** : la page d'impots.gouv.fr énonce une généralisation « effective depuis le
  **1er septembre 2026** » ; la dénomination employée par l'administration est **« plateformes agréées »**.
- **Lettre de mission** : la fiche `F31447` énonce « L'expert-comptable engage sa responsabilité par la
  signature qu'il appose sur ses travaux, dans le cadre et dans les limites de la lettre de mission le liant
  contractuellement à son client. » Elle **n'énonce pas** que la lettre est obligatoire : cette mention vient
  du code de déontologie, sur Légifrance, hors d'atteinte aujourd'hui. La définition ne devra pas l'affirmer
  sans cette source.
