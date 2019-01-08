const pg = require('pg');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: 'pg'
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        let x;
        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].done) {
                x = 'x';
            } else {
                x = ' ';
            }
            console.log(`${result.rows[i].id}. [${x}] - ${result.rows[i].name} created at ${result.rows[i].created_at} | updated at ${result.rows[i].updated_at}\n`)
        }
    }
};

let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }
  //User Commands
  let text;
  switch(process.argv[2]) {
    case 'show':
        text = "SELECT * FROM items ORDER BY id ASC;"
        client.query(text, queryDoneCallback);
        break;

    case 'add':
        text = "INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id";
        const values = [process.argv[3], false];
        client.query(text, values, queryDoneCallback);
        break;

    case 'done':
        text = `UPDATE items SET done=true, updated_at=now() WHERE id = ${process.argv[3]}`;
        client.query(text, queryDoneCallback);
        break;

    case 'delete':
        text = `DELETE from items WHERE id = ${process.argv[3]}`;
        client.query(text, queryDoneCallback);
        break;

    default:
        text = "SELECT * FROM items;"
        client.query(text, queryDoneCallback);
  }
};

client.connect(clientConnectionCallback);
