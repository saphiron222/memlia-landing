# Bibliothèque de prompts comptables — implémentation 02

Route : /outils-comptables-gratuits/bibliotheque-prompts-comptables.
Carte : t_cb184759. Phase implémentation ; la QA unique puis la publication sont deux cartes liées. Aucune production ni indexation revendiquée ici.

## Produit et décisions

Douze fiches originales par tâche, contexte, entrées, résultat attendu, frontière, arrêt et exemple fictif. Sorties attendues rédigées, pas réponses inventées d’un modèle. Catalogue statique utilisable sans JS ; filtres combinés pôle/format/tâche/recherche accent-insensible, compteur, état vide et effacement explicite. Copies et fichiers texte complets exacts aux douze prompts affichés ; repli sélection intégrale si le presse-papiers échoue.

Moteur src/lib/prompt-comptable.mjs partagé avec 01. La reprise conserve le prompt détaillé si les contraintes d’amorce sont inchangées ; sinon le générateur annonce le passage aux blocs génériques. Reprise par sessionStorage {version:1,id:<identifiant public>} : exception temporaire annoncée, consommation immédiate, aucun texte libre persisté, aucun contenu en URL. Confirmation avant remplacement des choix existants ; prompt édité conservé, autre confirmation avant nouvel assemblage. Si stockage indisponible, repli copie/export puis lien générique.

Sans API, modèle, inscription, mail ni paiement. Pas nouvelle règle fiscale/sociale, aucune écriture comptable ou décision automatique. Source CNOEC Travaux Data et IA ouverte le 05/10/2026 : livret, usages et précautions ; ne certifie pas le corpus.

## SEO, design et maillage

Intention choisir une consigne, distincte du générateur qui construit et du blog qui explique. Primaire bibliothèque prompts comptables, H1/OG/headline Bibliothèque de prompts comptables, description orientée tâche ; canonical absolu propre, WebPage/WebApplication/BreadcrumbList véridiques, pas BlogPosting ou rating. Une route, aucune route par fiche ou filtre. Sonde réelle autocomplete FR : demande-autocomplete.json, aucune suggestion ; volume ND.

Gabarit Outil et sections/tokens canoniques ; Explorer ajouté au hub. CTA final consigne plutôt que calculateur. Trois entrants contextuels : hub, générateur et méthode. /methode remplace explicitement le blog scellé : passage utile par geste, sans republication adjacente du guide. Lien retour vers le guide conservé. Footer généré, sitemap et lastmod synchronisés.

Scène propre HTML figée docs/design/bibliotheque-prompts-proof : filtre relation client/mail, relance, entrée fictive et brouillon. Renderer --check PASS ; WebP 1600×900 et OG 1200×630, sous 150 Ko ; image examinée par vision, lisible sans texte coupé. Aucun visuel recyclé ou généré. L’aperçu du prompt est une zone défilante, copie/export intégraux. Navigation collante commune : une capture pleine page prise après défilement peut la placer artificiellement au milieu ; la QA doit comparer des captures prises depuis le haut.

## Vérifications réellement exécutées

- Tests moteur d’abord rouges (module absent), puis sept tests 02+01 PASS. Douze fiches passent le contrôle structurel commun.
- Défauts navigateur reproduits puis corrigés : libellé implicite select incluant options (labels explicites), reset microtask antérieur à l’action native (effacement explicite des champs).
- Chromium : 24 parcours PASS (12 bibliothèque + 12 générateur/reprise) dans browser-final.log. Sans JS, filtres/état vide/effacement, douze copies/exports exacts, stockage et clipboard refusés, reprise versionnée et éditions protégées, clavier et six largeurs 320/375/768/1024/1440/1920. Zéro requête pendant copies/exports après chargement ; localStorage/sessionStorage vides hors transfert public ID.
- npm run check : code 0, diagnostics dans check-final.log.
- npm run build : code 0, build-final.log ; suite Python et Node, oracles metadata/maillage/médias, audits Ressources inclus.
- Lighthouse réel : mobile 99/100/100/100, desktop 100/100/100/100. Rapports complets et reçus collecteur HTTP robots hors document ; audit robots natif inchangé. Mesures laboratoire locales, pas CWV terrain.
- Glossaire : footer seulement ; main sérialisé identique au témoin main b40b12a, 27 verdicts métier conservés par l’instrument existant, deux reconstructions réelles et reçus chrome/. Aucune seconde revue de matière.
- Catalogue SEO/Blog : 64 contenus et cellules 02 examinés ; matrice-skills-02.json, audit-seo.json et resume-seo.md décrivent contrôles ciblés/N/A/différés honnêtes. Ce sous-rapport précédent les logs finaux, les preuves d’exécution de cette section le complètent. Observations anciennes « calculateur » corrigées pour titre CTA et section preuves ; FAQ commune conserve son terme historique, sans implication métier nouvelle.

## Suite et risques restants

Une QA indépendante code/contenu technique non normatif ; ne pas ajouter une file métier. Puis CI verte, fusion, Cloudflare SUCCESS, GET public no-cache sans query, canonical/sitemap/hub/footer/médias et trois entrants contrôlés, parcours et exports rejoués réellement en production ; actualiser publieLe uniquement après constat. Aucun scénario public exécuté dans cette phase.

Observations de trafic, positions, citations IA, backlinks, conversions et CWV terrain ND ; organiser J+7/J+28 après lancement. Aucun SaaS payant ni campagne externe. npm ci signale trois vulnérabilités préexistantes (une modérée, deux hautes), non modifiées.

Hotspots : src/data/outils.ts, pages-lastmod.json, registre-requetes.json, Outil.astro et manifeste glossaire/footer ; synchroniser main avant fusion et conserver matière/verdicts des revues existantes.
