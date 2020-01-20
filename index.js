console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'eunicelok',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let commandType = process.argv[2];
let toDoItem = process.argv[3];
let parseItem = parseInt(toDoItem);

const listItem = () => {
    // console.log("not here");
    let listText = 'SELECT * FROM items ORDER BY id';
    client.query(listText, (err, result) => {
        // console.log("after line 21");
        if (err) {
            console.log("Error!");
            client.end();
        };
        for (const item of result.rows)
            console.log(item.id + ". [] - " + item.name);
    })
};

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
      listItem();
    }
    // console.log("vaaaaaa");
};

let clientConnectionCallback = (err) => {
    if( err ){
    console.log( "error", err.message );
    }
  // let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  // const values = ["hello"];
    if (commandType === "add") {
        let text = 'INSERT INTO items (name) VALUES ($1) RETURNING *';
        const values = [toDoItem];
        client.query(text, values, queryDoneCallback);
    } else if (commandType === "show") {
            listItem();
    } else {
        console.log("Not a valid command!");
    }
};


client.connect(clientConnectionCallback);