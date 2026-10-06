# Suivi de circularisation — livraison pour revue QA

## Résultat et frontière

Page construite `/outils-comptables-gratuits/suivi-circularisation`, non publiée. Sélection humaine, lettres originales ouvertes/fermées, envoi déclaré, retours historisés, rapprochement explicite, notes additives, relance indicative suspendue sur réponse/refus/désaccord. Calcul décimal exact confirmé moins demandé, sans conversion. CSV UTF-8 BOM neutralisé, JSON de reprise strict avec méthode/paramètres/horodatage et HTML imprimable contenant les lettres et la fiche outil. CSV et JSON passent dans un Worker annulable ; les contrôles de mutation sont désactivés pendant le traitement. Aucun envoi ni réception réalisé par la page.

Les deux fiches F2 sont versionnées dans `docs/strategy/site-v3/cac/outils/`. La source officielle CNCC NEP505 a été ouverte avec Chromium le 6 octobre 2026 : `https://doc.cncc.fr/docs/nep-505-demandes-de-confirmation`, publication affichée 15 mars 2024, copie du premier feuillet dans `nep505-source.txt`. Citation §9 normalisée pour les sauts de ligne du PDF : « Le commissaire aux comptes a la maîtrise de la sélection des tiers à qui il souhaite adresser les demandes de confirmation, de la rédaction et de l'envoi de ces demandes, ainsi que de la réception des réponses. » Pas d'affirmation sur les NEP911/912.

## Vérifications réellement exécutées

- Rouge initial moteur absent, puis tests des huit cas de la fiche ; rouge initial page absente, puis parcours navigateur verts.
- Tests Node circularisation : 13 PASS, dont threads réels, annulation, limites 20 Mo et 100 000 lignes, reprise et refus malveillants.
- `npm run check` : 0 erreur, 0 avertissement, 11 conseils (dont avertissement de dépréciation beforeunload et imports inutilisés).
- `npm run build` : PASS ; 149 tests Python ; suite principale Node 720 PASS, 8 ignorés (contrôles HTTP conditionnels), 0 FAIL ; audits blog/services/pages/Ressources PASS.
- Chromium contre Cloudflare Pages local (`wrangler pages dev`, port 45871) : 10 tests PASS, import CSV/mapping/validation, Worker, annulation, lettre ouverte, neutralisation, chronologie, devise différente, reprise/export/refus.
- `scripts/audit-circularisation.mjs` : six largeurs 320/375/768/1024/1440/1920, pas de débordement global ; viewport CSS 320 correspondant à 1280 à zoom navigateur 400 %. Focus visible vérifié. Après saisie/démonstration : zéro requête, zéro cookie, localStorage/sessionStorage/indexedDB/CacheStorage vides. Import : uniquement assets Worker locaux, aucun POST ni contenu transmis.
- En-têtes HTTP réels locaux : CSP connect-src none, frame-ancestors none, nosniff, Cache-Control no-transform. Pas une vérification de production.
- Renderer du dépôt : `node scripts/render-proofs-v2.mjs --source=docs/design/circularisation-proof --manifest=docs/qa/circularisation/proofs-manifest.json --start=40 --check` PASS. WebP 1600×900 <150 Ko et OG 1200×630 ; visuel propre, sans marque/cartouche/slogan ni date.
- Trois entrants rendus : hub, méthode, garanties ; footer alimenté par collection et sitemap contrôlé. Aucun lien vers service/article CAC non rendu.

## Captures et comparaison

`circularisation-375.png` et `circularisation-1440.png` sont des captures pleine page, exemple et détail ouverts. `historique-fec-375.png` et `historique-fec-1440.png` servent de référence. Même ordre Hero/Promesse/Outil/limites/source/garanties/FAQ/Suite/AppelFinal. La zone pleine largeur convient au journal et aux lettres ; tokens et sections partagés conservés.

Un premier cliché pris après focus avait fixé la navigation au milieu de l'image pleine page et déplacé horizontalement le tableau ; protocole corrigé (blur, tableau à gauche, scroll au sommet). Les captures corrigées et le contrôle ciblé montrent navigation au sommet et avertissement mémoire intégralement lisible. La longueur vient du parcours complet et du détail ouvert, pas d'une refonte du gabarit.

## Intégration et réserves utiles

- État interne `construite-en-revue` dans le plan CAC : propriétaire courant de même requête accepté, toute dérive refusée. Le graphe demeure un projet, pas une déclaration de liens déjà publiés. À la publication, passer à `publiee` et régénérer `build_cac_architecture.py`.
- Ajout au footer : lastmod puis sceaux du glossaire régénérés, revue historique réaffirmée sans changer le fond. Après conflit prendre les dérivés de main puis régénérer, jamais fusionner leurs valeurs à la main.
- Hotspots : outils.ts, proofs.ts, page-intent-contract, test_build.py, page-intent-plan.json et les dérivés ; les quatre outils CAC frères les touchent également.
- La reprise accepte les fichiers de 20 Mo maximum ; aucun XLSX, pièce réelle ni authenticité des retours n'est prétendu. Les dates d'envoi déjà renseignées ne sont pas écrasées ; une correction de base invalide le rapprochement courant mais conserve l'ancien dans l'historique.
- Essai additionnel de taille de texte seule 200 % à viewport déjà 320 px : débordement du chrome partagé observé (distinct du zoom navigateur 400 %). Note de finition, non corrigée hors périmètre ici.
- Le faux positif lexical technique des Worker est isolé sur t_b46e2c8b, indépendant de publication.
- Revue indépendante réservée à t_eaf3bf41, puis publication t_0ca903e2. Aucun déploiement ni fusion dans cette phase.

## Rejouer

`npm ci`, `npm run build`, puis serveur `npx wrangler pages dev dist --ip=127.0.0.1 --port=<port-libre> --show-interactive-dev-session=false`.

`QA_URL=http://127.0.0.1:<port-libre> npx playwright test tests/browser/circularisation.spec.mjs tests/browser/circularisation-import.spec.mjs`

`QA_URL=http://127.0.0.1:<port-libre> node scripts/audit-circularisation.mjs`
