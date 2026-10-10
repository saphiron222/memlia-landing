# Finalisation technique — relance facture — 7 octobre 2026

Carte t_f4b40722, PR155, branche site/generateur-relance-facture. Aucune revue indépendante ni fusion production effectuée. L’unique QA t_7d981a8b reste derrière la finalisation de la CI.

## Causes et corrections prouvées

1. Wrangler héritait d’un jeton API ne permettant pas la résolution des comptes. Reprise réussie avec l’OAuth déjà enregistré, en retirant CLOUDFLARE_API_TOKEN pour la seule commande et en utilisant le compte existant. Aucun secret lu, copié ou demandé. Le preview automatique e08e25cf lié à 155cf30 répondait 404 ; ce n’était pas une preuve de livraison.
2. Le build global réel échouait sur deux tests ROI/pseudonymisation qui figeaient la liste des routes no-transform. Tests convertis en contrat : règles limitées à des routes outils explicites, sans wildcard ; protection spécifique et CSP restent testées. Rouge observé, deux tests ciblés verts puis build global vert.
3. La nouvelle sonde sur Cloudflare a révélé un GET du script Worker déclenché pendant l’import. Aucune donnée utilisateur n’y figurait, mais le zéro requête après chargement n’était pas respecté. Worker embarqué par le bundler, lancé depuis un blob ; CSP meta et Function relance autorisent uniquement ce Worker local. connect-src reste none, script-src inchangé et outils frères restent sous worker-src self. Sonde rouge sur 04cd1f8d, verte sur 45d4ebe5.
4. Le rendu modifié exigeait son lastmod : synchronisation sur la seule route relance, puis nouveau build séquentiel complet vert. Aucun build concurrent du même dist.

## Résultats exécutés

- npm ci : 389 paquets installés depuis le lock.
- npm run check : 0 erreur, 0 warning, 14 hints hérités.
- node --test tests/scripts/relance*.test.mjs : 15 PASS.
- npm run build final, processus proc_2837427bc48d : sortie 0 ; 150 preuves Python PASS ; test:scripts 797 PASS, 8 SKIP, 0 FAIL ; resource:audit:qa PASS. La sortie conservée est une fenêtre du journal, pas un journal intégral des premières étapes.
- npm run test:lastmod : 41 pages, registre à jour ; une seule page recalée.
- Sur Cloudflare 45d4ebe5 : 11 parcours Chromium PASS, dernier replay du 7 octobre à 01:00 UTC environ. Saisie, exemple, import multiligne, refus 501, édition conservée, calcul, copie réelle, TXT/CSV téléchargés et relus, effacement.
- Sonde après chargement et avant toute donnée fictive : zéro requête HTTP tardive ; localStorage, sessionStorage, cookies document/contexte, IndexedDB, CacheStorage et inscriptions service workers inchangés. Le téléchargement volontaire écrit un fichier sur l’appareil ; il ne s’agit pas d’une sauvegarde implicite du navigateur.
- GET route sans query, en-tête de requête Cache-Control: no-cache : HTTP200, canonical memlia.fr attendu, CSP connect-src none, worker-src self blob, Cache-Control no-transform et aucun beacon Cloudflare dans le corps/DOM. X-Robots-Tag noindex de la preview conservé.
- Six largeurs 320/375/768/1024/1440/1920, navigation clavier et absence de débordement de la page PASS. Reflow 400 % : viewport effectif 320×225, équivalent à 1280×900 à 400 %, non une action sur l’interface de zoom du navigateur. Le tableau demeure une région défilable locale.
- Captures final-320.png, final-375.png, final-1440.png : parcours de toutes les sections animées puis reduced-motion et retour en haut. Inspection visuelle pleine page et crops mobile : sections opaques, header en haut, message/export visibles ; colonnes du tableau dans leur région défilable, pas un débordement global. Les deux captures historiques ne servent pas de preuve finale.

## Lighthouse : surfaces distinctes, pas de vert distant inventé

Lighthouse 13.4.1, collecteur robots HTTP hors document existant ; audits natifs et seuil95 inchangés. CSP et noindex ne sont pas retirés pour augmenter une note.

- Build final local, mobile 00:58:27 UTC : performance98 / accessibilité100 / bonnes pratiques100 / SEO100.
- Build final local, desktop 00:58:41 UTC : 100 / 100 / 100 / 100.
- Preview Cloudflare 45d4ebe5, mobile 01:00:16 UTC : 95 / 100 / 100 / 69. SEO69 : preview noindex et canonical pointant au domaine de production, pas une route preview indexable. Aucun PASS quatre axes distant revendiqué.
- Mesures intermédiaires conservées : mobile local42 pendant build concurrent et charge système élevée, distant73 pendant les tests ; reprises ci-dessus réalisées après notre build. La charge observée était 163/135/101, ce qui établit la contention, pas une causalité exclusive de chaque variation.

Le seuil quatre axes est obtenu sur le build local ; une mesure de production reste du ressort de la publication après QA, sans confondre preview et production. Si le critère est interprété comme quatre axes verts sur le domaine pages.dev lui-même, il demeure non satisfait : ne pas enlever le noindex de la prévisualisation.

## Traçabilité et état restant

Previews manuels uniquement : 04cd1f8d (avant correction Worker), 45d4ebe5 (correction Worker, déploiement marqué dirty car réalisé avant commit). Le candidat final doit être redéployé depuis le commit poussé et relu avant clôture de la carte. Les preuves et rapports bruts sont joints sur la carte, les captures finales sont dans ce dossier.

Repository gates : le run initial 37551386157 est encore en file lors de la rédaction. API GitHub : runner mac-kevin online/busy ; une autre PR occupe le runner, deux autres runs sont en file. Le résultat local ne remplace pas la conclusion distante. Attendre Repository gates SUCCESS sur la PR mise à jour avant de libérer QA ; aucun second circuit de revue et aucune publication main.

Hotspots touchés : src/layouts/Outil.astro (exception CSP limitée au slug relance), src/data/pages-lastmod.json (seule route relance). Aucun changement des soldes, textes commerciaux ou règles réglementaires.
