# Reprise CI du 7 octobre 2026

Carte t_f4b40722, PR155. Aucun nouveau circuit de revue, aucune publication main.

## Défaut signalé et correction

Le contrat commun `tests/browser/outils.spec.ts` ne connaissait pas le générateur de relance. Reproduction réelle rouge contre la preview Cloudflare 59815ec6 : « Scénario réseau à définir pour l’outil generateur-relance-facture-impayee ».

Scénario ajouté : import CSV fictif, confirmation du regroupement, calcul du solde 90 EUR, édition, copie réelle dans le presse-papier, TXT/CSV téléchargés et relus, effacement. Le contrôle commun exige toujours zéro stockage. Playwright observe le Worker en mémoire : une seule URL blob de même origine est acceptée pour relance ; aucune URL HTTP n’est exemptée. Le contrat est ensuite vert contre la même preview.

## Intégration main

Main c1e7a5c33d42ae3d58450e166d5136dd4bd22305 intégré par merge, sans réécriture de l’historique. Conflits des documents et registres dérivés résolus depuis main, puis lastmod, surfaces et réaffirmation de revue recalculés par leurs scripts existants. Aucun texte produit ou réglementation modifié par cette reprise.

Le build intégré reproduit également un défaut d’oracle hérité de main : `accueil-render.test.mjs` fige tous les octets HTML de la page d’accueil. L’ajout légitime d’un outil modifie footer et assets communs. Ce snapshot est retiré ; le test existant de vrai build reste et compare les onze sections par défaut à leur contenu EC explicite, avec injections de contenu et priorité des titres. Ce contrat comportemental est vert dans le build global.

## Exécutions réelles

- `npm run build` : sortie 0, journal complet `reprise-build-green.log` dans le workspace de la carte.
- `npm run check` : sortie 0, journal `reprise-check.log`.
- Contrat réseau commun sur Cloudflare 59815ec6 : PASS (`network-green.log`). Cette preview correspond à l’ancien candidat, pas au nouveau merge.
- Contrats communs et relance sur le build intégré servi localement : 34 PASS, zéro retry, `reprise-browser.log`. Six largeurs, reflow équivalent 400 %, stockage complet, copie, exports et import couverts. Ce service local n’est pas une preuve Cloudflare.
- Captures relance régénérées pendant ces tests. Anciennes preuves Cloudflare et Lighthouse conservées dans FINALISATION.md ; le noindex de preview reste volontaire, aucun SEO distant >=95 inventé.

## Reste requis

Lire Repository gates sur le nouveau candidat poussé ; vérifier sa preview Cloudflare et rejouer les parcours relance distants. Aucun SUCCESS CI ni preview du nouveau candidat revendiqué ici. QA t_7d981a8b demeure derrière la finalisation. Si le run reste en file, reprise différée de deux heures plutôt que surveillance continue.

Hotspots : tests/browser/outils.spec.ts, src/data/pages-lastmod.json et registres dérivés de glossaire. Les sources commerciales intégrées sont celles de main, non un chantier nouveau.
