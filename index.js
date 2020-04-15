console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'lekhweemeng',
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

//  let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";
     let text = "SELECT $1 FROM items"
  const values = ["*"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);

// setting up the scripts for addition of items.

if (process.argv[2] === 'SHOW'){

    let queryText = 'SELECT * FROM items';

    client.query(queryText, (err, res)=> {
        if (err){
            console.log("query error", err.message);
        } else {
            for( let i=0; i<res.rows.length; i++ ){
            console.log("result: ", res.rows[i]);
            }
        }
    })
}
// setting up to insert query into database
if (process.argv[2] === 'ADD'){

    let queryText = "INSERT INTO items (name) VALUES ($1)";
    const values = ["[ ] - " + process.argv[3]]

    client.query(queryText, values, (err, res) => {
        if (err) {
          console.log("query error", err.message);
        } else {
          console.log("done");
        }
    });
}