# PSEO intégrations — grille, cannibalisation et entretien

Statut : vague 1 implémentée localement
Date de mesure : 20 septembre 2026
Source de vérité du rendu : `src/data/integrations.ts`
Gabarit : `src/pages/integrations/[slug].astro`

## Décision

DÉCISION · Publier seulement les neuf couples tâche–logiciel ayant au moins six suggestions · la mesure corrigée porte sur le vocabulaire des cabinets (`[tâche] [logiciel]`), pas sur l’opération générique `export Excel` · les dix variations moyennes restent sans URL et les seize variations à zéro ou une suggestion sont refusées.

DÉCISION · Une page d’intégration reste un rayon d’un moyeu de service · la requête précise l’environnement, tandis que le moyeu porte la tâche et l’offre · une page sans signal se consolide vers son moyeu au lieu de rester comme contenu maigre.

## Vague 1 — neuf pages fortes

| Requête | Suggestions | URL | Moyeu |
|---|---:|---|---|
| rapprochement bancaire sage | 10 | `/integrations/rapprochement-bancaire-sage` | `/automatisation/rapprochement-bancaire` |
| lettrage sage | 10 | `/integrations/lettrage-sage` | `/automatisation/saisie-comptable` |
| dsn sage | 7 | `/integrations/dsn-sage` | `/automatisation/paie` |
| bulletin de paie sage | 10 | `/integrations/bulletin-de-paie-sage` | `/automatisation/paie` |
| saisie comptable sage | 6 | `/integrations/saisie-comptable-sage` | `/automatisation/saisie-comptable` |
| clôture sage | 10 | `/integrations/cloture-sage` | `/automatisation-cabinet-comptable` |
| lettrage cegid | 6 | `/integrations/lettrage-cegid` | `/automatisation/saisie-comptable` |
| dsn silae | 10 | `/integrations/dsn-silae` | `/automatisation/paie` |
| bulletin de paie silae | 10 | `/integrations/bulletin-de-paie-silae` | `/automatisation/paie` |

Chaque entrée possède ses propres repères éditeur, champs, piège, source officielle et cas fictifs. Le gabarit affiche explicitement que ces cas ne sont pas une recette dans le logiciel éditeur.

## Vague 2 — dix variations moyennes, fermées

Aucune URL n’existe pour ces variations :

1. rapprochement bancaire Cegid — 2 suggestions ;
2. rapprochement bancaire Quadra — 4 ;
3. lettrage Pennylane — 4 ;
4. lettrage Quadra — 5 ;
5. DSN Cegid — 5 ;
6. DSN Quadra — 2 ;
7. relance client Sage — 2 ;
8. clôture Cegid — 3 ;
9. clôture Pennylane — 2 ;
10. clôture Quadra — 3.

Porte d’ouverture choisie : attendre 21 jours complets après soumission du sitemap, puis mesurer Search Console et l’inspection d’URL. La vague 2 ne s’ouvre que si au moins 7 pages sur 9 sont indexées et si au moins 3 pages reçoivent une impression sur leur famille de requêtes. Une nouvelle mesure écrite reste obligatoire avant toute création.

## Refus — seize variations à zéro ou une suggestion

Aucune URL ne doit être créée pour :

1. rapprochement bancaire Silae — 0 ;
2. rapprochement bancaire Pennylane — 1 ;
3. lettrage Silae — 0 ;
4. DSN Pennylane — 0 ;
5. bulletin de paie Cegid — 1 ;
6. bulletin de paie Pennylane — 1 ;
7. bulletin de paie Quadra — 0 ;
8. saisie comptable Cegid — 1 ;
9. saisie comptable Silae — 1 ;
10. saisie comptable Pennylane — 1 ;
11. saisie comptable Quadra — 1 ;
12. relance client Cegid — 0 ;
13. relance client Silae — 0 ;
14. relance client Pennylane — 1 ;
15. relance client Quadra — 0 ;
16. clôture Silae — 0.

## Sortie de `blog-cannibalization`

Audit effectué avant gel des titres, sur les `primaryQuery` des services et articles publiés.

Verdict : PASS, aucun conflit de requête exacte.

- Les neuf nouvelles intentions ont la forme `[tâche] [logiciel]`. Aucune occurrence exacte n’existait dans `src/content/**/*.md` avant création.
- `/automatisation/rapprochement-bancaire` vise `rapprochement bancaire en cabinet` avec une intention `evaluer-service`. Le rayon Sage vise l’environnement et renvoie au moyeu.
- `/automatisation/saisie-comptable` vise `saisie comptable en cabinet`. Le rayon Sage traite la saisie par lot ; les rayons de lettrage traitent une opération distincte et renvoient au même moyeu.
- `/automatisation/paie` vise `automatisation paie pôle social`. Les rayons DSN et bulletin portent un logiciel et des repères éditeur ; ils ne reprennent pas la requête de service.
- `/blog/controler-les-bulletins-de-paie-avant-la-dsn` vise `contrôle bulletin de paie` et décrit une méthode transversale, sans marque éditeur.
- `/blog/comprendre-les-comptes-rendus-metier-dsn` vise `crm dsn`, après dépôt, sans marque éditeur.
- `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` vise `automatisation saisie comptable`, méthode transversale, sans marque éditeur.

Règle de maillage retenue : rayon → moyeu de service ; moyeu → tous ses rayons ; outil gratuit seulement lorsqu’il rejoue la même règle. Aucun rayon ne se lie à un autre rayon de logiciel concurrent.

## Contrat d’entretien et de suppression

1. Soumettre le sitemap après publication de la vague 1.
2. À J+21, enregistrer pour chaque URL : état d’indexation, date du dernier crawl, impressions, requêtes et position moyenne.
3. Conserver une page indexée qui reçoit des impressions sur son intention ou un modificateur de gamme pertinent.
4. Laisser 21 jours supplémentaires à une page indexée sans impression, sans ouvrir la vague 2.
5. À J+42, consolider une page toujours sans impression, ou une page `Explorée, actuellement non indexée` après une seconde inspection :
   - retirer son entrée de `INTEGRATIONS` ;
   - conserver sa mesure dans `INTEGRATION_CANDIDATES` avec le statut d’entretien ;
   - poser une redirection permanente vers son `service.href` ;
   - retirer ses liens entrants des moyeux et du hub ;
   - reconstruire le sitemap et vérifier que l’ancienne URL ne s’y trouve plus.
6. Si deux pages remontent sur la même requête, conserver celle qui porte la donnée la plus propre et consolider l’autre vers elle ou vers le moyeu selon l’intention observée.

Le seuil d’avertissement de 30 pages et l’arrêt dur à 50 restent fermés : les 19 variations mesurées sont sous le premier seuil, mais aucune variation au-delà des neuf fortes ne s’ouvre sans les signaux ci-dessus.
