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
    }
  }
});