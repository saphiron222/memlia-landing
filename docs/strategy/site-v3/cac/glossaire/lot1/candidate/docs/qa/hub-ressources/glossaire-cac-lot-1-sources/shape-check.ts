import type { GlossaryEntry, GlossarySource } from '../../../../src/data/glossary';
type CandidateEntry = Omit<GlossaryEntry, 'sourceCheckedAt'> & { sourceCheckedAt: GlossaryEntry['sourceCheckedAt'] | '2026-10-06' | '2026-10-11' };
const data = {
  "entries": [
    {
      "id": "nep",
      "term": "NEP",
      "anchor": "nep",
      "nature": "Réglementaire",
      "definition": "Les normes d’exercice professionnel (NEP) encadrent les travaux du commissaire aux comptes dans les missions auxquelles elles s’appliquent. La NEP 200 fixe les principes de l’audit des comptes en vue de leur certification.",
      "context": "La NEP 200 est homologuée à l’article A.821-63 du Code de commerce. Le référentiel normatif de la H2A permet de retrouver les numéros d’usage et les textes correspondants ; le CAC apprécie ceux qui concernent sa mission.",
      "exampleFictitious": "Dans un dossier fictif, le chef de mission repère la NEP 200 dans son référentiel avant de préciser les travaux attendus ; un tableau de suivi ne suffit pas à réaliser ces travaux.",
      "commonConfusion": "Une NEP n’est pas un mode d’emploi du logiciel d’audit. Son application suppose des diligences et le jugement du CAC, pas la seule présence d’une checklist.",
      "automationBoundary": "Nous préparons les renvois et les listes de pièces selon une règle écrite ; le CAC choisit les diligences, apprécie leur exécution et leurs conclusions. Une référence introuvable suspend la proposition.",
      "relatedTerms": [
        "audit-legal",
        "jugement-professionnel",
        "h2a"
      ],
      "internalLinks": [],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "h2a-nep-200",
        "dila-a821-63",
        "h2a-referentiel"
      ],
      "motsSources": {
        "h2a-nep-200": "NEP",
        "dila-a821-63": "A.821-63",
        "h2a-referentiel": "référentiel normatif"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "audit-legal",
      "term": "Audit légal",
      "anchor": "audit-legal",
      "nature": "Professionnelle",
      "definition": "L’audit légal des comptes désigne ici l’audit mis en œuvre par le commissaire aux comptes en vue de la certification des comptes annuels et, le cas échéant, consolidés. Il permet au CAC de fonder son opinion sur les comptes.",
      "context": "L’article L.821-53 du Code de commerce porte la certification ; la NEP 200 décrit l’audit qui la prépare. Le terme « audit légal » est un vocabulaire professionnel, pas le nom d’une prestation Memlia.",
      "exampleFictitious": "Pour une entité fictive, l’équipe rassemble les éléments collectés et ses travaux ; le signataire apprécie ces éléments avant de formuler son opinion.",
      "commonConfusion": "L’audit des comptes ne garantit ni la viabilité de l’entité ni la qualité de sa gestion. Il se distingue de la préparation de la comptabilité et d’un simple contrôle de structure de fichier.",
      "automationBoundary": "Nous préparons rapprochements, renvois et exceptions sans modifier les observations saisies ; le CAC conserve la stratégie d’audit, l’appréciation des éléments collectés, l’opinion et la signature.",
      "relatedTerms": [
        "nep",
        "assurance-raisonnable",
        "independance-cac"
      ],
      "internalLinks": [],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "h2a-nep-200",
        "dila-l821-53"
      ],
      "motsSources": {
        "h2a-nep-200": "audit",
        "dila-l821-53": "L.821-53"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "assurance-raisonnable",
      "term": "Assurance raisonnable",
      "anchor": "assurance-raisonnable",
      "nature": "Réglementaire",
      "definition": "L’assurance raisonnable est le niveau d’assurance élevé, mais non absolu, que le CAC recherche pour conclure que les comptes, pris dans leur ensemble, ne comportent pas d’anomalies significatives.",
      "context": "La NEP 200, paragraphes 08 et 09, relie cette assurance aux limites de l’audit, notamment aux sondages, au contrôle interne et à la nature des éléments collectés.",
      "exampleFictitious": "Dans un dossier fictif, aucun écart n’apparaît dans les éléments examinés ; le CAC apprécie néanmoins si les travaux sont suffisants pour soutenir son opinion sur l’ensemble des comptes.",
      "commonConfusion": "L’assurance raisonnable n’est ni une certitude absolue ni un pourcentage de confiance fourni par un outil. Un fichier sans alerte ne démontre pas, à lui seul, l’absence d’anomalies significatives.",
      "automationBoundary": "Nous présentons les contrôles exécutés, les données utilisées et leurs limites ; le CAC décide des travaux complémentaires et de la conclusion. L’outil n’attribue aucun niveau d’assurance à la mission.",
      "relatedTerms": [
        "audit-legal",
        "jugement-professionnel",
        "esprit-critique"
      ],
      "internalLinks": [
        {
          "label": "Vérifier une réponse d’IA en comptabilité, sans la confondre avec une conclusion d’audit",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        }
      ],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "h2a-nep-200"
      ],
      "motsSources": {
        "h2a-nep-200": "assurance raisonnable"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "jugement-professionnel",
      "term": "Jugement professionnel",
      "anchor": "jugement-professionnel",
      "nature": "Réglementaire",
      "definition": "Le jugement professionnel est l’appréciation exercée par le CAC tout au long de ses travaux, notamment pour décider de la nature, du calendrier et de l’étendue des procédures d’audit et pour conclure à partir des éléments collectés.",
      "context": "La NEP 200, paragraphe 07, situe ce jugement dans les choix de travaux et les conclusions. Une proposition technique ne porte pas cette appréciation à la place du professionnel.",
      "exampleFictitious": "Un écart fictif apparaît dans un rapprochement. Le chef de mission examine ses causes et propose des travaux ; le CAC apprécie leur portée plutôt que d’accepter le commentaire suggéré.",
      "commonConfusion": "Le jugement professionnel n’est pas l’application aveugle d’un seuil ni la reprise d’une réponse d’IA. La décision repose sur l’appréciation des éléments collectés, non sur leur simple classement.",
      "automationBoundary": "Nous préparons les comparaisons et les propositions dans une zone distincte ; les justifications, choix de procédures et conclusions saisis par l’équipe restent préservés. Le CAC décide.",
      "relatedTerms": [
        "esprit-critique",
        "assurance-raisonnable",
        "audit-legal"
      ],
      "internalLinks": [
        {
          "label": "Vérifier une réponse d’IA en comptabilité, sans la confondre avec une conclusion d’audit",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        }
      ],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "h2a-nep-200"
      ],
      "motsSources": {
        "h2a-nep-200": "jugement professionnel"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "esprit-critique",
      "term": "Esprit critique",
      "anchor": "esprit-critique",
      "nature": "Réglementaire",
      "definition": "L’esprit critique est l’attitude par laquelle le CAC évalue la validité des éléments collectés et reste attentif aux informations qui contredisent ou remettent en cause leur fiabilité.",
      "context": "La NEP 200, paragraphe 06, demande cette attitude tout au long de l’audit, en tenant compte des situations susceptibles de conduire à des anomalies significatives dans les comptes.",
      "exampleFictitious": "Deux pièces fictives décrivent des dates différentes pour une même opération. L’équipe conserve les deux versions et examine la contradiction au lieu de retenir automatiquement la plus récente.",
      "commonConfusion": "L’esprit critique n’est pas une suspicion systématique de fraude. Une alerte technique appelle une appréciation des éléments ; elle ne suffit pas à qualifier l’opération.",
      "automationBoundary": "Nous repérons les divergences et conservons leurs pièces d’origine ; l’équipe examine les contradictions et le CAC apprécie la fiabilité des éléments. Une pièce illisible reste signalée, jamais interprétée par défaut.",
      "relatedTerms": [
        "jugement-professionnel",
        "audit-legal",
        "assurance-raisonnable"
      ],
      "internalLinks": [
        {
          "label": "Vérifier une réponse d’IA en comptabilité, sans la confondre avec une conclusion d’audit",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        }
      ],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "h2a-nep-200"
      ],
      "motsSources": {
        "h2a-nep-200": "esprit critique"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "independance-cac",
      "term": "Indépendance du CAC",
      "anchor": "independance-cac",
      "nature": "Réglementaire",
      "definition": "L’indépendance du CAC est une exigence applicable à ses missions et prestations, appréciée en réalité et en apparence, pour préserver ses conclusions des partis pris, conflits d’intérêts et risques d’autorévision.",
      "context": "L’article L.821-31 du Code de commerce traite notamment des intérêts et des liens incompatibles. La norme de déontologie publiée par la H2A précise l’appréciation de l’indépendance ; l’absence d’un intérêt financier ne résume pas toute cette exigence.",
      "exampleFictitious": "Dans un cas fictif, un cabinet mixte envisage un outil utilisé en production comptable et en audit. Il examine les missions, les accès et les risques d’autorévision avant tout usage.",
      "commonConfusion": "Partager un outil ou disposer d’accès séparés ne démontre pas l’indépendance. Cette appréciation porte sur les faits et circonstances de la mission ou de la prestation, en réalité et en apparence.",
      "automationBoundary": "Nous préparons l’inventaire des accès, rôles et traitements ; le CAC apprécie les incompatibilités et les risques, puis décide des conditions d’usage. Aucun indicateur automatique ne déclare la mission indépendante.",
      "relatedTerms": [
        "sacc",
        "jugement-professionnel",
        "audit-legal"
      ],
      "internalLinks": [],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "h2a-deontologie",
        "dila-l821-31"
      ],
      "motsSources": {
        "h2a-deontologie": "indépendance",
        "dila-l821-31": "L.821-31"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "secret-professionnel-cac",
      "term": "Secret professionnel du CAC",
      "anchor": "secret-professionnel-cac",
      "nature": "Réglementaire",
      "definition": "Le secret professionnel du CAC protège les faits, actes et renseignements connus dans l’exercice de la profession. L’article L.821-35 du Code de commerce y astreint les commissaires aux comptes, leurs collaborateurs et experts, sous les réserves et exceptions qu’il prévoit.",
      "context": "Le même article prévoit des cas de levée du secret, notamment entre certains intervenants à la certification des comptes ou des informations de durabilité. Ces cas ne constituent pas une autorisation générale de transmettre un dossier à un prestataire ou à une IA.",
      "exampleFictitious": "Dans un essai fictif, le cabinet décrit un traitement avec des pièces inventées. Avant un usage sur un dossier, il examine les données, accès, destinataires et appels réseau de l’environnement envisagé.",
      "commonConfusion": "Un traitement présenté comme local ne suffit pas à établir le respect du secret. Le recours à un prestataire ou à une IA n’est pas, en soi, un cas de levée du secret prévu par l’article L.821-35.",
      "automationBoundary": "Nous documentons les données et leurs flux, utilisons des jeux fictifs pour les essais et signalons toute destination inconnue ; le CAC apprécie les conditions d’utilisation avant une transmission. Les fichiers clients ne servent pas à illustrer le glossaire.",
      "relatedTerms": [
        "independance-cac",
        "pseudonymisation",
        "jeu-d-essai-fictif"
      ],
      "internalLinks": [
        {
          "label": "Préparer les données avant une transmission à l’IA en cabinet comptable",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-06",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "dila-l821-35"
      ],
      "motsSources": {
        "dila-l821-35": "L.821-35"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "h2a",
      "term": "H2A",
      "anchor": "h2a",
      "nature": "Professionnelle",
      "definition": "La Haute autorité de l’audit (H2A) est l’autorité publique indépendante qui supervise notamment la profession de commissaire aux comptes et la certification des informations en matière de durabilité.",
      "context": "L’article L.820-1 du Code de commerce décrit ses missions, dont l’adoption des normes, les contrôles, les enquêtes et les sanctions. La H2A a succédé au H3C le 1er janvier 2024.",
      "exampleFictitious": "Pour un dossier fictif, le cabinet consulte le référentiel H2A pour retrouver une norme applicable ; il distingue cette publication officielle de la documentation de son logiciel.",
      "commonConfusion": "La H2A n’est pas la CNCC : l’autorité de supervision et l’instance représentative de la profession ont des rôles distincts. Citer la H2A ne signifie pas qu’elle a approuvé un outil Memlia.",
      "automationBoundary": "Nous préparons des renvois traçables vers les textes et signalons un lien absent ; le CAC vérifie la version et son application à la mission. Aucune proposition ne reçoit un label d’approbation H2A.",
      "relatedTerms": [
        "cncc",
        "nep",
        "audit-legal"
      ],
      "internalLinks": [],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "dila-l820-1",
        "h2a-presentation"
      ],
      "motsSources": {
        "dila-l820-1": "L.820-1",
        "h2a-presentation": "H2A a succédé au H3C"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "cncc",
      "term": "CNCC",
      "anchor": "cncc",
      "nature": "Professionnelle",
      "definition": "La Compagnie nationale des commissaires aux comptes (CNCC) est l’instance représentative de la profession en France. Elle porte la voix des commissaires aux comptes auprès des institutions et des parties prenantes.",
      "context": "La CNCC représente notamment la profession auprès de son régulateur, la H2A. Ses publications professionnelles aident à comprendre les pratiques ; une publication doctrinale ne se confond pas avec le texte normatif auquel elle renvoie.",
      "exampleFictitious": "Dans une préparation fictive, l’équipe repère une publication CNCC et le texte qu’elle cite. Elle conserve le renvoi officiel pour distinguer commentaire professionnel et exigence applicable.",
      "commonConfusion": "La CNCC n’est pas la H2A. Un guide professionnel n’établit pas à lui seul que l’environnement du cabinet ou une automatisation est conforme aux normes applicables.",
      "automationBoundary": "Nous indexons les références et séparons les textes des commentaires ; le CAC apprécie leur portée et leur actualité. Nous ne reproduisons pas de modèles réservés ni n’inventons une approbation CNCC.",
      "relatedTerms": [
        "h2a",
        "nep",
        "sacc"
      ],
      "internalLinks": [],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "cncc-representation"
      ],
      "motsSources": {
        "cncc-representation": "instance représentative"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    },
    {
      "id": "sacc",
      "term": "SACC",
      "anchor": "sacc",
      "nature": "Professionnelle",
      "definition": "Les services autres que la certification des comptes (SACC) désignent, dans le vocabulaire professionnel, les services distincts de la mission de certification. Ce terme ne signifie pas que tout service peut être fourni par le CAC.",
      "context": "La CNCC emploie cet intitulé dans sa documentation. La norme de déontologie de la H2A distingue les missions légales ou réglementaires et les prestations, parmi lesquelles un audit financier contractuel ; le CAC apprécie le cadre et l’indépendance de chaque intervention.",
      "exampleFictitious": "Une entité fictive demande un audit contractuel. Le CAC examine la demande et les conditions d’intervention avant de l’accepter ; le mot SACC ne vaut pas accord.",
      "commonConfusion": "SACC et certification des comptes ne sont pas interchangeables. Définir ce vocabulaire ne publie aucune offre Memlia et ne rouvre pas les familles de services gardées en réserve.",
      "automationBoundary": "Nous préparons les pièces et le périmètre décrit par le cabinet ; le CAC décide de l’acceptation, des conditions d’indépendance, des travaux et de leur restitution. Aucun service en réserve n’est proposé par cette entrée.",
      "relatedTerms": [
        "audit-legal",
        "independance-cac",
        "cncc"
      ],
      "internalLinks": [],
      "owner": "Commissariat aux comptes",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2026-12-13",
      "sourceIds": [
        "cncc-sacc-vocabulaire",
        "h2a-deontologie"
      ],
      "motsSources": {
        "cncc-sacc-vocabulaire": "services autres que la certification des comptes",
        "h2a-deontologie": "missions légales ou réglementaires"
      },
      "routeDecision": "anchor",
      "status": "preview-only"
    }
  ],
  "sources": {
    "h2a-nep-200": {
      "id": "h2a-nep-200",
      "publisher": "H2A",
      "title": "NEP 200, principes applicables à l’audit des comptes",
      "url": "https://h2a-france.org/normes/audit-des-comptes-mis-en-oeuvre-dans-le-cadre-de-la-certification-des-comptes/",
      "checkedAt": "2026-10-11"
    },
    "h2a-referentiel": {
      "id": "h2a-referentiel",
      "publisher": "H2A",
      "title": "Référentiel normatif",
      "url": "https://h2a-france.org/referentiel-normatif-et-code-de-deontologie/acceder-au-referentiel-normatif/",
      "checkedAt": "2026-10-11"
    },
    "h2a-presentation": {
      "id": "h2a-presentation",
      "publisher": "H2A",
      "title": "Présentation de la H2A",
      "url": "https://h2a-france.org/la-h2a/presentation-de-la-h2a/",
      "checkedAt": "2026-10-11"
    },
    "cncc-representation": {
      "id": "cncc-representation",
      "publisher": "CNCC",
      "title": "Représenter et faire rayonner la profession",
      "url": "https://www.cncc.fr/missions/representer-la-profession",
      "checkedAt": "2026-10-11"
    },
    "cncc-sacc-vocabulaire": {
      "id": "cncc-sacc-vocabulaire",
      "publisher": "CNCC",
      "title": "Services autres que la certification des comptes, présentation du guide 2018",
      "url": "https://doc.cncc.fr/docs/services-autres-que-la-certifica",
      "checkedAt": "2026-10-11"
    },
    "h2a-deontologie": {
      "id": "h2a-deontologie",
      "publisher": "H2A",
      "title": "Sécuriser les interventions, principes fondamentaux de comportement",
      "url": "https://h2a-france.org/normes/142282/",
      "checkedAt": "2026-10-11"
    },
    "dila-l821-35": {
      "id": "dila-l821-35",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, L821-35",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051559623",
      "checkedAt": "2026-10-06"
    },
    "dila-l821-31": {
      "id": "dila-l821-31",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, L821-31",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048524900",
      "checkedAt": "2026-10-06"
    },
    "dila-l821-53": {
      "id": "dila-l821-53",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, L821-53",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048525441",
      "checkedAt": "2026-10-06"
    },
    "dila-l820-1": {
      "id": "dila-l820-1",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, L820-1",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048535351",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-63": {
      "id": "dila-a821-63",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A821-63",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000050697008",
      "checkedAt": "2026-10-06"
    }
  }
} as const;
const entries: CandidateEntry[] = data.entries.map(e => ({ ...e, relatedTerms: [...e.relatedTerms], internalLinks: [...e.internalLinks], sourceIds: [...e.sourceIds] }));
const sources: Record<string, GlossarySource> = data.sources;
void entries; void sources;
