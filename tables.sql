CREATE TABLE IF NOT EXISTS todolist (
  id SERIAL PRIMARY KEY,
  index TEXT,
  to_do_description TEXT,
  mark_as_done TEXT,
  date_created TIMESTAMP DEFAULT now(),
  last_updated TIMESTAMP
);