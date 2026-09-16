# Stratégie SEO et éditoriale v3 — tout le cabinet, pas seulement la paie

16 septembre 2026 — validée par Kevin le jour même (« sinon go »), avec deux amendements : cadence **quatre articles par semaine** (au plus deux par jour) et taxonomie élargie à **soixante familles de tâches** en douze pôles (`src/data/familles.ts`), au lieu des onze familles de la première version. Exécution en cours par la forge éditoriale (`scripts/blog-forge.mjs`). Ce dossier remplace, pour l'éditorial, la stratégie v2 (`../site-v2/SEO-STRATEGY.md`, trois piliers dont deux sur la production sociale) et les notes du coffre (`~/memlia-vault/10-memlia/marketing/seo/`, clusters A à F). Les pages commerciales v2 restent telles quelles.

## 1. Le constat en trois lignes

- **Le site tourne autour de la DSN parce que le corpus a été écrit depuis l'unique cabinet client et ses deux modules livrés** (pôle social). Les trois articles publiés, treize des vingt-trois termes du glossaire et deux des trois piliers v2 parlent paie, bulletin, DSN.
- **Le contrat éditorial prévoyait déjà tout le cabinet** : le schéma du blog (`src/content.config.ts`) accepte onze clusters et treize rôles, du recouvrement à l'IT. Un seul cluster a été utilisé. La file `editorial/queue.json` est vide.
- **Il n'y a rien à perdre en élargissant** : Search Console sur 90 jours donne 10 clics, 52 impressions, 2 requêtes distinctes ; 9 pages sur 12 indexées au 16 septembre (les trois dernières demandées ce jour).

## 2. La thèse

**Memlia est le site qui explique, tâche par tâche, comment un cabinet d'expertise comptable automatise ce qu'il fait déjà, sans changer de logiciel, avec une règle écrite dans ses mots, un jeu d'essai fictif, et une validation humaine.** Le sujet n'est plus « la production sociale » : c'est **la tâche répétitive du cabinet**, où qu'elle se trouve (collecte de pièces, saisie, lettrage, révision, échéances, honoraires, courriels, paie, juridique, pilotage).

Le terme de catégorie mesuré reste **« automatisation cabinet comptable »** (10 recherches/mois, seule requête de catégorie chiffrée, relevé DataForSEO du 12/09). La page de service `/automatisation-cabinet-comptable` le porte déjà. La v3 lui donne enfin un territoire éditorial à sa taille : **un pilier + soixante familles de tâches en douze pôles**, au lieu de deux satellites paie.

## 3. Ce qui change, ce qui ne change pas

| | v2 (15/09) | v3 (proposée) |
|---|---|---|
| Territoire éditorial | production sociale + méthode | **toute tâche automatisable du cabinet**, onze familles |
| Pilier | aucun article pilier ; la page service tient lieu de hub | **un article pilier** « la carte des tâches automatisables d'un cabinet » (2 500 à 4 000 mots) + la page service |
| Cadence | 1 à 2 articles/mois | **4 par semaine**, au plus 2 par jour (plafonds codés dans le pipeline), tenue par la forge : recette → sources vérifiées en ligne → revues indépendantes → gate → publication scellée |
| Glossaire | 23 termes, 13 sur la paie/DSN | **23 conservés + 34 termes automatisation, IA, données, cadre** (voir `GLOSSARY-PLAN.md`) |
| Pages commerciales | 5 pages | **inchangées**. Aucune page « par famille » tant qu'aucun module ne la décrit (règle anti-catalogue) |
| Promesse commerciale | limitée aux modules livrés | **inchangée** ; l'éditorial peut couvrir toute tâche si l'article est rejouable sans Memlia |

Ce qui ne bouge pas, parce que ce sont des règles de maison : aucune donnée client, aucun chiffre non sourcé, fact-check daté sur la paie et le fiscal, validation humaine, anti-surveillance (agrégats, jamais nominatif), fail-closed, pas de page « X vs Y », pas de page ville, pas de contenu macros/VBA.

## 4. La carte du territoire

Chaque famille reprend l'identifiant `cluster` du schéma du blog. Les rôles sont ceux du hub Ressources. La colonne « preuve terrain » cite le référentiel des besoins (`~/dev/produit/referentiel-besoins/`, deux postes documentés : assistante du cabinet, expert-comptable associé) : c'est ce qui distingue une famille observée d'une famille supposée.

| # | Cluster (`cluster`) | Tâches couvertes | Rôle principal | Preuve terrain | Priorité |
|---|---|---|---|---|---|
| 1 | `production-comptable` | collecte et **relance de pièces**, complétude du dossier, saisie et OCR, pré-comptabilité, lettrage, rapprochement bancaire, révision par cycles, clôture, facture électronique | collaborateurs comptables, chefs de mission | indirecte (module 4 flux compta ; aucun BES- sur le pôle compta) | **1** |
| 2 | `facturation-recouvrement` | honoraires mensualisés, actes hors forfait, double facturation, prélèvements et rejets, relances d'impayés, échéanciers, sous-facturation | facturation-recouvrement, direction | **observée** : BES-ASS-004 à 016, BES-ASS-019, BES-EXC-012, 013, 017, 019 | **1** |
| 3 | `administratif-secretariat` | boîte mail saturée, tri par client et priorité, lettres de mission et renouvellement, plaquettes de bilan, entrée en relation (onboarding), courriers types | administratif-secrétariat, assistants | **observée** : BES-ASS-017, 018, 021, 025 ; BES-EXC-020 à 022 | **1** |
| 4 | `portefeuille-echeances` | échéances fiscales et sociales du portefeuille, statut par dossier, alertes, tableau de bord de production, liasse EDI-TDFC et rejets | chefs de mission, direction | **observée** : BES-ASS-013, 020, 021 ; BES-EXC-010, 014 | 2 |
| 5 | `methode-decision-humaine` | choisir la première tâche, écrire la règle, jeu d'essai, recette, validation humaine, cas de refus, mesurer le temps réel, ce qu'il ne faut pas automatiser | direction, tous | doctrine Memlia (motif « proposition vs saisie ») | **1** (porte le pilier) |
| 6 | `numerique-it-data` | IA générative au cabinet, agent vs assistant, OCR vs IA, données et secret professionnel, sous-traitance, AI Act, modèle local, connecteurs sans API, imports CSV | numérique-IT-data, direction | indirecte (module 5 messagerie, IA locale) | 2 |
| 7 | `excel-outils-existants` | automatiser sans changer de logiciel, ce qu'Excel tient et ne tient plus, importer un export logiciel, Power Query, complément Office.js, maintenance d'un classeur partagé | collaborateurs, direction | **observée** : BES-ASS-001, 026, 027 ; BES-EXC-001 à 006, 015, 016 | 2 |
| 8 | `paie-social` | bulletins, DSN, comptes rendus métier, **collecte des variables de paie**, synthèse de rémunération | paie-responsables sociaux | **livrée** (modules 1, 2, 6) | maintenance + 3 articles |
| 9 | `juridique-fiscal` | TVA (CA3, CA12) préparée et contrôlée, approbation des comptes et AG, secrétariat juridique annuel, suivi CAC et juriste | juridique-fiscal | indirecte (BES-ASS-021) | 3 |
| 10 | `rh-formation` | plan de charge, entretiens, synthèse de rémunération (côté employeur), formation à l'IA (obligation AI Act, à sourcer) | RH-formation | indirecte (BES-EXC-023) | 3 |
| 11 | `audit-cac` | — | audit-CAC | aucune | **dormant** : aucun besoin documenté, aucun module ; ne pas ouvrir |

Lecture : les priorités 1 sont les familles où **soit un besoin est observé sur le terrain, soit la demande de recherche est la plus formulée** (la relance de pièces est la tâche la plus citée par les concurrents de contenu, sans qu'aucun d'eux livre la méthode). La priorité 3 attend un signal : une demande client, ou des impressions Search Console sur ses requêtes.

## 5. Ce que la SERP dit (relevés WebSearch, 16/09/2026, 14 requêtes)

Volumes : **ND** sauf les deux requêtes chiffrées du 12/09 (« automatisation cabinet comptable » et « compte rendu métier DSN », 10/mois chacune). Ne pas inventer de volume ; les positions Memlia sont ND (2 requêtes en 90 jours).

**Recouvrement d'URL entre familles : faible (1 à 2 domaines partagés, jamais 4).** Les seuls domaines qui reviennent d'une famille à l'autre sont deux acteurs de catégorie (un éditeur de logiciel de gestion de cabinet, une agence d'automatisation n8n). Conclusion identique à celle du 10/09 sur 23 requêtes : **une famille = un cluster distinct, interliés par le pilier**, pas de fusion. Détail dans `cluster-plan.md`.

**Qui occupe le terrain** (détail dans `COMPETITOR-ANALYSIS.md`) : des agences RPA/n8n/IA (FlowZero, AzenFlow, Tensoria, Bonjour IA, Productiv·IA), des éditeurs (Queoval, Dext, Pennylane, Sage, Cegid, MyUnisoft, Agiris), un média professionnel (Compta Online), et un tissu de cabinets qui publient sur leur propre offre. FlowZero couvre déjà 29 sujets, dont relances, onboarding, TVA, notes de frais, clôture, rapprochement, facture électronique, AI Act. **Le terrain n'est pas vide, il est occupé par des promesses chiffrées** (« -40 % d'impayés », « 8 heures par dossier », « 94 % de temps gagné ») que personne ne source. C'est l'espace de Memlia.

## 6. La différenciation, page par page

Chaque article de la v3 porte les cinq marqueurs suivants ; un article qui n'en porte pas trois n'est pas publié.

1. **Rejouable sans Memlia** : le lecteur peut exécuter la méthode avec ses outils. Sinon c'est une plaquette.
2. **La règle dans les mots du cabinet** : chaque tâche est décrite par sa règle (déclencheur, condition, action, exception), pas par un outil.
3. **Un jeu fictif qui montre le cas courant, le cas limite et le cas de refus** : « ce que l'outil refuse de faire » est le bloc que personne d'autre n'écrit.
4. **Une frontière d'automatisation explicite** : ce qui se prépare seul, ce qui attend une validation, ce qui reste humain. Reprise du champ `automationBoundary` du glossaire.
5. **Des sources primaires datées** (DGFiP, Urssaf, CNIL, OEC, Légifrance, Net-entreprises, éditeurs cités pour leurs propres fonctions) et **aucun chiffre de gain non mesuré**. Si un gain est cité, il est mesuré sur un jeu fictif et présenté comme tel.

Formats à privilégier parce que la SERP les récompense et les concurrents les écrivent en prose : checklist numérotée et datée, tableau *anomalie → cause → action*, tableau *ce qui s'automatise / ce qui attend une validation / ce qui reste humain*, définition autonome de 40 à 60 mots en tête (extractible par les moteurs et les assistants IA).

## 7. Le pilier et les satellites

- **Pilier** : `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` (format `pillar-page`, cluster `methode-decision-humaine`, rôle direction). Une carte des onze familles, pour chacune : la tâche, ce qui se répète, la règle typique, la frontière, et le lien vers les satellites. Il renvoie vers la page service et reçoit un lien de chaque satellite (ancre : « automatiser une tâche du cabinet » ou variante).
- **Satellites** : 1 200 à 1 800 mots, un par tâche, format `how-to-guide` par défaut, `faq-knowledge` pour les articles de définition (IA, AI Act), `listicle-checklist` pour les checklists.
- **Maillage** : chaque satellite → pilier (obligatoire), pilier → chaque satellite (obligatoire), 2 à 3 liens vers les satellites de sa famille, 0 à 1 lien vers une autre famille, 1 à 2 ancres vers le glossaire. Minimum trois liens entrants par article, aucune orpheline, ancre = requête ou variante proche.

## 8. Mesure : des seuils de décision, pas des prévisions

Aucune cible de trafic n'est inventée. Point de départ : 10 clics, 52 impressions, 2 requêtes, 9 pages indexées (90 jours au 16/09/2026).

| Échéance | Ce qu'on regarde | Seuil de décision |
|---|---|---|
| M+1 | pilier indexé, 2 premiers satellites indexés, glossaire vague 1 en ligne | sinon : problème technique avant problème éditorial (sitemap, lastmod, demande d'indexation) |
| M+3 | requêtes distinctes avec impressions, par cluster | un cluster à **0 impression sur ses requêtes** après 3 satellites ne reçoit pas de deuxième vague ; on réalloue |
| M+3 | liens entrants par article ≥ 3, aucune orpheline (`INTERNAL-LINKING` vérifié au build) | sinon on corrige le maillage avant d'écrire |
| M+6 | demandes de contact citant un article ou une tâche (formulaire, champ message) | la famille citée passe en priorité 1 ; une famille jamais citée et sans impression passe en priorité 3 |
| M+6 | fraîcheur : chaque article fiscal/paie relu et redaté | un article non relu depuis 6 mois repasse en `a-maintenir` |
| M+12 | 36 articles publiés sur 36 planifiés, 55 termes au glossaire, 100 % des satellites reliés au pilier | bilan et v4 |

Indicateurs avancés lisibles sans relancer un audit : nombre de requêtes avec impressions (GSC, par page), pages indexées (12 → 48), taux de sourçage (sources par article), délai brief → publication.

## 9. Risques et réponses

| Risque | Réponse |
|---|---|
| Écrire sur une tâche qu'aucun module ne livre et qu'un prospect demande | l'article est pédagogique ; la page service et le formulaire cadrent : « on code la règle de votre cabinet », prix à la complexité. Aucune fonction promise. |
| Faits fiscaux mouvants (facture électronique 2026-2027, AI Act) | fact-check daté obligatoire, tableau des dates sourcé sur impots.gouv.fr et EUR-Lex au moment de la rédaction, revue trimestrielle |
| Cadence ×2 sans baisse de qualité | le pipeline (gate, claims, revue métier IA) reste le seul chemin ; un article qui n'atteint pas le seuil qualité attend |
| Cannibalisation entre satellites voisins (« relance de pièces » / « collecte de pièces ») | une requête primaire par article, matrice dans `cluster-plan.json`, contrôle avant chaque brief |
| Le glossaire devient un catalogue de définitions génériques | chaque terme garde le contrat : exemple fictif, confusion courante, frontière d'automatisation, sources ; pas de terme sans article qui l'emploie |
