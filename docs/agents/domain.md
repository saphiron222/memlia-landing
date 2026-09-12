# Documentation du domaine

Règles de lecture de la documentation métier par les skills d'ingénierie avant d'explorer le code.

## À lire avant l'exploration

- `CONTEXT.md` à la racine ; ou
- `CONTEXT-MAP.md` à la racine s'il existe : il pointe vers un `CONTEXT.md` par contexte, dont il faut lire ceux qui touchent au sujet ;
- les ADR de `docs/adr/` qui concernent la zone de travail. Dans un dépôt multi-contexte, vérifier aussi les ADR sous `src/<contexte>/docs/adr/`.

Si ces fichiers n'existent pas, continuer sans le signaler et sans proposer de les créer d'avance. `domain-modeling` les crée au besoin, lorsqu'un terme ou une décision est réellement fixé.

## Organisation retenue

Ce dépôt est **single-context** : un éventuel `CONTEXT.md` et les ADR sous `docs/adr/` vivent à la racine. La présence future d'un `CONTEXT-MAP.md` signalerait explicitement un passage au multi-contexte.

Le contexte unique couvre ensemble :

- le site Astro et ses collections de contenu ;
- la publication sur Cloudflare Pages, prévisualisation avant toute production ;
- le contenu public et ses preuves, sans promesse au-delà des modules livrés ;
- le SEO technique et éditorial (`title`, description, canonical, données structurées, sitemap, RSS, `robots.txt` et `llms.txt`).

Une décision qui touche plusieurs de ces surfaces reste une décision du même contexte. Ne pas créer de contexte séparé « contenu », « SEO » ou « déploiement » tant que le dépôt reste une seule application Astro.

## Employer le vocabulaire du glossaire

Quand une sortie nomme un concept métier — titre de ticket, proposition de refactor, hypothèse ou test — employer le terme défini dans `CONTEXT.md`. Ne pas dériver vers un synonyme que le glossaire écarte.

Si le concept nécessaire n'est pas défini, vérifier d'abord qu'il ne s'agit pas d'un vocabulaire inventé. S'il manque réellement, le signaler pour `domain-modeling`.

## Signaler les conflits avec une ADR

Toute sortie contraire à une ADR existante doit nommer le conflit et sa raison ; elle ne remplace jamais silencieusement la décision.
