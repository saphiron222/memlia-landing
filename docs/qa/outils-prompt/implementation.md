# Générateur de prompt comptable — état d’implémentation

Carte : `t_371a73be`. Route : `/outils-comptables-gratuits/generateur-prompt-expert-comptable`.

## Ce qui fonctionne

- Moteur partagé `src/lib/prompt-comptable.mjs`, déterministe et sans modèle.
- Quatre amorces préparatoires : demande de pièces, synthèse de notes, checklist, transmission interne. Tâche, entrée, format, validateur et arrêt configurables.
- Description abstraite bornée à 20–300 caractères sur une ligne. Chiffres, coordonnées, URL, balises, caractères de contrôle et quelques demandes explicites de décision automatique refusés. Ce filtre ne détecte pas tous les noms et n’anonymise rien.
- Prompt éditable avec sept rubriques, frontière en trois colonnes et trois cas fictifs à rejouer. Les cas décrivent des attentes, pas des réponses inventées d’un modèle.
- Contrôle structurel après édition ; copie et export `.txt` bloqués si rubriques/gardes manquent ou signal sensible explicite. Le contrôle ne comprend pas le sens et n’atteste aucune règle comptable.
- Une édition n’est jamais remplacée sans confirmation. Charger une autre amorce conserve le prompt ; annuler remplacement/effacement le conserve aussi.
- Événements `memlia:outil` locaux limités à `action` et `outil`. Les annulations ne comptent pas comme réussite. Aucun serveur de collecte inventé ; une conversion n’est pas déduite d’un clic.
- Hub : catégorie Écrire ; footer généré ; lien contextuel depuis Méthode ; lien sortant vers le guide existant `prompt-chatgpt-expert-comptable`. Le guide publié n’est pas modifié ici.

## Preuves exécutées

Le test moteur a d’abord échoué sur l’import du moteur absent, puis passe : quatre groupes couvrant toutes les amorces, choix hors catalogue, refus et altérations de rubriques/gardes.

Au dernier rejeu du candidat :

| Commande | Résultat réel |
|---|---|
| `npm run check` | 0 erreur, 0 avertissement, 10 indications préexistantes |
| `node --test tests/scripts/prompt-comptable.test.mjs` | 4/4 |
| `npm run test:proof` | 118/118 |
| `QA_URL=http://127.0.0.1:4391 npx playwright test tests/browser/prompt-comptable.spec.ts tests/browser/outils.spec.ts` | 32/32 sur le HTML réellement construit et servi par Astro preview |
| `node scripts/render-proofs-v2.mjs --check` | 40 actifs conformes ; seuls les deux nouveaux actifs ajoutés, anciens pixels inchangés |
| `npm run build` avant le passage de minuit Paris | vert : 118 preuves Python, 548 tests du lanceur scripts, audit Ressources PASS |
| `npm run build` après minuit | rouge sur un test préexistant de cache blog, reproduit isolément ; réparation `t_8dfbb88f` attendue |

Le rejeu navigateur couvre copie et contenu exact du téléchargement, révocation Blob, refus accessibles et focus, quatre amorces, confirmations acceptées/refusées, conservation des éditions, maillage et métadonnées, CSP, zéro requête après armement et zéro localStorage/sessionStorage/IndexedDB. Largeurs 320, 375, 768, 1024, 1440, 1920 ; parcours Tab depuis l’éditeur vers copie/export.

Les captures `capture-375.webp` et `capture-1440.webp` ont été faites après mouvement réduit et retour en haut. Une première capture prise depuis le focus d’export montrait le header sticky au milieu et des sections pas encore révélées : artefact de capture, corrigé par le rejeu. Les captures corrigées ont été inspectées ; sections visibles et aucun contenu recouvert. Les longues valeurs de select peuvent être tronquées au repos sur mobile et restent accessibles dans la liste native ; le texte complet du prompt défile dans son champ.

## Médias et SEO technique

Cadre HTML propre `docs/design/site-v2-proofs/index.html#outil-prompt`, texte figé dans `content-contract.json`, rendu `29-outil-prompt.webp` 1600×900, version sociale 1200×630, tous deux sous 150 Ko. La scène montre un geste, les contraintes, la frontière et l’arrêt, pas une diapositive promotionnelle.

Canonical, H1/OG, schémas WebPage/WebApplication/BreadcrumbList, sitemap, entrée hub et footer vérifiés par navigateur. Contrat d’intention initial inscrit d’après les six suggestions du catalogue du 20/09, sans volume mensuel inventé. Intention d’exécution distincte du guide existant. À réconcilier avec le brief marketing final.

Source CNIL ouverte le 03/10 : FAQ IA générative du 18/07/2024, https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative . Elle éclaire les usages autorisés et le choix des données ; elle ne certifie pas cet outil. Aucune nouvelle règle fiscale, sociale ou comptable calculée.

Lighthouse 13.4.1 réel, rapports complets voisins : desktop 100/100/100/92 et mobile 99/100/100/92 (performance/accessibilité/bonnes pratiques/SEO). Le seul audit SEO rouge est `robots-txt` : le chargement réseau par Lighthouse est refusé par `connect-src 'none'`. Le fichier public se vérifie séparément ; aucune réduction de la CSP pour améliorer artificiellement le score. Le plancher SEO 95 n’est donc pas déclaré atteint.

## Ce qui manque avant livraison

1. Brief et matrice exhaustive SEO/Blog de marketing `t_6c7dba9d` : skills applicables avec preuves et N/A motivés. Les deux skills déjà chargés sont free-tools et memlia-site-design ; pas de prétention de couverture exhaustive à ce stade.
2. Réparation indépendante de l’oracle de cache blog `t_8dfbb88f`, puis build/CI complets verts. Le fichier `tests/scripts/blog-forge.test.mjs` est identique à la base `origin/main` ; échec après reprise à la ligne 478, quatre fetchs au lieu de trois.
3. Unique QA `t_b3f1ff96`, puis fusion et constat production `t_6d974686`. Ces cartes portent déjà l’exigence SEO/Blog élargie.

La bibliothèque et le vérificateur dédiés sont autorisés avec les huit autres idées par la nouvelle demande de Kevin. Ils peuvent partager le moteur ; cette carte ne crée pas de routes concurrentes pour ses amorces et son contrôle inline.
