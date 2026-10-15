# Salomé : fiche du catalogue Paie et social

Décision de Kevin du 15 octobre 2026 : les anciens services d’automatisation par pôle cèdent la place aux robots, aux agents IA et à la page commune des intégrations. La destination Salomé devient `/agents-ia/paie-social` ; l’ancienne page `/automatisation/paie` doit pointer en 301 vers cette fiche. Les pages liées `bulletins-controle` et `entrees-sorties-salaries` rejoignent aussi la fiche selon la matrice de migration centrale. Les anciens corps scellés ne sont pas modifiés.

## Livré dans les données

- `src/data/specialistes/paie-social.ts` contient désormais la carte et la fiche complète de Salomé, extraite de `autres.ts`.
- Dix lignes de tâches couvrent les neuf familles attribuées à Salomé. Les contrôles avant DSN et les retours DSN restent deux gestes de la même famille.
- Trois livrables, une démonstration de quatre cas fictifs conservée, quatre lignes de frontière, cinq conditions d’arrêt, six envois soumis à validation, quatre comparaisons, six FAQ et trois points de contact.
- Les dix noms de logiciels et les figurines optimisées approuvées sont réutilisés.
- `servicesLies: []` et absence de `pageDeLaRegle`, conformément au retrait des douze anciennes pages commerciales. Aucun lien vers une page retirée dans le contenu de Salomé.
- Le nombre de fiches passe de neuf à dix ; les deux destinations sans fiche restent Aude et Octavie. `specialistes.ts` adapte ses imports, son type `CheminPage` et ses commentaires. Le contrôleur n’a pas été modifié.

## Message et frontière métier

Les skills réellement lus sont les versions Claude installées dans `~/.claude/plugins/marketplaces/marketingskills/skills/copywriting/SKILL.md` (2.2.0) puis `copy-editing/SKILL.md` (2.1.1). La charte `.agents/product-marketing.md` v8 prime sur les anciennes formulations du document AGENTS-CONTENU.

L’agent du catalogue est déployé et adapté aux logiciels, aux règles des dossiers et au calendrier de l’équipe. Le gestionnaire corrige et valide la paie. Les dépôts DSN et DPAE, les diffusions et les paiements restent dans les circuits autorisés du cabinet et de l’employeur. Le logiciel de paie continue de calculer les bulletins. Les tâches couvrent les données rassemblées, les contrôles et les propositions. Aucun taux légal, seuil réglementaire, date déclarative ou mode d’hébergement n’est inventé.

Le cas fictif d’arrêt sans dates reste présenté « À valider » : aucune variable d’absence n’est reprise ; seule une demande de précision est préparée. Les conditions d’arrêt précisent que la reprise concernée reste bloquée jusqu’à la réponse du gestionnaire. L’apprenti absent de la paie garde son arrêt motivé distinct. Une absence de réponse ne devient pas une variable à zéro.

## Sources effectivement rouvertes le 15 octobre 2026

| Source | Constat retenu | Limite |
|---|---|---|
| [Net-entreprises : les comptes rendus métier](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) | Les retours d’organismes sont disponibles après réception des DSN ; le déclarant doit traiter les anomalies signalées. | La page conserve d’anciens noms d’organismes : ils ne sont pas repris. Aucun délai de correction généralisé. |
| [Net-entreprises : tiers déclarant](https://www.net-entreprises.fr/glossaire/tiers-declarant/) | Le glossaire décrit le tiers déclarant assurant les déclarations sociales de plusieurs entreprises, avec les cabinets en exemple. | La répartition contractuelle Memlia est notre engagement de service : la source ne certifie pas l’agent. |
| [Urssaf : DSN](https://www.urssaf.fr/accueil/employeur/gerer-entreprise/declaration-sociale-nominative.html) | L’accès par l’outil de recherche a échoué. | Aucun calendrier chiffré n’est publié sur cette base. Le calendrier est configuré selon les échéances applicables validées par le cabinet. |

Ces deux sources Net-entreprises sont inscrites dans `eeat.sources` et leurs mots se trouvent dans les réponses FAQ pour les liens en contexte : « les comptes rendus métier » et « votre compte déclarant ».

## Raccords techniques à réaliser par le chantier central

- Contrat d’intention : nouvelle route `/agents-ia/paie-social`, requête primaire `ia paie` reprise de la recherche existante AGENTS-CONTENU §2 / MOTS-CLES ; **aucun nouveau volume inventé ni relevé de demande effectué pour cette fiche**. Title : « IA paie et social pour cabinet comptable | Memlia ». Description commençant par « IA paie pour cabinet comptable ».
- Canonical, WebPage, Service, BreadcrumbList : dérivés du gabarit commun Agent ; FAQ visible sans FAQPage. La route dynamique construit automatiquement la dixième fiche.
- Image sociale réservée : `https://memlia.fr/proofs/v2/og/60-fiche-paie-social.webp`, 1200 × 630, avec alt dans les données. Le pipeline existant numérote selon les index ; il faut stabiliser le mapping pour conserver les URL 50–58 des neuf fiches et 59 des intégrations. **Aucun rendu ni génération lancé par cette sous-tâche.**
- Contact : les trois familles de départ sont déjà connues ; la liste blanche se dérive automatiquement de FICHES. Le total des points d’entrée agents passe de 27 à 30. Vérifier la présélection et le repli sans stockage.
- Retirer le bandeau de l’ancienne page paie et son ancienne URL de toute navigation ; ne pas laisser la nouvelle fiche produire des liens vers l’ancien service via la collection de services conservée pour l’archive.
- Actualiser sitemap, llms, exports Markdown, registres de requêtes et métadonnées publiées lors de la régénération centrale.

## Vérifications ciblées faites

- Import Node des données réussi : douze agents, dix fiches, neuf familles Salomé, dix tâches, trois livrables, quatre cas, six FAQ et trois points de contact.
- Contrôles de partition, carte, démonstration et fiche : aucun écart hors des anciens recoupements de services, que la migration centrale prend en charge.
- `node --test tests/scripts/specialistes-copy.test.mjs` : **9/9 PASS**, y compris gabarits et mots interdits.
- `git diff --check` : PASS.
- Aucun build complet, rendu social, export public, commit ni modification d’un corps scellé effectué par cette sous-tâche.

Les tests historiques à adapter ne doivent pas être affaiblis : `agents-rejeu-source.test.mjs` (liste SANS_FICHE), `catalogues-communs.test.mjs` et `agents-ia-delivery.test.mjs` (9 → 10), `schema-agents.test.mjs` (destinations et test sans fiche désormais sur Aude/Octavie), `specialistes-controle.test.mjs` (témoins page-vers-fiche actuellement sur Salomé), ainsi que les routes navigateur de la paie. Le retrait des anciens services implique leurs autres fixtures dédiées ; il ne relève pas de cette fiche.
