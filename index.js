console.log("works!!");

const pg = require('pg');

const configs = {
    user: 'changhaoteo',
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
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  // let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";

  // const values = ["hello"];

  if (process.argv[2] === 'show') {
      let text = "SELECT * FROM items ORDER BY id";
      // const values = ["hello"];
      client.query(text, queryDoneCallback);
  };

  if (process.argv[2] === 'insert') {
    let text = `INSERT INTO items (name) VALUES ('${process.argv[3]}');`;
    // console.log(process.argv[3]);
    // console.log(text);
    client.query(text, queryDoneCallback);
  };

  if (process.argv[2] === 'update') {
    let text = `UPDATE items SET name ='${process.argv[3]}' WHERE id = '${process.argv[4]}';`;
    // console.log(process.argv[3]);
    // console.log(text);
    client.query(text, queryDoneCallback);
  };

    if (process.argv[2] === 'delete') {
    let text = `DELETE FROM items WHERE id = '${process.argv[3]}';`;
    // console.log(process.argv[3]);
    // console.log(text);
    client.query(text, queryDoneCallback);
  };

    if (process.argv[2] === 'done') {
    let text = `UPDATE items set status ='done' WHERE id = '${process.argv[3]}';`;
    // console.log(process.argv[3]);
    // console.log(text);
    client.query(text, queryDoneCallback);
  };


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


};

client.connect(clientConnectionCallback);