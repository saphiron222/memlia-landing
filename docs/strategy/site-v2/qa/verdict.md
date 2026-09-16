# Recette croisée du site v2 — verdict

Carte `t_80055166` SITE-V2-QA. Candidat revu : branche `site/v2`, worktree de recette
`/Users/kevinkitanga/dev/interne/memlia-landing/.worktrees/site-v2-qa`.

## Méthode

Trois relectures **indépendantes** ont été conduites en parallèle, chacune sur un axe, sans
connaissance du raisonnement de construction : marque et promesses, navigation et
accessibilité, SEO technique et déploiement. Chacune devait citer ou mesurer chaque défaut,
et n'avait le droit de rien réécrire.

Deux ont rendu **FAIL**, une **PASS**. Les deux FAIL convergeaient sur le même défaut
principal — convergence qui compte davantage qu'un verdict isolé, puisque les relecteurs ne
se lisaient pas.

Les défauts ont été corrigés, puis **renvoyés à leurs auteurs** pour contre-vérification sur
le déploiement corrigé. Déclarer la recette passante sans cette contre-vérification aurait
été une auto-certification : le constructeur aurait jugé ses propres correctifs.

## Défauts retenus et leur sort

| # | Niveau | Défaut | Sort |
|---|---|---|---|
| 1 | Bloquant | Kevin Kitanga déclaré sous deux identités de schéma distinctes, sans lien ; la page qui le présente ne recevait aucune attribution | Corrigé — un seul nœud `Person`, porté par la page d'identité, cité par le blog et les trois articles. **Fermeture confirmée par les deux relecteurs.** |
| 2 | Bloquant | `/a-propos` situait la société à Plérin en citant comme preuve les mentions légales, qui donnent Paris | Corrigé — le lieu de travail est distingué du siège social. **Fermeture confirmée.** |
| 3 | Bloquant | La seule affirmation juridique de `/garanties` renvoyait à un glossaire ne portant pas la source déclarée au registre | Corrigé — devenue une position de conception assumée, sans invoquer un cadre non sourcé. **Fermeture confirmée.** |
| 4 | Important | Second nœud `Service`, que le contrat de schéma interdit nommément | Corrigé — une définition partagée, `url` migrée vers la page service. **Fermeture confirmée**, puis la description dédoublée signalée en contre-vérification a été fermée à son tour. |
| 5 | Important | L'accueil ne liait aucune des cinq pages depuis son corps | Corrigé — les quatre résumés d'orientation de la copy transversale, au mot près. **Fermeture confirmée.** |
| 6 | Important | Le contrôle des six ancres historiques lisait `dist/`, exclu du dépôt : sur un checkout propre il rendait PASS sans rien vérifier | Corrigé — il lit les sources, toujours présentes, et le rendu en plus. **Un témoin vert et deux mutants rouges** l'ont prouvé discriminant sur ses deux chemins. |
| 7 | Important | Le contrat de release Ressources épinglait des empreintes périmées par le rescellement | Corrigé — réalignées, avec la cause écrite dans le fichier. **Fermeture confirmée.** |
| 8 | Important | `llms.txt` décrivait un site à deux pages quand le candidat en sert douze | Corrigé — neuf destinations déclarées, aucune déclarée non servie. **Fermeture confirmée.** |
| 9 | Mineur | Appel à l'action des articles pointant Cal.com dans leurs octets scellés ; pas de lien vers la méthode | Corrigé au gabarit, sans toucher aux octets des articles. |
| 10 | Mineur | Cibles du pied de page à 18 px et texte à 14/12 px sur mobile | Corrigé — 40 px et 16 px sous 64rem. Le relecteur avait mesuré que l'exception d'espacement WCAG 2.5.8 AA était satisfaite ; l'amélioration reste un confort, pas une mise en conformité. |
| 11 | Mineur | Deux libellés « Lire les méthodes » menant au Blog ; une fréquence avancée sans mesure sur `/contact` | Corrigés. |

## Ce que la recette a mesuré

Les dix critères de la carte et leur preuve sont dans `criteres.json`. La chaîne d'identité du
candidat, du commit aux octets servis, est dans `identite-candidat.json`.

Un point mérite d'être lu : **le candidat se reconstruit à l'identique depuis un checkout
propre** — 71 fichiers, aucune différence avec le build de développement. Le dossier déployé
ne diffère du build que par la balise `robots`, sur les 15 pages, et les 20 routes distantes
correspondent octet pour octet.

## Une asymétrie preview / production, à connaître avant la release

La comparaison du build sain avec la production a révélé que **Cloudflare réécrit les liens
`mailto:` en production** (`/cdn-cgi/l/email-protection#…`), mais pas sur le domaine de
prévisualisation. Une prévisualisation ne peut donc pas prouver le rendu des liens de
courriel en production : ce contrôle doit être refait après publication, sur le domaine réel.

C'est le second transformateur de bord du site, après le bandeau d'analyse. Un contrôle
d'identité par les octets doit compter les deux, sinon il conclut à une divergence de contenu
là où il n'y a qu'une réécriture d'infrastructure.

## Réserves, non corrigées et assumées

- **L'accueil dit encore avant elles ce que les cinq pages détaillent.** Les résumés y mènent,
  mais les sections historiques gardent le détail. L'alléger est une décision éditoriale,
  hors du périmètre de cette carte.
- **Aucune preuve illustrée sur les cinq pages neuves**, alors que l'inventaire en annonce
  pour la méthode et les garanties. Un visuel exige un brief écrit et une génération.
- **Deux documents de référence se contredisent sur la frontière du produit** : la signature
  du pied dit « L'IA automatise le travail répétitif », le document de structure dit « L'IA
  prépare ». Le candidat a suivi la copy transversale. Arbitrage de Kevin.
- **La revue métier du dossier Ressources est épinglée au jour même** : le contrat exige des
  copies de source du jour. Sans nouvelle vérification, le dossier redevient rouge le
  lendemain.
- **Le score qualité de 100 reste normalisé sur 85 points mesurables**, la ligne SERP étant ND.

## Verdict : PASS

Les trois défauts bloquants sont fermés, chacun confirmé par le relecteur qui l'avait levé.
Les huit défauts importants et mineurs retenus sont corrigés. Les dix critères de la carte
sont tenus, chacun avec sa mesure et non avec un indicateur de confiance. Les cinq réserves
ci-dessus sont déclarées, aucune ne touche une promesse faite au visiteur ni une donnée.

La publication peut être autorisée sur ce candidat exact, sous la condition technique nommée
au rapport de construction : la construction automatique du projet Cloudflare échoue sur
`main`, et publier exige soit le réglage au tableau de bord, soit un déploiement explicite
après la poussée.
