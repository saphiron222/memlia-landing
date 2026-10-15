# Recette de la proposition figurines — 15 octobre 2026

Prévisualisation : https://b5fd040f.memlia.pages.dev/apercu/direction-figurines

Périmètre livré : le hub robots enrichi des sources officielles et imports logiciels ; un atelier de comparaison de deux recettes ; une page Méthode pilote complète ; le plan des six déclinaisons. Les pages commerciales courantes et `/integrations` ne sont pas remplacées avant le choix des images et la fin du chantier Claude, conformément à la demande de Kevin.

- Build Astro et régénération des artefacts PASS, 108 pages. Vérification de types : zéro erreur et zéro avertissement, 39 indications non bloquantes.
- 29 tests Node ciblés PASS, dont catalogue robots, images, sécurité et contrats des deux routes de proposition.
- 14 scénarios navigateur locaux PASS : cinq pour les sources, l’atelier et le pilote, neuf de non-régression du hub et des fiches robots. Mobile 375, tablette du hub 768 et bureau 1440, clavier, focus, sans JavaScript et mouvement réduit.
- Cinq scénarios distants PASS sur la prévisualisation finale. Une réponse transitoire « Nothing is here yet » de Cloudflare Pages a été observée immédiatement après le déploiement ; le site a ensuite été ouvert réellement, les trois routes contrôlées en HTTP 200, puis les cinq scénarios rejoués avec succès. Aucun retry automatique ni contrôle désactivé.
- Les neuf logos et les deux images sont chargés réellement : contrôle de `complete` et `naturalWidth`, pas seulement présence d’un élément dans la page.
- Inspection réelle dans le navigateur intégré : Méthode 1440×1000 et 375×812 ; choix A et B visibles sur mobile. Une image interrompue par une reconstruction locale a été rechargée et contrôlée une fois les fichiers disponibles ; le rendu final et les assertions de chargement passent.
- Le hub garde ses six sections. Sources/imports prennent place dans « Construit sur votre cabinet ». Logos hébergés dans le site, sans hotlink, prix, statut Bêta ou partenariat implicite. Le script inclus dans le SVG source data.gouv a été supprimé du dérivé servi.
- Les deux routes `/apercu/*` restent noindex et exclues du sitemap ; H1, titre social et headline JSON-LD cohérents. Les images ont des dimensions explicites, des AVIF/WebP 640/1200, sans texte incrusté.
- Le formulaire de contact, ses consentements, présélections et fonctions d’envoi restent inchangés. Aucun message envoyé. Aucun compte fiscal/social consulté.
- Les fonctions de protection des propositions compilent ; même retrait du beacon, CSP sans connexion distante et cache sans transformation que pour les robots. La prévisualisation est une copie noindex/nofollow, aucun déploiement de production.
- Lighthouse du hub enrichi, ordinateur : performance 100, accessibilité 100, bonnes pratiques 100, SEO 100. Ce score ne représente pas une mesure de toutes les pages proposées.
- Le contrôle global de page conserve uniquement l’échec antérieur de service-forge sur les 24 titres historiques ; aucune nouvelle erreur de rendu ou de métadonnées. La garde des services, le positionnement et les contrats du blog passent. Aucun garde neutralisé.

Rapports, captures et preuve de direction visuelle dans `memlia-landing-sources/coherence-figurines/2026-10-15/qa/`. Le contrôleur `frontend-design-direction/scripts/check-evidence.js` confirme la complétude du dossier ; il ne remplace pas l’inspection visuelle. Les originaux et prompts imagegen y sont archivés, les manifestes versionnés dans `docs/strategy/site-v3/coherence-figurines/`.

Recette des images en attente de choix par Kevin, à partir des deux propositions concrètes. L’extension aux six pages n’est pas présentée comme déjà réalisée.
