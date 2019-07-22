const pg = require('pg');

// const queryValues = [process.argv[2], process.argv[3]];


const configs = {
  user: 'postgres',
  password: 'passfoot',
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres'
};
//YOU HAVE TO PUT USER, DATABASE AS 'postgres'. Password as 'passfoot'.

const client = new pg.Client(configs);

let whenQueryIsComplete = (error, result)=>{
  if( error ){
    console.log("QURERY ~~~~ ERROR");
    console.log( error );
  }

  console.log( "RESULT");
  // console.log( result.rows );
};

// let searchId = process.argv[2]; for the first parameter.
// process.argv[2] - node index.js x  for id which ID you want to search for.

// returns the whole table

// let addItem = 'INSERT INTO todolist (name, completion) VALUES ($1, $2) RETURNING id';
const queryValues = [process.argv[2], process.argv[3]];
// Adds into the table based on the 'VALUES' given in a variable given.
// Completion is a boolean value so 1 for TRUE, 0 for FALSE.


//If user types in 'show', display all from the todo list.
var showList = function() {

        let queryText = 'SELECT * FROM todolist';

        client.query(queryText, (err, res) => {
            if (err) {
              console.log("query error", err.message);
            } else {
              // iterate through all of your results:
              for( let i=0; i<res.rows.length; i++ ){
                console.log("result: ", res.rows[i]);
              }
            }
        })
};

let onConnectCallback = (err)=>{
  console.log( "CONNECT");

  if( err ){
    console.log("ERROR");
    console.log( err );

  } else {

    // connection is good, send query

    if (process.argv[2] === 'show') {
        showList();
    }

    else {

        //add data to the list.
        let queryText = 'INSERT INTO todolist (name, completion) VALUES ($1, $2) RETURNING id';
        const queryValues = [process.argv[2], process.argv[3]];
        client.query(queryText, queryValues);
        // client.query(queryText, queryValues, whenQueryIsComplete );
    }

  }
};

console.log("about to call connect");
client.connect(onConnectCallback);
console.log("DONE calling connect");
