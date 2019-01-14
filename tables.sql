CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name text,
  checked BOOLEAN DEFAULT 'false'
);