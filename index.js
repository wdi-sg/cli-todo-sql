console.log("works!!", process.argv[2], process.argv[3]);

const pg = require('pg');

const configs = {
    user: 'weepinsoh',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
// what the user types in becomes part of the SQL query
let userInput = process.argv[2];
let nameInput = process.argv[3];

const client = new pg.Client(configs);

let queryDone = (queryError, result) => {
    if (queryError) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
    // client.end();
};

let clientConnectionCallback = (connectionError) => {

  if( connectionError ){
    console.log( "error", err.message );
  }

  let queryText = 'INSERT INTO items (name) VALUES ($1) RETURNING *';
  const values = [nameInput];
if(userInput === "show"){
      const text = 'SELECT * FROM items';
    client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
          for( let i=0; i<res.rows.length; i++ ){
        console.log("result: ", res.rows[i]);
      }
    }
});
} else { client.query(queryText, values, (err, res) =>{
    if (err) {
        console.log("query error", err.message);
    } else {
         //console.log("id of the thing you just created:", res.rows[0].id);
        console.log("done");
        console.log(res);

    }
});
}
};

client.connect(clientConnectionCallback);
