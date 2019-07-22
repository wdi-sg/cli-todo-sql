console.log("This is user input: ", process.argv[2]);

// var inputOne = process.argv[2];
// var inputTwo = process.argv[3];

const pg = require('pg');

const configs = {
    user: 'KWAN',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
//////////////////////////////////////////////////////

var input2 = process.argv[2];
var input3 = process.argv[3];

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
  } else {
      console.log("result", result.rows );
  }
};

//////////////////////////////////////////////////////

let clientConnectCallback = (err) => {
    if (err) {
        console.log("error", err.message);
    }

    else if (input2 === 'show') {

        let queryText = "SELECT * FROM items";

        client.query(queryText, (err, result) => {

            if (err) {
                console.log("query error", err.message);
            }

            else {
                console.log("results");

                for (let i=0; i<result.rows.length; i++ ){
                console.log(result.rows[i].id + ". " + result.rows[i].task + "-" + result.rows[i].checkbox);
                }
            }

        })
    }

    else if (input2 === 'add') {
        let text = "INSERT INTO items (task, checkbox) VALUES ($1, $2) RETURNING id";

        const values = [input3, 'x'];

        client.query(text, values, queryDoneCallback);
    }
};


      client.connect(clientConnectCallback);