# Qualification collecte-pieces — dossier conservé

La décision du 6 octobre 2026 est une non-ouverture : aucune page commerciale supplémentaire n'est publiée. La méthode reste dans `/blog/automatiser-la-relance-des-pieces-clients`, la délégation dans `/automatisation-cabinet-comptable`, puis `/contact`.

## Pièces du dossier

- `QUALIFICATION-COLLECTE-PIECES.md` : rapport, séparation avec l'existant et critère de réouverture.
- `autocomplete.json` : huit réponses du 6 octobre, sept listes vides et une suggestion générique ; aucun volume mensuel.
- `sources-ouvertes.json` et `sources/` : extraits Dext/MyCompanyFiles et HTML capturés lors de la qualification.
- `verification.json` : résultat historique du parent, notamment les GET 200/200/404. Il ne décrit pas une vérification de production à la date de l'intégration.
- `scripts-origine/` : scripts originaux inchangés, archivés pour expliquer la collecte. Ils dépendaient de l'ancien workspace (`site/` et `qualification/`) et ne sont pas les commandes de contrôle de ce dossier. Ne pas relancer la mesure en écrasant les preuves historiques.
- `verifier-integration.py` : assertions locales en lecture seule, adaptées au dépôt. Elles vérifient les données archivées, leur cohérence et le maintien du rattachement existant ; elles ne rejouent pas les requêtes réseau et ne présentent pas les statuts historiques comme des réponses actuelles.

## Vérifier l'intégration

Depuis la racine du dépôt :

```sh
python3 docs/strategy/site-v3/qualifications/collecte-pieces/verifier-integration.py
git diff --check -- . ':(exclude)docs/strategy/site-v3/qualifications/collecte-pieces/sources/*.html'
```

Le contrôle des espaces exclut les HTML archivés : leurs espaces de fin de ligne sont conservés pour ne pas altérer les captures originales.

Le dossier est repris sans altération du paquet durable `qualification-collecte-pieces.tar.gz` attaché à la carte parente `t_3f4202bc` ; intégration suivie par `t_ff817158`. Les HTML tiers sont des archives documentaires, pas des pages servies par Astro. Aucun H1, canonical, requête, maillage, recette ou visuel public n'est modifié. Les limites SERP et la distinction entre outil natif et délégation restent celles du rapport. Pas de suivi J+7/J+28 : il n'y a pas de nouvelle page publiée.
