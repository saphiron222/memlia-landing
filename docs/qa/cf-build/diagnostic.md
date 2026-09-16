# Pourquoi pousser `main` cassait le site

Carte `t_47aa0a6f`. 16 septembre 2026.

**Cause trouvée et mesurée. Moitié corrigée depuis le dépôt ; l'autre moitié est un réglage du tableau de bord Cloudflare, que Kevin seul peut faire.**

## Le symptôme

Trois fois — le 14 septembre, puis deux fois le 16 — une poussée de `main` a déclenché la construction automatique de Cloudflare Pages, qui a publié un déploiement annoncé actif dont **toutes les pages répondaient 404, accueil compris**. Sur l'apex, le cache masquait la panne : une lecture nue rendait encore 200, une lecture avec paramètre anti-cache rendait 404 sur les douze routes.

## Le test qui a tranché

Une sonde fichier par fichier sur le déploiement issu de la construction automatique :

| Chemin | Réponse |
|---|---|
| `/package.json` | **200** |
| `/README.md` | **200** |
| `/.nvmrc` | **200** |
| `/index.html` | 404 |
| `/dist/index.html` | 404 |

**La plateforme publiait la racine du dépôt.** Pas un build raté : aucun build du tout. Le projet, créé à l'origine pour le téléversement direct, a été relié à git sans jamais recevoir de configuration de construction. Il servait donc les fichiers sources et n'avait aucun `index.html` à la racine.

## Ce qui a été corrigé depuis le dépôt

`wrangler.toml` déclare désormais `pages_build_output_dir = "dist"`. Mesure après correction : `/package.json` passe de 200 à **404** sur la construction automatique. La déclaration est donc honorée.

`.nvmrc` et `.node-version` déclarent Node 22, exigé par `package.json` et par Astro 7. Cette piste avait été testée en premier et **n'était pas la cause** : la prévisualisation de branche rendait toujours 404. Les deux fichiers restent, ils écartent une cause future.

Les deux correctifs ont été éprouvés **sur une branche de prévisualisation, jamais sur `main`**, pour ne pas remettre la production hors service pendant le diagnostic.

## Ce qui reste, et que seul Kevin peut faire

La construction automatique n'a toujours **aucune commande de construction** : `dist` n'est jamais produit, donc le dossier déclaré reste vide. Une poussée de `main` publie désormais un site vide au lieu de servir le dépôt — moins grave, toujours cassé.

Le réglage est dans le tableau de bord Cloudflare, sur le projet `memlia`, à la rubrique des paramètres de construction et de déploiement :

- **commande de construction** : `npm run build:site`
- **dossier de sortie** : `dist`

`npm run build:site` plutôt que `npm run build` : le second enchaîne l'audit des ressources, qui sort volontairement en erreur tant qu'une revue métier est en attente. Ce garde-fou a sa place en local, pas dans une construction de publication, où il ferait échouer un déploiement légitime.

Tant que ce réglage n'est pas fait, **la règle de publication reste** : pousser `main`, attendre la fin de la construction automatique, déployer explicitement le dossier vérifié, puis relire depuis l'origine avec un paramètre anti-cache.

## Un effet de bord, refermé

Pendant les fenêtres où une construction automatique tenait l'alias de production, `memlia.fr` servait les fichiers du dépôt. Vérifié : **aucun fichier de secret n'est suivi par git**, aucun `.env` n'était donc servi. L'exposition se limitait au code source du site et à sa documentation, dans un dépôt privé. La production actuelle rend 404 sur tous ces chemins.

Observation adjacente, non corrigée : `.gitignore` ne contient aucun motif pour `.env`. Rien n'est exposé aujourd'hui, mais un fichier d'environnement créé à la racine serait committable.
