# Intégration documentaire du diagnostic du 03/10

## Lire le paquet final

1. [Diagnostic et limites des mesures](DIAGNOSTIC.md).
2. [Quatre briefs IA arrêtés](BRIEFS-QUATRE-ARTICLES.md) : §1 `utiliser-chatgpt-cabinet-comptable`, §2 `verifier-reponse-ia-comptabilite`, §3 `ia-comptabilite-confidentialite-donnees`, §4 `automatiser-avec-ia-sans-changer-logiciel`.
3. [Matrice finale JSON](couverture-livraison.json) et [vue Markdown](COUVERTURE-LIVRAISON.md).
4. [Provenance historique](LIVRAISON.md), [résultat historique du vérificateur](verification.json), puis [runbook §3](../../RUNBOOK-QUOTIDIEN.md).

Les quatre textes restent à produire et à publier sur les cartes existantes. L'intégration de ces documents n'atteste aucun nouvel article, usage produit ni gain SEO. Les copies GSC/HTML/SERP gardent leurs dates et leurs populations ; leur cohérence ne constitue pas une nouvelle mesure du site.

## Historique et traces abandonnées

`couverture-skills.json` et `COUVERTURE-SKILLS.md` sont des checkpoints antérieurs. `BRIEFS-DSN-ABANDONNES.md`, `serp-dsn-abandonnes.json` et les sources DSN/paie/manuel sont les traces d'un angle abandonné pour ce lot. Ils restent conservés pour comprendre la provenance, pas pour relancer une rédaction. `runbook.patch`, `git-status-livraison.txt` et les logs décrivent la livraison locale historique.

Les mentions « non committé » dans DIAGNOSTIC.md et LIVRAISON.md décrivent cet instant historique, pas l'état courant de Git. Celui-ci se vérifie sur la PR de la carte t_0a0c5b52 puis sur main après fusion. Le parcours attendu est la branche `site/blog-diagnostic-20261003`, sa PR, une revue QA des scripts, la CI puis une lecture des documents intégrés sur main. Une PR ouverte seule ne termine pas la carte.

## Rejouer sans modifier les preuves historiques

Depuis la racine du dépôt, après `npm ci` :

```bash
node docs/strategy/site-v3/mesures/diagnostic-2026-10-03/verifier-livraison.mjs docs/strategy/site-v3/mesures/diagnostic-2026-10-03/couverture-livraison.json
```

Le résultat nouveau est envoyé sur stdout uniquement. Le défaut est maintenant la matrice finale. Pour conserver un nouveau résultat, fournir comme quatrième argument un chemin neuf, après la matrice et `catalogue-hermes.json`. Le script refuse de remplacer `verification.json` ou un résultat existant. Ne pas rediriger stdout vers une preuve historique.

Prérequis : Node compatible avec package.json, dépendance parse5 et `xmllint` ; pack Hermes au chemin `base_chemins_lus` de la matrice. Les chemins absolus retracent l'environnement de lecture historique. Un autre environnement doit fournir le pack correspondant ou une copie explicite de la matrice adaptée, jamais modifier la preuve historique pour masquer un pack absent. Le catalogue archivé et le pack installé ne certifient pas le catalogue distant courant.

Le contrôle rejoue l'union catalogue/pack/pipeline, les preuves, les exports GSC conservés, les métadonnées de douze copies HTML, trois XML et quatre mutations (omission, doublon, exécution sans preuve, motif vide). Il ne contacte pas les services de mesure et ne certifie ni la vérité métier, ni la lisibilité mobile, ni la production actuelle.

`collect-live.py` et `analyze-live.mjs` sont des scripts historiques de collecte/analyse ; ils écrivent dans ce dossier. `finaliser-couverture.mjs` reconstruit la matrice du lot historique. Ne pas les relancer dans le dossier conservé pour dater artificiellement une mesure ; les copier avec leur contexte dans un dossier de mesure neuf si leur réutilisation devient nécessaire. Le finaliseur n'est pas un garde de la forge ni un modèle d'états pour les futurs articles.

## Conservation indépendante du scratch

L'archive `blog-seo-2026-10-03-livraison-ia.tgz` est une sauvegarde Kanban, non suivie dans Git. Lecture à la reprise : 747823 octets, 150 entrées sûres, dont des métadonnées Apple `._` ; 71 fichiers du dossier documentaire comparés octet pour octet aux fichiers locaux, sans divergence. Le nombre historique de 75 entrées ne décrit pas cette archive.

Scratch source : `/Users/kevinkitanga/.hermes/profiles/marketing/cache/scratch/blog-w40`, branche `blog/w40-completion`, propriétaire initial marketing t_ab9420b0 confirmé par platform t_1b692aff ; relais t_0a0c5b52. Les fichiers hérités y sont préservés. L'intégration utilise le worktree isolé `integration/` depuis main frais. Garder le scratch jusqu'à vérification du relais intégré ; le nettoyage n'est pas une condition de cette livraison et ne doit pas supprimer les preuves avant conservation durable.
