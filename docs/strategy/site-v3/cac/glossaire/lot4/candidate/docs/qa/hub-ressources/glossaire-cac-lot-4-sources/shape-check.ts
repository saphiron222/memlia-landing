import type { GlossaryEntry, GlossarySource } from '../../../../src/data/glossary';
type CandidateEntry = Omit<GlossaryEntry, 'sourceCheckedAt'> & { sourceCheckedAt: GlossaryEntry['sourceCheckedAt'] | '2026-10-11' };
const data = {
  "entries": [
    {
      "term": "Documentation de l’audit (dossier de travail)",
      "anchor": "dossier-travail-audit",
      "definition": "La documentation de l’audit rassemble, dans le dossier de chaque entité contrôlée, les documents qui étayent l’opinion du commissaire aux comptes et établissent la réalisation de ses travaux. Dossier de travail est ici le nom de pratique associé à cette documentation.",
      "context": "La NEP 230 demande de rendre compréhensibles la planification, les procédures, les éléments testés, les résultats et les conclusions pour une personne expérimentée en audit qui n’a pas participé à la mission. Les auteurs des travaux et leurs dates sont indiqués ; lorsqu’une revue existe, son auteur, sa date et son étendue le sont aussi.",
      "exampleFictitious": "Dans un dossier fictif, une feuille de contrôle renvoie aux écritures testées et aux pièces reçues. L’auditeur ajoute son résultat et le CAC sa conclusion ; un export de calcul isolé ne remplace pas cet ensemble.",
      "commonConfusion": "Accumuler des fichiers ne suffit pas à documenter un audit. Les explications données au contrôle ne constituent pas un élément de documentation, même lorsqu’elles précisent le dossier.",
      "automationBoundary": "Préparation : proposer un index et des renvois en conservant les pièces et commentaires saisis. Validation : l’équipe vérifie le rattachement et traite les liens manquants ; dans le doute, la préparation s’arrête. Jugement : le CAC apprécie les travaux, leur documentation et les conclusions qui fondent son opinion.",
      "relatedTerms": [
        "dossier-permanent-audit",
        "feuille-maitresse-audit",
        "plan-mission-audit"
      ],
      "id": "dossier-travail-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-230",
        "dila-a821-66"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-230": "documentation de l’audit",
        "dila-a821-66": "documentation de l’audit"
      }
    },
    {
      "term": "Dossier permanent",
      "anchor": "dossier-permanent-audit",
      "definition": "Dans ce glossaire, le dossier permanent désigne le classement des informations utiles sur plusieurs exercices : structure de l’entité, contrats durables ou description de son organisation. Ce vocabulaire de classement ne crée pas une obligation normative autonome.",
      "context": "La NEP 230 exige une documentation permettant de comprendre les travaux et les conclusions de la mission. Elle définit la forme, le contenu et l’étendue de cette documentation ; le classement permanent présenté ici est une convention de pratique, pas un dossier-type prescrit par cette norme.",
      "exampleFictitious": "Dans un dossier fictif, un contrat de financement conservé depuis l’exercice précédent est accompagné d’un avenant nouveau. L’équipe vérifie ce qui demeure applicable avant de le réutiliser.",
      "commonConfusion": "Convention Memlia : permanent ne signifie ni immuable ni automatiquement valable pour l’exercice suivant. Une pièce conservée n’est pas une conclusion reconduite.",
      "automationBoundary": "Préparation : proposer les pièces à reconduire et signaler une version nouvelle, sans remplacer les notes du cabinet. Validation : l’équipe confirme l’actualité et le classement ; une version ambiguë arrête la reconduction. Jugement : le CAC décide de l’usage de ces informations dans l’audit et reste responsable de son opinion.",
      "relatedTerms": [
        "dossier-travail-audit",
        "plan-mission-audit"
      ],
      "id": "dossier-permanent-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-230",
        "dila-a821-66"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-230": "documentation",
        "dila-a821-66": "documentation"
      }
    },
    {
      "term": "Feuille maîtresse",
      "anchor": "feuille-maitresse-audit",
      "definition": "Dans ce glossaire, une feuille maîtresse est un tableau de synthèse qui regroupe les soldes d’un cycle et leurs renvois vers les feuilles de contrôle. C’est un support de travail du cabinet, pas une diligence autonome imposée sous ce nom.",
      "context": "La NEP 230 demande que les procédures effectuées, les éléments testés, les résultats et les conclusions soient compréhensibles dans la documentation. La feuille maîtresse présentée ici organise les renvois ; elle ne démontre pas à elle seule que cette exigence est satisfaite.",
      "exampleFictitious": "Dans un exemple fictif, les comptes d’immobilisations sont regroupés dans une feuille maîtresse. Un solde sans feuille de contrôle associée est signalé à l’équipe, sans être marqué comme audité.",
      "commonConfusion": "Convention Memlia : une concordance entre balance et feuille maîtresse ne prouve pas que les soldes ont été contrôlés. Regrouper des comptes et conclure sur un cycle sont deux gestes distincts.",
      "automationBoundary": "Préparation : regrouper selon la table fournie et proposer les concordances. Validation : l’équipe valide les regroupements et renvois ; un compte sans règle reste en exception. Jugement : le CAC choisit les diligences et apprécie les résultats ; les commentaires saisis restent intacts et aucune opinion n’est produite par le tableau.",
      "relatedTerms": [
        "dossier-travail-audit",
        "programme-travail-audit"
      ],
      "id": "feuille-maitresse-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-230",
        "dila-a821-66"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-230": "documentation",
        "dila-a821-66": "documentation"
      }
    },
    {
      "term": "Plan de mission",
      "anchor": "plan-mission-audit",
      "definition": "Le plan de mission décrit l’approche générale de l’audit : étendue, calendrier et orientation des travaux, seuils de signification retenus et lignes directrices pour préparer le programme de travail.",
      "context": "Selon la NEP 300, le CAC établit par écrit un plan de mission et un programme de travail relatifs aux comptes de l’exercice. Il peut modifier les éléments planifiés à partir des éléments collectés ; les modifications et leurs raisons sont consignées dans le dossier.",
      "exampleFictitious": "Dans une mission fictive, un changement d’activité conduit le CAC à revoir l’orientation des travaux. L’équipe conserve la version précédente et documente la raison de la modification.",
      "commonConfusion": "Le plan de mission expose l’approche générale ; le programme de travail définit les diligences nécessaires à sa mise en œuvre. Un calendrier d’affectation seul n’exprime pas cette approche.",
      "automationBoundary": "Préparation : assembler les informations et proposer un calendrier à partir des choix saisis. Validation : l’équipe confirme les versions et ressources ; une donnée de mission manquante bloque la proposition. Jugement : le CAC fixe l’approche, les seuils et les modifications nécessaires, sans écrasement de ses choix ni génération d’opinion.",
      "relatedTerms": [
        "programme-travail-audit",
        "dossier-travail-audit"
      ],
      "id": "plan-mission-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-300",
        "dila-a821-69"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-300": "plan de mission",
        "dila-a821-69": "plan de mission"
      }
    },
    {
      "term": "Programme de travail",
      "anchor": "programme-travail-audit",
      "definition": "Le programme de travail définit la nature et l’étendue des diligences estimées nécessaires pour mettre en œuvre le plan de mission pendant l’exercice, compte tenu des prescriptions légales et des normes d’exercice professionnel. Il indique les heures affectées à ces diligences.",
      "context": "La NEP 300 prévoit un programme écrit, adapté à l’entité et à la mission. Les éléments collectés peuvent conduire le CAC à revoir les travaux prévus ; les modifications et les raisons qui les motivent sont consignées dans le dossier.",
      "exampleFictitious": "Dans un programme fictif, les diligences choisies sont reliées à leurs feuilles de contrôle. Une procédure ajoutée conserve son auteur et le motif de son ajout ; une case cochée sans résultat est laissée à examiner.",
      "commonConfusion": "Un programme décrit les travaux prévus ; il ne constitue pas, à lui seul, leur documentation d’exécution. La NEP 230 demande aussi les procédures effectuées, leurs résultats et les conclusions.",
      "automationBoundary": "Préparation : présenter les diligences décidées et les pièces attendues, sans déclarer un contrôle terminé. Validation : l’équipe vérifie la correspondance avec les travaux réalisés ; une pièce absente reste en exception. Jugement : le CAC détermine les diligences suffisantes, leurs ajustements et ses conclusions ; les saisies humaines restent préservées.",
      "relatedTerms": [
        "plan-mission-audit",
        "dossier-travail-audit",
        "feuille-maitresse-audit"
      ],
      "id": "programme-travail-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-300",
        "dila-a821-69",
        "h2a-nep-230",
        "dila-a821-66"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-300": "programme de travail",
        "dila-a821-69": "programme de travail",
        "h2a-nep-230": "programme",
        "dila-a821-66": "programme"
      }
    },
    {
      "term": "Déclarations écrites de la direction (lettre d’affirmation)",
      "anchor": "declarations-ecrites-direction",
      "definition": "Les déclarations écrites de la direction sont les formulations que le CAC demande au représentant légal pour conclure sur les assertions qu’il souhaite vérifier. La lettre d’affirmation est une forme de ces déclarations, pas une mission ni une entrée distincte.",
      "context": "La NEP 580 prévoit notamment une lettre du représentant légal au CAC, une lettre du CAC confirmée par le représentant légal ou certaines déclarations consignées dans un procès-verbal. La lettre d’affirmation est datée et signée, envoyée directement au CAC et émise au plus près de la signature de son rapport, sans lui être postérieure.",
      "exampleFictitious": "Dans une mission fictive, une lettre reçue n’est pas signée. La préparation signale ce manque et laisse le dossier en attente de l’équipe ; elle n’ajoute ni signature ni déclaration au nom de la direction.",
      "commonConfusion": "Une déclaration ne dispense pas de rechercher des éléments qui la corroborent lorsqu’elle concerne un élément significatif des comptes. Une incohérence avec d’autres éléments appelle des procédures pour l’élucider.",
      "automationBoundary": "Préparation : proposer une liste des éléments attendus et repérer les champs manquants. Validation : la direction formule et signe ses déclarations, l’équipe contrôle la réception et les dates ; un contenu contradictoire arrête la préparation. Jugement : le CAC apprécie leur cohérence et leurs conséquences sur son opinion ; aucun texte humain n’est remplacé silencieusement.",
      "relatedTerms": [
        "evenements-posterieurs-cloture",
        "rapport-sur-comptes",
        "continuite-exploitation"
      ],
      "id": "declarations-ecrites-direction",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-580",
        "dila-a821-79"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-580": "déclarations écrites",
        "dila-a821-79": "déclarations écrites"
      }
    },
    {
      "term": "Événements postérieurs à la clôture",
      "anchor": "evenements-posterieurs-cloture",
      "definition": "Les événements postérieurs sont les événements identifiés entre la clôture de l’exercice et l’approbation des comptes qui doivent faire l’objet d’un traitement comptable ou d’une information à l’organe appelé à statuer sur les comptes.",
      "context": "La NEP 560 distingue la date de survenance de l’événement et celle de son identification. Les procédures de recherche sont menées au plus près de la signature du rapport ; après cette signature, le CAC n’en met plus en œuvre pour identifier des événements, mais traite ceux dont il prend connaissance avant l’approbation selon les situations prévues par la norme.",
      "exampleFictitious": "Dans un cas fictif, un litige existant à la clôture fait l’objet d’un jugement après celle-ci. L’équipe consigne les dates et transmet les pièces au CAC, sans déduire automatiquement une écriture ou une opinion.",
      "commonConfusion": "Postérieur à la clôture ne signifie pas écriture obligatoire dans tous les cas. Le traitement comptable dépend du référentiel et des dates ; l’information de l’organe appelé à statuer constitue un autre volet.",
      "automationBoundary": "Préparation : ordonner les pièces et dates déclarées dans une chronologie. Validation : l’équipe confirme les dates et la nature des informations ; une date incertaine arrête le classement. Jugement : le CAC apprécie les suites dans les comptes, les communications et son rapport, sans modifier les saisies ni produire son opinion.",
      "relatedTerms": [
        "declarations-ecrites-direction",
        "rapport-sur-comptes",
        "dossier-travail-audit"
      ],
      "id": "evenements-posterieurs-cloture",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-560",
        "dila-a821-85"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-560": "événements postérieurs",
        "dila-a821-85": "événements postérieurs"
      }
    },
    {
      "term": "Continuité d’exploitation",
      "anchor": "continuite-exploitation",
      "definition": "La continuité d’exploitation est la perspective dans laquelle l’entité est présumée poursuivre ses activités pour établir ses comptes. Le CAC apprécie si cette perspective est appropriée et s’il existe une incertitude significative susceptible de la remettre en cause.",
      "context": "La NEP 570 demande au CAC d’examiner l’évaluation de la direction lorsque des événements ou circonstances sont identifiés. Quand le référentiel comptable ne définit pas la période d’appréciation, celle-ci est de douze mois à compter de la clôture. Le CAC conclut sur l’incertitude à partir des éléments collectés et de son jugement professionnel.",
      "exampleFictitious": "Dans un exemple fictif, un emprunt arrive à échéance sans confirmation de renouvellement. La préparation rassemble l’échéancier et les prévisions ; le CAC apprécie les hypothèses et les plans de la direction.",
      "commonConfusion": "Une incertitude significative ne signifie pas automatiquement que la continuité est inappropriée. Si le principe reste approprié et que l’annexe informe correctement sur l’incertitude, le rapport comporte une partie distincte sans remettre en cause l’opinion ; les autres situations ont des conséquences différentes.",
      "automationBoundary": "Préparation : rapprocher échéanciers et prévisions et signaler les données absentes. Validation : l’équipe vérifie les hypothèses documentées ; un financement non confirmé reste une exception. Jugement : le CAC apprécie la continuité, l’incertitude, l’information donnée et les suites dans son rapport ; ni les hypothèses saisies ni son opinion ne sont générées à sa place.",
      "relatedTerms": [
        "rapport-sur-comptes",
        "declarations-ecrites-direction",
        "evenements-posterieurs-cloture"
      ],
      "id": "continuite-exploitation",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-570",
        "dila-a821-83"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-570": "continuité d’exploitation",
        "dila-a821-83": "continuité d’exploitation"
      }
    },
    {
      "term": "Rapport sur les comptes",
      "anchor": "rapport-sur-comptes",
      "definition": "Le rapport sur les comptes est le document dans lequel le CAC formule son opinion à l’organe appelé à statuer sur les comptes, justifie ses appréciations et rend compte des vérifications et informations spécifiques prévues par les textes.",
      "context": "La NEP 700 distingue le rapport sur les comptes annuels du rapport sur les comptes consolidés. Le CAC peut certifier sans réserve, certifier avec réserve, refuser de certifier ou être dans l’impossibilité de certifier ; les motifs des trois dernières situations figurent dans le fondement de l’opinion.",
      "exampleFictitious": "Dans un projet fictif, l’identité de l’entité, l’exercice et les comptes joints sont rapprochés des pièces validées. La zone d’opinion reste vide jusqu’à la décision et la rédaction du CAC.",
      "commonConfusion": "Une observation attire l’attention sur une information de l’annexe ; elle ne se confond pas avec une réserve. Une certification sans réserve exprime une assurance raisonnable, élevée mais non absolue, et non une garantie d’absence de toute erreur.",
      "automationBoundary": "Préparation : assembler les références et comptes joints et signaler les incohérences. Validation : l’équipe confirme le périmètre et les versions ; des comptes non validés bloquent la proposition. Jugement : le CAC rédige l’opinion, ses motifs et appréciations, puis signe sous sa responsabilité ; aucun résultat d’outil ni remplacement de ses saisies ne certifie les comptes.",
      "relatedTerms": [
        "dossier-travail-audit",
        "continuite-exploitation",
        "alpe"
      ],
      "id": "rapport-sur-comptes",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-700",
        "dila-a821-92"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-700": "rapport",
        "dila-a821-92": "rapport"
      }
    },
    {
      "term": "ALPE",
      "anchor": "alpe",
      "definition": "ALPE signifie audit légal des petites entreprises. Ce nom de pratique renvoie ici à la mission du CAC nommé pour trois exercices encadrée par la NEP 911, dont les diligences sont proportionnées à la petite entreprise et aux risques de la mission.",
      "context": "La NEP 911 encadre les situations de mandat de trois exercices et comprend la certification des comptes ainsi qu’un rapport sur les risques financiers, comptables et de gestion. La NEP 912 concerne une mission de six exercices dans les petites entreprises. Les deux normes ont été homologuées le 24 juillet 2026 ; la CNCC précise qu’elles remplacent celles homologuées le 13 novembre 2024.",
      "exampleFictitious": "Dans un mandat fictif, la préparation identifie la durée déclarée et les pièces de nomination. Une durée non confirmée bloque le choix de la trame ; le CAC détermine la norme applicable et ses diligences.",
      "commonConfusion": "Une mission proportionnée n’est pas une assurance réduite ni un simple classement administratif. La NEP 911 vise une assurance raisonnable, élevée mais non absolue ; le CAC conserve son jugement pour déterminer les travaux et fonder son opinion. Une petite entreprise ne relève pas automatiquement d’un mandat de trois exercices.",
      "automationBoundary": "Préparation : rassembler les pièces de mandat et proposer un suivi documentaire. Validation : l’équipe confirme les informations et la trame retenue ; une situation hors règle reste en exception. Jugement : le CAC apprécie le cadre applicable, les risques, ses diligences et ses rapports, sans écrasement de ses choix ni génération de son opinion.",
      "relatedTerms": [
        "rapport-sur-comptes",
        "plan-mission-audit",
        "programme-travail-audit"
      ],
      "id": "alpe",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-911",
        "dila-a821-94",
        "h2a-nep-912",
        "cncc-nep-911",
        "cncc-nep-912",
        "cncc-alpe"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "Vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "Préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-911": "NEP 911",
        "dila-a821-94": "NEP 912",
        "h2a-nep-912": "NEP 912",
        "cncc-nep-911": "NEP 911",
        "cncc-nep-912": "NEP 912",
        "cncc-alpe": "ALPE"
      }
    }
  ],
  "sources": {
    "h2a-nep-230": {
      "id": "h2a-nep-230",
      "publisher": "H2A",
      "title": "NEP 230 - Documentation de l’audit des comptes",
      "url": "https://h2a-france.org/normes/documentation-de-laudit-des-comptes/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-300": {
      "id": "h2a-nep-300",
      "publisher": "H2A",
      "title": "NEP 300 - Planification de l’audit",
      "url": "https://h2a-france.org/normes/planification-de-laudit/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-560": {
      "id": "h2a-nep-560",
      "publisher": "H2A",
      "title": "NEP 560 - Evènements postérieurs à la clôture de l’exercice",
      "url": "https://h2a-france.org/normes/evenements-posterieurs-a-la-cloture-de-lexercice/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-570": {
      "id": "h2a-nep-570",
      "publisher": "H2A",
      "title": "NEP 570 - Continuité d’exploitation",
      "url": "https://h2a-france.org/normes/continuite-dexploitation/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-580": {
      "id": "h2a-nep-580",
      "publisher": "H2A",
      "title": "NEP 580 - Déclarations de la direction",
      "url": "https://h2a-france.org/normes/declarations-de-la-direction/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-700": {
      "id": "h2a-nep-700",
      "publisher": "H2A",
      "title": "NEP 700 - Rapports du commissaire aux comptes sur les comptes annuels et consolidés",
      "url": "https://h2a-france.org/normes/rapports-du-commissaires-aux-comptes-sur-les-comptes-annuels-et-consolides/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-911": {
      "id": "h2a-nep-911",
      "publisher": "H2A",
      "title": "NEP 911 - Mission du commissaire aux comptes nommé pour trois exercices prévue à l’article L.821-57 du code de commerce",
      "url": "https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-trois-exercices-prevue-a-larticle-l-823-12-1-du-code-de-commerce/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-912": {
      "id": "h2a-nep-912",
      "publisher": "H2A",
      "title": "NEP 912 - Mission du commissaire aux comptes nommé pour six exercices dans des petites entreprises",
      "url": "https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-six-exercices-dans-des-petites-entreprises/",
      "checkedAt": "2026-10-11"
    },
    "cncc-nep-911": {
      "id": "cncc-nep-911",
      "publisher": "CNCC",
      "title": "NEP-911. Mission du commissaire aux comptes nommé pour trois exercices prévue à l’article L. 821-57 du code de commerce",
      "url": "https://doc.cncc.fr/docs/nep-911-mission-du-commissaire-a-6a672aecbcc27",
      "checkedAt": "2026-10-11"
    },
    "cncc-nep-912": {
      "id": "cncc-nep-912",
      "publisher": "CNCC",
      "title": "NEP 912. Mission du commissaire aux comptes nommé pour six exercices dans des petites entreprises",
      "url": "https://doc.cncc.fr/docs/nep-912-mission-du-commissaire-a-6a672baf28f47",
      "checkedAt": "2026-10-11"
    },
    "cncc-alpe": {
      "id": "cncc-alpe",
      "publisher": "CNCC",
      "title": "Propos et Débats, Audit et société, septembre 2022, n°2 : acronyme ALPE",
      "url": "https://cdn.cncc.fr/download/cncc-livret-auditsociete-2.pdf",
      "checkedAt": "2026-10-11"
    },
    "dila-a821-66": {
      "id": "dila-a821-66",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-66",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048882660",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-69": {
      "id": "dila-a821-69",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-69",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050693497",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-79": {
      "id": "dila-a821-79",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-79",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048877159",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-83": {
      "id": "dila-a821-83",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-83",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048877010",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-85": {
      "id": "dila-a821-85",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-85",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048876883",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-92": {
      "id": "dila-a821-92",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-92",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048875993",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-94": {
      "id": "dila-a821-94",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-94",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054491781",
      "checkedAt": "2026-10-06"
    }
  }
} as const;
const entries: CandidateEntry[] = data.entries.map(e => ({ ...e, relatedTerms: [...e.relatedTerms], internalLinks: [...e.internalLinks], sourceIds: [...e.sourceIds] }));
const sources: Record<string, GlossarySource> = data.sources;
void entries; void sources;
