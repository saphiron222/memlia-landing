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

### Reprise après la première CI

La CI initiale de PR86 a trouvé deux échecs sur 320 parcours : export intermittent et garde réseau générique dirigeant la bibliothèque vers le formulaire de rapprochement. Le second est reproduit localement ; le premier est reproduit de manière déterministe en différant de 100 ms la consommation du lien Blob (téléchargement annulé avant correction). Le lien d’export est maintenant attaché au document et libéré après une seconde ; un test contrôle le fichier exact et le nettoyage. Le garde commun exerce les filtres de la bibliothèque sans aucune requête ni stockage, au lieu du formulaire d’un autre outil.

Reprise réellement exécutée : huit tests Node ciblés PASS ; npm run check code 0 ; npm run build code 0 après synchronisation lastmod de la seule bibliothèque ; 46 parcours Chromium bibliothèque/générateur/garde commun PASS, dont le nouveau test d’export différé. Rejeu sur le serveur Astro local hérité de la première tentative à http://127.0.0.1:43781, après reconstruction de dist ; démarrage initial du second serveur refusé car le premier était encore actif, sans contournement du verrou. Les logs de reprise et les preuves rouges sont joints à l’archive. Les résultats Lighthouse et l’audit SEO précédents restent des mesures locales, non des preuves de publication.

Une QA indépendante code/contenu technique non normatif ; ne pas ajouter une file métier. Puis CI verte, fusion, Cloudflare SUCCESS, GET public no-cache sans query, canonical/sitemap/hub/footer/médias et trois entrants contrôlés, parcours et exports rejoués réellement en production ; actualiser publieLe uniquement après constat. Aucun scénario public exécuté dans cette phase.
La deuxième CI conserve un seul échec : la rafale d’exports s’arrête au onzième fichier (dix fichiers précédents complets dans le reçu navigateur). Le test d’export différé et le garde réseau passent. Diagnostic : protection Chromium contre les téléchargements en rafale, masquée par le navigateur local plus lent. Les douze copies/exports sont désormais douze tests isolés, chacun sur une page neuve ; toutes les assertions fichier exact, nom, réseau et stockage restent présentes, sans autorisation navigateur élargie ni attente artificielle. La suite locale complète a aussi été interrompue par la limite de 420 s du transport outil : aucun PASS global local revendiqué pour ce lancement.

Observations de trafic, positions, citations IA, backlinks, conversions et CWV terrain ND ; organiser J+7/J+28 après lancement. Aucun SaaS payant ni campagne externe. npm ci signale trois vulnérabilités préexistantes (une modérée, deux hautes), non modifiées.

Hotspots : src/data/outils.ts, pages-lastmod.json, registre-requetes.json, Outil.astro et manifeste glossaire/footer ; synchroniser main avant fusion et conserver matière/verdicts des revues existantes.

### Levée ciblée des trois défauts QA (t_963eec76)

R1 : le lien du générateur ouvre désormais la bibliothèque dans un nouvel onglet explicitement annoncé, isolé par `noopener noreferrer`. L’adaptation s’effectue dans cet autre onglet : le document, les choix et l’export d’origine restent intacts dans le premier. Aucun texte libre n’est persisté ; seul l’identifiant public temporaire de modèle circule comme auparavant. Cette navigation ne dépend pas du cache de retour du navigateur.

R2 : la garde commune inclut les cinq listes, la description, la confirmation et l’éditeur ; le refus conserve le formulaire, l’acceptation charge uniquement les choix du modèle. R3 : le générateur applique le même maintien du lien Blob attaché au document que la bibliothèque, puis retire le lien et révoque l’URL après une seconde.

Les trois sondes indépendantes QA ont été rejouées rouges avant correction. `tests/browser/prompt-qa-reprise.spec.ts` couvre le parcours réel à deux onglets avec export du texte original et stockage vide, chacun des sept champs seul avec refus/acceptation, puis le fichier adapté exact après consommation différée de 100 ms et son nettoyage. R1 change seulement son trajet pour suivre le nouveau lien ; R2/R3 restent rejouables tels quels. Matière et 27 verdicts du glossaire inchangés ; aucune publication ni levée de QA revendiquée par cette correction.
