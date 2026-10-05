# Glossaire v3 : vagues 1 et 2 intégrées, quatre termes réglementaires en attente

Plan écrit le 16 septembre 2026, remis à l'état réel le 19 septembre 2026, puis le 19 au soir après
l'intégration de la vague 2.

**Le glossaire porte 53 termes aujourd'hui** : les 23 historiques, les 20 de la vague 1 (16/09/2026) et
les 10 de la vague 2 (19/09/2026). Le compte est vérifiable dans `src/data/glossary.ts` (53 ancres
uniques), `tests/proof/test_glossary.py` en exige exactement 53 et `dist/glossaire.html` en rend 53.
La vague 2 devait compter **14 termes** ; **quatre sont reportés**, pour une raison mesurée, exposée
au §3 et détaillée dans `docs/qa/hub-ressources/glossaire-vague-2.md`.

Correction d'un compte faux que ce document portait : le plan annonçait « vague 1 : 18 termes » et
« vague 2 : 16 termes », alors que ses propres tableaux marquaient 20 termes en vague 1 et 14 en
vague 2. Ce sont les 20 qui ont été rédigés et intégrés.

## 1. Le contrat, inchangé

Chaque terme remplit le contrat `GlossaryEntry` : `term`, `anchor`, `nature` (Réglementaire,
Professionnelle, Technique, Éditoriale Memlia), `definition` (40 à 60 mots, autonome, extractible),
`context`, `exampleFictitious` (jeu fictif, jamais un client), `commonConfusion`,
**`automationBoundary`** (ce qui se prépare seul, ce qui attend une validation, ce qui reste humain),
`relatedTerms`, `internalLinks`, `sourceIds` avec `checkedAt`. Aucune mention de processus rendue :
`test_aucune_mention_de_processus_rendue` le garantit.

Règle d'admission : **pas de terme sans article qui l'emploie**, pas d'article qui emploie un terme
absent du glossaire sans le définir en ligne.

## 2. Vague 1 : intégrée le 16/09/2026

Vingt termes rédigés au contrat (`glossaire-vague-1.json`) puis intégrés par la chaîne Ressources
(manifeste T, contrat v3). Les ancres servies :

| Famille | Termes (ancre) |
|---|---|
| Automatisation (8) | `automatisation`, `flux-de-travail`, `declencheur`, `exception`, `file-d-anomalies`, `proposition-puis-validation`, `recette`, `jeu-d-essai-fictif` |
| Intelligence artificielle (4) | `systeme-d-ia`, `ia-generative`, `grand-modele-de-langage`, `hallucination` |
| Données et intégration (3) | `reconnaissance-optique-de-caracteres`, `extraction-de-donnees`, `sous-traitant-rgpd` |
| Vocabulaire des tâches (5) | `pre-comptabilite`, `completude-du-dossier`, `relance-de-pieces`, `prelevement-sepa-et-rejet`, `honoraires-mensualises-et-actes-hors-forfait` |

Ce que la vague a produit, mesuré le jour même : 43 termes rendus, 66 unités inventoriées, 74
affirmations, 87 citations, 26 sources dont 11 rouvertes le jour même
(`docs/qa/hub-ressources/glossaire-vague-1.md`). Six définitions ont été recadrées sur ce que leurs
sources énoncent réellement (système d'IA, sous-traitant RGPD, honoraires, prélèvement SEPA, jeu
d'essai fictif, grand modèle de langage) et huit termes sont des conventions Memlia adossées à
`/methode`. Revue métier indépendante R5, 34 affirmations sensibles, 34 verdicts « soutient » après
correction d'« anonymisation » : `docs/qa/hub-ressources/metier-review-r5/`.

## 2 bis. Vague 2 : dix termes intégrés le 19/09/2026

| Famille | Termes (ancre) |
|---|---|
| Automatisation (4) | `automatisation-robotisee-des-processus`, `idempotence`, `reliquat-d-exceptions`, `seuil-d-alerte` |
| Intelligence artificielle (3) | `agent-ia`, `generation-augmentee-par-recuperation`, `modele-local` |
| Données et intégration (3) | `connecteur-et-api`, `export-logiciel-et-import-csv`, `cle-de-rapprochement` |

Sept sources ouvertes le jour même, copies dans `docs/qa/hub-ressources/glossaire-vague-2-sources`,
lot rédigé dans `glossaire-vague-2.json`, rapport dans `docs/qa/hub-ressources/glossaire-vague-2.md`.
Deux sources pressenties ont été **remplacées après mesure** : France Num/AFNOR pour la RPA (aucune
page de définition) et une définition CNIL du RAG (404 le 19/09). En revanche la CNIL publie bien une
définition « IA agentique », qui sert à `agent-ia`.

Une règle du contrat a bougé, et c'est la seule : **une source porte désormais sa propre date
d'ouverture**. Le corpus de la vague 1 garde le 16/09/2026, celui de la vague 2 porte le 19/09/2026.
Sans cela, une vague nouvelle re-datait des pages que personne n'avait rouvertes.

## 3. Les quatre termes réglementaires, reportés

Les sources sont relevées et les dates établies (voir le rapport de vague 2) : ce n'est pas la
documentation qui manque, c'est la **revue métier**. Ces quatre définitions énoncent une règle
opposable — type `legal-reglementaire` ou `fiscal` — et le contrat exige alors un verdict par couple
affirmation/source. Or une revue R6 doit être datée du jour **et** partager ce jour avec toutes les
copies de source sensibles : le 19/09/2026, **Légifrance rend 403** (anti-robot, trois essais) et
**l'assistance Net-entreprises rend 401**. Les vingt copies de la vague 1 ne peuvent donc pas être
rouvertes le même jour, et R6 est impossible. Les classer `information` pour passer le gate serait
exactement le vert qui ne prouve rien.

À reprendre dès que Légifrance et Net-entreprises répondent, sans refaire le travail de source :

| Terme | Nature | En une ligne | Confusion courante | Source RELEVÉE le 19/09/2026 | Article qui l'emploie |
|---|---|---|---|---|---|
| Supervision humaine | Réglementaire | exigence de contrôle humain sur un système d'IA à haut risque : comprendre ses capacités et ses limites, surveiller son fonctionnement, intervenir | confondue avec la validation humaine du service, qui va plus loin : rien ne part sans validation | EUR-Lex, règlement (UE) 2024/1689, **article 14 « Contrôle humain »**, chapitre III section 2. **Applicable à partir du 2 août 2026** (article 113, règle générale) | `mettre-un-cabinet-comptable-en-conformite-avec-l-ai-act` |
| Maîtrise de l'IA | Réglementaire | obligation faite aux fournisseurs et aux déployeurs de garantir un niveau suffisant de maîtrise de l'IA pour leur personnel | prise pour une certification | EUR-Lex, règlement (UE) 2024/1689, **article 4 « Maîtrise de l'IA »**, chapitre I. **Applicable depuis le 2 février 2025** (article 113, point a) | `checklist-de-conformite-ai-act-pour-un-petit-cabinet-comptable` |
| Lettre de mission | Réglementaire | contrat écrit qui lie l'expert-comptable à son client et dans les limites duquel il engage sa responsabilité | prise pour un devis | Service-Public Entreprendre, fiche `F31447`, vérifiée le 01/06/2026 : « […] dans le cadre et dans les limites de la lettre de mission le liant contractuellement à son client. » ⚠ cette fiche **n'énonce pas** le caractère obligatoire : il vient du décret n° 2012-432, sur Légifrance, inaccessible ce jour | `qu-est-ce-que-la-lettre-de-mission-d-un-expert-comptable` |
| Facture électronique et plateforme agréée | Réglementaire | facture émise, transmise et reçue dans un format structuré via une plateforme agréée par l'administration | confondue avec un PDF envoyé par courriel | impots.gouv.fr, « Je passe à la facturation électronique », modifiée le 01/09/2026 : généralisation « effective depuis le **1er septembre 2026** ». Dénomination confirmée : **« plateformes agréées »** | `checklist-de-conformite-avant-le-passage-a-la-facture-electronique`, `facture-electronique-ce-que-change-la-collecte-des-pieces` |

Les slugs cités sont ceux de `backlog-v3.json` au 19/09/2026 : ils se revérifient au moment de la
vague, puisqu'un angle peut être réécrit par un recalage de la demande.

## 4. La chaîne de publication d'une vague

Jamais un simple ajout dans le fichier. La procédure complète est dans `RUNBOOK-QUOTIDIEN.md` §6.3 ;
en voici l'ossature, dans l'ordre :

1. **Rédiger les entrées** dans `src/data/glossary.ts` (apostrophe typographique, jamais droite, dans les textes).
2. **Copier et dater les sources** dans `docs/qa/hub-ressources/<vague>-sources/`, avec un en-tête de navigateur : Légifrance et l'assistance Net-entreprises refusent un agent nu.
3. **Déclarer les preuves attendues** : planchers `DEFINITIONS_ATTENDUES` et `UNITES_ATTENDUES` (`scripts/lib/resource-metier-evidence.mjs`), champs à portée juridique dans `ADDITIONAL_UNITS` (`resource-metier-v3.mjs`).
4. **Monter les compteurs** depuis les 53 termes actuels vers le total réellement revu, pas vers une cible supposée : `tests/proof/test_glossary.py`, `tests/browser/glossary.spec.ts`, totaux de `test_resource_v3_traceability.py`.
5. `npm run build`, puis **`npm run resource:seal-surfaces`** : la surface scellée est le glossaire seul depuis le retrait de `/ressources`.
6. **Revue métier par un agent distinct de l'auteur**, sous une carte de suivi, avec un verdict par couple affirmation et source sur tous les types sensibles.
7. **Injecter la revue** dans les manifestes, puis `node scripts/reaffirm-resource-review.mjs ancrer` : l'ancre enregistre le sujet complet de la revue après avoir vérifié qu'il reproduit l'empreinte épinglée.
8. `npm run resource:audit:qa` vert, `npm run lastmod:sync`, rebuild, Playwright `glossary.spec.ts` et `review.spec.ts`, puis vérification en ligne.

**Quel instrument, et quand.** L'étape 6-7 (revue puis `ancrer`) n'est possible que si **toutes** les
copies de source sensibles peuvent être rouvertes le jour de la revue : le contrat exige que la revue,
chaque affirmation sensible et chaque copie de source sensible partagent le même jour. Une vague qui
n'ajoute **aucune affirmation de type sensible** n'a pas besoin de R6 : la revue en vigueur est
**réaffirmée** sur le sujet courant, avec une déclaration écrite et une mesure préalable établissant
que les affirmations sensibles n'ont pas bougé d'un octet. C'est la voie prise le 19/09/2026 pour la
vague 2, et la raison pour laquelle ses quatre termes réglementaires sont restés dehors.

Entre deux vagues, quand le chrome du site change sans que la matière bouge, on rescelle les surfaces
(`npm run resource:seal-surfaces`), puis on **réaffirme** (`node scripts/reaffirm-resource-review.mjs reaffirmer`), qui compare le sujet courant
à l'ancre feuille par feuille, refuse tout écart non déclaré, revérifie que chaque affirmation est
encore rendue et chaque copie de source intacte, puis re-épingle. La revue en vigueur est
`metier-review-r5`.

## 5. Le piège, écrit pour ne pas être refait

`resource:seal-surfaces` conserve désormais la revue existante non PENDING, ses verdicts, sa
date de campagne (`sensitiveMatter.checkedAt`) et les défauts P0/P1/blocage. Il ne revient pas
à la date initiale du 16/09 : un verdict ajouté à une campagne ultérieure reste antérieur
à celle-ci. Une date manquante reste manquante, donc refusée par le validateur. Le défaut de
perte silencieuse relevé dans `docs/qa/hub-ressources/metier-r2-seal.md` est corrigé ; les
empreintes de revue ne sont toutefois pas actualisées par le scellement. La réaffirmation
reste nécessaire après un changement de chrome ; une matière sensible modifiée exige sa revue.

Second piège, du même genre : une réaffirmation n'est pas un rescellement. Rescellier en effaçant la
revue serait la perte silencieuse ; re-épingler automatiquement serait pire, une revue qui suit
n'importe quel contenu ne revoit plus rien. Le script tient la troisième voie, explicite et
fail-closed, et refuse d'écrire dès qu'une vérification manque.

## 6. Cadence et déclencheur (arbitrage du 28/09/2026)

Pas de quota hebdomadaire de termes : un mot n'entre que lorsqu'un article, un outil ou une
page de service publié(e) en a besoin pour lever une ambiguïté de métier, et qu'une source et
une preuve fictive sont disponibles. À chaque vendredi de maintenance de la forge, relever les
termes employés mais non définis, les liens cassés et les confusions de Search Console ; proposer
une vague seulement si au moins un terme satisfait ce besoin, sans forcer la vague de quatre
réglementaires reportés. Avant une publication, vérifier la source à la date de revue et le contrat
de la chaîne Ressources (§4) ; si elle bloque, garder l'entrée candidate hors du glossaire public.
Les 53 ancres ne sont pas une cible de croissance mais le stock de `src/data/glossary.ts`.
