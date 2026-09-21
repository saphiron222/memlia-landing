# Audit produit et croissance — outils gratuits

Date du relevé : 20 septembre 2026, 23:11 WAT
Périmètre : hub, quatre outils indexables et témoin technique non indexable.
Branche : `wt/outils-product-growth`.

## Addendum d’intégration — 21 septembre 2026

Le candidat `5ca506c1a0becf2a4ba84c241d5091a81d3e3d38` a été rejoué sur un `origin/main` frais. Deux conflits ont été résolus explicitement : le hub conserve le filtrage des seules catégories publiées ajouté sur `main` tout en affichant l’entrée, le résultat et l’action de chaque outil ; le registre `pages-lastmod` est régénéré depuis le rendu intégré, jamais repris depuis l’ancienne base du candidat.

La mesure personnalisée n’est pas branchée dans cette livraison. Le détail des événements est désormais contrôlé comme une liste fermée de deux champs, `action` et `outil`, sans valeur saisie ; il reste un événement navigateur local. L’ouverture d’un endpoint contredirait la CSP `connect-src 'none'` et la promesse publique d’absence d’envoi tant qu’une décision de politique, de conservation et d’exploitation n’est pas prise. Search Console, Cloudflare Web Analytics et l’attribution D1 restent les trois instruments de production ; toute donnée absente est notée `ND`. Les dates propres au quatrième outil sont ajoutées sans déplacer la vague 1 dans `OUTILS-BOUCLE.md`.

## Verdict

Les quatre outils indexables rendaient déjà un résultat juste sur les cas couverts, localement et sans inscription. Leur faiblesse commune était située après et autour du calcul : démarrage sans exemple sur trois parcours, résultat périmé encore visible après une modification, erreurs peu orientantes sur trois outils, et presque aucune sortie réutilisable hors du rapprochement.

La passe conserve les règles de calcul. Elle ajoute une première valeur plus rapide, un vrai retour après erreur, des sorties copiables ou exportables adaptées à chaque tâche, et un contrat d’événements sans valeur saisie. Elle retire aussi la promesse vide « convertir » du hub : aucun convertisseur n’est publié.

Légende des constats :

- **[P] preuve** : code, test, instrument ou résultat navigateur observé ;
- **[I] inférence** : conclusion raisonnable à vérifier en usage réel ;
- **[U] inconnue** : aucun instrument disponible ne permet de conclure.

## Inventaire et rôle de chaque route

| Route | Statut | Promesse exacte | Job principal | Place dans l’acquisition |
|---|---|---|---|---|
| `/outils-comptables-gratuits` | indexable | Choisir un outil qui calcule ou vérifie avec règle et limites visibles | S’orienter sans connaître Memlia | Hub de découverte et maillage |
| `/outils-comptables-gratuits/calculateur-marge-commerciale` | indexable | Produire marge, taux de marge, taux de marque et trace depuis deux montants HT | Vérifier rapidement trois formules proches | Requête utilitaire large, entrée haute de funnel |
| `/outils-comptables-gratuits/calculateur-date-echeance-facture` | indexable | Produire une date et sa trace selon trois règles générales | Lever l’ambiguïté du point de départ et de « 45 jours fin de mois » | Intention réglementaire pratique, proximité avec les factures fournisseurs |
| `/outils-comptables-gratuits/calculateur-amortissement-comptable` | indexable | Produire un plan linéaire ou dégressif annuel avec prorata et valeur nette | Contrôler un plan et comprendre chaque dotation | Intention comptable forte, réutilisation possible par dossier fictif |
| `/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit` | indexable | Vérifier deux soldes ajustés puis produire un CSV fictif | Préparer un contrôle et une trame à compléter | Intention « modèle Excel », proximité directe avec le service de rapprochement |
| `/outils-comptables-gratuits/temoin-calcul-local` | `noindex` | Prouver qu’une interaction peut rester locale | Contrôle technique de la chaîne | Pas un produit de croissance ; témoin rouge/vert conservé hors hub |

**DÉCISION ·** le témoin ne rejoint pas le backlog produit : sa valeur est probatoire, pas une intention à acquérir. Le transformer en outil public diluerait le hub sans rendre un travail métier.

## Intention mesurée et alternatives

### Autocomplétion Google, instrument du dépôt

Relevé direct avec `autocompleterGoogle`, le 20 septembre 2026 :

| Amorce | Réponse mesurée |
|---|---|
| `calculateur marge commerciale` | 10 suggestions, dont l’expression exacte, `calcul marge commerciale excel`, `calcul marge commerciale formule` |
| `calculateur de marge commerciale` | 10 suggestions, dont l’expression exacte, `calcul taux de marge commerciale` |
| `calculateur date échéance facture` | 4 suggestions, dont l’expression exacte, `calcul date échéance facture excel` |
| `calculateur de date d’échéance de facture` | 1 suggestion : `calcul date d échéance facture` |
| `calculateur amortissement comptable` | 5 suggestions : `calcul amortissement comptable`, `tableau amortissement comptable`, `tableau amortissement comptable excel`, et deux variantes fiscales |
| `modèle rapprochement bancaire excel gratuit` | 3 suggestions, dont l’expression exacte et deux variantes « tableau Excel » |
| `outils comptables gratuits` | 1 suggestion : `outils comptable gratuit` |

[P] Les quatre pages portent donc une intention utilitaire observable. [U] L’autocomplétion ne donne ni volume, ni clic attendu, ni adéquation au dirigeant de cabinet. [P] Le point zéro Search Console s’arrête au 17 septembre, avant publication : 0 clic et 0 impression ne sont pas interprétables. La première fenêtre de décision reste celle du 21 octobre définie dans `OUTILS-BOUCLE.md`.

### Surface concurrente observée

- **Marge [P]** : les premiers résultats DuckDuckGo accessibles incluaient vmaths.fr, calcul-marge.fr, macalculatriceenligne.com et calculette.org. Leurs extraits mettent surtout en avant prix de vente, coefficient multiplicateur et calcul HT/TTC. L’espace Memlia reste la trace des formules, les limites et le refus plutôt qu’un conseil de prix.
- **Échéance [P]** : les premiers résultats accessibles incluaient etrepaye.fr, macalculatriceenligne.com, calculatrice.now, Factomos et Tout est Faisable. L’espace Memlia reste le choix explicite entre les deux conventions « 45 jours fin de mois », la source officielle datée et l’export calendrier après calcul.
- **Amortissement [P]** : l’autocomplétion montre que les tableaux Excel et le calcul fiscal sont les alternatives recherchées. [U] Le moteur de recherche secondaire a rendu des résultats incohérents et a été rejeté ; aucun classement de domaines n’est présenté comme preuve.
- **Rapprochement [P]** : l’autocomplétion montre que le chercheur attend un modèle ou tableau Excel gratuit. [I] Les modèles téléchargeables sont l’alternative naturelle ; [U] leurs fonctions et leur classement n’ont pas été mesurés lors de cette passe, le moteur secondaire ayant échoué.

Le WebSearch configuré a répondu HTTP 403, le navigateur Hermes ne disposait pas d’un Chrome lançable et l’appel DataForSEO de secours a répondu `402 Payment Required`. Ces pannes sont consignées comme pannes ; elles ne sont pas transformées en « aucun concurrent ».

## Diagnostic avant code

### Hub

| Critère | Avant | Après |
|---|---|---|
| Promesse | [P] « calculer, vérifier, convertir » alors qu’aucun convertisseur n’était publié | [P] « calculer et vérifier », exactement le stock disponible |
| Choix | [P] titre et description seulement | [P] entrée, résultat et action sans compte sur chaque carte |
| Friction | [I] le visiteur devait ouvrir une page pour savoir ce qu’elle demandait | [P] coût d’entrée visible avant le clic |
| Mobile | [P] aucun débordement sur six largeurs | Inchangé, rejoué après modification |
| 10 étoiles | Comparaison par job, état de fraîcheur et recommandation selon la tâche | Le hub reste volontairement neutre tant que l’usage réel ne permet pas de recommander un outil |

### Calculateur de marge commerciale

- **Tâche exacte [P]** : calculer trois résultats depuis achat HT et vente HT, y compris une marge négative.
- **Temps jusqu’au premier résultat [P]** : avant, deux saisies et un clic ; après, un exemple fictif puis le calcul en deux clics. Les secondes réelles restent [U].
- **Justesse [P]** : 80/100 produit 20 €, 25 % et 20 % ; 100/80 accepte une marge négative ; zéro et saisie ambiguë refusés.
- **Limites [P]** : pas de variation de stock, TVA, remise, frais ou conseil de prix.
- **Correction/recalcul [P]** : modifier une valeur invalide désormais immédiatement l’ancien résultat ; l’erreur marque et focalise le premier champ concerné.
- **Réutilisation [I]** : copie de la trace et CSV rendent le contrôle réutilisable dans une note de travail fictive ; aucun historique n’est conservé.
- **Partage/export [P]** : copie locale et CSV UTF-8 ; aucune requête réseau.
- **10 étoiles [I]** : comparaison simultanée de plusieurs scénarios, seulement si des usages réels prouvent ce besoin. Un calcul de prix conseillé est hors promesse.

### Calculateur de date d’échéance

- **Tâche exacte [P]** : calculer les cas généraux à 30 jours, 60 jours date de facture ou 45 jours fin de mois selon une convention choisie.
- **Temps jusqu’au premier résultat [P]** : le cas le plus long demandait règle, date, convention, confirmation et calcul ; l’exemple fictif ramène la découverte à deux clics.
- **Justesse [P]** : les deux conventions sur une facture du 20 janvier 2026 produisent respectivement le 31 mars et le 17 mars ; l’absence de convention refuse.
- **Limites [P]** : aucun secteur, marché public, facture périodique, accord particulier ou conclusion de conformité.
- **Correction/recalcul [P]** : tout changement masque la date précédente ; le champ manquant reçoit focus et `aria-invalid`.
- **Réutilisation [I]** : le fichier `.ics` donne une raison honnête de revenir sans transformer la date en conformité garantie.
- **Partage/export [P]** : copie de la date et de la trace ; événement calendrier d’une journée, intitulé « à vérifier ».
- **10 étoiles [I]** : comparaison côte à côte des deux conventions et explication contractuelle contextualisée. Les délais sectoriels restent exclus tant qu’une source et une recette propres ne sont pas construites.

### Calculateur d’amortissement

- **Tâche exacte [P]** : produire un plan annuel linéaire ou dégressif sur exercice civil.
- **Temps jusqu’au premier résultat [P]** : l’exemple fictif était déjà préchargé ; un clic suffit. Le bouton de rechargement rend cet état récupérable.
- **Justesse [P]** : 10 000 €, 1er avril 2026, 5 ans donne 6 lignes, 1 506,85 € sur 275/365 et 10 000 € au total ; le dégressif confirmé donne un coefficient 1,75 et une première dotation de 2 625 €.
- **Limites [P]** : la durée et l’éligibilité ne sont pas décidées ; pas de valeur résiduelle, cession, exercice décalé, composant séparé ou régime particulier.
- **Correction/recalcul [P]** : modifier une entrée masque le plan précédent ; chaque erreur rend le focus au champ concerné.
- **Réutilisation [I]** : le CSV annuel et le résumé copiable rendent le plan contrôlable hors de la page.
- **Mobile/accessibilité [P]** : table défilable, région nommée, focus sur le titre du résultat, préférence de mouvement réduit.
- **10 étoiles [I]** : gestion de l’exercice décalé, de la valeur résiduelle et des composants, mais uniquement après contrat métier et jeux d’essai dédiés. Les ajouter maintenant serait une fausse complétude.

### Modèle de rapprochement bancaire

- **Tâche exacte [P]** : ajuster deux soldes fictifs, refuser un inexpliqué ou une différence, puis produire une trame CSV.
- **Temps jusqu’au premier résultat [P]** : avant, quatre valeurs principales à saisir puis calcul ; après, exemple et calcul en deux clics.
- **Justesse [P]** : 1 000 € bancaire et 950 € comptable avec 50 € d’intérêts produit deux soldes ajustés à 1 000 € et une différence nulle.
- **Limites [P]** : aucun relevé importé, aucune écriture, aucun rapprochement validé ; CSV et non `.xlsx`.
- **Correction/recalcul [P]** : toute modification invalide sortie, copie et export ; un inexpliqué focalise son champ, une discordance focalise le solde comptable à revoir.
- **Réutilisation [P]** : CSV avec lignes fictives à détailler ; copie du contrôle synthétique ajoutée.
- **10 étoiles [I]** : import local d’un jeu fictif, détail ligne à ligne et propositions de correspondance explicables. Cela change la capacité et exige un contrat distinct ; ce n’est pas glissé dans cette passe.

## Briefs produit

### Marge

- **Utilisateur** : collaborateur, dirigeant ou créateur qui veut vérifier les trois notions sans feuille intermédiaire.
- **Douleur** : formules proches et dénominateurs différents.
- **MVP prouvé** : deux montants, trois sorties, trace, refus.
- **Anti-objectif** : conseiller un prix ou simuler une marge comptable annuelle.
- **Signal de valeur** : calcul réussi puis copie/export ; Search Console sur la requête exacte.

### Échéance

- **Utilisateur** : personne qui doit transformer une règle générale en date vérifiable.
- **Douleur** : point de départ et double convention souvent implicites.
- **MVP prouvé** : règle, date, convention, confirmation, trace.
- **Anti-objectif** : rendre un avis de conformité ou couvrir les exceptions sectorielles.
- **Signal de valeur** : calcul réussi puis export calendrier ; passage qualifié vers la prise en charge des factures.

### Amortissement

- **Utilisateur** : collaborateur qui veut contrôler un plan et son prorata.
- **Douleur** : tableau opaque et dernier centime non réconcilié.
- **MVP prouvé** : deux méthodes, ligne annuelle, trace, total exact.
- **Anti-objectif** : choisir durée, qualification du bien ou régime fiscal.
- **Signal de valeur** : plan réussi, export CSV et retour sur la route.

### Rapprochement

- **Utilisateur** : collaborateur qui veut préparer un contrôle fictif avant de travailler dans son environnement.
- **Douleur** : trames vides sans règle de concordance ni arrêt explicite.
- **MVP prouvé** : soldes ajustés, différence, refus, CSV local.
- **Anti-objectif** : importer un relevé réel, comptabiliser ou valider une correspondance.
- **Signal de valeur** : contrôle concordant, export CSV et contact d’origine exact.

## Contrat de capacité

### CAPABILITY

Un visiteur peut essayer chaque règle sur un exemple fictif, corriger ou recommencer sans conserver une sortie périmée, puis emporter la valeur rendue dans le format utile à la tâche. La page émet des événements sans inclure les valeurs saisies.

### CONSTRAINTS

- calcul et export restent dans le navigateur ; `connect-src 'none'` demeure ;
- aucune valeur, date ou ligne saisie ne rejoint un événement ;
- aucune collecte avant valeur, aucun compte, aucun e-mail ;
- les règles métier, leurs bornes et leurs sources ne changent pas dans cette passe ;
- un export ne transforme pas un résultat en validation ;
- le CTA vient après la valeur dans le parcours et garde « Confier une première tâche ».

### IMPLEMENTATION CONTRACT

- **Acteur** : visiteur anonyme.
- **États** : initial → commencé → résultat ou refus → modification qui invalide la sortie → nouveau calcul ; copie/export seulement après résultat valide.
- **Entrées/sorties** : spécifiques à chaque outil ; pas de gabarit fonctionnel forcé.
- **Erreurs** : message visible, `aria-live`, `aria-invalid`, focus sur le premier champ à corriger.
- **Événements** : `demarrage`, `reussite`, `erreur`, `recalcul`, `retour`, `cta`, `exemple`, `effacer`, `copie`, `export` via `CustomEvent('memlia:outil')`, détail limité à `{ action, outil }`.
- **Retour** : navigation `reload` ou `back_forward` ; aucune empreinte persistante n’est créée.

### NON-GOALS

- stockage d’un historique ;
- URL partageable contenant des valeurs ;
- envoi d’un export ;
- collecte d’adresse avant résultat ;
- ajout d’une règle comptable, fiscale ou sectorielle non recettée.

### OPEN QUESTIONS

- [U] Un collecteur agrégé compatible avec la politique de sécurité consommera-t-il les événements locaux ? Le contrat existe, la collecte de démarrage/réussite/erreur n’est pas active en production.
- [U] Les exports créent-ils un retour réel ou seulement un usage ponctuel ? À mesurer après indexation.
- [U] Le visiteur veut-il comparer plusieurs scénarios de marge dans la même vue ? Aucun signal d’usage ne le prouve encore.

### HANDOFF

La capacité retenue est implémentée. Les extensions métier restent derrière un nouveau passage `product-capability`, avec source primaire et jeux d’essai propres.

## Backlog classé impact × confiance ÷ effort

Échelle 1 à 5 ; score calculé par script, pas à l’intuition arithmétique.

| Outil | Changement | I | C | E | Score | État |
|---|---|---:|---:|---:|---:|---|
| Rapprochement | Exemple et effacement | 5 | 5 | 1 | 25,00 | livré |
| Marge | Exemple et effacement | 4 | 5 | 1 | 20,00 | livré |
| Marge | Focus erreur et invalidation de la sortie | 4 | 5 | 1 | 20,00 | livré |
| Échéance | Exemple et effacement | 4 | 5 | 1 | 20,00 | livré |
| Échéance | Focus erreur et invalidation de la sortie | 4 | 5 | 1 | 20,00 | livré |
| Amortissement | Invalidation de la sortie après modification | 4 | 5 | 1 | 20,00 | livré |
| Rapprochement | Focus erreur et invalidation de la sortie | 4 | 5 | 1 | 20,00 | livré |
| Amortissement | Exemple rechargeable | 3 | 5 | 1 | 15,00 | livré |
| Amortissement | Copie et CSV du plan | 5 | 5 | 2 | 12,50 | livré |
| Rapprochement | Copie du contrôle | 3 | 4 | 1 | 12,00 | livré |
| Hub | Promesse exacte et cartes entrée/résultat | 4 | 5 | 2 | 10,00 | livré |
| Échéance | Copie et calendrier ICS | 4 | 4 | 2 | 8,00 | livré |
| Global | Contrat d’événements local | 4 | 4 | 2 | 8,00 | livré |
| Marge | Copie et CSV | 3 | 4 | 2 | 6,00 | livré |
| Marge | Comparaison simultanée de scénarios | 4 | 3 | 3 | 4,00 | attendre un signal |
| Global | Collecteur agrégé sans valeurs | 5 | 3 | 4 | 3,75 | à instruire avec la politique de mesure |
| Rapprochement | Export `.xlsx` natif | 4 | 3 | 4 | 3,00 | attendre un signal |
| Rapprochement | Détail ligne à ligne et propositions | 5 | 3 | 5 | 3,00 | nouvelle capacité, non ouverte |
| Amortissement | Valeur résiduelle et exercice décalé | 5 | 2 | 5 | 2,00 | non retenu sans contrat métier |

### Gadgets écartés

- URL de partage avec valeurs : augmente le risque de fuite et contredit la promesse locale.
- Compte pour sauvegarder : ajoute une collecte avant qu’un besoin de retour soit prouvé.
- Bouton social générique : ne rend pas mieux la tâche.
- Conseil automatique de prix, durée ou éligibilité : dépasse les règles recettées.
- Faux fichier `.xlsx` renommé : le CSV annonce son format au lieu de le masquer.

## Click-path audit

| Touchpoint | Séquence finale | Risque contrôlé | Preuve |
|---|---|---|---|
| Exemple | clic → valeurs fictives → sortie précédente masquée → focus au premier champ | ancien résultat pris pour le nouvel exemple | test navigateur par outil |
| Effacer/recharger | reset natif → état visuel vidé → dépendances conditionnelles resynchronisées | boutons actifs sur données effacées | tests marge, échéance, amortissement, rapprochement |
| Calcul réussi | validation → calcul → rendu → activation copie/export → focus résultat quand utile | action disponible avant valeur | tests exacts et téléchargements |
| Calcul refusé | validation → sortie masquée ou marquée non exportable → erreur → focus champ | résultat ancien ou export incohérent | cas zéro, convention absente, durée, éligibilité, différence |
| Modification après succès | `input/change` → résultat, résumé et fichier en mémoire invalidés | sortie périmée encore visible | test marge et logique commune rejouée |
| Copie | résultat en mémoire → Clipboard API → statut succès/échec | silence en cas de permission refusée | tests avec permission + branche d’échec codée |
| Export | résultat valide → Blob local → téléchargement → révocation URL | fichier produit depuis un état invalide ; fuite mémoire | noms de fichiers et révocation contrôlés |
| CTA | clic volontaire → `/contact` → origine conservée seulement si formulaire envoyé avec consentement | attribution avant consentement | test route outil vers contact |
| Événement | interaction → `CustomEvent` avec action et slug seulement | valeur utilisateur incluse dans la télémétrie | test de séquence marge |

Aucun appel asynchrone de calcul ne crée de course. Aucun setter partagé ne réinitialise une action précédente. Les actions copie/export sont invalidées au changement d’entrée.

## Mesures à suivre en production

| Question | Instrument actuel | État |
|---|---|---|
| La page est-elle trouvée ? | Search Console, page × requête | point zéro ; première lecture utile le 21 octobre |
| L’outil attire-t-il des liens ? | DataForSEO Backlinks selon `OUTILS-BOUCLE.md` | point zéro 0, décision J+90 |
| Le visiteur envoie-t-il un contact ? | D1, `origine` exacte | actif, sans lecture nominative dans le relevé |
| Démarre-t-il, réussit-il, rencontre-t-il un refus ? | événements locaux `memlia:outil` | contrat actif, collecteur absent : **ND** |
| Recalcule-t-il ? | événement local `recalcul` | contrat actif, collecteur absent : **ND** |
| Revient-il ? | événement local `retour` sur reload/back-forward | contrat actif, collecteur absent : **ND** |
| Copie ou exporte-t-il ? | événements locaux `copie` et `export` | contrat actif, collecteur absent : **ND** |
| Atteint-il le CTA ? | événement local `cta`, puis D1 si envoi | clic **ND**, envoi mesuré |

Ne pas présenter les événements comme collectés : le CSP des pages bloque les connexions sortantes et aucun pipeline d’événements n’est branché. La conversion qui engage reste l’envoi D1, pas le clic.

## Vérification

| Contrôle | Résultat |
|---|---|
| `npm run check` | PASS, 0 erreur ; 8 hints hérités |
| Playwright outils | PASS, 21/21 |
| Build production | PASS ; portes blog, services, pages, preuves, lastmod, images, scripts et audit ressources vertes |
| Suite déterministe du build | PASS, 325 tests ; 0 échec |
| Rejeu final amortissement | PASS, 1/1 après le dernier ajustement visuel |
| Recette desktop/mobile | PASS, 10/10 parcours sur 5 routes × 2 largeurs ; 0 erreur console, requête échouée ou débordement |
| Inspection visuelle | PASS ; hub mobile et amortissement mobile sans défaut bloquant, boutons cohérents, indice ↔ du tableau visible |
| `git diff --check` | PASS |

## Inconnues conservées

- Le trafic, la réutilisation et la conversion des quatre routes ne sont pas encore mesurables.
- Les secondes jusqu’au résultat ne sont pas chronométrées sur de vrais utilisateurs ; seuls les gestes requis sont comparés.
- Les alternatives d’amortissement et de rapprochement n’ont pas de relevé SERP exploitable dans cette passe.
- Aucun verdict métier externe nouveau n’a été produit ; les limites existantes restent affichées.
