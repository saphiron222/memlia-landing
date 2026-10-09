# 02 — Fusionner des fichiers CSV gratuitement

## Décision produit et intention
Persona : Collaborateur qui consolide plusieurs exports de même nature avant un contrôle.
Besoin : Assembler proprement des exports de plusieurs périodes ou dossiers sans perdre les en-têtes, les identifiants ou l’origine des lignes.
Route : `/outils-comptables-gratuits/fusionner-fichiers-csv` ; catégorie : `preparer` ; primaire : `fusionner fichiers csv`.
Signal du 06/10/2026 : Primaire : 8 suggestions. Variante fusionner fichiers csv gratuit : 0. Demande observable mais générique ; trafic qualifié cabinet à vérifier, pas acquis.
Concurrence ouverte le 06/10 : https://products.groupdocs.app/fr/merger/csv
Extrait exact de terrain : « Les fichiers téléchargés seront relâchés après 24 heures et le lien de téléchargement cessera de fonctionner après cette période. » (pas source de droit).
Différence utile : GroupDocs annonce dépôt puis lien conservé 24 h. Memlia livre une consolidation locale avec traçabilité de chaque ligne et mapping explicite, pour exports cabinet ; pas simplement un bouton concaténer.

## Contrat exécutable
Entrées : 2 à 20 CSV texte, total 20 Mo ; encodage UTF-8/BOM ou Windows-1252 choisi par fichier, séparateur choisi parmi virgule/point-virgule/tabulation/pipe ; écran de correspondance des colonnes.
Résultat complet : CSV consolidé, aperçu paginé, compte des lignes par fichier, rapport JSON des décisions ; colonnes provenance fichier/ligne facultatives et explicites.
Règle et arrêts : Concaténation verticale seulement, pas jointure de clients. Union de colonnes confirmée par utilisateur, cellules absentes vides signalées. En-têtes homonymes/ambigus bloquent jusqu’au mapping. Préserver chaînes et zéros initiaux, retours à la ligne entre guillemets, ordre des fichiers choisi. Doublons conservés par défaut ; retrait exact optionnel annoncé et compté. Export protège les formules tableur et documente les cellules neutralisées ; original intact.
La proposition reste à valider ; l’outil n’écrit pas dans un dossier métier. Le contrat commun fixe les états, exports, parser, confidentialité et limites ; tout ce qui n’est pas évalué est visible.

## Page statique et SEO
H1 : Fusionner des fichiers CSV gratuitement.
Description : Fusionnez vos exports CSV localement avec correspondance des colonnes, origine des lignes et fichier consolidé téléchargeable, sans inscription.
Plan : réponse et résultat attendu ; exemple fictif jouable ; entrées et conventions ; résultat et exceptions ; exporter/reprendre ; limites du contrôle ; FAQ réelle (données, fichier refusé, interprétation, reprise).
Titre, canonical et schema selon CONTRAT-COMMUN.md. Sources de concurrence servent au besoin seulement ; formules et conventions sont méthodes explicites, pas obligations réglementaires empruntées à un blog. Pas de chiffres de gains.

## Tests d’acceptation spécifiques
1. Deux fichiers fictifs de 2 et 3 lignes → 5 lignes, un seul en-tête et provenance exacte.
2. Colonnes dans un ordre différent → mapping confirmé et aucune valeur décalée.
3. Identifiant 00123, accent Windows-1252 et cellule multi-ligne → contenus conservés.
4. Deux en-têtes identiques → refus avant export ; colonnes absentes → choix union explicitement demandé.
5. Doublon exact → conservé par défaut ; retrait choisi → total/rejet/rapport concordants.
6. Formule =HYPERLINK(...) → export tableur neutralisé ; annulation ou 20 Mo dépassés → aucun succès déclaré.

7. Réseau observé après chargement : aucun transfert lors import/saisie/calcul/copie/export ; stockage navigateur inchangé, CSP et beacon vérifiés sur le déploiement.
8. Clavier et mobile : erreurs reliées, saisie conservée, résultat lisible, export complet sans couleur seule ni interface coupée.

## Design et preuve
Réutiliser gabarit, typographies, tokens et sections historiques, avec interaction utile complète. Scène HTML figée propre : Deux exports fictifs avec colonnes inversées, mapping puis cinq lignes et provenance. Contrôler la scène à partir du moteur réellement testé ; captures et poids selon contrat commun.

## Maillage et fini public
Trois entrants décidés : /outils-comptables-gratuits, /automatisation-cabinet-comptable, /methode. Ancre contextuelle : « fusionner des exports CSV ». Vérifier leur disponibilité avant modification. Sortants et CTA selon contrat commun, service futur remplacé par pilier/méthode existant.
Fini public : CI et revue QA PASS, déploiement et surface réelle vérifiés, copie/export/refus rejoués, trois entrants et hub/sitemap/footer, suivis J+7/J+28 datés. Le présent document livre uniquement le cadrage : aucun outil ou test de ce futur moteur n’est prétendu exécuté.
