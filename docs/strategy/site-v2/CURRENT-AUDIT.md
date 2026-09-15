# Audit actuel — memlia.fr

Relevé du 15/09/2026, site public + worktree wt/t_630c4a13, base 939464c. Ce document remplace les conclusions provisoires des sous-agents dans evidence/live-audit.md et evidence/market-research.md. Ces premières notes ne constituent pas la recette finale.

## Synthèse
Le site n’est pas bloqué à l’indexation dans l’échantillon observé. Il décrit déjà le service, contrairement à l’hypothèse d’une landing encore purement « plateforme ». Le défaut principal est la profondeur commerciale : les objections, la méthode, la confiance et le contact n’ont pas leurs destinations propres. Le Blog possède déjà un H1 intéressant ; c’est son explication et son chemin vers le service qui sont faibles.

Pas de score SEO global composite : GSC, CrUX, backlinks et visibilité IA ne sont pas mesurés. Les scores Lighthouse ci-dessous sont des sorties de laboratoire, pas des scores d’autorité ou de classement.

## Routes HTTP
| Route | Statut observé | Indexation/document |
|---|---|---|
| / | 200 | HTML fr, 1 H1, index/follow, canonical absolue |
| /blog | 200 | HTML fr, 1 H1, index/follow, canonical absolue |
| /blog/controler-les-bulletins-de-paie-avant-la-dsn | 200 | Article indexable, auteur Kevin Kitanga |
| /blog/suivre-la-production-sociale-dans-excel | 200 | Article indexable, auteur Kevin Kitanga |
| /mentions-legales | 200 | noindex/follow intentionnel |
| /politique-de-confidentialite | 200 | noindex/follow intentionnel |
| /rss.xml | 200 | Flux, pas une page à H1 |
| /robots.txt | 200 | Autorise le site et les principaux bots de recherche |
| /sitemap-index.xml et /sitemap.xml | 200 | Index XML vers sitemap-0.xml |
| /sitemap-0.xml | 200 | Sitemap accessible |
| /llms.txt | 200 | Texte utile, aucun effet de classement démontré |
| /ressources | 404 | Non publié lors du relevé, chaîne existante en cours |
| /cdn-cgi/l/email-protection | 404 | Lien de protection email dans HTML brut ; à distinguer d’une page éditoriale cassée |

Source structurée : evidence/live-audit.json. Le crawl inclut des fichiers et un endpoint Cloudflare : ne pas confondre nombre d’URL rencontrées et nombre de pages HTML. Source actuelle de /ressources et des légales : evidence/public-research.json. L’email devient bien mailto:contact@memlia.fr dans le navigateur rendu (evidence/browser-audit.json). Le comportement sans JS doit être vérifié avant d’en faire une voie de contact unique.

## Technique et schémas
- Base.astro centralise metadata, canonical, robots, OG/Twitter et typographie. Conserver ce point d’entrée.
- JsonLd.astro décrit déjà Organization, WebSite, Service et FAQPage via @graph. Ce wrapper est valide ; ne pas le classer comme type manquant. Pas de SoftwareApplication à réintroduire pour un service.
- Les légales restent accessibles aux moteurs et noindex ; ne pas les bloquer par robots, ce qui empêcherait la lecture du noindex.
- Le sitemap-index porte un lastmod du 15/09 alors que SITE.derniereMiseAJour est au 09/09. Cela n’est pas la preuve d’un contenu falsifié : vérifier la sémantique index vs URL et les changements éditoriaux dans le candidat, puis produire des dates par contenu.
- Le code et les mesures indiquent contenu Astro initialement rendu ; navigation et liens importants ne doivent pas dépendre des animations.
- Les réponses observées ne prouvent ni l’état de l’origine Cloudflare ni l’identité du déploiement : query anti-cache et Cache-Control no-cache ne suffisent pas à certifier un rollback. La release devra vérifier son ID de déploiement et ses hashes.
- Audit sécurité limité : HTTPS accessible ; pas de pentest, pas d’attestation d’hébergement, pas de verdict global CSP/HSTS/WAF sur ce corpus incomplet.

## Laboratoire de performance
Source : evidence/lighthouse-summary.json, Chromium local, une exécution par page/profil, 15/09/2026. Les cibles 95 restent à atteindre sur l’accueil ; refaire trois passes comparables sur le candidat et conserver les résultats, pas le meilleur score.

| Page | Profil | Performance | Accessibilité | Bonnes pratiques | SEO | LCP ms | CLS |
|---|---|---:|---:|---:|---:|---:|---:|
| / | mobile | 87 | 100 | 100 | 100 | 3609.66 | 0.03196 |
| / | desktop | 92 | 100 | 100 | 100 | 3316.41 | 0.01754 |
| /blog | mobile | 96 | 100 | 100 | 100 | 2543.96 | 0.000083 |
| /blog | desktop | 99 | 100 | 100 | 100 | 2222.84 | 0.000014 |

Accueil : audit signale livraison d’images (97 KiB d’économie estimée) et poids total 3 088 KiB ; ce sont des estimations Lighthouse de ce passage, pas des économies garanties. Priorité : identifier l’élément LCP, dimensionner srcset/sizes, éviter de charger la vidéo entière au premier écran, conserver polices auto-hébergées et variantes nécessaires. Ne pas augmenter aveuglément les durées de cache pour masquer le défaut.

CWV terrain LCP/INP/CLS : ND ; un TBT labo n’est pas l’INP. Aucune conclusion sur le p75 utilisateur.

## Mobile, images et parcours
Douze mesures DOM : / et /blog aux largeurs 320, 375, 768, 1024, 1440, 1920 ; scrollWidth = viewport pour toutes. Aux trois petites largeurs, l’extraction des liens de nav visibles ne trouve que le logo : le menu peut s’ouvrir, mais la navigation n’est pas immédiatement visible. À 1024 et au-delà, liens de nav de hauteur environ 34 px et CTA 32 px : réviser les cibles tactiles, objectif interne 48 px.

Captures pleine page 375 et 1440 dans evidence/screenshots/. Les premières captures avant défilement peuvent garder des zones non révélées par animation ; les captures suffixées -scrolled permettent de contrôler le rendu après défilement. Ce corpus est une baseline, pas une acceptation du futur design. Préserver Fraunces/Hanken et vert/crème ; aucune nécessité de refaire la charte. Les illustrations de proofs.ts sont fonctionnelles fictives, explicitement différentes de captures produit.

## Contenu, E-E-A-T et conversion
- Deux articles nommés, datés, avec limites et sources : bons actifs à préserver, pas à remplacer par deux pages « solutions » identiques.
- Auteur Kevin Kitanga ; pas de biographie de compétence métier établie sur une page propre. /a-propos doit rendre son rôle réel lisible sans inventer de diplôme.
- Le corpus public des légales relu ne contient pas de téléphone explicite. La note provisoire affirmant qu’un téléphone serait acceptable dans les légales est FAUSSE : l’interdit vaut toutes les surfaces publiques.
- Les légales indiquent un siège parisien ; le socle décrit un ancrage breton. Distinguer siège et activité, ne pas remplacer l’adresse légale par Plérin sans source juridique.
- Les preuves fictives expliquent le comportement, elles ne prouvent pas ROI, conformité, certification, adoption ni témoignage.
- CTA principal actuel vers Cal.com ; sans page d’explication, un visiteur hésitant comprend mal ce qu’il doit apporter. Créer /contact sans collecte de fichiers, avec réponse de repli email.

## SXO, GEO et marché
Google non exploitable : wrapper HTTP puis CAPTCHA dans Chromium pour quatre requêtes. Bing RSS renvoie des résultats hors sujet, donc rejeté. Aucun consensus top 10, aucun pourcentage de mismatch, aucun score persona quantifié. La recherche interne du 12/09 (dans sa fenêtre de fraîcheur de 60 jours) distingue information DSN, objet/modèle Excel et achat d’automatisation ; elle reste historique et non un classement au 15/09.

Google Search Central, pages ai-features et creating-helpful-content relues : priorité aux pages utiles, indexables et sources vérifiables. Ne pas attribuer un effet causal à llms.txt ou FAQPage. Bots de recherche autorisés ne signifient pas citations observées. ChatGPT, Perplexity, AI Overviews/Mode : ND ; aucun test direct de leurs réponses ici. Backlinks/domain authority et GBP : ND. Pas de création de fiche locale ou de pages-villes avec une adresse d’exercice supposée.

## Actions et contrôles falsifiables
| Priorité | Observation → action | Dépendance | Échec observable | Indicateur |
|---|---|---|---|---|
| Haute | Nav mobile cachée → six destinations visibles | Code après Ressources | Un lien exige ouverture à 375 px | Tests visibilité/target, pas seulement screenshot |
| Haute | Objections dispersées → cinq pages distinctes | Copy et preuves relues | Service duplique accueil ou promet un module absent | Revue mission/preuve/CTA page par page |
| Haute | Perf accueil <95 → corriger LCP | Baseline et gabarits | Médiane de trois runs <95 | LCP labo et poids initial |
| Moyenne | Auteur peu contextualisé → /a-propos | Faits fondateur sourcés | Qualifications non prouvées | Bylines liées au même Person |
| Moyenne | Liens email bruts fragiles → contact avec voies explicites | /contact | Aucune voie utilisable sans JS | Test mailto et lien réservation |
| Moyenne | Dates et graphes à faire évoluer → recette SEO déterministe | Inventaire exact candidat | URL noindex dans sitemap, canonical incohérente | Oracle routes/metadata/JSON-LD |

## Outillage et limites
claude-seo trouvé à /Users/kevinkitanga/hermes/packs/claude-seo/bin/claude-seo ; doctor : ready=false, reason « python changed », browser_ready=true. Commande google_auth refusée par runtime non prêt. Aucun setup/install tenté. GSC memlia.fr non inspecté, chiffres ND ; le socle mentionne une autre propriété, non substituée. Playwright et Lighthouse ont été exécutés depuis les dépendances existantes du dépôt principal, après l’échec d’import du worktree. Pas de nouvelle dépendance installée.
