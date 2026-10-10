# Propriété du rendu v2

`render-proofs-v2.mjs` peut publier plusieurs séries dans le même dossier et le même manifeste. Le propriétaire d'une entrée est son fichier HTML `source`, sans le fragment de cadre, comparé après résolution du chemin depuis la racine du dépôt. Les variantes `./docs/...` désignent donc le même propriétaire. Ni la cible, ni le numéro de cadre, ni le nom du manifeste ne donnent la propriété.

En rendu et en adoption, le script remplace toutes les entrées de ce propriétaire par les candidats actuels (y compris les images sociales) : un cadre retiré ne reste pas répertorié. Les entrées des autres propriétaires sont conservées sans modification, ainsi que leurs fichiers. Une cible déjà revendiquée par un autre propriétaire est refusée avant toute écriture du contrat, des actifs publiés ou du manifeste.

Les sources déjà répertoriées restent présentes. Seules les dépendances effectivement lues par le rendu courant sont mises à jour : HTML, CSS, contrat, CSS commun et renderer. Une dépendance partagée a une seule entrée par chemin ; son empreinte reflète le dernier rendu qui l'a lue. Les sources propres aux séries indépendantes ne sont pas relues ni rescellées. Les champs supplémentaires du manifeste sont conservés ; `browser` indique le dernier navigateur de rendu.

Le wrapper `render-relance-facture-proof.mjs` remplace sa propre provenance (wrapper, moteur et fichiers de rejeu) par chemin résolu, au lieu de l'ajouter. Il répare ainsi les doublons historiques sans toucher aux sources indépendantes. Son `--check` exige une occurrence courante par dépendance. `tests/scripts/relance-provenance.test.mjs` couvre deux rendus successifs puis une évolution inerte du wrapper, chacun suivi d'un contrôle sans écriture.

`--check` contrôle les candidats de la série demandée sans écrire les fichiers publiés, le contrat ou le manifeste ; les annotations restent dans `.qa`. Une cible revendiquée par un autre propriétaire est également refusée. Cette règle ne fournit pas de verrou entre deux processus : les rendus qui écrivent le même manifeste restent à sérialiser.

Régression réelle : `node --test tests/scripts/proofs-v2-ownership.test.mjs`. Elle lance Chromium sur les sources historiques, compare les entrées indépendantes et les octets de leurs sources et actifs, retire une ancienne entrée propre, vérifie le rendu puis provoque une collision. Jouée dans `Repository gates`, elle reste hors du build Cloudflare qui ne dispose pas de Chromium. Aucun visuel ni manifeste de production n'est régénéré par ce test.
