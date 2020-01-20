console.log("works!!", process.argv[3]);

//configs
const pg = require('pg');
const configs = {
    user: 'AngelFerreros',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
//end of configs


let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
      //NOTE: result.rows = array of objects
      console.log("result", result.rows[0].name );
    }
    client.end(); //disconnects client from DB Server
};

//function that runs once client is connected to server
let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  let text = "INSERT INTO items (name) VALUES ($1) RETURNING *";
  const values = process.argv[3];
    let taskToPrint = [`[ ] - `+ values];
    console.log(taskToPrint);

  client.query(text, taskToPrint, queryDoneCallback);
};

client.connect(clientConnectionCallback);
