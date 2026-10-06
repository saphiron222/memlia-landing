# Rejeu des neuf preuves historiques

## Cause et correction

`render-proof-images.mjs --check` exigeait encore 21 candidats : les neuf preuves
fonctionnelles et douze déclinaisons des anciennes couvertures de blog. Les couvertures
actuelles ont leur propre chaîne et leurs entrées ne dérivent plus de `public/proofs/`.
Après installation par `npm ci`, le contrôle échouait donc avec `9 !== 21` alors que
les neuf PNG avaient déjà passé leur comparaison d'octets.

Le lot obligatoire reste constitué des neuf entrées distinctes du contrat fonctionnel.
Le total des candidats est désormais ce lot plus les dérivés déclarés dans le manifeste
avec une source `public/proofs/`. Un dérivé encore déclaré reste obligatoire : sa source
doit être connue et ses octets sont réencodés puis comparés. Aucun actif retiré du
manifeste n'est réintroduit.

Les comparaisons des neuf PNG, des neuf WebP, des empreintes de rendu et des sources
restent en place. Le contrôle refuse aussi une cible de manifeste dupliquée et une
source ou une taille d'actif divergente. Le manifeste est rafraîchi uniquement pour
l'empreinte du script modifié ; les images et leurs empreintes sont inchangées.

## Vérification

- `npm ci --no-audit --no-fund` : installation propre des versions verrouillées.
- `npm run test:proof-render` : reproduction rouge sur la base, verte après correction.
- `node --test tests/scripts/historical-proof-render.test.mjs` : fixture réelle Chromium
  avec neuf preuves et un dérivé, publication puis rejeu, quinze mutations refusées.
  Sur la base, la fixture échoue également (`10 !== 21`).
- `npm run check` : aucune erreur, huit hints sans rapport avec le correctif.
- `npm run build` : PASS, notamment 124 tests Python et 602 tests scripts.
- `git diff -- public/proofs docs/design/m4-r1-functional-proofs/renders` : vide.

Les mutations suppriment ou altèrent un PNG, un WebP et un dérivé, retirent une entrée
requise du manifeste ou du contrat, périment une empreinte, une taille ou la provenance,
dupliquent une cible, altèrent le texte fonctionnel et déclarent une source de dérivé
inconnue. Chaque mutation est restaurée et le dernier rejeu doit repasser.

La CI lance explicitement ce test Chromium. Il reste exclu, avec une raison imprimée,
du lanceur sans navigateur utilisé par Cloudflare Pages. Les rendus binaires historiques
ont été établis sur macOS ; les tests Linux créent une référence dans leur propre fixture
isolée et vérifient la chaîne réelle sans remplacer les références historiques du dépôt.
Le rejeu byte-for-byte des références historiques demeure la commande locale ci-dessus.

## Limites

Ce correctif ne change ni les sources visuelles ni le contenu public, n'actualise aucune
dépendance et ne déploie rien. Une suppression intentionnelle d'un dérivé dans le
manifeste retire ce dérivé du lot attendu ; elle ne retire jamais les neuf preuves
obligatoires. Les changements de dépendances d'une autre branche peuvent nécessiter
un rejeu et une actualisation de la provenance du lockfile sans changer les images.
