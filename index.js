const commandType = process.argv[2];
const input = process.argv[3];

const pg = require('pg');

const configs = {
    user: 'claucanchin',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

// let queryDoneCallback = (err, result) => {
//     if (err) {
//         console.log("query error", err.message);
//     } else {
//         client.query('SELECT * FROM students');

//         console.log("result", result.rows);
//     }
// };

let clientConnectionCallback = (err) => {

        if (err) {
            console.log("error", err.message);
        }

        if (commandType === "add") {

            let queryText = "INSERT INTO todolist (name, donestatus) VALUES ($1, $2) RETURNING id, name";

            const values = [input, false];

            client.query(queryText, values, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log(res.rows[0].id + ". [ ] - " + res.rows[0].name);
                }
            })
        }

        if (commandType === "show") {

            let queryText = "SELECT * FROM todolist";

            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    for (let i = 0; i < res.rows.length; i++) {
                        if (res.rows[i].donestatus == false) {
                            console.log(res.rows[i].id + ". " + "[ ]" + " - " + res.rows[i].name)
                        } else {
                            console.log(res.rows[i].id + ". " + "[X]" + " - " + res.rows[i].name)
                        }
                    }
                }
            })
        }

        // if (commandType === "done" && typeof(input) === 'number') {

        //     let queryText = "UPDATE todolist SET donestatus=$1 WHERE id=$2";

        //     const values = [true, input];

        //     client.query(queryText, values, (err, res) => {
        //         if (err) {
        //             console.log("query error", err.message);
        //         } else {
        //             console.log("Marked done!");
        //         }
        //     })
        // }

}
        client.connect(clientConnectionCallback);