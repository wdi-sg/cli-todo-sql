CREATE TABLE IF NOT EXISTS todo (
  id serial PRIMARY KEY,
  name text,
  done boolean default false,
  created_at timestamp default now(),
  updated_at timestamp
);