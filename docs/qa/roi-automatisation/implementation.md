# Calculateur de ROI — implementation locale

## Résultat
Candidat pour `/outils-comptables-gratuits/calculateur-roi-automatisation`, gabarit Outil et calcul entièrement local. Trois scénarios indépendants éditables, aucun taux ou prix imposé, E vide = inconnu. Capacité valorisée distincte du cash. Comparaison, copie complète, CSV UTF-8 neutre contre les formules de tableur et JSON contenant hypothèses, résultats non arrondis, affichages et conventions.

Le moteur applique le brief 09 : T=V×a×(t×p−c)/60 (p/a saisis en pourcentage), k=max(0,n−d), C=I+kM, net=kE−C, ROI=net/C. Récupération continue après démarrage et depuis le début, indication dans/hors horizon ; zéro investissement = non applicable, E≤M = impossible si I>0. Pas de clamp des temps négatifs.

## Vérifications réellement exécutées
- Test moteur écrit avant le moteur : échec module absent observé, puis 7 tests PASS (nominal, inconnu, négatif, coûts nuls, récupération impossible, délai/horizon, validation et exports).
- Correction de finition pilotée par test navigateur rouge : effacer purge aussi résultats/rapport du DOM, et pas seulement leur visibilité.
- `npm run build` PASS : 124 tests Python ; suite scripts 613 tests Node PASS, plus gardes Blog/Service/Page, renderer blog/intégration, médias et lastmod ; audit ressources QA PASS.
- `npm run check` : 0 erreur, 0 warning, 8 hints préexistants.
- Playwright ROI et outils existants : 32 PASS. Nominal, E inconnu, cash ND, temps négatif, investissement conservé hors horizon, ratio coût nul, refus sans perte, remplacement d’exemple consenti, effacement, copie et exports byte-for-byte, zéro requête après chargement et zéro localStorage/sessionStorage/IndexedDB/cookie observé sur le ROI.
- Six largeurs 320/375/768/1024/1440/1920 : pas de débordement, labels/aria-describedby, clavier et cibles 44px ; reduced-motion. Captures pleines pages 1440 et 375 conservées comme artefacts.
- Source HTML propre de deux scénarios, renderer `--series=roi --adopt` puis `--check` PASS : 1600×900, WebP 61 Ko, OG 1200×630, fontes chargées, texte ni masqué ni tronqué. Valeurs de la scène issues des deux premiers scénarios fictifs, mêmes conventions que le moteur.
- Canonical, H1/OG/headline, WebPage/WebApplication/BreadcrumbList, sitemap, hub/footer et entrants `/methode` et `/automatisation-cabinet-comptable` vérifiés sur le rendu local.
- Lighthouse local desktop : performance/accessibilité/bonnes pratiques 100/100/100 ; mobile 99/100/100. SEO 92 : seul audit SEO en échec = robots.txt du preview Astro, pas la page. Ne pas convertir cela en PASS SEO de production ; à rejouer sur Cloudflare et memlia.fr.
- `git diff --check` PASS. Trois vulnérabilités npm préexistantes signalées par npm ci ; dépendances inchangées.

## Choix et limites
Les mois restent continus, coûts récurrents après démarrage, investissement au début. Calcul sans arrondi intermédiaire, affichage français à deux décimales. Volume entier ≤1 000 000 ; temps ≤100 000 minutes ; coût horaire ≤1 000 000 € ; I/M/E ≤1 milliard € ; délai/horizon ≤1 200 mois ; horizon >0. Limites saisies et explication visibles. Aucun gain garanti, tarif Memlia, avis fiscal ou économie cash dérivée de la capacité.

La zone large est une option activée seulement pour cette comparaison, sans changer la disposition historique des autres outils. Le titre « Formules documentées » évite de présenter les conventions Memlia comme une source officielle. La scène à deux scénarios est volontaire, le produit en compare trois.

L’ajout du footer change le HTML du glossaire sans changer ses affirmations, copies de sources ou verdict métier. Deux reconstructions réelles identiques ont actualisé son reçu ; le script de réaffirmation existant a conservé l’avis R5, sans nouvelle revue ni modification réglementaire. Les fichiers de preuve dérivés suivent cette opération.

## Couverture SEO/Blog et suite
`matrice-skills.json` couvre les 64 cellules de la colonne 09 : application ciblée ou motif N/A ; les instruments spécialisés sont remplacés par les contrôles locaux utiles, sans prétendre avoir exécuté leurs APIs. Mesures de trafic, backlinks, déclin et positions restent ND, à relever seulement après publication (baseline, J+7/J+28).

Le candidat n’est pas encore publié. Une seule revue indépendante QA est requise ; la carte de livraison après QA porte intégration, Cloudflare SUCCESS, URL de déploiement et memlia.fr sans query string avec Cache-Control no-cache, parcours/export/refus, médias/maillage/robots et rapport public. Mettre à jour le registre de requêtes avec la date de publication réellement constatée. Retour arrière : revert du commit d’intégration, jamais suppression silencieuse des pages historiques.

Hotspots : registres outils/requêtes/proofs/lastmod, renderer v2, OutilZone/OutilPreuves et test_build.py partagés avec les autres outils en cours ; intégrer leurs ajouts plutôt que les remplacer.
