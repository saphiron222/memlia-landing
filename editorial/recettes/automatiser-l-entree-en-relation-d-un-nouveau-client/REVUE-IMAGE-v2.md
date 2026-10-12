PASS — revue visuelle indépendante de la couverture onboarding client v2

Reviewer : qa, Hermes / openai-codex / gpt-6.1-sol, carte t_9b185e18 ; candidat produit par un autre agent.
Contrôles achevés le 12 octobre 2026 à 23:46:17 Europe/Paris.
Génération : exec-9ae9f716-1f67-4cb5-b6f2-f83e7162d0a1, OpenAI natif Codex.
Périmètre : couverture et ses dérivés locaux uniquement. Référence : MEMLIA-RECETTE-IMAGES-BLOG-2026-10-12.md. Avis ancien avec main non applicable.

Contrôles exécutés et constats

1. brief-six-components — PASS
   Sujet, composition, style, palette, interdits et alt présents dans brief.json. Les objets observés concordent : dossier vert ouvert en bas à gauche, trois plateaux verts en haut dont celui de droite vide, plateau graphite avec une feuille en bas à droite. Prompt du brief identique à la provenance et au prompt réellement demandé/restitué par Codex. Le prompt historique contient « matte ceramic » ; terme conservé honnêtement, non présenté comme faisant partie du bloc historique de référence. Le rendu observé reste géométrique, mat, isométrique et aéré, sans scène photographique de bureau ni papier découpé.

2. generation-constraints — PASS
   Source, WebP1200, AVIF1200 décodé et OG réellement regardés avec vision_analyze. Lumière douce du haut gauche et ombres vers le bas/droite, fond crème, verts et graphite, matières mates. Aucun texte, lettre, chiffre, logo, filigrane visible, personnage, main, portrait, donnée client, écran/interface, rouge, symbole d'envoi, coche ou sceau de certification constaté. Aucun défaut visuel déterminant.

3. fictive-provenance — PASS
   Scène abstraite de feuilles vierges, non document client et non interface simulée. Journal natif Codex : prompt reconstitué ligne6774, appel tools.image_gen__imagegen ligne6780, génération completed ligne6783 le12/10/2026 à13:14:52.606Z (15:14:52.606 Paris). PNG du résultat natif, fichier generated_images, pièce jointe et source du paquet strictement identiques. Provenance jointe également identique ; modèle exact et coût non communiqués, aucun nombre inventé. Aucune génération ni dépense effectuée par QA.

4. recognizable-subject — PASS
   Le dossier ouvert, les feuilles reçues, le plateau vert vide et le plateau graphite séparé rendent lisibles la préparation et l'incomplétude. Vignettes320×180 et sociale320×168 réellement regardées : ces éléments demeurent distincts sans texte. OG1200×630 réellement regardé : tous les objets restent dans le cadre, y compris plateau vide et feuille graphite ; aucune coupe essentielle. Le sens administratif est cohérent ; l'image seule ne prouve ni vigilance ni certification, ni processus réglementaire particulier.

5. technical-derivatives — PASS
   Neuf fichiers décodés et confrontés à l'inventaire : source1672×941 et huit sorties. MasterPNG1920×1080 ; OGWebP1200×630 ; AVIF/WebP768×432,1200×675,1600×900. Dimensions, formats, tailles et empreintes concordent. Les trois AVIF ont marque avif et compression AV1, bien que sharp rapporte le conteneur heif. Les huit sorties reproduites depuis la source avec les opérations de la forge sont identiques octet pour octet. Le master est redimensionné depuis1672×941, non une génération native1920×1080. Source à empreinte e9698ec711d0e64110ddd2aa93d8ca611e2c67f96e2f0b14bb98a9d7db799637.

6. alt-information — PASS
   « Dossier ouvert et plateaux de pièces, dont un vide, avec une feuille dans un plateau d’examen distinct. »
   Longueur calculée :103 caractères, sous125. Description du manque et de la séparation sans donnée nominative, slogan ou promesse de conformité. Le mot examen décrit l'intention éditoriale du plateau séparé, pas une certification observée.

Palette — OBSERVATION, pas conformité exacte

Comptage indépendant sur320×180=57600 pixels, tolérance RGB45, résultats identiques à la mesure fournie :
   #fcfbf7 :38480 pixels,66,80555555555555 %
   #fffefb :254 pixels,0,4409722222222222 %
   #27b657 :8 pixels,0,01388888888888889 %
   #1c8a41 :6574 pixels,11,413194444444444 %
   #231f20 :1915 pixels,3,324652777777778 %
Les deux écarts cosmétiques papier et vert clair, sous l'objectif indicatif0,5 %, restent conservés en OBSERVATION ; aucune régénération ou nouvelle revue de fond demandée.

Preuves

   preuve-provenance-qa.json et verify-provenance.py : provenance corroborée au journal natif, comparaison des octets et prompt, alt103 ; exécution terminée0.
   preuve-derives-qa.json et verify-images.mjs : décodage, métadonnées, reproduction des huit sorties et palette indépendante ; exécution terminée0.
   Fichiers réellement vus : couverture-v2-revue/source-originale.png, hero-1200.webp, og.webp ; avif-1200-decode.png ; vignette-320.png ; vignette-og-320.png.
   Sept empreintes de conservation du corps, des avis acquis, des deux reçus CMF et des deux figures concordent avec le paquet. Contrôle de conservation seulement, pas nouvelle revue métier.
   Branche de livraison lue : site/onboarding-client-t_0380a3db, tête23c70cf687281ac7344fabbd8a9ebed6a268b374, état Git propre. Candidat non modifié par QA.

Actions requises pour la livraison, sans reprise de cette revue

Platform peut projeter fidèlement cet avis pour cette génération uniquement, image/brief/alt/provenance et observations de palette, puis suivre la matérialisation et le scellement natifs. Conserver les avis de fond et les figures acquis, et l'ancien avis image en historique. Le présent PASS ne vaut pas intégration, push, CI de la nouvelle tête, fusion, déploiement ou vérification publique ; ces étapes restent à t_0380a3db. Aucune correction demandée sur le paquet examiné.
