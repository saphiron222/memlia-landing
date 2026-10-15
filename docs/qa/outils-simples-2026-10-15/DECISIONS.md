# Outils gratuits — décisions de réalisation

## Références et direction

Les 27 outils et le hub Outrank ont été capturés dans `references/` : titres centrés, action immédiatement accessible, peu d’entrées et réglages secondaires. Le ROI Outils-EC a été manipulé et capturé : portefeuille, coût horaire, changement de palier et détail des routines. Nous reprenons la simplicité, avec les composants, les couleurs et les figurines Memlia. Aucun code ni visuel concurrent n’est publié.

La demande la plus récente de Kevin exclut les skills Codex. Pour cette réalisation : skills Claude `free-tools`, `cro` et sa référence `form`, `copywriting`, `copy-editing`, `frontend-design-direction`, `make-interfaces-feel-better`, `motion-foundations`, `accessibility`, `seo-technical`, `seo-schema`, `seo-images` et `conventional-commit-review`. Le contenu métier et les sources déjà vérifiées restent conservés ; aucun nouveau délai légal n’est introduit.

## Six essentiels, 21 routes conservées

Au premier affichage : prompts comptables, simulateur de ROI, relance de facture, checklist, vérificateur FEC et fusion CSV. Ils prolongent des besoins récurrents du catalogue et donnent un résultat ponctuel compréhensible.

Tous les autres outils restent accessibles par « Tous » et par trois besoins : préparer avec l’IA, faire un calcul, préparer un dossier. Les compteurs et les cartes viennent de `src/data/outils-vitrine.ts`, qui doit être une permutation exacte du catalogue existant. Aucun nouveau hub concurrent, aucune suppression de route ni redirection ajoutée. Les intentions spécifiques CAC restent présentes sans encombrer le premier choix.

| Outil | Premier parcours | Réglages ou parcours conservés |
| --- | --- | --- |
| Prompts comptables | Recherche puis copie d’un modèle | Métier, format et tâche ; détail du prompt et exemples repliés |
| Générateur de prompt comptable | Tâche, format, description abstraite | Entrées, validateur et arrêt ; amorces ; contrôle et édition |
| Générateur de prompt texte | Tâche, format, objectif abstrait | Contexte, ton, contraintes ; exemples et exports |
| Vérificateur de prompt | Texte abstrait et confirmation | Diagnostic structurel et copie ; aucun modèle appelé |
| Charte IA | Usages, famille de données, validation, fréquence | Rôles, outils, formation, relecture ; éditions conservées |
| Diagnostic IA | Une dimension à la fois | Réponses inconnues conservées ; synthèse sans score inventé |
| ROI | Offre et deux curseurs | Temps, contrôle, installation ; trois scénarios personnalisés |
| Marge | Achat et vente | Formules repliées ; calculs, négatifs et exports conservés |
| Échéance de facture | Règle et dates utiles | Confirmation du délai et convention de fin de mois indispensables |
| Amortissement | Base, date, durée | Méthode dégressive et éligibilité explicite |
| Rapprochement bancaire | Période et deux soldes | Opérations en rapprochement, conventions et trace |
| Checklist | Période et familles choisies | Pièce personnalisée, états, exceptions et reprises |
| Relance de facture | Client, référence, montant, échéance, litige | Clé client, paiements, avoirs ; préparation et regroupement validés |
| Vérificateur FEC | Fichier | Profil, encodage et limites détaillées ; anomalies localisées |
| Préparation du lettrage | Fichier | Format ; règles exactes et ambiguïtés, sans écriture comptable |
| Pseudonymisation | Fichier puis colonnes choisies | Format, remplacement et revue ; aucune promesse d’anonymat |
| Fusion CSV | Fichiers | Association explicite des colonnes et provenance |
| Balances | Deux fichiers et périodes | Format et colonnes ; devise, comparabilité et seuil choisis |
| Barème CAC | Trois montants et période | Champ d’application requis avant fourchette ; budget et alerte distincts |
| Signification | Base nommée, montant, taux choisi, période | Référence, justification, identifiant, planification ; choix réservé au CAC |
| Circularisation | Tiers, contact, date, catégorie et demande | Mission, devise, solde ; lettres, réponses et rapprochements validés |

Les confirmations essentielles ne sont pas retirées pour gagner un champ. Les fonctions avancées restent disponibles ; elles ne se présentent plus comme un questionnaire intégral au premier écran. Les données client réelles ne sont pas utilisées pour la recette.

## ROI et tarifs

La seule source publique structurée est `src/data/tarifs-memlia.json`. Les deux références validées se trouvent dans `docs/strategy/pricing-2026-10-15/README.md`. Les anciennes propositions et leur classeur ont été supprimés ; les sources fournisseur restent identifiées comme telles.

Robots : neuf routines standard, forfait annuel progressif jusqu’à 500 dossiers, extensions et installation sur devis. Agents : un socle de 199 € HT/mois, un agent sélectionné, son quota et ses profils approximatifs. Un dépassement estimé n’est jamais présenté comme déjà autorisé.

Les 120 minutes manuelles et 30 minutes de contrôle sont un **exemple fictif modifiable**, pas une mesure Memlia. Pour les robots, le rythme est annuel ; pour les agents, mensuel puis annualisé. Le temps valorisé, le coût récurrent et le coût de première année restent distincts. Une installation inconnue reste à chiffrer ; une valeur négative reste négative. Le comparateur avancé conserve le calcul de trésorerie séparé.

## Sécurité et accessibilité

Les formulaires locaux portent `method="dialog"` et ne sont placés dans aucun dialogue : leur soumission native ne navigue pas, même si les scripts sont absents. Référence : [algorithme de soumission HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm). La CSP ajoute `form-action 'none'` et conserve `connect-src 'none'`. La page contact conserve son circuit distinct. La préparation d’une preview conserve les en-têtes de sécurité au lieu de les remplacer.

Une erreur dans un réglage replié ouvre ses ancêtres avant de recevoir le focus. Les filtres sont des radios natives et les accordéons des `details`. Le mouvement réduit reste respecté. Les rails suivent leur section uniquement à partir de 1 024 px ; un panneau plus haut que la fenêtre laisse d’abord apparaître son bas. Aucun défilement imbriqué n’est ajouté.

## Images et référencement

Le héros des outils est compact ; les anciens écrans HTML illustratifs quittent le corps des pages. Le hub garde trois figurines existantes, avec leurs variantes AVIF/WebP. Vingt-deux visuels sociaux 1 200 × 630 reprennent ces figurines : `public/outils/social/`, générateur `scripts/render-outils-socials.mjs`, manifeste avec empreintes `social-manifest.json`. Ils passent ensuite dans le pipeline JPEG social existant.

H1, intentions, routes et canonicals existants conservés. Hub : CollectionPage, ItemList et BreadcrumbList ; outil : WebPage, WebApplication et BreadcrumbList. Aucune FAQPage ajoutée. Le maillage, le sitemap et les surfaces LLM sont régénérés selon le dépôt ; les corps d’articles scellés restent intacts.

Le contrat de page reconnaît explicitement les 21 outils interactifs : l’identité du catalogue, des saisies et une action dans le HTML sont obligatoires, ainsi qu’une image sociale propre et son empreinte. Les contrôles d’intention, de schéma et de maillage restent actifs. Une capture fonctionnelle dans le corps n’est plus imposée en plus de l’outil réel. Les autres pages conservent leurs règles de médias.
