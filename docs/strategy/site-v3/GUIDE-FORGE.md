# Forge des guides tâche–logiciel

La forge conserve le corpus historique de `src/data/integrations.ts` et produit les nouveaux guides dans `src/data/guides.generated.json`, consommé par les routes Astro, le hub et les moyeux. Les recettes sont la source ; ne pas modifier directement les collections générées. Aucun guide fictif de test n'est livré.

## Recette

Créer `guides/recettes/<slug>/recette.json` avec :

- `version: 1`, `type: "guide"`, `mode: "nouveau"`, `author` : identifiant de l'auteur réel ;
- `reviewKind: "metier"` pour le contenu réglementé, `"qa"` pour les autres guides (valeur par défaut) ; une seule revue indépendante ;
- `integration` : objet complet `IntegrationDefinition` décrit dans `src/data/integrations.ts`. La recette historique `guides/recettes/rapprochement-bancaire-sage/recette.json` fournit un exemple exhaustif ;
- `demand: { evidencePath: "autocomplete.json", sha256: "…" }` : fichier de preuve dans le même dossier, et empreinte de ses octets.

L'objet `integration` contient les métadonnées (`slug`, `task`, `vendor`, `product`, `primaryQuery`, `suggestions`, `modifiers`, `h1`, `tabTitle`, `description`, `intro`, dates et `auteur`), le moyeu `service`, les repères documentaires `officialPath` et `documentScope`, les `fields` avec `label`/`control`, `knownTrap`, `writtenRule`, la `boundary` en trois colonnes (`prepared`, `validation`, `human`), trois cas `replay` (`input`, `rule`, `outcome`, `detail`), la `source` (`title`, `url`, `checkedAt`, `fact`) et éventuellement `tool` (`href`, `label`). Les issues des trois cas couvrent `Préparé`, `À valider` et `Arrêt`.

L'éditeur est une chaîne non vide, sans liste fermée ; le moyeu doit être un des services historiques ou une page `src/content/services/<slug>.md` publiée. Un guide ne renvoie pas vers un logiciel concurrent. L'auteur public reste une référence existante (`kevin`), distincte de l'auteur de recette pour la revue. Une nouvelle URL a sa requête propre : la forge vérifie les guides et le registre SEO ; compléter aussi le contrat d'intention et le registre selon les conventions du dépôt avant livraison.

## Preuve de demande

`autocomplete.json` conserve la réponse brute, jamais une estimation de volume :

- `provider: "google-autocomplete"` ;
- `measuredAt: "YYYY-MM-DD"` (date réelle, non future) ;
- `endpoint` : URL HTTPS `suggestqueries.google.com/complete/search`, paramètres `client=firefox`, `hl=fr`, `gl=fr`, `q` égal à la requête ;
- `httpStatus: 200` ;
- `response` : réponse JSON Google complète, dont `[0]` est la requête et `[1]` la liste des suggestions.

Le seuil est six suggestions distinctes après normalisation. Cinq, une liste absente, une requête différente, une preuve explicitement fictive ou une empreinte divergente sont refusées avant tout actif/manifeste. `integration.suggestions` doit correspondre au compte mesuré. La preuve est un constat archivé : la forge contrôle sa cohérence, pas l'authenticité d'une déclaration falsifiée ; le relecteur vérifie sa provenance. Aucune donnée Google synthétique ne doit être archivée hors des tests.

## Préparer, relire, sceller

1. `npm run guide:preparer -- <slug>` valide puis rend une simulation documentaire propre au guide. HTML autonome et WebP 1600×900 (moins de 150 Ko) sont produits à partir des cas dans Chromium (`npx playwright install chromium`). Fraunces et Hanken auto-hébergées sont embarquées ; le rendu mesure chaque rectangle de texte après chargement des polices, autorise le retour à la ligne des mots larges et refuse tout débordement avant écriture. Entrée, règle, sortie/cause et décision restent au centre ; la portée documentaire reste dans l'alt et la page, pas dans l'image. Ce n'est pas un essai dans le logiciel éditeur. Le candidat préparé n'est pas ajouté au site.
2. Examiner le rendu, les sources officielles, la règle, les limites et la demande. L'autre profil rédige `revue.json` dans le dossier recette : `kind` conforme à `reviewKind`, `status: "PASS"`, `reviewer`, `reviewedAt`, `candidateSha256` (empreinte du fichier recette), `observations` non vides. Le relecteur est distinct de `author` et de l'auteur public. Une revue métier remplace la QA du contenu réglementé, elle ne s'y ajoute pas.
3. `npm run guide:sceller -- <slug>` vérifie la revue puis ajoute le guide et les métadonnées de son illustration aux collections. Le guide est maintenant constructible ; pas de déploiement déclenché par cette commande.
4. Effectuer les contrôles du dépôt, `npm run regen:generated` si nécessaire, livrer la PR avec CI verte et la revue requise, puis fusionner selon la procédure du dépôt. La forge d'infrastructure est revue en QA ; chaque future recette a sa propre revue de contenu.

La préparation et le scellement répétés sont idempotents. Une recette ou un actif existant divergent n'est jamais écrasé silencieusement. Pour corriger un candidat préparé non publié, retirer explicitement ses seuls fichiers générés dans `guides/etats/<slug>` et son WebP, conserver la recette éditée puis préparer à nouveau ; ne jamais faire cela pour un guide déjà scellé/publié. Les mises à jour de guides publiés restent une livraison explicite, hors de cette première ouverture en série.

## Publication constatée et audit

Après déploiement sur `memlia.fr`, `npm run guide:publier -- <slug>` constate HTTP 200 sans redirection, canonical auto-référent, H1 unique attendu, absence de noindex HTTP/HTML et autorisation par robots.txt. Pour un nouveau guide, Astro expose l'identité de sa définition construite ; la forge la compare à la définition relue. Elle contrôle aussi les textes attendus dans le corps (hors scripts/styles/templates), le lien de source et l'image attendue, puis télécharge le WebP et vérifie ses octets contre la preuve scellée. Les pages historiques n'ont pas de marqueur ajouté, afin de conserver leur HTML ; leurs textes et leur WebP sont contrôlés de la même manière. Il vérifie à nouveau le candidat après les appels réseau puis écrit le reçu et passe à `publie`. Une page vide, un ancien corps, une preuve divergente, une panne ou une mutation laisse l'état scellé sans reçu. Cette commande constate une publication, elle ne fusionne ni ne déploie.

`npm run guide:audit` réconcilie états, recettes, sceaux, preuves et collections ; il s'exécute avant Astro dans `build:site`, donc dans `npm run build`. Un fichier manquant ou altéré échoue fermé. Aucun nouvel actif n'est régénéré pendant le build Cloudflare.

Le contrat de page découvre les manifestes de `guides/etats` et réutilise la validation de la forge : seul un état `scelle` ou `publie` cohérent prouve l'illustration de sa route `/integrations/<slug>`. Une preuve absente, modifiée ou utilisée par une autre page ne compte pas ; un manifeste QA générique ne remplace pas le sceau d'un nouveau guide. Le corpus historique conserve sa provenance antérieure. L'oracle HTML/sitemap attend le corpus historique augmenté des définitions générées liées à leurs recettes et sceaux, sans liste de nouveaux slugs ni déduction depuis le rendu.

## Rejeu historique et tests

`npm run guide:preparer -- rapprochement-bancaire-sage` rejoue la recette existante sans toucher au corpus ni au WebP. L'exception de demande historique exige le corpus intégralement identique et la grille `PSEO-INTEGRATIONS.md` datée du 20 septembre 2026 ; elle n'ouvre aucune nouvelle URL. Son état préparé est livré pour vérifier ce contrat en continu. Il ne prétend pas disposer d'une nouvelle revue ou d'un nouveau constat de publication.

- `npm run test:guide-forge` : seuil 5/6, preuve manquante/fictive, revue, mutations, idempotence, publication et géométrie/composition des images (dont 74 W/49 W) ; réponses servies simulées uniquement dans les tests.
- `npm run test:guide-render` : forge un candidat isolé, lance Astro et vérifie page, illustration, canonical, liens hub/moyeu et constat de publication de la page réellement construite.
- Ces trois fichiers de test utilisent Chromium : ils sont exécutés explicitement dans la CI Repository gates, pas dans le build Cloudflare sans navigateur. L'audit des états et des actifs scellés reste obligatoire dans chaque build ; le sceau du rendu couvre aussi les deux fichiers de polices embarqués.
- Les neuf guides historiques et le hub restent identiques en HTML lors de cette livraison.

La réouverture des campagnes EC/CAC décidée dans le programme du 5 octobre ne dispense jamais du seuil des six suggestions. Les recettes et suivis J+7/J+28 des futures publications sont portés par les cartes de fabrique ; cette livraison ouvre l'outil, pas une vague de pages.
