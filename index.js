console.log("ACTION:", process.argv[2].toUpperCase());

const pg = require('pg');

const configs = {
    user: 'admin',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  if (process.argv[2] === "add"){
    let text = "INSERT INTO todo (name, status) VALUES ($1, $2) RETURNING id";
    const values = [process.argv[3], '[ ]'];
    client.query(text, values, queryDoneCallback);
  }

  else if (process.argv[2] === "show"){
    let text = "SELECT * FROM todo ORDER BY id ASC";
    client.query(text, queryDoneCallback);
  }

  else if (process.argv[2] === "delete"){
    let text = `DELETE FROM todo where id = ${process.argv[3]} RETURNING id`;
    let dropId = 'ALTER TABLE todo DROP id';
    let addId = 'ALTER TABLE todo ADD id SERIAL PRIMARY KEY';

    client.query(text, queryDoneCallback);
    client.query(dropId, queryDoneCallback);
    client.query(addId, queryDoneCallback);
  }

  else if (process.argv[2] === "done"){
    let text = `UPDATE todo SET status = '[X]' WHERE id = ${process.argv[3]} RETURNING id`;
    client.query(text, queryDoneCallback);
  }
};


client.connect(clientConnectionCallback);