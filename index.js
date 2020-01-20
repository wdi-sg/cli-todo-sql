console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'hwee',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};



const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {

    if (err) {
      console.log("query error", err.message);
    }

    else {
        // console.log(result) - this is an array of objects
      for (let i = 0; i < result.rows.length; i++) {
      console.log(result.rows[i].id + ' [ ] - ' + result.rows[i].name);
      }
    }

    client.end();

};



let clientConnectionCallback = (err) => {

  if (err) {
    console.log( "error", err.message );
  }

    let actionWord = process.argv[2];
    let task = process.argv[3];

  if (actionWord === "add") {

    let queryString = "INSERT INTO items (name) VALUES ($1) RETURNING *";
    const values = [task];

    client.query(queryString, values, queryDoneCallback);

  }
};

client.connect(clientConnectionCallback);
