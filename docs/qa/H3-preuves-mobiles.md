# H3 — preuves mobiles lisibles, sans répétition

## Périmètre

DESIGN-01 : les neuf preuves de l’accueil, la preuve paie et DSN Silae.
DESIGN-02 : les cinq services existants. Le hero garde le cadre unique ; le corps conserve son titre et son résumé. Les gabarits voisins ne reçoivent pas automatiquement l’agrandissement.

`ProofDetail.astro` propose « Agrandir la preuve » : lien direct fonctionnel sans JavaScript, dialogue natif avec JavaScript. La vue porte le titre et le résumé existants de `PROOFS`, une région nommée défilante et une image à 1600 × 900 CSS px. La copie détaillée sort de son template uniquement à l’ouverture, sans nouvelle requête d’image au chargement initial. Tab/Shift+Tab restent dans la vue, les flèches déplacent le cadre, Escape ou le bouton ferment et rendent le focus au lien.

Les masters HTML, images, jeux fictifs, textes de fond et validations professionnelles restent inchangés. L’accès au détail s’ajoute sous le cadre ; les tests de composition mesurent son espace séparément, sans réduire l’image ni changer les colonnes et leur alternance.

## Vérification reproductible

- `npx playwright test --config=playwright.proofs.config.ts` : 30 cas Chromium/WebKit, 320/375/1440, clavier/toucher, région nommée, largeur native, fermeture et retour focus, unicité des services, voisins inchangés.
- `npx playwright test tests/browser/proof-layout.spec.ts tests/browser/sections-redesign.spec.ts tests/browser/integrations.spec.ts tests/browser/responsive-site-v2.spec.ts` : 27 cas, dont les largeurs 768/1024/1920 et le fonctionnement sans JavaScript des guides.
- `npm run test:proof` : 150 tests verts ; les figures restent statiques et les dialogues sont nommés, hors figure.
- `npm run test:service-design` : 6 tests verts ; un cadre requis et tout cadre répété refusé.
- `npm run check` : 0 erreur, 0 avertissement, 10 indications préexistantes.
- `npm run regen:generated` : lastmod et surfaces dérivées régénérés ; revue existante réaffirmée, sans nouvelle revue du fond.
- `npm run build` : chaîne intégrale requise avant fusion, en complément de la CI Repository gates.

Rouge initial : absence du lien de détail sur les trois pages à 320 px et deux images identiques sur chacun des cinq services ; la garde accepte encore ce doublon. Vert : accès et unicité vérifiés, garde modifiée pour refuser la répétition.

Captures : vues entières des sept pages concernées et des voisins méthode, DSN Sage, blog ; détails des trois pages DESIGN-01 ; 320/375/1440, Chromium/WebKit. Les captures à mouvement réduit montrent la composition finale complète ; les tests interactifs utilisent les mouvements ordinaires. Les captures ordinaires d’un très long bloc `.rv` peuvent montrer une zone non révélée : ne pas confondre cet état de prise de vue avec un espace de composition.

## Livraison et retour arrière

Une revue QA sur le lot. Après son PASS et la CI verte, fusionner la PR, contrôler les trois accès et l’unicité des cinq preuves publiques sur les URL canoniques avec `Cache-Control: no-cache`. Ne pas déployer manuellement `main`.

Retour arrière : PR de revert du commit de fusion, puis même contrôle public. Aucun master ou contenu réglementé n’est à reconstruire.
