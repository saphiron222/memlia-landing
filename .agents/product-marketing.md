# Charte de message et contexte marketing Memlia

Document version : v3 — 17 septembre 2026 (la v2 du 15/09/2026 reste lisible dans git). **Ce document fait foi pour toute surface publique** : site, blog, LinkedIn, devis, prise de parole. Une phrase qui le contredit se corrige ; une phrase qu'il ne couvre pas se discute ici avant d'être publiée. Les skills marketing (copywriting, copy-editing, cro, marketing-psychology, li-*) le lisent avant d'écrire.

## 1. L'angle : ce qui fait la différence

**« Votre cabinet tourne sur un savoir-faire que personne n'a écrit. »**

Le constat : les règles qui font tourner un cabinet (quelle pièce réclamer, quel écart vérifier avant le bulletin, quel retour DSN mérite un appel, quel compte lettrer d'office) vivent dans la tête de collaborateurs submergés, difficiles à recruter et plus difficiles encore à garder. Quand l'un d'eux part, la règle part avec lui. Le cabinet ne manque ni de compétences ni d'outils : il manque de temps, de bras, et d'une règle écrite quelque part.

Memlia écrit ce savoir-faire et automatise sa part répétitive dans les outils existants. Le collaborateur garde la décision ; le cabinet garde le savoir.

Trois bénéfices, toujours dans cet ordre, jamais chiffrés : moins de charge répétitive sur les collaborateurs (ils travaillent sur les dossiers qui demandent du jugement) ; un savoir-faire qui appartient au cabinet (écrit, testé, maintenu, indépendant des personnes) ; moins de dépendance au recrutement dans l'urgence.

## 2. La promesse : ambitieuse, et tenue

**Toute tâche répétitive de votre cabinet, écrite dans vos mots puis automatisée dans vos outils, prise entière : observation, règle, construction, recette, maintenance.**

- L'ambition porte sur l'étendue (toute tâche répétitive dont la règle peut s'écrire : les soixante familles des douze pôles de `src/data/familles.ts` (le douzième, l'audit légal, est listé et non ouvert), de la saisie au reporting, de la relance des pièces à la DSN) et sur l'engagement (la tâche entière, livrée, maintenue ; « vous confiez une tâche, elle est prise en charge »).
- L'ambition ne porte jamais sur des chiffres de gain, sur le jugement (qui reste humain) ni sur une compatibilité universelle. Formule de référence : **« Nous prenons toute la mécanique. Vous gardez tout le jugement. »**
- Le prix se dit ainsi : **« Vous payez une tâche prise en charge, pas des sièges. »** Le devis dépend de la complexité (sources, règles, exceptions, validations) ; maintenance, support et évolutions y sont écrits.

## 2 bis. Le mécanisme, nommé : « la règle écrite » (19/09/2026, révisable par Kevin)

Ce que Memlia fait a un nom, et ce nom revient à l'identique sur toute surface : **la règle écrite**. Ce n'est pas une méthode de plus, c'est ce qui distingue une tâche confiée à Memlia d'une tâche confiée à un logiciel ou à un prestataire. Quatre parties, toujours les quatre, toujours dans cet ordre :

1. **La frontière en trois colonnes.** Pour chaque tâche, ce qui se prépare seul, ce qui attend une validation, ce qui reste humain. Elle se lit en un tableau ; elle ne se déduit pas d'un paragraphe.
2. **Proposition puis validation.** Ce que nous produisons est une proposition ; la saisie et la décision restent au collaborateur. Ce que nous générons nous appartient et se régénère ; ce que le cabinet saisit ne se touche jamais.
3. **L'arrêt dans le doute.** Devant une pièce illisible, un cas hors règle ou un écart inexpliqué, la règle refuse d'écrire et nomme sa condition d'arrêt. Une règle qui devine n'est pas une règle écrite.
4. **Le jeu d'essai fictif.** Chaque règle est rejouée sur un dossier fictif avant de toucher un vrai dossier, et l'article montre ce rejeu : les cas joués, la sortie obtenue, ce qui a été refusé.

Ce que cela change dans l'écriture : chaque article **nouveau** (daté à partir du 19/09/2026) porte une section `## La règle écrite` qui déroule ces quatre parties pour sa tâche, avec les quatre libellés en gras (**La frontière.** **La proposition.** **L'arrêt.** **Le jeu d'essai.**), puis une section `## Rejoué sur le jeu fictif` avec le tableau des cas joués et leur sortie. La forge refuse de sceller un article nouveau qui n'en porte pas. Les six articles publiés avant cette date restent tels quels jusqu'à une lecture Search Console utile (mi-octobre 2026) : on ne réécrit pas ce que l'on n'a pas encore mesuré.

Ce que le nom ne dit jamais : un chiffre de gain, une promesse d'autonomie, une conformité garantie. La règle écrite est une manière de travailler, pas un produit ; « module », « plateforme » et « logiciel » restent interdits (§9).

## 3. Ce que nous ne disons plus (retiré du site le 17/09/2026)

- « un service porté par Kevin Kitanga » en titre, et le « je » sur les pages commerciales : le site parle en **nous**. Le fondateur a une section (« Qui est derrière Memlia »), pas le titre.
- « Ce que je ne suis pas » : une limite se dit comme un engagement (« Vous restez l'expert. Nous écrivons, et nous faisons tourner »), jamais comme un aveu.
- Le boilerplate d'entité (SASU, RCS, arrondissement) hors mentions légales. Sur À propos, une seule ligne discrète : « société établie à Paris, immatriculée au RCS de Paris » (signal d'entité, exigé par `tests/proof/test_legal_identity.py`).
- Le mantra « sans fichier client, sans donnée de paie » répété à chaque page : il se dit une fois, au formulaire, et positivement (« Rien à envoyer : la description suffit »).
- « nous étudions », « sans promettre », « pas par principe », « non contractuel » en réflexe défensif : on dit ce qu'on fait, on garde les réserves pour la page Garanties où elles sont une preuve.
- « Identifier une tâche à automatiser » comme appel principal : remplacé par **« Confier une première tâche »**, qui dit la délégation.
- Dans les articles (retiré le 17/09/2026) : « Memlia peut préparer… », « le service ne fournit pas… », « ce guide ne remplace ni… ni… ni… », « les règles proposées doivent être adaptées » en réflexe répété, et l'appel « Identifier une tâche à automatiser » vers un agenda. Les articles parlent en nous, disent ce que nous prenons en charge, et gardent une seule frontière, dite une fois (§7 bis).

## 4. Produit et modèle économique

Memlia est un service, pas un logiciel : observer une tâche, écrire sa règle et ses limites dans les mots du cabinet, construire l'automatisation dans l'environnement existant, l'éprouver sur un jeu d'essai fictif (les cas qui doivent aboutir et ceux qui doivent échouer), la faire recetter par les équipes, la maintenir. L'IA prépare, l'humain décide. Motif directeur : **proposition vs saisie** (ce que Memlia génère se régénère ; ce que le cabinet saisit ne se touche jamais) et **fail-closed** (dans le doute, l'automatisation s'arrête et présente le cas).

Le résultat et les critères d'acceptation sont définis au devis ; prix à la complexité, jamais au siège. Un classeur, un export, un logiciel métier, une messagerie ou un dossier partagé peuvent être le point d'entrée ; les formats et accès sont vérifiés avant tout engagement. Excel est une intégration possible, jamais la catégorie commerciale ni un mot du hero (`test_positioning.py`).

## 5. Audience et personas

- **Expert-comptable, dirigeant** : sortir de la dépendance aux personnes, savoir quelle tâche confier, connaître le périmètre, la recette et le prix.
- **Responsable de pôle (social, production)** : décharger l'équipe de la mécanique sans perdre le contrôle, voir les exceptions sans classer les gens.
- **Collaborateur, gestionnaire** : moins de ressaisies et de rapprochements ; comprendre ce qui est proposé et garder ses saisies.
- **Référent outils et sécurité** : fichiers, accès, droits, traces, maintenance.

Anti-personas : salarié cherchant à vérifier sa propre paie ; acheteur d'un moteur de paie ou d'une plateforme complète ; demande de surveillance nominative. France, vouvoiement, français professionnel.

## 6. Objections et réponses autorisées

| Objection | Réponse |
|---|---|
| Nous avons déjà un logiciel | Nous partons de la tâche entre les outils ; l'automatisation se greffe sur l'existant. Les accès et formats sont vérifiés avant de s'engager. |
| Une IA peut se tromper | Les cas limites et les données absentes font partie des essais ; dans le doute, l'automatisation s'arrête et présente le cas. La proposition n'est pas la décision. |
| Cela va changer notre organisation | Un périmètre écrit avant de développer, une recette par les équipes qui feront le travail. Vous n'avez rien à configurer. |
| Combien cela coûte ? | Une tâche prise en charge, pas des sièges. Le devis dépend de la complexité ; ni tarif fictif ni pack. |
| Qui voit quoi ? | Fichiers lus en place, jeux d'essai fictifs, traitements documentés par mission, vues de pilotage en agrégats. Aucune certification ni localisation d'hébergement inventée. |
| Et si la personne qui connaît la règle part ? | C'est précisément pour cela que la règle s'écrit : elle appartient au cabinet, elle se relit, elle se maintient. |

## 7. Message par page

| Page | Rôle | Requête visée | H1 |
|---|---|---|---|
| `/` | l'angle et la promesse | automatisation IA cabinet comptable | Votre cabinet tourne sur un savoir-faire que personne n'a écrit. |
| `/automatisation-cabinet-comptable` | le service, le périmètre, le prix | automatisation sur mesure cabinet comptable | Toute tâche répétitive de votre cabinet, écrite puis automatisée. |
| `/methode` | la preuve de méthode | comment se déroule une mission | Observer. Écrire. Éprouver. Livrer. |
| `/garanties` | les engagements, et ce qu'on ne promet pas | garanties Memlia | Ce que nous garantissons, avant même de commencer. |
| `/a-propos` | pourquoi Memlia existe, qui est derrière (page de marque : « memlia ») | memlia | Nous écrivons ce que votre cabinet sait faire. Puis nous le faisons tourner. |
| `/contact` | la conversion | — | Quelle tâche vos collaborateurs refont-ils encore à la main ? |
| `/blog`, articles | les méthodes, sourcées (règles au §7 bis) | requêtes du registre (`docs/strategy/site-v3/mesures/registre-requetes.json`) | par article |
| `/glossaire` | le vocabulaire et sa frontière d'automatisation | glossaire cabinet comptable | inchangé |

Les titres sont **intent-first**. Pour chaque article, le H1 porte une requête mesurée par l'instrument du registre, y compris quand l'autocomplétion répond sans suggestion ; le JSON-LD `headline` et `og:title` reprennent ce H1 à l'identique. Le titre d'onglet peut être plus court pour la largeur du SERP, mais vise la même requête. Un angle narratif reste possible en seconde proposition, jamais à la place de l'intention. L'appel principal est unique sur tout le site : **« Confier une première tâche » → `/contact`** ; le bouton de navigation dit « Parlons de votre tâche ». Tagline (pied de page, slogan JSON-LD) : « Le savoir-faire de votre cabinet, écrit et automatisé. La décision reste à vous. »

## 7 bis. Les articles du blog

Un article est une méthode publiée, pas une page de vente : il vaut par ce qu'il apprend au lecteur, et il convertit par la confiance qu'il installe. Il suit la même charte que les pages, appliquée ainsi (rejouée sur les six articles le 17/09/2026 ; tout article suivant sort de la forge avec ces règles, `docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md` §3) :

- **La réponse d'abord.** Le corps ouvre sur `## Réponse directe` (40 à 80 mots) qui répond à la requête sans détour ; le résumé « En bref » et la description d'onglet disent la méthode, pas la promesse.
- **L'angle entre par le geste.** Chaque article nomme, dans sa section « pourquoi la tâche casse à la main », la règle que le cabinet applique sans l'avoir écrite, et ce qu'il perd quand elle vit dans une seule tête. Une fois : ni slogan répété, ni paragraphe commercial au milieu de la méthode.
- **Ce qui est nôtre est dit comme tel, sans s'excuser.** « Méthode Memlia » étiquette une convention de travail ; une réserve se formule une seule fois, comme une frontière (« ce qui reste au cabinet »), jamais comme un avertissement répété (« ne remplace pas », « à adapter », « ne constitue pas »). Les phrases « Memlia peut… », « le service ne fournit pas… » sont retirées : on dit ce que nous faisons.
- **Nous, jamais je.** Quand Memlia parle, c'est « nous » ; le lecteur est « vous » ou « votre cabinet » ; les collaborateurs sont nommés par leur geste.
- **Les sources se citent mot pour mot, en lien dans le corps**, chaque affirmation sensible portée par une citation exacte d'une page officielle ouverte le jour même (chaîne de la forge). Aucun chiffre de gain, aucune donnée client, aucun cas réel : le jeu fictif est nommé fictif.
- **Chaque article tient sa place dans le maillage** : un lien vers le pilier (`/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`) là où sa famille est nommée, un lien vers un article frère, un vers `/methode`, un vers `/automatisation-cabinet-comptable` ou `/garanties` dans la clôture, une ou deux ancres du glossaire. Les ancres d'accueil (`/#methode`, `/#garanties`) ne servent plus : les pages existent.
- **La clôture porte l'ambition** : « La règle à retenir » (deux phrases) puis « Pour aller plus loin », qui dit ce que nous prenons en charge pour cette tâche précise, entière, dans les outils du cabinet, et ce que le cabinet garde.
- **L'appel de fin d'article** (bloc « Et dans votre cabinet ? ») : le libellé est **« Confier cette tâche »** (même verbe que l'appel principal, au singulier de l'article lu ; le pilier, qui ne traite pas une tâche unique, garde « Confier une première tâche »), la destination `/contact`, et le texte d'accompagnement dit en deux ou trois phrases ce que nous faisons de cette tâche (écrire la règle dans vos mots, l'automatiser dans vos outils, la faire recetter par vos équipes), ce que vous gardez (la décision), et qu'il n'y a rien à envoyer. Jamais une description de ce que le lecteur devrait nous fournir.
- **Interdits propres aux articles** : tiret cadratin, « nous constatons », « module », « complément » au sens catalogue, superlatif, mot de processus (revue métier, fact-check, non attesté), formule défensive en tête d'article.
- **Une republication est datée** : `updatedAt` dans la recette, `dateMiseAJour` dans le frontmatter ; la date de publication ne bouge jamais.

## 7 ter. La série « Cicatrices » — un article par semaine, signé Kevin (19/09/2026)

Les articles ordinaires parlent en **nous** et décrivent une tâche. Une fois par semaine, la série fait exception : l'article est **signé Kevin Kitanga à la première personne**, et il raconte **une chose qui a cassé** dans la construction de Memlia, ce qu'elle a coûté, et la règle qui en est sortie et que nous appliquons depuis. C'est la preuve que le savoir-faire s'écrit parce qu'on l'a payé : un cabinet reconnaît immédiatement quelqu'un qui a déjà ouvert un vrai dossier.

**Ce qu'un article de la série doit porter**, dans cet ordre : le geste ou la décision de départ, tels qu'ils paraissaient raisonnables ; ce qui a cassé, avec la mesure exacte qui l'a montré ; ce que cela a coûté en temps, en travail refait ou en occasion manquée, sans chiffre inventé ; **la règle qui en est sortie**, écrite comme une règle applicable par quelqu'un d'autre ; et ce que cette règle change pour un cabinet qui nous confie une tâche. Il porte aussi, comme tout article daté à partir du 19/09/2026, ses sections « La règle écrite » et « Rejoué sur le jeu fictif » lorsque la leçon se rejoue.

**Ce qu'il ne porte jamais** : le nom d'un cabinet, d'un client, d'un éditeur ou d'une personne, y compris en creux ; un chiffre de résultat non mesuré ; une leçon qui ne se termine pas par une règle ; un aveu qui ne sert qu'à paraître humble. Une cicatrice sans règle est une confidence, pas un article. Le « je » de cette série ne contamine aucune autre surface : les autres articles et les pages restent en « nous ».

**Cadence et place** : exactement une Cicatrice par semaine ISO, le samedi, en sus des quatre articles ordinaires du lundi au jeudi ; elle ne consomme jamais leur plafond. Format `thought-leadership`, rôle `direction-associes`. Sa valeur vient du récit réel, mais son titre reste intent-first : la requête mesurée ouvre le H1 et la cicatrice vient en seconde proposition. Les entrées portent `serie: "cicatrices"` dans le backlog et sortent du compte des quatre angles par famille. Le planificateur refuse une Cicatrice hors samedi, une deuxième dans la même semaine ou un trou entre deux entrées déjà approvisionnées ; il ne fabrique jamais un récit pour combler le stock.

**Ces articles sont les seuls que Kevin relit avant publication** : ils portent sa signature et son expérience. La forge les prépare et les scelle ; elle ne les publie pas sans son go.

## 8. Voix

Nous, vouvoiement, français professionnel, concret, calme et confiant. Phrases courtes, un sujet par phrase, le lecteur en sujet (« vos collaborateurs », « votre cabinet »). On nomme des gestes réels (recopier, réclamer, rapprocher, lettrer, contrôler avant la DSN), jamais des catégories abstraites. Une réserve se dit une fois, à l'endroit où elle rassure (Garanties, formulaire), pas partout. Aucun superlatif, aucun mot anglais de plateforme, aucun tiret cadratin dans les articles du blog (le reste du site le garde).

## 9. Vocabulaire

- **On dit** : tâche, geste, règle, savoir-faire, collaborateur, cabinet, dossier, pièce, bulletin, DSN, retour DSN, écart, exception, proposition, recette, validation, périmètre, maintenance, « prise en charge », « écrite dans vos mots », « dans vos outils ».
- **On ne dit jamais** : module, complément Excel ou Memlia (verrouillés par `tests/proof/test_positioning.py`), plateforme tout-en-un, autonome, zéro erreur, conformité garantie, révolution, gain chiffré, « logiciel » pour désigner Memlia, mots de processus interne (revue métier, fact-check, non attesté : verrouillés par `test_build.py`).
- **Définir à la première apparition** : recette, fail-closed, jeu d'essai fictif, agrégat non nominatif.

## 10. Preuves autorisées et garde-fous

Illustrations fonctionnelles fictives (`src/data/proofs.ts`), méthodes publiées et sourcées, glossaire sourcé et daté, la méthode elle-même. Aucun logo client, témoignage, nombre de cabinets, pourcentage de gain ni donnée client réelle, aucun téléphone public, aucune certification. Kevin Kitanga est le fondateur et l'auteur des articles ; il n'est pas expert-comptable et le site ne le laisse pas croire (la règle est celle du cabinet, le jugement professionnel reste au cabinet). Le siège légal est à Paris (mentions légales, JSON-LD Organization).

Tests qui verrouillent la copy : `tests/proof/test_positioning.py` (hero, titre d'accueil, mots interdits), `test_integrated_media.py` (tagline), `test_legal_identity.py` (identité, « RCS de Paris » sur À propos), `test_build.py` (FAQ = 11, usages = 5, mots de processus, `pages-lastmod.json`), `tests/browser/positioning.spec.ts`, `sections-redesign.spec.ts` (cinq titres d'usages), `site.spec.ts` (navigation). Toute modification de copy rejoue `npm run lastmod:sync`, la chaîne Ressources (`resource:seal-surfaces` + `reaffirmer`) et `npm run build`.

## 11. Objectif et conversion

Une action principale : confier une première tâche, sur `/contact` (formulaire sans dépôt de fichier, créneau Cal.com, courriel). Le visiteur apporte une description en trois phrases ; rien n'est transmis avant que le périmètre soit clair. Mesures : Search Console et les crons SEO (`docs/strategy/site-v3/CRONS-SEO.md`) ; aucune conversion n'est attribuée à un clic sans preuve.

## 12. Sources

- Décision de Kevin du 17/09/2026 : l'angle « savoir-faire que personne n'a écrit », l'ambition sur la proposition de valeur, le retrait de tout ce qui dessert.
- Décision de Kevin du 17/09/2026 (soir) : « fais pareil pour les articles du blog » ; les six articles réécrits selon le §7 bis et republiés par la forge, les trois articles antérieurs à la v3 compris.
- v2 du 15/09/2026 (carte t_630c4a13), coffre 10-memlia/00-socle.md, marketing/positionnement-memlia-automatisation-ia.md, marketing/seo/20-voix-client-vocabulaire.md.
- `src/data/familles.ts`, `src/data/site.mjs`, `src/data/pages-v2.mjs`, `src/data/faq.ts`, `src/data/schema.mjs`, `public/llms.txt`, et `docs/strategy/site-v3/` (stratégie, crons, journal).
