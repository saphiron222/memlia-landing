# Avatars des agents IA — bible de style et prompts ChatGPT

> **Statut : à valider à la porte 2**, en commençant par le **pilote** (§3). Décision D12 du
> [cadrage](../../strategy/site-v3/HUB-SPECIALISTES-CADRAGE.md) : la même famille de technique
> que les avatars d'agpt.co (figurines en argile mate), **jamais leur personnage**. Aucune génération
> payante n'est lancée depuis une session : Kevin génère dans ChatGPT.

## 1. Ce que la référence nous apprend, et ce que nous en faisons

Relevé du 14/10/2026 (cadrage §3) : agpt montre des figurines 3D en argile mate, toutes de la même
silhouette (un corps en quille, une tête-galet séparée, une écharpe crème), différenciées par la
couleur de leur catégorie et la forme de leur tête ; aucune ne porte d'objet ni de trait humain au-delà
d'un visage minimal. Nous gardons **la technique, la lumière, le fond et le cadrage**. Nous changeons
**la silhouette, la signature et le sens** :

| | agpt | Memlia |
|---|---|---|
| Silhouette | quille + tête-galet séparée | **un galet debout d'un seul tenant**, dont la forme change d'un agent à l'autre |
| Signature commune | écharpe crème en travers du corps | **un anneau vert Memlia `#27b657`** à la base, comme un socle |
| Ce qui distingue | couleur et forme de tête | couleur du pôle, forme du galet **et un attribut de métier** posé à côté |
| Visage | yeux ovales, sourcils, sourire | **deux petits yeux ronds et un sourire fermé**, sans sourcils |

## 2. La bible commune (à recopier en tête de chaque prompt)

**Technique** : rendu 3D d'une figurine en argile mate, comme une céramique douce faite à la main :
grain fin, très légère moucheture, bords adoucis, aucune brillance plastique. Objet de collection
sobre, pas un jouet criard. **Non photoréaliste.**

**Sujet** : un galet debout, d'un seul tenant, sans bras ni jambes ni cou. Visage minimal au tiers
haut : deux petits yeux ronds noirs mats et un petit sourire fermé, rien d'autre. Expression calme et
attentive. À la base, un anneau fin et plat vert `#27b657`, mat, qui sert de socle. **Un seul**
attribut de métier, petit, posé au sol contre le galet ou à côté, dans des tons crème, encre `#231f20`,
vert profond `#1c8a41`, bois clair ou laiton mat.

**Couleur** : le corps prend la teinte de son pôle, adoucie vers l'argile (§4) ; avec l'anneau vert,
c'est la seule couleur saturée de l'image.

**Lumière** : studio douce et diffuse, principale en haut à gauche, débouchage de face, ombre de
contact douce sous le socle, aucun reflet dur ; légèrement chaude.

**Cadrage** : image carrée 1024 × 1024, fond uni crème `#fffefb` sans dégradé ni décor ni sol visible
(l'ombre de contact suffit). Figurine centrée ; **le haut du galet à 18 % du haut de l'image, la base
de l'anneau à 82 %** : même hauteur pour toute la série. Vue de face, légèrement de trois quarts
(10 à 15°), caméra à mi-hauteur.

**Interdits** : aucun texte, lettre, chiffre, logo, filigrane, signature ni marque ; aucun écran ni
interface ; aucun humain, main, visage réaliste ni ressemblance avec une personne réelle ; aucun
attribut de genre (cheveux, maquillage, vêtement, bijou) ni d'origine ; aucun stéréotype de métier ;
aucun robot, circuit, cerveau, néon, halo ni effet « IA » ; aucun objet en plus de l'attribut ; pas de
fond transparent (le crème uni sert à la mesure de palette).

## 3. Marche à suivre dans ChatGPT

1. **Le pilote d'abord** : générer **Balthazar** (§5, IMG-25) avec la bible complète. Kevin le juge :
   matière, silhouette, anneau, attribut, lumière, cadrage. On corrige la bible ici, jamais au cas par
   cas, et on régénère le pilote jusqu'à validation.
2. **Une fois le pilote validé**, pour chacun des onze autres : nouvelle conversation, **joindre
   l'image du pilote** et écrire en tête *« Même style, même matière, même lumière, même cadrage, même
   hauteur et même anneau vert que l'image jointe. Seuls changent la forme du galet, sa couleur et
   l'objet. »*, puis le prompt de l'agent.
3. Format : **carré, 1024 × 1024, PNG**. Une image retenue par agent ; garder les essais refusés hors
   du dépôt.
4. **Dépôt** : `~/dev/interne/memlia-landing-sources/hub-agents-ia/` (hors de tout dépôt git), un
   fichier par agent nommé comme au §5.
5. **Au retour, la session** : convertit chaque PNG en AVIF et WebP aux largeurs du manifeste
   (`src/data/images.mjs` ; carré, largeurs 168, 256 et 512 pour les cartes et le héros), écrit son
   `alt` (§6) et son brief `public/images/brief-img-NN-agent-<identifiant>.md` (convention des briefs
   existants), **mesure sa palette** (`node scripts/mesurer-palette.mjs <png> "#fffefb,#27b657,<accent>"`)
   et vérifie que deux agents voisins dans l'annuaire restent distincts. Une image qui échoue à la
   mesure ou montre du texte accidentel retourne à la génération.

## 4. Teintes par agent

Le corps prend l'accent de son pôle (`src/data/familles.ts`), éclairci vers l'argile. Le ton visé est
une **intention** ; la mesure tranche après génération.

| Agent | Pôle de la teinte | Accent | Ton argile visé |
|---|---|---|---|
| Balthazar · Comptabilité | `production-comptable` | `#1c8a41` | vert sauge |
| Salomé · Paie et social | `paie-social` | `#be123c` | rose terre, jamais rouge vif |
| Grégoire · Juridique et fiscal | `juridique-fiscal` | `#4b5563` | gris ardoise bleuté |
| Florent · Finance | `conseil-missions` | `#0f766e` | céladon |
| Aude · Missions d'audit | `audit-cac` | `#78716c` | grès chaud |
| Victoire · Commercial | `developpement-cabinet` | `#c2410c` (proposé) | terre cuite claire |
| Colette · Communication | `developpement-cabinet` | `#c2410c` (proposé) | terre cuite plus pâle, forme distincte |
| Émile · Relation client | `administratif-secretariat` | `#6d28d9` | lavande grisée |
| Honoré · Gestion du cabinet | `facturation-recouvrement` | `#b5651d` | sable cuivré |
| Raphaël · RH du cabinet | `rh-formation` | `#9d174d` | vieux rose foncé, plus sombre que Salomé |
| Octavie · Informatique et outils | `excel-outils-existants` | `#a16207` | ocre doux |
| Prudence · Protection des données | `numerique-it-data` | `#1d4ed8` | bleu pervenche |

Paires proches à départager à la mesure : Salomé et Raphaël (deux roses, séparés par la valeur),
Honoré, Octavie et Victoire (trois tons chauds), Grégoire et Aude (deux gris, l'un froid, l'autre
chaud).

## 5. Les prompts

Chaque prompt se lit **après la bible du §2** (pilote) ou après la phrase de reprise du §3 (suite).

| IMG | Fichier | Agent | Forme du galet | Attribut | Posture |
|---|---|---|---|---|---|
| 25 | `img-25-agent-comptabilite.png` | Balthazar · Comptabilité | large et posé, sommet arrondi | une petite balance à plateaux en laiton mat, une feuille pliée vierge sur un plateau | légèrement tourné vers la balance |
| 26 | `img-26-agent-paie-social.png` | Salomé · Paie et social | ovale élancé | une enveloppe blanche à fenêtre, vide, appuyée contre le socle | droite, attentive |
| 27 | `img-27-agent-juridique-fiscal.png` | Grégoire · Juridique et fiscal | rectangle aux angles très arrondis | un petit registre relié de toile vert profond, un ruban marque-page | stable, très légèrement penché en avant |
| 28 | `img-28-agent-finance.png` | Florent · Finance | goutte arrondie, base plus large | trois petits blocs de bois clair de hauteurs croissantes | droit |
| 29 | `img-29-agent-missions-audit.png` | Aude · Missions d'audit | rond et plein | une loupe à manche de bois posée devant une chemise cartonnée fermée | penchée vers la loupe |
| 30 | `img-30-agent-commercial.png` | Victoire · Commercial | légèrement incliné vers l'avant, dynamique | une chemise cartonnée nouée d'un ruban vert profond | inclinée, accueillante |
| 31 | `img-31-agent-communication.png` | Colette · Communication | fin et haut | une plume d'écriture et une feuille pliée en lettre, vierge | droite, légère inclinaison de côté |
| 32 | `img-32-agent-relation-client.png` | Émile · Relation client | en œuf | trois enveloppes vierges rangées en éventail dans un petit trieur de bois | tourné vers le trieur |
| 33 | `img-33-agent-gestion-cabinet.png` | Honoré · Gestion du cabinet | trapu, sommet plat arrondi | un petit classeur à anneaux fermé et une pile de feuilles agrafées vierges | stable |
| 34 | `img-34-agent-rh-cabinet.png` | Raphaël · RH du cabinet | dôme doux | une petite plante verte dans un pot de terre cuite | penché vers la plante |
| 35 | `img-35-agent-informatique-outils.png` | Octavie · Informatique et outils | aux faces très légèrement facettées | deux pièces de puzzle en bois clair emboîtées | droite |
| 36 | `img-36-agent-protection-donnees.png` | Prudence · Protection des données | compact et symétrique | un petit cadenas fermé en laiton mat, sans inscription | droite, posée |

**Prompt type** (remplacer les passages en gras par la ligne de l'agent ; exemple du pilote) :

> Figurine 3D en argile mate, céramique douce faite à la main, grain fin, légère moucheture, non
> photoréaliste. Un galet debout d'un seul tenant, **large et posé, sommet arrondi**, couleur **vert
> sauge** ; sans bras, sans jambes. Visage minimal au tiers haut : deux petits yeux ronds noirs mats et
> un petit sourire fermé, sans sourcils ; expression calme et attentive. À la base, un anneau fin et
> plat vert #27b657, mat. Posé au sol à côté : **une petite balance à plateaux en laiton mat, une
> feuille pliée vierge sur un plateau** ; le galet est **légèrement tourné vers la balance**. Lumière
> de studio douce et diffuse, principale en haut à gauche, ombre de contact douce, aucun reflet dur.
> Fond uni crème #fffefb, sans dégradé ni décor. Image carrée 1024 × 1024 ; figurine centrée, haut du
> galet à 18 % du haut, base à 82 % ; vue de face légèrement de trois quarts. Aucun texte, chiffre,
> lettre, logo, filigrane ; aucun humain ; aucun effet « IA ».

### IMG-37 : le visuel du héros à trois agents

Le héros compose **en HTML** les trois avatars Balthazar, Salomé et Grégoire en médaillons décalés
(celui du milieu plus bas), comme la référence : la page n'a besoin d'aucune image de plus. Une image
de groupe ne sert que de **visuel social** du hub (1200 × 630) ; si Kevin la veut :

> [bible] Trois figurines de la même série côte à côte, mêmes proportions : à gauche le galet vert sauge
> à la balance, au centre le galet rose terre à l'enveloppe, légèrement en retrait, à droite le galet
> gris ardoise au registre. Format paysage 1200 × 630, fond uni crème #fffefb, ombres de contact
> douces, même lumière ; marges larges, aucun texte.

## 6. Les `alt` (à confirmer contre l'image rendue)

Forme : *« <Prénom>, agent IA <métier> : figurine d'argile <ton> posée près de <attribut> »*. Exemple :
*« Balthazar, agent IA comptabilité : figurine d'argile vert sauge posée près d'une petite balance »*.
Dans une carte dont le prénom est déjà écrit, l'image est décorative (`alt=""`) pour ne pas répéter le
nom au lecteur d'écran ; l'`alt` complet sert dans le héros et les fiches.
