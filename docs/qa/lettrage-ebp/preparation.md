# Lettrage EBP : candidat préparé, 7 octobre 2026

## État

Recette D8 préparée, non scellée et non publiée. Auteur de recette : dev ; auteur public : kevin. Une seule revue métier indépendante est attendue. Aucun essai dans EBP n’est allégué. Le gabarit historique reste inchangé.

L’aide officielle EBP a été ouverte le 7 octobre : https://support.ebp.com/hc/fr/articles/360011494518. Elle concerne EBP Comptabilité sans version chiffrée ; elle décrit lettrage manuel, équilibre des lignes et assistant de lettrage automatique. La préparation ne remplace pas ce dernier. Les critères de référence, d’unicité et d’arrêt sont une règle de cabinet illustrative.

La preuve Google du 6 octobre provient de l’archive jointe à t_5b286083, copiée sans modification. Neuf suggestions distinctes, aucun volume de recherche revendiqué.

## Vérifications exécutées

- Nouveau test de recette : échec observé avant création (recette absente), puis 1/1 PASS.
- `npm run guide:preparer -- lettrage-ebp` : PASS, état prepare.
- `npm run test:guide-forge` : 17/17 PASS.
- `npm run test:guide-render` : 1/1 PASS (fixture isolée).
- `npm run guide:audit` : PASS, deux états dont le candidat préparé.
- Prévisualisation Astro isolée du vrai candidat : construction réussie, H1/canonical et liens entrants `/integrations` et `/automatisation/saisie-comptable` vérifiés. Collections injectées uniquement dans le dossier de prévisualisation ; aucun faux avis ni sceau.
- Chromium aux largeurs 320, 375, 768, 1024, 1440 et 1920 : H1 exact et unique, aucun débordement horizontal. Captures pleines pages, plus références lettrage Sage et article pilier blog. Desktop et mobile du candidat sont joints ici.
- Image dédiée : WebP réellement rendu 1600 × 900, moins de 150 Ko, cas et textes non rognés. Le contrôle des polices et rectangles est celui de la forge.
- `npm run test:proof` : 150/150 PASS après les étapes normales de retrait des briefs et de rendu des sources publiques.

## Build global : défaut amont distinct

`npm run build` s’arrête dans `tests/scripts/blog-intent-preservation.test.mjs` : « prompt-chatgpt-expert-comptable : H1 sans requête mesurée par l’autocomplétion ». Le test et `scripts/lib/blog-title-intent.mjs` sont identiques à origin/main ; le candidat n’y change rien. La PR152 porte déjà la correction de fixture datée, mais sa CI était encore FAILURE au contrôle. Aucun contournement ni changement de la porte dans cette carte. La première exécution isolée des preuves sur dist incomplet avait trois échecs dus aux étapes publiques non exécutées ; elles ont été exécutées et les 150 tests repassent.

## Après l’avis métier

Sceller le candidat accepté, ajouter sa requête au contrat d’intention et au registre SEO avec statut de publication non encore constaté. Régénérer les données dérivées, rejouer la chaîne complète et la CI, puis fusionner la PR. Vérifier `guide:publier`, canonical/H1/indexabilité/image/sitemap sur le domaine réel, sans query string et avec Cache-Control no-cache. Les suivis J+7/J+28 partent de la date réellement constatée, pas de la date de préparation.

## Observations non bloquantes du gabarit existant

Les badges du tableau HTML sont tous verts (les libellés restent distincts), tandis que l’image dédiée distingue les états. La miniature mobile est complétée par le tableau HTML responsive et le texte alternatif. Les grands espacements et la séparation Source/renvois/CTA sont conservés pour rester cohérents avec les guides historiques. Aucun défaut nouveau du gabarit n’a été élargi dans cette livraison.
