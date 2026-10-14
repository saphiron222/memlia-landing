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
5. **Au retour, la session** : garde le maître sans perte dans `docs/design/hub-specialistes/avatars/`,
   produit les dérivés AVIF et WebP carrés (128, 256 et 512 px) dans `public/agents/` (pas dans
   `public/images/`, dont le build compte les images d'articles), écrit son `alt` (§6) et son brief
   `docs/design/hub-specialistes/briefs/<identifiant>.md` dans la grammaire des briefs existants, chaque
   couleur nommée épinglée par son hex, **mesure sa palette** (`node scripts/mesurer-palette.mjs <png> "#fffefb,#27b657,<accent>"`)
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

### 5 bis. Prompts prêts à coller

Le pilote se colle seul. Chacun des onze suivants se colle dans une **nouvelle conversation**, avec
**l'image du pilote validé jointe**.

**IMG-25 · Balthazar · Comptabilité (pilote, sans image jointe)** : le prompt type ci-dessus, tel quel.

**Phrase de reprise**, en tête des onze suivants : *Même style, même matière, même lumière, même
cadrage, même hauteur et même anneau vert #27b657 que l'image jointe. Seuls changent la forme du
galet, sa couleur et l'objet posé à côté.* Puis :

- **IMG-26 · Salomé · Paie et social** : Un galet debout d'un seul tenant, ovale élancé, couleur rose
  terre (jamais rouge vif). Posée au sol contre le socle : une enveloppe blanche à fenêtre, vide. Le
  galet se tient droit, attentif.
- **IMG-27 · Grégoire · Juridique et fiscal** : Un galet debout d'un seul tenant, en rectangle aux
  angles très arrondis, couleur gris ardoise bleuté. Posé au sol à côté : un petit registre relié de
  toile vert profond #1c8a41, avec un ruban marque-page. Le galet est stable, très légèrement penché
  en avant.
- **IMG-28 · Florent · Finance** : Un galet debout d'un seul tenant, en goutte arrondie à la base
  plus large, couleur céladon. Posés au sol à côté : trois petits blocs de bois clair de hauteurs
  croissantes. Le galet se tient droit.
- **IMG-29 · Aude · Missions d'audit** : Un galet debout d'un seul tenant, rond et plein, couleur grès
  chaud. Posée au sol devant lui : une loupe à manche de bois, devant une chemise cartonnée fermée. Le
  galet est penché vers la loupe.
- **IMG-30 · Victoire · Commercial** : Un galet debout d'un seul tenant, légèrement incliné vers
  l'avant, couleur terre cuite claire. Posée au sol à côté : une chemise cartonnée nouée d'un ruban
  vert profond #1c8a41. Le galet est incliné, accueillant.
- **IMG-31 · Colette · Communication** : Un galet debout d'un seul tenant, fin et haut, couleur terre
  cuite très pâle. Posées au sol à côté : une plume d'écriture et une feuille pliée en lettre, vierge.
  Le galet se tient droit, légèrement incliné sur le côté.
- **IMG-32 · Émile · Relation client** : Un galet debout d'un seul tenant, en forme d'œuf, couleur
  lavande grisée. Posé au sol à côté : un petit trieur de bois où trois enveloppes vierges sont rangées
  en éventail. Le galet est tourné vers le trieur.
- **IMG-33 · Honoré · Gestion du cabinet** : Un galet debout d'un seul tenant, trapu, au sommet plat
  arrondi, couleur sable cuivré. Posés au sol à côté : un petit classeur à anneaux fermé et une pile de
  feuilles vierges agrafées. Le galet est stable.
- **IMG-34 · Raphaël · RH du cabinet** : Un galet debout d'un seul tenant, en dôme doux, couleur vieux
  rose foncé, nettement plus sombre qu'un rose terre. Posée au sol à côté : une petite plante verte
  dans un pot de terre cuite. Le galet est penché vers la plante.
- **IMG-35 · Octavie · Informatique et outils** : Un galet debout d'un seul tenant, aux faces très
  légèrement facettées, couleur ocre doux. Posées au sol à côté : deux pièces de puzzle en bois clair,
  emboîtées. Le galet se tient droit.
- **IMG-36 · Prudence · Protection des données** : Un galet debout d'un seul tenant, compact et
  symétrique, couleur bleu pervenche. Posé au sol à côté : un petit cadenas fermé en laiton mat, sans
  aucune inscription. Le galet se tient droit, posé.

**Fin commune** des onze : *Fond uni crème #fffefb, sans dégradé ni décor. Image carrée 1024 × 1024,
figurine centrée, même hauteur que l'image jointe. Aucun texte, chiffre, lettre, logo ni filigrane ;
aucun humain ; aucun effet « IA ».*

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

## 7. Revue de la série livrée le 15/10/2026

Livraison de Kevin : `~/dev/interne/memlia-landing-sources/hub-agents-ia/figurines-2026-10-15/` (12 PNG
1024², WebP 1024 et 512, originaux 1254², manifeste, prompts). Mesures : scripts du scratchpad de la
session (`mesure-figurines.mjs`, `anneaux.mjs`, `planche-objets.mjs`), copiés avec les pièces de recherche.

| Contrôle | Mesure | Verdict |
|---|---|---|
| Format, opacité | 12 × 1024², aucun canal alpha | conforme |
| Fond | coins entre `#fdfdfa` et `#fefefc` (cible `#fffefb`) | conforme |
| Silhouette | galet d'un seul tenant, aucune tête séparée ni écharpe | distincte d'agpt |
| Texte accidentel | planche des objets à pleine résolution : enveloppes, registre, classeur, cadenas vierges | aucun |
| Anneau | présent sur les douze ; vert **rendu** médian ≈ `#3d8545` (le `#27b657` sous lumière mate) | conforme ; **la mesure de la tâche 12 épingle ce vert rendu**, pas le hex CSS, sinon elle refuse à tort |
| Couleurs des corps | ΔE (CIE76) entre corps : **Balthazar ~ Florent 7,4** ; les autres paires ≥ 11 | **Florent à régénérer** |
| Cadrage | haut du corps entre 13,3 % et 20,7 % (cible 18 %) ; base entre 77,2 % (Aude) et 81,6 % | variation due aux formes voulues ; Aude un peu haute, sans gravité à 84 px |
| Sens des objets | le dossier de Victoire porte un nœud décoratif : il se lit comme un **paquet cadeau** | à reprendre (un cadeau évoque l'avantage commercial) |
| Sens des objets | la balance de Balthazar peut se lire « justice » | à arbitrer, faible : c'est le jeu de mots « balance » de la bible |

**Reprises** (nouvelle conversation, joindre `png/01-balthazar.png`, phrase de reprise du §5 bis, puis) :

- **Florent · Finance** : Un galet debout d'un seul tenant, en goutte arrondie à la base plus large,
  couleur céladon : un vert d'eau nettement bleuté, proche de #8fb8b3, très différent du vert sauge de
  l'image jointe, sans aucune nuance olive ni jaune. Posés au sol à côté : trois petits blocs de bois
  clair de hauteurs croissantes. Le galet se tient droit.
- **Victoire · Commercial** : Un galet debout d'un seul tenant, légèrement incliné vers l'avant, couleur
  terre cuite claire. Posée au sol à côté : une chemise cartonnée kraft fermée par un ruban plat vert
  profond #1c8a41 noué d'un simple nœud plat, sans boucle décorative : un dossier administratif, pas un
  paquet cadeau. Le galet est incliné, accueillant.

Puis la fin commune du §5 bis. Remplacer les deux fichiers sous le même nom ; la session refait la
mesure.

**Emplacement sur le site** : le README de la livraison propose `public/images/agents-ia/` ; le plan
retient `public/agents/` (annexe ARCHITECTURE §5 : `test_build.py` compte les images d'articles sous
`public/images/`, et `strip-briefs.mjs` y opère). Les WebP livrés servent de sources ; les dérivés
AVIF et WebP (128, 256, 512) sont produits par la tâche 12.
