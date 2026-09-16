# Plan du glossaire v3 — 23 termes conservés, 34 termes automatisation, IA, données, cadre

16 septembre 2026 — proposition. Le glossaire actuel (`src/data/glossary.ts`, 23 ancres) est conservé tel quel : ses termes sont scellés, sourcés, et treize d'entre eux servent encore aux articles paie. La v3 ajoute **34 termes** en deux vagues, tous employés par au moins un article du calendrier. Total cible : **57 ancres**.

## 1. Le contrat ne change pas

Chaque nouveau terme remplit le contrat `GlossaryEntry` : `term`, `anchor`, `nature` (Réglementaire · Professionnelle · Technique · Éditoriale Memlia), `definition` (40 à 60 mots, autonome, extractible), `context` (où le cabinet le rencontre), `exampleFictitious` (jeu fictif, jamais un client), `commonConfusion`, **`automationBoundary`** (ce qui se prépare seul, ce qui attend une validation, ce qui reste humain), `relatedTerms`, `internalLinks` (vers les articles qui l'emploient), `sourceIds` (sources datées, `checkedAt`). Aucune mention de processus rendue (le test `test_aucune_mention_de_processus_rendue` le garantit).

Règle d'admission : **pas de terme sans article qui l'emploie**, pas d'article qui emploie un terme absent du glossaire sans le définir en ligne. La colonne « Articles » ci-dessous porte cette correspondance ; les slugs sont ceux de `CONTENT-CALENDAR.md`.

## 2. Famille A — Automatisation (12 termes)

| Terme | Nature | En une ligne (à développer en 40-60 mots) | Confusion courante | Source à citer | Articles | Vague |
|---|---|---|---|---|---|---|
| Automatisation | Technique | exécuter une règle écrite sans intervention humaine à chaque occurrence, en signalant ce qui sort de la règle | confondue avec la numérisation (passer du papier au PDF) et avec l'IA | France Num (Direction générale des Entreprises), fiche « automatiser ses tâches » ; à relever | pilier, sans-changer-de-logiciel | 1 |
| Flux de travail (workflow) | Technique | enchaînement ordonné d'étapes, avec pour chacune un responsable, une condition d'entrée et une sortie | pris pour un logiciel ; un workflow existe sur papier avant tout outil | CNIL ou ANSSI selon la fiche ; à relever | pilier, choisir-la-premiere-tache | 1 |
| Automatisation robotisée des processus (RPA) | Technique | logiciel qui rejoue des clics et des saisies à la place d'un humain dans une interface | confondue avec l'IA ; la RPA ne comprend rien, elle rejoue | France Num ou AFNOR ; à relever | ia-generative, sans-changer-de-logiciel | 2 |
| Déclencheur | Technique | l'événement qui lance une règle : une date, une réception, un état qui change | confondu avec la règle elle-même | définition Memlia, sourcée sur un standard de workflow (BPMN, OMG) ; à relever | relance-des-pieces, relances-honoraires | 1 |
| Exception (cas hors règle) | Éditoriale Memlia | occurrence que la règle ne couvre pas et qui doit remonter à un humain au lieu d'être traitée | prise pour une erreur ; une exception bien remontée est le fonctionnement normal | jurisprudence interne : « Cas de refus » existant, motif proposition/validation | relance-des-pieces, saisie-ocr, lettrage | 1 |
| File d'anomalies | Éditoriale Memlia | liste unique où remontent toutes les exceptions, traitée d'un coup par un humain, avec statut | confondue avec une alerte par courriel à chaque cas | référentiel des besoins (HYP-ASS-006), sans citation nominative | completude-dossier, rapprochement | 1 |
| Proposition puis validation | Éditoriale Memlia | l'outil propose une valeur ou une action, l'humain saisit ou valide ; ce qui est saisi n'est jamais réécrit | confondue avec « l'outil fait tout puis on vérifie après » | doctrine Memlia, page Méthode | pilier, choisir-la-premiere-tache, ia-generative | 1 |
| Idempotence | Technique | rejouer un traitement ne change rien s'il n'apporte rien : un import relancé n'écrit pas deux fois | confondue avec « annuler » ; deux régimes : l'import ne réécrit pas, la régénération réécrit tout | définition informatique standard (RFC 9110 pour le sens HTTP) ; à relever | importer-un-export, ne-pas-facturer-deux-fois | 2 |
| Reliquat d'exceptions | Professionnelle | la part des occurrences que l'automatisation n'a pas su traiter et qu'un humain reprend | confondue avec un taux d'erreur ; un reliquat est attendu, un taux d'erreur est un défaut | article Wize Expert (cité comme usage professionnel, pas comme autorité) ; à relever | saisie-ocr, lettrage, rapprochement | 2 |
| Seuil d'alerte | Éditoriale Memlia | valeur au-delà de laquelle un écart remonte ; réglé par le cabinet, jamais par l'outil | confondu avec une tolérance comptable | référentiel des besoins (HYP-EXC-007), non nominatif | reperer-un-dossier-sous-tarif, tableau-de-bord | 2 |
| Recette | Professionnelle | séance où le cabinet rejoue ses cas sur ses fichiers et accepte ou refuse le livrable | confondue avec une démonstration ; une recette se fait sur les fichiers du cabinet | vocabulaire des marchés informatiques (CCAG-TIC, « vérification d'aptitude ») ; à relever | pilier, jeu-d-essai-fictif | 1 |
| Jeu d'essai fictif | Éditoriale Memlia | données inventées, plausibles, qui couvrent le cas courant, le cas limite et le cas de refus | pris pour des données anonymisées (qui restent personnelles au sens CNIL) | CNIL « anonymisation » (déjà sourcée), doctrine Memlia | jeu-d-essai-fictif, mesurer-le-temps | 1 |

## 3. Famille B — Intelligence artificielle (9 termes)

| Terme | Nature | En une ligne | Confusion courante | Source à citer | Articles | Vague |
|---|---|---|---|---|---|---|
| Système d'IA | Réglementaire | définition du règlement (UE) 2024/1689, article 3 : système qui infère, à partir d'entrées, des sorties (prédictions, contenus, recommandations, décisions) | tout logiciel n'est pas un système d'IA ; une macro ne l'est pas | EUR-Lex, règlement (UE) 2024/1689 ; date de lecture à poser | ia-generative, ai-act | 1 |
| IA générative | Technique | modèle qui produit du texte, des images ou du code à partir d'une consigne | confondue avec un moteur de recherche ; elle produit, elle ne retrouve pas | CNIL, fiches « IA générative » ; à relever | ia-generative, trier-la-boite-mail | 1 |
| Grand modèle de langage (LLM) | Technique | modèle entraîné sur de grands corpus de texte, qui prédit la suite d'un texte | pris pour une base de connaissances à jour | CNIL ; à relever | ia-generative, agent-ia | 1 |
| Agent IA | Technique | système qui enchaîne des actions avec des outils pour atteindre un but, avec une autonomie bornée | confondu avec un assistant conversationnel ; l'agent agit, l'assistant répond | définition à sourcer sur un document institutionnel (CNIL ou Commission) ; à relever | agent-ia, ce-qu-il-ne-faut-pas-automatiser | 2 |
| Hallucination | Technique | sortie plausible mais fausse d'un modèle génératif, formulée avec assurance | prise pour un bug réparable ; c'est une propriété du procédé | CNIL ; à relever | ia-generative, rgpd-et-ia | 1 |
| Génération augmentée par recherche (RAG) | Technique | technique où le modèle répond à partir de documents fournis, cités, plutôt que de sa mémoire | prise pour une garantie d'exactitude ; elle borne, elle ne garantit pas | CNIL, fiches « développer un système d'IA » ; à relever | trier-la-boite-mail, agent-ia | 2 |
| Modèle local | Technique | modèle exécuté sur une machine du cabinet, sans envoi des données à un tiers | confondu avec « hébergé en France » | CNIL (sous-traitance, transferts) ; module 5 Memlia | rgpd-et-ia, ia-generative | 2 |
| Supervision humaine | Réglementaire | exigence de l'AI Act (article 14) : une personne peut comprendre, surveiller et interrompre le système | confondue avec la validation humaine Memlia (pratique), qui va plus loin : rien ne part sans validation | EUR-Lex, règlement (UE) 2024/1689 ; à relever | ai-act, pilier | 2 |
| Maîtrise de l'IA | Réglementaire | obligation de l'AI Act (article 4) : le personnel qui utilise un système d'IA en comprend le fonctionnement et les limites ; **date d'application à vérifier sur EUR-Lex le jour de la rédaction** (des billets annoncent le 2 août 2026, d'autres une date antérieure) | prise pour une certification | EUR-Lex ; à relever avec date | ai-act, rh-formation (synthese-remuneration) | 2 |

## 4. Famille C — Données et intégration (6 termes)

| Terme | Nature | En une ligne | Confusion courante | Source à citer | Articles | Vague |
|---|---|---|---|---|---|---|
| Reconnaissance optique de caractères (OCR) | Technique | transformation d'une image de document en texte exploitable | prise pour de la compréhension ; l'OCR lit, elle n'interprète pas | définition standard ; comparatif cabinetdigital cité comme usage | saisie-ocr, notes-de-frais | 1 |
| Extraction de données | Technique | repérage, dans un document lu, des champs utiles (fournisseur, montant, TVA, date) | confondue avec l'OCR ; l'extraction vient après | à relever (France Num ou éditeur cité pour sa propre fonction) | saisie-ocr, facture-electronique | 1 |
| Connecteur et API | Technique | interface par laquelle deux logiciels échangent sans ressaisie ; quand elle manque, on passe par des exports | « sans API » ne veut pas dire « sans automatisation » : l'export fichier est une voie | à relever (documentation d'un éditeur pour sa propre API) | importer-un-export, sans-changer-de-logiciel | 2 |
| Export logiciel et import CSV | Technique | fichier plat produit par un logiciel, lu par un autre ; son schéma doit être vérifié à chaque import | pris pour une copie fiable ; un export change de colonnes sans prévenir | RFC 4180 (CSV) ; à relever | importer-un-export, ce-qu-excel-tient | 2 |
| Clé de rapprochement | Technique | l'identifiant, ou la combinaison de champs, qui permet de dire que deux lignes parlent du même dossier | confondue avec un nom ; deux orthographes cassent un rapprochement | doctrine Memlia ; article Tensoria cité comme usage | rapprochement, lettrage, importer-un-export | 2 |
| Sous-traitant (RGPD) | Réglementaire | celui qui traite des données personnelles pour le compte du cabinet, sous contrat (article 28) | confondu avec un fournisseur quelconque ; un éditeur d'IA hébergé est souvent un sous-traitant | CNIL, « sous-traitant », et RGPD article 28 (EUR-Lex) | rgpd-et-ia, ai-act | 1 |

## 5. Famille D — Vocabulaire des nouvelles familles de tâches (7 termes)

| Terme | Nature | En une ligne | Confusion courante | Source à citer | Articles | Vague |
|---|---|---|---|---|---|---|
| Pré-comptabilité | Professionnelle | collecte, tri et préparation des pièces avant l'écriture comptable | confondue avec la tenue ; la pré-compta s'arrête avant l'imputation | à relever (OEC ou éditeur cité pour sa propre définition) | saisie-ocr, relance-des-pieces | 1 |
| Complétude du dossier | Éditoriale Memlia | état d'un dossier dont toutes les pièces attendues pour une période sont reçues et lisibles | confondue avec « le client a envoyé quelque chose » | doctrine Memlia ; checklist conditionnelle | completude-dossier, relance-des-pieces | 1 |
| Relance de pièces | Professionnelle | demande, à cadence définie, des pièces manquantes d'un dossier, qui s'arrête à réception | confondue avec la relance d'impayés (autre objet, autre ton) | doctrine Memlia | relance-des-pieces, relances-honoraires | 1 |
| Lettre de mission | Réglementaire | contrat obligatoire entre l'expert-comptable et le client, qui définit la mission et les honoraires | prise pour un devis | Code de déontologie des professionnels de l'expertise comptable (décret n° 2012-432), article sur la lettre de mission ; Légifrance, à relever | lettres-de-mission, onboarding | 2 |
| Facture électronique et plateforme agréée | Réglementaire | facture émise, transmise et reçue dans un format structuré via une plateforme agréée par l'administration (dénomination et calendrier **à vérifier sur impots.gouv.fr le jour de la rédaction**) | confondue avec un PDF envoyé par courriel | impots.gouv.fr, dossier « facturation électronique » ; à relever avec date | facture-electronique, completude-dossier | 2 |
| Prélèvement SEPA et rejet | Professionnelle | prélèvement des honoraires sur mandat ; un rejet est un retour de la banque du client, avec un motif codé | pris pour un impayé définitif ; un rejet appelle une relance ou un échéancier | Banque de France ou CFONB, codes motifs de rejet ; à relever | rejets-de-prelevement, relances-honoraires | 1 |
| Honoraires mensualisés et actes hors forfait | Professionnelle | honoraires prélevés chaque mois sur une base contractuelle ; les actes hors forfait s'y ajoutent et se facturent une seule fois | double facturation d'un acte déjà inclus | Code de déontologie (honoraires), OEC ; à relever | ne-pas-facturer-deux-fois, reperer-un-dossier-sous-tarif | 1 |

## 6. Répartition et calendrier

| Vague | Termes | Quand | Condition |
|---|---|---|---|
| 1 | 18 termes (marqués « 1 ») | avec le pilier et les deux premiers satellites (M1) | sources relevées et datées, exemples fictifs écrits, frontière d'automatisation remplie |
| 2 | 16 termes (marqués « 2 ») | avec la vague 2 d'articles (M4) | idem, plus relecture des dates AI Act et facture électronique |

## 7. La chaîne à rejouer à chaque vague

1. Ajouter les entrées et leurs sources dans `src/data/glossary.ts` (mêmes champs, `sourceCheckedAt` daté du relevé).
2. `editorial/resources/glossaire/manifest.json` : la décision « index unique de 23 ancres » devient « 57 ancres », `contractRevision` incrémenté.
3. Mettre à jour les compteurs de `tests/proof/test_glossary.py` (23 → 41 puis 57) et vérifier `test_aucune_mention_de_processus_rendue`.
4. `npm run build` (audit, build, preuves, lastmod, images, scripts).
5. `npm run resource:seal-surfaces` puis `node scripts/reaffirm-resource-review.mjs reaffirmer` contre la déclaration r4.
6. `npm run lastmod:sync` (le HTML du glossaire change → nouvelle empreinte), rebuild, `--check`.
7. Playwright `resources.spec.ts` et `review.spec.ts`, puis vérification en ligne sur l'URL immuable `pages.dev` après publication.
