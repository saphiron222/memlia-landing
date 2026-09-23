# Diagnostic local des cinq routines — 23/09/2026

Contrat : local-only. Aucun cron actif ni production modifié par ce correctif ; aucune publication ou certification 5/5 revendiquée. La QA `t_17f8fb7f` doit reprendre après release dédiée sous les règles Git/PR.

| Routine | Dernier run archivé consulté | Verdict observable |
| --- | --- | --- |
| Forge `e4eaaf20655f` | 23/09 09:01 | REFUS explicite, branche `site/page-contract-final` et HEAD `5280ea6` contre `origin/main` `f17735a`; pas de nouvel article prouvé. Le `ok` du moteur ne prouve aucune publication. |
| Sentinelle `41c548e093ff` | 22/09 18:30 | `[CRON_FAILURE]` : `RUNBOOK-SEO.md`, `CRONS-SEO.md`, `CLAUDE.md` annoncés introuvables depuis l'environnement du job. Aucun relevé vérifié. |
| Relevé demande `8416f0f0f661` | 21/09 07:02 | REFUS : branche hors `main`, HEAD désynchronisé ; aucun relevé lancé. |
| Intégrité `8cc31dbdda05` | 23/09 07:01 | REFUS : branche hors `main`, HEAD désynchronisé ; aucun contrôle lancé. |
| Autorité `338941579226` | 19/09 23:32 | Réponse annonçant commit local `bcd5904`, mais citations IA et audience non mesurées ; **pas de certification** sur cette seule réponse. |

Sources : sorties archivées des jobs `~/.hermes/profiles/marketing/cron/output/<id>/` (dernier fichier par identifiant). L'état du checkout principal observé localement est propre mais sur `site/page-contract-final` à `5280ea694685e53f06750414fd420cb0483bfeb9`, tandis que `origin/main` vaut `f17735ab4aaa363fb2c3215cbc289814dac7c710`. Le diagnostic ne prouve ni la fraîcheur du calendrier/backlog ni l'état de la production : ne pas inférer la publication à partir du statut du moteur cron. Le brouillon transmission demeure exclu.

## Correction proposée et validation

Le script `scripts/cron-preflight.mjs` prend un chemin absolu de checkout et le nom du job. Il refuse avec code 1 et JSON `ok:false` un mauvais répertoire, une branche autre que `main`, un arbre sale, un runbook absent, un fetch impossible ou un SHA non synchronisé. Le JSON `ok:true` est uniquement une autorisation d'entamer les contrôles métier, **jamais** une preuve de publication. Test rouge avant création du script ; test vert après. Exécution locale bornée sur le worktree : code 1, branche `wt/t_d23609f6`, arbre sale et SHA désynchronisé ; aucune écriture de contenu ni push.

Après release du script, chaque prompt cron doit d'abord entrer explicitement dans le checkout prévu, exécuter le préflight avec son `--job`, et traiter tout code non nul comme `[CRON_FAILURE]` avec alerte. La forge doit ensuite contrôler calendrier/backlog, gates review/scellement et preuve de déploiement Cloudflare avant de déclarer une publication. Cette étape de branchement des prompts, la réexécution et la certification restent ouvertes ; ne pas relancer la forge depuis la branche de travail.

## Rollback

Avant branchement des jobs, aucune configuration cron à revenir : retirer le commit correctif sur la branche dédiée si refusé en revue. Après release, revenir par la procédure Git/PR normale sur le commit publié et restaurer les prompts des cinq jobs depuis leur sauvegarde datée ; ne jamais faire `git push origin main` depuis cette carte. Ne pas restaurer un ancien préflight permissif sans une alternative qui échoue fermé.
