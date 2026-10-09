# Générateur de prompt comptable — livraison de l’implémentation

PR existante : https://github.com/saphiron222/memlia-landing/pull/51. Carte t_371a73be.
Route : /outils-comptables-gratuits/generateur-prompt-expert-comptable.
Main intégré, y compris oracle cache blog et article IA publiés ; aucune fusion ni publication ici.

## Produit et arbitrages

Moteur local déterministe partagé, sans modèle ni compte. Description abstraite 20–800 caractères, cinq contraintes, quatre amorces : demande de pièces, synthèse de notes, checklist et tri d’écarts. Sept blocs, frontière préparation/validation/humain et trois essais fictifs à rejouer dans l’outil autorisé, jamais résultats d’IA fabriqués.

Éditions conservées, remplacement et effacement confirmés. Contrôle structurel après édition, validateur explicite requis ; heuristique de signaux sensibles, sans compréhension ni anonymisation. Copie/export reflètent le texte affiché et sont bloqués si structure invalide ou formulaire changé. Si le presse-papiers refuse, le texte complet est sélectionné ; export UTF-8 local exact et Blob révoqué.

Défauts reproduits avant correction : test 800 caractères et suppression du validateur rouges ; deux tests navigateur rouges (sortie périmée copiable, sélection manquante en repli), voir red-browser.log. Ils passent après changement minimal. Ancien double id outil-calcul retiré au profit de la cible du gabarit main.

## Brief, SEO et sources

Brief 01/CONTRAT-COMMUN et corpus complet des 64 skills intégrés depuis marketing. Colonne de livraison : matrice-skills-01.json, 64 lignes uniques, application ciblée réelle, N/A motivés et instruments alternatifs ; ne confondre ni lecture de définition avec audit, ni suivi différé avec mesure exécutée.

Primaire final générateur prompt expert comptable, distinct du guide prompt chatgpt expert comptable, title/description conformes ; exemple avant/après, mode d’essai et FAQ spécifique statiques. Registre type outil, publieLe null tant que publication non constatée. Aucun volume ou conversion déduit d’un clic.

Trois entrants contextuels : hub, méthode et service /automatisation-cabinet-comptable. Ce dernier remplace explicitement l’entrant du blog scellé : le passage nomme l’écriture de la consigne et évite une republication adjacente. QA vérifie les trois ; la publication doit rejouer leur disponibilité. Pas de lien vers les outils frères non publiés.

CNIL ouverte le 04/10/2026, texte réel archivé source-cnil.md : usages autorisés/interdits et entrées autorisées à partager. Aucune nouvelle règle fiscale/sociale calculée. Méthode de blocs Memlia, pas norme ni certification. Sources Cegid/CNOEC du brief restent contexte de besoin, sans nouvelle assertion publique qui en dépend.

## Preuves réelles de cette phase

- npm run build : code 0 ; 130 tests Python et 638 tests du lanceur Node, audit Ressources PASS. Voir build.log.
- npm run check : 0 erreur, 0 avertissement ; indications préexistantes. Voir check.log.
- Chromium réel : 42 parcours PASS sur HTML construit, dont quatre amorces, refus/focus, confirmations, texte édité exact, copie/export, repli clipboard, sortie périmée, clavier, six largeurs (320/375/768/1024/1440/1920), maillage/canonical/sitemap/OG/CSP. browser.log.
- Après chargement : zéro requête pendant saisie/assemblage/édition/copie/export ; localStorage/sessionStorage/IndexedDB vides. Événements locaux seulement action et outil ; aucun collecteur serveur prétendu.
- Renderer --check : 40 actifs du renderer v2 conformes. Deux médias nouveaux 1600×900 et 1200×630, chacun <150 Ko ; scène HTML figée et contenu réel fictif, anciens pixels conservés. renderer.log.
- Lighthouse mobile et desktop : rapports réels complets et métadonnées collecteur voisins ; quatre axes >=95. Audit robots natif inchangé, collecte HTTP hors document disponible dans main ; CSP connect-src none conservée. Aucun remplacement de score.
- Captures pleine page 375/1440 du dernier candidat : cartes sans recouvrement. Zone large existante retenue après inspection desktop pour éviter la colonne vide ; champ éditable défilant/redimensionnable annoncé. Une option native longue peut être tronquée au repos sur mobile, texte complet accessible dans la liste et sortie.
- Footer commun : glossaire main sérialisé identique au témoin main construit, 27 verdicts métier conservés, deux reconstructions réelles et reçus sous chrome/. Aucun nouveau contenu réglementé ni seconde revue.

## Handoff et limites

Unique QA existante t_b3f1ff96, puis fusion/Cloudflare/constat public t_6d974686. Rejouer six scénarios du brief et six largeurs en production, HTTP sans query avec Cache-Control no-cache, hub/footer/entrants/canonical/sitemap/médias. Actualiser publieLe uniquement au constat public.

Production, indexation, liens gagnés, visibilité IA, usages collectés et conversion : ND à ce stade. Baseline après lancement, observations J+7/J+28 sans inventer de déclin ; aucune campagne externe ni compte payant requis. N/A instruments SaaS motivés par équivalent local pertinent, pas affirmation d’absence de credentials.

Hotspots : src/data/outils.ts, src/data/pages-lastmod.json et manifeste glossaire/footer. Synchroniser main avant fusion ; les anciennes revues de matière demeurent inchangées.
