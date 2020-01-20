console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'weizheng1910',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("Result: ", result.rows );
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let newTask = process.argv[2];
  let text = "INSERT INTO items (name,doneYet) VALUES ($1,$2) RETURNING *";

  const values = [newTask,false];

  client.query(text, values, queryDoneCallback);
  
};

client.connect(clientConnectionCallback);
