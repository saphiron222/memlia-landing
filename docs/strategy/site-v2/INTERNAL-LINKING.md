# Maillage interne

15/09/2026. page-inventory.json porte chaque arête entrante/sortante ; PAGE-INVENTORY.md en est la vue humaine. Les liens futurs sont une cible de plan, jamais une autorisation de rendre un lien mort.

## Système
- Hub commercial : /automatisation-cabinet-comptable relie méthode, garanties, deux usages éditoriaux et contact.
- Hub éditorial : /blog relie les articles ; chaque article renvoie vers Blog, un article connexe, la méthode ou le service, le profil auteur et une action.
- Hub de formats : /ressources renvoie vers Blog et Glossaire selon le manifeste existant ; ne crée pas un second index de tous les mêmes articles avec introductions dupliquées.
- Confiance : /garanties renvoie vers /methode et /politique-de-confidentialite ; /a-propos porte la responsabilité, les articles lui attribuent leur auteur.
- Contact : reçoit les liens de toutes les pages commerciales et des articles ; offre une sortie vers le service/méthode, pas une impasse calendrier.

## Liens contextuels prioritaires
| Source | Cible | Ancre et emplacement |
|---|---|---|
| / | /automatisation-cabinet-comptable | « Découvrir le service d’automatisation » après situations |
| / | /methode | « Comment nous cadrons et éprouvons une tâche » après résumé méthode |
| Service | Guide contrôle | « Structurer les contrôles avant la DSN » dans exemple de tâche, pas carte produit |
| Service | Guide suivi | « Suivre les étapes de la production sociale » dans exemple de suivi |
| Guide contrôle | /methode | « Éprouver les règles et leurs cas limites » après méthode de vérification |
| Guide contrôle | Guide suivi | « Rendre les étapes du suivi visibles » après organisation de la revue |
| Guide suivi | /garanties | « Piloter sans classement individuel » au passage agrégats |
| Guide suivi | Guide contrôle | « Contrôler les bulletins avant la DSN » dans étape revue |
| Articles | /a-propos | « Kevin Kitanga » dans byline, même personne schema |
| /methode | /contact | « Décrire votre tâche » après critères de recette |
| /garanties | /contact | « Parlons de vos contraintes » après limites |
| /blog | /ressources | « Explorer les ressources » après liste, une fois publié |

Pas de quota de liens par nombre de mots. Chaque lien doit aider à comprendre ou agir ; pas d’ancres bourrées de mots-clés. Tous sont des <a href> HTML. Liens FAQ, filtres et widgets ne sont pas l’unique voie vers une page importante.

## Préserver sans canoniser les ancres
Les anciennes ancres de landing restent en place et servent de points de passage vers les pages détaillées. Canonical reste l’URL de page, jamais une ancre. Ne pas injecter de canonical différente par JS.

## Contrôle de graphe
validate-plan.py calcule unicité, champs requis, symétrie des arêtes et BFS depuis /. Les pages autres que / ont au moins un lien entrant ; profondeur maximale permise = 3. Il teste également le graphe « maintenant » en excluant P2 : retirer une page future ne doit pas rendre le présent orphelin. L’arête globale logo → / est implicite sur chaque page.

À la recette, remplacer ce graphe intentionnel par un crawl du DOM effectivement publié et du manifeste Ressources, puis recalculer. Une réussite documentaire ne démontre pas l’absence d’orphelines en production. Exclure mailto, liens externes, assets et ancres du calcul de pages tout en validant leurs destinations séparément.
