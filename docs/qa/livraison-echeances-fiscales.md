# Livraison fiscale — état du 12 octobre 2026

Carte : t_5802ef6a. Route cible : https://memlia.fr/blog/suivre-les-echeances-fiscales-d-un-portefeuille.

## État réel

Candidat intégré et scellé localement ; pas encore fusionné ni attesté en production. La revue métier/éditoriale/visuelle du paquet est conservée dans revues-fabrication.json. revues.json lui ajoute seulement la liaison technique au même corps et aux mêmes figures, sous le mandat LIVRAISON.md ; ni identité, ni verdict, ni score, ni date de lecture changés. Le score 83 reste un conseil de fabrication, pas un score du site public.

Base : origin/main 0af433cb, intégrée sans perte du paquet auteur. Créneau réservé au 12/10 par datePlanifiee, dérivés reconstruits et préflight --slot PASS. Relevé réel d’autocomplétion de la requête le 12/10 à 18:10:26 UTC ; une suggestion obtenue, aucun volume attribué. Titre et contenu inchangés. Brief palette normalisé à un seul code crème mesurable ; prompt, image source et provenance inchangés.

Les deux cadres HTML ont été intégrés au renderer canonique. Les deux WebP 1600×900 sont identiques aux visuels relus : a67caca583334611567d08f0dcf44236df1eb5ad16146df1197ff170ac71fc8e et f34cbc2dcdea0c7f77be622bf9df4d50a3865cf5b730be09fc218b906430bddf. Master OpenAI et coût/modèle inconnus conservés honnêtement. Les variantes responsives émises par l’intégration existante sont des redimensionnements de ces masters, pas des figures alternatives.

## Vérifications exécutées

- Forge preparer : erreurs=[] ; sceller et gate preview de l’article fiscal : PASS.
- Maillage entrant du pilier via review-link-projection.json, texte « échéances fiscales » : aucune phrase réécrite. Matérialisation native du pilier et gate rendu Astro : PASS ; avis original intact.
- API native materialiser(statut publie) + ecrireSceau et inscription SEO : PASS local. Cette opération n’atteste pas une publication HTTP.
- regen:generated : PASS, surfaces et dates recalculées ; audit Ressources QA PASS.
- Contrat public des deux articles : PASS. Validation fiscale scellée sur le HTML final : PASS. La validation brute du pilier doit se faire avant render:public (le transformateur public des libellés de sources change le HTML final) : son gate natif réel est PASS. Ne pas retamponner la revue pour cette transformation existante.
- Huit tests du classement fictif : PASS. Les douze lignes, onze clés et files 7/2/2/1 ne démontrent aucun accès fiscal réel.
- Chromium sur le dist réellement destiné à publication, HTTP local 200 à 1440 et 390 : un H1 attendu, auteur Kevin Kitanga, date 12 octobre 2026, canonical de production, robots index/follow, OG/Twitter, graphe BlogPosting/Person/Organization/BreadcrumbList/WebSite, figures chargées avec alts ; aucun débordement document ni erreur navigateur. Visuel mobile regardé, sans chevauchement du haut de page. Fichier .qa/livraison-fiscale/browser-public.json et captures public-1440.png/public-390.png.
- Lighthouse mobile local, collecteur robots HTTP et audit natif : 99/100/100/100, rapport .lighthouse/mobile-2026-10-12T18-21-07-584Z.json. Ce résultat n’est pas une mesure en production.
- Suites ciblées titre/rubriques : quinze tests PASS ; deux FAIL dans blog-link-review-projection.test.mjs, exposés ci-dessous. Suites complètes laissées à la CI.

## Dépendance d’infrastructure

Le test de projection utilise le pilier vivant puis retire seulement le lien bancaire. Il laisse donc le nouvel ajout fiscal et compare ce corps à la revue sans cet ajout : deux FAIL ligne 65. Ce n’est pas un défaut du candidat, dont le gate est PASS, mais une fixture insuffisamment isolée. Correctif séparé confié à dev sur t_38d0d8c9. Aucun test ni garde modifié dans cette livraison, aucun faux PASS.

Reprise : intégrer le correctif livré sur main, préserver les autres livraisons du pilier et leurs déclarations de maillage, recalculer les dérivés, puis CI verte et fusion normale. Si le jour change, réserver et dater la livraison au jour réel sans changer les dates de lecture des sources ni l’avis acquis. Ne pas lancer de déploiement manuel sur main. Constater le déploiement Cloudflare automatique, le bon contenu HTTP et le sitemap avant de terminer la carte.

## Hotspots

Renderer global des figures et manifeste ; pilier et sa projection de liens ; dérivés du calendrier et dates ; manifeste dérivé du glossaire. Toujours repartir de main frais et régénérer les dérivés, pas fusionner des sceaux manuellement.

## Reprise du 13 octobre 2026

Main 2f8f9ad5 intégré par fusion normale, dont le correctif de fixture PR260 et le nouveau repère CAC du pilier PR263. La nouvelle revue H4 du pilier est conservée intégralement ; la projection native ajoute seulement le lien fiscal. Le diff public du pilier contre main est limité à ce lien. La réservation et la date publique fiscales sont le 13/10/2026, tandis que les copies officielles, le corps, les figures et l'avis de fabrication gardent leur lecture du 12/10.

Matérialisation native des deux articles : erreurs vides ; gates fiscaux et pilier PASS. Dix-neuf tests ciblés (projection, rubriques, titre) et huit tests du jeu fictif PASS. Le log CI initial a aussi révélé l'absence d'entrée fiscale dans llms.txt ; entrée ajoutée depuis le périmètre relu, reconstruction réelle puis test_llms_anchors PASS. Aucun test ou garde de production modifié dans PR259. Dérivés du calendrier et surfaces Ressources régénérés et audités.

Ces résultats sont locaux ; la CI de la reprise et la publication sont à constater séparément, sans assimiler le scellement local à une réponse publique.
