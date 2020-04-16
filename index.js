console.log("/////////////////////////////////////");
console.log("///////// TO DO LIST PROGRAM ////////");
console.log("/////////////////////////////////////");


const pg = require('pg');

const configs = {
    user: 'shane',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const addCommand = process.argv[2];

console.log("Checking for command")

// A function that reads what command user inputted
checkCommand = (input) => {
    if( addCommand == "add"){
        console.log("-----------------------");
        console.log("INITIALIZE : ADD")

        const client = new pg.Client(configs);

        let queryDoneCallback = (err, result) => {
            if (err) {
              console.log("////////////////////////");
              console.log("query error", err.message);
              console.log("////////////////////////");
            } else {
              console.log("result", result.rows );
            }
            console.log("-----------------------");
            console.log("ending connection...");
            client.end();
        };

        // only activates when connection is successful
        let clientConnectionCallback = (err) => {
          // checks if connection has errors
          if( err ){
            console.log( "error", err.message );
          }
          // new data directory
          let text = "INSERT INTO todoitems (status, instructions) VALUES ($1, $2) RETURNING id";
          // retrieve input from process to fill data
          const values = [process.argv[3], process.argv[4]];

          client.query(text, values, queryDoneCallback);
          console.log("-----------------------");
          console.log("finished query...");
        };
        console.log("-----------------------");
        console.log("making the connection to database [todo]...");
        client.connect(clientConnectionCallback);

    }else{
        console.log("-----------------------");
        console.log("ERROR: COMMAND NOT FOUND");
        console.log("entered command: " + addCommand);
        }
};

checkCommand();