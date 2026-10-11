# COPY glossaire : paquet de revue ciblée

Carte t_6e4b0516. Base origin/main au démarrage : 4f42a88b. Révision de fond en attente de la revue indépendante metier ; les anciens verdicts du corpus inchangé restent acquis. La réaffirmation automatique de la chaîne Ressources n’est pas un verdict sur ces trois corrections.

## Objet de la revue unique

- CONT-10, #prelevement-sepa-et-rejet : le suivi prépare une proposition. Le cabinet contrôle mandat, motif, montant et date avant programmation ou transmission bancaire. L’exemple fictif suit la même frontière. Retrait du délai fictif arbitraire et de la généralisation non sourcée « la plupart des rejets ».
- CONT-11, #honoraires-mensualises-et-actes-hors-forfait : la mensualisation décrit une facturation ou une répartition. Le prélèvement est un mode de règlement possible, avec mandat. Le hors forfait reste distinct. La phrase légale finale sur la fixation des honoraires est conservée à l’identique avec sa source et sa revue antérieures.
- CONT-12, #generation-augmentee-par-recuperation : les passages récupérés enrichissent le contexte, sans effacer l’entraînement. Le modèle peut ajouter une information absente du corpus ; le cabinet relit le passage cité.
- CONT-13 : renvois éditoriaux /methode, /garanties, /integrations et /automatisation-cabinet-comptable. Navigation d’accueil inchangée. Identifiants, ancres, sources historiques, H1, canonical, structure et DA conservés.
- Hub : introduction orientée usage ; sortie « Une tâche répétitive à nous confier ? », règle écrite et tâche entière dans les outils existants ; recette définie ; décision au cabinet. CTA canonique inchangé.

## Sources ouvertes le 08/10/2026

Les copies HTML et leur extraction texte vivent dans sources/. captures.json conserve les heures réelles de collecte. curl --fail --location a réussi après timeout du fetch Node. Aucune donnée client.

Banque de France, FAQ prélèvement SEPA :
https://www.banque-france.fr/fr/foire-aux-questions-le-prelevement-sepa

Extraits exacts :

> Un créancier n’a légalement pas le droit d’émettre un prélèvement en l’absence du consentement du débiteur, ce dernier se matérialisant par la signature d’un mandat de prélèvement.

> Lorsque la provision sur votre compte n’est pas suffisante, votre prestataire de services de paiement (généralement votre banque) peut refuser de payer le prélèvement. Il doit vous le notifier et vous préciser le motif du refus.

> La révocation porte sur le moyen de paiement et est indépendante de la créance sous–jacente.

Portée : mandat, refus et persistance de la dette. La préparation/validation en quatre éléments est la règle de service Memlia, pas une obligation nouvelle attribuée à la Banque de France. La mensalisation relève des conditions convenues dans la lettre de mission, pas d’une obligation de prélèvement.

Microsoft Learn, RAG :
https://learn.microsoft.com/fr-fr/azure/search/retrieval-augmented-generation-overview

> La génération augmentée par récupération (RAG) est un modèle qui étend les capacités des LLM en ancrant les réponses dans votre contenu propriétaire.

CNIL, FAQ IA générative, question 3 :
https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative

> Elle permet de produire des réponses enrichies par des données externes, potentiellement plus spécifiques et plus faciles à actualiser que le modèle lui-même.

Question 2 :

> Les modèles génératifs ne sont pas des bases de connaissance

La suite décrit la logique probabiliste liée aux données d’entraînement et le risque de résultats inexacts mais plausibles. Les passages sont présents dans le HTML récupéré, y compris les accordéons, et la question 3 a été ouverte au navigateur.

Légifrance, article 158 : tentative d’extraction refusée, navigateur sous challenge. Ne pas considérer cette page comme rouverte. La phrase réglementaire déjà revue n’est pas modifiée ; sa copie historique et son verdict sont conservés. La correction nouvelle porte sur la périodicité conventionnelle et le mandat, étayé par la Banque de France rouverte aujourd’hui.

## Base et mesure

sources/production-avant.html et .txt : GET réel /glossaire, Cache-Control: no-cache, sans query string. Les anciennes formulations y sont conservées comme référence avant livraison. Aucun trafic ni taux de conversion n’est inventé : l’effet reste à mesurer après publication.

Après PASS, intégration dev : fusion sous CI verte, lecture réelle de /glossaire en production, comparaison de toutes les ancres à la capture avant et contrôle des quatre corrections/CTA. Programmer ou consigner J+7 et J+28 depuis la date effective de publication : Search Console (impressions/clics de /glossaire si accès), demandes qualifiées attribuables si disponibles, intégrité ancres/liens. Ne pas déduire une conversion d’un clic CTA.

## Vérification

Les résultats exécutés sont consignés dans VERIFICATION.md. La revue metier cible les corrections et la frontière bancaire, pas les définitions inchangées. L’intégration conserve ce verdict ; une actualisation de date ou du chrome ne redemande pas de revue de fond.
