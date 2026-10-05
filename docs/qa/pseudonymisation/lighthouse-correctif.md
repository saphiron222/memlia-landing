# Outil 10 — correctif de livraison sans beacon

## Périmètre

La route `/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec` réexporte les deux handlers GET/HEAD de la fonction Pages ROI déjà livrée. Pas de nouvelle abstraction ni duplication du filtre. La règle `no-transform` est ajoutée seulement pour cette route ; ROI reste inchangé. Les seules routes protégées sont vérifiées par les tests d’en-têtes.

La fonction supprime uniquement le beacon Cloudflare connu (URL exacte et version `/…`), neutralise If-None-Match/If-Modified-Since/Range/If-Range vers l’asset, retire ETag/Last-Modified/Content-Length et rend un corps complet filtré. HEAD suit la même chaîne et rend un corps vide. Erreurs et réponses non HTML passent inchangées. CSP HTTP et meta, scripts locaux, Worker, calculs, saisies, export et paramètres Cloudflare globaux restent inchangés. Aucune donnée utilisateur n’est lue par cette fonction.

## Vérifications du candidat

Tests d’abord rouges : handler absent et règle no-transform absente. Puis tests unitaires ROI/outil 10 verts. `npm ci`, `npm run check`, `npm run build` exécutés avec succès. Dix parcours Playwright sur Astro puis dix sur le runtime réel Pages local PASS : import, refus, protection de l’import, Worker, réseau/stockage et exports clavier aux six largeurs 320/375/768/1024/1440/1920.

Huit requêtes HTTP réelles sur Pages local PASS (`DELIVERY_URL=http://127.0.0.1:8798 node --test tests/scripts/pseudonymisation-delivery-http.test.mjs`) : GET/HEAD ordinaires, ancien ETag, ancienne date, Range/If-Range. HTTP200, corps HTML complet ou HEAD vide, CSP identique, no-transform, absence ETag/Last-Modified et beacon.

Le déploiement manuel preview Wrangler a échoué sur la récupération du compte. Alternative : déploiement GitHub/Cloudflare de la PR, pas de secret demandé ou réglage global modifié.

## Critère de levée publique, non encore acquis

La QA est uniquement technique ; la revue antérieure du fond est conservée. Après CI et cette revue, intégrer puis constater Cloudflare SUCCESS et rejouer les huit requêtes sur URL de déploiement et domaine. Rejouer les parcours du vrai navigateur. Exécuter `npm run lighthouse -- https://memlia.fr/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec --robots-crawler` en mobile puis avec `--desktop`. Conserver chaque LHR brut et compagnon collector, sans retoucher les scores. Le collecteur opt-in existant utilise un GET robots hors document et l’audit natif inchangé ; connect-src none n’est pas relâché. Les quatre axes doivent être ≥95 ; la preview noindex ne peut pas acquérir ce critère public.

Mettre à jour le rapport de publication et le registre `publieLe` au 05/10/2026 à partir du constat de PR62, puis du constat de ce correctif. GSC, backlinks et citations J+7/J+28 restent ND sans données réelles. Aucun seuil public n’est revendiqué dans cette phase d’implémentation.

Retour arrière : PR de revert limitée à la fonction outil 10 et sa règle d’en-tête, CI puis Cloudflare et recette publique. ROI n’est pas retiré.
