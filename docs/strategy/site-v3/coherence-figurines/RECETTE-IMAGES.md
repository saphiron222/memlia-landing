# Recette proposée — images commerciales avec figurines

Statut : deux pistes à choisir par Kevin. Ce document prépare leur déclinaison ; aucune des deux n’est présentée comme déjà adoptée pour les six pages.

## Socle commun

Argile mate, grain fin, céramique douce, yeux noirs ronds, sourire fermé, corps monobloc, anneau vert. Même fond crème, même lumière diffuse et mêmes ombres de contact que les portraits validés. Ni néon, chrome, écharpe, bras, tête séparée, ruban cadeau ou personnage concurrent. Les agents gardent leur identité ; les robots conservent leurs deux encoches discrètes. L’image ne représente ni un client, ni une équipe réelle, ni un traitement en cours.

Les silhouettes et objets sont repris depuis les PNG validés en référence de génération. La scène peut changer la distance de caméra et la disposition : le cadrage carré 18–82 % reste celui des figurines de catalogue, pas celui d’une illustration narrative en paysage.

## Piste A : scène de travail

- Format paysage 3:2 ; une scène ample par page, placée auprès du passage qu’elle explique.
- Un ou deux personnages, quelques objets administratifs simples ; le passage se comprend à travers les objets et la légende.
- Chaque page aura une scène propre après validation : portefeuille EC, dossier d’audit, atelier de règle, construction de la prise en charge, exception à reprendre, premier échange.
- Le pilote associe le robot CFE abricot et Balthazar sauge : feuilles reçues, registre/règle, trieur et exception séparée. Les feuilles ne portent aucune donnée.

## Piste B : portrait métier

- Même format et même matière, mais un personnage plus proche, un dossier principal et un ou deux attributs.
- Beaucoup d’espace crème, pas de décor de bureau complet. Convient au contact et aux rappels de prise en charge.
- Le pilote montre le robot CFE avec un dossier ouvert, une feuille et une clé. Aucun nom ni inscription dans le dossier.

## Les mots restent dans la page

Aucun texte, chiffre, faux écran ou logo incrusté dans les scènes. Titres, explications, étapes, limites et actions restent des éléments accessibles de la page. Les démonstrations des robots et agents conservent leurs tables lisibles ; elles ne deviennent pas une image marketing. Les images sociales peuvent associer la scène au H1 dans le pipeline existant, sans transformer les sorties fictives en preuve réelle.

## Production et recette après choix

1. Valider la recette et son emploi par page, à partir de l’atelier et du pilote.
2. Écrire un brief propre à chaque image : idée utile, personnages, objets, cadrage et texte de remplacement. Vérifier les identités sur les références retenues.
3. Générer séparément chaque scène ; inspecter matière, objet métier, cohérence des anneaux et absence d’inscriptions. Corriger les images défaillantes avec imagegen.
4. Archiver originaux et prompts exacts ; produire AVIF et WebP 640/1200, dimensions explicites et chargement selon la place réelle. Conserver les compositions complètes sur mobile.
5. Remplacer les anciens cadres commerciaux dans leurs pages, préserver les liens utiles et produire les images sociales propres. Mettre à jour les décisions de médias et leurs tests.
6. Revoir les six pages à 375, 768 et 1440 px, sans débordement ni saut de page ; vérifier le chargement réel des images, les focus, le clavier et le mouvement réduit.

Actifs de cette proposition : `public/illustrations/figurines/`, huit dérivés, de 6,8 à 34,7 Ko. Source complète hors dépôt : `memlia-landing-sources/coherence-figurines/2026-10-15/`, avec originaux, prompts, logos et captures. `prompts.json`, `images-manifest.json` et `logos-manifest.json` consignent leur provenance. Génération par l’outil imagegen disponible dans Codex, sans sélection de modèle exposée.
