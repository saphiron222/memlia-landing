# 05 — Comparateur de balances comptables N et N−1

## Décision produit et intention
Persona : Collaborateur de révision qui reçoit deux exports de balances.
Besoin : Aligner les comptes et isoler les variations à expliquer sans reconstituer à la main des formules.
Route : `/outils-comptables-gratuits/comparateur-balances-comptables` ; catégorie : `verifier` ; primaire : `comparateur balance comptable`.
Signal du 06/10/2026 : Primaire et comparaison balance n n-1 : 0 suggestion. Balance comparative : 10 suggestions dont seulement deux françaises pertinentes, les huit autres sont anglophones et hors audience ; ne pas les compter comme demande cabinet France. Documentation Memsoft et Sage confirme le geste, pas un volume d’outil autonome.
Concurrence ouverte le 06/10 : https://www.memsoft.fr/aide/compta/Les_editions/Balances/Balance_comparee.htm
Extrait exact de terrain : « La balance comparée N / N-1 permet de visualiser les éléments suivants » (pas source de droit).
Différence utile : Memsoft et Sage proposent déjà la balance comparative dans leur environnement. Memlia répond aux exports hétérogènes sans installation, avec mapping, comptes absents et règles de variation visibles. Ne pas viser balance comptable générique ou bilan automatique.

## Contrat exécutable
Entrées : Deux CSV, total 10 Mo/20 000 lignes ; numéro de compte texte, libellé, débit/crédit ou solde signé selon convention confirmée ; dates début/fin des deux périodes, même devise confirmée.
Résultat complet : Tableau comptes N−1/N, delta montant, variation relative quand calculable, nouveaux/disparus, totaux et liste à examiner selon seuil choisi ; CSV complet avec conventions et provenance.
Règle et arrêts : Solde = débit − crédit ou solde signé après confirmation. Delta = N − N−1. Pourcentage = delta / valeur absolue N−1 ; zéro de référence = non calculable, jamais infini. Agrégation de lignes du même compte seulement sur confirmation, avec traçabilité et alerte libellés divergents. Différence de périodes visible et comparabilité à confirmer ; aucune conclusion de signification ni de risque. Seuil absolu/relatif saisi par utilisateur, pas seuil professionnel prédéfini. Pas traitement FEC, pas jugement fiscal.
La proposition reste à valider ; l’outil n’écrit pas dans un dossier métier. Le contrat commun fixe les états, exports, parser, confidentialité et limites ; tout ce qui n’est pas évalué est visible.

## Page statique et SEO
H1 : Comparateur de balances comptables N et N−1.
Description : Comparez deux balances CSV, retrouvez les comptes nouveaux et les variations avec conventions visibles et rapport exportable. Calcul local.
Plan : réponse et résultat attendu ; exemple fictif jouable ; entrées et conventions ; résultat et exceptions ; exporter/reprendre ; limites du contrôle ; FAQ réelle (données, fichier refusé, interprétation, reprise).
Titre, canonical et schema selon CONTRAT-COMMUN.md. Sources de concurrence servent au besoin seulement ; formules et conventions sont méthodes explicites, pas obligations réglementaires empruntées à un blog. Pas de chiffres de gains.

## Tests d’acceptation spécifiques
1. Compte fictif 100,00 en N−1 et 130,00 en N → delta 30,00 et 30 %.
2. Compte absent en N−1 → nouveau, référence zéro et pourcentage non calculable.
3. Solde −100,00 puis −80,00 → delta 20,00 et 20 % avec convention lisible.
4. Numéro 00123 → conservé ; compte dupliqué → confirmation d’agrégation et provenance des deux lignes.
5. Périodes inégales → alerte persistante, export ne dit jamais comparable sans confirmation.
6. Montant 1,234 ambigu ou fichier dépassant limite → refus expliqué ; 300 écarts → total et export complets.

7. Réseau observé après chargement : aucun transfert lors import/saisie/calcul/copie/export ; stockage navigateur inchangé, CSP et beacon vérifiés sur le déploiement.
8. Clavier et mobile : erreurs reliées, saisie conservée, résultat lisible, export complet sans couleur seule ni interface coupée.

## Design et preuve
Réutiliser gabarit, typographies, tokens et sections historiques, avec interaction utile complète. Scène HTML figée propre : Trois comptes fictifs : variation 30 %, compte nouveau, baisse de solde négatif expliquée. Contrôler la scène à partir du moteur réellement testé ; captures et poids selon contrat commun.

## Maillage et fini public
Trois entrants décidés : /outils-comptables-gratuits, /automatisation-cabinet-comptable, /methode. Ancre contextuelle : « comparer deux balances comptables ». Vérifier leur disponibilité avant modification. Sortants et CTA selon contrat commun, service futur remplacé par pilier/méthode existant.
Fini public : CI et revue QA PASS, déploiement et surface réelle vérifiés, copie/export/refus rejoués, trois entrants et hub/sitemap/footer, suivis J+7/J+28 datés. Le présent document livre uniquement le cadrage : aucun outil ou test de ce futur moteur n’est prétendu exécuté.
