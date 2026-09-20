# Outils gratuits — point zéro du 20 septembre 2026

La règle qui juge ce relevé a été figée à 21:12 Europe/Paris dans `../OUTILS-BOUCLE.md`, avant la lecture page par page. Le relevé machine complet est `outils-point-zero-2026-09-20.json`.

## Verdict

**NON MESURABLE à ce stade.** Les trois outils ont été publiés le 20 septembre, alors que la fenêtre Search Console disponible s’arrête au 17 septembre. Google les déclare encore inconnus. Les zéros ci-dessous forment donc un point de départ ; ils ne prouvent ni l’intérêt ni l’inutilité des outils.

La vague 3 reste fermée jusqu’au **21 octobre 2026**. O4 demeure l’unique porte de déclenchement. Aucun ticket de construction n’est créé. Si plusieurs signaux passent alors, une seule place pourra être remplie, puis le vivier sera remesuré.

## Mesure des trois outils

| Outil | Impressions | Clics | Position | Contact envoyé | Entrée Cloudflare | Domaines référents | Indexation |
|---|---:|---:|---:|---:|---|---:|---|
| Calculateur de marge commerciale | 0 | 0 | — | 0 | ND | 0 | Inconnue de Google |
| Calculateur de date d’échéance | 0 | 0 | — | 0 | ND | 0 | Inconnue de Google |
| Modèle de rapprochement bancaire | 0 | 0 | — | 0 | ND | 0 | Inconnue de Google |

Un zéro n’est écrit que lorsque l’instrument a répondu :

- Search Console a répondu pour `sc-domain:memlia.fr`, fenêtre du 21 août au 17 septembre ; aucune ligne outil ;
- URL Inspection a répondu trois fois : 3 verdicts `NEUTRAL`, couverture `URL is unknown to Google`, 0 erreur ;
- D1 `memlia-contact` a répondu, a lu 5 lignes et n’a renvoyé aucune origine d’outil ;
- DataForSEO Backlinks a répondu sur les 17 URL exactes ; aucune n’était présente dans son index de liens ; coût réel **0,4086 $**, journalisé ;
- Cloudflare Web Analytics ne rend aucune donnée exploitable depuis le socle O2 : la page d’entrée reste **ND**, elle n’est pas remplacée par une autre métrique.

## Comparaison sur les mêmes instruments

| Groupe | Pages | Pages avec signal Search | Impressions | Clics | Médiane impressions/page | Domaines référents | Médiane domaines/page |
|---|---:|---:|---:|---:|---:|---:|---:|
| Outils | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| Services | 6 | 1 | 1 | 0 | 0 | 0 | 0 |
| Articles | 7 | 6 | 34 | 1 | 1 | 0 | 0 |

Les âges sont conservés route par route dans le JSON. Cinq services et les trois outils ont 0 jour au relevé ; les articles ont entre 1 et 11 jours. La comparaison n’est donc pas causale.

## Autorité

Point zéro : **0 domaine référent** sur les 3 outils, **0 sur les 6 services**, **0 sur les 7 articles** dans l’index DataForSEO interrogé. L’hypothèse « outil utile → lien spontané » n’est pas testée le jour de publication. Elle sera jugée à J+90, le 19 décembre. Si les outils restent à zéro domaine alors, la règle préenregistrée la déclare non confirmée.

Le relevé enregistre aussi une limite de distribution : la correction qui doit porter le hub dans le footer (`t_424e8e25`) n’était pas présente dans `origin/main` au moment du point zéro. On ne confondra pas cette invisibilité interne avec un rejet des outils.

## Justesse et retrait

`node scripts/veille-outils.mjs` relit chaque source officielle, trois lectures réseau au plus par outil. Le contrôle initial est **PASS** : marge en 1 lecture, échéance en 2 lectures avec la fiche officielle Service-Public après le refus automatisé de Légifrance, rapprochement en 1 lecture.

Le mécanisme de suspension est prêt dans le rendu : `statut: suspendu` retire l’outil du hub, le passe en `noindex`, masque le calcul et affiche le motif daté. Une réactivation automatique est interdite ; elle exige une source fraîche, une recette et une publication vérifiée.
