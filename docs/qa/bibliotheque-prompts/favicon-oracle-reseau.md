# Favicon tardif et oracle réseau de la bibliothèque

## Cause qualifiée

L’archive de t_33a53ed2 (`pr101-ci-reprise-livraison.zip`, archive interne
`ci-reprise-pr101-preuves.zip`) contient le seul échec historique :
`reprise-final.log`, accuse-reception, puis `favicon-retry.log` vert.
La trace enregistre `GET /favicon.svg`, type Chromium `other`, destination
`image`, à 46894,057 ms. Le clic de copie est effectivement dispatché à
47584,425 ms : l’icône part 690,368 ms avant le clic, donc pas depuis son
handler. Le layout déclare cette icône ; les handlers de copie/export font
respectivement clipboard et Blob. `networkidle` n’est pas une preuve que
Chromium a déjà découvert l’icône native.

## Correction du harness

`prepareLibraryNetwork` observe avant navigation la réponse native de l’une
des deux icônes déclarées par Base.astro (SVG ou PNG), puis attend sa fin et
networkidle avant d’armer l’oracle existant. Aucun délai n’augmente et aucune
requête n’est exclue de la fenêtre de copie/export : même une nouvelle requête
vers favicon.svg reste un échec. Produit, CSP et contenu restent inchangés.
L’attente conserve le timeout Playwright existant ; une icône absente ou en
échec n’est pas silencieusement ignorée. Le helper est propre à cette page et
au Chromium configuré dans le dépôt, pas une abstraction multibrowser.

## Preuves navigateur

`library-network.spec.ts` diffère la découverte de l’icône native jusqu’après
networkidle, sans clic de l’outil et sans sommeil. Une barrière de protocole
rend l’ordre observable. Avant correction : rouge (`premature=true`). Après
correction : vert ; copie/export après cette icône ne produisent aucune
requête. Les douze fiches conservent les comparaisons exactes clipboard/fichier,
le nom exporté et l’absence de stockage.

Deux mutations attachent une transmission par image au clic réel, l’une à la
copie, l’autre à l’export, vers `/favicon.svg?oracle=…`. L’oracle enregistre ces
requêtes et son assertion de liste vide les refuse. L’image est volontaire :
la CSP existante bloque fetch ; la relâcher pour fabriquer une preuve aurait
changé le périmètre et ne testerait pas le réseau réel autorisé.

Commande ciblée (QA_URL pointe ici vers le serveur Astro local) :

    QA_URL=http://127.0.0.1:29473 npx playwright test tests/browser/library-network.spec.ts tests/browser/bibliotheque-prompts.spec.ts --trace=on

Les logs rouge/vert sont joints à la carte. La construction et la suite
complète restent du ressort de la CI GitHub « Repository gates » ; les tests
locaux ne valent pas une preuve de cette CI ni une livraison en production.
