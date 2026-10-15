# memlia.fr

Le site public de Memlia : il présente et vend l'automatisation IA des tâches répétitives des
cabinets d'expertise comptable et de commissariat aux comptes, prise en charge comme un service.

Décision commerciale du 15/10/2026 : partir des robots et agents IA Memlia du catalogue,
les adapter et les déployer dans les outils du cabinet, puis les maintenir. Construire sur mesure
lorsque le besoin dépasse le catalogue. La règle écrite décrit leur fonctionnement dans le cabinet ;
elle reste le mécanisme de contrôle. Voir la charte v8 et `docs/strategy/site-v3/coherence-figurines/COPY-CATALOGUE.md`.

## Langage

### L'offre

**Robot** :
Une routine précise du catalogue, avec un déclencheur, des tâches et un résultat identifié.
Nous l’adaptons aux accès, dossiers, formats et validations du cabinet avant sa mise en service.

**Déploiement** :
L’adaptation et la mise en service d’un robot ou agent IA Memlia dans le périmètre accepté.
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
Un logiciel du cabinet dans lequel nos agents travaillent ; la page de compatibilité les liste par
domaine, et d'autres s'intègrent sur demande.
_Avoid_ : partenaire, intégration certifiée, plateforme

**Recette** :
La vérification, par les équipes du cabinet qui feront le travail, qu'une automatisation livrée fait
ce que sa règle dit, sur leurs propres cas.
_Avoid_ : validation (réservée à la décision du collaborateur sur une proposition), test
