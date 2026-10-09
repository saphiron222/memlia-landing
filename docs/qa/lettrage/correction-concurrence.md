# Corrections F1/F2 — PR160

## Transaction copie/export

Les décisions restent verrouillées depuis la demande au Worker jusqu'à la fin effective du téléchargement ou de l'appel clipboard. Le statut explique ce verrou temporaire ; les décisions redeviennent modifiables ensuite. Les filtres et la pagination restent utilisables sans lever le verrou. Le gestionnaire de décision refuse aussi un événement synthétique pendant la transaction.

Chaque demande possède un identifiant et un jeton d'opération. Seule la réponse du Worker actif portant cet identifiant peut démarrer la livraison, une seule fois. L'effacement et le démarrage d'un import de remplacement invalident ce jeton. Après résolution ou rejet de l'API clipboard, la continuation vérifie encore le jeton avant de modifier statut, fallback ou focus ; son finally ne peut pas déverrouiller une opération plus récente.

Limite de l'API navigateur : une écriture clipboard déjà engagée n'est pas annulable. La page ne réaffiche aucun ancien contenu et ne modifie pas le presse-papiers pour tenter un effacement silencieux.

## Régressions ciblées

`tests/browser/lettrage-concurrency.spec.ts` : huit tests Chromium, Worker et moteur réels ; seule la résolution/rejet du clipboard est pilotée pour rendre l'attente de permission déterministe.

- Export et copie avec tentative de changement de décision dans le même tour UI : CSV et écran cohérents, verrou et retour à une décision modifiable contrôlés.
- Succès et rejet clipboard tardifs après reset seul, reset puis import de deux nouvelles lignes, et import sans reset : aucun ancien statut, contenu ou focus ne revient ; busy reste actif avant invalidation, y compris après filtrage.

Échec observé avant correctif : décisions concurrentes non verrouillées et busy levé prématurément ; témoin rejet après reset/import poursuivi jusqu'au statut périmé réaffiché.
Après correctif : huit régressions PASS, trois scénarios existants ciblés PASS (import strict, pagination/export, annulation), dix-huit tests Node PASS sans skip.

Le premier essai Astro dev échouait avant l'import : son Worker classique conserve des imports ESM, contrairement au bundle de production. Le rejeu local utilise le HTML/UI Astro dev et un proxy qui bundle seulement le Worker réel en IIFE via esbuild. Aucun remplacement du moteur ni assouplissement CSP ; ce rejeu local ne remplace pas la CI sur le build réel.

## Intégration à main

Les entrées et preuves indépendantes de main sont conservées ; seules les entrées lettrage sont réappliquées aux registres partagés. Le moteur et sa promesse restent inchangés. Le catalogue adopte son champ obligatoire `libelleAction` et le test de redirection adopte le contrat de réponse clonée désormais utilisé par le middleware partagé.

Les registres de rendu et la réaffirmation sans changement du fond métier ont été générés sur GitHub : job SUCCESS https://github.com/saphiron222/memlia-landing/actions/runs/37873201981/job/113635709044 . Les six fichiers téléchargés correspondent à l'artefact `lettrage-generated`. Le job temporaire est retiré du candidat de livraison. Aucun build complet ni suite complète sur le Mac.

La re-revue existante t_365b8154 vérifie F1/F2 et le critère de fini. Aucun merge ni publication dans cette livraison.
