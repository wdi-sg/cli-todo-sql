
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name text,
  done BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);