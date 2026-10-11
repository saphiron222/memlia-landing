# AVIF hors index des moteurs

## Décision

La règle `/*.avif` de `public/_headers` ajoute `X-Robots-Tag: noindex` aux 87 fichiers AVIF actuels et aux futurs AVIF. Aucun asset ni balisage picture n’est modifié. Les WebP/PNG restent indexables ; robots.txt ne bloque pas les AVIF, pour laisser les moteurs lire la directive.

Cloudflare documente le splat avec suffixe (exemple `/*.jpg`) : https://developers.cloudflare.com/pages/configuration/headers/ . Une fonction Pages ou un déplacement des fichiers est donc inutile.

## Vérifications d’implémentation

- Test de contrat `tests/scripts/avif-indexability.test.mjs` : 2 échecs observés avant correction, puis 3 tests PASS. Inclus automatiquement dans `npm run test:scripts` et le build.
- `npm run build` PASS ; suite scripts : 705 PASS, 8 skipped, 0 échec.
- Wrangler Pages local : HEAD sur `img-24-suivi-production-sociale-1200.avif` → 200, image/avif, X-Robots-Tag: noindex ; WebP homologue → 200, image/webp, sans X-Robots-Tag.
- Prévisualisation réelle : https://1aaae868.memlia.pages.dev ; AVIF et WebP répondent 200. Pages ajoute automatiquement noindex aux déploiements de prévisualisation, y compris sur WebP : la comparaison de restriction doit donc être confirmée sur l’apex après fusion.
- Production avant fusion : AVIF et WebP répondent 200 sans X-Robots-Tag.

## Après revue QA PASS et fusion

Attendre la publication automatique Cloudflare, puis :

    curl -I https://memlia.fr/images/img-24-suivi-production-sociale-1200.avif
    curl -I https://memlia.fr/images/img-24-suivi-production-sociale-1200.webp

Attendu : AVIF noindex, WebP sans restriction. L’envoi manuel IndexNow est facultatif selon la consigne de Kevin sur la carte ; Crawler Hints est actif. Ne pas confondre directive déployée et disparition immédiate des résultats : celle-ci dépend de la réexploration Bing/Yandex.

Retour arrière : retirer seulement le bloc `/*.avif` via une PR. Les CSP et règles de cache ne changent pas.
