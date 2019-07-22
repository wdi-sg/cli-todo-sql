CREATE DATABASE todo;

DROP TABLE items;

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name text,
  completed boolean,
  created_at timestamptz DEFAULT now()
);

INSERT INTO items (name, completed) VALUES ('Wash plate', false);
INSERT INTO items (name, completed) VALUES ('Clear trash', false);