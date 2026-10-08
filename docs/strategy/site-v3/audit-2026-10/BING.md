# Bing — relevé hebdomadaire et soumission différentielle

Livraison t_467dc3f0, 06/10/2026. Scripts versionnés : `scripts/seo/bing_monitor.py`, `test_bing_monitor.py`, `bing-daily.sh`, `bing-weekly.sh`. Aucun changement du site public, ni IndexNow ni réglage Cloudflare.

## Mesure réelle initiale

Sitemap public : 55 URL. GetCrawlStats expose une dernière valeur `InIndex=5`, `InLinks=0` (date de la ligne dans le JSON ; ce n'est pas un état temps réel). GetLinkCounts : liste vide, TotalPages=0. GetPageStats ne retourne que deux lignes pour l'accueil : 4 impressions/1 clic, puis 2 impressions/0 clic, aux dates Bing conservées. GetFeeds : succès, mais encore 40 URL déclarées dans la dernière lecture Bing, contre 55 dans le sitemap actuel.

GetUrlInfo : 29 HTTP400 et 26 erreurs réseau au relevé initial. Le rapport contient malgré tout chaque URL, avec découverte, dernière exploration, statut HTTP et indexation ND. Ce sont des limites instrumentales, pas 55 preuves de non-exploration. Le modèle officiel UrlInfo ne fournit pas de champ d'indexation : `IsPage` n'est pas ce champ. La série globale InIndex reste exploitable ; une indexation URL par URL nécessite un autre instrument et n'est pas inventée.

Source : https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.urlinfo?view=bing-webmaster-dotnet ; API réelle `https://ssl.bing.com/webmaster/api.svc/json/`.

## Soumission et preuve

Premier passage : 55 URL acceptées par SubmitUrlBatch ; GetUrlSubmissionQuota relu passe de 100 à 45 en quotidien et de 2600 à 2545 en mensuel. Deuxième puis troisième passages : aucune URL soumise (idempotence). Cette acceptation n'est pas une indexation.

Le registre compare URL et lastmod, conserve les acceptations et la liste des tentatives. Sans lastmod : URL soumise une fois, impossible de détecter une modification invisible au sitemap. Une tentative est réservée au budget local avant POST ; un timeout ambigu n'est pas marqué accepté et réduit la capacité restante du jour. Les URL restantes reviennent au prochain passage. Plafond = minimum du quotidien Bing, du mensuel Bing et des 100/jour locaux UTC. Le verrou empêche les runs concurrents. Le premier lot constitue la baseline suivie par cet outil, même si une soumission manuelle antérieure a déjà été faite.

## Exploitation installée

Copie runtime : `~/.hermes/profiles/marketing/scripts/bing_monitor.py` et les deux lanceurs. Python : `/usr/local/bin/python3`. Sur macOS le magasin CA système `/etc/ssl/cert.pem` est utilisé, TLS reste vérifié. Redirections refusées. La seule clé lue est BING_WEBMASTER_API_KEY, dans l'environnement ou le .env marketing, jamais écrite dans les résultats ou Git. Aucun log d'URL API contenant la clé.

- `cac826da56dc`, bing-soumission-quotidienne : 18:45 chaque jour, script-only, sorties locales, erreurs Telegram. Le cron a réellement été déclenché : OK, zéro URL nouvelle.
- `457c4180df11`, bing-releve-hebdomadaire : lundi 08:15, script-only, Telegram ; produit les sources avant brief-hebdo 09:00.
- Relevés : `~/.hermes/profiles/marketing/reports/bing/bing-YYYY-MM-DD.md` et `.json` ; registre `submission-state.json` et verrou `run.lock` au même endroit.

I1 `t_5cfa31cd` a reçu le premier relevé. Raccordement automatique au lecteur I1 confié à la carte existante `t_caeef1c6`, par commentaire, sans modifier son collecteur en concurrence. Le consommateur doit vérifier collected_at, exposer api_status par URL et les sources en erreur, et ne pas transformer des séries datées en totaux exhaustifs. Le relevé n'inclut pas les passages Cloudflare, instrument distinct.

## Vérification et entretien

`python3 scripts/seo/test_bing_monitor.py -v` : 11 tests PASS (deltas, quotas, ambiguïté, idempotence, ND, secrets, sitemap et réponses API invalides). Les relevés réels et le lanceur quotidien ont été exécutés. Le premier relevé séquentiel trop lent a été remplacé par 3 lectures concurrentes, timeout 15 s, et le relevé final a terminé.

Pour désactiver : mettre les deux crons en pause avec l'outil cronjob, conserver le registre. Après fusion, mettre à jour les copies runtime depuis ces mêmes fichiers. Les résultats restent privés, ne sont pas copiés dans public/. La revue QA indépendante et la fusion de la PR constituent le reste de la livraison.
