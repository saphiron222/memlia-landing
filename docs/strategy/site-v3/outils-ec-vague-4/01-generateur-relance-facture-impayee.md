# 01 — Générateur de relance de facture impayée

## Décision produit et intention
Persona : Collaborateur chargé des relances clients ou des honoraires du cabinet.
Besoin : Préparer un message amiable cohérent à partir du solde réel, sans relancer une facture réglée ou contestée.
Route : `/outils-comptables-gratuits/generateur-relance-facture-impayee` ; catégorie : `ecrire` ; primaire : `générateur relance facture impayée`.
Signal du 06/10/2026 : Primaire : 0 suggestion. Amorce mail relance facture impayée : 10 suggestions, dont client, modèle et gratuit. Intention de production de courrier observable ; aucun volume mensuel.
Concurrence ouverte le 06/10 : https://jemefaispayer.fr/logiciel-de-recouvrement/
Extrait exact de terrain : « Les documents sont générés dans votre navigateur. Rien n'est envoyé à un serveur tant que vous ne choisissez pas un envoi. » (pas source de droit).
Différence utile : Je me fais payer génère déjà gratuitement et localement : le local n’est pas nouveau. Notre angle cabinet est le lot de factures, les avoirs/paiements et les exclusions lisibles avant copie, pas une version appauvrie de son parcours contentieux.

## Contrat exécutable
Entrées : Une facture ou un lot CSV : client, référence, montant initial, paiements reçus, avoirs, date d’échéance saisie, date de préparation ; niveau choisi première relance/rappel, signature facultative. CSV 5 Mo et 500 factures maximum.
Résultat complet : Objet et corps éditables par client, détail des références et solde restant, liste des cas à examiner, copie et export texte/CSV complet. Aucun envoi.
Règle et arrêts : Solde = montant initial − paiements − avoirs, décimales exactes. Regrouper uniquement après confirmation de la clé client ; litige, solde négatif, échéance absente ou montant ambigu sortent de la file de relance. Facture soldée ou non échue est exclue avec motif. Pas de pénalité, menace, mise en demeure, calcul de taux ni délai légal ajouté.
La proposition reste à valider ; l’outil n’écrit pas dans un dossier métier. Le contrat commun fixe les états, exports, parser, confidentialité et limites ; tout ce qui n’est pas évalué est visible.

## Page statique et SEO
H1 : Générateur de relance de facture impayée.
Description : Préparez une relance amiable depuis vos factures, paiements et avoirs, avec messages éditables et cas à examiner. Tout reste dans votre navigateur.
Plan : réponse et résultat attendu ; exemple fictif jouable ; entrées et conventions ; résultat et exceptions ; exporter/reprendre ; limites du contrôle ; FAQ réelle (données, fichier refusé, interprétation, reprise).
Titre, canonical et schema selon CONTRAT-COMMUN.md. Sources de concurrence servent au besoin seulement ; formules et conventions sont méthodes explicites, pas obligations réglementaires empruntées à un blog. Pas de chiffres de gains.

## Tests d’acceptation spécifiques
1. Facture fictive 120,00, paiement 20,00, avoir 10,00 → reste 90,00 présent dans le message.
2. Facture payée, non échue et contestée → trois motifs distincts ; aucune relance générée pour ces lignes.
3. Deux clients homonymes avec clés différentes → jamais regroupés ; référence manquante bloque la ligne.
4. Date 20260230 ou avoir supérieur au montant → cas à examiner, pas courrier supposé valable.
5. 501 lignes → refus avant préparation ; modifier un message puis copier/exporter restitue la version éditée.

7. Réseau observé après chargement : aucun transfert lors import/saisie/calcul/copie/export ; stockage navigateur inchangé, CSP et beacon vérifiés sur le déploiement.
8. Clavier et mobile : erreurs reliées, saisie conservée, résultat lisible, export complet sans couleur seule ni interface coupée.

## Design et preuve
Réutiliser gabarit, typographies, tokens et sections historiques, avec interaction utile complète. Scène HTML figée propre : Trois factures fictives : une relance à 90 €, une facture soldée exclue, un litige à examiner. Contrôler la scène à partir du moteur réellement testé ; captures et poids selon contrat commun.

## Maillage et fini public
Trois entrants décidés : /outils-comptables-gratuits, /automatisation-cabinet-comptable, /methode. Ancre contextuelle : « préparer une relance de facture impayée ». Vérifier leur disponibilité avant modification. Sortants et CTA selon contrat commun, service futur remplacé par pilier/méthode existant.
Fini public : CI et revue QA PASS, déploiement et surface réelle vérifiés, copie/export/refus rejoués, trois entrants et hub/sitemap/footer, suivis J+7/J+28 datés. Le présent document livre uniquement le cadrage : aucun outil ou test de ce futur moteur n’est prétendu exécuté.
