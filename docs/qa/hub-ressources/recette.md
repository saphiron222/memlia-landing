# Recette — Hub Ressources

Date : 2026-09-14

Carte : `t_f7f13852`
Branche : `site/hub-ressources-ui`

## Verdict

PASS pour le candidat local. Aucun déploiement, push, publication ou cron.

Le Hub expose uniquement les destinations réellement publiées : deux articles historiques et le glossaire unique à 23 ancres. Aucun candidat guide ou modèle n’étant autorisé, `/guides` et `/modeles` restent absents et hors sitemap.

## Contrat vérifié

- canonical : `https://memlia.fr/ressources` ;
- un H1, fil d’Ariane, `ItemList` JSON-LD et CTA réel vers Cal.com ;
- filtres client rôle/format, rendu serveur complet sans JavaScript, état vide et réinitialisation ;
- navigation desktop et mobile vers Ressources, Articles et Glossaire ;
- RSS historique limité aux articles ;
- aucune page SEO par rôle ou filtre ;
- adaptateur H/A/T/G/M intégré ; état `NO_CANDIDATE` conservé.

## Mesures fraîches

| Preuve | Résultat |
|---|---:|
| `npm run check` | 99 fichiers, 0 erreur, 0 avertissement, 1 hint hérité |
| `npm run build` | 10 routes, Python 47/47, Blog 55/55 + rendu 1/1, Ressources 22/22 |
| `QA_URL=http://127.0.0.1:4479 npm run test` | Playwright 98/98 |
| Oracle `test_resources.py` | 3/3 |
| Largeurs navigateur | 320, 375, 768, 1024, 1440 et 1920 sans overflow |
| Lighthouse mobile | 100 / 100 / 100 / 100 ; LCP 1,4 s ; CLS 0 ; TBT 0 ms |
| Lighthouse desktop | 100 / 100 / 100 / 100 ; LCP 0,3 s ; CLS 0 ; TBT 0 ms |
| `git diff --check` | PASS |

## Passe écran

Les captures pleine page 375 et 1440 ont été inspectées après rendu réel. Aucun chevauchement, texte coupé, débordement, image cassée ou contrôle masqué. La répétition des trois destinations entre sélection, parcours et catalogue est intentionnelle dans cette première édition : chaque section répond à une entrée différente du brief, sans inventer de contenu.

## Empreintes

| Artefact | SHA-256 |
|---|---|
| `dist/ressources.html` | `65dc27de845c296328db066bbfc7db2a2ecd8078e2d0e733e0f211281d475d91` |
| `.qa/ressources-375-full.png` | `0af53c6ccb75aa022d54c72011ae3a7d65adda8c29ab2175e8bdb45960090b4d` |
| `.qa/ressources-1440-full.png` | `a3f01f5980608b957dceffc4fd47ccf01b22281b090a37cdbad1c2e2f0843c19` |

## Limites

- Les définitions réglementaires du glossaire restent soumises à la revue métier distincte déjà déclarée.
- Le candidat est local : aucune preuve HTTP distante ni protection de preview n’est revendiquée.
- Aucun test VoiceOver manuel n’a été mené ; la structure, le clavier, les libellés et l’accessibilité automatisée ont été vérifiés.
