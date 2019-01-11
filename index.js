const pg = require("pg");

const configs = {
  user: "lydiacheung",
  host: "127.0.0.1",
  database: "todo",
  port: 5432
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    console.log("result", result.rows);
  }
};

let clientConnectionCallback = err => {
  if (err) {
    console.log("error", err.message);
  }

  const task = [process.argv[2]];
  console.log("task is " + task);
  switch (String(task)) {
    case "add":
      console.log("doing add");
      client.query(
        "INSERT INTO tasks (task_status,tasks_to_do,created_date) VALUES ('pending', $1, now()) RETURNING id",
        [process.argv[3]]
      );
      break;
    case "done":
      client.query("update tasks set task_status = 'done' where id = $1", [
        process.argv[3]
      ]);
      break;
    case "delete":
      client.query("delete from tasks where id = $1", [process.argv[3]]);
      break;
    default:
      client.query("select * from tasks order by id asc", (err, result) => {
        for (var i = 0; i < result.rowCount; i++) {
          console.log(
            i +
              1 +
              ". [ " +
              (result.rows[i].task_status == "pending" ? "" : "x") +
              " ] - " +
              result.rows[i].tasks_to_do +
              " - " +
              result.rows[i].created_date
          );
        }
      });
      break;
  }
};

client.connect(clientConnectionCallback);
