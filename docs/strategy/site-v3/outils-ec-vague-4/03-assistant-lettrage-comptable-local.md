# 03 — Assistant de lettrage comptable local

## Décision produit et intention
Persona : Collaborateur qui prépare un lettrage de comptes de tiers à partir d’un export.
Besoin : Isoler les paires candidates puis les cas ambigus, avant décision dans le logiciel du cabinet.
Route : `/outils-comptables-gratuits/assistant-lettrage-comptable-local` ; catégorie : `verifier` ; primaire : `lettrage comptable excel`.
Signal du 06/10/2026 : Primaire : 1 suggestion identique. Lettrage comptable automatique : 0. Signal étroit, usage métier attesté par documentation et guides existants ; pas promesse de recherche abondante.
Concurrence ouverte le 06/10 : https://www.facture.net/blog/lettrage-comptable/
Extrait exact de terrain : « Identifier les opérations à lettrer » (pas source de droit).
Différence utile : Le lettrage existe dans les logiciels comptables, y compris gratuits. L’angle n’est pas les remplacer : préparer et expliquer les ambiguïtés d’un export, localement, sans accès au logiciel. Ne promettre ni automatique complet ni certification.

## Contrat exécutable
Entrées : CSV de mouvements, 10 Mo/20 000 lignes maximum : identifiant ligne unique, compte, clé tiers, référence, date, débit et crédit, devise explicitement unique.
Résultat complet : Paires proposées avec règle appliquée, groupes ambigus, lignes restantes, contrôle des sommes et export CSV de propositions. Validation individuelle, rapport séparant proposé/accepté/refusé.
Règle et arrêts : Même compte ET même tiers ET même devise, deux lignes opposées de montant exact ; référence identique non vide prioritaire. En absence de référence, proposition seulement si paire unique dans le groupe. Pas de tolérance cachée, aucun choix arbitraire entre candidats. Un identifiant ne peut participer à deux paires. Pas sous-ensembles combinatoires ni rapprochement banque. Déjà lettré → exclu si colonne disponible. Jamais export importable comme écriture ou lettrage définitif ; pas renumérotation.
La proposition reste à valider ; l’outil n’écrit pas dans un dossier métier. Le contrat commun fixe les états, exports, parser, confidentialité et limites ; tout ce qui n’est pas évalué est visible.

## Page statique et SEO
H1 : Assistant de lettrage comptable local.
Description : Préparez le lettrage d’un export CSV : paires expliquées, ambiguïtés et lignes restantes. Vous validez ; le fichier original reste inchangé.
Plan : réponse et résultat attendu ; exemple fictif jouable ; entrées et conventions ; résultat et exceptions ; exporter/reprendre ; limites du contrôle ; FAQ réelle (données, fichier refusé, interprétation, reprise).
Titre, canonical et schema selon CONTRAT-COMMUN.md. Sources de concurrence servent au besoin seulement ; formules et conventions sont méthodes explicites, pas obligations réglementaires empruntées à un blog. Pas de chiffres de gains.

## Tests d’acceptation spécifiques
1. Deux lignes même tiers et référence, débit/crédit 100,00 → une proposition unique ; reste nul.
2. Deux paiements égaux possibles → groupe ambigu, aucun choix automatique.
3. Deux tiers ou devises différents → aucune paire malgré montant identique.
4. Identifiant ligne dupliqué, débit et crédit simultanés → refus de la ligne et motif exporté.
5. Trois lignes 100/60/40 → reste à examiner ; pas combinaison inventée.
6. Accepter puis refuser une paire → rapport et export reflètent la décision actuelle, original inchangé.

7. Réseau observé après chargement : aucun transfert lors import/saisie/calcul/copie/export ; stockage navigateur inchangé, CSP et beacon vérifiés sur le déploiement.
8. Clavier et mobile : erreurs reliées, saisie conservée, résultat lisible, export complet sans couleur seule ni interface coupée.

## Design et preuve
Réutiliser gabarit, typographies, tokens et sections historiques, avec interaction utile complète. Scène HTML figée propre : Une paire fictive certaine, deux règlements concurrents classés ambigus, reste non apparié. Contrôler la scène à partir du moteur réellement testé ; captures et poids selon contrat commun.

## Maillage et fini public
Trois entrants décidés : /outils-comptables-gratuits, /integrations/lettrage-sage, /integrations/lettrage-cegid. Ancre contextuelle : « préparer un lettrage depuis un export ». Vérifier leur disponibilité avant modification. Sortants et CTA selon contrat commun, service futur remplacé par pilier/méthode existant.
Fini public : CI et revue QA PASS, déploiement et surface réelle vérifiés, copie/export/refus rejoués, trois entrants et hub/sitemap/footer, suivis J+7/J+28 datés. Le présent document livre uniquement le cadrage : aucun outil ou test de ce futur moteur n’est prétendu exécuté.
