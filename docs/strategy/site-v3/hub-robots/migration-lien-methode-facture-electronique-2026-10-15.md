# Migration du lien entrant Méthode → fiche Comptabilité — 15/10/2026

Décision de contenu : Kevin a explicitement supprimé le paragraphe promotionnel consacré à la
facture électronique dans Méthode. Sa suppression est conservée. Le contrôleur du chantier a
mandaté une migration historique du lien entrant vers la tâche correspondante de Balthazar,
déjà rendue dans le catalogue des agents.

## Contrat historique conservé

- Service : `/automatisation/facture-electronique`.
- Recette : `commercial/recettes/facture-electronique/recette.json`.
- SHA-256 : `70ac85abb0cc5377e74d88e4a869cf31465002793c0c2f4d9aee972347a9cb70`, comparé à
  `commercial/services/facture-electronique/preuves/scellement.json` et aux octets présents.
- Ancienne source : `/methode`, `src/pages/methode.astro`.
- Ancienne ancre : « éprouver la préparation des appels de facture électronique ».

La recette, son corps, son manifeste, ses revues et ses sceaux restent historiques et inchangés.
Le nouveau contrôle ne réécrit aucun de ces fichiers et n'en régénère aucune empreinte.

## Lien de remplacement déclaré

La déclaration `facture-electronique-methode-vers-comptabilite-2026-10-15` figure dans
`config/service-publication-ledger.json`, sous `incomingLinkMigrations`.

- Source effective : `/agents-ia/comptabilite`.
- Route : `src/pages/agents-ia/[metier].astro`, pour l'agent `comptabilite` publié.
- Données : `src/data/specialistes/comptabilite.ts`.
- Famille : `facture-electronique`, portée par Balthazar et par le service publié.
- Contexte : « Reprendre les factures électroniques reçues ».
- Ancre : « Détailler cette tâche », dans la même ligne de tâche.
- Destination résolue par famille : `/automatisation/facture-electronique`.
- Gabarit : `src/layouts/Agent.astro`, section `data-agent-section="taches"`.

Les trois sources effectives du service sont désormais le catalogue des robots, la fiche
Comptabilité et Garanties. La source Méthode n'est plus comptée pour ce service.

## Vérification et limites

`scripts/lib/service-incoming-migrations.mjs` est appelé par le contrôle de liens entrants de la
forge. Chaque migration exige une date réelle non future et une justification, l'ancien triplet
exact présent une seule fois et la même recette scellée, sur disque et en mémoire.

Pour le lien de fiche agent, les parseurs TypeScript et Astro vérifient les données littérales,
l'import et la présence de l'agent au catalogue, la sélection des fiches publiées, la construction
de la route, la sélection du service publié par famille, la transmission des liens au gabarit et le
vrai nœud `<a>` dans la boucle des tâches, avec son texte et sa destination. Un agent non publié,
une autre famille, un autre href, une ancre en commentaire, une section globale ou masquée et une
source noindex font échouer le contrôle. Aucune donnée de source n'est exécutée par ce lecteur.

Après remplacement, le contrôle habituel exige encore trois URL et trois chemins sources distincts.
Une migration invalide garde l'ancien lien en échec ; elle ne supprime aucune obligation. Les liens
ordinaires et le pont antérieur du catalogue de robots conservent leurs vérifications existantes.
Un changement de structure du résolveur ou du gabarit doit être relu et couvert par les tests avant
que le lecteur accepte une nouvelle forme. Ce contrôle de source ne remplace pas la vérification
du HTML construit dans la recette globale du chantier.

## Résultats

- Avant migration : `service:audit` refusé pour l'unique lien Méthode manquant, après renouvellement
  réel des mesures Google.
- Après migration : `service:audit` **PASS**, 12 services, aucune erreur.
- Tests ciblés `service-forge`, `service-facture-electronique` et
  `service-incoming-migrations` : **65/65 PASS**, dont 40 mutations refusées, un contrôle du seuil
  après remplacement et une vérification des octets historiques laissés intacts.

Aucun fichier d'interface ni recette scellée n'a été modifié par cette migration. Aucun build,
régénération ou commit n'a été lancé dans cette sous-tâche.
