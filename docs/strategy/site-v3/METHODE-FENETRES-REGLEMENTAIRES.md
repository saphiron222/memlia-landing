# Méthode des fenêtres réglementaires

Patron livré par ACCÈS C3 `t_d7108a46` à la veille C6 `t_6bdef7fe`. Il sert pour la
facturation électronique puis pour toute nouvelle fenêtre datée. Une fenêtre est un sujet dont la
demande monte autour d’un changement officiel et dont la valeur chute si le contenu garde une
ancienne date.

## 1. Détecter la fenêtre

Une fenêtre n’est retenue que si deux signaux existent :

1. **un changement primaire daté** : nouveau texte, décret, doctrine, calendrier, seuil, report ou
   liste officielle ;
2. **une demande observable** : autocomplétion, PAA, recherches associées, volume ou répétition de
   questions sur des terrains professionnels.

Un communiqué sans demande reste une veille. Une question sans source officielle reste une piste.
Le croisement des deux ouvre la fenêtre.

## 2. Geler un point de départ frais

Pour chaque source primaire, enregistrer avant analyse :

- URL demandée et URL finale ;
- éditeur et type (`texte`, `doctrine`, `annuaire`, `communiqué`) ;
- date affichée ou en-tête `Last-Modified` ;
- date/heure de consultation ;
- code HTTP et empreinte SHA-256 du corps brut ;
- citation exacte qui porte le claim et empreinte SHA-256 de cette citation ;
- claims que la source peut soutenir ;
- claims qu’elle ne peut pas soutenir.

Une source inaccessible, non datable ou servie depuis un cache non vérifiable ne soutient aucun
claim. Une page secondaire qui cite Légifrance ne remplace pas le texte Légifrance. Si la surface
canonique bloque mais que l’Open Data officiel DILA répond, le paquet peut servir de source
primaire seulement si le registre conserve l’URL exacte du paquet, son empreinte, le chemin XML,
l’identifiant de version, ses dates d’effet, son état et l’extrait exact. Une version historique ou
un XML dont l’applicabilité n’est pas établie reste fermé.

Sur une page dynamique, le hash brut peut changer à cause d’un jeton CSRF ou d’un identifiant de
rendu sans que la preuve change. Conserver ce hash de transport, mais sceller séparément l’extrait
exact qui soutient le claim. Toute divergence brute ouvre une différence ; seule la relecture du
corps et de l’extrait permet de la qualifier. Ne jamais remplacer silencieusement le hash précédent.

## 3. Mesurer le vocabulaire réellement tapé

Sonder le sujet selon sept axes, sans fabriquer ensuite une page par axe :

1. générique : `<sujet>`, `<sujet> <année>` ;
2. échéance : `calendrier`, `date`, `obligation`, `seuil` ;
3. rôle : expert-comptable, collaborateur, responsable, dirigeant ;
4. organisation : cabinet, TPE/PME, taille de cabinet ;
5. outil installé : chaque logiciel métier déjà observé ;
6. décision : choisir, comparer, prix, liste, annuaire ;
7. exécution : brancher, connecter, automatiser, contrôler, suivre.

Pour chaque sonde, conserver la liste complète, y compris vide. Mesurer ensuite une SERP par
intention candidate : top 10 URL, PAA, recherches associées, type de page dominant et présence de
sources officielles. Les volumes sont un troisième signal, pas un préalable à l’existence d’une
question.

Comparer explicitement deux colonnes : **vocabulaire officiel** et **vocabulaire tapé**. Le H1
porte la requête mesurée ; le vocabulaire officiel définit et source le corps.

## 4. Séparer les intentions avant les pages

Toute fenêtre part d’au moins deux intentions :

- **comprendre et se conformer** : réponse directe, sources, dates, personnes concernées ;
- **tenir le travail dans la durée** : règle écrite, flux, exceptions, validation, maintenance.

Ajouter une troisième intention seulement si la SERP la montre : choisir/comparer un outil ou une
approche. Elle utilise le type `/comparatifs/<sujet>`, pas un article déguisé ni une page de
service.

Une intention possède une URL seulement si elle a un signal distinct ou une fonction de conversion
explicite déjà justifiée par une requête de tâche. Un zéro mesuré peut nourrir une section ; il ne
justifie pas mécaniquement une route.

## 5. Décider fusion ou séparation par la SERP

Comparer les dix premières URL exactes des requêtes candidates :

| URL communes | Décision par défaut |
|---:|---|
| 7 à 10 | une page, requêtes primaire et secondaires |
| 4 à 6 | même cluster ; séparer seulement si la question du lecteur et le type de page diffèrent |
| 2 à 3 | pages adjacentes, lien réciproque |
| 0 à 1 | pages séparées ou sujet hors pôle |

Puis appliquer l’invariant du dépôt : une requête primaire n’appartient qu’à une URL indexable.
Un rôle, un logiciel ou une taille qui retombe sur la requête générique ne crée aucune page.

## 6. Construire le pôle minimal

Le plan ordonné indique pour chaque page : route, type (`blog`, `service`, `comparatif`, `outil`),
requête primaire, mesure datée, question exacte, preuve attendue, source primaire, page de
conversion et pages à fusionner.

Ordre de livraison :

1. destination commerciale justifiée et prouvée ;
2. pilier d’acquisition ;
3. satellites par intention distincte ;
4. comparatif seulement après mise en place de sa péremption ;
5. outil seulement si le SERP attend un outil et si Memlia peut faire mieux que l’outil officiel.

Chaque page de trafic lie la destination commerciale après avoir répondu. Chaque service reçoit
trois liens contextuels distincts avant publication. Aucune liste publique de capacités n’est
créée.

## 7. Écrire une matrice claim–source

Avant la recette, créer un identifiant par affirmation sensible :

```text
claim · formulation exacte · type · source primaire · date source · consulté le · hash corps brut ·
citation exacte · hash citation · portée soutenue · reviewer · verdict · publiable
```

Le reviewer métier juge chaque couple, jamais « l’article en général ». `soutient_partiellement`,
`contredit`, `hors_sujet`, source inaccessible ou citation de portée différente interdisent le
claim. L’absence d’attestation professionnelle produit la mention interne `non attesté`; elle ne
transforme pas un claim non soutenu en claim publiable.

Si la revue refuse la fraîcheur ou l’applicabilité d’un paquet primaire, le candidat conserve le
snapshot et ses empreintes comme preuve historique, mais ferme le couple tant que l’état courant
n’est pas réconcilié. Un extrait exact dans un paquet périmé ne reste jamais `soutient`. Le registre
recalcule alors les verdicts, les sévérités et les totaux publiables sur le candidat corrigé avant
toute nouvelle revue.

## 8. Poser la péremption avant d’écrire

Chaque page réglementaire déclare un manifeste `regulatoryFreshness` :

```json
{
  "verifiedAt": "AAAA-MM-JJTHH:MM:SS+02:00",
  "expiresAt": "AAAA-MM-JJTHH:MM:SS+02:00",
  "sources": [{"url": "…", "sourceDate": "…", "sha256": "…", "claims": ["…"]}],
  "criticalFields": ["date", "population", "obligation", "seuil", "statut-plateforme"],
  "onCriticalChange": "suspend"
}
```

Règles :

- vérification live dans les 24 heures avant préparation, scellement et publication ;
- contrôle quotidien en jour ouvré pour texte, doctrine, calendrier et listes ;
- contrôle hebdomadaire pour sources professionnelles secondaires ;
- autocomplétion/PAA hebdomadaires pendant la fenêtre ; volumes mensuels ;
- changement d’empreinte = différence à qualifier, jamais correction inventée ;
- champ critique modifié ou source en panne = suspension fail-closed.

La suspension conserve la route mais retire les affirmations mouvantes : réponse 503 de maintenance,
`noindex`, retrait du sitemap. Le retour exige source fraîche, revue par claim, nouveau sceau et
preuve sur l’artefact servi.

## 9. Sortie vers la veille C6

Le cron réglementaire de C6 doit :

1. charger le registre des fenêtres et leurs manifestes ;
2. récupérer les sources en contournant les caches ;
3. comparer date, statut, URL finale et empreinte ;
4. classifier les différences sur les champs critiques ;
5. rester silencieux sans différence ;
6. ouvrir une carte de maintenance pour un changement ;
7. suspendre automatiquement une page expirée ou critique déjà publiée ;
8. inscrire la nouvelle fenêtre dans le registre de demande seulement si un signal de recherche ou
   trois occurrences professionnelles indépendantes la soutiennent.

## 10. Définition du fini

Une fenêtre est prête à produire lorsque :

- les sources primaires sont accessibles, datées et hashées ;
- le vocabulaire tapé et le vocabulaire officiel sont séparés ;
- les intentions ont été confirmées par autocomplétion/PAA/SERP ;
- le pôle minimal et ses fusions sont arrêtés ;
- la destination commerciale existe ou sa dépendance est explicite ;
- chaque claim sensible a une source et une revue métier prévue ;
- le manifeste de péremption bloque réellement une source expirée ;
- la veille sait détecter, ouvrir une carte, suspendre et rester silencieuse sans signal.
