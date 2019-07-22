
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

/* === Helper Functions === */

let show = () => {
    const text = 'SELECT * FROM todo';
    client.query(text, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            for (i=0; i < result.rows.length; i++) {
                if (result.rows[i].status === true) {
                    console.log (`${result.rows[i].id}.[ X ] - ${result.rows[i].task} \n Date Created: ${result.rows[i].created_at} \n Status: ${result.rows[i].status}`);
                } else if (result.rows[i].status === false) {
                    console.log (`${result.rows[i].id}.[] - ${result.rows[i].task} \n Date Created: ${result.rows[i].created_at} \n Status: ${result.rows[i].status}`);
                }
            }
            process.exit();
        }
    })
};

//callback function that runs when client is connected
let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  else if (command === 'show') {
    show();
  } else if (command === 'add') {
    const text = "INSERT INTO todo (task, status) VALUES ($1, $2)";
    let values = [taskName, false];
    client.query(text, values, show);
  } else if (command === 'done') {
    //find the result.row.status and change it to true

  }
};

//once connected, run the callback function
client.connect(clientConnectionCallback);