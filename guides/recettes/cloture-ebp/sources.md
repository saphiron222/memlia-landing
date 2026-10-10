# Contrôles avant clôture EBP — preuves documentaires

Source ouverte par web_extract pendant la préparation le 07/10/2026 vers 01:44 CEST (06/10 en UTC, date retenue par la forge).
URL : https://support.ebp.com/hc/fr/articles/360009811138
Titre retourné : La clôture annuelle dans EBP Comptabilité — Centre d’aide EBP.

## Extraits de la page officielle

- « La clôture annuelle (appelée aussi clôture de l'exercice) est une opération irréversible ».
- « Toutes les écritures de cet exercice doivent être validées sinon la clôture ne sera pas réalisable ».
- « L’assistant de clôture se lance obligatoirement sur le premier exercice non clôturé du dossier. Les dates de l'exercice à clôturer ne sont pas modifiables. »
- « Les options (Générer les A Nouveaux ou Ne pas générer les A Nouveaux) ne sont pas modifiables si les A Nouveaux ont déjà été générés sur le nouvel exercice, car ils devront obligatoirement être mis à jour. »
- « Si un contrôle échoue, le statut Échec s'affiche sur la ligne concernée. La clôture ne peut donc être faite. »
- « Il existe un statut Information : ce traitement peut alors être exécuté, car certains contrôles ne sont pas bloquants. »
- « Si vous cliquez sur le bouton LANCER, la clôture de votre exercice sera définitivement exécutée. »
- « L’assistant de clôture annuelle lance ensuite automatiquement une sauvegarde complète de votre dossier puis un archivage de celui-ci. »
- Intitulé de la vidéo associée : « TUTO Comptabilité (V20 et supérieure) Effectuer une clôture annuelle ».

## Limites retenues

La vidéo indique V20 et supérieure ; la page ne certifie pas chaque édition ou version installée. Pas de test dans EBP, pas de portée sur EBP Paie ou Bâtiment. Les trois cas sont fictifs et leur rendu est une simulation documentaire. La vérification des destinations de sauvegarde avant lancement est une règle de prudence du cabinet, pas une étape native attestée par la source. Préparé n’est jamais une autorisation de fermeture ni une opinion sur la révision comptable.

La demande Google provient de la pièce jointe G2-preuves-demande.zip de t_5b286083, evidence/cloture-ebp.autocomplete.json : réponse complète recopiée sans modification. Dix suggestions distinctes au 06/10/2026, pas un volume de recherche. Les suggestions Paie ne modifient pas le périmètre.

## Contrôles réalisés avant revue

Test recette écrit et observé rouge (recette absente), puis vert. guide:preparer PASS ; guide:audit PASS ; 17 tests forge/géométrie PASS et 1 test de rendu Astro isolé PASS ; 7 tests de propriété des requêtes PASS. Le rendu spécifique a été examiné : trois lignes intégralement lisibles, aucun débordement. La mention de produit est un en-tête textuel simple du renderer commun, pas un logo ni un cartouche décoratif.

## Suite après l’unique revue métier indépendante

Le relecteur écrit revue.json selon GUIDE-FORGE.md. Dev reprend guide:sceller, contrôle les liens hub/moyeu générés, les six largeurs et captures pleines pages comparées aux guides historiques et au blog, regen:generated puis npm run build. PR avec CI verte, fusion, contrôle de production puis guide:publier. Adapter les dates de publication au jour de la publication réelle sans refaire la revue du fond ; respecter l’état préparé non publié si une régénération du candidat est nécessaire. Le registre conserve publieLe:null jusqu’au constat réel. Créer les suivis J+7/J+28 depuis ce constat.
