console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'kokchuantan',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        console.log("result", result.rows);
    }
    client.end();
};

let clientConnectionCallback = (err) => {
    let command = process.argv[2];
    let userInput = process.argv[3];
    let notDone = ' [ ] ';
    let done = ' [X] '
    if (command === 'add') {
        if (err) {
            console.log("error", err.message);
        }

        let text = "INSERT INTO items (name,status) VALUES ($1,$2) RETURNING id";

        const values = [userInput,notDone];
        client.query(text, values, queryDoneCallback);
    }
    else if(command === 'done'){
      if (err) {
        console.log("error", err.message);
    }

    let text = "update items set status = $2 where id = $1 RETURNING id";
    id = parseInt(userInput);
    const values = [id,done];
    client.query(text, values, queryDoneCallback);
    }
};

client.connect(clientConnectionCallback);