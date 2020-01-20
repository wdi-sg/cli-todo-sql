console.log("works!!", process.argv[2]);
const pg = require('pg');
const configs = {
    user: 'joyce',
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
      if (process.argv[2] === "show"){
        let text1 = 'SELECT * FROM items';
        client.query(text1, (err, res) => {
            if (err) {
              console.log("query error", err.message);
            } else {
              // iterate through all of your results:
              for( let i=0; i<res.rows.length; i++ ){
                console.log("result: ", res.rows[i]);
              }
            }
        });
      }
      else (process.argv[2]==="add")
        let text2 = "INSERT INTO items (name) VALUES ($1) RETURNING *";
        const values = [process.argv[3]];
        client.query(text2, values, queryDoneCallback);
      };

client.connect(clientConnectionCallback);
