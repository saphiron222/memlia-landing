-- Appliquer une seule fois avant le déploiement de la fonction de contact.
-- Les demandes historiques restent non qualifiées ; aucune inférence d'audience.
ALTER TABLE messages ADD COLUMN type_cabinet TEXT CHECK (type_cabinet IN ('ec', 'cac', 'mixte'));
