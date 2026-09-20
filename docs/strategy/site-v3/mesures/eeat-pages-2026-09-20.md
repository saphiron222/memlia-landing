# E-E-A-T des pages hors blog — mesure et correction du 20 septembre 2026

## Périmètre et règle de preuve

Cette mesure couvre les cinq pages de service, le pilier `/automatisation-cabinet-comptable`, `/methode`, `/garanties` et `/a-propos`.

Les quatre axes ci-dessous sont une grille interne. Google ne publie pas de pondération numérique E-E-A-T ; la hiérarchie utilisée par le chantier est : confiance 30 %, expertise 25 %, autorité 25 %, expérience 20 %. Un signal ajouté n'est donc pas une promesse de classement.

Dates : la date de publication vient de la première trace Git du fichier source (20 septembre 2026 pour les cinq services ; 16 septembre 2026 pour les quatre pages commerciales). La date de modification est le jour où le HTML a réellement changé avec cette correction, le 20 septembre 2026. Ce ne sont pas des dates de fraîcheur artificielles.

Auteur : les pages sont signées par Kevin Kitanga, auteur canonique déjà déclaré dans `src/data/auteurs.ts`, fondateur qui porte le contenu et la méthode exposés. Le nœud `Person` conserve un seul `@id`, `/a-propos#kevin-kitanga`, et est relié à `Organization` par `worksFor`.

## Avant / après, page par page

Légende : T = confiance, E = expertise, A = autorité, X = expérience de première main.

| Page | Avant | Après et justification |
|---|---|---|
| `/automatisation/paie` | T : aucun auteur/date. E : 0 source. A : aucun Person. X : aucune preuve vécue. | T : byline + dates réelles visibles et structurées. E : Net-entreprises borne le contrôle DSN avant dépôt. A : Person reliée à Memlia, sans prétendre créer de l'autorité externe. X : reste vide ; aucune cicatrice ne prouve honnêtement cette tâche. |
| `/automatisation/saisie-comptable` | T : aucun auteur/date. E : 0 source. A : aucun Person. X : vide. | T : byline + dates. E : Service Public Entreprendre documente les mentions d'une facture, ce qui justifie des contrôles de présence sans transformer l'imputation en décision automatique. A : Person reliée. X : reste vide, faute de cas publié propre à la saisie. |
| `/automatisation/rapprochement-bancaire` | T : aucun auteur/date. E : 0 source. A : aucun Person. X : vide. | T : byline + dates. E : le Plan comptable général de l'ANC borne le cadre des enregistrements. A : Person reliée. X : reste vide ; le jeu fictif prouve la méthode, pas une expérience client. |
| `/automatisation/notes-de-frais` | T : aucun auteur/date. E : 0 source. A : aucun Person. X : vide. | T : byline + dates. E : le cas officiel des frais de transport montre qu'un remboursement dépend de pièces et de conditions ; la page précise que ce cas ne couvre pas toutes les notes de frais. A : Person reliée. X : reste vide, aucun récit propre à cette tâche. |
| `/automatisation/factures-fournisseurs` | T : aucun auteur/date. E : 0 source. A : aucun Person. X : vide. | T : byline + dates. E : Service Public Entreprendre documente les étapes et anomalies de la facturation électronique ; la citation ne prétend pas prouver un traitement Memlia. A : Person reliée. X : reste vide, faute de preuve vécue spécifique. |
| `/automatisation-cabinet-comptable` | T : aucun auteur/date. E : aucun lien primaire. A : aucun Person auteur. X : la méthode était décrite, sans renvoi à un échec vécu. | T : byline + dates. E : la CNIL borne la minimisation des données. A : Person reliée. X : lien contextuel vers la cicatrice du questionnaire revenu vide ; elle justifie le cadrage qui fait remonter les manques. |
| `/methode` | T : aucun auteur/date. E : méthode décrite, mais sans attribution. A : aucun Person auteur. X : aucune preuve vécue reliée. | T : byline + dates. E : l'attribution rend le porteur de la méthode identifiable ; aucune source réglementaire artificielle n'est ajoutée. A : Person reliée. X : cicatrice du questionnaire vide, avec récit daté et preuve reconstituée explicitement qualifiée. |
| `/garanties` | T : aucun auteur/date. E : aucune source primaire. A : aucun Person auteur. X : vide. | T : byline + dates. E : la CNIL étaye la limite anti-surveillance ; la garantie Memlia reste volontairement plus étroite. A : Person reliée. X : reste vide ; une garantie n'est pas un témoignage. |
| `/a-propos` | T : identité présentée mais page non datée/non signée. E : aucune source de l'identité légale. A : Person existait sans attribution de page. X : vide. | T : byline + dates. E : l'Annuaire des Entreprises confirme l'identité de Memlia. A : un seul Person canonique relié à Organization et utilisé comme auteur. X : reste vide ; l'immatriculation ne prouve aucun résultat client. |

## Sources primaires citées

Toutes les URL ci-dessous ont été relues avec une réponse HTTP 200 le 20 septembre 2026. La date affichée sur chaque page Memlia est la date de consultation, pas une date réglementaire inventée.

| Page(s) Memlia | Éditeur et source | URL | Consultée le | Ce que la source prouve — et sa limite |
|---|---|---|---|---|
| paie | Net-entreprises — Outils d'auto-contrôle Dsn-Val et brique de contrôle | <https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/> | 20/09/2026 | Borne le contrôle avant dépôt ; ne valide pas la paie. |
| saisie comptable | Service Public Entreprendre — Mentions obligatoires sur une facture | <https://entreprendre.service-public.gouv.fr/vosdroits/F31808> | 20/09/2026 | Établit les champs attendus ; ne décide pas de l'imputation. |
| rapprochement bancaire | Autorité des normes comptables — Plan comptable général | <https://www.anc.gouv.fr/plan-comptable-general-0> | 20/09/2026 | Porte le cadre des enregistrements ; ne décide pas d'un rapprochement. |
| notes de frais | Service Public — Remboursement des frais de transport domicile-travail | <https://www.service-public.fr/particuliers/vosdroits/F19846> | 20/09/2026 | Prouve, sur un cas borné, la dépendance aux pièces et conditions ; ne généralise pas toutes les notes de frais. |
| factures fournisseurs | Service Public Entreprendre — Conformité à l'obligation de facturation électronique | <https://entreprendre.service-public.gouv.fr/vosdroits/F39785> | 20/09/2026 | Décrit étapes et anomalies ; ne prouve aucune automatisation Memlia. |
| pilier | CNIL — RGPD, chapitre 2 : principes | <https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2> | 20/09/2026 | Borne la minimisation ; ne vaut ni certification ni conformité générale. |
| garanties | CNIL — Contrôle de l'activité des personnes employées | <https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees> | 20/09/2026 | Étaye la limite anti-surveillance ; ne prouve pas une garantie technique. |
| à propos | Annuaire des Entreprises — MEMLIA, unité légale 108 621 541 | <https://annuaire-entreprises.data.gouv.fr/entreprise/memlia-108621541> | 20/09/2026 | Confirme l'identité légale ; n'est ni une recommandation ni une preuve client. |

`/methode` n'a pas reçu de source institutionnelle : son objet est le procédé Memlia, et la cicatrice de cadrage est la preuve pertinente.

## Expérience de première main retenue

Une seule cicatrice a un lien direct et explicable : « Le questionnaire revenu vide qui a changé notre cadrage », racontée dans `/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils`. Elle est reliée au pilier et à la méthode parce qu'elle explique pourquoi le cadrage doit compter les champs manquants. Elle n'est pas copiée sur les cinq services : son existence ne prouve pas l'expérience de chacune de ces tâches.

## Ce qui a été refusé faute de preuve

- Aucun témoignage, logo ou nom de client.
- Aucun chiffre de gain, délai, volume traité, taux d'erreur ou résultat commercial.
- Aucun label, certification RGPD, garantie réglementaire ou attestation métier.
- Aucun lien de cicatrice sur les cinq services, `/garanties` ou `/a-propos` sans rapport direct démontrable.
- Aucun « cas client » dérivé du jeu d'essai fictif : il prouve une méthode de recette, pas une expérience vécue.
- Aucune source étrangère pour énoncer une règle française.
- Aucune source ajoutée à `/methode` pour faire nombre.
- Aucun gain d'autorité externe revendiqué : la clarté du nœud Person améliore l'identification ; les backlinks et mentions tierces restent hors page.
