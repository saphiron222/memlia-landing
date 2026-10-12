# H5 — pilier EC et lecture de perte des articles

## Décision

Republier le pilier EC pour ajouter le lien contextuel vers la carte CAC effectivement publique. Le retrait de la fermeture générale audit a déjà été livré par B2 ; aucun doublon. Conserver les autres articles : la comparaison donne des alertes de visibilité, pas la preuve d'un contenu périmé ni une raison de supprimer des URL utiles. Aucun nouveau titre, aucune refonte métier ni redirection spéculative.

## Mesure réellement exécutée

Propriété `sc-domain:memlia.fr`, API Search Analytics, Web, données finales, page, tous appareils et tous pays, pagination jusqu'à 25 000 lignes par requête. Périodes adjacentes de quatorze jours : 12–25/09/2026 puis 26/09–09/10/2026. Fin à J-3 au moment de la collecte. Deux exports réels : 35 puis 57 lignes, sans erreur. Site entier : 21 puis 11 clics ; 641 puis 710 impressions. Ces totaux ne décrivent pas le seul blog.

Le script canonique `~/hermes/packs/claude-blog/scripts/content_decay.py` a été exécuté en clics puis impressions, seuil 20 %. Le chemin indiqué par le skill n'existe pas ; le script de son pack de référence a été localisé et utilisé. Rapports bruts conservés, sans modifier les recommandations du programme. Le « prune » automatique est écarté après triage : faible historique, besoin cabinet et valeur de maillage, aucun décrochage technique constaté.

| Article | Clics avant → après | Impressions avant → après | Baisse impressions | Décision |
|---|---:|---:|---:|---|
| Contrôles des bulletins avant DSN | 0 → 0 | 42 → 5 | 88,1 % | Conserver ; surveiller le signal « contrôle dsn », sans confondre le contrôle du bulletin et le dépôt |
| Carte des tâches du cabinet comptable | 1 → 0 | 17 → 6 | 64,7 % | Lien CAC et date de republication ; aucune refonte SEO sur un clic |
| Production sociale dans Excel | 0 → 0 | 13 → 5 | 61,5 % | Conserver ; requêtes visibles insuffisantes pour changer l'intention |
| Relance des pièces clients | 0 → 0 | 12 → 5 | 58,3 % | Conserver la méthode ; ne pas convertir en comparatif logiciel sur une question isolée |
| Saisie comptable | 1 → 0 | 26 → 11 | 57,7 % | Conserver ; position moyenne s'améliore de 25,5 à 20,5 malgré moins d'impressions |
| Surcharge de travail | 1 → 1 | 14 → 8 | 42,9 % | Conserver ; ne pas élargir vers les horaires salariés, hors lecteur cabinet |
| Comptes rendus métier DSN | 2 → 1 | 22 → 13 | 40,9 % | Conserver ; priorité de surveillance sur « compte rendu métier » |
| Adoption des nouveaux outils | 0 → 0 | 5 → 3 | 40,0 % | Conserver ; historique trop faible, pas de rafraîchissement justifié |

## Validation des alertes

Huit inspections URL réellement effectuées via l'API officielle : total déclaré 8, huit résultats, index_status PASS, page_fetch SUCCESSFUL, INDEXING_ALLOWED, robots ALLOWED et canonical utilisateur/Google concordants pour chaque URL. Huit GET publics : HTTP 200 et canonical exacts. Chaque page est présente dans les deux exports ; aucune page n'est classée « dropped_out ». Rapport page/query sur la période combinée collecté : les requêtes anonymisées ne sont pas visibles ; ne pas réconcilier son total avec celui des pages comme s'ils avaient la même couverture.

Les liens internes restent acquis : le changement H5 n'en retire aucun, la page blog apparaît dans les referring_urls de plusieurs inspections. Aucun audit neuf de backlinks effectué, aucune absence/perte de lien externe revendiquée. Une saisonnalité annuelle n'est pas estimable avec cet historique. Comparaison courte, ni trimestre contre trimestre ni année contre année ; les articles sont récents. Aucun update Google ou défaut de contenu déclaré cause de la baisse.

## Republication

Seul le pilier est candidat : publication initiale 16/09/2026 conservée ; mise à jour de la recette et du frontmatter 12/10/2026. Ajout au paragraphe « Que ne contient pas cette carte ? » vers `/blog/automatiser-un-cabinet-cac-la-carte-des-taches` et dans links.outgoing. Anciennes transitions H4 conservées ; claims, citations et images inchangés.

Une revue indépendante H5 PASS du maillage, du contexte, du HTML réel, des dates et de la destination publique est dans `REVUE-H5.md`. Avis B2 métier/image et H4 conservés comme historiques, pas inventés à neuf. Le gate preview réel donne pass:true sans erreur. Réception publique finale et référence de livraison à ajouter quand elles sont obtenues ; elles ne sont pas déclarées acquises ici.

## Prochaine décision utile

Relire après un intervalle de 28 jours complets, mêmes filtres ; comparer page/query et appareil séparément avant une correction de contenu. Priorités : bulletin/DSN et CRM, puis saisie. Une réécriture ne part que si la baisse persiste avec une intention perdue identifiable ou un défaut concret. Ne pas dater à neuf les articles seulement parce que l'outil a signalé une baisse.

## Preuves

Exports `gsc-current.json`, `gsc-previous.json`, `gsc-page-query.json`, `gsc-inspection.json` ; rapports `decay-clicks.md`, `decay-impressions.md` ; synthèse calculée `analyse-h5.json` et script `analyse-h5.mjs`. Tests/reçus de publication conservés séparément.
