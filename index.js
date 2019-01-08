let command = process.argv[2];
// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'Sheryl',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

// client.connect((err) => {

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      for( let i=0; i<result.rows.length; i++ ){
        if (result.rows[i].done === true) {
        console.log(result.rows[i].id + ". " + "[X] - " + result.rows[i].name);
      }
      else {
        console.log(result.rows[i].id + ". " + "[ ] - " + result.rows[i].name);
      }
    }
    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let text = "SELECT * FROM items ORDER BY id ASC";
  client.query(text, queryDoneCallback);
  // const values = ["Hello"];

  if (command === "show") {
    client.query(queryDoneCallback);
  }

  else if (command === "add") {
    text = "INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id";
    const values = [process.argv[3], false];
    client.query(text, values, queryDoneCallback);
  }

  else if (command === "done") {
    let num = process.argv[3];
    text = `UPDATE items SET done = true WHERE id=${num}`;
    client.query(text, queryDoneCallback);
  }

  else if (command === "delete") {
    let num = process.argv[3];
    text = `DELETE from items WHERE id = ${num}`;
    client.query(text, queryDoneCallback);
  }


  // let restart = (err) => {
  //   text = `ALTER SEQUENCE items_id_seq RESTART`;
  //   client.query(text, updateId);
  // }

  // let updateId = (err) => {
  //   text = `UPDATE items SET id=default`;
  //   client.query(updateId, queryDoneCallback);
  // }

};

client.connect(clientConnectionCallback);