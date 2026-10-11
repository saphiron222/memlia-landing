# Hub des guides — passe de copy

Carte : t_aa2e2d05. Page : /integrations. Base : origin/main, 3f1e8b7b.

## Décision et périmètre

Le hub aide à choisir une tâche dans le produit exact de l’équipe. La structure commerciale, les sections, la DA, les destinations, le H1 et le canonical restent en place. Les descriptions de cartes reprennent sans modification les descriptions des guides.

La passe précédente avait déjà retiré « Mesurer, publier peu, puis entretenir » et le signal d’indexation du texte HTML. La preuve figée conservait cependant les seuils SEO, les variantes fermées et un regroupement erroné des deux produits Sage. Le cadre du hub est désormais orienté vers les champs à lire, la préparation et la validation. Les neuf cadres des guides individuels sont inchangés ; leurs libellés « moyeu » sont hors périmètre (CONT-14).

Les titres des cartes utilisent la tâche et le nom exact du produit : DSN, Sage, Cegid et mySilae conservent leur casse. Cette présentation est activée seulement sur le hub ; les autres usages d’IntegrationCards sont inchangés. Les comptes du texte, des groupes et de l’ItemList viennent de la collection existante. L’image ne comporte plus de compte éditorial figé.

La clôture présente une tâche prise en charge dans les outils du cabinet, la règle écrite, les essais, la maintenance et la décision conservée. Son CTA est explicitement « Confier une première tâche » vers /contact.

## Base avant publication

Lecture réelle de https://memlia.fr/integrations le 8 octobre 2026 : neuf cartes vers neuf guides, quatre produits regroupés en 4/2/1/2 ; titres « Dsn sage », « Lettrage cegid », « Dsn silae » ; cadrage générique ; CTA final vers /contact. L’ancienne image affiche des seuils d’autocomplétion et les deux produits Sage sous Comptabilité. Aucun trafic, taux de conversion ou gain n’est disponible dans cette passe : aucun chiffre de performance n’est supposé.

## Exécution

- npm ci --no-audit --no-fund : succès.
- npm run regen:generated : succès, audit Ressources QA PASS.
- npm run build : succès après conservation du préfixe de description exigé par le contrat SEO.
- python3 -m unittest discover -s tests/proof -p test_positioning.py -v : huit tests PASS.
- node --test tests/scripts/site-copy-b.test.mjs : sept tests PASS.
- node --test tests/scripts/integrations.test.mjs : huit tests PASS.
- node scripts/render-integration-proofs.mjs --check : dix cadres conformes ; seul hub.webp change, 48 102 octets, 1600 × 900.
- Playwright positioning + integrations-hub-copy : dix tests PASS ; six largeurs 320/375/768/1024/1440/1920, neuf clics vers le H1 et la description correspondants, CTA vers /contact, compte ItemList et absence de débordement.
- Captures pleines pages à 375 et 1440 : les titres et le CTA sont lisibles après fixation de l’état d’apparition pour la capture. Aucune correction de DA n’est introduite.

## Revue et publication

Une seule revue QA sur cette carte. Après PASS : vérifier les contrôles GitHub, fusionner la PR et vérifier la surface réellement servie, l’image et les neuf parcours. Si une intégration dev est nécessaire, transférer le verdict acquis dans une carte dev de publication ; pas de seconde revue du fond.

## Suivis à consigner après mise en ligne

La date de publication effective détermine J+7 et J+28. Aux deux échéances : reprendre l’URL canonique sans paramètre, vérifier les comptes depuis les données alors publiées, ouvrir chaque guide et le CTA, vérifier les noms de produits et le mobile. Comparer impressions/clics et requêtes Search Console sur des fenêtres comparables si ces données sont accessibles. Mesurer l’usage vers les guides et les demandes qualifiées seulement si l’instrumentation les atteste. En son absence, noter « non mesuré » plutôt qu’assimiler un clic à une conversion.
