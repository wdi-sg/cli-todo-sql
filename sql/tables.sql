CREATE TABLE IF NOT EXISTS tasklist (
    id SERIAL PRIMARY KEY,
    task TEXT,
    status BOOLEAN,
    created_on DATE DEFAULT now(),
    created_at TIMESTAMP DEFAULT now(),
    updated_on DATE,
    updated_at TIMESTAMP
);