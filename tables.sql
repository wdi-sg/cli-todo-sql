CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name text,
  complete boolean,
  created_at date NOT NULL,
  updated_at date
);