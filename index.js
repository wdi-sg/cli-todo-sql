// console.log("works!!", process.argv[2]);

const pg = require('pg');
const moment = require('moment');

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
    let dateAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    let command = process.argv[2];
    let userInput = process.argv[3];
    let notDone = ' [ ] ';
    let done = ' [X] '
    if (command === 'add') {
        if (err) {
            console.log("error", err.message);
        }

        let text = "INSERT INTO items (name,status,created) VALUES ($1,$2,$3) RETURNING id";

        const values = [userInput, notDone, dateAt];
        client.query(text, values, queryDoneCallback);
    } else if (command === 'done') {
        if (err) {
            console.log("error", err.message);
        }

        let text = "update items set status = $2, completed = $3 where id = $1 RETURNING id";
       
        const values = [userInput, done,dateAt];
        client.query(text, values, queryDoneCallback);
    } else if (command === 'archive') {
        if (err) {
            console.log("error", err.message);
        }

        let text = "delete from items where id = $1 RETURNING id";

        const values = [userInput];
        client.query(text, values, queryDoneCallback);
    } else if (command === 'show') {
        if (err) {
            console.log("error", err.message);
        }

        let text = "select * from items";

        client.query(text, queryDoneCallback);
    }
};

client.connect(clientConnectionCallback);