# Site v2 — dossier de décision et d’exécution

15 septembre 2026 — t_630c4a13 — phase documentaire terminée, revue indépendante à suivre. Rien publié, aucun code applicatif modifié.

## À lire
1. [Stratégie](SEO-STRATEGY.md) : choix de pages, positionnement, priorités et mesures.
2. [Décisions](DECISIONS.md) : arbitrages et options fermées.
3. [Architecture](SITE-STRUCTURE.md) + [inventaire complet](PAGE-INVENTORY.md) : arbre ASCII/Mermaid, 14 URL dont 5 nouvelles pages commerciales.
4. [Messages](GLOBAL-MESSAGING.md) : mission, chapeau Blog exact, hero/CTA par type.
5. [Audit réel](CURRENT-AUDIT.md) + [concurrents](COMPETITOR-ANALYSIS.md) : mesures et limites.
6. [Maillage](INTERNAL-LINKING.md), [design](DESIGN-SYSTEM-EXTENSION.md), [SEO/schema](TECHNICAL-SEO-SCHEMA.md).
7. [Contenu](CONTENT-ROADMAP.md), [exécution](IMPLEMENTATION-ROADMAP.md), [IDs des cartes](EXECUTION-CARDS.json).
8. Contexte canonique mis à jour : ../../../.agents/product-marketing.md (v2, historique v1 préservé).

## Vérification
`python3 docs/strategy/site-v2/validate-plan.py` depuis la racine du worktree vérifie les champs de l’inventaire, les URL uniques, requêtes principales, liens, parents, profondeur, navigation, dépendances P2, preuves collectées et périmètre Git. Résultat dans evidence/validation.json. `git diff --check` vérifie le patch documentaire.

Résultat de cette phase : 12 documents demandés, 14 fiches URL, 66 liens planifiés, profondeur maximale 2, aucune orpheline, 5 concurrents officiels lus, 12 mesures responsive et 4 audits Lighthouse. Il s’agit du graphe cible, pas d’une affirmation de site déjà construit. La cannibalisation est évitée au niveau des intentions/requêtes assignées ; l’overlap SERP actuel n’est pas mesuré.

Les captures sont dans evidence/screenshots/ ; les versions « scrolled » chargent les sections à révélation avant la capture pleine page. Les pages concurrentes, échecs d’accès et mesures sont conservés dans evidence/. CURRENT-AUDIT.md supplante les deux notes initiales des sous-agents, explicitement marquées provisoires.

Les tests applicatifs check/test/build ne sont pas revendiqués pour cette phase docs-only : aucun code du site n’a changé. Les mesures HTTP, navigateur et Lighthouse ont été réellement exécutées ; elles ne prouvent ni le futur candidat ni la performance terrain. Leurs contrats de revalidation figurent dans BUILD et QA.

## Limites
Search Console et CrUX non accessibles via le runtime SEO local non prêt ; celui-ci n’a été ni installé ni réparé. Google CAPTCHA et résultats de repli incohérents exclus de l’analyse SERP. Aucun DataForSEO appelé. Volumes, classements, difficulté, visites, conversion, citations IA et backlinks non mesurés = ND. L’analyse directe de cinq éditeurs et les recherches du coffre datées sont distinguées de données SERP actuelles.

## Passage de relais
- Revue du plan : t_88aa38ae (dev).
- Copy complète : t_42bc3eed (marketing), après revue acceptée.
- Implémentation : t_c2262a1b (dev), après copy ET release Ressources t_4cd25435.
- QA indépendante : t_80055166 (marketing).
- Publication vérifiée : t_4659b272 (dev), après QA PASS explicite.

Leurs cinq worktrees sont absolus et distincts. Nav/Footer/Base/site.mjs/tokens restent un seul lot de code, après Ressources. Ne pas consommer un verdict FAIL uniquement parce qu’une carte est done. Les commits locaux du plan et leur ordre sont dans le manifeste et le handoff final ; main ne les contient pas encore.

## Point opérationnel séparé
Les abonnements marketing des six cartes (parent et cinq enfants) n’ont PAS été configurés : l’API locale a refusé la mutation avec `PermissionError: delegate_task child contexts cannot mutate Kanban tasks or boards`. Aucun contournement n’a été tenté. La carte ops t_5463cd1a reprend ce seul réglage depuis un contexte autorisé et devra vérifier la livraison Telegram. Ce point ne doit pas être présenté comme une notification réussie.
