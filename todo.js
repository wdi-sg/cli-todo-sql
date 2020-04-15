console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'rachelik',
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
    client.end();
};

let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

  const actToDo = process.argv[2].toLowerCase();

  if (actToDo === "show") {
    //to show all the list
    let showItems = "SELECT * FROM items ORDER BY id ASC";
    client.query(showItems, queryDoneCallback);

  } else if (actToDo === "add") {
    //to add item to the list
    const taskDescription = process.argv[3];
    const createdDate = new Date();
    const updatedDate = null;

    let addItems = "INSERT INTO items (task, created_at, update_at) VALUES ($1, $2, $3) RETURNING id";
    const values = [taskDescription, createdDate, updatedDate];

    client.query(addItems, values, queryDoneCallback);
  } else if (actToDo === "done") {

    //the id of the task that was done to be marked done.
    const markDone = "X";
    const idToMark = process.argv[3];
    const updatedDate = new Date();

    let updateStatus = "UPDATE items SET status=$1, update_at=$2 WHERE id=$3";

    const values = [markDone, updatedDate, idToMark];

    client.query(updateStatus, values, queryDoneCallback);
  } else if (actToDo === "delete") {
    const idRowToDelete = process.argv[3];

    let deleteRow = "DELETE FROM items WHERE id = $1";
    const values = [idRowToDelete];

    client.query(deleteRow, values, queryDoneCallback);
  }
};

client.connect(clientConnectionCallback);
