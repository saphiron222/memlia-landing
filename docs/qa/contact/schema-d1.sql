-- Schéma de la base D1 « memlia-contact », relevé depuis la base elle-même le 2026-09-19.
--
-- Il n'existait nulle part dans le dépôt : la structure ne vivait que dans la base, donc une
-- reconstruction ou un second environnement se seraient faits de mémoire. Ce fichier est un
-- RELEVÉ, pas une migration : il se remet à jour par
--   npx wrangler d1 execute memlia-contact --remote --command \
--     "SELECT sql FROM sqlite_master WHERE type IN ('table','index') AND name NOT LIKE 'sqlite_%';" --json
--
-- Dernier changement : colonne `origine` ajoutée le 2026-09-19 (décision D4) — le chemin de la
-- page du site depuis laquelle le formulaire a été ouvert, jamais une page extérieure.

CREATE TABLE _cf_KV (
        key TEXT PRIMARY KEY,
        value BLOB
      ) WITHOUT ROWID;

CREATE TABLE messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  recu_le     TEXT    NOT NULL,            -- ISO 8601 UTC
  nom         TEXT    NOT NULL,
  cabinet     TEXT,
  courriel    TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  ip_hash     TEXT,                        -- SHA-256 salé, uniquement pour la limite de débit ; purgé après 24 h
  navigateur  TEXT,
  statut      TEXT    NOT NULL DEFAULT 'nouveau'  -- nouveau | lu | traite
, origine TEXT);

CREATE INDEX messages_recu_le ON messages (recu_le);

CREATE INDEX messages_ip_hash ON messages (ip_hash, recu_le);
