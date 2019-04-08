let commandType = process.argv[2];
let activity = process.argv[3];

const pg = require('pg');

const configs = {
    user: 'claucanchin',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        client.query('SELECT * FROM students');

        console.log("result", result.rows);
    }
};

let clientConnectionCallback = (err) => {

    if (err) {
        console.log("error", err.message);
    }

    if (process.argv[2] === "add") {

        let queryText = "INSERT INTO todolist (name, donestatus) VALUES ($1, $2) RETURNING id";

        const values = [activity, "[ ]"];

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("id of the thing you just created:", res.rows[0].id);
            }
        })
    }

    if (process.argv[2] === "show") {

        let queryText = "SELECT * FROM todolist";

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                for (let i = 0; i < res.rows.length; i++) {
                    console.log("result: ", res.rows[i]);
                }
            }
        })
    }

}


client.connect(clientConnectionCallback);