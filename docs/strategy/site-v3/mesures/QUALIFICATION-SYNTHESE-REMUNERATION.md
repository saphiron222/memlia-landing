# Synthèse annuelle de rémunération — qualification du 06/10/2026

Décision : ne pas ouvrir `/automatisation/synthese-remuneration` à ce stade. Rattacher la famille `synthese-remuneration` au service général `/automatisation-cabinet-comptable`, à titre documentaire uniquement. L'article pilier nomme déjà la tâche RH interne. Aucune modification publique ni ajout sur `/automatisation/paie` n'est demandé : le contrôle mensuel des bulletins est une autre tâche.

## Besoin et périmètre

Le résultat candidat est une synthèse annuelle individuelle préparée depuis la paie déjà tenue, à soumettre à la personne habilitée avant remise. Il ne consiste ni à calculer une paie, ni à corriger un bulletin, ni à décider d'une augmentation, ni à interpréter seul un avantage. C'est un besoin intelligible ; la recherche ne démontre cependant pas une demande de cabinet pour le faire prendre en charge par un service sur mesure.

Le vocabulaire public observé est « bilan social individuel » (BSI) et « rapport individuel ». Le BSI concurrent est plus large que le périmètre initial : rémunération globale et avantages, éventuellement formation et épargne. Ce n'est pas un synonyme exact de notre synthèse depuis la paie tenue. Il ne faut donc ni étendre le service implicitement, ni créer une variante de page au seul motif que BSI ressort en autocomplétion.

## Mesures de demande

Instrument réellement exécuté : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, français/France, via `rechercher.mjs`, le 06/10/2026 à 08:25 UTC. Les huit réponses sont réussies, cinq listes sont vides, trois contiennent des suggestions ; douze suggestions retournées au total, avec répétition entre sondes. Il ne s'agit pas de volumes mensuels ni de douze requêtes commerciales uniques.

| Sonde | Suggestions |
|---|---|
| automatisation synthèse rémunération cabinet comptable | aucune |
| synthèse annuelle rémunération salarié | aucune |
| synthèse rémunération | aucune |
| bilan social individuel | 10 : terme générique, obligatoire, exemple, Silae, BSI, Excel gratuit, définition, Adecco, PDF, anglais |
| bilan social individuel automatisation | aucune |
| bilan social individuel cabinet comptable | aucune |
| bilan social individuel Silae | 1 : bilan social individuel silae |
| récapitulatif annuel rémunération | 1 : récapitulatif salaire annuel |

Lecture : un vocabulaire générique et informationnel existe, avec une suggestion de marque. La candidate commerciale et les deux sondes BSI les plus proches de la délégation restent vides. Cela ne prouve pas une absence de marché, mais ne suffit pas à créer une page de service distincte. Aucun volume ni classement SERP n'est revendiqué.

Historique consulté sur origin/main : quatre angles dans `backlog-v3.json` (préparation, checklist, interprétation, définition), tous à zéro au 19/09. Les entrées détaillées de `autocompletion-cache.json` ont été conservées dans `captures/contexte.json`. Le registre commun et le contrat d'intention restent inchangés : aucune requête primaire n'est réservée pour la candidate.

## Concurrence : sources ouvertes et citations exactes

1. WINCHApps, page BSI, ouverte le 06/10/2026, HTTP 200 sans redirection :
   https://www.winchapps.com/nos-solutions/e-bilan-social-individuel/

   « Le BSI digital WINCHApps est une synthèse annuelle personnalisée qui offre une vision dynamique et intuitive de tout ce que perçoit chaque salarié. Bien plus qu’une fiche de paie, l’outil valorise l’ensemble des avantages sociaux et dispositifs de rémunération ainsi que leur évolution chaque année. »

   « Un espace “admin” ultra simplifié, une méthodologie d’import de données claire et une application en ligne (SaaS) qui ne requiert ni hébergement ni maintenance de votre part. »

   Constat : une offre spécialisée couvre la restitution annuelle globale avec import et espace salarié. Ce sont des affirmations de l'éditeur, pas une recette testée par Memlia. Les gains, certifications et déclarations juridiques présents ailleurs sur la page ne sont pas repris.

2. Silae, mySilae BI Studio, ouverte le 06/10/2026, HTTP 200 sans redirection :
   https://www.silae.fr/silae-bi-studio/

   « Obtenez jusqu’au détail des informations de vos salariés au travers d’une fiche synthétique individuelle récapitulant les informations sur 12 mois glissants. »

   « À travers le rapport individuel, retrouvez les informations personnelles et professionnelles (poste, ancienneté, âge, etc.)​, le détail des rémunérations perçues sur les 12 derniers mois​, des primes et le détail des absences et présences sur les 12 derniers mois​ du salarié. »

   Constat : restitution individuelle et rémunérations déjà documentées dans l'écosystème paie. Douze mois glissants ne sont pas nécessairement l'année civile demandée ; cela reste une différence de période à qualifier, pas une preuve suffisante de manque commercial. Ne pas prétendre que Silae fournit un BSI annuel complet, une validation humaine configurée ou tous les avantages hors paie.

Les captures HTML et textes, URLs finales et dates se trouvent dans le paquet. Les pages Silae initialement sondées `/bilan-social-individuel/` et `/mysilae-bi/` redirigent vers l'accueil : elles ont été écartées comme preuves de fonctionnalité. Le lien BI Studio a été découvert sur le site, pas inventé comme résultat de recherche. Le guide WINCHApps est archivé mais n'est pas une source officielle de droit.

## Rattachement et anti-cannibalisation

Le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` nomme déjà la synthèse annuelle dans le pôle RH/formation. La famille source décrit « Produire la synthèse annuelle d’un salarié à partir de la paie tenue. » Le rattachement documentaire reste le service général, où une mission spécifique peut être cadrée sans créer un catalogue.

`/automatisation/paie` reste public (HTTP 200 constaté), mais il porte une autre tâche. Aucun remplacement d'URL, redirection, canonical, modification de footer, page BSI ou article de checklist n'est demandé. La candidate répond actuellement 404 ; le service général répond 200. Ces constats sont des vérifications de surface, pas une livraison publique.

## Conditions de réouverture

Réouvrir si une demande concrète de cabinet ou une mesure commerciale fraîche montre une synthèse annuelle à préparer que le rapport/export existant ne fournit pas dans les outils utilisés. Qualifier d'abord : année civile ou glissante, données effectivement présentes dans la paie, éléments hors paie, destinataire habilité, format, version des corrections et validation avant remise. L'écart devra être documenté, pas déduit d'un manque dans une page éditeur.

À cette condition seulement : recette à neuf sections, tableau « Se prépare seul | Attend une validation | Reste humain », vrai rejeu fictif courant/limite/refus, préparation par la forge, une revue métier indépendante puis scellement. Ces sorties sont non applicables pour la décision actuelle ; aucune recette vide, aucun PASS métier ou rejeu fictif n'est fabriqué.

## Limites et incidents

Firecrawl web_search et web_extract : HTTP 403. Google recherche : page sorry. Bing affiche des résultats de bilan comptable hors sujet ; écarté. DuckDuckGo : défi anti-bot ; aucun contournement. La SERP n'est donc pas qualifiée, et la concurrence lue n'est pas exhaustive. Les sources éditeurs ont été ouvertes directement et archivées. L'erreur initiale de certificat Python a été corrigée avec le magasin `/etc/ssl/cert.pem`, sans désactiver TLS. L'autocomplétion a fonctionné ; aucune panne n'est traitée comme un zéro.

Aucune donnée client, aucune expérience réelle supposée, aucun montant de gain, aucune conformité juridique revendiquée. Cette qualification est une décision de recherche, pas un contenu réglementé destiné à la publication.

## Livraison au développeur

Intégrer uniquement les trois fichiers de `livraison/` dans `docs/strategy/site-v3/mesures/` sur la voie documentaire existante. Le paquet comporte les captures et scripts pour vérification ; ils n'ont pas besoin d'être ajoutés au site. La carte dev précréée est réorientée avant clôture du parent. Aucun fichier global n'a été modifié par cette recherche ; le worktree créé depuis origin/main reste propre.
