-- Messages du formulaire de contact. Rien n'est envoyé nulle part sans une personne :
-- le formulaire écrit ici, Kevin lit. Aucune pièce jointe, aucun fichier client.
CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  recu_le     TEXT    NOT NULL,            -- ISO 8601 UTC
  nom         TEXT    NOT NULL,
  cabinet     TEXT,
  courriel    TEXT    NOT NULL,
  message     TEXT    NOT NULL,
  ip_hash     TEXT,                        -- SHA-256 salé, uniquement pour la limite de débit ; purgé après 24 h
  navigateur  TEXT,
  statut      TEXT    NOT NULL DEFAULT 'nouveau'  -- nouveau | lu | traite
);
CREATE INDEX IF NOT EXISTS messages_recu_le ON messages (recu_le);
CREATE INDEX IF NOT EXISTS messages_ip_hash ON messages (ip_hash, recu_le);
