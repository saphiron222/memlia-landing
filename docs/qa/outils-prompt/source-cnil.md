[Aller au contenu principal](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative#main-content)

1. [Accueil](https://www.cnil.fr/fr/professionnel)
2. Les questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative


# Les questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative

18 juillet 2024

* * *

De nombreuses organisations envisagent de déployer ou d’utiliser des systèmes d’IA générative et s’interrogent sur les mesures à adopter. Cette foire aux questions (FAQ) leur fournit de premières réponses.

- Diminuer la taille de la police
- Augmenter la taille de la police

L'intelligence artificielle « générative » désigne la classe des systèmes capables de créer des contenus (texte, code informatique, images, musique, audio, vidéos, etc.). Ces systèmes sont qualifiables de systèmes d’IA à usage général lorsqu’ils permettent de réaliser tout un ensemble de tâches : c’est le cas notamment des systèmes qui reposent sur des [grands modèles de langage](https://www.cnil.fr/fr/definition/modele-de-langage "Définition : modèle de langage - Nouvelle fenêtre") (LLM). La conception de ces systèmes nécessite de vastes quantités de données provenant de différentes sources (internet, sources tierces sous licence, conversations générées par des formateurs humains, interactions avec les utilisateurs, données synthétiques, etc.).

Pour en savoir plus sur la conformité du développement de ces systèmes lorsqu’ils impliquent des données personnelles, la CNIL publie des [recommandations sur la manière de les concevoir en conformité avec le RGPD](https://www.cnil.fr/fr/les-fiches-pratiques-ia "Les fiches pratiques IA - Nouvelle fenêtre").

## 1\. Quels sont les bénéfices de l’IA générative ? Déplier

Les systèmes d’IA générative génèrent automatiquement des contenus dont la qualité a récemment progressé de manière spectaculaire : ils sont capables de créer des productions diversifiées, personnalisées et réalistes. Schématiquement, l’IA générative permet trois catégories de tâches :

- La génération de contenu à partir d’une instruction générale (telle que la création d’image, de texte ou de code informatique),
- Le retraitement de contenus préexistants (tel que la correction ou la traduction de textes),
- L’analyse de données (telle que le tri ou la synthèse de documents).

Son utilisation a généralement pour objectif d’accroître la créativité et la productivité des personnes qui l’utilisent, ou servir à construire d’autres systèmes.

* * *

## 2\. Quels sont les limitations et les risques des systèmes d’IA générative ? Déplier

Les modèles génératifs ne sont pas des bases de connaissance : ils obéissent à une logique probabiliste, ce qui signifie qu’ils ne génèrent que le résultat qui sera statistiquement le plus probable compte tenu des données sur lesquelles ils ont été entraînés. Ces systèmes peuvent générer des résultats inexacts qui peuvent, pourtant, paraître plausibles (on parle alors souvent d’hallucinations). Cela pourra survenir lorsqu’ils sont interrogés à propos d’informations qui ne sont pas présentes dans leurs données d’entraînement. C’est par exemple le cas sur des évènements postérieurs à leur développement, ces systèmes n’étant pas toujours reliés à des bases de connaissances actualisées.

Une confiance excessive dans les résultats produits par un système d'IA générative sans une vérification appropriée peut donc conduire à des décisions erronées ou à des conclusions incorrectes.

Ce fonctionnement complique la compréhension et l’explicabilité de ces systèmes (on parle alors d’effet « boîte noire »). Pour les fournisseurs de ces systèmes, cela complexifie la détection et la prévention d’éventuels biais. Pour leurs utilisateurs, cela pose de sérieux risques de confiance dans les résultats.

Enfin, les capacités de ces systèmes peuvent conduire à des usages abusifs qu’il convient d’anticiper et de prévenir, tels que la désinformation à travers la production d’hyper-trucages (ou _deepfakes_), la génération de codes malveillants, ou encore la fourniture d’informations permettant des activités illégales, dangereuses ou malveillantes (telles que la conception d’explosifs).

* * *

## 3\. Quelles sont les approches disponibles aujourd’hui pour utiliser l’IA générative (modèle sur étagère, fine-tuning, RAG, etc.) ? Déplier

La première question à se poser porte sur le type de modèle ou de système d’IA générative :

- **utiliser un système ou un modèle sur étagère**




Qu’il soit dit « propriétaire » (c’est-à-dire commercialisé par son fournisseur) ou en [source ouverte](https://www.cnil.fr/sites/cnil/files/2024-06/note_d_analyse_sur_les_pratiques_open_source_en_ia.pdf "Note d'analyse - Les pratiques open source en intelligence artificielle - PDF - Nouvelle fenêtre") (open source), un système ou modèle sur étagère peut être plus ou moins généraliste. Il peut par conséquent s’adapter plus ou moins bien à des tâches spécifiques. Dans certains cas, il est possible de l’orienter vers une tâche ou un contexte spécifique, par exemple au moyen de consignes préalables (ou _pre-prompt_), avant de générer la réponse principale. Ces consignes peuvent être intégrées au système ou fournies par l’utilisateur, et ne nécessitent pas de ressources particulières.




ou

- **développer son propre modèle d’IA générative**




Enfin, il est aussi possible de ne pas utiliser un modèle d’IA pré-entraîné mais d’entraîner son propre modèle, avant de l’intégrer à son système. Aujourd’hui, seul un nombre très limité d’acteurs est en mesure de réaliser ces opérations (compte tenu des ressources et compétences requises).




Ensuite, et quel que soit le type de modèle ou de système choisi, il est possible d’en améliorer les performances en recourant en options suivantes :

- **connecter le système à une base de connaissance (RAG)**




La génération augmentée de récupération ( _Retrieval Augmented Generation_ ou RAG) consiste à intégrer un mécanisme de recherche d'informations dans une base de données vectorisée (ou _embedding_). Elle permet de produire des réponses enrichies par des données externes, potentiellement plus spécifiques et plus faciles à actualiser que le modèle lui-même. Cette méthode requiert davantage de ressources et de compétences que le recours à un simple système ou modèle sur étagère, mais se montre plus facile à adapter et permet davantage de traçabilité des informations contenues dans les réponses.




et/ou

- **ajuster un modèle pré-entraîné sur des données spécifique ( _fine-tuning_)**




Le _fine-tuning_ consiste à modifier les [paramètres](https://www.cnil.fr/fr/definition/parametre-ia "Définition : paramètre IA - Nouvelle fenêtre") (poids) d’un modèle tout en conservant son architecture principale (par exemple celle d’un grand modèle de langue pré-entraîné dans certaines langues). Cette méthode permet d'améliorer ses performances dans un domaine donné ou pour des requêtes spécifiques. Elle requiert des ressources importantes, notamment en termes de capacités de calcul.

* * *

## 4\. Comment choisir son système d’IA générative ? Déplier

Il est recommandé de **partir de besoins concrets** pour choisir le système le plus adapté et de tenir compte des **risques encourus,** non seulement du fait des usages poursuivis mais aussi des limitations du système envisagé. Par exemple, faciliter la rédaction de certains contenus en mettant un agent conversationnel à la disposition de ses salariés présentera moins de risques que l’utilisation d’un système pour aider à la prise de décision à l’égard de clients, candidats ou citoyens. Le système, l’approche choisie, et le mode de déploiement choisis devraient ainsi faire l’objet d’un plus haut niveau d’exigence dans le second cas.

En fonction des usages envisagés et de leur sensibilité, il convient de vérifier :

- sa **sécurité générale**, par exemple s’assurer que l’outil est développé pour refuser de répondre à des requêtes malveillantes, toxiques ou illicites ;

- sa **pertinence pour le besoin spécifiquement identifié**, par exemple en privilégiant des systèmes limitant les hallucinations, en citant leurs sources, en filtrant les sorties, ou ayant été entraînés ou ajustés ( _fine-tunés_) sur une base de données de qualité et spécifique ;

- sa **robustesse**, par exemple en privilégiant les systèmes déjà testés et éprouvés pour les tâches envisagées ;

- L’absence de **biais éventuels**, par exemple de biais discriminatoires qui pourraient notamment résulter d’un manque de diversité des données d’entraînement ;

- sa **conformité aux règles applicables**, en prenant connaissance de sa licence d’utilisation ou des informations sur les données d’entrainement, qu’il s’agisse d’un modèle propriétaire ou en source ouverte.

Pour cela, le plus simple est généralement d’avoir accès à **la documentation du système et de demander, le cas échéant, des évaluations externes**. Dans ce dernier cas, si nécessaire et si réalisable, il peut être pertinent de conduire ou commander une évaluation sur mesure pour l’usage envisagé.

* * *

## 5\. Quel mode de déploiement privilégier (on premise, API, cloud) ?Déplier

Les systèmes d’IA générative peuvent être fournis « sur site » (« _on premise_ »), sur une infrastructure cloud hébergée ou à la requête via des API ( _Application Programming Interface_). Le choix d’un mode de déploiement dépend du cas d’usage et des données utilisées en entrée.

Pour des usages non confidentiels, l’utilisation d’un service grand public auquel l’accès est permis grâce à des adresses électroniques professionnelles dédiées pourra être envisagée **avec des garanties appropriées** (à condition d’éviter la création de compte avec des adresses électroniques personnelles et, le cas échéant, en désactivant la possibilité pour le fournisseur du système de réutiliser les données d’usage).

Si l’utilisation envisagée consiste à fournir des données personnelles (données des clients ou des collaborateurs) ou de la documentation sensible ou stratégique (par exemple pour le RAG), il semble généralement plus opportun et plus sécurisé de privilégier le déploiement de solutions « sur site » ( _on premise_) qui présentent l’avantage de limiter les risques d’extraction de données auprès d’un tiers (notamment détaillés dans les [recommandations de sécurité de l’ANSSI pour un système d’IA générative](https://cyber.gouv.fr/publications/recommandations-de-securite-pour-un-systeme-dia-generative "Recommandations de sécurité pour un système d’IA générative - ANSSI - Nouvelle fenêtre")).

Néanmoins, compte tenu du coût que représentent l’installation et l’opération d’un système « sur site », il sera souvent plus aisé de recourir à un système hébergé dans une infrastructure distante ( _cloud_ ou _off premise_). Dans ce cas, il sera nécessaire de sécuriser le recours à une infrastructure externe par le biais d’un [contrat de sous-traitance](https://www.cnil.fr/sites/cnil/files/atoms/files/rgpd-guide_sous-traitant-cnil.pdf "RGPD : un guide pour accompagner les sous-traitants - CNIL - Nouvelle fenêtre") avec l’hébergeur du système et, le cas échéant, avec le fournisseur du système d’IA

### système d’ia

Le règlement IA les définit comme suit : « un système automatisé conçu pour fonctionner à différents niveaux d'autonomie, qui peut faire preuve d'une capacité d'adaptation après son déploiement et qui, pour des objectifs explicites ou impli... [\> En savoir plus](https://www.cnil.fr/fr/definition/systeme-dia)

. Ce contrat devra bien préciser les périmètres de responsabilité et les accès autorisés aux données traitées. A cet égard, rien n’interdit à des entreprises de petite taille ou à collectivités territoriales disposant de ressources limitées de recourir à une infrastructure mutualisée, dès lors que les transferts de données sont encadrés et leur sécurité assurée.

De plus, si les données personnelles sont susceptibles d’être [transférées en dehors de l’Union européenne](https://www.cnil.fr/fr/transferer-des-donnees-hors-de-lue "Transférer des données hors de l'UE - Nouvelle fenêtre") (par exemple parce que l’infrastructure d’hébergement est située hors de l’UE ou qu’elle est opérée par un fournisseur non-européen), l’entité utilisatrice devra, en complément, encadrer leur traitement par leur destinataire

### destinataire

Personne habilitée à obtenir communication de données enregistrées dans un fichier ou un traitement en raison de ses fonctions.

.

Enfin, s’il est envisagé d’utiliser un système sous forme d’API, il faut souligner que la maîtrise du système est alors quasi exclusivement dans les mains du fournisseur. Il convient donc d’être particulièrement vigilant sur les données soumises au système d’IA, en évitant autant que possible la saisie de données personnelles. Il faut également apporter une attention particulière aux conditions contractuelles et notamment aux questions de transferts de données en dehors de l’UE.

* * *

## 6\. Comment mettre en œuvre et encadrer l’utilisation d’un système d’IA générative ?Déplier

La mise en œuvre de ce type de système doit être précédée d'une analyse des risques et d'une stratégie de gouvernance claire. En particulier, l’organisme décidant de déployer un système doit veiller à sa conformité au RGPD.

Quelle que soit l’utilisation envisagée, celui-ci doit notamment :

- **[s’interroger sur son rôle et celui du fournisseur vis-à-vis des traitements de données personnelles](https://www.cnil.fr/fr/determiner-la-qualification-juridique-des-fournisseurs-de-systemes-dia "Déterminer la qualification juridique des fournisseurs de systèmes d'IA - Nouvelle fenêtre"),** le cas échéant en passant un contrat de sous-traitance ou un accord de responsabilité conjointe avec ce dernier, voire en encadrant le transfert de données




### transfert de données





Toute communication, copie ou déplacement de données personnelles ayant vocation à être traitées dans un pays tiers à l’Union européenne.






en dehors de l’Union européenne comme précédemment évoqué ;

- **veiller à la sécurité des données qu’il fournit** dans le cadre du développement (par exemple pour le développement d’un modèle ajusté sur mesure) ou dans le cadre du déploiement (par exemple en décidant de s’opposer à la réutilisation des données d’usage par le fournisseur du système, voire à l’enregistrement de l’historique).




Pour en savoir plus : voir les [recommandations de sécurité de l’ANSSI pour un système d’IA générative](https://cyber.gouv.fr/publications/recommandations-de-securite-pour-un-systeme-dia-generative "Recommandations de sécurité pour un système d’IA générative - ANSSI - Nouvelle fenêtre").

Plus généralement, il est recommandé à tout organisme d’ **encadrer l’utilisation d’un système d’IA**

**### système d’ia**

**Le règlement IA les définit comme suit : « un système automatisé conçu pour fonctionner à différents niveaux d'autonomie, qui peut faire preuve d'une capacité d'adaptation après son déploiement et qui, pour des objectifs explicites ou impli... [\> En savoir plus](https://www.cnil.fr/fr/definition/systeme-dia)**

**générative par des politiques ou chartes internes, définissant clairement les usages autorisés et les usages interdits.**

En fonction du mode de déploiement retenu, il conviendra en particulier d’interdire la fourniture de certaines données confidentielles (par exemple couvertes par le secret industriel et commercial) ou personnelles.

Par exemple, lorsque les données sont susceptibles d’être réutilisées par le fournisseur (conformément à ses conditions générales d’utilisation), l’organisme utilisateur devra mener une analyse au cas par cas pour déterminer s’il doit ou non interdire la fourniture de toute donnée personnelle

### donnée personnelle

Une donnée personnelle est toute information se rapportant à une personne physique identifiée ou identifiable. Mais, parce qu’elles concernent des personnes, celles-ci doivent en conserver la maîtrise.

Une personne physique peut être identifiée&nb... [\> En savoir plus](https://www.cnil.fr/fr/definition/donnee-personnelle)

, ou seulement certaines catégories.

À l’inverse, de telles interdictions ne seront pas nécessaires dans le cas d’un déploiement sur site ( _on premise_) où aucune réutilisation des données par le fournisseur n’est possible.

Un cas intermédiaire pourra consister à ne permettre l’utilisation de ces systèmes que sur la base de données librement accessibles. Attention toutefois, [la réutilisation de ces données librement accessibles par le fournisseur du système d’IA n’est pas pour autant possible dans tous les cas](https://www.cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donn%C3%A9es "Assurer que le traitement est licite - en cas de réutilisation des données - Nouvelle fenêtre"). Ce dernier devra le déterminer au terme d’une analyse dédiée.

Outre le besoin d’intelligibilité et d’accessibilité de ces documents, il est recommandé de former les utilisateurs de façon adaptée et de mener des contrôles réguliers.

* * *

## 7\. Comment former et sensibiliser les utilisateurs finaux de ces systèmes ?Déplier

Dans le cas général, c’est l’organisme utilisateur qui engagera sa responsabilité légale en cas de mauvaise utilisation de l’IA par son personnel. **Il est donc recommandé de familiariser les utilisateurs finaux avec le fonctionnement et les limites de ces systèmes** (la manière dont sont produites les sorties, les éventuels transferts de données), **ainsi que les usages autorisés et les usages interdits.**

**Les utilisateurs finaux devraient être responsabilisés quant à l’usage qu’ils feront de ces outils**, en les incitant à vérifier les données fournies en entrée et la qualité des sorties (par exemple par des formations obligatoires préalables à l’utilisation de ces systèmes).

**S’agissant des données fournies en entrée du système (dans le prompt ou invite), les utilisateurs finaux ne devraient soumettre que des informations qu’ils sont autorisés à partager.** Par exemple, ne jamais partager d’informations confidentielles telles que des données personnelles, des données de l’entreprise ou de l’administration (en particulier lorsqu’elles sont couvertes par un secret comme le secret des affaires ou des obligations de déontologie) lors de l’utilisation d’un service grand public. L’organisme pourrait même prévoir des modèles d’entrée ou « _prompts types_ » directement accessibles dans l’outil pour inciter les utilisateurs finaux à réaliser des tâches bien identifiées et éprouvées.

**S’agissant des sorties générées par le système, les utilisateurs finaux devraient toujours porter un regard critique** et vérifier :

- **qu’elles sont exactes ou de bonne qualité**(en particulier en l’absence de sources, par exemple à travers des recherches contrefactuelles) ;

- **qu’il ne s’agit pas d’un plagiat** (par exemple, en cas de soupçon élevé de régurgitation




### régurgitation





Dans le domaine de l’IA générative, la régurgitation est la situation dans laquelle un modèle génère des données très proches de ses données d’entraînement, de manière attendue (lorsque le modèle d’IA est conçu à cette fin),  inattendue ou ... [\> En savoir plus](https://www.cnil.fr/fr/definition/regurgitation)






d’une œuvre protégée, en essayant de retrouver l’œuvre source) ;

- **qu’elles n’engendrent pas de biais susceptibles de mener à des discriminations** (par exemple en reproduisant un stéréotype).

Ils devraient enfin être alertés sur le risque de perte de confiance ou de compétence associé à une utilisation excessive du système (également appelée « biais d’automatisation »). Afin d’éviter toute perte de contrôle humain, une **bonne pratique consiste à ne jamais reproduire telles quelles les sorties de ces systèmes** y compris lorsqu’ils intègrent des filtres censés prévenir la génération de contenus inappropriés (puisque ces systèmes ne sont jamais infaillibles).

À cet égard, l’intégration de briques d’IA générative dans un système d’information (SI) devrait être pensée avec des éléments de design informant clairement les utilisateurs de l’origine de la proposition, leur rappelant qu’il leur revient de ne pas prendre « telle quelle » la proposition. Par exemple, le système peut proposer pour chaque question au moins deux réponses, ce qui permet à l’opérateur humain de sélectionner les éléments pertinents de chaque réponse pour consolider la sienne.

* * *

## 8\. Quelle gouvernance de ces systèmes mettre en œuvre ? Déplier

Le [délégué à la protection des données (DPO)](https://www.cnil.fr/fr/le-delegue-la-protection-des-donnees-dpo "Le délégué à la protection des données - Nouvelle fenêtre") peut utilement jouer un rôle à cet égard dès lors qu’il est déjà concerné par les enjeux de protection des données afférant à ces systèmes, le cas échéant en articulation avec le responsable de la sécurité des systèmes d’information (RSSI).

Cette désignation peut également permettre de **proposer aux utilisateurs finaux un point de contact pour remonter des problèmes ou des difficultés d’ordre éthique.** Si les problèmes le justifient, le référent devrait pouvoir alerter l’organisme sur les risques pour envisager une évolution du système ou demander au fournisseur du système des modifications lorsqu’il est le seul à pouvoir les prendre en compte.

En fonction de la sensibilité des usages, il peut de plus être pertinent d’envisager des **contrôles réguliers** pour s’assurer du bon respect des règles et bonnes pratiques préconisées. En tout état de cause, lors des premiers mois et années de l’utilisation des IA, il est recommandé de **recueillir régulièrement l’avis des utilisateurs finaux** sur l’utilité et les limites du système. Cette enquête peut aussi être étendue aux éventuels interlocuteurs de l’organisme susceptibles d’être impactés par l’usage de l’IA.

**Enfin, dans des cas d’usages particulièrement sensibles, il est recommandé d’envisager la création d’un comité éthique ou la désignation d’un référent pour garantir le respect des règles et bonnes pratiques identifiées.** En effet, bénéficier d’un regard externe aux équipes opérationnelles permet d’identifier certains risques qui peuvent être ignorés ou minimisés sinon (biais, effets indésirables, etc.). Ce comité ou ce référent devrait donner un avis formel en amont du déploiement du système d’IA

### système d’ia

Le règlement IA les définit comme suit : « un système automatisé conçu pour fonctionner à différents niveaux d'autonomie, qui peut faire preuve d'une capacité d'adaptation après son déploiement et qui, pour des objectifs explicites ou impli... [\> En savoir plus](https://www.cnil.fr/fr/definition/systeme-dia)

ou d’une nouvelle utilisation et être régulièrement informé, par exemple à l’occasion d’un bilan annuel.

* * *

## 9\. Comment s’assurer de la conformité de l’utilisation d’un système d’IA générative au RGPD ? Déplier

En ce qui concerne la conformité au RGPD, la CNIL a publié des recommandations sur la constitution de bases de données et l’entraînement de systèmes d’IA. La plupart des systèmes d’IA générative ont été configurés en utilisant des données personnelles : **en tant qu’utilisateur ou intégrateur d’un système d’IA**

**### système d’ia**

**Le règlement IA les définit comme suit : « un système automatisé conçu pour fonctionner à différents niveaux d'autonomie, qui peut faire preuve d'une capacité d'adaptation après son déploiement et qui, pour des objectifs explicites ou impli... [\> En savoir plus](https://www.cnil.fr/fr/definition/systeme-dia)**

**générative, il vous revient donc d’interroger le fournisseur sur la conformité de son système au RGPD et le respect de ces recommandations.**

Ces recommandations s’appliquent également à tout déployeur de système d’IA qui traiterait des données personnelles dans le cadre de son développement, de sa maintenance ou de son amélioration.

Par exemple, elles s’appliquent :

- au déployeur qui affine (« _fine-tunes_ ») le système avec ses propres données, celui-ci en devenant alors responsable, y compris en tant que fournisseur au titre du règlement sur l’IA, mais seulement pour ce qui concerne cet affinage ( _fine-tuning_).

- le déployeur qui choisit de connecter le système à sa propre base de connaissance (RAG) sera lui aussi responsable de son traitement lorsqu’elle contient des données personnelles.

D’autres recommandations seront publiées dans les prochains mois par la CNIL. Dans l’attente de leur publication, il est recommandé d’associer le délégué à la protection des données (DPO), et le cas échéant, de [réaliser une analyse d’impact relative à la protection des données (AIPD)](https://www.cnil.fr/fr/RGPD-analyse-impact-protection-des-donnees-aipd "Analyse d’impact de protection des données - Nouvelle fenêtre").

* * *

## 10\. Comment s’assurer de la conformité de l’utilisation d’un système d’IA générative au règlement européen sur l’IA ? Déplier

[Le règlement sur l’intelligence artificielle entre en vigueur à compter du 1er août 2024](https://www.cnil.fr/fr/entree-en-vigueur-du-reglement-europeen-sur-lia-les-premieres-questions-reponses-de-la-cnil "Entrée en vigueur du règlement européen sur l’IA : les premières questions-réponses de la CNIL - Nouvelle fenêtre"). Il s’intéresse aux risques que les systèmes d’IA font peser pour la santé, la sécurité, et les droits fondamentaux des personnes affectées. Le règlement classe les systèmes en quatre niveaux de risque en établissant des règles différentes pour chacun d'entre eux (allant de l’interdiction pure et simple à des exigences de transparence lors de leur utilisation).

![Pyramide des risques - Règlement européen sur l'IA](https://www.cnil.fr/sites/default/files/2026-08/pyramide_des_risques_reglement_ia_fr.jpg)

L’utilisation de systèmes d’IA générative, lorsqu’ils ne sont pas intégrés à un système à haut-risque (qui font alors l’objet d’exigences supplémentaires), est encadrée au titre des systèmes d’IA à usage général justifiant des exigences de transparence accrues (Chapitre IV), ainsi que les modèles sous-jacents au titre des modèles d’IA à usage général (Chapitre V).

**Le règlement sur l’IA prévoit notamment que les organismes qui déploient de tels systèmes soient transparents avec les utilisateurs quant au fait qu’ils y ont recours.** Les systèmes conçus pour agir directement avec des personnes doivent ainsi être développés de manière à ce que ces dernières soient informées de ce qu’elles interagissent avec un système d’IA

### système d’ia

Le règlement IA les définit comme suit : « un système automatisé conçu pour fonctionner à différents niveaux d'autonomie, qui peut faire preuve d'une capacité d'adaptation après son déploiement et qui, pour des objectifs explicites ou impli... [\> En savoir plus](https://www.cnil.fr/fr/definition/systeme-dia)

. Les utilisateurs de ces systèmes doivent quant à eux indiquer au public que leurs hyper-trucages ( _deepfakes_) ou les textes qu’ils publient ont été générés par ce moyen.

* * *

Texte reference

## Pour approfondir

- [Tous les contenus de la CNIL sur l’intelligence artificielle](https://www.cnil.fr/fr/intelligence-artificielle-ia "Tous les contenus de la CNIL sur l’intelligence artificielle")
- [IA : comment se mettre en conformité ?](https://www.cnil.fr/fr/ia-comment-se-mettre-en-conformite "IA : comment se mettre en conformité ?")
- [FAQ - Version anglaise](https://www.cnil.fr/en/cnils-qa-use-generative-ai-systems "FAQ - Version anglaise")

- [#Intelligence artificielle (IA)](https://www.cnil.fr/fr/tag/Intelligence%2Bartificielle%2B%28IA%29)
- [#Conformité](https://www.cnil.fr/fr/tag/Conformit%C3%A9)
- [#RGPD](https://www.cnil.fr/fr/tag/RGPD)
- [#RIA](https://www.cnil.fr/fr/tag/RIA)

#### Ceci peut également vous intéresser ...

[![EDPB](https://www.cnil.fr/sites/default/files/styles/interest_image/public/2026-09/logo_edpb_2026.png?itok=Epq4bN70)\\
\\
Amendes RGPD et interaction avec le règlement sur les services numériques : retour sur la ...\\
\\
\\
23 septembre 2026](https://www.cnil.fr/fr/pleniere-cepd-amendes-reglement-services-numeriques) [CEPD](https://www.cnil.fr/fr/tag/CEPD)

[![Photographie d'une salle de classe, face au professeur, les élèves de dos](https://www.cnil.fr/sites/default/files/styles/interest_image/public/2026-08/bilan_actions_oise_et_ressources_pour_cm2.jpg?itok=HiQl34Nw)\\
\\
Sensibiliser les élèves de CM2 à la protection des données\\
\\
\\
27 août 2026](https://www.cnil.fr/fr/sensibiliser-les-eleves-de-cm2-la-protection-des-donnees) [Éducation](https://www.cnil.fr/fr/tag/%C3%89ducation)

[![Illustration d'un arbre généalogique](https://www.cnil.fr/sites/default/files/styles/interest_image/public/2026-08/genealogie-ia-mise-a-jour_1.png?itok=ngsqchVF)\\
\\
IA : la CNIL met à jour son outil de traçabilité des modèles publiés en source ouverte\\
\\
\\
26 août 2026](https://www.cnil.fr/fr/ia-la-cnil-met-jour-son-outil-de-tracabilite-des-modeles-publies-en-source-ouverte) [Intelligence artificielle (IA)](https://www.cnil.fr/fr/tag/Intelligence%2Bartificielle%2B%28IA%29)

Gestion de vos préférences sur les cookies (témoins de connexion)

Fermer

Gestion de vos préférences sur les cookies (témoins de connexion)

En autorisant ces services tiers, vous acceptez le dépôt et la lecture de cookies et l'utilisation de technologies de suivi nécessaires à leur bon fonctionnement.

Préférences pour tous les services

Tout accepter  Tout refuser

- Cookies obligatoires

  - Ce site utilise des cookies nécessaires à son bon fonctionnement qui ne peuvent pas être désactivés.
- APIs

Les APIs permettent de charger des scripts : géolocalisation, moteurs de recherche, traductions, ...

- Autre

Services visant à afficher du contenu web.

- Commentaires

Les gestionnaires de commentaires facilitent le dépôt de vos commentaires et luttent contre le spam.

- Consentement spécifique aux services Google

Google peut utiliser vos données pour la mesure d'audience, la performance publicitaire ou pour vous proposer des annonces personnalisées.

- Mesure d'audience

Les services de mesure d'audience permettent de générer des statistiques de fréquentation utiles à l'amélioration du site.

  - Matomo

    undefined \- Ce service n'a déposé aucun cookie.

    [En savoir plus](https://tarteaucitron.io/service/matomohightrack/ "En savoir plus : Détail des cookies Matomo sur notre site (nouvelle fenêtre)") \- [Voir le site officiel](https://matomo.org/faq/general/faq_146/ "Voir le site officiel Matomo (nouvelle fenêtre)")

     Autoriser  Interdire
- Régies publicitaires

Les régies publicitaires permettent de générer des revenus en commercialisant les espaces publicitaires du site.

- Réseaux sociaux

Les réseaux sociaux permettent d'améliorer la convivialité du site et aident à sa promotion via les partages.

- Support

Les services de support vous permettent d'entrer en contact avec l'équipe du site et d'aider à son amélioration.

- Vidéos

Les services de partage de vidéo permettent d'enrichir le site de contenu multimédia et augmentent sa visibilité.

- Ce site n'utilise aucun cookie nécessitant votre consentement.

undefined

Ce site utilise des cookies et vous donne le contrôle sur ceux que vous souhaitez activer  Tout accepter  Tout refuser  Personnaliser