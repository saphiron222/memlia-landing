# Handoff t_069a7f0a → t_7e3124f5

Ce paquet remplace entièrement le paquet facture-electronique de t_ba084315. Aucun commit, push ni publication. Base locale 5280ea69. Le gel de publication de la carte dev reste intact ; ce handoff ne le lève pas.

## Résultat

Titre, héros et neuf sections recentrés sur les clients partis sur une autre plateforme agréée dont les appels et relances restent hors du circuit couvert. Le statut par client, les mandats, l’inscription en masse et les campagnes déjà utilisées ne sont pas revendus. Les sept éditeurs sont reconnus, sans attribuer uniformément des fonctions non établies à chaque offre. Fenêtre de transition jusqu’au 01/09/2027, réévaluation explicite. Frontière trois colonnes, huit cas fictifs exécutés, nouvelle revue indépendante du fond PASS et scellement.

## Intégration ciblée

1. Remplacer commercial/recettes/facture-electronique/ et commercial/services/facture-electronique/ ainsi que src/content/services/facture-electronique.md par ce paquet, jamais par l’ancien.
2. Fusionner seulement couverture-facture-electronique.json dans COUVERTURE_SERVICES. Le fichier complet src/data/couverture-logiciels.mjs est un socle local : ne pas écraser onboarding, lettres ou salariés ni les autres entrées. Le test service-couverture fourni vient du socle déjà utilisé sur les autres recadrages ; garder la version courante si intégrée.
3. Fusionner les quatre mesures et leur provenance d’origine dans le relevé courant, à partir de mesures-facture-electronique.json. Ne pas requalifier zéro suggestion commerciale comme un volume. Fusionner seulement registre-facture-electronique.json dans le registre ; aucun registre complet n’est livré. Réappliquer service:sceller sur le registre courant après fusion si nécessaire.
4. Garder le PASS indépendant du nouveau fond ; une seule QA d’implémentation, aucune re-revue pour lien/date/données dérivées.
5. Produire une preuve HTML figée propre aux nouveaux appels et brouillons, pas l’ancien registre de statuts. FE-03 montre explicitement l’exclusion du circuit déjà couvert. Rendre le bloc de couverture, intégrer SERVICE_DESIGN/EEAT, maillage déclaré par recette.json, footer et sitemap sans régression. Ancres corrigées : les anciennes ancres de suivi de statuts ne conviennent plus.
6. Respecter le gel inscrit sur la carte dev. Publication, build, QA navigateur et contrôle production sont sa phase, pas une phase accomplie ici.

## Vérification réelle

Huit comparaisons intégrales PASS, entrées et notes inchangées. service:preparer et service:sceller PASS. Cinq tests couverture PASS ; sans dist, le test HTML conditionnel n’est pas exercé. Vérification cryptographique des cinq fichiers scellés, revue PASS, statut pret-preview et réservation unique.

Limites signalées sans les masquer : suite forge 11/12 PASS, le test de fixture appelle l’audit à la date réelle au lieu de sa date de test ; correction séparée t_34147e02. Audit global de cette base locale rouge uniquement pour les cinq services historiques dont les mesures fraîches ne sont pas présentes. Le candidat facture-electronique n’a aucune erreur. Aucune mesure nouvelle ou réponse API n’a été inventée pour verdir le contrôle.

La revue compare les sorties archivées au script sans réexécution ; elle ne valide pas une intégration réelle. Les exclusions circuit cabinet/suspension ne disposent pas de cas dédiés parmi les huit, limite relevée et non bloquante pour le fond. Pennylane, ACD et DGFiP/calendrier ont été rouvertes ; les autres sources sont celles de l’étude du 06/10 conservée avec ses incertitudes.

## Hotspots

src/data/couverture-logiciels.mjs et docs/strategy/site-v3/mesures/{titres-intent-2026-10-06.json,registre-requetes.json} : fusion ciblée seulement. La préparation et le scellement ne changent aucun fichier public partagé hors candidat.
