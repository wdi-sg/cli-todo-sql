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
let timeDiff = false;

function convertTime(timeInMS) {
  let timeInS = timeInMS / 1000;
  let hours = Math.floor(timeInS / 3600);
  let minutes = Math.floor(timeInS / 60) % 60;
  let seconds  = timeInS % 60;
  return `${hours}h : ${minutes}m : ${seconds}s`;
}

let queryDoneShowAll = (err, result) => {
  if (err) {
    console.log("QUERY ERROR:", err.message);
  } else {
    for (let i = 0; i < result.rows.length; i++) {
      let list = result.rows;
      let displayText;
      if (list[i].done === null) {
        displayText = `${list[i].id}. [ ] - ${list[i].item} - CREATED AT: ${list[i].created_at}`;
      } else {
        let diff = list[i].updated_at - list[i].created_at;
        let timeDiff = convertTime(parseInt(diff));
        displayText = `${list[i].id}. [${list[i].done}] - ${list[i].item} - CREATED AT: ${list[i].created_at} - UPDATED AT: ${list[i].updated_at} - COMPLETE TIME: ${timeDiff}`;
        let queryText = `UPDATE todolist SET complete_time='${timeDiff}' WHERE id='${list[i].id}'`;
        client.query(queryText, queryDoneDoNth);
      }
      console.log(displayText);
    }
  }
  // client.end();
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
    let now = new Date().toUTCString();
    let queryText = `UPDATE todolist SET done='X', updated_at='${now}' WHERE id='${inputArr[3]}'`;
    client.query(queryText, queryDoneDoNth);
    queryText = "SELECT * from todolist ORDER BY id ASC";
    client.query(queryText, queryDoneShowAll);
  }
};

client.connect(clientConnectionCallBack);
