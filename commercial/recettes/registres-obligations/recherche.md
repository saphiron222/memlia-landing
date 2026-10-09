# Décision de préparation : registres et obligations

Route : /automatisation/registres-obligations. Famille : registres-obligations.

## Demande et choix du format

Mesure réelle du 06/10/2026 par scripts/lib/seo-instruments.mjs#autocompleterGoogle, provenance exacte dans preuves/demande.json :

- automatisation suivi registres obligations cabinet comptable : aucune suggestion.
- automatisation registres cabinet comptable : aucune suggestion.
- délai déclaration bénéficiaire effectif greffe : trois suggestions (déclaration bénéficiaire effectif greffe ; document beneficiaire effectif greffe ; registre bénéficiaire effectif greffe).

Le pic du backlog du 19/09 est confirmé sur la sonde informationnelle, pas transformé en volume mensuel ni en preuve de demande commerciale. La page de service est retenue dans le programme G1 : elle répond au geste de suivi entre pièces, liste d’obligations et rappel, distinct d’un guide de déclaration. Le H1 qualifié vise le cabinet comptable. Les résultats de recherche Google ont renvoyé /sorry ; Firecrawl search/extract a renvoyé 403. Lecture directe de concurrents réalisée en remplacement, aucun classement SERP revendiqué.

## Concurrence lue avant rédaction

LegalVision, accueil https://www.legalvision.fr/, HTTP 200, capture preuves/sources/2.txt et 2.html. Extraits de page : « On fait les formalités. Vous faites la différence. » ; « Registres légaux dématérialisés ». L’offre couvre externalisation de formalités et outil de formalistes. La page vise explicitement les experts comptables dans sa navigation. Pas d’affirmation comparative de qualité, prix, délais ou compatibilité.

Axiocap, accueil https://www.axiocap.com/, HTTP 200, capture preuves/sources/axiocap.txt et .html. Extrait : « Dématérialisation des registres légaux, pilotage de l’actionnariat et des entités, organisation des assemblées en ligne. » La page présente aussi les données à jour et échéances de mandats suivies. Un cabinet voulant tenir ses registres, gérer les assemblées et l’actionnariat dans un outil spécialisé peut être mieux servi par cette catégorie. Memlia prend le geste résiduel dans les outils existants ; aucun remplacement de ces fonctions n’est promis.

La tentative LegalVision /experts-comptables/ a rendu une page sans texte exploitable, donc non utilisée comme preuve. Plusieurs autres URLs candidates ont échoué ; seules les captures effectivement lisibles fondent l’analyse.

## Cannibalisation

Contrôle exact de la requête primaire dans registre-requetes.json : aucune collision. Lecture des familles et de l’architecture : le dossier de formalités traite assemblage et dépôt ; approbation-depot-comptes traite campagne annuelle ; registres-obligations traite préparation des mises à jour et rappels. Le pilier carte-des-tâches reste informationnel et devient un lien entrant, pas une page commerciale concurrente. Pas de route fille par registre, délai ou bénéficiaire.

## Sources et périmètre sensible

Ouvertures INPI et Infogreffe HTTP 200 le 06/10, captures brutes et texte sous preuves/sources ; sources-verifiees.json porte URL, date et extrait exact. Le corps cite la phrase exacte INPI sur correction de données au RNE ; aucun délai légal, seuil de détention, critère de contrôle ni règle de périodicité universelle n’est publié. La distinction correction/modification doit rester examinée par le cabinet. L’accès aux informations BE est contrôlé et n’est pas promis comme une collecte ouverte.

## Rejeu et limites

Neuf cas exécutés par rejouer.py, sorties dans preuves/rejeu.json. Démonstrateur de fiche de suivi seulement : dates et qualifications validées fournies en entrée, aucun calcul de délai juridique, inscription, signature, envoi, dépôt ni connexion réelle. Les annotations restent séparées. Une pièce manquante produit une liste à valider ; une qualification non validée, date non validée, contradiction ou pièce illisible arrête la fiche. Un doublon ne recrée pas la proposition. Une date passée n’est pas transformée en réalisation.

## Passage au développeur

Conserver le PASS metier et le corps scellé. Concevoir un cadre HTML fictif spécifique suivant memlia-site-design : trois fiches, une prête à valider, une avec tableau de détention manquant, une arrêtée sur qualification ; aucun bandeau réglementaire ou promotionnel. Le visuel ne simule ni portail ni registre tenu. Sources en bloc compact distinct du CTA final. La date et le chemin de preuve locale restent internes ; ne pas afficher « preuves/rejeu.json » comme un lien public inexistant.

Créer SERVICE_DESIGN et SERVICE_EEAT à partir du rejeu réel, pas d’une compatibilité annoncée. Matérialiser les trois liens d’ancre exacte déclarés dans recette.json, le footer et le sitemap. Pour le pilier scellé, passer par sa forge et préserver son fond approuvé. Fusionner les trois mesures et l’unique entrée service du paquet avec celles de main ; ne pas écraser le registre ou le relevé d’une carte sœur. La forge a ici préparé un candidat, pas publié la page. La carte dev t_7621a3aa prend rendu, QA, build, CI, publication et vérification en production.
