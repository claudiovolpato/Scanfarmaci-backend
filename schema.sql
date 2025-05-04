-- Crea la tabella descrizioni
CREATE TABLE IF NOT EXISTS descrizioni (
  codice TEXT PRIMARY KEY,
  descrizione TEXT NOT NULL
);

-- Crea la tabella scansioni
CREATE TABLE IF NOT EXISTS scansioni (
  id SERIAL PRIMARY KEY,
  codice TEXT NOT NULL REFERENCES descrizioni(codice) ON DELETE CASCADE,
  quantita INTEGER NOT NULL,
  dataora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
