CREATE TABLE IF NOT EXISTS items(
id SERIAL PRIMARY KEY,
name TEXT,
done TEXT,
createdAt TIMESTAMP DEFAULT now(),
doneAt TIMESTAMP NULL,
timeTaken TIMESTAMP NULL

)