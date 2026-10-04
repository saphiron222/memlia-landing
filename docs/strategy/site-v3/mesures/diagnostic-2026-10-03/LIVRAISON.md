# Provenance et état de livraison — 03/10/2026

## Propriétaire et portée

Direction finale de Kevin : prolonger les articles IA du 29/09, pas DSN/paie. `BRIEFS-QUATRE-ARTICLES.md` et `couverture-livraison.json` couvrent premier usage ChatGPT, vérification de réponse, données autorisées et automatisation dans les outils. Les briefs/recherches DSN sont conservés sous noms ABANDONNES ; ils ne doivent pas être exécutés. Cartes existantes t_e6c51cb3, t_1b587b0b, t_afe116b0, t_f9e51486 : les chemins et angles finaux leur sont transmis dans leurs commentaires. La préparation commencée le 03/10 s'est prolongée après minuit le 04/10 ; `verification.json` porte l'instant réel, aucun relevé n'est antidaté.

Workspace exact : `/Users/kevinkitanga/.hermes/profiles/marketing/cache/scratch/blog-w40` ; branche `blog/w40-completion` ; propriétaire marketing, carte `t_ab9420b0`. À l'entrée, le runbook était modifié et le dossier diagnostic non suivi. Ces traces ont été préservées puis complétées, sans modification des articles ni des recettes historiques. Platform a confirmé l'attribution du workspace sur `t_1b692aff`. Rien n'est commité, poussé ou publié par cette livraison locale ; l'archive jointe conserve le résultat indépendamment du nettoyage du scratch. Le nombre initial annoncé par le moniteur n'est pas le nombre de fichiers publiés.

## Données héritées versus contrôles exécutés

Hérités : GSC 28/7 jours, date et cinq inspections ; copies `live/` et `live-audit.json`, analyse `onpage-summary.json`, `blog-analyze.json`, `style.json` et `legacy-skills-traces.json`. Leur existence n'est pas une nouvelle exécution des skills. Les deux scripts initiaux de collecte sont conservés, non rejoués pour retamponner l'historique.

Exécutés dans ce run :

- `skills_list` et lecture de l'union du pack/cataloque/pipeline ; sortie et lectures archivées.
- Vérification d'accès `blog-google`, niveau 1, sans publication de secret ni conservation des métadonnées d'identification du compte dans les livrables.
- Requêtes GSC final/web avec fenêtres explicites, dimensions page, page+query et date, sous le wrapper du skill ; sorties `gsc-reverification-*.json`. Comparaison exacte des listes page et page/query avec les exports initiaux.
- Inspection actuelle CRM, sortie `inspection-crm-reverification.json` ; CrUX CRM, sortie `crux-reverification.json` sans données. Pas nouvel essai de performance lab ni configuration de compte.
- Quatre recherches Hermes et ouverture des sources clés ; `serp-2026-10-03.json` sépare les résultats vus des pages ouvertes.
- Analyse des usages locaux par recherche dans les corps ; lecture de preuves de skills et de vraie revue indépendantes sur Logiciel IA ; quatre briefs et arbitrages décrits, pas quatre articles.
- Vérificateur Node sur matrice finale, quatre mutations rejetées ; validation XML via `xmllint` de l'index, du sitemap effectif et du RSS ; syntaxe des deux nouveaux scripts ; `git diff --check`.
- `npm run check` : 0 erreur, 0 warning, 10 hints ; `npm run build` : sortie 0, log complet `build-verification.log`, audit Ressources final sans erreur. Build du corpus existant, pas des quatre nouveaux articles ; aucun Lighthouse ou test navigateur général effectué.

## Copies de sources

Ouvertes par `web_extract` le 03/10 dans cette session puis copiées depuis son fichier complet, sans reconstitution :

| Copie | URL | Date éditoriale affichée / limite |
|---|---|---|
| `sources/service-public-dsn.md` | https://entreprendre.service-public.gouv.fr/vosdroits/F34059 | Vérifié 04/05/2026 ; distinguer sections transmission et paiement. |
| `sources/urssaf-dsn.md` | https://www.urssaf.fr/accueil/employeur/gerer-entreprise/declaration-sociale-nominative.html | Mis à jour 11/05/2026 ; cas de paie décalée explicitement lu. |
| `sources/net-entreprises-dsn.md` | https://www.net-entreprises.fr/declaration/dsn-info/ | Modifié 03/04/2026 ; 5/15 midi et fenêtre annule-et-remplace. |
| `sources/agiris-variables.md` | https://www.agiris.fr/articles/paie/variables-de-paie-eviter-la-saisie-infernale-en-cabinet | 12/02/2025 ; demande/irritants, pas autorité juridique. |
| `sources/silae-crm.md` | https://www.silae.fr/crm-de-rappel-traitement/ | Guide concurrent, URL redirigée dans l'extraction vers ressources ; pas source réglementaire unique. |
| `sources/blog-hub-reverification.md` | https://memlia.fr/blog | Surface ouverte pendant le run ; ne prouve pas publication des quatre sujets. |

Ces trois pages ont aussi été ouvertes par `web_extract`, puis conservées en HTML complet par `curl --fail --location --max-time 30`, chacune répondant HTTP 200 :

| Copie | URL | Interprétation |
|---|---|---|
| `sources/net-entreprises-crm-annuel.html` | https://www.net-entreprises.fr/dsn-crm-de-rappel-annuel-et-dsn-de-substitution/ | Publié/modifié 23/04/2026 ; périmètre annuel, exclusions, deux contrôles substituables en 2026 à garder dans leur contexte. |
| `sources/mon-manuel-cabinet.html` | https://www.monmanuelcabinet.fr/ | Outil institutionnel présenté ; aucune conformité 2026 déduite de sa mention loi Pacte. |
| `sources/flowzero-variables.html` | https://www.flowzero.fr/blog/automatisation-collecte-variables-paie-cabinet | 28/04/2026 ; concurrence lue, chiffres et compatibilités non repris comme résultats Memlia. |

Alfred Gory et le répertoire OEC Bretagne ont été réellement ouverts par `web_extract` ; leurs observations sont limitées aux passages décrits dans les briefs et le relevé. Aucun compte Experpass, référentiel professionnel complet ou outil derrière connexion n'a été ouvert. Une tentative de page Net-entreprises `/declaration/la-declaration-sociale-nominative-dsn/` a rendu une page introuvable : alternative publique réellement ouverte `/declaration/dsn-info/`, pas contournement. `/rss.xml` est 404 dans la collecte héritée ; le vrai flux est `/blog/rss.xml`.

Les copies ne sont pas encore les preuves de source d'une recette finale : lors de rédaction, ouvrir les autorités selon le runbook, conserver citations exactes, exceptions et provenance, et obtenir la revue métier du texte effectivement écrit.

## Livraison finale à utiliser

- `DIAGNOSTIC.md` : chiffres, limites, leçons et arbitrages.
- `BRIEFS-QUATRE-ARTICLES.md` : quatre slugs arrêtés, résultat propre, plans et critères.
- `couverture-livraison.json` et `COUVERTURE-LIVRAISON.md` : état final des 63 compétences. Les fichiers `couverture-skills.json` et `COUVERTURE-SKILLS.md` sont le checkpoint antérieur ; leurs fichiers alors absents sont désormais livrés.
- `verification.json` et `verification.log` : résultat réel du vérificateur, pas une revue de fond.
- `RUNBOOK-QUOTIDIEN.md` §3 : couverture obligatoire à chaque rédaction. Le contrôle de lot n'est pas intégré dans la forge et ne prétend pas être un garde universel.

Rédaction, assets, rejeu, rendu, revue du texte final, CI et production restent à faire dans les quatre cartes de publication existantes. Cette livraison est un mandat interne de diagnostic/briefs ; aucune revue supplémentaire de préparation n'est nécessaire. La revue normale adaptée au texte final, dont `metier` pour RGPD/secret, reste entière. La demande de revue de préparation tentée a été refusée avant transition, aucun verdict ni PASS n'en est déduit. La carte default t_3d42121b reprend l'intégration documentaire et la conservation du scratch, pas quatre rédactions redondantes.

Sources IA finales réellement ouvertes : CNIL FAQ IA générative (18/07/2024), OEC Travaux Data et IA (date éditoriale non affichée ; extranet non ouvert), Libérall ChatGPT x Pennylane (30/06/2026), Compta Online déontologie (paramètres historiques non repris), Studio Abis intégration (22/06/2026), Google Cloud hallucinations. Copies supplémentaires sous `sources/cnil-ia-generative.md`, `oec-data-ia.html`, `liberall-chatgpt.md`, `compta-online-deontologie.md`, `studio-abis-integration.md`, `google-cloud-hallucinations.md`. Relevé final IA dans `serp-2026-10-03.json` ; recherche DSN séparée dans `serp-dsn-abandonnes.json`.
