console.log("works!!", process.argv[2]);

const pg = require("pg");

const configs = {
  user: "benn",
  host: "127.0.0.1",
  database: "todo",
  port: 5432
};

const action = process.argv[2];

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    console.log("result", result.rows);
  }
  client.end();
};

let clientConnectionCallback = err => {
  if (err) {
    console.log("error", err.message);
  }

  if (action === "show") {
    text = "SELECT * from items";
    client.query(text, queryDoneCallback);
  } else if (action === "add") {
    let todo = "[]" + process.argv[3];
    text = `INSERT INTO items (name) VALUES ('${todo}') RETURNING id`;
    client.query(text, queryDoneCallback);
  }

  // const values = ["hello"];

};

client.connect(clientConnectionCallback);
