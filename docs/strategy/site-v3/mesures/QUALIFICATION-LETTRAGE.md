# Lettrage des comptes de tiers : qualification du 6 octobre 2026

## Décision

Ne pas ouvrir /automatisation/lettrage à ce stade. Le besoin d'apparier les factures et leurs règlements est réel et une offre concurrente spécialisée existe. Le relevé trouve surtout une intention d'utiliser un lettrage natif ou d'en comprendre les règles ; il ne suffit pas à établir une intention distincte de confier une automatisation sur mesure à Memlia.

Rattachement commercial : /automatisation-cabinet-comptable. Réponses par environnement : conserver /integrations/lettrage-cegid et /integrations/lettrage-sage avec leur maillage existant vers /automatisation/saisie-comptable. Le lettrage reste distinct du rapprochement bancaire : le premier apparie des écritures de tiers, le second confronte les mouvements bancaires et la comptabilité. Aucun déplacement, changement de canonical ou création de synonyme n'est proposé.

Cette décision n'est ni « aucune demande », ni « aucun concurrent ». Les suggestions génériques et la présence de HOLCO justifient de garder la famille, pas de fabriquer immédiatement une page commerciale supplémentaire.

## Mesure fraîche

Instrument : Google Suggest, client firefox, hl=fr, gl=fr. Captures brutes dans captures/suggest-*.txt ; horodatage UTC dans mesures.json. Huit sondes réussies après remplacement du client Python en erreur de certificat par curl, sans désactiver TLS. Les échecs initiaux sont conservés dans mesures-echec-python.json.

| Requête sondée | Suggestions |
|---|---:|
| automatisation lettrage comptes tiers cabinet comptable | 0 |
| lettrage automatique | 10 |
| lettrage automatique comptabilité | 0 |
| automatiser lettrage comptes tiers | 0 |
| lettrage automatique cabinet comptable | 0 |
| lettrage factures règlements | 0 |
| lettrage automatique cegid | 1 |
| lettrage automatique sage | 5 |

Cinq listes vides, seize suggestions additionnées par sonde (avec doublons entre sondes, pas seize intentions uniques). La liste générique cite Sage 100, Pennylane, Odoo, Excel, EBP, Sage, EBP Compta, SAP et Sage X3, ainsi que « lettrage automatique ». Aucun volume mensuel n'est mesuré ; une liste vide n'est pas une preuve de volume nul.

## Recherche et concurrence réellement ouvertes

Le moteur web_search a échoué en 403. Les trois HTML Google ont répondu 200 mais ne contiennent que la demande de réactiver JavaScript : ils ne sont pas des SERP exploitables. Alternative : deux SERP DuckDuckGo HTML exploitables, et une troisième en challenge 202, conservée mais non comptée comme résultat.

La SERP « lettrage automatique comptes tiers cabinet comptable » présente Compta Online, Hayot Expertise, Djaboo, HOLCO, ExpertFiscal et plusieurs guides génériques. Ce sont surtout des explications du geste, avec Djaboo sur une page de fonctionnalité et HOLCO sur une ressource liée à sa démonstration. La SERP « lettrage automatique Cegid » présente l'aide native, des tutoriels et la documentation API. Aucun classement Google France n'est revendiqué.

### 1. HOLCO : concurrent spécialisé, pas simple guide neutre

Source ouverte 200 : https://holco.co/ressources/lettrage-comptes-tiers-ia/ ; date affichée 2026-08-18. Capture holco.txt et texte holco.md.

Extrait exact : « La couche n'écrit aucun lettrage dans le logiciel comptable. Elle renvoie des paires à valider, groupées, avec le lien vers le compte concerné. »

La page propose « Voir une proposition de lettrage sur un compte » et une démonstration de vingt minutes. Elle décrit un appariement déterministe et la mémoire des arbitrages du cabinet. C'est une offre concurrente proche du périmètre candidat ; ne pas reprendre comme vérités indépendantes ses affirmations générales de rendement, de fiabilité ou de compatibilité. Sa présence prouve une offre publique, pas un volume de recherches ni l'usage réel de cette offre.

### 2. Cegid : alternative native à regarder avant une mission sur mesure

Source ouverte 200 : https://cegid-xrphr-sprint-help.cegid.com/CegidXRPHROnlineHelp/11.9.0/CCMP/Vues_ensemble/ve_lettrage_automatique.htm ; documentation au chemin de version 11.9.0. Capture cegid-auto.txt et texte cegid-auto.md. Ce périmètre n'est pas Cegid Loop et ne doit pas lui être attribué.

Extrait exact : « Les listes de choix Référence facture et Référence règlement permettent de définir le type d'éléments de la pièce de nature facture à rapprocher avec le type d'éléments de la pièce de nature règlement. »

La documentation décrit un paramétrage sur références et dates, avec une limite au-delà de laquelle le produit ne rapproche pas les montants. Elle confirme que le besoin peut être déjà couvert par l'outil. Pour un cabinet dans ce périmètre, vérifier d'abord ce paramétrage ; la page Memlia ne doit pas présenter le lettrage comme une capacité inexistante dans le logiciel.

### 3. Cegid Loop : conditions de l'import lettré

Source ouverte 200 : https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html. Capture cegid.txt et texte cegid.md ; sans version ni date de modification affichée.

Extrait exact : « Le paquet lettré doit être équilibré (débit = crédit) pour un même compte lettrable. »

Le document porte sur un import, pas sur une interface ni une exécution testée. Il confirme la nécessité de garder un périmètre de compte et de ne pas masquer un écart. Aucun appel API authentifié ni import n'a été tenté.

### 4. Sage 100 : guide existant à conserver

Source ouverte 200 : https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010160118208 ; modification affichée le 5 septembre 2023. Capture sage.txt et texte sage.md.

Extrait exact : « Dans la gestion des tiers, lorsque le lettrage y est effectué, le code lettrage est propre à chaque tiers. »

La fiche explique deux accès et leur incrémentation différente. Elle ne prouve pas une tolérance d'écart universelle. Le guide Memlia couvre déjà cette frontière ; conserver sa cible « lettrage sage ».

L'ancien lien de blog Cegid ressortant en SERP redirige aujourd'hui vers Shine (sources-complement.json). Il n'est pas traité comme une cinquième source Cegid indépendante.

## Cannibalisation et surface réellement présente

Source locale : origin/main, révision 69269f83, worktree site/lettrage-t_d5d8535a. Lecture de la charte v4, du backlog-v3, du cache du 19/09, du registre et de l'architecture commerciale.

Le backlog porte déjà quatre angles ordinaires de la famille lettrage, dont « lettrage automatique comptable » pour les règles et refus et « checklist lettrage comptable avant clôture ». Ils restent des candidats éditoriaux, pas des articles publiés revendiqués. Le cache historique à zéro sur les formulations longues reste historique ; le présent relevé n'est pas écrit par-dessus.

Production ouverte avec Cache-Control: no-cache : les deux guides de lettrage et le service général répondent 200. /automatisation/lettrage répond 404. sitemap-index.xml pointe vers les sitemaps typés ; sitemap-guides.xml conserve les deux guides. Leurs corps relient déjà le service saisie comptable, et leur pied de page le service général. Aucune correction du site n'est nécessaire pour rendre le rattachement commercial accessible.

## Périmètre utile, si un besoin qualifié arrive

Préparer les paires facture/règlement d'un même tiers, dans la même devise, avec références et montants explicités ; exposer les différences. La validation du lettrage et les écritures d'écart restent humaines. Les paiements multi-factures non couverts par la règle, références ambiguës, devises différentes ou pièces absentes arrêtent la proposition. Pas d'assimilation au rapprochement bancaire ni de promesse de compatibilité Cegid/Sage sans essai.

Prochaine expérience : examiner une demande entrante explicite où les règles natives ne suffisent pas, ou une remontée Search Console sur les guides de lettrage. Rechercher alors ce qui manque précisément au cabinet, avant toute page dédiée. Pas de nouvelle carte de publication ni de revue de contenu réglementé tant qu'aucun corps commercial n'est retenu.

## Transmission au développeur

L'enfant t_c392fd57 est réorienté vers l'intégration documentaire, sans publication. Copier uniquement les trois documents de livraison/ dans docs/strategy/site-v3/mesures/ : ce rapport, demande-lettrage-2026-10-06.json et rattachement-lettrage-2026-10-06.json. Ne pas modifier le registre global : le fragment documente une qualification, pas une réservation primaire pour une route non retenue.

La préparation, la revue métier et le scellement de recette ne s'appliquent pas : aucun service retenu, aucun corps à valider. La recherche et les preuves de décision sont terminées ; l'enfant assure uniquement leur pérennisation dans le dépôt. Le paquet durable contient les captures, mesures et scripts de contrôle.
