const pg = require('pg');

const configs = {
    user: 'Hilman',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

client.connect()

let text =
`CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    completed BOOLEAN,
    activity TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);`

client
  .query(text)
  .then(result => console.log(result.rows))
  .catch(e => console.error(e.stack))

for (var i = 0; i < 8; i++) {
    client
        .query("INSERT INTO items (completed,activity) VALUES (false,'dummy walks into a wall');")
        .then(result => console.log(result.rows))
        .catch(e => console.error(e.stack))
}

client
  .query("SELECT * FROM items;")
  .then(result => console.log(result.rows))
  .catch(e => console.error(e.stack))
  .then(() => client.end())