//console.log("works!!", process.argv[2]);

var commandType = process.argv[2];
var itemName = process.argv[3];

//Init
const pg = require('pg');

const configs = {
    user: 'lty',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

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

//   let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";

//   const values = ["hello"];

//   client.query(text, values, queryDoneCallback);
// };

//client.connect(clientConnectionCallback);

switch (commandType) {
  case "show":
    client.connect(err => {
      if (err) {
        console.log("error", err.message);
      } else {
          let queryText = `SELECT * FROM items ORDER BY id ASC`;
          client.query(queryText, (err, res) => {
            if (err) {
              console.log("query error", err.message);
            } else {
              let doneBox;
              // let updatedAtOutput;

              for (let i = 0; i < res.rows.length; i++) {
                let id = res.rows[i].id;
                let done = res.rows[i].done;

                if (done === false) {
                  doneBox = "[ ]";
                  // updatedAtOutput = "NA";
                } else if (done === true) {
                  doneBox = "[x]";
                  // updateField = res.rows[i].updated_at;
                }
                console.log(
                  `${id}. ${doneBox} - ${
                    res.rows[i].name
                  }`
                );
              }
            }
          });
      }
    });
    break;
  case "add":
    client.connect(err => {
      if (err) {
        console.log("error", err.message);
      } else {
        let queryText =
          "INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id";
        const values = [itemName, false];

        client.query(queryText, values);
        console.log(`\nAdded: ${itemName}\n`);
      }
       process.exit();
    });
    break;
    default:
        console.log("\nPlease Enter a valid argument\n");
        process.exit();
        break;
};