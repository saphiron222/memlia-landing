# Contrat SEO technique et JSON-LD

15/09/2026. À appliquer au candidat après la release Ressources. Base source : Base.astro, JsonLd.astro, site.mjs, astro.config.mjs ; relire leurs versions à l’implémentation. Aucun code de page dans la présente carte.

## Graphes et entités
Identifiants existants à préserver : https://memlia.fr/#organization, #website et #service. Le Service principal peut faire évoluer son url vers la page service sans créer un deuxième service contradictoire. Person canonique décidée : https://memlia.fr/a-propos#kevin-kitanga. Les articles référencent cette personne ; afficher la même attribution Kevin Kitanga dans HTML, RSS et JSON-LD.

| Page/type | Nœuds | Données et précautions |
|---|---|---|
| Accueil | Organization, WebSite, Service, FAQPage existant | FAQ conforme au texte visible ; pas de note/avis/offre fictive |
| Service | WebPage, Service, BreadcrumbList | Même @id du service, provider Organization ; pas de prix 0 ou au siège |
| Méthode / garanties | WebPage, BreadcrumbList | about Service ; pas de certification imaginaire ni HowTo comme tactique rich result |
| À propos | AboutPage, Person, BreadcrumbList | mainEntity Person, nom/rôle vérifiés ; pas d’alumniOf, diplôme, photo ou sameAs supposés |
| Contact | ContactPage, BreadcrumbList | Organization/contactPoint avec email existant, pas téléphone ni TVA |
| Blog | CollectionPage, BreadcrumbList | mainEntity ItemList optionnel des articles réellement affichés, pas d’articles futurs |
| Articles | BlogPosting, BreadcrumbList | headline, author Person, publisher, dates réelles, image accessible, mainEntityOfPage canonical |
| Ressources / glossaire | Conserver le contrat de leur chaîne | Harmoniser références communes, pas écraser les graphes et preuves métier |
| Légales | WebPage si déjà utilisé | noindex, hors sitemap ; aucune nécessité d’ajouter un schéma commercial |

Ne pas promettre de rich result FAQ ni de hausse de citation IA. SoftwareApplication, Product/Offer, AggregateRating, LocalBusiness et VideoObject seulement si contenu et preuves rendent le type réellement applicable : aucun ajout automatique dans ce lot. Le service général ne se déguise pas en logiciel. Ne pas fabriquer d’adresse locale à partir de la cible Bretagne.

## Metadata
Chaque page a title et description uniques, canonical absolue https://memlia.fr + path exact, lang=fr et un seul H1. title/description de la matrice sont un départ éditorial, pas une garantie d’affichage Google. Title du Blog et description exacte dans GLOBAL-MESSAGING.md prioritaires. OG/Twitter avec image existante valide ou nouvelle image générée après brief, dimensions/alt corrects. Ne pas créer du texte SEO caché.

## Indexation et découverte
Production : index/follow pour pages commerciales et éditoriales acceptées ; noindex/follow pour légales et erreur. Preview : noindex/nofollow en HTML et X-Robots-Tag ; aucun sitemap de preview indexable. Ne pas bloquer les crawlers par robots pour leur cacher le noindex. XML sitemap : seulement URLs finales 200 canoniques indexables, dates reflétant changements significatifs. Routes P2 absentes avant publication. /sitemap.xml alias existant et déclaration robots contrôlés jusqu’au sitemap final. RSS : auteur et dates exacts, XML valide, articles existants préservés.

Bots : maintenir accès des bots de recherche (Googlebot, Bingbot, OAI-SearchBot, PerplexityBot) sous réserve des protections réelles ; ne pas confondre GPTBot entraînement avec recherche ni Google-Extended avec indexation Google. robots n’est pas un contrôle d’accès. llms.txt doit refléter les nouvelles destinations sans données/prix inventés ; aucun rôle causal de classement attribué. Pas de nouveau protocole OKF/WebMCP/IndexNow/cron pour satisfaire un score abstrait.

## Performance, accessibilité, agents
Astro statique : contenu essentiel, liens, labels et JSON-LD dans HTML initial. Pas de JS requis pour lire ou naviguer. Les interactions doivent utiliser des éléments sémantiques ; pas div cliquable ni déplacement de canonical par script. Lighthouse quatre axes ≥95, médiane de trois runs par gabarit/mobile/desktop ; enregistrer également les runs individuels. INP terrain ND jusqu’à CrUX utilisable, jamais remplacé par TBT. Objectifs CWV terrain : p75 LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 ; ce sont des objectifs, pas des données déjà atteintes.

## Oracle attendu
Un manifeste de routes réelles issu du candidat (incluant les routes Ressources livrées) et un crawl rendu doivent prouver :
1. Chaque page indexable répond 200 et a 1 H1, canonical correcte, metadata non vide, schéma parseable.
2. Chaque noindex est absent du sitemap ; aucune URL future/redirection/404 n’y apparaît.
3. Breadcrumbs reflètent l’URL et les entités sont cohérentes HTML/RSS/JSON-LD.
4. Zéro lien interne mort et zéro orpheline, profondeur ≤3 pour les pages commerciales/éditoriales de ce plan ; intégrer le graphe ressources au contrôle.
5. Zéro téléphone/tel:/TVA publique non confirmée, noms d’auteur erronés et données client.
6. JS désactivé : contenu principal et voies de contact lisibles ; reduced-motion : rien d’invisible.
7. Mutants : retirer noindex preview, casser une canonical, introduire téléphone, changer auteur ou ajouter route future au sitemap doit faire échouer l’oracle. Un test vert sans mutant discriminant ne suffit pas.

## Source de vérité de release
Relever commit exact, build/config, ID Cloudflare Pages (projet memlia), URL immutable, hashes et diff robots preview/production. Une query cache-busting n’est pas une preuve suffisante d’origine. Lire l’API de déploiement ou une URL immutable liée au manifeste, puis comparer assets et contenu. Conserver état sain antérieur et commande rollback testable, par exemple revert du commit de release sur main suivi du push autorisé ; résoudre les SHAs réellement, pas un placeholder dans la notification finale.

Sources primaires relues le 15/09/2026 : https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/fundamentals/creating-helpful-content. Les fonctionnalités spécifiques Google doivent être revérifiées dans leur documentation au moment où elles sont invoquées ; ce plan n’utilise pas les statistiques de citations des packs comme preuves.

## Oracle des contrats historiques

Six ancres de l'accueil sont citées par des liens existants, internes comme externes. **Elles ne sont pas
négociables** : les supprimer casserait des liens sans qu'aucun test ne rougisse, puisqu'une ancre absente
rend la page, pas une erreur.

`/#usages` · `/#methode` · `/#integration` · `/#garanties` · `/#questions` · `/#preuves`

Le contrôle est automatique : `validate-plan.py` vérifie que chacune est citée dans ce document, et, dès que
`dist/index.html` existe, que l'identifiant correspondant est présent dans le HTML rendu. Un mutant qui
retire une ancre doit faire rougir le contrôle.

Vérifié en production le 16 septembre 2026 : les six identifiants sont présents sur `https://memlia.fr/`.
