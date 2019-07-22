const pg = require('pg');
//configuration
const configs = {
user: 'caspianzx',
host: '127.0.0.1',
database: 'todo',
port: 5432,
};

// const client = new pg.Client(configs);

// let queryDoneCallback = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("result", result.rows );
//     }
// };

// let clientConnectionCallback = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }

//   let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

//   const values = ["hello"];

//   client.query(text, values, queryDoneCallback);
// };

// client.connect(clientConnectionCallback);

// let input1= process.argv[2]

const client = new pg.Client(configs);
client.connect((err) => {
  if( err ){
    console.log( "error", err.message );
    } else if (process.argv[2] == 'add' && process.argv[3] != undefined) {
        let queryText = 'INSERT INTO items (name) VALUES ($1)';
        const values = [process.argv[3]];
        client.query(queryText, values, (err, res) => {
            if (err) {
            console.log("query error", err.message);
                } else {
      // iterate through all of your results:
            console.log('it works')
            }
        });
    }
});