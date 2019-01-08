CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name text,
  done text, 
  created_at TIMESTAMP DEFAULT now(),
  updated_at Varchar
);