# Générateur prompt IA — correctif beacon de livraison

## Cause et correction limitée

Le 5 octobre 2026, la route publique `/outils-comptables-gratuits/generateur-prompt-ia-gratuit` présente deux scripts Cloudflare Insights (beacon simple et versionné), tous deux bloqués par la CSP locale. Chromium constate quatre messages CSP et deux tentatives de requête. Le code applicatif et la CSP ne sont pas en cause ; la transformation de livraison ajoute des scripts incompatibles avec la confidentialité locale.

La fonction de cette route réexporte les handlers GET/HEAD ROI existants. Ils filtrent uniquement les deux variantes Insights via HTMLRewriter, retirent les validateurs et la longueur du corps avant filtrage, neutralisent les requêtes conditionnelles/Range et rendent HEAD sans corps. `Cache-Control: public, max-age=0, must-revalidate, no-transform` reste limité à cette route et au ROI préexistant : aucun réglage global, aucun changement CSP, moteur, contenu ou export. Les ajouts indépendants PR99/PR101 doivent être conservés lors des fusions.

## Qualification réelle

- Deux tests de non-régression rouges sur la base publiée (fonction et règle de route absentes), puis verts. Six tests générateur/ROI PASS. Le test ROI de liste figée est remplacé, comme PR101, par le contrat d’absence de règle globale.
- `npm run build` repris en processus suivi après timeout du transport : sortie finale 0 ; le premier lancement interrompu n’est pas une preuve de build complet.
- `npm run check` : zéro erreur, zéro warning, neuf hints préexistants.
- Runtime Wrangler Pages 4.101.0 : fixture réelle contenant deux beacons, tous deux retirés ; quatre scripts non ciblés conservés (local, autre origine, JSON-LD et inline).
- Huit requêtes GET/HEAD (no-cache, ETag ancien, date ancienne, Range/If-Range) : HTTP200, corps complet GET, HEAD vide, CSP exacte et no-transform, validateurs originaux absents.
- Chromium sur Pages local : aucun beacon dans le DOM, aucune tentative Insights, aucune erreur console/page ; bundle générateur `_astro` conservé. Une sonde initiale cherchait à tort un nom de bundle non compilé : corrigée au contrat de bundle réel, ce premier échec n’est pas attribué au produit.
- Onze parcours existants `tests/browser/prompt-ia.spec.ts` PASS sur Pages : copies/exports exacts, refus sans perte, remplacement, pas de réseau/stockage après chargement, SEO/entrants et six largeurs.

## Lighthouse brut et collecte robots

Ordre des scores : performance / accessibilité / bonnes pratiques / SEO. Lighthouse13.4.1 ; rapports JSON complets et fichiers `.collector.json` conservés dans les preuves de carte. Aucun audit ni score n’est réécrit.

| Origine | Collecte robots | Mobile | Desktop |
|---|---|---|---|
| Production AVANT correctif | Native dans le document | 97/100/92/92 | 100/100/92/92 |
| Production AVANT correctif | HTTP hors document, audit natif | 95/100/92/100 | 98/100/92/100 |
| Pages local correctif | Native dans le document | 93/100/100/92 | 100/100/100/92 |
| Pages local correctif | HTTP hors document, audit natif | 98/100/100/100 | À collecter dans la livraison |

Le collecteur natif robots est soumis à `connect-src 'none'` ; le collecteur HTTP hors document existant mesure séparément robots sans modifier l’audit natif. Un SEO100 hors document ne doit pas être annoncé comme score natif. Le mobile local93 reste un résultat brut sous95, non masqué par98 du second passage ; aucun seuil stable de performance n’est revendiqué.

## État et suite

Phase implémentation : la CI PR et la revue technique unique seront consignées sur les cartes de passage. Ni fusion ni production post-correctif n’est revendiquée ici. La réserve publique reste ouverte jusqu’au constat de la livraison : CI verte, QA unique PASS, build intégré, déploiement Cloudflare canonique réussi et domaine/déploiement vérifiés sans erreurs beacon, Lighthouse mobile/desktop natif et HTTP hors document archivés. Cette amélioration indépendante ne retarde pas la publication06 déjà effectuée.

Retour arrière : retirer uniquement la fonction de cette route et sa règle Cache-Control ; ne pas toucher aux routes ROI, bibliothèque02 ou outil10, ni à la CSP.
