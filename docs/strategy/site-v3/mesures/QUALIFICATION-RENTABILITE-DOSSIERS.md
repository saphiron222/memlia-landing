# Rentabilité des dossiers : ne pas ouvrir une page commerciale dédiée

Qualification du 06/10/2026, carte t_a1c7cb30, vague 3 rang 34.

## Décision

Ne pas ouvrir `/automatisation/rentabilite-dossiers`. Rattacher le besoin au service général `/automatisation-cabinet-comptable` dans la documentation d’architecture seulement. Le besoin de rapprocher coûts, temps et honoraires est concret et déjà traité par des fonctions natives documentées. Les mesures fraîches ne démontrent pas une intention distincte de déléguer ce geste à un service sur mesure. Une page commerciale générique ajouterait aujourd’hui une variante sans preuve de différence utile.

La décision ne signifie ni absence de demande réelle, ni absence de marché. Elle ferme cette candidate dans cette vague. Aucun contenu public, registre de réservation, canonical, sitemap ou parcours existant n’est modifié. Le rattachement n’ajoute aucune capacité promise à la page générale.

## Demande mesurée

Instrument du dépôt actualisé : `scripts/lib/seo-instruments.mjs`, fonction `autocompleterGoogle`, endpoint Google Suggest Firefox, paramètres français/France. Exécution de `node rechercher.mjs` le 06/10/2026 ; huit réponses réussies, sept listes vides, deux suggestions dans une seule liste :

| Amorce | Nombre de suggestions |
|---|---:|
| automatisation rentabilité dossiers cabinet comptable | 0 |
| rentabilité dossier cabinet comptable | 0 |
| rentabilité cabinet comptable | 2 |
| suivi rentabilité dossiers cabinet comptable | 0 |
| logiciel rentabilité cabinet comptable | 0 |
| calcul rentabilité dossier comptable | 0 |
| suivi temps cabinet comptable | 0 |
| sous facturation cabinet comptable | 0 |

Les deux suggestions sont exactement « rentabilité cabinet comptable » et « rentabilité cabinet expertise comptable ». Elles établissent une formulation générale, pas une demande commerciale de délégation, ni une demande de calcul par dossier. Aucun volume mensuel ou trafic n’est déduit de ces listes. La capture horodatée intégrale accompagne cette note.

## Recherche et limites de la SERP

`web_search` et `web_extract` ont échoué en 403 Firecrawl. Reprise réelle par Bing dans le navigateur : dix résultats visibles, principalement définitions et calcul de rentabilité générale, non pertinents pour classer les réponses à ce besoin cabinet. Reprise HTTP Google avec termes entre guillemets : statut 200 mais écran de redirection/difficulté d’accès, sans liste de résultats exploitable. DuckDuckGo : 202 et défi antirobot. Captures conservées dans le paquet ; aucun classement concurrent ni absence de concurrence revendiqué.

Les sources éditeurs ci-dessous ont été ouvertes directement en HTTP 200 après remplacement d’un accès Python en échec de certificat par curl avec vérification TLS normale. Les fonctions décrites n’ont pas été testées. L’examen concurrentiel n’est pas exhaustif.

## Besoin et concurrence native

Sources primaires éditeur ouvertes le 06/10/2026, citations exactes conservées en HTML et texte :

1. fulll, Pilotage du cabinet : https://www.fulll.fr/pilotage-cabinet . Rubrique « Mesurez la marge de chaque dossier » : « Confrontez automatiquement les feuilles de temps (timesheets) de vos équipes avec les honoraires facturés. Identifiez rapidement le temps productif non facturé. » Rubrique « Calcul automatique Boni / Mali » : « comparaison continue du coût de revient de la mission face au chiffre d'affaires engagé dans la lettre de mission. » Cela documente une alternative native directement sur le rapprochement temps/honoraires et coût/chiffre d’affaires, pas seulement un outil de saisie des temps.

2. ACD GI : https://www.acd-groupe.fr/solution-expert-comptable/acd-gi/ . Citations : « Optimisez vos suivis de temps et de facturation » ; « Analysez l’activité du cabinet et la rentabilité de vos dossiers ». La page regroupe missions, budgets, charges, obligations, honoraires, temps et facturation. Elle documente une réponse métier existante ; elle ne prouve ni les exports disponibles pour Memlia, ni une méthode de coûts spécifique, ni une couverture universelle.

fulll présente également des analyses par collaborateur et des actions de pré-facturation : ces fonctions ne sont pas reprises comme promesse Memlia. Le périmètre conservé ici reste non nominatif pour les personnes et distinct des propositions de factures comme du plan de charge. Les comparatifs promotionnels de fulll et les promesses d’amélioration ne sont pas utilisés comme faits.

## Geste utile à conserver pour une demande qualifiée

Hypothèse de mission future, pas automatisation construite : rapprocher des données autorisées de temps, coûts et honoraires, à période et périmètre comparables, préparer les écarts à examiner par dossier puis une synthèse de portefeuille en agrégats non nominatifs. La règle de valorisation des temps et d’imputation des coûts doit appartenir au cabinet. Une marge partielle ne devient pas une rentabilité complète par défaut.

| Se prépare seul après règle et accès éprouvés | Attend une validation | Reste humain |
|---|---|---|
| Rapprochement des sources autorisées sur période commune, calcul selon coûts validés, liste d’écarts et synthèse agrégée | Complétude des temps, assiette d’honoraires et coûts, exceptions de mission, pertinence des écarts et accès à la sortie | Choix de la méthode de coûts, appréciation du dossier, décision tarifaire et échange avec le client |

Conditions d’arrêt à écrire dans une recette future : données manquantes, période incompatible, temps dupliqué, coût absent, dossier non rapprochable, périmètre d’honoraires ambigu, accès non autorisé. Ne pas confondre honoraires convenus, facturés et encaissés ; un retard de paiement ne démontre pas une sous-facturation. Une prestation hors périmètre ne se transforme pas automatiquement en facture. Pas de classement individuel de collaborateurs ni de modification automatique du tarif, de la facture ou du planning.

Ce cadre n’est pas un rejeu : aucun cas exécuté, aucun résultat fictif de marge ou PASS métier ne sont inventés.

## Cannibalisation et contexte local

Worktree créé depuis origin/main actualisé : `site/`, branche `site/rentabilite-dossiers-t_a1c7cb30`. Quatre angles existent déjà dans le backlog de la famille : repérer la sous-facturation, checklist de mesure, décision sur l’écart de tarif, définition/calcul. Leurs compteurs du 19/09 sont nuls ; les questions associées portent notamment sur le tarif et le coût d’un cabinet, sans prouver la délégation du rapprochement coût/honoraires. Ces pistes ne sont ni publiées ni déclenchées automatiquement.

Aucune occurrence pertinente rentabilité/marge/sous-facturation dans le registre des requêtes relu, et aucune rentabilité dans le contrat d’intention. Le cache historique et les quatre entrées sont capturés en contexte, pas présentés comme mesures fraîches. Le calculateur de marge commerciale visible sur la page générale est un outil de formules sur deux montants HT ; il n’est pas une mesure de rentabilité de mission. Ne pas lui rattacher artificiellement cette tâche.

Constat public sans query string, avec Cache-Control no-cache : candidate HTTP 404 ; service général HTTP 200. Les sources et statuts sont conservés. Aucun lien entrant, H1 ou réservation nouveau n’est créé.

## Handoff et critère de réouverture

L’enfant t_c369a85f doit intégrer uniquement cette qualification, l’autocomplétion et la décision documentaire dans `docs/strategy/site-v3/mesures/`, après la revue adaptée au diff. La publication candidate est remplacée par une intégration documentaire. Pas de recette, page, sceau, ajout SERVICE_DESIGN/EEAT ou suivi J+7/J+28 pour une page non publiée.

`service:preparer`, corps à neuf sections, trois cas fictifs, revue métier PASS et `service:sceller` sont non applicables à cette non-ouverture. Le paquet durable inclut les scripts, captures et vérification ; ne pas dépendre d’un scratch après clôture.

Réouverture seulement sur preuve distincte : demande qualifiée d’un cabinet montrant un retraitement répétitif entre outils non couvert par son pilotage natif, sources et méthode de coûts accessibles ; ou mesure commerciale pertinente confirmée par une SERP exploitable. Un article informationnel ou un comparatif n’est pas lancé comme substitut automatique.
