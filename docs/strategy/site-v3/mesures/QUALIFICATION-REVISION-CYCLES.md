# Révision par cycles : ne pas ouvrir la page de service dans cette vague

Qualification du 06/10/2026 — t_b381eb52, vague 3 rang 35.

## Décision

Ne pas ouvrir `/automatisation/revision-cycles` maintenant. Conserver la famille et rattacher son besoin de délégation au service général `/automatisation-cabinet-comptable` dans la documentation d’architecture, sans modifier la page publique ni ajouter une capacité promise.

Le besoin existe : un éditeur dispose d’une page dédiée exactement aux cycles de révision, et plusieurs offres documentent l’alimentation des feuilles et les contrôles. Mais les mesures disponibles portent surtout sur la méthode, le dossier de travail et le choix d’un logiciel. Elles ne démontrent pas un besoin distinct de déléguer une règle sur mesure entre les outils du cabinet. Sans demande qualifiée ni preuve d’un défaut de couverture natif, une page Memlia sur l’ensemble de la révision répéterait une catégorie logicielle déjà servie, sans différence opérationnelle éprouvée.

C’est une décision de périmètre pour cette vague, pas une conclusion d’absence de marché. Un zéro de Suggest n’est pas une preuve d’absence de demande.

## Mesures fraîches

Instrument du dépôt actualisé : `scripts/lib/seo-instruments.mjs:autocompleterGoogle`, Google Suggest Firefox, hl=fr, gl=fr. Exécution réelle de `node rechercher.mjs` le 06/10/2026 : huit réponses réussies, quatre listes vides, dix-neuf suggestions (certaines élargies automatiquement par Google).

| Amorce | Suggestions |
|---|---:|
| automatisation révision comptable cycles cabinet comptable | 0 |
| automatisation révision comptable | 0 |
| révision comptable par cycles | 4 |
| justification des soldes comptables | 1 |
| logiciel révision comptable | 4 |
| contrôle automatique révision comptable | 0 |
| dossier de révision comptable | 10 |
| automatiser justification des soldes | 0 |

Les suggestions exactes sont dans `autocompletion-revision-cycles-2026-10-06.json`. « révision comptable par cycle pdf », « révision comptable par cycle excel », « méthodologie révision comptable par cycle », « logiciel de révision comptable gratuit » et les modèles de dossier caractérisent principalement une recherche de méthode, support ou équipement. Aucun volume mensuel, potentiel de trafic ni taux de conversion n’est déduit.

## Recherche concurrentielle et limites

Firecrawl recherche/extraction a renvoyé 403 ; reprise par HTTP direct avec curl et TLS normal, puis navigateur. La SERP Bing de la candidate longue remonte surtout l’automatisation générale, donc ne tranche pas l’intention. La reprise HTTP Bing sur `"révision comptable" automatisation` fournit une liste pertinente : ComptaSecure, E-Clid, MyU et des contenus pédagogiques/généraux. Cette capture est exploitable pour découvrir les alternatives, pas un classement Google France ni une mesure de volume. Le navigateur a ensuite demandé un défi de sécurité ; il n’a pas été résolu ni contourné. Les fichiers HTTP capturés avant ce constat sont conservés ; pas de poursuite sur le défi.

Sources primaires éditeurs ouvertes directement le 06/10/2026 en HTTP 200 :

1. MyU, page besoin : https://myu.fr/cabinet-comptable/besoins/revision-comptable/ . Son titre et son entrée « Automatiser mes cycles de révision » occupent déjà exactement le besoin large. Il s’agit d’une offre logicielle, pas de la preuve qu’un cabinet veut acheter un service sur mesure.
2. MyU, production comptable : https://myu.fr/cabinet-comptable/logiciels/myu-production-comptable-fiscale/ . Citations exactes : « Cycles, diligences, avancement et alertes réunis sur un seul écran. » et « Elles se remplissent automatiquement depuis la comptabilité et génèrent les écritures d'inventaire, sans ressaisie. » Cela documente console, alimentation des feuilles et génération proposée par l’éditeur, pas une compatibilité Memlia. Ses garanties et ses chiffres promotionnels ne sont pas repris ; ni fonctions essayées ni couverture universelle revendiquées.
3. ACD : https://www.acd-groupe.fr/solution-expert-comptable/acd-compta/ . Citation : « il optimise la tenue et la révision de la comptabilité de tout type de dossier, quel que soit son secteur d’activité. » La page situe l’alternative native sans détailler les contrôles par cycle. L’URL ACD révision essayée initialement était une 404, remplacée après lecture des vrais liens du menu.
4. E-Clid : https://e-clid.io/ . Libellés exacts : « Automatisation de la révision comptable », « Analyses statistiques », « Repérez les incohérences et les données manquantes grâce à une revue analytique des données. » Offre adjacente de contrôle des données ; son mélange avec l’audit ne définit pas le périmètre EC de Memlia. Aucun témoignage nominatif n’est utilisé comme preuve.

Captures HTML et texte conservées. Examen ciblé, non exhaustif ; aucune fonction éditeur testée. La page d’accueil de l’Ordre a été ouverte, mais ne fonde aucune règle normative par cycle : elle n’est pas invoquée comme source de procédure. Cette note interne ne formule aucune obligation légale, fiscale ou professionnelle nouvelle.

## Besoin utile à conserver

Hypothèse de mission à qualifier : rejouer une liste de contrôles déterministes définie par le cabinet, rapprocher balance et justificatifs autorisés, préparer une proposition documentée de justification et une liste d’écarts. Un rapprochement réussi ne signifie pas que le solde est définitivement justifié.

| Se prépare seul après règle et accès éprouvés | Attend une validation | Reste humain |
|---|---|---|
| Rejeu des contrôles écrits, rapprochements des données, références aux pièces, liste d’écarts et proposition de justification | Périmètre et complétude des sources, portée des contrôles, exceptions et justification proposée | Appréciation du solde, choix des diligences, écritures d’inventaire et décision finale du cabinet |

Arrêts à prévoir dans une recette future : balance et pièces de versions différentes, période incompatible, pièce absente ou illisible, solde non rapprochable, écart inexpliqué ou cas hors règle. Conserver les saisies et notes humaines. Pas d’écriture d’inventaire automatique ni de visa automatique du dossier. Ce geste ne prend pas en charge la clôture entière et ne constitue pas un audit légal. Le service bancaire ne devient pas la page canonique de toute la révision parce que la trésorerie est un cycle.

Ce tableau n’est ni un produit construit, ni un rejeu exécuté. Aucun résultat fictif ou PASS métier n’est inventé.

## Anti-cannibalisation et rattachement

Worktree créé depuis origin/main actualisé, branche `site/revision-cycles-t_b381eb52`, point de départ 9cad26ef4ad765a0af8f0dde95acad74801789d6. Quatre angles informationnels existent déjà au backlog : justification des soldes, contrôles répétitifs, anomalies qui restent au jugement et définition des cycles. Ils restent planifiés, pas lancés en substitut à cette page. Le glossaire contient déjà une définition Memlia de la révision ; `/integrations/cloture-sage` traite une intention outil/clôture différente. Registre commercial et contrat d’intention : aucune occurrence révision/soldes dans les fichiers relus ; aucun emplacement n’est réservé.

Le cache du 19/09 est conservé comme contexte historique, jamais présenté comme relevé frais. Le service général demeure la destination commerciale documentaire. Constat réel, sans query string et avec Cache-Control no-cache : candidate HTTP 404 ; service général HTTP 200. Aucun canonical, sitemap, footer, H1, article ou parcours existant n’est modifié.

## Livraison et réouverture

L’enfant t_07e437e6 est réaffecté à l’intégration documentaire de cette qualification, de la mesure et de la décision dans `docs/strategy/site-v3/mesures/`, plutôt qu’à la publication conditionnelle. Le paquet durable contient scripts, captures, contexte et vérification.

Recette à neuf sections, `service:preparer`, trois cas fictifs, revue indépendante métier PASS et `service:sceller` sont non applicables à une page non retenue. Ni page de service ni suivis J+7/J+28 créés.

Réouverture sur une demande qualifiée démontrant un contrôle répétitif non couvert par les fonctions natives et des sources accessibles, ou sur une intention de délégation distincte confirmée par une SERP pertinente. La première tâche serait ce contrôle précis, pas une promesse générale de révision automatisée. La note ne déclenche aucun article, outil ou comparatif nouveau.
