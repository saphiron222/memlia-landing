# Diagnostic de la forge — 23/09/2026

Contrat : diagnostic local, pas une certification de publication. Le dernier run archivé de la forge `e4eaaf20655f` (23/09 09:01) refuse la branche `site/page-contract-final` et le HEAD `5280ea6` face à `origin/main` `f17735a`. Aucun nouvel article n'est prouvé ; le `ok` du moteur cron ne prouve pas une publication.

Source : sortie archivée du job sous `~/.hermes/profiles/marketing/cron/output/e4eaaf20655f/`. Le checkout principal observé lors du diagnostic était sur `site/page-contract-final` à `5280ea694685e53f06750414fd420cb0483bfeb9` contre `origin/main` `f17735ab4aaa363fb2c3215cbc289814dac7c710`. Ces constats historiques ne prouvent ni l'état actuel du checkout, ni le calendrier, ni la production.

## Correctif borné au blog

`scripts/cron-preflight.mjs --job forge` refuse avec code 1 et JSON `ok:false` un mauvais checkout, une branche inattendue, un arbre sale en phase initiale ou avant push, le runbook de forge absent, un fetch impossible ou un SHA désynchronisé. Avant commit et avant push, il valide la même base ; le push sur `main` est refusé. Un `ok:true` n'autorise que la poursuite du contrôle métier : ni QA, ni CI, ni publication ne s'en déduisent. La fusion suit la garde `scripts/blog-auto-merge.mjs` et une QA indépendante au HEAD exact.

La PR ne branche aucun prompt cron et ne réactive aucun job. Les quatre routines SEO restent suspendues : leur préflight, leur runbook et leur circuit de release non-blog sont reportés hors de cette PR, sans réutiliser la garde blog. Ne pas exploiter le chemin direct-main historique du runbook SEO resté sur `main`.

## Retour arrière

Avant branchement de la forge, aucune configuration cron à restaurer. Après release, revenir par une PR de correction et restaurer le prompt depuis sa sauvegarde datée ; ne jamais pousser directement sur `main` ou restaurer un préflight permissif sans alternative qui échoue fermé.
