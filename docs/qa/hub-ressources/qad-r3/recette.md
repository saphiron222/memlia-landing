# Recette du contenu rendu et des preuves métier

Carte `t_7a6dbdf8`. 16 septembre 2026. Candidat scellé `ea9c59e`, branche `site/ressources-r3`.

**VERDICT : PASS.** La preview est libérée. Le contenu reste publié comme non attesté.

## Une clause du contrat de cette carte est périmée

Le corps de la carte, écrit avant le 14 septembre, impose un « FAIL sensible en l'absence d'attestation compétente ». Cette clause est **supersédée par la décision de gouvernance du 14 septembre** : il n'y a pas de reviewer métier humain, le reviewer est le profil IA spécialisé, avec un verdict interne explicite. Cette recette applique la gouvernance en vigueur, et le signale plutôt que de l'appliquer en silence.

L'absence d'attestation humaine reste affichée sur les pages et dans les manifestes.

## Contrôles déterministes

| Contrôle | Résultat |
|---|---|
| Contrat de compétences | 31 Blog, 24 SEO, 19 noyau, comparaison JSON canonique exacte, PASS |
| Audit Ressources phase QA | code 0, **zéro diagnostic** |
| Build complet | code 0 |
| Suites Python, Node, navigateur | 63 / 63, 133 / 133, 98 / 98 |
| Score et défauts, sur les deux surfaces | 100 pour un seuil de 90, aucun P0, aucun P1, aucun blocage |

## Chaîne de traçabilité

41 unités rendues, 49 affirmations, 57 citations, 15 lignes de source. **Les 41 unités déclarées sont toutes retrouvées dans le HTML construit** : aucune unité fantôme, aucun contenu creux, aucun marqueur de remplissage.

Les 25 affirmations sensibles sont reliées à une source primaire officielle, rouverte le 16 septembre, avec un verdict par couple affirmation-source scellé dans le bloc de revue.

## Contenu rendu

| Point | `/ressources` | `/glossaire` |
|---|---|---|
| Un seul `h1` | oui | oui |
| Canonical sans slash | oui | oui |
| Robots | indexable | indexable |
| JSON-LD | CollectionPage, ItemList, BreadcrumbList, Organization, WebSite | CollectionPage, DefinedTermSet, BreadcrumbList, Organization, WebSite |
| Liens internes morts | 0 sur 17 | 0 sur 16 |
| Images sans texte alternatif | aucune image | aucune image |

**Aucune donnée interdite détectée** sur les deux pages : pas de téléphone, pas de numéro de TVA ni de SIRET, pas d'adresse électronique hors domaine Memlia, aucun gain chiffré non sourcé, aucun marqueur de remplissage.

## Cannibalisation

Les trois articles du blog visent des tâches précises : contrôler un bulletin avant la DSN, lire les comptes rendus métier, suivre la production sociale dans Excel. Les deux nouvelles surfaces visent l'orientation et la définition. Aucune requête primaire n'est partagée, et le Hub renvoie vers les articles plutôt que de les répliquer.

## Posture de service

Les deux pages décrivent ce qu'une automatisation prépare et ce qu'une personne décide. Aucune promesse de résultat chiffré, aucune donnée de cabinet, aucun cas client. Les exemples sont fictifs et déclarés comme tels.

## Écran

Les deux pages ont été ouvertes à 375 et 1440 pixels : réponse 200, un seul `h1`, aucun débordement, et l'entrée « Ressources » reste visible dans la navigation mobile sans ouvrir le menu.

## Ce que cette recette ne couvre pas

Les deux réserves de la revue métier tiennent : la grille qualité est écrite par le scellement plutôt que mesurée, et le critère de position dans les résultats de recherche reste non déterminé faute de données fournisseur. Aucune mesure de trafic, de position ou de conversion n'existe : la baseline appartient à la carte de mesure.

Aucun déploiement, aucun push, aucun cron.
