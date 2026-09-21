FAIL

# Revue métier — recrutement, compétences et charge en cabinet comptable

Date de référence : 21 septembre 2026  
Tâche : `t_7817f921`  
Matrice structurée : `mesures/registre-preuves-talents-2026-09-21.json`

## Motif du verdict

Le socle permet des formulations datées et attribuées, mais pas les généralisations actuellement présentes dans les trois candidats. Le communiqué Apec est de 2021 ; l’article OEC Paris de 2023 transpose un livre blanc intersectoriel ; la page OPCO Atlas est qualitative, prospective et non datée. Le candidat éditorial n’est en outre pas figé dans Git : les trois articles relus sont non suivis dans une worktree sale. Leurs hashes gèlent cette revue, mais toute modification l’invalide.

Le registre contient 22 claims : 6 formulations autorisables sous conditions, 3 éléments de contexte seulement, 4 reformulations obligatoires, 7 interdictions en l’état, 1 hypothèse à étiqueter et 1 correction documentaire. Quinze constats sont classés P1.

## Entrées figées

- Dossier de demande `t_80cb76bf` : SHA-256 `f22095a85099a792738d2b4083d48d52f12d0a22fbf94f246bd23bc27cc7a9f3`.
- Dossier de cluster `t_2d164da6` : SHA-256 `b6609a0f434e6c7880edc1777f418438abf0a774ee563b90591e23b4fb003a8c` ; `HEAD` observé `27fcf9fa44d8ce6ed6fe421465c10b6a6dafc676`, mais fichier modifié.
- Article charge : SHA-256 `8e930cf937133c4ed3d1b41d3ae6ed93b1b5c70c018b2e6bb87b4680aa178757` ; fichier non suivi.
- Article IA : SHA-256 `26274c57c2fa15ff46458fa33f8441657b949d6b6ea1ac64dc31ab39b99dfa09` ; fichier non suivi.
- Article fidélisation : SHA-256 `91e36e7d877316605c5a8450e269a7db6af080ea778287b14d974d28b4a3f25d` ; fichier non suivi.

## Constatations matérielles et preuves

### 1. Les « tensions » ne sont démontrées qu’en décembre 2021

La source Apec × Conseil supérieur de l’Ordre est un communiqué du 9 décembre 2021. Elle dit exactement que les institutions agissent « dans un contexte de tensions sur le marché de l’emploi cadre, en particulier sur les fonctions d’expertise comptable ». Elle ne mesure ni l’ampleur, ni la situation de tous les salariés de cabinet, ni celle de 2026.

Source : [Apec × Conseil supérieur de l’Ordre, 9 décembre 2021](https://corporate.apec.fr/home/actus-medias/toutes-nos-actualites/lapec-et-le-conseil-superieur-de.html).

Correction requise : remplacer `Le contexte de branche est tendu` et `une profession déjà sous tension` par une formulation explicitement datée. Le mot « pénurie » et tout taux restent interdits.

### 2. L’article OEC Paris de 2023 n’est pas une étude de cabinets

L’article « Comment attirer et fidéliser des collaborateurs » est bien publié par l’OEC Paris le 11 janvier 2023. Toutefois, il résume un livre blanc issu d’entretiens avec des entreprises de tailles et secteurs variés ; il cite des PME industrielles et de services, des ETI et de grands groupes. Les extraits sur les conditions de travail, la rémunération, les compétences et la transmission ne sont donc pas des mesures propres aux cabinets.

Source : [OEC Paris / Le Francilien, 11 janvier 2023](https://lefrancilien.oec-paris.fr/attractivite/comment-recruter-et-fideliser-collaborateurs-cabinet-expert-comptable/).

Correction requise : écrire « dans le livre blanc intersectoriel résumé par l’OEC Paris » chaque fois que ces enseignements sont mobilisés. Ne pas en déduire un effet sur la fidélisation, la charge ou l’automatisation.

### 3. OPCO Atlas soutient des thèmes de branche, pas une mesure d’effet de l’IA

La page OPCO Atlas couvre la branche expertise comptable, commissariat aux comptes et audit. Elle cite :

- la transition numérique comme facteur d’évolution ;
- un enjeu de montée en compétences ;
- le développement de la gestion de données et l’importance accrue de la cybersécurité ;
- l’automatisation future d’une partie des activités ;
- une diversification vers le conseil.

La page n’affiche ni date de publication, ni protocole, ni horizon, ni proportion. Son passage sur l’automatisation est prospectif. Elle dit « transition numérique », pas « intelligence artificielle générative ».

Source : [OPCO Atlas — Experts-comptables, Commissaires aux comptes et Audit](https://www.opco-atlas.fr/atlas/experts-comptables-commissaires-aux-comptes.html).

Correction requise : attribuer chaque affirmation à la page de branche, conserver son caractère qualitatif ou prospectif et ne pas substituer « IA » à « transition numérique ». La phrase `L’IA peut préparer…` doit être bornée au dispositif décrit par Memlia, pas présentée comme capacité universelle soutenue par Atlas.

### 4. France Travail donne un contexte comptable tous secteurs, pas un chiffre des cabinets

BMO 2026 recense 22 190 intentions d’embauche pour l’agrégat de deux familles — « cadres administratifs, comptables et financiers (hors juristes) » et « employés de la comptabilité » — tous secteurs confondus ; 42,1 % sont jugées difficiles et 3,1 % saisonnières.

L’enquête mesure des intentions, créations ou remplacements. Elle ne mesure pas les postes effectivement vacants, les seuls cabinets, le turnover ni la rétention. La collecte 2026 a été menée d’octobre à décembre 2025 ; plus de 416 000 réponses ont été exploitées puis redressées.

Sources :

- [France Travail — BMO 2026, requête comptable tous secteurs](https://statistiques.francetravail.org/bmo/bmo?fe=L5X90,L1X60&la=0&pp=2026&ss=1) ;
- [France Travail — méthode BMO 2026](https://statistiques.francetravail.org/bmo/static/methode_2026).

Restriction : ce chiffre peut seulement illustrer un contexte tous secteurs avec toutes ses limites dans la même phrase. Il est déconseillé dans les trois articles, car il brouillerait leur périmètre cabinet.

### 5. Aucun taux de turnover, salaire ou effet RH n’est démontré

Le corpus contrôlé ne fournit aucune source primaire exploitable sur :

- un taux de turnover des cabinets ;
- un montant, une moyenne ou une fourchette de rémunération par métier, statut et région ;
- un effet causal de la documentation ou de l’automatisation sur les départs ;
- un volume d’alternants ou une efficacité de formation ;
- un effet de l’automatisation sur les recrutements ou les emplois.

L’article OEC Paris de décembre 2024 rapporte « près de 4 000 postes » attribués à une enquête CNOEC et `7 stagiaires sur 10` attribués à un sondage, mais ne relie ni les sources primaires ni leurs méthodes. Ces chiffres restent non publiables.

Source secondaire contrôlée : [OEC Paris — Chiffres-clés et grandes tendances, 6 décembre 2024](https://lefrancilien.oec-paris.fr/attractivite/chiffres-cles-et-grandes-tendances-radiographie-de-la-profession/).

## Formulations autorisées

| Sujet | Formulation autorisée | Restriction |
|---|---|---|
| Tensions | « En décembre 2021, l’Apec et le Conseil supérieur de l’Ordre situaient leur partenariat dans un contexte de tensions sur l’emploi cadre, en particulier sur les fonctions d’expertise comptable. » | Date dans la phrase ; pas de « pénurie » ni de situation 2026. |
| Transition numérique | « La page de branche d’OPCO Atlas présente la transition numérique comme un facteur qui impacte fortement les métiers des cabinets. » | Attribution obligatoire ; pas d’équivalence automatique avec l’IA. |
| Compétences | « OPCO Atlas identifie un enjeu de montée en compétences pour accompagner la numérisation. » | Qualitatif, branche EC/CAC/audit, non quantifié. |
| Automatisation | « OPCO Atlas écrit, dans un passage prospectif non daté, qu’une partie des activités sera automatisée à l’avenir. » | Ni proportion, ni horizon, ni suppression d’emplois. |
| Transmission | « Un livre blanc intersectoriel résumé par l’OEC Paris souligne la place de la transmission des savoir-faire dans les entreprises rencontrées. » | Ne pas présenter comme étude de cabinets ni preuve de fidélisation. |
| Non-causalité | « Écrire le savoir-faire ne permet pas, à lui seul, de conclure à un effet sur la fidélisation. » | Cette limite doit être cohérente avec le titre, le résumé et le CTA. |

## Corrections obligatoires dans les candidats

1. Article charge, ligne 72 : dater explicitement le constat Apec 2021 ; supprimer le présent généralisant `Le contexte de branche est tendu`.
2. Article IA, ligne 70 : même correction ; la source ne prouve pas que la profession est « déjà sous tension » en 2026.
3. Article IA, ligne 60 : remplacer la capacité générale de « l’IA » par une propriété du dispositif conçu et testé par Memlia.
4. Article IA, lignes 144-146 : séparer le fait attribué à Atlas de l’interprétation Memlia ; étiqueter la réaffectation du temps comme hypothèse locale à mesurer après recette.
5. Article fidélisation, titre, titre d’onglet et description : retirer le lien causal implicite entre « fidéliser » et « écrire le savoir-faire ». Le corps nie cette causalité, mais les métadonnées la réintroduisent.
6. Article fidélisation, lignes 62-64 et 86 : ne pas présenter le corpus OEC intersectoriel comme constat de cabinets ; limiter la liste de leviers à un constat de sources hétérogènes sans prétention causale.
7. Article fidélisation, section Sources : ajouter l’Apec, effectivement citée dans le corps, et retirer OPCO Atlas si aucun claim Atlas ne subsiste. La liste actuelle fait l’inverse.
8. Conserver les gardes déjà exactes : aucune promesse de baisse de charge, de rétention, de gain de temps, de suppression de poste ou de diagnostic de santé au travail ; jeu fictif ; agrégats non nominatifs ; décision humaine.

## Critères de levée du FAIL

- Candidat figé dans un commit ou paquet immuable, avec hashes recalculés.
- Corrections P1 ci-dessus appliquées sans réintroduire de causalité dans les titres ou métadonnées.
- Sources finales alignées claim par claim avec les citations réellement utilisées.
- Aucun taux de pénurie, turnover, salaire, alternance ou résultat RH sans source primaire datée et spécifique au périmètre annoncé.
- Nouvelle revue indépendante sur les fichiers corrigés ; le présent rapport ne vaut pas `AI_REVIEW_PASS` après modification.
- GO humain de Kevin avant toute publication.

## Inconnues restantes

- Source primaire et méthode du chiffre CNOEC « près de 4 000 postes ».
- Source primaire et méthode du sondage « 7 stagiaires sur 10 ».
- Version primaire du baromètre Omeca mentionnant rémunération, perspectives et autonomie.
- Date et base méthodologique des énoncés prospectifs de la page OPCO Atlas.
- Données primaires spécifiques aux cabinets sur turnover, rémunération, alternance, conditions de travail et effets de l’IA.

## Contrôles exécutés

- Lecture intégrale des deux dossiers et des trois candidats.
- Téléchargement HTTP direct des six pages officielles ou institutionnelles ; contrôle de leur contenu complet, pas des snippets.
- Conversion HTML vers texte avec Pandoc pour la recherche des citations et du contexte.
- Calcul SHA-256 des entrées et captures.
- Validation JSON et recomptage programmatique des 22 lignes du registre.

Limite de la revue : revue IA indépendante, non avocat, non expert-comptable humain et non autorité administrative. Elle contrôle la cohérence source/claim et ferme les usages non démontrés ; elle ne remplace pas la validation humaine de publication.
