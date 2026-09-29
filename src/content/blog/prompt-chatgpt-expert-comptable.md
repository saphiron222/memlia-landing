---
titre: "Prompt ChatGPT pour expert-comptable : partir d'une tâche, pas d'une formule magique"
titreOnglet: "Prompt ChatGPT expert comptable : demande de pièce | Memlia"
resume: "Un prompt pour préparer une demande de pièce fictive : contexte autorisé, brouillon, arrêt si la pièce manque, destinataire et envoi validés par une personne."
description: "Prompt ChatGPT expert comptable : préparer une demande de pièce sur cas fictif, savoir quand s'arrêter et garder la validation humaine."
datePublication: 2026-09-29
auteur: kevin
sujets: [ia, pieces, automatisation]
motsCles: ["prompt chatgpt expert comptable", "demande de pièce", "confidentialité des données"]
brouillon: false
image: img-art-prompt-chatgpt-expert-comptable
pipelineVersion: 1
primaryQuery: "prompt chatgpt expert comptable"
secondaryQueries: []
intent: executer
fanOut: ["demande de pièce fictive", "informations à confirmer", "arrêt et validation de l'envoi"]
cluster: numerique-it-data
famille: ia-generative-agents
rolePrincipal: direction-associes
rolesSecondaires: [collaborateurs-comptables]
tache: "Préparer une demande de pièce manquante sans envoyer avant contrôle de la pièce, du destinataire et de la période."
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-09-29
funnel: MOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Trois cas fictifs exécutés par rejouer-cas.mjs, entrées et sorties dans journal-rejeu.json ; le refus demande déjà partie est propre au script local alimenté par le suivi et absent du prompt copiable ; deux consignes par pôle illustratives non exécutées ; aucune réponse ChatGPT mesurée."
reviewRule: "Revoir les conditions d'utilisation de l'outil et les recommandations CNIL avant un usage réel ; réviser le contenu en cas d'évolution de la source."
reviewer: qa:t_f7a52dd8
sourcesVerifieesLe: 2026-09-29
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons votre règle de demande de pièces, l'automatisons dans vos outils et la recettons avec votre équipe. Vous gardez la décision d'envoyer. Rien à envoyer : décrivez simplement la tâche."
imageOg: "/images/img-art-prompt-chatgpt-expert-comptable-og.webp"
imageAlt: "Feuille vierge et enveloppe séparées par une grille fermée, pour figurer le contrôle humain avant une demande de pièce"
statutEditorial: publie
sources:
  - editeur: "CNIL"
    titre: "Les questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative"
    url: "https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative"
    consulte: 2026-09-29
  - editeur: "CNIL"
    titre: "Donnée personnelle"
    url: "https://cnil.fr/fr/definition/donnee-personnelle"
    consulte: 2026-09-29
  - editeur: "Conseil national de l’Ordre des experts-comptables"
    titre: "Travaux Data et IA"
    url: "https://www.experts-comptables.fr/travaux-data-et-ia"
    consulte: 2026-09-29
---

## Réponse directe

Un prompt ChatGPT pour expert-comptable utile part d'une tâche précise : préparer une demande de pièce, avec des données autorisées, une sortie définie et une décision qui reste au cabinet. Le modèle ne vérifie pas le dossier à votre place. Commencez avec un cas fictif, prévoyez les informations manquantes et relisez le brouillon avant tout envoi. Si ce geste revient souvent, écrivez aussi la règle de suivi et d'arrêt.

## Pourquoi un prompt isolé casse à la main

Une instruction copiée d'un collaborateur à l'autre ne dit pas où lire l'état de la pièce, si une demande est déjà partie ni quand cesser la relance. La règle de cabinet à écrire est celle du passage de « pièce absente » à « demande proposée », puis de « reçue » à « arrêt » ; le texte du prompt n'en est qu'une étape.

<figure data-blog-proof="w39-prompt-brouillon">
  <img src="/proofs/blog/w39-prompt-brouillon.webp" alt="Brouillon fictif de demande de facture non envoyé avec destinataire à confirmer." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## Exemple : préparer une demande de pièce manquante

Situation fictive : dans un dossier de démonstration, la pièce correspondant à une opération du mois manque. L'objectif est de rédiger un **brouillon** de demande claire, non de certifier une écriture ni de conclure qu'une dépense est déductible.

Voici un prompt de départ sur données fictives. Avant un usage réel, le cabinet vérifie les règles d'usage de l'outil choisi :

> Tu aides à préparer un courriel de demande de pièce. Utilise uniquement les informations fictives suivantes : société « Atelier Fictif », période « avril 2026 », pièce attendue « facture d'achat du matériel » ; la pièce n'est pas encore reçue. Si la pièce attendue ou la période n'est pas renseignée, réponds « arrêt : contexte incomplet » et ne rédige aucun message. Sinon, rédige en français un objet et un message de 80 mots maximum. Demande la facture et, si elle n'est pas disponible, une réponse expliquant pourquoi. N'invente ni montant, ni échéance, ni qualification fiscale. Pour le destinataire non confirmé, marque « à confirmer » sans inventer une adresse. Termine par une liste séparée des points à vérifier par le collaborateur avant envoi. Ne dis pas que le courriel est parti.

## Avant d'ouvrir l'outil : les entrées à réunir

Pour préparer ce seul message, relevez la période, la pièce attendue, son état dans le suivi et le destinataire pressenti. Vérifiez séparément ce que l'outil autorise à partager ; sinon, travaillez sur le cas fictif ci-dessous. N'envoyez pas un dossier entier pour obtenir une phrase. L'état « pièce manquante » vient du suivi du cabinet, pas du modèle.

## La règle écrite

**La frontière.** Le brouillon se prépare à partir de la pièce et de la période renseignées ; l'identité du destinataire, le contenu et l'envoi attendent un contrôle. Le choix du ton et le traitement d'un dossier sensible restent humains.

| Se prépare seul | Attend une validation | Reste humain |
| --- | --- | --- |
| Objet et brouillon de demande sur un contexte fictif connu | Pièce, période, destinataire et envoi | Échange avec un client en difficulté ou en litige |

**La proposition.** Nous produisons un brouillon et une liste de points à confirmer. Le collaborateur vérifie les données de son outil, corrige le message et décide de l'envoi ; la proposition n'écrit aucun état de dossier.

**L'arrêt.** Le prompt copiable demande de ne pas rédiger si la pièce attendue ou la période manque ; nous n'avons pas testé la réponse de ChatGPT à cette consigne. Le script local refuse ce contexte incomplet et, séparément, une « demande déjà partie » quand cet état lui est fourni par le suivi du cabinet. Le prompt copiable ne reçoit pas cet état et ne peut donc pas détecter une demande antérieure. Avant de le copier, le collaborateur vérifie le suivi et s'abstient de relancer si une demande est déjà partie. Sans destinataire confirmé, le message reste un brouillon et ne part pas.

**Le jeu d'essai.** Trois cas fictifs ont été exécutés par un script éditorial local : une facture manquante nommée, une pièce non renseignée et une demande déjà partie. Le script et son journal d'entrées et sorties accompagnent cette recette. Aucun appel ChatGPT n'a été exécuté.

## Rejoué sur le jeu fictif

Nous avons exécuté une **règle déterministe sur un jeu fictif**, et non le modèle ChatGPT. Le tableau reprend les sorties de ce script local ; il ne prédit pas la réponse d'un fournisseur. Les figures sont des reconstitutions HTML de ces situations fictives, pas des captures de ChatGPT.

| Cas joué | Sortie obtenue | Décision |
| --- | --- | --- |
| Atelier Fictif, avril 2026, facture manquante | Objet « Pièce manquante · avril 2026 » ; brouillon « Bonjour, pouvez-vous nous transmettre la facture d’achat de matériel pour Atelier Fictif, période avril 2026 ? Si elle n’est pas disponible, indiquez-nous pourquoi. Merci. » ; destinataire « à confirmer » | Relecture de la pièce, du destinataire et du ton, puis envoi humain seulement |
| Pièce attendue absente du contexte | `arret` ; motif `contexte incomplet` ; message absent ; aucun envoi | Demander d'abord quelle pièce manque |
| Demande déjà partie (état fourni au script local, pas au prompt copiable) | `arret` ; motif `demande déjà partie` ; message absent ; aucun envoi | Vérifier le suivi avant toute nouvelle relance ; ce refus n'a pas été obtenu de ChatGPT |

Cette démonstration ne dit pas comment ChatGPT répondrait au même prompt. Pour comparer, il faut conserver la réponse brute obtenue avec un cas fictif dans l'environnement choisi par le cabinet.

Le résultat attendu n'est pas un texte « intelligent » à copier sans lecture. Le collaborateur doit vérifier que le destinataire est bien celui autorisé pour le dossier, que la pièce demandée est la bonne, que la période concorde avec l'outil de suivi, que le ton convient à la relation et qu'aucune conclusion comptable ou fiscale non vérifiée n'a été ajoutée. Il valide ou réécrit, puis envoie lui-même.

### Adapter le prompt sans perdre la règle d'arrêt

Pour un autre dossier fictif, remplacez dans une copie du prompt le nom de démonstration, la période et la pièce attendue. Conservez la phrase « si la pièce ou la période manque, ne rédige aucun message », la mention du destinataire à confirmer et la demande de points à vérifier. Le texte copiable plus haut illustre un cas où le suivi indique « pièce non reçue » ; **il ne contient pas le champ « demande déjà partie »**. Avant de l'utiliser, l'équipe doit donc lire cet état dans le suivi et arrêter elle-même la relance s'il est positif.

Une fois le brouillon produit, la vérification tient sur une fiche : pièce et période correspondent-elles au dossier ; le destinataire est-il confirmé ; une demande antérieure existe-t-elle ; le texte invente-t-il un montant, une échéance ou une conclusion ? Si une réponse manque, le message reste un brouillon. Pour tester réellement ChatGPT plutôt que notre script local, conservez le prompt exact, la réponse brute et le nom de l'environnement autorisé sur les mêmes trois cas fictifs, puis comparez les refus obtenus. **Aucun de ces essais fournisseur n'a été effectué pour cet article.**

## Deux autres consignes à essayer sur des dossiers fictifs

Ces deux consignes sont des pistes illustratives non exécutées, pas une bibliothèque éprouvée ni des sorties mesurées de ChatGPT. Elles concernent deux autres gestes ; avant usage, créez un cas nominal, un cas incomplet et un cas qui doit être refusé, puis conservez les réponses réellement obtenues dans l'environnement autorisé par le cabinet.

### Au pôle social : préparer une liste de contrôles, pas un bulletin

> Contexte fictif : pour le dossier « Démo Social », un écart reste à expliquer entre une variable reçue et la variable attendue pour la période. Écris une liste de questions à poser au gestionnaire : quelle variable, quelle période, quelle source et quel justificatif ? Ne calcule aucun salaire, ne confirme aucun bulletin et n'affirme pas que la DSN est prête. Si la période ou la source manque, réponds « contrôle interrompu : contexte absent ». Termine par les informations à vérifier dans les outils de paie par le gestionnaire.

Le gestionnaire reprend la liste dans son outil de paie et tranche l'écart. La [méthode de contrôle des bulletins avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn) traite le geste complet ; un texte généré n'effectue aucun contrôle du bulletin ni de la déclaration.

### En révision : demander l'origine d'un écart, sans conclure

> Contexte fictif : la ligne « achat de matériel » du dossier « Atelier Fictif » n'a pas encore sa facture. Rédige trois questions de recherche pour le collaborateur : où est la pièce, à quelle période appartient-elle et quelle information reste à confirmer ? N'invente ni montant ni écriture. Si aucune pièce n'est identifiable, réponds « arrêt : pièce inconnue » et ne propose pas d'imputation.

Le collaborateur vérifie la pièce et décide dans son logiciel comptable. Ce patron ne classe pas une dépense et ne mesure pas ChatGPT ; il aide seulement à formuler ce qui manque avant une décision.

<figure data-blog-proof="w39-prompt-arret">
  <img src="/proofs/blog/w39-prompt-arret.webp" alt="Refus fictif de préparer la demande de pièce en l'absence de la pièce attendue." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## Les quatre éléments à conserver quand on adapte ce prompt

1. **La tâche bornée.** « Prépare une demande de pièce » est vérifiable ; « traite ce dossier » ne dit pas où l'humain reprend.
2. **Les données autorisées.** Commencez sur un jeu fictif. Avant tout usage de données réelles, le cabinet choisit l'outil et ses règles de confidentialité. La [CNIL rappelle que « les utilisateurs finaux ne devraient soumettre que des informations qu’ils sont autorisés à partager »](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative). Selon le déploiement, elle recommande aussi d'interdire certaines données confidentielles ou personnelles. [Une personne peut être identifiée « à partir du croisement d’un ensemble de données »](https://cnil.fr/fr/definition/donnee-personnelle) : remplacer son nom ne suffit pas toujours.
3. **Une sortie définie.** Objet, message, longueur maximale, champs « à confirmer » et refus d'inventer : le collaborateur sait quoi relire.
4. **Une décision qui reste humaine.** Le modèle prépare ; le cabinet contrôle la pièce, le destinataire et l'envoi. Un brouillon n'est ni une preuve de réception ni une validation de la tenue.

## Quand un bon prompt ne suffit plus

Si le même geste revient pour des dizaines de dossiers, le temps peut partir dans la recherche de l'état de chaque pièce, la copie du contexte, la comparaison avec la demande précédente et le suivi des réponses. Une instruction bien écrite n'accède pas magiquement à la bonne source, ne sait pas quand relancer et ne maintient pas une règle commune si chacun utilise sa version.

La prochaine étape n'est pas forcément d'acheter un nouveau logiciel : identifiez où se trouvent les statuts dans les outils du cabinet, qui décide qu'une pièce est réellement manquante, quand une relance est appropriée et qui la valide. Éprouvez le flux sur des dossiers fictifs, y compris un document reçu tardivement et un destinataire incorrect. On peut alors décider quelle partie est automatisable, avec quel contrôle et dans quel outil existant.

Pour prolonger l'usage de l'IA générative, l'[Ordre des experts-comptables présente des cas d’usage en cabinet, des précautions à prendre et des techniques pour bien « prompter »](https://www.experts-comptables.fr/travaux-data-et-ia). La [validation humaine](/glossaire#validation-humaine) garde à la personne le contrôle de la pièce, du destinataire et de l'envoi.

## Questions fréquentes

### Peut-on coller un dossier client dans un prompt ?

Pas dans cet exemple : partez du jeu fictif ci-dessus. Avant d'utiliser un dossier réel, faites préciser par le cabinet l'outil retenu et les informations qu'il accepte d'y saisir ; tant que ce point n'est pas tranché, gardez le cas fictif.

### Que faire si la pièce attendue n'est pas connue ?

Dans notre script local, une pièce inconnue donne « contexte incomplet » : aucun brouillon n'est produit. Le prompt copiable demande le même arrêt, mais sa réponse n'a pas été testée avec ChatGPT. Le collaborateur recherche la pièce dans son suivi avant de relancer le dossier.

### Le prompt envoie-t-il le message ?

Non. Il prépare un texte que le collaborateur confronte à la période, au destinataire et à l'état du dossier. La décision d'envoyer et la trace de cet envoi restent dans les outils du cabinet.

### Comment comparer deux formulations du prompt ?

Jouez les mêmes cas fictifs, dont une pièce absente, et conservez chaque réponse brute. Comparez les erreurs, les champs à confirmer et la lisibilité pour le collaborateur ; notre tableau ne mesure pas la réponse d'un modèle.

## La règle à retenir

Un prompt prépare un brouillon à partir d'un contexte autorisé ; la règle du cabinet décide quand ce brouillon est pertinent et quand il faut s'arrêter. La pièce, le destinataire et l'envoi restent vérifiés par une personne.

## Pour aller plus loin

Pour situer ce geste parmi les autres tâches, consultez la [carte des tâches du cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches). Le brouillon de demande n'est qu'une étape de la [relance des pièces manquantes](/blog/automatiser-la-relance-des-pieces-clients) : celle-ci exige aussi un état par pièce et une règle d'arrêt. Notre [méthode](/methode) part de cette règle et de ses exceptions. Nous écrivons cette règle dans les mots du cabinet, préparons la demande dans ses outils, la faisons recetter avec son équipe et la maintenons. Le collaborateur garde la décision d'envoi. [Confiez-nous cette tâche](/contact) : rien à envoyer, la description du geste suffit.
