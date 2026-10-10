# Contrat CAC : build Cloudflare et géométrie CI

Le 8 octobre 2026, le build automatique Cloudflare échouait après PR182 :
`test:scripts` lançait le contrôle géométrique CAC, mais l’image de build
n’installe pas Chromium. Installer Chromium dans le build n’est pas nécessaire.

Les quatre contrôles déterministes restent dans
`tests/scripts/accueil-cac-medias.test.mjs` et sont exécutés par le build :
fixture et résultats, registre et dimensions des actifs, manifeste scellé et
poster, contenu des scènes. Aucun contrôle ni texte approuvé n’est retiré.

Le contrôle géométrique existant est conservé dans
`tests/scripts/accueil-cac-geometry.test.mjs`. `scripts/test-scripts.mjs`
l’écarte explicitement et imprime la raison. Le job `portes` de PR validation
l’exécute après installation Chromium. `Repository gates` dépend de sa réussite ;
il ne peut pas être sauté ou toléré. Rejeu local :

    node --test tests/scripts/accueil-cac-geometry.test.mjs

La non-régression `tests/scripts/cloudflare-cac-contract.test.mjs` exécute les
contrôles déterministes avec un dossier de navigateurs vide et vérifie le
raccordement CI obligatoire. Le contexte du runner Node parent est supprimé
pour que le sous-processus exécute réellement ses assertions. Les deux tests ont
échoué avant séparation : exécutable Chromium absent, puis étape CI absente.

Vérification du chemin de production sans navigateur installé :

    CF_PAGES=1 PLAYWRIGHT_BROWSERS_PATH=/chemin/vers/un/dossier/vide npm run build

La production est livrée uniquement par la fusion PR puis le déploiement
automatique main Cloudflare Pages, jamais par une publication manuelle de dist.
