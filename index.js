const pg = require('pg');

const configs = {
    user: 'chelseaee',
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
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  const inputs = process.argv.slice(2).join(" ");

  let text = `INSERT INTO items (name) VALUES ('${inputs}') RETURNING id, name`;

  client.query(text, queryDoneCallback);


};

client.connect(clientConnectionCallback);
