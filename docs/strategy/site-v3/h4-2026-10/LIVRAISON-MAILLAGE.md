# H4 — livraison constatée le 8 octobre 2026

## Résultat public

PR124 fusionnée le 08/10/2026 à 19:50:02 UTC (21:50:02 CEST), main `6410dfb31d9b908b861a7394be51624be86330cf`. Le candidat publié est `dc574916f0f7cd3c9a9b770ccb18f05f6d16f4b0`. Deux pushes non destructifs ont été faits : `11fc4b3d` puis `dc574916`, après intégration de main. La fusion conserve aussi le main documentaire `1bc4b9cd`, arrivé pendant la CI ; aucun fichier public de ce dernier n'était modifié.

Cloudflare a déployé automatiquement main : `8291a9b5-8511-4006-8b40-c3cc01a8cf83`, https://8291a9b5.memlia.pages.dev. Wrangler renvoie le préfixe source `6410dfb` et une date relative de fin (« 18 seconds ago » lors de la lecture réussie), laquelle provient de `latest_stage.status=success` avec `ended_on` dans son implémentation. L'API directe n'était pas disponible dans le processus : aucune heure exacte de fin ni SHA complet renvoyé par Cloudflare n'est inventé. Le SHA complet ci-dessus est celui de la fusion Git, dont le préfixe correspond à Wrangler.

Le premier crawl à 19:50:54 UTC voyait encore l'ancien maillage : 13 contrôles absents, donc aucune clôture C3 à ce moment. Après fin réelle du déploiement, le crawl à **19:59:09 UTC** a ouvert **66 pages / 63 indexables**, toutes HTTP 200 avec canonical exact, sans query string et avec `Cache-Control: no-cache`. Les pages et leurs HTML réels sont conservés dans l'archive de preuve. **15/15 contrôles PASS** : huit entrants hors blog, quatre liens satellites du pilier, ancre du glossaire avec identifiant présent, actions distinctes des 17 cartes outils et contrôle HTTP/canonical. Les fils d'Ariane restent dans les nombres d'entrants main ; ce ne sont pas des scores d'autorité.

Les trois articles historiquement à deux entrants main ont maintenant **4 / 5 / 4** pages entrantes (surcharge / métier IA / trois passes). Chacun des huit articles ciblés a l'entrant hors blog voulu. Les quatre satellites sont dans le corps du pilier et le renvoi devient « définition du rapprochement bancaire » avec le fragment existant.

La copy/structure H2 de main, les sources C3 et le passage CAC de B2 ont été conservés. Les libellés récents des 17 cartes, ajoutés à main depuis la QA H4, ont été déplacés à l'identique dans `libelleAction` canonique : aucune ancienne formulation ne remplace cette copy. Aucun titre, description, style ni image supplémentaire n'a été modifié pour H4. `updatedAt` du pilier est techniquement le 08/10/2026.

## Contrôles exécutés

- Unique QA H4 historique PASS conservée : `docs/qa/h4-maillage.md`. Pas de seconde revue.
- `node --test tests/scripts/h4-context-links.test.mjs` : 10 PASS.
- Forge `publier` entière, sans bypass : code 0, statut `publie`, sceau du 08/10 à 19:07:55 UTC.
- `npm run regen:generated` et `npm run build` complets : code 0 ; rejoués après l'intégration glossaire/HSTS et restés verts.
- CI GitHub `37831298424`, candidat `dc574916` : dix checks SUCCESS, dont Repository gates, avant fusion. La tentative 1 a échoué sur un GET local supplémentaire non journalisé dans `circularisation-import.spec.mjs:15` ; la reprise unique, à code et assertions inchangés, a passé. Cause exacte encore indéterminée ; diagnostic séparé `t_5280ac5c`, non parent de cette livraison.
- Ascendance du candidat publié et du main documentaire vérifiée après fusion. Aucun push forcé, aucune branche supprimée, aucun déploiement manuel de production.

## Après-publication et clôtures

`node scripts/seo/forge-seo.mjs apres-publication automatiser-un-cabinet-comptable-la-carte-des-taches` : code 0, erreurs vides, article servi HTTP 200, baselines de dérive **160** (/blog) et **161** (pilier), registre déjà inscrit, zéro nouvelle tâche F3. IndexNow a accepté les deux URL par HTTP 200 ; ce n'est ni une preuve d'indexation, ni une demande d'indexation Google.

Les **huit IDs C3 originaux** ont ensuite seulement été clôturés par la commande native `maintenance cloturer`, avec le commit de fusion et `traiteLe=2026-10-08`. `clotures-c3.json` liste les IDs exacts et leur état relu ; les autres tâches de maintenance ne sont pas modifiées.

Les matrices, reçus CI/fusion/Cloudflare et clôtures se trouvent dans `post-livraison-2026-10-08/`. Les fichiers de matrice du 06/10 restent la baseline historique intacte. La baseline GSC W41 reste `semaine-2026-W41-demande.json` (06/09–03/10 : 467 impressions, 26 clics ; 27/09–03/10 : 177 impressions, 4 clics). Aucun gain SEO du maillage n'est revendiqué.

Le J+28 calculé depuis la fusion est le **5 novembre 2026**. Son organisation et son exécution sont confiées à marketing sur `t_5c610ead`, avec horaire après 15:30 Europe/Paris et réutilisation des mesures déjà prévues si elles couvrent H4. La programmation effective appartient à cette carte : aucun cron déjà actif n'est revendiqué ici.

## Retour arrière et statut des registres

Pour revenir en arrière, ouvrir une PR qui retire seulement les renvois H4 et le raccord canonique du hub ; toute modification du pilier repasse par la forge entière, sans rétablir les anciennes copies H2 ni les anciennes sources. Les citations C3, le passage CAC de B2, le glossaire publié et HSTS restent conservés. CI et contrôle HTTP public restent requis ; aucun retour arrière n'a été exécuté.

La livraison du code est fusionnée et publique. Les documents post-livraison et la fermeture de `editorial/maintenance.json` sont un **enregistrement documentaire local postérieur à la fusion**, remis durablement sur la carte et au propriétaire `t_3a63473a` pour intégration de son registre. Ils ne sont pas présentés comme déjà présents dans main. llms et décisions titres restent hors de cette livraison ; aucun relevé futur ni impact commercial n'est anticipé.
