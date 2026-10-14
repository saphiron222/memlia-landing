# Hub d'agents IA par métier — cadrage de la phase 1 (14/10/2026)

> **Statut : proposition, en attente de la porte 1.** Aucune ligne de code n'est écrite. Branche
> `site/hub-specialistes`, worktree `.worktrees/hub-specialistes`, base `origin/main` `9cb65a56`.
> ADR proposé : [`docs/adr/0001-hub-agents-ia-source-unique.md`](../../adr/0001-hub-agents-ia-source-unique.md).
> Charte appliquée : `.agents/product-marketing.md` **v5 du 06/10/2026** (et non la v3 citée dans la
> consigne du chantier : le checkout principal pointait sur une branche du 21/09).

## 0. Ce que Kevin décide à la porte 1

Chaque ligne porte une recommandation ; la colonne de droite dit ce qui change si Kevin choisit
l'autre voie. Le détail et les mesures sont dans les sections citées.

| # | Décision | Recommandation | Autre voie réaliste |
|---|---|---|---|
| D1 | Le mot de catégorie (§9, §11) | **« agent IA »**, défini à sa première apparition : il prépare, s'arrête dans le doute, votre collaborateur valide | « spécialiste » : aucune demande mesurée, réécrit en « expert ia » par Google, et c'est le mot du héros d'agpt |
| D2 | Le nom du hub et son URL (§9) | **« Agents IA »**, `/agents-ia` ; fiches `/agents-ia/<métier>` | `/specialistes-ia` si D1 = spécialiste |
| D3 | Prénoms (§8) | **Garder un prénom par agent**, visible sur la carte et le label de la fiche, **jamais dans l'URL, le title ni le H1** ; jeu recommandé au §8 | Postes sans prénom (recommandation du profil Factory : plus de distance, moins de personnification) |
| D4 | Les douze métiers (§4, §7) | Garder les douze, **libellés recalés sur nos pôles** (« Paie et social », « Juridique et fiscal », « RH du cabinet », « Gestion du cabinet » au lieu d'« Administration »…) et sur les interdits CAC | Reprendre les douze libellés tels quels : c'est **l'organigramme exact de Factory 456**, dans le même ordre |
| D5 | Combien de fiches neuves (§6, §7) | **12 cartes, 9 fiches neuves.** Trois cartes mènent à la page qui tient déjà le métier : Paie et social → `/automatisation/paie` (le « moyeu paie » des guides) ; Missions d'audit → `/commissaires-aux-comptes` (accueil CAC, sans bloc ajouté) ; Informatique et outils → la page des outils (D10) | **A** : 12 fiches neuves, comme la consigne (cannibalisation forte sur ces trois pages, revue `seo-cluster`) · **C** : 9 cartes seulement, Communication et Protection des données retirées (proposition de la revue) |
| D6 | Correspondance métiers ↔ familles (§7) | **Partition** : chaque famille EC active a un seul titulaire (agent, hub ou bloc « nous ») ; un pôle neuf « Développement du cabinet » porte les familles à créer pour Commercial et Communication (`active: false`) | Laisser Commercial et Communication sans famille : leurs fiches n'auraient rien à référencer |
| D7 | Le bloc à la place d'Otto (§10) | « Derrière chaque agent, nous » : observer, écrire la règle, éprouver, faire recetter, maintenir ; **pas de treizième persona** | — |
| D8 | L'amendement de charte (§11) | Texte proposé au §11 : définition, ce que l'agent promet, ce qu'il ne promet jamais, mots interdits autour de lui | — |
| D9 | La navigation (§12) | « Ce qu'on automatise » devient un menu : **Par tâche** (le pilier), **Par métier** (le hub), **Dans vos outils** (la page des outils) | Une cinquième entrée « Agents IA » au premier niveau |
| D10 | La page des outils (§12, §13) | **Faire de `/integrations` la page des outils** (sections par domaine, statut par outil) ; les guides restent ses pages de détail | Une page `/connecteurs` distincte, croisée avec `/integrations` |
| D11 | L'existant (§13) | **Aucun retrait.** Le pilier garde son rôle et lie le hub depuis #perimetre ; deux décisions écrites (20/09 et 06/10) sont remplacées par l'ADR 0001 | — |
| D12 | Les avatars (§3) | **Figurines en argile mate, à notre silhouette** (pas celle d'agpt), un attribut de métier, la teinte du pôle, une signature verte Memlia | Bustes illustrés non photoréalistes (l'hypothèse de la consigne), avec le risque de stéréotype qu'ils portent |
| D13 | Capitales et grille (§2) | **Le système de page du 07/10 gagne** : surtitres en casse de phrase, jamais de capitales ; trois colonnes de cartes au plus | Reproduire les capitales d'agpt sur ces seules pages (exception à écrire dans le système de page) |
| D14 | La mesure manquante | Les volumes Google manquent : **D1, D2 et les requêtes du §6 restent provisoires** jusqu'au rejeu DataForSEO | Figer maintenant sur Bing, l'autocomplétion et la Search Console |

**Geste qui n'appartient qu'à Kevin** : le compte DataForSEO est suspendu par précaution
(tâche 40201, « unusual activity »), après un 402 (solde) puis un 403 (compte à vérifier, fait
par Kevin). La levée passe par `support@dataforseo.com`. Le lot de 137 requêtes est prêt
(`scripts/dfs_mots_cles.py`, scratchpad de la session) ; trois essais, 0,00 $ facturé.

## 1. Ce qui a été mesuré, et par quoi

| Volet | Instrument | Ce qu'il prouve | Ce qu'il ne prouve pas |
|---|---|---|---|
| Relevé visuel | Playwright (Chromium), 1440×900 et 375×812, `getComputedStyle`, sans JavaScript et en mouvement réduit ; navigateur intégré pour les avatars et la fiche de Max | ordre, mesures, comportements de six pages le 14/10 | leurs intentions de design ; les pages non relevées |
| Profil Factory 456 | lecture HTML de l'accueil, `/runbot`, `/marketplace`, 4 fiches connecteur, 6 cas d'usage, comparatifs, `/diagnostic` (script compris) | ce que leurs pages affichent le 14/10 | trafic, mots-clés, avis (aucune donnée SEO chiffrée) |
| Mots-clés | Bing Webmaster (FR, 26 semaines), autocomplétion Google FR (instrument du dépôt, 0 panne), Search Console memlia.fr, WebSearch pour typer les SERP | volume Bing, présence au-dessus du seuil de suggestion, impressions de memlia.fr | **aucun volume Google** (DataForSEO suspendu) ; ordre Google FR, AI Overview, PAA |
| Cannibalisation | `scripts/verify-query-ownership.mjs` du dépôt, rejoué avec nos requêtes candidates (lecture seule) | absence de doublon ou de requête trop proche (Jaccard ≥ 0,8) face aux 340 URL déjà réservées | la proximité d'intention entre deux requêtes de vocabulaire différent |
| Cannibalisation d'intention | revue de l'agent `seo-cluster` sur le contenu réel des pages (recherche web localisée US, pondérée) | deux pages qui répondent à la même question avec d'autres mots | un classement Google FR |
| Partition des familles | script qui lit `familles.ts` et échoue sur toute famille absente, en double ou inconnue (scratchpad `recherche/scripts/partition.mjs`) | 60 familles EC sur 60, un seul titulaire chacune | la pertinence métier de chaque rattachement (c'est la porte 1) |
| Prénoms | WebSearch, 45 prénoms en trois séries, preuves par URL | rien trouvé avec ces requêtes, ou une collision nommée | la disponibilité d'une marque (aucune base INPI ni EUIPO consultée ; ce n'est pas un avis juridique) |
| Existant du site | lecture du worktree (`familles.ts`, contenus, tests, scripts de contrat) | ce que le code et les données disent le 14/10 | — |

Les fichiers bruts (captures, textes relevés pour la comparaison anti-plagiat de la phase 4, JSON
des mesures, preuves des prénoms) vivent dans le scratchpad de la session et se purgent après sept
jours sans usage. **À la porte 1, copier hors scratchpad** ce que la phase 4 doit relire : les textes
relevés d'agpt et de Factory (comparaison par séquences de six mots) et les captures section par
section (comparaison côte à côte).

## 2. Relevé visuel : agpt.co et factory456.com

### 2.1 `/experts` (agpt), dans l'ordre

1. Bandeau d'annonce au-dessus de la navigation.
2. Héros : surtitre à astérisque, H1 sur deux lignes (la seconde dans la couleur d'accent),
   paragraphe, ancre « … ↓ », trois avatars en médaillons décalés (celui du milieu plus bas), prénom
   et catégorie sous chacun.
3. Bannière du coordinateur (Otto) : carte pleine largeur sur fond lavande, avatar rond, surtitre
   « prénom / rôle », H2, paragraphe, bouton à droite.
4. Annuaire : surtitre, H2, compteur (« 32 Experts ») aligné à droite, onglets en pilules (le
   courant en encre pleine), **trois colonnes à 1440 px** ; chaque carte : bandeau haut teinté par
   catégorie avec la catégorie en capitales, tuile d'avatar de 84 px à cheval sur le bandeau, micro
   label « AI EXPERT », prénom en grand, rôle, une ligne, filet, « Meet <prénom> » ; quatre cartes
   seulement portent en plus « <prénom>'s full page → ».
5. « Votre façon de travailler » : titre et paragraphe à gauche, trois étapes numérotées 01 à 03 à
   droite (titre en gras, une phrase).
6. Bandeau court « votre travail ne rentre pas dans un intitulé ? ».
7. Appel final, pied de page.

### 2.2 `/experts/max` (agpt), dans l'ordre

Fil d'Ariane · héros partagé (label « ✳ PRÉNOM · AI EXPERT FOR <MÉTIER> », H1 deux lignes, deuxième
en accent, paragraphe finissant sur « vous décidez de ce qui part », bouton plein et ancre « voir ce
qu'il vous remet ↓ », ligne de prix ; à droite une fenêtre de conversation qui se déroule en ~8 s :
demande, réponse, **tableau de résultat avec une puce de statut par ligne, la ligne écartée barrée
avec sa raison**, mention « basé sur une exécution réelle, noms changés ») · bande de preuve (deux
chiffres) · « Jour un » : deux cartes de livrables étiquetés échantillon (dont un brouillon avec la
pastille « en attente de votre oui »), puis une carte en pointillés pour la suite · trois étapes 01
à 03 avec deux puces d'entrée chacune · compétences (6), workflows (3), logos d'outils · « avec /
sans » : colonne « sans » en pointillés gris, colonne « avec » pleine et teintée · **« ce qu'il ne
fera jamais » : panneau sombre inversé**, quatre règles à pictogramme, et un panneau de réglages
illustratif incliné · avant / pendant / après : trois experts voisins · FAQ de onze questions en
accordéon · appel final avec trois briefs pré-rédigés en puces · lien vers tous les experts.

### 2.3 Factory 456

`/runbot` déroule treize sections du « quoi » au « sans risque » (catégorie, éditeurs nommés, avec
/ sans, cas d'usage, tableau domaines × outils × gestes, douze agents à prénom, six agents
internes, trois étapes, sécurité, comparatifs, démo, financeurs). `/marketplace` prouve par le
volume : badges chiffrés, quatorze ancres de domaine, une section par domaine (introduction des
gestes, puis tuiles logo + description + lien), « comment un connecteur fonctionne », « votre outil
n'est pas dans la liste ? », mention de marques. Les fiches connecteur portent une mention utile de
non-partenariat. Détail au §4.

### 2.4 Comportements mesurés qui changent la copie à faire

- **Les filtres d'agpt ne marchent pas sans JavaScript** : ce sont des `<button aria-pressed>` dans
  un `role=group` ; l'URL ne change jamais ; sans JavaScript, les 32 cartes restent affichées et les
  boutons sont inertes. Nos filtres sans JavaScript seront donc un mieux, pas une reprise : radios
  CSS (`:has()`) ou ancres par groupe, avec l'annuaire complet comme état par défaut.
- **Seuls 4 experts sur 32 ont une fiche** (Maria, Max, Jules, Kai) ; les 28 autres ouvrent un
  dialogue et leur adresse rend 404. Douze fiches complètes, c'est plus que la référence.
- **La fiche est un gabarit fixe de 14 sections**, identique pour Max et Maria : notre
  `specialistes.ts` alimente un seul gabarit.
- **La démo de conversation est une maquette statique** : tout est affiché vers 0,6 s, sans
  animation, sans élément interactif (le champ de saisie est un `span`), sans `aria-live`, identique
  sans JavaScript et en mouvement réduit. Notre rejeu peut l'égaler en HTML pur, sans réseau.
- **Aucune apparition au défilement** sur les six pages : tout le mouvement est au survol (150 à
  250 ms, −2 à −6 px). Le site Memlia en fait déjà plus (`.rv`, 400 ms) ; le mouvement réduit y est
  déjà géré.
- **Factory 456** : contrastes faibles mesurés (blanc sur orange 1,87:1, rôle d'agent or sur blanc
  2,36:1 en 11 px), focus laissé au navigateur ; la marketplace charge 543 cartes et n'en montre
  qu'un domaine à la fois ; la fiche connecteur relevée (`/marketplace/pennylane`) n'a ni exemple ni
  preuve, et 1 325 px de pied de page sur 2 375.

### 2.5 Correspondance des mesures vers nos jetons

Relevé complet : scratchpad `releve/MESURES.md` (219 lignes, comparé aux textes relevés par
séquences de six mots : 0 séquence commune). Extrait des choix :

| Élément | agpt (1440 / 375) | Jeton Memlia | Verdict |
|---|---|---|---|
| Conteneur | 1 280 + gouttières 80 / 335 + 20 | `--conteneur-lg` 1 360, `--marge-page-lg` 32 / `--marge-page` 16 | Memlia |
| Espace entre sections | 96 / 80 | `--section-espace` 128 / 96 / 80 | **écart** : le système de page garde 128 |
| H1 | 73,6 / 48 px, 500, −0,045 em | `--titre-page` 36→60 (Fraunces 600) ; `--titre-page-partage` 36→56 pour la fiche | Memlia |
| H2 | 50,4 / 38,4 px | `--titre-section` 32→48 | ≈ |
| Titre de carte | 25,6 px | `--titre-bloc` 24 | ≈ |
| Corps | 15 px / 1,75, #616473 | `--t-base` 16→18 / 1,6, `--texte-2` | Memlia |
| Surtitre | 12 px 600, +0,12 em, **capitales** | `.surtitre` 14 px 600, casse de phrase | **D13** |
| Bouton principal | h 54,5, r8 | `--bouton-h` 32 (+ zone tactile 44), `--r-bouton` 8 | **écart** : rayon identique, hauteur à arbitrer en phase 2 |
| Filtre | r7, h 45, actif en encre | `--r-chip` 7, actif `--bouton-sombre`, repos `--ligne` | = |
| Focus | anneau 3 px décalé de 5 | `:focus-visible` 2,5 px `--focus`, décalage 3 | Memlia |
| Carte | r13, filet 1 px, sans ombre ; survol −4 px + ombre, 0,2 s | `--carte-rayon` 16, `--carte-bord`, `--carte-ombre-survol`, `--carte-bord-survol` | Memlia |
| Grille | 3 col. × 410, écart 24 / 1 col. écart 20 | `.cartes` (3 col. max), `--cartes-ecart-lg` 24 / `--cartes-ecart` 16 | = |
| Bande de catégorie de carte | 138 px, 7 pastels | aucune ; `--accent-voile` | **phase 2** : voile de l'accent du pôle (`familles.ts`), ou voile vert unique |
| Avatar de carte | carré r12, 84 px, bord blanc 4 px, déborde de 23 px | **aucun jeton** (`--carte-icone` 40 trop petit) ; `--r-boite` 12 = agpt | **à créer** : `--avatar-carte`, `--avatar-heros` |
| Bloc sombre « ce qu'il ne fera jamais » | #1b1c31, r22 | `--encre` + `--r-cadre` 24, texte `--creme` | Memlia |
| Colonne « avec » | violet pâle + ombre colorée | `--accent-voile`, bord `--vert-doux` | Memlia |
| Accent | violet #6144df | `--vert-appui` #1c8a41, `--vert-texte` #176f37 (jamais `--vert` en texte) | Memlia |

Vigilance de phase 2 : l'accent du pôle Paie et social est `#be123c`, un rouge ; en voile de carte
il ne doit pas se lire comme une erreur (`--rouge` garde son sens).

## 3. Les avatars d'agpt, et la bible d'images que nous en tirons

**Ce qu'ils sont** (fichiers `/images/experts/clay-v2/expert-<prénom>.webp`, 256 × 256, Otto
512 × 512 ; relevé direct) :

- **Technique** : rendu 3D qui imite l'argile mate ou la céramique douce, grain fin, très légère
  moucheture ; figurine de type « designer toy ». Pas un portrait, pas un humain.
- **Silhouette commune** : corps en quille à base plate, tête séparée en galet irrégulier (la forme
  de la tête change d'un expert à l'autre), visage minimal (deux yeux ovales noirs, sourcils courts,
  petit sourire), une bande crème en écharpe sur le corps. **Aucun accessoire, aucun attribut de
  métier**, la même expression pour tous.
- **Couleur** : un ton mat dominant par figurine, choisi par catégorie (ocre, terre cuite, ardoise,
  sauge ; lavande pour le coordinateur), plus la bande crème.
- **Lumière** : studio douce et diffuse, du haut à gauche et de face ; ombre de contact douce sous
  la base ; aucun reflet dur ; légèrement chaude.
- **Cadrage et fond** : blanc chaud uni, figurine centrée sur ~60 % de la hauteur, vue de face
  légèrement de trois quarts, caméra à mi-hauteur.
- **Affichage** : médaillon rond de 115 px dans le héros (`object-fit: contain`) ; tuile de 84 px,
  rayon 12 px, fond pastel teinté par catégorie dans l'annuaire.

**Conséquence pour la bible** (phase 2) : la consigne prévoyait un buste humain (« même hauteur de
tête »). La référence ne montre aucun humain, et c'est ce qui la protège du stéréotype et de la
ressemblance : ni genre, ni âge, ni origine visibles. Nous proposons **la même famille de
technique** (argile mate, studio doux, fond uni, non photoréaliste), **mais pas leur personnage** :
reprendre la quille, la tête-galet et l'écharpe crème reviendrait à copier leurs avatars. Pistes
de silhouette à départager sur le pilote : un galet d'un seul tenant dont la forme change par
métier, ou un pion arrondi ; la **signature Memlia** est une petite pièce verte `#27b657` (col,
bandeau ou socle) commune à tous ; **un attribut de métier** porté ou posé (classeur, tampon,
enveloppe scellée, clé, loupe…) que la référence n'a pas ; **la teinte du corps vient de l'accent
du pôle** (`familles.ts`), désaturée vers l'argile ; fond crème `#fffefb` uni. Le pilote d'image
tranche.

## 4. Factory 456 : ce que nous reprenons, retournons, refusons

Profil complet (lecture du 14/10, scratchpad `recherche/factory456-profil.md`), à copier hors
scratchpad à la porte 1.

- **Leur douze et le nôtre.** Les douze métiers de la consigne (Comptabilité · Social · Juridique ·
  CAC / Audit · Commercial · Communication · RH · Finance · Administration · Informatique (DSI) ·
  Protection des données (DPO) · Relation client) sont, **à l'identique et dans le même ordre**,
  les étiquettes des douze agents de `/runbot`. La structure argumentative se reprend ; un
  organigramme identique se remarque. D'où D4 (libellés recalés sur nos pôles) et D5 (le métier CAC
  sans étiquette « CAC », que la charte interdit de toute façon au titre de L.821-7).
- **Motifs repris** (la forme, jamais leurs phrases) : les tâches en liste de gestes ; « dossier
  par dossier », « sur tout le portefeuille » ; le avec / sans, à condition que la colonne « avec »
  dise qui valide ; seuls les cas hors règle sont présentés ; un dossier en échec n'arrête pas les
  autres ; la scène de l'incident qui finit par une proposition présentée ; le tableau domaine ×
  outils × geste ; la mention de non-partenariat sur chaque outil nommé ; l'axe de la vie du
  dossier (entrée en relation → collecte → saisie → clôture → conseil → gestion interne).
- **Retournés à notre avantage** : leur plateforme décide seule de ce qui est hors norme → notre
  **frontière en trois colonnes**, écrite avant, dans les mots du cabinet ; leur vidéo d'exécution
  après coup → notre **jeu d'essai fictif rejoué avant** le vrai dossier ; leur automatisation
  « générée » depuis un atelier → **observer puis écrire la règle**, un document que le cabinet
  possède ; leur reprise automatique → **l'arrêt dans le doute** ; leur « 500+ » → **accès et
  formats vérifiés avant tout engagement**, et « ce que votre logiciel fait déjà, nous ne le
  refaisons pas » (charte §6, règle du 06/10) ; leur devis indexé sur des ETP → **une tâche prise en
  charge, pas des sièges**.
- **Leur point faible n° 1, à traiter frontalement sans les nommer** : la validation humaine change
  d'une page à l'autre (DSN déposée la nuit, TVA « automatique », relances et factures réémises
  seules). Réponse : une section commune **« Ce qui ne part jamais sans vous »** (DSN,
  télédéclaration, liasse, facture émise, relance client, formalité, réponse client, publication),
  chaque envoi avec son geste de validation et sa condition d'arrêt.
- **Interdits, même s'ils le disent** : plateforme, agentique ou autonome, « logiciel » pour Memlia,
  sans erreur, tout gain chiffré (heures, ETP, pourcentages), « 500+ », 24/7, certifications et
  « alignements », coffre-fort chiffré, hébergement non vérifié, « en pleine conformité »,
  financeurs, logos clients, témoignages, nombre de cabinets, équipe de personas internes, agent
  étiqueté « CAC », « partenaire officiel » sans contrat.
- **Garde à porter** : leur domaine Audit liste un outil dont le domaine porte du contenu de casino
  injecté (`revisaudit[.]fr`). La garde `domaine-proscrit` existe dans `memlia-rdv`, pas dans
  `memlia-landing` : un garde-fou ne se propage pas tout seul. Invariant de la phase 3.

## 5. Mots-clés et SXO (provisoire : aucun volume Google)

Détail : scratchpad `recherche/mots-cles.md` (250 lignes). L'essentiel :

- **« agent IA » est le seul mot de catégorie avec une demande mesurée** : ~399 requêtes exactes
  par mois sur Bing FR (« agents ia » ~51), un éventail par métier dans l'autocomplétion Google
  (comptable, juridique, rh, finance, commercial, prospection) et des formes cabinet que Google
  propose seul (« agent ia expert comptable », « agent ia cabinet comptable »).
- **« spécialiste IA »** : aucune demande ; Google le réécrit en « expert ia », un métier humain.
  **« assistant IA »** : la SERP de « assistant ia comptabilité » rend neuf fiches métier sur neuf
  (inadéquation critique). **« collaborateur IA »** : incompatible avec la charte, le collaborateur
  est l'humain qui valide. **« agent administratif »** et **« agent comptable »** : grades de la
  fonction publique, jamais en slug ni en H1 sans « IA ».
- **L'intention des requêtes cœur est informationnelle** (guides d'éditeurs, formations). Un
  annuaire nu serait en inadéquation : le hub doit être **hybride** (définition de l'agent, tableau
  des métiers, frontière en trois colonnes, puis l'annuaire).
- **Par métier**, une requête au-dessus du seuil existe pour comptabilité, commercial, RH, finance,
  juridique, RGPD et CAC (« ia commissaire aux comptes », SERP sans offre) ; presque rien pour
  communication, informatique et relation client ; pour la paie, « agent ia paie » est sous le seuil
  (Google propose « agent ia paiement »).
- **URL au métier, pas au prénom** : neuf métiers sur douze ont une requête mesurée ; un prénom
  inventé n'en a aucune et l'URL casserait si le prénom change.

## 6. Propriété des requêtes et cannibalisation (mesuré)

L'instrument du dépôt (`verify-query-ownership.mjs`) a été rejoué en lecture seule avec nos
requêtes candidates, face aux 340 URL déjà réservées (pages, articles publiés, registre, backlog).

**Première configuration, refusée par l'instrument** (sept conflits) : un hub sur « agent ia cabinet
comptable » est trop proche (Jaccard ≥ 0,8) de toute fiche « agent ia <métier> cabinet comptable » ;
« ia rgpd cabinet comptable » heurte l'article réservé « IA RGPD cabinet expertise comptable » ;
« connecteur logiciel cabinet comptable » heurte deux articles de connecteurs planifiés.

**Configuration retenue, zéro conflit à l'instrument**, revue ensuite par l'agent `seo-cluster`
(scratchpad `recherche/cannibalisation-maillage.md`), qui cherche ce que l'instrument ne voit pas :
deux pages qui répondent à la même question avec des mots différents.

| Page | Requête primaire proposée | Proximité la plus forte (Jaccard) | Verdict de la revue |
|---|---|---|---|
| hub `/agents-ia` | agent ia expert comptable | aucune ≥ 0,5 | partage le terrain avec l'article planifié « ia cabinet comptable » et la carte des tâches : le hub dit qui prépare quoi, il renvoie l'IA en général à l'article |
| Comptabilité | agent ia comptabilité | article « logiciel ia comptabilite » 0,50 | tenable |
| Paie et social | — (carte vers `/automatisation/paie`) | — | **fort** si fiche neuve : la page paie est déjà la page du pôle social |
| Juridique et fiscal | ia juridique expert comptable | aucune ≥ 0,5 (0,60 avec le hub) | tenable ; viser la variante expert-comptable, « ia juridique » seul est tenu par les outils pour avocats |
| Missions d'audit | — (carte vers `/commissaires-aux-comptes`) | — | **fort** si fiche neuve : l'accueil CAC porte déjà frontière, usages, méthode et onze questions |
| Commercial | agent ia commercial | aucune | tenable ; SERP d'éditeurs SaaS génériques |
| Communication | agent ia communication | aucune | faible demande, aucune règle écrite, liens entrants seulement depuis le hub : la fiche la plus proche de l'orpheline |
| RH du cabinet | agent ia rh | aucune | tenable ; liens entrants faibles |
| Finance | agent ia finance | aucune | tenable ; la SERP parle de DAF et de trésorerie, d'où une fiche tournée vers le conseil aux clients |
| Gestion du cabinet | **à mesurer** (ni « secrétariat », ni « ia <mot> cabinet comptable » : « ia gestion cabinet comptable » est à 0,75 du terme de tête) | — | **fort** avec « secrétariat » : la SERP rend le métier de secrétaire comptable |
| Informatique et outils | — (carte vers la page des outils) | — | **fort** si fiche neuve : elle répondrait à « comment vous branchez-vous à mes logiciels », la question de la page des outils |
| Protection des données | agent ia rgpd | aucune | **fort** si la fiche reprend les engagements de `/garanties` ; tenable si elle traite les obligations RGPD du cabinet lui-même (registre, demandes d'accès), en liant `/garanties` pour le reste |
| Relation client | agent ia relation client | aucune | tenable |
| page des outils (D10) | intégration logiciels cabinet comptable | trois articles 0,50 | tenable si les quatre articles de connecteurs planifiés gardent l'angle méthode |

**Partage des rôles, pour ne pas se cannibaliser** :

- **Le hub** répond « quel agent prend quel métier » ; il ne détaille aucune tâche.
- **Une fiche d'agent** répond « qui prend en charge ce pôle, ce qu'il vous remet, où il s'arrête » ;
  elle liste ses familles et **renvoie chaque tâche détaillée à sa page service**.
- **Une page service** (`/automatisation/<tâche>`) garde le détail d'une tâche, sa règle et son
  rejeu ; elle gagne un lien « Qui la prend en charge : <prénom>, agent IA <métier> ».
- **Le pilier** `/automatisation-cabinet-comptable` garde le service, le périmètre et le prix ; sa
  section #perimetre (déjà rangée par pôle) lie chaque pôle à son agent.
- **L'accueil CAC** reste l'entrée de la profession et reçoit la carte Missions d'audit (D5), sans
  bloc ajouté : la revue le déconseille, l'accueil CAC est déjà la fiche du métier.
- **`/automatisation/paie`** reçoit la carte Paie et social : c'est déjà la page du pôle social
  (« automatisation paie pôle social », secondaire « automatisation paie cabinet comptable »). Le
  prénom y apparaît dans un bandeau « Qui prend ce pôle », sans changer sa requête. Préalable de
  phase 3 : `paie.md` porte `family: paie-social`, un identifiant de pôle, qui casse le lien
  service → agent.
- **Le maillage se rend par les données et les gabarits**, jamais en éditant un Markdown scellé
  (`LIENS_COMMERCIAUX_BLOG`, `candidateFingerprint`).

**Maillage dans les deux sens** (à figer en phase 2) : hub ↔ chaque fiche ; fiche ↔ ses pages
service, ses guides d'intégration, ses outils gratuits et un article de sa famille ; page service →
son agent ; pilier #perimetre → hub et fiches ; accueil EC → hub (section Orientation) ; blog →
fiche de la famille quand l'article n'a pas de page service (nécessite d'élargir
`estLienCommercialBlog`, qui n'accepte aujourd'hui que le pilier, `/automatisation/*` et l'accueil
CAC) ; page des outils ↔ fiches.

## 7. Les douze métiers et les familles de `familles.ts`

Modèle proposé (ADR 0001) : chaque agent référence des **identifiants de familles** ; chaque famille
EC active a **un seul** titulaire (un agent, le hub, ou le bloc « nous »). Partition vérifiée sur les
60 familles EC (59 actives + `audit-legal`) : 12 + 7 + 8 + 1 + 2 + 0 + 3 + 5 + 7 + 4 + 2 + 4 + 1 (hub)
+ 4 (nous) = 60. Révisée après la revue `seo-cluster` (D5).

| Métier (libellé proposé) | Destination de la carte | Familles titulaires | Pages service | Règle écrite publiée et rejouée | Automatisations livrées (interne, jamais nommées en public) |
|---|---|---|---|---|---|
| **Comptabilité** | fiche | pôle `production-comptable` sauf `situations-reporting-client` (12) | saisie-comptable, rapprochement-bancaire, factures-fournisseurs, notes-de-frais, facture-electronique | oui (5 services, 8 guides) | caisse et e-commerce : construite le 04/08, **recette non faite** |
| **Paie et social** | `/automatisation/paie` | pôle `paie-social` (7) | paie, bulletins-controle, entrees-sorties-salaries | oui (3 services, 4 guides, 3 articles) | production sociale : **recette passée le 26/07** ; vue de pilotage en agrégats : recette en cours |
| **Juridique et fiscal** | fiche | pôle `juridique-fiscal` sauf `lettre-de-mission-lcbft` (6) + `echeances-fiscales`, `teledeclarations-rejets` | secretariat-juridique, registres-obligations | oui (2 services) | — |
| **Missions d'audit** (profession CAC) | `/commissaires-aux-comptes` | familles CAC (8 actives sur 25) + `audit-legal` | circularisation-cac | oui (1 service, 2 articles) | — |
| **Commercial** | fiche | `onboarding-client`, `lettre-de-mission-lcbft` + familles à créer (D6) : propositions de mission et devis | — | oui (article entrée en relation) | — |
| **Communication** | fiche | familles à créer (D6) : lettre d'information aux clients, actualité à diffuser, publications du cabinet | — | **non** : pas de rejeu sur la fiche | — |
| **RH du cabinet** | fiche | pôle `rh-formation` (3) | — | oui (article formation à l'IA) | synthèse de rémunération : **recette passée le 20/08** |
| **Finance** (conseil aux clients) | fiche | pôle `conseil-missions` (4) + `situations-reporting-client` | evaluation-transmission | oui (1 service) | — |
| **Gestion du cabinet** | fiche | pôle `facturation-recouvrement` (4) + `suivi-dossiers-etats`, `tableau-de-bord-production`, `planification-charge` | — | oui (article plan de charge) | — |
| **Informatique et outils** | page des outils (D10) | `integration-connecteurs` + pôle `excel-outils-existants` (3) | — | oui (articles « sans changer de logiciel ») | — |
| **Protection des données** | fiche | `rgpd-secret-securite`, `ai-act-conformite` (+ registre des traitements et demandes d'exercice des droits, à créer) | — | oui (article confidentialité) | — |
| **Relation client** | fiche | `boite-mail-courriers`, `envois-plaquettes-documents`, `rendez-vous-agenda`, `offboarding-transfert` | — | **non** : pas de rejeu sur la fiche | — |
| *le hub lui-même* | — | `ia-generative-agents` | — | oui (6 articles) | — |
| *Derrière chaque agent, nous* | — | pôle `methode-decision-humaine` (4) | — | oui (2 articles) | — |

Pourquoi ces déplacements : la **lettre de mission** se traite à l'entrée en relation (l'article
publié la couvre avec sa signature), la vigilance LCB-FT restant au cabinet ; la **facturation des
honoraires** est la gestion du cabinet lui-même, distincte du **conseil financier** aux clients que
la SERP de « agent ia finance » attend (DAF, trésorerie) ; l'**IA générative** en général est le sujet
du hub, pas d'un agent.

Écarts de la lecture du 14/10 corrigés ici : **Commercial n'a pas de pôle non plus** (pas seulement
Communication, Protection des données et Relation client) ; Protection des données et Relation
client **ont** des familles actives, empruntées à `numerique-it-data` et `administratif-secretariat` ;
« Juridique » porte aussi la fiscalité (TVA, IS, déclarations annexes) d'où « Juridique et fiscal » ;
« RH » se distingue de « Social » : la paie des clients d'un côté, les RH internes du cabinet de
l'autre ; « Administration » attire le métier de secrétaire comptable et l'emploi public d'« agent
administratif », d'où « Gestion du cabinet ».

**Pièges relevés dans les données** (à corriger en phase 3, en ticket séparé) : le libellé de
famille « Compléments greffés sur Excel » (`familles.ts:116`) contient un mot verrouillé s'il est
rendu publiquement ; `paie.md` porte un identifiant de pôle dans `family` ; deux articles ont un
`cluster` différent du pôle de leur famille ; l'outil `bareme-heures-cac` pointe vers une famille
inactive ; le JSON-LD Organization ne décrit que l'expertise comptable.

## 8. Les douze agents : prénoms et lignes

Contraintes tenues : prénom court et facile à dire ; lien au métier par le sens ou le son ; initiales
toutes distinctes ; aucune collision trouvée avec Factory 456 (Facto, Solis, Lex, Vera, Kai, Echo,
Tali, Fino, Ordo, Kodi, Vigi, Lumi, Iris, Max, Eva, Atlas, Neo, Nova), avec les 32 experts d'agpt ni
avec un logiciel comptable connu ; **pas de schéma de stéréotype** (Commercial et Informatique au
féminin, RH et Administration au masculin ; la figurine, elle, n'a pas de genre). Vérification web
du 14/10, 45 prénoms en trois séries ; ce n'est pas un avis juridique.

| Métier | Recommandé (initiale, genre, lien) | Seconde proposition | Écartés et pourquoi |
|---|---|---|---|
| Comptabilité | **Balthazar** (B, m, « balance ») | Côme (« compte ») : meilleur lien, mais le C est pris par Colette | Basile (≈ Basil, logiciel de gestion de cabinet) |
| Paie et social | **Salomé** (S, f, « salaire ») | Paulin (« paie » ; proche d'un agent IA « Pauline » au Québec) | — |
| Juridique et fiscal | **Grégoire** (G, m, « greffe ») | Cassandre (Cour de cassation ; connotation de la prophétesse qu'on ne croit pas) | Justine, Justin, Lou, Agnès, Vincent (IA juridiques existantes) |
| Missions d'audit | **Aude** (A, f, « audit ») | Victor (« vérifier » ; petite fintech américaine homonyme) | — |
| Commercial | **Victoire** (V, f, emporter un client) | Denis (« devis ») | Prosper (Prosperian : prospection par agents IA), Denise (assistant IA téléphonique) |
| Communication | **Colette** (C, f, l'écrivaine ; concept store fermé en 2017, réserve faible) | Ange (du grec *angelos*, le messager ; le A est pris par Aude) | Hermine (≈ Hermes, l'agent du coffre) |
| RH du cabinet | **Raphaël** (R, m ; petits produits hors secteur, réserve faible) | Hector (H, humain) ou Romane | Hugo (agent IA de support de Crisp), Adèle (agent vocal de recrutement) |
| Finance | **Florent** (F, m, le florin) | Fanny (≈ Fannie Mae pour un rôle finance) | Félix (Felix Pago, felix.so) |
| Gestion du cabinet | **Honoré** (H, m, « honoraires ») | Odile (O, ordre ; le O est pris par Octavie) | — |
| Informatique et outils | **Octavie** (O, f, l'octet ; proche d'Octave, à arbitrer) | Linus (Linux ; renvoie directement à son créateur) | Ada, Hedy, Grace (IA homonymes actives) |
| Protection des données | **Prudence** (P, f) | Constance (C) | Diane (plateforme IA interne de la DGFiP, agent RH de Lyzr) |
| Relation client | **Émile** (E, m, « e-mail ») | Rosalie (≈ Rosie AI, réserve faible) ou Célestin | Clément, Clémence (≈ Clementine, cabinet en ligne) |

Jeu recommandé : **B S G A V C R F H O P E**, douze initiales distinctes, **6 prénoms féminins et 6
masculins**, et aucun schéma de stéréotype : Commercial et Informatique au féminin, RH du cabinet et
Relation client au masculin. Trois noms existent chez les deux concurrents à la fois (Max, Kai,
Vera) : aucun n'est retenu.

**Lignes d'une phrase** (vocabulaire §9, une tâche concrète, la validation dite) :

| Agent | Ligne de la carte |
|---|---|
| Balthazar · Comptabilité | Relance les pièces manquantes, prépare la saisie et le rapprochement bancaire, et vous présente chaque écart avant l'écriture. |
| Salomé · Paie et social | Contrôle les variables et les bulletins avant la DSN, trie les retours DSN et vous présente chaque écart à valider. |
| Grégoire · Juridique et fiscal | Prépare l'approbation des comptes, les registres et les échéances fiscales du portefeuille, sans rien déposer à votre place. |
| Aude · Missions d'audit | Prépare la sélection des tiers selon votre règle, les écarts de confirmation et les fichiers du client à rapprocher de la balance ; l'appréciation et l'opinion restent au commissaire aux comptes. |
| Victoire · Commercial | Prépare l'entrée en relation d'un nouveau client et sa lettre de mission : pièces à réunir, jalons, documents qui attendent la signature. |
| Colette · Communication | Rédige la lettre d'information de vos clients à partir de l'actualité que vous avez retenue ; rien ne part sans votre relecture. |
| Raphaël · RH du cabinet | Prépare la synthèse annuelle de rémunération et l'arrivée d'un collaborateur, en agrégats, sans jamais noter personne. |
| Florent · Finance | Prépare le prévisionnel, la trésorerie prévisionnelle et les situations de vos clients à partir de la comptabilité tenue, hypothèses tracées. |
| Honoré · Gestion du cabinet | Prépare la facturation des honoraires et des actes hors forfait, suit les rejets de prélèvement et l'avancement du portefeuille, en agrégats. |
| Octavie · Informatique et outils | Relie vos logiciels par export ou par API, contrôle chaque import et le rejoue sans doublon. |
| Prudence · Protection des données | Tient le registre des traitements du cabinet et prépare les réponses aux demandes d'accès de vos clients ; votre référent décide. |
| Émile · Relation client | Trie la boîte mail par client et par priorité, prépare les réponses types et suit l'envoi des plaquettes ; rien ne part sans validation. |

La ligne d'Aude reprend les points de départ que l'accueil CAC affiche déjà (la réception du FEC et
la revue analytique restent dans la suite d'audit du cabinet). Celle de Prudence parle des
obligations RGPD **du cabinet**, pas des engagements de Memlia, qui restent sur `/garanties` ; ses
références réglementaires (registre, droit d'accès) se vérifient sur source datée en phase 2.

## 9. Le nom du hub : candidats notés

Note de 1 à 5 par critère. « Demande mesurée » : Bing, autocomplétion et Search Console (pas de
Google, §1). Vérification web du 14/10 : aucun acteur comptable français n'emploie « spécialistes
IA », « renforts IA » ni des agents à prénom comme nom de rubrique ; Karbon (éditeur) range des
agents par rôle avec un bouton « ajouter à l'équipe » ; « agents IA » est un terme générique, pas une
marque. Ce n'est pas un avis juridique.

| Candidat | URL | Clarté | Charte | Distance RunBot / Experts | Demande mesurée | URL | Avec les prénoms | Total |
|---|---|---|---|---|---|---|---|---|
| **Agents IA** | `/agents-ia` | 5 | 3 (définir « agent », jamais « autonome ») | 3 (« agents » est aussi leur mot) | 4 | 5 | 5 | **25** |
| Par métier | `/par-metier` | 4 | 5 | 5 | 1 | 3 | 2 | 20 |
| Les renforts | `/renforts` | 2 | 5 (renfort, pas remplacement) | 5 | 1 (et l'aide « RENFORT » de 2022, attestée par les experts-comptables) | 2 | 4 | 19 |
| Spécialistes IA | `/specialistes-ia` | 4 | 4 | 2 (« A specialist… », titre du héros d'agpt) | 1 | 4 | 4 | 19 |
| Assistants IA | `/assistants-ia` | 4 | 3 | 4 | 1 (SERP de fiches métier) | 4 | 3 | 19 |
| Le relais | `/relais` | 3 | 4 | 5 | 1 | 2 | 3 | 18 |
| Équipe IA | `/equipe-ia` | 4 | 1 (« équipe » = celle du cabinet, 251 occurrences) | 2 | 1 | 4 | 4 | 16 |
| Collaborateurs IA | — | 3 | **0** (le collaborateur est l'humain qui valide) | 3 | 1 | 4 | 4 | écarté |

**Recommandation : « Agents IA »**, H1 intent-first du hub : *« Agents IA pour cabinet d'expertise
comptable : chacun prépare un métier, vos collaborateurs valident. »* (à confirmer par les volumes
Google, D14).

## 10. Le bloc à la place d'Otto

**« Derrière chaque agent, nous. »** Une carte pleine largeur, à la place de la bannière du
coordinateur, sans avatar de persona : le **lockup Memlia** à la place de la figurine. Cinq gestes
en ligne, dans l'ordre de la charte : **observer** la tâche telle qu'elle se fait ; **écrire** sa
règle dans vos mots ; **l'éprouver** sur un jeu d'essai fictif ; la faire **recetter** par vos
équipes ; la **maintenir**. Lien vers `/methode`. Ce bloc porte le pôle Méthode et décision humaine
(choisir et cadrer, règle et recette, validation et refus, mesure) : c'est la réponse à « qui est
derrière ? » sans inventer d'équipe.

## 11. Amendement de charte proposé (§9 bis, à valider par Kevin)

> **Les agents IA (14/10/2026).** Un *agent IA*, chez Memlia, est la règle écrite des tâches d'un même
> métier du cabinet, mise en œuvre dans vos outils. Il prépare, il s'arrête dans le doute, votre
> collaborateur valide. Il porte un prénom pour être reconnu ; il ne parle pas à la première
> personne, ne se présente ni comme un collègue ni comme un membre de l'équipe, et n'envoie rien.
>
> **Il promet** : la tâche prise entière, la frontière en trois colonnes, l'arrêt dans le doute, le
> rejeu sur un dossier fictif quand la règle est écrite, et une proposition que le cabinet valide.
> **Il ne promet jamais** : l'autonomie, un envoi sans validation (mail, relance, newsletter,
> publication, réponse client, déclaration, facture), un gain chiffré, une compétence réglementée :
> il n'est ni expert-comptable, ni commissaire aux comptes, ni avocat, ni délégué à la protection
> des données désigné.
>
> **Se définit à sa première apparition sur chaque page.** **Ne s'écrit jamais** : agent autonome,
> collaborateur IA, employé IA, « embaucher » ou « recruter » un agent, « votre nouveau collègue »,
> agent IA CAC, commissaire aux comptes IA, DPO IA. Le métier d'audit se dit « missions d'audit » ;
> le titre de commissaire aux comptes désigne le lecteur. L'agent RH ne note ni ne surveille
> personne : préparation de documents et agrégats seulement.
>
> **Place dans la navigation** : sous « Ce qu'on automatise », à côté du pilier (par tâche) et de la
> page des outils. L'appel principal reste « Confier une première tâche ».

À ajouter au §9 « On dit » : *agent IA* (avec sa définition). Au §9 « On ne dit jamais » : les
expressions ci-dessus. Au §7 : les lignes du hub et des fiches.

## 12. Navigation, formulaire, page des outils

- **Navigation (D9)** : « Ce qu'on automatise » devient un menu à trois entrées (Par tâche · Par
  métier · Dans vos outils), sur le modèle du menu « Cabinets » qui existe déjà
  (`navigation.mjs`). Le nombre d'entrées de premier niveau ne change pas ; `site.spec.ts`,
  `navigation-attendue.mjs` et `navigation-v3.test.mjs` sont mis à jour délibérément ; le menu mobile
  reste refermable (mémoire du 16/09) et la navigation sans JavaScript garde ses liens.
- **Formulaire « Par quelle tâche commencer ? »** : aucun pré-remplissage n'existe aujourd'hui
  (`contact-messages.mjs` ne porte que des messages d'erreur). Voie la plus sûre : un **identifiant
  de tâche pris dans une liste blanche** partagée, transmis au clic par `sessionStorage` à usage
  unique (précédent : bibliothèque de prompts → générateur), qui présélectionne un champ visible et
  facultatif ; jamais de texte libre, jamais de message pré-écrit, jamais l'accord de provenance
  pré-coché. Côté serveur : validation par liste blanche, migration D1 avec `CHECK IN`, politique
  de confidentialité mise à jour. À arbitrer en phase 2 : `sessionStorage` (rien dans l'URL) ou
  `?tache=<id>` (aucune donnée personnelle, mais visible dans les journaux et le référent).
- **Page des outils (D10)** : `/integrations` répond aujourd'hui à « guides par environnement
  comptable » (12 guides par tâche × éditeur). Recommandation : en faire la page des outils, une
  section par domaine (comptabilité, paie, juridique, audit, messagerie, classeurs, GED…), chaque
  outil avec **un statut parmi trois** : *Éprouvé* (une automatisation livrée **et recettée** le
  touche : aujourd'hui Excel, les exports Silae, le fichier ACD au format « modif »), *Par export*
  (format connu, aucune recette), *Sur demande* (formats et accès vérifiés avant devis, charte §4) ;
  aucun total ; logos seulement après lecture des règles de marque de chaque éditeur, sinon le nom
  en texte ; mention « marques de leurs propriétaires, sans partenariat ». Les guides deviennent
  ses pages de détail. Planity et Prestashop (caisse et e-commerce) passeront « Éprouvé » à la
  recette, pas avant.

## 13. Décisions antérieures que ce chantier rouvre

| Document | Ce qu'il ferme | Ce que propose l'ADR 0001 |
|---|---|---|
| `ARCHITECTURE-ACCES-COMMERCIAUX.md` (20/09, réconcilié le 28/09) §1.4 | toute liste publique de « tout ce que nous faisons » | le hub est une liste par métier ; le catalogue du pilier (13/10) l'a déjà entamé |
| idem §2 | page par pôle ; croisement tâche × logiciel × rôle | une fiche par métier, qui regroupe des pôles ; un seul niveau sous `/automatisation/` reste la règle |
| `QUALIFICATION-INTEGRATION-CONNECTEURS.md` (06/10) | `/integrations` « pas un catalogue de connecteurs » ; ne pas ouvrir `/automatisation/integration-connecteurs` | `/integrations` devient la page des outils **sans total ni promesse de branchement** ; la page service connecteurs reste fermée |
| `backlog-v3.json`, article planifié `ia-cabinet-comptable` (note) | « refus figés : pages par pôle/rôle », réécrites vers le terme de tête | le hub et ses fiches sont précisément des pages par métier ; l'article garde l'intention informationnelle « IA au cabinet » et lie le hub dans les deux sens |
| `SITE-STRUCTURE.md:77` | `rolePrincipal` (taxonomie de rôles du frontmatter) dans une URL | inchangé : les fiches ont leur propre identifiant de métier, distinct de `rolePrincipal` |

Ces documents sont des cartes d'agents fondées sur des mesures, pas des décisions de Kevin ; ils
restent lisibles comme historique.

## 14. Contraintes techniques à tenir en phases 2 et 3 (relevées dans le dépôt)

- `test_build.py` dérive les pages fixes de `src/pages` et **ignore les routes dynamiques** ; le
  sitemap est comparé à une liste stricte : une route `[metier].astro` exige de mettre le test à
  jour. Chaque route non-blog a son `sha256` et son `lastmod` dans `pages-lastmod.json`.
- `verify-page-contract.mjs` : source retrouvée par `sourceForRoute` (à étendre au nouveau préfixe),
  un média propre par page (sinon contrat `no-functional-media` motivé), og:image absolue en JPG ou
  PNG, entrée dans `page-intent-contract.json` avec `descriptionLead`, og:title = H1 = headline,
  au moins un lien entrant, footer conforme.
- `schema-render.test.mjs` : un seul `BreadcrumbList` par page, **au plus un nœud `Service`** ; le
  hub porte donc `CollectionPage` + `ItemList`, pas douze `Service`. `schema.mjs` n'a pas
  d'utilitaire `ItemList`, `FAQPage` ni de fil d'Ariane à trois niveaux : à écrire.
- `test_positioning.py` parcourt tout `dist/`, attributs compris : « module », « compléments Excel »
  et les noms internes des automatisations (`suivi.social`, `synth.se.salaires`, `flux.compta`…)
  sont interdits jusque dans les slugs, classes et identifiants.
- `llms.txt` est statique ; `llms-inventory.mjs` code les hubs en dur (`/integrations`,
  `/outils-comptables-gratuits`, `/blog`) : ajouter `/agents-ia`.
- `data-driven-counts.test.mjs` : tout compteur public se dérive des données.
- **Aucune CSP globale** : `_headers` n'en pose que sur `/contact` et les outils. Le rejeu des fiches
  ne fait aucune requête réseau ; poser une CSP `connect-src 'none'` sur `/agents-ia/*` en fait un
  invariant vérifiable.
- `estLienCommercialBlog` n'accepte pas le hub : à élargir pour le maillage depuis le blog.
- Le système de page du 07/10 fixe les formes (carte cliquable entière, lignes, bande, étapes,
  questions), **trois colonnes de cartes au plus** et **aucune capitale** dans un surtitre (D13).

## 15. Après la porte 1

1. Reporter les choix de Kevin dans ce document, passer l'ADR 0001 en `accepted` et créer
   `GLOSSARY.md` avec les termes arrêtés (agent IA, métier, famille titulaire).
2. Phase 2 : spécification du hub, des fiches et de la page des outils ; bible et prompts d'images
   (`docs/design/hub-specialistes/prompts-images.md`), pilote d'abord ; `superpowers:writing-plans`,
   puis proposer `/to-spec` et `/to-tickets` (tickets dans `.scratch/hub-specialistes/issues/`).
3. Rejouer DataForSEO dès la levée de la suspension, et revoir D1, D2 et le §6 si les volumes
   Google le demandent.
