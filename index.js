// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'hwee',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

let checked = '[X]';
let unchecked = '[ ]';

const client = new pg.Client(configs);



let queryDoneCallbackForUnchecked = (err, result) => {

        if (err) {
            console.log("query error", err.message);
        }

        else {
            // console.log(result) - this is an array of objects
            for (let i = 0; i < result.rows.length; i++) {
                console.log(result.rows[i].id + '.' + unchecked + ' - ' + result.rows[i].name);
            }
        }

            client.end();
        };



let queryDoneCallbackForChecked = (err, result) => {

        if (err) {
            console.log("query error", err.message);
        }

        else {

                for (let i = 0; i < result.rows.length; i++) {
                    result.rows[i].status = true;
                    task = result.rows[i].id;
                    console.log(result.rows[i].id + '.' + checked + ' - ' + result.rows[i].name);
                }
            }

            client.end();
        };



        let clientConnectionCallback = (err, resultOne, resultTwo) => {

            if (err) {
                console.log("error", err.message);
            }

            let thirdWord = process.argv[2];
            let forthWord = process.argv[3];

            if (thirdWord === "add") {
                let queryString = "INSERT INTO items (name) VALUES ($1) RETURNING *";
                const values = [forthWord];

                client.query(queryString, values, queryDoneCallbackForUnchecked);
            }

            if (thirdWord === "done") {
                let queryString = "UPDATE items SET (status) VALUES ($1) AND WHERE (id) VALUES ($2) RETURNING *";
                const valueStatus = [true];
                const valueId = forthWord;

                client.query(queryString, valueStatus, valueId, queryDoneCallbackForChecked);
            }
        };


        client.connect(clientConnectionCallback);