# Lot B — copy et parcours, 04 octobre 2026

## Périmètre

Candidat depuis origin/main après PR53. Corrections strictement bornées au lot B de CORRECTIONS.md (audit t_2caf75a7). Aucun corps d’article historique ou Cicatrice, aucun guide individuel, aucune route, aucun asset ni CSS modifié. Après le FAIL métier, le contact ajoute l’accord facultatif de provenance ; transport, schéma de stockage et durées restent inchangés.

- Garanties : comparaison et délais non démontrés retirés, formulations demandées reprises. La politique couvre le site ; les flux du service sont documentés par mission.
- Accueil / méthode / service / garanties : essais fictifs, puis recette dans l’environnement autorisé sur cas et fichiers convenus. Formats, accès et cas couverts bornent la règle ; validation et exceptions restent humaines. Audit légal listé, non ouvert.
- Contact : invitation par tâche récurrente, cas courant et exception. Réponse sur intérêt légitime ; provenance sur consentement distinct facultatif, non précoché.
- Glossaire : relance préparée, envoi validé ; pré-comptabilité avec propositions, sans écriture validée ; qualification RGPD par traitement ; modèle local distinct de l’absence de flux ; reliquat comparable sans preuve de fiabilité ; extraction sans OCR séparé obligatoire ; génération sans nouveauté garantie.
- Rubriques : ordre des articleIds, pas tri de dates ; orientation par geste.
- Intégrations : neuf liens conservés, quatre produits exacts (4 comptabilité Sage, 2 paie Sage, 1 Cegid, 2 mySilae).
- Méthode : aucune rubrique Sources vide, expérience interne maintenue. Dates de modification des trois pages réellement révisées actualisées ; dates de publication et d’articles intactes. Le registre lastmod ne change que pour les sept rendus réellement modifiés.

## Contact : constat du code

src/pages/contact.astro : la case historique consentement confirme désormais la lecture de la politique, et ne recueille aucun accord de provenance. La case consentement_origine est distincte, facultative et non précochée. Le script ne copie le pathname interne qu’après son accord et le vide au refus, puis vérifie à nouveau le choix avant envoi. L’absence de referrer ou de JavaScript laisse le champ vide.
functions/api/contact.js : la validation serveur ne conserve origine que pour consentement_origine=true (JSON) ou 'on' (formulaire). Toute autre valeur, même accompagnée d’un chemin forgé, produit NULL en base sans refuser le message. Le nettoyage du chemin et les protections anti-abus restent inchangés. Aucun envoi automatique au visiteur ; notification limitée au numéro et à l’heure. Tests sur données fictives et dépendances réseau interceptées, aucun message réel envoyé.
Politique : réponse/sécurité sur intérêt légitime, provenance sur consentement spécifique. Le chemin associé au message est une donnée personnelle, conservée au plus douze mois. Retrait par contact en ligne ou courriel : supprimer manuellement le champ origine du message concerné après identification de la demande, sans effacer le message nécessaire à la réponse. Ne pas réutiliser les provenances historiques comme si un accord distinct avait été obtenu : cette correction ne valide pas rétroactivement la collecte précédente.
La règle serveur, sa version livrée, le formulaire versionné et recu_le documentent les conditions de collecte des nouvelles origines. Aucun accès à la base réelle ni changement des messages historiques durant la recette. La revue métier doit confirmer ce dispositif et le mode de retrait avant publication.
Sources primaires relues le 04/10/2026 : https://www.cnil.fr/fr/les-bases-legales/consentement (libre, spécifique, éclairé, univoque, retrait et preuve) ; https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2 (articles 6 et 7).

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
