const pg = require('pg');

const configs = {
    user: 'safraz',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let text = "";
var values=[];

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};

let add = () => {
  text = `INSERT INTO items (name, complete) VALUES ($1, $2) RETURNING id`;
  values = [process.argv[3]," "];
}

let done = () => {
  text = `UPDATE items SET complete='X' WHERE id=$1`;
  values = [parseInt(process.argv[3])];
}

let show = () => {
  text = `SELECT * FROM items`
  values = [];
}

let whenConnect = () => {
  if (process.argv[2]=="add") {
    add();
  } else if (process.argv[2]=="done") {
    done();
  } else if (process.argv[2]=="show") {
    show();
  }
  client.query(text, values, queryDoneCallback);
};

client.connect(whenConnect);