# Diagnostic Blog / SEO Memlia — session du 03/10/2026

## Décision finale

Suivre la direction Kevin consignée sur t_ab9420b0 à 23:23 : les quatre nouveaux articles prolongent `prompt-chatgpt-expert-comptable` et `logiciel-ia-comptabilite`, publiés le 29/09. Les sujets CRM annuel, échéance DSN, collecte variables et manuel sont abandonnés pour CE lot. Leurs recherches restent `BRIEFS-DSN-ABANDONNES.md` et `serp-dsn-abandonnes.json`, pas une instruction de production. Le diagnostic SEO du corpus et la procédure exhaustive restent utiles.

Choix final : choisir un premier usage ChatGPT ; vérifier une réponse IA ; préparer les données autorisées ; passer d'un prompt à une automatisation dans les outils existants. Besoins distincts et objets copiables, pas quatre variantes de « prompt ». Le rattrapage W39 ne compte pas comme ces quatre nouveautés. Kevin demande leur publication effective sur les quatre cartes enfants déjà présentes, pas seulement rédaction. La carte parent livre les preuves, briefs et procédure ; aucun de ces quatre articles n'est déclaré publié ici.

## 1. Mesure réelle : faible signal, scopes à conserver

Exports initiaux présents dans le dossier à la prise en charge. Contrôle actif dans ce run : wrapper `blog-google`, accès disponible niveau 1, **web / final / sc-domain:memlia.fr / 03–30 septembre 2026**. Les listes page et page+query retrouvées sont exactement égales aux exports initiaux (`gsc-reverification-page.json`, `gsc-reverification-page-query.json`). Requête date actuelle pour les totaux site : `gsc-reverification-date.json`. Comparaisons et sommes calculées dans `verification.json`.

- Total site par dates : **24 clics, 368 impressions, CTR 6,52 %**. Somme des lignes page : **26 clics et 848 impressions**. Ce ne sont pas des scopes interchangeables : ne pas annoncer 848 impressions dédupliquées du site.
- Blog, somme page des URLs `/blog/` : **6 clics, 196 impressions**. Pas sessions ni conversions.
- Fenêtre 7 jours : **24–30/09**, 4 clics et 167 impressions site ; lignes page 4 clics / 293 impressions. Elle est incluse dans les 28 jours, pas comparaison avant/après.
- `gsc-date.json` demande 24/09–02/10 mais les dernières lignes disponibles s'arrêtent au 29/09 : jours absents ≠ zéros ni semaine finale complète.
- Le nouveau wrapper laisse `totals.position` à 0 dans son code ; ce zéro n'est pas un rang. La position moyenne 17,2 de l'export initial n'est pas utilisée comme preuve de changement.
- Les requêtes anonymisées ou non retournées limitent le détail : page CRM 3 clics / 27 impressions / position 9,6, mais couple visible `compte rendu métier` seulement 2 impressions et aucun clic. Ne pas attribuer les clics de la page à cette chaîne.
- Page bulletins : 0 clic / 42 impressions / position 10,2 ; suivi social : 0 / 13 / 5,1 ; saisie : 1 / 32 / 22,9 ; charge : 1 / 15 / 14,4 ; pilier : 1 / 19 / 11,7. Signaux adjacents, pas causalité ni demande démontrée pour les nouveaux mots-clés IA.

Les deux articles du 29/09 n'ont que la fin de cette fenêtre ; aucun succès ou échec SEO n'est conclu pour eux. Leur lecture réelle apporte des leçons de contenu : prompt = une tâche bornée et un brouillon, rejeu déterministe explicitement différent d'une réponse ChatGPT ; logiciel = comparaison du parcours, exceptions, reprise et traces, sans test d'éditeur. Leur prolongement vient de la direction Kevin et de ces besoins, pas d'un classement supposé. La Cicatrice du 02/10 n'est pas mesurable dans la fenêtre finissant le 30/09.

GA4 non configuré ; Google Ads Keyword Planner non disponible dans le contrôle d'accès. Aucun volume mensuel, difficulté, session ou conversion revendiqué. Pas déclin QoQ, pénalité ou effet d'une mise à jour Google attribué.

## 2. Corpus public, technique et traces historiques

`gsc-inspections.json` inventorie cinq inspections PASS et canonicals concordants. Recontrôle actif CRM dans `inspection-crm-reverification.json` : `index_status.verdict=PASS`, canonical concordant, pas erreur. Une inspection ne certifie pas tout le corpus ni les futurs slugs.

Le snapshot HTTP initial couvre **12 articles** locaux. `onpage-summary.json` isole `.article-corps` avec parse5 : douze HTTP 200, corps présent, un H1, canonical auto-référent, robots index, auteur Kevin Kitanga, sommaire et deux figures de corps. Le vérificateur contrôle aussi cohérence du BlogPosting/headline/auteur et intégrité des copies. Pas preuve de lisibilité mobile ni support complet des affirmations. Le compteur global `proofFigures` du collecteur peut compter hors corps : utiliser le sélecteur de corps. Le hub `/blog` a été ouvert à nouveau pendant le run ; cela ne prouve pas publication des nouveaux articles.

Graphe de corps de cet échantillon : pilier 11 pages entrantes, les autres au moins une. Aucun orphelin dans ce sous-graphe, pas crawl complet du site. Logiciel IA, saisie, charge, compétences et Cicatrices ont une entrée mesurée : opportunité contextuelle, pas quota de liens.

`xmllint` valide trois XML : sitemap-index, sitemap-0 et RSS. Index vers `/sitemap-0.xml`, douze URLs du corpus présentes dans le sitemap effectif. `/rss.xml` est 404 dans la collecte initiale ; le vrai flux est `/blog/rss.xml`, annoncé par le hub. Préserver canonicals, routes, dates de publication et lastmod matériel.

CrUX réellement interrogé sur CRM : aucune donnée disponible, erreur indiquant trafic Chrome insuffisant (`crux-reverification.json`), ni zéro ni PASS performance. Aucun Lighthouse, backlink ni citation IA mesuré ; readiness ne signifie pas citation ChatGPT/Perplexity/AI Overviews/AI Mode. Check Astro : **0 erreur, 0 warning, 10 hints**. Build complet du corpus existant : **exit 0**, log `build-verification.log`, audit Ressources final sans erreur. Aucun nouvel article, asset ou test navigateur général de ce lot construit.

### Honnêteté des preuves de skills

`legacy-skills-traces.json` inventorie douze articles, de 15 à 21 RUN déclarés par article. `recette.preuvesSkills` peut être vide alors que des fichiers spécifiques existent : son absence seule ne prouve pas absence de travail.

Lecture concrète Logiciel IA : blog-brief atteste brief/requête/tâche ; blog-write un comptage de mots/titres ; blog-audit sources/claims/longueur, pas un audit site complet. Leur génération est visible dans `scripts/blog-forge.mjs:355–365`. RUN/PASS = attestation programmatique, pas exécution complète de chaque skill. Sa vraie revue `seo-geo-review.md` datée 03/10 donne une heuristique 91/100 et des réserves sur captures/production ; elle ne remplace ni SERP ni CWV. Aucune revue ancienne réécrite ou copiée pour les nouveaux textes.

`blog-analyze.json` traite le français avec `language=en` et interprète mal certains frontmatters Astro (titre imbriqué écrasant titre principal). Score non calibré pour comparer nos pages : garder le brut, contrôler le HTML servi et le fond en français. `style.json` est une mesure, pas une règle exigeant des anecdotes ou des H2 questions. Ne pas inventer statistique ou récit pour satisfaire l'analyseur.

## 3. Demande et cannibalisation du lot IA

Relevé final `serp-2026-10-03.json` : quatre recherches conservées avec cinq résultats chacune. Une première recherche vérification surtout anglophone a été reprise en français. Ce sont les résultats du moteur Hermes, pas Google France localisé par appareil. PAA, volume, rang contrôlé et citations IA ND. Aucune collecte sociale récente, aucun scraping LinkedIn/Apify ni distribution externe.

Pages réellement ouvertes : CNIL FAQ IA générative (date affichée 18/07/2024), OEC Travaux Data et IA (pas date éditoriale affichée), Libérall ChatGPT x Pennylane (30/06/2026), Compta Online déontologie, Studio Abis intégration (22/06/2026) et Google Cloud hallucinations. OEC propose un livret et une charte en extranet : le contenu intégral n'a pas été ouvert. Compta Online montre d'anciens quotas/prix Code Interpreter : pas paramètres actuels à recopier. Les chiffres de gains, certifications et compatibilités des concurrents restent leurs claims, pas preuves Memlia.

| Sujet final | Besoin visible / objet utile | Frontière avec les deux articles du 29/09 et l'existant |
|---|---|---|
| Premier usage ChatGPT | Ressources OEC, RFC, guide Libérall ; fiche de sélection d'un geste et de son essai | Ne pas recopier le prompt de demande de pièce ; ne pas réécrire le papier compétences. |
| Vérifier réponse IA | CNIL et résultats sur hallucinations/confiance ; checklist affirmation/source/périmètre/décision | Contrôle de la sortie, pas écriture de la consigne ni nouvelle Cicatrice de test logiciel. |
| Confidentialité/données | CNIL et Compta Online ; fiche de préparation/autorisation | Le rappel dans le prompt ne couvre pas ce geste complet ; /garanties est la promesse Memlia, pas cette fiche autonome. |
| Prompt vers automatisation dans l'existant | Studio Abis et résultats intégration ; fiche d'un passage entre outils | Logiciel IA = choisir ; nouveau = définir le passage ; pilier = carte ; /methode = mission. Réutiliser intention du brief backlog 08, pas seconde URL concurrente. |

Les quatre slugs et plans sont fixés dans les briefs. Pas d'intersection SERP ni de collision exacte suffisant seul à certifier l'absence de cannibalisation. L'arbitrage est le geste, le moment et la sortie utile. Examiner les requêtes réellement obtenues après publication ; si un nouvel article n'apporte pas sa fiche/checklist propre et répète l'existant, consolider au lieu de multiplier les variantes.

## 4. Leçons et expériences falsifiables

1. Faible GSC : conserver scopes et jours finaux. Dépendance : mesurer requêtes finales au registre et créneaux réels lors de rédaction. Indicateur : répartition requêtes/pages après publication. Échec : interprétation depuis jours absents ou aucune intention distincte ; corriger la mesure/angle, pas inventer trafic.
2. Les articles du 29/09 ont posé les bonnes frontières : le nouveau lot donne quatre gestes utiles. Dépendance : cas fictifs exécutés, pas réponse ChatGPT simulée. Indicateur : lecteur peut choisir un usage, vérifier une sortie ou préparer une entrée depuis l'objet publié. Échec : page n'est qu'un nouveau texte de promesse ; compléter l'objet avant CTA.
3. Confidentialité : une consigne ou un nom remplacé ne constitue pas une certification. Dépendance : CNIL/documents fournisseur exacts et revue métier du texte final. Indicateur : réserve et décision d'autorisation visibles dans le cas. Échec : lecteur croit dossier anonyme ou outil universellement sûr ; corriger le geste et les mots.
4. Automatisation : comparer est distinct de relier les outils. Dépendance : identifier accès/format/source de vérité, protéger la saisie. Indicateur : passage nominal et refus démontrés. Échec : intégration commerciale présumée ou doublon avec grille logiciel ; revenir à une fiche de passage.
5. RUN synthétiques : une matrice relie chaque phase à sa preuve réelle. Indicateur : revue normale peut retrouver sorties et limites. Échec : « exécuté » sans contenu relu, ou absence de donnée requalifiée zéro ; corriger l'état, pas régénérer une attestation.

Suivi proposé : première fenêtre de 28 jours finals après publication réelle de chaque article, contrôle indexation à 7 jours si utile. Aucun test causal assuré avec ce petit échantillon. Lien vers générateur seulement quand t_371a73be fournit route publiquement vérifiée ; ne pas faire attendre le blog. Les dix outils supplémentaires ont leur carte séparée t_6c7dba9d.

## 5. Couverture durable et handoff

Union réellement vérifiée : **63 compétences**, soit 2 racines, 31 Blog, 30 SEO ; 56 exposées au catalogue, registre technique 31/24. Sept fichiers pack absents du catalogue sont documentés. La photographie initiale 58 sous-estimait cinq extensions supplémentaires. Tous les SKILL.md de l'union ont été ouverts/analysés ; pas prétention de lire toutes dépendances transitives. Les lectures et le catalogue sont archivés.

Matrice finale : `couverture-livraison.json` / `COUVERTURE-LIVRAISON.md`. Les fichiers `couverture-skills.*` restent le checkpoint DSN antérieur, non applicables comme direction finale. Les 16 états exécutés de brief signifient cadrage effectivement produit, pas workflow de rédaction complet ; prescriptions partielles et trois étapes rédaction/validation futures restent explicites. N/A motivés ; CWV/backlinks/citations restent inconnus.

`RUNBOOK-QUOTIDIEN.md` §3 rend la couverture obligatoire sans rappel à chaque rédaction/republication. Vérificateur local : union, preuves, exports, métadonnées, XML et quatre mutations ; pas garde universel intégré à la forge ni nouvelle revue SEO. Constitution prioritaire sur go/dépenses et maintien de revue de fond.

Chemins transmis aux cartes t_e6c51cb3 (brief1), t_1b587b0b (brief2), t_afe116b0 (brief3), t_f9e51486 (brief4) : dossier `docs/strategy/site-v3/mesures/diagnostic-2026-10-03/`, documents diagnostic/briefs/matrice/verification et runbook. Intégration documentaire confiée à default t_3d42121b, sans créer quatre cartes redondantes. Workspace attribué à marketing t_ab9420b0 ; fichiers locaux non committés sauvegardés dans une archive durable. Aucun nouveau contenu public publié ici. La revue normale des quatre articles sera adaptée à leur fond, notamment `metier` pour le troisième, sur ces livraisons distinctes ; aucune revue supplémentaire de préparation n'est nécessaire pour un mandat interne sans texte public.
