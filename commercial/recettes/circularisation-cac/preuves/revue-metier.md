PASS — revue métier indépendante du candidat commercial « circularisation-cac », dans la portée définie ci-dessous. Aucun défaut matériel bloquant relevé ; aucune correction du candidat requise.

# Revue indépendante — 6 octobre 2026

Auteur du candidat : marketing. Relecteur : metier, profil IA indépendant de l'auteur, ni avocat, ni expert-comptable humain, ni autorité administrative.

## Portée et pièces examinées

Revue ponctuelle de `recette.json`, `corps.md`, `preuves/rejeu.json` et `preuves/rejouer.mjs` dans `commercial/recettes/circularisation-cac/`. Confrontation à `preuves/sources.json`, aux deux copies HTML H2A et aux pages officielles rouvertes le 06/10/2026. `preparer-preuves.mjs` a été lu, mais non exécuté pour ne pas régénérer les pièces de l'auteur.

Référentiels appliqués : `~/hermes/recherche/audit-legal-revue.md`, grille § 5 ; charte v5 du 06/10/2026 fournie dans `/Users/kevinkitanga/.hermes/kanban/workspaces/t_c5695136/site/.agents/product-marketing.md` (charte approuvée en PR107 selon le mandat, non modifiée). La v3 du dépôt n'a pas été substituée à cette v5.

Le verdict porte sur la justesse métier du discours commercial et la fidélité des huit résultats à une **simulation de suivi**. Il ne valide ni lettres, ni transmission/réception réelles, ni intégration à un outil du cabinet, ni diligences d'audit. Aucune fiche outil opérationnelle, architecture de traitement, sécurité en production, mise en page publique ou mission client n'a été éprouvée. Le corps expose ces limites aux lignes 27, 40 et 66 ; elles bornent la preuve plutôt qu'elles ne contredisent une promesse d'intégration déjà livrée.

## Vérifications réellement exécutées

Commande, depuis le dépôt demandé :

`node commercial/recettes/circularisation-cac/preuves/rejouer.mjs --check`

Résultat : code de sortie 0 ; `PASS : 8 cas fictifs de suivi ; aucun envoi ni conclusion d’audit.`

Le script compare les sorties obtenues aux sorties attendues, puis aux cas sauvegardés dans `rejeu.json`. Pour chacun, il vérifie `envoi: false`, `procedureAlternative: null`, `conclusion: null`. Le cas fermé produit bien −300 ; le cas ouvert ne calcule pas d'accord sur un solde. Le commentaire humain est recopié à l'identique. Les noms de pièces sont des références fictives : aucun PDF n'est généré, lu ni conservé comme contenu par ce script. Les booléens de validation, réponse, rattachement et périmètre sont des entrées inventées, non des contrôles autonomes.

Contrôle indépendant en lecture seule des deux HTML avec `parse5` : les sept extraits de `sources.json` sont présents après normalisation des espaces ; les mentions d'homologation, les §§ 03–15 de la NEP 505 et les §§ 14, 46 et 48 de la NEP 315 ont été examinés. Les pages H2A rouvertes corroborent les passages et versions ci-dessous. Le statut PASS inscrit par l'auteur dans ses preuves n'a pas été utilisé comme verdict métier.

## Grille en dix points

| Point | Résultat | Constat matériel et preuve |
|---|---|---|
| 1. Population et mission | Satisfait | Service destiné aux cabinets CAC français, contextualisé dès le héros (`recette.json:10`) et par la définition de la circularisation (`corps.md:5`). Il s'agit d'assistance matérielle au suivi, non d'une obligation universelle de circulariser. Aucune confusion EC/CAC, ALPE/certification, aucun seuil, mandat, régime EIP ou obligation de durabilité annoncé. Clients, fournisseurs, banques et autres tiers sont des sections/variantes d'une même campagne (`corps.md:7`), pas des campagnes indépendantes imposées. |
| 2. Sources, version et calendrier | Satisfait dans cette portée | NEP 505 : arrêté du 28/12/2023, JO du 31/12/2023, A. 821-76 ; NEP 315 : arrêté du 13/11/2024, JO du 19/11/2024, A. 821-72. Métadonnées et citations contrôlées dans les HTML et les pages actuelles H2A. La NEP 315 vise les exercices ouverts à compter de sa publication ; le candidat ne fixe pas un calendrier contraire et situe correctement son § 46 dans l'identification/évaluation des risques (`corps.md:48`). Le jalon de suivi est explicitement une convention du cabinet, pas un délai légal (`corps.md:40`). |
| 3. Titre, opinion et responsabilité | Satisfait | Memlia prépare des brouillons, tableaux et exceptions ; le CAC reste maître des décisions, conclusions et opinion (`corps.md:17–19,52–56`). Ni titre protégé attribué à Memlia, ni préparation de l'opinion, ni certification promise. La simulation laisse les conclusions à null. |
| 4. Indépendance et autorévision | Satisfait au niveau éditorial | Le cabinet mixte doit séparer missions, accès et responsabilités et faire apprécier l'indépendance par le CAC (`corps.md:62`). Aucun cumul préparation comptable/audit des mêmes comptes vendu comme une synergie. Les liens et prestations d'un futur mandat ne sont pas examinés ici : aucun usage réel n'est réputé autorisé par ce verdict. |
| 5. Secret et données | Satisfait dans l'essai et le discours | Données signalées fictives ; le script ne lit que la preuve JSON en mode check. Le candidat prévoit de définir entrées, sorties, destinataires, accès du support, conservation et traitements tiers avant un mandat ; il ne présume ni localité exclusive ni absence de transfert (`corps.md:62`). Pas de garantie RGPD, d'anonymisation ou de confidentialité technique inventée. La sécurité d'une future réalisation reste à établir, non à déduire de cet essai. |
| 6. Méthode, données et reproductibilité | Satisfait pour la simulation | Huit cas rejoués avec égalité entrée/attendu/obtenu. Périmètre, arrêt, proposition et validation sont visibles (`corps.md:9–40`). La fiche outil est un support Memlia, non un modèle prescrit/homologué par la NEP 315 (`corps.md:46–48,92–94`). Le § 14 distingue les outils de diligence des outils de documentation ; les §§ 46 et 48 d) ne sont pas présentés comme un agrément universel du suivi ni comme un substitut à l'appréciation du CAC. |
| 7. Diligences et exceptions | Satisfait | Maîtrise NEP 505 § 09 explicitement conservée sur sélection, rédaction, envoi et réception (`corps.md:5,17,52`), avec réponse directe au CAC comme critère d'acceptation. Types ouvert/fermé et informations restent choisis par le CAC. La non-réponse n'est ni accord ni clôture : obligation de procédures alternatives citée au § 13, procédures supplémentaires et appréciation finale renvoyées aux §§ 14–15 (`corps.md:54`). Le refus de la direction suspend le geste et renvoie aux §§ 10–12, sans contournement automatique. Ces paragraphes exigent examen documenté des motifs, alternatives si refus fondé, conséquences éventuelles dans le rapport sinon ; le candidat les laisse au CAC sans transformer le seul arrêt du suivi en traitement du refus. Aucune procédure n'est choisie par le script. |
| 8. Documentation et réversibilité | Satisfait à l'échelle annoncée | Entrées, attendus et obtenus sont conservés dans le JSON ; le check ne les régénère pas. Les références de pièces et le commentaire humain figurent dans les sorties ; la simulation n'efface pas le montant attendu (`rejouer.mjs:8–16,30–45`, `rejeu.json`). Cela prouve le comportement de cette fonction sur ces cas, pas une persistance, un archivage ou une restauration réels. Le candidat réserve à la recette de la tâche la préservation des saisies et les circuits opérationnels (`corps.md:66`) ; aucune conformité documentaire/NEP 230 n'est déduite du seul export. |
| 9. LCB-FT et durabilité | Hors champ motivé | Le candidat ne traite ni vigilance, bénéficiaire effectif, déclaration TRACFIN, ni certification de durabilité/CSRD. Aucune règle de ces domaines n'est généralisée à partir des confirmations des tiers. |
| 10. Preuves commerciales et compréhension | Satisfait | Le service est vendu comme une tâche prise en charge, pas comme un logiciel ou des sièges ; formats et accès sont à vérifier avant engagement (`corps.md:44,60,72`). Pas de gain chiffré, compatibilité éditeur, caution H2A/CNCC ou conformité du dossier inventés. Le héros promet une préparation sous maîtrise du CAC, pas une diligence autonome. La preuve distingue explicitement simulation et livraison à un cabinet (`corps.md:27,40,66`). Charte v5 : nous/vous, vocabulaire CAC, frontière en trois colonnes, quatre parties de la règle écrite, tableau fictif, prix à la complexité et CTA `/contact` cohérents. C'est une page de service, non un article : les règles de structure/maillage propres aux articles ne lui sont pas imposées. |

## Sources de droit contrôlées

- [H2A, NEP 505 — Demandes de confirmation des tiers](https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/) : arrêté du 28/12/2023, JO du 31/12/2023, A. 821-76 ; §§ 03–04, 06–09, 10–15. Copie : `nep505-source.html` ; trois extraits dans `sources.json`. Consultation indépendante le 06/10/2026.
- [H2A, NEP 315 — Prise de connaissance de l'entité et de son environnement, identification et évaluation du risque d'anomalies significatives dans les comptes](https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/) : arrêté du 13/11/2024, JO du 19/11/2024, A. 821-72 ; clause d'application, §§ 14, 46 et 48 d). Copie : `nep315-source.html` ; quatre extraits dans `sources.json`. Consultation indépendante le 06/10/2026.

H2A est ici le diffuseur institutionnel des NEP homologuées, pas l'organisme ayant agréé Memlia. Aucun téléchargement direct du JO ou contrôle d'authenticité réglementaire des copies n'est revendiqué ; aucune consolidation générale du Code de commerce n'est nécessaire aux affirmations limitées de ce candidat.

## Inconnues restantes et conclusion

Restent non démontrés : construction de lettres, connecteurs, validation opérationnelle des destinataires et des canaux, authenticité/fiabilité des retours, réception directe réelle, parsing de pièces, fonctionnement sur données défectueuses hors des huit scénarios, persistance/régénération dans un outil du cabinet, contrôles d'accès, flux et conservation. Le candidat ne les présente pas comme acquis par le rejeu. Les chiffres du cas fermé sont fictifs et ne mesurent ni un gain ni une anomalie d'audit établie.

Interprétation métier : les frontières éditoriales et les états simulés préservent les décisions du CAC et ne font pas passer le suivi pour une diligence. Le PASS est donc celui de ce candidat et de cette preuve bornée, pas celui d'une automatisation opérationnelle ou d'un dossier conforme aux NEP. Pas de réserve bloquante à lever sur le candidat examiné.

Aucune modification du candidat ou de la charte ; aucun scellement, publication, commit ni action kanban.
