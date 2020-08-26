CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    status TEXT,
    activity TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP
)