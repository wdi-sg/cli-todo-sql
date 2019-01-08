console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432
};

const client = new pg.Client(configs);
const reqAction = process.argv[2];
const reqItem = process.argv[3];
var text;
var values;
var results;


if (reqAction === "show" || reqAction === undefined) {
    text = "SELECT * FROM todo";
    values = null;
    results = "This is the full list";
} else

if (reqAction === "add") {
    text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";
    values = [reqitem];
    results = "Item successfully added";
}
else if (reqAction === "done") {
    text = `UPDATE todo SET done = TRUE, updated_at = now() WHERE id = ${reqItem}`;
    values = null;
    results = "Item successfully marked as completed";
} else if (reqAction === "delete") {
    text = `DELETE FROM todo WHERE id = ${reqItem}`;
    values = null;
    results = "Item successfully completed";
} else {
    text = null;
    values = null;
    results = "Please indicate show, add, done or delete actions";
}


let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log(results, result.rows );
    }
};

let clientConnectionCallback = (err) => {
  if( err ){
    console.log( "error", err.message );
  }
  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
