# JSON-LD des pages « agents IA » : gabarits, utilitaires, tests (14/10/2026)

Lecture seule sur le dépôt. Lus : cadrage (§0, 6, 7, 8, 12, 14), ADR 0001, charte v6 §9 bis, `schema.mjs`, `Base.astro`,
`integrations/index.astro`, `commissaires-aux-comptes.astro`, `layouts/Service.astro`, `page-eeat.ts`, `auteurs.ts`,
`schema-render.test.mjs`, `schema-audience.test.mjs`, `verify-page-contract.mjs`. Rien n'a été exécuté ni construit :
`specialistes.ts` et `connecteurs.ts` n'existent pas encore, §2 fixe ce que le JSON-LD attend d'eux.
Légende : `{{x}}` = champ dérivé des données, jamais écrit en dur.

## 1. Décisions proposées

1. **FAQPage : ne pas l'émettre** sur les fiches (ni sur le hub, ni sur la page des outils). Garder la FAQ visible.
   - Google : résultat enrichi retiré le 07/05/2026, documentation supprimée en juin (mémoire `google-faq-rich-result-retire-mai-2026`). Gain SERP : nul.
   - Assistants : les réponses sont déjà dans le DOM (`Faq.astro`). Le balisage ajoute une étiquette, pas de contenu. Bénéfice non confirmé, non mesurable chez nous.
   - Précédent de Kevin (14/10, outils) : pas de FAQPage sur une page de gabarit. Neuf fiches = un gabarit, même risque de FAQ répétée.
   - Coût : seconde copie du texte et test de parité à tenir à vie. Cohérence avec l'accueil et le CAC : valeur faible.
   - Accueil et CAC gardent leur FAQPage (SEO acquis, Info). Jamais QAPage (pas de Q&A d'utilisateurs).
   - Si Kevin l'accepte malgré tout : gabarit en §4 bis, activé par donnée (`faq.balisage`), avec les gardes du §6.
2. **L'agent n'est ni une `Person` ni une `SoftwareApplication`.** C'est un `Service` (charte : jamais « logiciel »). Auteur = Kevin, par `@id`, posé par `Base`. Aucun nœud `Person` n'est émis sur ces trois familles de pages.
3. **Prénom** (D3) : seulement `Service.alternateName` (« Balthazar, agent IA Comptabilité »). Jamais dans `name`, `headline`, `url`, ni `og:title`. Optionnel, un test le borne.
4. **Prix au devis** : aucun `offers`, `aggregateRating`, `review`, `Rating`, `price*`, `hasOfferCatalog`. Garde de build (§3) + test dist (§6).
5. **Types** : hub et outils = `CollectionPage` seul (patron de `/integrations` et `/outils-comptables-gratuits`, plus simple que `['WebPage','CollectionPage']`). Fiche = `WebPage` + un `Service`. Aucun `Service` sur hub ni outils (au plus un par page).
6. **Dates** : fiche = `PageEeat` (`datePublication`, `dateModification`, `auteur`), comme `eeatService`. Hub et outils = constantes explicites des données, jamais le `lastmod` du sitemap ni la date de build.
7. **Outils tiers** (Sage, Silae…) : `ListItem` simples. Jamais `SoftwareApplication` (mauvais type, laisse croire que nous vendons du logiciel, aucun partenariat).
8. **`@id`** : suffixes `#page`, `#items`, `#service`, `#breadcrumb`, `#faq` (majorité du dépôt ; `#webpage` reste sur Service.astro et integrations, non touché).

## 2. Contrat de données attendu

Importables par `node --test` comme `glossary-ec.test.mjs` : imports relatifs avec extension, `import type` pour tout alias `@/`.
```ts
// specialistes.ts
interface Specialiste { slug: string; prenom: string; libelle: string; ligne: string; publie: boolean;
  destination: { type: 'fiche' } | { type: 'page'; chemin: string };    // paie, CAC, outils
  h1: string; titreOnglet: string; description: string; serviceType: string; image: { url: string };
  servicesLies: readonly string[];            // slugs /automatisation/* ; vide pour 6 fiches sur 9 (cadrage §7)
  eeat: PageEeat; faq: { balisage: boolean; questions: readonly { question: string; reponse: string }[] } }
export const HUB = { h1, titreOnglet, description, ariane: 'Agents IA', nomListe, datePublication, dateMiseAJour };
export const cheminSpecialiste = (s: Specialiste) => s.destination.type === 'page' ? s.destination.chemin : `/agents-ia/${s.slug}`;
// connecteurs.ts
interface Connecteur { id: string; nom: string; domaine: string; statut: 'eprouve' | 'par-export' | 'sur-demande'; verifieLe: string }
export const STATUTS = { eprouve: 'Éprouvé', 'par-export': 'Par export', 'sur-demande': 'Sur demande' } as const;
export const PAGE_OUTILS = { chemin: '/integrations', h1, titreOnglet, description, ariane, datePublication, dateMiseAJour };
```
Les `ListItem` du hub viennent du **même tableau filtré** que les cartes (`publie`), jamais d'une seconde liste.

## 3. Utilitaires à ajouter

`src/data/schema.mjs` (génériques, aucun import `.ts` : `astro.config.mjs` l'importe) :
```js
export const pageId = (chemin, suffixe) => `${SITE.url}${chemin}#${suffixe}`;      // throws si chemin sans « / » initial ou avec « # », « ? »
export function breadcrumbNode({ chemin, name, parents = [] })                       // parents: [{ name, chemin }]. Accueil + parents + page. @id #breadcrumb. throws: nom vide, doublon
export function itemListNode({ chemin, name, items, id = pageId(chemin, 'items') })  // items: [{ name, url, description? }] ; numberOfItems = items.length ; throws: vide, url relative ou en double
export function collectionPageNode({ chemin, h1, description, datePublication, dateModification, auteurId, about })
export function webPageNode({ chemin, h1, description, datePublication, dateModification, auteurId, mainEntityId })  // name = headline = h1 ; breadcrumb #breadcrumb
export function agentServiceNode({ chemin, name, serviceType, description, image, prenom, libelle, servicesLiesIds = [] })
  // = { ...serviceNode({ chemin, name, serviceType, description }), image, alternateName, isRelatedTo? }. serviceNode n'est PAS modifié.
export function faqPageNode({ chemin, serviceId, questions })                        // §4 bis, throws si < 3 questions
export function assertGraph(graph, { servicesMax = 1 } = {})                         // garde de build, fail-closed (ci-dessous)
```
`assertGraph` lève : `@context` ≠ `https://schema.org` ; type interdit (`Person`, `SoftwareApplication`, `WebApplication`,
`MobileApplication`, `Offer`, `AggregateOffer`, `Review`, `Rating`, `AggregateRating`) ; propriété interdite (`offers`, `aggregateRating`,
`review`, `price`, `priceCurrency`, `priceSpecification`, `applicationCategory`, `operatingSystem`) ; `@id` en double dans le graphe ;
`url`/`item` non absolu en `https://` ; date hors `YYYY-MM-DD` ; plus de `servicesMax` nœud `Service` ; `BreadcrumbList` ≠ 1 ou dernier `item` ≠ `url` de la page.
Un garde ne se propage pas seul : les trois fonctions ci-dessous l'appellent, les pages `.astro` n'assemblent rien à la main.

`src/data/schema-agents.mjs` (données injectées, donc testable sans Astro) :
`hubGraph({ hub, specialistes })` · `ficheGraph({ specialiste, hub, servicesLiesIds })` · `outilsGraph({ page, connecteurs, statuts })`.
Les pages passent `schema={hubGraph(...)}` à `Base` avec `titreSocial={h1}` (og:title = H1 = headline, exigé par `verify-page-contract`).

## 4. Gabarits

**Hub `/agents-ia`** (`url` = `https://memlia.fr/agents-ia`)
```json
{ "@context": "https://schema.org", "@graph": [
  { "@type": "CollectionPage", "@id": "{{url}}#page", "url": "{{url}}", "name": "{{HUB.h1}}", "headline": "{{HUB.h1}}",
    "description": "{{HUB.description}}", "inLanguage": "fr-FR",
    "datePublished": "{{HUB.datePublication}}", "dateModified": "{{HUB.dateMiseAJour}}",
    "author": { "@id": "https://memlia.fr/a-propos#kevin-kitanga" },
    "isPartOf": { "@id": "https://memlia.fr/#website" }, "about": { "@id": "https://memlia.fr/#service" },
    "breadcrumb": { "@id": "{{url}}#breadcrumb" }, "mainEntity": { "@id": "{{url}}#items" } },
  { "@type": "ItemList", "@id": "{{url}}#items", "name": "{{HUB.nomListe}}", "numberOfItems": "{{publies.length}}",
    "itemListElement": [ { "@type": "ListItem", "position": "{{i+1}}", "name": "{{s.libelle}}",
      "url": "https://memlia.fr{{cheminSpecialiste(s)}}", "description": "{{s.ligne}}" } ] },
  "{{organizationNode()}}",
  { "@type": "BreadcrumbList", "@id": "{{url}}#breadcrumb", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://memlia.fr/" },
    { "@type": "ListItem", "position": 2, "name": "{{HUB.ariane}}", "item": "{{url}}" } ] }
] }
```
Les 12 `ListItem` = 9 fiches + `/automatisation/paie` + `/commissaires-aux-comptes` + `/integrations`. `numberOfItems` est un nombre (jamais 12 en dur).

**Fiche `/agents-ia/<métier>`** (`url` = `https://memlia.fr/agents-ia/{{s.slug}}`)
```json
{ "@context": "https://schema.org", "@graph": [
  { "@type": "WebPage", "@id": "{{url}}#page", "url": "{{url}}", "name": "{{s.h1}}", "headline": "{{s.h1}}",
    "description": "{{s.description}}", "inLanguage": "fr-FR",
    "datePublished": "{{s.eeat.datePublication}}", "dateModified": "{{s.eeat.dateModification}}",
    "author": { "@id": "https://memlia.fr{{identiteAuteur(auteurPar(s.eeat.auteur))}}" },
    "isPartOf": { "@id": "https://memlia.fr/#website" },
    "mainEntity": { "@id": "{{url}}#service" }, "breadcrumb": { "@id": "{{url}}#breadcrumb" } },
  { "@type": "Service", "@id": "{{url}}#service", "name": "{{s.h1}}", "alternateName": "{{s.prenom}}, agent IA {{s.libelle}}",
    "serviceType": "{{s.serviceType}}", "description": "{{s.description}}", "url": "{{url}}", "image": "{{s.image.url}}",
    "areaServed": "FR", "provider": { "@id": "https://memlia.fr/#organization" },
    "audience": { "@type": "Audience", "audienceType": "Cabinets d'expertise comptable" },
    "isRelatedTo": [ { "@id": "https://memlia.fr/automatisation/{{slugService}}#service" } ] },
  "{{organizationNode()}}",
  { "@type": "BreadcrumbList", "@id": "{{url}}#breadcrumb", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://memlia.fr/" },
    { "@type": "ListItem", "position": 2, "name": "{{HUB.ariane}}", "item": "https://memlia.fr/agents-ia" },
    { "@type": "ListItem", "position": 3, "name": "{{s.libelle}}", "item": "{{url}}" } ] }
] }
```
`isRelatedTo` est omis quand `servicesLies` est vide, et ne retient que les pages service **publiées et indexables** (`status === 'publie'`).
`audienceType` reprend `DEFAULT_AUDIENCE_TYPE` (aucune fiche CAC : Missions d'audit mène à `/commissaires-aux-comptes`, qui a son propre Service).

**Page des outils `/integrations`** (`url` = `https://memlia.fr/integrations`)
```json
{ "@context": "https://schema.org", "@graph": [
  { "@type": "CollectionPage", "@id": "{{url}}#page", "url": "{{url}}", "name": "{{P.h1}}", "headline": "{{P.h1}}",
    "description": "{{P.description}}", "inLanguage": "fr-FR", "datePublished": "{{P.datePublication}}", "dateModified": "{{P.dateMiseAJour}}",
    "author": { "@id": "https://memlia.fr/a-propos#kevin-kitanga" }, "isPartOf": { "@id": "https://memlia.fr/#website" },
    "breadcrumb": { "@id": "{{url}}#breadcrumb" }, "mainEntity": { "@id": "{{url}}#items" } },
  { "@type": "ItemList", "@id": "{{url}}#items", "name": "{{P.nomListe}}", "numberOfItems": "{{connecteurs.length}}",
    "itemListElement": [ { "@type": "ListItem", "position": "{{i+1}}", "name": "{{c.nom}}",
      "url": "{{url}}#{{c.id}}", "description": "Statut : {{STATUTS[c.statut]}}" } ] },
  "{{organizationNode()}}",
  { "@type": "BreadcrumbList", "@id": "{{url}}#breadcrumb", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://memlia.fr/" },
    { "@type": "ListItem", "position": 2, "name": "{{P.ariane}}", "item": "{{url}}" } ] }
] }
```
Une seule liste plate, dans l'ordre du DOM (domaine par domaine). Le statut n'a pas de propriété schema.org : il est dit en texte, depuis la fermeture à trois valeurs.
Les 12 guides ne sont plus dans l'`ItemList` (ils deviennent le détail de chaque outil) : leurs liens restent dans le DOM, la règle « au moins un lien entrant » les couvre.

**4 bis. FAQPage, seulement si Kevin l'accepte** (nœud supplémentaire de la fiche, gabarit de CAC) :
`{ "@type": "FAQPage", "@id": "{{url}}#faq", "inLanguage": "fr-FR", "about": { "@id": "{{url}}#service" }, "mainEntity": [ { "@type": "Question", "name": "{{q.question}}", "acceptedAnswer": { "@type": "Answer", "text": "{{q.reponse}}" } } ] }`
`Base` pose `author` sur tout type finissant par `Page`, FAQPage compris : redondant, sans danger.

## 5. Branchement

- `verify-page-contract.mjs`, `expectedSchema` : `/agents-ia` → `['CollectionPage','ItemList','BreadcrumbList']` ; `/^\/agents-ia\/[^/]+$/` → `['WebPage','Service','Audience','BreadcrumbList']` (calqué sur `/automatisation/*`) ; `/integrations` : **ajouter `BreadcrumbList`** (absent aujourd'hui, la page l'émet pourtant). Étendre `sourceForRoute` au préfixe.
- `config/page-intent-contract.json` : entrées `/agents-ia`, une par fiche, et **réécrire `/integrations`** (`descriptionLead` « Trouvez les repères de contrôle » ne tiendra plus).
- Facultatif, hors périmètre : les guides `/integrations/<slug>` ont un fil à 2 niveaux (`PageCommerciale`). Les passer à 3 (Accueil, `{{PAGE_OUTILS.ariane}}`, guide) change 12 pages ; si fait, le nom du parent vient de `PAGE_OUTILS.ariane`, source unique.

## 6. Tests à écrire

**A. `tests/scripts/schema-agents.test.mjs`** (unitaire, sans dist) :
1. `breadcrumbNode` : positions 1..n, `item` en `https://`, dernier = canonique ; lève sur nom vide, chemin relatif, doublon.
2. `itemListNode` : `numberOfItems === itemListElement.length`, positions contiguës ; lève sur liste vide, url relative, url en double.
3. **Non-régression** : `serviceNode()` strictement égal à sa valeur d'avant (patron de `schema-audience.test.mjs`), `withBreadcrumb` intact.
4. `agentServiceNode` : `@id === {{url}}#service`, `provider['@id'] === ORGANIZATION_ID`, `areaServed === 'FR'`, `Audience` ; `alternateName` contient le prénom, `name` et `url` non ; `isRelatedTo` absent si `servicesLies` vide.
5. `assertGraph` : un mutant par interdit (ajouter `offers`, `aggregateRating`, un nœud `Person`, un second `Service`, un `@id` en double, une date `14/10/2026`, un `item` relatif) doit lever. Sans ces mutants le test ne prouve pas le garde.
6. Pour chaque `Specialiste` publié, `ficheGraph` : types `{WebPage, Service, BreadcrumbList, Organization}`, 3 niveaux, `headline === h1`, dates ISO, `dateModification >= datePublication`. `hubGraph` : 0 `Service`, `numberOfItems === publies.length`, URLs distinctes. `outilsGraph` : statuts dans la fermeture à trois valeurs, `id` uniques, `P.dateMiseAJour >= max(verifieLe)`, `HUB.dateMiseAJour >= max(dateModification des fiches)`.
7. Prénoms : `prenom` absent de `h1`, `titreOnglet`, `slug` et de tout `headline` (garde de D3).

**B. Extension de `schema-render.test.mjs`** (dist, classer par `pathname` du canonical, pas par nom de fichier) :
1. `/agents-ia` : 0 `Service` ; `ItemList` = cartes du DOM (`[data-carte-agent]`), même nombre, même ordre, mêmes URL ; chaque URL existe dans `dist`, indexable, canonical identique (un `ListItem` ne mène jamais à une page absente ou en `noindex`).
2. `/agents-ia/<slug>` : exactement 1 `Service` ; `BreadcrumbList` à 3 éléments, `[1].item` = `/agents-ia` ; dernier `name` = dernier élément du fil visible (`nav.ariane [aria-current]`) ; `WebPage.headline` = H1 = og:title ; `isRelatedTo` : chaque `@id` correspond à une page `/automatisation/<slug>` indexable ; aucun `Person`.
3. `/integrations` : 0 `Service` ; chaque `ListItem.url` pointe un `id=` présent dans le HTML ; description « Statut : … » = badge visible de l'outil ; aucun guide n'a perdu son lien entrant.
4. Les trois familles : `JSON.stringify` des blocs sans les propriétés ni types du §3 (portée limitée : `/outils-comptables-gratuits/*` porte légitimement `WebApplication`).
5. Cohérence d'identité : pour `#organization` et tout `@id` défini sur ces pages, les définitions rencontrées dans `dist` sont `deepEqual`. À **limiter à ces `@id`** : voir §7, un test global échouerait aujourd'hui.
6. Si une fiche porte `FAQPage` (option) : ≥ 3 questions, parité exacte avec le DOM (modèle `site.spec.ts`), **aucune question identique dans deux fiches** (c'est le risque de gabarit).
7. Charte §9 bis dans le JSON-LD : pas de code neuf si le verrou `tests/proof/test_positioning.py` parcourt déjà `dist/` JSON-LD compris ; y ajouter la liste des interdits (« agent autonome », « collaborateur IA », « employé IA », « agent IA CAC », « DPO IA ») au lieu de la dupliquer en JS.

## 7. Points relevés à la lecture (non traités, à signaler)

- **Deux définitions du même `@id`** : `/a-propos#kevin-kitanga` est un `Person` à 6 champs (`url` avec fragment) dans `integrations/[slug].astro`, et à 7 champs (`description` en plus, `url` sans fragment) dans `noeudAuteur` via `Service.astro`. Contraire à la règle du commentaire de `schema.mjs`. Lu dans le code, non exécuté.
- `Base.astro` n'ajoute pas `Person` ; les trois nouvelles familles doivent donc référencer l'auteur seulement par `@id`, comme `/integrations` aujourd'hui.
- `organizationNode()` dit seulement « cabinets d'expertise comptable » : cohérent avec les fiches, déjà noté au cadrage §7 comme piège de phase 3.
- Le hub porte `about: SERVICE_ID` (référence, pas un nœud `Service` : le test ne compte que les nœuds de premier niveau).
- `llms-inventory.mjs` et `sitemap` : hors JSON-LD, déjà au cadrage §14.
