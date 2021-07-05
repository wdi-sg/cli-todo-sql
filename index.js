console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'yuiterai',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};


const client = new pg.Client(configs);


let commandType = process.argv[2];
let useInput = process.argv[3];




// let queryText = 'SELECT * FROM items';

// client.query(queryText, (err, res) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       // iterate through all of your results:
//       for( let i=0; i<res.rows.length; i++ ){
//         console.log("result: ", res.rows[i]);
//       }
//     }
// });



let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows);
    }
    client.end();
};



let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  if (commandType === "add") {
  let text = "INSERT INTO items(name) VALUES ($1) RETURNING id";
  const values = [useInput];
  client.query(text, values, queryDoneCallback);
  }
};

client.connect(clientConnectionCallback);




let queryText = 'SELECT * FROM items';

client.query(queryText, (err, res) => {
    if (commandType === "show") {
      // iterate through all of your results:
      for(let i=0; i<res.rows.length; i++){
        console.log(`${i+1}. [] - ${res.rows[i].name}`);
      }
    }
    if (err) {
      console.log("query error", err.message);
    }
});