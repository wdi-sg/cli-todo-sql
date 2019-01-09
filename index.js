const pg = require('pg');
const configs = {
    user: 'the574life',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
const client = new pg.Client(configs);

let action = process.argv[2];


/* ____________________________________*/



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



  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);