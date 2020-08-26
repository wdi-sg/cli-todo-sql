CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  status text,
  task text,
  created_at TIMESTAMP DEFAULT now(),
  updated_at text
);