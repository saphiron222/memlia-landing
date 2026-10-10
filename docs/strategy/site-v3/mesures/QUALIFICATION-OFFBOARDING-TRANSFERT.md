# Qualification du service fin de mission et transfert

Décision du 06/10/2026 : ne pas ouvrir /automatisation/offboarding-transfert. Le besoin existe, mais la mesure et la concurrence observée ne démontrent pas une intention commerciale distincte de délégation à Memlia. Rattacher la famille à /automatisation-cabinet-comptable, sans ajout public dans ce lot. Aucun service, article, guide ou outil nouveau n’est préparé.

## Demande mesurée

Huit sondes Google Suggest françaises, toutes HTTP 200 et JSON lisibles ; 5 listes vides et 11 suggestions au total (somme brute des réponses, pas volume mensuel). La candidate commerciale est vide. Les termes courts renvoient aux procédures, lettres, modèles et rapports. « Fin de mission » est ambigu : bilan des travaux et départ client ne désignent pas la même tâche.

| Requête mesurée | Suggestions | Réponse |
|---|---:|---|
| automatisation transfert dossier client cabinet comptable | 0 | Liste vide |
| transfert dossier expert comptable | 1 | transfert de dossier entre expert comptable |
| reprise dossier confrère expert comptable | 1 | reprise dossier confrère expert comptable |
| fin de mission expert comptable | 9 | fin de mission expert comptable; lettre fin de mission expert comptable; modele fin de mission expert comptable; rapport fin de mission expert comptable; lettre de fin de mission expert comptable exemple; travaux de fin de mission expert comptable; compte rendu de fin de mission expert comptable; exemple rapport de fin de mission expert comptable; mettre fin mission expert comptable |
| checklist transfert dossier comptable | 0 | Liste vide |
| logiciel transfert dossier comptable | 0 | Liste vide |
| automatisation fin de mission comptable | 0 | Liste vide |
| transmission dossier confrère expert comptable | 0 | Liste vide |

Une SERP DuckDuckGo exploitable sur la procédure de transfert affiche Compta Online, Kanta, Welyb, l’Ordre Pays de la Loire et des cabinets. Les autres tentatives DuckDuckGo sont des challenges HTTP 202 ; Google n’est pas utilisé comme preuve de classement. Les outils web Hermes Firecrawl sont refusés 403 : les captures curl, requêtes et statuts sont archivés. Ni volume mensuel, ni impression GSC, ni absence de concurrents ne sont déduits de ces listes.

## Besoin et concurrence

Le cabinet sortant a besoin d’une liste de pièces à remettre, d’un inventaire qui distingue attendu, trouvé et manquant, puis d’une trace de transmission et de réception. La décision de départ, les pièces transmissibles et le destinataire restent humains. Ce besoin n’est ni l’entrée d’un nouveau client, ni le rangement courant d’une GED.

- Ordre des experts-comptables Pays de la Loire, « Vous reprenez un dossier à un confrère » : source officielle ouverte HTTP 200, décrit la lettre déontologique de reprise et les honoraires éventuellement dus. Cela confirme le besoin professionnel, pas la demande d’automatisation.
- Welyb, « Comment faciliter la reprise des dossiers entre les experts-comptables ? » : article d’éditeur HTTP 200, daté du 08/09/2025, propose sa GED pour centralisation, partage et historique. Offre adjacente concrète, pas preuve d’un service d’automatisation d’offboarding complet ni test de ses fonctions.
- Kanta, « Comment se déroule une reprise de dossier comptable ? » : article d’éditeur HTTP 200, liste des étapes et propose un modèle de lettre. Concurrence éditoriale sur la reprise, non démonstration d’une automatisation de transfert.
- CNIL, « Sécurité : Sécuriser les échanges avec l’extérieur » : source officielle HTTP 200, recommandations sur fichiers sensibles, destinataires autorisés et durée de mise à disposition. Elle n’autorise pas un transfert et n’en décide pas le périmètre.

Attention de fond : Welyb présente un délai d’accord tacite, Kanta dit que le silence ne signifie pas accord tacite ; Kanta contient aussi une interdiction générale de transmission directe. Ces phrases d’éditeurs ne sont pas reprises comme droit positif. Si un contenu réglementé est rédigé ultérieurement, vérifier les textes actuels et les instructions ordinales applicables avec la revue métier. Aucune règle automatique n’est dérivée de ces contradictions.

## Rattachement et anti-cannibalisation

La famille src/data/familles.ts existe et reste intacte. Le backlog contient quatre angles informationnels sur transfert, checklist, points à signaler et lettre de confrère. Leur historique du 19/09 porte zéro suggestion et des questions parfois orientées Pennylane ; ces questions ne sont pas une mesure commerciale ni un test d’une fonction Pennylane. La nouvelle mesure est distincte et ne réécrit pas cet historique.

Le registre courant ne contient aucun transfert/offboarding/fin de mission ; aucune requête n’est réservée. Le service général répond HTTP 200, la candidate 404. Aucun canonical, lien, sitemap ni parcours public n’est modifié. On garde le rattachement conceptuel au service général ; on ne crée pas de variantes GED, onboarding ou transfert par logiciel. Les angles blog restent candidats, sans publication décidée ici.

## Périmètre utile si le besoin devient qualifié

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Inventaire des pièces dans le périmètre explicitement autorisé ; comparaison à la checklist du cabinet ; liste des manquants ; suivi de statut à partir des traces disponibles | Liste finale, destinataire, canal, version des documents et constat de remise | Fin de mission, droit de transmettre, traitement du litige et des honoraires, périmètre remis, arbitrage de conservation et des accès |

Pas d’envoi, révocation d’accès, suppression ou transfert sur une déduction d’IA ; pièce illisible, destinataire incertain ou litige non arbitré remonte au cabinet. Cette frontière est un cadrage de recherche, pas une automatisation livrée. Aucun rejeu fictif ou PASS métier n’est fabriqué puisqu’aucune recette publique n’est retenue.

## Reprise et prochaine expérience

Réexaminer si une requête de délégation obtient un signal qualifié et une SERP distincte, ou si un cabinet décrit un flux sortant répétitif réellement non couvert par son outil actuel. Prochaine expérience utile : observer, sans données clients, un départ de dossier multi-outils et comparer les étapes au transfert natif/GED existant. Pas de contact externe lancé. La seule apparition de suggestions informationnelles ne justifie pas une nouvelle page.

Enfant dev réorienté vers l’intégration documentaire de ce relevé, sans publication. service:preparer, revue métier et service:sceller sont non applicables à la non-ouverture, et ne sont pas déclarés PASS.

## Preuves et remise

Le paquet contient les captures brutes, textes, scripts, statuts HTTP, huit réponses Google Suggest et citations exactes contrôlées. Livraison documentaire : ce rapport, le JSON de mesure et la note de décision. Worktree site/offboarding-transfert-t_e78a826b depuis origin/main ; aucune modification publique ni commit. Le développeur intègre les trois documents dans docs/strategy/site-v3/mesures puis vérifie le diff sans modifier les registres globaux.
