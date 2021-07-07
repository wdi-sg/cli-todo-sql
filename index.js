let option = process.argv[2];
let task = [process.argv[3]];

const resetText = `ALTER SEQUENCE items_id_seq RESTART WITH 1`;
const updateText = `UPDATE items SET id=default`;
var text;

const pg = require('pg');

const configs = {
    user: 'Serene',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryResetId = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else { 
       client.query(resetText, queryUpdatedId);
    }
    client.end();
};

let queryUpdatedId = (err, result) => {
  if (err) {
      console.log("query error 2", err.message);
  } else {
      client.query(updateText, queryDoneCallback);
  }
};

let queryDoneCallback= (err, result) => {
  if (err) {
      console.log("query error", err.message);
  } else {
      console.log("result", result.rows);
      result.rows.forEach((num, index) => {
        if (num.done === "x"){
          console.log(`${index+1}. [${num}] ${num.name}`);
        }
        else {
          console.log(`${index+1}. [ ] ${num.name}`);
        }
      })
  }
};


let clientConnectionCallback = (err) => {
    if (err) {
        console.log("error", err.message);
    }

    switch (option) {
        case "show":
            text = "SELECT * FROM items ORDER BY (id) ASC";
            client.query(text, queryDoneCallback);
            break;

        case "add":
            text = "INSERT INTO items (name) VALUES ($1) RETURNING *";
            client.query(text, task, queryDoneCallback);
            break;

        case "done":
            // text = `UPDATE items SET done='x', updated_at=now() WHERE id=${task}`;
            // client.query(text, queryResetId);
            text = `ALTER TABLE items ALTER COLUMN ${task}`;
            break;

        case "delete":
            break;

        default:
            console.log("Invalid input. Please try again.");
    }
}

client.connect(clientConnectionCallback);

