# Boucle des outils gratuits — règle préenregistrée

Règle figée le **20 septembre 2026 à 21:12 Europe/Paris**, avant le premier relevé page par page des trois outils publiés. Elle ne se déplace pas après lecture des résultats. Une évolution crée une nouvelle version datée et n’altère pas l’interprétation de la vague 1.

## Version 2 — ouverture EC et CAC, 6 octobre 2026

Kevin a levé le plafond d'une seule nouvelle place le 05/10/2026 (programme CAC, G3). À compter de cette version, plusieurs outils peuvent être cadrés et construits en parallèle, pour les EC et les CAC, sur demande mesurée et besoin autonome complet. L'ouverture n'attend plus le 21 octobre ni le franchissement d'un seuil par les outils historiques. Chaque candidat a sa fiche, sa recette, sa revue et ses suivis J+7 et J+28 ; il reste utile sans inscription et son traitement local doit être vérifié. Un outil CAC reçoit aussi la fiche outil de la charte v5 pour l'appréciation par le CAC.

Les § 3 et 4 et la dernière ligne des seuils de l'addendum du 21 septembre sont conservés ci-dessous comme **règle historique v1**, pour lire ses cohortes et ses hypothèses. Ils ne limitent plus les constructions nouvelles : « une seule place », « une seule construction », « attendre » et le gel jusqu'au 21 octobre sont supersédés. Les instruments, la séparation des cohortes, les seuils d'évaluation préenregistrés, le retrait pour erreur et les exigences de preuve restent valables. Lever le plafond ne transforme ni un zéro lien en succès d'autorité ni un signal ND en zéro ; une construction nouvelle se justifie par sa demande propre, pas par la réinterprétation des résultats de la vague 1.

## 1. Population et source de vérité

La vague 1 comprend exactement les trois routes `statut: disponible` de `src/data/outils.ts` :

- `/outils-comptables-gratuits/calculateur-marge-commerciale` ;
- `/outils-comptables-gratuits/calculateur-date-echeance-facture` ;
- `/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit`.

Le hub est relevé séparément ; il n’est pas compté comme un outil. La visibilité organique commence à être interprétable après la correction du maillage du 20 septembre : les chiffres antérieurs décrivent aussi l’invisibilité du hub.

Le groupe de comparaison est relevé avec les mêmes instruments : pages de service sous `/automatisation/` et articles sous `/blog/`. Les totaux, le nombre de pages ayant au moins un signal et la médiane par page sont conservés séparément. Les âges de publication sont affichés : une différence brute ne devient jamais un effet causal.

## 2. Mesures figées avant résultat

Pour chaque route :

| Mesure | Instrument | Règle de lecture |
|---|---|---|
| impressions, clics, CTR, position moyenne | Search Console `sc-domain:memlia.fr`, dimension `page` | fenêtre close trois jours avant le relevé ; une ligne absente vaut zéro seulement si l’appel a réussi |
| page d’entrée | Cloudflare Web Analytics, chemin de la page d’entrée | `ND` si le jeton ou le jeu de données manque ; jamais remplacé par les chargements de nos recettes |
| contact atteint | D1 `memlia-contact`, `COUNT(*) GROUP BY origine` | compte uniquement les envois dont le référent interne immédiat est la route exacte ; aucune donnée nominative n’est lue |
| domaines référents | DataForSEO Backlinks, cible URL exacte | domaines externes vivants ; le domaine propre et les doublons sont exclus ; coût journalisé derrière la porte |
| indexation | Search Console URL Inspection | condition de validité du silence : une page non indexée ne peut pas être déclarée inutile |

Un zéro n’est publié que si l’instrument a répondu. Une panne, un quota ou un accès absent rendent `ND` et interdisent le verdict correspondant.

## 3. Dates de décision

- **27 septembre 2026, J+7** : contrôle technique seulement — indexation, disponibilité des instruments, source officielle encore vérifiable. Aucun verdict de demande ni d’autorité.
- **21 octobre 2026** : première fenêtre close complète, du 20 septembre au 17 octobre inclus. Premier droit d’ouvrir une place.
- **19 décembre 2026, J+90** : verdict sur l’hypothèse de lien gagné et sur les outils sans usage mesuré.

Entre ces dates, le relevé peut tourner ; il n’ouvre aucune vague hors de la règle ci-dessous.

## 4. Règle de déclenchement de la vague suivante

À partir du 21 octobre, **une seule place** s’ouvre si au moins un de ces signaux est mesuré sur une route d’outil :

1. **autorité** : au moins **un nouveau domaine référent externe vivant** vers la route exacte, absent du point zéro du 20 septembre ;
2. **demande organique** : au moins **3 clics**, ou **50 impressions avec une position moyenne au plus égale à 20**, sur la fenêtre close ;
3. **intention commerciale** : au moins **un envoi de contact** dont `origine` est la route exacte de l’outil.

Les pages d’entrée Cloudflare sont un diagnostic, pas un déclencheur : les passages de recette et l’absence de référent rendent leur causalité trop fragile.

La place ouverte va au premier candidat autonome du catalogue validé. Au 20 septembre, un seul candidat est remplissable : le générateur local de prompt pour expert-comptable, score 9. Même si plusieurs seuils passent, **une seule construction** est ouverte ; le vivier est ensuite remesuré avant toute autre place. Cette carte ne crée pas elle-même la carte de construction.

Si aucun seuil ne passe le 21 octobre, l’état est `attendre` jusqu’au 19 décembre : aucune vague n’est lancée parce que la précédente était agréable à produire.

Au 19 décembre :

- si les routes d’outils ont gagné au moins un domaine référent, l’hypothèse « outil utile → lien spontané » reste ouverte et une place au plus peut être attribuée selon la règle ci-dessus ;
- si elles ont gagné **zéro domaine référent**, l’hypothèse stratégique de lien est déclarée **non confirmée à J+90** : aucune nouvelle construction n’est ouverte sur ce motif, le catalogue retourne au classement, et toute reprise exige une nouvelle mesure de demande, pas un déplacement du seuil ;
- un clic ou un contact peut justifier de conserver un outil, mais ne transforme pas zéro lien gagné en succès d’autorité.

## 5. Retrait et correction

### Justesse — priorité absolue

Chaque jour, un contrôle rouvre la source primaire datée de chaque outil et vérifie que l’extrait qui fonde la règle est encore présent. Trois lectures réseau au plus distinguent une panne brève d’une source devenue invérifiable. Après trois échecs, ou si l’extrait disparaît, l’outil concerné passe en suspension : calcul indisponible, retrait du hub, motif et date visibles. Il ne se réactive jamais automatiquement ; une source primaire fraîche, une recette et une publication vérifiée sont requises.

Le profil `marketing` qualifie la source et consigne le relevé. Le profil `dev` intervient seulement si la correction change la règle ou le calcul. L’outil reste suspendu pendant la correction. Un outil faux en ligne est un incident, pas une tâche de contenu ordinaire.

### Utilité — J+90 seulement

Un outil devient candidat au retrait pour absence d’usage uniquement si, pendant 90 jours après son indexation, il cumule : zéro impression, zéro clic, zéro entrée externe Cloudflare mesurée, zéro contact d’origine et zéro domaine référent. Un seul `ND` interdit le retrait pour inutilité. Le retrait enlève l’outil du hub et du sitemap ; la route conserve une réponse explicite ou une redirection seulement après vérification qu’aucun lien ni impression ne serait perdu.

## 6. Interdits de lecture

- Ne jamais additionner les contacts, les clics et les domaines comme s’ils avaient la même valeur.
- Ne jamais compter un domaine qui lie seulement l’accueil comme un lien gagné par un outil.
- Ne jamais conclure qu’un outil « convertit » parce qu’une visite a ensuite ouvert `/contact` : seul l’envoi D1 est un contact mesuré.
- Ne jamais comparer les trois outils âgés de quelques jours à un article plus ancien sans afficher l’âge.
- Ne jamais réécrire ces seuils dans le relevé qui les évalue.

## Addendum du 21 septembre 2026 — quatrième outil

Le calculateur d’amortissement comptable rejoint l’observation à compter de sa publication en production. Cet ajout ne modifie ni la population historique de la vague 1, ni ses seuils, ni ses dates du 27 septembre, 21 octobre et 19 décembre 2026. Les relevés continuent donc d’afficher séparément les trois outils publiés le 20 septembre et le calculateur d’amortissement, plus jeune d’un jour.

Pour le calculateur d’amortissement :

- contrôle technique le **28 septembre 2026** ;
- première fenêtre de 28 jours du **21 septembre au 18 octobre 2026 inclus**, lisible après les trois jours de délai Search Console le **22 octobre 2026** ;
- lecture J+90 le **20 décembre 2026** ;
- mêmes instruments et mêmes seuils que la vague 1, sans créer une deuxième place : si plusieurs outils franchissent un seuil, la règle d’une seule construction reste inchangée.

Le suivi rapproche quatre grandeurs sans les additionner : Search Console pour la demande qualifiée, Cloudflare Web Analytics pour les pages d’entrée, D1 `memlia-contact` pour l’envoi volontaire attribué à la route exacte, et les événements `memlia:outil` pour le parcours dans l’outil. Au jour de l’addendum, ces événements restent locaux : démarrage, réussite, refus, recalcul, retour, copie, export et clic CTA sont **ND** en production tant qu’aucun collecteur n’est approuvé et branché.

La collecte personnalisée n’est pas ajoutée dans cette livraison. Elle exigerait d’ouvrir le `connect-src 'none'`, de remplacer la promesse publique « aucune valeur n’est envoyée », d’ajouter une surface serveur et sa politique de conservation, alors que Cloudflare Web Analytics et D1 couvrent déjà l’entrée et la conversion engagée. La décision à prendre avant tout collecteur est donc explicite : autoriser ou non une requête agrégée après interaction, avec liste fermée `{ action, outil }`, aucune valeur saisie, aucun identifiant applicatif, aucune persistance côté navigateur et une durée de conservation définie. Sans cette décision, le contrat local est conservé et n’est jamais présenté comme une télémétrie observée.
