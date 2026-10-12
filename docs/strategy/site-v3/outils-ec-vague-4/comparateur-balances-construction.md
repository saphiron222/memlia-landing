# Comparateur de balances — construction du 7 octobre 2026

Route : `/outils-comptables-gratuits/comparateur-balances-comptables`.

## Résultat et décisions

Deux CSV éditables, encodage choisi (UTF-8 strict / Windows-1252), séparateur et mapping explicites ; solde signé ou débit moins crédit. Calcul exact au centime dans un Worker annulable. Dates, même devise et comparabilité doivent être confirmées. Aucune conversion, conclusion de risque ou règle fiscale. Doublons refusés avant autorisation d’agrégation ; provenance et libellés divergents conservés. Seuils montant / pourcentage choisis, règle OU inclusive, référence zéro non calculable.

50 comptes par page et filtre de lecture : totaux, copie et rapport versionné restent complets. Les comptes nouveaux / disparus sont distingués d’un compte présent de solde zéro. Effacement explicite, aucun stockage automatique, aucune source modifiée. Charger l’exemple ou lire un fichier demande accord avant remplacement d’une saisie. Une édition du CSV requalifie la provenance en saisie éditée.

## Vérifications réellement exécutées

- Test initial moteur en échec (fichier absent) ; test navigateur initial en échec (route absente), avant implémentation.
- Moteur : 23 tests Node PASS, y compris signes, zéro, 00123, doublons, multilignes, seuil exact et limites cumulées.
- Livraison : 2 tests Node PASS (GET/HEAD, cache, CSP, retrait beacon ; HTML canonique/schema/entrants/sitemap et scène liée au moteur).
- Deux tests historiques d’en-têtes mis à jour avec la nouvelle route : PASS ; commande ciblée totale 27 PASS.
- 14 parcours Chromium PASS sur le HTML construit servi par Wrangler Pages local (pas seulement Astro dev) : import réel, mapping, calcul, confirmations, montant ambigu, doublons, HTML inerte, 300 comptes nouveaux et deux disparus exportés, copie réelle, annulation réelle du Worker et reprise, fichier supérieur à 10 Mo, reset, six largeurs.
- Six largeurs 320/375/768/1024/1440/1920 sans débordement de page ; tableau horizontal focalisable au clavier. 320 px couvre le reflow équivalent à 1280 px / 400 %.
- Réseau après chargement : aucun fetch/XHR/ping lors de l’exemple, du calcul ou de l’export ; localStorage, sessionStorage et cookies inchangés. Les assets Worker auto-hébergés sont du code, pas une transmission des saisies.
- CSP de la réponse HTTP : `connect-src 'none'`, objets interdits, frame-ancestors none ; Cache-Control no-transform ; GET 200. Fonction de route retire les deux formes du beacon Cloudflare, ne lit aucune saisie.
- `astro check` : 0 erreur, 0 warning, 14 hints historiques.
- `npm run regen:generated` PASS ; `npm run build` PASS (portes requêtes, blog, services, guides, pages, 150 preuves Python, Node, dernier audit Ressources).
- Lighthouse Pages local : mobile 99/100/100/100 ; desktop 100/100/100/100. Robots collectés par HTTP hors document, audit natif inchangé. Rapports bruts conservés.
- Preuve HTML 1600×900 produite par le moteur testé, scène propre relue ; WebP <150 Ko et OG 1200×630. Renderer adopt puis check PASS. `generate-balances-proof.mjs --check` vérifie le calcul.
- Entrants méthode/pilier existants vérifiés en production par GET no-cache sans query : 200 ; troisième entrant hub et footer générés depuis le registre. Nouvelle route présente dans le sitemap outils construit.

## Limites et transmission

Construction et recette locale terminées, pas de publication sur memlia.fr dans cette phase. La revue QA puis la publication appartiennent aux enfants existants. Le déploiement manuel de prévisualisation a rencontré une authentification Cloudflare insuffisante ; aucune connexion ni secret modifié. La recette HTTP a donc été exercée dans Wrangler Pages local, avec les vraies Functions et les en-têtes ; la prévisualisation distante automatique est à contrôler via la PR si disponible. Ne pas confondre cette preuve locale avec un déploiement public.

Faux positif du contrôle de copie sur une option Worker technique : reformulation vers la construction Worker classique déjà employée dans le dépôt, comportement testé inchangé. Correction du contrôle sur carte indépendante t_473a329f, non parente de la publication.

Hotspots : registre outils, contrat d’intention, registre requêtes, pages méthode/pilier, en-têtes et inventaires des tests. Réactualiser main avant fusion et régénérer les données dérivées si nécessaire. Les suivis J+7/J+28 partent de la publication réelle, pas de cette construction.
