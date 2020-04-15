console.log("Running Cli-Todo-SQL");
console.log("Query Selector: ", process.argv[2]);

const pg = require('pg');

const configs = {
  user: 'yusofgotboudine',
  host: '127.0.0.1',
  database: 'todo',
  port: 5432,
};

const client = new pg.Client(configs);

let querySelector = process.argv[2];

client.connect((err) => {

  if (err) {
    console.log("error", err.message);
  }

  if (querySelector == 'show') {
    let queryText = 'SELECT * FROM items';

    client.query(queryText, (err, res) => {
      // console.log(res);
      console.log(queryText);
      if (err) {
        console.log("query error", err.message);
      } else {
        // iterate through all of your results:
        for (let i = 0; i < res.rows.length; i++) {
          console.log((i + 1) + ". [ ] - " + res.rows[i].name);
        }
      }
    });
  }

  if (querySelector == 'add') {
    let item = process.argv[3];
    let queryText = "INSERT INTO items (name) VALUES ('" + item + "')";
    console.log(queryText);

    client.query(queryText, (err, res) => {
      // console.log(res);
      if (err) {
        console.log("query error", err.message);
      } else {
        console.log("Item added on todo list: ", item);
      }
    });

  }

});

