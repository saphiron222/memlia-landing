# Audit des logos de compatibilité — 15 octobre 2026

Périmètre : les logos du catalogue commun robots et agents. Aucun changement d’UI, de texte métier, de contact, de build ou de génération publique dans cette passe.

## Résultat

- **356 cartes avec logo, 9 cartes en nom seul, sur 365 cartes.** Les quatre cartes `etat: true` restent sans logo.
- 221 SVG et 135 WebP ; **1 845 361 octets** pour tous les fichiers, au plus **22 483 octets** pour un fichier.
- 35 logos ajoutés à la reprise. Parmi eux : PayPal, les sept cartes Sage, Silae, ADP, Revolut Business, Square, BNP Paribas, Notion, ECMA, Up Déjeuner, Pappers, Booking.com, Infogreffe, Meta, UPS, Veolia et Leroy Merlin.
- Les logos des éditeurs partagés restent identiques entre leurs produits. Chaque carte a son propre fichier portant son id, conformément à R27. Les groupes identiques sont consignés au manifeste ; aucun doublon entre deux marques sans rapport n’a été retenu.

## Sources, sécurité et formats

Les 299 fichiers bruts distincts de la reprise ont été lus comme octets et vérifiés par SHA-256 contre le manifeste sauvegardé : **299/299 conformes**. Les 35 ajouts disposent de leur URL officielle, du SHA du fichier source et de celui du fichier publié : **35/35 conformes**. Les kits Sage, Square, Revolut, PayPal et Etsy ont fourni uniquement des images ; aucun code ni fichier applicatif n’a été exécuté. Les archives n’ont pas été décompressées sur leurs chemins internes : seuls les membres images choisis ont été lus.

Les SVG ont été contrôlés statiquement avant décodage : aucun script, gestionnaire d’événement, `foreignObject`, import, lien ou ressource externe, entité XML ou DTD. Les **221 SVG sont du XML bien formé**. Le décodage des fichiers publics par sharp/librsvg ne produit aucune erreur. Le contrôle de sécurité n’ouvre aucun SVG dans un navigateur ou un interpréteur.

Les formes, couleurs et proportions des marques sont conservées. Les SVG fournis sont inchangés ; le SVG en ligne de Leroy Merlin reçoit seulement le namespace XML nécessaire à un fichier autonome. Les rasters ajoutés sont réencodés en WebP sans perte, à une hauteur maximale de 80 px et sans agrandissement. Les dimensions intrinsèques de toutes les images figurent dans `logos-manifest.json` ; les WebP publiés mesurent de 20 à 80 px de haut. Avec le calcul d’affichage existant, les images sont affichées entre 18 et 40 px de haut et au plus 176 px de large.

Les six planches de relecture ont été produites aux dimensions d’affichage du catalogue, sur les fonds clair ou encre déclarés. Les variantes blanches Bimpli, Upflow et Revue Fiduciaire ont été ajoutées à `LOGOS_SUR_ENCRE`. Le logo Sage du kit avait un plan de travail très large ; il est remplacé par le SVG exact de l’en-tête officiel, **57 × 32 px**, sans recadrage ni recoloration. Le logo de kDrive est le SVG du titre de sa page officielle. Twenty et Pipedrive utilisent leurs symboles officiels, confirmés visuellement.

Les avertissements automatisés `currentColor`, classes ou variables CSS sont conservés au manifeste pour transparence : les images correspondantes rendent correctement sur les planches. Dropbox et VigiCab comportent une surface claire propre au fichier ; leur symbole coloré reste visible sur fond clair. La Société Nouvelle conserve son logo complet et sa signature, sans grossir séparément un élément de la marque.

## Les neuf noms seuls

| Carte | Motif |
|---|---|
| impots.gouv.fr, espace professionnel | Décision État : jamais de logo. |
| Guichet unique des formalités d’entreprises | Décision État : jamais de logo. |
| Annuaire des entreprises | Décision État : jamais de logo. |
| douane.gouv.fr | Décision État : jamais de logo. |
| Registre national des entreprises | Le fichier officiel INPI contient le bloc République française / Marianne ; aucun découpage de la marque. |
| BODACC | Le fichier officiel contient le bloc République française / Marianne ; aucun découpage de la marque. |
| Chorus Pro | Le fichier officiel sauvegardé contient le bloc-marque de l’État. |
| Modèle de registre des traitements | Document CNIL : aucun logo de produit distinct identifié ; pas de logo d’autorité substitué au document. |
| Liasse 360 | Le favicon sauvegardé est une loupe rouge générique ; marque non identifiable avec certitude. |

Un visuel de page jedeclare représentant une personne au travail et un logo Atlantic’eau associé à Veolia ont été écartés. Les deux cartes ECMA emploient le logo de l’éditeur ; Veolia emploie celui du groupe depuis son site officiel. Aucun fichier tiers de banque de logos n’a été utilisé. Aucune qualité de partenaire n’est revendiquée.

## Vérifications

- `node --test tests/scripts/connecteurs.test.mjs tests/scripts/connecteurs-source.test.mjs tests/scripts/connecteurs-rendu.test.mjs` : **16 tests PASS**, 0 échec.
- `node docs/qa/agents-ia/logos-audit.mjs <dossier-de-reprise> --planches` : **0 erreur**, 356 fichiers pour 356 logos déclarés, aucun orphelin ni fichier absent.
- Parse XML isolé : **221/221 SVG bien formés**, sans DTD ni entité.
- Comparaison des 365 cartes avec la copie de début de passe : **tous les champs hors `logo` sont identiques**. Seul l’ensemble de fonds existant `LOGOS_SUR_ENCRE` reçoit les trois variantes blanches citées.

Le build, Lighthouse et les tests navigateur de la page ne font pas partie de cette passe ciblée ; aucune performance de page ou conformité complète n’est déduite du seul poids des logos.

## Fichiers de preuve

- `logos-manifest.json` : inventaire final, dimensions, poids, SHA et provenance de chaque image ; motifs de chaque nom seul.
- `logos-remplacements.json` : les 35 apports officiels, leur traitement et leurs empreintes.
- `logos-audit.mjs` : contrôle reproductible et génération des planches, sans requête réseau.
- Sources durables : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/hub-agents-ia/reprise-codex-2026-10-15/audit-codex/` ; contient les fichiers sources, les journaux de téléchargement, les manifestes du navigateur, `logos-tests.tap`, `logos-audit.json` et `logos-planche-1.png` à `logos-planche-6.png`.
