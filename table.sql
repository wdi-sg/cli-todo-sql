CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    description text,
    completionStatus boolean,
    dateCreated text ,
    dateCompleted text
);

