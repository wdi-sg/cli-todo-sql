console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'postgres',
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
    console.log( "Connection callback error", err.message );
  }
  else if (process.argv[2] === 'show'){
    let text = "select * from items";

    client.query(text, queryDoneCallback);
  }
  else if (process.argv[2] === 'add'){
    let text = "insert into items (name) values ($1) returning id";

    const values = [process.argv[3]];

    client.query(text, values, queryDoneCallback);
  }

};

client.connect(clientConnectionCallback);