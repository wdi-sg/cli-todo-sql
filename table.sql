CREATE TABLE IF NOT EXISTS todosql (
    id SERIAL PRIMARY KEY,
    completed BOOLEAN,
    name TEXT
);