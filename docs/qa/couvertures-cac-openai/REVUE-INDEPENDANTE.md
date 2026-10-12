PASS — revue indépendante des couvertures CAC

Carte : t_cccaf196 · reviewer qa-hermes-t_cccaf196 · 2026-10-12T13:32:59.905Z
Candidat : codex/couvertures-cac-openai-20261012 · ca29205e45f7ca78c277bfca0fa11cf34a9c95c4
Référence main : 06548228b3194d8881462f4c175cc71e17580dd9

Revue indépendante des deux nouvelles couvertures CAC et vérification de conservation du fond. Ni nouvelle revue métier ni autorisation de publication.

## automatiser-un-cabinet-cac-la-carte-des-taches — PASS

### brief-six-components — PASS
- Recette image.brief : sujet, composition, style, palette épinglée, interdits et alt présents. Les six îlots, chemins, papiers vierges, calendrier à cases vides, disque bas central et plateau graphite correspondent au brief. Le prompt initial et la correction ciblée sont conservés distinctement dans image-source.json et réunis explicitement dans le prompt de la recette.

### generation-constraints — PASS
- Master, hero-768 et OG éditoriaux effectivement ouverts, puis OG public ouvert séparément : diorama isométrique de volumes mats, papier crème, verts et graphite, lumière douce et ombres courtes. Cinq îlots verts et un îlot graphite, sans arbre ni pion à tête. Aucun texte, lettre, chiffre, logo, personnage, main, écran/interface, alerte rouge, coche, sceau d’approbation ou symbole d’envoi observé. Les cases du calendrier sont vides, non une interface.
- La palette a été recomptée par un classifieur RGB indépendant sur 320×180 pixels ; parts identiques à l’archive, statut OBSERVATION uniquement. Aucun score esthétique ni seuil cosmétique imposé.

### fictive-provenance — PASS
- Journal natif Codex : tools.image_gen__imagegen appelé pour le prompt initial puis pour la correction référencée. Les octets PNG base64 renvoyés par generatedImage(r) pour call_4ca941e2a93c4cd48d8cb79eaf696144 donnent exactement le SHA de image-source.png ; le PNG original au chemin .codex/generated_images est également identique. Sortie finale exec-7158d591-bb7f-429f-9f7d-91a930085691, retournée le 12/10/2026 à 12:59:35.699 UTC. Le prompt de correction est identique au journal ; le prompt initial est lui aussi corroboré.
- Illustration abstraite fictive, aucun fichier de cabinet ou donnée client représenté. OpenAI est attribué ; modèle non communiqué et crédits null, sans déduction d’un modèle exact ou d’un coût nul mesuré.

### recognizable-subject — PASS
- Réseau de six îlots de tâches, documents et calendrier préparés ; disque immobile avant une jonction ouverte vers un plateau graphite séparé. À 768 px, chemins et catégories d’objets restent reconnaissables ; aucune tâche n’est cochée ou déclarée validée. La carte est une métaphore de préparation et de choix, pas une preuve d’audit achevé.

### technical-derivatives — PASS
- Source native 1672×941 ; master PNG 1920×1080 réellement mesuré, reproduction en mémoire depuis la source par resize cover identique octet pour octet. Les six dérivés publics AVIF/WebP 768×432, 1200×675, 1600×900 sont mesurés et reproduits à l’identique ; le hero-768 éditorial correspond au public.
- OG éditorial 1200×630 reproduit à l’identique selon 1200×675 puis crop 1200x630+0+22 ; OG public réencodé par la forge également reproduit à l’identique et réellement regardé. Les six îlots et objets sont entiers dans les deux OG ; aucune coupure ou perte gênante observée.

### alt-information — PASS
- Alt descriptif de 108 caractères : carte de tâches, îlots verts reliés, dossiers vierges, jeton plat et plateau graphite à examiner. Cohérent avec les objets vus, sans prétendre une décision ou une conformité. Identique dans le brief, la recette, image.json, manifest.json, imageAlt du Markdown et src/data/images.mjs.

Alt (108 caractères) : Une carte de tâches en îlots verts reliés, avec dossiers vierges, jeton plat et plateau graphite à examiner.
Master SHA-256 : dbd10aecf947b193c93cec4aee76f3cb402627807e820d7b570da7446f86023f
Source PNG SHA-256 : 5bbc7d2c7cf2035e40c9fc5b43ec7f009fa1c795c29746732291e4de196e7878
Provenance JSON SHA-256 : 7440f41ec49f90dbff2bbbfae7bda22504f2895ed219a5a903473dc76ded58f9
Recette SHA-256 : 5a7bdf14e87863efde643f08dc0b285e7b37344c6a243188be5c7a680f9c44fa
Palette : {"#fcfbf7":0.6621875,"#27b657":0.03967013888888889,"#1c8a41":0.06012152777777778,"#231f20":0.03571180555555555} — OBSERVATION, RGB45 à320×180.
Note non bloquante : Le jeton plat est bien un disque et non le pion anthropomorphe du rendu initial.

## cac-reception-fec-constat — PASS

### brief-six-components — PASS
- Six composantes présentes dans image.brief : réception d’un FEC, boîte de cartes vierges, comparaison par paires et écart isolé, style mat isométrique, palette hex, interdits, alt. Prompt exact identique dans le journal natif, image-source.json, la recette et la preuve prompt.json ; composition cohérente avec les objets vus.

### generation-constraints — PASS
- Master, hero-768 et OG éditoriaux ouverts, puis OG public ouvert séparément : boîte vert profond et pile de cartes crème à gauche, plateau crème de cubes verts/crème reliés par des ponts verts, cube graphite séparé dans son petit plateau, dossier vierge en arrière-plan. Volumes mats, perspective isométrique, lumière douce et ombres courtes. Aucun texte, lettre, chiffre, logo, personnage, main, écran/interface, alerte rouge, coche, sceau ou symbole d’envoi observé.
- Parts de palette recomptées indépendamment et identiques à l’archive. Le vert #27b657 est mesuré à environ 0,115 %, observation cosmétique non bloquante ; les ombres et teintes éclaircies ne constituent pas une violation du sujet ou de la direction artistique.

### fictive-provenance — PASS
- Journal natif Codex : tools.image_gen__imagegen, call_31137fe931334cf09b22be7521a61eb8, prompt exact corroboré. Le PNG base64 renvoyé par generatedImage(r), le PNG original .codex/generated_images et image-source.png ont le même SHA. Sortie exec-f4cac3ce-e658-4b97-bb0c-b55a90637db5 retournée le 12/10/2026 à 12:58:49.140 UTC.
- Représentation géométrique fictive d’une réception/comparaison, aucune donnée de client ni fichier FEC réel. Fournisseur OpenAI attribué, modèle inconnu et crédits null conservés sans inventer modèle ou facture.

### recognizable-subject — PASS
- La boîte de cartes figure la réception ; quatre paires de blocs sur un plateau rendent la comparaison lisible, un cube graphite est isolé pour examen à côté d’un dossier vierge. Ces trois groupes restent distinguables à 768 px et dans les OG. L’image ne démontre ni contrôle fiscal complet du FEC ni conclusion sur les comptes ; le fichier FEC n’est pas identifiable comme tel sans le titre, limite normale de cette métaphore sans texte.

### technical-derivatives — PASS
- Source PNG native 1672×941, master PNG 1920×1080 mesuré et reproduit octet pour octet depuis la source. Six variantes publiques AVIF/WebP mesurées à 768×432, 1200×675 et 1600×900 et reproduites à l’identique ; hero-768 éditorial/public identique.
- OG éditorial 1200×630 selon crop déclaré reproduit à l’identique ; OG public issu d’un réencodage reproduit à l’identique et regardé. Boîte, plateau, paires, cube isolé et dossier entiers, aucune troncature ou dégradation gênante observée dans les OG.

### alt-information — PASS
- Alt de 100 caractères, descriptif du fichier reçu, des blocs comparés et de l’écart graphite dans le plateau d’examen. Il décrit la métaphore sans validation automatique ni promesse de conformité. Même valeur vérifiée dans brief/recette/image.json/manifest.json/frontmatter imageAlt/registre images.mjs.

Alt (100 caractères) : Un fichier reçu, des blocs comparés par paires et un écart graphite séparé dans un plateau d’examen.
Master SHA-256 : e3f1dbe022d54c3079971fbc46fb66ce6fcc6ba4d636ac1f0bcdb7860f5c4e46
Source PNG SHA-256 : 21d823ad1b9dc1ec239fd124d3cc8f0e8dd6bad4f149a11e033251bbb90678c7
Provenance JSON SHA-256 : 5f3bf881e9ec852475ec9b0802018f757de91249b2d5c1c92ccc9b332f8d4811
Recette SHA-256 : 31efa499f6d6744bfa7df3104c951f4fb8d47f9ab5a7ef8693b561ab5310256a
Palette : {"#fcfbf7":0.69625,"#27b657":0.0011458333333333333,"#1c8a41":0.01855902777777778,"#231f20":0.03822916666666667} — OBSERVATION, RGB45 à320×180.
Note non bloquante : Présence du vert clair mesurée faible : observation cosmétique seulement. Réception/comparaison reconnaissable ; spécificité FEC apportée par le titre et le corps.

## Conservation du fond — PASS
- Les deux recette.json ne changent que image ; corps.md, claims, sources et inlineProofs identiques à main. Les deux Markdown ne changent que imageAlt ; corps et toutes autres métadonnées inchangés.
- Les quatre WebP de figures public/proofs/blog sont identiques octet pour octet à main. Les sources et leurs contenus ne sont pas modifiés ; leurs classifications et autres preuves projetées changent seulement de liaisons article/manifeste. Diff JSON indépendant détaillé dans CONTROLES-INDEPENDANTS.json.
- Les archives revues-avant-couverture-openai.json et recette-avant-couverture-openai.json sont identiques octet pour octet aux originaux sur main. Les sections avis/business/sources/editorial/complement/historicalImage/historicalEditorial et limites/réserves sont conservées ; previousCoverReview reprend l’ancien avis image, avec sa provenance historique.
- coverCorrection identifie explicitement une projection technique, conserve originalSubject et le SHA réel de l’avis original. Les sujets de recette sont rebondis pour la couverture seulement ; aucun nouveau PASS métier ni nouveau reviewer de fond introduit. Tous les fichiers docs/qa/cac-f4-metier restent identiques à main.
- Diff total borné à ces couvertures, leur provenance, dérivés, alt et projections/sceaux, plus trois documents de recette. Aucun changement de code de l’outil ou de contenu réglementé.

## Porte avant intégration — non verte
- Six refus de critères image par slug correspondent aux grilles encore en attente. Le score100 mécanique et le status PASS de l’enveloppe de preuve ne sont pas pris pour un avis acquis.
- Le rejeu avec le vrai dist/blog.html local produit également un refus de lien entrant par slug : ce dist ancien ne contient pas les routes CAC, et les HTML des deux articles y sont absents. Ce n’est pas une régression du diff, mais une preuve de rendu courant manquante ; ne pas déclarer la porte complète verte. Vérifier le vrai /blog reconstruit dans la phase de livraison/CI.

## Limites
- Source native conservée à 1672×941, master1920×1080 obtenu par rééchantillonnage ; aucune génération native1920×1080 revendiquée.
- Le modèle exact et le coût du générateur restent inconnus ; aucun prix nul attesté.
- Aucun score esthétique, revue réglementaire nouvelle, build complet Mac, CI GitHub, fusion, push, déploiement, HTTP ou validation en production exécuté pour cette livraison.

## Actions de livraison
- t_b35edd43 : intégrer les seuls critères et constats image de cet avis réel avec identité/date/rapport ; conserver les avis et archives métier originaux et leur attribution.
- Rematérialiser et resceller via la forge, puis obtenir la porte complète sur le rendu actuel et la CI Repository gates. Le dist ancien utilisé ici ne prouve pas le maillage actuel.
- Fusion/déploiement/HTTP et contrôle des nouveaux médias relèvent de la phase de livraison distincte, jamais déduits du présent PASS visuel.

Défaut bloquant des couvertures : aucun. Aucun fichier suivi modifié par QA. Aucun PASS de publication.
