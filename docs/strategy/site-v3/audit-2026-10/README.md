# Rejouer les relevés

Exécuter depuis la racine de memlia-landing, après npm ci. Ce dossier est un audit, pas une modification du site.

1. SSL_CERT_FILE=/etc/ssl/cert.pem python3 docs/strategy/site-v3/audit-2026-10/evidence-scripts/crawl.py
2. Même préfixe pour assets.py et crawlers.py.
3. node docs/strategy/site-v3/audit-2026-10/evidence-scripts/browser.mjs puis desktop.mjs, settled.mjs et contact-check.mjs.
4. npm exec --yes --package=@unlighthouse/cli@0.19.1 -- unlighthouse-ci --site=https://memlia.fr --disable-dynamic-sampling --samples=1 --reporter=jsonExpanded --output-path=docs/strategy/site-v3/audit-2026-10/unlighthouse
5. extract-perf.py récupère le JSON embarqué dans les rapports HTML statiques. Pour les reprises, utiliser Lighthouse 13.5.0 et cpuSlowdownMultiplier=1, identiques au premier passage ; ne pas mélanger avec la version 13.4.1 du dépôt.
6. QA_URL=https://memlia.fr npx playwright test tests/browser/outils.spec.ts tests/browser/tools-d.spec.ts tests/browser/charte-ia.spec.ts tests/browser/prompt-comptable.spec.ts tests/browser/prompt-ia.spec.ts tests/browser/verificateur-prompt.spec.ts tests/browser/roi-automatisation.spec.ts tests/browser/maturite-ia.spec.ts tests/browser/bibliotheque-prompts.spec.ts tests/browser/pseudonymisation.spec.ts

Les données compactes sont versionnées. Le paquet complet HTML/captures/Unlighthouse/tests est attaché à la carte t_a80f53ec. Ne pas interpréter un score SEO 92 dû au fetch robots bloqué par CSP comme un robots invalide. Ne pas exploiter une capture pleine page avant défilement comme preuve de blocs vides. Les chiffres de performance sont des mesures de laboratoire, pas des CWV terrain ni un INP.

Aucun message de contact ni rendez-vous ne doit être envoyé pour rejouer cet audit.
