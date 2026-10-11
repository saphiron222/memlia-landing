# 04 — Checklist des pièces comptables à demander

## Décision produit et intention
Persona : Collaborateur qui prépare les demandes mensuelles et de clôture pour un dossier.
Besoin : Produire une liste de pièces adaptée, distinguer reçu/manquant/non applicable et ne demander que le reste.
Route : `/outils-comptables-gratuits/checklist-pieces-comptables` ; catégorie : `preparer` ; primaire : `checklist pièces comptables`.
Signal du 06/10/2026 : Primaire : 0 suggestion. Relance pièces comptables : 1 suggestion mail relance pièces comptables. Pièces comptables : 10 suggestions surtout informationnelles ; elles ne prouvent pas une demande de checklist. Choix produit pour un irritant cabinet documenté, demande de l’outil encore faible.
Concurrence ouverte le 06/10 : https://fr.mailpro.com/blog/modeles-email-demande-documents-cabinet-comptable
Extrait exact de terrain : « Annoncez le but (dossier, période, échéance). » (pas source de droit).
Différence utile : Mailpro propose des emails et une checklist statique. Memlia transforme les statuts en demande exacte, rejouable d’un mois au suivant sans envoyer une pièce ni répéter la demande d’un document reçu. Différent du générateur de prompts : la sortie est la checklist et le message, sans modèle IA.

## Contrat exécutable
Entrées : Période mensuelle/clôture, familles choisies achats/ventes/banque/immobilisations/social, éléments libres, statut par pièce, échéance organisationnelle choisie ; aucune pièce jointe. Jusqu’à 100 éléments.
Résultat complet : Checklist éditable et imprimable, tableau CSV/JSON réimportable explicitement, message de demande contenant seulement les éléments manquants, plus éléments à clarifier.
Règle et arrêts : Trame opérationnelle originale et modifiable, pas liste d’obligations légales. Ne déduire aucun régime fiscal ou pièce obligatoire. État inconnu = à clarifier, pas manquant. Les modèles se limitent à libellés génériques : factures d’achat/vente, relevé bancaire de période, justificatif d’acquisition, récapitulatif de paie. L’utilisateur choisit ; aucune pièce requise imposée par statut d’entreprise. Export/réimport sans stockage navigateur ; version de schema et refus du JSON inattendu.
La proposition reste à valider ; l’outil n’écrit pas dans un dossier métier. Le contrat commun fixe les états, exports, parser, confidentialité et limites ; tout ce qui n’est pas évalué est visible.

## Page statique et SEO
H1 : Checklist des pièces comptables à demander.
Description : Préparez une checklist personnalisable, suivez les pièces reçues et générez la demande des seuls documents manquants, sans inscription.
Plan : réponse et résultat attendu ; exemple fictif jouable ; entrées et conventions ; résultat et exceptions ; exporter/reprendre ; limites du contrôle ; FAQ réelle (données, fichier refusé, interprétation, reprise).
Titre, canonical et schema selon CONTRAT-COMMUN.md. Sources de concurrence servent au besoin seulement ; formules et conventions sont méthodes explicites, pas obligations réglementaires empruntées à un blog. Pas de chiffres de gains.

## Tests d’acceptation spécifiques
1. Quatre pièces fictives reçu/manquant/non applicable/inconnu → message ne contient que le manquant, inconnu séparé.
2. Toutes reçues → état terminé et aucun mail de relance inutile.
3. Pièce libre ajoutée puis supprimée → exports et mail reflètent la modification.
4. JSON exporté puis réimporté → statuts et période identiques ; version inconnue refusée sans effacer la saisie.
5. Libellé contenant HTML ou formule → affichage échappé et CSV neutralisé.
6. 101 éléments → limite expliquée ; aucune suggestion de document fiscal obligatoire.

7. Réseau observé après chargement : aucun transfert lors import/saisie/calcul/copie/export ; stockage navigateur inchangé, CSP et beacon vérifiés sur le déploiement.
8. Clavier et mobile : erreurs reliées, saisie conservée, résultat lisible, export complet sans couleur seule ni interface coupée.

## Design et preuve
Réutiliser gabarit, typographies, tokens et sections historiques, avec interaction utile complète. Scène HTML figée propre : Checklist fictive avec quatre états ; mail montrant uniquement le relevé bancaire manquant. Contrôler la scène à partir du moteur réellement testé ; captures et poids selon contrat commun.

## Maillage et fini public
Trois entrants décidés : /outils-comptables-gratuits, /blog/automatiser-la-relance-des-pieces-clients, /blog/prompt-chatgpt-expert-comptable. Ancre contextuelle : « préparer la checklist des pièces manquantes ». Vérifier leur disponibilité avant modification. Sortants et CTA selon contrat commun, service futur remplacé par pilier/méthode existant.
Fini public : CI et revue QA PASS, déploiement et surface réelle vérifiés, copie/export/refus rejoués, trois entrants et hub/sitemap/footer, suivis J+7/J+28 datés. Le présent document livre uniquement le cadrage : aucun outil ou test de ce futur moteur n’est prétendu exécuté.
