console.log("works!!", process.argv[2]);

const pg = require("pg");

const configs = {
  user: "postgres",
  password: "s9015675f",
  host: "127.0.0.1",
  database: "todo",
  port: 5432
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    //reorder database here?

    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i];
      let done;
      if (row.done === true) {
        done = "x";
      } else {
        done = " ";
      }
      console.log(row.id + ". [" + done + "] - " + row.name);
    }

    client.end();
  }
};

let clientConnectionCallback = err => {
  if (err) {
    console.log("error", err.message);
  }

  let text;
  let name = "nothing entered";
  let done = "f";
  let values = "";
  if (process.argv[2] === "post") {
    //add a database entry
    text = "INSERT INTO items (name, done) VALUES ($1, $2) RETURNING name";
    if (process.argv[3] === undefined) {
      console.log("missing 4th argument!");
      return;
    }
    name = process.argv[3];
    values = [name, done];
  } else if (process.argv[2] === "done") {
    if (process.argv[3] === undefined) {
      console.log("missing 4th argument!");
      return;
    }
    if (typeof parseInt(process.argv[3]) === NaN) {
      console.log("you need to enter in the id NUMBER");
      return;
    }
    let id = process.argv[3];
    text = "UPDATE items SET done='t' WHERE id = " + id.toString();
  } else if (process.argv[2] === "undone") {
    if (process.argv[3] === undefined) {
      console.log("missing 4th argument!");
      return;
    }
    if (typeof parseInt(process.argv[3]) === NaN) {
      console.log("you need to enter in the id NUMBER");
      return;
    }
    let id = process.argv[3];
    text = "UPDATE items SET done='f' WHERE id = " + id.toString();
  } else if (process.argv[2] === "delete") {
    if (process.argv[3] === undefined) {
      console.log("missing 4th argument!");
      return;
    }
    if (typeof parseInt(process.argv[3]) === NaN) {
      console.log("you need to enter in the id NUMBER");
      return;
    }
    let id = process.argv[3];
    text = "DELETE FROM items WHERE id=" + id;
  } else if (process.argv[2] === "display") {
    text = "SELECT * FROM items ORDER BY name ASC";
  } else {
    return;
  }

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);
