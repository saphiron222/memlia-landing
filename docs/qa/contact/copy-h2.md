# Contact — passe de copy H2

## Décision et périmètre

La copy existante est conservée pour sa structure, son H1, son titre, sa méta-description, ses liens, ses trois moyens de contact et ses illustrations. La passe retire les répétitions autour de l’absence de fichier et rend explicites le cadrage, le refus motivé et le devis à la complexité.

- Le chapeau porte la prise en charge entière dans les outils existants et la décision conservée par l’équipe.
- L’aide du formulaire concentre la consigne de description sans donnée client et l’absence de dépôt de fichier.
- La bande de deux cartes explique le geste et le savoir-faire à écrire, à la place de deux avertissements équivalents.
- L’issue est un cadrage proposé ou une explication de ce qui empêche l’automatisation en l’état.
- Le devis suit le cadrage et dépend des sources, règles, exceptions et validations ; maintenance, support et évolutions y sont écrits (charte v5 §2 et §4).
- Le délai de réponse n’est pas inventé. La durée indicative de trente minutes, déjà présente, est conservée une seule fois dans le texte HTML.

Aucun champ, script, style, consentement, message d’erreur/succès, canal ni actif visuel modifié. Le bouton d’envoi continue de dire « Envoyer le message » ; les appels existants vers l’agenda et le courriel sont conservés.

## Référence de production avant changement

Lecture le 08/10/2026 à 00:28 CEST (07/10 à 22:28 UTC), puis téléchargement sans cache de `https://memlia.fr/contact`. La production sert encore le chapeau « Décrivez-la en trois phrases… Rien à envoyer, aucun engagement » et le H2 « Vous n’avez rien à nous envoyer ».

La demande de changement repose sur une hypothèse qualitative de compréhension, pas sur un taux de conversion mesuré. Les vues de /contact, envois réellement reçus, demandes qualifiées, clics agenda et clics courriel ne sont pas disponibles dans ce relevé. Aucun zéro, volume ou gain n’en est déduit. Les clics ne vaudront pas demandes reçues.

## Vérifications locales

- `npm ci` : réussi ; 6 vulnérabilités signalées par npm (2 moderate, 4 high), non corrigées dans cette passe de texte.
- `npm run regen:generated` : réussi ; lastmod de /contact seul changé parmi les pages, surfaces du glossaire rescellées avec revue existante réaffirmée.
- Premier `npm run build` interrompu par le timeout de capture du terminal pendant la longue suite Node, sans erreur métier constatée. Une reprise en processus suivi a terminé avec code 0.
- `npm run build` de reprise : réussi, chaîne publique complète.
- Positionnement Python ciblé : 8 tests réussis.
- Fonction contact et Turnstile Node ciblés : 31 tests réussis, avec réponses et stockage simulés de la suite existante.
- Playwright : 21 tests réussis (nouveaux tests copy/clavier, contact existant, provenance et positionnement). Aucun envoi réel : API et challenge remplacés seulement dans les tests locaux existants ; production non sollicitée en POST.
- Nouveau parcours copy/clavier : largeurs 320, 375, 768, 1024, 1440 et 1920 ; aide unique, canonical inchangé, champs préservés lors de l’indisponibilité, alternative courriel disponible, aucune pièce jointe ni débordement horizontal.
- Captures pleine page 375 et 1440 : nouveaux paragraphes contenus et lisibles ; direction artistique inchangée. La barre fixe apparaît au dernier bloc dans les captures prises après défilement, et le texte des illustrations est réduit sur mobile : notes sur des éléments inchangés, pas un changement de DA dans cette passe. L’indisponibilité locale affichée est normale sur Astro preview, qui ne sert pas la fonction Cloudflare ; les scénarios fonctionnels sont testés par interceptions.
- `npm run check` : 0 erreur, 0 avertissement, 15 hints sur 489 fichiers (résultat détaillé dans astro-check.log).
- `git diff --check` : réussi.

## Intégration et collision D7

À la base `origin/main` utilisée, le champ facultatif `type_cabinet` est absent. D7 (`t_61e185b6`, PR137) le livre déjà sur une branche distincte, encore ouverte lors du relevé. Ne pas refaire D7, ne pas retirer son champ et ne pas confondre sa recette d’envoi avec cette passe, qui exige seulement une navigation sans envoi réel. Le diff de copy ne touche aucun champ ni script ; à la fusion, conserver l’ajout D7 et ses tests si main l’a intégré.

Fichiers partagés signalés sur la carte : `src/pages/contact.astro`, `src/data/pages-v2.mjs`, puis les données générées du glossaire et lastmod. Pour un conflit généré, garder main puis rejouer la commande du dépôt. Pour un conflit de source, conserver le chapeau contact de cette passe et toutes les autres pages de main.

## Revue unique et publication

Cette livraison attend une revue QA unique sur la carte `t_9644827a`. La revue couvre la passe ciblée et les parcours ; elle ne vaut pas publication. Après PASS, le travail d’intégration peut être confié à dev avec ce verdict acquis, sans deuxième revue de fond : CI verte, fusion PR, déploiement automatique main et lecture de la surface réellement servie.

Le reçu de publication devra indiquer URL, date, déploiement et contrôle sans cache : nouveaux chapeau/H2/devis, canonical, formulaire sans fichier, type facultatif s’il est intégré, liens agenda/courriel, messages et parcours clavier/mobile, sans envoi réel.

## Suivi à partir de la mise en production

Base qualitative ci-dessus ; base quantitative indisponible à ce stade.

- J+7 : relire la surface et relever, si disponibles, vues /contact et demandes reçues sur sept jours, séparées des tests. Observer si la demande décrit le geste, les outils et le résultat ; ne pas attribuer une variation à la copy seule.
- J+28 : même relevé sur vingt-huit jours ; comparer à la fenêtre précédente seulement si les définitions et la couverture sont stables. Distinguer formulaires reçus, demandes qualifiées et simples clics agenda/courriel.
- Les dates J+7/J+28 se calculent à partir de la publication réelle, pas de cette préparation. Si les sources restent absentes ou insuffisantes, le consigner plutôt que présenter un taux fictif.
