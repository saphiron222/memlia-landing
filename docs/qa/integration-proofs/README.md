# Preuves visuelles des guides Intégrations

Les dix scènes sont créées depuis `docs/design/integration-proofs/` et revues
localement avec `node scripts/render-integration-proofs.mjs --check` : ce mode
ouvre Chromium, vérifie polices, texte, cadrage 1600 × 900, absence de coupe,
poids et octets WebP. Le manifeste scelle les sources et les images publiées.

Le builder Cloudflare Pages n'installe pas Chromium. Pendant
`CF_PAGES=1 npm run test:integration-proof-render`, le même script vérifie
**sans navigateur** la présence des dix scènes, l'ordre et les empreintes des
sources, les dix cibles distinctes, leur taille et leurs octets. Une source ou
un actif changé sans nouvelle revue fait échouer le build. Cette vérification
portable ne remplace jamais la revue visuelle locale avant publication.

Le déploiement `edc09e47-860f-492f-a651-9ace9f7c02eb` du 21/09/2026 a
échoué parce que le nouveau renderer lançait Chromium même en mode Cloudflare.
Relancer ce même SHA ne peut pas le corriger : il faut une nouvelle révision
testée localement, puis vérifier le build Pages et l'URL de production sur le
SHA exact. Les tests de régression sont dans
`tests/scripts/integration-proof-render.test.mjs` (sain, source altérée,
image altérée, scène manquante).
