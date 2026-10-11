# Continuité et exceptions de la sentinelle SEO

La sentinelle mesure ; elle ne corrige aucun contenu. Les mesures restent dans l’atelier dédié, puis sont archivées par la préparation du prochain run. Leur publication suit PR, CI verte et une revue QA.

## Réseau et couverture

Chaque variante est sondée sans puis avec suivi des redirections. Une exception réseau déclenche une seule reprise de cette paire de sondes ; les deux tentatives restent dans le brut. Une exception persistante donne `variante-indisponible`, pas `variante-non-redirigee`. Une réponse HTTP réellement incorrecte reste rouge. Les appels ne constituent pas une transaction réseau : une réponse intermittente peut varier entre les deux sondes.

`couverture` indique les URL attendues, mesurées et exclues pour les inspections, la dérive et les variantes, ainsi que la disponibilité des sitemaps et des impressions. Une baseline créée dans le run ne compte pas comme une comparaison historique. Le code de sortie vaut 1 si cette couverture est incomplète, sinon 2 avec rouge, sinon 0. La disponibilité des instruments ne signifie pas que le site est sain. Core Web Vitals, positions et rendu visuel restent hors de ce relevé.

## État durable

- `.qa/seo/etat-sentinelle.json` conserve les premières vues, derniers états connus et IDs de baseline.
- `docs/strategy/site-v3/mesures/sentinelle-etat.json` en conserve un instantané à chaque relevé. Ce chemin entre déjà dans le périmètre archivé et vérifié par le préflight Hermes, contrairement à `.qa` ignoré par Git.
- Au chargement, l’état `.qa` fait foi, puis l’instantané local complète les absents, puis les instantanés archivés du plus récent au plus ancien. Une entrée locale n’est jamais remplacée par une archive. Les archives restent intactes.
- Le dossier d’archives par défaut est `~/.hermes/profiles/marketing/cron/seo-archives/sentinelle`. `MEMLIA_SEO_ARCHIVES` permet de désigner un autre dossier. Chaque sous-dossier daté contient le chemin relatif de l’instantané ci-dessus.
- Un état local illisible arrête le run, sans écriture. Une archive illisible est signalée explicitement et ignorée. Une inspection absente ne supprime pas le dernier état connu et ne le compte pas comme une mesure du jour.

Le comparateur reçoit `--baseline-id` avec l’ID mémorisé, pas simplement la dernière baseline globale pour cette URL. L’instantané ne remplace pas la base SQLite du runtime SEO (`~/.cache/claude-seo/drift/baselines.db`) : conserver également cette base dans les sauvegardes. Si l’ID manque dans SQLite ou si le comparateur répond avec un autre ID, la comparaison reste en exception et aucune baseline mémorisée n’est remplacée automatiquement.

Les archives antérieures à cet instantané ne permettent pas à elles seules de reconstruire les IDs. Pour la reprise initiale, copier l’état encore présent dans l’atelier vers un dossier d’archives de vérification, sans altérer l’original. L’absence d’état antérieur est une exclusion historique, jamais une preuve de stabilité.

## Vérification ciblée

`node --test tests/scripts/seo-sentinelle.test.mjs tests/scripts/seo-instruments.test.mjs tests/scripts/seo-regles.test.mjs`

Le relevé réel de validation utilise `node scripts/seo/sentinelle.mjs --sans-indexnow --json` avec l’archive récupérée : Search Console reste en lecture seule et aucun ping de publication n’est envoyé. Les preuves du relevé indiquent les dates, les exclusions et les baselines comparées. La construction et la suite complète restent à la CI GitHub « Repository gates ».
