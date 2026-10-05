# Outil 06 — générateur de consigne IA texte professionnelle

## Livraison d’implémentation

PR : https://github.com/saphiron222/memlia-landing/pull/90
Route prévue : https://memlia.fr/outils-comptables-gratuits/generateur-prompt-ia-gratuit
Cette phase ne revendique ni publication ni revue QA. QA unique : t_4e800353 ; intégration et constat public : t_219b84a7.

## Comportement et décisions

- Quatre amorces génériques : rédiger, résumer, classer, préparer une réunion. Aucun contexte comptable par défaut.
- Socle neutre `composePromptBlocks`, version 1, partagé avec le générateur cabinet ; ses anciennes sorties restent inchangées.
- Les formats texte/tableau/JSON décrivent la future réponse du modèle, jamais une réponse obtenue. Le schéma JSON est parseable, compilé et exercé par Ajv sur un exemple valide et un invalide.
- Prévisualisation des choix sans écraser l’éditeur. Une nouvelle génération demande confirmation si le texte a été édité. Copie et exports reprennent exactement l’édition affichée ; l’export JSON est une enveloppe `{version,prompt}` UTF-8.
- Objectif 20–1500 caractères ; autres bornes visibles ou exposées par erreur reliée au champ. Refus explicites pour objectif absent, caractères/coordonnées/liens, contradictions explicites avec l’arrêt et demandes de génération image/vidéo. Le filtre n’est ni exhaustif, ni une analyse sémantique, ni une anonymisation.
- Local déterministe, aucun modèle, API ou stockage utilisateur. Changer le formulaire laisse l’ancien texte et ses exports disponibles : ils restent une édition humaine et ne prétendent pas refléter les nouveaux choix.
- Trois entrants : hub, méthode, générateur cabinet. Le vérificateur 07 n’était pas publié dans la base initiale ; le générateur cabinet le remplace par un passage qui nomme le besoin professionnel hors cadre comptable. Pas de lien vers une route absente.

## Preuves exécutées

- Test moteur rouge initial (fichier absent), puis tests verts : moteur/version, réunion/public/actions/arrêt, formats déterministes, bornes/refus, schéma Ajv et intégrité du média. Non-régression du moteur cabinet et registre SEO jouée.
- Chromium : 21 parcours PASS, dont 11 propres à 06 et 10 du générateur cabinet. Copie presse-papiers réelle et repli, téléchargements réels relus exactement, annulation remplacement/exemple/effacement, données conservées après refus, tous les exemples et formats, reload et absence de données URL, six largeurs 320/375/768/1024/1440/1920, clavier et boutons ≥44 px.
- Réseau armé après chargement : zéro requête pendant saisie/génération/copie/export ; localStorage/sessionStorage/IndexedDB vides, cookies inchangés ; télémétrie limitée à action et outil.
- Astro check final après réinstallation des dépendances du diagnostic intégré : zéro erreur.
- Build complet final PASS : 130 tests Python, 665 tests scripts, audit Ressources PASS. Contrastes réellement calculés à six largeurs, normal/focus : 12 états, 120 champs, texte ≥4,5 et bordure ≥3, focus visible.
- `node docs/qa/prompt-ia/verifier-candidat.mjs` PASS : H1 unique, OG/canonical, types WebPage/WebApplication/BreadcrumbList, pas BlogPosting, primaire outil unique, corps statique, trois entrants, sitemap et médias.
- Renderer existant avec `--source=docs/design/prompt-ia-proof --manifest=docs/qa/prompt-ia/proofs-manifest.json --start=1`, rendu puis `--check` PASS. Scène propre 1600×900 et OG1200×630 ; WebP 71572 et 36440 octets, polices chargées, texte sans coupe. Inspection complète du visuel PASS.
- Captures pleine page 1440/375 examinées. Sur mobile, le premier sélecteur d’arrêt était tronqué : libellé raccourci. La capture faite depuis le résultat plaçait artificiellement la navigation fixe au milieu : reprise depuis le haut, réserves visuelles levées pour l’état capturé, sans prétendre avoir supprimé le comportement fixe commun.
- Lighthouse local brut, collecte robots HTTP hors document et audit natif : premier desktop 100/100/100/100 ; premier mobile 91/100/100/100 (TBT320ms, CLS0) ; deuxième mobile 67/100/100/100 pendant exécutions concurrentes. Ces chiffres sont de vraies mesures, pas une preuve du seuil 95 ; performance mobile à confirmer et traiter dans la QA/publication.

## Intégration et incidents de vérification

La base est passée de 503de2ed à 818320af pendant la phase. Le nouveau diagnostic a été intégré en conservant ses ajouts, en combinant les entrées du registre et en régénérant dates/scellements Ressources. Le corpus du glossaire et sa revue en vigueur ne sont pas rejugés. Les premiers builds ont révélé successivement inventaire média/sitemap à étendre, sceau Ressources à réaffirmer, puis base de publication non intégrée et compteur média fusionné à corriger. Ces contrôles n’ont pas été désactivés. Le renderer a été rejoué après son évolution upstream ; le test d’intégrité a d’abord relevé sa version périmée.

Reprise après timeout : le run CI 37295256513 a refusé la base de publication devenue plus récente, sans nouveau défaut du moteur. Reproduction locale : 130 tests Python, un échec et seize erreurs avec la même cause. Intégration de `origin/main` au commit 57279fde sans conflit ni retrait de garde ; la documentation de publication du diagnostic est conservée. Rejeu : Astro check zéro erreur, douze tests moteur/preuves PASS, vingt et un parcours Chromium PASS et vérification du candidat SEO/maillage PASS. Le premier build de reprise a été interrompu par la limite de durée de l’outil ; il n’est pas revendiqué complet. Le build complet et la CI sont rejoués avant transmission à la QA. La réserve Lighthouse mobile reste ouverte.

Les logs complets et captures sont conservés dans l’archive de preuves jointe à la carte. La couverture des 64 skills est explicite dans `couverture-skills.json` : application au produit, contrôle local réel, instrument remplacé, N/A motivé ou observation ND. Pas de connecteur acheté, de soumission externe, de backlinks ou de citation inventés.

## Risques et suite

- QA indépendante et production restent à faire ; aucune URL finale ni indexation n’est prétendue constatée par cette phase.
- La performance mobile n’atteint pas encore le seuil mesuré. Faire une mesure isolée sur candidat et une mesure publique ; ne pas annoncer quatre axes ≥95 avant preuve.
- `npm ci` signale trois vulnérabilités préexistantes (une modérée, deux hautes), hors périmètre ; aucune dépendance ajoutée pour cet outil.
- Le filtre de contradictions peut manquer une paraphrase ; les éditions ne sont pas analysées. Le texte public le dit, le lecteur relit et rejoue le jeu fictif.
- Hotspots : outils.ts/proofs.ts, registre-requetes.json, page-intent-contract.json, lastmod, tests/proof/test_build.py et sceaux Ressources. Préserver les ajouts 02/07/08 au moment de la publication.
- Retour arrière prévu : revert de la PR intégrée et rollback Cloudflare vers le déploiement précédent, à renseigner dans le rapport public. Aucun rollback nécessaire/exécuté ici.
