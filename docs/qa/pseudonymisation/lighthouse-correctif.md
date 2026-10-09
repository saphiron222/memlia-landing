# Outil 10 — correctif de livraison sans beacon

## Périmètre

La route `/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec` réexporte les deux handlers GET/HEAD de la fonction Pages ROI déjà livrée. Pas de nouvelle abstraction ni duplication du filtre. La règle `no-transform` est ajoutée seulement pour cette route ; ROI reste inchangé. Les seules routes protégées sont vérifiées par les tests d’en-têtes.

La fonction supprime uniquement le beacon Cloudflare connu (URL exacte et version `/…`), neutralise If-None-Match/If-Modified-Since/Range/If-Range vers l’asset, retire ETag/Last-Modified/Content-Length et rend un corps complet filtré. HEAD suit la même chaîne et rend un corps vide. Erreurs et réponses non HTML passent inchangées. CSP HTTP et meta, scripts locaux, Worker, calculs, saisies, export et paramètres Cloudflare globaux restent inchangés. Aucune donnée utilisateur n’est lue par cette fonction.

## Vérifications du candidat

Tests d’abord rouges : handler absent et règle no-transform absente. Puis tests unitaires ROI/outil 10 verts. `npm ci`, `npm run check`, `npm run build` exécutés avec succès. Dix parcours Playwright sur Astro puis dix sur le runtime réel Pages local PASS : import, refus, protection de l’import, Worker, réseau/stockage et exports clavier aux six largeurs 320/375/768/1024/1440/1920.

Huit requêtes HTTP réelles sur Pages local PASS (`DELIVERY_URL=http://127.0.0.1:8798 node --test tests/scripts/pseudonymisation-delivery-http.test.mjs`) : GET/HEAD ordinaires, ancien ETag, ancienne date, Range/If-Range. HTTP200, corps HTML complet ou HEAD vide, CSP identique, no-transform, absence ETag/Last-Modified et beacon.

Le déploiement manuel preview Wrangler a échoué sur la récupération du compte. Alternative : déploiement GitHub/Cloudflare de la PR, pas de secret demandé ou réglage global modifié.

## Critère de levée publique — acquis le 05/10/2026

La QA est uniquement technique ; la revue antérieure du fond est conservée. Après CI et cette revue, intégrer puis constater Cloudflare SUCCESS et rejouer les huit requêtes sur URL de déploiement et domaine. Rejouer les parcours du vrai navigateur. Exécuter `npm run lighthouse -- https://memlia.fr/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec --robots-crawler` en mobile puis avec `--desktop`. Conserver chaque LHR brut et compagnon collector, sans retoucher les scores. Le collecteur opt-in existant utilise un GET robots hors document et l’audit natif inchangé ; connect-src none n’est pas relâché. Les quatre axes doivent être ≥95 ; la preview noindex ne peut pas acquérir ce critère public.

Mettre à jour le rapport de publication et le registre `publieLe` au 05/10/2026 à partir du constat de PR62, puis du constat de ce correctif. GSC, backlinks et citations J+7/J+28 restent ND sans données réelles. Aucun seuil public n’est revendiqué dans cette phase d’implémentation.

Retour arrière : PR de revert limitée à la fonction outil 10 et sa règle d’en-tête, CI puis Cloudflare et recette publique. ROI n’est pas retiré.

## Constat après livraison

PR99 MERGED après Repository gates SUCCESS et QA technique t_3a4ad04e PASS ; revue antérieure du fond conservée. Cloudflare Pages `68abbf2c-2740-4af4-9a41-26ed871ed271` SUCCESS au main `0473e1662acf24ffb630e6399e82f0afec83b44f`, check GitHub 111971538823. Domaine et https://68abbf2c.memlia.pages.dev : 16 contrôles HTTP et 20 parcours Chromium PASS après succès du déploiement ; 36 vrais exports CSV/rapport/mapping au clavier aux six largeurs, sans beacon, erreur console/page ni POST/payload observés. CSP identique, aucun paramètre global changé.

Lighthouse public mobile 96/100/100/100, desktop 100/100/100/100 (performance/accessibilité/bonnes pratiques/SEO), version 13.4.1, mesures 21:07 UTC. Commande qualifiée existante `--robots-crawler`, collecteur robots HTTP hors document et audit natif inchangé. Les quatre axes ≥95 sont acquis avec ce protocole ; pas de revendication d’un résultat robots natif dans le document sous `connect-src none`. Rapports `.lighthouse/mobile-2026-10-05T21-07-17-681Z.json` et `.lighthouse/desktop-2026-10-05T21-07-28-979Z.json`, avec leurs companions collector, archivés bruts sans retouche sur t_5abc28b0.

Le constat PR62/3535c1b de t_6136db60 fonde la date initiale `publieLe` au 05/10/2026. Les métriques GSC/backlinks/citations J+7/J+28 restent ND. Voir `rapport.md` pour les résultats et la provenance complète. Les étapes prospectives ci-dessus documentent le protocole employé, désormais exécuté.
