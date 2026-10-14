---
status: accepted
date: 2026-10-14
deciders: Kevin (porte 1 du chantier « hub de spécialistes », recommandations D1 à D14 validées le 14/10/2026)
---

# Un hub d'agents IA par métier, lu depuis une source unique qui référence les familles

Le site range aujourd'hui l'offre par **tâche** (`/automatisation/<tâche>`) et, pour le blog, par
**pôle** (`src/data/familles.ts`). Le chantier du 14/10/2026 ajoute une troisième entrée : **par
métier du cabinet**, un hub de douze agents IA portant chacun un prénom, une fiche par agent, et
une page des outils où les tâches s'exécutent. Nous proposons que ce hub ne crée aucune taxonomie
parallèle : `src/data/specialistes.ts` déclare chaque agent et **référence par identifiant** les
familles de `familles.ts` dont il a la charge, sans en recopier un libellé ; chaque famille EC
appartient à **exactement un** titulaire : un agent, le hub (l'IA générative en général) ou le bloc
« Derrière chaque agent, nous » (pôle Méthode et décision humaine). Un agent dont le métier a déjà
sa page sur le site (paie, accueil CAC, page des outils) y mène au lieu d'ouvrir une fiche.
Pages, JSON-LD, sitemap, `llms.txt` et tests lisent ce seul fichier.
La page des outils suit la même règle (`src/data/connecteurs.ts`, statut fermé à trois valeurs).

## Ce que cette décision remplace

- `docs/strategy/site-v3/ARCHITECTURE-ACCES-COMMERCIAUX.md` §1.4 (« aucune liste publique de tout
  ce que nous faisons ») et §2 (« pas de page par pôle », « aucun croisement tâche × rôle ») : le
  hub est une liste publique par métier, et chaque fiche regroupe des pôles. La règle « un seul
  niveau sous `/automatisation/` » reste intacte : les fiches vivent sous leur propre préfixe.
- La note de l'article planifié `ia-cabinet-comptable` dans `docs/strategy/site-v3/backlog-v3.json`
  (« refus figés : pages par pôle/rôle ») : le hub ouvre des pages par métier ; l'article garde
  l'intention informationnelle et lie le hub.
- `docs/strategy/site-v3/mesures/QUALIFICATION-INTEGRATION-CONNECTEURS.md` (06/10) : `/integrations`
  devient la page des outils par domaine (D10). Ce n'est pas un catalogue chiffré : aucun total, un
  statut vérifié par outil ; la page service `/automatisation/integration-connecteurs` reste fermée.

## Considered Options

- **Partition des familles (retenue)** : chaque famille a un seul agent titulaire ; un test
  vérifie la partition. Cela rend la cannibalisation lisible (une fiche = ses familles) et empêche
  deux fiches de promettre la même tâche.
- **Agent = pôle, sans familles** : plus simple, mais trois pôles n'ont pas d'agent (Portefeuille
  et échéances, Excel et outils existants, Méthode) et quatre métiers n'ont pas de pôle
  (Commercial, Communication, Protection des données, Relation client).
- **Nouvelle taxonomie propre à `specialistes.ts`** : écartée, elle dériverait de `familles.ts` dès
  la première famille ajoutée.

## Consequences

- Un compteur public (« douze agents ») se dérive des données, jamais écrit en dur
  (`tests/scripts/data-driven-counts.test.mjs`).
- Une famille nouvelle (Communication, Commercial…) s'ajoute d'abord à `familles.ts`, `active:
  false` tant qu'aucune règle n'est écrite ; l'agent la liste sans rejeu.
- Les contrôles qui figent la navigation, le sitemap, les liens commerciaux du blog et le contrat
  de page sont mis à jour délibérément, jamais désactivés.
