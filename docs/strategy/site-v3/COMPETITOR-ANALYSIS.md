# Analyse concurrentielle v3 — qui occupe « automatiser une tâche du cabinet »

16 septembre 2026. Complète `../site-v2/COMPETITOR-ANALYSIS.md` (les éditeurs : Inqom, Dext, Pennylane, MyUnisoft, Silae) avec le terrain que la v3 ouvre : les contenus qui expliquent comment automatiser une tâche de cabinet. Relevés WebSearch du 16/09/2026, 14 requêtes, France/fr ; positions et volumes ND. Blogs FlowZero et Tensoria lus le même jour.

## 1. Quatre types d'acteurs sur ces requêtes

| Type | Exemples relevés | Ce qu'ils publient | Leur promesse | Ce qu'ils n'écrivent jamais |
|---|---|---|---|---|
| Agences d'automatisation (RPA, n8n, IA sur mesure) | FlowZero, AzenFlow, Tensoria, Bonjour IA, Productiv·IA, Nymphar, Tandem, Studeria, Dazz Studio, L'Agence Sauvage, Hexagone Stratégie, Skuria, Factory 456 | « guide complet 2026 », listes de cas d'usage, études de cas chiffrées, pages « cas d'usage cabinet » | « -40 % d'impayés », « 8 heures par dossier », « 94 % de temps gagné sur le tri », « ROI en 2 à 3 mois », « 10 à 20 heures par semaine » | la source du chiffre, le jeu de données, la règle écrite, le cas où l'outil doit refuser |
| Éditeurs | Queoval Expert, Dext, Pennylane, Sage, Septeo/Ingeneo, Chaintrust, Cegid, MyUnisoft, Agiris, Karbon, Libeo | pages fonctionnalités, centres d'aide, comparatifs « top 5 » | « supprimez la saisie », « facturation automatisée » | la tâche vue du cabinet ; ils décrivent leur outil |
| Médias, institutions, comparateurs | Compta Online, Daf-Mag, francenum.gouv.fr, cabinetdigital.fr | panoramas, retours terrain, comparatifs OCR | neutralité | la méthode exécutable |
| Cabinets qui publient | Hayot Expertise (révision par cycles), Wize Expert, AGS, Nexco, Fimeco, SBA | leur offre, quelques méthodes | « confiez-nous » | destiné aux PME, pas aux cabinets |

Deux domaines reviennent d'une famille de tâches à l'autre : **Queoval Expert** (éditeur de gestion de cabinet, présent sur saisie, échéances, honoraires, catégorie) et **AzenFlow** (agence n8n, présente sur saisie, honoraires, Excel, pièces, catégorie). Personne d'autre ne couvre plus de deux familles. Le recouvrement entre familles reste au niveau « interlier » (1 à 2 domaines), jamais « même cluster » (4 et plus).

## 2. Les deux cartes de contenu les plus complètes

### FlowZero (agence RPA/IA pour cabinets) — 29 articles lus

| Leur sujet | Notre cluster | Leur angle | L'espace qui reste |
|---|---|---|---|
| relances clients (×2), onboarding client, collecte des variables de paie, notes de frais clients | production-comptable, administratif, paie-social | résultat chiffré (« -40 % », « 8 h ») + outillage RPA | la règle, la cadence qui s'arrête, le cas de refus, le jeu fictif |
| TVA CA3/CA12, clôture annuelle, rapprochement bancaire, saisie de factures, OCR | production-comptable, juridique-fiscal | « automatisation complète » | ce qui reste à vérifier, les écarts qui remontent, la frontière |
| agent IA vs assistant, RPA vs IA, faux justificatifs générés par IA, prévisions de trésorerie | numerique-it-data | pédagogie générale | la même pédagogie, sourcée, et ramenée à une tâche |
| AI Act (×2), cybersécurité, CSRD, réforme de l'audit, pénurie de talents, expert-comptable augmenté | numerique-it-data, rh-formation | veille réglementaire, prospective | dates sourcées sur EUR-Lex et non sur un billet ; ce qu'un cabinet de 10 personnes doit faire concrètement |
| coût de l'automatisation, ROI, audit des processus, 10 tâches répétitives, UiPath + Sage/Cegid | methode-decision-humaine, excel | méthode d'agence | mesurer le temps réel sur un jeu fictif, choisir une seule tâche, recette |

### Tensoria (agence IA, intégration métier PME/ETI) — 12 articles lus

Angle intégration : migration de données, synchronisation sans identifiant commun, temps réel ou lot, dédoublonnage, correspondance de champs, connecteur standard ou sur mesure, conflits de synchronisation, saisie dans Cegid. Bien fait, mais **écrit pour la PME qui relie deux logiciels**, pas pour le cabinet qui suit cent dossiers. Notre cluster `numerique-it-data` et `excel-outils-existants` reprennent trois de ces sujets (clé de rapprochement, import/export, lot ou temps réel) **vus depuis le classeur du cabinet**.

## 3. Par famille : qui est devant, en quel format, et l'espace libre

| Famille | Requête relevée | Acteurs présents | Format dominant | Espace libre pour Memlia |
|---|---|---|---|---|
| Relance et collecte de pièces | relance pièces manquantes cabinet comptable ; collecte pièces comptables | Everial, TaxDome, IT Systèmes, Hexagone, FlowZero, Queoval, AzenFlow, Clotilde, Dext, Relancio, Relcompta | page fonctionnalité, article « pourquoi automatiser » | **la méthode en trois briques** : checklist conditionnelle par dossier, contrôle de complétude, cadence de relance qui s'arrête à réception. Personne ne livre l'objet |
| Saisie, OCR, pré-comptabilité | automatisation saisie comptable OCR | Qonto, Sage, Septeo, Pennylane, Chaintrust, Wize, cabinetdigital, Skuria, Queoval, AzenFlow | comparatif, page produit | « le reliquat d'exceptions » (Wize le nomme sans le traiter) : ce que l'OCR ne sait pas, comment le faire remonter |
| Lettrage, rapprochement | lettrage automatique ; rapprochement bancaire automatique | éditeurs, agences | fonctionnalité | règles de lettrage écrites, écarts et cas de refus, contrôle après lettrage |
| Révision, clôture | révision comptable automatisée ; révision par cycles | Agiris, Hayot, Septeo, SBA, L-Expert-Comptable | méthode cabinet, page logiciel | contrôles répétitifs de révision en checklist datée ; N/N-1 sur jeu fictif |
| Échéances fiscales, TVA | suivi échéances fiscales cabinet ; contrôle TVA | Dext, Pennylane (aide), Queoval, Dimo, Factory 456, Foxeet, ECMA (calendrier) | calendrier, page produit | statut par dossier et par échéance, agrégé, sans nommer un collaborateur ; contrôles avant déclaration |
| Honoraires, impayés, prélèvements | facturation cabinet comptable ; relance impayés cabinet | Compta Online, MyUnisoft, Queoval (×3), AzenFlow, Liberall | guide éditeur, tribune | **terrain observé chez notre client** : actes hors forfait, double facturation, rejets de prélèvement, échéancier de rattrapage, sous-facturation. Aucun concurrent ne descend à ce niveau |
| Boîte mail, tri, courriers | gestion boîte mail cabinet expertise comptable | Karbon (Triage), Dazz Studio, CompanyXNext, Bonjour IA, Brasdroit RH, L'Agence Sauvage, HubSpot | page produit, étude de cas « 94 % » | tri par client et priorité tenu en continu, assainir l'existant, ce qui ne se trie pas seul, secret professionnel |
| IA au cabinet | IA cabinet expertise comptable ; agent IA cabinet comptable | Compta Online, Daf-Mag, Productiv·IA, Nymphar, Tandem, Studeria, Intelligence Academy, Cegid (Pulse), FlowZero | « guide complet », « N cas d'usage » | l'IA qui **prépare** et l'humain qui décide, avec la frontière écrite ; vocabulaire sourcé (CNIL, EUR-Lex) ; modèle local |
| Sans changer de logiciel, Excel | automatiser cabinet comptable sans changer de logiciel ; automatiser Excel comptabilité | developpez.net (VBA), Hexagone, AzenFlow, Excel Mania, Nexco | forum, agence | notre positionnement exact ; **éviter la SERP VBA** (forums, intention développeur) en ciblant « sans changer de logiciel » plutôt que « macro » |
| Onboarding, lettre de mission | onboarding client cabinet comptable ; lettre de mission suivi | FlowZero, éditeurs de gestion de cabinet | checklist marketing | renouvellement suivi par dossier, pièces d'entrée, ce qui attend la signature |

## 4. Ce qu'on ne copie pas

- **Leurs chiffres.** Aucun « -40 % », « 8 heures », « 94 % » ne passe sur memlia.fr sans mesure sur un jeu fictif présentée comme telle. Un chiffre de concurrent cité l'est avec sa source et son statut (déclaration commerciale).
- **Les titres « guide complet 2026 », « les 10 cas d'usage ».** Nos titres nomment la tâche : « Automatiser la relance des pièces clients ».
- **Les comparatifs « top 5 logiciels »** et les pages « alternative à X » : hors posture, décision v2 maintenue.
- **Les schémas HowTo et FAQPage** : dépréciés ou sans résultat enrichi ; Article + BreadcrumbList suffisent.
- **« L'IA remplace ».** Toujours « l'IA prépare, l'humain décide ».

## 5. Ce que cette lecture impose au plan

1. **Le terrain occupé n'est pas un terrain perdu** : il est occupé par des promesses, pas par des méthodes. Avec 2 requêtes en 90 jours, Memlia ne gagne pas en volume mais en spécificité : la règle écrite, la frontière, le jeu fictif, la source.
2. **Trois blocs à mettre dans chaque satellite** parce qu'aucun concurrent ne les a : « la règle dans les mots du cabinet », « ce que l'outil refuse et pourquoi », « ce qui s'automatise / ce qui attend une validation / ce qui reste humain ».
3. **Le mot « recette » reste libre** (zéro occurrence chez les acteurs profilés, relevé du 10/09 confirmé le 16/09) : le pilier et la page Méthode le tiennent.
4. **La facture électronique et l'AI Act** sont les deux sujets où les concurrents publient des dates : on ne les cite qu'après lecture d'impots.gouv.fr et d'EUR-Lex le jour de la rédaction.
