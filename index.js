const pg = require("pg");

const configs = {
  user: "postgres",
  host: "127.0.0.1",
  database: "todo",
  port: 5432,
};

const client = new pg.Client(configs);

//------------------------------
//------------------------------

let inputArr = process.argv;
// console.log(inputArr);

let queryDoneShowAll = (err, result) => {
  if (err) {
    console.log("QUERY ERROR:", err.message);
  } else {
    for (let i = 0; i < result.rows.length; i++) {
      let list = result.rows;
      let displayText;
      if (list[i].done === null) {
        displayText = `${list[i].id}. [ ] - ${list[i].item} - ${list[i].created_at}`;
      } else {
        displayText = `${list[i].id}. [${list[i].done}] - ${list[i].item} - ${list[i].created_at}`;
      }
      console.log(displayText);
    }
  }
  client.end();
};

let queryDoneDoNth = (err, result) => {
  if (err) {
    console.log("QUERY ERROR:", err.message);
  }
};

let clientConnectionCallBack = (err) => {
  if (err) {
    console.log("CONNECTION ERROR:", err.message);
  } else if (inputArr[2] === "show") {
    let queryText = "SELECT * from todolist ORDER BY id ASC";
    client.query(queryText, queryDoneShowAll);

  } else if (inputArr[2] === "add") {
    let now = new Date().toUTCString();
    let queryText = `INSERT INTO todolist (item, created_at) VALUES ('${inputArr[3]}', '${now}')`;
    client.query(queryText, queryDoneDoNth);
    queryText = "SELECT * from todolist ORDER BY id ASC";
    client.query(queryText, queryDoneShowAll);

  } else if (inputArr[2] === "done") {
    let queryText = `UPDATE todolist SET done='X' WHERE id='${inputArr[3]}'`;
    client.query(queryText, queryDoneDoNth);
    queryText = "SELECT * from todolist ORDER BY id ASC";
    client.query(queryText, queryDoneShowAll);
  }
};

client.connect(clientConnectionCallBack);
