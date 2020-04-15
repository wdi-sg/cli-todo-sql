const pg = require('pg');

const configs = {
    user: 'elter',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

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
};

client.connect(clientConnectionCallback);*/

client.connect((err) => {
  if(err){
    console.log("Error connecting: ", err.message);
  }else {
    if(process.argv[2] === "add") {
      let task = "";
      let date = Date();
      for(let i=3; i<process.argv.length; i++){
        task = task + " " + process.argv[i];
      }
      let values = [task, '[ ]', date.toString(), '-'];
      let queryText = `INSERT INTO items (task, isdone, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *`;

      client.query(queryText, values, (err, res) =>{
        if(err){
          console.log("Error in query: ", err.message);
        }else {
          console.log(`ID ${res.rows[0].id} has been inserted, result: `, res.rows);
        }
      });
    }else if(process.argv[2] === "show"){
      let queryText = `SELECT * FROM items`;
      client.query(queryText, (err, res) => {
        if(err) {
          console.log("Error in query: ", err.message);
        }else {
          for(let i=0; i<res.rows.length; i++){
            let line = `${res.rows[i].id}. ${res.rows[i].isdone} - ${res.rows[i].task}, Created at: ${res.rows[i].created_at}, Updated at: ${res.rows[i].updated_at}`;
            console.log(line);
          }
        }
      });
    }else if(process.argv[2] === "done"){
      let date = Date().toString();
      let queryText = `UPDATE items SET isdone='[x]' WHERE id = ${process.argv[3]}`;
      let queryText2 = `UPDATE items SET updated_at='${date}' WHERE id = ${process.argv[3]} RETURNING *`;

      client.query(queryText, (err, res) => {
        if(err){
          console.log("Error in query: ", err.message);
        }else {
          client.query(queryText2, (err, res) => {
            if(err){
              console.log("Error in query: ", err.message);
            }else {
              console.log(`ID ${res.rows[0].id} has been updated! result: `, res.rows[0]);
            }
          });
        }
      });
    }else if(process.argv[2] === "delete"){
      let queryText = `DELETE from items WHERE id = ${process.argv[3]}`;

      client.query(queryText, (err, res) => {
        if(err){
          console.log("Error in query: ", err.message);
        }else {
          console.log("Delete action completed");
        }
      });
    }
  }
});