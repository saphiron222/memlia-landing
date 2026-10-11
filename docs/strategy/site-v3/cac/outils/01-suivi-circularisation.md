# 01 — Lettres et suivi de circularisation

## Décision produit et intention
Chef de mission/collaborateur préparant une campagne. Une seule page pour clients, fournisseurs, banques, avocats, assureurs ; demandes ouvertes/fermées choisies par l'utilisateur. Catégorie preparer ; route /outils-comptables-gratuits/suivi-circularisation ; primaire « modèle suivi circularisation excel ». Amorce sondée sans suggestion dans F2 ; C3/C2 et C1 V014–V016 étayent les gestes voisins (circularisation commissaire aux comptes : 4 suggestions). Priorité 95. Contrat commun OUTILS-CAC-CADRAGE.md applicable.

## Contrat exécutable
Import CSV ou saisie : identifiant tiers, catégorie, destinataire/contact, référence mission, date de référence, devise, solde demandé facultatif, type de confirmation. Mapping et aperçu puis validation de sélection par le CAC. Générer des lettres originales imprimables et copiables, coordonnées de retour explicitement saisies pour le cabinet, sans reprendre modèle CNCC ni logo. Ouverte : pas de solde prérempli au destinataire ; fermée : solde confirmé avant sortie. Une lettre exportée reste « préparée », jamais « envoyée ».
Journal par tiers : préparée, envoi renseigné, réponse reçue, réponse rapprochée, non-réponse, désaccord, refus, transmis au CAC pour suite. Dates, référence de retour, montant confirmé et commentaire saisis ; l'utilisateur marque envoi/retour, l'outil ne les réalise pas. Écart décimal calculé seulement si même devise et base comparable ; aucune devise convertie. Plusieurs réponses historisées ; correction ne détruit pas une note existante. Relance proposée uniquement après délai choisi et envoi renseigné, suspendue sur refus/désaccord/réponse ; jamais expédiée. Les alternatives sont un point à décider par le CAC, pas un choix automatisé.
CSV complet du suivi, JSON de reprise incluant lettres/versions/notes, rapport imprimable ; avertir l'utilisateur de sauvegarder avant fermeture, sans autosave local. Fiche outil selon contrat commun. Pas de pièce jointe réelle traitée ni authentification de réponse prétendue.

## SEO et corps statique
H1/OG : « Modèle de suivi de circularisation Excel : lettres et retours ».
Title : « Suivi de circularisation : lettres et retours | Memlia ».
Description : « Préparez vos lettres de confirmation, suivez les retours et rapprochez les écarts localement. Exportez le tableau de suivi pour votre dossier. »
Plan ~650 mots hors interface : réponse/prise en main (80), importer et choisir les tiers (100), lettres ouvertes/fermées (100), suivre/rapprocher/relancer (140), exemple fictif (100), frontière et sources (80), FAQ/reprise (50). Formulations naturelles : demande de confirmation des tiers, retour, relance, écart, procédure alternative. Les variantes ne créent pas d'URL.
Source à rouvrir : NEP505 officielle H2A/CNCC en vigueur, notamment maîtrise sélection/rédaction/envoi/réception ; ne pas annoncer une condition des NEP911/912 sans lecture officielle. Concurrence : e-Circu décrit déjà le processus (DEMANDE-CAC §3 et dossier commun) ; gain visé = préparation autonome exportable/reprenable, pas processus inédit.

## Frontière
Se prépare seul : lettre à partir des champs validés, suivi, écarts comparables et propositions de relance. Attend validation : sélection, coordonnées, lettre, rapprochement et état déclaré. Reste humain : envoi/réception maîtrisés par le CAC, caractère probant, suites aux refus et choix des procédures. CTA après valeur vers /automatisation/circularisation-cac si publiée puis /contact.

## Cas d'acceptation dev
1. Deux tiers fictifs de même devise : l'un confirme 120 pour 100 demandé → écart +20 ; l'autre n'a pas répondu → pas d'écart zéro inventé.
2. Confirmation ouverte → aucune mention du solde demandé dans lettre ; fermée → montant validé présent.
3. Lettre générée → statut préparée ; absence de date d'envoi → pas de relance éligible.
4. Retour renseigné mais non rapproché → statut distinct ; refus/désaccord → relance suspendue.
5. Devise différente → comparaison non évaluée avec motif, pas conversion automatique.
6. Doublon identifiant, date de réponse avant envoi → exception visible ; aucune correction silencieuse.
7. JSON export/réimport → mêmes tiers, notes, dates, états et versions ; réinitialisation confirmée.
8. Cellule =HYPERLINK ou balise HTML → export neutre et affichage texte ; tests réseau/stockage du contrat commun.

## Design, maillage et mesure
Scène propre : trois tiers fictifs, réponse reçue non rapprochée, écart +20, refus suspendant la relance ; données issues des tests. Entrants projetés : hub outils (ancre « Suivi de circularisation »), pilier CAC, article /blog/cac-circularisation-campagne. Si ces deux derniers absents : /methode (« préparer et suivre les confirmations »), /garanties (« suivi local de circularisation ») dans passages utiles. Sortants hub, /methode et sources ; service/article seulement lorsqu'ils répondent réellement. Reprise/export, indexation et demandes CAC suivis J+7/J+28. Fini dev/publication dans contrat commun ; revue indépendante QA, sans promesse de conformité normative.
