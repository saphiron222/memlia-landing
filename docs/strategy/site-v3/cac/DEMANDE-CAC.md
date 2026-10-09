# Demande CAC et concurrence — relevé du 6 octobre 2026

## Décision

Commencer par des supports de travail complets : circularisation et suivi des retours, seuils documentés, barème d'heures, revue analytique et feuilles maîtresses. Réutiliser le vérificateur FEC et le préparateur de pseudonymisation déjà présents sur le site. Le guide FEC orienté audit peut être distinct, pas un deuxième outil de contrôle de structure.

La recherche précédente identifiait de bons besoins, mais elle surestimait certains « vides ». Gest On Line propose un article gratuit sur les NEP315/330 et la collecte ; Paris Ouest Audit couvre circularisation, alternatives et inventaire ; ciferi expose déjà un outil de revue analytique. Il faut battre le résultat utile, pas seulement publier une définition mieux optimisée.

**Mesure réelle : 193 requêtes, 193 réponses valides, 114 avec suggestions, 79 sans suggestion.** Lecture de 30 intentions représentatives, avec deux reprises de recherche pour ambiguïté. Aucun volume mensuel, rang Google France, trafic, autorité de domaine ou part de marché n'a été mesuré. Les suggestions ne sont pas des volumes et leur absence ne prouve ni absence de besoin ni faible concurrence.

## 1. Méthode, périmètre et sources

- Départ : note `~/memlia-vault/10-memlia/chantiers/cac-site-niveau-superieur/sorties/recherche-cac-2026-10-05.md`, exemples §3.1, 43 sujets §3.5 et 18 outils §3.6. Le §4 cité dans la carte est celui des pièges. Les 299 amorces brutes ne sont pas annexées à cette note : le présent lot est une sélection reconstruite, **pas le rejeu des 299**.
- Autocomplétion : appel effectif de `autocompleterGoogle` dans `scripts/lib/seo-instruments.mjs`, `client=firefox`, `hl=fr`, `gl=fr`. Date UTC par requête ; la collecte et la synthèse ont lieu le 6 octobre en France, encore le 5 octobre UTC. Une panne reste distincte d'une réponse vide. Aucun appel payant DataForSEO effectué.
- Données auditables : [JSON intégral des réponses et pages candidates](mesures/autocomplete-cac-2026-10-06.json), [table des 193 requêtes](REQUETES-CAC.md), [lecture des 30 intentions](SERP-CAC.md).
- Registre : ajout d'une section `rechercheCac` pointant vers les mesures par requête ; `articles` conserve ses pages existantes. Les candidats ne sont pas introduits comme pages publiées ni comme URL actives des crons.
- SERP : `web_search`, backend Keenable, 5 ou 10 résultats lus par requête. Il s'agit d'un proxy de recherche web, **pas d'une extraction du top10 Google localisé**. Les URL déterminantes sont conservées dans SERP-CAC.md ; les réponses complètes de ce moteur ne sont pas archivées dans le dépôt. Pas de comparaison quantitative de chevauchement top10, PAA, annonces ou AI Overview inventée.
- Ouvertures concurrentes : FAQ PackAUDIT, CNCC NEP320, Caseware France, Gest On Line (NEP315/330, e-Circu), CEECA et Paris Ouest Audit le 6 octobre. Le chemin CNCC `/outils-et-services` a échoué ; reprise par la FAQ officielle PackAUDIT réussie. Ouverture par web_extract, plutôt que par le wrapper de rendu des skills : le catalogue Hermes permet ce repli ; aucune analyse visuelle/schema de ces pages n'en est déduite.

Les métriques SEO payantes n'étaient pas nécessaires au contrat d'autocomplétion et n'ont pas été achetées. Le classement qui suit est une décision produit argumentée, pas un classement par volume.

## 2. Hiérarchie des opportunités

| Priorité | Besoin / preuve de recherche | Format retenu provisoirement | Ce qui fait la différence | Arbitrage |
|---|---|---|---|---|
| 1 | Circularisation : fournisseur, banque, lettres, relance, réponse ; plusieurs amorces observées | Guide praticien puis générateur/suivi si C3 le retient | Sélection laissée au CAC, préparation des demandes, statut par tiers, retour, écart, relance et export utilisable dans le dossier | Une page de référence, variantes par tiers en sections ; pas cinq pages clonées |
| 1 | Signification / planification : formules, bases, exemple, association, holding | Un outil documenté et sa méthode | Base et paramètres choisis par l'utilisateur, justification, versions, export ; pas de taux imposé ni choix de seuil à la place du signataire | Regrouper les deux notions ; sources normatives à actualiser à la fabrication |
| 1 | Barème d'heures : calcul, dérogation, anciennes références encore visibles | Calculateur et explications intégrées | Cas d'exclusion, base de calcul explicite et trace des hypothèses | Ne pas promettre des honoraires universels ni une conformité au contrôle |
| 1 | Revue analytique Excel, feuilles maîtresses Excel | Outils distincts mais liés | Deux balances, nouveaux comptes / zéro, variations, commentaires, références et export ; feuilles par cycle pour les maîtresses | ciferi et ExcelFSM constituent un niveau utile minimal à dépasser |
| 2 | Analyse FEC gratuite / contrôle FEC | Outil existant, puis guide côté CAC | Différencier format et contenu ; critères de sélection traçables | Réutiliser `/outils-comptables-gratuits/verificateur-fec-local` ; aucune seconde page visant « vérificateur FEC gratuit » |
| 2 | NEP315/330 révisées et IPE | Guide de mise en œuvre, matrice et fiche d'extraction | Petit mandat travaillé, risques/assertions/procédures reliés, extraction et limites documentées | Ni simple copie de norme ni article prétendant être le premier guide gratuit |
| 2 | Lettre de mission / affirmation | Checklist et trame originale contextualisée | Distinguer date, destinataire, contenu et traitement des exceptions | Ne pas republier les modèles protégés CNCC |
| 2 | NEP911/912, ALPE | Comparatif normatif pratique | Périmètre, durée, rapports et références à jour | La concurrence couvre déjà l'actualité ; revue métier à la rédaction, sans reprendre les dates/paragraphe de la note initiale non vérifiés |
| 3 | Archivage, qualité, IPE, outils automatisés, tests de journal | Guides/sections à tester | Documents réellement utilisables ; ne pas vendre une garantie d'opinion | Besoins métier plausibles mais volume inconnu ; C1 doit étayer la priorité |
| 3 | LCB-FT et parties liées | Guide précis, éventuel support de documentation | Adaptation CAC plutôt que table générique assurance ou EC | Risque réglementaire élevé, différenciation et revue métier futures nécessaires |
| À écarter | Marque éditeur seule, catalogue de formation | Pas de page d'acquisition Memlia | La personne cherche l'éditeur ou la formation, pas notre service | Un guide tâche-logiciel doit mesurer sa propre demande, sans utiliser la popularité de la marque seule |
| À différer | CSRD/Omnibus, opinion, alerte générale, mandat/seuils côté entreprises | Veille ou glossaire, outil ciblé seulement si besoin complet | Beaucoup de demande non praticien et de références établies | Ne pas remplir le blog de droit générique pour gonfler le nombre de pages |

Cette hiérarchie ne crée aucune carte de fabrication. C3 décide l'architecture après C1. Les URL du fichier de mesures sont des candidats de travail ; une famille candidate n'est pas une nouvelle famille active du site.

## 3. Concurrents : observations, inférences et implications

### CNCC / CRCC / H2A — la référence, pas une caution commerciale

Observé : les textes, archives et FAQ sont visibles dans les recherches. La [FAQ officielle PackAUDIT](https://packaudit.cncc.fr/faq.html) dit : « Puis-je réaliser une mission ALPE avec PackAUDIT ? Non, il convient de se référer au Pack ALPE disponible dans Sidoni. » Elle exclut aussi EIP et comptes consolidés de ce produit, et décrit une version associations. Extrait utile : « l'utilisation de PackAUDIT reste bien monoposte ». La [NEP320 ouverte](https://doc.cncc.fr/docs/nep-320) affiche « Archive » et un lien vers un document de remplacement.

Inférence (confiance forte pour le format, pas pour le trafic) : l'utilisateur a déjà accès à des références et à des outils métiers ; un lexique sans support utilisable ne suffit pas. Les versions anciennes restent une source de confusion visible, même sur une URL d'autorité.

Implication : lier le texte à jour et proposer un travail de préparation/export différent. Pas de logo institutionnel ni de « validé CNCC ». Gratuité actuelle, nombre d'utilisateurs et parts de marché : non mesurés dans ce lot.

### Gest On Line — contenu métier relié à son écosystème

Observé : [article NEP315/330](https://www.gestonline.com/blog/nep-315-330-revisees-collecte-elements-probants) ouvert. Extrait exact : « Chaque demande de pièce est enregistrée avec sa date d'émission, son destinataire, et son statut. » L'article décrit DreamAudit/RevisAudit et e-Recup, avec un CTA démonstration. La [page e-Circu](https://www.gestonline.com/blog/circularisation-audit) déroule sélection, préparation, validation, envoi, réception et alternatives ; extrait : « relancer automatiquement, centraliser les justificatifs et assurer le suivi des réponses. » Ce sont des descriptions de l'éditeur, pas des fonctions testées par nous.

Inférence (forte) : la concurrence couvre bien le processus et pas seulement les définitions. Le « vide circularisation de bout en bout » doit être reformulé en opportunité de support autonome et exportable.

Implication : apporter des cas complets dans l'environnement existant du cabinet ; ne pas prétendre que les concurrents sont absents, ne pas ouvrir « alternative DreamAudit » sans requête comparative vérifiée. Tarifs, gains de temps et adoption : non mesurés.

### Caseware — documentation de travail, variantes géographiques à distinguer

Observé : les recherches Caseware remontent surtout des pages produit et des docs anglophones. La [page France ouverte](https://www.caseware.fr/audit-france-cwf/) expose une gestion des risques et « une association des risques aux cycles, documents et programmes de travail ». L'extraction est courte : aucun catalogue complet ou tarif français n'en est déduit. La documentation US mentionne des calculs de materiality, overrides et flux de mission ; ce n'est pas une preuve de disponibilité identique en France.

Inférence (modérée) : une marque a une forte présence de documentation navigable, mais le compteur de suggestions sur sa requête n'est pas un signal pour une page Memlia générique.

Implication : éventuel guide tâche-logiciel uniquement après sonde contextualisée et vérification de la fonction française. Pas de comparatif de prix ou de matrice de fonctionnalités inventé.

### Formations — CEECA / CNCC, besoin de mise en pratique déjà reconnu

Observé : [formation CEECA NEP315/330](https://ceeca.org/formation/mise-en-oeuvre-pratique-des-nep-315-et-330-revisees/) ouverte, classe virtuelle, cas pratiques et objectifs. Extrait exact : « Existe-t-il des outils simples permettant de structurer la démarche et documenter le dossier ? » La formation demande aussi comment s'assurer que le recours aux outils automatisés est pertinent et efficace.

Inférence (forte sur l'intention) : besoin d'appliquer et de documenter, pas seulement d'expliquer le numéro d'une norme. Une formation est une réponse légitime ; Memlia n'est pas un organisme de formation à substituer dans cette SERP.

Implication : guide et support gratuit immédiatement utilisable ; laisser les requêtes d'inscription/certification aux catalogues.

### Blogs de cabinets — concurrence pratique réelle

Observé : [Paris Ouest Audit circularisation](https://www.parisouestaudit.com/circularisation-dematerialisee-audit/) ouvert. Extrait exact : « En cas de non-réponse, des procédures alternatives doivent être mises en œuvre. » Le guide comporte tiers, assertions, canaux et FAQ ; sa structure comprend une image et un tableau. L'inventaire des stocks est également détaillé dans les résultats. Houdart traite les déclarations de direction ; Quante traite parties liées et opinion ; Advyse apparaît sur alerte, associations et inventaire. Axens et Houdart exposent le barème avec références anciennes dans les extraits. Ces derniers constats viennent des extraits, pas d'un audit complet de leur site.

Inférence (forte) : les concurrents cabinet peuvent répondre à la fois au dirigeant et au collaborateur. Le positionnement praticien doit se voir dans le livrable, pas simplement dans le mot « CAC » du titre.

Implication : cas fictifs, exemple exportable, erreurs de traitement explicitées et limites. Une information récente doit être vérifiée officiellement avant usage public : ce relevé ne constitue pas une revue métier.

### Outils gratuits et concurrents adjacents

Observé dans les résultats : [ciferi revue analytique](https://ciferi.com/analytical-review-tool/france) permet de saisir des comptes et des soldes courants/comparatifs ; [ExcelFSM](http://www.excel-fsm.com/ExcelFSMproHTML-fr/leadsheets.htm) documente des feuilles maîtresses ; [Audit Sampling](https://audit-sampling.com/) propose extractions et documentation ; BeCLM et Kanta traitent LCB-FT pour des publics différents.

Implication : tester ces résultats utiles avant la fabrique. « Gratuit sans inscription » n'est pas une différenciation suffisante si notre fichier ou notre analyse est moins exploitable. Aucune faiblesse fonctionnelle de ces outils n'est affirmée sans essai.

## 4. Ce que cherchent les utilisateurs — histoires d'usage

1. Collaborateur en circularisation : obtenir une lettre et suivre les réponses, parce qu'un retour sans rapprochement laisse un point non résolu. Signaux : amorces lettres/mail/relance et articles Gest/Paris Ouest. Réponse attendue : travail de bout en bout, pas définition seule.
2. Chef de mission : justifier seuil et planification, parce que le calcul seul ne rend pas le dossier relisible. Signaux : formule, calcul, exemple et norme/document Excel en résultats. Réponse : paramètres choisis, justification et export.
3. Collaborateur sur balance : obtenir feuille par cycle et variations N/N-1, parce qu'il doit faire le travail maintenant. Signaux : « excel », ExcelFSM, ComptaShop, Scribd et ciferi. Réponse : outil/gabarit complet, pas CTA avant résultat.
4. Signataire sur petit mandat : comprendre quoi documenter pour les NEP315/330 et l'outil utilisé. Signaux : formation CEECA, article Gest et pages officielles. Réponse : exemple de dossier/matrice et fiche outil ; la décision reste humaine.
5. Associé : apprécier ce qu'on peut automatiser sans changer l'outil de dossier. Signal direct d'accueil faible (aucune suggestion sur l'amorce d'automatisation) ; besoin à confirmer par C1. Réponse : accueil métier concret avec limites, pas un « commissaire aux comptes IA » comme certains résultats proxy.

Pas de scores SXO/personas numériques : aucune page CAC publique cible n'est encore analysée. Un score de page absente serait fictif.

## 5. Règles d'architecture remises à C3 et E1

- Prioriser la tâche et son livrable. L'accueil `/commissaires-aux-comptes` est une entrée de service ; il ne vise pas à battre les catalogues CNCC ou les éditeurs sur leurs noms.
- Un seul propriétaire pour chaque intention. Signification/planification dans un outil ; circularisation/alternatives dans une page avec sections avant de justifier une scission.
- Ne pas créer d'outil CAC qui copie le vérificateur FEC ou l'anonymiseur déjà publiés. Les relier depuis les nouveaux guides ; distinguer réellement besoin de structure et travail d'audit.
- Ne pas traiter le proxy comme une SERP Google top10. Les regroupements sont provisoires et éditoriaux ; C3 peut faire une mesure de chevauchement localisée si une scission devient litigieuse.
- Requêtes marque/formation : conserver la mesure mais exclure du plan commercial. Le seuil de six suggestions d'un guide tâche-logiciel s'évalue sur sa requête propre, pas sur « Caseware ».
- La demande directe « automatisation commissaire aux comptes » est mesurée mais vide en autocomplétion. E1 peut la mentionner comme formulation de service, **pas comme requête à fort volume**. La force de sa copy vient des tâches mesurées et du terrain, pas d'une promesse de trafic.
- Les chiffres normatifs de la note initiale et les extraits concurrents ne passent pas directement dans une page publique. La vérification officielle et la revue métier appartiennent à la fabrication concernée.

## 6. Vérification et critères de fini

Le test `node --test tests/scripts/cac-demand.test.mjs` contrôle nombre minimal, unicité des requêtes, mesures horodatées, réponses de l'instrument, suggestion comptée, volume non inventé, disposition/page candidate par requête et raccordement au registre. Les tests des instruments et registres existants vérifient leur compatibilité ; aucune surface publique n'est modifiée.

Le relevé et les candidats sont livrés dans une PR. La carte ne devient terminée qu'après la revue indépendante, les contrôles CI et la fusion. Aucun suivi J+7/J+28 créé pour ces documents internes : il n'y a pas de nouvelle page à mesurer en production.
