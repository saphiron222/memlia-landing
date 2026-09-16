# Revue métier IA R5 — Glossaire vague 1 et Hub Ressources

16 septembre 2026. Candidat `6e3b3a1`. Revue indépendante de la matière sensible des deux manifestes scellés au contrat Ressources v3 : `editorial/resources/glossaire/manifest.json` (surface T) et `editorial/resources/hub/manifest.json` (surface H). Identité de revue : `reviewer-metier-memlia`, carte `t_eebf35f8`, distincte de l'auteur, du relecteur éditorial et du classificateur de sources.

**VERDICT : AI_REVIEW_PASS.**

34 affirmations sur 34 soutenues sans réserve par leur source. Aucune contradiction, aucun P0 (aucune citation absente de sa copie, aucun écart de SHA-256). Ce verdict intègre un rejugement : la version initiale de cette revue avait relevé une nuance sur `claim-t-anonymisation`, corrigée depuis dans le contenu puis rejugée ici — voir « Correction et rejugement » plus bas.

## Ce que ce verdict couvre exactement

Le reviewer est un agent, pas un professionnel diplômé de la paie ou du droit social. Ce verdict établit que chaque affirmation sensible est tracée jusqu'à une citation, elle-même vérifiée dans la copie locale hashée et, quand c'est techniquement possible, retrouvée mot pour mot sur la page vivante le jour même. Il juge la correspondance affirmation / source / citation — il ne vaut pas attestation juridique, et le contenu reste publié comme non attesté (`statut_contenu: "non atteste"`).

Cette revue rejuge les 34 affirmations sensibles sans présumer du résultat de la revue R4 (`docs/qa/hub-ressources/metier-review-r4/`), y compris les 25 déjà jugées à l'époque. Le résultat n'a d'abord pas été identique : R4 avait conclu `AI_REVIEW_PASS` sur `claim-t-anonymisation` avec un motif générique et identique pour les dix-huit claims du glossaire ; un examen ligne à ligne de cette affirmation précise, demandé explicitement par ce mandat pour la matière juridique, y avait trouvé un écart que R4 n'avait pas consigné séparément (« tout moyen raisonnablement utilisable » contre le « quelque moyen que ce soit » de la source CNIL citée). Le contenu a depuis été corrigé et les manifestes rescellés ; le rejugement de ce seul claim, détaillé plus bas, referme cet écart.

| Condition du contrat | État |
|---|---|
| Aucun défaut P0 (citation absente de sa copie, ou copie ≠ SHA-256) | 0 |
| Toutes les affirmations sensibles jugées « soutient » | 34 / 34 |
| Affirmations sensibles couvertes | 34 / 34 (27 glossaire + 7 hub) |
| Sources externes rouvertes | 13, dont 11 en HTTP 200 et 2 inaccessibles à curl (comportement anti-robot attendu et documenté) |

## Méthode

Pour chacune des 34 affirmations sensibles (`type` ∈ paie, social, dsn, fiscal, juridique, legal-reglementaire, statistique-chiffre), pour chaque source associée : la citation a été localisée dans la copie locale (`snapshotPath`), le SHA-256 du fichier de copie a été recalculé (`shasum -a 256`) et comparé au `contentSha256` déclaré par la source et au `sourceContentSha256` déclaré par la citation ; la page `finalUrl` a été rouverte par `curl -sL` avec l'en-tête navigateur demandé, et le passage cité recherché après retrait des balises, des entités et des espaces (apostrophes droites et typographiques traitées comme équivalentes) ; le fond a été jugé au regard du périmètre `applicability` déclaré par l'affirmation.

Deux sources refusent systématiquement curl, comme le mandat l'anticipait : Légifrance (`HTTP 403`, défi anti-robot Cloudflare) et l'assistance Net-entreprises `custhelp.com` (`HTTP 401`). Pour ces deux-là, le jugement repose sur la copie datée : Légifrance sur la copie prise dans Chrome le 16 septembre au soir (20:52 CEST, en-tête du fichier), Net-entreprises `custhelp` sur la copie du même jour au matin (06:45 CEST) — les deux dates déclarées dans les fichiers de copie eux-mêmes, vérifiées à la lecture.

Un artefact d'extraction a été rencontré et neutralisé : sur la page CNIL de la minimisation, le mot « minimisation » est enveloppé dans une infobulle HTML (bouton + `span`), ce qui casse une comparaison texte-à-texte naïve. Une comparaison insensible aux espaces et aux limites de balises confirme que le passage cité est bien présent. Un second artefact, sans conséquence : plusieurs citations excisées d'une page CNIL capitalisent la première lettre de l'extrait alors que la source poursuit une phrase commençant plus haut avec une minuscule (ex. « Les données concernées conservent... », « Dans le cadre du dialogue social... ») — pratique de citation usuelle, vérifiée caractère pour caractère au-delà de cette seule lettre.

## Les neuf affirmations nouvelles (vague 1 du glossaire)

| Affirmation | Jugement |
|---|---|
| `claim-t-systeme-d-ia` | Soutient. La définition de l'article 3, point 1, du règlement (UE) 2024/1689 est retrouvée mot pour mot sur EUR-Lex (HTTP 200) ; l'affirmation omet la fin de la phrase sans rien ajouter à ce qui reste. |
| `claim-t-systeme-d-ia-context` | Soutient. Le considérant 12 cité est retrouvé mot pour mot ; `applicability` borne correctement la portée d'un considérant, qui éclaire sans créer d'obligation. |
| `claim-t-systeme-d-ia-commonConfusion` | Soutient. Même considérant 12 ; la distinction système d'IA / règles humaines est restituée fidèlement. |
| `claim-t-sous-traitant-rgpd` | Soutient. Définition CNIL et obligation contractuelle retrouvées mot pour mot (HTTP 200) ; l'affirmation les combine sans les durcir. |
| `claim-t-sous-traitant-rgpd-context` | Soutient. Application à un outil d'IA hébergé par un tiers, hedgée par « relève souvent de ce statut » ; `applicability` rappelle que la qualification exacte reste un examen au cas par cas. |
| `claim-t-sous-traitant-rgpd-commonConfusion` | Soutient. Corollaire logique direct de la définition citée. |
| `claim-t-prelevement-sepa-et-rejet` | Soutient, avec réserve. Les deux citations Banque de France (mandat de prélèvement, notification motivée du rejet) sont retrouvées mot pour mot (HTTP 200) ; la phrase sur la « nouvelle présentation » n'a pas d'équivalent dans la FAQ et est explicitement déclarée comme doctrine Memlia par `applicability.exceptions`, pas comme un fait de la Banque de France. |
| `claim-t-honoraires-mensualises-et-actes-hors-forfait` | Soutient, avec réserve. La liberté de fixation des honoraires (article 158 du décret n° 2012-432) est retrouvée mot pour mot dans la copie Légifrance (curl refusé en 403, copie Chrome du soir) ; la mensualisation et les actes hors forfait n'ont pas d'équivalent dans l'article et sont explicitement déclarés comme doctrine Memlia. |
| `claim-t-jeu-d-essai-fictif-commonConfusion` | Soutient. La définition CNIL de l'anonymisation est retrouvée mot pour mot (HTTP 200) ; la distinction avec un jeu d'essai fictif en découle logiquement, et `applicability` déclare le caractère inventé comme une convention Memlia, non une notion CNIL. |

## Correction et rejugement

La version initiale de cette revue (même session) avait relevé un défaut unique : `claim-t-anonymisation` (glossaire, source `source-cnil-anonymisation`) disait « rendre impossible... par **tout moyen raisonnablement utilisable** et de manière irréversible », alors que la citation retenue dit « ...par **quelque moyen que ce soit** et de manière irréversible » — un standard absolu que cette page CNIL précise énonce, sans mentionner de critère de moyens raisonnables. Le glissement n'était pas absurde en droit européen de la protection des données (il évoque le considérant 26 du RGPD), mais **cette source-ci** ne le soutenait pas. Verdict d'alors : `nuance`, seul défaut de la revue.

Correction apportée depuis, hors de cette revue : `src/data/glossary.ts` a été modifié pour que le claim reprenne exactement la formulation de la source (« par quelque moyen que ce soit et de manière irréversible ») ; les deux manifestes ont été rescellés (`npm run resource:seal-surfaces`). Le nouveau `sha256` de `claim-t-anonymisation` (`08d753e86e5bb8c8389ce478536f0fe9e92f381c65586b4431a1c47c20a54918`) a été vérifié dans le manifeste courant, et l'absence de tout autre changement a été confirmée par diff sur les 26 autres claims sensibles du glossaire (mêmes `sha256`) et sur les 7 du hub.

Rejugement du seul couple `(claim-t-anonymisation, source-cnil-anonymisation)`, avec la même rigueur que le reste de cette revue : la citation est retrouvée mot pour mot dans la copie locale (SHA-256 du fichier recalculé et inchangé, `fc641877...`) et sur la page vivante rouverte par curl le 16 septembre en soirée (HTTP 200) ; le claim, désormais identique en substance à la citation sur ce point précis, ne dit plus rien de plus que la source. **Verdict : soutient.** `reviewedClaimsDigest` du glossaire recalculé et vérifié (`node -e`) à `8c79734ca692b9af7b83376483798acfaa216e693e6cba779cb561b7f1e65c4b` ; celui du hub, inchangé, revérifié à `cb08a700da5c4097cc079487e3905383bd15afd9b34738f7113badb9f6e36ffd`.

**Second rejugement, copie de source seulement.** La copie locale `docs/qa/hub-ressources/glossaire-vague-1-sources/legifrance-deontologie-honoraires.txt` a changé d'en-tête : elle porte désormais l'heure réelle de la capture Chrome au décalage machine (« 2026-09-16T20:36:00+01:00 (heure machine, à la minute) ») au lieu d'une heure précédente ; le passage cité de l'article 158 est resté strictement identique. Ce seul changement d'octets d'en-tête a changé le `contentSha256` de `source-legifrance-deontologie-honoraires` après re-scellement, à `3857e998191e3e1c32d1f852b3195e33476a4524dc2cf87affe29980ee8bba3b` — vérifié par `shasum -a 256` sur le fichier, cohérent avec le manifeste et avec le `sourceContentSha256` de la citation. `claim-t-honoraires-mensualises-et-actes-hors-forfait` et sa citation n'ont pas bougé (mêmes `sha256`) ; le CCAG TIC révisé au même moment ne porte aucun claim sensible et n'entre pas dans le périmètre de cette revue. Rejugé le 16 septembre 2026 à `21:09:13+01:00` (heure machine réelle, prise par `date`) : le passage sur la liberté de fixation des honoraires est toujours retrouvé mot pour mot dans la copie ; source toujours inaccessible à curl (HTTP 403). **Verdict : soutient, inchangé.** `reviewedClaimsDigest` du glossaire non affecté (aucun `claim.sha256` n'a changé) : revérifié identique à `8c79734ca692b9af7b83376483798acfaa216e693e6cba779cb561b7f1e65c4b`.

## Réserves

- **Citation tronquée sans marque d'ellipse** — `citation-t-donnee-personnelle-context-2` (source `source-cnil-donnee`) referme sur « ...plaque d'immatriculation). » alors que la phrase réelle de la page CNIL continue avec d'autres exemples avant sa vraie fin. Verbatim dans la copie locale, sans impact sur le verdict (l'affirmation ne revendique que la distinction directe/indirecte), mais la fidélité de l'extrait est à corriger.
- **Claims sensibles mélangeant fait sourcé et doctrine Memlia** — `claim-t-prelevement-sepa-et-rejet` et `claim-t-honoraires-mensualises-et-actes-hors-forfait` associent chacune, sous un seul `sourceId` externe, une phrase attribuable à la source et une phrase de méthode Memlia non sourcée. `applicability.exceptions` le déclare honnêtement dans les deux cas ; un futur passage éditorial gagnerait à séparer les deux en claims distincts pour éviter toute ambiguïté d'attribution.
- **Hors mandat** — cette revue ne porte que sur la matière sensible (34 affirmations). Elle ne revérifie pas la grille qualité (`information-gain-proof`, `serp-format-rankability`) ni le reste du contrat Ressources v3.

## Sources externes

| Source | Éditeur | État d'accès | Utilisée par |
|---|---|---|---|
| `source-net-dsn-overview` | Net-entreprises (GIP-MDS) | HTTP 200 | glossaire |
| `source-net-dsn-val` | Net-entreprises (GIP-MDS) | HTTP 200 | glossaire, hub |
| `source-net-crm` | Net-entreprises (GIP-MDS) | HTTP 200 | glossaire, hub |
| `source-net-annule` | Net-entreprises (GIP-MDS) | Copie seule — HTTP 401 sous curl (`custhelp.com`, anti-robot) ; copie du 16/09 matin | glossaire, hub |
| `source-cnil-donnee` | CNIL | HTTP 200 | glossaire |
| `source-cnil-rgpd` | CNIL | HTTP 200 | glossaire |
| `source-cnil-anonymisation` | CNIL | HTTP 200 | glossaire |
| `source-cnil-controle-activite` | CNIL | HTTP 200 | hub |
| `source-service-public-recouvrement` | Service-public.fr | HTTP 200 | glossaire |
| `source-eurlex-ai-act` | EUR-Lex (UE) | HTTP 200 | glossaire (vague 1) |
| `source-cnil-sous-traitant` | CNIL | HTTP 200 | glossaire (vague 1) |
| `source-banque-france-sepa` | Banque de France | HTTP 200 | glossaire (vague 1) |
| `source-legifrance-deontologie-honoraires` | Légifrance | Copie seule — HTTP 403 sous curl (anti-robot Cloudflare) ; copie Chrome du 16/09 soir | glossaire (vague 1) |

13 sources externes, toutes officielles (`official: true`), 11 en HTTP 200, 2 en copie seule pour la raison technique documentée par le mandat.

## Ce que cette revue n'a pas fait

Aucune attestation par un professionnel de la paie ou du droit social. Aucune modification de contenu ni de manifeste : cette revue juge, elle ne réécrit rien. Aucun scellement, aucun push, aucune publication.
