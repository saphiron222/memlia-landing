# Recette A — six pages et corrections de composition

15 octobre 2026. Branche locale `site/coherence-figurines`. Prévisualisation préparée sur une copie noindex/nofollow ; le lien immuable et les contrôles distants sont ajoutés après son déploiement. Aucun déploiement de production ni fusion.

## Résultat contrôlé

Deux accueils, Méthode, À propos, Garanties et Contact utilisent les scènes A. Six scènes propres : Méthode réutilise l’image approuvée, cinq nouvelles images ont été générées séparément. Les grilles, étapes, cartes et panneaux reprennent la famille des fiches robots. Après les captures de Kevin, les surfaces vertes sont devenues continues et partagent les jetons du hub ; les longues demi-pages vides ont été recomposées en deux ou trois colonnes. Le hub intégrations et les guides restent différés.

## Vérifications locales

- Astro : 108 pages compilées ; types sans erreur ni avertissement, 40 indications non bloquantes. Régénération, registre lastmod et audit des ressources PASS.
- 47 tests Node ciblés PASS, dont vrai rendu Astro des onze sections, témoin de contenu, catalogue, images, routage, liens et contrats. 15 contrôles du catalogue et de livraison rejoués après les ajustements de dates : PASS.
- 139 scénarios navigateur couverts sur les pages et composants affectés, dont images, légendes, formats responsifs DPR 1/2, ancres, clavier, focus, mouvement réduit, sans JavaScript, formulaire et robots. Le premier passage a révélé six attentes périmées du gabarit vidéo et du libellé de navigation ; elles ont été adaptées à la recette approuvée. Le rejeu de leurs fichiers avec les robots et les pages éditoriales valide 44/44 scénarios. Aucun test ignoré ni retry automatique.
- Les six blocs verts sont comparés à la signature du hub en couleur, arrondi et marge intérieure ; chaque cellule interne doit être transparente. Les grilles occupent la rangée sur ordinateur et s’empilent sur mobile. Toutes les images sont réellement chargées (`naturalWidth`), avec dimensions explicites.
- Inspection réelle dans le navigateur intégré à 375 et 1440 px : scènes, fondateur, contact, bandes vertes et sections recomposées. Captures automatisées complémentaires à 768 px et jusqu’à 1920 px pour les composants partagés. Preuve de direction visuelle complète, contrôleur `check-evidence.js` PASS ; il ne remplace pas l’inspection.
- Lighthouse final : accueil mobile 99/100/100/100. Méthode, À propos, Garanties et accueil CAC sur ordinateur : 100 sur les quatre axes. Contact : 100/100/96/100 ; l’API de contact est absente du serveur statique local et journalise cette indisponibilité. Le repli courriel et les erreurs du widget sont testés ; aucun message réel envoyé.
- Export Markdown et `llms-full.txt` : 100 pages générées et vérifiées depuis le contenu final. Positionnement après export : 15 tests PASS, 280 surfaces texte contrôlées. Les termes fonctionnels « date de lecture » et « date du contrôle » évitent la confusion avec des notes internes ; deux images de restitution ont été régénérées depuis leurs démonstrations.
- Ancres et liens de corps des six anciennes pages conservés ; seuls les liens de téléchargement des deux vidéos retirées et la description de la vidéo CAC quittent les pages. Champs, script et consentements du contact identiques. Aucune modification des corps scellés des articles, services ou recettes de guides.
- Images sociales propres aux six pages via le pipeline JPEG existant, canonical de production, un seul H1, schémas et sitemap contrôlés. Les démonstrations fictives des 21 robots restent intactes dans leur fonctionnement ; aucune collecte fiscale ou sociale réelle.

## Limite préexistante

Le contrat global conserve le seul échec de `service-forge` sur les 24 erreurs historiques de titres/intention des services. Ses autres clauses, le positionnement et les contrats des articles passent. Les garde-fous ne sont pas neutralisés et aucune fusion n’est annoncée comme prête pour la production.

Sources, prompts exacts, planche des six scènes et rapports : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/coherence-figurines/2026-10-15/`. Captures finales : `qa/production/`. Documentation : `docs/strategy/site-v3/coherence-figurines/`, notamment `DECISION-A.md`, le manifeste de production et le témoin de contenu.
