# Recette de la copy catalogue — 15 octobre 2026

## Demande et réalisation

Kevin demande une nouvelle copy pour les accueils EC et CAC, À propos, Garanties et Contact : implémenter les robots et agents IA Memlia, les adapter au cabinet, construire sur mesure au besoin. Les skills réellement lus depuis l’installation Claude Code sont `copywriting` 2.2.0, `copy-editing` 2.1.1 et `competitor-profiling` 2.1.3. Aucune commande ou sous-session Claude Code utilisée.

Les cinq pages présentent désormais l’offre et ses sorties avant le mécanisme de la règle écrite. Le design A, les figurines, les surfaces vertes et les petites étapes Méthode sont conservés. La charte passe en v8 ; la signature, la description Organization, les métadonnées, le résumé llms et les textes communs suivent ce positionnement. Les anciennes preuves commerciales CAC sont archivées ; la version courante est identifiée.

## Recherche et relecture

Cinq pages primaires Factory 456 et Outils-EC ont été ouvertes puis archivées avec leurs URL et horodatages. Les profils distinguent observation, interprétation et application Memlia. Pas de mesure de trafic, SEO ou conversion présentée comme acquise. La comparaison des textes rendus aux cinq pages brutes ne trouve aucune suite identique de douze mots normalisés ; c’est un contrôle complémentaire, pas une garantie juridique d’originalité.

Sept passes de copy-editing et autocritique selon quatre angles documentées dans `docs/strategy/site-v3/coherence-figurines/COPY-CATALOGUE.md`. Aucun chiffre de gain, client, certification, partenariat, délai d’installation ni hébergement ajouté. Le catalogue n’est pas présenté comme une preuve de déploiements clients.

## Vérifications effectuées

- Régénération des 108 pages Astro, ressources et registre lastmod : PASS. Types : 0 erreur, 0 avertissement, 40 indications existantes.
- 134 tests Node ciblés PASS : données EC/CAC, scènes, ancres et liens, métadonnées, schémas, robots, routage et témoin du contenu de l’accueil. Après la dernière correction de formulation À propos, 21 tests affectés rejoués : PASS.
- 52 scénarios navigateur couverts, de 320 à 1920 px, dont 46 PASS au premier passage. Les six contrôles Contact utilisaient le parent du H2 à la place de la section recomposée ; leur cible est corrigée et le parcours clavier tient compte du choix de robot facultatif. Rejeu Contact et six pages éditoriales : 13/13 PASS. Aucun test ignoré, aucune reprise automatique des échecs.
- Parcours des 21 robots, images chargées, filtres, démonstrations sans requêtes externes, clavier, accordéons, mouvement réduit, contacts présélectionnés et stockage bloqué : PASS dans les scénarios ciblés. Formulaire : réponses simulées, états d’erreur et de succès, expiration, absence de JS et courriel de repli ; aucun message réel envoyé.
- Neuf réponses normatives CAC, couverture des suites et tableau de frontière identiques au commit `eddde6c5`. Les pages H2A NEP 505, 315 et 330 ont été rouvertes. Le script du contact et ses deux textes de consentement sont identiques au même témoin. Les corps scellés d’articles et services ne changent pas.
- Rendu réel inspecté dans le navigateur intégré : accueil EC et À propos sur ordinateur, CAC et Contact sur téléphone, Garanties sur ordinateur. Captures des cinq pages à 375 et 1440 px, complétées par les tests 768/1024/1920. Un H1, titres sociaux, canonical et absence de débordement contrôlés.
- Lighthouse : accueil EC mobile 99/100/100/100 ; accueil CAC ordinateur 100/100/100/100. Rapports `mobile-2026-10-15T13-00-20-922Z.json` et `desktop-2026-10-15T13-02-27-836Z.json`.
- 100 exports Markdown et `llms-full.txt` régénérés et vérifiés. Positionnement sur export final : 15 tests PASS, 280 surfaces texte. Prévisualisation préparée avec noindex/nofollow et canonical de production.
- `git diff --check` : PASS. Aucun déploiement de production, push ou fusion.

## Limite préexistante conservée

Le validateur global des services reste en échec sur les mêmes 25 points qu’avant cette demande de copy : 24 écarts historiques de titre/intention et la déclaration de lien entrant depuis Méthode supprimé à la demande explicite de Kevin dans l’itération précédente. Aucun contournement ajouté. Ces points n’empêchent pas de consulter la prévisualisation ; aucune livraison de production n’est déclarée prête.

## Fichiers de recette

- `copy-rendue.json` : titres, descriptions, canonical et textes des cinq pages rendues.
- `docs/strategy/site-v3/coherence-figurines/COPY-RENDUE.md` : lecture suivie de la copy réellement émise.
- `docs/strategy/site-v3/coherence-figurines/COPY-CATALOGUE.md` : décision, sources, plan et relecture.
- `/Users/kevinkitanga/dev/interne/memlia-landing-sources/coherence-figurines/2026-10-15/copy-catalogue/` : sources primaires, profils qualitatifs, captures et journaux de QA.

La prévisualisation finale et son contrôle distant seront ajoutés après le déploiement.
