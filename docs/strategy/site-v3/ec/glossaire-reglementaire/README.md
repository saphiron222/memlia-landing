# Glossaire EC — quatre termes réglementaires préparés

Paquet de préparation du 11 octobre 2026 pour t_3395d534. Canonical conservé : /glossaire ; les quatre termes restent des ancres. Ni publication, ni intégration aux fichiers partagés, ni avis métier acquis.

## Livrable et usage

- entries.json : les quatre entrées complètes ; définitions autonomes, exemples fictifs, confusion et frontière préparation/décision humaine. businessReviewer et reviewedAt restent null.
- sources.json et sources/ : huit copies officielles, ouverture du 11/10, URL, version, empreinte de la copie. L’extracteur fournit le contenu mais pas le statut HTTP ; httpStatus reste null, sans inventer un HTTP 200.
- claims.json et affirmations-sources.md : affirmations décomposées par phrase, champ complet pour contexte, extrait exact et source. Les conventions pédagogiques, le jeu fictif et la frontière de service sont distingués des règles opposables. Les phrases fiscales de l’exemple de facturation restent classées fiscal.
- admission.json et LIENS.md : articles réellement servis et décisions d’admission, séparés des cinq liens futurs. Les pages en erreur ne sont pas considérées comme des articles servis.
- dila-provenance.json et sources/cgi.dila.json : export original par la voie PR125, dates de collecte non changées, concordance du corps et différence des notes.
- checks.json, check_package.py et les logs : contrôles mécaniques de préparation. Ce PASS n’est pas une revue du fond ni une autorisation de publier.

Le dossier est livré dans une archive dont la racine est docs/strategy/site-v3/ec/glossaire-reglementaire/. Le reviewer peut extraire cette archive dans son workspace sans toucher au dépôt principal. Son avis appartient à t_79043fac ; l’intégration et la publication appartiennent à t_dd049e8c.

## Corrections essentielles par rapport au plan du 19 septembre

Le plan ancien constitue une piste, pas une preuve actuelle.

1. Supervision humaine. L’article 14 définit le contrôle humain des systèmes à haut risque, pas une obligation uniforme sur toute IA comptable. La consolidation EUR-Lex du 27/07/2026 et le règlement modificatif (UE) 2026/1744 sont ouverts et copiés. L’article 113 actuel reporte le chapitre III, sections 1 à 3, au 02/12/2027 pour les systèmes de l’article 6 §2/annexe III et au 02/08/2028 pour ceux de l’article 6 §1/annexe I. Ne pas reprendre « article 14 applicable depuis le 2 août 2026 ». La qualification et les règles transitoires doivent être examinées pour l’usage précis.
2. Maîtrise de l’IA. Le chapitre I s’applique depuis le 02/02/2025, mais l’article 4 a été remplacé en juillet 2026. Le texte actuel porte des mesures pour favoriser le développement de la maîtrise, sans obliger à garantir un niveau spécifique par individu. L’ancienne formulation « garantir un niveau suffisant » n’est pas reconduite comme description du texte actuel. Article 3, point 56, article 4 et acte modificatif sont copiés.
3. Lettre de mission. L’article 151 du décret 2012-432 exige un contrat écrit ; ce contrat peut prendre la forme d’une lettre de mission. Ne pas confondre l’obligation de contrat et une obligation de titre ou de forme particulière. La page officielle consultée donne la version depuis le 01/01/2023.
4. Facturation électronique. Distinguer réception pour toutes les tailles dès le 01/09/2026 et émission/e-reporting dès cette date pour les grandes entreprises et ETI, puis au 01/09/2027 pour PME et micro-entreprises. Les opérations domestiques concernées et la transmission de données pour particuliers/étranger ne sont pas le même périmètre. PDF ordinaire envoyé par courriel et format mixte contenant un fichier image ne se confondent pas.

La consolidation EUR-Lex précise elle-même qu’elle est un outil documentaire ; les actes publiés au JO font foi. L’acte initial et le modificatif sont conservés à côté de la consolidation pour cette raison.

## Réserves A4 / disponibilité réellement constatée

- CGI : le référentiel A4 contient LEGIARTI000053546660, article 289 bis, depuis le 21/02/2026, statut ABROGE_DIFF. Collecte originale : 2026-10-05T22:44:33.011198+00:00 ; partition DINUM livrée le 26/09/2026. La collecte a moins de sept jours au jour de préparation ; l’export du 11/10 ne la redâte pas.
- La commande PR125 scripts/export-dila-source.mjs a réussi. Le corps entier de 2 074 caractères concorde avec la copie de page officielle après normalisation des seuls espaces. Cela n’atteste pas les notes ni l’ensemble du corpus A4.
- La première note A4 est tronquée après « à compter du 1 ». La page officielle complète indique « à compter du 1er janvier 2027 », puis une réserve de maintien jusqu’à la reprise réglementaire. Le paquet utilise cette page complète comme source juridique principale, jamais la note tronquée. Cette différence est confiée à platform sur t_976e43cb, indépendante de ce lot.
- La date sentinelle A4 valid_to_exclusive = 2222-02-22 n’est pas une preuve de validité juridique jusque-là. La page officielle porte l’abrogation différée et le maintien transitoire ; prévoir une nouvelle lecture lors de la revue de décembre et avant une réutilisation en 2027.
- La DGFiP conserve dans sa FAQ un lien LEGIARTI000046195635. Cet identifiant désigne dans A4 une version antérieure finissant au 21/02/2026. La source du lot est l’identifiant actuel LEGIARTI000053546660, dont la page a été ouverte directement. Aucun identifiant n’est remplacé silencieusement dans la preuve historique.
- Lettre de mission : LEGIARTI000046882378 est absent du périmètre du snapshot A4 interrogé. La page publique Légifrance est cette fois lisible par l’extracteur et sa copie complète est conservée. Pas de copie DILA inventée pour cet article et pas d’extension du référentiel dans ce lot.
- Une ouverture de page ou la concordance ciblée du CGI ne lève pas la réserve A4 de consolidation récente ni l’absence de réception générale des autres articles. Les contrôles historiques invalidés du référentiel ne sont pas utilisés.

## Admission : préparation de quatre termes, publication conditionnelle

Seize articles de origin/main ont été lus à leurs URL de production, ainsi que les cinq URL envisagées par le plan. Aucune de ces cinq URL ne sert un article : l’extracteur retourne « Page introuvable — Memlia ».

Lettre de mission et Facture électronique et plateforme agréée ont des liens vers des articles servis qui emploient le concept. Pour le terme composé de facturation, l’article emploie « facture électronique » ; le complément plateforme est défini dans l’entrée, sans prétendre que l’article l’emploie déjà. Cette justification est soumise à la revue métier.

Supervision humaine et Maîtrise de l’IA sont préparées mais non admises à la publication : aucun article servi examiné n’emploie ces termes. Leurs internalLinks restent vides. Une revue favorable de leur contenu ne crée pas un article support ; la publication ne doit pas les intégrer tant que la règle d’admission n’est pas satisfaite. Aucun lien futur n’est placé dans entries.json. L’absence de ces articles n’empêche pas la revue de ces deux définitions préparées.

## Compatibilité et livraison technique

Tous les champs et conventions GlossaryEntry sont respectés, avec une évolution de date explicitement nécessaire : l’union sourceCheckedAt de main ne contient pas encore 2026-10-11. Le test sur le contrat original produit exactement quatre erreurs de date ; le test sur le même contrat avec cette seule date ajoutée passe. Ne pas falsifier la fraîcheur en réutilisant 2026-10-08 pour éviter cette erreur.

contract-origin-main.ts est la copie des interfaces de origin/main au commit indiqué dans checks.json. entries.contract.ts prouve la compatibilité de structure avec la seule extension de date proposée. entries.original-contract.ts est le témoin négatif, non destiné à être ajouté à une compilation globale. Lors de l’intégration après revue, étendre sourceCheckedAt pour 2026-10-11 dans le contrat réel et supprimer ou exclure ces témoins de préparation du build ; les dates propres des autres sources restent inchangées. Aucun de ces fichiers n’a modifié src/data/glossary.ts du dépôt.

Le travail est isolé dans le workspace scratch à partir d’une extraction ciblée de origin/main. Aucun worktree, commit, push ou déploiement n’a été nécessaire pour cette phase documentaire. Aucun fichier global du glossaire ou manifeste Ressources n’a été touché ; aucun build complet local, la CI Repository gates appartenant à la future livraison intégrée.

Contrôles exécutables dans le dossier :

    python3 check_package.py

Les six tests vérifient le paquet réel et refusent source périmée, extrait inexact, lien non servi, revue attribuée à l’auteur et empreinte modifiée. Les copies et preuves d’articles restent disponibles pour la revue humaine indépendante.
