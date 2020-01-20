console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'rachelle',
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
    client.end(); // ends the thing, don't need to \q to get out
};


let queryText;
let values;
let choresDone = false;

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  switch(process.argv[2]) {
    case 'insert':
        queryText = 'INSERT INTO todo (name, done) VALUES ($1, $2) RETURNING id';
        values = [process.argv[3], choresDone];
    break;
    case 'select': 
        queryText = 'SELECT * FROM todo ORDER BY id ASC';
    break;
    case 'update':
        queryText = 'UPDATE todo set done=$2 WHERE id=$1 RETURNING *';
        choresDone = true;
        values = [process.argv[3], choresDone];
    break;
  }

  client.query(queryText, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
