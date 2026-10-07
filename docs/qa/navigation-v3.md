# Navigation v3 — D6

## Résultat

Les trois hubs existants sont accessibles directement sur desktop et mobile : « Ce qu’on automatise » vers `/automatisation-cabinet-comptable`, « Outils gratuits », « Blog ». Les quatre ancres historiques restent disponibles dans « Sur cette page » (ou « Lire l’accueil » hors accueil) ; le mobile garde ses destinations immédiatement visibles, sans menu obligatoire ni JavaScript.

La route CAC appartient à E4 et n’existe pas encore sur main. `navigation-publiee.ts` active automatiquement le groupe « Cabinets » (expertise comptable, commissaires aux comptes) et la ligne secondaire du hero dès que `src/pages/commissaires-aux-comptes.astro` existe. Aucun lien 404 ni page provisoire n’est livré. La page CAC doit conserver `usages`, `methode`, `preuves`, `questions` ; ses liens ne renvoient pas à l’accueil EC.

## Vérifications réalisées

- Test Node rouge avant implémentation, puis 3 tests de navigation PASS.
- `npm run regen:generated` PASS ; données dérivées régénérées et revue du glossaire réaffirmée sans nouveau fond.
- `npm run build` PASS : 150 tests Python, suite scripts Node 810 PASS et 8 cas ignorés, audit Ressources QA PASS.
- Navigation navigateur sur export final : 62 PASS ; 3 tests d’activation CAC ignorés parce que la vraie route est absente.
- Activation : une fixture de route locale explicitement fictive a été construite, puis 49 tests navigateur PASS (mobile, clavier, hubs, activation CAC à 375/1024/1440 et largeurs 320/375/768/1024/1440/1920). Fixture supprimée avant régénération et build final ; aucune copy CAC inventée ni livrée.
- Clavier : Entrée ouvre, Tab parcourt, Échap ferme et restitue le focus ; liens fermés retirés du parcours Tab. Sans JS : destinations servies par la navigation mobile et le fallback desktop.
- Captures haut et pleine page à 375 et 1440, pour main avant changement, livrable et activation locale. Contenu EC comparé au build de main : identique après normalisation des espaces hors ligne d’orientation ajoutée ; chrome testé séparément.
- `git diff --check` PASS. `astro check` interrompu au plafond local de 120 secondes pendant le diagnostic, sans conclusion : ne pas le présenter comme vert.

## Revue et livraison

Une revue QA indépendante est requise avant fusion. Vérifier la PR, les tests ciblés et la CI Repository gates ; fusionner seulement après PASS et CI verte, puis constater les hubs en production sans query string avec Cache-Control no-cache. L’activation publique CAC se constate lors d’E4, pas sur la fixture D6.

Les captures mobiles conservent la navigation visible imposée par le contrat de page ; les recommandations générales de compacter celle-ci ne sont pas une correction de D6. Aucune section ni preuve historique n’a été redesignée.

Retour arrière : PR inverse limitée au changement de navigation, puis `npm run regen:generated` et build, sans réécrire les sceaux à la main.
