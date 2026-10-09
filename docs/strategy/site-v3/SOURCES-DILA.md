# Copies LEGI/JORF dans les forges

La preuve `dila-copy` remplace uniquement l'ouverture HTTP de Légifrance. Elle
ne déclare jamais une page consultée : `httpStatus` vaut `null`. Le lien public
reste celui de l'article ou de l'acte Légifrance. La classification de la source,
l'extrait exact, les claims, la revue indépendante et les portes de publication
restent exigés par leur chaîne ; aucun avis métier n'est produit par l'import.

## Export depuis le référentiel A4

Le référentiel local doit déjà être collecté et réceptionné. Depuis le dépôt :

```sh
node scripts/export-dila-source.mjs LEGIARTI000051559623 editorial/recettes/<slug>/preuves/legi.json
node scripts/export-dila-source.mjs JORFTEXT000050685006 editorial/recettes/<slug>/preuves/jorf.json
```

Par défaut, la racine est `~/hermes/referentiel-juridique` ; l'option
`--referentiel=<chemin>` choisit explicitement une autre installation A4. LEGI
est interrogé par `rechercher.py <identifiant> --json` (Python standard) ; JORF
copie le JSON natif du référentiel. Une destination existante n'est jamais
écrasée. Un export invalide reste présent pour diagnostic, avec une sortie non
nulle : ne pas l'adopter comme source.

Le JSON conserve les données A4, notamment :

- fonds et identifiant de version ; URL publique exacte ; texte complet ;
- LEGI : jeu `6883417e592dee0d5beed92a`, partition DINUM issue de DILA, commit
  de dépôt, commit/date de livraison, hash de partition, morceaux ordonnés,
  `valid_from` et `valid_to_exclusive` ;
- JORF : archive JORFSIMPLE DILA, hash local, membre XML, identifiant JORFTEXT,
  articles JORFARTI, dates de signature et de publication ;
- `provenance.retrieved_at` et l'avertissement source, sans les redater.

La fraîcheur d'ouverture est de 0 à 7 jours civils Europe/Paris inclus, calculée
sur la collecte, non sur l'export, le réimport, la publication du fichier ou le
début de validité juridique. Une collecte future, une copie manquante, un chemin
sortant du dossier (symlinks compris), une provenance incohérente, un texte
tronqué, une empreinte divergente ou un extrait inexact ferment la porte.
L'horodatage Python avec six décimales et offset UTC est conservé à l'identique.

Une collecte récente ne garantit pas une consolidation récente. Un ancien acte
JORF n'est pas un article consolidé LEGI ; la revue métier doit examiner les
modifications et les conditions d'application. La réserve A4 de droit à jour
et l'absence de comparaison aux pages Légifrance restent applicables.

## Blog

Ajouter `dilaCopyPath` à la source de `recette.json`, relatif au dossier de la
recette, par exemple `preuves/legi.json`. Les champs habituels restent présents
(`id`, `publisher: "Légifrance"`, `url`, `level`, `official`,
`classificationReason`, `excerpt`). Puis exécuter la forge ordinaire :

```sh
node scripts/blog-forge.mjs preparer <slug>
```

La forge copie le JSON A4 sous
`editorial/articles/<slug>/preuves/sources/<source-id>.dila.json`, écrit le texte
et une preuve d'accès distincte (`accessMode: "dila-copy"`, `httpStatus: null`,
collecte originale, empreintes, identifiant/version/date juridique et réserve).
Elle ne consulte pas le réseau pour cette source. La date de la source projetée
dans le manifeste est celle de la collecte, pas celle de préparation.
Le dossier publié scellé conserve tous ces octets : son audit historique
n'exige pas de nouvelle collecte à J+8, mais une nouvelle préparation/publication
exige une source fraîche. La suppression de la copie scellée reste refusée.

Le CLI bas niveau `blog:verify-source` accepte aussi un manifeste dont la source
porte `dilaCopyPath` relatif au dossier `editorial/articles/<slug>`.

## Ressources / glossaire

Dans `claimsEvidence.sources`, ajouter :

- `dilaCopyPath` relatif à la racine du dépôt ;
- `dilaCopySha256` égal au hash du JSON exporté ;
- `verificationEvidenceRef` égal à `dilaCopyPath` (la classification conserve
  une preuve distincte) ;
- `checkedAt` égal à `provenance.retrieved_at` exact ;
- `requestedUrl`, `finalUrl`, `upstreamUrl` égaux à l'URL publique Légifrance ;
- `snapshotPath` vers le texte exact sélectionné, avec `contentSha256` calculé
  sur ses octets.

Le JSON A4 et le texte doivent tous deux figurer dans `integrity.sourceBundle`.
Conserver les liens bidirectionnels et toutes les citations/revues du manifeste.
Pour cette source uniquement, la fenêtre de 0–7 jours remplace l'ancien contrôle
même jour/24 h entre collecte et verdict métier. Les dates de claims et de
verdicts, leur validité, leurs identités et leur liaison au candidat ne changent
pas. `applicability.validAsOf` suit le jour ISO de `checkedAt` comme les autres
sources du contrat Ressources ; il ne remplace pas la date de version juridique.

```sh
node scripts/resource-pipeline.mjs validate <manifest.json> --phase qa
```

## Services

La forge des services accepte une liste optionnelle `sources` dans sa recette.
Chaque entrée DILA comporte `id`, `url`, `excerpt`, `dilaCopyPath` (relatif à
`commercial/recettes/<slug>`) et `dilaCopySha256`. L'URL doit apparaître dans le
corps ; l'extrait doit être exact dans la copie. Les copies sont incluses dans
le sceau du service. Préparation, scellement et publication suivent la chaîne
ordinaire ; l'audit d'un service publié contrôle la fraîcheur au moment de sa
publication conservée, pas à la date d'un build ultérieur.

Pour une citation JORFARTI, exporter son acte JORFTEXT puis choisir comme URL
`https://www.legifrance.gouv.fr/jorf/article_jo/<JORFARTI…>`. Le lecteur sélectionne
seulement le corps de cet article et refuse une citation d'un autre article.
L'acte entier utilise l'URL `https://www.legifrance.gouv.fr/jorf/id/<JORFTEXT…>`.
Aucun identifiant LEGI n'est déduit d'un JORF.

## Vérification

```sh
node --test tests/scripts/dila-source-copy.test.mjs tests/scripts/dila-forges.test.mjs tests/scripts/service-forge.test.mjs
node tests/scripts/dila-real-smoke.mjs <copie-LEGI-A4.json> <rapport.json>
npm run build
```

Le smoke réel emploie une copie LEGI A4 sans la modifier et exécute les gates
complets d'un dossier article et d'un terme. Les autres données et les avis de
ces dossiers sont des fixtures techniques explicitement synthétiques : ce
rejeu n'est ni une publication ni une revue métier de contenu. Le lecteur
JORF est également exercé par les tests positifs/négatifs et l'export réel.
Les tests isolés ne nécessitent ni le référentiel A4 ni Légifrance en CI.
