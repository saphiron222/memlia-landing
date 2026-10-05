# Preuves de lecture et applications de cadrage

HEAD `c4a399c87090b14a7a56055841c6f29e48edef27` ; 2026-10-03T23:14:52.127229+00:00.

## Ce qui a réellement été exécuté
- Script Python : lecture intégrale des définitions locales, comparaison au catalogue fourni, empreintes, double lecture des SKILL.md et identité du corpus, lecture intégrale des sources allowlistées, extraction de slugs et des frontmatters blog, contrôle de couverture et unicité de chaque cellule.
- Application manuelle ciblée des méthodes de cadrage : intentions, frontières, pertinence produit, risques de cannibalisation, architecture, catégories, maillage, schéma/indexation, contrats de traitement et changements vers les briefs. Aucun score automatisé d’audit n’est substitué à ces sorties.
- Les preuves suivantes sont des **constats de source et décisions de cadrage**, pas des PASS de pages futures.
- Framework and prompts (c) Daniel Agrici, CC BY 4.0. Source: github.com/AgriciDaniel/flow

## Inventaire / contrôle
- 64 skills = 32 préfixe blog + 31 préfixe seo + memlia-blog-strategie.
- 640 cellules ; statuts : {"applicable exécuté cadrage": 250, "N/A motivé": 218, "applicable différé implémentation": 172}
- Texte complet des 64 définitions et des références utilisées embarqué dans matrice-skills.json (champ content) ; pas seulement un manifest de lecture.
- Aucun nouveau slug ne collisionne avec les slugs actuels du registre outils.
- Archive auxiliaire hors dépôt : /Users/kevinkitanga/.hermes/profiles/marketing/cache/scratch/skills-v3-full.json ; script de collecte : /Users/kevinkitanga/.hermes/profiles/marketing/cache/scratch/inventory_v3.py ; script de cadrage/validation : /Users/kevinkitanga/.hermes/profiles/marketing/cache/scratch/framing_v3.py.

## Constats → changements à intégrer aux briefs

### P01
- Constat : Catalogue exposé : 57 définitions. Inventaire physique : sept extensions supplémentaires portant les préfixes demandés, absentes de ce catalogue.
- Preuve source : `catalogue JSON fourni + SKILL.md locaux, comparaison physique`.
- Changement transmis : 64 définitions intégrales chargées ; 57 exposées et 7 installées hors catalogue ; toutes classées pour chacun des dix outils.

### P02
- Constat : Memlia est un service d’automatisation dans les outils existants, pas un logiciel comptable ; auteur non expert-comptable.
- Preuve source : `.agents/product-marketing.md:48-59,114-126`.
- Changement transmis : Copie au nous/vous ; IA prépare humain décide ; aucune autonomie, certification ou gain promis.

### P03
- Constat : Le modèle actuel d’un outil exige promesse entrée/résultat, limites, mention locale, source, pageService et CTA.
- Preuve source : `src/data/outils.ts:14-36`.
- Changement transmis : Ajouter des spécifications par outil, pas dix pages de texte générique ; 03 exige un contrat réseau différent des locaux.

### P04
- Constat : Un article Prompt et un article Logiciel IA existent dans le corpus courant ; les relevés du 20/09 précèdent leur publication.
- Preuve source : `src/content/blog/prompt-chatgpt-expert-comptable.md ; src/content/blog/logiciel-ia-comptabilite.md ; registre-requetes.json`.
- Changement transmis : Article = méthode, outil = faire ; ne pas dupliquer les textes ni cibler un logiciel pour 03 ; aucun canonical de feuilles vers le blog.

### P05
- Constat : Le hub ne montre que disponible ; le contrat réclame trois entrants contextualisés dont hub et ressource exacte.
- Preuve source : `OUTILS-CONTRAT-DE-LIENS.md:7-25`.
- Changement transmis : Planifier hub ↔ dix feuilles et identifier de vrais parents sémantiques ; un frère générique ne suffit pas à faire le compte.

### P06
- Constat : Ancien catalogue refuse 03-10 et fusionne 02/07 ; la décision actuelle autorise dix pages. Le relevé n’a aucun volume mensuel chiffré.
- Preuve source : `catalogue-vague-3-2026-09-20.md:25-44,50-59 ; releve JSON`.
- Changement transmis : Historique seulement ; ne pas réappliquer ses exclusions, ni convertir zéro suggestion en zéro demande, ni volumes inventés.

### P07
- Constat : Le CTA principal existe et pointe /contact ; la règle de confidentialité doit suivre le vrai traitement.
- Preuve source : `src/data/site.mjs:22-27 ; charte:135-137`.
- Changement transmis : CTA Confier une première tâche ; résultat utilisable avant le CTA ; aucune valeur de fichiers/questions/prompts dans l’analytics.

### P08
- Constat : Risques de fausse promesse distincts : vrai modèle 03, trame non officielle 04, structure FEC 05, pas score de fiabilité 07, auto-évaluation 08, hypothèses 09, pseudonymisation 10.
- Preuve source : `Mandat actuel + charte:48,69,124-126`.
- Changement transmis : Sections méthode/limites statiques, exemple fictif et entité claire ; source réglementaire primaire à vérifier avant copy finale.

### P09
- Constat : Le registre ne propose que Calculer et Vérifier.
- Preuve source : `src/data/outils.ts:5-8`.
- Changement transmis : Écrire / Explorer / Préparer / Se situer sont propositions à arbitrer en implementation ; pas changement du registre dans ce mandat.

### P10
- Constat : Cinq entrées outil actuelles dont témoin ; aucun des dix slugs proposés n’existe dans OUTILS.
- Preuve source : `src/data/outils.ts:38-166`.
- Changement transmis : Moteur 01/02/07 partagé ; dix routes utiles uniques ; résultats et filtres hors index, pas fan-out par prompt.

### P11
- Constat : Astro trailingSlash never ; sitemap filtre noindex et services non publiés ; lastmod vient du registre ou du frontmatter.
- Preuve source : `astro.config.mjs:48-75 ; src/data/site.mjs:30-38`.
- Changement transmis : Chaque feuille disponible canonical propre et lastmod réel ; registre SEO, sitemap et statut convergent ; noindex témoin conservé ; pas FAQ-rich-result promis.

### P12
- Constat : Le skill spécifique demande namespaces figés avant fan-out, et ne fait pas du score une preuve métier.
- Preuve source : `memlia-blog-strategie/SKILL.md:32,98-105`.
- Changement transmis : Conserver les briefs du parent ; cet addendum leur transmet les corrections. Une seule revue qualifiée downstream, pas nouvelle revue marketing.

### P13
- Constat : Les dix pages n’existent pas dans le registre actuel ; leur HTML, fonctionnalité, statut HTTP et CWV ne sont pas testables ici.
- Preuve source : `Registre source outils + absence des nouveaux slugs`.
- Changement transmis : Différer build/test navigateur/crawl/JSON-LD/maillage final sur le candidat exact ; ne pas écrire PASS aujourd’hui.

### P14
- Constat : Design historique propose des exemples CTA et vocabulaire devenus obsolètes ; le message v4 est prioritaire.
- Preuve source : `docs/design/2026-09-08-design-navattic-memlia.md:362-385 ; charte:85,121`.
- Changement transmis : Réutiliser tokens, filets, typographie, focus et reduced-motion ; jamais Réserver une démo ou module par recopie du design.

### P15
- Constat : Aucune performance de page future ; les dates et relevés de marché historiques ne constituent pas une baseline des outils.
- Preuve source : `Registre routes et corpus du lot`.
- Changement transmis : Prévoir baseline, données Search par URL et comparaisons après publication ; instrumentation sans données saisies.

### P16
- Constat : Inspection locale suffisante pour les constatations ; aucun appel DataForSEO ou Firecrawl n’a été fait.
- Preuve source : `Sources versionnées et relevé daté du coffre`.
- Changement transmis : SERP actuelle, PAA/AIO, volumes, backlinks live, Google API et crawl réseau = non mesurés ; remesure à demander si utile.

### P17
- Constat : Les dix livrables sont des pages outils et non des articles.
- Preuve source : `Mandat actuel`.
- Changement transmis : Pas de génération de BlogPosting, cadence, réécriture blog, distribution ou grand audit annexe.

### P18
- Constat : Site langue fr-FR et cible France.
- Preuve source : `src/data/site.mjs:12 ; charte:59`.
- Changement transmis : Pas hreflang/traduction/localisation culturelle en l’absence d’autre langue.

### P19
- Constat : Service et outils gratuits, sans pages villes ni comparatifs.
- Preuve source : `SEO-STRATEGY.md:51-53 ; mandat`.
- Changement transmis : Pas ecommerce, local/maps ou alternative X/Y.

### P20
- Constat : 06 est un générateur de consigne texte, non image/vidéo.
- Preuve source : `Mandat actuel`.
- Changement transmis : Pas d’image générée pour combler la matrice ; capture réelle future si utile.

### P21
- Constat : 08 et 09 peuvent montrer une sortie visuelle calculée, non des statistiques publiques.
- Preuve source : `Mandat actuel`.
- Changement transmis : Si graphique : labels, table accessible, unités et hypothèses, pas benchmark ou uplift inventé.

### P22
- Constat : Le registre SEO refuse tout type autre que blog/service/comparatif et interdit deux requêtes primaires normalisées identiques.
- Preuve source : `scripts/lib/seo-registres.mjs:68-88`.
- Changement transmis : Ajouter un type outil et ses témoins de validation dans la voie implementation ; ne pas masquer un outil en blog ni reprendre le primaire propriétaire d’un article.

### P23
- Constat : Le layout outil fixe connect-src none ; garanties et FAQ affirment aucune connexion sortante. Le hub promet aussi que toutes les valeurs restent dans le navigateur.
- Preuve source : `src/layouts/Outil.astro:22,65-70 ; OutilGaranties.astro:13-15 ; OutilFaq.astro:17-18 ; outils-comptables-gratuits.astro:9,45-48`.
- Changement transmis : 03 génératif : distinguer explicitement traitement distant et locaux, revoir CSP avec endpoint contrôlé, FAQ/garanties/texte du hub et consentement ; ne pas laisser des promesses réseau fausses dans les composants partagés.

### P24
- Constat : Le layout génère déjà WebPage/WebApplication/BreadcrumbList, observe surtout submit de formulaire synchrone et dit qu’une règle ne tient pas dans un calculateur.
- Preuve source : `src/layouts/Outil.astro:23-43,72-81,90-111`.
- Changement transmis : Conserver le schema véridique sans rating fictif ; 02 peut exiger CollectionPage/ItemList selon rendu ; remplacer les fins orientées calculateur quand inadaptées et émettre succès seulement après résultat asynchrone réel pour 03.

### P25
- Constat : Les routes actuelles sont cinq fichiers Astro explicites, pas un routeur dynamique [slug].
- Preuve source : `src/pages/outils-comptables-gratuits/*.astro ; calculateur-marge-commerciale.astro:1-7`.
- Changement transmis : Créer dix fichiers dédiés ou un routeur explicitement validé ; ajouter une entrée au registre ne génère pas à lui seul une page. Aucun test de route future n’est revendiqué.

## Addendum par outil pour les briefs du parent
Les briefs sont propriété du parent : ils ne sont pas modifiés ici. Ces sections sont les sorties de cadrage à intégrer, pas une prétention que le parent les a déjà intégrées. Routes et catégories proposées à réconcilier avant gel.

### Outil 01 — Générateur de prompt pour expert-comptable
- Intention : Fabriquer une consigne depuis la tâche abstraite, non choisir une liste ni produire une réponse comptable.
- Requête proposée : `prompt expert comptable` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/generateur-prompt-expert-comptable` ; catégorie proposée : Écrire.
- Persona : Responsable de pôle.
- Entrée → sortie : Description abstraite, entrée autorisée, sortie, validation, arrêt → prompt structuré local copiable.
- Plan minimal : Contexte ; But ; Entrées autorisées ; Sortie ; Frontière ; Arrêt ; Jeu fictif.
- Phrase frontière à adapter au rendu : « Le générateur assemble localement une consigne. Il ne répond pas avec un modèle. »
- Contrat implementation : 01/02/07 : même moteur de blocs, mêmes règles et mêmes versions, sorties et tâches distinctes.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 02 — Bibliothèque de prompts comptables
- Intention : Choisir un exemple filtré par tâche ; aucune copie du générateur en landing.
- Requête proposée : `bibliothèque prompts comptables` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/bibliotheque-prompts-comptables` ; catégorie proposée : Explorer.
- Persona : Collaborateur.
- Entrée → sortie : Filtre tâche/pôle/type de sortie → catalogue et exemples fictifs, ouverture préremplie dans 01.
- Plan minimal : Choisir une tâche ; Filtrer ; Lire un exemple ; Personnaliser dans 01.
- Phrase frontière à adapter au rendu : « Les exemples restent fictifs et s’adaptent à la règle du cabinet. »
- Contrat implementation : Les filtres ne créent pas des URL indexées ; catalogue concret distinct de 01.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 03 — Assistant IA comptable
- Intention : Obtenir une vraie réponse générée sur une situation fictive ; ne pas cibler logiciel IA comptabilité gratuit.
- Requête proposée : `assistant ia comptable gratuit` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/assistant-ia-comptable` ; catégorie proposée : Préparer.
- Persona : Collaborateur.
- Entrée → sortie : Question abstraite/fictive → réponse générative bornée, pas une écriture ou un conseil fiscal validé.
- Plan minimal : Poser une question fictive ; Voir la réponse ; Comprendre les limites et le traitement.
- Phrase frontière à adapter au rendu : « Une IA prépare une réponse sur un cas fictif ; le cabinet garde le jugement. »
- Contrat implementation : Afficher modèle et traitement réseau réels ; refus de donnée réelle, quota, timeout, erreur et non-persistance à tester.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 04 — Générateur de charte IA du cabinet
- Intention : Préparer une trame personnalisée, distincte de la charte officielle de l’Ordre.
- Requête proposée : `générateur charte ia cabinet comptable` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/generateur-charte-ia-cabinet` ; catégorie proposée : Écrire.
- Persona : Dirigeant.
- Entrée → sortie : Usages, responsables, validation et règles de données → document de travail non officiel.
- Plan minimal : Choisir les usages ; Définir les responsabilités ; Préparer la trame ; Relire.
- Phrase frontière à adapter au rendu : « Cette trame de travail n’est pas une charte officielle ni une preuve de conformité. »
- Contrat implementation : Lien contextualisé vers la source officielle à ouvrir et dater avant publication ; ne pas en copier le document.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 05 — Vérificateur FEC local
- Intention : Relever les anomalies de structure d’un fichier, sans certification de sa validité comptable/fiscale.
- Requête proposée : `vérificateur fec gratuit` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/verificateur-fec-local` ; catégorie proposée : Vérifier.
- Persona : Référent outils et sécurité.
- Entrée → sortie : FEC local → lignes/colonnes en anomalie, règles exécutées, règles hors périmètre.
- Plan minimal : Charger localement ; Lire les anomalies ; Comprendre les contrôles et exclusions.
- Phrase frontière à adapter au rendu : « Le contrôle est structurel et local. Il ne certifie pas le FEC. »
- Contrat implementation : Documenter version/specification contrôlée ; lien Test Compta Demat, limites et arrêts ; revue code ou métier appropriée.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 06 — Générateur de prompt IA professionnel
- Intention : Créer une consigne de travail professionnel générique ; exclure intention image/vidéo.
- Requête proposée : `générateur prompt ia gratuit` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/generateur-prompt-ia-gratuit` ; catégorie proposée : Écrire.
- Persona : Professionnel hors cabinet.
- Entrée → sortie : Tâche professionnelle abstraite → prompt texte structuré local.
- Plan minimal : Décrire la tâche ; Choisir la sortie ; Générer une consigne texte ; Relire.
- Phrase frontière à adapter au rendu : « Cet outil prépare une consigne texte pour le travail professionnel, pas une image ou une vidéo. »
- Contrat implementation : Pont vers Memlia seulement pour la tâche répétitive dans les outils ; ne pas transformer le hero Memlia en produit généraliste.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 07 — Vérificateur de prompt IA
- Intention : Détecter des blocs absents et contraintes incohérentes ; jamais mesurer fiabilité de réponse.
- Requête proposée : `vérificateur prompt ia` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/verificateur-prompt-ia` ; catégorie proposée : Vérifier.
- Persona : Responsable de pôle.
- Entrée → sortie : Prompt abstrait → constat structurel, blocs manquants et proposition de correction.
- Plan minimal : Coller une consigne abstraite ; Lire les blocs détectés ; Corriger dans 01 ou 06.
- Phrase frontière à adapter au rendu : « La vérification porte sur la structure de la consigne, pas sur la fiabilité d’une réponse IA. »
- Contrat implementation : Réutiliser schema/moteur 01 ; absence détectée expliquée, pas un score de qualité universel.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 08 — Diagnostic de maturité IA du cabinet
- Intention : Auto-évaluer les pratiques et choisir une prochaine action, pas un audit normatif.
- Requête proposée : `diagnostic maturité ia cabinet comptable` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet` ; catégorie proposée : Se situer.
- Persona : Dirigeant.
- Entrée → sortie : Réponses déclaratives → synthèse par dimensions et priorités justifiées.
- Plan minimal : Répondre ; Lire la synthèse ; Choisir une prochaine tâche ; Voir la méthode.
- Phrase frontière à adapter au rendu : « Cette auto-évaluation repose sur vos réponses ; ce n’est pas un audit normatif. »
- Contrat implementation : Rubrique non répondue = inconnue, jamais zéro ; pas de classement nominatif ni norme inventée.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 09 — Calculateur ROI d’automatisation
- Intention : Simuler selon ses hypothèses, sans promettre un gain commercial Memlia.
- Requête proposée : `calculateur roi automatisation comptable` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/calculateur-roi-automatisation` ; catégorie proposée : Calculer.
- Persona : Dirigeant.
- Entrée → sortie : Volumes/temps/coûts/adoption/maintenance → scénarios explicités et trace de formule.
- Plan minimal : Déclarer les hypothèses ; Comparer des scénarios ; Lire les formules et limites.
- Phrase frontière à adapter au rendu : « Le résultat dépend de vos hypothèses et ne promet aucun gain de Memlia. »
- Contrat implementation : Séparer économie de temps, capacité libérée et cash ; inclure coût récurrent et adoption ; valeurs hypothétiques uniquement.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

### Outil 10 — Préparation et pseudonymisation CSV/FEC
- Intention : Préparer une copie pseudonymisée pour minimiser les données, pas anonymiser universellement.
- Requête proposée : `pseudonymiser fichier comptable avant ia` ; hypothèse, pas mesure de volume.
- Route proposée : `/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec` ; catégorie proposée : Préparer.
- Persona : Référent outils et sécurité.
- Entrée → sortie : CSV/FEC local et choix explicites → aperçu/copie transformée, exclusions et risque résiduel.
- Plan minimal : Choisir un fichier local ; Sélectionner les colonnes ; Vérifier l’aperçu ; Exporter la copie.
- Phrase frontière à adapter au rendu : « Une copie pseudonymisée peut rester identifiable. Cet outil ne garantit pas une anonymisation universelle. »
- Contrat implementation : Ne jamais écraser original ; neutraliser formule CSV ; mapping non envoyé, champs libres/données indirectes restent à examiner.
- Liens : hub réciproque ; /methode ou service déclaré selon geste ; /contact unique. Ressource exacte et troisième entrée à prouver au candidat, non un article général ajouté pour compter.
- Acceptation à rejouer : résultat fonctionnel, cas nominal/limite/refus fictifs, traitement réseau/stockage exact, page utilisable clavier/mobile, contenu statique, canonical/JSON-LD/sitemap, liens entrants qualifiés. Aucun de ces tests futurs n’a été exécuté.

## Trace anti-cannibalisation spécifique
- 01 ↔ 02 : fabriquer une nouvelle consigne vs sélectionner un exemple ; le corpus de 02 ne devient pas dix copies du formulaire 01.
- 01 ↔ 07 : générer vs vérifier une consigne déjà écrite ; analyse structurelle commune, pas même page avec nouveau titre.
- 01 ↔ 06 : cabinet comptable avec frontière métier vs travail professionnel générique texte ; ne pas viser image/vidéo.
- 03 ↔ article logiciel IA : réponse fictive générative ponctuelle vs sélection/explication de logiciels complets ; le produit Memlia reste service.
- 05 ↔ 10 : contrôle structurel sans transformer vs transformation d’une copie avec minimisation/pseudonymisation ; ne pas utiliser le mot conformité/anonymat comme bénéfice.
- 08 ↔ 09 : situer les pratiques déclarées vs simuler des hypothèses économiques ; aucun score scientifique ni gain mesuré.
- Analyse locale qualitative, sans embeddings, extraction n-grams pondérée ou intersection SERP live ; conflits de rankings réels non mesurés.

## Sources intégralement lues et empreintes
| Source | Octets | SHA-256 |
|---|---:|---|
| `scripts/lib/seo-registres.mjs` | 13435 | `b8dc44b98df11b169cf2389939a43904e13311545d970d6e4aae616e839f596e` |
| `src/layouts/Outil.astro` | 5743 | `fdc4933b3012476d5302a3841df9004c9c4e32cb51832012ecad454e7e2c5bb4` |
| `src/pages/outils-comptables-gratuits.astro` | 4773 | `19cdbb6e0de7956df84a38120320ecd27dc806cb032993928e8bf7f75ac07b5f` |
| `src/pages/outils-comptables-gratuits/calculateur-marge-commerciale.astro` | 275 | `2bda9743f42da90cdf88501419b640bb5f3e5d3d7b98a3d949cef48560b3b40e` |
| `src/components/sections/OutilGaranties.astro` | 3267 | `ad5615b5038ec0662da313657c9e3866d450536fca224f6a4f174ff8debd0f5d` |
| `src/components/sections/OutilFaq.astro` | 3069 | `c7757955ba443ce4918e6c35e4451f77659f537abf2db7d9de349dddfb778ee4` |
| `src/components/sections/OutilZone.astro` | 4225 | `9925e8cc1c8e9f4dd8039896cc11d892b8906d3a648330640474e2bb4815ea6a` |
| `.agents/product-marketing.md` | 22050 | `5f890e5c9c5fad479ca4f6ec7606c83719c7d11312928f78d7dc10414b4671c7` |
| `src/data/outils.ts` | 9915 | `f8b8cf6c2f71b055200ddf6756eeedde0b6fe8320d679b4082bee7431314f5cd` |
| `src/data/site.mjs` | 1875 | `80f0eb5a2dd0b61421ad81de983d231430ce2e86adf7c43368dc4fa33e36a9b1` |
| `src/data/pages-v2.mjs` | 4631 | `a2f8a9ee590feb928272908c867e9cf340bfb7685eadcb93922b5468174ff4e2` |
| `src/data/pages-lastmod.json` | 5034 | `8b68eb30c5712cd6496683747d84ffee721677b9de79cae37c89057e3d799c9b` |
| `src/data/schema.mjs` | 3517 | `30838cf22e56f4574755697d9930768ed68d9dff79ba7cd6f9112d91f91a2fe6` |
| `src/data/page-eeat.ts` | 5439 | `ee0a4cfdcd10c35244b8f650c6eccf3f3ba2ee55da837ea6d742f8a44c32f891` |
| `astro.config.mjs` | 3721 | `7ace07472db2eb1df18e7c884550e5de6962b2c9efccc3c7ae73441fe59da322` |
| `docs/strategy/site-v3/OUTILS-CONTRAT-DE-LIENS.md` | 1596 | `b6e839690d56d80789437c03612cc1fa5dfc688ad93e55d4a11d15a64bed6586` |
| `docs/strategy/site-v3/SEO-STRATEGY.md` | 27735 | `4c84b066abdc55cd519eb7b22a7d2815ad8654bb9d527a0099f5914581cebcef` |
| `docs/strategy/site-v3/mesures/registre-requetes.json` | 10112 | `1ab12a28dd978d88aebfe4d3b8fbe405e5f2f9edceaf5d3db3351ee5fbc73081` |
| `docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md` | 60190 | `9df2f34d65b04c0961bb2a76b4c0a6d5fd155ec7299448e4f481558458878fa2` |
| `docs/strategy/site-v3/CONTENT-CALENDAR.md` | 72064 | `76e6b4ba56bf31e047fb5a455022f79e4dcdca14c28060d31f97e92a8f1797ee` |
| `docs/strategy/site-v3/backlog-v3.json` | 282770 | `7a8dc5d9dd41ac55d2a7983445ba2c90d4f55565861e5798a1efaa1bed25bfc9` |
| `docs/design/2026-09-08-design-navattic-memlia.md` | 78483 | `01ecabb847d152aa72fcdd893cb38c13725ad2a34747360d66167451cf89c340` |
| `package.json` | 5321 | `c52eb3bafc5cabee897f99907903c9c327d82470949d2e6266158dfecb26647f` |
| `/Users/kevinkitanga/memlia-vault/_inbox/propositions/outils-gratuits-catalogue-vague-3-2026-09-20.md` | 11644 | `0c63350abf3023893a78f1b154856a4df609caf0b0bf263c7fa8079a5625ade6` |
| `/Users/kevinkitanga/memlia-vault/10-memlia/chantiers/acces/sorties/outils-vague-3-releve-2026-09-20.json` | 8710 | `8cad9fcca4173cab0855fc9c2450de86a1e356bb70f9b8fc57b40c6cd58bd04b` |

## Limites / non exécuté
- Lecture intégrale réalisée programmatiquement (read_bytes, UTF-8, SHA-256) ; corpus complet conservé dans ce JSON. Ce n’est pas une déclaration de lecture humaine manuelle ligne par ligne.
- Exécuté cadrage = seulement la partie documentable au cadrage ; les commandes d’audit complet, contrôles HTML/CWV/HTTP et tests fonctionnels sont différés.
- Aucune actualisation SERP/volume/API, aucune vérification réglementaire finale ; données du 20/09 explicitement historiques.
- Les chemins de dix routes sont des propositions locales à réconcilier avec le contrat final des briefs du parent.
- Aucun fichier parent brief, aucun code du site ou skill modifié ; aucun commit.
- Deux tentatives initiales (python -c et execute_code) ont été refusées par le mode unattended ; aucun changement de configuration. Repli autorisé : scripts écrits dans le scratch puis exécutés avec python3.
- Recherche SKILL.md initiale ne traversait pas les liens ; inventaire final résout chaque chemin exact depuis le catalogue canonique et conserve son realpath.
- Le chemin supposé src/pages/outils-comptables-gratuits/[slug].astro était absent ; aucune conclusion sur routing n’a été tirée de ce seul chemin. Le registre et les autres pages sources sont la base des constats.

## Vérification réelle et incidents
- Inventaire physique réconcilié : 57 définitions exposées + 7 extensions installées hors catalogue (blog-audio, blog-notebooklm, seo-ahrefs, seo-bing, seo-profound, seo-seranking, seo-unlighthouse). Toutes intégralement chargées et classées ; leur présence sur disque ne garantit pas leurs API disponibles.
- Validation des artefacts : couverture exhaustive, unicité skill/outil, dix routes distinctes, identité SHA-256 du contenu embarqué avec SKILL.md ; liens de preuves résolus.
- Tentative réelle : node --test tests/scripts/seo-registres.test.mjs. ÉCHEC avant exécution des tests : ERR_MODULE_NOT_FOUND pour parse5 importé par blog-pipeline.mjs ; worktree sans dépendances installées. Aucun PASS. Repli : inspection directe du validateur (lignes 68-88) et contrôles documentaires exécutés en Python stdlib. Pas d’installation de dépendances ni changement code dans cette mission de cadrage.
