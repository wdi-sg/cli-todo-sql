console.log("works!!", process.argv[3]);

const todo = process.argv[3];

const pg = require("pg");

const configs = {
  user: "yannieyeung",
  host: "127.0.0.1",
  database: "todo",
  port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    console.log("result", result.rows);
  }
  client.end();
};

let clientConnectionCallback = (err) => {
  if (err) {
    console.log("error", err.message);
  }
  if (process.argv[2] === "add") {
    let text = "INSERT INTO items (name) VALUES ($1) RETURNING id";

    const values = [todo];

    client.query(text, values, queryDoneCallback);
  }

  if (process.argv[2] === "show") {
    console.log("showinggggg");
    let text = "SELECT * FROM items";
    client.query(text, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      } else {
        for (i = 0; i < res.rows.length; i++)
          console.log("Here is the to-dos: ", res.rows[i]);
      }
    });
  }
};

client.connect(clientConnectionCallback);
