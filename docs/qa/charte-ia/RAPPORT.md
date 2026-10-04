# Outil 04 — recette locale et transmission

État : implémentation locale exécutée, candidate à la revue indépendante QA. Ni publication ni revue finale acquises dans ce rapport. Une nouvelle phase est nécessaire pour la CI distante, la décision QA, puis l’intégration et le rejeu de production. Route prévue : https://memlia.fr/outils-comptables-gratuits/generateur-charte-ia-cabinet.

## Décision et périmètre

Trame originale non officielle, construite sans modèle distant, API, compte, cookie ou stockage. Trois usages : relance sur dossier fictif, synthèse fictive, reformulation. Données fictives, informations publiques ou descriptions internes de processus, toujours sans données personnelles, clients ou confidentielles. Aucun dossier réel autorisé. Les rôles manquants restent « à compléter » et alimentent la checklist. Les choix de validation organisent le contrôle de chaque résultat ou le contrôle avant toute diffusion/intégration ; l’exploration interne non relue reste un brouillon sans décision.

Ce bornage est explicite au formulaire et dans les exports. Les usages sur dossiers réels demandent un cadrage distinct ; aucune conformité, obligation datée, certification ou conclusion fiscale/juridique nouvelle n’est affirmée. La QA est la revue adaptée à cette interaction non normative, sans deuxième file métier automatique.

## Résultat et saisies

- Aperçu éditable en texte, jamais injecté comme HTML.
- Questionnaire modifié : aperçu ancien conservé et exports suspendus jusqu’à une nouvelle génération.
- Clause éditée : confirmation avant remplacement ; un refus ou une annulation conserve les clauses.
- Copie et fichiers .md/.txt : exactement la version affichée, avec statut non officiel attaché.
- Impression : même texte ; PDF A4 réellement produit et relu par extraction, sans navigation ni formulaire.
- Réinitialisation et exemple : confirmation avant effacement/remplacement des saisies existantes.
- Erreur inline, focus vers le champ en défaut, rôle alert, statut sobre et contrôles natifs.

## Cas réellement exécutés

Les tests ont d’abord échoué faute de moteur puis de page. L’ajout du type SEO `outil` a d’abord échoué sur le validateur existant avant le changement d’une ligne.

| Cas | Résultat constaté |
| --- | --- |
| Relance + synthèse fictive | Seulement ces deux clauses d’usage ; fréquence et prochain contrôle visibles |
| Rôle responsable vide | À compléter + checklist, aucun nom inventé |
| Fichier client vers IA publique, chaque famille de données | Refus expliqué ; version éditée conservée ; export bloqué |
| Clause ajoutée puis changement du questionnaire | Annulation conserve la clause ; confirmation explicite la remplace |
| Exports Markdown et texte | Octets comparés au texte imprimable de l’aperçu ; identité vérifiée |
| Copie autorisée et copie refusée par le navigateur | Presse-papiers identique ; repli sélectionnable annoncé |
| Impression | PDF créé avec les clauses et la mention non officielle ; texte extrait relu |
| Champs vides, usage inconnu, date impossible, texte trop long | Refus par le moteur |
| Clavier et six largeurs | Génération via Entrée ; pas de débordement horizontal à 320/375/768/1024/1440/1920 |
| Traitement local | Aucun appel après chargement lors de la saisie/génération et des changements de largeur ; localStorage/sessionStorage/cookies vides ; aucune base IndexedDB |

## Commandes et preuves

- `npm ci` : succès ; quatre vulnérabilités préexistantes (une moderate, trois high), aucune mise à jour de dépendance dans cette carte.
- `node --test tests/scripts/charte-ia.test.mjs` : 6 PASS.
- `node --test tests/scripts/seo-registres.test.mjs` : 22 PASS.
- `npm run check` : 0 erreur, 0 warning, 10 hints existants. Log `astro-check.log`.
- `npm run build` : sortie 0 ; 118 tests proof, 552 tests scripts dans la suite agrégée, contrat de page de 49 pages et audit ressources PASS. Log `build.log`.
- `QA_URL=http://127.0.0.1:4330 npx playwright test tests/browser/charte-ia.spec.ts` sur le build statique : 3 PASS. Les six largeurs sont dans le troisième test.
- `node docs/qa/charte-ia/check-rendered-page.mjs` : HTTP 200, canonical propre, H1/OG/headline identiques, WebPage/WebApplication/BreadcrumbList, sitemap, trois entrants hub/méthode/garanties, copie, exports et PDF. Résultat `.qa/charte-ia/page-report.json`.
- Scène dédiée `docs/design/charte-ia-proof/` : HTML/CSS/contrat ; WebP 1600×900 et OG 1200×630, tous deux sous 150 Ko ; polices chargées, pas de texte tronqué ou masqué. `node scripts/render-charte-ia-proof.mjs --check` PASS. Manifeste `proofs-manifest.json` ; preuve non générée par IA et non recyclée.
- Captures pleine page charte et outil marge à 375/1440, inspectées. Placeholder long raccourci ; effacement remis en action secondaire ; choix hors périmètre explicitement signalé.
- Matrice exhaustive : `matrice-skills-04.json`, 64 entrées de la colonne 04. N/A motivés, méthodes réutilisées et preuves alternatives, mesures après publication distinguées des contrôles locaux. Pas de score de visibilité ou de volume inventé. Autocomplete parent conservé dans `demande-autocomplete.json` : aucune suggestion pour la requête 04.

## Sources effectivement rouvertes

Le 4 octobre 2026, contenu courant extrait avec les outils Hermes :

- CNOEC, https://www.experts-comptables.fr/travaux-data-et-ia : la page propose le livret « Comment utiliser ChatGPT ? », avec cas d’usage, précautions et une charte d’utilisation de l’IA générative en cabinet. La trame Memlia est distincte ; aucun modèle officiel recopié.
- CNIL, https://cnil.fr/fr/comment-deployer-une-ia-generative-la-cnil-apporte-de-premieres-precisions, publié le 18 juillet 2024 : besoin concret, liste d’usages autorisés/interdits, limites, déploiement sécurisé, réutilisation des données, formation et gouvernance. La page souligne les résultats inexacts plausibles. Ces recommandations fondent la prudence opérationnelle, pas une attestation de conformité du cabinet.

Une première URL CNIL présumée a répondu « page non trouvée » et n’est pas utilisée ; la source ci-dessus a ensuite été recherchée et ouverte avec succès.

## Réserves partagées, sans résultat fabriqué

Lighthouse 13.4.1 local desktop ET mobile : performance 100, accessibilité 100, best practices 100, SEO 92. L’audit robots explique exactement : `Fetch of robots.txt failed ... CSP violation`. L’HTTP indépendant vérifie robots 200 et sitemap réel. La CSP `connect-src none` reste intacte ; ne pas l’affaiblir pour gonfler le score. Ces mesures ne sont pas des Core Web Vitals de terrain.

Le hero hérite de `loading=lazy` et sans priorité du composant partagé ; le lot A traite précisément cette zone. Ne pas recopier son correctif : synchroniser à la livraison puis rejouer. Le gabarit partagé utilise encore le vocabulaire « calcul / calculateur » dans des sections communes et un aside adapté aux petits calculateurs ; la longue interaction le rend moins pertinent. La QA doit qualifier cette présentation pour le nouveau type de document, sans refonte silencieuse du hub ni des outils historiques. Les quatre FAQ propres à la charte sont présentes ; aucune prétention WCAG globale.

## Glossaire : preuve de chrome, pas nouvelle revue métier

Le footer généré ajoute l’outil sur toutes les pages et modifie le HTML du glossaire. Un worktree témoin `../baseline` sur `origin/main` a été construit. `check-glossary-chrome.mjs` compare le `<main>` sérialisé : identité complète ; seul le chrome change. Les 77 affirmations rendues et les 27 verdicts métier existants sont conservés par l’instrument de réaffirmation du dépôt. Aucun contenu du glossaire ni source réglementée modifié.

Deux reconstructions effectives (`replay-chrome-build.mjs`) reproduisent la même sortie. Le nouveau reçu `chrome-build-receipt.json` remplace le pointeur dans le manifeste ; anciennes ancre/déclaration et ancien rapport restent intacts à leur emplacement historique. L’ancre de cette opération et son rapport sont dans `glossary-sujet-ancre.json` / `glossary-reaffirmation.json`. Les derniers pointeurs du rapport suivent le reçu reconstruit après la réaffirmation ; le verdict n’a pas changé.

## Transmission de revue et publication

Une seule revue indépendante QA est attendue pour cette livraison. Vérifier la CI du PR, rejouer la recette, qualifier les réserves communes ci-dessus, puis créer une carte de publication pour le profil platform après approbation. Cette carte doit intégrer le changement, constater le déploiement Cloudflare réussi et refaire les mêmes contrôles sur https://memlia.fr sans query string avec `Cache-Control: no-cache`, y compris un export réel et les six largeurs. `publieLe` du registre SEO demeure null tant que la publication n’a pas eu lieu ; le mettre à jour sur la phase de livraison, sans confondre date de candidat et date publique.

Retour arrière : revenir par PR sur le commit de cette fonctionnalité si la production échoue, en conservant les outils historiques. Aucune fusion ni déploiement de production n’est réalisé par cette phase d’implémentation.
