const pg = require('pg');

const configs = {
    user: 'robertkolsek',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for (let i = 0; i < result.rows.length; i++){
        console.log(`${result.rows[i].id}. [] - ${result.rows[i].todo}`)
      }
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let queryText;
  const command = process.argv[2].toLowerCase()

  const values = [process.argv[3]];

  if (command === "add"){
    queryText = "INSERT INTO items (todo) VALUES ($1) RETURNING *"
    client.query(queryText, values, queryDoneCallback);
  } else if (command === "show") {
    queryText = "SELECT * FROM items"
    client.query(queryText, queryDoneCallback)
  }

  
};

client.connect(clientConnectionCallback);
