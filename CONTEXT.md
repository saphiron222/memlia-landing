# memlia.fr

Le site public de Memlia présente quatre services : robots, agents IA, Memlia OS et modèle IA privé.
Les robots et agents prennent en charge les tâches répétitives des cabinets d’expertise comptable
et de commissariat aux comptes ; Memlia OS organise leur mémoire collective. Le modèle IA privé
répond aux besoins d’adaptation et d’entraînement des entreprises.

Décision commerciale du 15/10/2026 : partir des robots et agents IA Memlia du catalogue,
les adapter et les déployer dans les outils du cabinet, puis les maintenir. Construire sur mesure
lorsque le besoin dépasse le catalogue. La règle écrite décrit leur fonctionnement dans le cabinet ;
elle reste le mécanisme de contrôle. Cette décision reste applicable au catalogue.

Doctrine active du 16/10/2026 : quatre services distincts, avec 21 robots et 12 agents IA
préconçus, adaptation puis sur mesure au besoin, mémoire collective et entraînement privé.
Les intégrations relient les quatre services aux outils existants ; elles ne sont pas une cinquième offre.
La charte `.agents/product-marketing.md` v11 fait foi sur le message, selon le
[cadrage quatre services](docs/strategy/offre-quatre-services-2026-10-16/CADRAGE.md).
Les prix validés dans `docs/strategy/pricing-2026-10-15/` restent inchangés.

Kevin a autorisé la mise à jour des accueils puis la publication du site par fusion après CI du SHA
exact et revue indépendante, suivie d’un contrôle en production. Cette autorisation remplace la
restriction initiale de publication rappelée dans l’historique ci-dessous ; elle ne déclenche aucune
collecte de données, installation ou prestation d’entraînement réelle.

## Langage

### L'offre

**Robot** :
Une routine précise du catalogue, avec un déclencheur, des tâches et un résultat identifié.
Nous l’adaptons aux accès, dossiers, formats et validations du cabinet avant sa mise en service.

**Déploiement** :
La mise en service du service retenu dans le périmètre accepté, après adaptation lorsqu’elle est nécessaire.
Les essais, la recette et la maintenance sont définis avec le cabinet. Un catalogue ne prouve
aucune installation chez un client ni une compatibilité sans configuration.

**Sur mesure** :
Une construction ou extension nécessaire lorsque le catalogue ne couvre pas le besoin du cabinet.

**Tâche** :
Un geste répétitif d'un cabinet, assez stable pour que sa règle s'écrive (relancer une pièce,
contrôler un bulletin avant la DSN).
_Avoid_ : process, cas d'usage, fonctionnalité

**Règle écrite** :
Ce qui distingue une tâche confiée à Memlia : la frontière en trois colonnes, la proposition puis la
validation, l'arrêt dans le doute, le jeu d'essai fictif.
_Avoid_ : méthode Memlia (quand on parle du mécanisme), algorithme

**Rejeu** :
La règle écrite d'une tâche, jouée sur un dossier fictif, avec ses cas préparés, à valider et
arrêtés. On ne le montre que là où la règle est publiée.
_Avoid_ : démo, simulation, test

**Agent IA** :
La règle écrite des tâches d'un même métier du cabinet, mise en œuvre dans ses outils. Il prépare,
il s'arrête dans le doute, le collaborateur valide ; il porte un prénom et n'envoie rien.
_Avoid_ : spécialiste IA, assistant IA, collaborateur IA, employé IA, agent autonome, agent IA CAC

**Memlia OS** :
La mémoire collective du cabinet, reliée aux personnes, documents, outils et agents, avec sources
et accès définis. La recherche dans les documents (RAG) ne constitue pas un entraînement du modèle.

**Modèle IA privé** :
La préparation et la qualification de données autorisées, un budget d’essai, l’adaptation ou
l’entraînement, l’évaluation et la publication d’une version acceptée. Les droits dépendent de la
licence de base et du contrat ; ce service est distinct de la mémoire documentaire.

**Métier** :
Un ensemble de tâches du cabinet confié à un même agent IA (comptabilité, paie et social, juridique
et fiscal, missions d'audit…).
_Avoid_ : rôle, poste, département

### La taxonomie

**Pôle** :
Un regroupement de familles qui organise le blog et les contenus ; un métier peut en réunir
plusieurs.
_Avoid_ : cluster (hors du schéma du blog), métier

**Famille** :
Un groupe de tâches qui se répètent, se décrivent par une règle et s'automatisent de la même
manière ; active quand une tâche y est documentée.
_Avoid_ : catégorie, thème

**Titulaire** :
Celui qui porte une famille sur le site (pour le maillage) : un agent IA, le hub des agents, ou le bloc « Derrière
chaque agent, nous ». Chaque famille en a un seul.
_Avoid_ : propriétaire, responsable

### Les outils du cabinet

**Connecteur** :
Un lien avec un outil existant du cabinet, transversal aux quatre services. La page de compatibilité
présente les outils par domaine ; accès, configuration et périmètre sont définis au cadrage.
_Avoid_ : partenaire, intégration certifiée, plateforme

**Recette** :
La vérification, par les équipes du cabinet qui feront le travail, que le service livré répond
aux critères convenus dans le périmètre accepté, sur leurs propres cas.
_Avoid_ : validation (réservée à la décision du collaborateur sur une proposition), test


Décision d’architecture des 15–16/10/2026 : « Nos services » regroupe Robots (routines), Agents IA (métiers), Memlia OS et Modèle IA privé. Intégrations (compatibilités) est une entrée directe de la navigation, séparée des prestations. Les douze anciens services par pôle et les douze guides logiciels sont des archives internes, avec redirections permanentes vers les catalogues actifs. Salomé possède sa fiche ; Aude et Octavie conservent les destinations partagées CAC et Intégrations. Les pôles éditoriaux du blog ne constituent pas une offre commerciale supplémentaire.


### 16/10/2026 — Historique de l’ajout des deux offres complémentaires
Kevin demande Memlia OS pour relier mémoire, outils, équipes et agents du cabinet, et un modèle IA privé entraîné pour entreprises. Routes /memoire-collective-cabinet-comptable et /modele-ia-prive-entreprise. Source typée src/data/solutions.ts ; cadrage docs/strategy/memoire-modeles-2026-10-16/. Aucune collecte, installation ou formation réelle par ce chantier. Base 39226848, worktree isolé memoire-modeles-prives. À cette étape initiale, la fusion et la production n’étaient pas autorisées ; cette restriction est remplacée par l’autorisation de publication décrite plus haut.

Dernier arbitrage du 16/10 : huit familles de modèles à poids accessibles sur la page modèle privé (Llama, Mistral, Qwen, DeepSeek, Gemma, gpt oss, GLM, Kimi), logos officiels locaux et version/licence définies par projet. Footer aligné avec Nos services et Intégrations dans Vos outils.

Présentation : retrait des légendes et notes pédagogiques répétées sous les exemples, sans masquer en CSS. Animation modèle automatique sans bouton de pause ; la sélection manuelle, le focus et le survol arrêtent la progression, et le mouvement réduit est respecté. Les explications métier et de confidentialité restent dans leur contexte utile.
