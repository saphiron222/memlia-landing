import type { GlossaryEntry, GlossarySource } from '../../../../src/data/glossary';
type CandidateEntry = Omit<GlossaryEntry, 'sourceCheckedAt'> & { sourceCheckedAt: GlossaryEntry['sourceCheckedAt'] | '2026-10-11' };
const data = {
  "entries": [
    {
      "term": "Éléments collectés en audit",
      "anchor": "elements-collectes-audit",
      "definition": "Les éléments collectés sont les informations recueillies par le commissaire aux comptes pour aboutir aux conclusions sur lesquelles il fonde son opinion. Ils peuvent provenir de l’audit en cours, d’audits précédents, d’autres interventions ou de l’acceptation et du maintien de la mission.",
      "context": "La NEP 500 distingue la collecte d’informations et l’appréciation de leur caractère suffisant et approprié au regard des assertions vérifiées. Une pièce reçue entre dans les travaux ; sa seule présence ne démontre pas que les éléments permettent de fonder une opinion.",
      "exampleFictitious": "Exemple fictif : l’équipe rassemble une facture, une preuve de livraison et une réponse du client pour examiner une vente. Elle conserve l’origine de chaque pièce et présente une contradiction au CAC, sans transformer la réception des documents en conclusion d’audit.",
      "commonConfusion": "Éléments collectés ne signifie pas automatiquement éléments suffisants et appropriés. La quantité de documents ne remplace pas leur pertinence et leur fiabilité ; une incohérence entre pièces conduit le CAC à déterminer les procédures complémentaires nécessaires.",
      "automationBoundary": "Nous préparons l’inventaire, les références, les doublons proposés et les pièces manquantes selon la règle écrite. L’équipe valide le rattachement et garde ses commentaires. Nous signalons les contradictions ; le CAC apprécie le caractère probant, décide des diligences et conclut. Les saisies du cabinet ne sont jamais écrasées.",
      "relatedTerms": [
        "caractere-probant",
        "confirmation-tiers-audit",
        "controles-substance"
      ],
      "id": "elements-collectes-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-500",
        "dila-a821-74"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-500": "éléments",
        "dila-a821-74": "éléments"
      }
    },
    {
      "term": "Caractère probant",
      "anchor": "caractere-probant",
      "definition": "Le caractère probant des éléments collectés s’apprécie au regard de leur capacité à apporter des preuves ou des présomptions sur les assertions vérifiées. Pour fonder l’opinion, ces éléments doivent être suffisants en quantité et appropriés en qualité, c’est-à-dire pertinents et fiables.",
      "context": "La NEP 500 relie la quantité nécessaire au risque d’anomalies significatives et à la qualité des éléments. Leur fiabilité dépend de leur origine, de leur nature et des circonstances de leur collecte. Le CAC garde un esprit critique devant les indices qui remettent leur validité en cause.",
      "exampleFictitious": "Exemple fictif : deux états présentent le même solde, mais proviennent de la même extraction. L’équipe indique cette origine commune au CAC au lieu de compter deux corroborations indépendantes. Le CAC apprécie les éléments et les travaux à compléter.",
      "commonConfusion": "Une concordance de montants, un document externe ou une réponse reçue ne suffit pas à garantir le caractère probant. Les principes de fiabilité de la NEP 500 sont appréciés dans les circonstances de la mission ; en cas de doute ou d’incohérence, le CAC approfondit ses investigations.",
      "automationBoundary": "Nous préparons les rapprochements, l’origine des données et les écarts non expliqués. L’équipe valide les rattachements et conserve ses observations. Aucun score automatique ne déclare une preuve suffisante : l’appréciation du caractère probant, les investigations et la conclusion restent au CAC. Ses saisies ne sont jamais écrasées.",
      "relatedTerms": [
        "elements-collectes-audit",
        "confirmation-tiers-audit",
        "procedures-alternatives-audit"
      ],
      "id": "caractere-probant",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-500",
        "dila-a821-74"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-500": "éléments",
        "dila-a821-74": "éléments"
      }
    },
    {
      "term": "Demande de confirmation des tiers (circularisation)",
      "anchor": "confirmation-tiers-audit",
      "definition": "La demande de confirmation des tiers consiste à obtenir d’un tiers une déclaration directement adressée au commissaire aux comptes sur une ou plusieurs informations. Circularisation est le terme de pratique associé à cette technique, pas une seconde procédure à créer.",
      "context": "La NEP 505 distingue la demande fermée, qui sollicite l’accord sur une information fournie, et la demande ouverte, qui demande au tiers de fournir l’information. Le CAC maîtrise la sélection des tiers, la rédaction, l’envoi et la réception des réponses, en fonction des assertions concernées.",
      "exampleFictitious": "Exemple fictif : une campagne clients affiche séparément « réponse reçue », « rapprochement préparé » et « appréciation du CAC attendue ». Une différence entre la réponse et le solde du dossier reste une exception ; aucun statut de réception ne clôt le contrôle.",
      "commonConfusion": "Une réponse concordante ne vaut pas automatiquement validation de toutes les assertions. Une confirmation peut apporter des éléments sur l’existence d’une créance sans généralement renseigner son évaluation. L’absence de réponse conduit à des procédures alternatives, pas à une confirmation tacite.",
      "automationBoundary": "Nous préparons le tableau de suivi, les projets de demandes et les rapprochements. Le CAC garde la maîtrise des destinataires, du texte, de l’envoi et de la réception ; l’équipe valide chaque action dans ce cadre. Les réponses originales et saisies du cabinet restent intactes. Le CAC juge les écarts, les alternatives et le caractère probant des résultats.",
      "relatedTerms": [
        "procedures-alternatives-audit",
        "caractere-probant",
        "elements-collectes-audit"
      ],
      "id": "confirmation-tiers-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-505",
        "dila-a821-76"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-505": "demande",
        "dila-a821-76": "demande"
      }
    },
    {
      "term": "Procédures alternatives en audit",
      "anchor": "procedures-alternatives-audit",
      "definition": "Dans le cadre des confirmations de tiers, les procédures alternatives sont les travaux d’audit mis en œuvre par le CAC pour collecter les éléments nécessaires aux assertions contrôlées lorsqu’une demande reste sans réponse ou lorsque le refus de la direction est considéré comme fondé.",
      "context": "La NEP 505 prévoit des procédures supplémentaires si la confirmation et les alternatives n’apportent pas d’éléments suffisants et appropriés. Le CAC évalue les résultats de l’ensemble des travaux. Un refus non fondé de la direction relève d’un traitement distinct, avec des conséquences éventuelles dans son rapport.",
      "exampleFictitious": "Exemple fictif : un client ne répond pas à une demande. Sur instruction de l’équipe, le suivi rassemble une facture, une preuve de livraison et un règlement postérieur. Le CAC choisit les travaux pertinents pour l’assertion visée et apprécie leurs résultats ; cette liste n’est pas une recette universelle.",
      "commonConfusion": "Une relance administrative n’est pas à elle seule une procédure alternative apportant les éléments nécessaires. Une alternative ne garantit pas que le contrôle est achevé : si les éléments restent insuffisants ou inappropriés, le CAC met en œuvre des procédures supplémentaires.",
      "automationBoundary": "Nous repérons les demandes sans réponse, préparons les pièces demandées et suivons les travaux prescrits. L’équipe valide la demande et conserve les éléments examinés. Nous n’inventons ni une procédure de remplacement ni une conclusion ; le CAC décide des alternatives, des compléments et de l’appréciation finale. Ses saisies restent intactes.",
      "relatedTerms": [
        "confirmation-tiers-audit",
        "caractere-probant",
        "controles-substance"
      ],
      "id": "procedures-alternatives-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-505",
        "dila-a821-76"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-505": "alternatives",
        "dila-a821-76": "alternatives"
      }
    },
    {
      "term": "Procédures analytiques (revue analytique)",
      "anchor": "procedures-analytiques",
      "definition": "Les procédures analytiques apprécient les informations financières à partir de leurs corrélations avec d’autres informations et de l’analyse des variations significatives ou des tendances inattendues. Revue analytique est un alias de pratique ; un tableau de variations n’épuise pas cette technique d’audit.",
      "context": "La NEP 520 prévoit leur emploi lors de la prise de connaissance et de l’évaluation des risques, puis lors de la revue de cohérence d’ensemble en fin d’audit. Elles peuvent aussi servir de procédures analytiques de substance : les montants ou ratios attendus et les écarts acceptables sont alors déterminés dans le cadre des travaux.",
      "exampleFictitious": "Exemple fictif : le tableau rapproche les ventes et les volumes livrés, avec une comparaison à l’exercice précédent. Il isole un compte nouveau et une variation inexpliquée. L’équipe vérifie les données ; le CAC apprécie la relation attendue et les investigations nécessaires.",
      "commonConfusion": "Un calcul de pourcentage ou l’absence de variation n’est pas une conclusion d’audit. Une procédure analytique de substance suppose des attentes et des écarts acceptables ; des variations ou incohérences mises en évidence conduisent le CAC à déterminer les procédures pour les élucider.",
      "automationBoundary": "Nous préparons les comparatifs, les calculs et la liste des bases absentes ou non comparables. L’équipe valide les correspondances et ses explications ne sont jamais remplacées. Le CAC fixe les attentes et écarts acceptables, apprécie les données et décide des investigations ; une variation inexpliquée reste ouverte.",
      "relatedTerms": [
        "controles-substance",
        "caractere-probant",
        "elements-collectes-audit"
      ],
      "id": "procedures-analytiques",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-520",
        "dila-a821-77"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-520": "procédures",
        "dila-a821-77": "procédures"
      }
    },
    {
      "term": "Tests de procédures",
      "anchor": "tests-procedures",
      "definition": "Tests de procédures désigne ici le terme de pratique relié aux tests sur les contrôles de la NEP 330 révisée : des procédures conçues pour évaluer l’efficacité des contrôles de l’entité qui visent à prévenir, ou à détecter et corriger, les anomalies significatives au niveau des assertions.",
      "context": "Dans cette version de la NEP 330, le CAC réalise des tests sur les contrôles lorsqu’il prévoit de s’appuyer sur les contrôles pertinents ou lorsque les procédures de substance seules ne permettent pas de collecter les éléments suffisants et appropriés. Les tests ne se limitent pas à des demandes d’information.",
      "exampleFictitious": "Exemple fictif : pour un contrôle d’autorisation des achats, l’équipe prépare les opérations sélectionnées et les traces d’autorisation disponibles. L’auditeur examine la mise en œuvre effective du contrôle et consigne les déviations ; un document décrivant la procédure n’est pas présenté comme preuve de son efficacité.",
      "commonConfusion": "Connaître une procédure ne démontre pas son fonctionnement efficace. De même, l’absence d’anomalie relevée par des procédures de substance ne constitue pas un élément suffisant et approprié pour justifier l’efficacité des contrôles relatifs à l’assertion considérée.",
      "automationBoundary": "Nous préparons les sélections selon les paramètres approuvés, les références et les traces disponibles. L’équipe valide le périmètre et réalise les tests prescrits. Les déviations et commentaires saisis restent intacts ; le CAC apprécie l’efficacité, les conséquences et les travaux complémentaires, sans verdict automatique.",
      "relatedTerms": [
        "controles-substance",
        "sondage-audit",
        "selection-elements-specifiques"
      ],
      "id": "tests-procedures",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-330",
        "dila-a821-73"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-330": "contrôles",
        "dila-a821-73": "contrôles"
      }
    },
    {
      "term": "Contrôles de substance",
      "anchor": "controles-substance",
      "definition": "Contrôles de substance renvoie ici aux procédures de substance de la NEP 330 révisée. Ces procédures d’audit sont mises en œuvre pour détecter les anomalies significatives au niveau des assertions ; elles incluent les tests de détail et les procédures analytiques de substance.",
      "context": "Un test de détail contrôle un élément individuel ; une procédure analytique de substance repose sur des montants ou ratios attendus et des écarts acceptables. Le CAC détermine la nature, le calendrier et l’étendue des procédures en les reliant aux risques auxquels elles répondent.",
      "exampleFictitious": "Exemple fictif : l’équipe prépare les pièces d’une vente sélectionnée pour un test de détail et, séparément, un rapprochement entre ventes et volumes. Le CAC détermine l’objectif de chaque procédure et ne conclut pas sur la seule concordance d’un total.",
      "commonConfusion": "Une procédure de substance vise la détection d’anomalies au niveau des assertions ; un test sur les contrôles vise l’efficacité des contrôles de l’entité. Une absence d’anomalie dans les premières ne démontre pas l’efficacité des seconds.",
      "automationBoundary": "Nous préparons les données, les références et les calculs définis par la règle écrite. L’équipe valide les paramètres et exécute les contrôles prescrits. Le CAC apprécie les éléments et conclut ; aucune sortie n’atteste seule l’absence d’anomalie. Les travaux, observations et décisions saisis restent intacts.",
      "relatedTerms": [
        "tests-procedures",
        "procedures-analytiques",
        "caractere-probant"
      ],
      "id": "controles-substance",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-330",
        "dila-a821-73"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-330": "procédures",
        "dila-a821-73": "procédures"
      }
    },
    {
      "term": "Sondage en audit",
      "anchor": "sondage-audit",
      "definition": "Un sondage donne à tous les éléments d’une population une chance d’être sélectionnés. Selon la NEP 530, les techniques de sélection d’échantillons peuvent être statistiques ou non statistiques ; le sondage se distingue de la sélection d’éléments spécifiques.",
      "context": "Le CAC détermine les méthodes appropriées de sélection sur la base de son jugement professionnel et des caractéristiques de la population. Lorsqu’il sélectionne par sondage, il tire du contrôle des éléments une conclusion sur toute la population et apprécie la nature, la cause et les conséquences des anomalies relevées.",
      "exampleFictitious": "Exemple fictif : l’équipe prépare une population bornée d’opérations et exécute la sélection prescrite par le CAC. Elle conserve la population, la méthode, les paramètres et le résultat. Le CAC contrôle les éléments retenus et apprécie les conséquences des anomalies pour la population.",
      "commonConfusion": "Retenir seulement les opérations inhabituelles ou dépassant un montant choisi relève d’une sélection spécifique, pas à lui seul d’un sondage. Couvrir une forte part des montants ne donne pas à chaque élément une chance de sélection et ne justifie pas une conclusion automatique sur toute la population.",
      "automationBoundary": "Nous préparons la population et exécutons la méthode et les paramètres validés, avec une trace reproductible. L’équipe valide les données et la sélection avant les travaux. Le CAC choisit la méthode, l’étendue et la portée des conclusions ; nous signalons un périmètre incertain et conservons toutes ses saisies.",
      "relatedTerms": [
        "population-audit",
        "selection-elements-specifiques",
        "tests-procedures"
      ],
      "id": "sondage-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-530",
        "dila-a821-78"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-530": "sondage",
        "dila-a821-78": "sondage"
      }
    },
    {
      "term": "Population en audit",
      "anchor": "population-audit",
      "definition": "La population est l’ensemble des données à partir desquelles le CAC sélectionne un échantillon et sur lesquelles il souhaite parvenir à une conclusion. Selon la NEP 530, elle peut notamment comprendre tous les éléments d’un solde de compte ou d’une catégorie d’opérations.",
      "context": "Les caractéristiques de la population orientent le choix de la méthode de sélection. Lorsqu’elle provient d’informations produites par l’entité pour les procédures d’audit, le CAC collecte aussi des éléments concernant l’exactitude et l’exhaustivité de ces informations, conformément à la NEP 500.",
      "exampleFictitious": "Exemple fictif : une extraction de ventes porte un filtre de période qui exclut les écritures de clôture. Le tableau décrit ce filtre et les lignes présentes. L’équipe demande de vérifier le périmètre avant de sélectionner ; le fichier reçu n’est pas rebaptisé population complète.",
      "commonConfusion": "Le fichier disponible n’est pas nécessairement la population sur laquelle le CAC veut conclure. Une sélection réalisée sur des informations incomplètes ne supprime pas la nécessité de collecter des éléments sur leur exactitude et leur exhaustivité.",
      "automationBoundary": "Nous décrivons les filtres, sources, périodes, doublons et rapprochements de l’extraction. L’équipe valide le périmètre et les exceptions avant toute sélection. En cas de filtre inconnu ou de données manquantes, la préparation s’arrête et nomme le doute. Le CAC apprécie les données et la portée de ses travaux ; ses saisies restent intactes.",
      "relatedTerms": [
        "sondage-audit",
        "selection-elements-specifiques",
        "elements-collectes-audit"
      ],
      "id": "population-audit",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-530",
        "dila-a821-78",
        "h2a-nep-500",
        "dila-a821-74"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-530": "population",
        "dila-a821-78": "population",
        "h2a-nep-500": "informations",
        "dila-a821-74": "informations"
      }
    },
    {
      "term": "Sélection d’éléments spécifiques",
      "anchor": "selection-elements-specifiques",
      "definition": "La sélection d’éléments spécifiques est une méthode par laquelle le CAC choisit des éléments ciblés au sein d’une population. La NEP 530 cite notamment la sélection au-dessus d’un montant qu’il fixe pour couvrir une large proportion en valeur, ou celle d’éléments inhabituels par leur importance ou leur nature.",
      "context": "Le CAC choisit cette méthode selon sa connaissance de l’entité, de son environnement et son évaluation des risques. Il peut employer une ou plusieurs méthodes de sélection, puis apprécie si les résultats permettent de conclure sur le caractère suffisant et approprié des éléments collectés.",
      "exampleFictitious": "Exemple fictif : le CAC prescrit de préparer les opérations d’une nature inhabituelle et celles dépassant le montant qu’il a retenu. Le tableau conserve les critères et montre aussi les éléments non sélectionnés. L’équipe valide la liste sans l’appeler échantillon représentatif par défaut.",
      "commonConfusion": "Une sélection ciblée n’est pas un sondage donnant une chance de sélection à tous les éléments. La NEP 530 rattache au sondage la conclusion tirée du contrôle des éléments sur toute la population ; une couverture élevée en valeur ne suffit pas à transférer automatiquement ce raisonnement à une sélection spécifique.",
      "automationBoundary": "Nous appliquons les critères approuvés et présentons les éléments retenus et écartés, sans modifier les seuils ni retirer les exceptions à l’insu de l’équipe. Elle valide la liste. Le CAC définit la méthode et apprécie la portée des résultats, les anomalies et les compléments ; ses observations restent intactes.",
      "relatedTerms": [
        "sondage-audit",
        "population-audit",
        "controles-substance"
      ],
      "id": "selection-elements-specifiques",
      "nature": "Professionnelle",
      "owner": "Pôle audit CAC",
      "author": "Memlia",
      "editorialReviewer": "Équipe éditoriale Memlia",
      "businessReviewer": null,
      "reviewedAt": null,
      "sourceCheckedAt": "2026-10-11",
      "nextReviewAt": "2027-03-13",
      "sourceIds": [
        "h2a-nep-530",
        "dila-a821-78"
      ],
      "routeDecision": "anchor",
      "status": "preview-only",
      "internalLinks": [
        {
          "label": "vérifier une réponse IA en comptabilité, méthode EC",
          "href": "/blog/verifier-reponse-ia-comptabilite"
        },
        {
          "label": "préparer des données confidentielles pour une IA, contexte EC",
          "href": "/blog/ia-comptabilite-confidentialite-donnees"
        }
      ],
      "motsSources": {
        "h2a-nep-530": "sélection",
        "dila-a821-78": "sélection"
      }
    }
  ],
  "sources": {
    "h2a-nep-500": {
      "id": "h2a-nep-500",
      "publisher": "H2A",
      "title": "NEP 500 - Caractère probant des éléments collectés",
      "url": "https://h2a-france.org/normes/caractere-probant-des-elements-collectes/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-505": {
      "id": "h2a-nep-505",
      "publisher": "H2A",
      "title": "NEP 505 - Demandes de confirmation des tiers",
      "url": "https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-520": {
      "id": "h2a-nep-520",
      "publisher": "H2A",
      "title": "NEP 520 - Procédures analytiques",
      "url": "https://h2a-france.org/normes/procedures-analytiques/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-530": {
      "id": "h2a-nep-530",
      "publisher": "H2A",
      "title": "NEP 530 - Sélection des éléments à contrôler",
      "url": "https://h2a-france.org/normes/selection-des-elements-a-controler/",
      "checkedAt": "2026-10-11"
    },
    "h2a-nep-330": {
      "id": "h2a-nep-330",
      "publisher": "H2A",
      "title": "NEP 330 - Procédures d’audit mises en œuvre par le commissaire aux comptes à l’issue de sa prise de connaissance de l’entité et de son environnement et de son évaluation du risque d’anomalies significatives dans les comptes",
      "url": "https://h2a-france.org/normes/procedures-daudit-mises-en-oeuvre-par-le-commissaire-aux-comptes-a-lissue-de-son-evaluation-des-risques/",
      "checkedAt": "2026-10-11"
    },
    "dila-a821-73": {
      "id": "dila-a821-73",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-73",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054151024",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-74": {
      "id": "dila-a821-74",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-74",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048882102",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-76": {
      "id": "dila-a821-76",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-76",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048881589",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-77": {
      "id": "dila-a821-77",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-77",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054151028",
      "checkedAt": "2026-10-06"
    },
    "dila-a821-78": {
      "id": "dila-a821-78",
      "publisher": "Légifrance — DILA/DINUM",
      "title": "Code de commerce, A.821-78",
      "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054151032",
      "checkedAt": "2026-10-06"
    }
  }
} as const;
const entries: CandidateEntry[] = data.entries.map(e => ({ ...e, relatedTerms: [...e.relatedTerms], internalLinks: [...e.internalLinks], sourceIds: [...e.sourceIds] }));
const sources: Record<string, GlossarySource> = data.sources;
void entries; void sources;
