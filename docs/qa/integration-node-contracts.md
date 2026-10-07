# Contrats Node des intégrations et témoin accueil

Les neuf intégrations historiques restent un inventaire fermé, avec leurs dates de
source historiques. Les guides ajoutés par la forge sont lus dans
`src/data/guides.generated.json` ; le contrat d'inventaire lance l'audit de la forge
avant de comparer exactement les routes rendues à l'union historique + scellée.
Une route supplémentaire, une route manquante ou une collision reste un échec.
Les contrôles documentaires de portée/champs couvrent les deux collections ; la
date fixe historique ne s'applique pas à un nouveau guide.

Le témoin accueil conserve son empreinte historique. Un guide scellé ajoute un
lien au footer : le test vérifie sa présence unique, sa classe, son intitulé,
son emplacement et la source intégrale du fragment `li`/`a`, puis retire
uniquement le `li` correspondant par ses offsets
source. Aucun DOM n'est resérialisé : tous les autres octets de la page restent
comparés au témoin. Les mutations de lien sont testées séparément. Un nouveau
contenu de l'accueil ne peut donc pas passer en mettant automatiquement à jour
l'empreinte, et une modification du reste de la page demeure refusée.

Le fragment autorisé suit exactement le rendu du Footer historique, avec son
attribut Astro `data-astro-cid-jo6i4kqk` (ou sans scope dans la fixture unitaire).
Aucun attribut supplémentaire n'est ignoré, y compris les doublons que parse5
élimine : les six mutations QA (aria-hidden, tabindex et style du lien, hidden
et style du li, second href) sont refusées avant retrait. Un changement du scope
Astro exige donc une adaptation explicite du témoin, pas un joker d'attributs.

Rejeu ciblé après Astro et strip-briefs :

    node --test tests/scripts/accueil-render.test.mjs tests/scripts/accueil-witness.test.mjs tests/scripts/integration-scope.test.mjs tests/scripts/integrations.test.mjs

La réparation est testée aussi sur la collection EBP réellement scellée, hors de
la PR technique. Aucun contenu, média, recette ou revue EBP n'est livré ici.
