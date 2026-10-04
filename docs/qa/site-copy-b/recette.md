# Lot B — copy et parcours, 04 octobre 2026

## Périmètre

Candidat depuis origin/main après PR53. Corrections strictement bornées au lot B de CORRECTIONS.md (audit t_2caf75a7). Aucun corps d’article historique ou Cicatrice, aucun guide individuel, aucune route, aucun asset ni CSS modifié. Le contact garde ses champs, son transport, son stockage et ses durées.

- Garanties : comparaison et délais non démontrés retirés, formulations demandées reprises. La politique couvre le site ; les flux du service sont documentés par mission.
- Accueil / méthode / service / garanties : essais fictifs, puis recette dans l’environnement autorisé sur cas et fichiers convenus. Formats, accès et cas couverts bornent la règle ; validation et exceptions restent humaines. Audit légal listé, non ouvert.
- Contact : invitation par tâche récurrente, cas courant et exception. Notice alignée sur les deux finalités déjà réalisées.
- Glossaire : relance préparée, envoi validé ; pré-comptabilité avec propositions, sans écriture validée ; qualification RGPD par traitement ; modèle local distinct de l’absence de flux ; reliquat comparable sans preuve de fiabilité ; extraction sans OCR séparé obligatoire ; génération sans nouveauté garantie.
- Rubriques : ordre des articleIds, pas tri de dates ; orientation par geste.
- Intégrations : neuf liens conservés, quatre produits exacts (4 comptabilité Sage, 2 paie Sage, 1 Cegid, 2 mySilae).
- Méthode : aucune rubrique Sources vide, expérience interne maintenue. Dates de modification des trois pages réellement révisées actualisées ; dates de publication et d’articles intactes. Le registre lastmod ne change que pour les sept rendus réellement modifiés.

## Contact : constat du code

src/pages/contact.astro : le script copie uniquement le pathname du referrer de même origine dans origine ; absence de referrer ou de JavaScript laisse le champ vide. La case consentement est unique, obligatoire et non précochée. Il n’existe pas de consentement facultatif distinct pour la provenance : la nouvelle notice énonce les deux finalités de cette même case, sans inventer une option.
functions/api/contact.js : valider refuse l’absence de consentement, borne et nettoie origine ; l’écriture D1 contient le chemin sans query ni fragment. Aucun envoi automatique au visiteur. Notification facultative limitée au numéro et à l’heure ; pas de PII dans la notification. Vérification uniquement sur code et données fictives en tests, aucun message réel envoyé.
La politique existante décrit déjà cette provenance pour comprendre quelle page amène une demande. Pas de changement de base légale ni de conservation.

## Vérification des sources

Sources primaires ouvertes le 04/10/2026 et copies dans sources/ :

- CNIL, définition sous-traitant : « traite des données pour le compte d’un autre organisme » et obligations contractuelles.
- RGPD, article 4, points 7 et 8 (CNIL, chapitre I) : responsable déterminant les finalités et moyens ; sous-traitant traitant pour son compte. Cette source porte les deux assertions nouvelles de qualification, désormais raccordées dans le registre du glossaire.
- RGPD, article 28 §3 a et §10 (CNIL, chapitre IV) : instruction documentée ; un sous-traitant déterminant les finalités et moyens devient responsable pour ce traitement. Extrait réel conservé dans cnil-instructions-rgpd.md.
- CNIL, déploiement IA générative : génération et remaniement de contenus préexistants, nature probabiliste, recommandation de systèmes locaux ; aucune garantie universelle d’absence de connexions.
- Microsoft Learn, Document Intelligence v4 : modèles extrayant champs, texte, structure. Documentation technique, pas norme juridique ; ne prouve pas un produit Memlia installé.

Les copies CNIL courtes sont complètes. La copie Microsoft est une fenêtre avec la troncature explicitement signalée, suffisante pour la description des modèles en début de page. La source juridique chapitre I est complète. Les sources historiques du glossaire non concernées restent dans leur dossier d’origine, sans nouvelle date de consultation inventée.

## Classification des sources

CNIL / texte RGPD : primaires officielles pour rôles et instructions. Microsoft : documentation primaire de technologie. Définitions pré-comptabilité, relance et reliquat : conventions de périmètre du service, pas normes universelles. Les scénarios restent fictifs. L’interprétation juridique et la notice de contact attendent la revue metier indépendante.

## Tests et remise à la revue

Sept régressions de copy / ordre / projection de source ajoutées après constat de leur échec initial (six défauts de copy ; date d’une assertion additionnelle reproduite séparément). Contrats navigateur sur six largeurs et sans JavaScript. Tests existants contact et glossaire rejoués, tests de dates mis à jour sur les seules pages révisées.

Le changement de source sur les deux assertions RGPD est un changement de fond : l’ancien verdict n’est pas revendiqué pour elles. Le manifeste courant attend la revue métier. Les preuves historiques demeurent intactes dans docs/qa/hub-ressources/metier-review-r5/preuve-glossaire.json et origin/main. Le reviewer peut reprendre les verdicts des affirmations inchangées et juger les deux couples nouveaux, puis enregistrer son unique revue de ce lot. Pas de seconde revue pour les dates ou liens.

Procédure reviewer : lire le candidat public et les sources, compléter claimsEvidence.sensitiveMatter.businessReview et sa preuve depuis le sujet courant (helpers scripts/lib/resource-pipeline.mjs), conserver les verdicts historiques réellement inchangés, actualiser les deux nouveaux couples et la campagne. Régénérer le registre machine après l’enregistrement de la revue, ainsi que les digests de candidat/audit si nécessaire ; ne pas relancer le scellement ensuite, qui réinitialise la revue en attente. npm run build et Repository gates doivent alors passer avant fusion. Contrôler les phrases avec tests/browser/site-copy-b.spec.ts via QA_URL sur le déploiement, puis sur https://memlia.fr, et transmettre le constat final à t_2caf75a7. La carte guides suivante reste dépendante de cette publication.
