# Glossaire v3 : vague 1 intégrée, vague 2 à faire

Plan écrit le 16 septembre 2026, remis à l'état réel le 19 septembre 2026.

**Le glossaire porte 43 termes aujourd'hui** : les 23 historiques et les 20 de la vague 1, intégrés
le 16/09/2026. Le compte est vérifiable dans `src/data/glossary.ts` (43 ancres uniques) et
`tests/proof/test_glossary.py` en exige exactement 43. La vague 2
compte **14 termes**, ce qui porterait le total à 57.

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

## 3. Vague 2 : 14 termes, à faire

Aucune date n'est posée : la vague attend la validation de Kevin sur la liste et sur le moment. Les
sources marquées « à relever » se relèvent et se datent le jour de la rédaction, jamais avant.

### Automatisation (4)

| Terme | Nature | En une ligne, à développer en 40 à 60 mots | Confusion courante | Source à citer | Article qui l'emploie |
|---|---|---|---|---|---|
| Automatisation robotisée des processus (RPA) | Technique | logiciel qui rejoue des clics et des saisies à la place d'un humain, dans une interface | confondue avec l'IA ; la RPA ne comprend rien, elle rejoue | France Num ou AFNOR, à relever | `automatiser-sans-changer-de-logiciel`, `ia-generative-au-cabinet-ce-qu-elle-prepare-ce-qu-elle-ne-decide-pas` |
| Idempotence | Technique | rejouer un traitement ne change rien s'il n'apporte rien : un import relancé n'écrit pas deux fois | confondue avec « annuler ». Deux régimes : l'import ne réécrit pas, la régénération réécrit tout | RFC 9110 pour le sens HTTP, à relever | `importer-un-export-logiciel-dans-excel-sans-ressaisie`, `ne-pas-facturer-deux-fois-un-acte-hors-forfait` |
| Reliquat d'exceptions | Professionnelle | la part des occurrences que l'automatisation n'a pas su traiter et qu'un humain reprend | confondue avec un taux d'erreur ; un reliquat est attendu, un taux d'erreur est un défaut | usage professionnel cité comme tel, pas comme autorité, à relever | à fixer sur l'angle publié des familles `saisie-ocr`, `lettrage`, `banque-rapprochement` |
| Seuil d'alerte | Éditoriale Memlia | valeur au-delà de laquelle un écart remonte, réglée par le cabinet et jamais par l'outil | confondu avec une tolérance comptable | référentiel des besoins, sans citation nominative | `tableau-de-bord-de-production-sans-classer-les-personnes` |

### Intelligence artificielle (5)

| Terme | Nature | En une ligne | Confusion courante | Source à citer | Article qui l'emploie |
|---|---|---|---|---|---|
| Agent IA | Technique | système qui enchaîne des actions avec des outils pour atteindre un but, avec une autonomie bornée | confondu avec un assistant conversationnel : l'agent agit, l'assistant répond | document institutionnel (CNIL ou Commission), à relever | `agent-ia-ou-assistant-ia-la-difference-pour-un-cabinet` |
| Génération augmentée par recherche (RAG) | Technique | technique où le modèle répond à partir de documents fournis et cités, plutôt que de sa mémoire | prise pour une garantie d'exactitude : elle borne, elle ne garantit pas | CNIL, fiches « développer un système d'IA », à relever | `trier-la-boite-mail-du-cabinet-par-client-et-priorite` |
| Modèle local | Technique | modèle exécuté sur une machine du cabinet, sans envoi des données à un tiers | confondu avec « hébergé en France » | CNIL, sous-traitance et transferts, à relever | `rgpd-et-ia-au-cabinet-sous-traitance-et-secret-professionnel` |
| Supervision humaine | Réglementaire | exigence de l'AI Act (article 14) : une personne peut comprendre, surveiller et interrompre le système | confondue avec la validation humaine Memlia, qui va plus loin : rien ne part sans validation | EUR-Lex, règlement (UE) 2024/1689, à relever | `mettre-un-cabinet-comptable-en-conformite-avec-l-ai-act` |
| Maîtrise de l'IA | Réglementaire | obligation de l'AI Act (article 4) : le personnel qui utilise un système d'IA en comprend le fonctionnement et les limites. **Date d'application à vérifier sur EUR-Lex le jour de la rédaction** | prise pour une certification | EUR-Lex, à relever avec la date | `checklist-de-conformite-ai-act-pour-un-petit-cabinet-comptable` |

### Données et intégration (3)

| Terme | Nature | En une ligne | Confusion courante | Source à citer | Article qui l'emploie |
|---|---|---|---|---|---|
| Connecteur et API | Technique | interface par laquelle deux logiciels échangent sans ressaisie ; quand elle manque, on passe par des exports | « sans API » ne veut pas dire « sans automatisation » : l'export fichier est une voie | documentation d'un éditeur pour sa propre API, à relever | `automatiser-sans-changer-de-logiciel`, `importer-un-export-logiciel-dans-excel-sans-ressaisie` |
| Export logiciel et import CSV | Technique | fichier plat produit par un logiciel et lu par un autre ; son schéma se vérifie à chaque import | pris pour une copie fiable : un export change de colonnes sans prévenir | RFC 4180, à relever | `checklist-avant-d-importer-un-export-logiciel-dans-excel` |
| Clé de rapprochement | Technique | l'identifiant, ou la combinaison de champs, qui permet de dire que deux lignes parlent du même dossier | confondue avec un nom : deux orthographes cassent un rapprochement | doctrine Memlia, usage professionnel cité comme tel | `rapprochement-bancaire-automatise-les-ecarts-a-remonter`, `lettrage-automatique-regles-et-cas-de-refus` |

### Vocabulaire des tâches (2)

| Terme | Nature | En une ligne | Confusion courante | Source à citer | Article qui l'emploie |
|---|---|---|---|---|---|
| Lettre de mission | Réglementaire | contrat obligatoire entre l'expert-comptable et son client, qui définit la mission et les honoraires | prise pour un devis | Code de déontologie des professionnels de l'expertise comptable (décret n° 2012-432), Légifrance, à relever | `qu-est-ce-que-la-lettre-de-mission-d-un-expert-comptable` |
| Facture électronique et plateforme agréée | Réglementaire | facture émise, transmise et reçue dans un format structuré via une plateforme agréée par l'administration. **Dénomination et calendrier à vérifier sur impots.gouv.fr le jour de la rédaction** | confondue avec un PDF envoyé par courriel | impots.gouv.fr, dossier facturation électronique, à relever avec la date | `checklist-de-conformite-avant-le-passage-a-la-facture-electronique`, `facture-electronique-ce-que-change-la-collecte-des-pieces` |

Les slugs cités sont ceux de `backlog-v3.json` au 19/09/2026 : ils se revérifient au moment de la
vague, puisqu'un angle peut être réécrit par un recalage de la demande.

## 4. La chaîne de publication d'une vague

Jamais un simple ajout dans le fichier. La procédure complète est dans `RUNBOOK-QUOTIDIEN.md` §6.3 ;
en voici l'ossature, dans l'ordre :

1. **Rédiger les entrées** dans `src/data/glossary.ts` (apostrophe typographique, jamais droite, dans les textes).
2. **Copier et dater les sources** dans `docs/qa/hub-ressources/<vague>-sources/`, avec un en-tête de navigateur : Légifrance et l'assistance Net-entreprises refusent un agent nu.
3. **Déclarer les preuves attendues** : planchers `DEFINITIONS_ATTENDUES` et `UNITES_ATTENDUES` (`scripts/lib/resource-metier-evidence.mjs`), champs à portée juridique dans `ADDITIONAL_UNITS` (`resource-metier-v3.mjs`).
4. **Monter les compteurs** : `tests/proof/test_glossary.py` (43 vers 57), `tests/browser/glossary.spec.ts`, totaux de `test_resource_v3_traceability.py`.
5. `npm run build`, puis **`npm run resource:seal-surfaces`** : la surface scellée est le glossaire seul depuis le retrait de `/ressources`.
6. **Revue métier par un agent distinct de l'auteur**, sous une carte de suivi, avec un verdict par couple affirmation et source sur tous les types sensibles.
7. **Injecter la revue** dans les manifestes, puis `node scripts/reaffirm-resource-review.mjs ancrer` : l'ancre enregistre le sujet complet de la revue après avoir vérifié qu'il reproduit l'empreinte épinglée.
8. `npm run resource:audit:qa` vert, `npm run lastmod:sync`, rebuild, Playwright `glossary.spec.ts` et `review.spec.ts`, puis vérification en ligne.

Entre deux vagues, quand le chrome du site change sans que la matière bouge, on ne rescelle pas : on
**réaffirme** (`node scripts/reaffirm-resource-review.mjs reaffirmer`), qui compare le sujet courant
à l'ancre feuille par feuille, refuse tout écart non déclaré, revérifie que chaque affirmation est
encore rendue et chaque copie de source intacte, puis re-épingle. La revue en vigueur est
`metier-review-r5`.

## 5. Le piège, écrit pour ne pas être refait

**Ne jamais rejouer `resource:seal-surfaces` après un scellement de revue.** Le scellement des
surfaces réinitialise sans condition les listes de défauts et le blocage : relancé après coup, il
efface le bloc de revue que le scellement venait d'écrire, **silencieusement**. Le dossier repart en
attente sans que rien ne rougisse. C'est un défaut connu du script, relevé lors du scellement R2 et
consigné dans `docs/qa/hub-ressources/metier-r2-seal.md` ; tant qu'il n'est pas corrigé, l'ordre du
§4 est contraignant : sceller d'abord, faire relire ensuite, ancrer enfin.

Second piège, du même genre : une réaffirmation n'est pas un rescellement. Rescellier en effaçant la
revue serait la perte silencieuse ; re-épingler automatiquement serait pire, une revue qui suit
n'importe quel contenu ne revoit plus rien. Le script tient la troisième voie, explicite et
fail-closed, et refuse d'écrire dès qu'une vérification manque.
