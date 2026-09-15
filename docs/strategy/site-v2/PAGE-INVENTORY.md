# Inventaire canonique des pages

15/09/2026. Généré par build-inventory.py ; page-inventory.json est la matrice machine. Tous les volumes/KD sont ND. Les routes P2 et appartenant à Ressources ne sont pas des liens à rendre avant leur publication. Les titres/descriptions constituent le point de départ de la copy, à spécialiser sans promesse supplémentaire.

| URL | Page | Parent | Navigation | Priorité |
|---|---|---|---|---|
| / | Accueil | — | logo + footer | P0 — adapter |
| /automatisation-cabinet-comptable | Automatisation sur mesure | / | header Automatisation | P0 — créer |
| /methode | Méthode | / | header Méthode | P0 — créer |
| /garanties | Garanties et limites | / | header Garanties | P0 — créer |
| /a-propos | À propos | / | footer Memlia + bylines | P0 — créer |
| /contact | Contact | / | header CTA | P0 — créer |
| /blog | Blog | / | header Blog | P0 — adapter |
| /blog/controler-les-bulletins-de-paie-avant-la-dsn | Contrôler les bulletins avant DSN | /blog | contextuel | P0 — préserver et mailler |
| /blog/suivre-la-production-sociale-dans-excel | Suivre la production sociale | /blog | contextuel | P0 — préserver et mailler |
| /ressources | Ressources | / | header Ressources | EXISTANT — autre chaîne |
| /glossaire | Glossaire | / | Ressources + footer | EXISTANT — autre chaîne |
| /mentions-legales | Mentions légales | / | footer légal | P0 — préserver |
| /politique-de-confidentialite | Confidentialité | / | footer légal | P0 — préserver |
| /blog/comprendre-les-comptes-rendus-metier-dsn | Comprendre les comptes rendus métier DSN | /blog | contextuel | P2 — ensuite conditionnel |

## /

- **name** : Accueil
- **persona** : Dirigeant / expert-comptable
- **jtbd** : Savoir si Memlia répond au travail répétitif du cabinet
- **intent** : Commerciale catégorie — historique coffre
- **primary_keyword** : automatisation cabinet comptable
- **secondary_keywords** : IA cabinet expertise comptable
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte
- **mission** : Automatiser le répétitif, garder la décision
- **proof** : Illustrations fictives proofs.ts ; pas ROI client
- **cta** : Identifier une tâche à automatiser → /contact
- **schema** : Organization; WebSite; Service; FAQPage
- **parent** : —
- **incoming** : — racine
- **outgoing** : /automatisation-cabinet-comptable; /methode; /garanties; /ressources; /blog; /a-propos; /contact; /mentions-legales; /politique-de-confidentialite
- **priority** : P0 — adapter
- **quality** : Service/cible compris au premier écran ; pas copie du détail service
- **nav** : logo + footer
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Automatisation IA pour cabinets comptables | Memlia
- **description** : Automatiser le répétitif, garder la décision. Savoir si Memlia répond au travail répétitif du cabinet. Découvrez la méthode et les limites du service Memlia.

## /automatisation-cabinet-comptable

- **name** : Automatisation sur mesure
- **persona** : Dirigeant + référent outils
- **jtbd** : Définir une tâche et savoir quel livrable acheter
- **intent** : Commerciale service — déduction business + coffre
- **primary_keyword** : service automatisation sur mesure cabinet comptable
- **secondary_keywords** : automatiser tâches répétitives cabinet; automatisation Excel cabinet
- **volume** : ND
- **difficulty** : ND
- **funnel** : Évaluation
- **mission** : Votre tâche, vos règles, un résultat à vérifier
- **proof** : Règles/limites et illustrations fictives ; compatibilité à qualifier
- **cta** : Identifier une tâche à automatiser → /contact
- **schema** : Service; WebPage; BreadcrumbList
- **parent** : /
- **incoming** : /; /methode; /contact; /blog; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel; /ressources
- **outgoing** : /methode; /garanties; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel; /contact
- **priority** : P0 — créer
- **quality** : Livrables, exclusions, outils et critères de devis concrets ; aucune fonction non livrée
- **nav** : header Automatisation
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Automatisation sur mesure | Memlia
- **description** : Votre tâche, vos règles, un résultat à vérifier. Définir une tâche et savoir quel livrable acheter. Découvrez la méthode et les limites du service Memlia.

## /methode

- **name** : Méthode
- **persona** : Dirigeant / responsable social
- **jtbd** : Comprendre la mission et sa recette
- **intent** : Information commerciale — objection business
- **primary_keyword** : méthode automatisation Memlia
- **secondary_keywords** : cadrage automatisation cabinet; recette automatisation
- **volume** : ND
- **difficulty** : ND
- **funnel** : Évaluation
- **mission** : Observer, cadrer, éprouver, faire valider
- **proof** : proofs.ts 04–07, cas fictifs et refus attendus
- **cta** : Décrire votre tâche → /contact
- **schema** : WebPage; BreadcrumbList
- **parent** : /
- **incoming** : /; /automatisation-cabinet-comptable; /garanties; /a-propos; /contact; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/comprendre-les-comptes-rendus-metier-dsn
- **outgoing** : /automatisation-cabinet-comptable; /garanties; /a-propos; /contact
- **priority** : P0 — créer
- **quality** : Chaque étape nomme entrée, sortie, décision ; exemple de refus, maintenance bornée
- **nav** : header Méthode
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Méthode | Memlia
- **description** : Observer, cadrer, éprouver, faire valider. Comprendre la mission et sa recette. Découvrez la méthode et les limites du service Memlia.

## /garanties

- **name** : Garanties et limites
- **persona** : Référent outils + dirigeant
- **jtbd** : Évaluer confidentialité, contrôle et conditions de confiance
- **intent** : Réassurance — objection business
- **primary_keyword** : garanties automatisation Memlia
- **secondary_keywords** : validation humaine IA cabinet; confidentialité automatisation cabinet
- **volume** : ND
- **difficulty** : ND
- **funnel** : Décision
- **mission** : La proposition ne prend pas la décision
- **proof** : Principe fail-closed et vue agrégée fictive ; pas attestation RGPD
- **cta** : Parlons de vos contraintes → /contact
- **schema** : WebPage; BreadcrumbList
- **parent** : /
- **incoming** : /; /automatisation-cabinet-comptable; /methode; /contact; /blog/suivre-la-production-sociale-dans-excel; /politique-de-confidentialite
- **outgoing** : /methode; /politique-de-confidentialite; /contact
- **priority** : P0 — créer
- **quality** : Distinguer engagement de méthode, dispositif vérifié et contrat ; aucun hébergement présumé
- **nav** : header Garanties
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Garanties et limites | Memlia
- **description** : La proposition ne prend pas la décision. Évaluer confidentialité, contrôle et conditions de confiance. Découvrez la méthode et les limites du service Memlia.

## /a-propos

- **name** : À propos
- **persona** : Dirigeant / lecteur des guides
- **jtbd** : Identifier le responsable et son rôle réel
- **intent** : Navigationnelle marque — pas page à volume
- **primary_keyword** : Kevin Kitanga Memlia
- **secondary_keywords** : fondateur Memlia
- **volume** : ND
- **difficulty** : ND
- **funnel** : Confiance
- **mission** : Une responsabilité identifiée, un périmètre assumé
- **proof** : Auteur public des deux articles ; identité légale actuelle, pas diplôme supposé
- **cta** : Parler de votre cabinet → /contact
- **schema** : AboutPage; Person; BreadcrumbList
- **parent** : /
- **incoming** : /; /methode; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel; /mentions-legales; /blog/comprendre-les-comptes-rendus-metier-dsn
- **outgoing** : /methode; /blog; /contact; /mentions-legales
- **priority** : P0 — créer
- **quality** : Kevin Kitanga cohérent byline/RSS/schema ; lieu activité distinct du siège
- **nav** : footer Memlia + bylines
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : À propos | Memlia
- **description** : Une responsabilité identifiée, un périmètre assumé. Identifier le responsable et son rôle réel. Découvrez la méthode et les limites du service Memlia.

## /contact

- **name** : Contact
- **persona** : Acheteur / responsable social
- **jtbd** : Comprendre le prochain échange et choisir le canal
- **intent** : Transactionnelle marque
- **primary_keyword** : contact Memlia
- **secondary_keywords** : automatisation cabinet devis
- **volume** : ND
- **difficulty** : ND
- **funnel** : Décision
- **mission** : Commençons par décrire une tâche, sans données client
- **proof** : Deux destinations Cal.com déjà dans site.mjs + email public
- **cta** : Réserver un échange → Cal.com existant ; Écrire à Memlia → mailto existant
- **schema** : ContactPage; BreadcrumbList
- **parent** : /
- **incoming** : /; /automatisation-cabinet-comptable; /methode; /garanties; /a-propos; /blog; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel; /ressources; /mentions-legales; /politique-de-confidentialite; /blog/comprendre-les-comptes-rendus-metier-dsn
- **outgoing** : /automatisation-cabinet-comptable; /methode; /garanties; /politique-de-confidentialite
- **priority** : P0 — créer
- **quality** : Aucun formulaire/upload ; expliquer fichiers exclus et prochain pas, liens utilisables sans JS
- **nav** : header CTA
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Contact | Memlia
- **description** : Commençons par décrire une tâche, sans données client. Comprendre le prochain échange et choisir le canal. Découvrez la méthode et les limites du service Memlia.

## /blog

- **name** : Blog
- **persona** : Responsable social / dirigeant
- **jtbd** : Apprendre à préparer et vérifier avant automatisation
- **intent** : Informationnelle hub éditorial
- **primary_keyword** : méthodes automatisation cabinet
- **secondary_keywords** : contrôle paie; suivi production sociale
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte
- **mission** : Des méthodes pour automatiser sans déléguer son jugement
- **proof** : Deux articles datés, sourcés et signés Kevin Kitanga
- **cta** : Identifier une tâche à automatiser → /contact
- **schema** : CollectionPage; BreadcrumbList
- **parent** : /
- **incoming** : /; /a-propos; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel; /ressources; /glossaire; /blog/comprendre-les-comptes-rendus-metier-dsn
- **outgoing** : /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel; /blog/comprendre-les-comptes-rendus-metier-dsn; /ressources; /automatisation-cabinet-comptable; /contact
- **priority** : P0 — adapter
- **quality** : Chapeau précis GLOBAL-MESSAGING ; pas hub de téléchargements ; pas taxonomie vide
- **nav** : header Blog
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Blog | Memlia
- **description** : Des méthodes pour automatiser sans déléguer son jugement. Apprendre à préparer et vérifier avant automatisation. Découvrez la méthode et les limites du service Memlia.

## /blog/controler-les-bulletins-de-paie-avant-la-dsn

- **name** : Contrôler les bulletins avant DSN
- **persona** : Responsable production sociale
- **jtbd** : Structurer la revue avant la transmission
- **intent** : Informationnelle métier — coffre et contenu existant
- **primary_keyword** : contrôle bulletin de paie avant DSN
- **secondary_keywords** : contrôle cohérence paie; checklist contrôle paie
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte / évaluation
- **mission** : L’outil prépare les écarts, le cabinet vérifie
- **proof** : Article existant et sources ; attestation métier non établie
- **cta** : Cadrer un contrôle répétitif → /contact
- **schema** : BlogPosting; BreadcrumbList
- **parent** : /blog
- **incoming** : /automatisation-cabinet-comptable; /blog; /blog/suivre-la-production-sociale-dans-excel; /glossaire; /blog/comprendre-les-comptes-rendus-metier-dsn
- **outgoing** : /blog; /blog/suivre-la-production-sociale-dans-excel; /methode; /automatisation-cabinet-comptable; /contact; /a-propos
- **priority** : P0 — préserver et mailler
- **quality** : URL et texte fact-checké préservés ; distinguer bulletin/DSN ; aucun label conformité
- **nav** : contextuel
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Contrôler les bulletins avant DSN | Memlia
- **description** : L’outil prépare les écarts, le cabinet vérifie. Structurer la revue avant la transmission. Découvrez la méthode et les limites du service Memlia.

## /blog/suivre-la-production-sociale-dans-excel

- **name** : Suivre la production sociale
- **persona** : Responsable social / dirigeant
- **jtbd** : Suivre étapes et exceptions du portefeuille
- **intent** : Méthode/objet — historique coffre
- **primary_keyword** : suivi de production sociale cabinet comptable
- **secondary_keywords** : suivi dossiers paie Excel; tableau de bord pôle social
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte / évaluation
- **mission** : Piloter les dossiers, pas surveiller les personnes
- **proof** : Article existant, modèle conceptuel agrégé ; aucun fichier à promettre
- **cta** : Cadrer votre suivi → /contact
- **schema** : BlogPosting; BreadcrumbList
- **parent** : /blog
- **incoming** : /automatisation-cabinet-comptable; /blog; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /glossaire
- **outgoing** : /blog; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /automatisation-cabinet-comptable; /garanties; /contact; /a-propos
- **priority** : P0 — préserver et mailler
- **quality** : Aucun classement individuel ; URL conservée ; étapes plutôt qu’activité salariés
- **nav** : contextuel
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Suivre la production sociale | Memlia
- **description** : Piloter les dossiers, pas surveiller les personnes. Suivre étapes et exceptions du portefeuille. Découvrez la méthode et les limites du service Memlia.

## /ressources

- **name** : Ressources
- **persona** : Lecteur cherchant un format utile
- **jtbd** : Trouver une aide par tâche puis format
- **intent** : Informationnelle orientation — chaîne existante
- **primary_keyword** : ressources automatisation cabinet
- **secondary_keywords** : guides cabinet; modèles cabinet
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte
- **mission** : Choisir une ressource pour comprendre, vérifier ou préparer
- **proof** : Candidat et preuve détenus par la chaîne Ressources ; live 404 au relevé
- **cta** : Choisir une ressource ; cadrer une tâche → /contact
- **schema** : CollectionPage; BreadcrumbList
- **parent** : /
- **incoming** : /; /blog; /glossaire
- **outgoing** : /blog; /glossaire; /automatisation-cabinet-comptable; /contact
- **priority** : EXISTANT — autre chaîne
- **quality** : Ne publier aucun lien vers objet absent ; respecter identité et contrats du candidat Ressources
- **nav** : header Ressources
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Ressources | Memlia
- **description** : Choisir une ressource pour comprendre, vérifier ou préparer. Trouver une aide par tâche puis format. Découvrez la méthode et les limites du service Memlia.

## /glossaire

- **name** : Glossaire
- **persona** : Lecteur des guides
- **jtbd** : Comprendre un terme sans quitter le parcours
- **intent** : Informationnelle définitions — chaîne existante
- **primary_keyword** : glossaire automatisation cabinet
- **secondary_keywords** : définitions paie DSN
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte
- **mission** : Des définitions pour mieux vérifier les propositions
- **proof** : Contenus et slugs enfants détenus par chaîne Ressources, non inventés ici
- **cta** : Lire la méthode correspondante
- **schema** : CollectionPage; BreadcrumbList
- **parent** : /
- **incoming** : /ressources
- **outgoing** : /ressources; /blog; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /blog/suivre-la-production-sociale-dans-excel
- **priority** : EXISTANT — autre chaîne
- **quality** : Pas de doublon de termes ni de pages maigres nouvelles ; importer routes réelles après release
- **nav** : Ressources + footer
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Glossaire | Memlia
- **description** : Des définitions pour mieux vérifier les propositions. Comprendre un terme sans quitter le parcours. Découvrez la méthode et les limites du service Memlia.

## /mentions-legales

- **name** : Mentions légales
- **persona** : Tout visiteur
- **jtbd** : Identifier l’éditeur
- **intent** : Légale, hors cible SEO
- **primary_keyword** : N/A légal
- **secondary_keywords** : N/A
- **volume** : ND
- **difficulty** : ND
- **funnel** : Confiance
- **mission** : Responsabilité éditoriale explicite
- **proof** : Page légale courante ; aucune donnée juridique recalculée
- **cta** : Contacter Memlia → /contact
- **schema** : WebPage
- **parent** : /
- **incoming** : /; /a-propos; /politique-de-confidentialite
- **outgoing** : /a-propos; /contact; /politique-de-confidentialite
- **priority** : P0 — préserver
- **quality** : noindex/follow ; pas téléphone ni TVA non confirmée ; siège sourcé
- **nav** : footer légal
- **indexability** : noindex, follow
- **title** : Mentions légales | Memlia
- **description** : Responsabilité éditoriale explicite. Identifier l’éditeur. Découvrez la méthode et les limites du service Memlia.

## /politique-de-confidentialite

- **name** : Confidentialité
- **persona** : Tout visiteur
- **jtbd** : Comprendre les traitements liés au site
- **intent** : Légale, hors cible SEO
- **primary_keyword** : N/A confidentialité
- **secondary_keywords** : N/A
- **volume** : ND
- **difficulty** : ND
- **funnel** : Confiance
- **mission** : Ne collecter que ce qui est utile
- **proof** : Politique actuelle ; aligner sur absence de formulaire et outils réellement utilisés
- **cta** : Contacter Memlia → /contact
- **schema** : WebPage
- **parent** : /
- **incoming** : /; /garanties; /contact; /mentions-legales
- **outgoing** : /garanties; /contact; /mentions-legales
- **priority** : P0 — préserver
- **quality** : noindex/follow ; pas promesse hébergement/consentement non vérifiée
- **nav** : footer légal
- **indexability** : noindex, follow
- **title** : Confidentialité | Memlia
- **description** : Ne collecter que ce qui est utile. Comprendre les traitements liés au site. Découvrez la méthode et les limites du service Memlia.

## /blog/comprendre-les-comptes-rendus-metier-dsn

- **name** : Comprendre les comptes rendus métier DSN
- **persona** : Gestionnaire / responsable social
- **jtbd** : Interpréter un retour sans le confondre avec une validation globale
- **intent** : Informationnelle — recherche historique, à rafraîchir
- **primary_keyword** : compte rendu métier DSN
- **secondary_keywords** : lire retour DSN; anomalie CRM DSN
- **volume** : ND
- **difficulty** : ND
- **funnel** : Découverte
- **mission** : Comprendre le retour avant de décider de la suite
- **proof** : Sources institutionnelles à reconsulter ; aucun brouillon ni preuve métier actuelle
- **cta** : Lire les contrôles avant DSN ; cadrer une tâche → /contact
- **schema** : BlogPosting; BreadcrumbList
- **parent** : /blog
- **incoming** : /blog
- **outgoing** : /blog; /blog/controler-les-bulletins-de-paie-avant-la-dsn; /methode; /contact; /a-propos
- **priority** : P2 — ensuite conditionnel
- **quality** : Avant création : zéro doublon Ressources, sources officielles fraîches, exemple fictif et limites
- **nav** : contextuel
- **indexability** : index, follow uniquement une fois publiée et acceptée
- **title** : Comprendre les comptes rendus métier DSN | Memlia
- **description** : Comprendre le retour avant de décider de la suite. Interpréter un retour sans le confondre avec une validation globale. Découvrez la méthode et les limites du service Memlia.
