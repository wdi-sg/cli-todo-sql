console.log("works!!", process.argv[2]);

const pg = require('pg');
const input = process.argv;
const configs = {
    user: 'andrew',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
//==================================//
const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};

//==================================//
    // Show entire to do list //
//==================================//
const show = (err)=> {
  if( err ){
    console.log( "error", err.message );
  }

let queryText = 'SELECT * FROM todo';

client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // iterate through all of your results:
      for( let i=0; i<res.rows.length; i++ ){
        console.log("result: ", res.rows[i]);
          }
        }
    });
};

//this means that it will occur immediately upon connection
client.connect(show);