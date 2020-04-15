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

  const actToDo = process.argv[2];

  if (actToDo === "show") {
    //to show all the list
    let showItems = "SELECT * FROM items";
    client.query(showItems, queryDoneCallback);

  } else if (actToDo === "add") {
    //to add item to the list
    const notDone = '[ ]';
    const taskDescription = process.argv[3];

    let addItems = "INSERT INTO items (status, task) VALUES ($1, $2) RETURNING id";
    const values = [notDone, taskDescription];

    client.query(addItems, values, queryDoneCallback);
  }


  // let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  // const values = ["hello"];

};

client.connect(clientConnectionCallback);
