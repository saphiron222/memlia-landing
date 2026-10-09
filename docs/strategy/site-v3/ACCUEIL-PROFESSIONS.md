# Accueil paramétré par profession

D1 extrait le contenu de l’accueil EC, sans publier de page CAC. Les onze composants de
`src/components/sections/` gardent leur DOM, leurs styles et leurs interactions. Aucun texte
métier EC, média ou compteur n’est réécrit.

## Contrat pour E1 et E4

- `src/data/accueil/types.ts` définit `ContenuAccueil` et `Profession` (`ec | cac`).
- `src/data/accueil/ec.ts` compose `CONTENU_EC`. Les FAQ, étapes de méthode et garanties
  conservent les sources existantes, également utilisées ailleurs.
- `contenuDe('ec')` rend cet objet ; `cac` et toute valeur inconnue sont refusés, jamais remplacés
  par EC. E1 crée `cac.ts` avec `CONTENU_CAC: ContenuAccueil`. E4 branche cet objet dans
  `contenuDe` après la revue E2 et fournit chaque sous-objet à sa section.
- L’accueil sélectionne sa profession une fois dans `src/pages/index.astro`, puis passe
  `contenu={contenu.hero}`, `contenu={contenu.orientation}`, etc. Chaque composant accepte
  la même prop, avec EC par défaut pour préserver les usages actuels.
- `AppelFinal` garde ses props historiques : `titre`, `texte`, `points`, `action` et
  `secondaire` restent prioritaires sur les valeurs du sous-objet `appelFinal`.
- Le CTA principal reste partagé. Les libellés du lecteur vidéo et les labels techniques
  restent dans le composant : ils ne sont pas de la copy de profession.
- Les références des preuves sont dans les données (`image`, `methode.etapes[].image`),
  ainsi que le poster, la vidéo et les sous-titres du hero. E3 doit enregistrer ses propres
  preuves dans le registre avant utilisation. Ne pas réutiliser les visuels EC pour CAC.
- Les données structurées restent le périmètre D2/E4. Le JSON-LD de la page CAC devra lire
  ses propres questions, pas la FAQ EC de `JsonLd.astro`.

## Vérification

`node --test tests/scripts/accueil-contenu.test.mjs tests/scripts/accueil-render.test.mjs`
contrôle le contrat des sections, le témoin DOM du contenu EC et un build Astro isolé
qui injecte un autre titre dans chacune des onze sections, une autre FAQ, ainsi qu’un titre
explicite prioritaire dans l’appel final. Le projet d’essai est supprimé après exécution,
et n’ajoute aucune route au site ni au sitemap public.

Le témoin historique porte désormais sur `<main id="main">` : les onze sections EC,
leur ordre, leurs textes, médias, attributs de rendu et structure restent contrôlés.
Le head et ses métadonnées de publication, la navigation et le footer généré sont hors
de ce périmètre : publier une page ne doit pas imposer un nouveau témoin EC. La valeur
DOM déjà présente sur main est conservée, sans recalage sur le candidat.
Seuls le lien d’orientation marqué `data-accueil-cac`, les espaces normalisés et la
diffusion responsive canonique des masters sont neutralisés par ce témoin existant.
Deux tests de frontière rejouent l’ajout et le retrait du footer, une métadonnée de
publication, puis une altération de texte et de classe dans chacune des onze sections.
Le témoin DOM ne mesure pas les pixels ni les feuilles CSS externes ; la recette visuelle
ci-dessous reste le contrôle de géométrie. Pour une modification intentionnelle du contenu
EC, comparer le rendu et obtenir la revue prévue avant d’actualiser le témoin.

Pour rejouer la comparaison visuelle, servir les deux builds sur deux ports, puis :

    node scripts/compare-accueil.mjs http://127.0.0.1:43220/ http://127.0.0.1:43219/ .qa/accueil-comparison

Le script exige le même HTML, puis les mêmes dimensions et pixels aux largeurs 375 et
1440. Les captures sont pleines pages ; polices chargées, mouvement réduit, vidéo à zéro,
images différées chargées par défilement. Le rapport JSON et les quatre PNG sont écrits
sans remplacer les sources ou valider automatiquement un nouveau témoin.

Les captures initiales et après extraction sont identiques : 375 × 14162 et 1440 × 11179.
Les sept autres pages utilisant `AppelFinal` ont uniquement changé d’ordre de blocs CSS
après l’ajout de cette dépendance partagée ; leur registre lastmod a été régénéré et la
revue existante du glossaire réaffirmée par les commandes du dépôt. Aucun contenu métier
ni aucune source réglementaire du glossaire n’a été modifié.
