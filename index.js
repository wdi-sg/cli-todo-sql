console.log("works!! your command: ", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'andrealmj',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: 'pg'
};

const client = new pg.Client(configs);


let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        for (let i=0; i<result.rows.length; i++ ) {
            if (result.rows[i].done) {
                console.log(result.rows[i].id + ". [x] - " + result.rows[i].name);
            } else {
                console.log(result.rows[i].id + ". [ ] - " + result.rows[i].name);
            }
        }
    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  // let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";

  // const values = ["hello"];

  // client.query(queryDoneCallback);

  switch (process.argv[2]) {

    case "show":
    let showTasks = "SELECT * FROM items";

    client.query(showTasks, queryDoneCallback);
    break;

    case "add":
    let newTask = `INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id`;
    const values = [process.argv[3], false];

    console.log(`Added your task '${process.argv[3]}'.`);
    client.query(newTask, values, queryDoneCallback);
    break;

    case "del":
    let deleteTask = `DELETE FROM items WHERE id = ${process.argv[3]}`;

    console.log(`Item ${process.argv[3]} deleted.`);
    client.query(deleteTask, queryDoneCallback);
    break;

    case "done":
    let completedTask = `UPDATE items SET done = true WHERE id = ${process.argv[3]}`;

    console.log(`Item ${process.argv[3]} marked as done.`);
    client.query(completedTask, queryDoneCallback);
    break;

    default:
    let text = "SELECT * FROM items";
    client.query(text, queryDoneCallback);

    }
};

client.connect(clientConnectionCallback);