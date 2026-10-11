# Rendez-vous et agenda : ne pas ouvrir de page commerciale dédiée

Qualification du 06/10/2026 — carte t_9710aa81, vague 3 rang 33.

## Décision

Ne pas ouvrir `/automatisation/rendez-vous-agenda`. Rattacher ce besoin à `/automatisation-cabinet-comptable`, sans ajouter une variante commerciale, un catalogue de capacités ou une promesse de fonction déjà livrée. L'absence de suggestion ne signifie pas absence de besoin : elle ne démontre ici aucune intention distincte de confier la préparation du rendez-vous à un service. Le besoin organisationnel est déjà documenté dans une offre métier native.

Cette décision ferme la publication candidate, pas l'accueil d'une demande de cabinet sur ce geste. Aucun contenu public n'est changé dans cette préparation. Le rattachement est architectural et documentaire, pas un ajout automatique à la page générale.

## Mesure fraîche de la demande

Instrument existant du dépôt : `scripts/lib/seo-instruments.mjs`, `autocompleterGoogle`, paramètres `hl=fr`, `gl=fr`, endpoint Firefox Google Suggest. Exécution réelle de `node rechercher.mjs`, toutes les réponses réussies, huit listes vides :

| Amorce | Suggestions |
|---|---:|
| automatisation préparation rendez-vous clients cabinet comptable | 0 |
| préparer rendez-vous client cabinet comptable | 0 |
| préparation rendez-vous bilan expert comptable | 0 |
| agenda partagé cabinet comptable | 0 |
| logiciel rendez-vous expert comptable | 0 |
| ordre du jour rendez-vous bilan client | 0 |
| documents rendez-vous expert comptable | 0 |
| automatisation rendez-vous cabinet comptable | 0 |

Captures horodatées : `preuves/autocompletion.json`. Aucun volume mensuel, trafic, conversion ou absence de concurrence n'en est déduit.

La recherche SERP spécialisée reste non qualifiée : web_search et web_extract refusés en 403 Firecrawl ; reprise Bing sur « préparation rendez-vous bilan client cabinet comptable logiciel » rend des dictionnaires pour « préparation », sans pertinence métier ; reprise Google sur « logiciel agenda cabinet comptable rendez-vous » renvoie une page de consentement et DuckDuckGo répond 202. Le statut HTTP 200 de Google n'est donc pas assimilé à une SERP exploitable. Captures des deux reprises HTTP dans `preuves/serp-*` ; résultat Bing observé dans browser_console. Aucun classement concurrent revendiqué.

## Besoin et alternatives documentées

Sources primaires éditeur ouvertes le 06/10/2026. Elles établissent les fonctions décrites par l'éditeur, pas leurs performances ni une compatibilité Memlia testée.

1. ACD GRC : https://www.acd-groupe.fr/solution-expert-comptable/acd-grc/ et plaquette liée https://www.acd-groupe.fr/wp-content/uploads/2023/01/FP-DiaClientGRC_decembre2022.pdf . Malgré le nom de fichier historique, le document porte « Avril 2026 » en fin de texte. Page 7, rubrique « MES PLANNINGS » : « Visualisez, imprimez, planifiez et affectez les différents rendez-vous, absences, charges issues de la mission... qui vous incombent, ou pour un ensemble de collaborateurs. » Puis « Vue agenda personnel et vues de groupe. » et « Synchronisation avec l’agenda d’Outlook®. » Le document décrit aussi les alertes liées, l'envoi direct d'e-mails de confirmation aux participants et la création de réunion Teams. Cela établit une alternative native pour calendrier, participants et confirmations, pas un ordre du jour généré ni une préparation complète des pièces.

2. La même plaquette, rubrique « ÉVÈNEMENTS », décrit « Ses interactions et liens dynamiques avec tous les modules : » puis « planning, SMS, e-mails, documents GED, scan, alarmes, temps... ». Cette articulation confirme que le rendez-vous s'inscrit déjà dans un suivi relationnel et documentaire. Ce n'est pas une preuve que la préparation du dossier est automatisée de bout en bout.

3. ACD GI : https://www.acd-groupe.fr/solution-expert-comptable/acd-gi/ . Citation exacte : « Planifiez vos charges et obligations, suivez leur avancement ». La plaquette liée capturée dans `preuves/acd-pdf.pdf` précise les alarmes d'échéances. Alternative adjacente pour jalons internes ; ne pas assimiler des obligations de mission aux rendez-vous clients.

4. fulll Pilotage : https://www.fulll.fr/pilotage-cabinet . Citation exacte : « Suivez la santé de votre portefeuille ». La page documente des indicateurs issus de la production et des alertes, pas un agenda ou un ordre du jour. Elle ne sert qu'à distinguer cette candidate du pilotage de portefeuille : aucune fonction rendez-vous fulll n'est attribuée.

Les fonctions éditeurs ne sont pas testées. L'examen n'est pas exhaustif. Pas d'affirmation fiscale, juridique ou réglementaire à publier ; aucune source officielle n'est invoquée pour légitimer une fonction technique.

## Périmètre utile conservé

Hypothèse de geste à observer seulement si un cabinet le demande : pour un rendez-vous périodique déjà choisi, rassembler les références des pièces autorisées, proposer un ordre du jour à partir des points ouverts et rappeler les jalons internes déjà renseignés. Le cabinet valide le contenu, la date, les participants et l'échange client.

| Se prépare seul, après règle et accès éprouvés | Attend une validation | Reste humain |
|---|---|---|
| Références des pièces disponibles, brouillon d'ordre du jour, liste des jalons saisis | Pertinence et partage des pièces, contenu de l'ordre du jour, modification du calendrier, message au client | Conduite du rendez-vous, priorités de conseil, interprétation du dossier et décisions |

Ce tableau cadre une hypothèse de mission, il ne rapporte ni un produit construit ni un rejeu. Arrêts à définir dans une future recette : dossier ambigu, destinataire non autorisé, pièce manquante, calendrier contradictoire ou point de conseil non qualifié. Aucune confirmation, annulation ou pièce jointe n'est envoyée automatiquement.

Frontières : pas de création du dossier/onboarding ; pas de tri général des messages ; pas de collecte ou relance de pièces sans mission distincte ; pas de reconstitution d'échéance réglementaire ni de diagnostic comptable.

## Cannibalisation et sources locales

Worktree `site/`, branche `site/rendez-vous-agenda-t_9710aa81`, créé depuis origin/main actualisé. Quatre angles sont déjà au backlog de la famille : préparation périodique, checklist, confirmations et définition de l'agenda. Leurs compteurs historiques sont nuls ; les questions associées portent notamment sur le coût d'un rendez-vous ou l'acquisition de clients et ne prouvent pas la délégation de sa préparation.

`preuves/cadrage.json` conserve ces quatre entrées et les contextes trouvés dans le cache, le registre, le contrat d'intention et `familles.ts`. Aucun rendez-vous/agenda trouvé dans le registre des requêtes ou le contrat de pages du snapshot : cela n'autorise pas une réservation sans demande. Les douze occurrences du cache sont des traces textuelles, pas douze captures distinctes.

La candidate répond 404, le service général 200, avec requêtes sans query string et Cache-Control no-cache ; `preuves/sources.json` conserve les états. Aucune URL existante, canonical, sitemap ou navigation n'est modifié.

## Transmission au développement

La carte enfant t_b050851a doit intégrer seulement cette qualification, la mesure et la décision documentaire sur main, après la revue adaptée au diff. Pas de page service à construire, de réservation dans le registre ni de J+7/J+28 pour une page non publiée. Le paquet durable contient les sources brutes et les scripts de reproduction. Ne pas tirer de contenu depuis un scratch susceptible d'être supprimé.

`service:preparer`, revue métier PASS, `service:sceller`, corps à neuf sections et rejeu sont non applicables à cette décision de non-ouverture. Aucun de ces livrables n'est simulé. Réouverture possible seulement après un signal distinct : demande qualifiée d'un cabinet montrant une préparation répétitive non couverte par son outil, ou mesure de recherche commerciale pertinente confirmée par une SERP exploitable. La checklist informationnelle n'est pas produite par défaut.
