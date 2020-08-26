CREATE TABLE IF NOT EXISTs items (
    id SERIAL PRIMARY KEY,
    completion TEXT,
    item TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP
);