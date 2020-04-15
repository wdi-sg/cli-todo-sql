// node-postgres config
const pg = require('pg');
const configs = {
    user: 'dwu',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
const client = new pg.Client(configs);

const handleError = function (err) {
  console.log("Connect error:", err);
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
