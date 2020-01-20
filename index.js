console.log("works!!", process.argv[2],process.argv[2] );

//configs
const pg = require('pg');
const configs = {
    user: 'AngelFerreros',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
//end of configs



//callbacks to take in argument and print into todo list
let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
      //NOTE: result.rows is an array of objects
      // console.log("result", result.rows[0].name );
    }
    client.end(); //disconnects client from DB Server
};

//function that runs once client is connected to server
let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }

    let command; //takes in diff commands based on user keyword
    let values; //the task input by user (must be enclosed in quotation marks,if string:add, number:done)

  switch(process.argv[2]) {
    case "show":
      command = `SELECT *  FROM items`;
      console.log(`showing all details from table`);
      client.query(command, queryDoneCallback);
    break;

    case "add":
      command = `INSERT INTO items (name) VALUES ($1) RETURNING *`;
         // query values must always be an error
      values = process.argv[3];
      let taskToPrint = [`[ ] - `+ values];
      console.log(taskToPrint);
      client.query(command, taskToPrint, queryDoneCallback);
      break;

    case "done":
    //select task with id accdg to user input
    let taskId = parseInt(process.argv[3]);
    let queryValue = [taskId];
    console.log(taskId);
        //add 'x' in Completed column
      command = `UPDATE items set Completed = 'x' WHERE id = ($1)`;
      client.query(command, queryValue, queryDoneCallback);
      break;

    default:
      console.log(`What would you like the table to do? - add task, show tasks or mark it as done?.`);
  } //switch statement closing


};
// closing for clientConnectionCallback

client.connect(clientConnectionCallback);
