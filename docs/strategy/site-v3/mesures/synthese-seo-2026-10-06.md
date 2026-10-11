# Prise en charge SEO — 6 octobre 2026

Décision : traiter les cinq citations rouges en premier ; transmettre le maillage et les opportunités de titre à H4 déjà ouverte, sans doublon. Renouveler l’échantillon C6 depuis la veille existante, sans nouvelle collecte payante. Les relevés ne prouvent pas que le site est sain.

## État des trois instruments

| Relevé | Exécution | Santé et couverture |
|---|---|---|
| C2 demande, 8416f0f0f661 | node scripts/seo/releve-demande.mjs --json ; sortie 0 | GSC mesuré, trois dimensions sur 7/28 jours, totaux et période précédente ; 31/31 SERP non mesurées |
| C3 intégrité, 8cc31dbdda05 | node scripts/seo/integrite.mjs --json ; sortie 2 | Rouge : 55 pages lues, aucun échec de page ; 46/51 citations soutenues, 5 contrôles rouges ; 6 PSI mobiles complètes |
| C4 autorité, 338941579226 | node scripts/seo/autorite.mjs relever --budget 0.60 ; sortie finale 0 | Incomplet : autorité, marque SERP, citations IA et référents non mesurés ; accès HTTP/robots pour 11 agents et llms.txt mesurés |

Sources : sorties cron du 06/10 à 00:41:36, 00:33:53 et 00:39:30 dans le profil marketing ; trois bruts datés conservés à l’identique dans ce paquet. Les observations décrivent le run du 06/10, pas une nouvelle mesure du site.

## P1 — citations, cinq tâches → t_712a0bf3 (dev, forge blog)

Quatre citations de https://entreprendre.service-public.gouv.fr/vosdroits/F10029 ont expiré par timeout dans relance-pièces, saisie, pilier et logiciel-IA. Ce n’est pas une preuve de disparition. Le calendrier fiscal Impôts répond, mais son extrait exact est absent dans la vérification du pilier.

La carte créée demande une relecture actuelle, puis conservation si soutenue ou correction de l’extrait/affirmation si nécessaire, via recette et manifeste de la forge. Publication après build, CI verte et une revue métier PASS. Aucun remplacement aveugle de source. Les cinq IDs exacts et leur routage sont dans prise-en-charge.json ; la file d’origine est préservée.

## P2 — maillage, huit tâches → H4 t_28337116 existante

Transmission consignée par commentaire 5767 :
- Trois articles à deux liens entrants pour un seuil de trois : surcharge de travail, IA/métier comptable, tests verts.
- Quatre satellites absents du pilier : surcharge, IA/métier, utiliser ChatGPT, vérifier une réponse IA.
- Une ancre du pilier « rapprochement bancaire » vers le glossaire à préciser.

La même carte prend aussi les anomalies hors file : huit articles sur seize sans route depuis une page hors blog ; « Utiliser sans compte → » vers treize outils différents. La matrice H4 choisira des liens contextuellement utiles, pas un remplissage pour atteindre un compteur.

Les sources et le maillage touchent le pilier commun : hotspot signalé ; pas de dépendance artificielle entre ces corrections. Synchroniser à l’intégration.

## P3 — demande et choix éditoriaux → H4 existante, après le 15/10

La proposition locale 2026-10-06-recaler-titre-prompt-chatgpt-expert-comptable-1 est transmise à la forge blog par H4 : « chatgpt expert comptable », position 12,2, cinq impressions sur sept jours, aucun clic mesuré. Le périmètre H4 fixe la lecture après le 15/10 ; conserver cette proposition, ne pas changer le titre automatiquement sur cinq impressions.

Autre opportunité : « calcul echeance », position 8,6 et cinq impressions, aucun clic, sur le calculateur d’échéance. À examiner avec l’intention réelle de la page dans H4 ; pas de nouvelle variante.

Deux reculs moyens vs dernier instantané du 20/09 : comptes rendus métier DSN 6,3 → 10 (impressions 9 → 32) ; contrôle des bulletins 3,9 → 10,2 (18 → 42). Suivi au prochain C2 : hausse d’impressions, donc ne pas les appeler chute d’audience ; effet du mélange de requêtes possible. Pas de réécriture DSN ni nouvelle carte déclenchée par ce seul relevé.

Cannibalisation : seule la marque « memlia » se répartit sur dix URL/7 jours et quatorze/28 jours ; liens de site possibles. Position moyenne GSC de marque 1,5/28 jours. Aucune requête hors marque sur plusieurs URL dans les lignes rendues : pas de fusion éditoriale ni de dégradation SERP déduite.

Trente requêtes primaires fraîchement testées ; vingt autocomplétions vides sans panne : proxy sous seuil, pas absence de demande. Les titres vérification IA, confidentialité et automatisation sans changer de logiciel seront revus avec les données après le 15/10, pas supprimés faute de suggestions.

GSC : 177 impressions/4 clics (27/09–03/10), 467/26 (06/09–03/10), 11/2 (09/08–05/09). Le registre parArticle comprend outils et ressources, pas seulement blog. Requêtes anonymisées, mobile et autres localisations exclus du diagnostic SERP.

## Limites de mesure — séparées

1. DataForSEO : identifiants absents de l’environnement des processus C2/C4. SERP C2, backlinks, rang et correction de marque C4 non mesurés. Cela ne prouve pas que le compte ou le connecteur Hermes est absent ; aucun secret consulté ou déplacé sur cette carte. Ne pas convertir null en zéro ni réutiliser les six domaines du 20/09 comme une mesure actuelle. Limite transmise au propriétaire des routines t_77f15614, commentaire 5768. Accès à résoudre dans un périmètre dédié avant un nouveau relevé complet.
2. Cloudflare Analytics : CLOUDFLARE_ANALYTICS_TOKEN absent du processus C4. Référents non mesurés. Une session Wrangler ou des droits Pages/zone ne prouvent pas l’accès Analytics ; couverture attendue top 50 groupes, non exhaustive. Même transmission, distincte de DataForSEO. Aucune audience inventée.
3. Citations IA : zéro requête et zéro avecRecherche ; les zéros de citations/nomme sont des valeurs techniques sans mesure. Aucun appel payant fait. Coût déclaré nul cohérent avec ces exclusions, pas une preuve de disponibilité du compte.
4. CrUX absent : non mesuré. /contact : bonnes pratiques PSI 92, un relevé sous le plancher 95, à confirmer au prochain C3 (07/10 selon planning actif) avant correction ; aucun rouge de vitesse déclaré par l’instrument.
5. Préparation : node_modules non suivi dans les ateliers ; signal au propriétaire des routines, sans réparation Hermes ici. Autorité : fetch 128 repris avec succès, parse5 absent au premier lancement puis lien de dépendances rétabli. Pas de panne réseau persistante à bloquer.

## Renouvellement C6 effectivement préparé

La routine d06feab2c862 est enabled/scheduled, dernier run 29/09 ok, prochaine échéance le 06/10 à 07:35. Le périmètre questions reste ouvert, même si la carte historique t_6bdef7fe est archivée. Aucun chantier LinkedIn/mail/CRM arrêté n’est réactivé.

Deux questions expirées du 01/09 et du 26/08 ont été remplacées par deux observations réellement présentes dans la sortie anonymisée C6 du 29/09 : suivi des documents clients (publication 21/09) et commande vocale (26/09). Titres anglais exacts conservés, source et URL présentes ; date d’observation 29/09 séparée des dates de publication, retenues prudemment pour la fraîcheur. Aucun rafraîchissement artificiel à la date du jour. Ces observations étrangères prouvent seulement une douleur et restent sous le seuil de nouvel accès : ni règle française ni demande France déduite.

Composition conservée : quatre C1, quatre C6, trois glossaire. Le validateur réel validerEchantillonIa échoue sur l’ancien fichier et passe sur le candidat au 06/10. La C6 du 07/09 conservée expire après le 08/10 : revalider à l’intégration. Le changement de deux questions interdit une comparaison globale directe des citations avec septembre ; comparer éventuellement le sous-échantillon commun en le nommant.

## Durabilité et publication des mesures → t_96616444 (dev)

Le paquet contient les trois bruts, les deux files locales, le candidat C6, la preuve C6 anonymisée, le manifeste de routage et le script de vérification. Carte d’intégration créée : fusionner la file par ID, sans marquer les corrections faites, intégrer les mesures et l’échantillon après validation actuelle. PR, CI verte et une revue QA PASS ; aucun reçu opérateur Telegram exigé. Le garde est déjà pris en charge par t_65812c95 : pas de doublon de réparation.

Rien n’a été modifié dans le site, les ateliers des crons ou Hermes ; rien n’a été publié depuis cette carte. Le résultat est une prise en charge vérifiable et un candidat C6 validé, pas la résolution déjà effectuée des défauts publics.
