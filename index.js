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
console.log(inputArr);

let queryDoneShow = (err, result) => {
  if (err) {
    console.log("QUERY ERROR:", err.message);
  } else {
    for (let i = 0; i < result.rows.length; i++) {
      let obj = result.rows;
      let displayText;
      if (obj[i].done === null) {
        displayText = `${obj[i].id}. [ ] - ${obj[i].item}`;
      } else {
        displayText = `${obj[i].id}. [${obj[i].done}] - ${obj[i].item}`;
      }
      console.log(displayText);
    }
  }
  client.end();
};

let clientConnectionCallBack = (err) => {
  if (err) {
    console.log("CONNECTION ERROR:", err.message);
  } else if (inputArr[2] === "show") {
    let queryText = "SELECT * from todolist";
    client.query(queryText, queryDoneShow);
  }
};

client.connect(clientConnectionCallBack);
