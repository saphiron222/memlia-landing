# Synchronisation du parcours à deux onglets

Le contrat R1 de `tests/browser/prompt-qa-reprise.spec.ts` doit suivre l’onglet consulté : activer le popup avant ses assertions, revenir sur l’original avant de le contrôler, activer chaque onglet pour son contrôle de stockage puis revenir sur l’original pour l’export. Utiliser `Page.bringToFront()` ; ne pas changer les timeouts, le lien ni l’isolation `noopener noreferrer`.

## Qualification du 7 octobre 2026

- CI PR152, run 37540829008, deux tentatives : popup reçu, assertion URL sans résultat (`""`), timeout global 30 s ; 537 autres parcours réussis dans la seconde tentative.
- Rejeu local sur le build réel de main : R1 rouge au retour sur l’original, assertion de valeur sans résultat (`""`). Une sonde directe prouve pourtant deux pages distinctes, les navigations attendues, `window.opener === null`, et le marqueur et le texte original conservés avant/après adaptation dans l’autre onglet.
- Témoin sans activation explicite, rejoué trois fois sur le même serveur : deux PASS et un timeout sur l’évaluation du formulaire original. Le défaut n’est donc pas une URL de produit systématiquement vide ni un effacement du texte : la synchronisation du test avec les deux cibles Chromium est intermittente.
- Activation explicite : R1 cinq répétitions PASS ; bibliothèque + reprise 40 PASS ; version finale du contrat complet trois répétitions, 48 PASS. Build complet et Astro check : sortie 0 (0 erreur, 0 avertissement).

La correction porte uniquement sur le parcours navigateur. Les assertions URL, original édité, formulaire inchangé, stockage vide, export exact et absence d’opener restent toutes présentes. Elle reproduit le changement d’onglet d’une personne plutôt que de dépendre de l’activation implicite du navigateur. Le mécanisme interne exact Chromium/CDP n’est pas démontré ; une sonde simplifiée à deux pages ne reproduit pas le blocage, donc ne pas présenter une suspension générale de `requestAnimationFrame` comme un fait.

## Livraison

La PR est basée sur `fix/blog-intent-fixture-clock` pour exercer la CI avec la fixture historique déjà corrigée et revue. Son diff propre ne touche ni cette fixture ni sa documentation : seulement R1 et cette note. Après QA unique et CI verte, intégrer cette PR dans la branche de PR152 ; le responsable de PR152 garde sa revue existante et achève lui-même son intégration sur main. Aucun changement aux preuves ni au fond des articles.
