# Checklist — livraison production sans beacon

Le GET réel après PR164 contient un script Cloudflare Pages Analytics malgré `no-transform`. La CSP bloque son exécution : zéro requête après chargement constatée, mais la présence du script viole le contrat public.

La route checklist réutilise directement le handler GET/HEAD anti-beacon du ROI, déjà livré et testé : filtrage HTML, `connect-src 'none'`, `no-transform`, retrait des validateurs du corps avant filtrage et des demandes conditionnelles/plages. Ni moteur, ni saisie, ni réglage global Cloudflare modifié.

Reproduction : tests navigateur checklist sur `QA_URL=https://memlia.fr` (six échecs sur la seule présence du script), test de liaison observé rouge avant création de la route. Vérification : tests `checklist-delivery-function` et `roi-delivery-function`, puis CI Repository gates et nouvelle recette HTTPS. La revue QA acquise est conservée ; aucun changement de comportement métier.
