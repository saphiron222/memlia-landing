# Images de partage des outils

Le gabarit `Outil.astro` et le hub émettent la même URL absolue `https://memlia.fr/...` dans `og:image` et `twitter:image`, via `SITE.url`. Les chemins des images affichées dans le corps ne changent pas.

Le contrat `scripts/verify-page-contract.mjs` exige une seule `og:image`, URL absolue d’origine `https://memlia.fr`, sans identifiants, pour chaque page indexable. Les pages `noindex` ne sont pas concernées par cette nouvelle règle.

Recette du 06/10/2026 :
- Test négatif observé en échec avant correction sur `/proofs/alpha.webp` ; après correction, 18 tests de contrat PASS (relative, HTTP, domaine tiers, domaine trompeur, absence et doublon refusés).
- Build complet PASS ; contrat sur 61 pages rendues PASS.
- Registre lastmod synchronisé après le premier build ; seules les 14 pages concernées changent (13 outils indexables et hub). Aucun contenu métier ni sceau de ressources ne change : audit ressources PASS sans rescellement.
- Contrôle HTML de toutes les 55 URLs du sitemap du build : `og:image` et `twitter:image` uniques et absolues, 55/55 PASS.
- Revue QA indépendante unique : PASS, tests de contrat, lastmod, build complet et contrôle des 55 images rejoués indépendamment.
- Relevé public avant livraison : 55 URLs, 41 conformes et 14 avec images relatives.

Après fusion, relever les deux balises sur toutes les URLs du sitemap servi et inspecter `https://memlia.fr/outils-comptables-gratuits/verificateur-fec-local` dans LinkedIn Post Inspector. Une réponse HTTP 200 de l’inspecteur seul ne prouve pas le rendu de la carte.
