# Outil 10 — candidat local vérifié, production à constater

Route : `/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec`.
Branche : `feat/pseudonymiser-t_163dc43d`, base distante main fraîche au démarrage.

## Résultat et décisions

Une copie de travail CSV/TSV/FEC texte est lue dans un Worker. Original jamais écrit ; remplacement de l’import précédent seulement après lecture réussie. UTF-8 strict ou Windows-1252 choisi explicitement, séparateur choisi, limites visibles (20 × 1024 × 1024 octets, 100 000 lignes, 128 colonnes, 65 536 caractères par cellule). UTF-16, binaire, en-têtes vides/dupliqués, guillemets invalides et lignes irrégulières refusés. Pas d’inférence automatique d’encodage.

Champs libres/inconnus supprimés par défaut, identifiants reconnus remplacés par alias. Alias par colonne et par session : mêmes valeurs, même alias, distinctes, alias distincts. Pas de hachage prétendu anonyme. Les champs non reconnus restent à examiner. Nom de colonne conservé et risques d’en-têtes explicités.

Avant/après limité à cinq lignes dans le DOM ; traitement et rapport couvrent toutes les lignes. Aucun aperçu ne constitue une garantie. Détection email/IBAN heuristique, alerte champs libres conservés, quasi-identifiants et compte des lignes uniques (pas score d’anonymat). Dates et montants rares peuvent identifier.

CSV UTF-8 BOM, point-virgule, guillemets et CRLF. Apostrophe devant =,+,-,@ après espaces, ou TAB/CR/LF initiaux, y compris en-têtes et mapping. Les négatifs deviennent du texte : convention affichée au formulaire et dans le rapport, pas modification fiscale silencieuse. Fichier `copie-pseudonymisee.csv`, jamais FEC fiscal. Rapport JSON séparé ; mapping original/alias uniquement sur choix distinct, séparé et protégé.

Reset termine les Workers, retire les aperçus et références de contenu. Il ne prétend ni effacer les téléchargements ni assurer un effacement sécurisé de RAM. Annulation de l’import termine le Worker candidat, préserve l’import précédent. Exemple refuse d’écraser un import/sélection existant.

## Source ouverte

CNIL, « L’anonymisation de données personnelles », page datée 19 mai 2020, ouverte le 4 octobre 2026 : https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles.
Citation visible exacte : « L’anonymisation ne doit pas être confondue avec la pseudonymisation ».
La page explique alias, réversibilité, données restant personnelles et individualisation/corrélation/inférence. Ici aucune qualification d’anonymisation universelle, conclusion fiscale ou autorisation de transfert. La revue unique adaptée est QA (objet principal : code local et limites techniques, pas nouvelle conclusion juridique).

## Exécutions réelles

- Tests Node de pseudonymisation : rouge initial (moteur absent), puis 6 PASS : noms répétés, champs libres/email, quasi-identifiants, BOM/accents/quotes/retours ligne, refus/encodage, neutralisation et actions invalides.
- Registre : test rouge type outil inconnu, puis test outil + 21 tests du registre PASS. Primaires distinctes du blog, aucune page résultat indexable.
- Playwright `tests/browser/pseudonymisation.spec.ts` : 10 PASS sur le build servi localement, URL sans query, avec vrai Worker. Import/aperçu, CSV et rapport réellement téléchargés et relus, mapping opt-in, formula neutralisée, refus binaire/20 Mo, annulation, exemple sans écrasement, UTF-8 refusé puis Windows-1252, TSV, reset. Capture et clavier 320/375/768/1024/1440/1920.
- Réseau pendant import/aperçu/export : aucun contenu sortant ; seule ressource technique Worker same-origin autorisée au chargement. Pas de POST ni payload. local/sessionStorage vides, cookies vides, interceptions setItem/IndexedDB sans appel. CSP `connect-src none` préservée. La preuve ne prétend pas être une certification RGPD.
- `npm run check` : 0 erreur, 0 warning, 8 hints préexistants.
- `npm run build` final : sortie 0, 122 tests Python PASS, 582 tests Node de scripts PASS, autres gates Blog/service/page/images/lastmod et Ressources PASS.
- Renderer propre : `node scripts/render-proofs-v2.mjs --source=docs/design/pseudonymisation --manifest=docs/qa/site-v2/pseudonymisation-manifest.json --start=29 --check` PASS. WebP 1600×900 sous 150 Ko, OG 1200×630. Nouveau dossier de scène, aucun cadre historique modifié.
- Lighthouse mobile local réel : performance 99, accessibilité 100, bonnes pratiques 100, SEO 92 ; LCP 2,1 s, CLS 0. Le seul audit SEO rouge est robots.txt : Lighthouse ne peut pas le fetch à cause de `connect-src none` (erreur protocole CSP), pas une syntaxe invalide observée. GET `/robots.txt` séparé 200 text/plain, règles et sitemap intacts. Ne pas affaiblir la CSP pour obtenir 100. Le score SEO ≥95 n’est donc pas revendiqué ; à apprécier en QA avec le contrôle indépendant HTTP. Catégorie expérimentale agentic-browsing 67 (llms.txt également bloqué par son fetch).
- Relecture des captures et scène : pas texte coupé desktop ; tableaux mobiles défilants annoncés et testés, nom de fichier affiché hors contrôle natif tronqué. Capture scrollTop=0 pour éviter la nav fixe au milieu d’une capture pleine page. La mise en page longue conserve le gabarit historique.

## Incidence de chrome et correction de construction

L’ajout du footer généré change réellement le HTML des pages existantes : lastmod synchronisé, preuves du glossaire rescellées puis revue existante réaffirmée, sans changer la matière métier. Le script de rescellement reculait la date de campagne à septembre tout en reportant les deux verdicts métier d’octobre : échec réel. Correction de deux lignes pour reporter sa date avec le verdict, test de non-régression rouge puis vert, commande réelle de rescellement/réaffirmation et audit Ressources final PASS. Pas de nouvelle revue métier du glossaire créée.

## SEO/Blog et maillage

64 lignes distinctes dans skills.md/skills.json : application ciblée du cadrage au candidat, N/A motivés, aucun audit de 64 fournisseurs inventé. Mesures GSC/Bing/citations/backlinks/déclin après publication restent ND ; connecteurs fournisseur non exposés remplacés pour ce contrôle par crawl local, navigateur, Lighthouse et source officielle ouverte.

H1/OG identiques, description unique, canonical absolu propre ; WebPage + WebApplication + BreadcrumbList. Entrée type outil et catégorie Préparer. Hub/footer proviennent de la collection. Trois entrants contextuels du candidat : hub, garanties, méthode. Remplacement décidé de l’entrant vérificateur FEC par méthode, car le frère n’est pas encore livré sur main ; pas de lien vers 404. Le frère pourra pointer ici à sa propre livraison. Sortants hub/méthode/contact existants. Sitemap et contrats de requête contrôlés par build.

## Transmission

Cette livraison d’implémentation ne prétend pas être en production. Une seule revue indépendante QA, puis publication et rejeu public constituent les cartes suivantes. Après intégration, recréer les preuves de chrome sur main courant (hotspots : registre outils/proofs/requêtes, tests/proof/test_build.py, renderer et preuves du glossaire). Ne pas imposer une seconde revue pour une date, un lien ou une preuve de chrome.

Logs bruts, Lighthouse et captures sont remis dans l’archive de preuves de la carte. La carte de publication devra consigner URL, CI, déploiement Cloudflare, import/refus/export, médias, sitemap/hub/footer et trois entrants sur production sans query avec Cache-Control: no-cache. Reprise des mesures J+7/J+28, ND si absentes. Dépendances npm : trois vulnérabilités préexistantes (une moderate, deux high), aucun ajout de dépendance ici.
