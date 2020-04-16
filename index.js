

const pg = require('pg');

const configs = {
    user: 'Vignesh',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      //console.log(result);
      //console.log("result", result.rows );
      result.rows.map( (row) => {
        console.log(row.id + row.checkbox + row.task);
      });
    }
    client.end();
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  let commandType = process.argv[2];
  let taskInput = process.argv[3];
  let queryText = "";
  let values = [];

    if ( commandType === "add"){
        values = [". [ ] - ", taskInput];
        queryText = "INSERT INTO items (CheckBox, task) VALUES ($1,$2) RETURNING *";
    }if ( commandType === "show"){
        queryText = "SELECT * FROM items;"
    }

    client.query(queryText, values, queryDoneCallback);


};

client.connect(clientConnectionCallback);
