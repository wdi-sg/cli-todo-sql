console.log("works!!", process.argv[2]);
const pg = require('pg');

const configs = {
    user: 'joycepaul',
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

  let text = "INSERT INTO items (name) VALUES ($1) RETURNING *";

  const values = [process.argv[3]];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);























/*else if (process.argv[2] === "add") {
    let index = process.argv[3];
    action = "added, "
    queryInsert = `SELECT * from todo where id = ${1}`;
}*/ /*else if (process.argv[2] === "update") {
   let index = process.argv[3];
    let name = process.argv[4];
    queryInsert = `UPDATE id set name='${name}' WHERE id=${index}`
} else if (process.argv[2] === "delete") {
    let index = process.argv[3];
    action = "deleted, ";
    queryInsert = `DELETE from todo WHERE id=${index}`
}*/




/*let queryDoneCallback = (err, result) => {
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

  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};*/


/*client.connect(clientConnectionCallback);*/