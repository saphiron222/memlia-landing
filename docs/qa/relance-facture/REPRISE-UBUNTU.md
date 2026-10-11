# Reprise technique du 8 octobre 2026 — PR155

Carte t_f4b40722. Intégration de main 0a2e3d5a incluant la migration Ubuntu/quatre parts, sans publication ni seconde revue. Dix conflits résolus : ajouts de registres/proofs conservés des deux côtés ; dérivés de glossaire repris de main puis régénérés. Le contrat comportemental accueil de la précédente correction reste en place, sans réintroduire un snapshot HTML. Aucun changement des sources du moteur relance ou des textes produit.

Le premier build reproduit une provenance périmée du renderer partagé dans proofs-manifest.json (un échec). Rejeu réel par render-relance-facture-proof.mjs : HTML, oracle, WebP et OG conservés, provenance renouvelée ; build séquentiel suivant vert. Aucun assouplissement de contrôle.

Exécutions réelles dans le workspace de la carte :

- npm run regen:generated : sortie 0, deux exécutions séquentielles.
- npm run build : sortie 0, journal migration-build-final.log.
- npm run check : sortie 0, journal migration-check.log.
- Onze parcours Chromium sur le build intégré local : PASS sans retry ; import, saisie, calcul, édition, copie réelle, TXT/CSV relus, effacement, stockage complet, six largeurs, reflow équivalent 400 % et captures après parcours des animations.
- Lighthouse 13.4.1, audits natifs et collecteur robots HTTP hors document : mobile 95/100/100/100 ; desktop 100/100/100/100, rapports bruts du 08/10 04:42–04:43 UTC. Service Astro local uniquement, pas une preuve Cloudflare.

La conclusion Repository gates du candidat poussé, sa preview Cloudflare et le rejeu distant restent à obtenir avant clôture. Le noindex de Pages doit rester : aucun PASS SEO distant ne sera déduit du score local. Les cinq captures modifiées par la précédente tentative sont préservées dans captures-preservees et un stash nommé, sans réécriture.

Hotspots : src/data/proofs.ts, config/page-intent-contract.json, tests/scripts/accueil-render.test.mjs, registres dérivés de glossaire et pages-lastmod. Une seule revue QA précréée t_7d981a8b ; aucun merge main dans cette carte.
