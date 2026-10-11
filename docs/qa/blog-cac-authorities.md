# Sources officielles CAC dans la forge

Le registre de la forge et celui du gate dossier reconnaissent les mêmes couples :

| Domaine exact | Éditeur (sigle ou nom complet) |
| --- | --- |
| `h2a-france.org` | H2A / Haute autorité de l’audit |
| `doc.cncc.fr`, `cncc.fr` | CNCC / Compagnie nationale des commissaires aux comptes |

Les sous-domaines non listés restent refusés. La déclaration `official: true` ne remplace pas le couple domaine/éditeur. Les claims restent `legal-reglementaire` : reconnaissance d’autorité, pas validation de leur interprétation juridique. Les contrôles de copie, d’extrait, de fraîcheur, de réseau et la revue métier restent inchangés.

## Non-régression

`node --test tests/scripts/blog-cac-authorities.test.mjs` joue six couples positifs et douze négatifs dans `construireClaims` puis le gate complet `validateDossier` : suffixes trompeurs, préfixes, sous-domaines arbitraires, échange H2A/CNCC et éditeur incohérent. Les positifs vérifient aussi le maintien du type sensible, le refus sans `official` et le refus d’une citation absente. Les copies de ces tests sont fictives et locales, sans résolution des domaines usurpés.

Avant correction : six positifs refusés, douze négatifs correctement refusés. Après correction : les 18 cas passent. Suite pertinente forge/pipeline/hardening/autorité publiée : 129 tests PASS. Le nouveau fichier est découvert automatiquement par `scripts/test-scripts.mjs` en CI.

## Probe réseau du 9 octobre 2026

Le probe F4 `.qa/f4-authority-probe.mjs` a été rejoué sur les deux URL réelles, avec `verifySource` puis `construireClaims` :

- H2A NEP 315 : `https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/` ; extrait « le degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils. » ; `CLAIM h2a []`.
- CNCC NEP 230 : `https://doc.cncc.fr/docs/nep-230-documentation-de-laudit-x` ; phrase d’homologation ouverte et copiée ; `CLAIM cncc []`.

Les deux ouvertures ont produit leur preuve et leur copie locale dans `.qa/f4-source-probe/`. Aucun calendrier ni contenu public n’est modifié. La revue QA indépendante et Repository gates restent les conditions de fusion.
