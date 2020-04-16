 console.log("works!!", process.argv[2]);

const pg = require('pg');

const todo = process.argv[3]

const configs = {
    user: "marcustan",
    host: "127.0.0.1",
    database: "todo",
    port: 5432,
};

const client = new pg.Client(configs);

///////////////////////////////////////

let input= process.argv;

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
  } if (process.argv[2] === "add") {
    let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";
    const values = [todo]; 
    client.query(text, values, queryDoneCallback);
  }

  if (process.argv[2] === "show") {
    let text = "SELECT * FROM items";
    client.query(text, (err, res) => {
      for (i = 0; i < res.rows.length; i++)
      console.log(res.rows[i]);
  });
}
  

  // let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  // const values = ["hello"];

  // client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
