//in case u forgot process.argv
// console.log("works!!", process.argv[2]);
let command = process.argv[2];
let taskName = process.argv[3];

/* ================== Configurations ================== */

const pg = require('pg');
const configs = {
    user: 'elisu',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
const client = new pg.Client(configs);

/* === Set variables based on queries  === */

//callback function that runs when client is connected
let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  else if (command === 'show') {
    const text = 'SELECT * FROM todo';
    client.query(text, showFunction);
  } else if (command === 'add') {
    const text = INSERT INTO todo
    (task, status)
    VALUES
    (taskName, 'false');
    client.query(text, addFunction);
  }
};

/* === Helper Functions === */
showFunction = (err, result) => {
    if (err) {
        console.log(err);
    } else {
        for (i=0; i < result.rows.length; i++) {
            console.log (`${result.rows[i].id}. ${result.rows[i].task} \n Date Created: ${result.rows[i].created_at} \n Status: ${result.rows[i].status}`);
        }
        process.exit();
    }
};

addFunction = (err, result) => {
    if (err) {
        console.log(err);
    } else {
        //show the updated list
        console.log(SELECT id, task, status FROM todo);
    }
        process.exit();
};


//   let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";
//   const values = ["hello"]
//   client.query(text, values, queryDoneCallback);

//   let queryDoneCallback = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("RESULT:");
//       console.log(result);
//       process.exit();
//     }
// };

//once connected, run the callback function
client.connect(clientConnectionCallback);