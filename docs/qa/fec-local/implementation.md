# Vérificateur FEC local — implémentation et passage en revue

## Résultat et frontière

Route : `/outils-comptables-gratuits/verificateur-fec-local`.
Profil commercial texte à 18 colonnes Débit/Crédit, tabulation ou pipe, UTF-8/BOM ou Windows-1252 choisi. Le Worker ne modifie jamais l’original. Le rapport conserve les indices source (en-tête = ligne 1), les valeurs textuelles et les zéros initiaux. Aucune conversion des montants en flottants : contrôle lexical uniquement ; équilibre non évalué.

Limites affichées avant choix : 20 000 000 octets ; 200 000 lignes de données et 200 000 anomalies. Ces deux plafonds mémoire supplémentaires évitent qu’un petit fichier composé de lignes vides crée des millions d’objets. Au-delà, refus explicite, aucun export partiel déclaré complet. Pagination à 100 ; CSV et JSON complets dans le périmètre. Le CSV neutralise les formules ; le JSON conserve les chaînes originales.

L’exemple fictif produit effectivement une seule anomalie : ligne 4, EcritureDate, 20260230. Une sélection réelle n’est jamais remplacée par l’exemple ; les choix d’encodage/profil restent conservés. Annulation, changement de choix et effacement terminent le Worker et invalident le rapport, sans vider silencieusement le fichier choisi.

## Sources effectivement consultées

- DGFiP : https://www.economie.gouv.fr/dgfip/outil-de-test-des-fichiers-des-ecritures-comptables-fec — page ouverte ; outil officiel de contrôle de structure et distribution 1.00.10b. Ne prétend ni identité avec Test Compta Demat, ni couverture équivalente.
- Légifrance : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000027804775 — API officielle PISTE via catalogue Hermes : article A47 A-1 identifié VIGUEUR. La lecture web intégrale est refusée HTTP 403 ; aucun contournement. Ne pas prétendre avoir lu intégralement cet article en direct.
- BOFiP : https://bofip.impots.gouv.fr/bofip/9028-PGP.html — version servie BOI-CF-IOR-60-40-20-20170607 ouverte, référence au même article ; §10 en-tête, §70 champs à blanc, §180/190 pièce, §210 montants signés obligatoires et §220 variante Montant/Sens. Les règles restent techniques et bornées ; aucune obligation de remise, échéance, sanction ni conclusion fiscale ajoutée.
- Brief 05 et contrat commun : branche `strategy/outils-ia-t_6c7dba9d`, dossier `docs/strategy/site-v3/outils-ia-vague-3`.

Windows-1252 constitue une possibilité de lecture demandée au brief, pas une affirmation sur les encodages légaux. XML, BNC/BA, Montant/Sens et colonnes supplémentaires restent non évalués, jamais déclarés invalides. Un en-tête déplacé reçoit ses anomalies, mais bloque l’interprétation des valeurs. Les contrôles conditionnels non utilisés sont non applicables ; le fond et l’équilibre sont non évalués.

## Tests et preuves

Les tests ont échoué avant création du moteur ; le registre a refusé le nouveau type `outil` avant sa prise en charge. La garde mémoire a échoué avant son ajout. Le test de préservation des choix a montré UTF-8 remplaçant Windows-1252 avant correction.

- `unit.log` : 13 tests moteur/registre PASS ; encodages, dates, largeur, en-tête, profils, 300 anomalies, CSV neutre et plafonds mémoire.
- `astro-check.log` : zéro erreur et zéro warning (hints historiques seulement).
- `build.log` : build complet PASS, 118 tests Python, 578 tests scripts, oracles page/SEO/blog/services/médias/lastmod et audit ressources.
- `browser.log` : 41 contrats FEC/outils/gabarits PASS sur le dernier rendu, dont 12 tests FEC, six largeurs, vrai Worker, copie, exports, refus, annulation et choix préservés. `browser-full.log` conserve le rejeu général précédent : 208 PASS et un FAIL de l’oracle réseau (séparateur de nom de Worker attendu avec point au lieu du tiret réel). Cet oracle est corrigé et repassé dans les 41 tests ; le CI rejouera la suite générale complète.
- `exemple-rapport.json` : véritable sortie du moteur sur le jeu fictif.
- `matrice-skills-05.json` : 64 méthodes classées. Application ciblée sur candidat, pas exécution fictive des connecteurs ; visibilité/indexation/déclin restent ND avant publication.
- Scène HTML propre : `docs/design/fec-local-proof/{index.html,styles.css,content-contract.json}` ; renderer `node scripts/render-proofs-v2.mjs --series=fec --check`. WebP 1600×900, OG 1200×630 ; aucun cadre voisin modifié. Captures 375/1440 conservées après dernier rejeu.

Réseau : le Worker télécharge son script statique same-origin au démarrage ; ce GET ne contient ni valeurs, ni fichier, ni query string. Ce n’est pas « zéro requête HTTP », mais zéro transfert de données du fichier. Les tests interdisent les POST/corps, les destinations externes et le stockage local/session/IndexedDB/cookies. La CSP conserve `connect-src 'none'`, avec `worker-src 'self'` explicite. Le comptage de réussite attend le message Worker, pas le submit asynchrone.

Lighthouse mobile réel : performance 99, accessibilité 100, bonnes pratiques 100, SEO 92. FCP 1,2 s, LCP 2,0 s, TBT 0 ms, CLS 0. Le seul audit SEO déficient est l’accès robots.txt bloqué par la CSP du contexte de mesure (rapport intégral fourni), déjà connu sur les outils voisins. Ce n’est ni une conformité WCAG, ni un score de production. Ne pas ouvrir connect-src pour contourner ce comportement.

## Intégration

Base distante synchronisée : `origin/main` e27800cf. Registre `outil`, intention distincte « vérificateur fec gratuit », canonical absolu, WebPage/WebApplication/BreadcrumbList, source et corps statique. Entrants contextuels hub (collection), service et garanties ; footer généré depuis OUTILS. Ils seront publiés atomiquement avec leur destination.

Les dates des 29 pages non éditoriales suivent le vrai changement du footer. Le rendu du glossaire est reconstruit deux fois avec les outils existants ; ses reçus sont actualisés et la revue R5 conservée/réaffirmée. Affirmations, sources et verdicts sensibles n’ont pas changé. Aucune seconde revue métier sollicitée pour un changement de chrome.

Hotspots : `src/data/outils.ts`, `src/data/proofs.ts`, `src/layouts/Outil.astro`, `src/data/pages-lastmod.json`, `config/page-intent-contract.json`, registres SEO et oracles sitemap/médias. Recalculer lastmod/reçus après intégration des autres outils, ne pas recopier un ancien rendu.

## Fini public encore à constater

Une seule revue indépendante QA sur ce candidat technique non certifiant. Après PASS et CI verte, fusion puis vérification Cloudflare production/main et memlia.fr : GET sans query avec Cache-Control no-cache, canonical/sitemap/hub/footer/entrants, médias, exemple/import, copie/exports, refus, annulation et six largeurs. Actualiser `publieLe` seulement après observation publique ; conserver URL, déploiement et rapports dans la carte. La phase implémentation ne revendique aucune publication.

Retour arrière : revert du commit d’intégration puis contrôle du déploiement ; supprimer la destination et ses entrants ensemble, pas isolément.
