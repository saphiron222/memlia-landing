# Remise du recadrage registres-obligations

Cette recette remplace celle de t_5dbb5c18. Importer recette et corps, revue PASS métier du 06/10, preuve de dix cas et candidat scellé. Aucune publication sur ce run.

Angle : Kanta lit déjà l’INPI à l’ouverture, le BODACC propose des alertes génériques. Ne montrer que le travail résiduel vérifié dans l’outil du cabinet : fiche client actualisée à partir du RNE/BODACC/Sirene, alerte à l’associé, terme de déclaration de créance calculé dans le cas qualifié et validé.

Limite essentielle : le rejeu reprend des changements fournis en entrée, sans démontrer leur rapprochement automatique. Il calcule seulement le terme calendaire du cas général à deux mois ; exceptions, points de départ particuliers et prorogations humaines. Aucun délai opposable universel, connecteur livré, envoi ou déclaration autonome.

La note non bloquante de la revue sur la portée du rapprochement a été appliquée aux deux phrases du corps sans changer le fond réglementaire ni demander une seconde revue. Le candidat a ensuite été préparé et scellé à nouveau.

Importer couverture-registres-obligations.json dans COUVERTURE_SERVICES, en fusionnant seulement cette entrée. Le fichier complet couverture-logiciels.mjs et le test fournis sont un socle local de validation, pas un remplacement des entrées sœurs. Le socle provient du paquet t_069a7f0a ; son entrée facture-electronique n’est pas incluse dans cette livraison locale pour éviter une couverture orpheline.

Fusionner seulement les trois mesures de preuves/demande.json dans le relevé daté et l’entrée preuves/entree-registre.json dans le registre des requêtes. Ne pas remplacer les fichiers partagés par leurs copies de ce worktree.

Créer une preuve HTML propre à cette tâche, SERVICE_DESIGN et SERVICE_EEAT, matérialiser les trois liens déclarés et appliquer la chaîne dev/QA/publication de t_7621a3aa. Le lien Kanta du corps mène à l’accueil pour éviter le faux positif lexical « module » dans le chemin de son URL ; la source précise est conservée dans la couverture et la revue. Le test du bloc HTML ne contrôle ici aucun rendu, car cette phase ne construit pas le site : il faudra le vérifier sur l’artefact réellement construit.
