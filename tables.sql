CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  task text,
  is_done boolean DEFAULT 'f',
  last_updated TIMESTAMPTZ DEFAULT now()
);