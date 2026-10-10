# Assistant de lettrage comptable local — construction

## Résultat

Page `/outils-comptables-gratuits/assistant-lettrage-comptable-local` construite depuis origin/main. Moteur exact au centime (BigInt), import CSV strict 10 Mo/20 000 lignes dans un Worker annulable, décisions individuelles réversibles, pagination et rapport complet. Aucun accès métier, stockage ou transfert de données. Références différentes jamais rapprochées ; références identiques prioritaires ; sans référence, unicité exigée par montant dans le groupe sans référence. Identifiants, comptes, tiers et devises comparés comme textes exacts : aucun nettoyage silencieux. La colonne facultative `lettre` exclut les mouvements déjà lettrés. Le rapport distingue les décisions actuelles, rejets et exclusions ; original inchangé.

## Vérifications réelles

- Test initial absent observé avant implémentation ; 12 tests moteur PASS, dont 20 000 lignes/10 000 paires sans réutilisation d’identifiant, limites, encodages, citations multilignes et neutralisation des formules.
- 16 tests Node ciblés moteur et livraison PASS (`docs/qa/lettrage/node-tests.txt`).
- 11 parcours Chromium locaux PASS ; 11 parcours sur le déploiement Cloudflare PASS, dont six largeurs 320/375/768/1024/1440/1920, décisions et exports, erreur conservant la saisie, annulation, copies et stockage. Reflow équivalent 400 % de 1280 à 320 CSS px ; tableaux focalisables et défilables au clavier. Rapports et captures : `docs/qa/lettrage/`.
- Déploiement de prévisualisation : https://a456af7f.memlia.pages.dev/outils-comptables-gratuits/assistant-lettrage-comptable-local ; copie de dist explicitement noindex/nofollow, canonical production conservé, jamais publication sur main.
- 8 contrôles GET/HEAD réels PASS sur Cloudflare, sans query, Cache-Control no-cache, cache conditionnel et Range : CSP connect-src none, absence de beacon, no-transform, aucun ETag/Last-Modified du corps avant filtrage.
- Après chargement, import/calcul/décision/copie/export : aucun appel de données ; seule lecture locale du script Worker autorisée, stockage navigateur identique avant/après.
- Preuve générée directement depuis `EXAMPLE_CSV` et le moteur : index.html/styles.css/content-contract.json, 1600×900 WebP et OG 1200×630 ; moins de 150 Ko chacun. `node scripts/render-lettrage-proof.mjs --check` PASS ; contrôle visuel effectué.
- `npm run check` : 0 erreur/0 warning, 14 hints existants. `npm run regen:generated` et `npm run build` PASS, incluant 150 tests Python, audits blog/service/guide/Ressources, contrôle des requêtes et 814 tests Node (798 PASS, 16 SKIP de livraison sans URL explicite). Les tests HTTP propres à cet outil sont tous rejoués séparément sans SKIP.
- Lighthouse sur le candidat indexable local, collecte robots HTTP hors document et audit natif : mobile 99/100/100/100 ; desktop 100/100/100/100. JSON bruts conservés. La preview noindex n’est pas présentée comme un audit SEO de production.
- Trois entrants : hub et guides lettrage Sage/Cegid. Guides existants en production vérifiés HTTP 200 avant ajout. Footer généré et sitemap incluent le nouvel outil ; canonical/H1/og:title/JSON-LD testés.
- Mesure Google fr/fr gratuite réelle le 07/10 : une suggestion identique `lettrage comptable excel`. Rafraîchissement réel de `prompt chatgpt expert comptable` requis par la fixture de build vieillie ; aucun changement d’article ni volume inventé.

## Limites et reprise

Le CSV de rapport est volontairement non importable comme écriture ou lettrage définitif et ne reprend pas automatiquement les décisions dans une nouvelle session. Pas de combinaison 100/60/40, de tolérance, conversion ni choix arbitraire. Accepter documente une décision dans le rapport seulement.

Les premières captures pleine page omettaient des sections animées non traversées ; recette de capture historique appliquée : parcours progressif, attente de révélation, retour en haut, défilement des tableaux remis à zéro. Aucun changement du chrome pour ce défaut de capture.

Premier déploiement Wrangler refusé à cause de la priorité d’un jeton d’environnement non adapté ; reprise avec OAuth existant, sans lecture/écriture de secret ni configuration globale.

Hotspots signalés : src/data/outils.ts, config/page-intent-contract.json, src/data/integrations.ts, registre-requetes.json ; ajouts limités à cet outil. Données dérivées et glossaire rescéllés uniquement pour le footer, sans modification du fond réglementé.

## Livraison

Reprise du contrat global réseau/stockage : l’échec de Repository gates (run 37570493887, 548 PASS / 1 FAIL) est reproduit sur la preview avant correction : scénario lettrage absent, sans fuite constatée. Ajout du parcours réel import CSV → paire unique → accepter → refuser → export complet vérifié → réinitialiser. Le contrat exige zéro stockage local/session/IndexedDB et autorise exactement une lecture GET du script Worker statique, sans query ni donnée saisie. Le même test global passe ensuite sur Cloudflare. Preuves : `docs/qa/lettrage/network-before.txt` et `network-after.txt`. Aucun changement du moteur, de l’interface ou de la politique réseau ; CI distante à vérifier avant transmission QA.

Reprise du 07/10 : intégration non destructive de main et résolution des conflits de données dérivées par les commandes du dépôt ; sondes Google des deux branches conservées ensemble. Le conflit de fusion empêchait GitHub de déclencher le workflow du candidat précédent. PR160 est désormais fusionnable et Repository gates est créé (run 37569286064), mais encore en file sur le runner partagé. Aucun succès CI distant revendiqué.

Vérifications rejouées après intégration : régénération PASS, 16 tests moteur/livraison PASS et Astro check PASS ; build complet PASS après relance en processus suivi (la première tentative a été interrompue par le plafond du terminal). Sur la prévisualisation existante de l’outil inchangé : 11 parcours Chromium PASS, sortie 0, et 8 contrôles HTTP PASS sans SKIP. Le premier rejeu navigateur avait terminé ses 11 assertions mais dépassé son délai de sortie ; seul le second rejeu terminé sert de preuve. La prévisualisation reste celle de l’outil avant intégration de main, pas une preuve de déploiement du nouveau commit de fusion. Pas de fusion vers main ni publication.

PR code et rapports sur branche `site/assistant-lettrage-local`. Revue QA unique : enfant t_365b8154 ; publication et recette memlia.fr : enfant t_ed656739. Pas de fusion ou publication dans cette phase. Publication : vérifier CI, QA, surface réelle sans query avec no-cache et créer suivis J+7/J+28 depuis la date réelle ; mettre `publieLe` dans le registre seulement alors.
