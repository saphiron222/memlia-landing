# Vague CAC du glossaire — intégration

Quatre lots de dix termes sont importés sans modifier les cinq champs publics relus.
Les candidats corrigés des lots 1 et 2 remplacent leurs préparations initiales ; les
lots 3 et 4 sont originaux. Les quatre PASS sont t_ada6a80c, t_135675b2,
t_f87ddaa1 et t_bf6cb3b3. Les rapports, avis détaillés et projections originales
restent sous lot1/ à lot4/, avec identités, dates, réserves et copies intactes.

## Contrat et report

Le hub reste /glossaire : 55 termes antérieurs plus 40 termes CAC. Les ancres
imposées ipe-audit, seuil-planification-audit et confirmation-tiers-audit sont
préservées ; circularisation, revue analytique et lettre d’affirmation ne créent
pas d’entrée supplémentaire. Leurs équivalences figurent dans les candidats.

resource-metier-cac.mjs importe les projections après les preuves historiques
et EC. Chaque lot possède un espace d’identifiants distinct : deux copies de la
même norme restent attribuées aux avis qui les ont effectivement relues. Les
sous-claims, leurs extraits et les champs complets ne sont pas confondus.
Les métadonnées claimSubject/evidenceStatus/basedOnClaimIds, non acceptées par
le schéma du manifeste exécutable, restent intégralement dans les projections
originales importées ; les affirmations atomiques et leurs chaînes source/citation
sont projetées dans le manifeste public. Aucune source officielle n’est attribuée
à une synthèse Memlia.

Le manifeste couvre 286 unités, 423 claims, 761 citations et 84 sources.
L’enveloppe agrégée contient 262 avis sensibles : les 45 avis historiques/EC et
les 217 avis CAC, sans redater leurs jugements ni leurs motifs. Le reviewer de
l’enveloppe historique est conservé ; les quatre identités CAC font autorité dans
les fichiers originaux, pas l’identité de l’intégrateur.

## Reproduction

Installer les dépendances puis, après le rendu initial et lastmod:sync :

    npm run resource:seal-surfaces
    node scripts/import-cac-resource-reviews.mjs
    node scripts/reaffirm-resource-review.mjs ancrer
    npm run regen:generated
    npm run resource:audit:qa

L’import des avis vérifie les sujets originaux avec la bibliothèque native et la
couverture exacte ; il n’émet aucun jugement métier. Après initialisation, la
régénération usuelle reporte l’enveloppe acquise et contrôle le fond inchangé.
Les libellés courts des sources sont des titres documentaires de présentation,
pas une nouvelle affirmation. Le classement alphabétique É → E est testé.
Les tests ciblés sont glossary-cac, resource-pipeline, dila-source-copy,
test_glossary, test_resource_v3_traceability et glossary.spec.ts ; la construction
et les suites complètes font foi dans Repository gates sur GitHub.

## Sources et maillage

Les dix-neuf identifiants DILA distincts ont été réellement réexportés par
export-dila-source.mjs et comparés à leurs copies relues, sans changer leur
collecte du 6 octobre Paris. Réserve A4 maintenue : collecte récente ne démontre
pas une consolidation générale courante et aucune ouverture HTTP Légifrance
n’est revendiquée. La fenêtre de nouvelle préparation expire après le 13 octobre.

Le maillage public CAC porte uniquement les deux articles effectivement servis :
/blog/verifier-reponse-ia-comptabilite et
/blog/ia-comptabilite-confidentialite-donnees. Ce sont des contextes EC explicites,
pas des guides d’audit. Les deferredLinks des quatre candidats restent
documentaires ; leur publication future autorisera une passe de maillage distincte.
Les deux termes IA EC restent reportés, sans changement de la vague EC livrée.
