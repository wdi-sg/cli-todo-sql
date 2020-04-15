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
    let queryText = 'SELECT * FROM items ORDER BY id ASC';

    client.query(queryText, (err, res) => {
      //console.log(res);
      console.log(queryText);
      if (err) {
        console.log("query error", err.message);
      } else {
        // iterate through all of your results:
        for (let i = 0; i < res.rows.length; i++) {
          if (res.rows[i].completed == null) {
            console.log((i + 1) + ". [ ] - " + res.rows[i].name);
          } else if (res.rows[i].completed == 'yes') {
            console.log((i + 1) + ". [x] - " + res.rows[i].name);
          }
        }
      }
    });
  }

  if (querySelector == 'add') {
    let item = process.argv[3];
    let queryText = "INSERT INTO items (name) VALUES ('" + item + "')";
    console.log(queryText);

    client.query(queryText, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      } else {
        console.log("Item added on todo list: ", item);
      }
    });

  }

  if (querySelector == 'done') {
    let item = process.argv[3];
    if (item == '') {
      console.log("No input detected!");
      client.end();
    }
    let queryText = "SELECT * FROM items ORDER BY id ASC";
    let markItem = item - 1;

    client.query(queryText, (err, res) => {
      // console.log(res.rows[markItem].name);
      if (err) {
        console.log("query error", err.message);
      } else {
        for (let i = 0; i < res.rows.length; i++) {
          if (i != markItem && res.rows[i].completed == null) {
            console.log((i + 1) + ". [ ] - " + res.rows[i].name);
          } else if (i != markItem && res.rows[i].completed != null) {
            console.log((i + 1) + ". [x] - " + res.rows[i].name);
          } else if (i == markItem) {
            console.log((i + 1) + ". [x] - " + res.rows[i].name);
            queryText = "UPDATE items SET completed='yes' WHERE name = '" + res.rows[i].name + "'";
            client.query(queryText, (err, res) => {
              console.log(queryText);
              if (err) {
                console.log("query error", err.message);
              }
            });
          }
        }
      }
    });
  }
})

