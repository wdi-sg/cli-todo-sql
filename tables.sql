CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  completion BOOLEAN DEFAULT False,
  number SERIAL,
  todo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
)