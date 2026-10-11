# Ventes et journaux de caisse — qualification du service candidat

Décision : ne pas ouvrir /automatisation/ventes-caisse à ce stade. Rattachement documentaire au service général /automatisation-cabinet-comptable ; conserver la famille et les angles du backlog. Le besoin opérationnel est identifiable, mais la demande de délégation distincte reste non qualifiée. Ne pas convertir une possibilité technique en nouvelle page commerciale.

## Demande mesurée le 06/10/2026

Huit sondes Google autocomplete, client firefox, hl=fr, gl=fr, réponses brutes et URL dans mesures.json. Sept listes vides ; quatre suggestions, uniquement pour « logiciel caisse comptabilité » : « logiciel caisse comptabilisation », « logiciel caisse compatible pennylane », « logiciel caisse compatible shopify », « logiciel de caisse comptabilité ».

La candidate « automatisation import ventes caisse cabinet comptable », les deux formulations cabinet du backlog, l'import de caisse et le contrôle d'écart ne produisent aucune suggestion. Le signal visible porte sur logiciel/compatibilité, pas sur une délégation à Memlia. Une liste vide ne signifie pas zéro demande ; l'autocomplétion n'est ni un volume mensuel ni une SERP. Aucun volume ni rang Google France revendiqué.

Recherche et extraction Firecrawl ont répondu 403 ; reprise par lectures HTTPS curl avec TLS vérifié, puis navigateur sur la fiche Shopify. Le navigateur confirme la présence du catalogue mais n'apporte pas de détail fonctionnel supplémentaire. Il ne s'agit pas d'un classement des concurrents.

## Besoin utile et concurrence

Le geste à qualifier : récupérer un export caisse ou e-commerce, vérifier les colonnes et la période, comparer les totaux source/sortie et préparer les lignes de journal selon les règles confirmées du cabinet. Un import rejoué ne doit pas créer de nouvelles ventes. Les ventes brutes, remboursements, commissions et versements nets ne sont pas interchangeables : un versement bancaire net ne suffit pas à reconstruire les ventes.

Pennylane, deux fiches officielles ouvertes en HTTP 200 le 06/10/2026 :
- https://www.pennylane.com/fr/integrations/shopify — « Connecter Shopify à Pennylane » ; « Shopify est une plate-forme de commerce électronique en mode SaaS ».
- https://www.pennylane.com/fr/integrations/sumup — « Connecter SumUp à Pennylane » ; « SumUp propose des solutions de caisse adaptées à vos besoins ».
Les deux fiches portent aussi : « Pour simplifier la récupération de vos flux et la gestion de votre activité, Pennylane se connecte à tous vos outils métier. »

Ces sources établissent des intégrations annoncées pour un environnement de commerce en ligne et un acteur de caisse/paiement. Leurs sections d'avantages sont vides dans les lectures réalisées. Elles ne permettent donc pas d'affirmer quels totaux, écritures, doublons, remboursements ou commissions sont traités, ni avec quelle granularité. Aucun connecteur exécuté, prix comparé ou compatibilité Memlia démontrée. Avant une prestation sur mesure, vérifier ce que l'outil déjà utilisé couvre réellement.

Angle Memlia résiduel possible : contrôler des exports hétérogènes et produire une sortie exploitable dans l'outil du cabinet, lorsque ce geste n'est pas couvert. Il manque un exemple terrain avec source, périodicité, clé d'unicité, règles de reprise, écarts et destination. Les suggestions de compatibilité et la présence de connecteurs ne suffisent pas à qualifier ce marché de délégation.

## Frontière à conserver

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Lire les exports autorisés ; vérifier schéma/période ; identifier les doublons selon une clé confirmée ; comparer totaux source/sortie ; préparer le journal et signaler les écarts | Confirmer la correspondance des champs, les règles comptables, la clé d'unicité, la reprise d'un export corrigé et le traitement des écarts | Choisir l'imputation et le traitement fiscal ; expliquer un écart de caisse ; décider d'une correction ou d'une écriture définitive |

Pas de correction silencieuse d'écart, d'imputation devinée ou de taux créé pour équilibrer le journal. Garder la trace des lignes source et du lot déjà traité. Distinguer doublon de fichier, vente légitime de même montant et correction d'une vente antérieure. Séparer ventes/avoirs, commissions et encaissements ; ne pas confondre caisse physique et règlements e-commerce.

Ce cadrage n'est pas une règle implémentée. Aucun rejeu, recette, revue métier PASS, service:preparer ou scellement revendiqué : ces étapes sont conditionnelles à une candidate retenue.

## Couverture et cannibalisation

src/data/familles.ts définit déjà ventes-caisse : « Importer les ventes (caisse, e-commerce, facturation client) sans ressaisie et contrôler les écarts. » Le pilier /blog/automatiser-un-cabinet-comptable-la-carte-des-taches évoque les ventes de caisse/boutique en ligne et l'import avec contrôle de schéma ; il reste inchangé.

Le backlog du 19/09 conserve quatre angles non publiés : import caisse/e-commerce, contrôle avant validation, écarts que l'import ne corrige pas seul, définition du journal de ventes. Leurs mesures historiques de suggestions sont nulles ; les questions remontées portent notamment sur l'importation de marchandises et des comptes comptables, sans qualification spécifique du flux de caisse. Ne pas traiter ces questions comme une validation commerciale.

Le service candidat ne doit pas dupliquer le service d'import générique, la saisie ou l'OCR : son éventuelle spécificité est le contrôle des totaux de ventes et la reprise des lots de caisse/e-commerce, pas la simple lecture d'un fichier. Le rattachement au service général est documentaire, pas un canonical technique, une redirection ou une modification publique. Production contrôlée sans query string, Cache-Control: no-cache : candidate 404 ; service général 200.

## Réouverture et transmission

Requalifier si un cabinet décrit un import répétitif insuffisamment couvert par son outil, avec exports autorisés, destination, fréquence, règle de doublon et contrôle des totaux ; ou si une intention commerciale distincte apparaît dans une nouvelle mesure. Vérifier les connecteurs existants avant d'écrire une recette. Trois futurs cas fictifs minimum : lot cohérent, lot déjà importé, écart ou schéma incompatible ; ajouter un remboursement/commission pour ne pas confondre vente et versement net. Ce sont des essais proposés, non exécutés.

L'enfant dev t_02783a0d est réorienté vers l'intégration documentaire de trois fichiers livraison/ uniquement, sous docs/strategy/site-v3/mesures/. Il ne publie pas la route et ne réserve pas de requête. Préserver backlog, registre, familles et pages existantes. L'archive conserve réponses brutes, captures sources et scripts de contrôle. Aucun budget API engagé.
