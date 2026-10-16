# Audit des logos de compatibilité — 15 octobre 2026

## État final

Le catalogue commun robots et agents contient **365 cartes : 352 avec logo et 13 en nom seul**. Les fichiers publiés représentent **222 SVG et 130 WebP, soit 1 847 568 octets**. Les quatre cartes État restent sans logo. Les sources officielles demandées par Kevin conservent leurs logos dans une bande dédiée.

Les **299 fichiers bruts sauvegardés sont conformes à leurs empreintes SHA-256**. Les **38 décisions d’apport ou de remplacement** sont tracées dans `logos-remplacements.json`, avec leurs sources officielles et leurs empreintes. Les logos partagés entre produits d’un même éditeur restent identiques ; chaque carte dispose de son propre fichier portant son identifiant. Aucun partenariat n’est revendiqué.

## Contrôle de l’identité et des fichiers

L’intégrité d’un fichier ne prouve pas qu’il représente la bonne marque. La relecture des six planches a donc complété le contrôle des empreintes. Le logo Bluebiz hérité a été retiré de la carte Air France. Les trois anciens pictogrammes Working Papers ont été remplacés par le mot-symbole général Caseware officiel. e-Circu, e-Recup et FollowApp restent en nom seul faute d’identification certaine. Les fichiers rejetés et leurs sources sont conservés ; voir `logos-rejets.json`.

Les SVG ont été contrôlés statiquement avant leur décodage : aucun script, gestionnaire d’événement, `foreignObject`, import ou ressource externe, entité XML ou DTD. Le décodage par sharp/librsvg ne produit aucune erreur. Les archives officielles n’ont fourni que les images retenues ; aucun code téléchargé n’a été exécuté.

Les formes, couleurs et proportions des marques sont conservées. Les **215 normalisations** d’espaces et de fins de ligne sont consignées dans `logos-normalisation.json` ; elles ne modifient ni le dessin, ni les couleurs, ni le cadrage. Les bruts restent intacts. Les rasters ajoutés sont réencodés en WebP sans perte et sans agrandissement. Les dimensions intrinsèques et d’affichage, les poids et les empreintes de tous les fichiers sont au manifeste.

Les variantes blanches Bimpli, Upflow et Revue Fiduciaire utilisent le fond encre prévu. Sage utilise le SVG officiel de l’en-tête, kDrive celui du titre de sa page officielle. Twenty et Pipedrive utilisent leurs symboles officiels. Les avertissements statiques portant sur les classes CSS, variables ou `currentColor` restent consignés ; les images correspondantes ont été relues dans les planches à leur taille d’affichage.

## Les treize noms seuls

| Carte | Motif |
|---|---|
| impots.gouv.fr, espace professionnel | Décision État : carte sans logo. |
| Guichet unique des formalités d’entreprises | Décision État : carte sans logo. |
| Annuaire des entreprises | Décision État : carte sans logo. |
| douane.gouv.fr | Décision État : carte sans logo. |
| Registre national des entreprises | Fichier INPI avec bloc-marque de l’État ; aucun découpage. |
| BODACC | Fichier avec bloc-marque de l’État ; aucun découpage. |
| Chorus Pro | Source sauvegardée avec bloc-marque de l’État. |
| Modèle de registre des traitements | Document CNIL, sans logo de produit distinct. |
| Liasse 360 | Favicon générique non identifiable avec certitude. |
| Air France | Source héritée Bluebiz rejetée. |
| e-Circu | Favicon générique non identifiable avec certitude. |
| e-Recup | Favicon générique non identifiable avec certitude. |
| FollowApp | Favicon générique non identifiable avec certitude. |

Aucun substitut générique ou logo d’une autre marque ne remplace ces identités. Un visuel de personne chez jedeclare et un logo Atlantic’eau associé à Veolia ont également été écartés. Les cartes ECMA emploient le logo de l’éditeur ; Veolia celui du groupe depuis sa source officielle.

## Vérifications et preuves

- Audit reproductible des fichiers : zéro erreur, 352 logos déclarés, aucun fichier absent ni orphelin ; manifeste recalculé après les corrections finales.
- Contrôles ciblés finaux des logos, des sources, du rendu et de la CSP : 17 tests Node réussis.
- Les vérifications de page, navigateur, performance et livraison sont décrites séparément dans `README-finalisation.md` ; elles ne sont pas déduites du seul contrôle des fichiers.
- `logos-manifest.json` : inventaire final, dimensions, poids, SHA, fond et motifs des noms seuls.
- `logos-remplacements.json`, `logos-rejets.json`, `logos-normalisation.json` : décisions et transformations.
- `logos-audit.mjs` : audit et génération des planches, sans requête réseau.

Sources durables : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/hub-agents-ia/reprise-codex-2026-10-15/audit-codex/`. Ce dossier contient les sources, journaux, manifestes, rejets et les six planches de comparaison.
