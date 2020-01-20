const pg = require("pg");

const configs = {
  user: "benn",
  host: "127.0.0.1",
  database: "todo",
  port: 5432
};

const createTableText = `
CREATE TEMP TABLE dates(
  date_col DATE DEFAULT now(),
  timestamp_col TIMESTAMP DEFAULT now(),
  timestamptz_col TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
`;

const action = process.argv[2];
let todo = process.argv[3];

const client = new pg.Client(configs);

// let queryDoneCallback = (err, result) => {
//   if (err) {
//     console.log("query error", err.message);
//   } else {
//     console.log("result", result.rows);
//   }
//   client.end();
// };

let showTodos = (err, result) => {
  for (let i = 0; i < result.rows.length; i++) {
    let todo = result.rows[i];
    let done = todo.done;
    if (done === true) {
      console.log(`${todo.id}. [x] - ${todo.name} 
      Created at: ${todo.created_at},
      Updated at ${todo.updated_at}`);
    } else {
      console.log(`${todo.id}. [ ] - ${todo.name} 
      Created at: ${todo.created_at}
      Updated at ${todo.updated_at}`);
    }
  }
  client.end();
};

let addTodo = (err, result) => {
  const todoName = result.rows[0].name;
  console.log(`Added todo: ${todoName}`);
  client.end();
};

let doneTodo = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    console.log(`${result.rows[0].id}. [x] - ${result.rows[0].name} 
    Updated at ${result.rows[0].updated_at}`);
  }
  client.end();
};

let clientConnectionCallback = err => {
  if (err) {
    console.log("error", err.message);
  }

  if (action === "show") {
    text = "SELECT * from items order by id";
    client.query(text, showTodos);
  } else if (action === "add") {
    text = `INSERT INTO items (name) VALUES ('${todo}') RETURNING name`;
    client.query(text, addTodo);
  } else if (action === "done") {
    text = `UPDATE items 
    SET done = TRUE, updated_at = NOW()
    WHERE id = ${process.argv[3]} RETURNING *;`;
    client.query(text, doneTodo);
  }

  // const values = ["hello"];
};

client.connect(clientConnectionCallback);
