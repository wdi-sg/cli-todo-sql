
// ========================
// Configuration and setup
// ========================
const pg = require('pg');

const configs = {
    user: 'hilmijohari',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let text = '';

let userCommand = process.argv[2];
let userInput = process.argv[3];


// If user types in "show" in command line

if (userCommand === "show") {

    text = 'SELECT * FROM items';

    let queryDoneCallback = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
          // console.log("Result:", result.rows
            for(let i=0; i < result.rows.length; i++ ) {
                console.log((i+1) + '. ' + result.rows[i].name)
            }
        }
    };

    let clientConnectionCallback = (err) => {

      if( err ){
        console.log( "error", err.message );
      }

      client.query(text, queryDoneCallback);
    };

    client.connect(clientConnectionCallback);

} else if (userCommand === "add") {

    text = "INSERT INTO items (name) VALUES ($1) RETURNING id, name";

    const values = ['[ ] - ' + userInput];

    let queryDoneCallback = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {

          console.log("Item added:", result.rows);
        }
    };

    let clientConnectionCallback = (err) => {

      if( err ){
        console.log( "error", err.message );
      }

      client.query(text, values, queryDoneCallback);
    };

    client.connect(clientConnectionCallback);
}