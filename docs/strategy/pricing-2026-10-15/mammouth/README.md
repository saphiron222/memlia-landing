# Grille agents et économie avec Mammouth

Suite au choix de Kevin du 15 octobre 2026 : chiffrer la consommation par travail remis, plafonds et mise en service, avec Mammouth comme fournisseur. Il confirme le travail sur prix publics sans clé ni appel payant.

**Ce dossier est une étude historique des coûts.** Kevin refuse la complexité de la grille commerciale et demande de recalculer socle, prix et quota de chaque agent : lire [la proposition actuelle](../agents-individuels/GRILLE.md). Ses anciens 1 000 € + 300 € ne sont pas des contraintes tarifaires. Les huit exemples, le modèle et le classeur ci-dessous restent conservés pour l’analyse ; ils ne constituent pas le tarif de la nouvelle proposition.

Le classeur modifiable est dans [`outputs/01a13e1c-ec37-74f0-8a26-6ad074cde9ac/couts-et-tarifs-agents-mammouth.xlsx`](../../../../outputs/01a13e1c-ec37-74f0-8a26-6ad074cde9ac/couts-et-tarifs-agents-mammouth.xlsx). Vues : **Budget**, **Unités**, **Hypothèses**. Quantités, prix, coût humain, modèles, frais et scénario se modifient ; les résultats restent des formules. Le coût d’installation et la première année sont séparés du fonctionnement.

| Fichier | Usage |
|---|---|
| `bareme-agents.json` | Prix, bornes et hypothèses de l’ancienne proposition, pour étude des coûts |
| `calcul-economie.mjs` | Recalcul sans réseau et contrôle indépendant des devis/plafonds |
| `calculs-agents.json`, `grille-couts-agents.csv` | Résultats détaillés calculés sur les hypothèses |
| `build-classeur.mjs` | Reproduction du classeur via le runtime groupé Codex |
| [FOURNISSEUR.md](./FOURNISSEUR.md) | API, abonnements, prix, limites, inconnues et qualification contractuelle |
| [COUVERTURE-TRAVAUX.md](./COUVERTURE-TRAVAUX.md) | 128 éléments du catalogue rapprochés, dont bornés, sur mesure et renvois |
| `COUVERTURE-TRAVAUX.json` | Textes source, 17 empreintes et contrôles de couverture |
| [ECONOMIE-AGENTS.md](./ECONOMIE-AGENTS.md) | Étude intermédiaire : ses provisions initiales sont remplacées par le modèle consolidé |
| `manifest.json`, `archives/`, `tarifs-modeles.json` | 15 sources publiques archivées et 110 modèles normalisés |

Reproduire les calculs avec `node docs/strategy/pricing-2026-10-15/mammouth/calcul-economie.mjs`. Le constructeur du classeur utilise uniquement les dépendances du runtime groupé, jamais celles du dépôt pour l’auteur du fichier. Les captures de chaque vue et les vérifications de formules sont conservées à côté du classeur. Une exécution du constructeur remplace ce seul classeur de livraison ; aucune API n’est appelée.

Limites matérielles : pas de mesure API facturée, de recette qualité de ces modèles ni de coût humain réel. Le budget de devis proposé ne prouve pas un moteur de facturation en production. Le montage d’usage de Mammouth pour les cabinets clients reste à qualifier dans les conditions applicables avant exploitation. Les prix ne sont pas publiés sur le site par ce dossier.
